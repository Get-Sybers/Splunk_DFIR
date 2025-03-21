// console.log("Loading..")
// SimpleXML Extension
require([
    'underscore',
    'jquery',
    Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/BuildTile.js"),
    Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/Modal.js"),
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, BuildTile, Modal) {
    
    let categoryInterval = setInterval(function(){
        if(splunkjs.mvc.Components.getInstance("categoryBasis")){
            clearInterval(categoryInterval)

            splunkjs.mvc.Components.getInstance("categoryBasis").on('search:done', function(properties) {
                var smid = properties.content.request.label
                if (properties.content.resultCount == 0) {
                } else {
                    var results = splunkjs.mvc.Components.getInstance("categoryBasis").data('results', { output_mode: 'json', count: 0 });
                    results.on("data", function(properties) {
                        var smid = properties.attributes.manager.id
                        var data = properties.data().results

                        // console.log("Got a categoryBasis Data", data)
                        let listOfCategories = {}
                        for(let i = 0; i < data.length; i++){
                            if(data[i].category){
                                // console.log("Analyzing", data[i].category)
                                let categories;
                                if(typeof data[i].category == "string"){
                                    categories = data[i].category.split("|")
                                }else{
                                    categories = data[i].category
                                }
                                for(let g = 0; g < categories.length; g++){
                                    if(categories[g] != ""){

                                        if(! listOfCategories[categories[g]]){
                                            listOfCategories[categories[g]] = {"available": 0, "enabled": 0}
                                        }
                                        
                                        if(data[i].enabled == "Yes"){
                                            listOfCategories[categories[g]].enabled++;
                                        }else{
                                            listOfCategories[categories[g]].available++;
                                        }
                                    }
                                }
                            }
                            
                        }
                        var tiles = $('<ul class="showcase-list"></ul>')
                        let sorted_categories = Object.keys(listOfCategories).filter(function(category){
                            return listOfCategories[category].available + listOfCategories[category].enabled > 10
                        })
                        sorted_categories.sort(function(a, b){
                            if(listOfCategories[a].enabled > listOfCategories[b].enabled){
                                return -1
                            }
                            if(listOfCategories[a].enabled < listOfCategories[b].enabled){
                                return 1
                            }
                            if(listOfCategories[a].available > listOfCategories[b].available){
                                return -1
                            }
                            if(listOfCategories[a].available < listOfCategories[b].available){
                                return 1
                            }
                            return 0
                        })
                        let desiredCategories = []
                        let PlusSignCategory = $('<li class="showcaseItemTile plusSign" style="display: none; height: 50px; width: 180px;"></li>').append($("<div class=\"contentstile\"></div>").append(
                            $("<div style=\"display: block; width: 180px; position: relative; \"></div>"),
                            $('<div class="showcase-list-item-content" style="color: gray; line-height: 50px; font-size: 40px; padding-left: 65px;"></div>').append('<i class="icon-plus-circle" style=""/>')
                            )
                        ).click(function(evt){
                            
                                $(".showcaseItemTile").show()
                                $(".showcaseItemTile.plusSign").hide()
                            
                        })
                        for(let i = 0; i < sorted_categories.length; i++){
                            let category = sorted_categories[i]
                                let myElement = $('<li class="showcaseItemTile" data-category="' + category + '" style="height: 50px; width: 180px;"></li>').append($("<div class=\"contentstile\"></div>").append(
                                    $("<div style=\"display: block; width: 180px; position: relative; \"></div>").append(
                                        $('<div  style="display: inline-block; height: 25px;  width: 180px;"  class="showcase-list-item-title"></div>').append(
                                                '  <h3>' + category + '</h3>'
                                        )
                                    ),
                                    $('<div style="" class="showcase-list-item-content"></div>').append(
                                        $('<div style="display: inline-block; width: 85px;">').text(Splunk.util.sprintf(_("%s Enabled").t(), listOfCategories[category].enabled ) ),
                                        $('<div style="display: inline-block; width: 10px;">|</div>'), 
                                        $('<div style="display: inline-block; width: 85px;" >').text(Splunk.util.sprintf(_("%s Available").t(), listOfCategories[category].available ) )
                                    )
                                )).click(function(evt){
                                    let obj = $(evt.target)
                                    let category = obj.attr("data-category")
                                    if(!category){
                                        obj = obj.closest(".showcaseItemTile")
                                        category = obj.attr("data-category")
                                    }
                                    // console.log("Got a click on", category, desiredCategories, desiredCategories.indexOf(category))
                                    if(desiredCategories.indexOf(category) >= 0){
                                        desiredCategories.splice(desiredCategories.indexOf(category), 1)
                                        obj.removeClass("topSearchHit")
                                        obj.hide()
                                        if(desiredCategories.length>0){
                                            splunkjs.mvc.Components.getInstance("submitted").set("categories", '(category="' + desiredCategories.join('" OR category="') + '")')
                                            splunkjs.mvc.Components.getInstance("default").set("categories", '(category="' + desiredCategories.join('" OR category="') + '")')
                                        }else{
                                            $(".showcaseItemTile").show()
                                            $(".showcaseItemTile.plusSign").hide()
                                            splunkjs.mvc.Components.getInstance("submitted").unset("categories")
                                            splunkjs.mvc.Components.getInstance("default").unset("categories")
                                            splunkjs.mvc.Components.getInstance("submitted").unset("allready")
                                            splunkjs.mvc.Components.getInstance("default").unset("allready")
                                        }
                                    }else{
                                        desiredCategories.push(category)
                                        obj.addClass("topSearchHit")
                                        $(".showcaseItemTile:not(.topSearchHit)").hide()
                                        $(".showcaseItemTile.plusSign").show()
                                        splunkjs.mvc.Components.getInstance("submitted").set("categories", '(category="' + desiredCategories.join('" OR category="') + '")')
                                        splunkjs.mvc.Components.getInstance("default").set("categories", '(category="' + desiredCategories.join('" OR category="') + '")')
                                    }
                                    
                                })
                                tiles.append(myElement);
                            
                            
                        }
                        // console.log("CategoryBasis", listOfCategories)
                        $("#categoryList").html(tiles.append(PlusSignCategory))
                    })
                }
            });
        }
    }, 100) 


    let myInterval = setInterval(function(){
        if(splunkjs.mvc.Components.getInstance("focusedList")){
            clearInterval(myInterval)

            splunkjs.mvc.Components.getInstance("focusedList").on('search:done', function(properties) {
                var smid = properties.content.request.label
                if (properties.content.resultCount == 0) {
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
                            let availableTiles = $('<ul class="showcase-list"></ul>')
                            let enabledTiles = $('<ul class="showcase-list"></ul>')
                            let doMVConversion = ["usecase", "category" , "domain", "datasource", "data_source_categories", "data_source_categories_display", "mitre", "mitre_tactic", "mitre_tactic_display", "mitre_technique", "mitre_technique_display", "mitre_sub_technique", "mitre_sub_technique_display", "mitre_threat_groups", "mitre_matrix", "killchain", "search_title" , "productId"]
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
                                if(data[i].enabled == "Yes"){
                                    enabledTiles.append($("<li style=\"width: 230px; height: 320px\"></li>").append(tile))
                                }else{
                                    availableTiles.append($("<li style=\"width: 230px; height: 320px\"></li>").append(tile))
                                }
 
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
                            if(availableTiles.children().length){
                                $("#available_content_list").html(availableTiles)
                            }else{
                                $("#available_content_list").html("<p>None Found</p>")
                            }
                            
                            if(enabledTiles.children().length){
                                $("#enabled_content_list").html(enabledTiles)
                            }else{
                                $("#enabled_content_list").html("<p>None Found</p>")
                            }
                            
                        } else {
                            //
                        }
                    })
                }
            });
        }
    }, 100)    
});


// 