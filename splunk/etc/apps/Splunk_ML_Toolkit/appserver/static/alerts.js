(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["alerts"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/alerts.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Alerts.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Alerts, _swcMltk) {
  "use strict";

  _Alerts = _interopRequireDefault(_Alerts);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Alerts.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Alerts.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/collections/Alerts.es"), __webpack_require__("./src/main/webapp/util/loadLayout.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _i18n, _Alerts, _loadLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Alerts = _interopRequireDefault(_Alerts);
  _loadLayout = _interopRequireDefault(_loadLayout);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.AlertsRouter.extend({
    initialize: function initialize() {
      var _this = this;
      _swcMltk.BaseListingsRouter.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Alerts'));
      this.loadingMessage = (0, _i18n.gettext)('Loading...');
      if (window.location.pathname.indexOf('system/alerts') !== -1) {
        this.enableAppBar = false;
      }
      // state model
      this.stateModel.set({
        sortKey: 'name',
        sortDirection: 'asc',
        count: 100,
        offset: 0
      });
      this.stateModel.set('fetching', true);
      this.deferreds.namespaceAppDeferred = _swcMltk.jquery.Deferred();
      // CHANGED: use MLTK's Alerts Collection instead of Core's
      this.savedAlertsCollection = new _Alerts.default();
      this.namespaceTestModel = new _swcMltk.AppLocalModel();
      this.alertActionsCollection = new _swcMltk.ModAlertActionsCollection();

      // TODO: Add fetch data options - currently doing and unbouded fetch
      this.deferredAlertActionCollection = this.alertActionsCollection.fetch({
        data: {
          app: this.model.application.get('app'),
          owner: this.model.application.get('app'),
          search: 'disabled!=1'
        },
        addListInTriggeredAlerts: true
      });

      // events
      this.stateModel.on('change:sortDirection change:sortKey change:search change:offset', _swcMltk.underscore.debounce(function () {
        _this.fetchListCollection();
      }, 0), this);
      this.savedAlertsCollection.on('destroy', function () {
        _this.fetchListCollection();
      }, this);
      this.deferreds.layout = _swcMltk.jquery.Deferred();
      (0, _loadLayout.default)(function (layout) {
        _this.deferreds.layout.resolve(layout.create());
      });
    },
    initializeAndRenderViews: function initializeAndRenderViews() {
      var _this2 = this;
      if (this.model.user.canUseAlerts()) {
        _swcMltk.jquery.when(this.deferredAlertActionCollection, this.deferreds.namespaceAppDeferred, this.deferreds.layout).then(function (alertAction, namespace, layout) {
          _this2.alertsView = new _swcMltk.AlertsView({
            model: {
              state: _this2.stateModel,
              application: _this2.model.application,
              appLocal: _this2.model.appLocal,
              classicurl: _this2.model.classicurl,
              user: _this2.model.user,
              uiPrefs: _this2.uiPrefsModel,
              serverInfo: _this2.model.serverInfo,
              rawSearch: _this2.rawSearch
            },
            collection: {
              savedAlerts: _this2.savedAlertsCollection,
              roles: _this2.rolesCollection,
              apps: _this2.collection.appLocals,
              alertActions: _this2.alertActionsCollection
            }
          });
          layout.getContainerElement().appendChild(_this2.alertsView.render().el);
          _this2.uiPrefsModel.entry.content.on('change', function () {
            _this2.populateUIPrefs();
          });
          _this2.uiPrefsModel.entry.content.on('change:display.prefs.aclFilter', function () {
            _this2.fetchListCollection();
          });
        });
      } else {
        // Display the paywall if we are running on a free license. Alerts are not available in the free version
        this.paywallView = new _swcMltk.PaywallView({
          title: (0, _i18n.gettext)('Alerts'),
          model: {
            application: this.model.application,
            serverInfo: this.model.serverInfo
          }
        });
        this.pageView.$('.main-section-body').html(this.paywallView.render().el);
      }
    },
    page: function page() {
      this.deferreds.layout.done(function () {
        if (this.removeLoadingEl) {
          this.removeLoadingEl();
        }
        this.removeLoadingEl = null;
      }.bind(this));
    },
    // eslint-disable-next-line consistent-return
    fetchListCollection: function fetchListCollection() {
      // Unused, for Splunk Light
      this.deferreds.namespaceAppDeferred.resolve();
      if (this.model.user.canUseAlerts()) {
        this.model.classicurl.fetch();
        if (this.model.classicurl.get('search')) {
          this.stateModel.set('search', this.model.classicurl.get('search'), {
            silent: true
          });
          this.model.classicurl.unset('search');
          this.model.classicurl.save({}, {
            replaceState: true
          });
        }
        if (this.model.classicurl.get('rawSearch')) {
          this.rawSearch.set('rawSearch', this.model.classicurl.get('rawSearch'), {
            silent: true
          });
          this.model.classicurl.unset('rawSearch');
          this.model.classicurl.save({}, {
            replaceState: true
          });
        }
        var search = this.stateModel.get('search') || '';
        var buttonFilterSearch = this.getButtonFilterSearch();
        if (search) {
          search += ' AND ';
        }
        if (buttonFilterSearch) {
          search += "".concat(buttonFilterSearch, " AND ");
        }
        search += "".concat(_Alerts.default.availableWithUserWildCardSearchString(this.model.application.get('owner')), " AND is_visible=1");

        // MLTK Experiments: filter out any experiment based alerts
        search += ' AND NOT args.mltk.experiment=*';
        this.stateModel.set('fetching', true);
        return this.savedAlertsCollection.safeFetch({
          data: {
            app: this.model.application.get('app') === 'system' ? '-' : this.model.application.get('app'),
            owner: '-',
            sort_dir: this.stateModel.get('sortDirection'),
            sort_key: this.stateModel.get('sortKey').split(','),
            sort_mode: ['natural', 'natural'],
            search: search,
            count: this.stateModel.get('count'),
            listDefaultActionArgs: true,
            offset: this.stateModel.get('offset')
          },
          success: function () {
            if (!this.savedAlertsCollection.touched) {
              this.stateModel.set('fetching', false);
            }
          }.bind(this)
        });
      } else {
        this.stateModel.set('fetching', false);
      }
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/alerts.es","pages_common"]]]);