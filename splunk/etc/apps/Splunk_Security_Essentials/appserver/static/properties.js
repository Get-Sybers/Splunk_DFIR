
define(['json!' + $C['SPLUNKD_PATH'] + '/services/apps/local/Splunk_Security_Essentials?output_mode=json'],
  function(props) {
    let { build, version } = props.entry[0].content;
    return {
       build,
       version
    };
});
