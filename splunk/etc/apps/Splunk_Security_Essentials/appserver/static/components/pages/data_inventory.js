'use strict';

window.appName = "Splunk_Security_Essentials"
require(['jquery',
    "underscore",
    "splunk.util",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "splunkjs/mvc/simpleform/formutils",
    'splunkjs/mvc/simplexml/controller',
    'splunkjs/mvc/dropdownview',
    "splunkjs/mvc/simpleform/input/dropdown",
    'splunk.util',
    'components/data/parameters/RoleStorage',
    'Options',
    'app/Splunk_Security_Essentials/components/controls/Modal',
    "splunkjs/mvc/searchmanager",
    'json!' + $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString,
    'json!' + $C['SPLUNKD_PATH'] + '/services/pullJSON?config=data_inventory&locale=' + window.localeString,
    'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
    'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
    'components/controls/DrawDataInventoryProducts',
    'components/controls/data_inventory_introspection'

], function($,
    _,
    splunkUtil,
    utils,
    tokenutils,
    FormUtils,
    DashboardController,
    DropdownView,
    DropdownInput,
    SplunkUtil,
    RoleStorage,
    Options,
    Modal,
    SearchManager,
    ShowcaseInfo,
    data_inventory,
    data_inventory_products,
    data_inventory_eventtypes) {
    eventtype_to_label = {};
    window.eventtype_to_label = eventtype_to_label
    // console.log("Here's our data inventory eventtypes", data_inventory_eventtypes)
    let historicalDataInventory = false
    // let numDataInventoryConfigured = 0;
    for(let i = 0; i < data_inventory_eventtypes.length; i++){
        if(data_inventory_eventtypes[i]['status'] == "unknown" || (! isNaN(data_inventory_eventtypes[i]['status']) && data_inventory_eventtypes[i]['status'] >= 0)){
            historicalDataInventory = true
        }
    }

    if(historicalDataInventory){
        let historicalDataInventory = JSON.parse(JSON.stringify(data_inventory_eventtypes));
        window.tossingUpMigrationPrompt = true
        data_inventory_eventtypes = []
        
        // Now we initialize the Modal itself
        var myModal = new Modal("migrateOldDataInventory", {
            title: _("Migrating Legacy Data Inventory").t(),
            backdrop: 'static',
            keyboard: false,
            destroyOnHide: true,
            type: 'normal'
        }, $);
        $(myModal.$el).on("hide.bs.modal", function(){
            location.reload()
        })

        $(myModal.$el).on("show", function() {
            let newDI = []
            let newDP = []
            let eventtype_to_label = {}
            for (var datasourceId in data_inventory) {
                for (var eventtypeId in data_inventory[datasourceId].eventtypes) {
                    eventtype_to_label[eventtypeId] = data_inventory[datasourceId].eventtypes[eventtypeId]['name']
                }
            }
            for(let i = 0; i < historicalDataInventory.length; i++){
                let old = historicalDataInventory[i]
                let di = {
                    "_key": old.eventtypeId,
                    "eventtypeId": old.eventtypeId,
                    "basesearch": "",
                    "created_time": old['_time'],
                    "search_result": "[{\"status\": \"migrated\"}]",
                    "updated_time": Math.round(Date.now() / 1000)
                }
                let productStatus = old.status
                let createProduct = false;
                if(old.status == "unknown"){
                    di.status = "new"
                }else if(old.status > 20){
                    di.status = "complete"
                    createProduct = true;
                }else if(old.status > 1){
                    createProduct = true;
                    di.status = "failure"
                }else{
                    di.status = "failure"
                }

                newDI.push(di)
                if(createProduct){

                    let dp = {
                        "_key": "MIGRATED_" + old.eventtypeId,
                        "productId": "MIGRATED_" + old.eventtypeId,
                        "eventtypeId": old.eventtypeId,
                        "vendorName": "Migrated",
                        "updated_time": Math.round(Date.now() / 1000),
                        "termsearch": "",
                        "basesearch": "",
                        "status": "manual",
                        "stage": "needsConfirmation",
                        "metadata_json": JSON.stringify({"description": "* Migrated from SSE 2.4 format *"})
                    }
                    if(! isNaN(productStatus)){
                        dp["coverage_level"] = productStatus
                    }
                    if(! isNaN(old['_time']) ){
                        dp["created_time"] = old['_time']
                    }else{
                        dp["created_time"] = Math.round(Date.now() / 1000)
                    }
                    if( eventtype_to_label[old.eventtypeId] ){
                        dp["productName"] = eventtype_to_label[old.eventtypeId]
                    }else{
                        dp["productName"] = " "
                    }
    
                    newDP.push(dp)
                }
            }

            let dpDelete = $.Deferred()
            let dpCreate = $.Deferred()
            let diDelete = $.Deferred()
            let diCreate = $.Deferred()
            if(newDP.length > 0){

                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/',
                    type: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    async: true,
                    success: function(returneddata) {
                        dpDelete.resolve()
                    },
                    error: function(xhr, textStatus, error) {
                        triggerError($("<div>").append($("<p>Could not delete the existing data inventory products kvstore.</p>"), $("<pre>").text(error)))
                    }
                })
            

            }else{
                dpCreate.resolve()
            }


            $.when(dpDelete).then(function(){
                    
                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/batch_save',
                    type: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    contentType: "application/json",
                    async: false,
                    data: JSON.stringify(newDP),
                    success: function(returneddata) {
                        dpCreate.resolve()
                    },
                    error: function(xhr, textStatus, error) {
                        triggerError($("<div>").append($("<p>Could not batch_save the data inventory products kvstore.</p>"), $("<pre>").text(error)))
                    }   
                })
            
            })

            $.when(dpCreate).then(function(){
                if(newDI.length > 0){
                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/',
                        type: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-Splunk-Form-Key': window.getFormKey(),
                        },
                        async: true,
                        success: function(returneddata) {
                            diDelete.resolve()
                        },
                        error: function(xhr, textStatus, error) {
                            triggerError($("<div>").append($("<p>Could not delete the existing data inventory data source category kvstore.</p>"), $("<pre>").text(error)))
                        }
                    })
                }else{
                    diCreate.resolve()
                }
            })
            $.when(diDelete).then(function(){
                $.ajax({
                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/batch_save',
                    type: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Splunk-Form-Key': window.getFormKey(),
                    },
                    contentType: "application/json",
                    async: false,
                    data: JSON.stringify(newDI),
                    success: function(returneddata) {
                        diCreate.resolve()
                    },
                    error: function(xhr, textStatus, error) {
                        triggerError($("<div>").append($("<p>Could not batch_save the data inventory data source category kvstore.</p>"), $("<pre>").text(error)))
                    }
                })
            })

            $.when(diCreate).then(function(){
                $("#migrationStatus").html($("<p>" + _("Update Complete! As you close this dialog, the page will refresh.").t() + "</p>"),
                $("<p>" + _("In SSE 2.5 and beyond, we provide visibility down to the source / sourcetype / index level, allowing this app to build data inventory dashboards, and provide you detail on data volumes. To make the move from the older data inventory format as easy as possible, we have automatically created a product for every data source category where you had data before, and set them as \"Needs Review\" so that you can update the details at your leisure. You can also opt to utilize the new and improved Data Introspection after refreshing this page.").t()))
                $("#closebutton").show()
            })


        })
        myModal.body
            .append( 
                $("<p>").text(_("Welcome to the Data Inventory dashboard! We've detected a legacy data configuration, and will now be migrating this config to the format used in Splunk Security Essentials 2.5+.").t()),
                $('<div id="migrationStatus">').text("Processing... (this should usually complete faster than you can read this sentence.)")
                );

        myModal.footer.append($('<button>').attr({
            type: 'button',
            'data-dismiss': 'modal',
            'data-bs-dismiss': 'modal'
        }).css("display", "none").attr("id", "closebutton").addClass('btn btn-primary').text(_('Refresh Page').t()).on('click', function() {
            
        }))
        myModal.show(); // Launch it!
        return;
    }
    checkForErrors(ShowcaseInfo)
    

    window.data_inventory = data_inventory
    window.data_inventory_eventtypes = data_inventory_eventtypes
    window.data_inventory_products = data_inventory_products

    var counterForRecalculatingTimer = 0;
    var output = $("<div class=\"main_output\"></div>")
    var datasource_left = $('<div class="ds_datasource_panel"></div>')
    var count = 0;
    let eventTypeCount = 0;


    let showcasesPerEventtype = {}

    for (let ShowcaseName in ShowcaseInfo['summaries']) {
        // console.log("Got a showcase", ShowcaseName, ShowcaseInfo['summaries'][ShowcaseName]['data_source_categories'])
        if (typeof ShowcaseInfo['summaries'][ShowcaseName]['data_source_categories'] != "undefined") {
            let eventtypes = ShowcaseInfo['summaries'][ShowcaseName]['data_source_categories'].split("|")
            for (let i = 0; i < eventtypes.length; i++) {
                let eventtype = eventtypes[i];
                if (typeof showcasesPerEventtype[eventtype] == "undefined") {
                    showcasesPerEventtype[eventtype] = 1;
                } else {
                    showcasesPerEventtype[eventtype]++;
                }

            }
        }
    }
    // console.log("Got my showcases per eventtype", showcasesPerEventtype)
    for (var datasourceId in data_inventory) {
        let isDataSourceInScope = false;
        for (var eventtypeId in data_inventory[datasourceId].eventtypes) {
            eventtype_to_label[eventtypeId] = data_inventory[datasourceId].eventtypes[eventtypeId]['name']
            if (typeof showcasesPerEventtype[eventtypeId] != "undefined") {
                eventTypeCount++
                isDataSourceInScope = true;
            }


            for (let i = 0; i < data_inventory_eventtypes.length; i++) {
                if (data_inventory_eventtypes[i].eventtypeId == eventtypeId) {
                    //console.log("Chjecking Out eventtype Status", eventtypeId, data_inventory_eventtypes[i].status, data_inventory[datasourceId].eventtypes[eventtypeId].status)
                    data_inventory[datasourceId].eventtypes[eventtypeId].status = data_inventory_eventtypes[i].status
                        // console.log("Just set", data_inventory_eventtypes[i].status, eventtypeId, data_inventory[datasourceId].eventtypes[eventtypeId])
                }
            }
        }
        if (isDataSourceInScope) {
            eventTypeCount += 1.5;
        }
    }

    // console.log("Eventtype Count", eventTypeCount)
    // console.log("Data Foundation", data_inventory)
    let keys = Object.keys(data_inventory).sort();
    for (let i = 0; i < keys.length; i++) {
        let datasourceId = keys[i];
        let datasource = data_inventory[datasourceId]
        let datasourceDiv = $("<div class=\"datasource_main\">").attr("id", datasourceId).click(function(evt) {
            let target = $(evt.target);

            let container = target.closest(".datasource_main");
            if (container.find(".ds_datasource_active").length == 0) {
                $(".ds_datasource").hide()
                $(".ds_datasource_active").removeClass("ds_datasource_active")
                container.find(".ds_datasource").show()
                container.find(".ds_datasource").first().addClass("ds_datasource_active")
                switchMain(container.find(".ds_datasource").attr("id"))

            }

        })
        count += 1.5;
        datasourceDiv.append($("<h2></h2>").text(datasource.name))
        let someEventtypeInScope = false;

        let localKeys = Object.keys(datasource.eventtypes).sort();
        for (let i = 0; i < localKeys.length; i++) {
            let eventtypeId = localKeys[i];
            if (typeof showcasesPerEventtype[eventtypeId] == "undefined") {
                continue;
            }
            someEventtypeInScope = true;
            count += 1;
            let eventtype = datasource.eventtypes[eventtypeId]


            // console.log("Analyzing Eventtype " + eventtypeId, eventtype, Object.keys(datasource.eventtypes[eventtypeId]).join(", "), buildStatusIcon(eventtype.status))


            //let datasource = data_inventory[datasourceId]
            let ds_output = $('<div id="' + eventtypeId + '" class="ds_datasource" status="' + (eventtype.status || "unknown") + '">')
            let statusText = $('<div style="position: relative;">')// .html(buildStatusIcon(eventtype.status))

            ds_output.append($('<div class="ds_status">').append(statusText))
            let ds_mainBlock = $('<div class="ds_main">')
            let ds_header = $('<div class="ds_header">')
            ds_header.append($("<h3>").text(eventtype.name))

            ds_mainBlock.append(ds_header)


            ds_output.append(ds_mainBlock)

            ds_output.click(function(obj) {
                window.dvtest = obj

                $(".ds_datasource").removeClass("ds_datasource_active")

                $(obj.target).closest(".ds_datasource").addClass("ds_datasource_active")
                let id = $(obj.target).closest(".ds_datasource").attr("id")
                    // console.log("Got a click on", id)
                switchMain(id)

            })
            datasourceDiv.append(ds_output)
        }
        //output.append(ds_output)
        if (someEventtypeInScope) {
            datasourceDiv.addClass("ds_datasource_left")
            datasource_left.append(datasourceDiv)
        }
    }
    output.append(datasource_left,  $('<div class="ds_main_panel"><h2>' + _("Data Inventory").t() + '</h2><p>' + _('The goal of this dashboard is to understand what data you have, and feed other dashboards in the app that will guide you to valuable content, allowing us to provide a prescriptive view to what content will add value to your security operations.</p><p>On this page, we will walk you through a variety of data types used by the content in Splunk and ask you to indicate whether you have the data or not. The entire exercise should take 20-30 minutes, and you can always come back to answer questions later. To make this easier (and shorten that time), we have automated as much of this as possible. Access this automation through the Automated Introspection menu at the top of this page.').t() + '</p> <button class="btn btn-primary get-started">' + _("Ready to get started?").t() + '</button></div>'));



    $("#foundation_container").append(output)
    $("button.get-started").click(function() { $(".datasource_main").first().click() })
    // CalculateDependencies()
    updateIconsAndCounts()
    // $("#startSearchesButton").click(function() {
    //     startAllSearches()
    // })
    setTimeout(function() {
        let allDS = $(".datasource_main")
        for (let i = 0; i < allDS.length; i++) {
            updateDatasourceMainLabel($(allDS[i]))
        }
    }, 500)


    // Enable drilldown link to set specific filters
    if (window.location.hash && window.location.hash.substr(1)) {

        // courtesy of https://stackoverflow.com/questions/5646851/split-and-parse-window-location-hash
        var hash = window.location.hash.substring(1);
        var params = {}
        hash.split('&').map(hk => {
            let temp = hk.split('=');
            params[temp[0]] = temp[1]
        });
        for (let key in params) {
            if (key == "id") {
                let target = $("#" + params[key]);
                if (target.length > 0) {
                    let container = target.closest(".datasource_main");
                    container.click();
                    target.click();
                }
            }
        }
        window.location.hash = ""
    }

    function updateDatasourceMainLabel(target) {
        setTimeout(function() {
            let totalDS = target.find(".ds_datasource").length;
            let completeDS = target.find("i[class=icon-check]").length + target.find("i[class=icon-warning]").length + target.find("i[class=icon-error]").length
            if (totalDS == completeDS) {
                target.find("h2").text(target.find("h2").text().replace(/ \(\d.*/, "") + " (" + totalDS + ")")
            } else {
                target.find("h2").text(target.find("h2").text().replace(/ \(\d.*/, "") + " (" + completeDS + "/" + totalDS + ")")
            }
        }, 100)

    }
    window.updateDatasourceMainLabel = updateDatasourceMainLabel

    function switchMain(id) {
        // console.log("Switching", id)
        let translatedLabels = {}
        try{
            if(localStorage['Splunk_Security_Essentials-i18n-labels-' + window.localeString] != undefined){
                translatedLabels = JSON.parse(localStorage['Splunk_Security_Essentials-i18n-labels-' + window.localeString])
            }
        }catch(error){}
        for (let datasourceId in data_inventory) {

            for (let eventtypeId in data_inventory[datasourceId].eventtypes) {
                if (eventtypeId == id) {
                    let eventtype = data_inventory[datasourceId].eventtypes[eventtypeId]

                    $(".ds_main_panel").html("")
                    $(".ds_main_panel").append($("<h2>").text(data_inventory[datasourceId].name), $("<p>").html(data_inventory[datasourceId].description))
                    
                    let redundancyFlag = false;
                    
                    if(data_inventory[datasourceId].description === eventtype.description && data_inventory[datasourceId].name === eventtype.name)
                        redundancyFlag = true;
                    
                    if(!redundancyFlag){
                        $(".ds_main_panel").append(($("<h2>").text(eventtype.name)), $("<p>").html(eventtype.description))
                    }

                    let recommendedSearchNames = []
                    let otherSearchNames = []
                    let nameToID = []
                    let finalSearchNames = []
                    let tactics = []
                    let techniques = []
                    let threatgroups = []
                    let killchainphases = []
                    for (let summaryName in ShowcaseInfo['summaries']) {
                        if (ShowcaseInfo['summaries'][summaryName]['data_source_categories'] && ShowcaseInfo['summaries'][summaryName]['data_source_categories'].split("|").indexOf(id) >= 0) {
                            if(ShowcaseInfo['summaries'][summaryName]['mitre_tactic_display']){
                                let items = ShowcaseInfo['summaries'][summaryName]['mitre_tactic_display'].split("|");
                                for(let i = 0; i < items.length; i++){
                                    //console.log("Looking at item", items[i], translatedLabels[items[i]])
                                    if(translatedLabels[items[i]] && translatedLabels[items[i]] != undefined && translatedLabels[items[i]] != ""){
                                        tactics.push(translatedLabels[items[i]]);    
                                    }else{
                                        tactics.push(items[i]);    
                                    }
                                }
                            }
                            if(ShowcaseInfo['summaries'][summaryName]['mitre_technique_display']){
                                let items = ShowcaseInfo['summaries'][summaryName]['mitre_technique_display'].split("|");
                                for(let i = 0; i < items.length; i++){
                                    //console.log("Looking at item", items[i], translatedLabels[items[i]])
                                    if(translatedLabels[items[i]] && translatedLabels[items[i]] != undefined && translatedLabels[items[i]] != ""){
                                        techniques.push(translatedLabels[items[i]]);    
                                    }else{
                                        techniques.push(items[i]);    
                                    }
                                }
                            }
                            if(ShowcaseInfo['summaries'][summaryName]['mitre_threat_groups']){
                                let items = ShowcaseInfo['summaries'][summaryName]['mitre_threat_groups'].split("|");
                                for(let i = 0; i < items.length; i++){
                                    //console.log("Looking at item", items[i], translatedLabels[items[i]])
                                    if(translatedLabels[items[i]] && translatedLabels[items[i]] != undefined && translatedLabels[items[i]] != ""){
                                        threatgroups.push(translatedLabels[items[i]]);    
                                    }else{
                                        threatgroups.push(items[i]);    
                                    }
                                }
                            }
                            if(ShowcaseInfo['summaries'][summaryName]['killchain']){
                                let items = ShowcaseInfo['summaries'][summaryName]['killchain'].split("|");
                                for(let i = 0; i < items.length; i++){
                                    //console.log("Looking at item", items[i], translatedLabels[items[i]])
                                    if(translatedLabels[items[i]] && translatedLabels[items[i]] != undefined && translatedLabels[items[i]] != ""){
                                        killchainphases.push(translatedLabels[items[i]]);    
                                    }else{
                                        killchainphases.push(items[i]);    
                                    }
                                }
                            }
                            nameToID[ShowcaseInfo['summaries'][summaryName]['name']] = summaryName;
                            if (typeof ShowcaseInfo['summaries'][summaryName]['highlight'] != "undefined" && ShowcaseInfo['summaries'][summaryName]['highlight'].toLowerCase() == "yes") {
                                recommendedSearchNames.push(ShowcaseInfo['summaries'][summaryName]['name'])
                            } else {
                                otherSearchNames.push(ShowcaseInfo['summaries'][summaryName]['name'])
                            }
                        }
                    }
                    tactics = Array.from(new Set(tactics)).sort()
                    techniques = Array.from(new Set(techniques)).sort()
                    threatgroups = Array.from(new Set(threatgroups)).sort()
                    killchainphases = Array.from(new Set(killchainphases)).sort()

                    if(tactics.indexOf("None") >= 0){
                        tactics.splice( tactics.indexOf("None"), 1)
                    }

                    if(techniques.indexOf("None") >= 0){
                        techniques.splice( techniques.indexOf("None"), 1)
                    }

                    if(threatgroups.indexOf("None") >= 0){
                        threatgroups.splice( threatgroups.indexOf("None"), 1)
                    }

                    if(killchainphases.indexOf("None") >= 0){
                        killchainphases.splice( killchainphases.indexOf("None"), 1)
                    }


                    var mitreText = ""
                    if (typeof tactics != "undefined" && tactics != "") {
                        let mitre = tactics
                        if (mitre.indexOf("None") >= 0) {
                            mitre = mitre.splice(mitre.indexOf("None"), 1);
                        }
                        if (mitre.length > 0 && mitreText == "") {
                            mitreText = "<h2 style=\"margin-bottom: 5px;\">" + _("MITRE ATT&CK Tactics").t() + " <a href=\"https://attack.mitre.org/wiki/Main_Page\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
                        }
                        let numAdded = 0;
                        for (var i = 0; i < mitre.length; i++) {
                            if (mitre[i] == "None") {
                                continue;
                            }
                            numAdded++;
                            mitreText += "<div class=\"mitre_tactic_displayElements\">" + mitre[i] + "</div>"
                        }
                        mitreText += "<br style=\"clear: both;\"/>"
                        if (numAdded == 0) {
                            mitreText = ""
                        }
                    }

                    var mitreTechniqueText = ""
                    if (typeof techniques != "undefined" && techniques != "") {
                        let mitre = techniques
                        if (mitre.indexOf("None") >= 0) {
                            mitre = mitre.splice(mitre.indexOf("None"), 1);
                        }
                        if (mitre.length > 0 && mitreTechniqueText == "") {
                            mitreTechniqueText = "<h2 style=\"margin-bottom: 5px;\">" + _("MITRE ATT&CK Techniques").t() + " <a href=\"https://attack.mitre.org/wiki/Main_Page\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
                        }
                        let numAdded = 0;
                        for (var i = 0; i < mitre.length; i++) {
                            if (mitre[i] == "None") {
                                continue;
                            }
                            numAdded++;
                            mitreTechniqueText += "<div class=\"mitre_technique_displayElements\">" + mitre[i] + "</div>"
                        }
                        mitreTechniqueText += "<br style=\"clear: both;\"/>"
                        if (numAdded == 0) {
                            mitreTechniqueText = ""
                        }
                    }
                    var mitreThreatGroupText = ""
                    if (typeof threatgroups != "undefined" && threatgroups != "") {
                        let mitre = threatgroups
                        if (mitre.indexOf("None") >= 0) {
                            mitre = mitre.splice(mitre.indexOf("None"), 1);
                        }
                        if (mitre.length > 0 && mitreThreatGroupText == "") {
                            mitreThreatGroupText = "<h2 style=\"margin-bottom: 5px;\">" + _("MITRE Threat Groups").t() + " <a href=\"https://attack.mitre.org/groups/\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
                        }
                        let numAdded = 0;
                        for (var i = 0; i < mitre.length; i++) {
                            if (mitre[i] == "None") {
                                continue;
                            }
                            numAdded++;
                            mitreThreatGroupText += "<div class=\"mitre_threat_groupsElements\">" + mitre[i] + "</div>"
                        }
                        mitreThreatGroupText += "<br style=\"clear: both;\"/>"
                        if (numAdded == 0) {
                            mitreThreatGroupText = ""
                        }
                    }

                    var killchainText = ""
                    if (typeof killchainphases != "undefined" && killchainphases != "") {
                        let killchain = killchainphases
                        if (killchain.length > 0 && killchainText == "") {
                            killchainText = "<h2 style=\"margin-bottom: 5px;\">" + _("Kill Chain Phases").t() + " <a href=\"https://www.lockheedmartin.com/us/what-we-do/aerospace-defense/cyber/cyber-kill-chain.html\" class=\"external drilldown-icon\" target=\"_blank\"></a></h2>"
                        }
                        let numAdded = 0;
                        for (var i = 0; i < killchain.length; i++) {
                            if (killchain[i] == "None") {
                                continue;
                            }
                            numAdded++;
                            killchainText += "<div class=\"killchain\">" + killchain[i] + "</div>"
                        }
                        killchainText += "<br style=\"clear: both;\"/>"
                        if (numAdded == 0) {
                            killchainText = ""
                        }
                    }


                    
                    if (recommendedSearchNames.length + otherSearchNames.length > 0) {
                        recommendedSearchNames = recommendedSearchNames.sort()
                        otherSearchNames = otherSearchNames.sort()
                        if (recommendedSearchNames.length >= 10) {
                            finalSearchNames = recommendedSearchNames.slice(0, 10)
                        } else {
                            finalSearchNames = recommendedSearchNames
                        }
                        if (finalSearchNames.length < 10) {
                            finalSearchNames = finalSearchNames.concat(otherSearchNames.slice(0, 10 - finalSearchNames.length))
                        }
                        finalSearchNames = finalSearchNames.sort()
                        let contentContainingDiv = $('<div style="width: 100%; display:table;">')
                        let topContentDiv = $("<div style=\"display: table-cell; width: 40%;\" class=\"top-content\">")
                        topContentDiv.append(_("<h2>Content for This Data Source Category</h2>").t())
                        let contentList = $("<ul>")
                        for (let i = 0; i < finalSearchNames.length; i++) {
                            let summaryName = nameToID[finalSearchNames[i]]
                            let summaryDashboard = ShowcaseInfo['summaries'][summaryName]['dashboard']
                            let summaryJourney = ShowcaseInfo['summaries'][summaryName]['journey']
                            //console.log(summaryName, summaryDashboard,summaryJourney)
                            if (summaryDashboard == "ES_Use_Case" || summaryDashboard == "UBA_Use_Case" || summaryDashboard == "ESCU_Use_Case" || summaryDashboard == "PS_Use_Case") {
                                link = summaryDashboard + "?form.needed=stage" + summaryJourney.split("|")[0].replace("Stage_", "") + "&showcase=" + ShowcaseInfo['summaries'][summaryName]['name'];
                            } 
                            else if(summaryDashboard.includes("?load")) {
                                link = "ES_Use_Case" + "?form.needed=stage" + summaryJourney.split("|")[0].replace("Stage_", "") + "&showcase=" + ShowcaseInfo['summaries'][summaryName]['name'];
                            } else {
                                link = summaryDashboard;
                            }

                            contentList.append('<li><a target="_blank" href="' + link + '" class="ext">' + ShowcaseInfo['summaries'][summaryName]['name'] + '</a></li>')
                        }
                        if (recommendedSearchNames.length + otherSearchNames.length > 10) {
                            contentList.append("<li>And " + (recommendedSearchNames.length + otherSearchNames.length - 10) + " others.</li>")
                        }
                        topContentDiv.append(contentList)
                        topContentDiv.append(Splunk.util.sprintf(_('<p>Open in the <a target="_blank" href="contents#data_source_categories_display=%s" class="external drilldown-link">Security Content Dashboard</a></p>').t(), eventtype.name.replace(/ /g, "_")))

                        let data_onboarding = $("<div>")
                        if(eventtype.data_onboarding_guides && eventtype.data_onboarding_guides.length && eventtype.data_onboarding_guides.length>0){
                            let data_onboarding_list = $("<ul>")
                            for(let i = 0; i < eventtype.data_onboarding_guides.length; i++){
                                data_onboarding_list.append($("<li>").append($("<a target=\"_blank\">").addClass("drilldown-link").addClass("ext").text(eventtype.data_onboarding_guides[i]).attr("href", Splunk.util.make_full_url("/app/Splunk_Security_Essentials/data_source?technology=" + encodeURIComponent(eventtype.data_onboarding_guides[i])))))
                            }
                            data_onboarding.append($("<h2>Data Onboarding Guides</h2>"), data_onboarding_list)

                        }
                        
                        topContentDiv.append(data_onboarding)
                        contentContainingDiv.append(topContentDiv)

                        
                        contentContainingDiv.append( $("<div style=\"display: table-cell; width: 60%;\" >").append( mitreText, mitreTechniqueText, /*mitreThreatGroupText,*/ killchainText) );
                        $(".ds_main_panel").append(contentContainingDiv)
                    }else{

                        if(eventtype.data_onboarding_guides && eventtype.data_onboarding_guides.length && eventtype.data_onboarding_guides.length>0){
                            let data_onboarding_list = $("<ul>")
                            for(let i = 0; i < eventtype.data_onboarding_guides.length; i++){
                                data_onboarding_list.append($("<li>").append($("<a target=\"_blank\">").addClass("drilldown-link").addClass("ext").text(eventtype.data_onboarding_guides[i]).attr("href", Splunk.util.make_full_url("/app/Splunk_Security_Essentials/data_source?technology=" + encodeURIComponent(eventtype.data_onboarding_guides[i])))))
                            }
                            $(".ds_main_panel").append($("<h2>Data Onboarding Guides</h2>"), data_onboarding_list)

                        }
                        
                    }

                    let product_list = eventtype.common_product_names;
                    if (product_list && product_list.length > 0) {
                        $(".ds_main_panel").append($("<h2>Common products</h2>"),$("<p>").html(product_list.join(", ")))
                    }
                    createTable(eventtypeId)
                }
            }
        }
    }
    function updateIconsAndCounts(){
        let priorities = {
            "needsReview": 10,
            "needsCoverage": 7,
            "haveData": 4,
            "searchRan": 2,
            "starting": 0
        }
        let eventtypeList = {}
        let eventtypeCoverageLevels = {}
        let eventtypePlaceholder = false
        for(let i = 0; i < window.data_inventory_products.length; i++){
            if(! window.data_inventory_products[i]['eventtypeId']){
                continue;
            }
            let eventtypes = window.data_inventory_products[i]['eventtypeId'].split("|");
            for(let g = 0; g < eventtypes.length; g++){
                let eventtypeId = eventtypes[g]
                if(! eventtypeList[eventtypeId]){
                    eventtypeList[eventtypeId] = priorities["starting"]
                }
                if(window.data_inventory_products[i]['coverage_level'] && window.data_inventory_products[i]['coverage_level'] != "" && ! isNaN(window.data_inventory_products[i]['coverage_level']) && window.data_inventory_products[i]['coverage_level'] >= 0){
                    if(!eventtypeCoverageLevels[eventtypeId]){
                        eventtypeCoverageLevels[eventtypeId] = [window.data_inventory_products[i]['coverage_level']]
                    }else{
                        eventtypeCoverageLevels[eventtypeId].push(window.data_inventory_products[i]['coverage_level'])
                    }
                }else{
                    eventtypePlaceholder = true
                }
                let localLevel = priorities["starting"];
                if(window.data_inventory_products[i]['stage'] != "step-sourcetype" && window.data_inventory_products[i]['stage'] != "step-cim"){
                    if(window.data_inventory_products[i]['stage'] == "step-review"){
                        localLevel = priorities["needsReview"]
                    // }else if(window.data_inventory_products[i]['coverage_level'] == -1){
                    //     localLevel = priorities["needsCoverage"]
                    }else{ // if(! window.data_inventory_products[i]['coverage_level'] || window.data_inventory_products[i]['coverage_level'] == -1 || window.data_inventory_products[i]['coverage_level'] == ""){
                        //localLevel = priorities["needsCoverage"]
                        localLevel = priorities["haveData"]
                    }
                }else if(window.data_inventory_products[i]['status'] == "failure"){
                    localLevel = priorities["searchRan"]
                }
                
                if( localLevel > eventtypeList[eventtypeId] ){
                    eventtypeList[eventtypeId] = localLevel
                }
                // console.log("Status",window.data_inventory_products[i]['_key'], window.data_inventory_products[i]['eventtypeId'], eventtypeId, localLevel )
            }
            
        }
        for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
            if( (window.data_inventory_eventtypes[i].status == "failure" || window.data_inventory_eventtypes[i].status == "manualnodata") && (!eventtypeList[window.data_inventory_eventtypes[i]['eventtypeId']] || priorities['searchRan'] > eventtypeList[window.data_inventory_eventtypes[i]['eventtypeId']])){
                eventtypeList[window.data_inventory_eventtypes[i]['eventtypeId']] = priorities['searchRan']
            }
        }
        // console.log("Starting our evaluation, using",showcasesPerEventtype) 
        for(let ds in data_inventory){
            let status = priorities["starting"];
            let countAboveZero = 0
            let countwithData = 0;
            let count = 0;
            for(let dsc in data_inventory[ds]['eventtypes']){
                if (typeof showcasesPerEventtype[dsc] == "undefined") {
                    continue;
                }
                count++
                if(eventtypeList[dsc] == priorities["haveData"] || eventtypeList[dsc] == priorities["searchRan"]){
                    countAboveZero++;
                }
                if(eventtypeCoverageLevels[dsc] && window.fullyLoadedAndReadyForNewEvents){
                    let total = 0;
                    for(let i = 0; i < eventtypeCoverageLevels[dsc].length; i++) {
                        total += parseInt(eventtypeCoverageLevels[dsc][i]);
                    }
                    let avg = total / eventtypeCoverageLevels[dsc].length;
                    // console.log("Setting Agg Coverage LEvel for", dsc, avg, eventtypeCoverageLevels[dsc])
                    window.acceptNewEventtypeCoverageLevel(dsc, avg)
                }else if(eventtypePlaceholder && window.fullyLoadedAndReadyForNewEvents){
                    // console.log("Setting Default Agg Coverage level", dsc, 50)
                    window.acceptNewEventtypeCoverageLevel(dsc, 50)
                }

                // if(window.fullyLoadedAndReadyForNewEvents){
                //     if(eventtypeList[dsc] >= priorities["haveData"]){
                //         window.acceptNewEventtypeCoverageLevel(dsc, 100)
                //     }else{
                //         window.acceptNewEventtypeCoverageLevel(dsc, 0)
                //     }
                // }
                if(eventtypeList[dsc] > status){
                    status = eventtypeList[dsc]
                }
                if($(".ds_datasource#" + dsc).length > 0){
                    if(! eventtypeList[dsc] || eventtypeList[dsc] == priorities["starting"]){
                        $(".ds_datasource#" + dsc).find(".ds_status").find("div").html('<i class="icon-question" style="position: absolute; left: 6px; top: 6px; font-size: 18px"></i>')
                    }else if(eventtypeList[dsc] == priorities["searchRan"]){
                        $(".ds_datasource#" + dsc).find(".ds_status").find("div").html('<i class="icon-close" style="color: red; position: absolute; left: 6px; top: 6px; font-size: 18px"></i>')
                        
                    }else if(eventtypeList[dsc] == priorities["haveData"]){
                        $(".ds_datasource#" + dsc).find(".ds_status").find("div").html('<i class="icon-check" style="color: green; position: absolute; left: 6px; top: 6px; font-size: 18px"></i>')
                        
                    }else if(eventtypeList[dsc] == priorities["needsCoverage"]){
                        $(".ds_datasource#" + dsc).find(".ds_status").find("div").html('<i class="icon-pencil" style="color: yellow; position: absolute; left: 6px; top: 6px; font-size: 18px"></i>')
                        
                    }else if(eventtypeList[dsc] == priorities["needsReview"]){
                        $(".ds_datasource#" + dsc).find(".ds_status").find("div").html('<i class="icon-gear" style="color: darkred; position: absolute; left: 6px; top: 6px; font-size: 18px"></i>')
                        
                    }
                }
                // console.log("Random Status", "a:", dsc, "b:", status, "c:", eventtypeList[dsc], "d:", eventtypeCoverageLevels[dsc])
            }
            let icon = '<i class="icon-question" style="margin-left: 5px; font-size: 22px"></i>'
            if(status == priorities["searchRan"]){
                icon = '<i class="icon-close" style="color: red; margin-left: 5px; font-size: 22px"></i>'
            }else if(status == priorities["haveData"]){
                icon = '<i class="icon-check" style="color: green; margin-left: 5px; font-size: 22px"></i>'
            }else if(status == priorities["needsCoverage"]){
                icon = '<i class="icon-pencil" style="color: yellow; margin-left: 5px; font-size: 22px"></i>'
            }else if(status == priorities["needsReview"]){
                icon = '<i class="icon-gear" style="color: darkred; margin-left: 5px; font-size: 22px"></i>'
            }
            if(countAboveZero == count){
                $(".datasource_main#" + ds).find("h2").first().html( $(".datasource_main#" + ds).find("h2").first().text().replace(/ \([\d\/]*\).*/, "") + " (" + countAboveZero + ")  " + icon ) 
            }else{
                if(icon.indexOf("icon-gear") >= 0 || icon.indexOf("icon-pencil") >= 0){
                    $(".datasource_main#" + ds).find("h2").first().html( $(".datasource_main#" + ds).find("h2").first().text().replace(/ \([\d\/]*\).*/, "") + " (" + countAboveZero + "/" + count + ")  " + icon)     
                }else{
                    $(".datasource_main#" + ds).find("h2").first().html( $(".datasource_main#" + ds).find("h2").first().text().replace(/ \([\d\/]*\).*/, "") + " (" + countAboveZero + "/" + count + ")  " + '<i class="icon-question" style="margin-left: 5px; font-size: 22px"></i>' ) 
                }
            }
            
            // console.log(ds, status, countAboveZero, count, isActive)
        }        
    }
    window.updateIconsAndCounts = updateIconsAndCounts

    function ModalSuggestingDataSourceCheck() {

        // Now we initialize the Modal itself
        var myModal = new Modal("addExisting", {
            title: "Automated Introspection",
            backdrop: 'static',
            keyboard: false,
            destroyOnHide: true,
            type: 'normal'
        }, $);

        $(myModal.$el).on("show", function() {

        })
        myModal.body
            .append($("<p>").text(_("Welcome to the Data Inventory dashboard! The goal of this dashboard is to understand what data you have and to provide a foundational set of dashboards that guide you to valuable content. Furthermore, we want to provide a prescriptive view to what content will add value to your security operations.").t()), $("<p>").html(_("Of course, this can mean a bit of data entry. We don't like paperwork any more than you have, so we've automated as much of this as possible. Assuming that this search head has access to your production data (i.e., not on your laptop, or a dev environment, etc.), you can kick off the Automated Introspection below. Alternatively, you can manually enter the data. You can always start the automated data introspection later, by clicking the green \"Automated Introspection\" button in the upper-right hand corner of your screen.").t()));

        myModal.footer.append($('<button>').attr({
            type: 'button',
            'data-dismiss': 'modal',
            'data-bs-dismiss': 'modal'
        }).addClass('btn manually-configure').text('Manually Configure').on('click', function() {
            // Not taking any action here
        }), $('<button>').attr({
            type: 'button',
        }).addClass('btn btn-primary launch-introspection').text(_('Launch Automated Introspection').t()).on('click', function() {
            window.startSearches();
            $("#introspectionStatus").css("display", "block");
            $("#introspectionStatusBackdrop").css("display", "block");
            $('[data-bs-dismiss=modal').click()
        }))
        myModal.show(); // Launch it!
    }
    window.ModalSuggestingDataSourceCheck = ModalSuggestingDataSourceCheck

        function loadNextDSC(valueOnly) {
            // console.log("loadNextDSC called..", valueOnly)


            if ($(".ds_datasource_active").length == 0) {
                $(".ds_datasource").first().click()
            } else {
                let datasourceDivs = $(".ds_datasource")
                let datasourceIds = []
                let currentDatasourceId = $(".ds_datasource_active").first().attr("id")
                for (let i = 0; i < datasourceDivs.length; i++) {
                    datasourceIds.push(datasourceDivs[i].id)
                }
                let existingDSIndex = datasourceIds.indexOf(currentDatasourceId)
                if (existingDSIndex == datasourceIds.length - 1) {
                    if (valueOnly) {
                        return -1;
                    } else {
                        $('.ds_main_panel').html('<h2>' + _("Data Inventory Complete").t() + '</h2><p>' + _('You\'ve now gone through all of the configuration necessary to tell Splunk what data types you have in your environment. Time to explore content!').t() + '</p><button class="btn btn-primary get-started">' + _("Ready to get started?").t() + '</button></div>')
                        $("button.get-started").click(function() { window.location = "contents" })
                        $(".ds_datasource_active").removeClass("ds_datasource_active")
                    }
                } else {
                    if (valueOnly) {
                        // console.log("Value only return..", datasourceIds[existingDSIndex + 1])
                        return datasourceIds[existingDSIndex + 1]
                    } else {

                        // console.log("Going next...", datasourceIds[existingDSIndex + 1])
                        $(".ds_datasource").hide()
                        $(".ds_datasource_active").removeClass("ds_datasource_active")
                        $("#" + datasourceIds[existingDSIndex + 1]).closest(".datasource_main").find(".ds_datasource").show()
                        $("#" + datasourceIds[existingDSIndex + 1]).click()

                    }
                }
            }
        }
        window.loadNextDSC = loadNextDSC;

        function doesProductHaveActiveSearches(productId){
            
        }
        window.doesProductHaveActiveSearches = doesProductHaveActiveSearches


        function isProductReadyToBeGrabbed(productId){
            /// This will be for hunt for analyzing products
        }
        window.isProductReadyToBeGrabbed = isProductReadyToBeGrabbed

        function isProductFailed(productId){
            for(let i = 0; i < window.data_inventory_products.length; i++){
                if(window.data_inventory_products[i].productId == productId){
                    if( window.data_inventory_products[i].status == "failure" 
                        &&  window.data_inventory_products[i].stage == "step-sourcetype" ) {
                        return true;
                    }else{
                        return false
                    }
                }
            }
            return false;
        }
        window.isProductFailed = isProductFailed

        function isProductInQueue(productId){
            for(let i = 0; i < window.data_inventory_products.length; i++){
                if(window.data_inventory_products[i].productId == productId){
                    if( window.data_inventory_products[i].status 
                        && (window.dataProductStatusNames[window.data_inventory_products[i].status] 
                            || (window.data_inventory_products[i].status == "pending" 
                                    && stagesWithValidPendingStatus[window.data_inventory_products[i].stage]) 
                            )) {
                        return false;
                    }else{
                        return true
                    }
                }
            }
            return false;
        }
        window.isProductInQueue = isProductInQueue


        function isProductActive(productId){
            for(let i = 0; i < window.data_inventory_products.length; i++){
                if(window.data_inventory_products[i].productId == productId){
                    if( window.data_inventory_products[i].stage == "step-eventsize" || window.data_inventory_products[i].stage == "step-volume" ){
                        return true;
                    }else{
                        return false
                    }
                }
            }
            return false;
        }
        window.isProductActive = isProductActive


        function isProductComplete(productId){
            for(let i = 0; i < window.data_inventory_products.length; i++){
                if(window.data_inventory_products[i].productId == productId){
                    if( window.data_inventory_products[i].stage == "all-done" ){
                        return true;
                    }else{
                        return false
                    }
                }
            }
            return false;
        }
        window.isProductComplete = isProductComplete


        function getCurrentProductStatus(productId){
            for(let i = 0; i < window.data_inventory_products.length; i++){
                if(window.data_inventory_products[i].productId == productId){
                    return { "stage": window.data_inventory_products[i].stage, "status": window.data_inventory_products[i].status }
                }
            }
            return undefined
        }
        window.getCurrentProductStatus = getCurrentProductStatus


        function buildNewProduct(productId, presetValues){
            
        }
        window.buildNewProduct = buildNewProduct

        
        function setStageStatus(id, stage, status){
            if(id.match(/^DS\d\d\d/)){
                for(let i = 0; i < window.data_inventory_eventtypes.length; i++){
                    if(window.data_inventory_eventtypes[i].eventtypeId == id){
                        window.data_inventory_eventtypes[i].status = status;
                        window.intro_elements[id].status = status
                        return true;
                    }
                }
            }else{
                for(let i = 0; i < window.data_inventory_products.length; i++){
                    if(window.data_inventory_products[i].productId == id){
                        window.data_inventory_products[i].stage = stage;
                        window.data_inventory_products[i].status = status;
                        window.intro_elements[id].stage = stage
                        window.intro_elements[id].status = status
                        return true;
                    }
                }
            }
            return false;
        }
        window.setStageStatus = setStageStatus

    })
//# sourceURL=data_inventory.js