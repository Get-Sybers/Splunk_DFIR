'use strict';

define(['jquery', 'module', 'underscore', 'json!' + $C['SPLUNKD_PATH'] + '/services/pullJSON?config=data_inventory&locale=' + window.localeString, 'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config'], function($, module, _, data_inventory, appConfig) {
    var config = module.config();
    return {
        build_tile: function build_tile(showcaseSettings, forSearchBuilder, showcaseName) {
            if (typeof showcaseName == "undefined") {
                showcaseName = showcaseSettings.name.replace(/[\. ]/g, "_").replace(/[^\. \w]*/g, "")
            }

            // General normalizing of showcasesetting settings
            if (typeof showcaseSettings['securityDataJourney'] == "undefined") {
                //console.log("Missing Journey for ", showcaseSettings)
                showcaseSettings['securityDataJourney'] = "Level_1" //JourneyAdjustment
            }
            if (typeof showcaseSettings['advancedtags'] == "undefined") {
                showcaseSettings['advancedtags'] = ""
            }
            if (typeof showcaseSettings['dashboard'] != "undefined" && showcaseSettings['dashboard'].indexOf("showcase_first_seen_demo") != -1 && showcaseSettings['advancedtags'].indexOf("Behavioral") == -1) {
                if (showcaseSettings['advancedtags'] != "")
                    showcaseSettings['advancedtags'] += "|"
                showcaseSettings['advancedtags'] += "Behavioral|First Time Seen"
            }
            if (typeof showcaseSettings['dashboard'] != "undefined" && showcaseSettings['dashboard'].indexOf("showcase_standard_deviation") != -1 && showcaseSettings['advancedtags'].indexOf("Behavioral") == -1) {
                if (showcaseSettings['advancedtags'] != "")
                    showcaseSettings['advancedtags'] += "|"
                showcaseSettings['advancedtags'] += "Behavioral|Time Series"
            }
            if (typeof showcaseSettings['app'] != "undefined" && (showcaseSettings['app'] == "Splunk_User_Behavior_Analytics" || showcaseSettings['app'] == "Splunk_App_for_Enterprise_Security" || showcaseSettings['app'] == "Enterprise_Security_Content_Update")) {
                if (showcaseSettings['advancedtags'] != "")
                    showcaseSettings['advancedtags'] += "|"
                showcaseSettings['advancedtags'] += "Premium App"
            }
            if (typeof showcaseSettings['app'] != "undefined" && showcaseSettings['app'] == "Splunk_Professional_Services_Catalog") {
                if (showcaseSettings['advancedtags'] != "")
                    showcaseSettings['advancedtags'] += "|"
                showcaseSettings['advancedtags'] += "Implemented by Services"
            }
            if (typeof showcaseSettings['SPLEase'] != "undefined" && showcaseSettings['SPLEase'].indexOf("dvanced") != -1) {
                if (showcaseSettings['advancedtags'] != "")
                    showcaseSettings['advancedtags'] += "|"
                showcaseSettings['advancedtags'] += "Advanced SPL"
            }
            if (showcaseSettings['advancedtags'] == "") {
                showcaseSettings['advancedtags'] = "N/A"
            }
            /*Add Machine Learning, once the MLTK use cases are in. if(typeof showcaseSettings['app'] != "undefined" && (showcaseSettings['app'] == "Splunk_User_Behavior_Analytics" || showcaseSettings['app'] == "Splunk_App_for_Enterprise_Security" || showcaseSettings['app'] == "Enterprise_Security_Content_Update") ){
                if(showcaseSettings['advancedtags'] != "")
                    showcaseSettings['advancedtags'] += "|"
                showcaseSettings['advancedtags'] += "Behavioral"
            }*/

            if (typeof showcaseSettings.highlight == "undefined" || showcaseSettings.highlight == null)
                showcaseSettings.highlight = "No"
            exampleList = '';
            exampleText = '';

            let datasourceText = "";
            if (showcaseSettings.data_source_categories) {
                let dscs = showcaseSettings.data_source_categories.split("|")
                datasourceText = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">'
                for(let i = 0; i < dscs.length; i++){
                    let dsc = dscs[i]
                    let label = "Data Source Name Missing"
                    for(let dids in data_inventory){
                        for(let didsc in data_inventory[dids]['eventtypes']){
                            if(didsc == dsc){
                                if(data_inventory[dids]['eventtypes'][didsc]['short_unified_name'] && data_inventory[dids]['eventtypes'][didsc]['short_unified_name'] != ""){
                                    label = data_inventory[dids]['eventtypes'][didsc]['short_unified_name']
                                }else{
                                    label = data_inventory[dids]['name'] + " > " + data_inventory[dids]['eventtypes'][didsc]['name']
                                }
                                //console.log("Setting label", dsc, data_inventory[dids]['eventtypes'][didsc]['short_unified_name'], label, data_inventory[dids]['name'] + " > " + data_inventory[dids]['eventtypes'][didsc]['name'], data_inventory[dids]['eventtypes'][didsc])
                            }
                        }
                    }
                    datasourceText += "<div title=\"\" data-toggle=\"tooltip\" data-placement=\"top\" data-bs-original-title=\"" + _("Blue Bubbles indicate the data source used by this example.").t() + "\" class=\"contentstooltipcontainer datasourceElements\"><a target=\"_blank\" href=\"data_inventory#id=" + dsc + "\">" + label + "</a></div>" //StyleChange
                }
                datasourceText += "</div>"
            }


            // var datasourceText = ""
            // if (typeof showcaseSettings.datasources == "undefined" && showcaseSettings.datasource != "undefined") {
            //     showcaseSettings.datasources = showcaseSettings.datasource
            // }
            // if (typeof showcaseSettings.datasources != "undefined" && showcaseSettings.datasource != "Other") {

            //     if (typeof showcaseSettings.datasources == "undefined" || showcaseSettings.datasources == null) {
            //         //console.log("WARNING WARNING! This showcase has no datasources defined.", showcaseSettings)
            //     } else {
            //         datasources = showcaseSettings.datasources.split("|")
            //         datasourceText = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">' //StyleChange
            //         for (var i = 0; i < datasources.length; i++) {
            //             var link = datasources[i].replace(/[^\w\- ]/g, "").replace(/ /g, "%20")
            //             var description = datasources[i]

            //             datasourceText += "<div title=\"\"  class=\"contentstooltipcontainer datasourceElements\"><a target=\"_blank\" href=\"data_source?datasource=" + link + "\">" + description + "</a><span class=\"contentstooltiptext\">Blue Bubbles indicate the data source used by this example.</span></div>" //StyleChange
            //         }
            //         datasourceText += "</div>"
            //     }
            // }
            var forSearchBuilderText = ""

            if (typeof forSearchBuilder != "undefined" && forSearchBuilder == true) {
                forSearchBuilderText += "<h3><a target=\"_blank\" class=\"external drilldown-icon\" href=\"journey?stage=" + showcaseSettings.securityDataJourney.replace(/Level/g, "") + "\">" + showcaseSettings.securityDataJourney.replace(/_/g, " ") + "</a></h3> "
                if (typeof showcaseSettings.usecase != "undefined") {
                    var usecase = showcaseSettings.usecase.split("|")
                    forSearchBuilderText += "<h3>" + usecase.join(", ") + "</h3> "
                }
                if (typeof showcaseSettings.category != "undefined") {
                    var categories = showcaseSettings.category.split("|")
                    var finalCategories = []
                    for (var i = 0; i < categories.length; i++) {
                        if (forSearchBuilderText.indexOf(categories[i]) == -1)
                            finalCategories.push(categories[i])
                    }
                    if (finalCategories.length > 0)
                        forSearchBuilderText += "<h3>" + finalCategories.join(", ") + "</h3> "
                }

            }




            var highlightText = ""
            if (showcaseSettings.highlight == "Yes" && showcaseSettings.highlight != "") {
                highlightText = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">' //StyleChange
                highlightText += "<div data-toggle=\"tooltip\" data-placement=\"top\" data-bs-original-title=\"" + _("This search is highly recommended by Splunk's Security SMEs.").t() + "\" class=\"contentstooltipcontainer highlightElements\">" + _("Featured").t() + "</div>" //StyleChange
                highlightText += "</div>"
            }



            var mitreText = ""
            if (typeof showcaseSettings.mitre_tactic_display != "undefined" && showcaseSettings.mitre_tactic_display != "" && showcaseSettings.mitre_tactic_display != "None") {
                //console.log("showcase settings", showcaseSettings)
                mitreText = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">' //StyleChange
                mitre = showcaseSettings.mitre_tactic_display.split("|")
                for (var i = 0; i < mitre.length; i++) {
                    if (mitre[i] != "Other") {
                        mitreText += "<div data-toggle=\"tooltip\" data-placement=\"top\" data-bs-original-title=\"" + _("Red Bubbles indicate the MITRE ATT&CK Tactics detected by this example.").t() + "\" class=\"contentstooltipcontainer mitre_tactic_displayElements\">" + mitre[i] + "</div > " //StyleChange
                    }
                }
                mitreText += "</div>"
            }

            var mitreTechniqueText = ""
            if (typeof showcaseSettings.mitre_technique_display != "undefined" && showcaseSettings.mitre_technique_display != "" && showcaseSettings.mitre_technique_display != "None") {
                mitreTechniqueText = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">' //StyleChange
                mitre = showcaseSettings.mitre_technique_display.split("|")
                for (var i = 0; i < mitre.length; i++) {
                    if (mitre[i] != "Other") {
                        mitreTechniqueText += "<div data-toggle=\"tooltip\" data-placement=\"top\" data-bs-original-title=\"" + _("Purple Bubbles indicate the MITRE ATT&CK Techniques detected by this example.").t() + "\" class=\"contentstooltipcontainer mitre_technique_displayElements\">" + mitre[i] + "</div > " //StyleChange
                    }
                }
                mitreTechniqueText += "</div>"
            }

            var killchainText = ""
            if (typeof showcaseSettings.killchain != "undefined" && showcaseSettings.killchain != "" && showcaseSettings.killchain != "None") {
                killchainText = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">' //StyleChange
                killchain = showcaseSettings.killchain.split("|")
                for (var i = 0; i < killchain.length; i++) {
                    if (killchain[i] != "Other") {
                        killchainText += "<div data-toggle=\"tooltip\" data-placement=\"top\" data-bs-original-title=\"" +  _("Green Bubbles indicate the Lockheed Martin Kill Chain Phases detected by this example.").t() + "\" class=\"contentstooltipcontainer killchainElements\">" + killchain[i] + "</div>" //StyleChange
                    }
                }
                killchainText += "</div>"
            }

            var cisText = ""
            if (typeof showcaseSettings.escu_cis != "undefined" && showcaseSettings.escu_cis != "") {
                cis = showcaseSettings.escu_cis.split("|")
                for (var i = 0; i < cis.length; i++) {
                    if (cis[i] != "Other") {
                        cisText += "<div class=\"cis\">" + cis[i] + "</div>" //StyleChange
                    }
                }
            }

            var nistText = ""
            if (typeof showcaseSettings.escu_nist != "undefined" && showcaseSettings.escu_nist != "") {
                nistText = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">' //StyleChange
                nist = showcaseSettings.escu_nist.split("|")
                for (var i = 0; i < nist.length; i++) {
                    if (nist[i] != "Other") {
                        nistText += "<div class=\"technology\">" + nist[i] + "</div>"
                    }
                }
                nistText += "</div>"
            }


            //var bookmarkIcon = '<i class="icon-bookmark" '
            //console.log("Incoming..", showcaseSettings.name, showcaseSettings.bookmark_status)

            var bookmarkWidget = ""
            let enabledWidget = ""


            if (typeof forSearchBuilder == "undefined" || forSearchBuilder != true) {

                if (typeof showcaseSettings.bookmark_status != "undefined") {
                    switch (showcaseSettings.bookmark_status) {
                        case "none":
                            bookmarkWidget = '<img class="bookmarkIcon" title="' + _("Bookmark this content to look up later").t() + '" data-showcase="' + showcaseSettings.name + '" src="' + Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png') + '" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' />'
                            enabledWidget = $('<img class="enabledIcon" title="' + _('Mark that the content is already enabled').t() + '" onclick="markContentEnabled(this);" data-showcase="' + showcaseSettings.name + '" src="' + Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/notenabled.png') + '"  />')
                            break;
                        case "bookmarked":
                            bookmarkWidget = '<i class="icon-bookmark" data-showcase="' + showcaseSettings.name + '" title="Bookmarked" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />'
                            break;
                        case "needData":
                            bookmarkWidget = '<i class="icon-bookmark" data-showcase="' + showcaseSettings.name + '" title="Bookmarked" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />'
                            break;
                        case "inQueue":
                            bookmarkWidget = '<i class="icon-bookmark" data-showcase="' + showcaseSettings.name + '" title="Bookmarked" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />'
                            break;
                        case "needsTuning":
                            bookmarkWidget = '<i class="icon-bookmark" data-showcase="' + showcaseSettings.name + '" title="Bookmarked" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />'
                            break;
                        case "issuesDeploying":
                            bookmarkWidget = '<i class="icon-bookmark" data-showcase="' + showcaseSettings.name + '" title="Bookmarked" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />'
                            break;
                        case "successfullyImplemented":
                            bookmarkWidget = '<i class="icon-check" data-showcase="' + showcaseSettings.name + '" title="Implemented" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />'
                            break;

                    }
                } else {
                    bookmarkWidget = '<img class="bookmarkIcon" title="' + _("Bookmark this content to look up later").t() + '" data-showcase="' + showcaseSettings.name + '" src="' + Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png') + '" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' />'
                    enabledWidget = $('<img class="enabledIcon" title="' + _('Mark that the content is already enabled').t() + '" onclick="markContentEnabled(this);" data-showcase="' + showcaseSettings.name + '" src="' + Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/notenabled.png') + '" />')

                }

                //bookmarkWidget = bookmarkIcon + ' title="' + bookmarkTitle + '" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; ' + bookmarkIconSize + ';" />'
                window.markContentEnabled = function(obj) {

                    let target = $(obj)

                    let showcaseId = $(obj).closest(".showcaseItemTile").attr("data-showcaseId")
                    let name = target.attr("data-showcase")
                        // console.log("Marking conte")
                    if (target.attr("title") == _('Mark that the content is already enabled').t()) {
                        setbookmark_status(name, showcaseId, "successfullyImplemented")
                        target.closest(".bookmarkIcons").html('<i class="icon-check" data-showcase="' + name + '" title="Implemented" onclick=\'createWishlistBox(this, "' + name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />')

                    }
                }
                window.createWishlistBox = function(obj, name) {
                    // console.log("Running with", obj, name, obj.outerHTML)
                    let showcaseId = $(obj).closest(".showcaseItemTile").attr("data-showcaseId")
                    if ($(obj).is("img")) {
                        //obj.outerHTML = '<i class="icon-bookmark" ' + obj.outerHTML.replace(/^<.*?title/, "title").replace(/font-size: \d*pt/, "font-size: 24pt")
                        //obj.outerHTML = '<i class="icon-bookmark" data-showcase="' + name + '" title="Bookmarked" onclick=\'createWishlistBox(this, "' + name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />'
                        let container = $(obj).closest(".bookmarkIcons")
                        container.html('<i class="icon-bookmark" data-showcase="' + name + '" title="Bookmarked" onclick=\'createWishlistBox(this, "' + name + '"); return false;\' style="position: absolute; top: 5px; right: 0px; height: 16pt; font-size: 24pt;" />')
                            //container.append(bookmarkWidget, enabledWidget)
                        setbookmark_status(name, showcaseId, "bookmarked")
                    } else {
                        let name = $(obj).attr("data-showcase")
                        let bookmarkWidget = $('<img class="bookmarkIcon" title="' + _("Bookmark this content to look up later").t() + '" data-showcase="' + name + '" src="' + Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/nobookmark.png') + '" onclick=\'createWishlistBox(this, "' + showcaseSettings.name + '"); return false;\' />')
                        let enabledWidget = $('<img class="enabledIcon" title="' + _('Mark that the content is already enabled').t() + '" onclick="markContentEnabled(this);" data-showcase="' + name + '" src="' + Splunk.util.make_full_url('/static/app/Splunk_Security_Essentials/images/general_images/notenabled.png') + '" />')
                        
                        let container = $(obj).closest(".bookmarkIcons")
                        container.html("")
                        container.append(bookmarkWidget, enabledWidget)
                        setbookmark_status(name, showcaseId, "none")

                    }

                }
            }
            var includeSearchAvailable = ""
            if (showcaseSettings.hasSearch.toLowerCase() == "yes") {
                includeSearchAvailable = "<div class=\"splAvailableText\">" + _("Searches Included ").t() + "</div>"
            } else if (showcaseSettings.app == "Splunk_App_for_Enterprise_Security") {
                includeSearchAvailable = "<div class=\"grayAppButton\">" + _("Try Splunk ES ").t() + "</div>"
            } else if (showcaseSettings.app == "Enterprise_Security_Content_Update") {
                includeSearchAvailable = "<div class=\"grayAppButton\">" + _("Try ES Content Update ").t() + "</div>"
            } else if (showcaseSettings.app == "Splunk_User_Behavior_Analytics") {
                includeSearchAvailable = "<div class=\"grayAppButton\">" + _("Try Splunk UBA ").t() + "</div>"
            } else if (showcaseSettings.app == "Splunk_Professional_Services") {
                includeSearchAvailable = "<div class=\"grayAppButton\">" + _("Use Splunk PS ").t() + "</div>"
            }
            if (includeSearchAvailable != "") {
                includeSearchAvailable = '<div style="width: 218px; display: block; clear: both;"  style="padding-top: 10px;">' + includeSearchAvailable + "</div>"
            }


            tagText = highlightText + includeSearchAvailable + datasourceText + mitreText + mitreTechniqueText + killchainText + cisText + nistText
            if (tagText != "") {
                tagText = "<div style=\"padding-top: 5px;\">" + tagText + "</div>"
            }

            let href = showcaseSettings.dashboard;

            if(href.indexOf("?ml_toolkit.dataset=") >= 0){
                let demoMode = false;
                for(let i = 0; i < appConfig.length; i++){
                    if(appConfig[i].param == "demoMode" && appConfig[i].value == "true"){
                        demoMode = true;
                    }
                }
                if(! demoMode){
                    // console.log("LIVEMODE: Not demo mode, let's try to swap ", showcaseSettings.name, href, showcaseSettings.examples)
                    // We should swap this.
                    if(showcaseSettings.examples){

                        for(let i = 0; i < showcaseSettings.examples.length; i++){
                            // console.log("LIVEMODE: Analyzing..",showcaseSettings.name, i, showcaseSettings.examples[i], showcaseSettings.examples[i].label,  showcaseSettings.examples[i].is_live_version, showcaseSettings.examples[i].label == "Live Data" || (showcaseSettings.examples[i].is_live_version && showcaseSettings.examples[i].is_live_version == true))
                            if(showcaseSettings.examples[i].label == "Live Data" || (showcaseSettings.examples[i].is_live_version && showcaseSettings.examples[i].is_live_version == true)){
                                // console.log("LIVEMODE: I want to swap ", showcaseSettings.name, href, showcaseSettings.examples, showcaseSettings.examples[i].name)
                                href = href.replace(/dataset=.*/, "dataset=" + showcaseSettings.examples[i].name)
                            }
                        }
                    }
                    // console.log("LIVEMODE: Final URL", showcaseSettings.name, href)
                }
            }
            var wrapperLink = $('<a></a>').attr('href', href);
            if (showcaseSettings.dashboard == "ES_Use_Case" || showcaseSettings.dashboard == "UBA_Use_Case" || showcaseSettings.dashboard == "ESCU_Use_Case" || showcaseSettings.dashboard == "PS_Use_Case")
                wrapperLink = $('<a></a>').attr('href', showcaseSettings.dashboard + "?form.needed=stage" + showcaseSettings.securityDataJourney.split("|")[0].replace("Level", "") + "&showcase=" + showcaseSettings.name);
            else if(showcaseSettings.dashboard.includes("?load")){
                wrapperLink = $('<a></a>').attr('href', "ES_Use_Case" + "?form.needed=stage" + showcaseSettings.securityDataJourney.split("|")[0].replace("Level", "") + "&showcase=" + showcaseSettings.name);
            }
            else if (showcaseSettings.hasSearch.toLowerCase() != "yes" && showcaseSettings.dashboard.indexOf("?") == -1 && showcaseSettings.dashboardOverride != "true")
                wrapperLink = $('<span></span>')
            var showcaseImageDefault = showcaseSettings.dashboard
            if (showcaseSettings.dashboard.indexOf("?") > 0) {
                showcaseImageDefault = showcaseSettings.dashboard.substr(0, showcaseSettings.dashboard.indexOf("?"))
            }

            var showcaseImage = showcaseSettings.image != null ? showcaseSettings.image : showcaseImageDefault + '.png';
            var myElement = ""

            var DescriptionText = showcaseSettings.description.replace(/<p><b>Alert.*/, "")
            if (DescriptionText.indexOf("<p>") == -1)
                DescriptionText = "<p style=\"width: 210px;\">" + DescriptionText + "</p>" //StyleChange
            else
                DescriptionText = DescriptionText.replace("<p>", "<p style=\"width: 220px;\">") //StyleChange
            DescriptionText = forSearchBuilderText + DescriptionText

            if (typeof showcaseSettings.icon == "undefined"){
                showcaseSettings.icon = Splunk.util.make_full_url('/static/app/' + showcaseSettings.app + '/images/content_thumbnails/' + showcaseImage)
            }else if (showcaseSettings.icon.indexOf("http") == 0){
                showcaseSettings.icon = showcaseSettings.icon.replace(/["'><]/g, "")
            }else if (showcaseSettings.icon.indexOf("/static/") == -1){
                showcaseSettings.icon = Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/content_thumbnails/" + showcaseSettings.icon)
            }

            var listyle = "width: 240px; height: 290px;"
            let h3Name = showcaseSettings.name;
            if (h3Name.length > 50 && !forSearchBuilder) {
                h3Name = h3Name.substr(0, 47) + "..."
                tooltipClassTitle = "tooltip"
                wrapperLink.attr('title',showcaseSettings.name).attr('data-toggle',tooltipClassTitle).attr('data-placement',"bottom")
            } 
            if (forSearchBuilder == true)
                listyle = "width: 240px; height: 320px;"
            if (typeof showcaseSettings.search_title != "undefined" && showcaseSettings.search_title!="") {
                    mappedClass = "mapped"
                    tooltipClass = "tooltip"
                    tooltipText="This content has been mapped to the local correlation search(es): <br />"+showcaseSettings.search_title.split("|").join("<br />")+""
            } else {
                mappedClass=""
                tooltipClass = ""
                tooltipText=""
            }
            myElement = $('<li class="showcaseItemTile ' + mappedClass + '" data-showcaseid="' + showcaseSettings.id + '" id="' + showcaseName + '" style="' + listyle + '"></li>').append($("<div data-toggle=\"" + tooltipClass + "\" data-placement=\"top\" title=\"" + tooltipText + "\" class=\"contentstile\"></div>").append(
                $("<div style=\"display: block; width: 218px; position: relative; \"></div>").append($('<div class="bookmarkIcons">').append($(bookmarkWidget), enabledWidget), wrapperLink.clone().append(
                        $('<img style="position: absolute; top:3px; left: 3px; height: 30px; width: 30px;" class="showcase-list-item-image" />').attr('src', showcaseSettings.icon)),
                    $('<div class="showcase-list-item-title"></div>').append(
                        wrapperLink.clone().append(
                            '  <h3>' + h3Name + '</h3>'
                        )
                    )
                ),
                $('<div style="width: 218px; margin-top: 53px; " class="showcase-list-item-content"></div>').append(DescriptionText, exampleText, exampleList)
            ))

            myElement.append(tagText)
                //     console.log("Got an HTML for ", showcaseSettings, myElement.html())
            if (forSearchBuilder == true)
                return myElement.html()
            else
                return myElement

            //window.ShowcaseInfo.summaries[ListOfShowcases[i]]['HTML'] = myElement

            //return "<div class=\"relatedUseCase\"><a href=\"" + summary.dashboard +"\">" + summary.name + "</a></div>"
        }
    };
});