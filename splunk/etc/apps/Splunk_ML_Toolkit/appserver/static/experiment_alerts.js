(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["experiment_alerts"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiment_alerts.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/ExperimentAlerts.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_ExperimentAlerts, _swcMltk) {
  "use strict";

  _ExperimentAlerts = _interopRequireDefault(_ExperimentAlerts);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _ExperimentAlerts.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/ExperimentAlerts.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/util/loadLayout.es"), __webpack_require__("./src/main/webapp/collections/Alerts.es"), __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("experimentAlerts/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _i18n, _loadLayout, _Alerts, _PolymorphicExperiment, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _loadLayout = _interopRequireDefault(_loadLayout);
  _Alerts = _interopRequireDefault(_Alerts);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /*
   * This router is *heavily* based off the alerts router:
   * routers/Alerts.js - please use it as a reference.
   */
  var _default = _exports.default = _swcMltk.BaseListingsRouter.extend({
    initialize: function initialize() {
      var _this = this;
      _swcMltk.BaseListingsRouter.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Experiment Alerts'));
      this.loadingMessage = (0, _i18n.gettext)('Loading...');

      // state model
      this.stateModel.set({
        sortKey: 'name',
        sortDirection: 'asc',
        count: 100,
        offset: 0
      });
      this.stateModel.set('fetching', true);
      this.deferreds.layout = _swcMltk.jquery.Deferred();
      (0, _loadLayout.default)(function (layout) {
        _this.deferreds.layout.resolve(layout.create());
      });
      // experiments
      this.deferreds.experimentFetch = _swcMltk.jquery.Deferred();

      // collections
      this.savedAlertsCollection = new _Alerts.default();
      this.alertActionsCollection = new _swcMltk.ModAlertActionsCollection();

      // flash message
      this.flashMessageView = new _swcMltk.FlashMessagesView({
        collection: {
          savedAlertsCollection: this.savedAlertsCollection
        }
      });

      // TODO: Add fetch data options - currently doing and unbouded fetch
      this.deferredAlertActionCollection = this.alertActionsCollection.fetch({
        data: {
          app: this.model.application.get('app'),
          owner: this.model.application.get('owner'),
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
    },
    addError: function addError(id, msg) {
      var message = {
        type: _swcMltk.splunkDUtils.ERROR,
        html: msg
      };
      this.flashMessageView.flashMsgHelper.addGeneralMessage(id, message);
      this.isError = true;
    },
    renderFlashMessages: function renderFlashMessages() {
      var flashMessagesEl = this.flashMessageView.render().el;
      this.pageView.$('.main-section-body').html(flashMessagesEl);
    },
    initializeAndRenderViews: function initializeAndRenderViews() {
      var _this2 = this;
      if (this.isError) {
        this.renderFlashMessages();
      }
      if (this.model.user.canUseAlerts()) {
        _swcMltk.jquery.when(this.deferredAlertActionCollection, this.deferreds.experimentFetch, this.deferreds.layout).then(function (alertActionCollection, experimentFetch, layout) {
          _this2.alertsView = new _Master.default({
            model: {
              experiment: _this2.model.experiment,
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
            this.populateUIPrefs();
          }, _this2);
          _this2.uiPrefsModel.entry.content.on('change:display.prefs.aclFilter', function () {
            this.fetchListCollection();
          }, _this2);
        });
      } else {
        // Display the paywall if we are running on a free license. Alerts are not available in the free version
        this.paywallView = new _swcMltk.PaywallView({
          title: (0, _i18n.gettext)('Experiment Alerts'),
          model: {
            application: this.model.application,
            serverInfo: this.model.serverInfo
          }
        });
        this.pageView.$('.main-section-body').html(this.paywallView.render().el);
      }
    },
    fetchListCollection: function fetchListCollection() {
      var _this3 = this;
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
        if (this.model.classicurl.get('experimentId')) {
          if (!this.model.experiment) {
            this.model.experiment = new _PolymorphicExperiment.default({
              entry: [{
                content: {
                  type: this.model.classicurl.get('experimentType')
                }
              }]
            }, {
              parse: true
            });
            this.flashMessageView.register(this.model.experiment);
          }
          var expId = this.model.classicurl.get('experimentId');
          this.model.experiment.set(this.model.experiment.idAttribute, expId);
          this.model.experiment.fetch({
            success: function success(model, response) {
              _this3.deferreds.experimentFetch.resolve();
            },
            error: function error(model, response) {
              _this3.renderFlashMessages();
            }
          });
        } else {
          var msg = 'This page cannot be used without an experiment ID in the query parameters.';
          var id = 'missing_experiment_id_in_query_parameters';
          this.addError(id, msg);
        }
        _swcMltk.jquery.when(this.deferreds.experimentFetch).then(function () {
          var guid = _this3.model.experiment.entry.get('name');
          search += " AND name=*".concat(guid, "*");
          _this3.stateModel.set('fetching', true);
          return _this3.savedAlertsCollection.fetch({
            requireExperiment: true,
            experimentName: guid,
            data: {
              app: _this3.model.application.get('app'),
              owner: _this3.model.application.get('owner'),
              sort_dir: _this3.stateModel.get('sortDirection'),
              sort_key: _this3.stateModel.get('sortKey').split(','),
              sort_mode: ['natural', 'natural'],
              search: search,
              count: _this3.stateModel.get('count'),
              listDefaultActionArgs: true,
              offset: _this3.stateModel.get('offset')
            },
            success: function success() {
              _this3.stateModel.set('fetching', false);
            }
          });
        });
      } else {
        this.stateModel.set('fetching', false);
      }
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experimentAlerts/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), module, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("experimentAlerts/table/Master"), __webpack_require__("experimentAlerts/Title")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _module, _swcMltk, _Master, _Title) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _Master = _interopRequireDefault(_Master);
  _Title = _interopRequireDefault(_Title);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // Custom table and title for experiments
  var _default = _exports.default = _swcMltk.AlertsView.extend({
    moduleId: _module.default.id,
    /**
     * @param {Object} options {
     *     model: {
     *          experiment: <models.ExperimentModel>,
     *          state: <models.Base>,
     *          application: <models.Application>,
     *          appLocal: <models.services.AppLocal>,
     *          uiPrefs: <models.services.admin.UIPrefs>
     *          user: <models.services.admin.User>,
     *          rawSearch: <models.Base>
     *     },
     *     collection: {
     *         savedAlerts: <collections.services.SavedSearches>,
     *         roles: <collections.services.authorization.Roles>,
     *         apps: <collections.services.AppLocals>,
     *         alertActions: <collections.shared.ModAlertActions>
     *     }
     * }
     */
    initialize: function initialize() {
      _swcMltk.AlertsView.prototype.initialize.apply(this, arguments);
      this.children.title = new _Title.default({
        model: {
          experiment: this.model.experiment,
          serverInfo: this.model.serverInfo,
          state: this.model.state
        }
      });
      this.children.caption = new _swcMltk.TableCaptionView({
        countLabel: (0, _i18n.gettext)('Alerts'),
        model: {
          state: this.model.state,
          application: this.model.application,
          uiPrefs: this.model.uiPrefs,
          user: this.model.user,
          serverInfo: this.model.serverInfo,
          rawSearch: this.model.rawSearch
        },
        filterKey: ['args.mltk.experiment.title'],
        collection: this.collection.savedAlerts,
        noFilter: false,
        noFilterButtons: true,
        showListModeButtons: false
      });
    },
    _renderTable: function _renderTable() {
      if (this.children.tiles) {
        this.children.tiles.remove();
        delete this.children.tiles;
      }
      if (!this.children.table) {
        this.children.table = new _Master.default({
          model: {
            experiment: this.model.experiment,
            state: this.model.state,
            application: this.model.application,
            uiPrefs: this.model.uiPrefs,
            userPref: this.model.userPref,
            user: this.model.user,
            appLocal: this.model.appLocal,
            serverInfo: this.model.serverInfo
          },
          collection: {
            savedAlerts: this.collection.savedAlerts,
            roles: this.collection.roles,
            apps: this.collection.apps,
            alertActions: this.collection.alertActions
          }
        });
      }
      this.children.table.render().appendTo(this.$el);
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experimentAlerts/Title":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), module], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _i18n, _module) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.AlertsTitleView.extend({
    moduleId: _module.default.id,
    /**
     * @param options
     *      model: {
     *          experiment: <models.ExperimentModel>
     *      }
     */
    render: function render() {
      this.$el.html(this.compiledTemplate({
        underscore: _swcMltk.underscore,
        isLite: false,
        title: _swcMltk.splunkUtil.sprintf((0, _i18n.gettext)('Alerts for Experiment: %s'), this.model.experiment.entry.content.get('title'))
      }));
      return this;
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experimentAlerts/table/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), module, __webpack_require__("experimentAlerts/table/MoreInfo"), __webpack_require__("experimentAlerts/table/TableRow")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _swcMltk, _i18n, _module, _MoreInfo, _TableRow) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _MoreInfo = _interopRequireDefault(_MoreInfo);
  _TableRow = _interopRequireDefault(_TableRow);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.AlertsTableView.extend({
    moduleId: _module.default.id,
    /**
     * @param {Object} options {
     *     model: {
     *          experiment: <models.ExperimentModel>,
     *          state: <models.Base>,
     *          application: <models.Application>,
     *          appLocal: <models.services.AppLocal>>,
     *          uiPrefs: <models.services.admin.UIPrefs>
     *          user: <models.services.admin.User>
     *     },
     *     collection: {
     *         savedAlerts: <collections.services.SavedSearches>,
     *         roles: <collections.services.authorization.Roles>,
     *         apps: <collections.services.AppLocals>,
     *         alertActions: <collections.shared.ModAlertActions>
     *     }
     * }
     */
    initialize: function initialize() {
      _swcMltk.BaseView.prototype.initialize.apply(this, arguments);
      this.children.tableRowToggle = new _swcMltk.TableRowToggleView({
        el: this.el,
        collapseOthers: true
      });
      var tableHeaders = [];
      tableHeaders.push({
        label: 'i',
        className: 'col-info',
        html: '<i class="icon-info"></i>'
      });
      tableHeaders.push({
        label: (0, _i18n.gettext)('Title'),
        sortKey: 'args.mltk.experiment.title'
      });
      tableHeaders.push({
        label: (0, _i18n.gettext)('Alert Type'),
        className: 'col-alert-type'
      });
      tableHeaders.push({
        label: (0, _i18n.gettext)('Trigger Conditions'),
        className: 'col-alert-trigger'
      });
      tableHeaders.push({
        label: (0, _i18n.gettext)('Trigger Actions'),
        className: 'col-alert-actions'
      });
      tableHeaders.push({
        label: (0, _i18n.gettext)('Status'),
        className: 'col-status',
        sortKey: 'disabled'
      });
      tableHeaders.push({
        label: (0, _i18n.gettext)('Actions'),
        className: 'col-actions'
      });
      this.children.head = new _swcMltk.TableHeadView({
        model: this.model.state,
        columns: tableHeaders
      });
      this.children.rows = this.rowsFromCollection();
      this.children.tableDock = new _swcMltk.TableDockView({
        el: this.el,
        offset: 36,
        dockScrollBar: false,
        defaultLayout: 'fixed',
        flexWidthColumn: 1
      });
      this.activate();
    },
    rowsFromCollection: function rowsFromCollection() {
      return _swcMltk.underscore.flatten(this.collection.savedAlerts.map(function (model, i) {
        return [new _TableRow.default({
          model: {
            experiment: this.model.experiment,
            savedAlert: model,
            application: this.model.application,
            state: this.model.state,
            appLocal: this.model.appLocal,
            user: this.model.user,
            serverInfo: this.model.serverInfo
          },
          collection: {
            roles: this.collection.roles,
            apps: this.collection.apps,
            alertActions: this.collection.alertActions
          },
          index: i
        }), new _MoreInfo.default({
          model: {
            experiment: this.model.experiment,
            savedAlert: model,
            application: this.model.application,
            appLocal: this.model.appLocal,
            user: this.model.user,
            serverInfo: this.model.serverInfo
          },
          collection: {
            roles: this.collection.roles,
            alertActions: this.collection.alertActions
          },
          index: i
        })];
      }, this));
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experimentAlerts/table/MoreInfo":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("experimentAlerts/alertcontrols/details/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _module, _swcMltk, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // Just need to update the number of columns and pass the experiment model.
  var _default = _exports.default = _swcMltk.AlertsTableMoreInfoView.extend({
    moduleId: _module.default.id,
    initialize: function initialize() {
      _swcMltk.AlertsTableMoreInfoView.prototype.initialize.apply(this, arguments);
      this.children.detailsView = new _Master.default({
        model: {
          experiment: this.model.experiment,
          savedAlert: this.model.savedAlert,
          application: this.model.application,
          appLocal: this.model.appLocal,
          user: this.model.user,
          serverInfo: this.model.serverInfo
        },
        collection: {
          roles: this.collection.roles,
          alertActions: this.collection.alertActions
        }
      });
    },
    render: function render() {
      this.$el.html(this.compiledTemplate({
        description: this.model.savedAlert.entry.content.get('description'),
        cols: 6
      }));
      this.children.detailsView.render().appendTo(this.$('td.details'));
      return this;
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experimentAlerts/table/TableRow":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), module, __webpack_require__("experimentAlerts/alertcontrols/EditMenu")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _i18n, _module, _EditMenu) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _EditMenu = _interopRequireDefault(_EditMenu);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.BaseView.extend({
    moduleId: _module.default.id,
    tagName: 'tr',
    className: 'expand',
    /**
     * @param {Object} options {
     *     model: {
     *          experiment: <models.ExperimentModel>,
     *          savedAlert: <models.services.SavedSearch>,
     *          application: <models.Application>,
     *          state: <Backbone.Model>,
     *          appLocal: <models.services.AppLocal>
     *          user: <models.services.admin.User>
     *     },
     *     collections: {
     *          roles: <collections.services.authorization.Roles>,
     *          apps: <collections.services.AppLocals>,
     *          alertActions: <collections.shared.ModAlertActions>
     *      }
     * }
     */
    initialize: function initialize() {
      _swcMltk.BaseView.prototype.initialize.apply(this, arguments);
      this.$el.addClass(this.options.index % 2 ? 'even' : 'odd');
      this.children.triggerTextView = new _swcMltk.AlertControlsDetailsTriggerView({
        model: this.model.savedAlert
      });
      this.children.typeTextView = new _swcMltk.AlertControlsDetailsTypeView({
        model: this.model.savedAlert
      });
      this.children.actionsTextView = new _swcMltk.ActionsDetailsView({
        model: {
          document: this.model.savedAlert,
          application: this.model.application
        },
        collection: {
          alertActions: this.collection.alertActions
        }
      });
      this.children.editmenu = new _EditMenu.default({
        model: {
          experiment: this.model.experiment,
          savedAlert: this.model.savedAlert,
          application: this.model.application,
          appLocal: this.model.appLocal,
          user: this.model.user,
          serverInfo: this.model.serverInfo
        },
        collection: {
          roles: this.collection.roles,
          alertActions: this.collection.alertActions,
          appLocals: this.collection.apps
        },
        button: false,
        showOpenActions: false
      });
      this.activate();
    },
    startListening: function startListening() {
      this.listenTo(this.model.savedAlert, 'updateCollection', function () {
        this.model.state.trigger('change:search');
      });
      this.listenTo(this.model.savedAlert.entry.content, 'change:disabled', this.updateStatus);
    },
    updateStatus: function updateStatus() {
      this.$('td.status').text(this.model.savedAlert.entry.content.get('disabled') ? (0, _i18n.gettext)('Disabled') : (0, _i18n.gettext)('Enabled'));
    },
    render: function render() {
      var alertName = this.model.savedAlert.entry.content.get('args.mltk.experiment.title');
      var openInApp = this.model.application.get('app');
      var alertLink = _swcMltk.route.alert(this.model.application.get('root'), this.model.application.get('locale'), openInApp, {
        data: {
          s: this.model.savedAlert.id
        }
      });
      this.$el.html(this.compiledTemplate({
        underscore: _swcMltk.underscore,
        alertName: alertName,
        alertLink: alertLink,
        index: this.options.index,
        status: this.model.savedAlert.entry.content.get('disabled') ? (0, _i18n.gettext)('Disabled') : (0, _i18n.gettext)('Enabled'),
        isLite: false
      }));
      this.children.typeTextView.render().prependTo(this.$('td.alert-type'));
      this.children.triggerTextView.render().prependTo(this.$('td.alert-trigger'));
      this.children.actionsTextView.render().prependTo(this.$('td.alert-actions'));
      this.children.editmenu.render().appendTo(this.$('.actions'));
      return this;
    },
    template: "\n                <td class=\"expands\">\n                    <a href=\"#\"><i class=\"icon-triangle-right-small\"></i></a>\n                </td>\n                <td class=\"title\">\n                    <a href=\"<%= alertLink %>\" title=\"<%- alertName %>\"><%- alertName %></a>\n                </td>\n                <td class=\"alert-type\"></td>\n                <td class=\"alert-trigger\"></td>\n                <td class=\"alert-actions\"></td>\n                <td class=\"status\"><%- status %></td>\n                <td class=\"actions\"></td>\n           "
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiment_alerts.es","pages_common"]]]);