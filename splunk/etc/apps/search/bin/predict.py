import sys
import os
import re
from math import sqrt
import csv
from time import mktime, localtime, strptime
from datetime import tzinfo, timedelta, datetime
import operator

import splunk.Intersplunk
import splunk.stats_util.statespace as statespace
from splunk.stats_util.dist import Erf
from builtins import range


erf = Erf()
root2 = sqrt(2)


class FC:
    def __init__(self, field=''):
        self.options = {'algorithm':'LLP5', 'holdback':0, 'correlate':None, 'upper':None, 'lower':None, 'suppress':None,
                'period':-1, 'as':'', 'future_timespan':'5', 'ci':'95', 'last':None, 'start':0, 'nonnegative':'f'}
        self.setField(field)
        self.vals = None 
        self.numvals = 0
        self.correlate = []
        self.conf = [erf.inverf(.95)*root2]*2
        self.upper_conf = 95.
        self.lower_conf = 95.
        self.missingValued = False
        self.databegun = False

    def __str__(self):
        ordered_fields = sorted(self.fields.items(), key=operator.itemgetter(1), reverse=True)
        ret = str(ordered_fields) + ", options: {"
        for key in sorted(self.options):
            ret += " %s: %s," %(key, self.options[key])
        ret += "}"
        return ret

    def setField(self, field):
        if field != '':
            self.fields = {field: 'prediction(' + field + ')'}
            self.fieldValMap = {field:0}
            self.options['as'] = self.fields[field]
            self.asNames = {field: field}
        else:
            self.fields = {}
            self.fieldValMap = {}
            self.asNames = {}
        self.iscount = {}

    def addField(self, field):
        self.setAsName(field, 'prediction(' + field + ')' )
        self.fieldValMap[field] = len(self.fields) - 1

    def setAsName(self, field, name):
        self.options['as'] = name
        self.asNames[field] = name
        self.fields[field] = name


    def addVal(self, field, val):
        idx = self.fieldValMap[field]
        self.vals[idx].append(val)

    def setUpperLowerNames(self):
        self.upperNames = {}
        self.lowerNames = {}
        self.UIupperNames = {}
        self.UIlowerNames = {}
        self.UIpredictNames = {}
        for field in self.fields:
            if self.options['upper'] != None:
                self.upperNames[field] = self.options['upper'] + '(' + self.fields[field] + ')'
            else:
                self.upperNames[field] = 'upper' + self.options['ci'] + '(' + self.fields[field] + ')'
            if self.options['lower'] != None:
                self.lowerNames[field] = self.options['lower'] + '(' + self.fields[field] + ')'
            else:
                self.lowerNames[field] = 'lower' + self.options['ci'] + '(' + self.fields[field] + ')'
            self.UIupperNames[field] = '_upper' + field
            self.UIlowerNames[field] = '_lower' + field
            self.UIpredictNames[field] = '_predicted' + field

    def setModel(self):
        if self.options['algorithm']  not in statespace.ALGORITHMS:
            splunk.Intersplunk.generateErrorResults("Unknown algorithm: %s" %self.options['algorithm'])
            sys.exit()
        data_end = self.numvals - self.holdback
        if data_end < statespace.LL.least_num_data():
            splunk.Intersplunk.generateErrorResults("Too few data points: %d. Need at least %d (too many holdbacks (%d) maybe?)" %(data_end, statespace.LL.least_num_data(), self.holdback))
            sys.exit()

        self.data_end = data_end
        self.data_start = 0
        algorithm = self.options['algorithm']
        vals = self.vals
        future_timespan = self.future_timespan

        try:
            if algorithm[:3] == 'LLP': 
                self.model = statespace.Univar(algorithm, vals, self.data_start, self.data_end, period=self.period, forecast_len=future_timespan, missingValued=self.missingValued)
            elif algorithm[:3] == 'LLB': # one of the LLB's
                if len(self.correlate) == 0:
                    splunk.Intersplunk.parseError("No correlate values")
                    sys.exit()
                if data_end < statespace.LLB.least_num_data():
                    splunk.Intersplunk.generateErrorResults("Too few data points: %d. Need at least %d" %(data_end, statespace.LLB.least_num_data()))
                    sys.exit()
                self.model = statespace.Multivar(algorithm, vals, self.numvals, correlate=self.correlate, missingValued=self.missingValued)
            elif algorithm[:2] == 'Bi': # one of the bivariate algorithms
                self.model = statespace.Multivar(algorithm, vals, data_end, forecast_len=future_timespan, missingValued=self.missingValued)
            else:
                self.model = statespace.Univar(algorithm, vals, self.data_start, self.data_end, forecast_len=future_timespan, missingValued=self.missingValued)
        except (AttributeError, ValueError) as e:
            splunk.Intersplunk.parseError(str(e))
            sys.exit()

    def predict(self):
        model = self.model
        if model.datalen() < model.least_num_data():
            splunk.Intersplunk.generateErrorResults("Too few data points: %d. Need at least %d" %(model.datalen(), model.least_num_data()))
            sys.exit()

        if self.options['algorithm'][:3] == 'LLB':
            start = max(self.data_end, 1)
            model.predict(0, start)
            self.future_timespan = 0
            self.lag = start + self.data_start
        else:
            self.lag = model.first_forecast_index() + self.data_start 


    def setNonnegativity(self):
        ''' If user set the 'nonnegative' option to true, then treat the fields as nonnegative and return.
        If not, then detect whether a field should be nonnegative by matching it with the countpattern below.
        '''
        if self.options['nonnegative'].lower() == 't':
            for field in self.fields:
                self.iscount[field] = True
            return
        countpattern = re.compile(r'^(c|count|dc|distinct_count|estdc)($|\()')
        for field in self.fields:
            if countpattern.match(field.lower()) or countpattern.match(self.asNames[field].lower()): 
                self.iscount[field] = True
            else:
                self.iscount[field] = False


    def getSpans(self, results):
        '''
            My understanding of the span fields is that:
            1. If _spandays isn't set, then _span is correct and counts the number of seconds since the epoch as defined in python.
               In particular, minute and hour spans are converted to _span correctly.
            2. If _spandays is set, then _span isn't always correct because of daylight time saving. So one should ignore _span in this case
               and use _spandays instead. We need to convert _spandays to seconds by using python's struct_time, localtime() and mktime().
            3. There is no _spanmonths field, but our convention is: if _spandays >= 28, then the month must be incremented and after that _spandays
               should be ignored. Hence, if _spandays >= 28, then we define spanmonths = _spandays/28 and then ignore _spandays.
        '''
        spandays = spanmonths = None
        if '_span' in results[0].keys():
            span = int(results[0]['_span'])
            if '_spandays' in results[0].keys():
                spandays = int(results[0]['_spandays'])
                if spandays >= 28:
                    spanmonths = int(spandays/28)
        elif '_time' in results[0].keys() and '_time' in results[1].keys():
            span = int(float(results[1]['_time']) - float(results[0]['_time']))
        else:
            splunk.Intersplunk.generateErrorResults("Unable to predict: data has no time")
            sys.exit()
        return (span, spandays, spanmonths)


    def output(self, results):
        model = self.model
        beginning = self.beginning
        lag = self.lag
        datalen = model.datalen()
        data_start = self.data_start
        options = self.options

        ext = self.numvals - self.holdback + self.future_timespan
        if self.options['algorithm'][:3] == 'LLB': 
            kk = min(len(results)-beginning, self.numvals)
        else:
            kk = min(len(results)-beginning, ext)

        # Since no numbers were present before 'beginning', we should leave those positions empty in the results.
        # All predictions are pushed forward (in the results array) by the 'beginning' amount. Without this forward push the 
        # predictions would be displayed at the wrong positions in the graphs: the predictions would appear
        # before the actual data. See SPL-80502.
        for i in range(beginning + min(lag, datalen)):
            for field in self.fields:
                results[i][self.UIpredictNames[field]] = self.fields[field]  
                results[i][self.fields[field]] = None
                results[i][self.UIupperNames[field]] = self.upperNames[field] 
                results[i][self.upperNames[field]] = None 
                results[i][self.UIlowerNames[field]] = self.lowerNames[field]
                results[i][self.lowerNames[field]] = None 
       
        self.setNonnegativity()
            
        for i in range(lag,kk):
            j = i - data_start
            I = i + beginning
            for field in self.fields:
                if self.options['suppress'] == field:
                    continue
                field_idx = self.fieldValMap[field]
                state = model.state(field_idx,j)

                if model.var(field_idx,j) == None:
                    print("None at j = %s" % j)
                    print("state = %s" % state)
                    continue

                tmp = sqrt(abs(model.var(field_idx,j)))
                upper = state + self.conf[0]*tmp
                lower = state - self.conf[1]*tmp
                if self.iscount[field] and lower < 0: lower = 0.0
                results[I][self.UIpredictNames[field]] = self.fields[field]  
                results[I][self.fields[field]] = str(state)
                results[I][self.UIupperNames[field]] = self.upperNames[field] 
                results[I][self.upperNames[field]] = str(upper)
                results[I][self.UIlowerNames[field]] = self.lowerNames[field]
                results[I][self.lowerNames[field]] = str(lower)

        # SPL-181973 For datasets that have NULL data at the start of the time range, which can occur when "earliest" or the
        # time picker is used, the lasttime will need to account for where the data actually begins.
        # For results with full data sets, the result will always begin at 0
        if '_time' in results[kk + beginning - 1]:
            lasttime = float(results[kk + beginning - 1]['_time'])
        else:
            splunk.Intersplunk.generateErrorResults("Unable to predict: data has no time")
            sys.exit()
        lasttime_struct = list(localtime(lasttime)) # convert to list since localtime() returns readonly objects
        (span, spandays, spanmonths) = self.getSpans(results)
        for i in range(kk,ext): # if this range is non-empty, that means ext > len(results); hence we should append to results
            j = i - data_start
            (extendedtime, lasttime_struct) = self.computeExtendedTime(lasttime_struct, span, spandays, spanmonths)
            newdict = {'_time': str(extendedtime)}
            for field in self.fields:
                if self.options['suppress'] == field:
                    continue
                field_idx = self.fieldValMap[field]
                state = model.state(field_idx, j)
                tmp = sqrt(abs(model.var(field_idx,j)))
                upper = state + self.conf[0]*tmp
                lower = state - self.conf[1]*tmp
                if self.iscount[field] and lower < 0: lower = 0.0
                newdict[self.UIpredictNames[field]] = self.fields[field]  
                newdict[self.fields[field]] = str(state)
                newdict[self.UIupperNames[field]] = self.upperNames[field] 
                newdict[self.upperNames[field]] = str(upper)
                newdict[self.UIlowerNames[field]] = self.lowerNames[field]
                newdict[self.lowerNames[field]] = str(lower)
            results.append(newdict)


    def computeExtendedTime(self, lasttime_struct, span, spandays, spanmonths):
        hour = lasttime_struct[3]
        if spanmonths:
            lasttime_struct[1] += spanmonths # increment the tm_mon field in python's struct_time
        elif spandays:
            lasttime_struct[2] += spandays # increment the tm_mday field in python's struct_time
        else:
            lasttime_struct[5] += span

        extendtime = mktime(tuple(lasttime_struct)) # convert back to seconds
        lasttime_struct = list(localtime(extendtime))

        # Dealing with daylight saving time. If the previous timestamp shows 12AM, we want 
        # the next timestamp to still be 12AM (not 1AM or 23PM) when users set span=1d or span=1mon
        # even when DST is in effect.
        if spandays != None:
            if lasttime_struct[8]==1 and (lasttime_struct[3] > hour or (hour==23 and lasttime_struct[3]==0)):
                extendtime -= 3600
                lasttime_struct = list(localtime(extendtime))
            elif lasttime_struct[8]==0 and (lasttime_struct[3] < hour or (hour==0 and lasttime_struct[3]==23)):
                extendtime += 3600
                lasttime_struct = list(localtime(extendtime))
        return (extendtime, lasttime_struct)


    def checkFutureTimespan(self):
        try:
            self.future_timespan = int(self.options['future_timespan'])
            if self.future_timespan < 0:
                raise ValueError
        except ValueError:
            splunk.Intersplunk.parseError("Invalid future_timespan: '%s'" %self.options['future_timespan'])

    def checkPeriod(self):
        self.period = self.options['period']
        if self.period != -1:
            try:
                self.period = int(self.period)
                if self.period < 1:
                    raise ValueError
            except ValueError:
                splunk.Intersplunk.parseError("Invalid period : '%s'" %self.options['period'])

    def checkHoldback(self):
        self.holdback = self.options['holdback']
        if self.holdback:
            try:
                self.holdback = int(self.options['holdback'])
                if self.holdback < 0:
                    raise ValueError
            except ValueError:
                splunk.Intersplunk.parseError("Invalid holdback: '%s'" %self.options['holdback'])
            
    def checkDataStart(self):
        try:
            self.data_start = int(self.options['start'])
            if self.data_start < 0:
                raise ValueError
        except ValueError:
            splunk.Intersplunk.parseError("Invalid start: '%s'" %self.options['start'])

    def checkNonnegative(self):
        try:
            self.nonnegative = bool(self.options['nonnegative'])
        except ValueError:
            splunk.Intersplunk.parseError("Invalid nonnegative value: '%s'" %self.options['nonnegative'])

    def initVals(self):
        self.vals = [None]*len(self.fields)
        for i in range(len(self.vals)):
            self.vals[i] = []

    def lastCheck(self):
        self.setUpperLowerNames() # if they weren't
        self.checkFutureTimespan()
        self.checkPeriod()
        self.checkHoldback()
        self.checkDataStart()
        self.checkNonnegative()
        self.initVals()


