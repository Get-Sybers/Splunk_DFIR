(function() {
  define(function(require, exports, module) {
    var importSearchQuery;
    return importSearchQuery = function(searchBarControl, datasetDropdownControl) {
      var Forms, earliestTime, getQueryParameters, getSplunkSearchParameters, latestTime, ref, ref1, referrer, searchString, timeRange, urlParams;
      getQueryParameters = require("./getQueryParameters");
      Forms = require("./../../splunk/Forms");
      urlParams = getQueryParameters(window.location.search);
      
      if ((datasetDropdownControl != null) && (urlParams.ml_toolkit_dataset != null)) {
        // console.log("Dataset Chosen:", urlParams.ml_toolkit_dataset);
        return Forms.setChoiceViewByLabel(datasetDropdownControl, urlParams.ml_toolkit_dataset);
      } else if (searchBarControl != null) {
        getSplunkSearchParameters = function(queryParams) {
          return [queryParams.q || '', queryParams.earliest || '', queryParams.latest || ''];
        };
        ref = getSplunkSearchParameters(urlParams), searchString = ref[0], earliestTime = ref[1], latestTime = ref[2];
        if (searchString.length === 0 && earliestTime.length === 0 && latestTime.length === 0) {
          referrer = document.createElement('a');
          referrer.href = document.referrer;
          if (window.location.host === referrer.host) {
            ref1 = getSplunkSearchParameters(getQueryParameters(referrer.search)), searchString = ref1[0], earliestTime = ref1[1], latestTime = ref1[2];
          }
        }
        timeRange = {
          earliest_time: earliestTime,
          latest_time: latestTime
        };
        searchBarControl.timerange.val(timeRange);
        return searchBarControl.val(searchString);
      }
    };
  });

}).call(this);
