// console.log("Starting Min!")

// require([
//     "underscore"
// ], function(
//     _) {
//         let modal = require()
// console.log("Loaded Min!")
//     })


// console.log("Starting!")

// require([
//     "underscore",
//     'app/Splunk_Security_Essentials/components/controls/Modal'
// ], function(
//     _,
//     Modal) {
// console.log("Loaded!")
//     })
let pathToModal = 'components/controls/Modal'
// let pagesRequiringOtherVersion = ["contents"]
// if(pagesRequiringOtherVersion.indexOf(window.location.pathname.replace(/^.*\//, "")) >= 0){
//     pathToModal = 'app/Splunk_Security_Essentials/components/controls/Modal'
// }
$(".dashboard-export-container").hide()
require([
    "underscore",
    //'app/Splunk_Security_Essentials/components/controls/Modal',
    // 'components/controls/Modal',
    'vendor/jquery.highlight/highlight.pack',
    pathToModal,
    'json!' + $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names',
    Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/data/common_data_objects.js")
], function(
    _,
    hljs,
    Modal,
    bookmark_names) {

    function LaunchExportDialog(ShowcaseInfo, isFiltered) {
        let myModal = new Modal("exportModal", {
            title: _("Export Content").t(),
            backdrop: 'static',
            keyboard: false,
            destroyOnHide: true,
            type: "wide"
        }, $);
        let areBookmarksIncluded = false;
        window.requested_export_ShowcaseInfo = ShowcaseInfo
        for (let summaryName in ShowcaseInfo['summaries']) {
            if (ShowcaseInfo['summaries'][summaryName]['bookmark_status'] && ShowcaseInfo['summaries'][summaryName]['bookmark_status'] != "none") {
                areBookmarksIncluded = true;
                break;
            }
            if (ShowcaseInfo['summaries'][summaryName]['bookmark_notes'] && ShowcaseInfo['summaries'][summaryName]['bookmark_notes'] != "") {
                areBookmarksIncluded = true;
                break;
            }
        }
        myModal.body
            .append(
                $("<p>").text(Splunk.util.sprintf(_("You are currently viewing %s items. Select your desired export method below.").t(), Object.keys(ShowcaseInfo.summaries).length)),
                $("<div style=\"display: table; border-collapse:separate; border-spacing: 10px;\">").append(
                    $('<div class="export-button btn">XLSX</div>').click(function() {
                        require(["components/controls/buildLilyXLSX"], function() {
                            generateXLSX(ShowcaseInfo, isFiltered, areBookmarksIncluded)
                            $("#exportModal").modal("hide")
                        })
                    }),
                    $('<div class="export-button">CSV</div>').click(function() {
                        ExportCSV(ShowcaseInfo, areBookmarksIncluded)
                        $("#exportModal").modal("hide")
                    }),
                    $('<div class="export-button">DOC</div>').click(function() {
                        // code to generate doc goes here
                        ExportDOC(ShowcaseInfo, areBookmarksIncluded)
                        $("#exportModal").modal("hide")
                    }),
                    $('<div class="export-button ">Snapshot JSON</div>').click(function() {
                        require([Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/ManageSnapshots.js")],
                            function() {
                                manageContentModal()
                                $("#exportModal").modal("hide")
                            })
                    }),
                    $('<div class="export-button">Print-To-PDF</div>').click(function() {

                        $("#exportModal").modal("hide")
                        require(["components/controls/Modal", "underscore"],
                            function(Modal, _) {
                                let myModal = new Modal("pdfExportChoices", {
                                    title: _("Choose Content to Include").t(),
                                    backdrop: 'static',
                                    keyboard: false,
                                    destroyOnHide: true
                                }, $);
                                let defaults = {
                                    "bookmark": "checked",
                                    "spl": "checked",
                                    "demoscreenshots": "checked",
                                    "color": "checked"
                                }
                                if (localStorage[localStoragePreface + "-print-to-pdf-export"]) {
                                    temp = JSON.parse(localStorage[localStoragePreface + "-print-to-pdf-export"])
                                    for (let key in temp) {
                                        if (temp[key]) {
                                            defaults[key] = "checked"
                                        } else {
                                            defaults[key] = ""
                                        }
                                    }
                                }
                                myModal.body
                                    .append($("<p>" + _("In addition to the key default descriptions and tags, choose additional content you'd like to include in the export:").t() + "</p>"),
                                        //$("<div>").append($('<input type="checkbox" id="checkbox_descriptions" checked/>'), $('<label style="padding-left: 5px; display: inline;" for="checkbox_descriptions">Descriptions</label>')),
                                        $("<div>").append($('<input type="checkbox" id="checkbox_bookmark" ' + defaults['bookmark'] + '/>'), $('<label style="padding-left: 5px; display: inline;" for="checkbox_bookmark">Bookmark Details</label>')),
                                        $("<div>").append($('<input type="checkbox" id="checkbox_spl" ' + defaults['spl'] + '/>'), $('<label style="padding-left: 5px; display: inline;" for="checkbox_spl">SPL (where available)</label>')),
                                        $("<div>").append($('<input type="checkbox" id="checkbox_demoscreenshots" ' + defaults['demoscreenshots'] + '/>'), $('<label style="padding-left: 5px; display: inline;" for="checkbox_demoscreenshots">Demo Screenshots (where available)</label>')),
                                        $("<div>").append($('<input type="checkbox" id="checkbox_color" ' + defaults['color'] + '/>'), $('<label style="padding-left: 5px; display: inline;" for="checkbox_color">Enhance Color (uncheck for black-and-white printing)</label>')),
                                        $("<br/>"),
                                        $("<p>").text(_("Note: printed or PDF-exported documents look best when generated with Google Chrome.").t()))
                                myModal.footer.append($('<button>').attr({
                                    type: 'button',
                                }).addClass('btn ').text(_('Generate').t()).on('click', function() {
                                    let configs = {
                                        // "descriptions": $("#checkbox_descriptions").is(":checked"),
                                        "bookmark": $("#checkbox_bookmark").is(":checked"),
                                        "spl": $("#checkbox_spl").is(":checked"),
                                        "demoscreenshots": $("#checkbox_demoscreenshots").is(":checked"),
                                        "color": $("#checkbox_color").is(":checked")
                                    }
                                    if (configs["color"]) {
                                        $('head').append('<link id="export_print_colors_css" rel="stylesheet" href="' + Splunk.util.make_full_url("/static/app/" + splunkjs.mvc.Components.getInstance("env").toJSON()['app'] + "/style/export_color_boxes.css") + '" type="text/css" />');
                                    } else {
                                        if ($("#export_print_colors_css").length > 0) {
                                            $("#export_print_colors_css").remove()
                                        }
                                    $('[data-bs-dismiss=modal').click()
                                    }
                                    localStorage[localStoragePreface + "-print-to-pdf-export"] = JSON.stringify(configs)
                                    require([Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/ProcessSummaryUI.js")],
                                        function(ProcessSummaryUI) {
                                            $("#exportModal").modal("hide")
                                            let myModal = new Modal("loadingModal", {
                                                title: _("Processing...").t(),
                                                backdrop: 'static',
                                                keyboard: false,
                                                destroyOnHide: true,
                                                type: "wide"
                                            }, $);

                                            myModal.body
                                                .append($('<div style="width: 100%; height: 200px; text-align: center; position: relative;">').html(
                                                    $('<img src="' + Splunk.util.make_full_url("/static//app/Splunk_Security_Essentials/images/general_images/loader.gif") + '" style="display: flex; align-items: center; justify-content: center; text-align: center;" />').attr("title", _("Processing...").t())
                                                ))
                                            myModal.footer.append($('<button>').attr({
                                                type: 'button',
                                                'data-dismiss': 'modal',
                                                'data-bs-dismiss': 'modal'
                                            }).addClass('btn ').text(_('Wait').t()).on('click', function() {}))
                                            myModal.show(); // Launch it!
                                            let deferral = CreatePrintableDisplay(ProcessSummaryUI, ShowcaseInfo, isFiltered, configs)
                                            $.when(deferral).then(function() {
                                                setTimeout(function() {
                                                    $("#loadingModal").modal("hide")
                                                    window.print();
                                                }, 5000)
                                            })
                                        })

                                }))
                                myModal.show(); // Launch it!
                            })



                    })
                ) //,
                //$("<p>").text(_("These exports are intended for reporting purposes. If you would like to backup your system, please use the app configuration menu.").t())
            );


        myModal.footer.append($('<button>').attr({
            type: 'button',
            'data-dismiss': 'modal',
            'data-bs-dismiss': 'modal'
        }).addClass('btn ').text(_('Close').t()).on('click', function() {}))
        myModal.show(); // Launch it!
    }

    function ExportDOC(ShowcaseInfo, areBookmarksIncluded) {
        // get the keys and values from showcaseinfo
        let showcaseKeys = Object.keys(ShowcaseInfo['summaries']);
        let showcaseValues = Object.values(ShowcaseInfo['summaries']);

        // get the current date for the report
        let today = new Date();
        let fullDateReport = today.getDate() + " " + today.toLocaleString('default', {
            month: 'long'
        }) + " " + today.getFullYear();

        
        const headerList = bookmark_names.map(bookmark_name => bookmark_name.name);

        // leave the newline characters exactly as is for MS Word
        let docString = `Mime-Version: 1.0
        \nContent-Base: ${window.location.href}
        \nContent-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"
        \n\n--NEXT.ITEM-BOUNDARY
        \nContent-Type: text/html; charset="utf-8"
        Content-Location: ${window.location.href}
        \n\n<!DOCTYPE html>\n<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        \n<style>table, th, td { border: 1px solid black;} table {border-collapse: collapse}</style>
        </head><body>
        <br><br><br><br><br>
        <h1>Splunk Security Essentials Content Export</h1>
        <h3>Prepared on ${fullDateReport} via the Manage Bookmarks dashboard</h3>
        <p>This content was exported via the free app Splunk Security Essentials. In addition to providing 120+ free detections (with full SPL and lots of useable documentation to help users learn Splunk for Security), Splunk Security Essentials also helps you navigate the world of Splunk for Security, mapping all content in Splunk Security Essentials, Splunk Enterprise Security and Enterprise Security Content Update, and Splunk User Behavior Analytics to a common set of metadata including MITRE ATT&CK Tactics and Techniques, and Kill Chain phases (all of which can be integrated into Splunk Enterprise Security). It will also help you track your own maturity by making it easy to export reports like this (and via report-ready PDF, DOCX, or CSV) to show what have your content is active. Find Splunk Security Essentials on Splunkbase.</p>
        <br><br><br><br><br>
        <h3>Security Use Case's By Status</h3>
        <table id='sse_table'><tr><th>Bookmarked</th>`
        
        const bookmark_name_headers = bookmark_names.map(bookmark_name => `<th>${bookmark_name.name}</th>`);
        docString += bookmark_name_headers;

        docString += "</tr>";

        // add an check box to have this be an optional table
        // generate a table like the one that is displayed on the manage bookmarks page
        for (const i of showcaseValues) {
            // default list of status options
            //let headerList = ["Bookmarked", "Waiting on Data", "Ready for Deployment", "Implementation Issues", "Needs Tuning", "Successfully Implemented", "Custom"];
            // iterate through our list of values. if the values matches what's in showcase info add an X
            let tableLoop = "<tr><td>" + i.name + "</td>";
            for (const j of headerList) {
                if (i.bookmark_status_display == j) {
                    tableLoop += "<td>X</td>";
                } else {
                    tableLoop += "<td></td>";
                }
            }
            tableLoop += "</tr>";
            //console.log(tableLoop);
            docString += tableLoop;
        }
        // generate the table that lists the searches by journey
        let journeyArray = ["Stage_1", "Stage_2", "Stage_3", "Stage_4", "Stage_5", "Stage_6"];

        docString += `</table><br><br><br><br><br><h2>Security Use Cases By Data Journey</h2>
        <table><tr><th>Journey</th><th>Name</th><th>Description</th><th>Data Source</th><th>Category</th><th>Description</th></tr>`;

        for (i = 0; i < journeyArray.length; i++) {
            for (j = 0; j < showcaseValues.length; j++) {
                if (showcaseValues[j]["journey"] == journeyArray[i]) {
                    docString += "<tr>";
                    docString += "<td>" + showcaseValues[j]["journey"] + "</td><td>" + showcaseValues[j]["name"] + "</td><td>" + showcaseValues[j]["description"] + "</td><td>" + showcaseValues[j]["datasource"] + "</td><td>" + showcaseValues[j]["category"] + "</td><td>" + showcaseValues[j]["help"] + "</td>";
                    docString += "</tr>";
                }
            }
        }
        docString += `</table><br><br><br><br><br><h3>Detailed Security Use Case Information</h3>`;

        // generate a detailed table with use cases by status

        for (const i of showcaseValues) {

            // formats data to remove pipe characters from data
            let newChar = ", ";
            let formattedCategory = i.category;
            let formattedUseCase = i.usecase;
            formattedCategory = formattedCategory.split("|").join(newChar);
            formattedUseCase = formattedUseCase.split("|").join(newChar);
            let journeyStage = i?.securityDataJourney || i?.journey;
            journeyStage = journeyStage?.replace(/Stage/g,"Level").replace(/5/g,"2").replace(/6/g,"2").replace("_", " ")
            // this generates the main information about the search above the table of information
            docString += `<h2>${i.name}</h2>
            <h3>Status</h3><p>${i.bookmark_status_display}</p>
            <h3>App</h3><p>${i.displayapp}</p>
            <h3>Description</h3><p>${i.description}</p>
            <table><tr><td width='40%'><h4>Use Case</h4><p>${formattedUseCase}</p><h4>Category</h4><p>${formattedCategory}</p>
            <h4>Alert Volume</h4><p>${i.alertvolume}</p><h4>SPL Difficulty</h4><p>${i.SPLEase}</p></td>
            <td width='60%'><h4>Data Availability</h4><p>${i.data_available}</p>
            <h4>Journey</h4><p>${journeyStage}</p><h4>Data Sources</h4><p>${i.datasource}</p>`;

            // check to make sure MITRE data is in place and format it properly
            if (i.mitre_tactic_display) {
                let mitreTactic = i.mitre_tactic_display;
                mitreTactic = mitreTactic.split("|").join(newChar);
                docString += "<h4>MITRE ATT&CK Tactics</h4><p>" + mitreTactic + "</p>";
            }

            if (i.mitre_technique_display) {
                let mitreTechnique = i.mitre_technique_display;
                mitreTechnique = mitreTechnique.split("|").join(newChar);
                docString += "<h4>MITRE ATT&CK Techniques</h4><p>" + mitreTechnique + "</p>";
            }

            if (i.mitre_threat_groups) {
                let threatGroupList = i.mitre_threat_groups;
                threatGroupList = threatGroupList.split("|").join(newChar);
                docString += "<h4>MITRE Threat Groups</h4><p>" + threatGroupList + "</p>";
            }

            docString += "</td></tr></table>";

            // depending on the data sources check to make sure we have them before adding to the report
            if (i.gdprtext) {
                docString += "<h3> > GDPR Relevance </h3><p>" + i.gdprtext + "</p><hr>";
            }
            if (i.howToImplement) {
                docString += "<h3> > How To Implement </h3><p> " + i.howToImplement + "</p><hr>";
            }
            if (i.knownFP) {
                docString += "<h3> > Known False Positives </h3><p>" + i.knownFP + "</p><hr>";
            }
            if (i.operationalize) {
                docString += "<h3> > How To Respond </h3><p>" + i.operationalize + "</p><hr>";
            }
            if (i.help) {
                docString += "<h3> > Help </h3><p>" + i.help + "</p><hr>";
            }

            // this builds the table that explains the searches
            var exampleData;
            if (i['examples']) {
                exampleData = i['examples'];
                for (let i = 0; i < exampleData.length; i++) {
                    //console.log(exampleData[i]);
                    let exampleName = exampleData[i]["name"];
                    let exampleLabel = exampleData[i]["label"];
                    let exampleShowcaseValue;
                    let exampleShowcaseDescription;

                    // need this because live data is further nested
                    if (exampleData[i] == "Live Data") {
                        // console.log(exampleData[i]["showcase"]["showcase"]);
                        exampleShowcaseValue = exampleData[i]["showcase"]["showcase"]["value"].split("\n");
                        exampleShowcaseDescription = exampleData[i]["shjowcase"]["showcase"]["description"];
                    } else {
                        // console.log(exampleData[i]["showcase"]);
                        exampleShowcaseValue = exampleData[i]["showcase"]["value"].split("\n");
                        exampleShowcaseDescription = exampleData[i]["showcase"]["description"];
                    }

                    // now that we have our info let's build the table explaining the search
                    docString += "<h3>" + exampleName + "</h3><table>";
                    for (let j = 0; j < exampleShowcaseValue.length; j++) {
                        docString += "<tr><td><code>" + exampleShowcaseValue[j] + "</code></td><td>";
                        docString += exampleShowcaseDescription[j] + "</td></tr>";
                    }
                    docString += "</table></div>";
                }

            }
        }

        docString += '</body></html>';
        docString += '\n--NEXT.ITEM-BOUNDARY--';

        var blob = new Blob([docString], {
            type: 'application/msword'
        });
        //var blob = new Blob(['\ufeff', docString], {type: 'application/msword'});
        var filename = "Security_Essentials_Content_Export.doc";

        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    function ExportCSV(ShowcaseInfo, areBookmarksIncluded) {
        var myDownload = []
        var myCSV = ""
        // console.log("here's my download", myDownload)
        let myHeader = []
        let standardColumns = [{
                "fieldName": "name",
                "displayName": "Name",
                "type": "singlevalue"
            },
            {
                "fieldName": "description",
                "displayName": "Description",
                "type": "singlevalue"
            },
            {
                "fieldName": "analytic_story",
                "displayName": "Analytic Story",
                "type": "multivalue"
            },
            {
                "fieldName": "journey",
                "displayName": "Journey",
                "type": "singlevalue"
            },
            {
                "fieldName": "usecase",
                "displayName": "Security Use Case",
                "type": "multivalue"
            },
            {
                "fieldName": "category",
                "displayName": "Category",
                "type": "multivalue"
            },
            {
                "fieldName": "datasource",
                "displayName": "Data Sources",
                "type": "multivalue"
            },
            {
                "fieldName": "datamodel",
                "displayName": "Datamodel",
                "type": "multivalue"
            },
            {
                "fieldName": "displayapp",
                "displayName": "Originating App",
                "type": "singlevalue"
            },
            {
                "fieldName": "highlight",
                "displayName": "Featured",
                "type": "singlevalue"
            },
            {
                "fieldName": "alertvolume",
                "displayName": "Alert Volume",
                "type": "singlevalue"
            },
            {
                "fieldName": "domain",
                "displayName": "Domain",
                "type": "multivalue"
            },
            {
                "fieldName": "mitre_tactic_display",
                "displayName": "ATT&CK Tactic",
                "type": "multivalue"
            },
            {
                "fieldName": "mitre_technique_display",
                "displayName": "ATT&CK Technique",
                "type": "multivalue"
            },
            {
                "fieldName": "mitre_sub_technique_display",
                "displayName": "ATT&CK Sub-technique",
                "type": "multivalue"
            },
            {
                "fieldName": "mitre_id",
                "displayName": "ATT&CK Id",
                "type": "multivalue"
            },
            {
                "fieldName": "mitre_platforms",
                "displayName": "ATT&CK Platforms",
                "type": "multivalue"
            },
            {
                "fieldName": "mitre_software",
                "displayName": "Mitre Software",
                "type": "multivalue"
            },
            {
                "fieldName": "escu_cis",
                "displayName": "CIS",
                "type": "multivalue"
            },
            {
                "fieldName": "escu_nist",
                "displayName": "NIST",
                "type": "multivalue"
            },
            {
                "fieldName": "mitre_threat_groups",
                "displayName": "MITRE Threat Groups",
                "type": "multivalue"
            },
            {
                "fieldName": "data_source_categories_display",
                "displayName": "Data Source Category",
                "type": "multivalue"
            },
            {
                "fieldName": "data_available",
                "displayName": "Data Availability",
                "type": "singlevalue"
            },
            {
                "fieldName": "enabled",
                "displayName": "Content Enabled",
                "type": "singlevalue"
            },
            {
                "fieldName": "killchain",
                "displayName": "Kill Chain Phase",
                "type": "multivalue"
            },
            {
                "fieldName": "hasSearch",
                "displayName": "Search Included",
                "type": "singlevalue"
            },
            {
                "fieldName": "SPLEase",
                "displayName": "SPL Difficulty",
                "type": "singlevalue"
            },
            {
                "fieldName": "displayapp",
                "displayName": "Originating App",
                "type": "singlevalue"
            }
        ]
        if (areBookmarksIncluded) {
            standardColumns.push({
                "fieldName": "bookmark_status_display",
                "displayName": "Bookmarked",
                "type": "singlevalue"
            })
            standardColumns.push({
                "fieldName": "bookmark_notes",
                "displayName": "Bookmark Notes",
                "type": "singlevalue"
            })
        }
        for (let i = 0; i < standardColumns.length; i++) {
            myHeader.push(standardColumns[i].displayName)
        }


        myDownload.push(myHeader)
        myCSV += myHeader.join(",") + "\n"

        for (let summaryName in ShowcaseInfo.summaries) {
            let row = []
            for (let i = 0; i < standardColumns.length; i++) {
                if (ShowcaseInfo.summaries[summaryName][standardColumns[i].fieldName]) {
                    if (standardColumns[i].type == "singlevalue") {
                        row.push('"' + ShowcaseInfo.summaries[summaryName][standardColumns[i].fieldName].replace(/"/g, '""') + '"')
                    } else {
                        row.push('"' + ShowcaseInfo.summaries[summaryName][standardColumns[i].fieldName].replace(/"/g, '""').replace(/\|/g, ", ") + '"')
                    }
                } else {
                    row.push("")
                }
            }
            myDownload.push(row)
            myCSV += row.join(",") + "\n"
        }

        // console.log("here's my download", myDownload)
        var filename = "Splunk_Security_Use_Cases.csv"

        var blob = new Blob([myCSV], {
            type: 'text/csv;charset=utf-8;'
        });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

    }


    async function CreatePrintableDisplay(ProcessSummaryUI, ShowcaseInfo, isFiltered, configs) {
        let deferral = $.Deferred()
        window.requested_export_configs = configs;
        window.actual_export_showcaseInfo = ShowcaseInfo
        if ($("#bookmark_printable_table").length > 0) {
            $("#bookmark_printable_table").remove()
        }
        let isFilteredText = ""
        if (isFiltered) {
            isFilteredText = " (Filtered View)"
        }
        let inclTOC = ""
        if (location.href.indexOf("bookmarked_content") >= 0) {
            inclTOC = '<h2 style="margin-top: 200px;">Table of Contents</h3><ol><li>Use Case Overview</li><li>Data Sources</li><li>Use Cases for Data Sources</li><li>Content Detail<ul id="usecasetoc"></ul>'
        }
        let printableDiv = $("<div>").attr("class", "bookmark_printable_table").html('<img src="' + Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/images/general_images/splunk_icon.png") + '" style="position: absolute; right: 10px; top: 40px; display: block;" /><div id="intropageblock" style="margin-top: 200px;"><h1 style="break-before: avoid;">Splunk Security Content Export</h1><h2>Prepared ' + formatDate(new Date()) + ' via the ' + $(document).find("title").text().replace(/\s*\|.*/, "") + ' dashboard' + isFilteredText + '</h2>' + inclTOC + '</li></ol></div>')

        for (let summaryName in ShowcaseInfo.summaries) {
            let summary = ShowcaseInfo.summaries[summaryName]



            let summaryUI = await ProcessSummaryUI.GenerateShowcaseHTMLBodyAsync(summary, ShowcaseInfo, true);
            let summaryOne = $(summaryUI[0])
            let summaryTwo = $(summaryUI[1])

            summaryOne.find("a").replaceWith(function() {
                return $("<span>" + $(this).html() + "</span>");
            });
            summaryTwo.find("a").replaceWith(function() {
                return $("<span>" + $(this).html() + "</span>");
            });
            let description = summaryOne.find("#contentDescription").html() + summaryTwo.find("#contentDescription").html()

            description = description.replace(/\(Click for Detail\)/g, "")

            let description_el = $("<div>").append(description.replace(/display: none/g, ""))
            description_el.find(".bookmarkDisplayComponents").remove()
            let printableimage = $("")
            if (configs['demoscreenshots'] && typeof summary.printable_image != "undefined" && summary.printable_image != "" && summary.printable_image != null) {
                printableimage = $("<div class=\"donotbreak\" style=\"margin-top: 15px;\"><h2>Screenshot of Demo Data</h2></div>").append($('<img class="printonly" />').attr("src", summary.printable_image))

            }

            let SPL = $("<div class=\"donotbreak\"></div>")
            if (configs['spl'] && summary.examples && typeof summary.examples == "object" && summary.examples.length > 0) {
                SPL.append("<h2>SPL for " + summary.name + "</h2>")
                for (let i = 0; i < summary.examples.length; i++) {
                    if (typeof summary.examples[i].showcase != "undefined") {
                        let addlLines = ""
                        let addlGuides = []
                        if (summary.dashboard.indexOf("showcase_first_seen_demo") >= 0) {

                            if (summary.examples[i].label.match(/Demo Data/)) {
                                if (summary.examples[i].showcase.outlierPeerGroup) {
                                    addlLines = '\n| stats earliest(_time) as earliest latest(_time) as latest  by $outlierValueTracked1Token$, $outlierValueTracked2Token$ | eventstats max(latest) as maxlatest | eval comment="<-- eventstats only necessary for demo data" \n| lookup $outlierPeerGroupControlToken$ $outlierValueTracked1Token$ OUTPUT peergroup | makemv peergroup delim="," \n| multireport [| stats values(*) as * by $outlierValueTracked1Token$  $outlierValueTracked2Token$  ] [| stats values(eval(if(earliest>=relative_time(maxlatest,"-1d@d"),$outlierValueTracked2Token$ ,null))) as peertoday values(eval(if(earliest<relative_time(maxlatest,"-1d@d"),$outlierValueTracked2Token$ ,null))) as peerpast by peergroup $outlierValueTracked2Token$   ] \n| eval user=coalesce(user, peergroup) | fields - peergroup | stats values(*) as * by $outlierValueTracked1Token$  $outlierValueTracked2Token$ \n| where isnotnull(earliest) \n'
                                    addlLines = addlLines.replace(/\$outlierPeerGroupToken\$/g, summary.examples[i].showcase.outlierPeerGroup).replace(/\$outlierValueTracked1Token\$/g, summary.examples[i].showcase.outlierValueTracked1).replace(/\$outlierValueTracked2Token\$/g, summary.examples[i].showcase.outlierValueTracked2).replace(/\n\s*/g, "\n") // .replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
                                    addlGuides = ['Find where the most recent value is less than -1d@d from either now() or the value showing your most recent data point (depending on your particular search desires)',
                                        'Enrich primary with peer group',
                                        //'Pull out the \'Secondary Field\'s that a \'Primary Field\' has viewed, and the \'Secondary Field\' their peers have viewed',
                                        'Here we are comparing the # of \'Peer Field\'s viewed today and historically by the \'Primary Field\'. multireport is a search operator that allows you to leverage the power of stats, but multiple times.',
                                        'Now we join the two | stats output together into one, so that we can analyze them together',
                                        'Filtering out null earliest will handle corner cases to make a clean report.'
                                    ]
                                } else {
                                    addlLines = '\n| stats earliest(_time) as earliest latest(_time) as latest by $outlierValueTracked1Token$, $outlierValueTracked2Token$ \n| eventstats max(latest) as maxlatest\n| where earliest > relative_time(maxlatest, "-1d@d") '
                                    addlLines = addlLines.replace(/\$outlierValueTracked1Token\$/g, summary.examples[i].showcase.outlierValueTracked1).replace(/\$outlierValueTracked2Token\$/g, summary.examples[i].showcase.outlierValueTracked2).replace(/\n\s*/g, "\n") // .replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
                                    addlGuides = ['Here we use the stats command to calculate what the earliest and the latest time is that we have seen this combination of fields.',
                                        'Next we calculate the most recent value in our demo dataset',
                                        'We end by seeing if the earliest time we\'ve seen this value is within the last day of the end of our demo dataset.'
                                    ]
                                }
                            } else {
                                if (summary.examples[i].showcase.outlierPeerGroup) {
                                    addlLines = '\m| stats earliest(_time) as earliest latest(_time) as latest  by $outlierValueTracked1Token$, $outlierValueTracked2Token$ \n| lookup $outlierPeerGroupControlToken$ $outlierValueTracked1Token$ OUTPUT peergroup | makemv peergroup delim="," \n| multireport [| stats values(*) as * by $outlierValueTracked1Token$  $outlierValueTracked2Token$  ] [| stats values(eval(if(earliest>=relative_time(now(),"-1d@d"),$outlierValueTracked2Token$ ,null))) as peertoday values(eval(if(earliest<relative_time(now(),"-1d@d"),$outlierValueTracked2Token$ ,null))) as peerpast by peergroup $outlierValueTracked2Token$ ] \n| eval user=coalesce(user, peergroup) | fields - peergroup | stats values(*) as * by $outlierValueTracked1Token$  $outlierValueTracked2Token$ \n| where isnotnull(earliest)'
                                    addlLines = addlLines.replace(/\$outlierPeerGroupToken\$/g, summary.examples[i].showcase.outlierPeerGroup).replace(/\$outlierValueTracked1Token\$/g, summary.examples[i].showcase.outlierValueTracked1).replace(/\$outlierValueTracked2Token\$/g, summary.examples[i].showcase.outlierValueTracked2).replace(/\n\s*/g, "\n") // .replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
                                    addlGuides = ['Find where the most recent value is less than -1d@d from either now() or the value showing your most recent data point (depending on your particular search desires)',
                                        'Enrich primary with peer group',
                                        //'Pull out the \'Secondary Field\'s that a \'Primary Field\' has viewed, and the \'Secondary Field\' their peers have viewed',
                                        'Here we are comparing the # of \'Peer Field\'s viewed today and historically by the \'Primary Field\'. multireport is a search operator that allows you to leverage the power of stats, but multiple times.',
                                        'Now we join the two | stats output together into one, so that we can analyze them together',
                                        'Filtering out null earliest will handle corner cases to make a clean report.'
                                    ]
                                } else {
                                    addlLines = '\n| stats earliest(_time) as earliest latest(_time) as latest  by $outlierValueTracked1Token$, $outlierValueTracked2Token$ \n| where earliest > relative_time(now(), "-1d@d") '
                                    addlLines = addlLines.replace(/\$outlierValueTracked1Token\$/g, summary.examples[i].showcase.outlierValueTracked1).replace(/\$outlierValueTracked2Token\$/g, summary.examples[i].showcase.outlierValueTracked2).replace(/\n\s*/g, "\n") // .replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
                                    addlGuides = ['Here we use the stats command to calculate what the earliest and the latest time is that we have seen this combination of fields.',
                                        'We end by seeing if the earliest time we\'ve seen this value is within the last day.'
                                    ]
                                }

                            }



                        } else if (summary.dashboard.indexOf("showcase_standard_deviation") >= 0) {

                            if (summary.examples[i].label.match(/Demo Data/)) {
                                addlLines = '| eventstats max(_time) as maxtime | stats count as num_data_samples max(eval(if(_time >= relative_time(maxtime, "-1d@d"), \'$outlierVariableToken$\',null))) as $outlierVariableToken|s$ avg(eval(if(_time<relative_time(maxtime,"-1d@d"),\'$outlierVariableToken$\',null))) as avg stdev(eval(if(_time<relative_time(maxtime,"-1d@d"),\'$outlierVariableToken$\',null))) as stdev by $outlierVariableSubjectToken|s$ \n| eval lowerBound=(avg-stdev*$scaleFactorToken$), upperBound=(avg+stdev*$scaleFactorToken$)\n| where \'$outlierVariableToken$\' > upperBound AND num_data_samples >=7'
                                addlGuides = ['calculate the mean, standard deviation and most recent value', 'calculate the bounds as a multiple of the standard deviation', "Finally we check to see if the most recent value is above our threshold, and ensure that we have enough data samples to rely on the result."]
                            } else {
                                addlLines = '| stats count as num_data_samples max(eval(if(_time >= relative_time(maxtime, "-1d@d"), \'$outlierVariableToken$\',null))) as $outlierVariableToken|s$ avg(eval(if(_time<relative_time(maxtime,"-1d@d"),\'$outlierVariableToken$\',null))) as avg stdev(eval(if(_time<relative_time(maxtime,"-1d@d"),\'$outlierVariableToken$\',null))) as stdev by $outlierVariableSubjectToken|s$ \n| eval lowerBound=(avg-stdev*$scaleFactorToken$), upperBound=(avg+stdev*$scaleFactorToken$)\n| where \'$outlierVariableToken$\' > upperBound AND num_data_samples >=7'
                                addlGuides = ['calculate the mean, standard deviation and most recent value', 'calculate the bounds as a multiple of the standard deviation', "Finally we check to see if the most recent value is above our threshold, and ensure that we have enough data samples to rely on the result."]
                            }

                            let tokensToReplace = ["outlierVariableToken", "outlierVariableSubjectToken", "scaleFactorToken"];
                            let desiredTokenConfig = summary.examples[i].showcase;
                            for (let g = 0; g < tokensToReplace.length; g++) {
                                // if(desiredTokenConfig[ tokensToReplace[g].replace(/Token$/, "") ]){
                                let regex = new RegExp("\\$" + tokensToReplace[g] + "(.s)*\\$", "g");
                                if (addlLines.match(regex)) {
                                    addlLines = addlLines.replace(regex, desiredTokenConfig[tokensToReplace[g].replace(/Token$/, "")])
                                }
                                // }
                            }
                        }

                        summary.examples[i].showcase.value = summary.examples[i].showcase.value + addlLines

                        let linebylineSPL = $("<div>").append($("<pre>").append($("<code class=\"spl\">").text(summary.examples[i].showcase.value))).html() //$("<pre>")<code class=\"spl\">" + summary.examples[i].showcase.value + "</code></pre>")
                        let lines = summary.examples[i].showcase.value.split(/\n/)
                        if (typeof summary.examples[i].showcase.description != "undefined" && lines.length > 0) {
                            summary.examples[i].showcase.description = summary.examples[i].showcase.description.concat(addlGuides);
                            let myTable = "<table class=\"linebylinespl\">"
                            for (var g = 0; g < lines.length; g++) {
                                myTable += "<tr>" + '<td class="splside">' + $("<div>").append($("<pre class=\"search fakepre\">").append($("<code class=\"spl\">").text(lines[g]))).html() + '</td>' + '<td class="docside">' + (summary.examples[i].showcase.description[g] || "") + '</td></tr>'
                            }
                            myTable += "</table>"
                            linebylineSPL = myTable
                        }
                        var localexample = $("<div class=\"donotbreak\"></div>").append($("<h3>" + summary.examples[i].label + "</h3>"), linebylineSPL)

                        SPL.append(localexample)
                    }
                }
            }
            let bookmark_display = ""
            if (configs['bookmark']) {
                bookmark_display += "<h2>Status</h2> <p>" + BookmarkStatus[summary.bookmark_status] + "</p>"
                if (summary.bookmark_notes != "") {
                    bookmark_display += "<h2>Bookmark Notes</h2> " + $("<div>").append($("<p>").text(summary.bookmark_notes)).html()
                }
            }

            $("body").append($("<div>").addClass("bookmark_printable_table printable_section").attr("data-showcaseid", summary.id).append($("<h1>" + summary.name + "</h1>" + bookmark_display + "<h2>App</h2><p>" + summary.displayapp + "</p>" + description_el.html()), SPL, printableimage))
        }

        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });


        // console.log("Rendering starting")
        $("body").prepend(printableDiv).ready(function() {

            deferral.resolve();
        })
        return deferral;

    }



    window.LaunchExportDialog = LaunchExportDialog


})