def parseOps(argv):
    argc = len(argv)
    if argc == 0: raise ValueError("No field specified")

    fcs = [FC()]

    i = 0
    fc = fcs[-1]
    current_field = None
    while i < argc:
        arg = str.lower(argv[i])
        
        if arg == 'as':
            if i+1 == argc or argv[i+1].find('=') != -1:
                raise ValueError("missing new name after 'as'")
            fc.setAsName(current_field,argv[i+1])
            i += 2
            continue

        pos = arg.find("=")
        if pos != -1:
            attr = arg[:pos]
            if attr in fc.options.keys():
                if attr=='as':
                    fc.setAsName(current_field, argv[i][pos+1:])
                else:
                    fc.options[attr] = argv[i][pos+1:]
            elif attr[:5]=="upper":
                try:
                    fc.upper_conf = float(attr[5:])
                    if fc.upper_conf < 0 or fc.upper_conf >= 100: raise ValueError
                    fc.conf[0] = erf.inverf(fc.upper_conf/100.)*root2
                except ValueError:
                    raise ValueError("bad upper confidence interval")
                fc.options['upper'] = argv[i][pos+1:]
            elif attr[:5]=="lower":
                try:
                    fc.lower_conf = float(attr[5:])
                    if fc.lower_conf < 0 or fc.lower_conf >= 100: raise ValueError
                    fc.conf[1] = erf.inverf(fc.lower_conf/100.)*root2
                except ValueError:
                    raise ValueError("bad lower confidence interval")
                fc.options['lower'] = argv[i][pos+1:]
            else:
                raise ValueError("unknown option %s" %arg)
            i +=1
            continue

        if len(fc.fields) == 0:
            isField = True
            while isField:
                fc.addField(argv[i])
                current_field = argv[i]
                i += 1
                if i < argc:
                    arg = str.lower(argv[i])
                    if arg == 'as':
                        if i+1==argc or argv[i+1].find('=') != -1:
                            raise ValueError("missing new name after 'as'")
                        fc.setAsName(current_field,argv[i+1])
                        i += 2
                        if i >= argc: break
                        arg = str.lower(argv[i])
                    if arg.find('=') != -1:
                        isField = False
                else: break
        else:
            fc.lastCheck() # if they weren't set
            fcs.append(FC(argv[i])) # start new FC
            current_field = argv[i]
            fc = fcs[-1]
            i += 1

    fc.lastCheck() # if they weren't set
    return fcs

