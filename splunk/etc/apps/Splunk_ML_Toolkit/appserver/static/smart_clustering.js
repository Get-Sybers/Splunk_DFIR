(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["smart_clustering"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/smart_clustering.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/SmartClustering.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_SmartClustering, _swcMltk) {
  "use strict";

  _SmartClustering = _interopRequireDefault(_SmartClustering);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _SmartClustering.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/ExperimentSummary/ExperimentSummary.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/JSXString.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentSummary/ExperimentSummary.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentSummary/FieldNames.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _constants, _util, _JSXString, _ExperimentSummary, _FieldNames, _constants2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _JSXString = _interopRequireDefault(_JSXString);
  _FieldNames = _interopRequireDefault(_FieldNames);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * Natural language summary of the experiment.
   * Hangs out under the experiment title bar.
   * Displays whenever it has enough information to generate its content (requires the postProcessing steps to run)
   */

  var summaryText = function summaryText(value) {
    return value === 1 ? (0, _i18n.gettext)("Generated %{CLUSTERS} cluster out of %{TARGETS}") : (0, _i18n.gettext)("Generated %{CLUSTERS} clusters out of %{TARGETS}");
  };
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        searchStages: _propTypes.default.array.isRequired,
        postprocessingStages: _propTypes.default.array
      })
    }).isRequired
  };
  var ExperimentSummary = function ExperimentSummary(_ref) {
    var experiment = _ref.experiment;
    var searchStages = experiment.data.searchStages;
    var searchStagesDone = (0, _util.isAllStageDataReady)(searchStages);
    if (!searchStagesDone) {
      return null;
    }
    var mainStage = (0, _util.getStagesByRole)(searchStages, _constants.STAGE_ROLES.MAIN)[0];
    if (!mainStage || !mainStage.algorithmParams) {
      return null;
    }
    var clusterCountAndDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.CLUSTER_COUNT_AND_DISTANCE_STAGE_ID);
    if (!clusterCountAndDistanceStage || !clusterCountAndDistanceStage.parsedData) {
      return null;
    }
    var kValue = clusterCountAndDistanceStage.parsedData.numberOfClusters;
    var vars = {
      TARGETS: /*#__PURE__*/_react.default.createElement(_FieldNames.default, {
        "data-test": "targets",
        fields: mainStage.targetVariables
      }),
      CLUSTERS: /*#__PURE__*/_react.default.createElement(_ExperimentSummary.Variable, {
        "data-test": "summary-clusters"
      }, kValue)
    };
    return /*#__PURE__*/_react.default.createElement(_ExperimentSummary.SummaryHeading, {
      "data-test": "experiment-summary-sc"
    }, /*#__PURE__*/_react.default.createElement(_JSXString.default, {
      string: summaryText(kValue),
      vars: vars
    }));
  };
  ExperimentSummary.propTypes = propTypes;
  var _default = _exports.default = ExperimentSummary;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/SmartClustering.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentContainer/ExperimentContainer.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Define.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Learn/Learn.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Operationalize.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/ExperimentSummary/ExperimentSummary.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _i18n, _swcMltk, _constants, _ExperimentContainer, _Define, _Learn, _Review, _Operationalize, _ExperimentSummary) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ExperimentContainer = _interopRequireDefault(_ExperimentContainer);
  _Define = _interopRequireDefault(_Define);
  _Learn = _interopRequireDefault(_Learn);
  _Review = _interopRequireDefault(_Review);
  _Operationalize = _interopRequireDefault(_Operationalize);
  _ExperimentSummary = _interopRequireDefault(_ExperimentSummary);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var titleStr = (0, _i18n.gettext)('Smart Clustering: %s');
  var propTypes = {
    experimentContext: _propTypes.default.shape({
      experiment: _propTypes.default.shape({
        data: _propTypes.default.object
      }).isRequired
    }).isRequired
  };
  var WizardSteps = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _constants.STEP_DEFINE, _Define.default), _constants.STEP_LEARN, _Learn.default), _constants.STEP_REVIEW, _Review.default), _constants.STEP_OPERATIONALIZE, _Operationalize.default);
  var SmartClustering = function SmartClustering(props) {
    var experiment = props.experimentContext.experiment;
    var title = experiment.data ? _swcMltk.splunkUtil.sprintf(titleStr, experiment.data.title) : '';
    return /*#__PURE__*/_react.default.createElement(_ExperimentContainer.default, _extends({
      ExperimentSummary: _ExperimentSummary.default,
      title: title,
      WizardSteps: WizardSteps
    }, props));
  };
  SmartClustering.propTypes = propTypes;
  var _default = _exports.default = SmartClustering;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/SmartClusteringContext.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/components/experiments/shared/context/assistant.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _assistant) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "initialState", {
    enumerable: true,
    get: function get() {
      return _assistant.initialState;
    }
  });
  Object.defineProperty(_exports, "reducer", {
    enumerable: true,
    get: function get() {
      return _assistant.reducer;
    }
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Define.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/components/experiments/shared/DefineContainer.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _DefineContainer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _DefineContainer = _interopRequireDefault(_DefineContainer);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _DefineContainer.default;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Learn/EvaluateTab.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./node_modules/@splunk/react-ui/RadioBar.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/ClusteringVizWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/SelectablePanel/SelectablePanel.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/mixins.styles.es"), __webpack_require__("./src/main/webapp/components/shared/CompactMessage/CompactMessage.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Learn/EvaluateTab.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _ColumnLayout, _RadioBar, _Tooltip, _i18n, _util, _ClusteringVizWrapper, _SelectablePanel, _constants, _SingleValue, _mixins, _CompactMessage, _EvaluateTab) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.useShow3dView = _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _RadioBar = _interopRequireDefault(_RadioBar);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _ClusteringVizWrapper = _interopRequireDefault(_ClusteringVizWrapper);
  _SingleValue = _interopRequireDefault(_SingleValue);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var propTypes = {
    activeStage: _propTypes.default.shape({
      guid: _propTypes.default.string.isRequired,
      searchManagerId: _propTypes.default.string.isRequired
    }).isRequired,
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
      }),
      getDrilldownInfo: _propTypes.default.func.isRequired,
      getMainStage: _propTypes.default.any,
      getSearchInfo: _propTypes.default.func.isRequired
    }).isRequired,
    initialState: _propTypes.default.shape({
      is3dView: _propTypes.default.bool
    })
  };
  var defaultProps = {
    initialState: {
      is3dView: false
    }
  };
  var useShow3dView = _exports.useShow3dView = function useShow3dView(initialValue) {
    var _useState = (0, _react.useState)(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      show3dView = _useState2[0],
      set3dPlotView = _useState2[1];
    var handleShow3dViewChange = function handleShow3dViewChange(e, _ref) {
      var value = _ref.value;
      return set3dPlotView(value);
    };
    return {
      show3dView: show3dView,
      handleShow3dViewChange: handleShow3dViewChange
    };
  };
  var EvaluateTab = function EvaluateTab(_ref2) {
    var activeStage = _ref2.activeStage,
      experiment = _ref2.experiment,
      initialState = _ref2.initialState;
    var _useShow3dView = useShow3dView(initialState.is3dView),
      show3dView = _useShow3dView.show3dView,
      handleShow3dViewChange = _useShow3dView.handleShow3dViewChange;
    if (activeStage == null) {
      return null;
    }
    var _experiment$getMainSt = experiment.getMainStage(),
      targetVariables = _experiment$getMainSt.targetVariables;
    var silhouetteStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.SILHOUETTE_SCORE_STAGE_ID);
    var viewId = "".concat(activeStage.guid, "_viz");
    var vizStage = show3dView ? (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_3D_VIZ_STAGE_ID) : (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_2D_VIZ_STAGE_ID);
    var managerId = vizStage != null ? vizStage.searchManagerId : null;
    var silhouetteScore = silhouetteStage.parsedData;
    var clusterCountAndDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_COUNT_AND_DISTANCE_STAGE_ID);
    var _ref3 = clusterCountAndDistanceStage.parsedData || {},
      numberOfClusters = _ref3.numberOfClusters;
    return /*#__PURE__*/_react.default.createElement(_EvaluateTab.EvaluateWrapper, null, /*#__PURE__*/_react.default.createElement(_EvaluateTab.EvaluateHeader, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 4
    }), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 4
    }, /*#__PURE__*/_react.default.createElement(_RadioBar.default, {
      onChange: handleShow3dViewChange,
      value: show3dView
    }, /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
      "data-test": "2dScatterView",
      label: (0, _i18n.gettext)('2D Scatter Plot'),
      value: false
    }), /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
      "data-test": "3dScatterView",
      label: (0, _i18n.gettext)('3D Scatter Plot'),
      value: true
    }))), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 4
    }, /*#__PURE__*/_react.default.createElement(_EvaluateTab.SilhouetteControlGroup, {
      label: (0, _i18n.gettext)('Silhouette Score'),
      labelWidth: 140,
      tooltip: (0, _i18n.gettext)('Silhouette score ranges from -1 to +1 with a higher score indicating a better clustering configuration. Silhouette score is sensitive to outliers.')
    }, numberOfClusters === 1 ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: (0, _i18n.gettext)('Silhouette score is unavailable with 1 cluster.')
    }, /*#__PURE__*/_react.default.createElement(_CompactMessage.CompactMessage, {
      fill: true,
      type: "info"
    }, (0, _i18n.gettext)('N/A'))) : /*#__PURE__*/_react.default.createElement(_EvaluateTab.StyledStageStatusWrapper, {
      compact: true,
      errorMessage: (0, _i18n.gettext)('Error'),
      fillError: true,
      loadingMessage: (0, _i18n.gettext)('Loading...'),
      stage: silhouetteStage
    }, /*#__PURE__*/_react.default.createElement(_SingleValue.default, {
      "data-test": "silhouette-score",
      size: 2.4,
      value: silhouetteScore
    }))))))), /*#__PURE__*/_react.default.createElement(_mixins.VerticalLayoutWrapper, null, /*#__PURE__*/_react.default.createElement(_SelectablePanel.StyledBox, {
      disableSelection: true
    }, /*#__PURE__*/_react.default.createElement(_ClusteringVizWrapper.default, {
      availableFields: targetVariables,
      experiment: experiment,
      managerId: managerId,
      show3dView: show3dView,
      viewId: viewId
    }))));
  };
  EvaluateTab.propTypes = propTypes;
  EvaluateTab.defaultProps = defaultProps;
  var _default = _exports.default = EvaluateTab;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Learn/EvaluateTab.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes, _ControlGroup, _StageStatusWrapper) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledStageStatusWrapper = _exports.SilhouetteControlGroup = _exports.EvaluateWrapper = _exports.EvaluateHeader = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var EvaluateHeader = _exports.EvaluateHeader = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 10px 20px 0;\n    border-bottom: 1px solid ", ";\n"])), (0, _themes.variable)('borderLightColor'));
  var SilhouetteControlGroup = _exports.SilhouetteControlGroup = (0, _styledComponents.default)(_ControlGroup.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    margin-bottom: 10px;\n"])));
  var EvaluateWrapper = _exports.EvaluateWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    min-width: 720px; /* minimum width that shows all elements without squeezing */\n"])));
  var StyledStageStatusWrapper = _exports.StyledStageStatusWrapper = (0, _styledComponents.default)(_StageStatusWrapper.default)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    margin-bottom: 0;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Learn/Learn.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.assign.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/LearnContainer/LearnContainer.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/Fit/FitWrapper.jsx"), __webpack_require__("./src/main/webapp/data/algorithmSchemas/loadSchema.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Learn/EvaluateTab.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectAssign, _react, _i18n, _util, _constants, _LearnContainer, _FitWrapper, _loadSchema, _EvaluateTab) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _LearnContainer = _interopRequireDefault(_LearnContainer);
  _FitWrapper = _interopRequireDefault(_FitWrapper);
  _loadSchema = _interopRequireDefault(_loadSchema);
  _EvaluateTab = _interopRequireDefault(_EvaluateTab);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  var KMeansSchema = (0, _loadSchema.default)('KMeans');
  var PCASchema = (0, _loadSchema.default)('PCA');
  var KernelPCASchema = (0, _loadSchema.default)('KernelPCA');
  var StandardScalerSchema = (0, _loadSchema.default)('StandardScaler');
  var defaultSubmitText = (0, _i18n.gettext)('Preprocess');
  var clusterSubmitText = (0, _i18n.gettext)('Find Clusters');
  var clusterTitle = (0, _i18n.gettext)('Cluster Events');
  var getStageRenderers = function getStageRenderers(stage) {
    var submitText = defaultSubmitText;
    var title = stage.algorithm;
    if ((0, _util.checkStageState)(stage, {
      type: _constants.STAGE_TYPES.FIT
    })) {
      var renderMethod;
      switch (stage.algorithm) {
        case 'KMeans':
          renderMethod = function renderMethod(params) {
            return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({
              schema: KMeansSchema
            }, params));
          };
          submitText = clusterSubmitText;
          title = clusterTitle;
          break;
        case 'PCA':
          renderMethod = function renderMethod(params) {
            return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({
              schema: PCASchema
            }, params));
          };
          break;
        case 'KernelPCA':
          renderMethod = function renderMethod(params) {
            return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({
              schema: KernelPCASchema
            }, params));
          };
          break;
        case 'StandardScaler':
          renderMethod = function renderMethod(params) {
            return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({
              schema: StandardScalerSchema
            }, params));
          };
          break;
        default:
          renderMethod = null;
      }
      return {
        render: renderMethod,
        submitText: submitText,
        title: title
      };
    }
    return null;
  };
  var getCustomEvaluateRendererInfo = function getCustomEvaluateRendererInfo(_ref) {
    var stage = _ref.stage;
    if ((0, _util.checkStageState)(stage, {
      role: _constants.STAGE_ROLES.MAIN,
      status: _constants.STAGE_STATUSES.DATA
    })) {
      return {
        /* eslint-disable react/prop-types */render: function render(_ref2) {
          var experiment = _ref2.experiment,
            previousStage = _ref2.previousStage,
            activeStage = _ref2.activeStage;
          /* eslint-enable react/prop-types */
          return /*#__PURE__*/_react.default.createElement(_EvaluateTab.default, {
            activeStage: activeStage,
            experiment: experiment,
            previousStage: previousStage
          });
        },
        getPostprocessingStageId: function getPostprocessingStageId() {
          return null;
        },
        label: (0, _i18n.gettext)('Evaluate'),
        useDefaultRenderer: false
      };
    } else {
      return {
        useDefaultRenderer: false,
        render: null
      };
    }
  };
  var stageAddTypes = [{
    label: (0, _i18n.gettext)('PCA'),
    data: {
      type: 'fit',
      algorithm: 'PCA'
    }
  }, {
    label: (0, _i18n.gettext)('KernelPCA'),
    data: {
      type: 'fit',
      algorithm: 'KernelPCA'
    }
  }, {
    label: (0, _i18n.gettext)('StandardScaler'),
    data: {
      type: 'fit',
      algorithm: 'StandardScaler'
    }
  }];
  var Learn = function Learn(props) {
    return /*#__PURE__*/_react.default.createElement(_LearnContainer.default, _extends({}, props, {
      getCustomEvaluateRendererInfo: getCustomEvaluateRendererInfo,
      getStageRenderers: getStageRenderers,
      stageAddTypes: stageAddTypes
    }));
  };
  var _default = _exports.default = Learn;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Operationalize.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.assign.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/Operationalize/Operationalize.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectAssign, _react, _i18n, _Operationalize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _Operationalize = _interopRequireDefault(_Operationalize);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  var title = (0, _i18n.gettext)('Operationalize Clustering');
  var modelTitle = (0, _i18n.gettext)('Publish Clustering Models');
  var _default = _exports.default = function _default(props) {
    return /*#__PURE__*/_react.default.createElement(_Operationalize.default, _extends({}, props, {
      modelTitle: modelTitle,
      title: title
    }));
  };
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Controls/ClusterFilter/ClusterFilter.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Controls/ClusterFilter/ClusterFilter.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _Select, _i18n, _util, _constants, _ClusterFilter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Select = _interopRequireDefault(_Select);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    availableClusterOptions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    value: _propTypes.default.string,
    onChange: _propTypes.default.func.isRequired
  };
  var defaultProps = {
    value: _constants.ALL_CLUSTERS_FIELD
  };
  var ClusterFilter = function ClusterFilter(_ref) {
    var availableClusterOptions = _ref.availableClusterOptions,
      value = _ref.value,
      onChange = _ref.onChange;
    var clusterOptions = availableClusterOptions.map(function (clusterOption) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: clusterOption,
        label: (0, _util.patchClusterForLabel)(clusterOption),
        value: clusterOption
      });
    });
    return clusterOptions.length > 0 ? /*#__PURE__*/_react.default.createElement(_ClusterFilter.ControlsWrapper, null, /*#__PURE__*/_react.default.createElement(_ClusterFilter.TextWrapper, null, (0, _i18n.gettext)('View details for')), /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "clusterFilter",
      onChange: onChange,
      value: value
    }, clusterOptions)) : null;
  };
  ClusterFilter.propTypes = propTypes;
  ClusterFilter.defaultProps = defaultProps;
  var _default = _exports.default = ClusterFilter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Controls/ClusterFilter/ClusterFilter.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TextWrapper = _exports.ControlsWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var ControlsWrapper = _exports.ControlsWrapper = _styledComponents.default.section(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: flex-end;\n"])));
  var TextWrapper = _exports.TextWrapper = _styledComponents.default.span(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    margin: auto 0.5em auto 0;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/InterclusterDistance/Card/Content.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/math.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/TrioValues/TrioValues.jsx"), __webpack_require__("./src/main/webapp/components/icons/MinBoundary.jsx"), __webpack_require__("./src/main/webapp/components/icons/MaxBoundary.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esObjectToString, _react, _propTypes, _Message, _i18n, _math, _constants, _util, _StageStatusWrapper, _TrioValues, _MinBoundary, _MaxBoundary) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Message = _interopRequireDefault(_Message);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _TrioValues = _interopRequireDefault(_TrioValues);
  _MinBoundary = _interopRequireDefault(_MinBoundary);
  _MaxBoundary = _interopRequireDefault(_MaxBoundary);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var notAvailableText = (0, _i18n.gettext)('N/A');
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        searchStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          status: _propTypes.default.string,
          targetVariables: _propTypes.default.arrayOf(_propTypes.default.string)
        })).isRequired,
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array]),
          status: _propTypes.default.string
        }))
      }),
      getMainStage: _propTypes.default.func.isRequired
    }).isRequired
  };
  var Content = function Content(_ref) {
    var experiment = _ref.experiment;
    var clusterCountAndDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_COUNT_AND_DISTANCE_STAGE_ID) || {};
    var clusterCountParsedData = clusterCountAndDistanceStage.parsedData;
    var _ref2 = clusterCountParsedData || {},
      numberOfClusters = _ref2.numberOfClusters;
    var interclusterDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.INTERCLUSTER_DISTANCE_STAGE_ID) || {};
    var parsedData = interclusterDistanceStage.parsedData;
    var _ref3 = parsedData || {},
      _ref3$rows = _ref3.rows,
      rows = _ref3$rows === void 0 ? [] : _ref3$rows;
    var values = rows.map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
        value = _ref5[1];
      return value;
    });
    var _ref6 = values.length > 0 && {
        max: Math.max.apply(Math, _toConsumableArray(values)),
        min: Math.min.apply(Math, _toConsumableArray(values)),
        average: (0, _math.roundToDecimal)(values.reduce(function (acc, cur) {
          return acc + cur;
        }, 0) / values.length, -1 * _constants.CLUSTER_DISTANCE_DECIMALS)
      },
      _ref6$max = _ref6.max,
      max = _ref6$max === void 0 ? notAvailableText : _ref6$max,
      _ref6$min = _ref6.min,
      min = _ref6$min === void 0 ? notAvailableText : _ref6$min,
      _ref6$average = _ref6.average,
      average = _ref6$average === void 0 ? notAvailableText : _ref6$average;

    // because the icons are static (no props provided),
    // use useCallback to prevent unnecessary re-renders (because TrioValues is memo'd)
    var lowerIcon = (0, _react.useCallback)( /*#__PURE__*/_react.default.createElement(_MinBoundary.default, null), []);
    var upperIcon = (0, _react.useCallback)( /*#__PURE__*/_react.default.createElement(_MaxBoundary.default, null), []);
    return numberOfClusters === 1 ? /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: clusterCountAndDistanceStage
    }, /*#__PURE__*/_react.default.createElement(_Message.default, {
      type: "info"
    }, _constants.INTERCLUSTER_K_1_MESSAGE)) : /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      noData: values.length === 0,
      stage: interclusterDistanceStage
    }, /*#__PURE__*/_react.default.createElement(_TrioValues.default, {
      centralLabel: (0, _i18n.gettext)('Average'),
      centralValue: average,
      lowerIcon: lowerIcon,
      lowerLabel: (0, _i18n.gettext)('Minimum'),
      lowerValue: min,
      upperIcon: upperIcon,
      upperLabel: (0, _i18n.gettext)('Maximum'),
      upperValue: max
    }));
  };
  Content.propTypes = propTypes;
  var _default = _exports.default = Content;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/InterclusterDistance/InterclusterDistance.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Controls/ClusterFilter/ClusterFilter.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayConcat, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _Message, _swcMltk, _util, _constants, _ClusterFilter, _StageStatusWrapper, _CustomViz, _Review) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Message = _interopRequireDefault(_Message);
  _ClusterFilter = _interopRequireDefault(_ClusterFilter);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _CustomViz = _interopRequireDefault(_CustomViz);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        searchStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          status: _propTypes.default.string,
          targetVariables: _propTypes.default.arrayOf(_propTypes.default.string)
        })).isRequired,
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array]),
          status: _propTypes.default.string
        }))
      }),
      getMainStage: _propTypes.default.func.isRequired,
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired
    }).isRequired,
    filteredClusters: _propTypes.default.shape(_defineProperty({}, _constants.INTERCLUSTER_DISTANCE, _propTypes.default.string)).isRequired,
    onClusterFilterChange: _propTypes.default.func.isRequired
  };
  var InterclusterDistance = function InterclusterDistance(_ref) {
    var experiment = _ref.experiment,
      filteredClusters = _ref.filteredClusters,
      onClusterFilterChange = _ref.onClusterFilterChange;
    var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      availableClusterOptions = _useState2[0],
      setClusterOptions = _useState2[1];
    var filteredCluster = filteredClusters[_constants.INTERCLUSTER_DISTANCE];

    // #region setup
    var clusterCountAndDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_COUNT_AND_DISTANCE_STAGE_ID) || {};
    var clusterCountParsedData = clusterCountAndDistanceStage.parsedData;
    var _ref2 = clusterCountParsedData || {},
      numberOfClusters = _ref2.numberOfClusters;
    var interclusterDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.INTERCLUSTER_DISTANCE_STAGE_ID) || {};
    var interclusterDistanceFilteredStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.INTERCLUSTER_DISTANCE_FILTERED_STAGE_ID) || {};
    var clusterSummaryStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTERS_SUMMARY_STAGE_ID) || {};
    // #endregion setup

    // #region callbacks
    var handleControlsChange = (0, _react.useCallback)(function (e, _ref3) {
      var value = _ref3.value;
      interclusterDistanceFilteredStage.searchString = "| where like(InterCluster, \"%Cluster ".concat(value, "\") OR like(InterCluster, \"Cluster ").concat(value, " %\")");
      experiment.changePostprocessingStage(_constants.INTERCLUSTER_DISTANCE_FILTERED_STAGE_ID, _objectSpread({}, interclusterDistanceFilteredStage));
      experiment.runPostprocessingStage(_constants.INTERCLUSTER_DISTANCE_FILTERED_STAGE_ID, {
        afterStageGuid: interclusterDistanceStage.guid
      });
      onClusterFilterChange(_objectSpread(_objectSpread({}, filteredClusters), {}, _defineProperty({}, _constants.INTERCLUSTER_DISTANCE, value)));
    }, [experiment, filteredClusters, interclusterDistanceFilteredStage, interclusterDistanceStage.guid, onClusterFilterChange]);
    // #endregion callbacks

    // #region side-effects
    (0, _react.useEffect)(function () {
      var _ref4 = clusterSummaryStage.parsedData || {},
        clusterOptions = _ref4.clusterOptions;
      if (clusterOptions != null && Array.isArray(clusterOptions)) {
        setClusterOptions(clusterOptions);
      }
    }, [clusterSummaryStage.parsedData]);
    // #endregion

    return /*#__PURE__*/_react.default.createElement(_Review.ContentWrapper, null, numberOfClusters === 1 ? /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      "data-test": "cluster-count-stage",
      stage: clusterCountAndDistanceStage
    }, /*#__PURE__*/_react.default.createElement(_Message.default, {
      type: "info"
    }, _constants.INTERCLUSTER_K_1_MESSAGE)) : /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      "data-test": "intercluster-distance-stage",
      stage: interclusterDistanceStage
    }, /*#__PURE__*/_react.default.createElement(_ClusterFilter.default, {
      availableClusterOptions: availableClusterOptions,
      onChange: handleControlsChange,
      value: filteredCluster
    }), /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: filteredCluster === _constants.ALL_CLUSTERS_FIELD ? interclusterDistanceStage.searchManagerId : interclusterDistanceFilteredStage.searchManagerId,
      options: {
        type: 'bar',
        height: 500,
        'charting.axisTitleX.visibility': 'collapsed',
        'charting.drilldown': 'none'
      },
      viewId: "interclusterDistanceViz",
      vizConstructor: _swcMltk.ChartView
    })));
  };
  InterclusterDistance.propTypes = propTypes;
  var _default = _exports.default = InterclusterDistance;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Card/Content.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Card/Content.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _Content) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    outliers: _propTypes.default.number,
    isNotSet: _propTypes.default.bool
  };
  var defaultProps = {
    outliers: 0,
    isNotSet: false
  };
  var NOT_SET = (0, _i18n.gettext)('not set');
  var Content = function Content(_ref) {
    var outliers = _ref.outliers,
      isNotSet = _ref.isNotSet;
    return /*#__PURE__*/_react.default.createElement(_Content.OutliersWrapper, null, isNotSet ? /*#__PURE__*/_react.default.createElement(_Content.NotSetLabel, null, NOT_SET) : /*#__PURE__*/_react.default.createElement(_Content.FlexSingleValue, {
      label: (0, _i18n.gettext)('Outliers'),
      value: outliers
    }));
  };
  Content.propTypes = propTypes;
  Content.defaultProps = defaultProps;
  var _default = _exports.default = Content;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Card/Content.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _SingleValue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.OutliersWrapper = _exports.NotSetLabel = _exports.FlexSingleValue = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _SingleValue = _interopRequireDefault(_SingleValue);
  var _templateObject, _templateObject2, _templateObject3;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var OutliersWrapper = _exports.OutliersWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n"])));
  var FlexSingleValue = _exports.FlexSingleValue = (0, _styledComponents.default)(_SingleValue.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n"])));
  var NotSetLabel = _exports.NotSetLabel = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n    font-size: 3em;\n    font-weight: bold;\n    line-height: 100%;\n    opacity: 0.5;\n    text-align: center;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/IntraclusterDistance.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/SliderControl/SliderControl.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Table/Table.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/useHistogramContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _esObjectKeys, _react, _propTypes, _Message, _i18n, _CustomViz, _util, _constants, _StageStatusWrapper, _SliderControl, _Table, _useHistogramContext, _Review) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Message = _interopRequireDefault(_Message);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _SliderControl = _interopRequireDefault(_SliderControl);
  _Table = _interopRequireDefault(_Table);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        searchStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          status: _propTypes.default.string,
          targetVariables: _propTypes.default.arrayOf(_propTypes.default.string)
        })).isRequired,
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array]),
          status: _propTypes.default.string
        }))
      }),
      getMainStage: _propTypes.default.func.isRequired,
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired,
      getDrilldownInfo: _propTypes.default.func.isRequired
    }).isRequired,
    initialState: _propTypes.default.shape({
      histogramContext: _propTypes.default.any
    }),
    filteredClusters: _propTypes.default.shape(_defineProperty({}, _constants.INTRACLUSTER_DISTANCE, _propTypes.default.string)).isRequired,
    onClusterFilterChange: _propTypes.default.func.isRequired
  };
  var defaultProps = {
    initialState: {}
  };
  var IntraclusterDistance = function IntraclusterDistance(_ref) {
    var experiment = _ref.experiment,
      initialState = _ref.initialState,
      filteredClusters = _ref.filteredClusters,
      onClusterFilterChange = _ref.onClusterFilterChange;
    var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      availableClusterOptions = _useState2[0],
      setClusterOptions = _useState2[1];
    var filteredCluster = filteredClusters[_constants.INTRACLUSTER_DISTANCE];

    // set default values for the test runner
    var intraclusterContext = (0, _react.useContext)(_useHistogramContext.Context);
    // fall back to initialState if `intraclusterContext` is an empty context.
    var _ref2 = Object.keys(intraclusterContext).length === 0 ? initialState.histogramContext : intraclusterContext,
      _ref2$state = _ref2.state,
      reducerState = _ref2$state === void 0 ? {} : _ref2$state;
    var _reducerState$histogr = reducerState.histogramState,
      histogramState = _reducerState$histogr === void 0 ? {} : _reducerState$histogr,
      showViz = reducerState.showViz;
    var intraclusterDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.INTRACLUSTER_DISTANCE_STAGE_ID) || {};
    var clusterSummaryStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTERS_SUMMARY_STAGE_ID) || {};
    var clusterCountAndDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_COUNT_AND_DISTANCE_STAGE_ID) || {};
    var _ref3 = clusterCountAndDistanceStage.parsedData || {},
      maxClusterDistance = _ref3.maxClusterDistance,
      minClusterDistance = _ref3.minClusterDistance;
    var managerId = intraclusterDistanceStage.searchManagerId;

    // #region side-effects
    // use `clusterSummaryStage.parsedData` to prevent infinite loop
    (0, _react.useEffect)(function () {
      var _ref4 = clusterSummaryStage.parsedData || {},
        clusterOptions = _ref4.clusterOptions;
      if (Array.isArray(clusterOptions)) {
        setClusterOptions(clusterOptions);
      }
    }, [clusterSummaryStage.parsedData]);
    // #endregion side-effects

    return /*#__PURE__*/_react.default.createElement(_Review.ContentWrapper, null, /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: clusterCountAndDistanceStage
    }, maxClusterDistance > minClusterDistance ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_SliderControl.default, {
      availableClusterOptions: availableClusterOptions,
      experiment: experiment,
      filteredCluster: filteredCluster,
      filteredClusters: filteredClusters,
      onClusterFilterChange: onClusterFilterChange
    }), showViz ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: managerId,
      namespacedOptions: {
        columnPadding: true,
        stacking: true,
        stackingMode: 'normal',
        yAxisLabel: (0, _i18n.gettext)('count'),
        activeSeries: filteredCluster,
        highlightRange: [histogramState.distanceCentroid, maxClusterDistance],
        showLegend: true,
        linePosition: histogramState.distanceCentroid
      },
      viewId: "intraclusterHistogramViz",
      vizType: "HistogramViz"
    }), /*#__PURE__*/_react.default.createElement(_Table.default, {
      experiment: experiment,
      filteredCluster: filteredCluster
    })) : /*#__PURE__*/_react.default.createElement(_Message.default, {
      type: "info"
    }, (0, _i18n.gettext)('Set a value for distance from centroid to see the visualization.'))) : /*#__PURE__*/_react.default.createElement(_Message.default, {
      type: "info"
    }, (0, _i18n.gettext)('Intracluster distance distribution is only available when cluster distance is not zero. A cluster distance value of zero can occur if you have a small dataset or if you have specified a large number of clusters that is close to the number of points in the data.'))));
  };
  IntraclusterDistance.propTypes = propTypes;
  IntraclusterDistance.defaultProps = defaultProps;
  var _default = _exports.default = IntraclusterDistance;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/SliderControl/SliderControl.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ml/SliderNumber.js"), __webpack_require__("./node_modules/@splunk/ui-utils/keyboard.js"), __webpack_require__("./node_modules/@splunk/ui-utils/userAgent.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Controls/ClusterFilter/ClusterFilter.jsx"), __webpack_require__("./src/main/webapp/models/experiment/SmartClustering.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/useHistogramContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/SliderControl/SliderControl.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _esObjectKeys, _react, _propTypes, _i18n, _SliderNumber, _keyboard, _userAgent, _ClusterFilter, _SmartClustering, _constants, _util, _useHistogramContext, _SliderControl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _SliderNumber = _interopRequireDefault(_SliderNumber);
  _ClusterFilter = _interopRequireDefault(_ClusterFilter);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array]),
          status: _propTypes.default.string
        }))
      })
    }).isRequired,
    filteredCluster: _propTypes.default.string.isRequired,
    filteredClusters: _propTypes.default.shape(_defineProperty({}, _constants.INTRACLUSTER_DISTANCE, _propTypes.default.string)).isRequired,
    onClusterFilterChange: _propTypes.default.func.isRequired,
    initialState: _propTypes.default.shape({
      histogramContext: _propTypes.default.any
    }),
    availableClusterOptions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
  };
  var defaultProps = {
    initialState: {}
  };
  var SliderControl = function SliderControl(_ref) {
    var experiment = _ref.experiment,
      availableClusterOptions = _ref.availableClusterOptions,
      initialState = _ref.initialState,
      onClusterFilterChange = _ref.onClusterFilterChange,
      filteredCluster = _ref.filteredCluster,
      filteredClusters = _ref.filteredClusters;
    // set default values for the test runner
    var intraclusterContext = (0, _react.useContext)(_useHistogramContext.Context);
    // fall back to initialState if `intraclusterContext` is an empty context.
    var _ref2 = Object.keys(intraclusterContext).length === 0 ? initialState.histogramContext : intraclusterContext,
      _ref2$state = _ref2.state,
      reducerState = _ref2$state === void 0 ? {} : _ref2$state,
      _ref2$dispatch = _ref2.dispatch,
      dispatch = _ref2$dispatch === void 0 ? function () {} : _ref2$dispatch;
    var _reducerState$histogr = reducerState.histogramState,
      histogramState = _reducerState$histogr === void 0 ? {} : _reducerState$histogr,
      showViz = reducerState.showViz;
    var clusterCountAndDistanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_COUNT_AND_DISTANCE_STAGE_ID) || {};
    var intraclusterResultsStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.INTRACLUSTER_RESULTS_STAGE_ID) || {};
    var _ref3 = clusterCountAndDistanceStage.parsedData || {},
      maxClusterDistance = _ref3.maxClusterDistance,
      minClusterDistance = _ref3.minClusterDistance;

    // #region callbacks
    var handleControlsChange = function handleControlsChange(e) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        value = _ref4.value;
      onClusterFilterChange(_objectSpread(_objectSpread({}, filteredClusters), {}, _defineProperty({}, _constants.INTRACLUSTER_DISTANCE, value)));
      (0, _SmartClustering.runIntraclusterResultsStage)({
        experiment: experiment,
        intraclusterResultsStage: intraclusterResultsStage,
        targetCluster: value,
        distanceCentroid: histogramState.distanceCentroid
      });
    };
    var handleDistanceCentroidChange = function handleDistanceCentroidChange(e, _ref5) {
      var value = _ref5.value;
      dispatch({
        type: _constants.SET_DISTANCE_CENTROID,
        payload: value
      });
    };
    var handleSetDistance = function handleSetDistance() {
      dispatch({
        type: _constants.UPDATE_VIZ_OPTIONS
      });
      (0, _SmartClustering.runIntraclusterResultsStage)({
        experiment: experiment,
        intraclusterResultsStage: intraclusterResultsStage,
        targetCluster: filteredCluster,
        distanceCentroid: reducerState.distanceCentroid
      });
    };

    // #endregion callbacks

    return /*#__PURE__*/_react.default.createElement(_SliderControl.ControlsWrapper, null, /*#__PURE__*/_react.default.createElement(_SliderControl.StyledControlGroup, {
      label: (0, _i18n.gettext)('Distance from centroid'),
      labelWidth: 150
    }, /*#__PURE__*/_react.default.createElement(_SliderControl.SliderNumberWrapper, {
      "data-test": "distanceFromCentroidSliderNumber"
    }, /*#__PURE__*/_react.default.createElement(_SliderNumber.default, {
      inline: (0, _userAgent.isIE11)(),
      max: maxClusterDistance,
      min: minClusterDistance,
      onChange: handleDistanceCentroidChange,
      onKeyUp: function onKeyUp(e) {
        if (_keyboard.keycode.isEventKey(e, 'enter')) {
          handleSetDistance();
        }
      },
      scale: "linear",
      value: reducerState.distanceCentroid
    })), /*#__PURE__*/_react.default.createElement(_SliderControl.StyledButton, {
      appearance: "primary",
      "data-test": "set-distance",
      label: (0, _i18n.gettext)('Set Distance'),
      onClick: handleSetDistance
    })), showViz && /*#__PURE__*/_react.default.createElement(_ClusterFilter.default, {
      availableClusterOptions: availableClusterOptions,
      onChange: handleControlsChange,
      value: filteredCluster
    }));
  };
  SliderControl.propTypes = propTypes;
  SliderControl.defaultProps = defaultProps;
  var _default = _exports.default = SliderControl;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/SliderControl/SliderControl.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Button, _ControlGroup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledControlGroup = _exports.StyledButton = _exports.SliderNumberWrapper = _exports.ControlsWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Button = _interopRequireDefault(_Button);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var SliderNumberWrapper = _exports.SliderNumberWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    margin-right: 20px;\n"])));
  var StyledButton = _exports.StyledButton = (0, _styledComponents.default)(_Button.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n"])));
  var StyledControlGroup = _exports.StyledControlGroup = (0, _styledComponents.default)(_ControlGroup.default)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    margin-bottom: 0;\n"])));
  var ControlsWrapper = _exports.ControlsWrapper = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: space-between;\n    margin: 0 0 32px 0;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Table/Table.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Heading.js"), __webpack_require__("./node_modules/@splunk/react-ui/Link.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/util.es"), __webpack_require__("./src/main/webapp/components/shared/SearchTable/SearchTable.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/useHistogramContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Table/Table.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectKeys, _react, _propTypes, _Heading, _Link, _format, _i18n, _constants, _util, _Review, _util2, _SearchTable, _useHistogramContext, _Table) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Heading = _interopRequireDefault(_Heading);
  _Link = _interopRequireDefault(_Link);
  _SearchTable = _interopRequireDefault(_SearchTable);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        searchStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          status: _propTypes.default.string,
          targetVariables: _propTypes.default.arrayOf(_propTypes.default.string)
        })).isRequired,
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array]),
          status: _propTypes.default.string
        }))
      }),
      getMainStage: _propTypes.default.func.isRequired,
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired,
      getDrilldownInfo: _propTypes.default.func.isRequired
    }).isRequired,
    initialState: _propTypes.default.shape({
      histogramContext: _propTypes.default.any
    }),
    filteredCluster: _propTypes.default.string.isRequired
  };
  var defaultProps = {
    initialState: {}
  };
  var Table = function Table(_ref) {
    var experiment = _ref.experiment,
      filteredCluster = _ref.filteredCluster,
      initialState = _ref.initialState;
    // set default values for the test runner
    var intraclusterContext = (0, _react.useContext)(_useHistogramContext.Context);
    // fall back to initialState if `intraclusterContext` is an empty context.
    var _ref2 = Object.keys(intraclusterContext).length === 0 ? initialState.histogramContext : intraclusterContext,
      _ref2$state = _ref2.state,
      reducerState = _ref2$state === void 0 ? {} : _ref2$state;
    var _reducerState$histogr = reducerState.histogramState,
      histogramState = _reducerState$histogr === void 0 ? {} : _reducerState$histogr;
    var intraclusterResultsStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.INTRACLUSTER_RESULTS_STAGE_ID) || {};
    var _experiment$getDrilld = experiment.getDrilldownInfo({
        splOptions: {
          appendPostprocessingStageId: _constants.INTRACLUSTER_RESULTS_STAGE_ID
        }
      }),
      searchUrl = _experiment$getDrilld.searchUrl;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Heading.default, null, /*#__PURE__*/_react.default.createElement(_Link.default, {
      openInNewContext: true,
      to: searchUrl
    }, (0, _format.sprintf)((0, _i18n.gettext)('Outlier Table for %s'), (0, _util2.patchClusterForLabel)(filteredCluster)))), /*#__PURE__*/_react.default.createElement(_Table.StyledSubtitle, null, (0, _format.sprintf)((0, _i18n.gettext)('with cluster_distance > %s'), histogramState.distanceCentroid)), /*#__PURE__*/_react.default.createElement(_Review.SearchResults, null, /*#__PURE__*/_react.default.createElement(_SearchTable.default, {
      drilldownRedirect: false,
      managerId: intraclusterResultsStage.searchManagerId,
      perPage: true,
      showPager: true,
      viewId: "outliersForClustersTable"
    })));
  };
  Table.propTypes = propTypes;
  Table.defaultProps = defaultProps;
  var _default = _exports.default = Table;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Table/Table.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledSubtitle = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  // same subtitle style to Card
  var StyledSubtitle = _exports.StyledSubtitle = _styledComponents.default.h2(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    ", ";\n    font-size: ", ";\n    color: ", ";\n    margin: 0;\n    padding: 0;\n    font-weight: normal;\n"])), (0, _themes.mixin)('reset')('inline'), (0, _themes.variable)('fontSizeSmall'), (0, _themes.variable)('Card', 'Header', 'subtitleColor'));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/Card/Content.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/Card/Content.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _util, _StageStatusWrapper, _constants, _Content) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number]),
          status: _propTypes.default.string
        }))
      })
    }).isRequired
  };
  var Content = function Content(_ref) {
    var experiment = _ref.experiment;
    var numOfClusterStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLUSTER_COUNT_AND_DISTANCE_STAGE_ID);
    var parsedData = numOfClusterStage.parsedData;
    var _ref2 = parsedData || {},
      numberOfClusters = _ref2.numberOfClusters;
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: numOfClusterStage
    }, /*#__PURE__*/_react.default.createElement(_Content.NumberWrapper, null, /*#__PURE__*/_react.default.createElement(_Content.StyledSingleValue, {
      value: numberOfClusters
    })));
  };
  Content.propTypes = propTypes;
  var _default = _exports.default = Content;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/Card/Content.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _SingleValue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledSingleValue = _exports.NumberWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _SingleValue = _interopRequireDefault(_SingleValue);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledSingleValue = _exports.StyledSingleValue = (0, _styledComponents.default)(_SingleValue.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n"])));
  var NumberWrapper = _exports.NumberWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/ClusterDetail.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/shared/SearchTable/SearchTable.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/NumberOfClusters.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/ClusterDetail.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _format, _ColumnLayout, _StageStatusWrapper, _SearchTable, _constants, _NumberOfClusters, _ClusterDetail) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _SearchTable = _interopRequireDefault(_SearchTable);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    selectedCluster: _propTypes.default.string.isRequired,
    clusterDetailsStage: _propTypes.default.shape({
      parsedData: _propTypes.default.shape({
        clusterDetails: _propTypes.default.shape({})
      })
    }).isRequired,
    modelSummaryStage: _propTypes.default.shape({
      parsedData: _propTypes.default.shape({
        modelSummary: _propTypes.default.shape({})
      })
    }).isRequired,
    clusterSummaryStage: _propTypes.default.shape({
      searchManagerId: _propTypes.default.string.isRequired
    }).isRequired
  };
  var ClusterDetails = function ClusterDetails(_ref) {
    var _clusterDetailsStage$, _modelSummaryStage$pa;
    var selectedCluster = _ref.selectedCluster,
      clusterDetailsStage = _ref.clusterDetailsStage,
      clusterSummaryStage = _ref.clusterSummaryStage,
      modelSummaryStage = _ref.modelSummaryStage;
    var headingText = selectedCluster === _constants.ALL_CLUSTERS_FIELD ? (0, _i18n.gettext)('All Cluster Details') : (0, _format.sprintf)((0, _i18n.gettext)('Cluster %s Details'), selectedCluster);
    var clusterDetailsParsedData = (_clusterDetailsStage$ = clusterDetailsStage.parsedData) === null || _clusterDetailsStage$ === void 0 ? void 0 : _clusterDetailsStage$.clusterDetails;
    var modelSummaryParsedData = (_modelSummaryStage$pa = modelSummaryStage.parsedData) === null || _modelSummaryStage$pa === void 0 ? void 0 : _modelSummaryStage$pa.modelSummary;
    return selectedCluster === _constants.ALL_CLUSTERS_FIELD ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ClusterDetail.HeadingWrapper, {
      "data-test-value": headingText
    }, headingText), /*#__PURE__*/_react.default.createElement(_NumberOfClusters.SearchResults, null, /*#__PURE__*/_react.default.createElement(_SearchTable.default, {
      drilldownRedirect: false,
      managerId: clusterSummaryStage.searchManagerId,
      perPage: true,
      showPager: true,
      viewId: "clusterDetailsTable"
    }))) : /*#__PURE__*/_react.default.createElement(_ColumnLayout.default, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 4
    }, /*#__PURE__*/_react.default.createElement(_ClusterDetail.HeadingWrapper, {
      "data-test-value": headingText
    }, headingText), /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      noData: clusterDetailsParsedData == null,
      stage: clusterDetailsStage
    }, /*#__PURE__*/_react.default.createElement(_ClusterDetail.StyledStatsPanel, {
      value: clusterDetailsParsedData != null ? clusterDetailsParsedData[selectedCluster] : {}
    }))), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 8
    }, /*#__PURE__*/_react.default.createElement(_ClusterDetail.HeadingWrapper, null, (0, _i18n.gettext)('Centroid Details:')), /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      noData: modelSummaryParsedData == null,
      stage: modelSummaryStage
    }, /*#__PURE__*/_react.default.createElement(_ClusterDetail.StyledStatsPanel, {
      dualLists: true,
      value: modelSummaryParsedData != null ? modelSummaryParsedData[selectedCluster] : {}
    })))));
  };
  ClusterDetails.propTypes = propTypes;
  var _default = _exports.default = ClusterDetails;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/ClusterDetail.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Heading.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/StatsPanel/StatsPanel.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Heading, _StatsPanel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledStatsPanel = _exports.HeadingWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Heading = _interopRequireDefault(_Heading);
  _StatsPanel = _interopRequireDefault(_StatsPanel);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var HeadingWrapper = _exports.HeadingWrapper = (0, _styledComponents.default)(_Heading.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin-top: 10px;\n"])));
  var StyledStatsPanel = _exports.StyledStatsPanel = (0, _styledComponents.default)(_StatsPanel.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    ", "\n"])), function (props) {
    return props.dualLists ? '' : "\n        justify-content: normal;\n        min-height: auto;\n    ";
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/NumberOfClusters.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-ui/Heading.js"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Controls/ClusterFilter/ClusterFilter.jsx"), __webpack_require__("./src/main/webapp/components/shared/SearchTable/SearchTable.jsx"), __webpack_require__("./src/main/webapp/util/forms.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/ClusterDetail.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/NumberOfClusters.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _i18n, _format, _Heading, _constants, _util, _constants2, _ClusterFilter, _SearchTable, _forms, _util2, _ClusterDetail, _Review, _NumberOfClusters) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Heading = _interopRequireDefault(_Heading);
  _ClusterFilter = _interopRequireDefault(_ClusterFilter);
  _SearchTable = _interopRequireDefault(_SearchTable);
  _ClusterDetail = _interopRequireDefault(_ClusterDetail);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      changePostprocessingStage: _propTypes.default.func.isRequired,
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired,
        searchStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
      }),
      runPostprocessingStage: _propTypes.default.func.isRequired
    }).isRequired,
    filteredClusters: _propTypes.default.shape(_defineProperty({}, _constants2.NUMBER_OF_CLUSTERS, _propTypes.default.string)).isRequired,
    onClusterFilterChange: _propTypes.default.func.isRequired
  };
  var NumberOfClusters = function NumberOfClusters(_ref) {
    var experiment = _ref.experiment,
      filteredClusters = _ref.filteredClusters,
      onClusterFilterChange = _ref.onClusterFilterChange;
    var handleSelection = function handleSelection(e, _ref2) {
      var selectedCluster = _ref2.value;
      var filterClustersStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.FILTER_CLUSTERS_STAGE_ID);
      var mainStage = (0, _util.getStagesByRole)(experiment.data.searchStages, _constants.STAGE_ROLES.MAIN)[0];
      var searchString = selectedCluster === _constants2.ALL_CLUSTERS_FIELD ? ' | table cluster *' : " | where cluster=".concat((0, _forms.escape)(selectedCluster), " | table cluster *");
      experiment.changePostprocessingStage(_constants2.FILTER_CLUSTERS_STAGE_ID, _objectSpread(_objectSpread({}, filterClustersStage), {}, {
        searchString: searchString
      }));
      experiment.runPostprocessingStage(_constants2.FILTER_CLUSTERS_STAGE_ID, {
        afterStageGuid: mainStage.guid
      });
      onClusterFilterChange(_objectSpread(_objectSpread({}, filteredClusters), {}, _defineProperty({}, _constants2.NUMBER_OF_CLUSTERS, selectedCluster)));
    };
    var selectedCluster = filteredClusters[_constants2.NUMBER_OF_CLUSTERS];
    var clusterDetailsStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.CLUSTER_DETAILS_STAGE_ID);
    var clusterSummaryStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.CLUSTERS_SUMMARY_STAGE_ID);
    var modelSummaryStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.CLUSTER_MODEL_SUMMARY_STAGE_ID);
    var filterClustersStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.FILTER_CLUSTERS_STAGE_ID);
    var _ref3 = clusterSummaryStage.parsedData || {},
      _ref3$clusterOptions = _ref3.clusterOptions,
      clusterSummaryParsedData = _ref3$clusterOptions === void 0 ? [] : _ref3$clusterOptions;
    return /*#__PURE__*/_react.default.createElement(_Review.ContentWrapper, null, /*#__PURE__*/_react.default.createElement(_NumberOfClusters.HeaderWrapper, null, /*#__PURE__*/_react.default.createElement(_ClusterFilter.default, {
      availableClusterOptions: clusterSummaryParsedData,
      onChange: handleSelection,
      value: selectedCluster
    })), /*#__PURE__*/_react.default.createElement(_ClusterDetail.default, {
      clusterDetailsStage: clusterDetailsStage,
      clusterSummaryStage: clusterSummaryStage,
      modelSummaryStage: modelSummaryStage,
      selectedCluster: selectedCluster
    }), /*#__PURE__*/_react.default.createElement(_Heading.default, null, (0, _format.sprintf)((0, _i18n.gettext)('Points in %s'), (0, _util2.patchClusterForLabel)(selectedCluster))), /*#__PURE__*/_react.default.createElement(_Review.SearchResults, null, /*#__PURE__*/_react.default.createElement(_SearchTable.default, {
      drilldownRedirect: false,
      managerId: filterClustersStage.searchManagerId,
      perPage: true,
      showPager: true,
      viewId: "clusterDetailsTable"
    })));
  };
  NumberOfClusters.propTypes = propTypes;
  var _default = _exports.default = NumberOfClusters;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/NumberOfClusters.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SearchResults = _exports.HeaderWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var SearchResults = _exports.SearchResults = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n    position: relative;\n"])));
  var HeaderWrapper = _exports.HeaderWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    text-align: right;\n    > *:last-child {\n        margin-right: 0px;\n    }\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/Wizard/WizardStep.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/Wizard/WizardStepTitleBar.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/context/scrollContainerContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/util.es"), __webpack_require__("./src/main/webapp/components/shared/RadioGroup/RadioGroup.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/shared/useBodyRef/useBodyRef.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/useHistogramContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/IntraclusterDistance.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/IntraclusterDistance/Card/Content.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/InterclusterDistance/InterclusterDistance.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/InterclusterDistance/Card/Content.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/NumberOfClusters.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/NumberOfClusters/Card/Content.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _i18n, _format, _Card, _Tooltip, _WizardStep, _WizardStepTitleBar, _scrollContainerContext, _util, _RadioGroup, _util2, _constants, _Review, _useBodyRef2, _constants2, _useHistogramContext, _IntraclusterDistance, _Content, _InterclusterDistance, _Content2, _NumberOfClusters, _Content3, _Review2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Card = _interopRequireDefault(_Card);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _WizardStep = _interopRequireDefault(_WizardStep);
  _WizardStepTitleBar = _interopRequireDefault(_WizardStepTitleBar);
  _RadioGroup = _interopRequireDefault(_RadioGroup);
  _IntraclusterDistance = _interopRequireDefault(_IntraclusterDistance);
  _Content = _interopRequireDefault(_Content);
  _InterclusterDistance = _interopRequireDefault(_InterclusterDistance);
  _Content2 = _interopRequireDefault(_Content2);
  _NumberOfClusters = _interopRequireDefault(_NumberOfClusters);
  _Content3 = _interopRequireDefault(_Content3);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        searchStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          status: _propTypes.default.string,
          targetVariables: _propTypes.default.arrayOf(_propTypes.default.string)
        })).isRequired,
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number]),
          status: _propTypes.default.string
        }))
      }),
      getMainStage: _propTypes.default.func.isRequired
    }).isRequired
  };
  var title = (0, _i18n.gettext)('Review Experiment');
  var numberOfClustersTooltip = (0, _i18n.gettext)('Review the details of cluster points across all clusters or within individual clusters.');
  var interclusterDistanceTooltip = (0, _i18n.gettext)('View the relation between the found clusters. Choose to filter details by all clusters or by a particular cluster.');
  var intraclusterDistanceTooltip = (0, _i18n.gettext)('Use this panel to set a distance from the centroid value to find outliers. Choose to filter the distribution by all clusters or by a particular cluster.');
  var contentMapper = function contentMapper(props) {
    return _defineProperty(_defineProperty(_defineProperty({}, _constants2.NUMBER_OF_CLUSTERS, /*#__PURE__*/_react.default.createElement(_NumberOfClusters.default, props)), _constants2.INTERCLUSTER_DISTANCE, /*#__PURE__*/_react.default.createElement(_InterclusterDistance.default, props)), _constants2.INTRACLUSTER_DISTANCE, /*#__PURE__*/_react.default.createElement(_IntraclusterDistance.default, props));
  };

  /**
   * Review component for Smart Clustering
   * @param {Object} experiment - current experiment
   */
  var Review = function Review(props) {
    var _useBodyRef = (0, _useBodyRef2.useBodyRef)(),
      bodyRef = _useBodyRef.bodyRef,
      setRef = _useBodyRef.setRef;
    var _useState = (0, _react.useState)(_constants2.NUMBER_OF_CLUSTERS),
      _useState2 = _slicedToArray(_useState, 2),
      content = _useState2[0],
      setContent = _useState2[1];
    var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      outliers = _useState4[0],
      setOutliers = _useState4[1];
    var _useState5 = (0, _react.useState)(_defineProperty(_defineProperty(_defineProperty({}, _constants2.NUMBER_OF_CLUSTERS, _constants2.ALL_CLUSTERS_FIELD), _constants2.INTERCLUSTER_DISTANCE, _constants2.ALL_CLUSTERS_FIELD), _constants2.INTRACLUSTER_DISTANCE, _constants2.ALL_CLUSTERS_FIELD)),
      _useState6 = _slicedToArray(_useState5, 2),
      filteredClusters = _useState6[0],
      setFilteredClusters = _useState6[1];
    var experiment = props.experiment;
    var intraclusterResultsStage = (0, _util2.getStageById)(experiment.data.postprocessingStages, _constants2.INTRACLUSTER_RESULTS_STAGE_ID) || {};
    var handleCardClick = function handleCardClick(value) {
      return function () {
        setContent(value);
      };
    };
    var handleClusterFilterChange = function handleClusterFilterChange(nextFilteredClusters) {
      setFilteredClusters(nextFilteredClusters);
    };
    (0, _react.useEffect)(function () {
      var _ref2 = intraclusterResultsStage.parsedData || {},
        numberOfOutliers = _ref2.numberOfOutliers;
      if (numberOfOutliers != null) {
        setOutliers(numberOfOutliers);
      }
    }, [intraclusterResultsStage.parsedData]);
    return /*#__PURE__*/_react.default.createElement(_WizardStep.default, {
      ref: setRef,
      header: /*#__PURE__*/_react.default.createElement(_WizardStepTitleBar.default, {
        title: title
      })
    }, /*#__PURE__*/_react.default.createElement(_useHistogramContext.Provider, null, /*#__PURE__*/_react.default.createElement(_Review.FlexWrapper, null, /*#__PURE__*/_react.default.createElement(_Review.ReviewWrapper, null, /*#__PURE__*/_react.default.createElement(_scrollContainerContext.ScrollContainerContext.Provider, {
      value: bodyRef
    }, /*#__PURE__*/_react.default.createElement(_Review.MainPanel, null, /*#__PURE__*/_react.default.createElement(_RadioGroup.default, null, /*#__PURE__*/_react.default.createElement(_Review.ReviewCardLayout, null, /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
      "data-test": _constants2.NUMBER_OF_CLUSTERS,
      defaultSelected: true,
      onClick: handleCardClick(_constants2.NUMBER_OF_CLUSTERS)
    }, /*#__PURE__*/_react.default.createElement(_Card.default.Header, {
      subtitle: _constants.UNICODE_NBSP /* empty subtitle for items alignment across cards */,
      title: (0, _i18n.gettext)('Number of Clusters')
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: numberOfClustersTooltip
    })), /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_Content3.default, {
      experiment: experiment
    }))), /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
      "data-test": _constants2.INTERCLUSTER_DISTANCE,
      onClick: handleCardClick(_constants2.INTERCLUSTER_DISTANCE)
    }, /*#__PURE__*/_react.default.createElement(_Card.default.Header, {
      subtitle: _constants.UNICODE_NBSP /* empty subtitle for items alignment across cards */,
      title: (0, _i18n.gettext)('Intercluster Distance Matrix')
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: interclusterDistanceTooltip
    })), /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_Content2.default, {
      experiment: experiment
    }))), /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
      "data-test": _constants2.INTRACLUSTER_DISTANCE,
      onClick: handleCardClick(_constants2.INTRACLUSTER_DISTANCE)
    }, /*#__PURE__*/_react.default.createElement(_useHistogramContext.Consumer, null, function (_ref3) {
      var _ref3$state = _ref3.state,
        showViz = _ref3$state.showViz,
        distanceCentroid = _ref3$state.histogramState.distanceCentroid;
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Card.default.Header, {
        subtitle: showViz ? (0, _format.sprintf)((0, _i18n.gettext)('Distance from the centroid is greater than %s in %s.'), distanceCentroid, (0, _util.patchClusterForLabel)(filteredClusters[_constants2.INTRACLUSTER_DISTANCE])) : (0, _i18n.gettext)('Click to set cluster distance threshold to find outliers.'),
        title: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", null, (0, _i18n.gettext)('Intracluster Distance Distribution')), /*#__PURE__*/_react.default.createElement(_Review2.StyledTooltip, {
          content: intraclusterDistanceTooltip
        }))
      }), /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_Content.default, {
        experiment: experiment,
        isNotSet: !showViz,
        outliers: outliers
      })));
    }))))))), /*#__PURE__*/_react.default.createElement(_Review.ContentWrapper, null, contentMapper({
      experiment: experiment,
      filteredClusters: filteredClusters,
      onClusterFilterChange: handleClusterFilterChange
    })[content]))));
  };
  Review.propTypes = propTypes;
  var _default = _exports.default = Review;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/Review.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/mixins.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Tooltip, _mixins) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledTooltip = _exports.SearchResults = _exports.ContentWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Tooltip = _interopRequireDefault(_Tooltip);
  var _templateObject, _templateObject2, _templateObject3;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var ContentWrapper = _exports.ContentWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    ", "\n"])), _mixins.assistantContentWrapper);
  var SearchResults = _exports.SearchResults = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n    position: relative;\n"])));
  var StyledTooltip = _exports.StyledTooltip = (0, _styledComponents.default)(_Tooltip.default)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    margin-left: 10px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/useHistogramContext.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/useHistogramReducer.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _useHistogramReducer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialState = _exports.Provider = _exports.Context = _exports.Consumer = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _useHistogramReducer = _interopRequireDefault(_useHistogramReducer);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  // exporting for testing
  var initialState = _exports.initialState = {
    distanceCentroid: 0,
    histogramState: {
      distanceCentroid: 0
    },
    showViz: false
  };
  var Context = _exports.Context = /*#__PURE__*/(0, _react.createContext)({});
  var propTypes = {
    children: _propTypes.default.node.isRequired
  };
  var Provider = _exports.Provider = function Provider(_ref) {
    var children = _ref.children;
    var reducer = (0, _useHistogramReducer.default)(initialState);
    return /*#__PURE__*/_react.default.createElement(Context.Provider, {
      value: reducer
    }, children);
  };
  Provider.propTypes = propTypes;
  var Consumer = _exports.Consumer = Context.Consumer;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartClustering/WizardSteps/Review/useHistogramReducer.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _swcMltk, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.reducer = _exports.default = void 0;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var defaultAction = function defaultAction(state, action) {
    console.error("No action defined for ".concat(action.type));
    return state;
  };

  // exporting only for testing
  var reducer = _exports.reducer = function reducer(state, action) {
    switch (action.type) {
      case _constants.SET_DISTANCE_CENTROID:
        return _objectSpread(_objectSpread({}, state), {}, {
          distanceCentroid: action.payload
        });
      case _constants.UPDATE_VIZ_OPTIONS:
        {
          var clonedState = _swcMltk.lodash.cloneDeep(state);
          return _objectSpread(_objectSpread({}, state), {}, {
            showViz: true,
            // always show the viz if "Set Distance" is clicked
            histogramState: {
              distanceCentroid: clonedState.distanceCentroid
            }
          });
        }
      default:
        return defaultAction(state, action);
    }
  };
  var _default = _exports.default = function _default() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];
    return {
      state: state,
      dispatch: dispatch
    };
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/icons/MaxBoundary.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  var _excluded = ["screenReaderText"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var propTypes = {
    screenReaderText: _propTypes.default.string
  };
  var defaultProps = {
    screenReaderText: (0, _i18n.gettext)('max boundary')
  };
  var MaxBoundary = function MaxBoundary(_ref) {
    var screenReaderText = _ref.screenReaderText,
      props = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement("svg", _extends({
      viewBox: "0 0 250 250",
      xmlns: "http://www.w3.org/2000/svg"
    }, props), /*#__PURE__*/_react.default.createElement("title", null, (0, _i18n.gettext)(screenReaderText)), /*#__PURE__*/_react.default.createElement("path", {
      d: "M111.5,228.3q-16.05-46.65-32.1-93.2a7.17,7.17,0,0,0-1,2.2c-3.3,8.9-6.6,17.7-9.9,26.6-.5,1.2-.9,2.5-1.3,3.7a1,1,0,0,1-1.1.8H21.8c-.7,0-.9-.2-.9-.9V142.2c0-.8.2-1.1,1.1-1.1H47a1.13,1.13,0,0,0,1.3-.9l7.5-20.1c3-7.9,5.9-15.9,8.9-23.8l7.8-21c2.5-6.7,5-13.3,7.4-20,.1-.3.2-.5.4-1,10.5,30.4,20.9,60.7,31.5,91.3,14.6-41.5,29-82.7,43.5-123.9h.2c.5,1.6,1.1,3.1,1.6,4.7,3.7,10.7,7.4,21.3,11.1,32,2.1,6,4.2,12,6.3,18.1,3,8.8,6.1,17.5,9.1,26.3,2.6,7.4,5.1,14.8,7.7,22.2,1.8,5.1,3.6,10.2,5.3,15.3.2.7.6.8,1.2.8h30.1c1.1,0,1.1,0,1.1,1.2v25.1c0,.8-.2,1-1,1H178.3c-.7,0-1-.2-1.2-.8-1.5-4.5-3.1-9.1-4.7-13.6-3.7-10.8-7.4-21.5-11.2-32.3-1.9-5.6-3.9-11.1-5.8-16.7a4.88,4.88,0,0,1-.3-.7,5.58,5.58,0,0,0-.7,1.6c-2.5,7.1-4.9,14.1-7.4,21.2-3.9,11-7.7,22-11.6,33-2.5,7.2-5.1,14.5-7.7,21.7-4.2,12-8.4,24.1-12.7,36.1l-3.6,10.2C111.6,228,111.6,228.1,111.5,228.3Z",
      fill: "#bebdbe"
    }), /*#__PURE__*/_react.default.createElement("circle", {
      cx: "154.84",
      cy: "20.68",
      fill: "#006d9c",
      r: "20"
    }));
  };
  MaxBoundary.propTypes = propTypes;
  MaxBoundary.defaultProps = defaultProps;
  var _default = _exports.default = MaxBoundary;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/icons/MinBoundary.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  var _excluded = ["screenReaderText"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var propTypes = {
    screenReaderText: _propTypes.default.string
  };
  var defaultProps = {
    screenReaderText: (0, _i18n.gettext)('min boundary')
  };
  var MinBoundary = function MinBoundary(_ref) {
    var screenReaderText = _ref.screenReaderText,
      props = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement("svg", _extends({
      viewBox: "0 0 250 250",
      xmlns: "http://www.w3.org/2000/svg"
    }, props), /*#__PURE__*/_react.default.createElement("title", null, (0, _i18n.gettext)(screenReaderText)), /*#__PURE__*/_react.default.createElement("path", {
      d: "M111.55,228.3q-16-46.65-32.1-93.2a7.17,7.17,0,0,0-1,2.2c-3.3,8.9-6.6,17.7-9.9,26.6-.5,1.2-.9,2.5-1.3,3.7a1,1,0,0,1-1.1.8H21.85c-.7,0-.9-.2-.9-.9V142.2c0-.8.2-1.1,1.1-1.1h25a1.13,1.13,0,0,0,1.3-.9l7.5-20.1c3-7.9,5.9-15.9,8.9-23.8l7.8-21c2.5-6.7,5-13.3,7.4-20,.1-.3.2-.5.4-1,10.5,30.4,20.9,60.7,31.5,91.3,14.6-41.5,29-82.7,43.5-123.9h.2c.5,1.6,1.1,3.1,1.6,4.7,3.7,10.7,7.4,21.3,11.1,32,2.1,6,4.2,12,6.3,18.1,3,8.8,6.1,17.5,9.1,26.3,2.6,7.4,5.1,14.8,7.7,22.2,1.8,5.1,3.6,10.2,5.3,15.3.2.7.6.8,1.2.8H228c1.1,0,1.1,0,1.1,1.2v25.1c0,.8-.2,1-1,1h-49.7c-.7,0-1-.2-1.2-.8-1.5-4.5-3.1-9.1-4.7-13.6-3.7-10.8-7.4-21.5-11.2-32.3-1.9-5.6-3.9-11.1-5.8-16.7a4.88,4.88,0,0,1-.3-.7,5.58,5.58,0,0,0-.7,1.6c-2.5,7.1-4.9,14.1-7.4,21.2-3.9,11-7.7,22-11.6,33-2.5,7.2-5.1,14.5-7.7,21.7-4.2,12-8.4,24.1-12.7,36.1l-3.6,10.2C111.65,228,111.65,228.1,111.55,228.3Z",
      fill: "#bebdbe"
    }), /*#__PURE__*/_react.default.createElement("circle", {
      cx: "111.42",
      cy: "228.3",
      fill: "#006d9c",
      r: "20"
    }));
  };
  MinBoundary.propTypes = propTypes;
  MinBoundary.defaultProps = defaultProps;
  var _default = _exports.default = MinBoundary;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/AxisSelection.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./src/main/webapp/components/shared/LabelGroup/LabelGroup.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/AxisSelection.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayFilter, _esArrayMap, _esObjectKeys, _esObjectToString, _webDomCollectionsForEach, _react, _propTypes, _i18n, _format, _LabelGroup, _constants, _AxisSelection) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.addDescriptionToSelectedOptions = addDescriptionToSelectedOptions;
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _LabelGroup = _interopRequireDefault(_LabelGroup);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  // wrap "selectOptions" to an array of {value, description} objects
  function addDescriptionToSelectedOptions(selectOptions, fieldsForAxes, dimension) {
    return selectOptions.map(function (field) {
      var filler = {
        description: null,
        value: field
      };
      // loop through existing axes until it finds a axis with given field, add description and loop out.
      Object.keys(fieldsForAxes[dimension]).some(function (axisKey) {
        if (fieldsForAxes[dimension][axisKey] === field) {
          filler.description = (0, _format.sprintf)((0, _i18n.gettext)('Selected as %s'), _constants.AXIS_LABEL_MAPPING[axisKey]);
          return true;
        }
        return false;
      });
      return filler;
    });
  }
  var propTypes = {
    axis: _propTypes.default.string.isRequired,
    availableFields: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    dimension: _propTypes.default.string.isRequired,
    fieldsForAxes: _propTypes.default.shape(_defineProperty(_defineProperty({}, _constants.DIMENSION.VIZ_2D, _propTypes.default.shape({
      xAxisField: _propTypes.default.string,
      yAxisField: _propTypes.default.string
    }).isRequired), _constants.DIMENSION.VIZ_3D, _propTypes.default.shape({
      xAxisField: _propTypes.default.string,
      yAxisField: _propTypes.default.string,
      zAxisField: _propTypes.default.string
    }).isRequired)).isRequired,
    onSelectionChange: _propTypes.default.func.isRequired
  };
  var AxisSelection = function AxisSelection(_ref) {
    var axis = _ref.axis,
      availableFields = _ref.availableFields,
      dimension = _ref.dimension,
      fieldsForAxes = _ref.fieldsForAxes,
      onSelectionChange = _ref.onSelectionChange;
    var fieldsWithDescription = addDescriptionToSelectedOptions(availableFields, fieldsForAxes, dimension);
    return /*#__PURE__*/_react.default.createElement(_LabelGroup.default, {
      label: (0, _format.sprintf)((0, _i18n.gettext)('%s: '), _constants.AXIS_LABEL_MAPPING[axis])
    }, /*#__PURE__*/_react.default.createElement(_AxisSelection.StyledSelect, {
      "data-test": axis,
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        // reset fieldsForAxes[dimension][x/y/z] back to null if its current value being chosen.
        var copyFieldsForAxes = JSON.parse(JSON.stringify(fieldsForAxes));
        var currentDimension = copyFieldsForAxes[dimension];
        var axesToBeReset = Object.keys(currentDimension).filter(function (currentAxis) {
          return currentDimension[currentAxis] === value;
        });
        axesToBeReset.forEach(function (currentAxis) {
          currentDimension[currentAxis] = null;
        });
        currentDimension[axis] = value;
        onSelectionChange(copyFieldsForAxes);
      },
      value: fieldsForAxes[dimension][axis]
    }, fieldsWithDescription.map(function (field) {
      return /*#__PURE__*/_react.default.createElement(_AxisSelection.StyledSelect.Option, {
        key: field.value,
        description: field.description,
        label: field.value,
        value: field.value
      });
    })));
  };
  AxisSelection.propTypes = propTypes;
  var _default = _exports.default = AxisSelection;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/AxisSelection.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Select) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledSelect = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Select = _interopRequireDefault(_Select);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledSelect = _exports.StyledSelect = (0, _styledComponents.default)(_Select.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    width: 140px; /* set a fixed width so it doesn't push other Select dropdowns */\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/ClusteringVizWrapper.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.reflect.construct.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/ChartScatter.js"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/NewSearchTemplate.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/AxisSelection.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("shared/controls/DrilldownLinker"), __webpack_require__("./src/main/webapp/components/shared/DrilldownMenu/DrilldownMenu.jsx"), __webpack_require__("./src/main/webapp/components/shared/SPLModal/SPLModal.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/clusteringVizWrapperUtils.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/ClusteringVizWrapper.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayJoin, _esObjectKeys, _esObjectToString, _react, _propTypes, _i18n, _ChartScatter, _CustomViz, _NewSearchTemplate, _constants, _AxisSelection, _constants2, _DrilldownLinker, _DrilldownMenu, _SPLModal, _clusteringVizWrapperUtils, _ClusteringVizWrapper2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ChartScatter = _interopRequireDefault(_ChartScatter);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _NewSearchTemplate = _interopRequireDefault(_NewSearchTemplate);
  _AxisSelection = _interopRequireDefault(_AxisSelection);
  _DrilldownMenu = _interopRequireDefault(_DrilldownMenu);
  _SPLModal = _interopRequireDefault(_SPLModal);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
  function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
  function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
  function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
  function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
  function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function areAxesSelected(fieldsForAxes, dimension) {
    return Object.keys(fieldsForAxes[dimension]).every(function (axis) {
      return fieldsForAxes[dimension][axis] != null;
    });
  }
  var initialFieldsForAxes = _defineProperty(_defineProperty({}, _constants2.DIMENSION.VIZ_2D, {
    xAxisField: null,
    yAxisField: null
  }), _constants2.DIMENSION.VIZ_3D, {
    xAxisField: null,
    yAxisField: null,
    zAxisField: null
  });
  var propTypes = {
    availableFields: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    initialState: _propTypes.default.shape({
      fieldsForAxes: _propTypes.default.shape(_defineProperty(_defineProperty({}, _constants2.DIMENSION.VIZ_2D, _propTypes.default.shape({
        xAxisField: _propTypes.default.string,
        yAxisField: _propTypes.default.string
      })), _constants2.DIMENSION.VIZ_3D, _propTypes.default.shape({
        xAxisField: _propTypes.default.string,
        yAxisField: _propTypes.default.string,
        zAxisField: _propTypes.default.string
      })))
    }),
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
      }),
      getDrilldownInfo: _propTypes.default.func.isRequired,
      getMainStage: _propTypes.default.any,
      getSearchInfo: _propTypes.default.func.isRequired
    }).isRequired,
    managerId: _propTypes.default.string.isRequired,
    show3dView: _propTypes.default.bool.isRequired,
    viewId: _propTypes.default.string.isRequired
  };
  var defaultProps = {
    initialState: {}
  };
  var ClusteringVizWrapper = /*#__PURE__*/function (_Component) {
    function ClusteringVizWrapper(props) {
      var _this;
      _classCallCheck(this, ClusteringVizWrapper);
      _this = _callSuper(this, ClusteringVizWrapper, [props]);
      _defineProperty(_this, "handleSelectionChange", function (fieldsForAxes) {
        _this.setState({
          fieldsForAxes: fieldsForAxes
        });
      });
      _defineProperty(_this, "handleMenuClick", function (action, _ref) {
        var searchUrl = _ref.searchUrl;
        if (action === _constants.DRILLDOWN_ACTIONS.openInSearch) {
          window.open(searchUrl, '_blank');
        } else if (action === _constants.DRILLDOWN_ACTIONS.showSPL) {
          _this.setState({
            isSplModalOpen: true
          });
        }
      });
      _defineProperty(_this, "handleCloseSplModal", function () {
        return _this.setState({
          isSplModalOpen: false
        });
      });
      var _fieldsForAxes = props.initialState.fieldsForAxes || initialFieldsForAxes;
      _this.state = {
        fieldsForAxes: _fieldsForAxes,
        isSplModalOpen: false
      };
      return _this;
    }
    _inherits(ClusteringVizWrapper, _Component);
    return _createClass(ClusteringVizWrapper, [{
      key: "render",
      value: function render() {
        var _this2 = this;
        var _this$props = this.props,
          availableFields = _this$props.availableFields,
          experiment = _this$props.experiment,
          managerId = _this$props.managerId,
          show3dView = _this$props.show3dView,
          viewId = _this$props.viewId;
        var _this$state = this.state,
          fieldsForAxes = _this$state.fieldsForAxes,
          isSplModalOpen = _this$state.isSplModalOpen,
          splArray = _this$state.splArray,
          searchUrl = _this$state.searchUrl,
          splCommentsArray = _this$state.splCommentsArray;
        var placeHolder = /*#__PURE__*/_react.default.createElement(_NewSearchTemplate.default, {
          iconType: _ChartScatter.default,
          message: _constants.VIZ_PLACEHOLDERS.SELECT_AXIS_FIELD
        });
        var customViz2D, customViz3D, dimension;
        var _experiment$getSearch = experiment.getSearchInfo(),
          timeRange = _experiment$getSearch.timeRange;
        if (show3dView) {
          dimension = _constants2.DIMENSION.VIZ_3D;
          var namespacedOptions = _objectSpread(_objectSpread({}, fieldsForAxes[dimension]), {}, {
            onPlotlyClick: function onPlotlyClick(pointX, pointY, pointZ) {
              var searchString = (0, _clusteringVizWrapperUtils.getClusteringVizDrilldownSpl)({
                fieldsForAxes: fieldsForAxes[dimension],
                vizSpl: splArray.join(''),
                pointX: pointX,
                pointY: pointY,
                pointZ: pointZ
              });
              var url = (0, _DrilldownLinker.getDrilldownUrl)({
                searchString: searchString,
                timeRange: timeRange
              });
              window.open(url, '_blank');
            }
          });
          customViz3D = /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
            managerId: managerId,
            namespacedOptions: namespacedOptions,
            viewId: "".concat(viewId, "_3d"),
            vizType: "Scatter3dViz"
          });
        } else {
          dimension = _constants2.DIMENSION.VIZ_2D;
          var _namespacedOptions = _objectSpread(_objectSpread({}, fieldsForAxes[dimension]), {}, {
            onClick: function onClick(pointData) {
              var pointX = pointData.originalX != null ? pointData.originalX : pointData.x;
              var pointY = pointData.originalX != null ? pointData.originalY : pointData.y;
              var searchString = (0, _clusteringVizWrapperUtils.getClusteringVizDrilldownSpl)({
                fieldsForAxes: fieldsForAxes[dimension],
                vizSpl: splArray.join(''),
                pointX: pointX,
                pointY: pointY
              });
              var url = (0, _DrilldownLinker.getDrilldownUrl)({
                searchString: searchString,
                timeRange: timeRange
              });
              window.open(url, '_blank');
            }
          });
          customViz2D = /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
            managerId: managerId,
            namespacedOptions: _namespacedOptions,
            viewId: "".concat(viewId, "_2d"),
            vizType: "ScatterLineViz"
          });
        }
        var vizPlaceholder = areAxesSelected(fieldsForAxes, dimension) ? null : placeHolder;
        return /*#__PURE__*/_react.default.createElement("div", {
          "data-test": "clusteringVizWrapper"
        }, /*#__PURE__*/_react.default.createElement(_ClusteringVizWrapper2.MenuBarWrapper, null, /*#__PURE__*/_react.default.createElement(_ClusteringVizWrapper2.AxesWrapper, null, /*#__PURE__*/_react.default.createElement(_AxisSelection.default, {
          availableFields: availableFields,
          axis: "xAxisField",
          dimension: dimension,
          fieldsForAxes: fieldsForAxes,
          onSelectionChange: this.handleSelectionChange
        }), /*#__PURE__*/_react.default.createElement(_AxisSelection.default, {
          availableFields: availableFields,
          axis: "yAxisField",
          dimension: dimension,
          fieldsForAxes: fieldsForAxes,
          onSelectionChange: this.handleSelectionChange
        }), show3dView && /*#__PURE__*/_react.default.createElement(_AxisSelection.default, {
          availableFields: availableFields,
          axis: "zAxisField",
          dimension: dimension,
          fieldsForAxes: fieldsForAxes,
          onSelectionChange: this.handleSelectionChange
        })), /*#__PURE__*/_react.default.createElement(_ClusteringVizWrapper2.MenuWrapper, null, /*#__PURE__*/_react.default.createElement(_DrilldownMenu.default, {
          disabled: vizPlaceholder != null,
          onClick: function onClick(action) {
            _this2.handleMenuClick(action, {
              searchUrl: searchUrl
            });
          }
        }))), !vizPlaceholder && customViz2D, !vizPlaceholder && customViz3D, vizPlaceholder, /*#__PURE__*/_react.default.createElement(_SPLModal.default, {
          linkText: (0, _i18n.gettext)('View your model in a scatter plot visualization'),
          modalComments: splCommentsArray,
          modalSPL: splArray,
          modalUrl: searchUrl,
          onRequestClose: this.handleCloseSplModal,
          open: isSplModalOpen
        }));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        // update the spl array if switches between 2d and 3d
        var show3dView = props.show3dView,
          getDrilldownInfo = props.experiment.getDrilldownInfo;
        var fieldsForAxes = state.fieldsForAxes;
        return (0, _clusteringVizWrapperUtils.getVizDrilldownInfo)({
          fieldsForAxes: fieldsForAxes,
          getDrilldownInfo: getDrilldownInfo,
          show3dView: show3dView
        });
      }
    }]);
  }(_react.Component);
  ClusteringVizWrapper.propTypes = propTypes;
  ClusteringVizWrapper.defaultProps = defaultProps;
  var _default = _exports.default = ClusteringVizWrapper;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/ClusteringVizWrapper.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MenuWrapper = _exports.MenuBarWrapper = _exports.AxesWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2, _templateObject3;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var MenuBarWrapper = _exports.MenuBarWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    flex: 1 0 auto;\n    padding: 15px;\n"])));
  var AxesWrapper = _exports.AxesWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n    flex: 1 1 auto;\n    > * {\n        margin-left: 20px;\n    }\n    > *:last-child {\n        flex: 0 1 auto;\n    }\n"])));
  var MenuWrapper = _exports.MenuWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    flex: 0 0 auto;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/ClusteringViz/clusteringVizWrapperUtils.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/constants.es"), __webpack_require__("./src/main/webapp/util/forms.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _config, _constants, _forms) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getVizDrilldownInfo = _exports.getClusteringVizDrilldownSpl = void 0;
  /**
   * A custom hook for updating the values in each axis dropdown.  It takes a copy of axis-value mapping as initial value.
   * @param {object} initialFieldsForAxes - an object keeps track of fields selected in each axes, see in ClusteringVizWrapper for
   * the structure.
   * @param getDrilldownInfo {Function} experiment built-in function
   * @param show3dView {boolean} value indicates whether 2D/3D is selected
   * @returns {{splCommentsArray: Array, searchUrl: String, splArray: Array}}
   */
  var getVizDrilldownInfo = _exports.getVizDrilldownInfo = function getVizDrilldownInfo(_ref) {
    var fieldsForAxes = _ref.fieldsForAxes,
      getDrilldownInfo = _ref.getDrilldownInfo,
      show3dView = _ref.show3dView;
    var _getDrilldownInfo = getDrilldownInfo({
        vizOptions: {
          // not using the vizStage here to avoid duplicate `eval`, `table` commands
          category: 'custom',
          type: show3dView ? "".concat(_config.app, ".Scatter3dViz") : "".concat(_config.app, ".ScatterLineViz")
        },
        additionalSPL: [show3dView ? " | eval clusterId= \"Cluster: \" + cluster, x='".concat(fieldsForAxes[_constants.DIMENSION.VIZ_3D].xAxisField, "', y='").concat(fieldsForAxes[_constants.DIMENSION.VIZ_3D].yAxisField, "', z='").concat(fieldsForAxes[_constants.DIMENSION.VIZ_3D].zAxisField, "'") : " | eval cluster= \"Cluster: \" + cluster | table cluster, ".concat((0, _forms.escape)(fieldsForAxes[_constants.DIMENSION.VIZ_2D].xAxisField), ", ").concat((0, _forms.escape)(fieldsForAxes[_constants.DIMENSION.VIZ_2D].yAxisField), ", *")]
      }),
      splArray = _getDrilldownInfo.splArray,
      splCommentsArray = _getDrilldownInfo.splCommentsArray,
      searchUrl = _getDrilldownInfo.searchUrl;
    return {
      splArray: splArray,
      splCommentsArray: splCommentsArray,
      searchUrl: searchUrl
    };
  };
  var getClusteringVizDrilldownSpl = _exports.getClusteringVizDrilldownSpl = function getClusteringVizDrilldownSpl(_ref2) {
    var fieldsForAxes = _ref2.fieldsForAxes,
      vizSpl = _ref2.vizSpl,
      pointX = _ref2.pointX,
      pointY = _ref2.pointY,
      pointZ = _ref2.pointZ;
    var xAxisField = fieldsForAxes.xAxisField,
      yAxisField = fieldsForAxes.yAxisField,
      zAxisField = fieldsForAxes.zAxisField;
    var zAxisSplFraction = '';
    if (zAxisField != null) {
      zAxisSplFraction = " ".concat((0, _forms.escape)(zAxisField), "=").concat((0, _forms.escape)(pointZ));
    }
    return "".concat(vizSpl, " | search ").concat((0, _forms.escape)(xAxisField), "=").concat((0, _forms.escape)(pointX), " ").concat((0, _forms.escape)(yAxisField), "=").concat((0, _forms.escape)(pointY)).concat(zAxisSplFraction);
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/SmartClustering.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("assistants/SmartClustering")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _SmartClustering) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _SmartClustering = _interopRequireDefault(_SmartClustering);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var SCRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Smart Clustering'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.smartClusteringView) {
        // TODO: Properly handle the backbutton by not requiring the entire page to be re-instantiated.
        // This is a failsafe for now if the querystring gets updated and then the user clicks the backbutton.
        // In this case the DOM is guaranteed to be cleaned up. We have not yet confirmed that all listeners
        // will be cleaned up.
        this.smartClusteringView.remove();
      }
      this.smartClusteringView = new _SmartClustering.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = SCRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "assistants/SmartClustering":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module, __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("shared/BaseSmartAssistant"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/SmartClustering.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartClustering/SmartClusteringContext.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _module, _PolymorphicExperiment, _BaseSmartAssistant, _SmartClustering, _SmartClusteringContext) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _BaseSmartAssistant = _interopRequireDefault(_BaseSmartAssistant);
  _SmartClustering = _interopRequireDefault(_SmartClustering);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _BaseSmartAssistant.default.extend({
    moduleId: _module.default.id,
    assistantComponent: _SmartClustering.default,
    assistantContext: {
      initialState: _SmartClusteringContext.initialState,
      reducer: _SmartClusteringContext.reducer
    },
    experimentType: _PolymorphicExperiment.default.TYPES.SMART_CLUSTERING
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/smart_clustering.es","pages_common"]]]);