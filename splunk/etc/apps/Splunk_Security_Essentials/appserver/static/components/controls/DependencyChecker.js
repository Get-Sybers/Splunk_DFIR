'use strict';

define(['splunkjs/mvc', 'components/controls/Messages', 'components/data/parameters/LooseVersion'], function (mvc, Messages, LooseVersion) {
    var service = mvc.createService({ owner: 'nobody' });

    var minSplunkVersion = '6.4.0';
    var dependencyStatusMessages = {

    };

    function handleDependencyStatus(dependencyStatus, callback) {
        var hasDependencies = true;

    };
});
