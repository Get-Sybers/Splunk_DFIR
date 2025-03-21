(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["experiments"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiments.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
__webpack_require__.p = (function getPath() {

    /**
     * This is a port of make_url from js/util.js
     */
    function make_url() {
        var output = '', seg, len;
        for (var i=0,l=arguments.length; i<l; i++) {
            seg = arguments[i].toString();
            len = seg.length;
            if (len > 1 && seg.charAt(len-1) == '/') {
                seg = seg.substring(0, len-1);
            }
            if (seg.charAt(0) != '/') {
                output += '/' + seg;
            } else {
                output += seg;
            }
        }

        // augment static dirs with build number
        if (output!='/') {
            var segments = output.split('/');
            var firstseg = segments[1];
            if (firstseg=='static' || firstseg=='modules') {
                var postfix = output.substring(firstseg.length+2, output.length);
                output = '/' + firstseg;
                if (window.$C['BUILD_NUMBER']) output += '/@' + window.$C['BUILD_NUMBER'];
                if (window.$C['BUILD_PUSH_NUMBER']) output += '.' + window.$C['BUILD_PUSH_NUMBER'];
                if (segments[2] == 'app')
                    output += ':'+ getConfigValue('APP_BUILD', 0);
                output += '/' + postfix;
            }
        }

        var root = getConfigValue('MRSPARKLE_ROOT_PATH', '/');
        var locale = getConfigValue('LOCALE', 'en-US');
        var combinedPath =  "/" + locale + output;

        if (root == '' || root == '/') {
            return combinedPath;
        } else {
            return root + combinedPath;
        }
    }

    function getConfigValue(key, defaultValue) {
        if (window.$C && window.$C.hasOwnProperty(key)) {
            return window.$C[key];
        } else {
            if (defaultValue !== undefined) {
                return defaultValue;
            }

            throw new Error('getConfigValue - ' + key + ' not set, no default provided');
        }
    }

    return make_url('/static/app/Splunk_ML_Toolkit/') + '/';
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Experiments.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Experiments, _swcMltk) {
  "use strict";

  _Experiments = _interopRequireDefault(_Experiments);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Experiments.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/collections/Experiments.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esRegexpExec, _esStringSearch, _swcMltk, _PolymorphicExperiment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.SplunkDsBaseCollection.extend({
    model: _PolymorphicExperiment.default,
    url: 'mltk/experiments',
    initialize: function initialize(models) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _swcMltk.SplunkDsBaseCollection.prototype.initialize.apply(this, arguments);
      this.experimentType = options.experimentType;
    },
    fetch: function fetch(fetchParams) {
      // Pass through the `isFetch` flag (see ExperimentModel's `parse` for more info)
      var clonedParams = _swcMltk.jquery.extend(true, {
        isFetch: true
      }, fetchParams);

      // if an experimentType is provided, apply filtering when fetching
      if (this.experimentType != null) {
        if (clonedParams.data.search) {
          clonedParams.data.search = "(".concat(clonedParams.data.search, ") AND (type=").concat(this.experimentType, ")");
        } else {
          clonedParams.data.search = "type=".concat(this.experimentType);
        }
      }
      return _swcMltk.SplunkDsBaseCollection.prototype.fetch.call(this, clonedParams);
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/data/assistantInfo.json":
/***/ (function(module) {

module.exports = JSON.parse("{\"predict_numeric_fields\":{\"description\":\"Predict the value of a numeric field using a weighted combination of the values of other fields in that event.\",\"title\":\"Predict Numeric Fields\"},\"predict_categorical_fields\":{\"description\":\"Predict the value of a categorical field using the values of other fields in that event.\",\"title\":\"Predict Categorical Fields\"},\"detect_numeric_outliers\":{\"description\":\"Find values that differ significantly from previous values.\",\"title\":\"Detect Numeric Outliers\"},\"detect_categorical_outliers\":{\"description\":\"Find events that contain unusual combinations of values.\",\"title\":\"Detect Categorical Outliers\"},\"forecast_time_series\":{\"description\":\"Forecast future values given past values of a metric (numeric time series).\",\"title\":\"Forecast Time Series\"},\"cluster_numeric_events\":{\"description\":\"Partition events with multiple numeric fields into clusters.\",\"title\":\"Cluster Numeric Events\"},\"smart_forecast\":{\"description\":\"Forecast future numeric time series data using a step-by-step guided workflow with the option to bring in data from different sources and account for calendar specific \\\"special days\\\" such as holidays, company-specific event days.\",\"title\":\"Smart Forecasting\"},\"smart_outlier_detection\":{\"description\":\"Detect numeric outliers using a step-by-step guided workflow to leverage a density algorithm and segment data in advance of your anomaly search.\",\"title\":\"Smart Outlier Detection\"},\"smart_clustering\":{\"description\":\"Cluster numeric events using a step-by-step guided workflow.\",\"title\":\"Smart Clustering\"},\"smart_prediction\":{\"description\":\"Predict the value of a categorical or numeric field based on one or more other fields in the event using a step-by-step guided workflow.\",\"title\":\"Smart Prediction\"}}");

/***/ }),

/***/ "./src/main/webapp/routers/Experiments.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/collections/Experiments.es"), __webpack_require__("./src/main/webapp/routers/BaseListings.es"), __webpack_require__("experiments/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayMap, _esObjectToString, _esRegexpExec, _esStringSearch, _webDomCollectionsForEach, _swcMltk, _underscoreMltk, _i18n, _Experiments, _BaseListings, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _Experiments = _interopRequireDefault(_Experiments);
  _BaseListings = _interopRequireDefault(_BaseListings);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  var captionFilterKey = ['title'];
  var ExperimentsRouter = _BaseListings.default.extend({
    initialize: function initialize() {
      var _this = this;
      _BaseListings.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Experiments'));

      // the collection that populates the Experiments list
      this.collection.experiments = new _Experiments.default();

      // stores the counts for the Experiment type tiles
      this.model.experimentsCount = new _swcMltk.BaseModel();

      // these collections only exist for the purposes of fetching Experiment type counts from SplunkD
      // do not assume that their contents are accurate anywhere except inside fetchCountForType()
      this.experimentsCountCollections = {};
      _Master.default.SORTED_EXPERIMENT_TYPES.forEach(function (type) {
        _this.experimentsCountCollections[type] = new _Experiments.default(null, {
          experimentType: type
        });
        _this.model.experimentsCount.set(type, '');
      });
      this.stateDefaults = {
        sortKey: 'title',
        sortDirection: 'asc',
        offset: 0,
        // setting this default to match what happens when clear() is called on the filter input
        // specifically, a value of '' for the filter input doesn't result in a search value of ''
        // so we set it to the same thing .clear() would set it to to avoid unnecessary change events
        // see updateModel() in views/shared/FindInput.js for reference
        search: _swcMltk.splunkDUtils.createSearchFilterString('', captionFilterKey)
      };
      this.model.state = new _swcMltk.BaseModel(_underscoreMltk.default.extend({
        count: 100,
        fetching: true,
        experimentPageRendered: false
      }, this.stateDefaults));
      this.deferreds.experimentCountsArray = [];
      this.debouncedFetchListCollection = _underscoreMltk.default.debounce(function (model) {
        _this.fetchListCollection();
      }, 0);
      this.initializeListCollections();
    },
    $whenFetchInitializeDependencies: function $whenFetchInitializeDependencies() {
      return _swcMltk.jquery.when.apply(_swcMltk.jquery, [this.rolesCollectionDeferred, this.uiPrefsDeferred, this.deferreds.pageViewRendered, this.deferreds.userPref, this.deferreds.layout, this.deferreds.experiments].concat(_toConsumableArray(this.deferreds.experimentCountsArray)));
    },
    page: function page() {
      var _this2 = this;
      if (!this.experimentsView) {
        this.experimentsView = new _Master.default({
          model: {
            state: this.model.state,
            experimentsCount: this.model.experimentsCount,
            application: this.model.application,
            uiPrefs: this.uiPrefsModel,
            user: this.model.user,
            serverInfo: this.model.serverInfo,
            rawSearch: this.rawSearch,
            userPref: this.model.userPref,
            appLocal: this.model.app,
            classicurl: this.model.classicurl
          },
          collection: {
            experiments: this.collection.experiments,
            roles: this.rolesCollection,
            apps: this.collection.appLocals
          },
          deferreds: {
            layout: this.deferreds.layout
          },
          captionFilterKey: captionFilterKey
        });
        this.uiPrefsModel.entry.content.on('change', function () {
          _this2.populateUIPrefs();
        });
        this.uiPrefsModel.entry.content.on('change:display.prefs.aclFilter', function () {
          _this2.fetchListCollection();
        });
        this.model.state.on('change:experimentType', function () {
          _this2.model.state.set(_this2.stateDefaults, {
            silent: true
          });
          _this2.experimentsView.children.caption.children.input.clear();
          _this2.model.classicurl.save({
            experimentType: _this2.model.state.get('experimentType')
          });
        }, this);
        this.model.state.on('change:sortDirection change:sortKey change:search change:offset change:experimentType', this.debouncedFetchListCollection, this);

        // when deleting a model, re-fetch the updated list from the server
        this.collection.experiments.on('destroy', function () {
          _this2.fetchListCollection();
        }, this);
      }
      _swcMltk.jquery.when(this.deferreds.layout).then(function (layout) {
        layout.getContainerElement().appendChild(_this2.experimentsView.render().el);
        // Get the url params from the querystring and put them into the state model
        _this2.syncFromClassicUrl();
      });
      _BaseListings.default.prototype.page.apply(this, arguments);
    },
    /**
     * Gets state from the URL params
     */
    syncFromClassicUrl: function syncFromClassicUrl() {
      this.model.classicurl.fetch();
      var experimentTypeFromURL = this.model.classicurl.get('experimentType');
      var experimentType = _Master.default.SORTED_EXPERIMENT_TYPES.indexOf(experimentTypeFromURL) >= 0 ? experimentTypeFromURL : _Master.default.SORTED_EXPERIMENT_TYPES[0];
      this.model.state.set('experimentType', experimentType);
    },
    /**
     * Initializes the data for the Backbone collections for each Experiment type
     */
    initializeListCollections: function initializeListCollections() {
      var _this3 = this;
      this.model.state.set('fetching', true);
      this.deferreds.experimentCountsArray = _Master.default.SORTED_EXPERIMENT_TYPES.map(function (type) {
        var countDeferred = _swcMltk.jquery.Deferred();
        if (_this3.model.state.get('experimentType') === type) {
          _this3.fetchListCollection().then(function () {
            countDeferred.resolve();
          });
        } else {
          _this3.fetchCountForType(type).then(function () {
            countDeferred.resolve();
          });
        }
        return countDeferred;
      });
    },
    /**
     * Gets the filters used for fetching the Experiment list
     */
    getCollectionFilters: function getCollectionFilters() {
      var app = _swcMltk.SharedModels.get('app').get('app');
      var search = this.model.state.get('search') || '';
      var buttonFilterSearch = this.getButtonFilterSearch();
      var sortDir = this.model.state.get('sortDirection');
      var sortKey = this.model.state.get('sortKey').split(',');
      var sortMode = 'natural';
      if (buttonFilterSearch) {
        search += buttonFilterSearch;
      }
      if (sortKey[0] === 'title' || sortKey[0] === 'eai:acl.owner' || sortKey[0] === 'eai:acl.app' || sortKey[0] === 'eai:acl.sharing') {
        sortDir = [sortDir];
        sortMode = [sortMode];
      }
      return {
        app: app,
        owner: this.model.application.get('owner'),
        sort_dir: sortDir,
        sort_key: sortKey,
        sort_mode: sortMode,
        search: search,
        count: this.model.state.get('count'),
        offset: this.model.state.get('offset')
      };
    },
    /**
     * Gets the filters for fetching the Experiment count, overriding certain values from getCollectionFilters()
     */
    getCountCollectionFilters: function getCountCollectionFilters() {
      return _underscoreMltk.default.extend(this.getCollectionFilters(), {
        // override the search since we want to get an unfiltered count
        search: this.getButtonFilterSearch(),
        // reduce the amount of data transfered by setting the count to 1
        // the "paging.total" field will always contain the full count
        count: 1
      });
    },
    /**
     * Gets the count for the chosen type by fetching with the count collection and setting the result on the count model
     */
    fetchCountForType: function fetchCountForType(type) {
      var _this4 = this;
      return this.experimentsCountCollections[type].fetch({
        data: this.getCountCollectionFilters(),
        success: function success(fetchedCollection) {
          _this4.model.experimentsCount.set(fetchedCollection.experimentType, fetchedCollection.paging.get('total'));
        }
      });
    },
    /**
     * Fetches data for the Backbone collection for the current Experiment type
     */
    fetchListCollection: function fetchListCollection() {
      var _this5 = this;
      var filters = this.getCollectionFilters();

      // update the experiment type
      this.collection.experiments.experimentType = this.model.state.get('experimentType');
      this.model.state.set('fetching', true);

      // fetch the "real" list of Experiments
      return this.collection.experiments.fetch({
        data: filters,
        success: function success(fetchedCollection) {
          _this5.model.state.set('fetching', false);

          // if we fetched the list of Experiments with no filters, we can use the count from the collection
          // to set the count values on experimentsCount model (which is displayed on the tiles at the top)
          if (filters.search === _swcMltk.splunkDUtils.createSearchFilterString('', captionFilterKey)) {
            // only update the count if no filters were applied
            _this5.model.experimentsCount.set(fetchedCollection.experimentType, fetchedCollection.paging.get('total'));
          } else {
            // if the fetch has a filter, its count is not guaranteed to be accurate, so we need to re-fetch it with no filters
            _this5.fetchCountForType(fetchedCollection.experimentType);
          }
        }
      });
    }
  });
  var _default = _exports.default = ExperimentsRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), module, __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("./src/main/webapp/util/telemetry/constants.es"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("experiments/modals/Create"), __webpack_require__("experiments/TypeFilter"), __webpack_require__("lookups/table/TableCaption"), __webpack_require__("experiments/header/Create"), __webpack_require__("experiments/table/Master"), __webpack_require__("experiments/TypeSelector/TypeSelector")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayFind, _esArrayMap, _esDateToPrimitive, _esNumberConstructor, _esObjectToString, _swcMltk, _i18n, _module, _PolymorphicExperiment, _constants, _BaseDashboard, _Create, _TypeFilter, _TableCaption, _Create2, _Master, _TypeSelector) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _Create = _interopRequireDefault(_Create);
  _TypeFilter = _interopRequireDefault(_TypeFilter);
  _TableCaption = _interopRequireDefault(_TableCaption);
  _Create2 = _interopRequireDefault(_Create2);
  _Master = _interopRequireDefault(_Master);
  _TypeSelector = _interopRequireDefault(_TypeSelector);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var experimentsListContainerId = 'experimentsListContainer';
  var ExperimentsView = _BaseDashboard.default.extend({
    moduleId: _module.default.id,
    headerOptions: {
      title: 'Experiments'
    },
    initialize: function initialize(options) {
      var _this = this;
      _BaseDashboard.default.prototype.initialize.call(this, options);
      this.listenTo(this.model.state, 'createExperiment', function (type) {
        // avoid trying to open the modal when it's already open
        if (!_this.model.state.get('createExperimentModalOpen')) {
          _this.model.state.set('createExperimentModalOpen', true);
          _this.children.createExperimentModal = new _Create.default({
            experimentTypes: ExperimentsView.SORTED_EXPERIMENT_TYPES,
            showExperimentTypePicker: true,
            model: {
              type: type || _PolymorphicExperiment.default.TYPES.PREDICT_NUMERIC_FIELDS,
              application: _this.model.application
            },
            onHiddenRemove: true,
            telemetry: _this.telemetry
          });
          _this.children.createExperimentModal.render().appendTo((0, _swcMltk.jquery)('body')).show();
          _this.listenToOnce(_this.children.createExperimentModal, 'hidden', function () {
            _this.model.state.set('createExperimentModalOpen', false);
          });
        }
      });
      this.listenTo(this.model.state, 'createAlert', function (experimentModel) {
        _this.telemetry.log(_constants.CREATE_EXPERIMENT_ALERT, experimentModel.getTelemetryConstants());
      });
      this.listenTo(this.collection.experiments, 'scheduleEnabled', function (experimentModel) {
        _this.telemetry.log(_constants.SCHEDULE_EXPERIMENT_TRAINING, _objectSpread(_objectSpread({}, experimentModel.getTelemetryConstants()), {}, {
          scheduleEnabled: true
        }));
      });
      this.children.experimentTypeFilterView = new _TypeFilter.default({
        experimentTypes: ExperimentsView.SORTED_EXPERIMENT_TYPES,
        model: {
          state: this.model.state,
          count: this.model.experimentsCount
        }
      });
      this.children.experimentsTypeSelectorView = new _TypeSelector.default({
        experimentTypes: ExperimentsView.SORTED_EXPERIMENT_TYPES,
        model: {
          state: this.model.state,
          application: this.model.application
        }
      });
      this.children.createExperimentButton = new _Create2.default({
        model: {
          application: this.model.application,
          experiment: this.model.experiment,
          state: this.model.state
        }
      });

      /**
       * Set up views for UI controls
       */
      this.children.caption = new _TableCaption.default({
        model: {
          state: this.model.state,
          application: this.model.application,
          uiPrefs: this.model.uiPrefs,
          user: this.model.user,
          serverInfo: this.model.serverInfo,
          rawSearch: this.model.rawSearch
        },
        collection: {
          lookupModels: this.collection.experiments
        },
        noFilterButtons: true,
        filterKey: this.options.captionFilterKey,
        countLabel: (0, _i18n.gettext)('Experiments'),
        inputPlaceholder: (0, _i18n.gettext)('Filter by experiment name')
      });
    },
    getTotalCount: function getTotalCount() {
      var _this2 = this;
      var reducer = function reducer(accumulator, currentValue) {
        return accumulator + currentValue;
      };
      return ExperimentsView.SORTED_EXPERIMENT_TYPES.map(function (type) {
        return _this2.model.experimentsCount.get(type) || 0;
      }).reduce(reducer);
    },
    manageStateOfChildren: function manageStateOfChildren() {
      // need to wait until page load because we don't have `experimentList$El` until we load the
      if (this.model.state.get('experimentPageRendered')) {
        if (this.getTotalCount() === 0) {
          this.children.header.$el.hide();
          this.children.experimentTypeFilterView.$el.css('display', 'none');
          this.experimentsList$El.hide();
          this.children.experimentsTypeSelectorView.$el.css('display', 'block');
        } else {
          this.children.experimentsTypeSelectorView.$el.css('display', 'none');

          // Inherit from stylesheet
          this.children.header.$el.css('display', '');
          this.children.experimentTypeFilterView.$el.css('display', '');
          this.experimentsList$El.css('display', '');
          this.children.experimentsView.updateTable();
        }
      }
    },
    render: function render() {
      if (!this.$el.html()) {
        _BaseDashboard.default.prototype.render.call(this);
        this.children.experimentsTypeSelectorView.render().appendTo(this.$el);
        this.experimentsList$El = this.$el.find("#".concat(experimentsListContainerId));
        this.children.experimentTypeFilterView.render().$el.insertBefore(this.experimentsList$El);
        this.children.caption.render().appendTo(this.experimentsList$El);
        this.children.createExperimentButton.render().appendTo(this.children.header.buttonWrapper);
        this.children.experimentsView = new _Master.default({
          model: {
            state: this.model.state,
            application: this.model.application,
            uiPrefs: this.model.uiPrefs,
            userPref: this.model.userPref,
            user: this.model.user,
            appLocal: this.model.app,
            serverInfo: this.model.serverInfo
          },
          collection: {
            lookupModels: this.collection.experiments,
            roles: this.collection.roles,
            apps: this.collection.apps
          }
        });
        this.children.experimentsView.activate({
          deep: true
        }).render().appendTo(this.experimentsList$El);
        this.model.state.set('experimentPageRendered', true);
      }
      this.manageStateOfChildren();
      return this;
    },
    template: "\n        <div id=\"".concat(experimentsListContainerId, "\"></div>")
  }, {
    SORTED_EXPERIMENT_TYPES: [
    // These are rendered in this specific order
    _PolymorphicExperiment.default.TYPES.SMART_FORECAST, _PolymorphicExperiment.default.TYPES.SMART_OUTLIER_DETECTION, _PolymorphicExperiment.default.TYPES.SMART_CLUSTERING, _PolymorphicExperiment.default.TYPES.SMART_PREDICTION, _PolymorphicExperiment.default.TYPES.PREDICT_NUMERIC_FIELDS, _PolymorphicExperiment.default.TYPES.PREDICT_CATEGORICAL_FIELDS, _PolymorphicExperiment.default.TYPES.DETECT_NUMERIC_OUTLIERS, _PolymorphicExperiment.default.TYPES.DETECT_CATEGORICAL_OUTLIERS, _PolymorphicExperiment.default.TYPES.FORECAST_TIME_SERIES, _PolymorphicExperiment.default.TYPES.CLUSTER_NUMERIC_EVENTS]
  });
  var _default = _exports.default = ExperimentsView;
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/TypeFilter":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), module, __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/data/assistantInfo.json")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFind, _esArrayMap, _esObjectToString, _swcMltk, _underscoreMltk, _module, _constants, _assistantInfo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _module = _interopRequireDefault(_module);
  _assistantInfo = _interopRequireDefault(_assistantInfo);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.Backbone.View.extend({
    moduleId: _module.default.id,
    tagName: 'ul',
    className: 'mltk-experiments-type-filter',
    initialize: function initialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var experimentTypes = options.experimentTypes || [];
      this.experimentTypes = experimentTypes.map(function (type) {
        var assistant = _assistantInfo.default[type];
        return {
          id: type,
          title: assistant.title,
          icon: _constants.EXPERIMENT_ICONS[type]
        };
      });
      this.listenTo(this.model.state, 'change:experimentType', this.updateSelectedType);
      this.listenTo(this.model.count, 'change', this.updateTypeCounts);
    },
    events: {
      'click li': function click_li(e) {
        var index = (0, _swcMltk.jquery)(e.currentTarget).index();
        var experimentInfo = this.experimentTypes[index];
        this.model.state.set('experimentType', experimentInfo.id);
        e.preventDefault();
      }
    },
    render: function render() {
      var template = _underscoreMltk.default.template(this.template, {
        experimentTypes: this.experimentTypes
      });
      this.$el.html(template);
      this.updateSelectedType();
      this.updateTypeCounts();
      return this;
    },
    updateSelectedType: function updateSelectedType() {
      var _this = this;
      var newType = this.model.state.get('experimentType');
      this.$el.find('> li > div.mltk-experiment-type-card').each(function (i, el) {
        (0, _swcMltk.jquery)(el)[newType === _this.experimentTypes[i].id ? 'addClass' : 'removeClass']('active');
      });
    },
    updateTypeCounts: function updateTypeCounts() {
      var _this2 = this;
      this.$el.find('> li').each(function (i, el) {
        (0, _swcMltk.jquery)(el).find('.count').text(_this2.model.count.get(_this2.experimentTypes[i].id));
      });
    },
    template: "\n        <% experimentTypes.forEach(function(type) { %>\n            <li>\n                <div class=\"mltk-experiment-type-card\" data-test=\"<%= type.id %>-card\">\n                    <div class=\"mltk-experiment-type-title\"><%= type.title %></div>\n                    <div class=\"mltk-experiment-type-info\">\n                        <span class=\"icon <%= type.icon %>\"></span>\n                        <span class=\"count\"></span>\n                    </div>\n                <div>\n            </li>\n        <% }) %>\n    "
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/TypeSelector/ExperimentType":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("splunkui/IconCard/IconCard"), __webpack_require__("experiments/TypeSelector/propTypes")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _react, _propTypes, _constants, _IconCard, _propTypes2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _IconCard = _interopRequireDefault(_IconCard);
  var _excluded = ["experimentType", "onClick"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var propTypes = {
    /* eslint-disable react/forbid-foreign-prop-types */
    experimentType: _propTypes.default.shape(_propTypes2.experimentTypeProps.propTypes).isRequired,
    /* eslint-enable react/forbid-foreign-prop-types */
    onClick: _propTypes.default.func.isRequired
  };
  var ExperimentType = function ExperimentType(_ref) {
    var experimentType = _ref.experimentType,
      onClick = _ref.onClick,
      props = _objectWithoutProperties(_ref, _excluded);
    var description = experimentType.description,
      title = experimentType.title,
      type = experimentType.type;
    var icon = _constants.EXPERIMENT_ICONS[type];
    return /*#__PURE__*/_react.default.createElement(_IconCard.default, _extends({
      "data-test": "experiment-grid-type-card"
    }, props, {
      icon: icon,
      onClick: onClick,
      title: title
    }), description);
  };
  ExperimentType.propTypes = propTypes;
  var _default = _exports.default = ExperimentType;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/TypeSelector/TypeSelector":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/reactadapterbase.js"), module, __webpack_require__("./src/main/webapp/data/assistantInfo.json"), __webpack_require__("experiments/TypeSelector/TypeSelectorComponent")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayMap, _react, _root, _reactadapterbase, _module, _assistantInfo, _TypeSelectorComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _module = _interopRequireDefault(_module);
  _assistantInfo = _interopRequireDefault(_assistantInfo);
  _TypeSelectorComponent = _interopRequireDefault(_TypeSelectorComponent);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // react-hot-loader must be loaded before react & react-dom
  // It is also safe to install as regular dependency, has minimal footprint

  var HotTypeSelector = (0, _root.hot)(_TypeSelectorComponent.default);
  var _default = _exports.default = _reactadapterbase.ReactAdapterBaseView.extend({
    moduleId: _module.default.id,
    className: 'mltk-experiments-type-selector',
    /**
     *
     * @param {object}   options
     * @param {string}   options.experimentType
     *
     * @param {object} model: {
     *          experiment: <models.experiment>,
     *          application: <models.Application>,
     *     },
     */
    initialize: function initialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var experimentTypes = options.experimentTypes || [];

      // Bind callback
      this.handleItemClick = this.handleItemClick.bind(this);
      this.experimentTypes = experimentTypes.map(function (type) {
        var assistant = _assistantInfo.default[type];
        return {
          description: assistant.description,
          title: assistant.title,
          type: type
        };
      });
    },
    handleItemClick: function handleItemClick(experimentInfo) {
      // the receiver of this event should keep track of whether or not they're in the process
      // of creating the Experiment and ignore the event accordingly
      this.model.state.trigger('createExperiment', experimentInfo.type);
    },
    getComponent: function getComponent() {
      var props = {
        experimentTypes: this.experimentTypes,
        onItemClick: this.handleItemClick
      };
      return _react.default.createElement(HotTypeSelector, props);
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/TypeSelector/TypeSelectorComponent":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/CardLayout.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("experiments/TypeSelector/ExperimentType"), __webpack_require__("experiments/TypeSelector/propTypes"), __webpack_require__("experiments/TypeSelector/TypeSelectorComponent.styles")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _CardLayout, _i18n, _ExperimentType, _propTypes2, _TypeSelectorComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _CardLayout = _interopRequireDefault(_CardLayout);
  _ExperimentType = _interopRequireDefault(_ExperimentType);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    /* eslint-disable react/forbid-foreign-prop-types */
    experimentTypes: _propTypes.default.arrayOf(_propTypes.default.shape(_propTypes2.experimentTypeProps.propTypes)).isRequired,
    /* eslint-enable react/forbid-foreign-prop-types */
    onItemClick: _propTypes.default.func.isRequired
  };

  // HACK: SUI-1501
  // CardLayout doesn't set styles on children that aren't instances of react-ui's Card
  // element. We manually pass down the appropriate styles in the meantime.
  var CARD_GUTTER = 20;
  var CARD_MIN_WIDTH = 300;
  var CARD_MAX_WIDTH = 420;
  var cardStyle = {
    // IE11 will fail to render if we use the usual flex shorthand with a `calc` in the basis.
    // Using the separate properties works fine though, so we do things the long way.
    flexGrow: '0',
    flexShrink: '0',
    flexBasis: "calc(33% - ".concat(CARD_GUTTER, "px)"),
    margin: "".concat(CARD_GUTTER / 2, "px")
  };
  var TypeSelector = function TypeSelector(_ref) {
    var experimentTypes = _ref.experimentTypes,
      onItemClick = _ref.onItemClick;
    return /*#__PURE__*/_react.default.createElement(_TypeSelectorComponent.StyledTypeSelector, null, /*#__PURE__*/_react.default.createElement("h2", null, (0, _i18n.gettext)('Select an Assistant to Create an Experiment')), /*#__PURE__*/_react.default.createElement(_CardLayout.default, {
      alignCards: "center",
      cardMaxWidth: CARD_MAX_WIDTH,
      cardMinWidth: CARD_MIN_WIDTH,
      gutterSize: CARD_GUTTER
    }, experimentTypes.map(function (experimentType) {
      return /*#__PURE__*/_react.default.createElement(_ExperimentType.default, {
        key: experimentType.type,
        experimentType: experimentType,
        onClick: function onClick() {
          return onItemClick(experimentType);
        },
        style: cardStyle
      });
    })));
  };
  TypeSelector.propTypes = propTypes;
  var _default = _exports.default = TypeSelector;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/TypeSelector/TypeSelectorComponent.styles":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledTypeSelector = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledTypeSelector = _exports.StyledTypeSelector = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin: 0 auto;\n    max-width: 1400px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/TypeSelector/propTypes":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/prop-types/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _propTypes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.experimentTypeProps = _exports.exampleProps = void 0;
  _propTypes = _interopRequireDefault(_propTypes);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var examplePropType = {
    label: _propTypes.default.string.isRequired
  };
  var exampleProps = _exports.exampleProps = {
    propTypes: examplePropType,
    defaultProps: {}
  };
  var experimentTypeProps = _exports.experimentTypeProps = {
    propTypes: {
      description: _propTypes.default.string,
      examples: _propTypes.default.arrayOf(_propTypes.default.shape(examplePropType)),
      icon: _propTypes.default.string,
      style: _propTypes.default.objectOf(_propTypes.default.string),
      title: _propTypes.default.string.isRequired
    },
    defaultProps: {
      description: '',
      examples: [],
      icon: '',
      style: {}
    }
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/header/Create":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), module, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _underscoreMltk, _module, _swcMltk) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _module = _interopRequireDefault(_module);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.BaseView.extend({
    moduleId: _module.default.id,
    className: 'mltk-create-experiment',
    events: {
      'click a.btn': function click_aBtn(e) {
        e.preventDefault();

        // the receiver of this event should keep track of whether or not they're in the process
        // of creating the Experiment and ignore the event accordingly
        this.model.state.trigger('createExperiment', this.model.state.get('experimentType'));
      }
    },
    render: function render() {
      this.$el.html(this.compiledTemplate({
        _: _underscoreMltk.default
      }));
    },
    template: "\n        <a class='btn btn-primary' href='#'><%- _('Create New Experiment').t() %></a>\n    "
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/modals/Create":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("./src/main/webapp/data/assistantInfo.json"), __webpack_require__("./src/main/webapp/util/telemetry/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayMap, _i18n, _swcMltk, _module, _PolymorphicExperiment, _assistantInfo, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _assistantInfo = _interopRequireDefault(_assistantInfo);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.ModalView.extend({
    moduleId: _module.default.id,
    className: "".concat(_swcMltk.ModalView.CLASS_NAME, " ").concat(_swcMltk.ModalView.CLASS_MODAL_WIDE),
    /**
     *
     * @param options
     * @params model experiment
     * @param {string} options.experimentType long type, e.g. predict_numeric_fields
     * @param {list} options.experimentTypes sorted list of experiment types
     * @param {boolean} options.showExperimentTypePicker a boolean flag to indicate if we want to show the experiment type list
     * @param {boolean} options.telemetry the global telemetry object
     */
    initialize: function initialize(options) {
      _swcMltk.ModalView.prototype.initialize.apply(this, arguments);
      this.model.experimentAttributes = new _swcMltk.BaseModel({
        type: this.model.type
      });
      this.children.flashMessages = new _swcMltk.FlashMessagesView({
        // We register the experiment once it's been created
        model: {}
      });
      if (options.showExperimentTypePicker) {
        var experimentTypeList = options.experimentTypes.map(function (type) {
          return {
            label: _assistantInfo.default[type].title,
            value: type
          };
        });
        this.children.experimentTypePicker = new _swcMltk.ControlGroupView({
          className: 'control-group',
          controlType: 'SyntheticSelect',
          controlClass: 'controls-block',
          controlOptions: {
            modelAttribute: 'type',
            model: this.model.experimentAttributes,
            items: experimentTypeList,
            toggleClassName: 'btn',
            popdownOptions: {
              attachDialogTo: '.modal:visible',
              scrollContainer: '.modal:visible .modal-body:visible'
            }
          },
          label: (0, _i18n.gettext)('Experiment Type')
        });
      } else {
        this.children.experimentTypeLabel = new _swcMltk.ControlGroupView({
          controlType: 'Label',
          controlOptions: {
            defaultValue: _assistantInfo.default[this.model.experimentAttributes.get('type')].title
          },
          label: (0, _i18n.gettext)('Experiment Type')
        });
      }
      this.children.experimentTitleControl = new _swcMltk.TextControlView({
        elementId: 'experiment-title-control',
        modelAttribute: 'title',
        model: this.model.experimentAttributes
      });
      this.children.experimentTitle = new _swcMltk.ControlGroupView({
        controls: this.children.experimentTitleControl,
        controlType: 'Text',
        controlClass: 'controls-block',
        label: (0, _i18n.gettext)('Experiment Title')
      });
      this.children.descriptionControl = new _swcMltk.TextareaControlView({
        elementId: 'experiment-description-control',
        modelAttribute: 'description',
        model: this.model.experimentAttributes,
        placeholder: 'Optional'
      });
      this.children.description = new _swcMltk.ControlGroupView({
        controls: this.children.descriptionControl,
        controlClass: 'controls-block',
        label: (0, _i18n.gettext)('Description')
      });
    },
    events: _swcMltk.jquery.extend({}, _swcMltk.ModalView.prototype.events, {
      // not needed because we use window.location to re route
      // eslint-disable-next-line consistent-return
      'click a.modal-btn-primary': function click_aModalBtnPrimary(e) {
        var _this = this;
        e.preventDefault();

        // Unregister the previous experiment's messages, if we've been through here before.
        if (this.unregisterFlashMessages) {
          this.unregisterFlashMessages();
          this.unregisterFlashMessages = null;
        }
        var experiment = new _PolymorphicExperiment.default({
          entry: [{
            content: {
              type: this.model.experimentAttributes.get('type')
            }
          }]
        }, {
          parse: true
        });
        this.children.flashMessages.register(experiment);
        this.children.flashMessages.register(experiment.entry.content);
        // Prep our unregister fn; we'll call this if the save fails and the user tries the save again.
        // This creates a closure around the experiment we created above, so we can refer to it if we need it.
        this.unregisterFlashMessages = function () {
          _this.children.flashMessages.unregister(experiment);
          _this.children.flashMessages.unregister(experiment.entry.content);
        };

        // App and owner need to be set on the model so that the _new whitelist is fetched from the
        // proper namespace
        var app = this.model.application.get('app');
        var owner = this.model.application.get('owner');
        experiment.app = app;
        experiment.owner = owner;

        // Do a fetch on the new experiment (to set relevant default attributes)
        _swcMltk.jquery.when(experiment.fetch()).always(function () {
          // Set the description and title after the fetch (they get clobbered otherwise)
          experiment.entry.content.set({
            description: _this.model.experimentAttributes.get('description'),
            title: _this.model.experimentAttributes.get('title')
          });
          // Make the actual POST
          experiment.save({}, {
            data: {
              app: app,
              owner: owner
            },
            success: function success() {
              // Convert experiment type to page
              var destinationAssistantPage = experiment.getType();

              // Get page info & destination page
              var pageInfo = _swcMltk.mvcUtils.getPageInfo();

              // redirect user to actual assistant page
              var urlEncodedExperimentId = {
                data: {
                  experimentId: experiment.getId()
                }
              };

              // SWA.js caches telemetry events so this still gets logged
              // even though we leave the page immediately after
              _this.options.telemetry.log(_constants.CREATE_EXPERIMENT, experiment.getTelemetryConstants());
              window.location = _swcMltk.route.page(pageInfo.root, pageInfo.locale, pageInfo.app, destinationAssistantPage, urlEncodedExperimentId);
            }
          });
        });
      }
    }),
    render: function render() {
      // Base
      this.$el.html(_swcMltk.ModalView.TEMPLATE);
      this.$el.addClass('create-experiment-modal');

      // Header
      this.$(_swcMltk.ModalView.HEADER_TITLE_SELECTOR).text('Create New Experiment');

      // Footer
      this.$(_swcMltk.ModalView.FOOTER_SELECTOR).append(_swcMltk.ModalView.BUTTON_CANCEL).append((0, _swcMltk.jquery)('<a href="#" class="btn btn-primary modal-btn-primary">').text('Create'));

      // Render controls
      this.$(_swcMltk.ModalView.BODY_SELECTOR).append(_swcMltk.ModalView.FORM_HORIZONTAL_JUSTIFIED);
      this.children.flashMessages.render().appendTo(this.$(_swcMltk.ModalView.BODY_FORM_SELECTOR));
      if (this.children.experimentTypePicker) {
        this.children.experimentTypePicker.render().appendTo(this.$(_swcMltk.ModalView.BODY_FORM_SELECTOR));
      }
      if (this.children.experimentTypeLabel) {
        this.children.experimentTypeLabel.render().appendTo(this.$(_swcMltk.ModalView.BODY_FORM_SELECTOR));
      }
      this.children.experimentTitle.render().appendTo(this.$(_swcMltk.ModalView.BODY_FORM_SELECTOR));
      this.children.description.render().appendTo(this.$(_swcMltk.ModalView.BODY_FORM_SELECTOR));
      return this;
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/modals/publish/Master":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/reactadapterbase.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/models/CloneModels.es"), __webpack_require__("./src/main/webapp/util/parseSplunkDError.es"), __webpack_require__("./src/main/webapp/util/listVisibleApps.es"), __webpack_require__("experiments/modals/publish/PublishMultiStepModal")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectToString, _esPromise, _root, _underscoreMltk, _reactadapterbase, _react, _CloneModels, _parseSplunkDError, _listVisibleApps, _PublishMultiStepModal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _react = _interopRequireDefault(_react);
  _CloneModels = _interopRequireDefault(_CloneModels);
  _parseSplunkDError = _interopRequireDefault(_parseSplunkDError);
  _listVisibleApps = _interopRequireDefault(_listVisibleApps);
  _PublishMultiStepModal = _interopRequireDefault(_PublishMultiStepModal);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // react-hot-loader must be loaded before react & react-dom
  // It is also safe to install as regular dependency, has minimal footprint

  var HotPublishMultiStepModal = (0, _root.hot)(_PublishMultiStepModal.default);
  var _default = _exports.default = _reactadapterbase.ReactAdapterBaseView.extend({
    moduleId: module.i,
    initialize: function initialize(options) {
      _reactadapterbase.ReactAdapterBaseView.prototype.initialize.apply(this, options);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleClose = this.handleClose.bind(this);
    },
    handleSubmit: function handleSubmit(submitAttributes) {
      var _this = this;
      this.model.experiment.cloneModels.set(submitAttributes);
      return new Promise(function (resolve, reject) {
        _this.model.experiment.cloneModels.save({}, {
          success: function success(model, response, options) {
            resolve(response.messages);
          },
          error: function error(model, response, options) {
            reject((0, _parseSplunkDError.default)(response).messages);
          }
        });
      });
    },
    handleClose: function handleClose() {
      var _this2 = this;
      _underscoreMltk.default.defer(function () {
        return _this2.remove();
      });
    },
    getComponent: function getComponent() {
      var appCollection = (0, _listVisibleApps.default)(this.collection.apps);
      var modelNameList = this.model.experiment.getAllModelNames();
      var props = {
        experimentModelName: this.model.experiment.getExperimentModelName(),
        modelNameList: modelNameList,
        appCollection: appCollection,
        submitAttributes: _CloneModels.default.SAVE_ATTRIBUTES,
        onSubmit: this.handleSubmit,
        onClose: this.handleClose,
        open: true
      };
      return _react.default.createElement(HotPublishMultiStepModal, props);
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/table/Details":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), module, __webpack_require__("lookups/table/Details"), __webpack_require__("lookups/table/PermissionsDialog"), __webpack_require__("experiments/shared/searchStages/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFilter, _esArrayMap, _esObjectToString, _swcMltk, _underscoreMltk, _module, _Details, _PermissionsDialog, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _module = _interopRequireDefault(_module);
  _Details = _interopRequireDefault(_Details);
  _PermissionsDialog = _interopRequireDefault(_PermissionsDialog);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _Details.default.extend({
    moduleId: _module.default.id,
    events: {
      'click a.edit-permissions': function click_aEditPermissions(e) {
        this.children.permissionsDialog = new _PermissionsDialog.default({
          document: this.model.lookupsModel,
          nameModel: this.model.lookupsModel.experimentInfo,
          user: this.model.user,
          serverInfo: this.model.serverInfo,
          application: this.model.application
        }, this.collection, this.options);
        this.children.permissionsDialog.render().appendTo((0, _swcMltk.jquery)('body')).show();
        e.preventDefault();
      }
    },
    render: function render() {
      var preprocessingList = this.model.lookupsModel.getPreprocessingSearchStageModels().map(function (stage) {
        return {
          algorithm: stage.get('algorithm'),
          modelName: stage.get('modelName')
        };
      }).filter(function (stage) {
        return stage.algorithm != null && stage.algorithm.length > 0;
      });
      var experimentSettings = new _Master.default({
        title: 'EXPERIMENT SETTINGS',
        collection: {
          searchStages: new _swcMltk.BaseCollection(this.model.lookupsModel.getMainSearchStageModel())
        }
      }).render();
      _underscoreMltk.default.extend(this.innerTemplateParams, {
        preprocessingSteps: preprocessingList,
        dataSource: this.model.lookupsModel.getFormattedDataSourceString()
      });

      // completely replace the innerTemplate because most of the fields from mltk/views/lookups/table/Details don't apply here
      this.innerTemplate = "\n            <dt class=\"mltk-data-source\">Data Source</dt>\n            <dd class=\"mltk-data-source\"><%- dataSource %></dd>\n            <dt class=\"modified\">Modified</dt>\n            <dd class=\"modified\"></dd>\n            <% if (preprocessingSteps.length > 0) { %>\n                <br />\n                <h5>PREPROCESSING STEPS</h5>\n                <% preprocessingSteps.forEach(function(step) { %>\n                    <dt class=\"mltk-algorithm\">Algorithm</dt>\n                    <dd class=\"mltk-algorithm\"><%- step.algorithm %></dd>\n                    <% if (step.modelName) { %>\n                        <dt class=\"mltk-model-name\">Model Name</dt>\n                        <dd class=\"mltk-model-name\"><%- step.modelName %></dd>\n                    <% } %>\n                <% }) %>\n            <% } %>\n        ";
      _Details.default.prototype.render.apply(this, arguments);
      this.$el.append(experimentSettings.el).addClass('mltk-experiment-details');
      return this;
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/table/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), module, __webpack_require__("lookups/table/Master"), __webpack_require__("experiments/table/Details"), __webpack_require__("experiments/table/TableRow"), __webpack_require__("experiments/table/MoreInfo")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectToString, _underscoreMltk, _module, _Master, _Details, _TableRow, _MoreInfo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _module = _interopRequireDefault(_module);
  _Master = _interopRequireDefault(_Master);
  _Details = _interopRequireDefault(_Details);
  _TableRow = _interopRequireDefault(_TableRow);
  _MoreInfo = _interopRequireDefault(_MoreInfo);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // used as a column header and also passed to the permissions dialog
  var nameOptions = {
    nameLabel: 'Experiment Name',
    nameKey: 'title'
  };
  var _default = _exports.default = _Master.default.extend({
    className: 'mltk-experiments-table',
    moduleId: _module.default.id,
    details: {
      view: _Details.default,
      options: _underscoreMltk.default.extend({}, nameOptions)
    },
    tableRow: {
      view: _TableRow.default,
      options: _underscoreMltk.default.extend({
        hasActions: true
      }, nameOptions)
    },
    moreInfo: {
      view: _MoreInfo.default
    },
    tbodyClass: 'mltk-experiments-listings',
    initialize: function initialize() {
      // has to be set here because .bind() doesn't work if set as an option above
      this.columns = [{
        label: 'i',
        className: 'col-info',
        html: '<i class="icon-info"></i>'
      }, {
        label: nameOptions.nameLabel,
        sortKey: nameOptions.nameKey
      }, {
        label: 'Algorithm',
        className: 'col-algorithm'
      }, {
        label: 'i',
        className: 'col-scheduled-training',
        html: '<i class="icon-large icon-clock"></i>'
      }, {
        label: 'i',
        className: 'col-alert',
        html: '<i class="icon-large icon-bell"></i>'
      }, {
        label: 'Actions',
        className: 'col-actions',
        visible: function () {
          return this.tableRow.options.hasActions;
        }.bind(this)
      }];
      _Master.default.prototype.initialize.apply(this, arguments);
    },
    updateTable: function updateTable() {
      var canDelete = this.collection.lookupModels.some(function (model) {
        return model.canDelete();
      });
      this.tableRow.options.hasActions = this.collection.lookupModels.length === 0 || canDelete;
      this.children.head.render();
      _Master.default.prototype.updateTable.apply(this, arguments);
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/table/MoreInfo":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("experiments/modals/TitleDescription"), __webpack_require__("lookups/table/MoreInfo")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _module, _TitleDescription, _MoreInfo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _TitleDescription = _interopRequireDefault(_TitleDescription);
  _MoreInfo = _interopRequireDefault(_MoreInfo);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _MoreInfo.default.extend({
    moduleId: _module.default.id,
    events: {
      'click a.edit-description': function click_aEditDescription(e) {
        this.children.titleDescriptionModal = new _TitleDescription.default({
          model: {
            experiment: this.model.lookupsModel
          },
          onHiddenRemove: true
        });
        this.children.titleDescriptionModal.render().appendTo((0, _swcMltk.jquery)('body')).show();
        e.preventDefault();
      }
    },
    render: function render() {
      _MoreInfo.default.prototype.render.apply(this, arguments);
      var canWrite = this.model.lookupsModel.canWrite();
      if (canWrite) {
        this.$('p.description').append('<a class="edit-description" href="#">Edit</a>');
      }
      return this;
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experiments/table/PublishLink":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("experiments/modals/publish/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.BaseView.extend({
    initialize: function initialize() {
      _swcMltk.BaseView.prototype.initialize.call(this);
    },
    events: {
      'click a.mltk-publish': function click_aMltkPublish(e) {
        e.preventDefault();
        this.children.publish = new _Master.default({
          model: this.model,
          collection: this.collection
        });
        this.children.publish.render().appendTo((0, _swcMltk.jquery)('body'));
      }
    },
    render: function render() {
      this.$el.append('<a class="dropdown-toggle mltk-publish" href="#">Publish</a>');
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/table/TableRow":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("lookups/table/PermissionsDialog"), __webpack_require__("lookups/table/TableRow"), __webpack_require__("experiments/shared/manageMenu/Master"), __webpack_require__("experiments/table/PublishLink")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _swcMltk, _module, _PermissionsDialog, _TableRow, _Master, _PublishLink) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _PermissionsDialog = _interopRequireDefault(_PermissionsDialog);
  _TableRow = _interopRequireDefault(_TableRow);
  _Master = _interopRequireDefault(_Master);
  _PublishLink = _interopRequireDefault(_PublishLink);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // CSS Class Selectors for icons
  var scheduledTrainingTdClass = 'has-scheduled-training';
  var alertTdClass = 'has-alerts';
  var actionsEditClass = 'mltk-actions-edit';
  var _default = _exports.default = _TableRow.default.extend({
    moduleId: _module.default.id,
    className: 'expand',
    /**
     * @param {Object} options {
     *     model: {
     *          lookupsModel: <models.experiment>,
     *          application: <models.Application>,
     *          state: <Backbone.Model>,
     *          appLocal: <models.services.AppLocal>,
     *          user: <models.service.admin.user>
     *     },
     *     collection: {
     *          roles: <collections.services.authorization.Roles>,
     *          apps: <collections.services.AppLocals>
     *     },
     *     index: <index_of_the_row>,
     *     alternateApp: <alternate_app_to_open>
     * }
     */
    initialize: function initialize() {
      _swcMltk.BaseView.prototype.initialize.apply(this, arguments);
      this.$el.addClass(this.options.index % 2 ? 'even' : 'odd');
      this.children.manageDropdownView = new _Master.default({
        model: {
          application: this.model.application,
          experiment: this.model.lookupsModel,
          user: this.model.user,
          appLocal: this.model.appLocal,
          serverInfo: this.model.serverInfo,
          state: this.model.state
        },
        collection: {
          roles: this.collection.roles
        },
        scheduledTrainingEnabled: true,
        titleDescriptionEnabled: true,
        createAlertEnabled: true,
        button: false
      });
      if (this.model.lookupsModel.canBePublished()) {
        this.children.publishDialogView = new _PublishLink.default({
          model: {
            application: this.model.application,
            experiment: this.model.lookupsModel,
            user: this.model.user,
            appLocal: this.model.appLocal,
            serverInfo: this.model.serverInfo,
            state: this.model.state
          },
          collection: {
            apps: this.collection.apps
          }
        });
      }
    },
    startListening: function startListening() {
      var _this = this;
      this.listenTo(this.model.lookupsModel, 'updateCollection', function () {
        _this.model.state.trigger('change:search');
      });
      this.listenTo(this.model.lookupsModel, 'scheduleSuccess', this.updateScheduledTraining);
      this.listenTo(this.model.lookupsModel, 'alertSuccess', this.updateAlert);
    },
    updateScheduledTraining: function updateScheduledTraining() {
      var shouldBeActive = this.model.lookupsModel.hasSchedule();
      var clockIcon = this.$("td.".concat(scheduledTrainingTdClass, " i"));
      clockIcon.toggleClass('active-icon', shouldBeActive);
      var tooltipMessage = shouldBeActive ? 'Scheduled training' : 'No scheduled training';
      clockIcon.tooltip('destroy');
      clockIcon.tooltip({
        title: tooltipMessage,
        animatation: false,
        container: 'body'
      });
    },
    updateAlert: function updateAlert() {
      var shouldBeActive = this.model.lookupsModel.hasEnabledAlerts();
      var bellIcon = this.$("td.".concat(alertTdClass, " i"));
      bellIcon.toggleClass('active-icon', shouldBeActive);
      var tooltipMessage = shouldBeActive ? 'Active alerts' : 'No active alerts';
      bellIcon.tooltip('destroy');
      bellIcon.tooltip({
        title: tooltipMessage,
        animatation: false,
        container: 'body'
      });
    },
    events: {
      'click a.edit-permissions': function click_aEditPermissions(e) {
        this.children.permissionsDialog = new _PermissionsDialog.default({
          document: this.model.lookupsModel,
          nameModel: this.model.lookupsModel.experimentInfo,
          user: this.model.user,
          serverInfo: this.model.serverInfo,
          application: this.model.application
        }, this.collection, this.options);
        this.children.permissionsDialog.render().appendTo((0, _swcMltk.jquery)('body')).show();
        e.preventDefault();
      }
    },
    render: function render() {
      // Convert experiment type to page
      var destinationAssistantPage = this.model.lookupsModel.getType();

      // Get page info & destination page
      var pageInfo = _swcMltk.mvcUtils.getPageInfo();

      // redirect user to actual assistant page
      var urlEncodedExperimentId = {
        data: {
          experimentId: this.model.lookupsModel.getId()
        }
      };
      this.$el.html(this.compiledTemplate({
        experimentName: this.model.lookupsModel.getFormattedName(),
        experimentLink: _swcMltk.route.page(pageInfo.root, pageInfo.locale, pageInfo.app, destinationAssistantPage, urlEncodedExperimentId),
        hasActions: this.options.hasActions,
        algorithm: this.model.lookupsModel.getAlgorithm()
      }));
      var actionsEditEl = this.$(".".concat(actionsEditClass)).css({});
      if (this.children.publishDialogView) this.children.publishDialogView.render().prependTo(actionsEditEl);
      this.children.manageDropdownView.render().prependTo(this.$(actionsEditEl));
      actionsEditEl.children().css({
        display: 'inline-block',
        'min-width': '50%'
      });
      this.updateScheduledTraining();
      this.updateAlert();
      return this;
    },
    template: "\n        <td class=\"expands\">\n            <a href=\"#\"><i class=\"icon-triangle-right-small\"></i></a>\n        </td>\n        <td class=\"title\">\n            <a href=\"<%= experimentLink %>\" title=\"<%- experimentName %>\" class=\"\"><%- experimentName %></a>\n        </td>\n        <td class=\"algorithm\">\n            <%- algorithm %>\n        </td>\n        <td class=\"".concat(scheduledTrainingTdClass, " icon-cell\">\n            <i class=\"icon-large icon-clock\"></i>\n        </td>\n        <td class=\"").concat(alertTdClass, " icon-cell\">\n            <i class=\"icon-large icon-bell\"></i>\n        </td>\n        <% if (hasActions) { %>\n        <td class=\"actions ").concat(actionsEditClass, "\">\n        </td>\n        <% } %>\n    ")
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "splunkui/IconCard/Body":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("splunkui/IconCard/IconCard.styles")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _Card, _IconCard) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  var _excluded = ["children", "icon"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  /* eslint-disable react/forbid-foreign-prop-types */
  var propTypes = _objectSpread(_objectSpread({}, _Card.Body.propTypes), {}, {
    icon: _propTypes.default.string
  });
  /* eslint-enable react/forbid-foreign-prop-types */
  var defaultProps = {
    icon: null
  };
  var IconCardBody = function IconCardBody(_ref) {
    var children = _ref.children,
      icon = _ref.icon,
      props = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement(_Card.Body, props, /*#__PURE__*/_react.default.createElement(_IconCard.BodyIcon, {
      className: "icon ".concat(icon),
      icon: icon
    }), children);
  };
  IconCardBody.propTypes = propTypes;
  IconCardBody.defaultProps = defaultProps;
  var _default = _exports.default = IconCardBody;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "splunkui/IconCard/Header":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/react-style-proptype/src/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _reactStyleProptype, _Card) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _reactStyleProptype = _interopRequireDefault(_reactStyleProptype);
  var _excluded = ["style"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var propTypes = {
    style: _reactStyleProptype.default,
    title: _propTypes.default.string.isRequired
  };
  var defaultProps = {
    style: {}
  };
  var headerStyleOverrides = {
    // Icon cards have centered titles
    justifyContent: 'center'
  };

  // Hack header to center text
  var IconCardHeader = function IconCardHeader(_ref) {
    var style = _ref.style,
      props = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement(_Card.Header, _extends({
      style: _objectSpread(_objectSpread({}, style), headerStyleOverrides)
    }, props));
  };
  IconCardHeader.propTypes = propTypes;
  IconCardHeader.defaultProps = defaultProps;
  var _default = _exports.default = IconCardHeader;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "splunkui/IconCard/IconCard":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/react-style-proptype/src/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("splunkui/IconCard/Header"), __webpack_require__("splunkui/IconCard/Body")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _reactStyleProptype, _Card, _Header, _Body) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _reactStyleProptype = _interopRequireDefault(_reactStyleProptype);
  _Card = _interopRequireDefault(_Card);
  _Header = _interopRequireDefault(_Header);
  _Body = _interopRequireDefault(_Body);
  var _excluded = ["children", "icon", "style", "title"]; // A React UI card (http://splunkui.sv.splunk.com/Packages/react-ui/Card) that
  // supports icons.
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var propTypes = {
    children: _propTypes.default.node.isRequired,
    icon: _propTypes.default.string,
    style: _reactStyleProptype.default,
    title: _propTypes.default.string
  };
  var defaultProps = {
    icon: '',
    style: {},
    title: ''
  };
  var cardStyleHack = {
    display: 'inline-flex' // hack to work around react-ui bug (SUI-1499)
  };
  var IconCard = function IconCard(_ref) {
    var children = _ref.children,
      icon = _ref.icon,
      style = _ref.style,
      title = _ref.title,
      props = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement(_Card.default, _extends({}, props, {
      style: _objectSpread(_objectSpread({}, style), cardStyleHack)
    }), title ? /*#__PURE__*/_react.default.createElement(_Header.default, {
      title: title
    }) : null, /*#__PURE__*/_react.default.createElement(_Body.default, {
      icon: icon
    }, children));
  };
  IconCard.propTypes = propTypes;
  IconCard.defaultProps = defaultProps;
  var _default = _exports.default = IconCard;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "splunkui/IconCard/IconCard.styles":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BodyIcon = void 0;
  _styledComponents = _interopRequireWildcard(_styledComponents);
  var _templateObject, _templateObject2;
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var iconStyles = "\n    display: block;\n    font-size: 72px;\n    line-height: 1;\n    text-align: center;\n    margin-bottom: 10px;\n    color: #1e93c6;\n";
  var BodyIcon = _exports.BodyIcon = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    ", "\n"])), function (props) {
    return props.icon ? (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["", ""])), iconStyles) : '';
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiments.es","pages_common"]]]);