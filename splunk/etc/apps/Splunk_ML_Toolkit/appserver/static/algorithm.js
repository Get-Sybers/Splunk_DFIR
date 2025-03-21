(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["algorithm"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/algorithm.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Algorithm.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Algorithm, _swcMltk) {
  "use strict";

  _Algorithm = _interopRequireDefault(_Algorithm);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Algorithm.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/models/properties/MLSPL.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./src/main/webapp/models/properties/Properties.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayJoin, _esObjectKeys, _esObjectToString, _webDomCollectionsForEach, _Properties) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Properties = _interopRequireDefault(_Properties);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var validation = {
    handle_new_cat: {
      oneOf: ['default', 'skip', 'stop']
    },
    max_distinct_cat_values: {
      pattern: 'digits'
    },
    max_distinct_cat_values_for_classifiers: {
      pattern: 'digits'
    },
    max_distinct_cat_values_for_scoring: {
      pattern: 'digits'
    },
    max_fit_time: {
      pattern: 'digits'
    },
    max_inputs: {
      pattern: 'digits'
    },
    max_memory_usage_mb: {
      pattern: 'digits'
    },
    max_model_size_mb: {
      pattern: 'digits'
    },
    max_score_time: {
      pattern: 'digits'
    },
    summary_depth_limit: {
      pattern: 'digits',
      required: false
    },
    summary_return_json: {
      oneOf: ['true', 'false'],
      required: false
    },
    use_sampling: {
      oneOf: ['true', 'false']
    }
  };

  // Splunk's use of Backbone.Validation has unavoidable sentenceCase formatting
  // so we're avoiding that here by just defining our own messages ¯\_(ツ)_/¯
  Object.keys(validation).forEach(function (key) {
    if (validation[key].pattern != null) {
      if (validation[key].pattern === 'digits') {
        validation[key].msg = "".concat(key, " must only contain digits");
      }
    } else if (validation[key].oneOf != null) {
      validation[key].msg = "".concat(key, " must be one of: ").concat(validation[key].oneOf.join(', '));
    }
  });
  var MLSPLPropertiesModel = _Properties.default.extend({
    file: 'mlspl',
    description: {
      default_prob_threshold: "\n            The default value for the area under the fitted probability density function curve, that is assigned as anomalous area.\n            \"0.01\" refers to that: \"1%\" of the area under the fitted density function curve will be assigned as outliers.\n            \"default_prob_threshold\" must have a value between 0.000000001 and 1.\n        ",
      handle_new_cat: "\n            Action to perform when new value(s) for categorical variable/explanatory variable is encountered in partial_fit.\n            - default: set all values of the column that corresponds to the new categorical value to 0's\n            - skip: skip over rows that contain the new value(s) and raise a warning\n            - stop: stop the operation by raising an error\n        ",
      max_distinct_cat_values: "\n            Determines the upper limit for the number of categorical values that will be encoded in one-hot encoding.\n            If the number of distinct values exceeds this limit, the field will be dropped (with a warning).\n        ",
      max_distinct_cat_values_for_classifiers: "\n            Determines the upper limit for the number of distinct values in a categorical field that is the target (or response) variable in a classifier algorithm.\n            If the number of distinct values exceeds this limit, the field will be dropped (with a warning).\n        ",
      max_distinct_cat_values_for_scoring: "\n            Determines the upper limit for the number of distinct values in a categorical field that is the target (or response) variable in a scoring method.\n            If the number of distinct values exceeds this limit, the field will be dropped (with an appropriate warning or error message).\n        ",
      max_fields_in_by_clause: 'The maximum number of fields that can be provided in the "by" clause.',
      max_fit_time: 'The maximum time, in seconds, to spend in the "fit" phase of an algorithm.',
      max_groups: "\n            The maximum number of groups created with the \"by\" clause.\n            \"max_groups\" prevents the model file from growing too large.\n            The bigger that cap the larger the size of your model file is going to be\n            and it will take longer to load at \"apply\" time.\n            Decreasing \"max_kde_parameter_size\" will allow increasing \"max_groups\"\n            and keeping model size small as a trade-off of accuracy for more groups.\n        ",
      max_inputs: "\n            The maximum number of events an algorithm considers when fitting a model.\n            If this limit is exceeded, follows the behavior defined by \"use_sampling\".\n        ",
      max_kde_parameter_size: "\n            The maximum number of data points as the parameter size for Gaussian KDE density function.\n            Decreasing \"max_kde_parameter_size\" will allow increasing \"max_groups\"\n            and keeping model size small as a trade-off of accuracy for more groups.\n        ",
      max_memory_usage_mb: 'The maximum allowed memory usage, in megabytes, by the fit command while fitting a model.',
      max_model_size_mb: 'The maximum allowed size of a model, in megabytes, created by the fit command.',
      max_score_time: 'The maximum time, in seconds, to spend in the "score" phase of an algorithm',
      max_threshold_num: 'The maximum number of thresholds that can be provided at the same time.',
      min_data_size_to_fit: "\n            The minimum number of data points required to fit a density function.\n            Warning about the inaccuracy of the density function if there are less than\n            \"min_data_size_to_fit\" data points in the training dataset.\n        ",
      summary_depth_limit: 'The number of nodes in a decision tree to display when running the "summary" command on a model.',
      summary_return_json: 'Whether or not to return a json representation instead of a ASCII representation of the nodes when running the "summary" command on a model.',
      use_sampling: 'Indicates whether to use Reservoir Sampling for data sets that exceed max_inputs or to instead throw an error'
    },
    validation: validation
  });
  var _default = _exports.default = MLSPLPropertiesModel;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/models/properties/Properties.es":
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
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esFunctionName, _esObjectToString, _webDomCollectionsForEach, _swcMltk, _underscoreMltk) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  /**
   * A model representation of the /properties endpoint.
   * This should only be used for .conf files if access to the [default] stanza is needed
   * Otherwise, use SplunkDsBase
   */
  var PropertiesModel = _swcMltk.BaseModel.extend({
    file: null,
    // the "file" part of properties/{file}/{stanza}/{key}
    urlRoot: 'properties',
    url: function url() {
      if (this.file != null) {
        var url = "".concat(this.urlRoot, "/").concat(encodeURIComponent(this.file));
        if (this.id != null) {
          return "".concat(url, "/").concat(encodeURIComponent(this.id));
        } else {
          return url;
        }
      } else {
        return this.urlRoot;
      }
    },
    bootstrap: function bootstrap() {
      var _this = this;
      var syncOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var isAdminLike = arguments.length > 1 ? arguments[1] : undefined;
      var bootstrapDeferred = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _swcMltk.jquery.Deferred();
      // use a separate model to avoid firing error events on the main model
      var proxyModel = new this.constructor({
        id: this.id
      });
      proxyModel.fetch(_objectSpread({
        success: function success() {
          _this.set(proxyModel.toJSON());
          bootstrapDeferred.resolve();
        },
        error: function error() {
          // if the user has admin_all_objects, try to create non-existent stanzas
          if (isAdminLike) {
            // use a separate model because the return type of creating a stanza is not what Backbone expects
            var createModel = new _this.constructor();

            // if the stanza doesn't exist, we create it here
            // the /properties endpoint has a different syntax for create vs update
            createModel.save({
              __stanza: _this.id
            }, _objectSpread({
              dataType: 'text'
            }, syncOptions)).done(function () {
              // once we create the stanza, attempt to fetch it again
              proxyModel.fetch(_objectSpread({
                success: function success() {
                  _this.set(proxyModel.toJSON());
                  bootstrapDeferred.resolve();
                },
                error: function error() {
                  bootstrapDeferred.reject();
                }
              }, syncOptions));
            }).fail(function () {
              bootstrapDeferred.reject();
            });
          }
          // if the user lacks admin_all_objects, fetch the [default] stanza instead
          else {
            var defaultModel = new _this.constructor({
              id: 'default'
            });
            defaultModel.fetch(_objectSpread({
              success: function success() {
                var defaultJSON = defaultModel.toJSON();
                defaultJSON.id = _this.id; // replace the "id" attribute with the correct one
                _this.set(defaultJSON);
                bootstrapDeferred.resolve();
              },
              error: function error() {
                bootstrapDeferred.reject();
              }
            }, syncOptions)).fail(function () {
              bootstrapDeferred.reject();
            });
          }
        }
      }, syncOptions));
      return bootstrapDeferred;
    },
    sync: function sync(method, model) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var url = _underscoreMltk.default.isFunction(model.url) ? model.url() : model.url;
      var defaults = {
        data: {
          output_mode: 'json'
        },
        url: _swcMltk.splunkDUtils.fullpath(url, options.data)
      };
      _swcMltk.jquery.extend(true, defaults, options, {
        data: model.attributes
      });

      // we don't want to persist these
      delete defaults.data.app;
      delete defaults.data.owner;
      delete defaults.data.sharing;

      // we don't want to persist "id" either
      delete defaults.data.id;

      // Backbone wants to PUT on 'update', which isn't what "properties/" supports
      var newMethod = method === 'update' ? 'create' : method;
      return _swcMltk.BaseModel.prototype.sync.apply(this, [newMethod, model, defaults]);
    },
    parse: function parse(response) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var data = {};
      if (response.entry != null) {
        response.entry.forEach(function (props) {
          data[props.name] = props.content;
        });
      }
      return data;
    }
  });
  var _default = _exports.default = PropertiesModel;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Algorithm.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("algorithm/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var AlgorithmRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Algorithm Settings'));
    },
    page: function page() {
      var _this = this;
      _Base.default.prototype.page.apply(this, arguments);
      if (this.mlsplView) {
        // TODO: Properly handle the backbutton by not requiring the entire page to be re-instantiated.
        // This is a failsafe for now if the querystring gets updated and then the user clicks the backbutton.
        // In this case the DOM is guaranteed to be cleaned up. We have not yet confirmed that all listeners
        // will be cleaned up.
        this.mlsplView.remove();
      }

      // make sure the user model is resolved before we attempt to load things
      this.deferreds.user.then(function () {
        _this.mlsplView = new _Master.default({
          model: {
            application: _this.model.application,
            classicurl: _this.model.classicurl,
            user: _this.model.user
          },
          deferreds: {
            layout: _this.deferreds.layout
          }
        });
      });
    }
  });
  var _default = _exports.default = AlgorithmRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "algorithm/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("./src/main/webapp/models/properties/MLSPL.es"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/util/url.es"), __webpack_require__("algorithm/mlspl/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _module, _MLSPL, _BaseDashboard, _url, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _MLSPL = _interopRequireDefault(_MLSPL);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var syncOptions = {
    data: {
      app: 'Splunk_ML_Toolkit',
      owner: 'nobody'
    },
    emulateJSON: true
  };
  var AlgorithmView = _BaseDashboard.default.extend({
    moduleId: _module.default.id,
    headerOptions: {
      title: 'Algorithm Settings'
    },
    initialize: function initialize(options) {
      var _this = this;
      this.deferreds.mlspl = _swcMltk.jquery.Deferred();
      this.requiredDeferredIds.push('mlspl');
      _BaseDashboard.default.prototype.initialize.call(this, options);
      var stanza = this.model.classicurl.get('stanza');
      if (stanza == null || stanza === '') {
        this.deferreds.mlspl.reject('No algorithm was specified.');
      }
      this.model.mlspl = new _MLSPL.default({
        id: stanza
      });
      this.model.mlspl.bootstrap(syncOptions, this.model.user.isAdminLike()).done(function (model, response) {
        _this.deferreds.mlspl.resolve();
      }).fail(function (model, response) {
        _this.deferreds.mlspl.reject("Unable to load settings for \"".concat(_this.model.mlspl.id, "\"."));
      });
    },
    returnToAlgorithmList: function returnToAlgorithmList() {
      window.location = (0, _url.buildMLTKPageUrl)(this.model.application, 'settings');
    },
    render: function render() {
      _BaseDashboard.default.prototype.render.call(this);

      // escape algorithm name to guard against XSS attacks
      var escaper = _swcMltk.tokenUtils.getEscaper('html');
      var algorithm = escaper(this.model.classicurl.get('stanza'));
      if (algorithm === 'default') {
        this.model.header.set({
          title: 'Default Algorithm Settings',
          description: "Configure default settings for the fit and apply commands here.\n                              All algorithms will use these settings unless specifically configured with their own settings."
        });
      } else {
        // default settings should use their own header
        this.model.header.set({
          title: "".concat(algorithm, " Algorithm"),
          description: "Configure settings for the fit and apply commands for the ".concat(algorithm, " algorithm here.\n                              Any settings not configured on the algorithm directly will be inherited from the default settings.")
        });
      }
      this.children.header.render();
      this.children.flashMessage = new _swcMltk.FlashMessagesView({
        model: {
          mlspl: this.model.mlspl
        }
      });

      // prevent FlashMessages from responding to Backbone validation events = they'll be handled by MLSPLFormView
      this.model.mlspl.off('validated', null, this.children.flashMessage.flashMsgHelper);
      var isAdminLike = this.model.user.isAdminLike();
      if (!isAdminLike) {
        this.children.flashMessage.flashMsgHelper.addGeneralMessage('notAdminLike', {
          type: _swcMltk.splunkDUtils.WARNING,
          html: 'You do not have permissions to edit this configuration.'
        });
      }
      this.children.formView = new _Master.default({
        model: {
          mlspl: this.model.mlspl
        },
        labelWidth: 300,
        readOnly: !isAdminLike,
        onSave: function () {
          var _this2 = this;
          this.children.formView.model.props.set('disabled', true);
          this.model.mlspl.save(null, syncOptions).done(function () {
            _this2.returnToAlgorithmList();
          }).always(function () {
            _this2.children.formView.model.props.set('disabled', false);
          });
        }.bind(this),
        onCancel: this.returnToAlgorithmList.bind(this)
      });
      this.$el.append(this.children.flashMessage.render().el, this.children.formView.render().el);
      return this;
    }
  });
  var _default = _exports.default = AlgorithmView;
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "algorithm/mlspl/Form":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/RadioBar.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esFunctionName, _esStringTrim, _react, _propTypes, _ControlGroup, _Text, _Button, _RadioBar, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  _Text = _interopRequireDefault(_Text);
  _Button = _interopRequireDefault(_Button);
  _RadioBar = _interopRequireDefault(_RadioBar);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  var propTypes = {
    attributes: _propTypes.default.arrayOf(_propTypes.default.object),
    dataTest: _propTypes.default.string,
    disabled: _propTypes.default.bool,
    isValid: _propTypes.default.bool,
    labelWidth: _propTypes.default.number,
    onCancel: _propTypes.default.func.isRequired,
    onChange: _propTypes.default.func.isRequired,
    onSave: _propTypes.default.func.isRequired,
    readOnly: _propTypes.default.bool
  };
  var defaultProps = {
    attributes: [],
    dataTest: null,
    disabled: false,
    readOnly: false,
    isValid: false,
    labelWidth: 120
  };
  function formatTooltip() {
    var tooltip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return /*#__PURE__*/_react.default.createElement("span", {
      style: {
        whiteSpace: 'pre-line'
      }
    }, tooltip.trim());
  }
  var ConfList = function ConfList(_ref) {
    var attributes = _ref.attributes,
      dataTest = _ref.dataTest,
      disabled = _ref.disabled,
      isValid = _ref.isValid,
      labelWidth = _ref.labelWidth,
      onCancel = _ref.onCancel,
      _onChange = _ref.onChange,
      onSave = _ref.onSave,
      readOnly = _ref.readOnly;
    // SplunkUI doesn't handle overriding data-test correctly when it's undefined
    // so we need to do the check ourselves and not pass it to the Multiselect in that case
    var extraProps = {};
    if (dataTest != null) extraProps['data-test'] = dataTest;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, attributes.map(function (attr) {
      return /*#__PURE__*/_react.default.createElement(_ControlGroup.default, _extends({
        key: attr.label,
        error: attr.error != null,
        help: attr.error,
        label: attr.label,
        labelWidth: labelWidth,
        tooltip: formatTooltip(attr.tooltip)
      }, extraProps),
      // use Backbone validation settings to decide if we should render a radio control or a text field
      attr.validation && attr.validation.oneOf != null ? /*#__PURE__*/_react.default.createElement(_RadioBar.default, {
        error: attr.error != null,
        name: attr.label,
        onChange: function onChange(e, _ref2) {
          var value = _ref2.value,
            name = _ref2.name;
          return _onChange(value, name);
        },
        value: attr.value
      }, attr.validation.oneOf.map(function (option) {
        return /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
          key: option,
          disabled: disabled || readOnly,
          label: option,
          value: option
        });
      })) : /*#__PURE__*/_react.default.createElement(_Text.default, {
        disabled: disabled || readOnly,
        error: attr.error != null,
        name: attr.label,
        onChange: function onChange(e, _ref3) {
          var value = _ref3.value,
            name = _ref3.name;
          return _onChange(value, name);
        },
        value: attr.value
      }));
    }), /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      controlsLayout: "none",
      label: "",
      labelWidth: labelWidth
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: disabled,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: onCancel
    }), !readOnly && /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: disabled || !isValid,
      label: (0, _i18n.gettext)('Save'),
      onClick: onSave
    })));
  };
  ConfList.propTypes = propTypes;
  ConfList.defaultProps = defaultProps;
  var _default = _exports.default = ConfList;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "algorithm/mlspl/FormContainer":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.reflect.construct.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("algorithm/mlspl/Form")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArraySort, _esObjectKeys, _esObjectSetPrototypeOf, _esObjectToString, _react, _propTypes, _Form) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Form = _interopRequireDefault(_Form);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
    model: _propTypes.default.shape({
      mlspl: _propTypes.default.object.isRequired,
      // eslint-disable-line react/forbid-prop-types
      props: _propTypes.default.object.isRequired // eslint-disable-line react/forbid-prop-types
    }).isRequired
  };
  var MLSPLFormContainer = /*#__PURE__*/function (_Component) {
    function MLSPLFormContainer(props, context) {
      var _this;
      _classCallCheck(this, MLSPLFormContainer);
      _this = _callSuper(this, MLSPLFormContainer, [props, context]);
      _this.handleValueChange = _this.handleValueChange.bind(_this);
      var _this$parseMLSPLModel = _this.parseMLSPLModelToProps(),
        attributes = _this$parseMLSPLModel.attributes,
        isValid = _this$parseMLSPLModel.isValid;
      _this.state = {
        attributes: attributes,
        isValid: isValid
      };
      return _this;
    }
    _inherits(MLSPLFormContainer, _Component);
    return _createClass(MLSPLFormContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;
        this.props.model.props.on('change', function (model) {
          _this2.setState(model.changed);
        });
        this.props.model.mlspl.on('change', function (model) {
          var _this2$parseMLSPLMode = _this2.parseMLSPLModelToProps(),
            attributes = _this2$parseMLSPLMode.attributes,
            isValid = _this2$parseMLSPLMode.isValid;
          _this2.setState({
            attributes: attributes,
            isValid: isValid
          });
        });
      }
    }, {
      key: "handleValueChange",
      value: function handleValueChange(value, key) {
        this.props.model.mlspl.set(key, value);
      }
    }, {
      key: "parseMLSPLModelToProps",
      value: function parseMLSPLModelToProps() {
        var _this3 = this;
        var validation = this.props.model.mlspl.validate() || {};
        var attributes = Object.keys(this.props.model.mlspl.toJSON()).sort().reduce(function (reduced, key) {
          // Backbone puts "id" in attributes, but we don't want it ending up in the React state
          if (key !== 'id') {
            reduced.push({
              error: validation[key],
              label: key,
              tooltip: _this3.props.model.mlspl.description[key],
              validation: _this3.props.model.mlspl.validation[key],
              value: _this3.props.model.mlspl.attributes[key]
            });
          }
          return reduced;
        }, []);
        return {
          attributes: attributes,
          isValid: Object.keys(validation).length === 0,
          validation: validation
        };
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_react.default.createElement(_Form.default, _extends({
          onChange: this.handleValueChange
        }, this.state, this.props.model.props.attributes));
      }
    }]);
  }(_react.Component);
  MLSPLFormContainer.propTypes = propTypes;
  var _default = _exports.default = MLSPLFormContainer;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "algorithm/mlspl/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/reactadapterbase.js"), module, __webpack_require__("./src/main/webapp/models/properties/MLSPL.es"), __webpack_require__("algorithm/mlspl/FormContainer")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _swcMltk, _reactadapterbase, _module, _MLSPL, _FormContainer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _module = _interopRequireDefault(_module);
  _MLSPL = _interopRequireDefault(_MLSPL);
  _FormContainer = _interopRequireDefault(_FormContainer);
  var _excluded = ["model"]; // react-hot-loader must be loaded before react & react-dom
  // It is also safe to install as regular dependency, has minimal footprint
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var HotFormContainer = (0, _root.hot)(_FormContainer.default);
  var _default = _exports.default = _reactadapterbase.ReactAdapterBaseView.extend({
    moduleId: _module.default.id,
    /**
     * @param {Object} options The props supported by <Form>
     */
    initialize: function initialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _reactadapterbase.ReactAdapterBaseView.prototype.initialize.apply(this, options);
      this.model = this.model || {};
      var model = options.model,
        props = _objectWithoutProperties(options, _excluded);
      this.model.mlspl = this.model.mlspl || new _MLSPL.default();
      this.model.props = this.model.props || new _swcMltk.Backbone.Model();
      this.model.props.set(props);
    },
    getComponent: function getComponent() {
      return _react.default.createElement(HotFormContainer, {
        model: this.model
      });
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/algorithm.es","pages_common"]]]);