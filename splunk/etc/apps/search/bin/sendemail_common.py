
import http.client
import re
import socket
import logging


import splunk.entity as entity
import splunk.mining.dcutils as dcu
import splunk.rest as rest
import splunk.secure_smtplib as secure_smtplib
import splunk.ssl_context as ssl_context

from email.mime.multipart import MIMEMultipart
from smtplib import SMTPNotSupportedError, SMTPSenderRefused
from splunk.util import normalizeBoolean, unicode, format_local_tzoffset

EMAIL_FORMAT = re.compile(r'^[^\s@]+@[^\s@,;]+$')
EMAIL_DELIM = re.compile(r'\s*[,;]\s*') # uses `,` or `;` capture group

# Some refactoring to get the exception handling for sendmail with UTF8 option
# centralized and also to get ability to unit test. This file should eventually move
# to py/splunk library as we move out additional duplicate work from sendemail.py and
# sendemail_handler.py into this file for better encapsulation, and maintenance.

from smtplib import SMTPNotSupportedError, SMTPSenderRefused
from sys import getsizeof
import time

#########################################################################
# Send email with utf8 option.
#
# Returns error if SMTP server returned any of the following exceptions:
# 1. SMTPNotSupportedError
#      SMTP server does not support utf8.
# 2. SMTPSenderRefused with 502 error code
#     SMTP server returned command not implemented.
#
# Returns None if neither of above two errors found
#########################################################################
def sendEmailWithUTF8(smtp, sender, recipients, message):
    error = None
    try:
        # mail_options SMTPUTF8 allows UTF8 message serialization
        smtp.sendmail(sender, recipients, message, mail_options=["SMTPUTF8"])
    except SMTPNotSupportedError as smtpNotSupportedEx:
        # sendmail failed with SMTPUTP8 option as not supported
        error =  smtpNotSupportedEx
    except SMTPSenderRefused as smtpSenderRefusedEx:
        # sendmail failed with SMTPUTP8 option as sender refused
        if (smtpSenderRefusedEx.smtp_code == 502):
            error =  smtpSenderRefusedEx

    return error

def renderTime(results):
   for result in results:
      if "_time" in result:
         try:
              result["_time"] = time.ctime(float(result["_time"]))
         except:
              pass

def get_approx_nested_sizeof(obj):
    total = 0
    if isinstance(obj, dict):
        for k, v in obj.items():
            total += get_approx_nested_sizeof(k) + get_approx_nested_sizeof(v)
    elif isinstance(obj, list) or isinstance(obj, set):
        for elem in obj:
            total += get_approx_nested_sizeof(elem)
    # standard case
    total += getsizeof(obj)
    return total

defaultLogger = dcu.getLogger()

class EmailLimits:
    '''
    Class that represents email limits
    '''
    @classmethod
    def getLimits(cls, sessionKey, logger):
        '''
        Retrieves email limits as configured on the stack

        @param sessionKey: required. splunk session key
        @type sessionKey: str

        @param logger: logger object
        @type: logger: logging.Logger

        @returns: email limits, boolean validation, boolean limits
        @rtype: tuple(entity.Entity, Boolean, Boolean)

        @raises: None
        '''
        limits = None
        try:
            limits = entity.getEntity('/configs/conf-limits', 'email', sessionKey=sessionKey)
        except Exception as e:
            logger.debug('could not access or parse email stanza in limits.conf. Error=%s. Using default=%s' % (str(e), limits))
        logger.debug('limits for email %s' % str(limits))

        if not limits:
            return None, False, False

        isSCEmailValidationEnabled = True if limits.get('validation') else False
        isSCLimitsEnabled = normalizeBoolean(limits.get('enforce_limits', 'False'))

        return limits, isSCEmailValidationEnabled, isSCLimitsEnabled


