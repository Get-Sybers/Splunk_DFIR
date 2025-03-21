(function() {
  define(["splunkjs/mvc"], function(mvc) {
    var Components;
    return Components = (function() {
      function Components() {}

      Components.getComponent = function(id) {
        return mvc.Components.getInstance(id);
      };

      return Components;

    })();
  });

}).call(this);
