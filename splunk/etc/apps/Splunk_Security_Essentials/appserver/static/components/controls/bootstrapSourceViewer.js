(function() {
  define(['jquery', 'underscore', 'splunk.util', 'splunkjs/mvc/simplexml/controller', 'backbone', 'srcviewer', 'module'], function(jquery, _, SplunkUtil, DashboardController, Backbone, SourceViewer, module) {
    var addSourceFile, config, pageName, pageNameShowcaseIndex, parseRequires, scriptPath, sourceFileModels, sourceViewerToggle, updateSourceViewerToggleText;
    config = module.config();
    pageName = config.pageName;
    scriptPath = config.scriptPath;
    pageNameShowcaseIndex = pageName.indexOf("showcase_");
    if (pageNameShowcaseIndex !== 0) {
      return;
    }
    sourceFileModels = new Backbone.Collection();
    sourceViewerToggle = $('<button>').addClass('btn').css('margin', '20px 20px 10px 20px');

    /*
    Makes an AJAX request for a source file and adds it to the source code viewer
     */
    addSourceFile = function(requirePath) {
      var deferred, filename, parts;
      deferred = jquery.Deferred();
      requirePath += '.js';
      parts = requirePath.split('/');
      filename = parts[parts.length - 1];
      require(['text!' + requirePath], function(scriptSource) {
        sourceFileModels.add(new Backbone.Model({
          name: filename,
          content: scriptSource
        }));
        return deferred.resolve(scriptSource);
      });
      return deferred;
    };

    /*
    Parse the RequireJS requirements out of a JS file if they belong to this app
     */
    parseRequires = function(scriptSource) {

      /*
      get the part of a string between the first and last occurence of the provided brackets
       */
      var endPos, i, numBrackets, pos, ref, ref1, requireStart, requireString, startAt, startPos;
      requireStart = 'require(';
      startAt = scriptSource.indexOf(requireStart) + requireStart.length;
      startPos = 0;
      endPos = 0;
      numBrackets = 0;
      for (pos = i = ref = startAt, ref1 = scriptSource.length; ref <= ref1 ? i <= ref1 : i >= ref1; pos = ref <= ref1 ? ++i : --i) {
        if (scriptSource[pos] === '[') {
          if (startPos === 0) {
            startPos = pos + 1;
          }
          numBrackets++;
        } else if (scriptSource[pos] === ']') {
          numBrackets--;
          if (numBrackets === 0) {
            endPos = pos;
            break;
          }
        }
      }
      requireString = scriptSource.substring(startPos, Math.max(startPos, endPos));
      return _.reduce(requireString.split(','), function(accum, requireItem) {
        requireItem = requireItem.trim().substr(1, requireItem.length - 3);
        if (requireItem.indexOf('components/') === 0) {
          accum.push(requireItem);
        }
        return accum;
      }, []);
    };
    updateSourceViewerToggleText = function(sourceViewer$El) {
      return sourceViewerToggle.text($(sourceViewer$El).is(":hidden") ? 'Show Source Code' : 'Hide Source Code');
    };
    return DashboardController.onReady(function() {
      return DashboardController.onViewModelLoad(function() {
        var sourceViewer$El, view;
        view = DashboardController.model.view;
        sourceFileModels.add(new Backbone.Model({
          name: view.entry.get('name') + '.xml',
          content: view.entry.content.get('eai:data')
        }));
        addSourceFile(scriptPath).then(function(scriptSource) {
          var i, len, requirePath, requirePaths, results;
          requirePaths = parseRequires(scriptSource);
          results = [];
          for (i = 0, len = requirePaths.length; i < len; i++) {
            requirePath = requirePaths[i];
            results.push(addSourceFile(requirePath));
          }
          return results;
        });
        sourceViewer$El = $('<div>').insertBefore($('#footer')).hide();
        new SourceViewer({
          model: new Backbone.Model({
            shortDescription: '',
            description: '',
            related_links: []
          }),
          collection: sourceFileModels,
          el: sourceViewer$El
        }).render();
        sourceViewerToggle.on('click', function() {
          return sourceViewer$El.toggle(0, function() {
            return updateSourceViewerToggleText(sourceViewer$El);
          });
        });
        updateSourceViewerToggleText(sourceViewer$El);
        sourceViewerToggle.insertBefore(sourceViewer$El);

        /*
        override Splunk to remove the blank space between the dashboard body and the source code view
         */
        return $('.main-section-body.dashboard-body').css('min-height', '100px');
      });
    });
  });

}).call(this);
