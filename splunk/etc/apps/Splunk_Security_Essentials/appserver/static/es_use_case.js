"use strict";


require([
    "jquery",
    "underscore",
    "module",
    "json!" + $C['SPLUNKD_PATH'] + "/services/pullJSON?config=data_inventory&locale=" + window.localeString,
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "splunkjs/mvc/simplexml",
    "splunkjs/mvc/searchmanager",
    "splunkjs/ready!",
    Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/BuildTile.js"),
],
    function ($,
        _,
        module,
        data_inventory,
        mvc,
        utils,
        TokenUtils,
        DashboardController,
        SearchManager,
        Ready,
        BuildTile
    ) {

        var DoImageSubtitles = function (numLoops) {
            if (typeof numLoops == "undefined")
                numLoops = 1
            var doAnotherLoop = false
            // console.log("Starting the Subtitle..")
            $(".screenshot").each(function (count, img) {
                // console.log("got a subtitle", img)

                if (typeof $(img).css("width") != "undefined" && parseInt($(img).css("width").replace("px")) > 10 && typeof $(img).attr("processed") == "undefined") {
                    var width = "width: " + $(img).css("width")

                    var myTitle = ""
                    if (typeof $(img).attr("title") != "undefined" && $(img).attr("title") != "") {
                        myTitle = "<p style=\"color: gray; display: inline-block; clear:both;" + width + "\"><center><i>" + $(img).attr("title") + "</i></center>"

                    }
                    $(img).attr("processed", "true")
                    if (typeof $(img).attr("zoomin") != "undefined" && $(img).attr("zoomin") != "") {
                        // console.log("Handling subtitle zoom...", width, $(img).attr("zoomin"), $(img).attr("setWidth"), (typeof $(img).attr("zoomin") != "undefined" && $(img).attr("zoomin") != ""))
                        if (typeof $(img).attr("setwidth") != "undefined" && parseInt($(img).css("width").replace("px")) > parseInt($(img).attr("setwidth"))) {
                            width = "width: " + $(img).attr("setwidth") + "px"
                        }
                        $(img).replaceWith("<div style=\"display: inline-block; margin:10px; border: 1px solid lightgray;" + width + "\"><a href=\"" + $(img).attr("src") + "\" target=\"_blank\">" + img.outerHTML + "</a>" + myTitle + "</div>")
                    } else {
                        ($(img)).replaceWith("<div style=\"display: block; margin:10px; border: 1px solid lightgray;" + width + "\">" + img.outerHTML + myTitle + "</div>")
                    }

                } else {
                    doAnotherLoop = true
                    // console.log("Analyzing image: ", $(img).css("width"), $(img).attr("processed"), $(img))
                }
            })
            if (doAnotherLoop && numLoops < 30) {
                numLoops++;
                setTimeout(function () { DoImageSubtitles(numLoops) }, 500)
            }
        }
        window.DoImageSubtitles = DoImageSubtitles

        $(".splunk-linklist-choices").css("width", "800px")
        $("#input1").css("width", "800px")
        $(".splunk-choice-input").css("padding-bottom", "0")

        let ShowcaseInfo = {}
        $.ajax({ url: $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString, async: false, success: function (returneddata) { ShowcaseInfo = returneddata } });

        // console.log("Here's my showcaseinfo", ShowcaseInfo)
        var unsubmittedTokens = splunkjs.mvc.Components.getInstance('default');
        var submittedTokens = splunkjs.mvc.Components.getInstance('submitted');
        var requestedShowcase = submittedTokens.get("showcase")
        // console.log("Comparing against", requestedShowcase)
        var chosenSummary
        for (var SummaryName in ShowcaseInfo['summaries']) {
            if (ShowcaseInfo['summaries'][SummaryName].name == requestedShowcase) {
                chosenSummary = ShowcaseInfo['summaries'][SummaryName]
                $("#usecasecontent").html(BuildTile.build_tile(ShowcaseInfo['summaries'][SummaryName], true).replace(/width: 21[80]px;*/g, ""))

                unsubmittedTokens.set("gotusecase", "I got it!");

                if (chosenSummary.soarPlaybooks) {
                    let Template = "<table id=\"SHORTNAME_table\" class=\"dvexpand table table-chrome\"><thead><tr><th class=\"expands\"><h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\" onclick='$(\"#SHORTNAME-tbody\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");  $(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;'>&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE <div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a></h2><div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: none\" id=\"SHORTNAME-tbody\"></tbody></table>"
                    let mySOARBlock = $("<div>").append(Template.replace(/SHORTNAME/g, "soarPlaybooks").replace("TITLE", "SOAR Playbooks") + "</td></tr></table>")

                    let soarPlaybookText = ""

                    //soarPlaybookText = "<h2>" + _("SOAR Playbooks").t() + "</h2>"
                    var tiles = $('<ul class="showcase-list"></ul>')
                    for (var i = 0; i < chosenSummary.soarPlaybooks.length; i++) {
                        if (typeof ShowcaseInfo['summaries'][chosenSummary.soarPlaybooks[i]] != "undefined")
                            tiles.append($("<li style=\"width: 230px; height: 320px\"></li>").append(BuildTile.build_tile(ShowcaseInfo['summaries'][chosenSummary.soarPlaybooks[i]], true)))

                    }
                    soarPlaybookText += '<ul class="showcase-list">' + tiles.html() + '</ul>'


                    mySOARBlock.find("tbody").append($("<tr>").append($("<td>").append(soarPlaybookText)) )
                    $("#related_content").append(mySOARBlock)
                    splunkjs.mvc.Components.getInstance("default").set("gotrelatedcontent", "yeaaah")
                    splunkjs.mvc.Components.getInstance("submitted").set("gotrelatedcontent", "yeaaah")
                }
                if (ShowcaseInfo['summaries'][SummaryName].app == "Splunk_App_for_Enterprise_Security") {
                    // console.log(ShowcaseInfo['summaries'][SummaryName].app);
                    var sm = new SearchManager({
                        "id": "check_for_ES_Installed",
                        "latest_time": "now",
                        "status_buckets": 0,
                        "cancelOnUnload": true,
                        "earliest_time": "-24h@h",
                        "sample_ratio": null,
                        "search": "| rest splunk_server=local /services/apps/local | search disabled=0 title=\"SplunkEnterpriseSecuritySuite\" | stats count | appendcols [| rest splunk_server=local \"/services/saved/searches\" | search action.correlationsearch.label=\"" + chosenSummary.name + "\" | table title]",
                        "app": utils.getCurrentApp(),
                        "auto_cancel": 90,
                        "preview": true,
                        "tokenDependencies": {},
                        "runWhenTimeIsUndefined": false
                    }, { tokens: true, tokenNamespace: "submitted" });

                    smResults = sm.data('results', { output_mode: 'json', count: 0 });

                    sm.on('search:done', function (properties) {
                        // console.log("Got Results from ES App Search", properties);
                        if (sm.attributes.data.resultCount == 0) {
                            return;
                        }
                        smResults.on("data", function (properties) {
                            var data = smResults.data().results;
                            if (typeof data[0] != "undefined" && typeof data[0].count != "undefined" && data[0].count > 0) {
                                // console.log("They have ES Installed", chosenSummary)
                                var launchLink = $('<button style="float: right;" class="btn btn-primary">Open in ES <i class="icon-external" /></button>').click(function () {
                                    window.open(
                                        Splunk.util.make_full_url('/app/SplunkEnterpriseSecuritySuite/ess_content_management?textFilter=' + data[0].title),
                                        '_blank'
                                    );
                                })
                                $("#content3 .html").prepend(launchLink)
                            }
                        });
                    });
                }

                if (ShowcaseInfo['summaries'][SummaryName].app == "Splunk_User_Behavior_Analytics") {

                    // load all showcaseinfo into our json object
                    /*let ShowcaseInfo = {}
                    $.ajax({
                        url: $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString, async: false,
                        success: function (returneddata) { ShowcaseInfo = returneddata }
                    });*/

                    var unsubmittedTokens = splunkjs.mvc.Components.getInstance('default');
                    var submittedTokens = splunkjs.mvc.Components.getInstance('submitted');
                    // console.log(ShowcaseInfo);

                    // name of the 1st level object selected 
                    var requestedShowcase = submittedTokens.get("showcase");

                    // name and details of the 1st level object selected stored in chosenSummary
                    var chosenSummary;
                    for (var SummaryName in ShowcaseInfo['summaries']) {
                        if (ShowcaseInfo['summaries'][SummaryName].name == requestedShowcase) {
                            chosenSummary = ShowcaseInfo['summaries'][SummaryName];
                        }
                    }

                    // console.log(chosenSummary);
                    // this will store either threat or anomaly ids
                    let anomalyThreatIds = undefined;
                    // gives a name to our table based on what we're looking at
                    let tableName = undefined;
                    let tableClass = undefined;
                    // description of the table. also canges whether threat/anomaly
                    let tableDescription = undefined;
                    let tableDetections;

                    if (chosenSummary['anomalies']) {
                        // first lets check if there are contributing anomalies
                        // this is an easy check since we can look at chosenSummary

                        anomalyThreatIds = chosenSummary['anomalies'];
                        anomalyThreatIds.sort(); // make sure the id's are arranged alphabetically
                        tableName = "Anomaly";
                        tableClass = "uba-anomalies"
                        tableDescription = requestedShowcase + " is made up of the following <b>anomalies</b>: <br>";

                    } else if (!chosenSummary['anomalies']) {

                        tableName = "Threat";
                        tableClass = "uba-threats"
                        tableDescription = requestedShowcase + _(" contributes to the following <b>threats</b>: ").t() + " <br>";
                        // get the internal id that we can use to search threats/anomalies
                        // e.x. Blacklisted_Application
                        let internal_id = chosenSummary['internal_id'];

                        // now that we have that we can look for the corresponding AT 
                        // by the internal_id through ShowcaseInfo
                        let ubaID;
                        for (let i in ShowcaseInfo['summaries']) {
                            if (ShowcaseInfo['summaries'][i].internal_id == internal_id) {
                                // found it
                                ubaID = ShowcaseInfo['summaries'][i].id;
                            }
                        }

                        // this gets the details based on the item selected
                        let ubaIDdetails = ShowcaseInfo['summaries'][ubaID];
                        anomalyThreatIds = ubaIDdetails['contributes_to_threats'];

                        // get information about the detections
                        detections = ubaIDdetails['detections'];

                        // generate the threats table
			            tableDetections = '<html><br><table cellpadding="5" border="1" class="table uba-detections table-striped table-hover">';
                        tableDetections += '<p><br>' + requestedShowcase + ' contains the following <b>detections</b>: </p>';
                        tableDetections += '<tr><th>Detection</th><th>Description</th><th>Data Source</th></tr>';
                        
			            for (let i = 0; i < detections.length; i++) {
			    
                            // get the data source for the detection then split on the - to get the first half
                            let detectionDataSource = detections[i]['data_source'][0];
                            detectionDataSource = detectionDataSource.substr(0, detectionDataSource.indexOf('-'));
			    
                            tableDetections += "<tr><td>" + detections[i]['name'] + "</td><td>" +
                                detections[i]['description'] + "</td>";
			    
                            // get the clean name for the data sources looking it up from data_inventory_sources
                            // if for some reason it's not in there fall back to the original name
                            if (detectionDataSource in data_inventory) {
                                tableDetections += "<td>" + data_inventory[detectionDataSource]["name"] + "</td></tr>";
                            } else {
                                tableDetections += "<td>" + detections[i]["data_source"] + "</td></tr>";
                            }
                        }
			
                        // append the final closing tags on the table
                        tableDetections += "</table></html>";
                    }// end anomalies

                    // now that we have an array of ids of either threats or anomalies we can generate the table
                    let tableData = '<p>' + tableDescription + '</p>';
                    tableData += '<table cellpadding="5" border="1" class="table ' + tableClass + ' table-striped table-hover"><tr><th>' +
                    tableName + '</th>';
                    tableData += '<th>' + _('# of Detections').t() + '</th>';
                    tableData += '<th>' + _('Description').t() + '</th></tr>';

                    for (let i = 0; i < anomalyThreatIds.length; i++) {
                        // get the internally referenced id
                        let name = anomalyThreatIds[i];

                        // this gets used for generating the links in the table
                        let fullName = ShowcaseInfo['summaries'][name]['name'];

                        // get a count of threats/anomalies contributed to so we know if we should click through
                        let contributesCount;
                        if (ShowcaseInfo['summaries'][name]['contributes_to_threats']) {
                            contributesCount = ShowcaseInfo['summaries'][name]['contributes_to_threats'].length
                        } else {
                            contributesCount = ShowcaseInfo['summaries'][name]['anomalies'].length
                        }

                        tableData += '<tr><td><a href="/en-US/app/Splunk_Security_Essentials/UBA_Use_Case?form.needed=stage6&showcase=' + fullName + '">' + fullName + '</a></td>';
                        tableData += '<td>' + contributesCount + '</td>';
                        //tableData += '<td>' + ShowcaseInfo['summaries'][name]['name'] + '</td>';
                        tableData += '<td>' + ShowcaseInfo['summaries'][name]['long_description'] + '</td>';
                    }

                    // this is a final test to see if there are no threats contributed to. 
                    // can add this check above to avoid creating an empty table
                    if (chosenSummary["contributes_to_threats"] && chosenSummary["contributes_to_threats"].length == 0) {
                        tableData = requestedShowcase + _(" does not contribute to any threats.").t();
                    }
                    // add the detections to the  if there were any
                    if (tableDetections) {
                        tableData += tableDetections;
                    }

                    // now that we've built our table add it to the template
                    unsubmittedTokens.set("gotusecasedetails", "I got it!");
                    $("#usecasedetail").html(tableData);
                } else if (ShowcaseInfo['summaries'][SummaryName].app == "Enterprise_Security_Content_Update") {
                    
                    let ESInstalled = $.Deferred();
		            var sm = new SearchManager({
                        "id": "check_for_ESCU_Installed",
                        "latest_time": "now",
                        "status_buckets": 0,
                        "cancelOnUnload": true,
                        "earliest_time": "-24h@h",
                        "sample_ratio": null,
                        "search": "| rest splunk_server=local /services/apps/local | search disabled=0 title=DA-ESS-ContentUpdate OR title=SplunkEnterpriseSecuritySuite | eval row=1 | chart values(version) over row by title | rename DA-ESS-ContentUpdate as ESCU SplunkEnterpriseSecuritySuite as ES",
                        "app": utils.getCurrentApp(),
                        "auto_cancel": 90,
                        "preview": true,
                        "tokenDependencies": {},
                        "runWhenTimeIsUndefined": false
                    }, { tokens: true, tokenNamespace: "submitted" });

                    smResults = sm.data('results', { output_mode: 'json', count: 0 });

                    sm.on('search:done', function (properties) {
                        // console.log("Got Results from ESCU App Search", properties);
                        if (sm.attributes.data.resultCount == 0) {
                            return;
                        }
                        smResults.on("data", function (properties) {
                            var data = smResults.data().results;
                            if (typeof data[0] != "undefined" && typeof data[0].ESCU != "undefined") {
                                let isESInstalled = false;
				                if (typeof data[0].ES != "undefined" && /^([6-9]|5\.[2-9])/.test(data[0].ES) == 0) {
                                    isESInstalled = true;
                                }
                                ESInstalled.resolve(isESInstalled);
                            }
                        })
                    })

                    // get showcase info and create our variables
                    var requestedShowcase = submittedTokens.get("showcase");
                    let storyID, storyDetails;

                    // use these variables to pull out individual pieces of information from the content
                    let detectionSearch, detectionName, detectionHelp, detectionMacros;
                    
                    // get a list of stories
                    let stories = ShowcaseInfo['summaries'];

                    // loop through showcase info based on the ESCU name to get it's story id
                    for (let i in stories) {
                        if (requestedShowcase == stories[i]["name"]) {
                            // this may also be internal_id?
                            storyID = stories[i]["story"];
                            
                            detectionSearch = stories[i]["search"];
                            detectionName = stories[i]["name"];
                            detectionHelp = stories[i]["help"];
                            detectionMacros = stories[i]["macros"];
                        }
                    }

                    // split the id's into elements
                    // modified for now since we don't always have a storyID
                    if(storyID) {
                        storyID = storyID.split("|");
                    }

                    // after getting the id of the story get the details of the story
                    // console.log(ShowcaseInfo.escu_stories["4e692b96-de2d-4bd1-9105-37e2368a8db1"]);
                    if(storyID) {
                    for (let i = 0; i < storyID.length; i++) {
                        storyDetails = ShowcaseInfo.escu_stories[storyID[i]];
                        storyName = storyDetails["name"].replace(/"/g, "\\\"")
                    }
                }

                    // this is for our detailed information from security research
                    if(detectionSearch) {
                        let tableData = "<p>" + _("Additional help and search below:").t() + "</p>";

                            // this bolds certain words in the search to make it easier to read
                            let searchWords = ["eval", "inputlookup", "stats", "outputlookup", "table", "rename", "where", "tstats"];
                            for(i in searchWords) {
                                detectionSearch = detectionSearch.split(searchWords[i]).join("<i><b>" + searchWords[i] + "</b></i>");
                            }
                            tableData += '<table id=\"' + "SEARCH" + 'SHORTNAME_table\" class=\"dvexpand escu-analytic-stories table table-chrome\">'
                            tableData += '<thead><tr><th colspan=\"NUMCOLUMNS\" class=\"expands\">';
                            tableData += '<h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom:0;\">';
                            tableData += '<a href=\"#\" class=\"dropdowntext\" style=\"color: black;\" onclick=\'$(\"#' + "SEARCH" + 'SHORTNAME-tbody\").toggle(); if($(\"#' + "SEARCH" + 'SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#' + "SEARCH" + 'SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#' + "SEARCH" + 'SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");$(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;\'>  <i id=\"' + "SEARCH" + 'SHORTNAME_arrow\" class=\"icon-chevron-down\">';
                            tableData += '</i> ' + "Search" + '<div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a>';
                            tableData += '</h2><div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: table-row-group\" id=\"' + "SEARCH" + 'SHORTNAME-tbody\">';
                            tableData += "<tr><td><p>" + detectionHelp + "</p>";

                            tableData += "</td></tr>";

                            // breaks the search by pipe into new lines to make it more readable
                            tableData += "<tr><td><p>" + detectionSearch.split("|").join("<br><b>|</b>") + "</tr></td></p>"
                            
                        tableData += "</tbody></table>";

                        unsubmittedTokens.set("gotusecasedetails", "I got it!");
                        $("#usecasedetails").html(tableData);
                    }

                    // adding a check here also since we don't always have a storyID
                    if(storyID){
                    let tableData = "<p>" + _("This use case is made up of the following analytic stories:").t() + "</p>";
                    for (let i = 0; i < storyID.length; i++) {
                        storyDetails = ShowcaseInfo.escu_stories[storyID[i]];
                        // table id comes from the loop counter
                        tableData += '<table id=\"' + i.toString() + 'SHORTNAME_table\" class=\"dvexpand escu-analytic-stories table table-chrome\">'
                        tableData += '<thead><tr><th colspan=\"NUMCOLUMNS\" class=\"expands\">';
                        tableData += '<h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom:0;\">';
                        tableData += '<a href=\"#\" class=\"dropdowntext\" style=\"color: black;\" onclick=\'$(\"#' + i.toString() + 'SHORTNAME-tbody\").toggle(); if($(\"#' + i.toString() + 'SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#' + i.toString() + 'SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#' + i.toString() + 'SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");$(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;\'>  <i id=\"' + i.toString() + 'SHORTNAME_arrow\" class=\"icon-chevron-right\">';
                        tableData += '</i> ' + storyDetails["name"] + '<div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a>';
                        tableData += '</h2><div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: none\" id=\"' + i.toString() + 'SHORTNAME-tbody\">';
                        tableData += "<tr><td><p>" + storyDetails["narrative"] + "</p>";
                        if(typeof storyName != "undefined") {
                            tableData += '<div data-story-name="' + storyName + '" class="escu_button"></div>';
                        }
                        // these next four blocks drive the detections/response/baseline objects
                        if(storyDetails["investigations"].length != 0) {
                            tableData += "<p>This story is made up of the following investigations: </p><ol>";
                            for(let j = 0; j < storyDetails["investigations"].length; j++) {
                            tableData += "<li>" + storyDetails["investigations"][j] + "</li>";
                            }
                            tableData += "</ol>"
                        }

                        if(storyDetails["support"].length != 0) {
                            tableData += "<br><p>This story is supported with the following baseline searches: </p><ol>";

                            for(let k = 0; k < storyDetails["support"].length; k++) {
                            tableData += "<li>" + storyDetails["support"][k] + "</li>";
                            }
                            tableData += "</ol>";
                        }
                        // not provided in the content any more
                        //if(storyDetails["detections"].length != 0) {
                        //tableData += "<br><p>This story is supported by the following detections: </p><ol>";
                        //    for(let m = 0; m < storyDetails["detections"].length; m++) {
                        //    let detectionName = storyDetails["detections"][m];
                        //    tableData += "<li>" +  ShowcaseInfo["summaries"][detectionName]["name"] + "</li>";
                        //    }
                        //    tableData += "</ol>";
                        //}

                        if(storyDetails["responses"].length != 0) {
                            tableData += "<br><p>This story has the following responses: </p><ol>";
                            for(let n = 0; n < storyDetails["responses"].length; n++) {
                            tableData += "<li>" + storyDetails["responses"][n] + "</li>";
                            }
                            tableData += "</ol>";
                        }
                        
                        tableData += "</td></tr>";
                    }

                    tableData += "</tbody></table>";
                
                    // append to the template
                    unsubmittedTokens.set("gotusecasestory", "I got it!");
                    $("#usecasestory").html(tableData);
                    }
                    $.when(ESInstalled).then(function(isESInstalled){
                        $(".escu_button").each(function(num, obj){
                            let div = $(obj);
                            let storyName = div.attr("data-story-name");

                            let link = '/app/DA-ESS-ContentUpdate/analytic_story_details?form.analytic_story_name=' + encodeURIComponent(storyName);
                            if (localStorage["isESInstalled"] == "true") {
                                link = '/app/SplunkEnterpriseSecuritySuite/ess_analytic_story_details?analytic_story=' + encodeURIComponent(storyName);
                            }
                            div.html( $('<a style="float: right;" target="_blank" class="btn btn-primary">Open in ESCU <i class="icon-external" /></button>').attr("href", link) )
                            
                        })
                    })
		    
                }

                if (typeof ShowcaseInfo['summaries'][SummaryName].images != "undefined" && ShowcaseInfo['summaries'][SummaryName].images != "") {


                    var images = ""
                    for (var i = 0; i < ShowcaseInfo['summaries'][SummaryName].images.length; i++) {
                        images += "<img class=\"screenshot\" setwidth=\"650\" zoomin=\"true\" src=\"" + ShowcaseInfo['summaries'][SummaryName].images[i].path + "\" title=\"" + ShowcaseInfo['summaries'][SummaryName].images[i].label + "\" />"
                    }

                    unsubmittedTokens.set("gotusecasescreenshots", "I got it!");
                    $("#usecasescreenshots").html(images)
                    setTimeout(function () {
                        DoImageSubtitles()
                    }, 300)


                }


                submittedTokens.set(unsubmittedTokens.toJSON());
                setTimeout(function () {
                    $("#panel1").css("width", "60%")
                    $("#panel2").css("width", "40%")
                }, 300)

            }
        }

    }
);
