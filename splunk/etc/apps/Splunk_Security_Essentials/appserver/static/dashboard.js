/* eslint-disable vars-on-top */
// init
var localStoragePreface = 'sse';
window.diagObject = [];


// generateDiag.js content moved over to dashboard.js

/* 
// removing console redirection, because it breaks IE 11
var console = window.console

function intercept(method) {
    var original = console[method]
    console[method] = function() {
        window.diagObject.push(arguments);
        if (original.apply) {
            // Do this for normal browsers
            original.apply(console, arguments);
        } else {
            // Do this for IE
            var message = Array.prototype.slice.apply(arguments).join(' ');
            original(message);
        }
    }
}
var methods = ['log', 'warn', 'error'];
for (var i = 0; i < methods.length; i++) {
    intercept(methods[i]);
}
 */

function collectDiag() {
    require([
        'jquery',
        Splunk.util.make_full_url(
            '/static/app/Splunk_Security_Essentials/vendor/jszip/jszip.js'
        ),
        Splunk.util.make_full_url(
            '/static/app/Splunk_Security_Essentials/vendor/FileSaver/FileSaver.js'
        ),
    ], function($, JSZip) {
        // console.log("JSZip Loaded", JSZip)
        var zip = new JSZip();

        var browserInfo = new Object();
        browserInfo.ua = navigator.userAgent;
        browserInfo.url = window.location.href;
        browserInfo.cookies = document.cookie;
        browserInfo.lang = navigator.language;

        var searchManagers = new Object();
        for (var attribute in splunkjs.mvc.Components.attributes) {
            var sm = splunkjs.mvc.Components.getInstance(attribute);
            if (typeof sm != 'undefined' && sm != null) {
                if (typeof sm.search != 'undefined') {
                    searchManagers[attribute] = new Object();
                    searchManagers[attribute]['name'] = attribute;
                    searchManagers[attribute]['lastError'] = sm.lastError;
                    searchManagers[attribute]['attributes'] =
                        sm.search.attributes;
                }
            }
        }

        var local_configuration = window.$C;

        var folder1 = zip.folder('diag-output-from-Splunk-Essentials');
        // folder1.file("console_log.json", JSON.stringify(window.diagObject, null, 4));
        folder1.file('browser_info.json', JSON.stringify(browserInfo, null, 4));
        folder1.file(
            'search_managers.json',
            JSON.stringify(searchManagers, null, 4)
        );
        folder1.file('localStorage.json', JSON.stringify(localStorage, null, 4));
        folder1.file(
            'configuration.json',
            JSON.stringify(local_configuration, null, 4)
        );
        folder1.file(
            'tokens.json',
            JSON.stringify(
                splunkjs.mvc.Components.getInstance('submitted').attributes,
                null,
                4
            )
        );

        zip.generateAsync({ type: 'blob' }).then(function(content) {
            // see FileSaver.js
            saveAs(content, 'diag-output-from-Splunk-Essentials.zip');
        });
    });
}

var mylink = $('<a href="#">Generate Essentials-only Diag</a>').click(
    function() {
        collectDiag();
        return false;
    }
);
$('div[data-view="views/shared/splunkbar/help/Master"]')
    .find('ul')
    .append($('<li></li>').append(mylink));

function updateShowcaseInfo() {
    // First Get Data for Signature verification
    $.ajax({
        url: `${$C['SPLUNKD_PATH'] }/services/updateShowcaseinfo?reason=verification`,
        async: true,
        success: function(returnedData) {
            // Now verify the signatures
            for (let i = 0; i < returnedData.sign.length; i++) {
                verifySignatures(returnedData.Public_Key, returnedData.sign[i], returnedData.JSON[i], returnedData.name[i], i);
            }
        },
        error: function(xhr, textStatus, error) {
            // console.log("Update of showcaseinfo failed",xhr, textStatus, error)
        },
    });
}

// Update the lookup as ususal
const updateLookup = () => {
    $.ajax({
        url: $C['SPLUNKD_PATH'] + '/services/updateShowcaseinfo?reason=none',
        async: true,
        success: function(updateShowcaseinfo) {
            // console.log("Success",updateShowcaseinfo)
            // This will update the Configuration menu entry to green and tell the user to reload
            $('#launchConfigurationLink .updatestatusicon').attr(
                'class',
                'updatestatusicon icon-rotate'
            );
            $('#launchConfigurationLink')
                .attr('data-placement', 'bottom')
                .css('background-color', '#00950E')
                .css('color', 'white')
                .attr('data-status', 'elementUpdated')
                .attr(
                    'data-original-title',
                    'Update Available for Security Content'
                )
                .unbind('click')
                .click(function() {
                    location.reload();
                });
        },
        error: function(xhr, textStatus, error) {
            // console.log("Update of showcaseinfo failed",xhr, textStatus, error)
        },
    });
};

let completedFor = [];

// Signature verification for Update content
const verifySignatures = (passedPublicKey, passedSignature, passedMessage, passedName, index) => {
    (async() => {
        // Reading Public Key
        const publicKey = await openpgp.readKey({ armoredKey: passedPublicKey });
        // Reading the message
        const message = await openpgp.createMessage({ text: passedMessage });
        // Reading the signature
        const signature = await openpgp.readSignature({
            armoredSignature: passedSignature // parse detached signature
        });

        const verificationResult = await openpgp.verify({
            message, // Message object
            signature,
            verificationKeys: publicKey
        });
        const { verified, keyID } = verificationResult.signatures[0];
        try {
            await verified; // throws on invalid signature

            // Now make a call for updating the jsons
            $.ajax({
                url: $C['SPLUNKD_PATH'] + `/services/updateShowcaseinfo?reason=update&for=${passedName}`,
                async: true,
                success: function(returnedData) {
                    console.log(`Success updating : ${passedName}`);
                    if (!completedFor.includes(passedName))
                        completedFor.push(passedName);
                    // After every content has been updated
                    if (completedFor.length >= 3) {
                        // Update the lookup as usual
                        updateLookup();
                        completedFor = [];
                    }
                },
                error: function(xhr, textStatus, error) {
                    console.log('Update of showcaseinfo failed', xhr, textStatus, error);
                },
            });
        } catch (e) {
            throw new Error(`Signature could not be verified ${passedName} as ${e.message}`);
        }
    })();
};

function updatesecurityDataJourneyCustomContent() {
    $.ajax({
        url: $C['SPLUNKD_PATH'] +
            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content',
        type: 'GET',
        contentType: 'application/json',
        async: false,
        success: function(data) {
            for (let content of data) {
                let contentJson = JSON.parse(content.json);
                if (!('securityDataJourney' in contentJson)) {
                    contentJson.securityDataJourney = 'Level_2';
                    content._time = new Date().getTime() / 1000;
                    content.json = JSON.stringify(contentJson);
                }
                $.ajax({
                    url: $C['SPLUNKD_PATH'] +
                        '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/' +
                        content['_key'],
                    type: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key':
                            window.getFormKey(),
                    },
                    contentType: 'application/json',
                    async: true,
                    data: JSON.stringify(content),
                    success: function(returneddata) {
                        // console.log("returnedData: ", returneddata);
                    }
                });
            }
        }
    });
}

