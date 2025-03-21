'use strict';

define(['splunkjs/mvc'], function (mvc) {
    var service = mvc.createService({ owner: 'nobody' });

    var headers = {
        'Content-Type': 'application/json'
    };

    function getCollectionPath(collectionName, recordId) {
        var path = 'storage/collections/data/' + collectionName;
        if (recordId != null) path += '/' + recordId;
        return path;
    }

    return {
        getCollection: function getCollection(collectionName) {
            var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

            service.request(getCollectionPath(collectionName), 'GET', null, null, null, headers, callback);
        },
        setCollection: function setCollection(collectionName, collectionData) {
            var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

            service.request(getCollectionPath(collectionName), 'POST', null, null, JSON.stringify(collectionData), headers, callback);
        },
        deleteCollection: function deleteCollection(collectionName, recordId) {
            var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

            service.request(getCollectionPath(collectionName, recordId), 'DELETE', null, null, null, headers, callback);
        }
    };
});
