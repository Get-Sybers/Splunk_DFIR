
define([
    "showdown",
], function(showdown) {
    require([
        'underscore',
        'jquery',
        'splunkjs/mvc',
        'splunkjs/mvc/searchmanager',
        'splunkjs/mvc/searchbarview',
        'splunkjs/mvc/tableview',
        'splunk.util',
        'splunkjs/mvc/simplexml/ready!'
    ], function(_, $, mvc, SearchManager, SearchBarView, TableView, splunkUtil) {

        let tokenModel = mvc.Components.get('default');
        let renderedComponents = [];

        let templ = `
                 <div class="as_title_attr_bar">
                    <div class="as_title_attr">
                        <strong>Category: </strong><span id="as_label_category"></span>
                    </div>
                    <div class="as_title_attr">
                        <strong>Version: </strong><span id="as_label_version"></span>
                    </div>
                    <div class="as_title_attr">
                        <strong>Created: </strong><span id="as_label_created"></span>
                    </div>
<!--                    <div class="as_title_attr">-->
<!--                        <strong>Modified: </strong><span id="as_label_modified"></span>-->
<!--                    </div>-->
                </div>
                <div class="headline_story">
                    <div class="heading-story">
                        <h1 id="story_heading"></h1>
                    </div>
                </div>
                <div class="as_story_details">
                    <div class="as_story_details_right_col">
                        <div class="as_story_detail_right_attr_label">
                            <strong>Description: </strong>
                        </div>
                        <div class="as_story_detail_right_attr_label">
                            <span id="description"></span>
                        </div>
                        <div class="as_story_detail_right_attr_label">
                            <strong>Narrative: </strong>
                        </div>
                        <div class="as_story_detail_right_attr_label narrative_value">
                            <span id="narrative"></span>
                        </div>
                    </div>
                    <div class="as_story_details_left_col">
                        <div class="as_left_attr">
                            <div class="as_story_detail_left_attr_label">
                                <strong>ATT&CK: </strong>
                            </div>
                            <div class="as_story_detail_left_attr" id="mitre_attack">
                            </div>
                        </div>
                        <div class="as_left_attr">
                            <div class="as_story_detail_left_attr_label">
                                <strong>Kill Chain Phases: </strong>
                            </div>
                            <div class="as_story_detail_left_attr kill_chain_phases" id="kill_chain_phases">
                            </div>
                        </div>
<!--                        <div class="as_left_attr">-->
<!--                            <div class="as_story_detail_left_attr_label">-->
<!--                                <strong>CIS Controls: </strong>-->
<!--                            </div>-->
<!--                            <div class="as_story_detail_left_attr" id="cis_20">-->
<!--                            </div>-->
<!--                        </div>-->
                        <div class="as_left_attr">
                            <div class="as_story_detail_left_attr_label">
                                <strong>Data Model: </strong>
                            </div>
                            <div class="as_story_detail_left_attr" id="data_model">
                            </div>
                        </div>
                        <div class="as_left_attr">
                            <div class="as_story_detail_left_attr_label">
                                <strong>References: </strong>
                            </div>
                            <div class="as_story_detail_left_attr" id="references">
                            </div>
                        </div>
                    </div>
                 </div>
                 <div class="as_search_details">
                    <h1 id="searchesHeader">
                        Analytic Story Detection Searches
                    </h1>
                    <div>
                        <div id="search_detection">
                        </div>
                    </div>
                 </div>
                `;

        $('#analytic_story_details')
            .html(_.template(templ));

        if (tokenModel.get('analytic_story_name')) {
            fetchAnalyticStoryDetails(tokenModel.get('analytic_story_name'));
        }

        tokenModel.on('change:analytic_story_name', function(model, value, options) {
            fetchAnalyticStoryDetails(value);
        });

        function fetchAnalyticStoryDetails(asName) {
            let epoch = (new Date).getTime();
            // search: '| sseanalytics splunk_server=local count=0 | search title="' + asName + '" | spath input=reference path={} output=ref | spath input=data_models path={} output=dm | table title, category, description, version, mappings, creation_date, modification_date, dm, narrative, ref'
            searchstr = '| ssedata config="Splunk_Research_Stories" | search analytic_story="' + asName + '"'
            let searchGetAnalyticStoryData = new SearchManager({
                id: epoch,
                earliest_time: '-1h@h',
                latest_time: 'now',
                cache: false,
                search: searchstr
            });


            let asSearch = splunkjs.mvc.Components.getInstance(epoch);
            let asResults = asSearch.data('results', {
                count: 0
            });
            asResults.on('data', function() {
                let as_attributes = JSON.parse(asResults.data().rows[0][2])[0];

                let data = {}

                if(as_attributes.tags.category.length > 0){
                    data['category'] = as_attributes.tags.category;
                }

                data['usecase'] = as_attributes.tags.usecase;
                data['creation_date'] = as_attributes.date;
                data['name'] = as_attributes.name;
                data['version'] = as_attributes.version;
                data['mitre_attack_tactics'] = as_attributes.tags.mitre_attack_tactics;
                data['narrative'] = as_attributes.narrative;
                data['description'] = as_attributes.description;
                data['datamodels'] = as_attributes.tags.datamodels;
                data['kill_chain_phases'] = as_attributes.tags.kill_chain_phases;
                data['references'] = as_attributes.references;

                renderStoryAttributes(data);
            });

            var searchGetSearchesData = new SearchManager({
                id: 's' + epoch,
                earliest_time: '-1h@h',
                latest_time: 'now',
                cache: false,
                search: '| ssedata config="Splunk_Research_Detections" | search analytic_story="' + asName + '"' 

            });
            var searchesSearch = splunkjs.mvc.Components.getInstance('s' + epoch);
            var searchesResults = searchesSearch.data('results', {
                count: 0
            });


            searchesResults.on('data', function() {
                var rows = searchesResults.data().rows;

                let asSearchAttr = JSON.parse(rows[0][2]);
                asSearchesAttributes = [];
                for(let i=0; i<asSearchAttr.length; i++) {
                    let data = {}

                    data['mitre_attack_id'] = asSearchAttr[i]["tags"]["mitre_attack_id"];
                    data['kill_chain_phases'] = asSearchAttr[i]["tags"]["kill_chain_phases"];
                    data['cis_controls'] = asSearchAttr[i]["tags"]["cis20"];
                    data['datamodels'] = asSearchAttr[i]["datamodel"];
                    data['name'] = asSearchAttr[i]["name"];
                    data['confidence'] = asSearchAttr[i]["tags"]["confidence"];
                    data['creation_date'] = asSearchAttr[i]["date"];
                    data['description'] = asSearchAttr[i]["description"];
                    data['search'] = asSearchAttr[i]["search"];
                    data['how_to_implement'] = asSearchAttr[i]["how_to_implement"];
                    data['known_false_positives'] = asSearchAttr[i]["known_false_positives"];
                    asSearchesAttributes.push(data);
                }

                renderSearches(asSearchesAttributes);
            });
        }

        function renderStoryAttributes(asAttributes) {
            let converter = new showdown.converter();
            // let mappings = JSON.parse(asAttributes.mappings);
            $('#as_label_category')
                .html(asAttributes.category);
            $('#as_label_version')
                .html(asAttributes.version);
            $('#as_label_created')
                .html(asAttributes.creation_date);
            $('#as_label_modified')
                .html("asAttributes.modification_date");
            $('#story_heading')
                .html(asAttributes.name);
            // $('#attack')
            //     .html(asAttributes.mitre_attack_tactics);
            $('#narrative')
                .html(asAttributes.narrative);
            $('#description')
                .html(asAttributes.description);
            $('#mitre_attack')
                .html(getValueLabels(asAttributes.mitre_attack_tactics, 'attack_tag'));
            $('#data_model')
                .html(getValueLabels(asAttributes.datamodels, 'data_model_tag'));
            $('#kill_chain_phases')
                .html(getValueLabels(asAttributes.kill_chain_phases, 'kill_chain_tag'));
            // $('#cis_20')
            //     .html(getValueLabels(asAttributes.escu_cis));
            $('#references')
                .html(getReferenceURLS(asAttributes.references));
        }

        function getReferenceURLS(refs) {
            if (refs === null) {
                return ' ';
            } else {
                let refsResult = ``;
                if (Array.isArray(refs)) {
                    refs.map(ref => {
                        refsResult = refsResult + `<a href="${ref}">${ref}</a><br />`;
                    });
                } else {
                    refsResult = refsResult + `<a href="${refs}">${refs}</a><br />`;
                }

                return refsResult;
            }
        }

        function renderSearches(asSearches) {
            clearSearchView();
            let i = 0;
            let converter = new showdown.converter();
            asSearches.forEach(search => {
                i++;
                let epoch = (new Date).getTime();
                let searchID = `#search${i}` + Date.now();
                let resultID = `#result${i}` + Date.now();
                let searchSelector = `search${i}` + Date.now();
                let controlID = `as_search${i}` + Date.now();
                let resultsControlID = `as_results_search${i}` + Date.now();
                let btnID = `btn_content_${i}`;

                let searchPanel = `
                            <h3>${search['name']}</h3>
                            <div class="search_content" id="${searchSelector}-content">
                                <div class="search_left_panel">
                                    <button class="configure_in_content btn btn-primary" id="${btnID}"  data-search-name="${search['name']}">Configure</button>
                                    <div class="search_left_attr">
                                        <div class="search_left_attr_label">
                                            <strong>Description</strong>
                                        </div>
                                        <div class="search_left_attr_value">
                                            ${converter.makeHtml(search['description'])}
                                        </div>
                                    </div>
                                    <div class="search_left_attr">
                                        <div class="search_left_attr_label">
                                            <strong>Search</strong>
                                        </div>
                                        <div class="search_left_attr_value ${controlID}">
                                        </div>
                                        <div class="search_left_attr_value ${resultsControlID}">
                                        </div>
                                    </div>
                                    <div class="search_left_attr">
                                        <div class="search_left_attr_label">
                                            <strong>How to Implement</strong>
                                        </div>
                                        <div class="search_left_attr_value">
                                            ${converter.makeHtml(search['how_to_implement'])}
                                        </div>
                                    </div>
                                    <div class="search_left_attr">
                                        <div class="search_left_attr_label">
                                            <strong>Known False Positives</strong>
                                        </div>
                                        <div class="search_left_attr_value">
                                            ${converter.makeHtml(search['known_false_positives'])}
                                        </div>
                                    </div>
                                    <div class="search_left_attr">
                                        <div class="search_left_attr_label">
                                            <strong>Configure</strong>
                                        </div>
                                        <div class="search_left_attr_value">
                                        Click on the Configure button above which will redirect you to the Security Content page where you can schedule and configure any prerequisites such as data sources, macros and lookups.
                                        </div>
                                    </div>
                                </div>
                                <div class="search_right_panel">
                                    <div class="search_right_attr data_model_srch_attr">
                                        <div class="search_right_attr_label">
                                            <strong>Data Models</strong>
                                        </div>
                                        <div class="search_right_attr_value">
                                            ${getValueLabels(search['datamodels'], 'data_model_tag')}
                                        </div>
                                    </div>
                                </div>
                            </div>`;

                    $('#search_detection')
                        .append(searchPanel);
                    // Adding extra params to detection search
                    let detectionAttrTop = `
                <div class="search_right_attr">
                    <div class="search_right_attr_label">
                        <strong>ATT&CK</strong>
                    </div>
                    <div class="search_right_attr_value">
                        ${getValueLabels(search['mitre_attack_id'], 'attack_tag')}
                    </div>
                </div>
                <div class="search_right_attr">
                    <div class="search_right_attr_label">
                      <strong>Kill Chain Phases</strong>
                    </div>
                    <div class="search_right_attr_value">
                        ${getValueLabels(search['kill_chain_phases'], 'kill_chain_tag')}
                    </div>
                </div>
                <div class="search_right_attr">
                    <div class="search_right_attr_label">
                        <strong>CIS Controls</strong>
                    </div>
                    <div class="search_right_attr_value">
                        ${getValueLabels(search['cis_controls'])}
                    </div>
                </div>
                `;

                    let detectionAttrBottom = `
                
                <div class="search_right_attr">
                    <div class="search_right_attr_label">
                        <strong>Confidence</strong>
                    </div>
                    <div class="search_right_attr_value">
                        ${search['confidence']}
                    </div>
                </div>
                 <div class="search_right_attr">
                    <div class="search_right_attr_label">
                        <strong>Creation Date</strong>
                    </div>
                    <div class="search_right_attr_value">
                        ${search['creation_date']}
                    </div>
                </div>
                `;

                    $(detectionAttrTop)
                        .insertBefore($(`#${searchSelector}-content`)
                            .find('.data_model_srch_attr'));
                    $(`#${searchSelector}-content`)
                        .find('.search_right_panel')
                        .append(detectionAttrBottom);
                    // $(`#${searchSelector}-eli5`)
                    //     .append(detectionLeftAttr);


                /*
                let updatedAttr = `
                <div class="search_right_attr">
                    <div class="search_right_attr_label">
                        <strong>Last Updated</strong>
                    </div>
                    <div class="search_right_attr_value">
                        ${ search['updated'] }
                    </div>
                </div>
                `;
                $(`#${searchSelector}-content`).find('.search_right_panel').append(updatedAttr);
                */
                $(`#${btnID}`)
                .on('click', function(){
                    url = `app/Splunk_Security_Essentials/showcase_security_content?showcaseId=`+search['name'].toLowerCase().replaceAll(" ","_")
                    splunkUtil.redirect_to(url, {
                        contentURL: url
                    }
                    , window.open(), true);
                });

                let searchManagerID = search['name'].split(' ')
                    .join('' + Date.now());

                let searchManager = new SearchManager({
                    id: searchManagerID,
                    earliest_time: '-24h@h',
                    latest_time: 'now',
                    status_buckets: 300,
                    required_field_list: '*',
                    preview: true,
                    cache: true,
                    autostart: false, // Prevent the search from running automatically
                    search: search['search'],
                });

                let searchBar = new SearchBarView({
                    id: searchID,
                    managerId: searchManagerID,
                    timerange: true,
                    el: $('.' + controlID),
                    value: search['search'],
                    timerange_preset: 'Last 24 hours'
                }).render();

                let tableviewer = new TableView({
                    id: resultsControlID,
                    managerid: searchManagerID,
                    pageSize: 5,
                    el: $('.' + resultsControlID)
                }).render();

                searchBar.on('change', function() {
                    searchManager.settings.unset('search');

                    // Update the search query
                    searchManager.settings.set('search', searchBar.val());

                    // Run the search (because autostart=false)
                    searchManager.startSearch();
                });

                searchBar.timerange.on('change', function() {
                    // Update the time range of the search
                    searchManager.search.set(searchBar.timerange.val());

                    // Run the search (because autostart=false)
                    searchManager.startSearch();
                });


                renderedComponents.push(searchID, searchManagerID, resultsControlID);

            });

            $('#search_detection')
                .accordion({
                    heightStyle: 'content'
                });
        }

        function clearSearchView() {

            if ($('#search_detection')
                .hasClass('ui-accordion')) {
                $('#search_detection')
                    .accordion('destroy');
                $('#search_detection')
                    .empty();
            }



            let len = renderedComponents.length;
            while (len--) {
                let id = renderedComponents.pop();
                mvc.Components.getInstance(id)
                    .dispose();
            }
        }

        function getValueLabels(values, className) {
            let cls = '';
            if (className !== undefined || className) {
                cls = className;
            }
            let valueArray = [];
            if (values) {
                if (typeof values === 'string') {
                    valueArray.push(values);
                } else {
                    valueArray = values;
                }
            }
            let htmlTmpl = '';
            valueArray.forEach(val => {
                htmlTmpl += `<div class="value_label ${cls}">${val}</div>&nbsp;`;
            });

            return htmlTmpl;
        }
    });
})