function updateMitreMatrixList(version) {
    // Check if search manager has already been created
    if (
        typeof splunkjs.mvc.Components.getInstance(
            'updateMitreMatrixList_' + version
        ) == 'undefined'
    ) {
        require(['splunkjs/mvc/utils', 'splunkjs/mvc/searchmanager'], function(
            utils,
            SearchManager
        ) {
            var search =
                '| union [| mitremap output="list" refresh_cache="true" | outputlookup mitre_enterprise_list] [| savedsearch "Generate MITRE Data Source Lookup"] [| savedsearch "Generate MITRE Detections Lookup"] [| savedsearch "Generate MITRE Threat Group Lookup"]';
            new SearchManager(
                {
                    id: 'updateMitreMatrixList_' + version,
                    latest_time: '0',
                    autostart: true,
                    earliest_time: 'now',
                    search: search,
                    app: utils.getCurrentApp(),
                    auto_cancel: 90,
                },
                { tokens: false }
            );
            // console.log("Updated updateMitreMatrixList", SearchManager);
        });
    }
}
function getFormKey() {
    const prefix = `splunkweb_csrf_token_${window.$C.MRSPARKLE_PORT_NUMBER}=`;
    if (document.cookie) {
        for (const chunk of document.cookie.split(';')) {
            const cookie = String(chunk).trim();
            if (cookie.startsWith(prefix)) {
                return decodeURIComponent(cookie.slice(prefix.length));
            }
        }
    }
}
window.getFormKey = getFormKey;
function addKnowledgeObject(obj) {
    let buttonId = '#add-' + obj.objectType + '-' + obj.name.split('(')[0];
    $.ajax({
        url:
            $C['SPLUNKD_PATH'] +
            '/services/addKnowledgeObject?time=' +
            Date.now(),
        async: true,
        type: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        contentType: 'application/json',
        data: JSON.stringify(obj),
        success: function(addKnowledgeObject) {
            let prereqNum = $(buttonId)
                .closest('tr')
                .children('td')
                .eq(1)
                .attr('id')
                .split('data_check_test')[1];
            let searchManagerId = 'data_check_search' + prereqNum;
            if (obj.objectType == 'macro') {
                $(buttonId).removeAttr('disabled');
                $(buttonId).text('Edit Macro');
                $(buttonId).addClass('external');
                $(buttonId).prop('title', 'Click to Edit Macro');
                $(buttonId).on('click', function() {
                    if (
                        typeof obj.arguments != 'undefined' &&
                        obj.arguments != ''
                    ) {
                        obj.name += '(' + obj.arguments.length + ')';
                    }
                    var edit_macro_link_url =
                        '/manager/Splunk_Security_Essentials/admin/macros/' +
                        obj.name +
                        '?action=edit';
                    // Link format changed in 8.2
                    if (
                        parseInt(localStorage['splunk-major-version']) > 8 ||
                        (parseInt(localStorage['splunk-major-version']) == 8 &&
                            parseInt(localStorage['splunk-minor-version']) == 2)
                    ) {
                        edit_macro_link_url =
                            '/manager/Splunk_Security_Essentials/data/macros/' +
                            obj.name +
                            '?action=edit';
                    }
                    window.open(edit_macro_link_url, '_blank');
                });
            } else {
                $(buttonId).hide();
            }

            document.getElementById('data_check_test' + prereqNum).innerHTML =
                '<img title="Success" src="' +
                Splunk.util.make_full_url(
                    '/static//app/Splunk_Security_Essentials/images/general_images/ok_ico.gif'
                ) +
                '">';
            // console.log("Knowledge object added",addKnowledgeObject)
        },
        error: function(xhr, textStatus, error) {
            // console.log("Adding of knowledgeobject failed",xhr, textStatus, error)
            $(buttonId).removeAttr('disabled');
            $(buttonId).prop('title', 'Adding of knowledgeobject failed');
            $(buttonId + ' .updatestatusicon').remove();
        },
    });
}

