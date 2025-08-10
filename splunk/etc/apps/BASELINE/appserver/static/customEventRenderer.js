require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/eventsviewerview'
], function($, mvc, SearchManager, EventsViewer) {
    
    // Custom event renderer
    var CustomEventRenderer = EventsViewer.extend({
        initialize: function() {
            EventsViewer.prototype.initialize.apply(this, arguments);
        },
        
        renderEvent: function(event) {
            var renderedEvent = EventsViewer.prototype.renderEvent.apply(this, arguments);
            
            // Custom rendering for CSV events
            if (event.sourcetype && event.sourcetype.indexOf('csv') !== -1) {
                var $event = $(renderedEvent);
                var $fields = $event.find('.fields');
                
                // Apply vertical styling
                $fields.css({
                    'display': 'flex',
                    'flex-direction': 'column'
                });
                
                $fields.find('.k, .v').css({
                    'display': 'block',
                    'width': '100%',
                    'margin': '2px 0'
                });
                
                return $event[0].outerHTML;
            }
            
            return renderedEvent;
        }
    });
    
    // Register the custom renderer
    mvc.Components.registerExtension('EventsViewer', CustomEventRenderer);
});