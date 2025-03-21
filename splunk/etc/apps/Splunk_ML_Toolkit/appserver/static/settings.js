(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["settings"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/settings.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Settings.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Settings, _swcMltk) {
  "use strict";

  _Settings = _interopRequireDefault(_Settings);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Settings.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/collections/Algorithms.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _exports.default = _swcMltk.SplunkDsBaseCollection.extend({
    url: 'configs/conf-algos'
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Settings.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/collections/Algorithms.es"), __webpack_require__("./src/main/webapp/routers/BaseListings.es"), __webpack_require__("settings/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _underscoreMltk, _i18n, _swcMltk, _Algorithms, _BaseListings, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _Algorithms = _interopRequireDefault(_Algorithms);
  _BaseListings = _interopRequireDefault(_BaseListings);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var SettingsRouter = _BaseListings.default.extend({
    initialize: function initialize() {
      var _this = this;
      _BaseListings.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Algorithm Settings'));
      this.model.state = new _swcMltk.BaseModel({
        count: 100,
        offset: 0
      });
      this.collection.algorithms = new _Algorithms.default();
      this.debouncedFetchListCollection = _underscoreMltk.default.debounce(function () {
        _this.fetchListCollection();
      }, 0);
      this.model.state.on('change:sortDir change:sortKey change:search change:offset', this.debouncedFetchListCollection, this);
    },
    page: function page() {
      var _this2 = this;
      _BaseListings.default.prototype.page.apply(this, arguments);
      if (!this.settingsView) {
        this.settingsView = new _Master.default({
          model: {
            application: this.model.application,
            classicurl: this.model.classicurl,
            state: this.model.state,
            rawSearch: this.rawSearch,
            uiPrefs: this.uiPrefsModel
          },
          collection: {
            algorithms: this.collection.algorithms
          },
          deferreds: {
            layout: this.deferreds.layout
          }
        });
        _swcMltk.jquery.when(this.deferreds.layout).then(function (layout) {
          layout.getContainerElement().appendChild(_this2.settingsView.render().el);
          _this2.debouncedFetchListCollection();
        });
      }
      this.uiPrefsModel.entry.content.on('change', function () {
        _this2.populateUIPrefs();
      });
    },
    fetchListCollection: function fetchListCollection() {
      var _this3 = this;
      this.model.state.set('fetching', true);
      return this.collection.algorithms.fetch({
        data: {
          app: this.model.application.get('app'),
          owner: 'nobody',
          sort_dir: this.model.state.get('sortDir'),
          sort_key: this.model.state.get('sortKey'),
          sort_mode: 'natural',
          search: this.model.state.get('search'),
          count: this.model.state.get('count'),
          offset: this.model.state.get('offset')
        },
        emulateJSON: true
      }).always(function () {
        _this3.model.state.set('fetching', false);
      });
    }
  });
  var _default = _exports.default = SettingsRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "algorithms/table/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/reactadapterbase.js"), module, __webpack_require__("./src/main/webapp/collections/Algorithms.es"), __webpack_require__("algorithms/table/TableContainer")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _swcMltk, _reactadapterbase, _module, _Algorithms, _TableContainer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _module = _interopRequireDefault(_module);
  _Algorithms = _interopRequireDefault(_Algorithms);
  _TableContainer = _interopRequireDefault(_TableContainer);
  var _excluded = ["collection", "model"]; // react-hot-loader must be loaded before react & react-dom
  // It is also safe to install as regular dependency, has minimal footprint
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var HotTableContainer = (0, _root.hot)(_TableContainer.default);
  var _default = _exports.default = _reactadapterbase.ReactAdapterBaseView.extend({
    moduleId: _module.default.id,
    /**
     * @param {Object} options The props supported by <Form>
     */
    initialize: function initialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _reactadapterbase.ReactAdapterBaseView.prototype.initialize.apply(this, options);
      this.collection = this.collection || {};
      this.model = this.model || {};
      var collection = options.collection,
        model = options.model,
        props = _objectWithoutProperties(options, _excluded);
      this.collection.algorithms = this.collection.algorithms || new _Algorithms.default();
      this.model.props = this.model.props || new _swcMltk.Backbone.Model();
      this.model.props.set(props);
    },
    getComponent: function getComponent() {
      return _react.default.createElement(HotTableContainer, {
        collection: this.collection,
        model: this.model
      });
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "algorithms/table/Table":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Link.js"), __webpack_require__("./node_modules/@splunk/react-ui/Table.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esFunctionName, _react, _propTypes, _Link, _Table, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Link = _interopRequireDefault(_Link);
  _Table = _interopRequireDefault(_Table);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    algorithms: _propTypes.default.arrayOf(_propTypes.default.object),
    dataTest: _propTypes.default.string,
    getUrl: _propTypes.default.func.isRequired,
    onSort: _propTypes.default.func.isRequired,
    sortDir: _propTypes.default.string
  };
  var defaultProps = {
    algorithms: [],
    dataTest: null,
    sortDir: 'none'
  };
  var AlgorithmTable = function AlgorithmTable(_ref) {
    var algorithms = _ref.algorithms,
      dataTest = _ref.dataTest,
      getUrl = _ref.getUrl,
      _onSort = _ref.onSort,
      sortDir = _ref.sortDir;
    // SplunkUI doesn't handle overriding data-test correctly when it's undefined
    // so we need to do the check ourselves and not pass it to the Multiselect in that case
    var extraProps = {};
    if (dataTest != null) extraProps['data-test'] = dataTest;
    return /*#__PURE__*/_react.default.createElement(_Table.default, {
      stripeRows: true
    }, /*#__PURE__*/_react.default.createElement(_Table.default.Head, null, /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
      onSort: function onSort(e, attributes) {
        return _onSort(attributes);
      },
      sortDir: sortDir,
      sortKey: "name"
    }, (0, _i18n.gettext)('Algorithm name')), /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, null, (0, _i18n.gettext)('Script filename')), /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, null, (0, _i18n.gettext)('App'))), /*#__PURE__*/_react.default.createElement(_Table.default.Body, null, algorithms.map(function (algo) {
      return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
        key: algo.name,
        data: algo
      }, /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(_Link.default, {
        to: getUrl(algo.name)
      }, algo.name)), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, algo.name, (0, _i18n.gettext)('.py')), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, algo['eai:appName']));
    })));
  };
  AlgorithmTable.propTypes = propTypes;
  AlgorithmTable.defaultProps = defaultProps;
  var _default = _exports.default = AlgorithmTable;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "algorithms/table/TableContainer":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.reflect.construct.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("algorithms/table/Table")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFilter, _esArrayMap, _esFunctionName, _esObjectSetPrototypeOf, _esObjectToString, _underscoreMltk, _react, _propTypes, _Table) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Table = _interopRequireDefault(_Table);
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
  function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
  function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
  function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
  function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
  function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /* eslint-disable react/destructuring-assignment */
  var propTypes = {
    collection: _propTypes.default.shape({
      algorithms: _propTypes.default.object.isRequired // eslint-disable-line react/forbid-prop-types
    }).isRequired,
    model: _propTypes.default.shape({
      props: _propTypes.default.object.isRequired // eslint-disable-line react/forbid-prop-types
    }).isRequired
  };
  var AlgorithmsTableContainer = /*#__PURE__*/function (_Component) {
    function AlgorithmsTableContainer(props, context) {
      var _this;
      _classCallCheck(this, AlgorithmsTableContainer);
      _this = _callSuper(this, AlgorithmsTableContainer, [props, context]);
      _this.state = {
        algorithms: _this.parseAlgorithmsCollectionToProps()
      };

      // debounce collection change handler, since it can be triggered from multiple events
      _this.handleCollectionChange = _underscoreMltk.default.debounce(_this.handleCollectionChange, _this);
      return _this;
    }
    _inherits(AlgorithmsTableContainer, _Component);
    return _createClass(AlgorithmsTableContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;
        this.props.model.props.on('change', function (model) {
          _this2.setState(model.changed);
        });
        this.props.collection.algorithms.on('add remove reset', this.handleCollectionChange, this);
      }
    }, {
      key: "handleCollectionChange",
      value: function handleCollectionChange() {
        this.setState({
          algorithms: this.parseAlgorithmsCollectionToProps()
        });
      }
    }, {
      key: "parseAlgorithmsCollectionToProps",
      value: function parseAlgorithmsCollectionToProps() {
        return this.props.collection.algorithms.map(function (algoModel) {
          return _objectSpread(_objectSpread({}, algoModel.entry.content.toJSON()), {}, {
            name: algoModel.entry.get('name')
          });
        }).filter(function (props) {
          return props.name != null && props.name.length > 0;
        });
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_react.default.createElement(_Table.default, _extends({}, this.state, this.props.model.props.attributes));
      }
    }]);
  }(_react.Component);
  AlgorithmsTableContainer.propTypes = propTypes;
  var _default = _exports.default = AlgorithmsTableContainer;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "settings/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("algorithms/table/Master"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/util/url.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _module, _Master, _BaseDashboard, _url) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _Master = _interopRequireDefault(_Master);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var MLSPLSettingsView = _BaseDashboard.default.extend({
    moduleId: _module.default.id,
    headerOptions: {
      title: 'Algorithm Settings',
      description: "Configure settings for the fit and apply commands. You can configure default settings for all algorithms, or configure setting for an individual algorithm.\n                      The default settings will be applied to each algorithm unless it has its own value for a particular setting."
    },
    initialize: function initialize(options) {
      _BaseDashboard.default.prototype.initialize.call(this, options);
    },
    render: function render() {
      _BaseDashboard.default.prototype.render.call(this);
      var defaultStanzaUrl = (0, _url.buildMLTKPageUrl)(this.model.application, 'algorithm', {
        data: {
          stanza: 'default'
        }
      });
      (0, _swcMltk.jquery)("<a class=\"btn\" href=\"".concat(defaultStanzaUrl, "\">Edit Default Settings</a>")).appendTo(this.children.header.buttonWrapper);
      this.children.tableCaptionView = new _swcMltk.TableCaptionView({
        countLabel: 'Algorithms',
        model: {
          state: this.model.state,
          uiPrefs: this.model.uiPrefs
        },
        collection: this.collection.algorithms,
        noFilterButtons: true
      }).render();
      this.children.algorithmTableView = new _Master.default({
        collection: {
          algorithms: this.collection.algorithms
        },
        getUrl: function (algorithm) {
          return (0, _url.buildMLTKPageUrl)(this.model.application, 'algorithm', {
            data: {
              stanza: algorithm
            }
          });
        }.bind(this),
        onSort: function (sortSettings) {
          var sortDir = sortSettings.sortDir === 'asc' ? 'desc' : 'asc';
          this.model.state.set('sortDir', sortDir);
          this.children.algorithmTableView.model.props.set('sortDir', sortDir);
          this.model.state.set('sortKey', sortSettings.sortKey);
        }.bind(this)
      }).render();
      this.$el.append(this.children.tableCaptionView.el, this.children.algorithmTableView.el);
      return this;
    }
  });
  var _default = _exports.default = MLSPLSettingsView;
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/settings.es","pages_common"]]]);