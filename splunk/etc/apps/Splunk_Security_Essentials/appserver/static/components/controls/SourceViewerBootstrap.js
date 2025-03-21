'use strict';

define(['jquery', 'splunkjs/mvc/simplexml/controller', 'backbone', 'module'], function ($, DashboardController, Backbone, module) {
    var config = module.config();

    var isInitialized = false;

    var sourceFileModels = new Backbone.Collection();

    var sourceViewer$El = $('<div>').addClass('source-viewer-wrapper');
    var sourceViewerToggle$El = $('<button>').addClass('btn').css('margin', '20px 20px 10px 20px');

    // Makes an AJAX request for a source file and adds it to the source code viewer
    function addSourceFile(requirePath) {
        requirePath += '.js';

        var parts = requirePath.split('/');
        var filename = parts[parts.length - 1];

        return $.ajax({
            url: require.toUrl(requirePath),
            dataType: 'text'
        }).done(function (scriptSource) {
            sourceFileModels.add(new Backbone.Model({
                name: filename,
                content: scriptSource
            }));
        });
    }

    // Parse the RequireJS requirements out of a JS file if they belong to this app
    function parseRequires(scriptSource) {
        // get the part of a string between the first and last occurence of the provided brackets
        var requireStart = 'require(';
        var startAt = scriptSource.indexOf(requireStart) + requireStart.length;

        var startPos = 0;
        var endPos = 0;
        var numBrackets = 0;

        for (var pos = startAt; pos <= scriptSource.length; pos++) {
            if (scriptSource[pos] === '[') {
                if (startPos === 0) startPos = pos + 1;
                numBrackets++;
            } else if (scriptSource[pos] === ']') {
                numBrackets--;
                if (numBrackets === 0) {
                    endPos = pos;
                    break;
                }
            }
        }

        var requireString = scriptSource.substring(startPos, Math.max(startPos, endPos));

        return requireString.split(',').reduce(function (accum, requireItem) {
            // trim quotes
            requireItem = requireItem.trim().substr(1, requireItem.length - 3);

            if (requireItem.indexOf('components/') === 0) accum.push(requireItem);

            return accum;
        }, []);
    }

    function updateSourceViewerToggleText(isVisible) {
        sourceViewerToggle$El.text((isVisible ? 'Hide' : 'Show') + ' Source Code');
    }

    function toggleSourceViewer() {
        if (!isInitialized) {
            initializeSourceViewer();
        } else {
            sourceViewer$El.toggle();
            sourceViewerToggle$El.attr('disabled', false);
            updateSourceViewerToggleText(sourceViewer$El.is(":visible"));
        }
    }

    function initializeSourceViewer() {
        sourceViewerToggle$El.text('Loading...');
        sourceViewerToggle$El.attr('disabled', true);

        isInitialized = true;

        function onInitializeError() {
            sourceViewer$El.hide();
            updateSourceViewerToggleText(false);
            isInitialized = false;
            sourceFileModels.reset();
        }

        require(['vendor/srcviewer/srcviewer'], function (SourceViewer) {
            sourceFileModels.add(new Backbone.Model({
                name: DashboardController.model.view.entry.get('name') + '.xml',
                content: DashboardController.model.view.entry.content.get('eai:data')
            }));

            addSourceFile(config.scriptPath).then(function (scriptSource) {
                var requirePaths = parseRequires(scriptSource);

                $.when.apply($, requirePaths.map(addSourceFile)).done(toggleSourceViewer).fail(onInitializeError);
            }, onInitializeError);

            new SourceViewer({
                model: new Backbone.Model({
                    shortDescription: '',
                    description: '',
                    related_links: []
                }),
                collection: sourceFileModels,
                el: sourceViewer$El
            }).render();
        }, onInitializeError);
    }

    DashboardController.onReady(function () {
        DashboardController.onViewModelLoad(function () {
            sourceViewer$El.insertBefore($('#footer'));
            sourceViewerToggle$El.insertBefore(sourceViewer$El);

            // override Splunk to remove the blank space between the dashboard body and the source code view
            $('.main-section-body.dashboard-body').css('min-height', '100px');

            updateSourceViewerToggleText();

            sourceViewerToggle$El.on('click', toggleSourceViewer);
        });
    });
});
