'use strict';

define([], function () {

    return {
            runPreReqs: function runPreReqs(prereqs){
            if(prereqs.length > 0){
                window.datacheck = []
                //console.log("Got " + prereqs.length + " prereqs!");
                $("<div id=\"row11\" class=\"dashboard-row dashboard-row1 splunk-view\">        <div id=\"panel11\" class=\"dashboard-cell last-visible splunk-view\" style=\"width: 100%;\">            <div class=\"dashboard-panel clearfix\" style=\"min-height: 0px;\"><h2 class=\"panel-title empty\"></h2><div id=\"view_22841\" class=\"fieldset splunk-view editable hide-label hidden empty\"></div>                                <div class=\"panel-element-row\">                    <div id=\"element11\" class=\"dashboard-element html splunk-view\" style=\"width: 100%;\">                        <div class=\"panel-body html\">                            <table class=\"table table-striped\" id=\"data_check_table\" >                            <tr><td>Data Check</td><td>Status</td><td>Open in Search</td><td>Resolution (if needed)</td></tr>                            </table>                        </div>                    </div>                </div>            </div>        </div>    </div>").insertBefore($(".fieldset").first())
                for(var i = 0; i < prereqs.length; i++){
                    window.datacheck[i] = new Object
                    // create table entry including unique id for the status
                    $("#data_check_table tr:last").after("<tr><td>" + prereqs[i].name + "</td><td id=\"data_check_test"+ i + "\">Checking...</td><td><a target=\"_blank\" href=\"" + Splunk.util.make_full_url("/app/Splunk_Security_Essentials/search?q="+encodeURI(prereqs[i].test)) + "\">Open in Search</a></td><td>" + prereqs[i].resolution + "</td></tr>")

                    // create search manager

                    window.datacheck[i].mainSearch = new SearchManager({
                        "id": "data_check_search" + i,
                        "cancelOnUnload": true,
                        "latest_time": "",
                        "status_buckets": 0,
                        "earliest_time": "0",
                        "search": prereqs[i].test,
                        "app": appName,
                        "auto_cancel": 90,
                        "preview": true,
                        "runWhenTimeIsUndefined": false
                    }, {tokens: true, tokenNamespace: "submitted"});

                
                    window.datacheck[i].myResults = window.datacheck[i].mainSearch.data('results', { output_mode:'json', count:0 });

                    window.datacheck[i].mainSearch.on('search:error', function(properties) {
                        var searchName = properties.content.request.label
                        var myCheckNum = searchName.substr(17,20)
                        document.getElementById("data_check_test" + itemid).innerHTML = "Error"; 
                        //console.log("Data Check Failure code 3", searchName, myCheckNum, prereqs[itemid])
                        
                    });
                    window.datacheck[i].mainSearch.on('search:done', function(properties) {
                        var searchName = properties.content.request.label
                        var myCheckNum = searchName.substr(17,20)
                        
                        //console.log("Got Results from Data Check Search", searchName, myCheckNum, properties);

                        if(window.datacheck[myCheckNum].mainSearch.attributes.data.resultCount == 0) {
                          document.getElementById("data_check_test" +myCheckNum).innerHTML = "Error";
                          //console.log("Data Check Failure code 1", preqreqs[myCheckNum])
                          return;
                        }       

                        window.datacheck[myCheckNum].myResults.on("data", function(properties) {
                            
                            var searchName = properties.attributes.manager.id
                            var myCheckNum = searchName.substr(17,20)
                            var data = window.datacheck[myCheckNum].myResults.data().results;
                            
                            status = false;
                            if(typeof  data[0][prereqs[myCheckNum].field] !== "undefined"){
                                status=true;
                                if(typeof  prereqs[myCheckNum].greaterorequalto !== "undefined"){
                                    if(data[0][prereqs[myCheckNum].field] >= prereqs[myCheckNum].greaterorequalto){
                                        status = true;
                                    }else{
                                        status = false;
                                    }
                                }
                            }
                            
                            if(status=="true"){
                                document.getElementById("data_check_test" + myCheckNum).innerHTML = "Success";
                               // console.log("Data Check success",searchName, myCheckNum, prereqs[myCheckNum])
                            }else{
                                document.getElementById("data_check_test" + myCheckNum).innerHTML = "Error"; 
                                //console.log("Data Check Failure code 2",searchName, myCheckNum, prereqs[myCheckNum])
                            }
                            
                        });
                      });

                }
            }
        }
    }
})
