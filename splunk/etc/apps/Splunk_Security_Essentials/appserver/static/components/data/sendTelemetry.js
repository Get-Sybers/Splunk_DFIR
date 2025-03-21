'use strict';

var splunk_metrics = function(){
    var app_id = undefined;
    let version = undefined;
    return {
    trackEvent: function (eventType, data) {
        if(!window._splunk_metrics_events)
             return;
        var event = {data: data || {}, timestamp:  Date.now()};
        event['type'] = eventType;
        event['data']['app'] = app_id;
        event['data']['telemetry_type'] = 'customSSE';
        event['data']['version'] = version;
        window._splunk_metrics_events.push(event);
    },
    init(config,id, v){
        app_id = id;
        version = v;
        if (config) splunk_metrics.trackEvent('config',config)
        }
    }
}();


define(['jquery', 'module', Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/properties.js")], function ($, module, props) {
    var config = module.config();  // unused?
    const { version } = props;
    splunk_metrics.init({
        "logging" : true,
        //"devMode": true,
    }, "Splunk_Security_Essentials", version);
    return {
        SendTelemetryToSplunk: function SendTelemetryToSplunk(component, input) {

			splunk_metrics.trackEvent(component,input);
		}
    };
});
