// console.log("Loading..")
// SimpleXML Extension
require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/components/controls/UnattachedModal.js"),
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView, Modal) {
     // Row Coloring Example with custom, client-side range interpretation
    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return _(['color', "productId"]).contains(cell.field);
        },
        render: function($td, cell) {
            // console.log("cell render called", $td, cell);
            if(cell.field == "color"){
                $td.addClass("priority-colored").css("background-color", cell.value);
            }else if(cell.field == "productId"){
                $td.addClass("product-id-present").attr("data-productid", cell.value);
            }
        }
    });
    mvc.Components.get('colorLagTable').getVisualization(function(tableView) {
        tableView.on('rendered', function() {
            // Apply class of the cells to the parent row in order to color the whole row
            // console.log("Loaded rendering");
            setTimeout(function(){
                tableView.$el.find('td.priority-colored').each(function() {
                    // console.log("Got a cell", this, $(this),$(this).css("background-color") )
                    let color = $(this).css("background-color")
                    $(this).closest('tr').find("td").click(function(evt){
                        // console.log("Got a click!", evt.target)
                        let productId = $(evt.target).attr("data-productid")
                        let myModal = new Modal('drilldown', {
                            title: _('Detail').t(),
                            destroyOnHide: true,
                            type: "wide"
                        }, $);
                        $(myModal.$el).on("hide", function() {
                            // Not taking any action on hide, but you can if you want to!
                        })
    
                        let body = $("<div>")
                        let results = window.results_from_latency_search[productId];
                        body.append($("<h3>").text(results.Summary))
                        let conversions = {
                            "baseline_avg_lag": {"sort": 9,"conversion": "timerange", "label": "Baseline: Average Lage Seen"},
                            "baseline_earliest": {"sort": 12,"conversion": "timestamp", "label": "Baseline: Earliest Time"},
                            "baseline_lag_at_last_update": {"sort": 10,"conversion": "timerange", "label": "Baseline: Lag when Baseline Captured"},
                            "baseline_latest": {"sort": 13,"conversion": "timestamp", "label": "Baseline: Latest Time Seen"},
                            "baseline_num_data_samples": {"sort": 11,"conversion": "string", "label": "Baseline: # of Data Samples"},
                            "baseline_update_last_run": {"sort": 14,"conversion": "timestamp", "label": "Basline: When Captured"},
                            "eventcount": {"sort": 8,"conversion": "string", "label": "What Index + Sourcetypes Seen"},
                            "max_lag": {"sort": 6,"conversion": "timerange", "label": "The Minimum Lag Time"},
                            "slowest_lag": {"sort": 7,"conversion": "string", "label": "The Lag Time for the Slowest Sourcetype+Index"},
                            "numDetections": {"sort": 4,"conversion": "string", "label": "# of Detections Dependent"},
                            //"num_events": {"conversion": "round", "label": ""},
                            "productId": {"sort": 5,"conversion": "string", "label": "App-Internal productId"}, 
                            "productName": {"sort": 2,"conversion": "string", "label": "Product Name"}, 
                            "vendorName": {"sort": 1,"conversion": "string", "label": "Vendor Name"}, 
                            //"termsearch": {"conversion": "string", "label": "The search st"}, 
                            "dependent_searches": {"sort": 3,"conversion": "pipe", "label": "The Searches That Are Dependent"}, 
                        }
                        let conversions_array = Object.keys(conversions);
                        conversions_array.sort(function(a ,b){
                            return conversions[a].sort - conversions[b].sort
                        })
                        let table = $("<table class=\"table\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody></tbody></table>")
                        for(let i = 0; i < conversions_array.length; i++){
                            let key = conversions_array[i]
                            if(results[key]){
                                if(key == "dependent_searches"){
                                    // console.log("Got it", results[key])
                                }
                                if(conversions[key]['conversion'] == "string"){
                                    table.find("tbody").append($("<tr>").append($("<td>").text(conversions[key]['label']), $("<td>").text(results[key])))
                                }else if(conversions[key]['conversion'] == "pipe"){
                                    let mylist = $("<ul>");
                                    let items = results[key].split("|");
                                    for(let i = 0; i < items.length; i++){
                                        mylist.append($("<li>").text(items[i]))
                                    }
                                    table.find("tbody").append($("<tr>").append($("<td>").text(conversions[key]['label']), $("<td>").html(mylist)))
                                }else if(conversions[key]['conversion'] == "timestamp"){
                                    let d = new Date(0); 
                                    d.setUTCSeconds(parseInt(results[key])); 
                                    let timestr = d.toLocaleDateString() + " " + d.toLocaleTimeString() + " (Your Browser's timezone)"
                                    table.find("tbody").append($("<tr>").append($("<td>").text(conversions[key]['label']), $("<td>").text(timestr)))
                                }else if(conversions[key]['conversion'] == "timerange"){
                                    let timerange = parseInt(results[key])
                                    let timestr = ""
                                    if(isNaN(timerange)){
                                        timestr = results[key]
                                    }else if(timerange < 0){
                                        timestr = "Future Time " + timerange + " seconds."
                                    }else if(timerange<3600 * 24){
                                        try{
                                            let date = new Date(null);
                                            date.setSeconds(timerange);
                                            timestr = date.toISOString().substr(11, 8);
                                        }catch(error){
                                            timestr = results[key]
                                        }
                                    }else{
                                        try{
                                            var secs = timerange % (3600*24)
                                            var days = (timerange - secs) / (3600*24)
                                            let date = new Date(null);
                                            date.setSeconds(secs);
                                            timestr = days + "d " + date.toISOString().substr(11, 8);
                                        }catch(error){
                                            timestr = results[key]
                                        }
                                        
                                    }
                                    table.find("tbody").append($("<tr>").append($("<td>").text(conversions[key]['label']), $("<td>").text(timestr)))
                                }else if(conversions[key]['conversion'] == "round"){
                                    table.find("tbody").append($("<tr>").append($("<td>").text(conversions[key]['label']), $("<td>").text(Math.round(parseFloat(results[key])*100)/100)))
                                }
                            }
                        }
                        body.append(table)
                        //body.append("<p>" + $("<pre>").text(JSON.stringify(window.results_from_latency_search[productId],null,4))[0] + "</p>")
    
                        myModal.body.html(body)
    
    
    
                        myModal.footer.append($('<button>').attr({
                            type: 'button',
                            'data-dismiss': 'modal',
                            'data-bs-dismiss': 'modal'
                        }).addClass('btn btn-primary').text(_('Close').t()).on('click', function() {
    
                        }))
                        myModal.show()
                    }).css("background-color", color).css("color", "black");
                });
                
                tableView.$el.find('td.product-id-present').each(function() {
                    
                    let productId = $(this).attr("data-productid")
                    $(this).closest('tr').find("td").attr("data-productid", productId)
                });
                
                $("th:contains(color)").remove(); 
                $("td.priority-colored").remove();
                $("th:contains(productId)").remove(); 
                $("td.product-id-present").remove();
            }, 200)
        });
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });





    let myInterval = setInterval(function(){
        if(splunkjs.mvc.Components.getInstance("base_latency_search")){
            clearInterval(myInterval)

            splunkjs.mvc.Components.getInstance("base_latency_search").on('search:done', function(properties) {
                var smid = properties.content.request.label
                if (properties.content.resultCount == 0) {
                    if (failureCallback) {
                        //
                    }
                } else {
                    var results = splunkjs.mvc.Components.getInstance("base_latency_search").data('results', { output_mode: 'json', count: 0 });
                    results.on("data", function(properties) {
                        var smid = properties.attributes.manager.id
                        var data = properties.data().results
                        if (data && data.length && data.length >= 1) {
                            window.results_from_latency_search = {}
                            for(let i = 0; i < data.length; i++){
                                window.results_from_latency_search[data[i].productId] = data[i]
                            }
                        } else {
                            //
                        }
                    })
                }
            });
        }
    })


    
});