class SplunkEmailMessage:
    '''
    Represents an email message originating from Splunk
    '''
    def __init__(self,
                 sessionKey,
                 email,
                 allowedDomains,
                 loggingCtx,
                 emailSettings,
                 cLogger=None):
        '''
        initialize a Splunk Email Message

        @param sessionKey: splunk session key
        @type sessionKey: str

        @param email: email message
        @type email: MIMEMultipart

        @param allowedDomains: allow list of domains expclitly configured
            by admins. to be applied as policy enforcement on any outbound email
        @type allowedDomains: list(str)

        @param loggingCtx: context to additionally log
        @type loggingCtx: str

        @param emailSettings: email settings in the conf system
        @type emailSettings: dict

        @param cLogger: client logger
        @type cLogger: logging.Logger

        @return: None
        @raises ValueError
        '''
        if not sessionKey:
            raise ValueError('Invalid session key')
        self.sessionKey = sessionKey

        if not email:
            raise ValueError('Invalid email object')
        self.email = email

        self.emailSettings = emailSettings

        if cLogger:
            self.logger = cLogger
        else:
            self.logger = defaultLogger

        self.logCtx = '%s. Validation=%s enforceLimits=%s maxRecipients=%s' % (
            loggingCtx, self.emailSettings.get('validation'),
            self.emailSettings.get('enforce_limits'),
            self.emailSettings.get('max_recipients'))

        self.sender             = SplunkEmailMessage._makeValidSenderEmail(self.email.get('From', ''))
        self.inputRecipientsBcc = []
        self.inputRecipientsCc  = []
        self.inputRecipientsTo  = []
        self._normalizeAllRecipients() # populate To, Cc, Bcc inputRecipients

        # ensure at least one To, Cc, or Bcc
        if all([not self.inputRecipientsTo,
                not self.inputRecipientsCc, not self.inputRecipientsBcc]):
            e = 'Need at least one of To, Cc, or Bcc fields'
            raise ValueError(e)

        if allowedDomains != "" and allowedDomains is not None:
            domains = []
            domains.extend(EMAIL_DELIM.split(allowedDomains))
            domains = [d.strip().lower() for d in domains]
            self.allowedRecipientDomains = list(set(domains))
        else:
            self.allowedRecipientDomains = None

        self.recipientFilteredOnDomain  = False # boolean to track if any recipient was filtered on domain

        # categorize recipients as valid or invalid
        self._validRecipientsTo         = set()
        self._validRecipientsCc         = set()
        self._validRecipientsBcc        = set()
        self.validRecipients            = set()
        self.invalidRecipients          = set()
        self._categorizeRecipients()

        if len(self._validRecipientsTo) == 0: # drop email since the To email field is empty
            e = 'To field must have at least one valid recipient. Dropping email message. %s' % (self.logCtx)
            raise ValueError(e)

        # enforce strict validation if applicable
        # drop email message if there are any invalid recipients
        if self.emailSettings.get('validation', 'basic').strip().lower() == 'strict' and self.invalidRecipients:
            e = 'Strict client side email validation enabled. Found invalid recipients=%s. Dropping email message. %s' % (
                self.invalidRecipients, self.logCtx)
            self.logger.error(e)
            raise ValueError(e)

        self._updateRecipientHeaders()

        self.logger.debug('=== Initialized email message. To=%s, Cc=%s, Bcc=%s.  %s === '
            % (self._validRecipientsTo, self._validRecipientsCc, self._validRecipientsBcc, self.logCtx))

    def _categorizeRecipients(self):
        '''
        categorize recipients as valid or invalid, amongst To, Cc, and Bcc
        '''
        # Build valid and invalid recipient lists out of To, CC and BCC lists
        self._validRecipientsTo = self._buildValidRecipients(self.inputRecipientsTo)
        self._validRecipientsCc = self._buildValidRecipients(self.inputRecipientsCc)
        self._validRecipientsBcc = self._buildValidRecipients(self.inputRecipientsBcc)

    def _updateRecipientHeaders(self):
        '''
        update any relevant SMTP headers with recipients
        '''
        try:
            # handle 'To'
            strippedRecipients = ','.join([str(elem) for elem in self._validRecipientsTo])
            self.email.replace_header('To', strippedRecipients) if self._validRecipientsTo else self.email.replace_header('To', "")
        except KeyError:
            pass # validation is expected to happen outside. ignore any missing fields

        try:
            # handle 'Cc'
            strippedRecipients = ','.join([str(elem) for elem in self._validRecipientsCc])
            self.email.replace_header('Cc', strippedRecipients) if self._validRecipientsCc else self.email.replace_header('Cc', "")
        except KeyError:
            pass # validation is expected to happen outside. ignore any missing fields

        try:
            # handle 'Bcc'
            del self.email['Bcc']
        except KeyError:
            pass # validation is expected to happen outside. ignore any missing fields

    def _buildValidRecipients(self, input):
        '''
        Build and return unique valid recipients from given input
        @param input: input recipient list
        @type input: set

        @returns set
        @raises None
        '''
        output = set()
        for e in input:
            if self.isEmailAddressCompliant(e):
                self.validRecipients.add(e)
                self.logger.debug('Recipient %s is valid. %s' % (e, self.logCtx))
                if e:
                    self._ensureEmailAddressInAllowedDomains(e)
            else:
                if e:
                    self.invalidRecipients.add(e)
                    self.logger.warning('Invalid email recipient=%s, remove recipient=%s from recipients.'
                                % (e, e)) # preserving to reflect existing behavior
            if e in self.validRecipients:
                output.add(e)
        self.logger.debug('Invalid recipients=%s . %s' % (self.invalidRecipients, self.logCtx))
        return output

    @classmethod
    def _makeValidSenderEmail(cls, email):
        '''
        make a valid sender email for use in email dispatch

        @param email: suggested sender email
        @type: str

        @raises Exception

        @return a valid sender email
        @rtype str
        '''
        sender = email
        if '@' not in email:
            sender = email + '@' + socket.gethostname()
            if sender.endswith("@"):
              sender = sender + 'localhost'
        if sender is None:
            m = 'Unable to make valid sender email address. Email = %s. Sender = %s' % (email, sender)
            raise Exception('Unable to make valid sender email address. Email = %s. Sender = %s' % (email, sender))
        return sender

    @classmethod
    def isEmailAddressCompliant(cls, emailAddress):
        '''
        Validate email addresses using the guidelines specified by rfc5322
        Regex only checks the syntax of the email address but does not guarantee the deliverability of the given email address
        The format is defined in the rfc5322 section 3.2.3 - 3.4.1 - https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.3
        Regex referenced from - https://uibakery.io/regex-library/email-regex-python

        @param emailAddress: email address to work with
        @type emailAddress: str

        @raises None

        @return: true if compliant. false if otherwise
        @rtype: bool
        '''
        # TODO multi-line string
        rfc5322pattern = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"
        return re.match(rfc5322pattern, emailAddress)

    def _ensureEmailAddressInAllowedDomains(self, emailAddress):
        '''
        ensure that email address domain is in any configured allowedRecipientDomains list by user

        @param emailAddress: email address to ensure
        @type emailAddress: str

        @raises None
        @return None
        '''
        if not self.allowedRecipientDomains: # no configured domains. all domains allowed
            self.logger.debug('No configured allowed recipient domains found. Recipient=%s is valid' % emailAddress)
            return
        # at least one configured allowed domain

        dom = emailAddress.strip().lower().partition('@')[2] # assume email address is validated before invocation. it has `@`
        self.logger.debug('Configured allowed recipient domains=%s. recipient domain=%s' % (str(self.allowedRecipientDomains), dom))

        if dom not in self.allowedRecipientDomains: # email domain must be in configured domain list
            if emailAddress in self.validRecipients:
                self.validRecipients.remove(emailAddress)
            self.invalidRecipients.add(emailAddress)
            self.recipientFilteredOnDomain = True # we never want to reset to False
            self.logger.debug('Removing recipient=%s. Recipient domain is missing from configured allowedDomainList=%s. %s'
                % (emailAddress, str(self.allowedRecipientDomains), self.logCtx))
        else:
            self.logger.debug('Valid recipient=%s. allowed recipient domains=%s. %s' % (emailAddress, dom, str(self.allowedRecipientDomains)))
        return

    def _normalizeAllRecipients(self):
        '''
        normalize recipients in email message to desired format.
        inclusive of To, Cc, and Bcc recipients in email
        '''
        self.inputRecipientsTo  = self._normalizeRecipientsToList('To') if 'To' in self.email else []
        self.inputRecipientsCc  = self._normalizeRecipientsToList('Cc') if 'Cc' in self.email else []
        self.inputRecipientsBcc = self._normalizeRecipientsToList('Bcc') if 'Bcc' in self.email else []


    def _normalizeRecipientsToList(self, field):
        '''
        Field can be one of To, Cc, or Bcc
        splits str of email addresses separated by a delimiter.
        adds recipients to both a recipient list, and email header.
        Bcc field should only be present in the recipient list but not in the email header

        @param field: one of 'To', 'Cc' or 'Bcc'
        @type field: str

        @return: normalized recipients list for given field
        @rtype: list(str)
        '''
        recipients = []

        if not field or field not in ('To', 'Cc', 'Bcc'):
            self.logger.debug('Unable to normalize recipient email(s). Invalid field=%s in email message. %s' % (str(field), self.logCtx))
            return recipients

        # given string, obtain a list.
        # strip leading/trailing LWS before split
        tmpRecipients = EMAIL_DELIM.split(self.email[field].strip())
        self.logger.debug('temp recipient list=%s. %s' % (','.join(tmpRecipients), self.logCtx))

        for r in tmpRecipients:
            if r:
                recipients.append(r)
            else:
                self.logger.debug('Invalid recipient. %s', self.logCtx)
        self.logger.debug('Normalized Recipient list = %s. %s' % (recipients, self.logCtx))
        return recipients

    @classmethod
    def enforceLimits(cls, recipientsList, emailSettings, myLogger, logCtx):
        '''
        enforce limits and notify via where applicable

        @param recipientsList: valid recipients list
        @type recipientsList: list(str)

        @param emailSettings: email settings in the conf system
        @type emailSettings: entity.Entity

        @param myLogger: client logger
        @type myLogger: logging.Logger

        @param logCtx: context to log
        @type logCtx: str

        @raise Exception
        @return None
        '''
        limitMaxRecipientsCount = int(emailSettings.get('max_recipients', -1))
        validRecipientsCount = len(recipientsList)
        if limitMaxRecipientsCount != -1 and validRecipientsCount > limitMaxRecipientsCount :
            myLogger.debug('''Enforcing limits. Dropping email. validRecipientCount=%s exceeds \
            configured maxRecipientsCount=%s in limits.conf. %s''' % (
                validRecipientsCount,
                limitMaxRecipientsCount, logCtx))
            m =  '%d exceeds max recipient count limit of %d' % (validRecipientsCount, limitMaxRecipientsCount)
            raise Exception(m)
        else:
            myLogger.debug('Will not enforce limits. validRecipientsCount=%s, limit=%s, %s' % (
                validRecipientsCount, limitMaxRecipientsCount, logCtx))

        return

    def send(self, useTLS, useSSL, sslConfigAsJSON, username, password, mailserver):
        '''
        attempt to send the email message

        @param useTLS: whether or not to use TLS
        @type useTLS: bool

        @param useSSL: whether or not to use SSL
        @type useSSL: bool

        @param sslConfigAsJSON: SSL config for openssl
        @type sslConfigAsJSON: dict

        @param username: any configured username for SMTP login
        @type username: str

        @param password: any configured password for SMTP login with username
        @type password: str

        @param mailserver: configured mailserver
        @type mailserver: str

        @raises Exception
        @return None
        '''

        mailserver = 'localhost' if not mailserver else mailserver.strip()

        logCtx = ('%s. Send configuration — s useTLS=%s, useSSL=%s,'\
                  ', username=%s, mailserver=%s') % (
            self.logCtx, str(useTLS), str(useSSL), username, mailserver)

        SplunkEmailMessage.enforceLimits(self.validRecipients, self.emailSettings, self.logger, logCtx)

        # if there is a configured set of allowed domains and no valid recipients, raise exception
        if self.allowedRecipientDomains and not self.validRecipients:
            raise Exception("The email domains of recipients are not among those on the allowed domain list.")
        if not self.validRecipients:
            raise Exception('Need at least one valid recipient')

        mail_log_msg = ('Sending email. recipients=%s %s') % (self.validRecipients, logCtx)

        try:
            # setup the Open SSL Context
            sslHelper = ssl_context.SSLHelper()
            serverConfJSON = sslHelper.getServerSettings(self.sessionKey)
            ctx = sslHelper.createSSLContextFromSettings(
                sslConfJSON=sslConfigAsJSON,
                serverConfJSON=serverConfJSON,
                isClientContext=True)

            if not useSSL:
                smtp = secure_smtplib.SecureSMTP(host=mailserver)
            else:
                smtp = secure_smtplib.SecureSMTP_SSL(host=mailserver, sslContext=ctx)
            if useTLS:
                smtp.starttls(ctx)
            if username and password:
                smtp.login(self.username, self.password)

            error = sendEmailWithUTF8(smtp, self.sender, self.validRecipients, self.email.as_string())
            if (error is not None):
                self.logger.debug('send mail with utf8 failed. retrying without utf8 option. Error: %s. %s', str(error), logCtx)
                smtp.sendmail(self.sender, self.validRecipients, self.email.as_string())

            smtp.quit()
            # keep this check where it is. intended to give feedback after sending
            if self.recipientFilteredOnDomain:
                m = ("Not all of the recipient email domains are on the allowed domain list. Sending emails only to %s. not sending to these addresses %s" % (
                    str(self.validRecipients), str(self.invalidRecipients)))
                raise Exception(m)

            self.logger.info(mail_log_msg)

        except Exception as e:
            self.logger.error('Error in %s' % mail_log_msg)
            raise
