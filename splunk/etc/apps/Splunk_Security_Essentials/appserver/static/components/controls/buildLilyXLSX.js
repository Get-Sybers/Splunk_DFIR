let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function numToAlpha(a) {
  // First figure out how many digits there are.
  c = 0;
  var x = 1;      
  while (a >= x) {
    c++;
    a -= x;
    x *= 26;
  }

  // Now you can do normal base conversion.
  var s = "";
  for (var i = 0; i < c; i++) {
    s = alpha.charAt(a % 26) + s;
    a = Math.floor(a/26);
  }

  return s;
}
let masterCounter = 0;
let sharedStrings = {}


/* Template Columns 

    "sheet6": {
        "columns": [{"ref": getRefForString("Security Domain"), "width": 15}, {"ref": getRefForString("Title"), "width": 53}, {"ref": getRefForString("Description"), "width": 64}, {"ref": getRefForString("Use Case(s)"), "width": 47}, {"ref": getRefForString("Journey Stage"), "width": 17}, {"ref": getRefForString("Category"), "width": 18}, {"ref": getRefForString("Data Source Category"), "width": 35}, {"ref": getRefForString("MITRE ATT&CK Tactic"), "width": 22}, {"ref": getRefForString("MITRE ATT&CK Technique"), "width": 22}, {"ref": getRefForString("Kill Chain Phase"), "width": 22}],
        "rows": [],
        "order": 6,
        "name": "ES Content Update (Detections)",
        "displayapp": "Enterprise Security Content Update",
        "keysToHarvest": ["domain", "name", "description", "usecase", "journey", "category", "data_source_categories_display", "mitre_tactic_display", "mitre_technique_display", "killchain"]
    },


*/

