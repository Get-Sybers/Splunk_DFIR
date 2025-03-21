'use strict';

window.appName = "Splunk_Security_Essentials"
require(['jquery',
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
], function($,
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

    var haveRunSearches = false
    var CalculateDependencies = function() {

        for (var datasourceId in data_inventory) {
            var datasource = data_inventory[datasourceId]
            var datasourceStatus;
            var datasourceStatus = { "good": 0, "bad": 0, "mixed": 0, "inqueue": 0, "unknown": 0 };
            for (var eventtypeId in datasource.eventtypes) {
                var eventtype = datasource.eventtypes[eventtypeId]
                var eventtypeStatus = { "good": 0, "bad": 0, "mixed": 0, "inqueue": 0, "unknown": 0 };
                var searchStrings = []
                for (var productId in eventtype.products) {
                    var product = eventtype.products[productId]

                    if (typeof product.status == "undefined") {
                        eventtypeStatus["unknown"]++
                    } else {
                        eventtypeStatus[product.status]++;
                    }
                    if (product.status == "good") { // TODO This needs to be updated to account for the select option
                        searchStrings.push(product.basesearch)
                    }
                }
                var eventtypeResultStatus = summarizeStatus(eventtypeStatus, true)

                $("#" + eventtypeId + " .et_status").html(buildStatusIcon(eventtypeResultStatus))
                datasourceStatus[eventtypeResultStatus]++
                    var searchString = ""
                if (searchStrings.length > 1) {
                    searchString = "( (" + searchStrings.join(") OR ( ") + ") )"
                } else if (searchStrings.length == 1) {
                    searchString = searchStrings[0]
                }
                if (eventtypeResultStatus != "inqueue" && haveRunSearches == true) {
                    updateEventtypeOnServer(datasourceId, eventtypeId, eventtypeResultStatus, searchString)
                }
            }

            $("#" + datasourceId + " .ds_status div").html(buildStatusIcon(summarizeStatus(datasourceStatus, false)))
        }
    }

    // console.log("Hey, I have a good showcase...", ShowcaseInfo, data_inventory, data_inventory_products)
    window.data_inventory = data_inventory
    for (var i = 0; i < data_inventory_products.length; i++) {
        if (typeof data_inventory_products[i].status != "undefined" && data_inventory_products[i].status != "") {
            data_inventory[data_inventory_products[i].datasourceId].eventtypes[data_inventory_products[i].eventtypeId].products[data_inventory_products[i].productId].status = data_inventory_products[i].status
            data_inventory[data_inventory_products[i].datasourceId].eventtypes[data_inventory_products[i].eventtypeId].products[data_inventory_products[i].productId].status_overridden = true
        }
        if (typeof data_inventory_products[i].basesearch != "undefined" && data_inventory_products[i].basesearch != "") {
            data_inventory[data_inventory_products[i].datasourceId].eventtypes[data_inventory_products[i].eventtypeId].products[data_inventory_products[i].productId].basesearch = data_inventory_products[i].basesearch
            data_inventory[data_inventory_products[i].datasourceId].eventtypes[data_inventory_products[i].eventtypeId].products[data_inventory_products[i].productId].basesearch_overridden = true
        }
        data_inventory[data_inventory_products[i].datasourceId].eventtypes[data_inventory_products[i].eventtypeId].products[data_inventory_products[i].productId].kvstore_exists = true
    }
    for (var i = 0; i < data_inventory_eventtypes.length; i++) {
        if (typeof data_inventory_eventtypes[i].basesearch != "undefined" && data_inventory_eventtypes[i].basesearch != "") {
            data_inventory[data_inventory_eventtypes[i].datasourceId].eventtypes[data_inventory_eventtypes[i].eventtypeId].basesearch = data_inventory_eventtypes[i].basesearch
            data_inventory[data_inventory_eventtypes[i].datasourceId].eventtypes[data_inventory_eventtypes[i].eventtypeId].basesearch_overridden = true
        }
        // console.log("Looking for ", data_inventory_eventtypes[i], data_inventory_eventtypes[i].datasourceId, data_inventory)
            // This was an unknown bug that popped up when looking at it as data_inventory_alpha... so I probably broke something at some point.
            //data_inventory[ data_inventory_eventtypes[i].datasourceId ].eventtypes[ data_inventory_eventtypes[i].eventtypeId ].kvstore_exists = true
    }
    var counterForRecalculatingTimer = 0;
    var output = $("<div></div>")
    for (var datasourceId in data_inventory) {
        var datasource = data_inventory[datasourceId]
        var ds_output = $('<div id="' + datasourceId + '" class="ds_datasource">')
        var statusText = $('<div style="position: relative;">').html(buildStatusIcon(datasource.status))

        ds_output.append($('<div class="ds_dropdown">').html('<i class="arrow icon-chevron-right" /> ').click(function(obj) {
            var currentClass = $(obj.target).parent().find("i.arrow").first().attr("class")
            if (currentClass == "arrow icon-chevron-right") {
                $(obj.target).parent().find("i.arrow").attr("class", "arrow icon-chevron-down")
                $(obj.target).closest(".ds_datasource").find(".ds_lowermain").css("display", "block")
            } else {
                $(obj.target).parent().find("i.arrow").attr("class", "arrow icon-chevron-right")
                $(obj.target).closest(".ds_datasource").find(".ds_lowermain").css("display", "none")
            }
        }))
        ds_output.append($('<div class="ds_status">').append(statusText))
        var ds_mainBlock = $('<div class="ds_main">')
        var ds_header = $('<div class="ds_header">')
        ds_header.append($("<h2>").text(datasource.name))
        ds_header.append($("<p>").text(datasource.description))
        ds_mainBlock.append(ds_header)
        var ds_lowerBlock = $('<div class="ds_lowermain">')
        for (var eventtypeId in datasource.eventtypes) {
            var eventtype = datasource.eventtypes[eventtypeId]
            var evt_output = $('<div id="' + eventtypeId + '" class="df_eventtype" style="margin-left: 20px;">')
            evt_output.append($('<div class="ds_dropdown">').html('<i class="arrow icon-chevron-right" /> ').click(function(obj) {
                var currentClass = $(obj.target).parent().find("i.arrow").attr("class")
                if (currentClass == "arrow icon-chevron-right") {
                    $(obj.target).parent().find("i.arrow").attr("class", "arrow icon-chevron-down")
                    $(obj.target).closest(".df_eventtype").find(".et_lowerMain").css("display", "block")
                } else {
                    $(obj.target).parent().find("i.arrow").attr("class", "arrow icon-chevron-right")
                    $(obj.target).closest(".df_eventtype").find(".et_lowerMain").css("display", "none")
                }
            }))
            evt_output.append($('<div class="et_status">').html(buildStatusIcon(eventtype.status)))
            var evt_main = $('<div class="et_main">')
            evt_main.append($("<h3>").text(eventtype.name))
            evt_main.append($("<p>").text(eventtype.description))
            var evt_lowerMain = $('<div class="et_lowerMain">')
            for (var productId in eventtype.products) {
                var product = eventtype.products[productId]
                evt_lowerMain.append(buildProduct(product, datasourceId, eventtypeId, productId))
            }
            evt_main.append(evt_lowerMain)
            evt_output.append(evt_main)
            ds_lowerBlock.append(evt_output)

        }
        ds_mainBlock.append(ds_lowerBlock)
        ds_output.append(ds_mainBlock)
        output.append(ds_output)
    }
    $("#foundation_container").append(output)
    CalculateDependencies()
    $("#startSearchesButton").click(function() {
        startAllSearches()
    })

    function buildProduct(product, datasourceId, eventtypeId, productId) {
        var uniqueId = datasourceId + "_" + eventtypeId + "_" + productId
        var prod_output = $('<div class="df_product" style="margin-left: 20px;">')
        prod_output.append($("<h4>").text(product.name))
        var element = $('<div id="' + uniqueId + '_element">')
        element.append($('<table class="table chrome elementDetail">').append(
            $('<thead><tr><th>Selected</th><th>Status</th><th class="baseSearch">Expected Data Location</th><th>Validation Search</th><th class="errorCode">Resolution</th></tr></thead>'),
            $('<tbody><tr><td class="selected"></td><td class="elementStatus">' + buildStatusIcon(product.status, "font-size: 18px; top: 4px;") + '</td><td class="baseSearch">' + product.basesearch + '<i style="float: right; cursor: pointer;" class="icon-pencil" /></td><td class="validation"><a href="' + Splunk.util.make_full_url('/app/' + appName + '/search?q=' + product.basesearch + ' ' + product.validation) + '" target="_blank" class="external drilldown-icon">Check</a></td><td class="errorCode"></td></tr></tbody></table>')))
        element.find("i").click(function() {
            changeBaseSearch(uniqueId);
            return false;
        })
        prod_output.append(element)
        generateSearchManager(product.basesearch + " " + product.validation, uniqueId, product.parameters || {})
        return prod_output;
    }

    function buildStatusIcon(status, style) {
        style = style || "top: 24px; font-size: 36px;"
        if (typeof status != "undefined") {
            switch (status.toLowerCase()) {
                case "good":
                    return '<i class="icon-check" style="position: absolute; color: #65a637; left: 13px; ' + style + '" />'
                case "mixed":
                    return '<i class="icon-warning" style="position: absolute; color: #f2b827; left: 13px; ' + style + '" />'
                case "bad":
                    return '<i class="icon-error" style="position: absolute; color: #d6563c; left: 13px; ' + style + '" />'
                case "inqueue":
                    return '<i class="icon-clock" style="position: absolute; color: gray; left: 13px; ' + style + '" />'

            }
        }
        return '<i class="icon-question" style="position: absolute; left: 18px; ' + style + '" />'
    }

    function changeBaseSearch(uniqueId) {
        var product = getProductForUniqueId(uniqueId)
        var eventtype = getEventtypeForUniqueId(uniqueId)
        var adjustVizModal = new Modal('change-' + uniqueId, {
            title: 'Adjust Base Search - ' + eventtype.name + ' - ' + product.name,
            destroyOnHide: true,
            type: 'wide'
        }, $);



        var tempID = Math.random() % 100000

        var search2 = new SearchManager({
            "id": tempID + "sm1",
            "sample_ratio": null,
            "latest_time": "$latest$",
            "search": "| tstats count where earliest=-1d index=* by index",
            "earliest_time": "0",
            "cancelOnUnload": true,
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "tokenDependencies": {},
            "runWhenTimeIsUndefined": false
        }, { tokens: true });

        var search3 = new SearchManager({
            "id": tempID + "sm2",
            "sample_ratio": null,
            "latest_time": "$latest$",
            "search": "| metadata type=sourcetypes index=$index$",
            "earliest_time": "0",
            "cancelOnUnload": true,
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "tokenDependencies": {},
            "runWhenTimeIsUndefined": false
        }, { tokens: true });

        var input1 = new DropdownInput({
            "id": tempID + "input1",
            "choices": [],
            "valueField": "index",
            "showClearButton": true,
            "labelField": "index",
            "searchWhenChanged": true,
            "selectFirstChoice": false,
            "value": "$form.index$",
            "managerid": tempID + "sm1",
            "el": $('<span>')
        }, { tokens: true }).render();

        input1.on("change", function(newValue) {
            //FormUtils.handleValueChange(input1);
        });

        var input2 = new DropdownInput({
            "id": tempID + "input2",
            "choices": [],
            "valueField": "sourcetype",
            "showClearButton": true,
            "labelField": "sourcetype",
            "searchWhenChanged": true,
            "selectFirstChoice": false,
            "value": "$form.sourcetype$",
            "managerid": tempID + "sm2",
            "el": $('<span>')
        }, { tokens: true }).render();

        input2.on("change", function(newValue) {
            //FormUtils.handleValueChange(input2);
        });

        var body = $('<p>There are two options for defining the new base search. It is highly recommend to take the default option below, where we select the index and sourcetype via dropdown from what we see in your environment (this ensures that we take advantage of Splunk performance, by specifying the index and sourcetype). Alternatively, you can enter the raw string below.</p>')
        body.append($('<div style=" display: inline-block;  clear: both;">').append(
            $('<input type="radio" name="changeSelectRadio" value="dropdown" style="float: left;" checked selected>').click(function() {
                $("#changeBaseViaDropdown").find(".grayout").css("display", "none")
                $("#changeBaseViaBox").find(".grayout").css("display", "block")
            }),
            $('<div style="position: relative; margin-left: 8px; border: solid 1px lightslategray; width: 500px; height: 100px;display: inline-block;" id="changeBaseViaDropdown">').append(
                $('<div class="grayout" style="position: absolute; display: none; width: 100%; height: 100%; background-color: gray; opacity: 0.5;"></div>')
                /*,
                            input1.$el,input2.$el*/
            )
        ))
        body.append($('<div style=" margin-top: 8px;  display: inline-block;  clear: both;">').append(
            $('<input type="radio" name="changeSelectRadio" value="box" style="float: left;">').click(function() {
                $("#changeBaseViaDropdown").find(".grayout").css("display", "block")
                $("#changeBaseViaBox").find(".grayout").css("display", "none")
            }),
            $('<div style="position: relative; margin-left: 8px; border: solid 1px lightslategray; width: 500px; height: 100px; display: inline-block;" id="changeBaseViaBox">').append(
                $('<div class="grayout" style="position: absolute; width: 100%; height: 100%; background-color: gray; opacity: 0.5;"></div>'),
                $('<textarea style="height: 90%; width: 95%;">').text(product.basesearch))
        ))

        adjustVizModal.body.append(body);
        adjustVizModal.body.addClass('mlts-modal-form-inline')
        adjustVizModal.footer.append($('<button>').addClass('mlts-modal-submit').attr({
                type: 'button',
            }).addClass('btn btn-primary mlts-modal-submit').text('Change').on('click', function() {
                if ($("input[name=changeSelectRadio]:checked").val() == "box") {
                    // textbox
                    var product = getProductForUniqueId(uniqueId)

                } else {
                    // dropdown
                }
                $('[data-bs-dismiss=modal').click()

            })

        )
        adjustVizModal.show();

    }
    var startAllSearches = function() {
        var itemNames = splunkjs.mvc.Components.getInstanceNames()
        haveRunSearches = true
        for (var i = 0; i < itemNames.length; i++) {
            if (itemNames[i].indexOf("DS") == 0) {
                splunkjs.mvc.Components.getInstance(itemNames[i]).startSearch()
            }
        }
    }

    function getProductForUniqueId(uniqueId) {
        var [datasourceId, eventtypeId, productId, element] = uniqueId.split("_")
        return data_inventory[datasourceId].eventtypes[eventtypeId].products[productId]
    }

    function getEventtypeForUniqueId(uniqueId) {
        var [datasourceId, eventtypeId, productId, element] = uniqueId.split("_")
        return data_inventory[datasourceId].eventtypes[eventtypeId]
    }

    function generateSearchManager(query, uniqueId, parameters) {
        var sm = new SearchManager({
            "id": uniqueId,
            "cancelOnUnload": true,
            "latest_time": "",
            "status_buckets": 0,
            "earliest_time": "0",
            "search": query,
            "app": window.appName,
            "auto_cancel": 20,
            //"auto_finalize_ec": 2000,
            "max_time": parameters.override_auto_finalize || 20,
            "preview": true,
            "runWhenTimeIsUndefined": false,
            "autostart": false
        }, { tokens: true, tokenNamespace: "submitted" });
        sm.on('search:start', function(properties) {
            var uniqueId = properties.content.request.label
            $("#" + uniqueId + "_element").find("td.elementStatus").html("<img title=\"In Queue...\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/queue_icon.png") + "\">")
            setSearchStatus(uniqueId, "inqueue")
        });
        sm.on('search:error', function(properties) {
            var uniqueId = properties.content.request.label
            $("#" + uniqueId + "_element").find("td.elementStatus").html("<img title=\"Error\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/err_ico.gif") + "\">")
            $("#" + uniqueId + "_element").find("td.errorCode").html(getProductForUniqueId(uniqueId).errordescription)
            $("#" + uniqueId + "_element").find(".errorCode").css("display", "table-cell")
            setSearchStatus(uniqueId, "bad")
        });
        sm.on('search:fail', function(properties) {
            var uniqueId = properties.content.request.label
            $("#" + uniqueId + "_element").find("td.elementStatus").html("<img title=\"Error\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/err_ico.gif") + "\">")
            $("#" + uniqueId + "_element").find("td.errorCode").html(getProductForUniqueId(uniqueId).errordescription)
            $("#" + uniqueId + "_element").find(".errorCode").css("display", "table-cell")
            setSearchStatus(uniqueId, "bad")
        });
        sm.on('search:done', function(properties) {
            var uniqueId = properties.content.request.label
            if (properties.content.resultCount == 0) {
                $("#" + uniqueId + "_element").find("td.elementStatus").html("<img title=\"Error\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/err_ico.gif") + "\">")
                setSearchStatus(uniqueId, "bad")
                $("#" + uniqueId + "_element").find("td.errorCode").html(getProductForUniqueId(uniqueId).errordescription)
                $("#" + uniqueId + "_element").find(".errorCode").css("display", "table-cell")
            } else {
                var results = splunkjs.mvc.Components.getInstance(uniqueId).data('results', { output_mode: 'json', count: 0 });
                results.on("data", function(properties) {
                    var uniqueId = properties.attributes.manager.id
                    var data = properties.data().results
                    if (typeof data == "object" && typeof data.length == "number" && data.length >= 1 && typeof data[0].count != "undefined" && data[0].count > 0) {
                        $("#" + uniqueId + "_element").find("td.elementStatus").html("<img title=\"Success\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/ok_ico.gif") + "\">")
                        setSearchStatus(uniqueId, "good")

                    } else {
                        $("#" + uniqueId + "_element").find("td.elementStatus").html("<img title=\"Error\" src=\"" + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/err_ico.gif") + "\">")
                        setSearchStatus(uniqueId, "bad")
                        $("#" + uniqueId + "_element").find("td.errorCode").html(getProductForUniqueId(uniqueId).errordescription)
                        $("#" + uniqueId + "_element").find(".errorCode").css("display", "table-cell")


                    }

                })
            }
        });

    }

    function summarizeStatus(statusObj, justOneAllowed) {
        if (statusObj["inqueue"] > 0) {
            return "inqueue"
        } else if (statusObj["unknown"] > 0) {
            return "unknown"
        } else if (statusObj["mixed"] > 0 && statusObj["inqueue"] == 0) {
            return "mixed"
        } else if (statusObj["good"] > 0 && statusObj["bad"] > 0 && statusObj["inqueue"] == 0) {
            if (statusObj["good"] == 1 && justOneAllowed == true) {
                return "good"
            } else {
                return "mixed"
            }
        } else if (statusObj["bad"] > 0) {
            return "bad"
        } else if (statusObj["good"] > 0) {
            return "good"
        } else {
            return "mixed"
                // console.log("ERROR! Unclear how this pops up..", statusObj)
        }
    }

    function setSearchStatus(uniqueId, status) {
        var icon = buildStatusIcon(status, "font-size: 18px; top: 4px;")

        clearTimeout(counterForRecalculatingTimer);
        counterForRecalculatingTimer = setTimeout(CalculateDependencies, 1000);
        switch (status) {
            case "bad":
                $("#" + uniqueId + "_element").find("td.elementStatus").html(icon)
                $("#" + uniqueId + "_element").find("td.errorCode").html(getProductForUniqueId(uniqueId).errordescription)
                $("#" + uniqueId + "_element").find(".errorCode").css("display", "table-cell")
                break;
            case "good":
                $("#" + uniqueId + "_element").find("td.elementStatus").html(icon)
                $("#" + uniqueId + "_element").find("errorCode").css("display", "none")
                break;
            case "inqueue":
                $("#" + uniqueId + "_element").find("td.elementStatus").html(icon)
                $("#" + uniqueId + "_element").find("errorCode").css("display", "none")
                break;

        }
        updateServerWithStatus(uniqueId, status)
        var [datasourceId, eventtypeId, productId, element] = uniqueId.split("_")
        data_inventory[datasourceId].eventtypes[eventtypeId].products[productId].status = status
    }

    function updateServerWithStatus(uniqueId, status, selected, basesearch) {
        var product = getProductForUniqueId(uniqueId)
        if (typeof selected == "undefined" && typeof product.selected_overridden != "undefined" && product.selected_overridden == true) {
            selected = product.selected
        } else {
            selected = ""
        }
        if (typeof basesearch == "undefined" && typeof product.basesearch_overridden != "undefined" && product.basesearch_overridden == true) {
            basesearch = product.basesearch
        } else {
            basesearch = ""
        }
        if (status == "inqueue")
            return 0;
        var [datasourceId, eventtypeId, productId, element] = uniqueId.split("_")
        var record = {
            _time: (new Date).getTime() / 1000,
            _key: uniqueId,
            datasourceId: datasourceId,
            eventtypeId: eventtypeId,
            productId: productId,
            status: status,
            selected: selected,
            basesearch: basesearch
        }

        if (typeof product.kvstore_exists != "undefined" && product.kvstore_exists == true) {
            delete record["_key"]
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/' + uniqueId,
                type: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                contentType: "application/json",
                async: true,
                data: JSON.stringify(record),
                success: function(){bustCache(); }
            })
        } else {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
                type: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                contentType: "application/json",
                async: true,
                data: JSON.stringify(record),
                error: function(jqXHR, textStatus, errorThrown) {
                    bustCache(); 
                    if (jqXHR.status === 409) {
                        delete record["_key"]
                        $.ajax({
                            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/' + uniqueId,
                            type: 'POST',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-Splunk-Form-Key': window.getFormKey(),
                            },
                            contentType: "application/json",
                            async: false,
                            data: JSON.stringify(record),
                            success: function(){
                                bustCache(); 
                            }
                        })
                    }
                }
            })
        }
    }

    function updateEventtypeOnServer(datasourceId, eventtypeId, status, basesearch) {
        basesearch = basesearch || "";
        if (status == "inqueue")
            return 0;
        var record = {
            _time: (new Date).getTime() / 1000,
            _key: eventtypeId,
            datasourceId: datasourceId,
            eventtypeId: eventtypeId,
            status: status,
            basesearch: basesearch
        }


        if (typeof data_inventory[datasourceId].eventtypes[eventtypeId].kvstore_exists != "undefined" && data_inventory[datasourceId].eventtypes[eventtypeId].kvstore_exists == true) {
            delete record["_key"]
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/' + eventtypeId,
                type: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                contentType: "application/json",
                async: false,
                data: JSON.stringify(record),
                success: function(){bustCache(); }
            })
        } else {

            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
                type: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                contentType: "application/json",
                async: false,
                data: JSON.stringify(record),
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 409) {
                        delete record["_key"]
                        $.ajax({
                            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/' + eventtypeId,
                            type: 'POST',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-Splunk-Form-Key': window.getFormKey(),
                            },
                            contentType: "application/json",
                            async: false,
                            data: JSON.stringify(record),
                            success: function(){bustCache(); }
                        })
                    }
                }
            })

        }
    }
})