def readSearchResults(results, fcs):
    if len(results) == 0:
        splunk.Intersplunk.generateErrorResults("No data")
        sys.exit(0)
    for fc in fcs:
        for field in fc.fields:
            if field not in results[0]:
                splunk.Intersplunk.generateErrorResults("Unknown field: %s" %field)
                sys.exit(0)
        fc.beginning = 0
    for res in results:
        for fc in fcs:
            for field in fc.fields:
                if field in res:
                    try:
                        fc.addVal(field, float(res[field]))
                        fc.databegun = True
                    except ValueError:
                        if not fc.databegun:
                            fc.beginning += 1 # increase 'beginning' only when no numbers have been encountered
                        elif res[field]==None or res[field]=='':
                            fc.addVal(field, None)
                            fc.missingValued = True
            if fc.options['correlate'] in res:
                if res[fc.options['correlate']]==None or res[fc.options['correlate']]=='':
                    fc.correlate.append(None)
                    fc.missingValued = True
                else:
                    try:
                        fc.correlate.append(float(res[fc.options['correlate']]))
                    except ValueError:
                        splunk.Intersplunk.parseError("bad correlate field value: " + res[fc.options['correlate']])
    for fc in fcs:
        fc.numvals = len(fc.vals[0])


def predictAll(fcs, results):
    readSearchResults(results, fcs)
    for fc in fcs:
        fc.setModel()
        fc.predict()
        fc.output(results)

if __name__ == "__main__":
    (isgetinfo, sys.argv) = splunk.Intersplunk.isGetInfo(sys.argv)
    if isgetinfo:
        splunk.Intersplunk.outputInfo(False, False, True, False, None, True)
        # outputInfo automatically calls sys.exit()
    try:
        forecaster = parseOps(sys.argv[1:])
    except ValueError as e:
        splunk.Intersplunk.parseError(str(e))
    results = splunk.Intersplunk.readResults(None, None, False)
    predictAll(forecaster, results)
    splunk.Intersplunk.outputResults(results)