let sheets = {
    "sheet1": {
        "name": "Welcome",
        "order": 1,
        "include_in_welcome_page": false
    },
    "sheet2": {
        "columns": [],
        "rows": [],
        "order": 2,
        "name": "All Detections",
        "include_in_welcome_page": false,
        "keysToHarvest": []
    },
    "sheet3": {
        "columns": [],
        "rows": [],
        "name": "Splunk Security Essentials",
        "displayapp": "Splunk Security Essentials",
        "order": 3,
        "keysToHarvest": []
    },
    "sheet4": {
        "columns": [{"ref": getRefForString("Security Domain"), "width": 15}, {"ref": getRefForString("Title"), "width": 53}, {"ref": getRefForString("Description"), "width": 64}, {"ref": getRefForString("Use Case(s)"), "width": 47}, {"ref": getRefForString("Journey Stage"), "width": 17}, {"ref": getRefForString("Category"), "width": 18}, {"ref": getRefForString("Data Source Category"), "width": 35}, {"ref": getRefForString("MITRE ATT&CK Tactic"), "width": 22}, {"ref": getRefForString("MITRE ATT&CK Technique"), "width": 22}],
        "rows": [],
        "order": 4,
        "name": "ES Correlation Searches",
        "displayapp": "Splunk App for Enterprise Security",
        "keysToHarvest": ["domain", "name", "description", "usecase", "journey", "category", "data_source_categories_display", "mitre_tactic_display", "mitre_technique_display"]
    },
    "sheet5": {
        "columns": [{"ref": getRefForString("Analytic Story Name"), "width": 53},{"ref": getRefForString("Description"), "width": 120},{"ref": getRefForString("Category"), "width": 40},{"ref": getRefForString("Kill Chain Phases"), "width": 30},{"ref": getRefForString("CIS Controls"), "width": 30},{"ref": getRefForString("MITRE ATT&CK Tactics"), "width": 40}, {"ref": getRefForString("MITRE ATT&CK Techniques"), "width": 40},{"ref": getRefForString("NIST Category"), "width": 30}, {"ref": getRefForString("Data Models"), "width": 30}, {"ref": getRefForString("Providing Technologies"), "width": 50}, {"ref": getRefForString("Detection Searches"), "width": 60}, {"ref": getRefForString("Investigative Searches"), "width": 60},{"ref": getRefForString("Support Searches"), "width": 60}],
        "rows": [],
        "order": 5,
        "name": "ES Content Update (Stories)",
        "displayapp": "ESCU Stories",
        "keysToHarvest": ["name", "description", "category", "killchain", "escu_cis", "mitre_tactic_display", "mitre_technique_display", "escu_nist", "escu_data_models", "escu_providing_technologies", "detection_searches", "investigative_searches", "support_searches"]
    },
    "sheet6": {
        "columns": [{"ref": getRefForString("Security Domain"), "width": 15}, {"ref": getRefForString("Title"), "width": 53}, {"ref": getRefForString("Description"), "width": 64},{"ref": getRefForString("Analytic Story"), "width": 53}, {"ref": getRefForString("Use Case(s)"), "width": 24}, {"ref": getRefForString("Journey Stage"), "width": 17}, {"ref": getRefForString("Category"), "width": 18}, {"ref": getRefForString("Data Source Category"), "width": 35}, {"ref": getRefForString("Datamodel"), "width": 22}, {"ref": getRefForString("MITRE ATT&CK Tactic"), "width": 22}, {"ref": getRefForString("MITRE ATT&CK Technique"), "width": 42}, {"ref": getRefForString("MITRE ATT&CK Threat Groups"), "width": 42}, {"ref": getRefForString("MITRE ATT&CK Software"), "width": 42}, {"ref": getRefForString("MITRE ATT&CK Platforms"), "width": 42}, {"ref": getRefForString("Kill Chain Phase"), "width": 22},{"ref": getRefForString("CIS Controls"), "width": 30},{"ref": getRefForString("NIST Category"), "width": 30}],
        "rows": [],
        "order": 6,
        "name": "ES Content Update (Detections)",
        "displayapp": "Enterprise Security Content Update",
        "keysToHarvest": ["domain", "name", "description","analytic_story", "usecase", "journey", "category", "data_source_categories_display","datamodel", "mitre_tactic_display", "mitre_technique_display", "mitre_threat_groups", "mitre_software", "mitre_platforms", "killchain", "escu_cis", "escu_nist"]
    },
    "sheet7": {
        "columns": [{"ref": getRefForString("Title"), "width": 50}, {"ref": getRefForString("Description"), "width": 64}, {"ref": getRefForString("Is a Custom Threat"), "width": 18}, {"ref": getRefForString("Contributing Anomalies"), "width": 60}, {"ref": getRefForString("Use Case(s)"), "width": 23}, {"ref": getRefForString("Journey Stage"), "width": 17}, {"ref": getRefForString("Category"), "width": 22}, {"ref": getRefForString("Data Source Category"), "width": 35},{"ref": getRefForString("Security Domain"), "width": 15}, {"ref": getRefForString("Alert Volume"), "width": 12} ],
        "rows": [],
        "order": 7,
        "name": "Splunk UBA Threats",
        "displayapp": "Splunk UBA Threats",
        "keysToHarvest": [ "name", "description", "is_custom", "contributing_anomalies", "usecase", "journey", "category", "data_source_categories_display", "domain", "alertvolume"]
    },
    "sheet8": {
        "columns": [{"ref": getRefForString("Title"), "width": 53}, {"ref": getRefForString("Description"), "width": 64}, {"ref": getRefForString("Detection Methods"), "width": 120}, {"ref": getRefForString("Contributes to Threats"), "width": 70}, {"ref": getRefForString("Security Domain"), "width": 15}, {"ref": getRefForString("Use Case(s)"), "width": 24}, {"ref": getRefForString("Journey Stage"), "width": 17}, {"ref": getRefForString("Category"), "width": 18}, {"ref": getRefForString("Data Source Category"), "width": 35}, {"ref": getRefForString("MITRE ATT&CK Tactic"), "width": 22}, {"ref": getRefForString("MITRE ATT&CK Technique"), "width": 42}, {"ref": getRefForString("Kill Chain Phase"), "width": 22}],
        "rows": [],
        "order": 8,
        "name": "Splunk UBA Anomalies",
        "displayapp": "Splunk UBA Anomalies",
        "keysToHarvest": ["name", "description", "detection_methods", "contributes_to", "domain", "usecase", "journey", "category", "data_source_categories_display", "mitre_tactic_display", "mitre_technique_display", "killchain"]
    },
    "sheet9": {
        "columns": [{"ref": getRefForString("Security Domain"), "width": 15}, {"ref": getRefForString("Title"), "width": 53}, {"ref": getRefForString("Description"), "width": 64}, {"ref": getRefForString("Use Case(s)"), "width": 47}, {"ref": getRefForString("Journey Stage"), "width": 17}, {"ref": getRefForString("Category"), "width": 18}, {"ref": getRefForString("Data Source Category"), "width": 35}],
        "rows": [],
        "order": 9,
        "name": "Splunk SOAR (Highlights)",
        // "descriptionRow": "Note: This sheet does not list all SOAR Community Playbooks, just some of the most requested, most popular playbooks. To see all that SOAR can deliver, reach out to your Splunk team or check out our github at: https://github.com/phantomcyber/playbooks.",
        "displayapp": "Splunk SOAR",
        "keysToHarvest": ["domain", "name", "description", "usecase", "journey", "category", "data_source_categories_display"]
    },
}

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function getRefForString(str){
    if(str == ""){
        return ""
    }else if(sharedStrings[str]){
        sharedStrings[str]['count']++;
        return sharedStrings[str]['id'];
    }else{
        sharedStrings[str] = {"count": 1, "id": masterCounter}
        masterCounter++;
        return masterCounter - 1;
    }
}
function getNextSheetNumber(){
    // console.log("Got a call for getNextSheetNumber!")
    let num = 0;
    for(let sheet in sheets){
        let sheetNum = parseInt(sheet.replace("sheet", ""))
        if(sheetNum > num){
            num = sheetNum;
        }
    }
    return num + 1;
}
function generateXLSX(providedShowcaseInfo, isFiltered, areBookmarksIncluded){
    let ShowcaseInfo = JSON.parse(JSON.stringify(providedShowcaseInfo))
// Init Intro Sheet Content
    let counts = {
    }

    /// Handle ESCU Stories
    //  "category", "killchain", "cis", "mitre_tactic_display", "mitre_technique_display", "nist", "data_models", "providing_technologies", "detection_searches", "investigative_searches", "support_searches"
    if(ShowcaseInfo.escu_stories){
        for(let storyId in ShowcaseInfo.escu_stories){
            let story = ShowcaseInfo.escu_stories[storyId];
            story.description = story.narrative;
            story.category = []
            story.displayapp = "ESCU Stories"
            story.killchain = []
            story.escu_cis = []
            story.mitre_tactic_display = []
            story.mitre_technique_display = []
            story.escu_nist = []
            story.escu_data_models = []
            story.escu_providing_technologies = []
            story.detection_searches = []
            story.investigative_searches = story.investigations?.join("\n")
            story.support_searches = story.support?.join("\n")
            let numSearchesInScope = 0;
            for(let x = 0; x < story.detections.length; x++){
                let summaryName = story.detections[x]
                // console.log("Looking for", summaryName, ShowcaseInfo.summaries[summaryName])
                if(ShowcaseInfo.summaries[summaryName]){
                    numSearchesInScope++;
                    story.detection_searches.push(ShowcaseInfo.summaries[summaryName].name)
                    
                    let mvFields = ["category", "killchain", "mitre_technique_display", "mitre_tactic_display", "escu_cis", "escu_nist"];
                    for(let i = 0; i < mvFields.length; i++){
                        if(ShowcaseInfo.summaries[summaryName][mvFields[i]]){

                            let values = ShowcaseInfo.summaries[summaryName][mvFields[i]].split("|")
                            for(let g = 0; g < values.length; g++){
                                if(values[g] != "" && values[g] != "None" && values[g] != "N/A"){
                                    if(story[mvFields[i]].indexOf(values[g]) == -1){
                                        story[mvFields[i]].push(values[g])
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(numSearchesInScope>0){

                story.escu_cis = story.escu_cis.join("\n")
                story.escu_nist = story.escu_nist.join("\n")
                story.escu_data_models = story.escu_data_models.join("\n")
                story.escu_providing_technologies = story.escu_providing_technologies.join("\n")
                story.category = story.category.join("\n")
                story.killchain = story.killchain.join("\n")
                story.mitre_tactic_display = story.mitre_tactic_display.join("\n")
                story.mitre_technique_display = story.mitre_technique_display.join("\n")
                story.detection_searches = story.detection_searches.join("\n")
                story.is_escu_story = true
                ShowcaseInfo.summaries[storyId] = story
            }
        }
    }
    // END ESCU


    // START UBA 
    for(let summaryName in ShowcaseInfo['summaries']){
        if(summaryName.indexOf("TT") == 0 && ShowcaseInfo['summaries'][summaryName]['displayapp'] == "Splunk User Behavior Analytics"){
            if(ShowcaseInfo['summaries'][summaryName]['anomalies']){
                ShowcaseInfo['summaries'][summaryName]['contributing_anomalies'] = []
                for(let i = 0; i < ShowcaseInfo['summaries'][summaryName]['anomalies'].length; i++){
                    if(ShowcaseInfo['summaries'][ShowcaseInfo['summaries'][summaryName]['anomalies'][i]] && ShowcaseInfo['summaries'][ShowcaseInfo['summaries'][summaryName]['anomalies'][i]]['includeSSE'] == "Yes"){
                        ShowcaseInfo['summaries'][summaryName]['contributing_anomalies'].push(ShowcaseInfo['summaries'][ShowcaseInfo['summaries'][summaryName]['anomalies'][i]]['name'])
                    }
                }
                ShowcaseInfo['summaries'][summaryName]['contributing_anomalies'] = ShowcaseInfo['summaries'][summaryName]['contributing_anomalies'].join("|")
            }
        }else if(summaryName.indexOf("AT") == 0 && ShowcaseInfo['summaries'][summaryName]['displayapp'] == "Splunk User Behavior Analytics"){
            if(ShowcaseInfo['summaries'][summaryName]['contributes_to_threats']){
                ShowcaseInfo['summaries'][summaryName]['contributes_to'] = []
                for(let i = 0; i < ShowcaseInfo['summaries'][summaryName]['contributes_to_threats'].length; i++){
                    if(ShowcaseInfo['summaries'][ShowcaseInfo['summaries'][summaryName]['contributes_to_threats'][i]] && ShowcaseInfo['summaries'][ShowcaseInfo['summaries'][summaryName]['contributes_to_threats'][i]]['includeSSE'] == "Yes"){
                        ShowcaseInfo['summaries'][summaryName]['contributes_to'].push(ShowcaseInfo['summaries'][ShowcaseInfo['summaries'][summaryName]['contributes_to_threats'][i]]['name'])
                    }
                }
                ShowcaseInfo['summaries'][summaryName]['contributes_to'] = ShowcaseInfo['summaries'][summaryName]['contributes_to'].join("|")
            }
            if(ShowcaseInfo['summaries'][summaryName]['detections']){
                ShowcaseInfo['summaries'][summaryName]['detection_methods'] = []
                for(let i = 0; i < ShowcaseInfo['summaries'][summaryName]['detections'].length; i++){
                    if(ShowcaseInfo['summaries'][summaryName]['detections'][i]['description']){
                        ShowcaseInfo['summaries'][summaryName]['detection_methods'].push(ShowcaseInfo['summaries'][summaryName]['detections'][i]['description'])
                    }
                }
                ShowcaseInfo['summaries'][summaryName]['detection_methods'] = ShowcaseInfo['summaries'][summaryName]['detection_methods'].join("|")
            }
        }

    }

    // END UBA 


    let standardColumns = [
        {"name": "Originating App", "field": "displayapp", "width": 53},
        {"name": "Security Domain", "field": "domain", "width": 15},
        {"name": "Title", "field": "name", "width": 53},
        {"name": "Description", "field": "description", "width": 64},
        {"name": "Analytic Story", "field": "analytic_story", "width": 24},
        {"name": "Use Case(s)", "field": "usecase", "width": 24},
        {"name": "Journey Stage", "field": "journey", "width": 17},
        {"name": "Category", "field": "category", "width": 18},
        {"name": "Data Source Category", "field": "data_source_categories_display", "width": 35},
        {"name": "Datamodel", "field": "datamodel", "width": 18},
        {"name": "MITRE ATT&CK Tactic", "field": "mitre_tactic_display", "width": 22},
        {"name": "MITRE ATT&CK Technique", "field": "mitre_technique_display", "width": 42},
        {"name": "MITRE ATT&CK Sub-technique", "field": "mitre_sub_technique_display", "width": 42},
        {"name": "MITRE ATT&CK Id", "field": "mitre_id", "width": 24},
        {"name": "MITRE Threat Groups", "field": "mitre_threat_groups", "width": 42},
        {"name": "MITRE Platforms", "field": "mitre_platforms", "width": 18},
        {"name": "MITRE Software", "field": "mitre_software", "width": 42},
        {"name": "NIST", "field": "escu_nist", "width": 12},
        {"name": "CIST", "field": "escu_cis", "width": 12},
        {"name": "Kill Chain Phase", "field": "killchain", "width": 22}
    ]
    if(areBookmarksIncluded){
        let AppsWithoutBookmarks = ["ESCU Stories"]
        standardColumns.push({"name": "Bookmark Status", "field": "bookmark_status_display", "width": 25})
        standardColumns.push({"name": "Bookmark Notes", "field": "bookmark_notes", "width": 50})
        for(let sheet in sheets){
            if(AppsWithoutBookmarks.indexOf(sheets[sheet]["displayapp"]) == -1 && sheets[sheet].columns && sheets[sheet].columns.length > 0 && sheets[sheet].keysToHarvest){
                sheets[sheet].columns.push({"ref": getRefForString("Bookmark Status"), "width": 25})
                sheets[sheet].keysToHarvest.push("bookmark_status_display")
                sheets[sheet].columns.push({"ref": getRefForString("Bookmark Notes"), "width": 15})
                sheets[sheet].keysToHarvest.push("bookmark_notes")
            }
        }
    }
    let AppNameToSheet = {}
    for(let sheet in sheets){
        if(sheets[sheet]["displayapp"]){
            AppNameToSheet[sheets[sheet]["displayapp"]] = sheet
        }
    }
    let supportsMV = ["analytic_story","domain", "usecase", "category", "data_source_categories_display", "mitre_tactic_display", "mitre_technique_display","mitre_id", "mitre_platforms", "killchain", "escu_nist", "escu_cis", "contributing_anomalies", "detection_methods", "contributes_to"]

    for(let i = 0; i < standardColumns.length; i++){
        sheets["sheet2"].columns.push({"ref": getRefForString(standardColumns[i].name), "width": standardColumns[i].width})
        sheets["sheet2"].keysToHarvest.push(standardColumns[i].field)
    }

    // console.log("ALL DETECTIONS FINAL", sheets["sheet2"])
    let sorted_summaries = Object.keys(ShowcaseInfo['summaries'])
    sorted_summaries.sort(function(a, b){
        if(ShowcaseInfo['summaries'][a].name > ShowcaseInfo['summaries'][b].name ){
            return 1
        }
        if(ShowcaseInfo['summaries'][a].name < ShowcaseInfo['summaries'][b].name ){
            return -1
        }
        return 0
    })
    for(let i = 0; i < sorted_summaries.length; i++){
        let summaryName = sorted_summaries[i];
        if(! AppNameToSheet[ShowcaseInfo['summaries'][summaryName]['displayapp']]){
            // Initing a new sheet
            let sheetId = 'sheet' + getNextSheetNumber()
            sheets[sheetId] = {
                "columns": [],
                "rows": [],
                "name": ShowcaseInfo['summaries'][summaryName]['displayapp'],
                "displayapp": ShowcaseInfo['summaries'][summaryName]['displayapp'],
                "keysToHarvest": []
            }
            AppNameToSheet[ShowcaseInfo['summaries'][summaryName]['displayapp']] = sheetId
        }
        
        if(AppNameToSheet[ShowcaseInfo['summaries'][summaryName]['displayapp']]){
            let app = ShowcaseInfo['summaries'][summaryName]['displayapp']
            if(app == "Splunk User Behavior Analytics"){
                if(summaryName.indexOf("TT") >= 0){
                    app = "Splunk UBA Threats"
                }else if(summaryName.indexOf("AT") >= 0){
                    app = "Splunk UBA Anomalies"
                }
            }
            let sheetId = AppNameToSheet[app]
            if(! counts[app]){
                counts[app] = 0
            }
            counts[app]++;

            if(sheets[sheetId].keysToHarvest.length == 0){
                for(let i = 0; i < standardColumns.length; i++){
                    sheets[sheetId].columns.push({"ref": getRefForString(standardColumns[i].name), "width": standardColumns[i].width})
                    sheets[sheetId].keysToHarvest.push(standardColumns[i].field)
                }
            }

            let row = []
            for(let i = 0; i < sheets[sheetId].keysToHarvest.length; i++){
                if(sheets[sheetId].keysToHarvest[i] == "journey"){
                    ShowcaseInfo['summaries'][summaryName][ sheets[sheetId].keysToHarvest[i]] = ShowcaseInfo['summaries'][summaryName][ sheets[sheetId].keysToHarvest[i] ]?.replace(/_/g, " ")
                }
                if(supportsMV.indexOf(sheets[sheetId].keysToHarvest[i]) >= 0){
                    if(ShowcaseInfo['summaries'][summaryName][ sheets[sheetId].keysToHarvest[i] ]){
                        row.push(getRefForString( ShowcaseInfo['summaries'][summaryName][ sheets[sheetId].keysToHarvest[i] ]?.replace(/\|/g, "\n") ))
                    }else{
                        row.push("")
                    }
                    
                }else{
                    row.push(getRefForString( ShowcaseInfo['summaries'][summaryName][ sheets[sheetId].keysToHarvest[i] ]?.replace(/\|/g, "\n") ))
                }
                
            }
            sheets[ sheetId ].rows.push(row)
            if(! ShowcaseInfo['summaries'][summaryName].is_escu_story){
                let all_detections_sheet = []

                for(let i = 0; i < sheets["sheet2"].keysToHarvest.length; i++){
                    
                    if(supportsMV.indexOf(sheets["sheet2"].keysToHarvest[i]) >= 0){
                        if(ShowcaseInfo['summaries'][summaryName][ sheets["sheet2"].keysToHarvest[i] ]){
                            all_detections_sheet.push(getRefForString( ShowcaseInfo['summaries'][summaryName][ sheets["sheet2"].keysToHarvest[i] ].replace(/\|/g, "\n") ))
                        }else{
                            all_detections_sheet.push("")
                        }
                    }else{
                        all_detections_sheet.push(getRefForString( ShowcaseInfo['summaries'][summaryName][ sheets["sheet2"].keysToHarvest[i] ] ))
                    }
                }
                sheets[ "sheet2" ].rows.push(all_detections_sheet)
            }
        }
    }


    let introSheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{E60295EF-0C81-9C40-9CA6-D544912DCC57}"><dimension ref="B1:B18"/><sheetViews><sheetView workbookViewId="0"><selection activeCell="B31" sqref="B31"/></sheetView></sheetViews><sheetFormatPr baseColWidth="10" defaultRowHeight="16" x14ac:dyDescent="0.2"/><cols><col min="1" max="1" width="2.5" customWidth="1"/><col min="2" max="2" width="192.83203125" customWidth="1"/><col min="3" max="3" width="64.5" customWidth="1"/></cols><sheetData><row r="1" spans="2:2" ht="17" thickBot="1" x14ac:dyDescent="0.25"/><row r="2" spans="2:2" ht="90" customHeight="1" thickTop="1" x14ac:dyDescent="0.2"><c r="B2" s="1" t="s"><v>INTROCONTENT_HEADER</v></c></row><row r="3" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B3" s="2" t="s"><v>INTROCONTENT_PREPAREDDATE</v></c></row><row r="4" spans="2:2" x14ac:dyDescent="0.2"><c r="B4" s="2"/></row><row r="5" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B5" s="2" t="s"><v>INTROCONTENT_INCLUDES</v></c></row><row r="6" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B6" s="2" t="s"><v>INTROCONTENT_UNIQUE1</v></c></row><row r="7" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B7" s="2" t="s"><v>INTROCONTENT_UNIQUE2</v></c></row><row r="8" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B8" s="2" t="s"><v>INTROCONTENT_UNIQUE3</v></c></row><row r="9" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B9" s="2" t="s"><v>INTROCONTENT_UNIQUE4</v></c></row><row r="10" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B10" s="2" t="s"><v>INTROCONTENT_UNIQUE5</v></c></row><row r="11" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B11" s="2" t="s"><v>INTROCONTENT_UNIQUE6</v></c></row><row r="12" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B12" s="2" t="s"><v>INTROCONTENT_UNIQUE7</v></c></row><row r="13" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B13" s="2" t="s"><v>INTROCONTENT_UNIQUE8</v></c></row><row r="14" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B14" s="2" t="s"><v>INTROCONTENT_UNIQUE9</v></c></row><row r="15" spans="2:2" ht="17" x14ac:dyDescent="0.2"><c r="B15" s="2" t="s"><v>INTROCONTENT_UNIQUE10</v></c></row><row r="16" spans="2:2" x14ac:dyDescent="0.2"><c r="B16" s="2"/></row><row r="17" spans="2:2" ht="69" thickBot="1" x14ac:dyDescent="0.25"><c r="B17" s="3" t="s"><v>INTROCONTENT_SSEPITCH</v></c></row><row r="18" spans="2:2" ht="17" thickTop="1" x14ac:dyDescent="0.2"/></sheetData><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>'
    introSheet = introSheet.replace("INTROCONTENT_HEADER", getRefForString("Splunk Security Content Export"))

    let isFilteredText = ""
    if(isFiltered){
        isFilteredText = " (Filtered View)"
    }
    introSheet = introSheet.replace("INTROCONTENT_PREPAREDDATE", getRefForString("Prepared on " + formatDate(new Date()) + ' via the ' + $(document).find("title").text().replace(/\s*\|.*/, "") + ' dashboard' + isFilteredText))
    introSheet = introSheet.replace("INTROCONTENT_INCLUDES", getRefForString("Includes:"))
    let sortable = {}
    for(let sheet in sheets){
        if((! sheets[sheet]['include_in_welcome_page'] || sheets[sheet]['include_in_welcome_page'] == true) && sheets[sheet]['displayapp'] && sheets[sheet]['order'] ){
            sortable[ sheets[sheet]['displayapp'] ] = {"order": sheets[sheet]['order'], "label": sheets[sheet]['name']}
        }
    }
    let sorted_keys = Object.keys(sortable);
    sorted_keys = sorted_keys.sort(function(a, b){
        if(sortable[a]['order'] > sortable[b]['order']){
            return 1;
        }
        if(sortable[a]['order'] < sortable[b]['order']){
            return -1;
        }
        return 0;
    })
    let content_count_counter = 1;
    for(let i = 0; i < sorted_keys.length; i++){
        if(counts[ sorted_keys[i] ] > 0){
            introSheet = introSheet.replace("INTROCONTENT_UNIQUE" + content_count_counter, getRefForString(counts[ sorted_keys[i] ] + " - " + sortable[sorted_keys[i]]['label']))
            content_count_counter++;
        }
        delete counts[ sorted_keys[i] ]
    }
    for(let app in counts){
        introSheet = introSheet.replace("INTROCONTENT_UNIQUE" + content_count_counter, getRefForString(counts[ app ] + " - " + app))
        content_count_counter++;
    }
    for(let i = content_count_counter; i <= 10; i++){
        introSheet = introSheet.replace("INTROCONTENT_UNIQUE" + i, "")
    }
    introSheet = introSheet.replace("INTROCONTENT_SSEPITCH", getRefForString("This content was exported via the free app Splunk Security Essentials. In addition to providing 120+ free detections (with full SPL and lots of useable documentation to help users learn Splunk for Security), Splunk Security Essentials also helps you navigate the world of Splunk for Security, mapping all content in Splunk Security Essentials, Splunk Enterprise Security and Enterprise Security Content Update, and Splunk User Behavior Analytics to a common set of metadata including MITRE ATT&CK Tactics and Techniques, and Kill Chain phases (all of which can be integrated into Splunk Enterprise Security). It will also help you track your own maturity by making it easy to export reports like this (and via report-ready PDF, DOCX, or CSV) to show what have your content is active. Find Splunk Security Essentials on Splunkbase."))
    sheets['sheet1']["sheetXML"] = introSheet


    window.sheets = sheets
    toXLSXDownload()
}


function toXLSXDownload() {
    // This is built on the phenomenal model from Lily Lee's spreadsheet
    require([
        "jquery", Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/vendor/jszip/dist/jszip.js"), Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/vendor/FileSaver/FileSaver.js")
    ], function($, JSZip) {
        // console.log("JSZip Loaded", JSZip)
        var zip = new JSZip();

        
        var xl = zip.folder("xl");
        // _rels/.rels  



        // // xl/workbook.xml         
        // xl.file("workbook.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15 xr xr6 xr10 xr2" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6" xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"><fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="10609"/><workbookPr defaultThemeVersion="166925"/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice Requires="x15"><x15ac:absPath url="/Users/dveuve/Downloads/xlsx testing/ssesheetonly/" xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"/></mc:Choice></mc:AlternateContent><xr:revisionPtr revIDLastSave="0" documentId="13_ncr:1_{DBEF1108-F6C1-D343-AC2E-3E5F1D00900A}" xr6:coauthVersionLast="43" xr6:coauthVersionMax="43" xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}"/><bookViews><workbookView xWindow="0" yWindow="460" windowWidth="33600" windowHeight="19620" xr2:uid="{00000000-000D-0000-FFFF-FFFF00000000}"/></bookViews><sheets><sheet name="Security Essentials" sheetId="8" r:id="rId1"/></sheets><calcPr calcId="0"/></workbook>');
        

        // xl/styles.xml     
        xl.file("styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2 xr xr9" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr9="http://schemas.microsoft.com/office/spreadsheetml/2016/revision9"><fonts count="5" x14ac:knownFonts="1"><font><sz val="12"/><color rgb="FF000000"/><name val="Calibri"/></font><font><b/><sz val="12"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font><font><sz val="30"/><color rgb="FF000000"/><name val="Calibri"/><family val="2"/></font><font><sz val="12"/><color rgb="FF000000"/><name val="Calibri"/><family val="2"/></font><font><sz val="12"/><color theme="6" tint="-0.249977111117893"/><name val="Calibri"/><family val="2"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF70AD47"/><bgColor rgb="FF70AD47"/></patternFill></fill></fills><borders count="5"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FF000000"/></left><right style="thin"><color rgb="FF000000"/></right><top style="thin"><color rgb="FF000000"/></top><bottom style="thin"><color rgb="FF000000"/></bottom><diagonal/></border><border><left style="thick"><color theme="8"/></left><right style="thick"><color theme="8"/></right><top style="thick"><color theme="8"/></top><bottom/><diagonal/></border><border><left style="thick"><color theme="8"/></left><right style="thick"><color theme="8"/></right><top/><bottom/><diagonal/></border><border><left style="thick"><color theme="8"/></left><right style="thick"><color theme="8"/></right><top/><bottom style="thick"><color theme="8"/></bottom><diagonal/></border></borders><cellStyleXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="7"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="3" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1"/></xf><xf numFmtId="0" fontId="4" fillId="0" borderId="4" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="2"><cellStyle name="Normal" xfId="0" builtinId="0"/><cellStyle name="Normal 2" xfId="1" xr:uid="{E6A44007-C53A-4141-AA6C-8C5564D4C393}"/></cellStyles><dxfs count="3"><dxf><fill><patternFill patternType="solid"><fgColor rgb="FFD9E2F3"/><bgColor rgb="FFD9E2F3"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor rgb="FFD9E2F3"/><bgColor rgb="FFD9E2F3"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor rgb="FF4472C4"/><bgColor rgb="FF4472C4"/></patternFill></fill></dxf></dxfs><tableStyles count="1"><tableStyle name="UBA v4.2 CIM-style" pivot="0" count="3" xr9:uid="{00000000-0011-0000-FFFF-FFFF00000000}"><tableStyleElement type="headerRow" dxfId="2"/><tableStyleElement type="firstRowStripe" dxfId="1"/><tableStyleElement type="secondRowStripe" dxfId="0"/></tableStyle></tableStyles><extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext><ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>');
        
        // xl/theme/theme1.xml  

        var tables = xl.folder("theme")
        tables.file("theme1.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>')

        // docProps/core.xml  

        var docProps = zip.folder("docProps");

        docProps.file("core.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><cp:lastModifiedBy>Splunk Security Essentials</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2019-07-02T21:37:26Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2019-07-02T23:58:34Z</dcterms:modified></cp:coreProperties>')


        // docProps/app.xml 
        docProps.file("app.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Macintosh Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Security Essentials</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>')


        // xl/sharedStrings.xml    
        let stringArray = [];
        let countTotal = 0;
        let countUnique = 0;
        for(let str in sharedStrings){
            countTotal += sharedStrings[str]['count']
            countUnique += 1;
            stringArray[sharedStrings[str]['id']] = str;
        }
        let allSharedStringsInOrder = ""

        window.dvlog = []
        for(let i = 0; i < stringArray.length; i++){
            if(stringArray[i]){
                //allSharedStringsInOrder += '<si><t>' + encodeURIComponent( stringArray[i].replace(/<\/*[a-z]{1,8}>/g, "").replace(/<\/*[a-z]{1,8} [a-z]\w*=\".*?>/g, "") ).replace(/\%2C/g, ",").replace(/\%20/g, " ").replace(/\%3A/g, ":").replace(/\%0A/g, "\n") + '</t></si>'
                allSharedStringsInOrder += '<si><t>' + stringArray[i].replace(/<\/*[a-z]{1,8}>/g, "").replace(/<\/*[a-z]{1,8} [a-z]\w*=\".*?>/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;") + '</t></si>'
            }else if(stringArray[i] == ""){
                // No action
            }else{
                allSharedStringsInOrder += '<si><t>ERROR!</t></si>'
                
            }
        }
        let sharedStringsOutput = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + countTotal + '" uniqueCount="' + countUnique +'">' + allSharedStringsInOrder + '</sst>'
        xl.file('sharedStrings.xml', sharedStringsOutput)



        var worksheets = xl.folder("worksheets");
        let sheetData_workbook_xml = ''
        let sheetData_workbook_xml_rels = ''
        let sheetData_content_types_xml = ''
        let sheetdata_rels = ''
        let counter = 1;
        for(let sheet in sheets){
            let sheetOutput;
            let add = false;
            if(sheets[sheet]['sheetXML']){
                sheetOutput = sheets[sheet]['sheetXML']
                add = true;
            }else{

                if(sheets[sheet]['rows'].length > 0){
                    add = true;
                }
                sheetOutput = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{00000000-0001-0000-0700-000000000000}"><dimension ref="A1:Z571"/><sheetViews><sheetView tabSelected="1" workbookViewId="0"><selection activeCell="A1" sqref="A1"/></sheetView></sheetViews><sheetFormatPr baseColWidth="10" defaultColWidth="11.1640625" defaultRowHeight="15" customHeight="1" x14ac:dyDescent="0.2"/><cols>'
                let columnCounter = 1;
                let rowCounter = 1;
                let firstRow = "";

                let descriptionRow = ""
                if(sheets[sheet]['descriptionRow'] && sheets[sheet]['descriptionRow'] != ""){
                    descriptionRow = '<row r="' + rowCounter + '" spans="1:26" ht="15" customHeight="1" x14ac:dyDescent="0.2"><c r="A' + rowCounter + '" s="6" t="s"><v>' + getRefForString(sheets[sheet]['descriptionRow']) + '</v></c>'
                    for(let i = 1; i < sheets[sheet]['columns'].length; i++){
                        descriptionRow += "<c><v></v></c>"
                    }
                    descriptionRow += "</row>"
                    // console.log("Adding the following row for SOAR", descriptionRow, "with content", sharedStrings[sheets[sheet]['descriptionRow']])
                    rowCounter++;
                }

                for(let i=0; i < sheets[sheet]['columns'].length; i++){
                    let columnWidth = "10.1640625";
                    if(sheets[sheet]['columns'][i]['width'] && sheets[sheet]['columns'][i]['width']>0){
                        columnWidth = sheets[sheet]['columns'][i]['width']
                    }
                    sheetOutput += '<col min="' + columnCounter + '" max="' + columnCounter + '" width="' + columnWidth + '" customWidth="1"/>'
                    firstRow += '<c r="' + numToAlpha(columnCounter) + rowCounter + '" s="4" t="s"><v>' + sheets[sheet]['columns'][i]['ref'] + '</v></c>'
                    columnCounter++;
                }
                sheetOutput += '<col min="' + columnCounter + '" max="' + columnCounter + '" width="10.1640625" customWidth="1"/>'
                sheetOutput += '</cols><sheetData>'
                
                sheetOutput += descriptionRow
                
                sheetOutput += '<row r="' + rowCounter + '" spans="1:26" ht="15.75" customHeight="1" x14ac:dyDescent="0.2">' + firstRow + '</row>'
                for(let i = 0; i < sheets[sheet]['rows'].length; i++){
                    rowCounter++;
                    columnCounter = 1;
                    //sheetOutput += '<row r="' + rowCounter + '" spans="1:26" ht="43" customHeight="1" x14ac:dyDescent="0.2">'
                    sheetOutput += '<row r="' + rowCounter + '" spans="1:26" x14ac:dyDescent="0.2">'
                    for(let g = 0; g < sheets[sheet]['rows'][i].length; g++){
                        sheetOutput += '<c r="' + numToAlpha(columnCounter) + rowCounter + '" s="6" t="s"><v>' + sheets[sheet]['rows'][i][g] + '</v></c>'
                        columnCounter++;
                    }
                    sheetOutput += '</row>'
                }
                sheetOutput += '</sheetData><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0" footer="0"/><pageSetup orientation="portrait"/></worksheet>'
            }
            if(add){
                worksheets.file(sheet + ".xml", sheetOutput)
                let relationshipId = "rId" + counter;
                let sheetId = counter + 8;
                let name = sheets[sheet]['name'];
                if(name.length > 30){
                    name = name.substr(0,30)
                }
                counter++;
    
                sheetdata_rels += '<Relationship Id="' + relationshipId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
                sheetData_workbook_xml += '<sheet name="' + name + '" sheetId="' + sheetId + '" r:id="' + relationshipId + '"/>'
                sheetData_workbook_xml_rels += '<Relationship Id="' + relationshipId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/' + sheet + '.xml"/>'
                sheetData_content_types_xml += '<Override PartName="/xl/worksheets/' + sheet + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
                
            }
        }
        
        let themeId = "rId" + counter
        let styleId = "rId" + (counter + 1)
        let sharedId = "rId" + (counter + 2)
        //   [Content_Types].xml
        zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' + sheetData_content_types_xml + '<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');

        // xl/_rels/workbook.xml.rels  
        
        var xl_rels = xl.folder("_rels");
        xl_rels.file("workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="' + styleId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="' + themeId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>' + sheetData_workbook_xml_rels + '<Relationship Id="' + sharedId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>')

        // xl/workbook.xml         
        xl.file("workbook.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15 xr xr6 xr10 xr2" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6" xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"><fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="10609"/><workbookPr defaultThemeVersion="166925"/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice Requires="x15"><x15ac:absPath url="/Users/dveuve/Downloads/xlsx testing/ssesheetonly/" xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"/></mc:Choice></mc:AlternateContent><xr:revisionPtr revIDLastSave="0" documentId="13_ncr:1_{DBEF1108-F6C1-D343-AC2E-3E5F1D00900A}" xr6:coauthVersionLast="43" xr6:coauthVersionMax="43" xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}"/><bookViews><workbookView xWindow="0" yWindow="460" windowWidth="33600" windowHeight="19620" xr2:uid="{00000000-000D-0000-FFFF-FFFF00000000}"/></bookViews><sheets>' + sheetData_workbook_xml + '</sheets><calcPr calcId="0"/></workbook>');
        

        var rels = zip.folder("_rels");
        rels.file(".rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');



        zip.generateAsync({ type: "blob" })
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, "Splunk_Security_Content.xlsx");
                //console.log("Here's my content", content)
            });
    })
}
