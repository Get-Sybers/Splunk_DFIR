// console.log("Loading..")
// SimpleXML Extension
require([
    'underscore',
    'jquery',
    Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/BuildTile.js"),
    Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/Modal.js"),
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, BuildTile, Modal) {
     
    let myInterval = setInterval(function(){
        if(splunkjs.mvc.Components.getInstance("focusedList")){
            clearInterval(myInterval)

            splunkjs.mvc.Components.getInstance("focusedList").on('search:done', function(properties) {
                var smid = properties.content.request.label
                if (properties.content.resultCount == 0) {
                    if (failureCallback) {
                        //
                    }
                } else {
                    var results = splunkjs.mvc.Components.getInstance("focusedList").data('results', { output_mode: 'json', count: 0 });
                    results.on("data", function(properties) {
                        var smid = properties.attributes.manager.id
                        var data = properties.data().results
                        let objects = {"tactic": [], "technique": [], "threat_groups": []};
                        let totalObjectCount = 0;
                        if (data && data.length && data.length >= 1) {

                            data.sort(function(a, b) {
                                if (a.highlight > b.highlight) return -1;
                                if (a.highlight < b.highlight) return 1;
                                if (a.highlight == b.highlight) {
                                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                                }
                            return 0;
                        })
                            // console.log("Party Ready!", data)
                            let tiles = $('<ul class="showcase-list"></ul>')
                            let doMVConversion = ["usecase", "category" , "domain", "datasource", "data_source_categories", "data_source_categories_display", "mitre", "mitre_tactic", "mitre_tactic_display", "mitre_technique", "mitre_technique_display", "mitre_threat_groups", "mitre_matrix", "killchain", "search_title" , "productId"]
                            for(let i = 0; i < data.length; i++){
                                let captureKeys = {"tactic": "mitre_tactic_display", "technique": "mitre_technique_display", "threat_groups": "mitre_threat_groups"}
                                for(let key in captureKeys){
                                    if(data[i][ captureKeys[key] ] && typeof data[i][ captureKeys[key] ]  == "string" ){
                                        if(objects[key].indexOf( data[i][ captureKeys[key] ] ) == -1){
                                            objects[key].push(data[i][ captureKeys[key] ])
                                            totalObjectCount++;
                                        }
                                    }else if(data[i][ captureKeys[key] ] && typeof data[i][ captureKeys[key] ]  == "object" ){
                                        for(let g = 0 ; g < data[i][ captureKeys[key] ].length; g++){
                                            if(objects[key].indexOf( data[i][ captureKeys[key] ][g] ) == -1){
                                                objects[key].push(data[i][ captureKeys[key] ][g])
                                                totalObjectCount++;
                                            }
                                        }
                                    }
                                }
                                for(let g = 0; g < doMVConversion.length; g++){
                                    if(data[i][doMVConversion[g]] && typeof data[i][doMVConversion[g]] == "object"){
                                        data[i][doMVConversion[g]] = data[i][doMVConversion[g]].join("|")
                                    }
                                }
                                let tile = $(BuildTile.build_tile(data[i], true))
                                
                                tiles.append($("<li style=\"width: 230px; height: 320px\"></li>").append(tile))
                            }
                            // console.log("Here are my objects", objects)
                            let myContainer = $("<div>")
                            
                            if(objects["tactic"].length > 0){
                                let widthPercent = 40// + Math.round((objects["tactic"].length / totalObjectCount) * 25)
                                let mitre = $('<div style="display: inline-block; width: ' + widthPercent + '%;" >')
                                mitre.append("<h3>ATT&CK Tactics</h3>")
                                for(let i = 0; i < objects["tactic"].length; i++){
                                    mitre.append('<div class="contentstooltipcontainer mitre_tactic_displayElements">' + objects["tactic"][i] + '<span class="contentstooltiptext">Red Bubbles indicate the MITRE ATT&amp;CK Tactics detected by this example.</span></div>')
                                }
                                myContainer.append(mitre)
                            }
                            if(objects["technique"].length > 0){
                                let widthPercent = 60
                                let mitre = $('<div style="display: inline-block; width: ' + widthPercent + '%;" >')
                                mitre.append("<h3>ATT&CK Techniques</h3>")
                                for(let i = 0; i < objects["technique"].length; i++){
                                    mitre.append('<div class="contentstooltipcontainer mitre_technique_displayElements">' + objects["technique"][i] + '<span class="contentstooltiptext">Purple Bubbles indicate the MITRE ATT&amp;CK Techniques detected by this example.</span></div>')
                                }
                                myContainer.append(mitre)
                            }
                            // if(objects["threat_groups"].length > 0){
                            //     let widthPercent = 30 + Math.round((objects["threat_groups"].length / totalObjectCount) * 25)
                            //     let mitre = $('<div style="display: inline-block; width: ' + widthPercent + '%;" >')
                            //     mitre.append("<h3>Related Threat Groups Defined in MITRE ATT&CK</h3>")
                            //     for(let i = 0; i < objects["threat_groups"].length; i++){
                            //         mitre.append('<div class="mitre_threat_groupsElements">' + objects["threat_groups"][i] + '</div>')
                            //     }
                            //     myContainer.append(mitre)
                            // }
                            $("#allEventsTab").html(myContainer)
                            $("#content_list").html(tiles)
                        } else {
                            //
                        }
                    })
                }
            });
        }
    })    
});


// 