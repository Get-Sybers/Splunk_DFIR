// window.trace_introspection_id = "DS001MAIL-ET03Send"


if(window.trace_introspection_id && ! window.setIntervalDebugTracer){
    let lastStage = ""
    let lastStatus = ""
    let localDebug = []
    let myElement =window.trace_introspection_id
    window.setIntervalDebugTracer = setInterval(function(){
        if(typeof intro_elements != "undefined" && intro_elements[myElement]){
            if(intro_elements[myElement]['status'] != lastStatus || intro_elements[myElement]['stage'] != lastStage){
                localDebug.push({"time": Date.now / 1000, "stage": intro_elements[myElement]['stage'], "status": intro_elements[myElement]['status']})
                // console.log("STATUSCHANGE", {"time": Date.now() / 1000, "stage": intro_elements[myElement]['stage'], "status": intro_elements[myElement]['status'], object: intro_elements[myElement]})
                lastStage = intro_elements[myElement]['stage']
                lastStatus = intro_elements[myElement]['status']
            }
        }
    }, 10)
}
require(['jquery'], function(){
        // The downside of multiple files.. I have to deal with this kind of ugliness. I know.
        let window_data_inventory_eventtypes_established = $.Deferred();
        let number_of_checks_for_window_data_inventory_eventtypes = 0;
        let data_inventory_eventtypes_timer = setInterval(function(){
            number_of_checks_for_window_data_inventory_eventtypes++;
            if(window.data_inventory_eventtypes && window.data_inventory_eventtypes > 20){
                // console.log("Got the window.data_inventory_eventtypes!", window.data_inventory_eventtypes)
                clearInterval(data_inventory_eventtypes_timer);
                window_data_inventory_eventtypes_established.resolve();
            }else if(number_of_checks_for_window_data_inventory_eventtypes == 20){
                // console.log("Timed out on looking for the window.data_inventory_eventtypes...")
                clearInterval(data_inventory_eventtypes_timer);
                window_data_inventory_eventtypes_established.resolve();
            }
        },200)

        $.when(window_data_inventory_eventtypes_established).then(function(){

            require([
                'jquery',
                'underscore',
                'splunkjs/mvc',
                "components/data/sendTelemetry",
                "components/controls/BuildTile",
                "splunkjs/mvc/searchmanager",
                "splunkjs/mvc/postprocessmanager",
                Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/Modal.js"),
                "json!" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/data/lightweight_cim_regex.json"),
                'json!' + $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString,
                'json!' + $C['SPLUNKD_PATH'] + '/services/pullJSON?config=data_inventory&locale=' + window.localeString,
                'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
                'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
            ], function(
                $,
                _,
                mvc,
                Telemetry,
                BuildTile,
                SearchManager,
                PostProcessManager,
                Modal,
                lightweight_cim_regex,
                ShowcaseInfo,
                data_inventory,
                data_inventory_products,
                data_inventory_eventtypes
            ){

                /// for some reason, it started remembering things that were loaded last session.... I do not know why. But I'm tired and I want this to work.
                if(data_inventory_products && data_inventory_products.length && data_inventory_products.length > 0){
                    for(let i = 0; i < data_inventory_products.length; i++){
                        if(data_inventory_products[i].loaded){
                            delete data_inventory_products[i].loaded
                        }
                    }
                }
                if(data_inventory_eventtypes && data_inventory_eventtypes.length && data_inventory_eventtypes.length > 0){
                    for(let i = 0; i < data_inventory_eventtypes.length; i++){
                        if(data_inventory_eventtypes[i].loaded){
                            delete data_inventory_eventtypes[i].loaded
                        }
                        if(data_inventory_eventtypes[i].jsonStatus){
                            delete data_inventory_eventtypes[i].jsonStatus
                        }
                    }
                }
                if(window.data_inventory_eventtypes && window.data_inventory_eventtypes.length && window.data_inventory_eventtypes.length > 0){
                    for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                        if(window.data_inventory_eventtypes[i].loaded){
                            delete window.data_inventory_eventtypes[i].loaded
                        }
                        if(window.data_inventory_eventtypes[i].jsonStatus){
                            delete window.data_inventory_eventtypes[i].jsonStatus
                        }
                    }
                }
                
        
            ////////////////////////////////
            ///// Global Variable Init /////
            ////////////////////////////////
        
            let global_sourcetype_to_vendor = [] // Storage of the regex used to determine the vendor.
            let data_inventory_eventtypes_hash_not_updated = {} // This is the array converted into a hash for the initial run through. It will not be updated later, it's only for the initial load.
            let data_inventory_products_hash_not_updated = {} // This is the array converted into a hash for the initial run through. It will not be updated later, it's only for the initial load.
            let allDSCNames = {} // This contains the pretty name for each DSC
            let kvstore_update_queue = {"data_inventory_eventtypes": {"status": 0, "queue": []}, "data_inventory_products": {"status": 0, "queue": []}}
            let debug_log = []
            window.debug_log = debug_log
            window.introspection_debug = false;
            debug_log_run_id = Math.round(Math.random()*100000000000000000).toString("16").toUpperCase()
            window.kvstore_update_queue = kvstore_update_queue
        
            ///////////////////////////////
            /////// CORE FUNCTIONS ////////
            ///////////////////////////////
            let superDebug = false;
            function sendDebug(obj){
                debug_log.push(obj);
                if(superDebug){
                    generateEventsFromDebugLog()
                }
            }

            //Function to replace matchAll which has poor browser support
            function findAll(regexPattern, sourceString) {
                let output = []
                let match
                // make sure the pattern has the global flag
                let regexPatternWithGlobal = RegExp(regexPattern,"g")
                while (match = regexPatternWithGlobal.exec(sourceString)) {
                    // get rid of the string copy
                    delete match.input
                    // store the match data
                    output.push(match)
                } 
                return output
            }

            let intro_elements = {};
            window.intro_elements = intro_elements;
            let intro_steps = {
                "step-init": {
                    "label": "Preparation: Pull Index / Source / Sourcetypes",
                    "load": function(id, callback){
                        // Grabs the object from the dict
                        // Calls addRow
                        
                        $("#introspectionStatus").find("#step-cim-init").append(newStatusRow("step-init", "new", "", "GLOBAL_SOURCETYPE_SOURCE_INDEX", "Pull Indexes, Sources, Sourcetypes"))
                        intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"] = {
                            "status": "new",
                            "_key": "GLOBAL_SOURCETYPE_SOURCE_INDEX",
                            "productId": "GLOBAL_SOURCETYPE_SOURCE_INDEX",
                            "stage": "step-init",
                            "jsonStatus": {"step-init": {"status": "pending"}}
                        }
                        
                    },
                    "updateDisplay": function(id, callback){
                        // Takes the ID, and then finds the row and updates with the status.
                        

                        let stage="step-init";
                        genericUpdateDisplay(id, stage);
                        // NOT COMPLETE
                        
                    },
                    "start": function(id, callback){
                        // Creates Search Manager
                        //      - Callbacks are minimal, just load the data to the dict in jsonStatus and pass of to handleResults
                        //      - Callback should delete the SM after it completes to avoid excessive memory usage
                        // Records the search time, name, SID and Stage it was instaniated under in the object
                        generateSearchManager("| tstats prestats=t count where index=* NOT index=_* earliest=-3d@d latest=@d by index sourcetype | eval source=\"N/A\" | tstats append=t prestats=t count where sourcetype=*winevent* index=* NOT index=_* earliest=-3d@d latest=@d by index source| eval sourcetype=coalesce(sourcetype, \"wineventlog\") | stats count by index source sourcetype", "GLOBAL_SOURCETYPE_SOURCE_INDEX", {"autostart": true, "override_auto_finalize": 10000}, function(id, data) {
                                sendDebug({"_time": Date.now()/1000 ,
                                    "stage": "step-init",
                                    "status": "searchComplete",
                                    "id": "GLOBAL_SOURCETYPE_SOURCE_INDEX"
                                })
                                    intro_steps["step-init"].updateDisplay(id)
                                    intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].data = data;
                                    intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status = "complete"
                                    intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].jsonStatus['step-init'].status = "complete"
                                
                                
                            }, function(id) {
                                intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status = "failure"
                                sendDebug({"_time": Date.now()/1000 ,
                                    "stage": "step-init",
                                    "status": "searchFAILED",
                                    "id": "GLOBAL_SOURCETYPE_SOURCE_INDEX"
                                })
                                intro_steps["step-init"].updateDisplay(id)
                                updateKVStore(id);
                                revokeSM(id)
                            }, function(id) {
                                intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status = "searching"
                                if(splunkjs.mvc.Components.getInstance(id) && splunkjs.mvc.Components.getInstance(id).attributes && splunkjs.mvc.Components.getInstance(id).attributes.data && splunkjs.mvc.Components.getInstance(id).attributes.data.sid){
                                    intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].sid = splunkjs.mvc.Components.getInstance(id).attributes.data.sid;
                                    let job=splunkjs.mvc.Components.getInstance(id)
                                    job.on('search:progress', function(properties) {
                                        // A bit hacky to correct search updates but it works. 
                                        $("#step-init_status").html($("#step-init_status").html().replace(/(complete \(\d{1,3}%\)|complete)/gi, 'complete ('+(Math.round(100*properties.content.doneProgress,0))+'%)'))
                                        //("#step-init_status").html($("#step-init_status").html().replace(/(0 currently searching)/gi, '1 currently searching'))
                                    });
                                    
                                    //console.log(job)
                                    intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status = "searching"
                                }
                                //console.log(splunkjs.mvc.Components.getInstance(id).attributes.data)
                                intro_steps["step-init"].updateDisplay(id)
                            }
                        )
                         
                        overallStatus()
                        
                    },
                    "isRelevant": function(id){
                        return false
                    },
                    "poll": function(id){
                        // Looks for the current SID and sees if it's still running.
                        // If it's not running, sets a 100 ms timeout and then double checks that the status is still searching before it...
                        // Grabs the data, passes it to handleResults, and then destroys the SM
                        let stage = "step-init"
        
                        // no polling for this... either it works or the world ends.
                        genericPoll(id, stage)

                    },
                    "status": function(){
                        // Stage Global
                        // Runs across all elements of this stage to update the status for this step
                        let success = 0
                        let failure = 0
                        let pending = 0
                        let searching = 0
                        
                        if(intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status){
                            if(intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status == "complete"){
                                success++
                            }else if(intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status == "searching"){
                                searching++
                            }else if(intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status == "failure"){
                                failure++
                            }else if(intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"].status == "new"){
                                pending++
                            }
                        }
                        //console.log(intro_elements["GLOBAL_SOURCETYPE_SOURCE_INDEX"])
                            
                        
                        let sourcetype_pending = pullStatusElementCount({"stage": "step-sourcetype", "status":"pending"}) + pullStatusElementCount({"stage": "step-sourcetype", "status":"blocked"})
                        if ( $("#step-init_status").text()=="" || (success + failure)>0) {
                            $("#step-init_status").text((success + failure) + ' ' + _('complete').t() + ' / ' + searching + ' ' + _('currently searching').t() + ' / 0 ' + _('queued').t() )
                        }
                        if (pending + searching > 0 && sourcetype_pending > 0) {
                            if ($("#step-init_statusIcon").find("img").length == 0) {
                                $("#step-init_statusIcon").html("<img title=\"Running\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">") // loading
                            }
                        } else if (success + failure > 0) {
                            $("#step-init_statusIcon").html('<i class="icon-check" style="color: green;" />') // done
                            //$("#step-init_status").text((success + failure) + ' ' + _('complete').t() + ' / ' + searching + ' ' + _('currently searching').t() + ' / 0 ' + _('queued').t() )
                            $("#step-init_status").html($("#step-init_status").html().replace(/\d{1,3} currently searching/gi, (searching)+' currently searching'))
                        } else {
                            $("#step-init_statusIcon").html("")
                            //$("#step-init_status").text((success + failure) + ' ' + _('complete').t() + ' / ' + searching + ' ' + _('currently searching').t() + ' / 0 ' + _('queued').t() )
                            $("#step-init_status").html($("#step-init_status").html().replace(/\d{1,3} currently searching/gi, (searching)+' currently searching'))
                            $("#step-init_status").html($("#step-init_status").html().replace(/\d{1,3} complete/gi, (success + failure)+' complete'))
                        }
                        return {"complete": success + failure, "remaining": pending, "searching": searching}
                    
                    }
                },
                "step-cim": {
                    "label": "Step One: CIM Searches",
                    "load": function(id, callback){
                        // Grabs the object from the dict
                        // Calls addRow
                        let object = intro_elements[id];
                        object['loaded']['step-cim'] = true;
                        if(object && object["basesearch"] && object["basesearch"] != "" && object["basesearch"] != null){
                            if(object.status == "searching"){
                                object.status = "pending"
                            }
                            // console.log("Loading with status", id, object['status'], object)
                            $("#introspectionStatus").find("#step-cim-tbody").append(newStatusRow("step-cim", object['status'], object['basesearch'], object["eventtypeId"], allDSCNames[object["eventtypeId"]]))
                            updateKVStore(id);
                            intro_steps["step-cim"].updateDisplay(id)
                        }
                        
                    },
                    "updateDisplay": function(id, callback){
                        // Takes the ID, and then finds the row and updates with the status.
                        let stage="step-cim";
                        genericUpdateDisplay(id, stage);
                        
                    },
                    "cancel": function(id){
                        
                        let stage="step-cim";
                        let object = intro_elements[id];
                        if (!object['jsonStatus']['step-cim']) {
                            object['jsonStatus']['step-cim'] = {'status': ""}
                        }
                        if (!object['jsonStatus']['step-cim']['status']) {
                            object['jsonStatus']['step-cim'] = {'status': "skipped"}
                        } else {
                            object['jsonStatus']['step-cim']['status'] = "skipped" 
                        }
                        object['status'] = "skipped" 
                        updateKVStore(id)
                        genericUpdateDisplay(id, stage);
                    },
                    "isRelevant": function(id){
                        if(id.match(/^DS\d\d\d/)){
                            return true;
                        }else{
                            return false;
                        }
                    },
                    "start": function(id, callback){
                        // Creates Search Manager
                        //      - Callbacks are minimal, just load the data to the dict in jsonStatus and pass of to handleResults
                        //      - Callback should delete the SM after it completes to avoid excessive memory usage
                        // Records the search time, name, SID and Stage it was instaniated under in the object
                        //intro_elements[id]["search_status"] = "searching";
                        intro_elements[id]["status"] = "searching";
                        intro_elements[id]["search_details"] = {
                            "search_started": Math.round(Date.now()/ 1000),
                            "search_name": id,
                            "sid": "",
                            "stage": "step-cim"
                        };
                        
                        let object = intro_elements[id];
        
                        generateSearchManager(object['basesearch'], object["eventtypeId"], {"autostart": true}, function(id, data) {
                                sendDebug({"_time": Date.now()/1000 ,
                                    "stage": intro_elements[id.replace(/^step-\w*-/, "")]['stage'],
                                    "status": "searchComplete",
                                    "id": id.replace(/^step-\w*-/, "")
                                })
                                intro_elements[id]["search_result"] = JSON.stringify(data);
                                if(! intro_elements[id]["jsonStatus"]){
                                    intro_elements[id]["jsonStatus"] = {}
                                }
                                intro_elements[id]["jsonStatus"]["step-cim"] = {}
                                intro_elements[id]["jsonStatus"]["step-cim"]["data"] = JSON.stringify(data);
                                intro_elements[id]["jsonStatus"]["step-cim"]["status"] = "success";
                                intro_steps["step-cim"].handleResults(id)
                                //intro_elements[id]["search_status"] = "complete";
                                intro_elements[id]["status"] = "complete";
                                intro_steps["step-cim"].updateDisplay(id)
                                updateKVStore(id);
                                revokeSM(id);
                            }, function(id) {
                                sendDebug({"_time": Date.now()/1000 ,
                                    "stage": intro_elements[id.replace(/^step-\w*-/, "")]['stage'],
                                    "status": "searchFAILED",
                                    "id": id.replace(/^step-\w*-/, "")
                                })
                                if(! intro_elements[id]["jsonStatus"]){
                                    intro_elements[id]["jsonStatus"] = {}
                                }
                                intro_elements[id]["jsonStatus"]["step-cim"]["status"] = "failure";
                                //intro_elements[id]["search_status"] = "failure";
                                intro_elements[id]["status"] = "failure";
                                intro_steps["step-cim"].updateDisplay(id)
                                updateKVStore(id);
                                revokeSM(id)
                            }, function(id) {
                                if(splunkjs.mvc.Components.getInstance(id) && splunkjs.mvc.Components.getInstance(id).attributes && splunkjs.mvc.Components.getInstance(id).attributes.data && splunkjs.mvc.Components.getInstance(id).attributes.data.sid){
                                    intro_elements[id]["search_details"]["sid"] = splunkjs.mvc.Components.getInstance(id).attributes.data.sid;
                                }
                                intro_steps["step-cim"].updateDisplay(id)
                            }
                        )
                        
                        overallStatus()
                        
                    },
                    "handleResults": function(id, callback){
                        // Applies business logic
                        // Calls the load for the next stage
                        let object = intro_elements[id];
                        let data = JSON.parse(object['search_result']);
                        let dsc = id;
                        let basesearch = object['basesearch']
                        // console.log("Results were called!", object);
                        let excludeFromNeedsReview = false

                        for(let i = 0; i < data.length; i++){
                            let searchString = ""
                            if(data[i].index) {
                                searchString += "index=\"" + data[i].index + "\" "
                            } else {
                                if (object['datamodel']) {
                                    searchString += "| from datamodel:"+object['datamodel'].split("|")[object['datamodel'].split("|").length-1]
                                }
                                excludeFromNeedsReview = true
                            }

                            if(data[i].sourcetype){
                                searchString += "sourcetype=\"" + data[i].sourcetype + "\" " 
                            }
                            if(data[i].source){
                                searchString += "source=\"" + data[i].source + "\" " 
                            }
                            
                            // console.log("AAAA, looking at ", id, searchString)
                            let sourcetypeLookup = checkVendor(data[i]);
                            if(sourcetypeLookup['match']){
                                // console.log("AAAA WHEW, New Sourcetype and index already mapped", data[i], searchString, dsc, sourcetypeLookup)

                                let record = {
                                    "_key": sourcetypeLookup['productId'] ,
                                    "productId": sourcetypeLookup['productId'],
                                    "eventtypeId": dsc,
                                    "productName": sourcetypeLookup['productName']|| "",
                                    "vendorName": sourcetypeLookup['vendorName']|| "",
                                    "created_time": Math.round(Date.now() / 1000),
                                    "updated_time": Math.round(Date.now() / 1000),
                                    "termsearch": searchString,
                                    "coverage_level": -1,
                                    "basesearch": searchString,
                                    "status": "analyzing",
                                    "stage": "step-eventsize",
                                    "metadata_json": JSON.stringify({"description": "*Automation: Added completely by automation for DSC " + dsc + ". \nSearch that generated it: " + basesearch + "*"}),
                                    "jsonStatus": {"init": {"status": "success"}, "step-sourcetype": {"status": "skipped"}, "step-eventsize": {"status": "pending"}, "step-volume": {"status": "pending"}}
                                }

                                if(intro_elements[sourcetypeLookup['productId']]){
                                    // console.log("AAAA, WHEW, New productId already exists!", record["_key"], data[i], searchString, dsc, sourcetypeLookup)
                                    
                                    //console.log("Add eventtypeId to the productId",dsc, sourcetypeLookup['productId']);
                                    //Add the already found dsc to the product record if it doesnt exist on the record already
                                    if (intro_elements[sourcetypeLookup['productId']]['eventtypeId'].indexOf(dsc) == -1) {
                                        intro_elements[sourcetypeLookup['productId']]['eventtypeId'] += "|" + dsc;
                                    updateKVStore(sourcetypeLookup['productId'])
                                    }

                                    let shouldCancel = false
                                    if(intro_elements[sourcetypeLookup['productId']].status == "searching"){
                                        shouldCancel = true
                                    }
                                    let a = JSON.stringify(intro_elements[sourcetypeLookup['productId']],null, 4)
                                    let b = JSON.stringify(record,null, 4)
                                    record = window.updateOrMergeProducts(intro_elements[sourcetypeLookup['productId']], record)
                                    //console.log("Here's my merge data", record, a, b)
                                    intro_elements[record.productId] = record;

                                    for(let i = 0; i < window.data_inventory_products[i].length;i++){
                                        if( window.data_inventory_products[i].productId == record.productId){
                                            window.data_inventory_products[i] = record;
                                        }
                                    }
                                    
                                    if(shouldCancel){
                                        //console.log("Should cancel", sourcetypeLookup['productId'])
                                        cancelSearch(sourcetypeLookup['productId'])
                                        $(".introspection-step-eventsize-search[data-id=" + record.productId.replace(/([^a-zA-Z0-9\-_=\.])/g, "\\$1") + "]").remove()
                                        $(".introspection-step-volume-search[data-id=" + record.productId.replace(/([^a-zA-Z0-9\-_=\.])/g, "\\$1") + "]").remove()
                                    }
                                    
                                    
                                }

                                intro_elements[record["_key"]] = record
                                updateOverallElementStatus(record.productId);
                                load(record.productId);
                                updateKVStore(record.productId);
                            }else{
                                // console.log("AAAA, Uncertain New Search to Handle!", searchString, dsc)
                                
                                if (!excludeFromNeedsReview) {
                                    let productId = "NEEDSREVIEW_" + searchString.replace("index=", "").replace("sourcetype=", "").replace("source=", "").replace(/ /g, "_").replace(/[^a-zA-Z0-9\_]/g, "") 
                                    // console.log("AAAA, Uncertain New Search to Handle!", searchString, dsc,intro_elements,productId)
                                    if(intro_elements[productId]){
                                        // console.log("Already found the productId");
                                        intro_elements[productId]['eventtypeId'] += "|" + dsc;
                                        updateKVStore(productId)
                                    }else{
                                        let record = {
                                            "_key": productId,
                                            "productId": productId,
                                            "eventtypeId": dsc,
                                            "productName": "",
                                            "vendorName": "",
                                            "created_time": Math.round(Date.now() / 1000),
                                            "updated_time": Math.round(Date.now() / 1000),
                                            "termsearch": searchString,
                                            "coverage_level": -1,
                                            "basesearch": searchString,
                                            "status": "needsConfirmation",
                                            "stage": "step-review",
                                            "metadata_json": JSON.stringify({"description": "*Automation: Added completely by automation for DSC " + dsc + ". \nSearch that generated it: " + basesearch + "*"}),
                                            "jsonStatus": {"init": {"status": "success"}, "step-review": {"status": "needsConfirmation"}}
                                        }
                                        intro_elements[productId] = record;
                                        updateKVStore(productId)
                                        
                                        load(productId);
                                        
                                    }
                                }
                            }
                            
                        }                
                        overallStatus()
                    },
                    "poll": function(id){
                        // Looks for the current SID and sees if it's still running.
                        // If it's not running, sets a 100 ms timeout and then double checks that the status is still searching before it...
                        // Grabs the data, passes it to handleResults, and then destroys the SM
                        let stage = "step-cim"
        
                        genericPoll(id, stage)
                    },
                    "status": function(){
                        // Stage Global
                        // Runs across all elements of this stage to update the status for this step
                        
                        
                        let success = pullStatusElementCount({"stage": "step-cim", "status":"complete"}) + pullStatusElementCount({"stage": "step-cim", "status":"success"})
                        let failure = pullStatusElementCount({"stage": "step-cim", "status":"failure"})
                        let pending = pullStatusElementCount({"stage": "step-cim", "status":"pending"}) + pullStatusElementCount({"stage": "step-cim", "status":"new"})
                        let searching = pullStatusElementCount({"stage": "step-cim", "status":"searching"})
                        $("#step-cim_status").text((success + failure) + ' ' + _('complete').t() + ' / ' + searching + ' ' + _('currently searching').t() + ' / ' + pending + ' ' + _('queued').t() )
                        if (pending + searching > 0) {
                            if ($("#step-cim_statusIcon").find("img").length == 0) {
                                $("#step-cim_statusIcon").html("<img title=\"Running\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">") // loading
                            }
                        } else if (success + failure > 0) {
                            $("#step-cim_statusIcon").html('<i class="icon-check" style="color: green;" />') // done
                        } else {
                            $("#step-cim_statusIcon").html("")
                        }
                        return {"complete": success + failure, "remaining": pending, "searching": searching}
                    
                    }
                },
                "step-sourcetype": {
                    "label": "Step Two: Run sourcetype-based Searches",
                    "load": function(id, callback){
                        // NOT COMPLETE
                        // Grabs the object from the dict
                        // Calls addRow
                        // console.log("step-sourcetype was asked to load this guy", id, intro_elements[id])
        
                        let object = intro_elements[id];
                        object['loaded']['step-sourcetype'] = true;
                        // console.log("Got an Initial load request in step-sourcetype for", id, object)
                        if(! object['jsonStatus']['step-sourcetype']){
                            // Skip these
                        } else if(object && object['productId'] && object['productId']!=""  && object['basesearch'] && object['basesearch']!="" && object['eventtypeId'] && object['eventtypeId']!=""){
                            // console.log("Got a load request in step-sourcetype for", id, object)
                            // object['stage'] = "step-sourcetype" // Just to make sure it's set somewhere for status reporting and life.
                            if(object['jsonStatus']['step-sourcetype']['status'] == "pending" || object['jsonStatus']['step-sourcetype']['status'] == "blocked" || object['jsonStatus']['step-sourcetype']['status'] == "new" ){
                                if(! object['jsonStatus']['step-sourcetype'] ){
                                    object['jsonStatus']['step-sourcetype']['status'] = "blocked" 
                                }
                            }
                            object['blocked-by'] = object['eventtypeId'].split("|").filter(function(item){ return item.match(/^DS\d\d\d/) })
                            object['can-cancel'] = "unknown"
                            $(".introspection-step-sourcetype-search[data-id=" + id.replace(/([^a-zA-Z0-9_\-])/g, "\\$1") + "]").remove()
                            $("#introspectionStatus").find("#step-sourcetype-tbody").append(newStatusRow("step-sourcetype", object['jsonStatus']['step-sourcetype']['status'], object['basesearch'], object['productId'], object['vendorName'] + " - " + object['productName']))
                            updateKVStore(id);
                            intro_steps["step-sourcetype"].updateDisplay(id)
                        }
                    },
                    "updateDisplay": function(id, callback){
                        // Takes the ID, and then finds the row and updates with the status.
                        
                        let stage="step-sourcetype";
                        genericUpdateDisplay(id, stage);
        
                    },
                    "cancel": function(id){
                        
                        let stage="step-sourcetype";
                        let object = intro_elements[id];
                        object['jsonStatus']['step-sourcetype']['status'] = "skipped" 
                        object['status'] = "skipped" 
                        updateKVStore(id)
                        genericUpdateDisplay(id, stage);
                    },
                    "isRelevant": function(id){
                        if(! id.match(/^DS\d\d\d/) && (! id.match(/NEEDSREVIEW_/))){
                            
                            if(intro_elements[id]['jsonStatus'] && intro_elements[id]['jsonStatus']['step-sourcetype']){
                                return true;
                            }
                            for(let i = 0; i < global_sourcetype_to_vendor.length; i++){
                                if(id == global_sourcetype_to_vendor[i].productId){
                                    return true;
                                }
                            }
                            return false;
                        }else{
                            return false;
                        }
                    },
                    "start": function(id, callback){
                        // NOT COMPLETE
                        // Creates Search Manager
                        //      - Callbacks are minimal, just load the data to the dict in jsonStatus and pass of to handleResults
                        //      - Callback should delete the SM after it completes to avoid excessive memory usage
                        // Records the search time, name, SID and Stage it was instaniated under in the object
                         
                        intro_elements[id]["status"] = "searching";
                        intro_elements[id]["search_details"] = {
                            "search_started": Math.round(Date.now()/ 1000),
                            "search_name": id,
                            "sid": "",
                            "stage": "step-sourcetype",
                            "id_original":""
                        };
                        
                        let object = intro_elements[id];
                        
                        object['includeSourcetype'] = false
                        object['includeSource'] = false
                        object['splitby'] = "index "
                        if(object['basesearch'].indexOf("sourcetype=") >= 0){
                            object['includeSourcetype'] = true
                            object['splitby'] += "sourcetype "
                        }
                        if(object['basesearch'].indexOf("source=") >= 0){
                            object['includeSource'] = true
                            object['splitby'] += "source "
                        }
                        
                        
                        //let TypeOfSearch = generateSearchManager

                        let parameters = {"autostart": true}
                        let search = ""
                        search = "| tstats count where earliest=-2d " + object['basesearch'] + " by " + object['splitby']
                        if(object["term_fields"] && object["term_fields"] != ""){
                            search = "| tstats count where earliest=-2d (" + object['term_fields'] + ") " + object['basesearch'] + " by " + object['splitby']
                        }else{
                            search = "| loadjob " + intro_elements.GLOBAL_SOURCETYPE_SOURCE_INDEX.sid + " | search " + object['basesearch'] + " | stats count by " + object['splitby']
                        }

                        // console.log("About to kick off step-sourcetype search for",id, search, parameters)
                        generateSearchManager(search, "step-sourcetype-" + object['productId'], parameters, function(id, data) {
                                sendDebug({"_time": Date.now() / 1000,
                                    "stage": intro_elements[id.replace(/^step-\w*-/, "")]['stage'],
                                    "status": "searchComplete",
                                    "id": id.replace(/^step-\w*-/, "")
                                })
                                id=id.replace("step-sourcetype-", "")
                                // console.log("STEP-SOURCETYPE Got a completed search", id, data)
                                intro_elements[id]["status"] = "complete";
                                
                                if(! intro_elements[id]["jsonStatus"]){
                                    intro_elements[id]["jsonStatus"] = {}
                                }
                                intro_elements[id]["jsonStatus"]["step-sourcetype"] = {}
                                intro_elements[id]["jsonStatus"]["step-sourcetype"]["data"] = JSON.stringify(data);
                                intro_elements[id]["jsonStatus"]["step-sourcetype"]["status"] = "success";
                                intro_steps["step-sourcetype"].updateDisplay(id)
                                intro_elements[id]["search_result"] = JSON.stringify(data);
                                intro_steps["step-sourcetype"].handleResults(id)
                                updateKVStore(id);
                                revokeSM(id)
                            }, function(id) {
                                sendDebug({"_time": Date.now()/1000 ,
                                    "stage": intro_elements[id.replace(/^step-\w*-/, "")]['stage'],
                                    "status": "searchFAILED",
                                    "id": id.replace(/^step-\w*-/, "")
                                })
                                id=id.replace("step-sourcetype-", "")
                                // console.log("STEP-SOURCETYPE Got a failed search", id)
                                intro_elements[id]['jsonStatus']['step-sourcetype']["status"] = "failure";
                                intro_steps["step-sourcetype"].updateDisplay(id)
                                updateKVStore(id);
                                revokeSM(id)
                            }, function(id) {
                                let id_original=id
                                id=id.replace("step-sourcetype-", "")
                                intro_elements[id]["id_original"]=id_original
                                if(splunkjs.mvc.Components.getInstance(id_original) && splunkjs.mvc.Components.getInstance(id_original).attributes && splunkjs.mvc.Components.getInstance(id_original).attributes.data && splunkjs.mvc.Components.getInstance(id_original).attributes.data.sid){
                                    intro_elements[id]["search_details"]["sid"] = splunkjs.mvc.Components.getInstance(id_original).attributes.data.sid;
                                }
                                intro_steps["step-sourcetype"].updateDisplay(id)
                            }
                        )
                        
                        overallStatus()
                    },
                    "handleResults": function(id, callback){
                        // NOT COMPLETE
                        // Applies business logic
                        // Calls the load for the next stage
        
                        let object = intro_elements[id];
                        let data = JSON.parse(object['search_result']);                
                        // console.log("Results were called!", object, data);
                        let termsearch = ""
                        for(let i = 0; i < data.length; i++){
                            if(data[i]['count'] > 0){
                                if(termsearch!=""){
                                    termsearch += " OR "
                                }
                                termsearch += "(index=\"" + data[i].index + "\""; 
                                if(data[i]['sourcetype']){
                                    termsearch += " sourcetype=\"" + data[i].sourcetype + "\"";
                                }
                                if(data[i]['source']){
                                    termsearch += " source=\"" + data[i].source + "\"";
                                }
                                termsearch += ") "
                            }
                        }   
                        if(data.length>1){
                            termsearch = "(" + termsearch + ")"
                        }
                        object['basesearch'] = termsearch
                        object['termsearch'] = termsearch
                        object['status'] = "analyzing"
                        object["jsonStatus"]["step-eventsize"] = {"status": "pending"}
                        object["jsonStatus"]["step-volume"] = {"status": "pending"}
                        // console.log("Initing 2")
                        updateOverallElementStatus(id);
                        load(id);
                        updateKVStore(id);
                        overallStatus()
                        
                    },
                    "poll": function(id){
                        // NOT COMPLETE
                        // Looks for the current SID and sees if it's still running.
                        // If it's not running, sets a 100 ms timeout and then double checks that the status is still searching before it...
                        // Grabs the data, passes it to handleResults, and then destroys the SM
                        let stage = "step-sourcetype"
        
                        genericPoll(id, stage)
                        
                    },
                    "status": function(){
                        // NOT COMPLETE
                        // Stage Global
                        // Runs across all elements of this stage to update the status for this step
                        let blockedRows = grabAllSearches("blocked") // subsetIntroElementsAsArray({"status": "blocked"});
                        for(let i = 0; i < blockedRows.length; i++){
                            let productId = blockedRows[i]['_key'];
                            let object = intro_elements[productId]
                            // console.log("looking at", blockedRows[i], blockedRows[i].productId, blockedRows[i]['blocked-by'])
                            let blocking = JSON.parse(JSON.stringify(object['blocked-by']))
                            let canCancel = object['can-cancel']
                            let newBlocking = []
                            for(let g = 0; g < blocking.length; g++){
                                // console.log("BLOCKING Looking at blocking element", blocking[g])
                                if(! intro_elements[blocking[g]]){
                                    // console.log("Found a blocked by not present in our list of SMs (i.e., we should probably be adding a CIM search for this type..")
                                    object['blocked-by'].splice( object['blocked-by'].indexOf(blocking[g]), 1)
                                    continue;
                                }
                                let status = intro_elements[blocking[g]].status
                                if(status == "pending" || status == "new" || status == "searching"){
                                    newBlocking.push(blocking[g])
                                }else{
                                    // just unblocked:
                                    let results = intro_elements[blocking[g]].search_result
                                    // console.log("BLOCKING - Got the results from ", blocking[g], results, status)
                                    try{
                                        results = JSON.parse(results)
                                        // console.log("BLOCKING - Got the JSON results from ", blocking[g], results)
                                        // console.log("BLOCKING - Looking for field", blockedRows[i].regex_field)
                                        // console.log("BLOCKING - Looking for pattern", blockedRows[i].regex_pattern);
        
                                        let doesRegexMatch = false;
                                        
                                        for(let k = 0; k < results.length; k++){
                                            if(!results[k][object.regex_field]){
                                                // Keep it rolling...
                                            }else{
                                                let re = new RegExp(object.regex_pattern, "gi");
                                                // console.log("BLOCKING - Looking for sourcetype", blockedRows[i].productId, blocking[g], blockedRows[i].regex_pattern, "in", results[k][blockedRows[i].regex_field])                            
                                                if(re.test(results[k][object.regex_field])){  
                                                    // console.log("Looking for sourcetype -- Got a match")
                                                    doesRegexMatch = true;
                                                }else{
                                                    // console.log("Looking for sourcetype -- did not get a match")
                                                }
                                            }
                                        }
                                        if(canCancel == "unknown" || canCancel == "yes"){
                                            if(doesRegexMatch){
                                                // console.log("Remarking canCancel-yes", blocking[g])
                                                canCancel = "yes"
                                                
                                            }else{
                                                canCancel = "no"
                                                // Not sure that this is actually used... commenting rather than migrating to new codebase.
                                                // if($(blockedRows[i]).attr("data-relevant-dscs")){
                                                //     $(blockedRows[i]).attr("data-relevant-dscs", $(blockedRows[i]).attr("data-relevant-dscs") + "|" + blocking[g])
                                                // }else{
                                                //     $(blockedRows[i]).attr("data-relevant-dscs", blocking[g])
                                                // }
                                                // console.log("Remarking canCancel-No", blocking[g], "Got a new relevant-dscs", $(blockedRows[i]).attr("data-relevant-dscs"))
                                            }
                                        }
                        
                                    }catch(error){
        
                                    }
                                }
                            }
                            object['can-cancel'] = canCancel
        
                            if(newBlocking.length == 0){
                                // console.log("BLOCKING - No longer blocked!", blockedRows[i])
                                if(canCancel == "yes"){
                                    // console.log("BLOCKING - Cancelling", canCancel, blockedRows[i])
                                    let row = $(".introspection-step-sourcetype-search[data-id=" + object['_key'].replace(/([^a-zA-Z0-9_\-])/g, "\\$1") + "]")
                                    row.attr("data-status", "cancelled").find(".running-status").html("Not Needed. Data found in CIM search.")
                                    // blockedRows[i]['status'] = "skipped"
                                    // intro_steps['step-sourcetype'].updateDisplay(blockedRows[i]['_key'])
                                    object['jsonStatus']['step-sourcetype']['status'] = "skipped"
                                    object['jsonStatus']['step-eventsize'] = {'status': "pending"}
                                    object['jsonStatus']['step-volume'] = {'status': "pending"}
                                    // console.log("Initing 1")
                                    load(object['_key']);
                                }else{
                                    // console.log("BLOCKING - Pending", canCancel, blockedRows[i])
                                    object['jsonStatus']['step-sourcetype']['status'] = "pending"
                                }
                                
                                updateKVStore(object['_key'])
                                overallStatus()
                            }
                        }
                        
                        let success = pullStatusElementCount({"stage": "step-sourcetype", "status":"complete"}) + pullStatusElementCount({"stage": "step-sourcetype", "status":"success"}) + pullStatusElementCount({"stage": "step-sourcetype", "status":"skipped"}) + pullStatusElementCount({"stage": "step-sourcetype", "status":"cancelled"})
                        let failure = pullStatusElementCount({"stage": "step-sourcetype", "status":"failure"})
                        let pending = pullStatusElementCount({"stage": "step-sourcetype", "status":"pending"}) + pullStatusElementCount({"stage": "step-sourcetype", "status":"blocked"})
                        let searching = pullStatusElementCount({"stage": "step-sourcetype", "status":"searching"})
                        $("#step-sourcetype_status").text((success + failure) + ' ' + _('complete').t() + ' / ' + searching + ' ' + _('currently searching').t() + ' / ' + pending + ' ' + _('queued').t() )
                        if (pending + searching > 0) {
                            if ($("#step-sourcetype_statusIcon").find("img").length == 0) {
                                $("#step-sourcetype_statusIcon").html("<img title=\"Running\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">") // loading
                            }
                        } else if (success + failure > 0) {
                            $("#step-sourcetype_statusIcon").html('<i class="icon-check" style="color: green;" />') // done
                        } else {
                            $("#step-sourcetype_statusIcon").html("")
                        }
                        return {"complete": success + failure, "remaining": pending, "searching": searching}
                    
                    }
                },
                "step-review": {
                    "label": "Step Three: Review CIM-based Results",
                    "load": function(id, callback){
                        // Grabs the object from the dict
                        // Calls addRow
                        // console.log("step-review Was asked to load", id, intro_elements[id])
                        let object = intro_elements[id];
                        object['loaded']['step-review'] = true;
                        if(object && object["basesearch"] && object["basesearch"] != "" && object["basesearch"] != null){
                            $(".introspection-step-review-search[data-id=" + id.replace(/([^a-zA-Z0-9_\-])/g, "\\$1") + "]").remove()
                            $("#introspectionStatus").find("#step-review-tbody").append(newStatusRow("step-review", "needsConfirmation", "", id, object["termsearch"]))
                            updateKVStore(id);
                            intro_steps["step-review"].updateDisplay(id)
                        }
                    },
                    "isRelevant": function(id){
                        if(id.match(/NEEDSREVIEW_/)){
                            return true;
                        }
                        return false;
                    },
                    "updateDisplay": function(id, callback){
                        // Takes the ID, and then finds the row and updates with the statu
                        let stage="step-review";
                        genericUpdateDisplay(id, stage);
                    },
                    "start": function(id, callback){
                        // Not applicable for manual review                
                    },
                    "handleResults": function(id, callback){
                        // Not applicable for manual review
                    },
                    "cancel": function(id){
                        // Not applicable for manual review
                        delete intro_elements[id];
                        removeProductFromKVStore(id)
                        $(".introspection-step-review-search[data-id=" + id.replace(/([^a-zA-Z0-9\-_=\.])/g, "\\$1") + "]").remove()
                        genericUpdateDisplay(id, stage);
                    },
                    "poll": function(id){
                        // Not applicable for manual review
                    },
                    "status": function(){
                        // Stage Global
                        // Runs across all elements of this stage to update the status for this step
                        
                        let success = pullStatusElementCount({"stage": "step-review", "status":"reviewed"}) 
                        let pending = pullStatusElementCount({"stage": "step-review", "status":"needsConfirmation"})
                        $("#step-review_status").text((success) + ' ' + _('complete').t() + ' / ' + pending + ' ' + _('awaiting manual review').t() )
                        if (pending > 0) {
                            $("#step-review_statusIcon").html('<i class="icon-question" style="color: orange;" />') // done
                        } else {
                            $("#step-review_statusIcon").html('<i class="icon-check" style="color: green;" />') // done
                        }
                        return {"complete": success, "remaining": pending, "searching": 0}
                    }
                },
                "step-eventsize": {
                    "label": "Step Four: CIM + Event Size Introspection",
                    "load": function(id, callback){
                        // Grabs the object from the dict
                        // Calls addRow
                        // console.log("step-eventsize Was asked to load", id, intro_elements[id])
                        let object = intro_elements[id];
                        object['loaded']['step-eventsize'] = true;
                        // if(object['stage'] != "step-eventsize" || object['status'] == "analyzing"){
                        //     object['stage'] = 'step-eventsize';
                        //     object['status'] = "pending";
                        // }

                        // object["jsonStatus"]["step-volume"] = {}
                        // object["jsonStatus"]["step-volume"]['status'] = "new"
                        // object["jsonStatus"]["step-eventsize"] = {}
                        // object["jsonStatus"]["step-eventsize"]['status'] = "new"
                        // load(id);
                        if(object && object["basesearch"] && object["basesearch"] != "" && object["basesearch"] != null){
                            $(".introspection-step-eventsize-search[data-id=" + id.replace(/([^a-zA-Z0-9_\-])/g, "\\$1") + "]").remove()
                            $("#introspectionStatus").find("#step-eventsize-tbody").append(newStatusRow("step-eventsize", object["jsonStatus"]["step-eventsize"]['status'], object.basesearch, id, object['vendorName'] + " - " + object['productName']))
                            updateKVStore(id);
                            intro_steps["step-eventsize"].updateDisplay(id)
                        }
                        
                    },
                    "isRelevant": function(id){
                        if(id.match(/NEEDSREVIEW_/)){
                            return false;
                        }
                        if(intro_elements[id]["jsonStatus"]["step-eventsize"] && intro_elements[id]["jsonStatus"]["step-eventsize"]['status']){
                            return true;
                        }
                        return false;                    
                    },
                    "updateDisplay": function(id, callback){
                        // Takes the ID, and then finds the row and updates with the status.
                        genericUpdateDisplay(id, "step-eventsize");
                    },
                    "start": function(id, callback){
                        // NOT COMPLETE
                        // Creates Search Manager
                        //      - Callbacks are minimal, just load the data to the dict in jsonStatus and pass of to handleResults
                        //      - Callback should delete the SM after it completes to avoid excessive memory usage
                        // Records the search time, name, SID and Stage it was instaniated under in the object
                        let object = intro_elements[id];
                        let fields = {};
                        let tags = {};
                        object["status"] = "searching";
                        intro_elements[id]["search_details"] = {
                            "search_started": Math.round(Date.now()/ 1000),
                            "search_name": id,
                            "sid": "",
                            "stage": "step-eventsize"
                        };
                        
                        let eventtypes = object.eventtypeId.split("|");
                        let newCIM = {}
                        for(let g = 0; g < eventtypes.length; g++){
                            for(let ds in data_inventory){
                                for(let dsc in data_inventory[ds]['eventtypes']){
                                    if(dsc == eventtypes[g]){
                                        if(data_inventory[ds]['eventtypes'][dsc]['required_cim_fields']){
                                            newCIM[dsc] = {"fields": [], "tags": []}
                                            for(let k = 0; k < data_inventory[ds]['eventtypes'][dsc]['required_cim_fields'].length; k++){
                                                fields[data_inventory[ds]['eventtypes'][dsc]['required_cim_fields'][k]] = "hi";
                                                if(newCIM[dsc].fields.indexOf(data_inventory[ds]['eventtypes'][dsc]['required_cim_fields'][k]) == -1){
                                                    newCIM[dsc].fields.push(data_inventory[ds]['eventtypes'][dsc]['required_cim_fields'][k])
                                                }
    
                                            }
                                        }
                                        if(data_inventory[ds]['eventtypes'][dsc]['required_tags']){
                                            
                                            if(!newCIM[dsc]){
                                                newCIM[dsc] = {"fields": [], "tags": []}
                                            }
                                            for(let k = 0; k < data_inventory[ds]['eventtypes'][dsc]['required_tags'].length; k++){
                                                tags[data_inventory[ds]['eventtypes'][dsc]['required_tags'][k]] = "hi";
                                                if(newCIM[dsc].tags.indexOf(data_inventory[ds]['eventtypes'][dsc]['required_tags'][k]) == -1){
                                                    newCIM[dsc].tags.push(data_inventory[ds]['eventtypes'][dsc]['required_tags'][k])
                                                }
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                        object["step-eventsize-deeper-metadata"] = newCIM
                        object["step-eventsize-metadata"] = {"fields": fields, "tags": tags}
                        //console.log("Starting step-eventsize", id, object)
                        generateSearchManager(object.basesearch + " | head 10000 | eval SSELENGTH = len(_raw)  | eventstats range(_time) as SSETIMERANGE | fields SSELENGTH SSETIMERANGE tag " + Object.keys(fields).join(" ").toString() + " | fieldsummary ", "step-eventsize-" + id, 
                        {"autostart": true}, 
                        function(id, data) {
                            sendDebug({"_time": Date.now()/1000 ,
                                "stage": "step-eventsize",
                                "status": "searchComplete",
                                "id": id.replace(/^step-\w*-/, "")
                            })
                            id=id.replace("step-eventsize-", "")
                            // console.log("Got a completed search", id)
                            
                            let myjsonStatus = []
                            for(let i = 0; i < data.length; i++){
                                if(data[i].field.indexOf("SSE") >= 0){
                                    myjsonStatus.push(data[i])
                                }
                            }
                            intro_elements[id]["jsonStatus"]["step-eventsize"]["data"] = myjsonStatus;
                            intro_elements[id]["jsonStatus"]["step-eventsize"]["status"] = "success";
                            intro_elements[id]["status"] = "complete";
                            updateOverallElementStatus(id);


                            intro_steps["step-eventsize"].updateDisplay(id)
                            intro_elements[id]["search_result"] = JSON.stringify(data);
                            intro_steps["step-eventsize"].handleResults(id)
                            updateKVStore(id);
                            updateEventSizeVolumeStatus(id)
                            revokeSM("step-eventsize-" + id)
                        }, function(id) {
                            sendDebug({"_time": Date.now()/1000 ,
                                "stage": "step-eventsize",
                                "status": "searchFAILED",
                                "id": id.replace(/^step-\w*-/, "")
                            })
                            id=id.replace("step-eventsize-", "")
                            intro_elements[id]["jsonStatus"]["step-eventsize"]["status"] = "failure";
                            //console.log("Got a failed search", id)
                            intro_elements[id]["status"] = "introspectionFailed";
                            intro_steps["step-eventsize"].updateDisplay(id)
                            updateEventSizeVolumeStatus(id)
                            updateOverallElementStatus(id);
                            load(id);
                            updateKVStore(id);
                            revokeSM("step-eventsize-" + id)
                        }, function(id) {
                            let id_original=id
                            id=id.replace("step-eventsize-", "")
                            intro_elements[id]["id_original"]=id_original
                            if(splunkjs.mvc.Components.getInstance(id_original) && splunkjs.mvc.Components.getInstance(id_original).attributes && splunkjs.mvc.Components.getInstance(id_original).attributes.data && splunkjs.mvc.Components.getInstance(id_original).attributes.data.sid){
                                intro_elements[id]["search_details"]["sid"] = splunkjs.mvc.Components.getInstance(id_original).attributes.data.sid;
                            }
                            intro_steps["step-eventsize"].updateDisplay(id)
                        })
                        
                    },
                    "handleResults": function(id, callback){
                        // NOT COMPLETE
                        // Applies business logic
                        // Calls the load for the next stage
        
                        let object = intro_elements[id];
                        let data = JSON.parse(object['search_result']);    
                        let productId = object['productId']
                        window.lightweight_cim_regex = lightweight_cim_regex // to delete
                        //console.log("Received result!", productId, data)
                        for(let i = 0; i < data_inventory_products.length; i++){
                            if(data_inventory_products[i].productId == productId ){
                                let avgEventSize = -1;
                                let total_cimCompliantFields = 0;
                                let total_cimFailedFields = 0;
                                let total_cimDetail = {}
                                let totalFields = 0;
                                let desired_sampling_ratio = 0;
                                for(let i = 0; i < data.length; i++){
                                    if(data[i]['field'] == "SSETIMERANGE") {
                                        let seconds = data[i]['mean']
                                        desired_sampling_ratio = Math.max(Math.round(259200 / seconds), 1);
                                        // console.log("Sampling check, it took us ", seconds, "seconds to get 10k events, so we are going for ")
                                        // We want 100k events in a month span. I.. don't actually understand why this math works... but it works for a bunch of examples so I guess it's fine?
                                    } else if(data[i]['field'] == "SSELENGTH") {
                                        avgEventSize = data[i]['mean']
                                    }
                                }

                                for(let dsc in object["step-eventsize-deeper-metadata"]){

                                    let fields = object['step-eventsize-deeper-metadata'][dsc]['fields'];
                                    let requiredTags = object['step-eventsize-deeper-metadata'][dsc]['tags'];
                                    //console.log("Got data from the CIM search", productId, data)
                                    let cimCompliantFields = 0;
                                    let cimFailedFields = 0;
                                    let cimDetail = {}
                                    let totalFields = 0;
                                    let remainingTags = Object.keys(requiredTags);
                                    
                                    for(let i = 0; i < data.length; i++){
                                        if(data[i]['field'] == "tag") {
                                            let values = JSON.parse(data[i]['values']);
                                            for(let g = 0; g < values.length; g++){
                                                if(remainingTags.indexOf(values[g]['value']) >= 0){
                                                    remainingTags.splice( remainingTags.indexOf(values[g]['value']), 1 )
                                                }
                                            }
                                        } else {
                                            let field = data[i]['field']
                                            if(fields.indexOf(field) >= 0){
                                                let success = 0;
                                                let failure = 0;
                                                let values = JSON.parse(data[i]['values']);
                                                if(lightweight_cim_regex[field]){
                                                    let re = new RegExp(lightweight_cim_regex[field], "gi");
                                                    for(let g = 0; g < values.length; g++){
                                                        if(re.test(values[g]['value'])){
                                                            success += values[g]['count']
                                                            //console.log("CIM TEST A SUCCESS", dsc, field, lightweight_cim_regex[field], values[g]['value'], re.test(values[g]['value']), values[g]['count'], success, failure)
                                                        }else{
                                                            failure += values[g]['count']
                                                            //console.log("CIM TEST A FAILURE", dsc, field, lightweight_cim_regex[field], values[g]['value'], re.test(values[g]['value']), values[g]['count'], success, failure)
                                                        }
                                                    }
                                                }else{
                                                    for(let g = 0; g < values.length; g++){
                                                        if(values[g]['value'] != ""){
                                                            success += values[g]['count']
                                                            //console.log("CIM TEST B SUCCESS", dsc, field, lightweight_cim_regex[field], values[g]['value'], values[g]['count'], success, failure)
                                                        }else{
                                                            
                                                            failure += values[g]['count']
                                                            //console.log("CIM TEST B FAILURE", dsc, field, lightweight_cim_regex[field], values[g]['value'], values[g]['count'], success, failure)
                                                        }
                                                    }
                                                    
                                                }
                                                cimDetail[field] = {"success": success, "failure": failure};
                                                
                                                if(success / (success + failure) > 0.9){
                                                    cimCompliantFields++;
                                                }else{
                                                    cimFailedFields++;
                                                }
                                                // console.log("Analyzing CIM Details for", dsc, field, cimDetail[field], data[i]['values'], data);
                                            }
                                        }
                                    }
                                    // console.log("Analyzing CIM Details for", dsc, cimDetail, fields, requiredTags, data);
                                    total_cimDetail[dsc] = cimDetail
                                    total_cimCompliantFields += cimCompliantFields
                                    total_cimFailedFields += cimFailedFields
                                    
                                }
                                // console.log("Post Analysis, we just analyzed ", id, productId)
                                // console.log("Post Analysis, avgEventSize is ", id, avgEventSize)
                                // console.log("Post Analysis, remainingTags ", id, remainingTags)
                                // console.log("Post Analysis, CIM Fields include ", id, cimCompliantFields, "compliant", cimFailedFields, "failure", totalFields, "total")
                                // console.log("Post Analysis, CIM Detail ", id, cimDetail)
                                
                                object["cim_detail"] = JSON.stringify(total_cimDetail);
                                object["eventsize"] = avgEventSize;
                                object["desired_sampling_ratio"] = desired_sampling_ratio;
                                object["cim_compliant_fields"] = total_cimCompliantFields / (total_cimCompliantFields + total_cimFailedFields);
                                
                                intro_steps["step-eventsize"].updateDisplay(id);
                                object["jsonStatus"]["step-eventsize"]['status'] = "success"
                                updateOverallElementStatus(id);
                                load(id);
                                updateKVStore(id);
                            }
                        }
                        overallStatus()
                        
                    },
                    "poll": function(id){
                        // NOT COMPLETE
                        // Looks for the current SID and sees if it's still running.
                        // If it's not running, sets a 100 ms timeout and then double checks that the status is still searching before it...
                        // Grabs the data, passes it to handleResults, and then destroys the SM
                        
                        
                        genericPoll(id, "step-eventsize")
                        updateEventSizeVolumeStatus(id)
                    },
                    "status": function(){
                        // NOT COMPLETE
                        // Stage Global
                        // Runs across all elements of this stage to update the status for this step
        
                        let stage = "step-eventsize"
                    
                        let success = pullStatusElementCount({"stage": stage, "status":"complete"}) + pullStatusElementCount({"stage": stage, "status":"success"})
                        let failure = pullStatusElementCount({"stage": stage, "status":"failure"})
                        let pending = pullStatusElementCount({"stage": stage, "status":"pending"})
                        let searching = pullStatusElementCount({"stage": stage, "status":"searching"})
                        $("#" + stage + "_status").text((success + failure) + ' ' + _('complete').t() + ' / ' + searching + ' ' + _('currently searching').t() + ' / ' + pending + ' ' + _('queued').t() )
                        if (pending + searching > 0) {
                            if ($("#" + stage + "_statusIcon").find("img").length == 0) {
                                $("#" + stage + "_statusIcon").html("<img title=\"Running\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">") // loading
                            }
                        } else if (success + failure > 0) {
                            $("#" + stage + "_statusIcon").html('<i class="icon-check" style="color: green;" />') // done
                        } else {
                            $("#" + stage + "_statusIcon").html("")
                        }
                        return {"complete": success + failure, "remaining": pending, "searching": searching}
                    },
                    "cancel": function(id){
                        let stage="step-eventsize";
                        let object = intro_elements[id];
                        object['jsonStatus']['step-eventsize']['status'] = "skipped" 
                        object['status'] = "skipped" 
                        updateKVStore(id)
                        genericUpdateDisplay(id, stage);
                    }
                },
                "step-volume": {
                    "label": "Step Five: Event Volume and Host Volume Introspection",
                    "load": function(id, callback){
                        // NOT COMPLETE
                        // Grabs the object from the dict
                        // Calls addRow
                        
                        // console.log("step-volume Was asked to load", id, intro_elements[id])
                        let object = intro_elements[id];
                        object['loaded']['step-volume'] = true;
                        if(object && object["basesearch"] && object["basesearch"] != "" && object["basesearch"] != null){
                            
                            $(".introspection-step-volume-search[data-id=" + id.replace(/([^a-zA-Z0-9_\-])/g, "\\$1") + "]").remove()
                            $("#introspectionStatus").find("#step-volume-tbody").append(newStatusRow("step-volume" , object['jsonStatus']['step-volume']['status'] , object.basesearch, id, object['vendorName'] + " - " + object['productName']))
                        }
                    },
                    "isRelevant": function(id){
                        if(id.match(/NEEDSREVIEW_/)){
                            return false;
                        }
                        if(intro_elements[id]["jsonStatus"]["step-volume"] && intro_elements[id]["jsonStatus"]["step-volume"]['status']){
                            return true;
                        }
                        return false;
                    },
                    "cancel": function(id){
                        
                        let stage="step-volume";
                        let object = intro_elements[id];
                        object['jsonStatus']['step-volume']['status'] = "skipped" 
                        object['status'] = "skipped" 
                        updateKVStore(id)
                        genericUpdateDisplay(id, stage);
                    },
                    "updateDisplay": function(id, callback){
                        // Takes the ID, and then finds the row and updates with the status.
                        
                        genericUpdateDisplay(id, "step-volume");
        
                    },
                    "start": function(id, callback){
                        // NOT COMPLETE
                        // Creates Search Manager
                        //      - Callbacks are minimal, just load the data to the dict in jsonStatus and pass of to handleResults
                        //      - Callback should delete the SM after it completes to avoid excessive memory usage
                        // Records the search time, name, SID and Stage it was instaniated under in the object
                         
        
                        let object = intro_elements[id]
                        updateKVStore(id);
                        intro_steps['step-volume'].updateDisplay(id)
                        object['stage'] = 'step-volume';
                        object["status"] = "searching";
                        intro_elements[id]["search_details"] = {
                            "search_started": Math.round(Date.now()/ 1000),
                            "search_name": id,
                            "sid": "",
                            "stage": "step-volume"
                        };
                        
                        // console.log("Starting step-volume", id, object)
                        //console.log("running volume search: ","| tstats count dc(host) as numhosts where " + object.termsearch + " earliest=-30d@d latest=@d by _time span=1d | stats avg(count) as avg_count avg(numhosts) as avg_numhosts ")
                        generateSearchManager("| tstats count dc(host) as numhosts where " + object.termsearch + " earliest=-30d latest=now by _time span=1d | stats avg(count) as avg_count avg(numhosts) as avg_numhosts ", "step-volume-" + id, 
                        {"autostart": true /*, "custom.dispatch.sample_ratio": object.desired_sampling_ratio*/ }, 
                        function(id, data) {
                            sendDebug({"_time": Date.now()/1000 ,
                                "stage": "step-volume",
                                "status": "searchComplete",
                                "id": id.replace(/^step-\w*-/, "")
                            })
                            id=id.replace("step-volume-", "")
                            let stage = "step-volume"
                            // console.log("Got a completed search", id, stage)
                            intro_elements[id]["status"] = "complete";
                            intro_elements[id]["jsonStatus"]["step-volume"]["data"] = JSON.stringify(data);
                            intro_elements[id]["jsonStatus"]["step-volume"]["status"] = "success";
                            intro_steps[stage].updateDisplay(id)
                            intro_elements[id]["search_result"] = JSON.stringify(data);
                            intro_steps[stage].handleResults(id)
                            updateKVStore(id);
                            revokeSM(stage + "-" + id)
                            updateEventSizeVolumeStatus(id)
                        }, function(id) {
                            sendDebug({"_time": Date.now()/1000 ,
                                "stage": "step-volume",
                                "status": "searchFAILED",
                                "id": id.replace(/^step-\w*-/, "")
                            })
                            id=id.replace(/^step-\w*-/, "")
                            let stage = "step-volume"
                            // console.log("Got a failed search", id)
                            intro_elements[id]["status"] = "introspectionFailedTwo";
                            intro_elements[id]["jsonStatus"]["step-volume"]["status"] = "failure";
                            intro_steps[stage].updateDisplay(id)
                            updateKVStore(id);
                            revokeSM(stage + "-" + id)
                            updateEventSizeVolumeStatus(id)
                        }, function(id) {
                            let id_original=id
                            id=id.replace("step-volume-", "")
                            intro_elements[id]["id_original"]=id_original
                            if(splunkjs.mvc.Components.getInstance(id_original) && splunkjs.mvc.Components.getInstance(id_original).attributes && splunkjs.mvc.Components.getInstance(id_original).attributes.data && splunkjs.mvc.Components.getInstance(id_original).attributes.data.sid){
                                intro_elements[id]["search_details"]["sid"] = splunkjs.mvc.Components.getInstance(id_original).attributes.data.sid;
                            }
                            intro_steps["step-volume"].updateDisplay(id)
                        })                     
                    },
                    "handleResults": function(id, callback){
                        // NOT COMPLETE
                        // Applies business logic
                        // Calls the load for the next stage
        
                        //             let record = {
                        //                 "status": "complete",
                        //                 "daily_host_volume": data[0]['avg_numhosts'],
                        //                 "daily_event_volume": data[0]['avg_count']
                        //             }
                        
                        let object = intro_elements[id];
                        let data = JSON.parse(object['search_result']);    
                        
                        object["daily_host_volume"] = data[0]['avg_numhosts'];
                        //console.log("daily_event_volume", data[0]['avg_count'],data)
                        if (!object["desired_sampling_ratio"] || object["desired_sampling_ratio"] == "" || object["desired_sampling_ratio"] == 0) {
                            object["desired_sampling_ratio"]=1
                        }
                        object["daily_event_volume"] = data[0]['avg_count'] * object['desired_sampling_ratio'];
                        updateOverallElementStatus(id)
                        reportTelemetry(id);
                        updateKVStore(id);
                        overallStatus()
                    },
                    "poll": function(id){
                        // NOT COMPLETE
                        // Looks for the current SID and sees if it's still running.
                        // If it's not running, sets a 100 ms timeout and then double checks that the status is still searching before it...
                        // Grabs the data, passes it to handleResults, and then destroys the SM
                        
                        genericPoll(id, "step-volume")
                        updateEventSizeVolumeStatus(id)
                    },
                    "status": function(){
                        // NOT COMPLETE
                        // Stage Global
                        // Runs across all elements of this stage to update the status for this step
                        
                        let stage = "step-volume"
                    
                        let success = pullStatusElementCount({"stage": stage, "status":"complete"}) + pullStatusElementCount({"stage": stage, "status":"success"})
                        let failure = pullStatusElementCount({"stage": stage, "status":"failure"})
                        let pending = pullStatusElementCount({"stage": stage, "status":"pending"}) + pullStatusElementCount({"stage": stage, "status":"analyzingtwo"})
                        let searching = pullStatusElementCount({"stage": stage, "status":"searching"})
                        $("#" + stage + "_status").text((success + failure) + ' ' + _('complete').t() + ' / ' + searching + ' ' + _('currently searching').t() + ' / ' + pending + ' ' + _('queued').t() )
                        if (pending + searching > 0) {
                            if ($("#" + stage + "_statusIcon").find("img").length == 0) {
                                $("#" + stage + "_statusIcon").html("<img title=\"Running\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">") // loading
                            }
                        } else if (success + failure > 0) {
                            $("#" + stage + "_statusIcon").html('<i class="icon-check" style="color: green;" />') // done
                        } else {
                            $("#" + stage + "_statusIcon").html("")
                        }
                        return {"complete": success + failure, "remaining": pending, "searching": searching}
                    }
                }
            }
            window.intro_steps = intro_steps;
            window.amDebugging = false;
            function generateEventsFromDebugLog(index, sourcetype, source, host){
                if(window.amDebugging){
                    return;
                }
                window.amDebugging = true;
                if(!index){
                    index = "_internal"
                }
                if(!sourcetype){
                    sourcetype = "splunk_security_essentials:data_inventory:debug"
                }
                if(!source){
                    source = "splunkjs"
                }
                if(!host){
                    host = navigator.userAgent
                }
        
                // Insert Data Code, written by Tom Martin
                var splunkWebHttp = new splunkjs.SplunkWebHttp();
                var service = new splunkjs.Service(splunkWebHttp);
                var indexes = service.indexes();
        
        
                // first get the index to use 
                indexes.fetch(function(err, indexes) {
                    var myIndex = indexes.item(index);
                    if (myIndex) {
                        // console.log("Found " + myIndex.name + " index");
                    } else {
                        // console.log("Error!  Could not find index named " + indexName);
                        return null;
                    }
                    while(debug_log.length){
                        let log = debug_log.shift();
                        log.runId = debug_log_run_id;
                        myIndex.submitEvent(log, { _time: log['_time'], host: host, sourcetype: sourcetype, source: source },
                            function(err, result, myIndex) {
                            });
                    }
                    // for(let i = 0; i < debug_log.length; i++){
                    //     debug_log[i].runId = debug_log_run_id
                    //     // Submit an event to the index
                    //     myIndex.submitEvent(debug_log[i], { _time: debug_log[i]['_time'], host: host, sourcetype: sourcetype, source: source },
                    //         function(err, result, myIndex) {
                                
                    //         });
                    // }
                });
                window.amDebugging = false;
            }
            window.generateEventsFromDebugLog = generateEventsFromDebugLog
        
        
            ////////////////////////////////
            /// Global Control Functions ///
            ////////////////////////////////
        
            function init(deferral){
                // Creates the status modal
                // Looks through the list of steps and creates their tables
                // Creates buttons
                // Resolves deferral when complete
        
                // Now we initialize the Modal itself
                let myModal = new Modal("introspectionStatus", {
                    title: _("Data Introspection Status").t(),
                    backdrop: 'static',
                    keyboard: false,
                    destroyOnHide: false
                }, $);
        
                $(myModal.$el).addClass("modal-extra-wide").on("shown", function() {
                    $("#introspectionStatus").css("display", "none");
                    $(".modal-backdrop").attr("id", "introspectionStatusBackdrop").css("display", "none");
                })
                myModal.body
                    .append($("<div>").append($('<p style="display:inline;">').text(_("Welcome to the Data Inventory Introspection! Below find the status of introspection within the environment.").t()),
                    
                    $('<div style="display: inline-block; float: right; border: 1px solid gray; border-radius: 3px; line-height: 24px; padding: 3px; margin-bottom: 5px; margin-right: 3px;">' + _("Controls").t() + "</div>").append(
                        $('<button title="' + _("Start / Stop Introspection").t() + '" class="data-inventory-play-stop-button button btn btn-primary" style="height: 24px; line-height: 20px; margin-left: 3px; padding-top: 2px; padding-bottom: 2px; " href="#"><i class="dataInventoryStartOrStopIcon icon-play"></i></button>'),
                        $('<button title="' + _("Re-run Introspection").t() + '" class="data-inventory-rerun-button button btn btn-primary" style="height: 24px; line-height: 20px; margin-left: 3px; padding-top: 2px; padding-bottom: 2px; margin-right: 3px;" href="#"><i class="icon-rotate-counter"></i></button>').click(function(){
        
                            let myModal = new Modal("reRunIntrospectionModal", {
                                title: _("Re-run Automated Introspection").t(),
                                backdrop: 'static',
                                keyboard: false,
                                destroyOnHide: false
                            }, $);
        
                            myModal.body
                                .append($("<p>").text(_("Are you sure you want to re-run automated introspection?").t()),
                                $("<p>").text(_("This will not remove any of the products you've configured (use Reset Configurations if you would like to do that), but it will re-analyze all existing data sources and also look for any new data sources.").t()));
        
                            
                            myModal.footer.append($('<button>').attr({
                                type: 'button',
                                'data-dismiss': 'modal',
                                'data-bs-dismiss': 'modal'
                            }).addClass('btn ').text(_('Cancel').t() ).on('click', function() {
                            }),$('<button>').attr({
                                type: 'button',
                            }).addClass('btn ').text(_('Re-Run Introspection').t()).on('click', function() {
                                    
                                pauseSearches();
        
                                let myModal = new Modal("processing", {
                                    title: _("Processing...").t(),
                                    backdrop: 'static',
                                    keyboard: false,
                                    destroyOnHide: false
                                }, $);
            
                                myModal.body
                                    .append($("<p>").text(_("Processing...").t()));
            
                                
                                myModal.footer.append()
                                myModal.show(); // Launch it!
                                
                                setTimeout(function(){
                                    for(let i = 0; i < window.data_inventory_products.length; i++){
                                        if(window.data_inventory_products[i].stage == "step-sourcetype"){
                                            window.data_inventory_products[i].status = "pending"
                                            if (!intro_elements[window.data_inventory_products[i].productId]) {
                                                intro_elements[window.data_inventory_products[i].productId] = {}
                                            } 
                                            intro_elements[window.data_inventory_products[i].productId].status = "pending"

                                            if(window.data_inventory_products[i].jsonStatus){
                                                if(typeof window.data_inventory_products[i].jsonStatus == "string" && window.data_inventory_products[i].jsonStatus != ""){
                                                    window.data_inventory_products[i].jsonStatus = JSON.parse(window.data_inventory_products[i].jsonStatus)
                                                }
                                                if(window.data_inventory_products[i].jsonStatus["step-sourcetype"]){
                                                    window.data_inventory_products[i].jsonStatus["step-sourcetype"].status = "pending"
                                                    intro_elements[window.data_inventory_products[i].productId].jsonStatus["step-sourcetype"].status = "pending"
                                                }
                                            }
                                        }else if(window.data_inventory_products[i].stage == "step-review"){
                                            // no change
                                        }else{
                                            window.data_inventory_products[i].status = "analyzing"
                                            window.data_inventory_products[i].stage = "step-eventsize"
                                            intro_elements[window.data_inventory_products[i].productId].status = "analyzing"
                                            intro_elements[window.data_inventory_products[i].productId].stage = "step-eventsize"
                                            // console.log("Reviewing BEFORE", window.data_inventory_products[i].jsonStatus)
                                            
                                            if(window.data_inventory_products[i].jsonStatus){
                                                if(typeof window.data_inventory_products[i].jsonStatus == "string" && window.data_inventory_products[i].jsonStatus != ""){
                                                    window.data_inventory_products[i].jsonStatus = JSON.parse(window.data_inventory_products[i].jsonStatus)
                                                }
                                                if(window.data_inventory_products[i].jsonStatus["step-eventsize"]){
                                                    window.data_inventory_products[i].jsonStatus["step-eventsize"].status = "pending"
                                                    intro_elements[window.data_inventory_products[i].productId].jsonStatus["step-eventsize"].status = "pending"
                                                }
                                                if(window.data_inventory_products[i].jsonStatus["step-volume"]){
                                                    window.data_inventory_products[i].jsonStatus["step-volume"].status = "pending"
                                                    intro_elements[window.data_inventory_products[i].productId].jsonStatus["step-volume"].status = "pending"
                                                }
                                            }
                                            // console.log("Reviewing AFTER", window.data_inventory_products[i].jsonStatus)
                                            
                                        }
                                        // console.log("Just updated product", window.data_inventory_products[i].productId, window.data_inventory_products[i].stage, window.data_inventory_products[i].status)
                                        updateKVStore(window.data_inventory_products[i].productId, true);
                                    }
                                    for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                                        window.data_inventory_eventtypes[i].status = "new"
                                        if(intro_elements[window.data_inventory_eventtypes[i].eventtypeId]){
                                            intro_elements[window.data_inventory_eventtypes[i].eventtypeId].status = "new"
                                        }
                                        // console.log("Just updated eventtype", window.data_inventory_eventtypes[i].eventtypeId, window.data_inventory_eventtypes[i].status)
                                        updateKVStore(window.data_inventory_eventtypes[i].eventtypeId);
                                    }
                                    
                                    setTimeout(function(){
                                        $("#processing").modal("hide")
                                        let myModal = new Modal("reRunIntrospectionModalInitiated", {
                                            title: _("Introspection Restarted").t(),
                                            backdrop: 'static',
                                            keyboard: false,
                                            destroyOnHide: false
                                        }, $);
                    
                                        myModal.body
                                            .append($("<p>").text(_("Introspection status reset. Please refresh page and click start.").t()));
                    
                                        
                                        myModal.footer.append($('<button>').attr({
                                            type: 'button',
                                            'data-dismiss': 'modal',
                                            'data-bs-dismiss': 'modal'
                                        }).addClass('btn ').text(_('Close').t() ).on('click', function() {
                                            location.reload();
                                        }))
                                        myModal.show(); // Launch it!
                                    }, 4000)
                                }, 800)
                                $('[data-bs-dismiss=modal').click()
                            }))
                            myModal.show(); // Launch it!
                        })
                    )));
        
        
        
                
                
        
        
                
                for(let step in intro_steps){
                    let Template = "<table id=\"SHORTNAME_table\" class=\"dvexpand table table-chrome\"><thead><tr><th colspan=\"NUMCOLUMNS\" class=\"expands\"><h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\" onclick='$(\"#SHORTNAME-tbody\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");  $(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;'>&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE <div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a></h2><div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: none\" id=\"SHORTNAME-tbody\"></tbody></table>"
                    myModal.body.append(Template.replace(/SHORTNAME/g, step).replace("TITLE", intro_steps[step].label /*_("Step One: CIM Searches").t()*/ ).replace("NUMCOLUMNS", "4"))
                }
        
        
                myModal.footer.append($('<button>').attr({
                    type: 'button',
                    'data-dismiss': 'modal',
                    'data-bs-dismiss': 'modal'
                }).addClass('btn ').text('Close').on('click', function() {
                    $("#introspectionStatus").css("display", "none");
                    $("#introspectionStatusBackdrop").css("display", "none");
                }), $('<button>').attr({
                    type: 'button'
                }).addClass('btn ').css("float", "left").text('Reset All Configurations').on('click', function() {
                    
                    
                        resetEverything();
                    
                    
                }))
                myModal.show(); // Launch it!
        
        
                deferral.resolve()
            }
            let overallStatusCallStatus = 0

            function updateOverallElementStatus(id){
                let obj = intro_elements[id]
                if(id.match(/^DS\d\d\d/)){
                    setStageStatus(id, undefined, obj.jsonStatus['step-cim']['status'])
                }else{
                    if(obj["status"] == "cancelled" || obj["status"] == "skipped" || obj["status"] == "blocked" || obj["status"] == "nearFuture" || obj["status"] == "manual"){
                        return true;
                    }else if(obj['jsonStatus']['step-eventsize'] && obj['jsonStatus']['step-eventsize']['status'] == "success" && obj['jsonStatus']['step-volume'] && obj['jsonStatus']['step-volume']['status'] == "success"){
                        obj['stage'] = "all-done"
                        obj['status'] = "complete"
                    }else if(obj['jsonStatus']['step-eventsize'] && obj['jsonStatus']['step-eventsize']['status'] == "pending" && obj['jsonStatus']['step-volume'] && obj['jsonStatus']['step-volume']['status'] == "pending"){
                        obj['stage'] = "step-eventsize"
                        obj['status'] = "analyzing"
                    }else if(obj['jsonStatus']['step-eventsize'] && obj['jsonStatus']['step-eventsize']['status'] == "failure"){
                        obj['stage'] = "step-eventsize"
                        obj['status'] = "introspectionFailed"
                    }else if(obj['jsonStatus']['step-volume'] && obj['jsonStatus']['step-volume']['status'] == "failure"){
                        obj['stage'] = "step-volume"
                        obj['status'] = "introspectionFailedTwo"
                    }else if(obj['jsonStatus']['step-volume'] && obj['jsonStatus']['step-volume']['status'] == "success"){
                        obj['stage'] = "step-eventsize"
                        obj['status'] = "analyzing"

                    }else if(obj['jsonStatus']['step-eventsize'] && obj['jsonStatus']['step-eventsize']['status'] == "success"){
                        obj['stage'] = "step-volume"
                        obj['status'] = "analyzingtwo"
                    }else if(obj['jsonStatus']['step-sourcetype'] && obj['jsonStatus']['step-sourcetype']['status'] == "success"){
                        if(id.match(/NEEDSREVIEW_/)){
                            if(obj["stage"] != "step-review"){
                                obj['stage'] = "step-review"
                                obj['status'] = "needsConfirmation"
                            }
                        }else{
                            // console.log("APPLICATION ERROR -- Unhandled Status", obj['stage'], obj['status'], obj);
                        }
                    }else if(obj['jsonStatus']['step-sourcetype'] && obj['jsonStatus']['step-sourcetype']['status'] == "failure"){
                        intro_elements[id]["status"] = "failure";
                    }
                }
            }
            
            function overallStatus(updateTime){
                // Dispatches the different status functions to update the counts 
                if(overallStatusCallStatus == 0){
                    overallStatusCallStatus = 1
                    setTimeout(function(){
                        overallStatus(true)
                    }, 1000)
                }else if(updateTime){
                    overallStatusCallStatus = 0;
                    let initreturn = intro_steps["step-init"].status()
                    let cimreturn = intro_steps["step-cim"].status()
                    let sourcetypereturn = intro_steps["step-sourcetype"].status()
                    let reviewreturn = intro_steps["step-review"].status()
                    let volumereturn = intro_steps["step-volume"].status()
                    let eventsizereturn = intro_steps["step-eventsize"].status()
                    let remaining = initreturn.remaining + cimreturn.remaining + sourcetypereturn.remaining + volumereturn.remaining + eventsizereturn.remaining;
                    let complete = initreturn.complete + cimreturn.complete + sourcetypereturn.complete + volumereturn.complete + eventsizereturn.complete;
                    if(remaining == 1 && initreturn.remaining == 1){
                        remaining = 0;
                    }
                    let searching = grabAllSearches("searching").length;
                    if (remaining == 0 && searching == 1) {
                        //Fix. This happens when all searches are complete but we still see a 0 on the button. 
                        searching = 0
                    }
                    // console.log("STATUS COMPLETE, GOT", remaining, complete)
                    if(searching>0){
        
                        $(".data-inventory-play-stop-button[data-status=play]").attr("data-status", "pause").unbind("click").click(function(){
                            pauseSearches()
                        }).find("i").removeClass("icon-play").addClass("icon-pause")
                        $("#data-inventory-show-button").text((remaining + searching) + " " + _("Remaining").t() )
                        $(".data-inventory-play-stop-button").show()
                    }else{
                        if(remaining === 0){
                            $(".data-inventory-play-stop-button").hide()
                            $("#data-inventory-show-button").text(_("Completed").t() )

                            // Sending telemetry when introspection is completed
                            let record = { "name": "Introspection", "value": "completed", "status": "completed", "page": mvc.Components.getInstance("env").toJSON()['page'] }

                            if(localStorage["introspection-completed"] === "false"){
                                Telemetry.SendTelemetryToSplunk("DataInventoryIntrospection", record)
                                // console.log("Sending Completion Telemetry: ", localStorage["introspection-completed"]);
                                localStorage["introspection-completed"] = true;
                            }

                        }else{
                            $(".data-inventory-play-stop-button").show()
                            $(".data-inventory-play-stop-button").attr("data-status", "play").unbind("click").click(function(){
                                startSearches()
                            }).find("i").attr("class", "icon-play")
                            $("#data-inventory-show-button").text((remaining + searching) + " " + _("Remaining").t() )
                        }
                    }
                }
                if (typeof window.updateIconsAndCounts == "function") { 
                    window.updateIconsAndCounts()
                }
            }
        
            function startPoller(){
                // Starts the pollers that will actually launch searches
                // Those pollers will iterate through and: 
                //      - count up the # of searches that are running
                //      - call poll(id) for each running search
                //      - if the # of running searches is < max_running_searches, start the next one in queue
                window.poller1 = setInterval(function() {
                    
                    let runningSearches = grabAllSearches("searching") //.concat(subsetIntroElementsAsArray({"status": "searching"}));
                    
                    let pendingSearches = grabAllSearches("pending") //.concat(subsetIntroElementsAsArray({"status": "pending"}));
                    // console.log("POLLER - Kicking off", "Running:", runningSearches.length, "Pending:", pendingSearches.length);
                    let sortOrder = {
                        "step-init": 0,
                        "step-cim": 1,
                        "step-sourcetype": 2,
                        "step-review": 10, 
                        "step-eventsize": 3,
                        "step-volume": 4
                    }
                    
                    pendingSearches.sort(function(a, b){
                        if (sortOrder[a.stage] > sortOrder[b.stage]) {
                            return 1;
                        }
                        if (sortOrder[a.stage] < sortOrder[b.stage]) {
                            return -1;
                        }
                        return 0;
                    })
                    // console.log("Got this list of sorted pending searches")
                    if (runningSearches.length >= 5) {
                        // console.log("5 searches already running, no more!")
                    } else if ( pendingSearches.length > 0) {
                        // console.log("POLLER - Only", runningSearches.length, "searches with" + pendingSearches.length + " to go. Adding one more:", pendingSearches[0]["_key"], JSON.parse(JSON.stringify(pendingSearches[0])))
                        // console.log("Looking for....", pendingSearches[0]["stage"], pendingSearches[0]["_key"], intro_elements[pendingSearches[0]["_key"]]['jsonStatus'])
                        intro_elements[pendingSearches[0]["_key"]]['jsonStatus'][pendingSearches[0]["stage"]].status = "searching";
                        intro_steps[pendingSearches[0].stage].start( pendingSearches[0]["_key"] )
        
                    }
                    //console.log("Status: ", "Total: " + $("tr.search").length, "Searching: " + $("tr.search[data-status=searching]").length, "Pending: " + $("tr.search[data-status=pending]").length,  "Success: " + $("tr.search[data-status=success]").length,  "Failure: " + $("tr.search[data-status=failure]").length)
                }, 500);
                window.poller2 = setInterval(function() {
                    // if ($("tr.search[data-status=new]").length == 0) {
                    //     updateStatusOverall()
                    // }
                    let blockedRowsUI = $(".introspection-step-sourcetype-search[data-status=blocked]")
                    for(let i = 0; i < blockedRowsUI.length; i++){
                        let id = $(blockedRowsUI[i]).attr("data-id")
                        if(! intro_elements[id] || intro_elements[id].stage != "step-sourcetype"){

                            $(blockedRowsUI[i]).attr("data-status", "complete")
                            $(blockedRowsUI[i]).find(".running-status").html( _("Search Complete").t() )
                            $(blockedRowsUI[i]).find(".result").html( _("Not Needed. Data found in CIM search.").t() )
                            $(blockedRowsUI[i]).find(".cancelSearch").html("")
                        }
                        
                    }
        
                    // I don't remember the original reason for this... but I assume this is what is needed?
                    let runningSearches = grabAllSearches("searching") // subsetIntroElementsAsArray({"status": "searching"});
                    // console.log("POLLER2 - Here's the runningSearches", runningSearches)
                    for(let i = 0; i < runningSearches.length; i++){
                        intro_steps[runningSearches[i]['stage']].poll(runningSearches[i]['_key'])
                    }
                    overallStatus()
                }, 5000);
            }
            window.startPoller = startPoller
            function pauseSearches(count){
                
                if(window.poller1){
                    clearInterval(window.poller1);
                }
                
                if(window.poller2){
                    clearInterval(window.poller2);
                }
                
                if(!count){
                    count = 4
                }else if(count == 1){
                    return;
                }else{
                    count = count - 1;
                }
                let activeSearches = grabAllSearches("searching")// subsetIntroElementsAsArrayOfKeys({"status": "searching"});
                // console.log("Pausing the following active searches", activeSearches)
                for(let i = 0; i < activeSearches.length; i++){
                    // console.log("Pausing this one now", activeSearches[i])
                    cancelSearch(activeSearches[i]['_key']);
                    intro_elements[activeSearches[i]['_key']]['jsonStatus'][ activeSearches[i]['stage'] ]['status']= "pending"
                    intro_steps[activeSearches[i]['stage']].updateDisplay(activeSearches[i]["_key"])
                    updateKVStore(activeSearches[i]['_key'])
                    overallStatus()
                }
                setTimeout(function(){
                    pauseSearches(count);
                }, 200)
            }
        
            function startSearches(){

                let status = "start"
                let event = "click"

                let record = { "name": "Introspection", "value": "started", "status": "running", "page": mvc.Components.getInstance("env").toJSON()['page'] }

                // Send Telemetry data to indicate the searches have started
                Telemetry.SendTelemetryToSplunk("DataInventoryIntrospection", record)
                localStorage["introspection-completed"] = false;
                // NOT COMPLETE
                // Sets the new searches to pending
                // Calls the poller function
                let newSearches = grabAllSearches("new")// subsetIntroElementsAsArray({"status": "new"})
                for(let i = 0; i < newSearches.length; i++){
                    intro_elements[ newSearches[i]['_key'] ]['jsonStatus'][ newSearches[i]['stage'] ].status = "pending"
                }
                if(window.trace_introspection_id && ! window.setIntervalDebugTracer){
                    let lastStage = ""
                    let lastStatus = ""
                    let localDebug = []
                    let myElement =window.trace_introspection_id
                    window.setIntervalDebugTracer = setInterval(function(){
                        if(intro_elements[myElement]){
                            if(intro_elements[myElement]['status'] != lastStatus || intro_elements[myElement]['stage'] != lastStage){
                                localDebug.push({"time": Date.now / 1000, "stage": intro_elements[myElement]['stage'], "status": intro_elements[myElement]['status']})
                                // console.log("STATUSCHANGE", {"time": Date.now() / 1000, "stage": intro_elements[myElement]['stage'], "status": intro_elements[myElement]['status']})
                                lastStage = intro_elements[myElement]['stage']
                                lastStatus = intro_elements[myElement]['status']
                            }
                        }
                    }, 10)
                }
                startPoller()
            }
            window.startSearches = startSearches;
        
            function removeProductFromKVStore(key){
                if(key && key!=""){
                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/' + key,
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function(returneddata) {
                        },
                        error: function(xhr, textStatus, error) {
                        }
                    })
                }
            }
            
            function resetEverything(){
        
                var myModal = new Modal("resetEverythingConfirmation", {
                    title: _("Reset All Data Inventory").t(),
                    backdrop: 'static',
                    keyboard: false,
                    destroyOnHide: false
                }, $);
        
                myModal.body
                    .append($("<p>").text(_("Are you sure you want to reset all settings? This will include any manually created products.").t()));
        
                
                myModal.footer.append($('<button>').attr({
                    type: 'button',
                    'data-dismiss': 'modal',
                    'data-bs-dismiss': 'modal'
                }).addClass('btn ').text('Cancel').on('click', function() {
                }),$('<button>').attr({
                    type: 'button',
                    'data-dismiss': 'modal',
                    'data-bs-dismiss': 'modal'
                }).addClass('btn ').text('Reset').on('click', function() {
                    pauseSearches();
                    setTimeout(function(){
                        let clearDSCs = $.Deferred();
                        let clearProducts = $.Deferred();
                        $.ajax({
                            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
                            type: 'DELETE',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-Splunk-Form-Key': window.getFormKey(),
                            },
                            async: true,
                            success: function(returneddata) {
                                clearDSCs.resolve()
                            },
                            error: function(xhr, textStatus, error) {
        
                                let myModal = new Modal('clearConfirmedDSC', {
                                    title: 'Error!',
                                    destroyOnHide: true,
                                    type: 'wide'
                                }, $);
                                myModal.body.html($("<div>").append($("<p>Error Clearing Data Source Category Details</p>"), $("<pre>").text(textStatus)))
                                myModal.footer.append($('<button>').attr({
                                    type: 'button',
                                    'data-dismiss': 'modal',
                                    'data-bs-dismiss': 'modal'
                                }).addClass('btn btn-primary ').text('Close'))
                                myModal.show()
                            }
                        })
                        $.ajax({
                            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
                            type: 'DELETE',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-Splunk-Form-Key': window.getFormKey(),
                            },
                            async: true,
                            success: function(returneddata) {
                                clearProducts.resolve()
                            },
                            error: function(xhr, textStatus, error) {
        
                                let myModal = new Modal('clearConfirmedProd', {
                                    title: 'Error!',
                                    destroyOnHide: true,
                                    type: 'wide'
                                }, $);
                                myModal.body.html($("<div>").append($("<p>Error Clearing Product Details</p>"), $("<pre>").text(textStatus)))
                                myModal.footer.append($('<button>').attr({
                                    type: 'button',
                                    'data-dismiss': 'modal',
                                    'data-bs-dismiss': 'modal'
                                }).addClass('btn btn-primary ').text('Close'))
                                myModal.show()
                            }
                        })
        
                        $.when(clearDSCs, clearProducts).then(function(){
        
                            let myModal = new Modal('clearConfirmedComplete', {
                                title: 'Success!',
                                destroyOnHide: true,
                                type: 'wide'
                            }, $);
                            myModal.body.html($("<div>").append($("<p>Successfully Cleared Data</p>")))
                            myModal.footer.append($('<button>').attr({
                                type: 'button',
                            }).addClass('btn btn-primary ').text('Refresh Page').click(function(){
                                location.reload();
                                $('[data-bs-dismiss=modal').click()
                            }))
                            myModal.show()
                        })
                    },500)
                }))
                myModal.show(); // Launch it!
        
            }
            
            function acceptNewEventtypeCoverageLevel(eventtypeId, coverage_level){
                let isUpdated = false;
                for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                    if(eventtypeId == window.data_inventory_eventtypes[i].eventtypeId){
                        window.data_inventory_eventtypes[i]['coverage_level'] = coverage_level
                        isUpdated = true
                        if(intro_elements[eventtypeId]){
                            // TODO this is a bug I'm working around... we're not setting coverage_level for things that we should.
                            intro_elements[eventtypeId]['coverage_level'] = coverage_level
                            // This call to updateKVStore was rendering an empty extra product row so commenting it. (SSE-401)
                            // updateKVStore(eventtypeId)    

                            // console.log("Sent coverage_level update", eventtypeId, coverage_level)
                        }else{
                            // console.log("Was going to update coverage_level, but couldn't find it in intro_elements", eventtypeId, coverage_level)
                        }
                        
                    }
                }
                if(! isUpdated){
                    // console.log("Was going to update coverage_level, but couldn't find the id in window.data_inventory_eventtypes", eventtypeId, coverage_level)
                }
            }
            window.acceptNewEventtypeCoverageLevel = acceptNewEventtypeCoverageLevel
        
            function requestKVStoreUpdate(collection_name, updateTime){
                
                // Model: 0 = not scheduled, 1 = scheduled, 2 = in progress, 3 = got a request mid-bust, schedule another to run after it completes.
                if(kvstore_update_queue[collection_name]['status'] == 0){
                    kvstore_update_queue[collection_name]['status'] = 1
                    //console.log("scheduled!")
                    setTimeout(function(){
                        requestKVStoreUpdate(collection_name, true)
                    }, 2000)
                }else if(updateTime){
                    // time to update
        
                    let objects = {}
                    while(kvstore_update_queue[collection_name]['queue'].length > 0){
                        let obj = kvstore_update_queue[collection_name]['queue'].shift();
                        objects[obj['_key']] = obj;
                    }
                    kvstore_update_queue[collection_name]['status'] = 0;
                    let objectsAsArray = []
                    for(let key in objects){
                        objectsAsArray.push(objects[key])
                    }
                    // console.log("pushing a big update to the kvstore", objectsAsArray)
        
                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/' + collection_name + '/batch_save',
                        type: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: false,
                        data: JSON.stringify(objectsAsArray),
                        success: function(returneddata) {
                            // console.log("Got a return from my big update", returneddata)
                            bustCache()
                        },
                        error: function(xhr, textStatus, errorThrown){
                            //triggerError("Got an error while trying to update the kvstore. Your changes may not be saved." + " Type: " + errorThrown + " XHR: "+ JSON.stringify(xhr, null, 4))
                            console.log("kvstore error", xhr, textStatus, errorThrown);
                        }
        
                    
                    })
                    
                }
            }
        
        
            function huntForNewAnalyzingProducts(){
                for(let i = 0; i < window.data_inventory_products.length; i++){             
                    if(
                        window.data_inventory_products[i].status == "analyzing" && 
                        intro_elements[ window.data_inventory_products[i].productId ] && 
                        (intro_elements[ window.data_inventory_products[i].productId ].stage != "step-eventsize" || 
                            (intro_elements[ window.data_inventory_products[i].productId ].stage == "step-eventsize" && (intro_steps["step-cim"].status().remaining == 0 || !intro_elements[window.data_inventory_products[i].productId]['jsonStatus']))
                        )
                    ) {
                        if(intro_elements[window.data_inventory_products[i].productId]){
                            if(! intro_elements[window.data_inventory_products[i].productId]['jsonStatus']){
                                intro_elements[window.data_inventory_products[i].productId]['jsonStatus'] = {}
                            }

                            intro_elements[window.data_inventory_products[i].productId]['jsonStatus']['step-eventsize'] = {"status": "pending"}
                            intro_elements[window.data_inventory_products[i].productId]['jsonStatus']['step-volume'] = {"status": "pending"}
                            load(window.data_inventory_products[i].productId)
                            //console.log("We added a new product so start the poller")
                            startPoller()
                        }else{
                            // console.log("APPLICATION ERROR -- Missing an intro_elements", window.data_inventory_products[i].productId)
                        }
                        // intro_steps['step-eventsize'].load( window.data_inventory_products[i].productId );
                    }
                }
            }
            window.huntForNewAnalyzingProducts = huntForNewAnalyzingProducts
        
            
            ///////////////////////////////
            /// Global Helper Functions ///
            ///////////////////////////////
        
            function notifyIntroElementsOfEventtypeChange(obj){
                // console.log("Received a requested intro_elements Update", obj)
                if(intro_elements[obj["_key"]]){
                    intro_elements[obj["_key"]]['last_kvstore'] = JSON.parse(JSON.stringify(obj));
                    for(let field in obj){
                        intro_elements[obj["_key"]][field] = obj[field]
                    }
                }else{
                    intro_elements[obj["_key"]] = obj;
                }
                overallStatus()
            }
            window.notifyIntroElementsOfEventtypeChange = notifyIntroElementsOfEventtypeChange

            function notifyIntroElementsOfProductChange(obj, postUpdate){
                // console.log("Received a requested intro_elements Update", obj)
                if(intro_elements[obj["_key"]]){
                    intro_elements[obj["_key"]]['last_kvstore'] = JSON.parse(JSON.stringify(obj));;
                    for(let field in obj){
                        intro_elements[obj["_key"]][field] = obj[field]
                    }
                }else{
                    intro_elements[obj["_key"]] = obj;
                }
                if(postUpdate){
                    // console.log("Pushing update for", obj["_key"], obj)
                    updateKVStore(obj["_key"], null, true);
                }
                overallStatus()
            }
            window.notifyIntroElementsOfProductChange = notifyIntroElementsOfProductChange
        
            function notifyIntroElementsOfProductDelete(obj){
                
                let key = ""
                if(typeof obj == "object"){
                    key = obj["_key"]
                }else{
                    key = obj;
                }
                // console.log("Received a requested intro_elements DELETE", key, obj)
                delete intro_elements[key]
                overallStatus()
            }
            window.notifyIntroElementsOfProductDelete = notifyIntroElementsOfProductDelete
        
            function genericUpdateDisplay(id, stage){
                let status;
                if(intro_elements[id]["jsonStatus"] && intro_elements[id]["jsonStatus"][stage] && intro_elements[id]["jsonStatus"][stage]["status"]){
                    status = intro_elements[id]["jsonStatus"][stage]['status']
                }else{
                    status = intro_elements[id]["status"]
                }
                // console.log("Setting status (genericUpdateDisplay) For id", id, "stage", stage, "to", status, " -- pulling from newMethod?", intro_elements[id]["jsonStatus"] && intro_elements[id]["jsonStatus"][stage] && intro_elements[id]["jsonStatus"][stage]["status"])
                let row = $(".introspection-" + stage + "-search[data-id=" + id.replace(/([^a-zA-Z0-9_\-])/g, "\\$1") + "]")
                row.attr("data-status", status)
                if(status == "searching"){
                    row.find(".running-status").html("<img title=\"Running\" src=\"" + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + "\">") // loading
                    if(intro_elements[id]["search_details"] && intro_elements[id]["search_details"]["sid"]){
                        row.find(".result").html($("<a class=\"external drilldown-link\" target=\"_blank\">").attr("href", "search?sid=" + intro_elements[id]["search_details"]["sid"]))
                    }
                }else if(status == "failure" || status == "error"){
                    row.find(".cancelSearch").html("")
                    row.find(".running-status").html( _("Search Complete").t() )
                    row.find(".result").prepend( _("Did not find any data ").t() )
                }else if(status == "cancelled"){
                    row.find(".cancelSearch").html("")
                    row.find(".running-status").html( _("Cancelled by User").t() )
                }else if(status == "skipped"){
                    row.find(".cancelSearch").html("")
                    row.find(".running-status").html( _("Not Needed. Data found in CIM search.").t() )
                }else if(status == "complete" || status == "success"){
                    row.find(".cancelSearch").html("")
                    row.find(".running-status").html( _("Search Complete").t() )
                    row.find(".result").prepend( _("Found data ").t() )
                }else if(status == "blocked"){
                    row.find(".running-status").html( _("Waiting on CIM Search to Complete").t() )
                }else if(status == "reviewed"){
                    row.find(".running-status").html( _("Reviewed").t() )
                    row.find("a").remove()
                }
                overallStatus()
            }
        
            function genericPoll(id, stage){
                if(intro_elements[id].status == "searching"){
                    if(! intro_elements[id].search_details){ // If there is no defined search_details, that means this is a holdover from before. We define this every time.
                        setTimeout(function(){
                            if(intro_elements[id].status == "searching"){
                                if(! intro_elements[id].search_details){ 
                                    // if(window.trace_introspection_id == id){
                                        // console.log("STATUSCHANGE -- polling set to failure for", id, "due to missing search manager")
                                    // }
                                    
                                    //JB Search manager is never defined for step-init so commenting out 
                                    if (intro_elements[id].stage!="step-init") {
                                        intro_elements[id].status = "failure"
                                        intro_elements[id]["jsonStatus"][intro_elements[id].stage]['status'] = "failure"
                                    }
                                    
                                    
                                    updateKVStore(id);
                                    intro_steps[stage].updateDisplay(id)
                                }
                            }
                        }, 500)
                    } else if(intro_elements[id].search_details.search_name 
                             && intro_elements[id].search_details.search_started 
                             && ! splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name)
                             && Date.now() / 1000 - intro_elements[id].search_details.search_started > 30){
                        //if(window.trace_introspection_id == id){
                          //  console.log("STATUSCHANGE -- polling reset to pending for", id, "due to timed out search manager")
                        //}
                        
                        // Search manager doesn't exist. Something failed in a weird way, so let's change back to pending.
                        intro_elements[id].status = "failure"
                        intro_elements[id]["jsonStatus"][intro_elements[id].stage]['status'] = "failure"
                        updateKVStore(id);
                        intro_steps[stage].updateDisplay(id)
                    }else if(splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name) 
                                && splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name).attributes 
                                && splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name).attributes.data 
                                && splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name).attributes.data.dispatchState == "DONE"){
                        setTimeout(function(){
                            // if(window.trace_introspection_id == id){
                                // console.log("STATUSCHANGE -- got a completion mark", id, "and then resetting to search")
                            // }
                            var results = splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name).data('results', { output_mode: 'json', count: 0 });
                            results.on("data", function(properties) {
                                var id = properties.attributes.manager.id
                                var data = properties.data().results
                                //console.log("STATUSCHANGE - Got data", data)
                                if (data && data.length && data.length >= 1) {
                                    intro_elements[id]["search_result"] = JSON.stringify(data);
                                    intro_elements[id].status = "complete"
                                    intro_elements[id]["jsonStatus"][intro_elements[id].stage]['status'] = "complete"
                                    intro_steps[stage].handleResults(id)
        
                                } else {
                                    intro_elements[id].status = "failure"
                                    intro_elements[id]["jsonStatus"][intro_elements[id].stage]['status'] = "failure"
                                }
                                updateKVStore(id);
                                intro_steps[stage].updateDisplay(id)
                                revokeSM(id)
                            })
                        }, 500)
                    // }else if( splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name) && splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name).attributes && splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name).attributes.data && splunkjs.mvc.Components.getInstance(intro_elements[id].search_details.search_name).attributes.data.dispatchState != "RUNNING"){
                    //     // search didn't seem to work
                    //     intro_elements[id].status = "failure"
                    //     updateKVStore(id);
                    //     intro_steps[stage].updateDisplay(id)
                    //     revokeSM(id)
                    } else if(intro_elements[id].search_details.search_started - Math.round(Date.now() / 1000) > 720){
                        // If the search has been running for over 12 minutes
        
                        // if(window.trace_introspection_id == id){
                            // console.log("STATUSCHANGE -- cancelling the search", id)
                        // }
                        intro_elements[id].status = "failure"
                        intro_elements[id]["jsonStatus"][intro_elements[id].stage]['status'] = "failure"
                        updateKVStore(id);
                        intro_steps[stage].updateDisplay(id)
                        cancelSearch(id)
                        revokeSM(id)
                        
                    }else{
                    // // Who knows what went wrong, just fail to safety
                    //     if(window.trace_introspection_id == id){
                            // console.log("STATUSCHANGE -- Unknown what happened... failing the search", id, JSON.stringify(intro_elements[id]))
                    //     }
                    //     intro_elements[id].status = "failure"
                    //     updateKVStore(id);
                    //     intro_steps[stage].updateDisplay(id)   
                    }
                }
            }

            function reportTelemetry(id, counter){
                if(! window.valid_ootb_products || ! window.valid_ootb_products.vendorName || window.valid_ootb_products.vendorName.length == 0){
                    if(!counter){
                        counter = 5
                    }
                    counter--;
                    if(counter>0){
                        setTimeout(function(){
                            reportTelemetry(id, counter)
                        }, 500)
                        return;
                    }
                }
                if(!window.telemetry){
                    window.telemetry = {}
                }
                let element = {}
                for(let i = 0; i < window.data_inventory_products.length; i++){
                    if(id == window.data_inventory_products[i].productId){
                        element = window.data_inventory_products[i]
                    }
                }
                if(window.telemetry[id] && window.telemetry[id] != element.stage){
                    return true;
                    // don't update the telemetry if the status is at the same stage
                }

                let keysThatWeCanUpdate = ["stage", "cim_detail", "eventsize", "cim_compliant_fields", "daily_event_volume", "daily_host_volume", "coverage_level"]
                let telemetryObj = {}
                
                if(element.vendorName){
                    if(typeof window.valid_ootb_products != "undefined" && window.valid_ootb_products.vendorName.indexOf(element.vendorName) >= 0){
                        telemetryObj.vendorName = element.vendorName
                    }else{
                        telemetryObj.vendorName = "CUSTOM_NOT_REPORTED"
                    }
                }else{ 
                    telemetryObj.vendorName = "EMPTY"
                }
                if(element.productName){
                    if(window.valid_ootb_products.productName.indexOf(element.productName) >= 0){
                        telemetryObj.productName = element.productName
                    }else{
                        telemetryObj.productName = "CUSTOM_NOT_REPORTED"
                    }
                }else{ 
                    telemetryObj.productName = "EMPTY"
                }
                telemetryObj.productId = telemetryObj.vendorName.replace(/ /g, "_").replace(/[^a-zA-Z0-9\-\_]/g, "") + "__" + telemetryObj.productName.replace(/ /g, "_").replace(/[^a-zA-Z0-9\-\_]/g, "")
                for(let i = 0; i < keysThatWeCanUpdate.length; i++){
                    if(element[keysThatWeCanUpdate[i]] && element[keysThatWeCanUpdate[i]] != ""){
                        telemetryObj[keysThatWeCanUpdate[i]] = element[keysThatWeCanUpdate[i]];
                    }else{
                        telemetryObj[keysThatWeCanUpdate[i]] = "";
                    }
                }
                if(element['metadata_json']){
                    if(element['metadata_json'].indexOf("*Automation") >= 0){
                        telemetryObj.source = "Automation"
                    }else{
                        telemetryObj.source = "Manual"
                    }
                }else{
                    telemetryObj.source = "Unknown"
                }

                // console.log("ADDING TELEMETRY", "DataStatusChange", telemetryObj)
                require(["components/data/sendTelemetry", 'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config'], function(Telemetry, appConfig) {
                    for(let i = 0; i < appConfig.length; i++){
                        if(appConfig[i].param == "demoMode" && appConfig[i].value == "true"){
                             telemetryObj.demoMode = true
                        }
                    }
                    
                    Telemetry.SendTelemetryToSplunk("DataStatusChange", telemetryObj)
                })
                // console.log("Sending to telemetry!", telemetryObj)

            }
            window.reportTelemetry = reportTelemetry;
        
            function updateEventSizeVolumeStatus(id){
                let eventsizeStatus = "notdone";
                let volumeStatus = "notdone";
                if(intro_elements[id]['jsonStatus'] && intro_elements[id]['jsonStatus']['step-eventsize'] && intro_elements[id]['jsonStatus']['step-eventsize']['status']){
                    eventsizeStatus = intro_elements[id]['jsonStatus']['step-eventsize']['status']
                }
                if(intro_elements[id]['jsonStatus'] && intro_elements[id]['jsonStatus']['step-volume'] && intro_elements[id]['jsonStatus']['step-volume']['status']){
                    volumeStatus = intro_elements[id]['jsonStatus']['step-volume']['status']
                }
                
                if(eventsizeStatus == "notdone"){
                    intro_elements[id]['stage'] = "step-eventsize"
                }else if(eventsizeStatus == "failure"){
                    intro_elements[id]['stage'] = "step-eventsize"
                    intro_elements[id]['status'] = "introspectionFailed"
                }else if(volumeStatus == "notdone"){
                    intro_elements[id]['stage'] = "step-volume"
                    if(intro_elements[id]['status'] != "searching" && intro_elements[id]['status'] != "pending"){
                        intro_elements[id]['status'] = "pending"
                    }
                }else if(volumeStatus == "failure"){
                    intro_elements[id]['stage'] = "step-volume"
                    intro_elements[id]['status'] = "introspectionFailed"
                }else{
                    intro_elements[id]['stage'] = "all-done"
                    intro_elements[id]['status'] = "complete"
                    reportTelemetry(id);
                }
            }
        
            function merge(id1, id2){
                // NOT COMPLETE
                // Takes two overlapping IDs and merges them together
            }
        
            function revokeSM(id){
                setTimeout(function(){
                    try{
                    splunkjs.mvc.Components.revokeInstance(id)
                    }catch(error){
                        // Nothing! We catch nothing!
                    }
                }, 10000)
            }
        
            function pullStatusElementCount(criteria){
                
                if(criteria['status'] && criteria['stage']){
                    return $(".introspection-" + criteria['stage'] + "-search[data-status=" + criteria["status"] + "]").length
                }
                return -1
            }
            function grabAllSearches(status){
                let matches = []
                for(let key in intro_elements){
                    if(intro_elements[key]['jsonStatus']){
                        if(Object.keys(intro_elements[key]['jsonStatus']).length === 0){
                            if (intro_elements[key]['stage'] && intro_elements[key]['status']) {
                                //console.log("updating jsonStatus as it is empty", intro_elements[key])
                                let newStatus=intro_elements[key]['status']
                                let newStage=intro_elements[key]['stage']
                                intro_elements[key]['jsonStatus'][newStage] = {}
                                intro_elements[key]['jsonStatus'][newStage] =  {"status": newStatus}
                            }
                        }
                        for(let stage in intro_elements[key]['jsonStatus']){
                            if(intro_elements[key]['jsonStatus'][stage]['status'] && intro_elements[key]['jsonStatus'][stage]['status'] == status){
                                matches.push({"stage": stage, "_key": key})
                            }
                        }
                    }
                }
                return matches;
            }
            window.grabAllSearches = grabAllSearches
            function subsetIntroElementsAsArray(criteria){
                let matchingCriteria = [];
                for(let key in intro_elements){
                    let matches = true;
                    for(let crit in criteria){
                        if( ! (intro_elements[key][crit] && (criteria[crit] == null || intro_elements[key][crit] == criteria[crit]))){
                            matches = false;
                        }
                    }
                    if(matches){
                        matchingCriteria.push(intro_elements[key])
                    }
                }
                return matchingCriteria
            }
            window.subsetIntroElementsAsArray = subsetIntroElementsAsArray
            function subsetIntroElementsAsArrayOfKeys(criteria){
                let matchingCriteria = [];
                for(let key in intro_elements){
                    for(let crit in criteria){
                        if(intro_elements[key][crit] && (criteria[crit] == null || intro_elements[key][crit] == criteria[crit])){
                            matchingCriteria.push(key)
                        }
                    }
                }
                return matchingCriteria
            }
        
            function updateKVStore(id, updateOnly, forceUpdate){
                // Record the last kvstore object in intro_elements
                // Compare to validate changes
                // Whitelist stages and keys that get updated
                // Sync with window.data_inventory_eventtypes
                // Also update the UI if it's appropriate
                if(! window.data_inventory_eventtypes){
                    window.data_inventory_eventtypes = []
                }
                if(! window.data_inventory_products){
                    window.data_inventory_products = []
                }
                if(!intro_elements[id]){
                    // console.log("Invalid ID given for kvstore update!", id)
                    return;
                }
                let shouldUpdate = false;
                let newObject = {};
                if(/^DS\d\d\d[A-Z]/.test(id) || /^VendorSpecific/.test(id)){
                    // console.log("Got a started kvstore update", id)
                    // This is an eventtype and not a productId
                    let kvstore_fields = ["_key", "name", "datasource", "created_time", "eventtypeId", "status", "basesearch", "search_result", "coverage_level","legacy_name"]
                    if(! intro_elements[id]['last_kvstore']){
                        let updated = false;
                        for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                            if(window.data_inventory_eventtypes[i]["_key"] == id){
                                intro_elements[id]['last_kvstore'] = JSON.parse(JSON.stringify(window.data_inventory_eventtypes[i]))
                                updated = true;
                            } 
                        }
                        if(!updated){
                            intro_elements[id]['last_kvstore'] = {};
                            for(let i =0; i < kvstore_fields.length; i++){
                                if(kvstore_fields[i] == "_key" || kvstore_fields[i] == "eventtypeId"){
                                    intro_elements[id]['last_kvstore'][kvstore_fields[i]] = id;
                                }else{
                                    intro_elements[id]['last_kvstore'][kvstore_fields[i]] = ""
                                }
                            }
                        }
                    }
                    // console.log("Got a continued kvstore update", id)
                    
                    newObject = intro_elements[id]['last_kvstore']
                    for(let i =0; i < kvstore_fields.length; i++){
                        if(intro_elements[id][kvstore_fields[i]] != newObject[kvstore_fields[i]]){
                            // console.log("Got a changed value for", id, "From:", newObject[kvstore_fields[i]], "to:", intro_elements[id][kvstore_fields[i]])
                            newObject[kvstore_fields[i]] = intro_elements[id][kvstore_fields[i]];
                            shouldUpdate = true;
                        }
                    }
                    // console.log("Got a more continued kvstore update", id)
                    if(shouldUpdate || forceUpdate){
                        // console.log("Got a should update kvstore update", id)
                        if(window.introspection_debug && (intro_elements[id]['last_kvstore']['status'] != newObject['status'])){
                            sendDebug({"_time": Date.now()/1000 ,
                                "stage": "step-cim",
                                "status": newObject['status'],
                                "id": id,
                                "object": JSON.stringify(newObject)
                            })
                        }
                        newObject["updated_time"] = Math.round(Date.now() / 1000 ) 
                        newObject["datasource"] = window.data_inventory[id.split("-")[0]]["name"]

                        if (/^VendorSpecific/.test(id)) {
                            if (typeof intro_elements[id]['last_kvstore'] !='undefined' && typeof intro_elements[id]['last_kvstore']['legacy_name'] !='undefined') {
                                //If VendorSpecific data source category we use the vendor name as the datasource. This can be found in data_inventory.json legacy_name. We use this as this is what is being used in sseanalytics. 
                                // Filter out the entry Audit Trail as too generic for this purpose
                                newObject["datasource"] = intro_elements[id]['last_kvstore']['legacy_name'].split("|").filter(a => a !== 'Audit Trail')[0] 
                            } else {
                                newObject["datasource"] = intro_elements[id]['last_kvstore']['name']
                            }                              
                        } else {
                            if (typeof window.data_inventory[id.split("-")[0]] != 'undefined' && typeof window.data_inventory[id.split("-")[0]]["name"] != 'undefined') {
                                newObject["datasource"] = window.data_inventory[id.split("-")[0]]["name"]
                            }
                        }

                        // console.log("Updating Eventtype on kvstore", newObject);
                        intro_elements[id]['last_kvstore'] = JSON.parse(JSON.stringify(newObject));
        
                        for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                            if(window.data_inventory_eventtypes[i]["_key"] == id){
                                window.data_inventory_eventtypes[i] = JSON.parse(JSON.stringify(newObject))
                            }
                        }
                        kvstore_update_queue["data_inventory_eventtypes"]['queue'].push(newObject);
                        requestKVStoreUpdate("data_inventory_eventtypes")
                    }else{
                        // console.log("Got a should not update kvstore update", id)
                    }
                    
                }else{
                    let numericFields = ["eventsize", "cim_compliant_fields", "daily_event_volume", "daily_host_volume", "desired_sampling_ratio", "coverage_level"]
                    let kvstore_fields = ["_key", "created_time", "updated_time", "productId", "productName", "vendorName", "eventtypeId", "stage", "status", "basesearch", "metadata_json", "cim_detail", "eventsize", "cim_compliant_fields", "daily_event_volume", "daily_host_volume", "desired_sampling_ratio", "termsearch", "coverage_level", "jsonStatus"];
                    if(! intro_elements[id]['last_kvstore']){
                        let updated = false;
                        for(let i = 0; i < window.data_inventory_products.length; i++){
                            if(window.data_inventory_products[i]["_key"] == id){
                                intro_elements[id]['last_kvstore'] = JSON.parse(JSON.stringify(window.data_inventory_products[i]))
                                updated = true;
                            }
                        }
                        if(!updated){
                            intro_elements[id]['last_kvstore'] = {};
                            for(let i =0; i < kvstore_fields.length; i++){
                                
                                if(kvstore_fields[i] == "_key" || kvstore_fields[i] == "eventtypeId"){
                                    intro_elements[id]['last_kvstore'][kvstore_fields[i]] = id;
                                }else{
                                    intro_elements[id]['last_kvstore'][kvstore_fields[i]] = ""
                                }
                            }
                        }
                    }
                    
                    newObject = JSON.parse(JSON.stringify(intro_elements[id]['last_kvstore'])) 
                    // console.log("Coverage_level before", intro_elements[id]['coverage_level'], newObject['coverage_level'])
                    for(let i =0; i < kvstore_fields.length; i++){
                        if(intro_elements[id][kvstore_fields[i]] != newObject[kvstore_fields[i]]){
                            // console.log("Got a changed value for", id, "-", kvstore_fields[i], "From:", newObject[kvstore_fields[i]], "to:", intro_elements[id][kvstore_fields[i]])
                            newObject[kvstore_fields[i]] = intro_elements[id][kvstore_fields[i]];
                            shouldUpdate = true;
                        }
                    }
                    newObject.jsonStatus = JSON.stringify(intro_elements[id].jsonStatus)
                    // console.log("Coverage_level after", intro_elements[id]['coverage_level'], newObject['coverage_level'])
                    for(let i = 0; i < numericFields.length; i++){
                        if(newObject[numericFields[i]] && newObject[numericFields[i]] != "" && isNaN(newObject[numericFields[i]] ) ){
                            // console.log("Conversion Clause going in for", id, numericFields[i], "pre", newObject[numericFields[i]], "analysis", isNaN(newObject[numericFields[i]] ), "conversion", parseFloat(newObject[numericFields[i]]))
                            let startingPoint = JSON.parse(JSON.stringify(newObject[numericFields[i]]))
                            try{
                                if(newObject[numericFields[i]].indexOf(".") >= 0){
                                    newObject[numericFields[i]] = parseFloat(newObject[numericFields[i]])
                                }else{
                                    newObject[numericFields[i]] = parseInt(newObject[numericFields[i]])
                                }
                                
                            }catch(error){
                                delete newObject[numericFields[i]]
                            }
                            // console.log("Conversion Clause for", id, numericFields[i], "start", startingPoint, "end", newObject[numericFields[i]])
                        }
                        // console.log("Post Numeric Handling for", id, numericFields[i], "value", newObject[numericFields[i]])
                        if(newObject[numericFields[i]] == ""){
                            // console.log("ERROR WITH EMPTY STRING FIELD", id, numericFields[i], "value", newObject[numericFields[i]], newObject[numericFields[i]] && (newObject[numericFields[i]] == "" || newObject[numericFields[i]] == " "))
                            delete newObject[numericFields[i]]
                            // console.log("ERROR WITH EMPTY STRING FIELD AFTER", id, numericFields[i], "value", newObject[numericFields[i]], newObject[numericFields[i]] && (newObject[numericFields[i]] == "" || newObject[numericFields[i]] == " "))
                        }
                    }
                    if(shouldUpdate || forceUpdate){
                        if(window.introspection_debug && (intro_elements[id]['last_kvstore']['status'] != newObject['status'] || intro_elements[id]['last_kvstore']['stage'] != newObject['stage'])){
                            sendDebug({"_time": Date.now()/1000 ,
                                "stage": newObject['stage'],
                                "status": newObject['status'],
                                "id": id,
                                "object": JSON.stringify(newObject)
                            })
                        }
                        // console.log("Updating product on kvstore", newObject);
                        intro_elements[id]['last_kvstore'] = JSON.parse(JSON.stringify(newObject));
                        let addedSomewhere = false
                        for(let i = 0; i < window.data_inventory_products.length; i++){
                            if(window.data_inventory_products[i]["_key"] == id){
                                // console.log("HEY, Updating - potential location 1", JSON.parse(JSON.stringify(newObject)))
                                window.data_inventory_products[i] = JSON.parse(JSON.stringify(newObject))
                                addedSomewhere = true;
                            }
                        }
                        if(! addedSomewhere){
                            window.data_inventory_products.push(JSON.parse(JSON.stringify(newObject)))
                        }
        
                        kvstore_update_queue["data_inventory_products"]['queue'].push(newObject);
                        requestKVStoreUpdate("data_inventory_products")
                    }else{
                        // console.log("ERROR, got do not update for", id, newObject, intro_elements[id])
                    }
                    
                }
                if(shouldUpdate && ! updateOnly){
                    let eventtypeIds = newObject['eventtypeId']
                    if(eventtypeIds && newObject['status'] && newObject['status'] != "manualnodata"){
                        if(eventtypeIds.indexOf($(".ds_datasource_active").attr("id")) >= 0 && newObject['status'] != "failure" && newObject['stage'] != "step-cim" && newObject['stage'] != "step-sourcetype"){
                            addOrUpdateRowToDraw(newObject);
                        }
                    }
                }
            }
            window.updateKVStore = updateKVStore
        
            function cancelSearch(id, callback){
                // NOT COMPLETE
                // Cancels a search in progress
                if(intro_elements[id] && intro_elements[id]['search_details'] && intro_elements[id]['search_details']['search_name']){
                    if(splunkjs.mvc.Components.getInstance(intro_elements[id]['search_details']['search_name'])){
                        splunkjs.mvc.Components.getInstance(intro_elements[id]['search_details']['search_name']).cancel()
                        revokeSM(id);
                    }
                }
            }
            window.cancelSearch = cancelSearch
        
            function deleteElement(id, callback){
                // NOT COMPLETE
                // Deletes a search 
                // Used when we will never want to get use that product
            }
            
            function load(object){
                // console.log("LOAD called for", object)
                if(typeof object == "string"){
                    object = intro_elements[object]
                }
                if(! object["jsonStatus"]){
                    object["jsonStatus"] = {}
                }
                if(! object["loaded"]){
                    object["loaded"] = {}
                }
                if(! object["_key"]){
                    return;
                }
                intro_elements[object["_key"]] = object;
                for(let stage in intro_steps){
                    // console.log("Considering a load of", object["_key"], stage, intro_steps[stage].isRelevant(object["_key"]), ! object["loaded"][stage])
                    if(intro_steps[stage].isRelevant(object["_key"]) && ! object["loaded"][stage]){
                        intro_steps[stage].load(object["_key"]);
                    }
                }
                // console.log("Loading", stage, object["_key"])
                
            }
            window.load = load
            function checkVendor(row){
                // Checks against the regex list to look for whether there's a vendor match or not.
                for(let i = 0; i < global_sourcetype_to_vendor.length; i++){
                    if(global_sourcetype_to_vendor[i]['field_matched'] && global_sourcetype_to_vendor[i]['field_matched']!="" 
                        && global_sourcetype_to_vendor[i]['field_matched'] && global_sourcetype_to_vendor[i]['regex']!="" 
                        && row[global_sourcetype_to_vendor[i]['field_matched']]){
                        let re = new RegExp(global_sourcetype_to_vendor[i]['regex'], "gi");
                        if(re.test(row[global_sourcetype_to_vendor[i]['field_matched']])){  
                            return global_sourcetype_to_vendor[i]
                        }
                    }
                }
                return {
                    "match": false,
                    "productName": "",
                    "vendorName": "",
                    "regex": "",
                    "field_matched": "",
                    "productId": ""
                }
        
            }
            window.global_sourcetype_to_vendor = global_sourcetype_to_vendor
            window.checkVendor = checkVendor
        
        
            function newStatusRow(section, status, searchString, id, name, results) {
                    
                let row = $('<tr class="introspection-' + section + '-search search ' + section + '-row" style=" border-top-width: 0;"><td class="introspection-label" id="' + section + '-' + id + '">' + name + '</td><td class=\"running-status\"></td><td class=\"result\"></td><td class=\"cancelSearch\"></td></tr>').attr("data-stage", section).attr("data-id", id).attr("data-search", searchString).attr("data-status", status).attr("data-results", results ? JSON.stringify(results) : JSON.stringify({})).attr("data-sid", "")
                
                row.find(".cancelSearch").append($('<a href="#" onclick="return false;"><i class="icon-close" /></a>').click(function(evt) {
                    let row = $(evt.target).closest("tr");
                    let stage = row.attr("data-stage");
                    let id = row.attr("data-id");
                    intro_steps[stage].cancel(id)
                    row.attr("data-status", "failure");
                    row.find(".running-status").html( _("Cancelled by User").t() )
                }))
                if(section == "step-review"){
                    row.find(".introspection-label").append( $(' <a href="#" class=""> ' + _("(Review)").t() + '</a>').click(function(evt){
                        let obj = $(evt.target);
                        let row = obj.closest("tr");
                        let productId = row.attr("data-id");
                        let object = intro_elements[productId];
                        let eventtypeId = object["eventtypeId"]
                        window.original_product_id = ""
                        $("#introspectionStatus").css("display", "hide");
                        $("#introspectionStatusBackdrop").css("display", "hide");
                        addOrEditModal(object);
                        // $("div#" + eventtypeId).closest(".datasource_main").first().click();
                        // setTimeout(function(){
                        //     $("div#" + eventtypeId).first().click();
                        // },200)
                        // setTimeout(function(){
                        //     $("tr.data-inventory-product[data-productid=" + productId.replace(/([^a-zA-Z0-9\-_=\.\]\[])/g, "\\$1") + "]").find("div.action_edit").first().click();
                        // }, 300)
                        setTimeout(function(){
        
                            window.handleUpdatedEvent = $.Deferred();
                            $.when(window.handleUpdatedEvent).then(function(){
                                $("#introspectionStatus").css("display", "block");
                                $("#introspectionStatusBackdrop").css("display", "block");
                                if(window.original_product_id != "" && ! window.data_inventory_products[window.original_product_id]){
                                    // console.log("You clearly reviewed and removed this item, so let's get rid of it from the status", window.original_product_id)
                                    intro_elements[window.original_product_id].status = "reviewed"
                                    intro_steps['step-review'].updateDisplay(window.original_product_id);
                                    
                                    
                                    setTimeout(function(){
                                        // background proessing
                                        delete intro_elements[window.original_product_id];
                                        //removeProductFromKVStore(window.original_product_id); // this gets done by the actual draw (why we have original.product_id in the first place.)
                                    },1000)
                                }
                                
                            })
                            $("#addProduct").on("hide", function(){
                                window.handleUpdatedEvent.resolve()
                            })
                            $("#addProduct").on("hide.bs.modal", function(){
                                window.handleUpdatedEvent.resolve()
                            })
                            $("#addProduct").modal().on("hide", function(){
                                window.handleUpdatedEvent.resolve()
                            })
                            $("#addProduct").modal().on("hide.bs.modal", function(){
                                window.handleUpdatedEvent.resolve()
                            })
            
            
                        },650)
                        return false;
                    }))
                }
                return row
            }
        
            function generateSearchManager(query, dsc, parameters, successCallback, failureCallback, startCallback) {
                // if (typeof splunkjs.mvc.Components.getInstance(dsc) == "object") {
                //     splunkjs.mvc.Components.revokeInstance(dsc)
                // }
                let myParams = {
                    "id": dsc,
                    "cancelOnUnload": true,
                    "latest_time": "",
                    "status_buckets": 0,
                    "earliest_time": "0",
                    "search": query,
                    "app": splunkjs.mvc.Components.getInstance("env").toJSON()['app'],
                    "auto_cancel": parameters.override_auto_finalize || 40,
                    //"auto_finalize_ec": 2000,
                    "max_time": parameters.override_auto_finalize || 40,
                    "preview": true,
                    "runWhenTimeIsUndefined": false,
                    "autostart": false
                }
                for(let obj in parameters){
                    myParams[obj] = parameters[obj];
                }
        
                var sm = new SearchManager(myParams, { tokens: true, tokenNamespace: "submitted" });
                sm.on('search:start', function(properties) {
                    var uniqueId = properties.content.request.label
                    if (startCallback) {
                        startCallback(uniqueId, arguments)
                    }
                });
                sm.on('search:error', function(properties) {
                    var uniqueId = dsc
                    if (typeof properties.content != "undefined") {
                        uniqueId = properties.content.request.label
                    }
                    if (failureCallback) {
                        failureCallback(uniqueId, arguments)
                    }
                });
                sm.on('search:failed', function(properties) {
                    var uniqueId = dsc
                    if (typeof properties.content != "undefined") {
                        uniqueId = properties.content.request.label
                    }
                    if (failureCallback) {
                        failureCallback(uniqueId, arguments)
                    }
                });
                sm.on('search:cancelled', function(properties) {
                    try{ /* Haven't tested -- so going try / catch */
                        var uniqueId = properties.content.request.label
                        if (failureCallback) {
                            failureCallback(uniqueId, arguments)
                        }
                    }catch(error){
                        failureCallback(dsc, arguments)
                    }
                });
                sm.on('search:done', function(properties) {
                    var uniqueId = properties.content.request.label
                    if (properties.content.resultCount == 0) {
                        if (failureCallback) {
                            failureCallback(uniqueId, properties, arguments)
                        }
                    } else {
                        var results = splunkjs.mvc.Components.getInstance(dsc).data('results', { output_mode: 'json', count: 0 });
                        results.on("data", function(properties) {
                            var uniqueId = properties.attributes.manager.id
                            var data = properties.data().results
                            if (data && data.length && data.length >= 1) {
                                if (successCallback) {
                                    // console.log("Got results", data)
                                    successCallback(uniqueId, data)
                                }
                            } else {
                                if (failureCallback) {
                                    failureCallback(uniqueId, properties, arguments)
                                }
                            }
                        })
                    }
                });
            }
        
            function generatePostProcessSearchManager(query, dsc, parameters, successCallback, failureCallback, startCallback) {
                // if (typeof splunkjs.mvc.Components.getInstance(dsc) == "object") {
                //     splunkjs.mvc.Components.revokeInstance(dsc)
                // }
                let myParams = {
                    "id": dsc,
                    "search": query,
                    "autostart": true
                }
                for(let obj in parameters){
                    myParams[obj] = parameters[obj];
                }
        
                var sm = new PostProcessManager(myParams, { tokens: true, tokenNamespace: "submitted" });
                sm.on('search:start', function(properties) {
                    var uniqueId = properties.content.request.label
                    if (startCallback) {
                        startCallback(uniqueId, arguments)
                    }
                });
                sm.on('search:error', function(properties) {
                    var uniqueId = dsc
                    if (typeof properties.content != "undefined") {
                        uniqueId = properties.content.request.label
                    }
                    if (failureCallback) {
                        failureCallback(uniqueId, arguments)
                    }
                });
                sm.on('search:fail', function(properties) {
                    var uniqueId = dsc
                    if (typeof properties.content != "undefined") {
                        uniqueId = properties.content.request.label
                    }
                    if (failureCallback) {
                        failureCallback(uniqueId, arguments)
                    }
                });
                sm.on('search:done', function(properties) {
                    var uniqueId = properties.content.request.label
                    if (properties.content.resultCount == 0) {
                        if (failureCallback) {
                            failureCallback(uniqueId, properties, arguments)
                        }
                    } else {
                        var results = splunkjs.mvc.Components.getInstance(dsc).data('results', { output_mode: 'json', count: 0 });
                        results.on("data", function(properties) {
                            var uniqueId = properties.attributes.manager.id
                            var data = properties.data().results
                            if (data && data.length && data.length >= 1) {
                                if (successCallback) {
                                    // console.log("Got results", data)
                                    successCallback(uniqueId, data)
                                }
                            } else {
                                if (failureCallback) {
                                    failureCallback(uniqueId, properties, arguments)
                                }
                            }
                        })
                    }
                });
            }
        
        
            ///////////////////////////////
            ///////// Main() Code /////////
            ///////////////////////////////
            let unfulfillable = $.Deferred()
            for( let i = 0; i < data_inventory_eventtypes.length; i++){
                data_inventory_eventtypes_hash_not_updated[ data_inventory_eventtypes[i]['eventtypeId'] ] = data_inventory_eventtypes[i]
            }
            

            // The downside of multiple files.. I have to deal with this kind of ugliness. I know.
            let drawingLoaded = $.Deferred()
            let number_of_checks_for_drawing_loaded = 0;
            let drawing_loaded_products_timer = setInterval(function(){
                number_of_checks_for_drawing_loaded++;
                if(window.isThisProductUsed){
                    // console.log("Got the drawing loaded!")
                    clearInterval(drawing_loaded_products_timer);
                    drawingLoaded.resolve();
                }else if(number_of_checks_for_drawing_loaded == 8){
                    // console.log         console.log("Timed out on looking for the drawing loaded...")
                    clearInterval(drawing_loaded_products_timer);
                    drawingLoaded.resolve();
                }
            },100)


            // The downside of multiple files.. I have to deal with this kind of ugliness. I know.
            let window_data_inventory_products_established = $.Deferred();
            let number_of_checks_for_window_data_inventory_products = 0;
            let data_inventory_products_timer = setInterval(function(){
                number_of_checks_for_window_data_inventory_products++;
                if(window.data_inventory_eventtypes){
                    // console.log("Got the window.data_inventory_products!", window.data_inventory_products)
                    clearInterval(data_inventory_products_timer);
                    window_data_inventory_products_established.resolve();
                }else if(number_of_checks_for_window_data_inventory_products == 8){
                    // console.log("Timed out on looking for the window.data_inventory_products...")
                    clearInterval(data_inventory_products_timer);
                    window_data_inventory_products_established.resolve();
                }
            },100)
            let initComplete = $.Deferred();
            let allInitComplete = $.Deferred();
            $.when(allInitComplete).then(function(){
                // console.log("Here's my data inventory", window.data_inventory_eventtypes, window.data_inventory_products)
                let numDataInventoryConfigured = 0;
                for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                    if(window.data_inventory_eventtypes[i]['status'] != "new" && window.data_inventory_eventtypes[i]['status'] != ""){
                        numDataInventoryConfigured++;
                    }
                }
                if(window.data_inventory_products){
                    for(let i = 0; i < window.data_inventory_products.length; i++){
                        if(window.data_inventory_products[i]['status'] != "pending" && window.data_inventory_products[i]['status'] != "blocked"){
                            numDataInventoryConfigured++;
                        }
                    }

                }

                if (numDataInventoryConfigured == 0) {
                    window.ModalSuggestingDataSourceCheck();
                }

            })
            init(initComplete)
        
            let data_inventory_product_hash_complete = $.Deferred()
            $.when(initComplete, window_data_inventory_products_established).then(function(){
                setTimeout(function(){
                    window.fullyLoadedAndReadyForNewEvents = "Now we can update eventtypes"
                }, 1000)
                            
                for( let i = 0; i < data_inventory_products.length; i++){
                    
                    if(data_inventory_products[i]['jsonStatus'] && data_inventory_products[i]['jsonStatus'] != ""){
                        //data_inventory_products[i]['jsonStatus'] = JSON.parse(data_inventory_products[i]['jsonStatus'])
                        try {
                            data_inventory_products[i]['jsonStatus'] = JSON.parse(data_inventory_products[i]['jsonStatus'])
                        } catch (e) {
                            //Do nothing
                        }
                    }
                    data_inventory_products_hash_not_updated[ data_inventory_products[i]['productId'] ] = data_inventory_products[i]
                    if(data_inventory_products[i]['termsearch'] && data_inventory_products[i]['termsearch'] != "" && data_inventory_products[i]['termsearch'].indexOf("sourcetype=") >= 0){
                        let matches = Array.from( findAll(/sourcetype="*([^\s"\)]+)/g,data_inventory_products[i]['termsearch']) );
                        for(let g = 0; g < matches.length; g++){
                            global_sourcetype_to_vendor.push({
                                "match": true,
                                "productName": data_inventory_products[i]['productName'],
                                "vendorName": data_inventory_products[i]['vendorName'],
                                "regex": matches[g][1],
                                "field_matched": "sourcetype",
                                "productId": data_inventory_products[i]['productId']
                            })
                        }
                    }else if(data_inventory_products[i]['termsearch'] && data_inventory_products[i]['termsearch'] != "" && data_inventory_products[i]['termsearch'].indexOf("source=") >= 0){
                        let matches = Array.from( findAll(/source="*([^\s"\)]+)/g,data_inventory_products[i]['termsearch']) );
                        for(let g = 0; g < matches.length; g++){
                            global_sourcetype_to_vendor.push({
                                "match": true,
                                "productName": data_inventory_products[i]['productName'],
                                "vendorName": data_inventory_products[i]['vendorName'],
                                "regex": matches[g][1],
                                "field_matched": "source",
                                "productId": data_inventory_products[i]['productId']
                            })
                        }
                    }
                }
                data_inventory_product_hash_complete.resolve()
        
                $(".dashboard-view-controls").prepend(
                    $('<button class="button btn drilldown external-link" style="margin-right: 3px;">').text("View Products").click(function(){
                        window.open(Splunk.util.make_full_url("/app/Splunk_Security_Essentials/report?s=%2FservicesNS%2Fnobody%2FSplunk_Security_Essentials%2Fsaved%2Fsearches%2FProducts%2520and%2520the%2520Content%2520Mapped%2520to%2520Them"), "_blank")
                    }),
                    $('<div style="display: inline-block; border: 1px solid gray; border-radius: 3px; line-height: 24px; padding: 3px; margin-right: 3px;">' + _("Automated Introspection").t() + "</div>").append(
                        $('<button id="data-inventory-show-button" class="button btn btn-primary" style="height: 24px; line-height: 20px; padding-top: 2px; padding-bottom: 2px; margin-left: 5px; margin-right: 3px;" href="#">Show</button>').click(function(){
        
                            $("#introspectionStatus").css("display", "block");
                            $("#introspectionStatusBackdrop").css("display", "block");
        
                            setTimeout(function(){
                                
                                $("#introspectionStatus").find(".close").click(function(){
                                    $("#introspectionStatus").hide();
                                    $(".modal-backdrop").hide();
                                })
                            }, 200)
                            if ($(".introspection-step-cimsearches-search[data-status=new]").length > 0) {
        
                                let myModal = new Modal('welcomeToIntrospection', {
                                    title: _('Automated Introspection').t(),
                                    destroyOnHide: true
                                }, $);
                                $(myModal.$el).on("hide", function() {
                                    // Not taking any action on hide, but you can if you want to!
                                })
                                $(myModal.$el).on("shown.bs.modal", function() {
                                    setTimeout(function(){
                                    
                                        $(".modal").find(".close").click(function(){
                                            $("#introspectionStatus").hide();
                                            $(".modal-backdrop").hide();
                                            // console.log("Got a close click");
                                        })
                                    }, 200)
                                })
        
                                let body = $("<div>")
                                body.append("<p>" + _("To ease the process of determining what content you can run, we have a series of automated checks. There are five steps to these checks:<ol><li>Check for the base data with pre-configured searches. You will generally want to review these results (you will see status Pending Review) though if you use common sourcetypes we will automatically process them. You can also add additional products or sourcetypes at any time.</li><li>We will validate CIM Compliance for these data sources and estimate average event size.</li></ol>You can leave this page at any point in time, and come back later to resume where you left off.</p>").t() + "</p>")
        
                                myModal.body.html(body)
        
        
        
                                myModal.footer.append($('<button>').attr({
                                    type: 'button',
                                    'data-dismiss': 'modal',
                                    'data-bs-dismiss': 'modal'
                                }).addClass('btn ').text('Search Later').on('click', function() {
        
                                }), $('<button>').attr({
                                    type: 'button',
                                }).addClass('btn btn-primary').text('Start').on('click', function() {
                                    startSearches();
                                    $("#introspectionStatus").css("display", "block");
                                    $("#introspectionStatusBackdrop").css("display", "block");
                                    $('[data-bs-dismiss=modal').click()
                                }))
                                myModal.show()
                                
                            }
                        }),
                        $('<button title="' + _("Re-run Introspection").t() + '" class="data-inventory-play-stop-button button btn btn-primary" style="height: 24px; line-height: 20px; padding-top: 2px; padding-bottom: 2px; margin-right: 3px;" href="#"><i class="dataInventoryStartOrStopIcon icon-play"></i></button>')
                    )
                )
        
                $(".data-inventory-play-stop-button").attr("data-status", "play").click(function(){
                    startSearches()
                        
                    $(".data-inventory-play-stop-button[data-status=play]").attr("data-status", "pause").unbind("click").click(function(){
                        pauseSearches()
                    }).find("i").removeClass("icon-play").addClass("icon-pause")
        
                }) 

                
                $(".ds_main_panel").append($('<button>').attr({
                    type: 'button',
                }).addClass('btn ').css("bottom", "8px").css("right", "8px").css("position", "absolute").text('Reset All Configurations').on('click', function() {
                    
                        resetEverything();
                        $('[data-bs-dismiss=modal').click()
                    
                }))
        
         
                
            })
            // Initializing Data Eventtypes!
            $.when(initComplete).then(function(){
                intro_steps['step-init'].load()
                let allDSes = Object.keys(data_inventory).sort()
                for (let i = 0; i < allDSes.length; i++) {
                    let ds = allDSes[i];
                    let allDSCes = Object.keys(data_inventory[ds]['eventtypes']).sort()
                    for (let g = 0; g < allDSCes.length; g++) {
                        let dsc = allDSCes[g];
                        allDSCNames[dsc] = data_inventory[ds]['name'] + " > " + data_inventory[ds]['eventtypes'][dsc]['name'];
        
                        let object = data_inventory[ds]['eventtypes'][dsc];
                        object["stage"] = "step-cim";
                        object["_key"] = dsc;
                        if(data_inventory_eventtypes_hash_not_updated[dsc]){
                            for(let key in data_inventory_eventtypes_hash_not_updated[dsc]){
                                if(data_inventory_eventtypes_hash_not_updated[dsc][key]){
                                    object[key] = data_inventory_eventtypes_hash_not_updated[dsc][key];
                                }
                            }
                            if(data_inventory_eventtypes_hash_not_updated[dsc].status == "searching"){
                                data_inventory_eventtypes_hash_not_updated[dsc].status = "pending"
                            }
                            //console.log("got an existing DSC", dsc, data_inventory_eventtypes_hash_not_updated[dsc].status, data_inventory_eventtypes_hash_not_updated[dsc])
                        }else{
                            object["created_time"] = Math.round(Date.now()/1000);
                            object["updated_time"] = Math.round(Date.now()/1000);
                            object["eventtypeId"] = dsc;
                            object["status"] = "new";
                            object["name"] = object["name"];
                            object["basesearch"] = object["baseSearch"];
                            object["search_result"] = "";
                            object["jsonStatus"] = {"step-cim": {"status": "new"}}
                            object["_key"] = dsc;


                            //If VendorSpecific data source category we use the vendor name as the datasource. This can be found in data_inventory.json legacy_name
                            // Filter out the entry Audit Trail as too generic for this purpose
                            if (/^VendorSpecific/.test(dsc)) {
                                if (typeof object["legacy_name"] !='undefined') {
                                    object["datasource"] = object["legacy_name"].split("|").filter(a => a !== 'Audit Trail')[0]      
                                }                   
                            } else {
                                if (typeof window.data_inventory[dsc.split("-")[0]] != 'undefined' && typeof window.data_inventory[dsc.split("-")[0]]["name"] != 'undefined') {
                                    object["datasource"] = window.data_inventory[dsc.split("-")[0]]["name"]
                                }
                            }

                            

                           	if(window.data_inventory_eventtypes && window.data_inventory_eventtypes.length && window.data_inventory_eventtypes.length > 0){
                               	let pushToDataInventoryEventtypes = true;
                              	for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                                   	if(dsc == window.data_inventory_eventtypes[i].eventtypeId){
                                       	pushToDataInventoryEventtypes = false;
                                   }
                            }
                                if(pushToDataInventoryEventtypes){
                                    window.data_inventory_eventtypes.push(object)
    
                                }
                            }

                            //object["search_status"] = "new";
                        }
                        if(object['basesearch'] && object['basesearch'] != "" && object['basesearch'] != null){
                            load(object)
                        }
                    }
                }
                overallStatus()
            })
        
        

            // Initializing Data Products (and everything else)!
            let defaultProductsAcquired = $.Deferred()
            window.valid_ootb_products = {"vendorName": [], "productName": []}
            generateSearchManager(" | inputlookup SSE-default-data-inventory-products.csv", "pullSourcetypebasedSearches", {"autostart": true}, function(sid, data) {
                for(let i = 0; i < data.length; i++){
                    if(data[i]['vendorName'] && data[i]['vendorName'] != "" && window.valid_ootb_products.vendorName.indexOf(data[i]['vendorName']) == -1){
                        window.valid_ootb_products.vendorName.push(data[i]['vendorName'])
                    }
                    if(data[i]['productName'] && data[i]['productName'] != "" && window.valid_ootb_products.productName.indexOf(data[i]['productName']) == -1){
                        window.valid_ootb_products.productName.push(data[i]['productName'])
                    }
                    if(data[i]['default_sourcetype_search'] && data[i]['vendorName'] && data[i]['productName'] && data[i]['productId']){
                        global_sourcetype_to_vendor.push({
                            "match": true,
                            "vendorName": data[i]['vendorName'],
                            "productName": data[i]['productName'],
                            "regex": data[i]['regex_pattern'],
                            "field_matched": data[i]['regex_field'],
                            "productId": data[i]['productId']
                        })
                        if(data[i]['vendorName'] == "Microsoft" && data[i]['regex_field'] == "source"){
                            // Let's also add a sourcetype one so that we have coverage for both WinTA 5 and WinTA 4... sigh.
                        global_sourcetype_to_vendor.push({
                            "match": true,
                            "vendorName": data[i]['vendorName'],
                            "productName": data[i]['productName'],
                            "regex": data[i]['regex_pattern'],
                            "field_matched": "sourcetype",
                            "productId": data[i]['productId']
                        })
                        }
                    }
                }
                defaultProductsAcquired.resolve(data)
            }, function() {
                // console.log("failed sourcetype search", arguments)
                // failure
            }, function(dsc) {
                // console.log("started sourcetype search", dsc)
                // started
            })
        
            $.when(defaultProductsAcquired, initComplete, drawingLoaded, data_inventory_product_hash_complete).then(function(data){
                // console.log("HEY, my product deferral worked!", data)
                let productIdsAdded = []
                for(let i = 0; i < data.length; i++){
                    if(data[i]['default_sourcetype_search'] && data[i]['vendorName'] && data[i]['productName'] && data[i]['productId']){
                        // console.log("Considering how to add this..", data[i]['productId'], data_inventory_products_hash_not_updated[data[i]['productId']])
                        let productId = data[i]['productId']
                        productIdsAdded.push(productId)
                        data[i]['stage'] = "step-sourcetype"
                        data[i]['jsonStatus'] = {'step-sourcetype': {"status": "blocked"}}
                        data[i]['_key'] = productId
                        
                        if(data_inventory_products_hash_not_updated[productId]){//} && window.isThisProductUsed(data_inventory_products_hash_not_updated[productId]) || ){ // } && data_inventory_products_hash_not_updated[productId]['basesearch'] && data_inventory_products_hash_not_updated[productId]['basesearch']!=""){
                            // console.log("Hey, trying to load", productId, data_inventory_products_hash_not_updated[productId]['stage'], data_inventory_products_hash_not_updated[productId])
                            if(data_inventory_products_hash_not_updated[productId]['stage'] == "step-sourcetype"){
                                if(data_inventory_products_hash_not_updated[productId].status == "searching"){//} || data_inventory_products_hash_not_updated[productId].status == "pending"){
                                    data_inventory_products_hash_not_updated[productId].status = "pending"
                                }else if(data_inventory_products_hash_not_updated[productId].status == "blocked"){
                                    data_inventory_products_hash_not_updated[productId]['blocked-by'] = data_inventory_products_hash_not_updated[productId]['eventtypeId'].split("|")
                                    data_inventory_products_hash_not_updated[productId]['can-cancel'] = "unknown"
                            
                                }
                                // console.log("Adding a new one", data_inventory_products_hash_not_updated[productId], data_inventory_products_hash_not_updated[productId].status)
                                
                            
                            }
                            load(data_inventory_products_hash_not_updated[productId])

                            // for(let key in data_inventory_products_hash_not_updated[productId]){
                            //     data[i][key] = data_inventory_products_hash_not_updated[productId][key]
                            // }
                            // data[i]['default_sourcetype_search'] = data_inventory_products_hash_not_updated[productId]['basesearch']  
                            // data[i]['basesearch'] = data[i]['default_sourcetype_search']
                            // if(data_inventory_products_hash_not_updated[productId]['stage'] != "step-sourcetype"){
                            //     let record = JSON.parse(JSON.stringify(data_inventory_products_hash_not_updated[productId]))
                            //     record.last_kvstore = JSON.parse(JSON.stringify(data_inventory_products_hash_not_updated[productId]))
                            //     record.status = "completed"
                            //     load("step-sourcetype", record)
                            //     load(data_inventory_products_hash_not_updated[productId]['stage'], data_inventory_products_hash_not_updated[productId]) 
                            // }else{
                            //     load("step-sourcetype", data[i])
                            // }
                        }else if(data[i]['default_sourcetype_search'] && data[i]['default_sourcetype_search']!="" && data[i]['eventtypeId'] && data[i]['eventtypeId']!=""){
                            data[i]['default_sourcetype_search'] = "index=* " + data[i]['default_sourcetype_search']
                            data[i]['status'] = "blocked"
                            let emptyInit = ["metadata_json", "cim_detail", "termsearch"]
                            for(let i = 0; i < emptyInit.length; i++){
                                if(! data[i][emptyInit[i]]){
                                    data[i][emptyInit[i]] = ""
                                }
                            }
                            data[i]['created_time'] = Math.round(Date.now() / 1000)

                            if(data[i]['extended_fields'] && data[i]['extended_fields'] != ""){
                                //console.log("Base search before")
                                //console.log(data[i]['basesearch'])
                                data[i]['basesearch'] = data[i]['default_sourcetype_search'] + " (" + data[i]['extended_fields'] + ")"
                                //console.log("Base search after")
                                //console.log(data[i]['basesearch'])
                            } else {
                                data[i]['basesearch'] = data[i]['default_sourcetype_search']
                            }
                            
                            load(data[i])
                        }
                    }
                }
                for(let productId in data_inventory_products_hash_not_updated){
                    if(productIdsAdded.indexOf(productId) == -1){
                        // console.log("Looks like we haven't added this productId", productId);
                        load(data_inventory_products_hash_not_updated[productId]) 
                    }
                }
                allInitComplete.resolve();
            })
        })
        
        })
    })
    