'use strict';

define(['jquery', 'underscore', 'module', 'components/splunk/Forms', /*'components/data/parameters/RoleStorage',*/ 'json!' + $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString], function($, _, module, Forms, /*RoleStorage,*/ ShowcaseInfo) {
    var config = module.config();

    return {
        loadSampleSearches: function loadSampleSearches() {
            var deferred = $.Deferred();
            // console.log("Hello 1")
            require(['json!components/data/sampleSearches/' + config.pageName + '.json'], function(sampleSearches) {
                // console.log("Hello 5", sampleSearches)
                var roleBasedSampleSearches = [];
                var role = "default"; //RoleStorage.getRole(); // DV hacking the roles

                if (ShowcaseInfo.roles[role] != null) {
                    var summaries = ShowcaseInfo.roles[role].summaries;
                    if (summaries != null && summaries.length > 0) {
                        summaries.forEach(function(summary) {

                            //showcase_linear_regression_biz, showcase_classification_biz, etc...
                            var examples = ShowcaseInfo.summaries[summary].examples;
                            if (examples != null && examples.length > 0) {
                                examples.forEach(function(example) {

                                    if (sampleSearches[example.name] != null) roleBasedSampleSearches.push(sampleSearches[example.name]);
                                });
                            }
                        });
                    }
                }

                roleBasedSampleSearches = _.uniq(roleBasedSampleSearches);

                deferred.resolve(roleBasedSampleSearches);
            }, function() {
                deferred.reject();
            });

            return deferred;
        },
        populateSampleSearchDropdown: function populateSampleSearchDropdown(sampleSearchesControl) {
            var onChangeCallback = arguments.length <= 1 || arguments[1] === undefined ? function() {} : arguments[1];
            var defaultDatasetTitle = arguments[2];
            // console.log("How about here?")

            this.loadSampleSearches().then(function(roleBasedSampleSearches) {
                if (roleBasedSampleSearches != null && roleBasedSampleSearches.length > 0) {
                    roleBasedSampleSearches.forEach(function(sampleSearch, index) {

                        var choice = {
                            value: sampleSearch.value,
                            label: sampleSearch.label
                        };

                        choices.push(choice);
                    });

                    sampleSearchesControl.settings.attributes.choices = choices;
                }

                sampleSearchesControl.on("change", function(value) {
                    var currentSampleSearch = null;

                    roleBasedSampleSearches.forEach(function(sampleSearch) {
                        if (sampleSearch.value === value) currentSampleSearch = sampleSearch;
                    });

                    onChangeCallback(currentSampleSearch);
                });

                if (datasetTitle != null) {
                    Forms.setChoiceViewByLabel(sampleSearchesControl, datasetTitle);
                }
            }).always(function() {
                sampleSearchesControl.render();
            });
        },
        getSampleSearchByLabel: function getSampleSearchByLabel(mlToolkitDataset) {
            // console.log("Hello 2", mlToolkitDataset)

            return this.loadSampleSearches().then(function(sampleSearches) {
                var matchingSampleSearch = {};
                // console.log("Hello 4", sampleSearches)
                /*for(var i = 0; i <sampleSearches.length; i++){
                    if(sampleSearches[i].label == mlToolkitDataset){
                        var test = sampleSearches[i]
                        // console.log("Hello 3.5 -- dem apples edition", i, sampleSearches[i], test)
                    }
                }*/
                sampleSearches.forEach(function(sampleSearch) {
                    if (sampleSearch.label === mlToolkitDataset) {
                        // console.log("Hello 3", sampleSearch)
                        matchingSampleSearch = sampleSearch;
                    }
                });

                return matchingSampleSearch;
            });
        }
    };
});