function addContentMapping(searchTitle, showcaseId) {
    const record = {
        _time: new Date().getTime() / 1000,
        _key: `${searchTitle.replace(/[^a-zA-Z0-9]/g, '')}_${showcaseId}`,
        search_title: searchTitle,
        showcaseId: showcaseId,
        user: Splunk.util.getConfigValue('USERNAME'),
    };
    
    $.ajax({
        url:
            `${$C['SPLUNKD_PATH']
            }/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/?query={"search_title": "${ searchTitle }","showcaseId": "${ showcaseId }"}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        async: true,
        success: function(returneddata) {
            if (returneddata.length === 0) {
                $.ajax({
                    url:
                        `${$C['SPLUNKD_PATH']
                        }/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/`,
                    type: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    async: true,
                    contentType: 'application/json',
                    data: JSON.stringify(record),
                    success: function(newreturneddata) {
                        bustCache();
                        newkey = newreturneddata;
                        // If search_title does not contain the " - Rule" suffix, add en entry with the full search_title as an automatic lookup rule
                        if (record.search_title.search(' - Rule') === -1) {
                            const propsRecord = {
                                name: `source::${ searchTitle}`,
                                'LOOKUP-splunk_security_essentials':
                                    'sse_content_exported_lookup search_title AS search_name OUTPUTNEW search_title, mitre_id AS annotations.mitre_attack, mitre_display AS annotations.mitre_attack.mitre_technique, mitre_id AS annotations.mitre_attack.mitre_technique_id, mitre_tactic AS annotations.mitre_attack.mitre_tactic_id,mitre_tactic_display AS annotations.mitre_attack.mitre_tactic, mitre_sub_technique, killchain, showcaseId, showcaseName, category, mitre_technique_description, mitre_tactic_description, mitre_sub_technique_description,analytic_story',
                            };
                            // console.log("propsRecord",propsRecord)
                            setTimeout(function() {
                                addNotableAndRiskLookup(propsRecord, true);
                            }, 2000);
                        }
                    },
                    error: function() { },
                });
            } else {
                // Old
                $.ajax({
                    url:
                        `${$C['SPLUNKD_PATH']
                        }/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/${record._key}`,
                    type: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    async: true,
                    data: JSON.stringify(record),
                    success: function(updatedreturneddata) {
                        bustCache();
                        newkey = updatedreturneddata;
                        // If search_title does not contain the " - Rule" suffix, add en entry with the full search_title as an automatic lookup rule
                        if (record.search_title.search(' - Rule') === -1) {
                            const propsRecord = {
                                name: `source::${searchTitle}`,
                                'LOOKUP-splunk_security_essentials':
                                    'sse_content_exported_lookup search_title AS search_name OUTPUTNEW search_title, mitre_id AS annotations.mitre_attack, mitre_display AS annotations.mitre_attack.mitre_technique, mitre_id AS annotations.mitre_attack.mitre_technique_id, mitre_tactic AS annotations.mitre_attack.mitre_tactic_id,mitre_tactic_display AS annotations.mitre_attack.mitre_tactic, mitre_sub_technique, killchain, showcaseId, showcaseName, category, mitre_technique_description, mitre_tactic_description, mitre_sub_technique_description,analytic_story',
                            };
                            // console.log("propsRecord",propsRecord)
                            setTimeout(function() {
                                addNotableAndRiskLookup(propsRecord, true);
                            }, 2000);
                        }
                    },
                    error: function(xhr, textStatus, error) {
                        console.log('Error Updating!', xhr, textStatus, error)
                    },
                });
            }
        },
        error: function(error, data, other) {
            console.log('Error Code!', error, data, other)
        },
    });
}
window.addContentMapping = addContentMapping;

function deleteContentMapping(searchTitle, showcaseId) {
    const search_title = decodeURI(searchTitle);
    const record = {
        _key: `${search_title.replace(/[^a-zA-Z0-9]/g, '')}_${showcaseId}`,
        showcaseId: search_title.replace(/[^a-zA-Z0-9]/g, ''),
    };
    // console.log("Trying to remove: ",record)
    // Now you can only have one local saved search per showcase, should in theory be able to have more than one. Need to change key to be search_title + showcaseId to make a primary key.
    $.ajax({
        url:
            `${$C["SPLUNKD_PATH"]
            }/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/?query={"search_title": "${ searchTitle }","showcaseId": "${ showcaseId }"}`,
        type: 'GET',
        contentType: 'application/json',
        async: true,
        success: function(returneddata) {
            if (returneddata.length !== 0) {
                $.ajax({
                    url:
                        `${$C['SPLUNKD_PATH']
                        }/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/${
                            record._key}`,
                    type: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    async: true,
                });
                deleteSSEContentExport(returneddata[0].showcaseId);
                // If search_title does not contain the " - Rule" suffix, remove the entry with the full search_title as an automatic lookup rule
                if (search_title.search(' - Rule') === -1) {
                    var stanza = `source::${ searchTitle}`;
                    deleteNotableAndRiskLookup(stanza);
                }
            }
        },
        error: function(error, data, other) {
            //     console.log("Error Code!", error, data, other)
        },
    });
}
window.deleteContentMapping = deleteContentMapping;

function deleteAllContentMappings(showcaseId) {
    let record = {
        showcaseId: showcaseId,
    };
    // console.log("Trying to remove: ",record)
    $.ajax({
        url:
            $C['SPLUNKD_PATH'] +
            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/?query={"showcaseId": "' +
            record['showcaseId'] +
            '"}',
        type: 'GET',
        contentType: 'application/json',
        async: true,
        success: function(returneddata) {
            if (returneddata.length != 0) {
                for (let i = 0; i < returneddata.length; i++) {
                    if (typeof returneddata[i]['_key'] != 'undefined') {
                        $.ajax({
                            url:
                                $C['SPLUNKD_PATH'] +
                                '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/' +
                                returneddata[i]['_key'],
                            type: 'DELETE',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-Splunk-Form-Key': window.getFormKey(),
                            },
                            async: true,
                        });
                        deleteSSEContentExport(returneddata[0]['showcaseId']);
                        // If search_title does not contain the " - Rule" suffix, remove the entry with the full search_title as an automatic lookup rule
                        if (
                            returneddata[i]['search_title'].search(' - Rule') ==
                            -1
                        ) {
                            var stanza =
                                'source::' + returneddata[i]['search_title'];
                            deleteNotableAndRiskLookup(stanza);
                        }
                    }
                }
            }
        },
        error: function(error, data, other) {
            //     console.log("Error Code!", error, data, other)
        },
    });
}
window.deleteAllContentMappings = deleteAllContentMappings;

function addNotableAndRiskLookup(record, makeStanzaGlobal = true) {
    $.ajax({
        url:
            `${$C['SPLUNKD_PATH']
            }/servicesNS/nobody/Splunk_Security_Essentials/configs/conf-props`,
        type: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        async: true,
        contentType: 'application/json',
        data: $.param(record),
        success: function(returneddata) {
            // Stanza created
            if (makeStanzaGlobal) {
                // make global
                addGlobalACL('props', record['name']);
            }
        },
        error: function(xhr, textStatus, error) { },
    });
}
window.addNotableAndRiskLookup = addNotableAndRiskLookup;

function addGlobalACL(file, stanza) {
    var url =
        $C['SPLUNKD_PATH'] +
        '/servicesNS/nobody/Splunk_Security_Essentials/configs/conf-' +
        file +
        '/' +
        encodeURIComponent(stanza) +
        '/acl';
    var data =
        'perms.read=*&perms.write=admin&owner=' +
        $C['USERNAME'] +
        '&sharing=global';
    // console.log("Working on a URL", url)
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        async: false,
        data: data,
        success: function() {
            // console.log("Updated ACL", data)
        },
        error: function() {
            // console.log("Update failed for ACL", data)
        },
    });
}
window.addGlobalACL = addGlobalACL;

function deleteNotableAndRiskLookup(stanza) {
    $.ajax({
        url:
            $C['SPLUNKD_PATH'] +
            '/servicesNS/nobody/Splunk_Security_Essentials/configs/conf-props/' +
            encodeURIComponent(stanza),
        type: 'DELETE',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        async: true,
        contentType: 'application/json',
        success: function(returneddata) {
            // console.log("Stanza deleted", stanza)
        },
        error: function(xhr, textStatus, error) { },
    });
}
window.deleteNotableAndRiskLookup = deleteNotableAndRiskLookup;

function deleteSSEContentExport(key) {
    $.ajax({
        url:
            $C['SPLUNKD_PATH'] +
            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_content_exported/' +
            key,
        type: 'DELETE',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        async: true,
    });
}

// / Clear Demo Functionality

function clearDemo() {
    require([
        'jquery',
        'underscore',
        'splunkjs/mvc',
        'splunkjs/mvc/utils',
        'splunkjs/mvc/tokenutils',
        'splunkjs/mvc/simplexml',
        'splunkjs/mvc/searchmanager',
        Splunk.util.make_full_url(
            '/static/app/Splunk_Security_Essentials/components/data/sendTelemetry.js'
        ),
        // "components/splunk/AlertModal",
        // "views/shared/AlertModal.js",
        // "views/shared/Modal.js",

        //        "components/controls/Modal",
        'splunkjs/ready!',
        'css!../app/Splunk_Security_Essentials/style/data_source_check.css',
    ], function(
        $,
        _,
        mvc,
        utils,
        TokenUtils,
        DashboardController,
        SearchManager,
        Telemetry,
        // AlertModal,
        // Modal,
        Ready // ,
        // ShowcaseInfo
    ) {
        var resetSearch = new SearchManager(
            {
                id: 'resetSearch',
                cancelOnUnload: true,
                latest_time: '0',
                sample_ratio: null,
                status_buckets: 0,
                autostart: true,
                earliest_time: 'now',
                search: '| inputlookup bookmark_lookup | where a=b | outputlookup bookmark_lookup',
                app: utils.getCurrentApp(),
                auto_cancel: 90,
                preview: true,
                runWhenTimeIsUndefined: false,
            },
            { tokens: false }
        );

        var resetSearch2 = new SearchManager(
            {
                id: 'resetSearch2',
                cancelOnUnload: true,
                latest_time: '0',
                sample_ratio: null,
                status_buckets: 0,
                autostart: true,
                earliest_time: 'now',
                search: '| inputlookup bookmark_custom_lookup | where a=b | outputlookup bookmark_custom_lookup',
                app: utils.getCurrentApp(),
                auto_cancel: 90,
                preview: true,
                runWhenTimeIsUndefined: false,
            },
            { tokens: false }
        );

        var resetSearch3 = new SearchManager(
            {
                id: 'resetSearch3',
                cancelOnUnload: true,
                latest_time: '0',
                sample_ratio: null,
                status_buckets: 0,
                autostart: true,
                earliest_time: 'now',
                search: '| inputlookup data_inventory_eventtypes_lookup | where a=b | outputlookup data_inventory_eventtypes_lookup',
                app: utils.getCurrentApp(),
                auto_cancel: 90,
                preview: true,
                runWhenTimeIsUndefined: false,
            },
            { tokens: false }
        );

        for (var key in localStorage) {
            if (
                localStorage.hasOwnProperty(key) &&
                key.indexOf(localStoragePreface + '-') == 0 &&
                key.indexOf(localStoragePreface + '-metrics-') == -1
            ) {
                localStorage.removeItem(key);
            }
        }

        alert('Success');
    });
    // localStorage[localStoragePreface + '-splMode'] = "false"
    // Always show the SPL - JB
    localStorage[localStoragePreface + '-splMode'] = 'true';
}

// Get all data from Splunk kv store lookup table, and store them into a hashmap
/** *********************************************************
 * example of response from the custom_content lookup table
 *  **********************************************************
 * [
    {
        "0": {
            "_time": 0,
            "channel": null,
            "json": null,
            "local_json": null,
            "showcaseId": null,
            "user": null
        },
        "wait": true,
        "_user": "nobody",
        "_key": "613bcd02110d5a35ac64eaa1"
    },
    {
        "_time": 1631909839.492,
        "showcaseId": "custom_SSE274",
        "channel": "custom",
        "json": "{\"advancedtags\":\"\",\"alertvolume\":\"Other\",\"category\":\"Other\",\"company_description\":\"\",\"company_link\":\"\",\"company_logo\":\"\",\"company_logo_height\":\"\",\"company_logo_width\":\"\",\"company_name\":\"\",\"dashboard\":\"\",\"data_source_categories\":\"VendorSpecific-AnySplunk\",\"description\":\"test test test\",\"domain\":\"\",\"help\":\"\",\"highlight\":\"No\",\"howToImplement\":\"\",\"icon\":\"\",\"inSplunk\":\"no\",\"journey\":\"Stage_3\",\"killchain\":\"\",\"knownFP\":\"\",\"name\":\"SSE274\",\"operationalize\":\"\",\"printable_image\":\"\",\"relevance\":\"\",\"search\":\"index=\\\"_audit\\\" | head 1\",\"searchkeywords\":\"\",\"severity\":\"Other\",\"showOnlyApp\":\"*\",\"showOnlyCorrelations\":\"\",\"showOnlyEnabled\":\"true\",\"showOnlyScheduled\":\"\",\"showOnlyStatus\":\"*\",\"SPLEase\":\"\",\"usecase\":\"Other\"}",
        "user": "admin",
        "_user": "nobody",
        "_key": "custom_SSE274"
    },
    {
        "_time": 1631909839.495,
        "showcaseId": "custom_SSE274_Test_2",
        "channel": "custom",
        "json": "{\"advancedtags\":\"\",\"alertvolume\":\"Other\",\"category\":\"Other\",\"company_description\":\"\",\"company_link\":\"\",\"company_logo\":\"\",\"company_logo_height\":\"\",\"company_logo_width\":\"\",\"company_name\":\"\",\"dashboard\":\"\",\"data_source_categories\":\"VendorSpecific-AnySplunk\",\"description\":\"Generated by the Splunk Security Essentials app from the saved search SSE274 Test 2 at Fri Sep 17 2021 09:00:36 GMT-0700 (Pacific Daylight Time)\",\"domain\":\"\",\"help\":\"\",\"highlight\":\"No\",\"howToImplement\":\"\",\"icon\":\"\",\"inSplunk\":\"no\",\"journey\":\"Stage_3\",\"killchain\":\"\",\"knownFP\":\"\",\"name\":\"SSE274 Test 2\",\"operationalize\":\"\",\"printable_image\":\"\",\"relevance\":\"\",\"search\":\"index=\\\"_audit\\\" | head 400\",\"searchkeywords\":\"\",\"severity\":\"Other\",\"showOnlyApp\":\"*\",\"showOnlyCorrelations\":\"\",\"showOnlyEnabled\":\"true\",\"showOnlyScheduled\":\"\",\"showOnlyStatus\":\"*\",\"SPLEase\":\"\",\"usecase\":\"Other\",\"mitre_technique\":\"TA0001|TA0025|T1190|T1191|T1189|T1188\"}",
        "user": "admin",
        "_user": "nobody",
        "_key": "custom_SSE274_Test_2"
    }
]

 ** *********************************************************
 * example of response from the local_search_mappings lookup table
 *  **********************************************************
 * 
[
    {
        "0": {
            "_time": 0,
            "search_title": null,
            "showcaseId": null,
            "user": null
        },
        "wait": true,
        "_user": "nobody",
        "_key": "613bcd13110d5a35ac64eaa2"
    },
    {
        "_time": 1631894436.292,
        "search_title": "SSE274",
        "showcaseId": "custom_SSE274",
        "user": "admin",
        "_user": "nobody",
        "_key": "SSE274"
    },
    {
        "_time": 1631894436.395,
        "search_title": "SSE274 Test 2",
        "showcaseId": "custom_SSE274_Test_2",
        "user": "admin",
        "_user": "nobody",
        "_key": "SSE274Test2"
    }
]

 */
function fetchLookUpTable(url) {
    let map = {};
    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        async: false,
        success: function(returneddata) {
            if (returneddata.length != 0) {
                for (item of returneddata) {
                    if (item['_key']) {
                        map[item['_key']] = item;
                    }
                }
            }
        },
    });
    return map;
}

// Update custom_content["mitre_technique"] based on saved_search["annotations"]["mitre_attack"]
// Logic: add the items of saved_search["annotations"]["mitre_attack"] that are not included in custom_content["mitre_technique"] into custom_content
function updateMitreTechnique(mitreTechnique, mitreAttackInSavedSearch) {
    if (typeof mitreTechnique != 'undefined' && mitreTechnique != '') {
        // filter out the subset that are not included in custom_content["mitre_technique"]
        const addItems = mitreAttackInSavedSearch.filter(
            (item) => !mitreTechnique.includes(item)
        );
        // add the subset into custom_content["mitre_technique"] and filter out the item whose value is "None"
        mitreTechnique = mitreTechnique
            .concat(addItems)
            .filter((item) => item.toLowerCase() !== 'none');
        return mitreTechnique.join('|');
    } else {
        return '';
    }
}

// Compare custom content vs saved search, and update custom content if needed
function updateCustomContent(customContent, savedSearch) {
    // compare custom_content["description"] vs saved_search["description"]
    let isUpdate = false;
    if (
        savedSearch['description'] &&
        customContent['description'] != savedSearch['description']
    ) {
        customContent['description'] = savedSearch['description'];
        isUpdate = true;
    }
    // compare custom_content["search"] vs saved_search["search"]
    if (customContent['search'] != savedSearch['search']) {
        customContent['search'] = savedSearch['search'];
        isUpdate = true;
    }
    // compare custom_content["mitre_technique"] VS saved_search["annotations"]["mitre_attack"]
    if (savedSearch['annotations']) {
        savedSearch['annotations'] = JSON.parse(savedSearch['annotations']);
        if (savedSearch['annotations']['mitre_attack']) {
            if (customContent['mitre_technique']) {
                // check if custom_content["mitre_technique"] contains saved_search["annotations"]["mitre_attack"]
                let mitreTechnique = customContent['mitre_technique'].split('|');
                const isContain = savedSearch['annotations'][
                    'mitre_attack'
                ].every((val) => mitreTechnique.includes(val));
                if (!isContain) {
                    isUpdate = true;
                    customContent['mitre_technique'] = updateMitreTechnique(
                        mitreTechnique,
                        savedSearch['annotations']['mitre_attack']
                    );
                }
            } else {
                isUpdate = true;
                mitreTechnique = [];
                customContent['mitre_technique'] = updateMitreTechnique(
                    mitreTechnique,
                    savedSearch['annotations']['mitre_attack']
                );
            }
        }
    }
    result = {
        isUpdate: isUpdate,
        updatedCustomContent: customContent,
    };
    return result;
}

// Update the custom_content lookup Table
function updateLookupTable(url, updatedEntry) {
    // update _time
    updatedEntry['_time'] = new Date().getTime() / 1000;
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        contentType: 'application/json',
        async: true,
        data: JSON.stringify(updatedEntry),
        success: function(returneddata) {
            bustCache();
            // console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + ((new Date()).getSeconds()), "[-] Got a response", returneddata);
        },
        error: function(xhr, textStatus, error) {
            console.error('Error Updating!', xhr, textStatus, error);
            // triggerError(xhr.responseText);
        },
    });
}

// Compare the custom content with its connected saved search and update it if needed
function autoUpdateCustomContents(localStorage) {
    if (!localStorage) {
        return;
    }
    // // Store saved searches from localStorage into a hashmap
    let savedSearchMap = {};
    // let savedSearches = JSON.parse(
    //     localStorage[localStoragePreface + "-savedsearches"]
    // )

    getData(KEY_SAVEDSEARCHES)
        .then((data) => {
            let savedSearches = JSON.parse(data);
            for (const search of savedSearches) {
                savedSearchMap[search['name']] = search;
            }

            // fetch custom contents from lookup table
            let customContentURL =
                $C['SPLUNKD_PATH'] +
                '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content';
            let customContentMap = fetchLookUpTable(customContentURL);

            // fetch local_search_mappings contents from lookup table
            let localSearchMappingsURL =
                $C['SPLUNKD_PATH'] +
                '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings';
            let localSearchMappingsMap = fetchLookUpTable(
                localSearchMappingsURL
            );

            if (localSearchMappingsMap) {
                for (const item of Object.values(localSearchMappingsMap)) {
                    // compare custom content and saved search
                    if (
                        savedSearchMap[item['search_title']] &&
                        customContentMap[item['showcaseId']]
                    ) {
                        let customContentObj = JSON.parse(
                            customContentMap[item['showcaseId']]['json']
                        );
                        let savedSearchObj =
                            savedSearchMap[item['search_title']];
                        let result = updateCustomContent(
                            customContentObj,
                            savedSearchObj
                        );
                        // console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + ((new Date()).getSeconds()), "[-] result: ", result);

                        // update custom_content lookup table when the customContentObj was truly updated
                        if (result['isUpdate']) {
                            // update the custom content entry with the updated customContentObj
                            let updatedEntry =
                                customContentMap[item['showcaseId']];
                            updatedEntry['json'] = JSON.stringify(
                                result['updatedCustomContent']
                            );
                            let updatedURL =
                                customContentURL + '/' + updatedEntry['_key'];
                            updateLookupTable(updatedURL, updatedEntry);
                        }
                    }
                }
            }
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function storeSavedSearchesInLocalStorage(saved_searches) {
    let standardESApps = [
        'SA-AccessProtection',
        'DA-ESS-AccessProtection',
        'SplunkEnterpriseSecuritySuite',
        'SA-AuditAndDataProtection',
        'SA-Utils',
        'DA-ESS-ThreatIntelligence',
        'SA-EndpointProtection',
        'Splunk_SA_CIM',
        'DA-ESS-NetworkProtection',
        'DA-ESS-EndpointProtection',
        'DA-ESS-ContentUpdate',
        'SA-IdentityManagement',
        'DA-ESS-IdentityManagement',
        'SA-NetworkProtection',
        'SA-ThreatIntelligence',
        'SA-UEBA',
    ];
    let standardIrrelevantApps = [
        'splunk_archiver',
        'splunk_monitoring_console',
        'splunk_instrumentation',
    ];

    // Store the saved searches in local storage for use in dashboards
    var content = [];
    for (let i = 0; i < saved_searches.length; i++) {
        let search = saved_searches[i];
        if (typeof search.name == 'undefined') {
            search.name = '';
        }
        // console.log(search)
        if (
            search.name.indexOf(' - Lookup Gen') == -1 &&
            search.name.indexOf(' - Threat Gen') == -1 &&
            search.name.indexOf(' - Context Gen') == -1 &&
            standardIrrelevantApps.indexOf(search.app) == -1
        ) {
            var obj = {};
            content.push(search);
        }
    }
    // console.log(content)
    localStorage[localStoragePreface + '-savedsearches-updated'] =
        new Date().toISOString();

    // // console.log("calling Add Data for savedsearches")
    // localStorage[localStoragePreface + "-savedsearches"] =
    //     JSON.stringify(content)

    return addData(KEY_SAVEDSEARCHES, JSON.stringify(content));
}

async function fetchSavedSearches() {
    require(['components/splunk/Searches'], function(Searches) {
        Searches.setSearch('fetchSavedSearches', {
            autostart: true,
            targetJobIdTokenName: 'fetchSavedSearches',
            searchString: [
                '| savedsearch "Generate Local Saved Search Lookup"',
            ],
            onDoneCallback: function onDoneCallback(sm) {
                let results = sm.data('results', {
                    output_mode: 'json',
                    count: 0, // get all results
                });
                results.on('data', function() {
                    // The full data object
                    storeSavedSearchesInLocalStorage(results.data().results)
                        .then(() => {
                            autoUpdateCustomContents(localStorage);
                        })
                        .catch((error) => {
                            console.log('Error: ', error);
                        });
                });
            },
        });
    });
}

var mylink = $('<a href="#">Demos Only - Reset Everything</a>').click(
    function() {
        clearDemo();
        location.reload();
    }
);
$('div[data-view="views/shared/splunkbar/help/Master"]')
    .find('ul')
    .append($('<li></li>').append(mylink));

function attachConfigurationLinkToSetupMenu() {
    $("li a:contains('3 - Review App Configuration')").click(function(e) {
        if ($('#systemConfig').length) {
            e.preventDefault();
            $(this).closest("[data-view='views/shared/MenuDialog']").hide();
            $('#systemConfig').css('display', 'block');
            $('#systemConfigBackdrop').css('display', 'block');
        }
        return true;
    });
}
attachConfigurationLinkToSetupMenu();

// Metrics
if (
    typeof localStorage[localStoragePreface + '-metrics-numViews'] ==
    'undefined' ||
    localStorage[localStoragePreface + '-metrics-numViews'] == 'undefined'
) {
    localStorage[localStoragePreface + '-metrics-numViews'] = 1;
} else {
    localStorage[localStoragePreface + '-metrics-numViews']++;
}

var myPage = splunkjs.mvc.Components.getInstance('env').toJSON().page;
if (
    window.location.search.indexOf('ml_toolkit.dataset') != -1 ||
    window.location.search.indexOf('showcase=') != -1
) {
    // https://css-tricks.com/snippets/jquery/get-query-params-object/
    jQuery.extend({
        getQueryParameters: function(str) {
            return (str || document.location.search)
                .replace(/(^\?)/, '')
                .split('&')
                .map(
                    function(n) {
                        return (n = n.split('=')), (this[n[0]] = n[1]), this;
                    }.bind({})
                )[0];
        },
    });
    var queryParams = $.getQueryParameters();
    if (window.location.search.indexOf('ml_toolkit.dataset') != -1) {
        myPage += ' -- ' + decodeURIComponent(queryParams['ml_toolkit.dataset']);
    } else {
        myPage += ' -- ' + decodeURIComponent(queryParams['showcase']);
    }
}
if (
    typeof localStorage[localStoragePreface + '-metrics-pageViews'] ==
    'undefined' ||
    localStorage[localStoragePreface + '-metrics-pageViews'] == 'undefined'
) {
    var init = {};
    init[myPage] = 1;
    localStorage[localStoragePreface + '-metrics-pageViews'] =
        JSON.stringify(init);
} else {
    var pageMetrics = JSON.parse(
        localStorage[localStoragePreface + '-metrics-pageViews']
    );
    if (typeof pageMetrics[myPage] == 'undefined') {
        pageMetrics[myPage] = 1;
    } else {
        pageMetrics[myPage]++;
    }
    localStorage[localStoragePreface + '-metrics-pageViews'] =
        JSON.stringify(pageMetrics);
}

// Utility

function waitForEl(selector, callback) {
    var poller1 = setInterval(function() {
        $jObject = jQuery(selector);
        if ($jObject.length < 1) {
            return;
        }
        clearInterval(poller1);
        callback($jObject);
    }, 20);
}

function triggerError(textStatus, banner) {
    // set the runtime environment, which controls cache busting
    var runtimeEnvironment = 'production';

    // set the build number, which is the same one being set in app.conf
    var build = '10138';

    // get app and page names
    var pathComponents = location.pathname.split('?')[0].split('/');
    var appName = 'Splunk_Security_Essentials';
    var pageIndex = pathComponents.indexOf(appName);
    var pageName = pathComponents[pageIndex + 1];

    // path to the root of the current app
    var appPath = '../app/' + appName;

    var requireConfigOptions = {
        paths: {
            // app-wide path shortcuts
            components: appPath + '/components',
            vendor: appPath + '/vendor',
            Options: appPath + '/components/data/parameters/Options',

            // requirejs loader modules
            text: appPath + '/vendor/text/text',
            json: appPath + '/vendor/json/json',
            css: appPath + '/vendor/require-css/css',

            // srcviewer shims
            prettify: appPath + '/vendor/prettify/prettify',
            showdown: appPath + '/vendor/showdown/showdown',
            codeview: appPath + '/vendor/srcviewer/codeview',
        },
        config: {
            Options: {
                // app-wide options
                options: {
                    appName: 'Splunk_Security_Essentials',
                    // the number of points that's considered "large" - how each plot handles this is up to it
                    plotPointThreshold: 1000,
                    maxSeriesThreshold: 1000,
                    smallLoaderScale: 0.4,
                    largeLoaderScale: 1,
                    defaultModelName: 'default_model_name',
                    defaultRoleName: 'default',
                    dashboardHistoryTablePageSize: 5,
                },
            },
        },
    };
    require.config(requireConfigOptions);
    require([
        'jquery',
        Splunk.util.make_full_url(
            '/static/app/Splunk_Security_Essentials/components/controls/Modal.js'
        ),
    ], function($, Modal) {
        // Now we initialize the Modal itself
        var myModal = new Modal(
            'errorModal',
            {
                title: 'Error!',
                backdrop: 'static',
                keyboard: false,
                destroyOnHide: true,
                type: 'wide',
            },
            $
        );

        $(myModal.$el).on('show', function() { });
        if (!banner || banner == '') {
            banner = 'Received the following error:';
        }
        if (typeof textStatus == 'string') {
            myModal.body.append(
                $('<h3>' + banner + '</h3>'),
                $('<p>').text(textStatus)
            );
        } else {
            myModal.body.append($('<h3>' + banner + '</h3>'), $(textStatus));
        }
        myModal.footer.append(
            $('<button>')
                .attr({
                    type: 'button',
                    'data-bs-dismiss': 'modal',
                    'data-dismiss': 'modal',
                })
                .addClass('btn btn-primary')
                .text('Close')
                .on('click', function() {
                    // Not taking any action here
                })
        );
        myModal.show(); // Launch it!
    });

    try {
        let telemetry_banner = $('<div>').append(banner).html();
        let telemetry_msg = $('<div>').append(textStatus).html();
        require([
            'components/data/sendTelemetry',
            'json!' +
            $C['SPLUNKD_PATH'] +
            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config',
        ], function(Telemetry, appConfig) {
            let record = {
                banner: telemetry_banner,
                msg: telemetry_msg,
                locale: $C['LOCALE'],
                url_anon: window.location.href
                    .replace(/http:\/\/.*?\//, 'http://......../')
                    .replace(/https:\/\/.*?\//, 'https://......../'),
                page: splunkjs.mvc.Components.getInstance('env').toJSON()[
                    'page'
                ],
                splunk_version:
                    splunkjs.mvc.Components.getInstance('env').toJSON()[
                    'version'
                    ],
            };
            for (let i = 0; i < appConfig.length; i++) {
                if (
                    appConfig[i].param == 'demoMode' &&
                    appConfig[i].value == 'true'
                ) {
                    record.demoMode = true;
                }
            }
            Telemetry.SendTelemetryToSplunk('ErrorOccurred', record);
        });
    } catch (error) {
        // Nothing
    }
}

function checkForErrors(ShowcaseInfo) {
    require([
        'jquery',
        Splunk.util.make_full_url(
            '/static/app/Splunk_Security_Essentials/components/controls/Modal.js'
        ),
    ], function($, Modal) {
        // console.log("Checking for errors..", ShowcaseInfo['throwError'])
        if (ShowcaseInfo['throwError']) {
            let error = $(
                '<table class="table"><thead><tr><th>Description</th><th>Message</th></tr></thead></table>'
            );
            let errorTable = $('<tbody>');
            // console.log("Looking at ShowcaseInfo - Debug - Length", ShowcaseInfo['debug'].length)
            for (let g = 0; g < ShowcaseInfo['debug'].length; g++) {
                // console.log("Got a showcase event", ShowcaseInfo['debug'][g])
                if (typeof ShowcaseInfo['debug'][g] == 'object') {
                    try {
                        let message = ShowcaseInfo['debug'][g];
                        let stackTrace = '';

                        if (message.status && message.status == 'ERROR') {
                            if (message.traceback) {
                                stackTrace = $(
                                    '<a style="float: right; margin-left: 5px;" title="Stack Trace" ><i class="icon-code" /></a>'
                                )
                                    .attr('data-content', message.traceback)
                                    .click(function(evt) {
                                        let obj = $(evt.target);
                                        if (obj.prop('tagName') == 'I') {
                                            obj = obj.closest('a');
                                        }
                                        let stacktrace =
                                            obj.attr('data-content');

                                        let myModal = new Modal(
                                            'stackTrace',
                                            {
                                                title: 'Stack Trace',
                                                backdrop: 'static',
                                                keyboard: false,
                                                destroyOnHide: true,
                                                type: 'wide',
                                            },
                                            $
                                        );
                                        myModal.body.append(
                                            $('<pre>').text(stacktrace)
                                        );
                                        myModal.footer.append(
                                            $('<button>')
                                                .attr({
                                                    type: 'button',
                                                    'data-dismiss': 'modal',
                                                    'data-bs-dismiss': 'modal',
                                                })
                                                .addClass('btn btn-primary')
                                                .text('Close')
                                        );
                                        myModal.show();
                                    });
                                // console.log("Got a stack trace", stackTrace)
                            } else {
                                // console.log("No stack trace!", message)
                            }
                            errorTable.append(
                                $('<tr>').append(
                                    $('<td>' + message.description + '</td>'),
                                    $(
                                        '<td>' + message.message + '</td>'
                                    ).prepend(stackTrace)
                                )
                            );
                        }
                    } catch (err) {
                        // no handling
                    }
                } else if (
                    typeof ShowcaseInfo['debug'][g] == 'string' &&
                    ShowcaseInfo['debug'][g].indexOf('"status": "ERROR"') >= 0
                ) {
                    // console.log("Got a valid error", ShowcaseInfo['debug'][g])
                    try {
                        let message = JSON.parse(ShowcaseInfo['debug'][g]);
                        if (message.status && message.status == 'ERROR') {
                            if (message.traceback) {
                                stackTrace = $(
                                    '<a style="float: right; margin-left: 5px;" title="Stack Trace" ><i class="icon-code" /></a>'
                                )
                                    .attr('data-content', message.traceback)
                                    .click(function(evt) {
                                        let obj = $(evt.target);
                                        if (obj.prop('tagName') == 'I') {
                                            obj = obj.closest('a');
                                        }
                                        let stacktrace =
                                            obj.attr('data-content');

                                        let myModal = new Modal(
                                            'stackTrace',
                                            {
                                                title: 'Stack Trace',
                                                backdrop: 'static',
                                                keyboard: false,
                                                destroyOnHide: true,
                                                type: 'wide',
                                            },
                                            $
                                        );
                                        myModal.body.append(
                                            $('<pre>').text(stacktrace)
                                        );
                                        myModal.footer.append(
                                            $('<button>')
                                                .attr({
                                                    type: 'button',
                                                    'data-dismiss': 'modal',
                                                    'data-bs-dismiss': 'modal',
                                                })
                                                .addClass('btn btn-primary')
                                                .text('Close')
                                        );
                                        myModal.show();
                                    });
                                // console.log("Got a stack trace", stackTrace)
                            } else {
                                // console.log("No stack trace!", message)
                            }
                            errorTable.append(
                                $('<tr>').append(
                                    $('<td>' + message.description + '</td>'),
                                    $(
                                        '<td>' + message.message + '</td>'
                                    ).prepend(stackTrace)
                                )
                            );
                        }
                    } catch (err) {
                        // no handling
                    }
                }
            }
            if (errorTable.find('tr').length > 0) {
                error.append(errorTable);
                $('.dashboard-view-controls').prepend(
                    $(
                        '<button style="margin-left: 5px;" class="btn"><span style="font-size: 16px; font-weight: bolder; color: red;">!</span></button>'
                    ).click(function() {
                        triggerError(error);
                    })
                );
            }
        }
        // console.log("Ending ShowcaseInfo", ShowcaseInfo)
    });
}

function makeHelpLinkURL(productId = '', location = '', version = '') {
    return (
        'https://quickdraw.splunk.com/redirect/?product=' +
        productId +
        '&location=' +
        location +
        '&version=' +
        version
    );
}
window.makeHelpLinkURL = makeHelpLinkURL;
function setbookmark_status(name, showcaseId, status, action, newNotes) {
    if (!action) {
        action = splunkjs.mvc.Components.getInstance('env').toJSON()['page'];
    }
    require([
        'components/data/sendTelemetry',
        'json!' +
        $C['SPLUNKD_PATH'] +
        '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config',
    ], function(Telemetry, appConfig) {
        let record = { status: status, name: name, selectionType: action };
        for (let i = 0; i < appConfig.length; i++) {
            if (
                appConfig[i].param == 'demoMode' &&
                appConfig[i].value == 'true'
            ) {
                record.demoMode = true;
            }
        }
        Telemetry.SendTelemetryToSplunk('BookmarkChange', record);
    });

    require(['splunkjs/mvc/utils', 'splunkjs/mvc/searchmanager'], function(
        utils,
        SearchManager
    ) {
        if (
            typeof splunkjs.mvc.Components.getInstance(
                'logBookmarkChange-' + name.replace(/[^a-zA-Z0-9]/g, '_')
            ) == 'object'
        ) {
            splunkjs.mvc.Components.revokeInstance(
                'logBookmarkChange-' + name.replace(/[^a-zA-Z0-9]/g, '_')
            );
        }
        new SearchManager(
            {
                id: 'logBookmarkChange-' + name.replace(/[^a-zA-Z0-9]/g, '_'),
                latest_time: '0',
                autostart: true,
                earliest_time: 'now',
                search:
                    '| makeresults | eval app="' +
                    utils.getCurrentApp() +
                    '", page="' +
                    splunkjs.mvc.Components.getInstance('env').toJSON()[
                    'page'
                    ] +
                    '", user="' +
                    $C['USERNAME'] +
                    '", name="' +
                    name +
                    '", status="' +
                    status +
                    '" | collect index=_internal sourcetype=essentials:bookmark',
                app: utils.getCurrentApp(),
                auto_cancel: 90,
            },
            { tokens: false }
        );
    });

    if (typeof window.ShowcaseInfo !== 'undefined') {
        for (var i = 0; i < window.ShowcaseInfo.roles.default.summaries; i++) {
            if (
                name ==
                window.ShowcaseInfo.summaries[
                window.ShowcaseInfo.roles.default.summaries[i]
                ]
            ) {
                window.ShowcaseInfo.summaries[
                    window.ShowcaseInfo.roles.default.summaries[i]
                ].bookmark_status = status;
            }
        }
        window.ShowcaseInfo.summaries[showcaseId].bookmark_status = status;
    }

    let notes = '';
    if (
        typeof window.ShowcaseInfo !== 'undefined' &&
        typeof window.ShowcaseInfo.summaries[showcaseId] != 'undefined' &&
        typeof window.ShowcaseInfo.summaries[showcaseId].bookmark_notes !=
        'undefined'
    ) {
        notes = window.ShowcaseInfo.summaries[showcaseId].bookmark_notes;
    } else if (
        typeof summary != 'undefined' &&
        summary.bookmark_notes != 'undefined'
    ) {
        notes = summary.bookmark_notes;
    }
    if (typeof newNotes != 'undefined') {
        notes = newNotes + '\n\n' + notes;
    }
    var record = {
        _time: new Date().getTime() / 1000,
        _key: showcaseId,
        showcase_name: name,
        status: status,
        notes: notes,
        user: Splunk.util.getConfigValue('USERNAME'),
    };

    $.ajax({
        url:
            $C['SPLUNKD_PATH'] +
            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' +
            record['_key'] +
            '"}',
        type: 'GET',
        contentType: 'application/json',
        async: false,
        success: function(returneddata) {
            if (returneddata.length == 0) {
                // New

                $.ajax({
                    url:
                        $C['SPLUNKD_PATH'] +
                        '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/',
                    type: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    contentType: 'application/json',
                    async: false,
                    data: JSON.stringify(record),
                    success: function(returneddata) {
                        bustCache();
                        newkey = returneddata;
                    },
                    error: function(xhr, textStatus, error) {
                        bustCache();
                        triggerError('Error saving bookmark!');
                    },
                });
            } else {
                // Old
                $.ajax({
                    url:
                        $C['SPLUNKD_PATH'] +
                        '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/' +
                        record['_key'],
                    type: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    async: false,
                    data: JSON.stringify(record),
                    success: function(returneddata) {
                        bustCache();
                        newkey = returneddata;
                    },
                    error: function(xhr, textStatus, error) {
                        bustCache();
                        triggerError('Error saving bookmark!');
                        //              console.log("Error Updating!", xhr, textStatus, error)
                    },
                });
            }
        },
        error: function(error, data, other) {
            //     console.log("Error Code!", error, data, other)
        },
    });
}

// /////
// / Handle Busting of the Cache Used for ShowcaseInfo to speed page load
// /////

// Model: 0 = not scheduled, 1 = scheduled, 2 = in progress, 3 = got a request mid-bust, schedule another to run after it completes.
window.isbustscheduled = 0;
function bustCache(updateTime) {
    // Disabling cache busting 'cause it's not worth the effort and doesn't actually improve performance. (Discovered that time to download was the real problem, not time to gen the showcase)
    return;

    // console.log("Got a request, current", isbustscheduled, updateTime)
    if (updateTime) {
        window.isbustscheduled = 2;
        require([
            'json!' +
            $C['SPLUNKD_PATH'] +
            '/services/SSEShowcaseInfo?locale=' +
            window.localeString ||
            '' + '&bust=' + Math.round(Math.random() * 10000000),
        ], function() {
            if (window.isbustscheduled == 3) {
                // someone requested it while we were busting
                bustCache(true);
            }
            window.isbustscheduled = 0;
        });
    } else if (window.isbustscheduled == 0) {
        window.isbustscheduled = 1;
        // console.log("scheduled!")
        setTimeout(function() {
            bustCache(true);
        }, 3000);
    } else if (window.isbustscheduled == 2) {
        // A bust is currently in progress
        window.isbustscheduled = 3;
    }
}
if (
    location.href.indexOf('127.0.0.1') >= 0 ||
    location.href.indexOf('localhost') >= 0
) {
    localStorage['sse-require_cache_update'] = 'requireupdate';
} else {
    if (localStorage['sse-require_cache_update'] == 'requireupdate') {
        setTimeout(function() {
            localStorage['sse-require_cache_update'] = 'cached';
        }, 5000);
    }
}
$(window).on('beforeunload', function() {
    if (window.isbustscheduled == 1 || window.isbustscheduled == 3) {
        localStorage['sse-require_cache_update'] = 'requireupdate';
        bustCache(true);
    }
});

function cleanLink(url, httpReq = true) {
    if (typeof url === 'string' || url instanceof String) {
        if (!httpReq || url.match(/^https?:/)) {
            return url.replace(
                /(["'><\)\(]|javascript\s*:|onmouseover\s*=)/g,
                ''
            );
        }
    }
    return '';
}

function querySplunkbase(obj, params) {
    var request = $.ajax({
        url: $C['SPLUNKD_PATH'] + '/services/querySplunkbase?' + params,
        async: true,
        type: 'GET',
        cache: 'false',
        contentType: 'application/json',
    }).fail(function(xhr, textStatus, error) {
        console.log('Splunkbase API failed', xhr, textStatus, error);
    });
    return request;
}

// ////
// Allow this functionality to run anywhere
// ////

function showMITREElement(type, name) {
    require([
        'underscore',
        'jquery',
        'components/controls/Modal',
        'json!' +
        $C['SPLUNKD_PATH'] +
        '/services/pullJSON?config=mitreattack&locale=' +
        window.localeString,
    ], function(_, $, Modal, mitre_attack) {
        let desiredObject = {};
        let pretty_type = '';
        let source = '';
        let drilldown_label = '';
        let mitre_drilldown_url = '';
        if (type == 'x-mitre-tactic') {
            pretty_type = _('MITRE ATT&CK Tactic').t();
            drilldown_label = 'mitre_tactic_display';
        } else if (type == 'attack-pattern') {
            pretty_type = _('MITRE ATT&CK Technique').t();
            drilldown_label = 'mitre_technique_display';
        } else if (type == 'intrusion-set') {
            pretty_type = _('MITRE ATT&CK Threat Group').t();
            drilldown_label = 'mitre_threat_groups';
        }
        // console.log("Got a request for",type, name);
        for (let i = 0; i < mitre_attack.objects.length; i++) {
            if (
                mitre_attack.objects[i].type == type &&
                (mitre_attack.objects[i].name == name ||
                    mitre_attack.objects[i].external_references[0]
                        .external_id == name)
            ) {
                desiredObject = mitre_attack.objects[i];
                source = 'MITRE Enterprise ATT&CK';
                break;
            }
        }
        if (Object.keys(desiredObject).length == 0) {
            for (let i = 0; i < mitre_preattack.objects.length; i++) {
                if (
                    mitre_preattack.objects[i].type == type &&
                    mitre_preattack.objects[i].name == name
                ) {
                    desiredObject = mitre_preattack.objects[i];
                    source = 'MITRE PRE-ATT&CK';
                    break;
                }
            }
        }
        name = desiredObject.name;
        let mitreId = desiredObject.external_references[0].external_id;
        // Now we initialize the Modal itself
        var myModal = new Modal(
            'mitreExplanation',
            {
                title: pretty_type + ': ' + mitreId + ' - ' + name,
                backdrop: 'static',
                keyboard: true,
                destroyOnHide: true,
            },
            $
        );
        myModal.$el.addClass('modal-extra-wide');
        let myBody = $('<div>');
        if (Object.keys(desiredObject).length == 0) {
            myBody.html('<p>Application Error -- ' + name + ' not found.</p>');
        } else {
            for (
                let i = 0;
                i < desiredObject['external_references'].length;
                i++
            ) {
                if (
                    desiredObject['external_references'][i].url &&
                    desiredObject['external_references'][i].url.indexOf(
                        'https://attack.mitre.org/'
                    ) >= 0
                ) {
                    id = desiredObject['external_references'][i].external_id;
                    mitre_drilldown_url =
                        desiredObject['external_references'][i].url;
                }
            }

            myBody.append('<h4>' + _('Description').t() + '</h4>');

            if (desiredObject['description']) {
                myBody.append(
                    $('<p style="white-space: pre-line">').text(
                        desiredObject['description'].replace(
                            /\[([^\]]*)\]\(.*?\)/g,
                            '$1'
                        )
                    )
                );
            }

            // // Would need to resolve this to the pretty name, which seems exhausting. Punting for now.
            // if(type == "attack-pattern"){
            //     let phases = []
            //     for(let i = 0; i < desiredObject['kill_chain_phases'].length; i++){
            //         phases.append(desiredObject['kill_chain_phases'][i].phase_name)
            //     }
            //     myBody.append("<h4>" + _("MITRE ATT&CK Tactics Using Technique").t() + "</h4>")
            //     myBody.append($("<p>").text(phases.join(", ")))
            // }

            if (desiredObject['x_mitre_detection']) {
                myBody.append('<h4>' + _('Detection Overview').t() + '</h4>');
                myBody.append(
                    $('<p style="white-space: pre-line">').text(
                        desiredObject['x_mitre_detection'].replace(
                            /\[([^\]]*)\]\(.*?\)/g,
                            '$1'
                        )
                    )
                );
            }

            myBody.append('<h4>' + _('Links').t() + '</h4>');
            myBody.append(
                $('<p>').append(
                    $('<a target="_blank" class="external drilldown-icon">')
                        .text(_('MITRE ATT&CK Site').t())
                        .attr('href', mitre_drilldown_url)
                )
            );
            myBody.append(
                $('<p>').append(
                    $('<a target="_blank" class="external drilldown-icon">')
                        .text(_('Splunk Security Essentials Content').t())
                        .attr(
                            'href',
                            'contents#' +
                            drilldown_label +
                            '=' +
                            encodeURIComponent(name.replace(/ /g, '_'))
                        )
                )
            );

            myBody.append('<h4>' + _('Source').t() + '</h4>');
            myBody.append($('<p>').text(source));
        }
        myModal.body.append(myBody);

        myModal.footer.append(
            $('<button>')
                .attr({
                    type: 'button',
                    'data-dismiss': 'modal',
                    'data-bs-dismiss': 'modal',
                })
                .addClass('btn btn-primary')
                .text(_('Close').t())
                .on('click', function() {
                    // Not taking any action here
                })
        );
        myModal.show(); // Launch it!
    });
}
window.showMITREElement = showMITREElement;

function prettyPrintSPL(spl, linebreak = '\n') {
    spl = spl.split('[|').join(linebreak + '[|');
    spl = spl.split('[ |').join(linebreak + '[ |');
    spl = spl.split('[search').join(linebreak + '[search');
    spl = spl.split('[ search').join(linebreak + '[ search');
    spl = spl.split(']|').join(linebreak + ']|');
    spl = spl.split('] |').join(linebreak + '] |');
    temp = spl.split('| ');
    if (temp[0] == '') {
        temp.shift();
        temp[0] = '| ' + temp[0];
        spl = temp.join(linebreak + '| ');
    } else {
        spl = spl.split('| ').join(linebreak + '| ');
    }
    spl = spl.split(linebreak + linebreak).join(linebreak);
    spl = spl.replace(/  +/g, ' ').trim();
    return spl;
}

function generateAnnotationsContainer(summary) {
    var annotations = {};
    if (
        typeof summary['mitre_technique'] != 'undefined' &&
        summary['mitre_technique'] != '' &&
        summary['mitre_technique'] != 'None'
    ) {
        annotations['mitre_attack'] = summary['mitre_technique']
            .split('|')
            .filter((i) => i);
    }
    if (
        typeof summary['killchain'] != 'undefined' &&
        summary['killchain'] != '' &&
        summary['killchain'] != 'None'
    ) {
        annotations['kill_chain_phases'] = summary['killchain']
            .split('|')
            .filter((i) => i);
    }
    if (
        typeof summary['escu_cis'] != 'undefined' &&
        summary['escu_cis'] != ''
    ) {
        annotations['escu_cis'] = summary['escu_cis']
            .split('|')
            .filter((i) => i);
    }
    if (
        typeof summary['escu_nist'] != 'undefined' &&
        summary['escu_nist'] != ''
    ) {
        annotations['escu_nist'] = summary['escu_nist']
            .split('|')
            .filter((i) => i);
    }
    // SSE Default fields
    if (typeof summary['id'] != 'undefined' && summary['id'] != '') {
        annotations['sse-showcaseId'] = summary['id'].split('|');
    }
    if (typeof summary['name'] != 'undefined' && summary['name'] != '') {
        annotations['sse-showcaseName'] = summary['name'].split('|');
    }
    if (
        typeof summary['category'] != 'undefined' &&
        summary['category'] != '' &&
        summary['category'] != 'None'
    ) {
        annotations['sse-category'] = summary['category']
            .split('|')
            .filter((i) => i);
    }
    return annotations;
}

function setAppConfig(param, value, deferral) {
    let record = {
        _key: param,
        param: param,
        value: value,
        user: $C['USERNAME'],
        _time: Date.now() / 1000,
    };
    $.ajax({
        url:
            $C['SPLUNKD_PATH'] +
            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config/?query={"_key": "' +
            record['_key'] +
            '"}',
        type: 'GET',
        contentType: 'application/json',
        async: false,
        success: function(returneddata) {
            if (returneddata.length == 0) {
                $.ajax({
                    url:
                        $C['SPLUNKD_PATH'] +
                        '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config/',
                    type: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    async: false,
                    data: JSON.stringify(record),
                    success: function(returneddata) {
                        if (deferral) {
                            deferral.resolve(true, returneddata);
                        }
                    },
                    error: function(xhr, textStatus, error) {
                        if (deferral) {
                            deferral.resolve(false, error);
                        }
                    },
                });
            } else {
                // Old
                $.ajax({
                    url:
                        $C['SPLUNKD_PATH'] +
                        '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config/' +
                        record['_key'],
                    type: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    async: false,
                    data: JSON.stringify(record),
                    success: function(returneddata) {
                        if (deferral) {
                            deferral.resolve(true, returneddata);
                        }
                    },
                    error: function(xhr, textStatus, error) {
                        if (deferral) {
                            deferral.resolve(false, error);
                        }
                    },
                });
            }
        },
        error: function(error, data, other) {
            //     console.log("Error Code!", error, data, other)
        },
    });
}
window.setAppConfig = setAppConfig;

function addShowcaseACL(url, data, searchName, showcaseId) {
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey(),
        },
        async: false,
        data: data,
        success: function() {
            $('#ESCorrelationProcessing').removeClass(
                'button-spinner spinner-border'
            );
            $('#ESCorrelationProcessing').html(
                'ES Correlation Search Enabled! We recommend <a href="' +
                Splunk.util.make_full_url(
                    '/app/SplunkEnterpriseSecuritySuite/correlation_search_edit?search=' +
                    searchName
                ) +
                '">you click here</a> to continue editing the Notable Event to customize the display fields.'
            );
            // Add to local search mappings
            addContentMapping(searchName, showcaseId);
        },
        error: function() {
            // Try to update in case of failure
            // Handled 409 conflict for existing meta data.
            $.ajax({
                url: `${url}/${showcaseId}`,
                type: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                async: false,
                data: data,
                success: function() {
                    $('#ESCorrelationProcessing').removeClass(
                        'button-spinner spinner-border'
                    );
                    $('#ESCorrelationProcessing').html(
                        'ES Correlation Search Enabled! We recommend <a href="' +
                        Splunk.util.make_full_url(
                            '/app/SplunkEnterpriseSecuritySuite/correlation_search_edit?search=' +
                            searchName
                        ) +
                        '">you click here</a> to continue editing the Notable Event to customize the display fields.'
                    );
                    // Add to local search mappings
                    addContentMapping(searchName, showcaseId);
                },
                error: function(returneddata) {
                    $('#ESCorrelationProcessing').removeClass(
                        'button-spinner spinner-border'
                    );
                    $('#ESCorrelationProcessing').html(
                        'Setting ES Correlation Search permissions failed! Look for your search in the ES App Saved Searches (not ES Content Management). Once you change the app permissions to share with App or All Apps, it will be viewable (and configurable) in ES Content Management.'
                    );
                },
            });
        },
    });
}

window.addShowcaseACL = addShowcaseACL;

function getShowcaseInfo(onSuccess) {
    $.ajax({
        url:
            $C['SPLUNKD_PATH'] +
            '/services/SSEShowcaseInfo?fields=mini&locale=' +
            window.localeString,
        type: 'GET',
        contentType: 'application/json',
        async: true,
        success: onSuccess,
    });
}

function onSuccess(ShowcaseInfo) {
    doBump($, Splunk.util.make_full_url('/_bump'));
    getShowcaseInfo();
}

function doBump($, url) {
    $.ajax({
        url: url,
        type: 'GET',
        async: true,
        success: function(returneddata) {
            let baseBump = returneddata;
            let postValue = $(baseBump).find('input[type=hidden]').val();
            // console.log("Initial Bump Page", returneddata);
            $.ajax({
                url: url,
                type: 'POST',
                data: 'splunk_form_key=' + postValue,
                async: true,
                success: function(returneddata) {
                    // console.log("Final Bump", returneddata);
                },
                error: function(xhr, textStatus, error) {
                    // console.error("Error Updating!", xhr, textStatus, error);
                },
            });
        },
        error: function(xhr, textStatus, error) {
            // console.error("Error Updating!", xhr, textStatus, error);
        },
    });
}

function refreshShowcaseInfoMini() {
    getShowcaseInfo(onSuccess);
}

window.refreshShowcaseInfoMini = refreshShowcaseInfoMini;

/**
 * Init
 */

require([
    Splunk.util.make_full_url(
        '/static/app/Splunk_Security_Essentials/indexed.js'
    ),
], function(indexed) {
    const { initDatabase, addData, getData, KEY_SAVEDSEARCHES } = indexed;
    initDatabase()
        .then(() => {
            setTimeout(async() => {
                // Store the saved searches in local storage for use in dashboards. Threshold in Seconds
                var saved_searches_update_threshold = 300;

                var data = await getData(KEY_SAVEDSEARCHES);
                var updatedDate =
                    localStorage[`${localStoragePreface }-savedsearches-updated`];

                if (
                    !data ||
                    !updatedDate ||
                    Date.now() - Date.parse(updatedDate) >
                    saved_searches_update_threshold * 1000
                ) {
                    let age = Math.round((Date.now() - updatedDate) / 1000);
                    if (age > saved_searches_update_threshold || isNaN(age)) {
                        // Too old or doesn't exist so lets update
                        // console.log("Update as too old - Age (s): "+age)
                        fetchSavedSearches();
                    }
                }
            }, 500);
        })
        .catch((e) => {
            console.error(e);
        });
});
