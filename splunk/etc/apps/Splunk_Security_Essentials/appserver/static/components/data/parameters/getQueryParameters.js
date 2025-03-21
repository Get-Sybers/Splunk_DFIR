(function() {
  define(function(require, exports, module) {
    var getQueryParameters;
    return getQueryParameters = function(searchUri) {
      var i, len, name, nameAndValue, nameToValueMap, searchComponent, searchComponents, value;
      nameToValueMap = {};
      if (searchUri.length > 1) {
        searchComponents = searchUri.substring(1);
        searchComponents = searchComponents.split("&");
        for (i = 0, len = searchComponents.length; i < len; i++) {
          searchComponent = searchComponents[i];
          nameAndValue = searchComponent.split("=");
          name = nameAndValue[0];
          name = decodeURIComponent(name);
          value = "";
          if (nameAndValue.length > 1) {
            value = nameAndValue[1];
            value = decodeURIComponent(value);
          }
          nameToValueMap[name] = value;
        }
      }
      return nameToValueMap;
    };
  });

}).call(this);
