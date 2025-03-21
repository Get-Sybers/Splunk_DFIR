(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["smart_outlier_detection"],{

/***/ "./node_modules/@splunk/react-icons/ChartArea.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 32);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __webpack_require__("./node_modules/react/index.js");

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = __webpack_require__("./node_modules/@splunk/react-icons/SVGInternal.js");

/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChartArea; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




/* eslint-disable max-len */

function ChartArea(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2___default.a, _extends({
    screenReaderText: Object(_splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__["_"])('Area Chart'),
    viewBox: "0 0 1500 1230"
  }, props), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
    d: "M1500 1229.795H0v-288.7l170.548-213.698c11.644-15.068 27.055-19.863 46.233-14.383l201.37 57.534c21.234 6.85 38.014.685 50.343-18.493L820.89 216.78c6.85-10.958 16.096-17.98 27.74-21.06 11.644-3.083 23.288-1.542 34.932 4.622l214.726 115.07c17.123 9.588 33.904 7.533 50.342-6.165L1500 0v1229.795z"
  }));
}

/***/ })

/******/ });

/***/ }),

/***/ "./node_modules/@splunk/react-ui/TabLayout.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = /******/function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/
  var installedModules = {};
  /******/
  /******/ // The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/
    };
    /******/
    /******/ // Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/
    module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/
    return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/
  __webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/
  __webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
      /******/
    }
    /******/
  };
  /******/
  /******/ // define __esModule on exports
  /******/
  __webpack_require__.r = function (exports) {
    /******/if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      });
      /******/
    }
    /******/
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    /******/
  };
  /******/
  /******/ // create a fake namespace object
  /******/ // mode & 1: value is a module id, require it
  /******/ // mode & 2: merge all properties of value into the ns
  /******/ // mode & 4: return value when already ns object
  /******/ // mode & 8|1: behave like require
  /******/
  __webpack_require__.t = function (value, mode) {
    /******/if (mode & 1) value = __webpack_require__(value);
    /******/
    if (mode & 8) return value;
    /******/
    if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
    /******/
    var ns = Object.create(null);
    /******/
    __webpack_require__.r(ns);
    /******/
    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    });
    /******/
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) {
      return value[key];
    }.bind(null, key));
    /******/
    return ns;
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/
  __webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ? /******/function getDefault() {
      return module['default'];
    } : /******/function getModuleExports() {
      return module;
    };
    /******/
    __webpack_require__.d(getter, 'a', getter);
    /******/
    return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/
  __webpack_require__.p = "";
  /******/
  /******/
  /******/ // Load entry module and return exports
  /******/
  return __webpack_require__(__webpack_require__.s = 107);
  /******/
}
/************************************************************************/
/******/({
  /***/0: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/themes.js");

    /***/
  }),
  /***/1: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/prop-types/index.js");

    /***/
  }),
  /***/10: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/ui-utils/id.js");

    /***/
  }),
  /***/107: ( /***/function (module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);

    // EXTERNAL MODULE: external "react"
    var external_react_ = __webpack_require__(2);
    var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

    // EXTERNAL MODULE: external "prop-types"
    var external_prop_types_ = __webpack_require__(1);
    var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_);

    // EXTERNAL MODULE: external "lodash"
    var external_lodash_ = __webpack_require__(4);

    // EXTERNAL MODULE: external "@splunk/ui-utils/id"
    var id_ = __webpack_require__(10);

    // EXTERNAL MODULE: external "@splunk/react-ui/TabBar"
    var TabBar_ = __webpack_require__(52);
    var TabBar_default = /*#__PURE__*/__webpack_require__.n(TabBar_);

    // EXTERNAL MODULE: external "@splunk/react-ui/themes"
    var themes_ = __webpack_require__(0);

    // EXTERNAL MODULE: external "styled-components"
    var external_styled_components_ = __webpack_require__(3);
    var external_styled_components_default = /*#__PURE__*/__webpack_require__.n(external_styled_components_);

    // CONCATENATED MODULE: ./src/TabLayout/TabLayoutStyles.js

    var StyledPanel = external_styled_components_default.a.div.withConfig({
      displayName: "TabLayoutStyles__StyledPanel",
      componentId: "mltk-sc-1edbp0f-0"
    })(["", ";"], Object(themes_["mixin"])('reset')('block'));
    var Styled = external_styled_components_default.a.div.withConfig({
      displayName: "TabLayoutStyles__Styled",
      componentId: "mltk-sc-1edbp0f-1"
    })(["text-align:center;margin-top:", ";&[data-flex='true']{display:flex;> ", "{width:100%;}> [role='tablist']{flex:0 0 auto;}}"], Object(themes_["variable"])('spacing'), /* sc-sel */
    StyledPanel);

    // CONCATENATED MODULE: ./src/TabLayout/Panel.jsx
    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var propTypes = {
      /** @private */
      children: external_prop_types_default.a.node,
      /**
       * Invoked with the DOM element when the component mounts and null when it unmounts.
       */
      elementRef: external_prop_types_default.a.func,
      /** See Icon documention for more information.
       * @excludeTheme scp
       */
      icon: external_prop_types_default.a.node,
      /** The text shown in the button. */
      label: external_prop_types_default.a.string,
      /** A unique id for this panel and used by the TabLayout to keep track of the open panel. */
      panelId: external_prop_types_default.a.string.isRequired,
      /**
       * Content to show in a tooltip when the user hovers over or focuses on the tab.
       */
      tooltip: external_prop_types_default.a.node,
      /** Prevents user from clicking the tab. */
      disabled: external_prop_types_default.a.bool
    };
    var defaultProps = {
      disabled: false
    };
    function Panel(props) {
      var children = props.children,
        elementRef = props.elementRef,
        panelId = props.panelId;
      return external_react_default.a.createElement(StyledPanel, _extends({
        "data-test": "panel",
        "data-test-panel-id": panelId
      }, Object(themes_["ref"])(elementRef), {
        role: "tabpanel"
      }, Object(external_lodash_["omit"])(props, Object(external_lodash_["keys"])(propTypes))), children);
    }
    Panel.propTypes = propTypes;
    Panel.defaultProps = defaultProps;
    /* harmony default export */
    var TabLayout_Panel = Panel;
    // CONCATENATED MODULE: ./src/TabLayout/TabLayout.jsx
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }
      return _typeof(obj);
    }
    function TabLayout_extends() {
      TabLayout_extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return TabLayout_extends.apply(this, arguments);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _possibleConstructorReturn(self, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      }
      return _assertThisInitialized(self);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
      return _setPrototypeOf(o, p);
    }
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }

    /**
     * The `TabLayout` is a group of managed `Panels`. Only one panel can be open at a time.
     * TabLayout supports both the controlled and uncontrolled patterns.
     */

    var TabLayout_TabLayout = /*#__PURE__*/
    function (_Component) {
      _inherits(TabLayout, _Component);
      function TabLayout(props) {
        var _getPrototypeOf2;
        var _this;
        _classCallCheck(this, TabLayout);
        for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }
        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TabLayout)).call.apply(_getPrototypeOf2, [this, props].concat(rest)));
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleChange", function (e, data) {
          var activePanelId = data.selectedTabId;
          if (!_this.isControlled()) {
            _this.setState({
              activePanelId: activePanelId
            });
          }
          _this.props.onChange(e, {
            activePanelId: activePanelId
          });
        });
        _this.controlledExternally = Object(external_lodash_["has"])(props, 'activePanelId');
        if (!_this.isControlled()) {
          _this.state = {
            activePanelId: props.defaultActivePanelId
          };
        }
        if (false) {}
        _this.guid = Object(id_["createDOMID"])();
        return _this;
      }
      _createClass(TabLayout, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
          if (false) {}
          if (false) {}
        }
      }, {
        key: "isControlled",
        value: function isControlled() {
          return this.controlledExternally;
        }
      }, {
        key: "render",
        value: function render() {
          var _this2 = this;
          var panel;
          var activePanelId = this.isControlled() ? this.props.activePanelId : this.state.activePanelId;
          var children = this.props.children;
          var tabs = external_react_["Children"].toArray(children).filter(external_react_["isValidElement"]).map(function (child) {
            var props = child.props;
            var id = "".concat(_this2.guid, "-").concat(props.panelId);
            var tabId = "".concat(_this2.guid, "-").concat(props.panelId, "-tab");
            if (props.panelId === activePanelId) {
              panel = Object(external_react_["cloneElement"])(child, {
                'aria-labelledby': tabId,
                id: id
              });
            }
            return external_react_default.a.createElement(TabBar_default.a.Tab, {
              appearance: _this2.props.appearance,
              icon: props.icon,
              key: props.panelId,
              label: props.label,
              tabId: props.panelId,
              id: tabId,
              ariaControls: id,
              tooltip: props.tooltip,
              disabled: props.disabled
            });
          });
          if (false) {}
          return external_react_default.a.createElement(Styled, TabLayout_extends({
            "data-test": "tab-layout",
            "data-test-active-panel-id": activePanelId,
            "data-flex": this.props.layout === 'vertical' || undefined
          }, Object(themes_["ref"])(this.props.elementRef), Object(external_lodash_["omit"])(this.props, Object(external_lodash_["keys"])(TabLayout.propTypes))), external_react_default.a.createElement(TabBar_default.a, {
            appearance: this.props.appearance,
            activeTabId: activePanelId,
            onChange: this.handleChange,
            iconSize: this.props.iconSize,
            tabWidth: this.props.tabWidth,
            layout: this.props.layout
          }, tabs), panel);
        }
      }]);
      return TabLayout;
    }(external_react_["Component"]);
    _defineProperty(TabLayout_TabLayout, "propTypes", {
      /**
       * Setting this prop to 'context' will create an appearance without underline.
       * @includeTheme scp
       */
      appearance: external_prop_types_default.a.oneOf(['navigation', 'context']),
      /**
       * `children` should be `TabLayout.Panel`.
       */
      children: external_prop_types_default.a.node,
      /**
       * Sets the active panel on the initial render. It should match the `panelId` of one of
       * the child `TabLayout.Panel`s. Only use `defaultActivePanelId` when using `TabLayout`
       * as an uncontrolled component.
       */
      defaultActivePanelId: external_prop_types_default.a.any,
      /**
       * Invoked with the DOM element when the component mounts and null when it unmounts.
       */
      elementRef: external_prop_types_default.a.func,
      /** Size of icon in `TabLayout.Panel` if it has an icon.
       * @excludeTheme scp
       */
      iconSize: external_prop_types_default.a.oneOf(['inline', 'small', 'large']),
      /**
       * The layout direction for tabs.
       * @excludeTheme scp
       */
      layout: external_prop_types_default.a.oneOf(['horizontal', 'vertical']),
      /** Width of each tab in pixels (Must be greater than 10 pixels). Leave blank for auto width. */
      tabWidth: external_prop_types_default.a.number,
      /** A callback that receives the event and data (selectedPanelId). */
      onChange: external_prop_types_default.a.func,
      /** The `panelId` of the `TabLayout.Panel` to activate. */
      activePanelId: external_prop_types_default.a.any
    });
    _defineProperty(TabLayout_TabLayout, "defaultProps", {
      appearance: 'navigation',
      iconSize: 'inline',
      layout: 'horizontal',
      onChange: function onChange() {}
    });
    _defineProperty(TabLayout_TabLayout, "Panel", TabLayout_Panel);

    /* harmony default export */
    var src_TabLayout_TabLayout = TabLayout_TabLayout;

    // CONCATENATED MODULE: ./src/TabLayout/index.js
    /* concated harmony reexport */
    __webpack_require__.d(__webpack_exports__, "default", function () {
      return src_TabLayout_TabLayout;
    });
    /* concated harmony reexport */
    __webpack_require__.d(__webpack_exports__, "Panel", function () {
      return TabLayout_Panel;
    });

    /***/
  }),
  /***/2: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/react/index.js");

    /***/
  }),
  /***/3: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

    /***/
  }),
  /***/4: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/lodash/lodash.js");

    /***/
  }),
  /***/52: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/TabBar.js");

    /***/
  })

  /******/
});

/***/ }),

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/smart_outlier_detection.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/SmartOutlierDetection.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_SmartOutlierDetection, _swcMltk) {
  "use strict";

  _SmartOutlierDetection = _interopRequireDefault(_SmartOutlierDetection);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _SmartOutlierDetection.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./node_modules/core-js/modules/es.json.to-string-tag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("./node_modules/core-js/internals/global.js");
var setToStringTag = __webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js");

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "./node_modules/core-js/modules/es.math.to-string-tag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var setToStringTag = __webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js");

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.async-iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol-define.js");

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.to-string-tag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("./node_modules/core-js/internals/get-built-in.js");
var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol-define.js");
var setToStringTag = __webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js");

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag(getBuiltIn('Symbol'), 'Symbol');


/***/ }),

/***/ "./node_modules/highcharts/modules/no-data-to-display.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 Highcharts JS v9.3.3 (2022-02-01)

 Plugin for displaying a message when there is no data visible in chart.

 (c) 2010-2021 Highsoft AS
 Author: Oystein Moseng

 License: www.highcharts.com/license
*/
(function(a){ true&&module.exports?(a["default"]=a,module.exports=a): true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./node_modules/highcharts/highcharts.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function(b){a(b);a.Highcharts=b;return a}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):undefined})(function(a){function b(a,b,e,d){a.hasOwnProperty(b)||(a[b]=d.apply(null,e))}a=a?a._modules:{};b(a,"Extensions/NoDataToDisplay.js",[a["Core/Renderer/HTML/AST.js"],a["Core/Chart/Chart.js"],a["Core/DefaultOptions.js"],
a["Core/Utilities.js"]],function(a,b,e,d){var f=e.getOptions;e=d.addEvent;var g=d.extend;d=b.prototype;f=f();g(f.lang,{noData:"No data to display"});f.noData={attr:{zIndex:1},position:{x:0,y:0,align:"center",verticalAlign:"middle"},style:{fontWeight:"bold",fontSize:"12px",color:"#666666"}};d.showNoData=function(b){var c=this.options;b=b||c&&c.lang.noData||"";c=c&&(c.noData||{});this.renderer&&(this.noDataLabel||(this.noDataLabel=this.renderer.label(b,0,0,void 0,void 0,void 0,c.useHTML,void 0,"no-data").add()),
this.styledMode||this.noDataLabel.attr(a.filterUserAttributes(c.attr||{})).css(c.style||{}),this.noDataLabel.align(g(this.noDataLabel.getBBox(),c.position||{}),!1,"plotBox"))};d.hideNoData=function(){this.noDataLabel&&(this.noDataLabel=this.noDataLabel.destroy())};d.hasData=function(){for(var a=this.series||[],b=a.length;b--;)if(a[b].hasData()&&!a[b].options.isInternal)return!0;return this.loadingShown};e(b,"render",function(){this.hasData()?this.hideNoData():this.showNoData()})});b(a,"masters/modules/no-data-to-display.src.js",
[],function(){})});
//# sourceMappingURL=no-data-to-display.js.map

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/ExperimentSummary/ExperimentSummary.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/data/algorithmSchemas/loadSchema.es"), __webpack_require__("./src/main/webapp/components/shared/JSXString.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentSummary/ExperimentSummary.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentSummary/FieldNames.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _swcMltk, _constants, _util, _loadSchema, _JSXString, _ExperimentSummary, _FieldNames) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _loadSchema = _interopRequireDefault(_loadSchema);
  _JSXString = _interopRequireDefault(_JSXString);
  _FieldNames = _interopRequireDefault(_FieldNames);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  /**
   * Natural language summary of the experiment.
   * Hangs out under the experiment title bar.
   * Displays whenever it has enough information to generate its content (requires the postProcessing steps to run)
   */

  var summaryText = (0, _i18n.gettext)('Detect outliers in %{TARGETS}, split by %{SPLIT_BYS}, using %{DISTRIBUTION_TYPE} distribution with a threshold of %{THRESHOLD}');
  var schema = (0, _loadSchema.default)('DensityFunction');
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
    // schema shouldn't be changing as user runs MLTK, memoize the enums for distributions
    var distMap = (0, _react.useMemo)(function () {
      var _schema$properties$al = schema.properties.algorithmParams.properties.dist,
        enumValues = _schema$properties$al.enum,
        enumLabels = _schema$properties$al.enumLabels;
      return _swcMltk.lodash.zipObject(enumValues, enumLabels);
    }, []);
    var searchStages = experiment.data.searchStages;
    var searchStagesDone = (0, _util.isAllStageDataReady)(searchStages);
    if (!searchStagesDone) {
      return null;
    }
    var mainStage = (0, _util.getStagesByRole)(searchStages, _constants.STAGE_ROLES.MAIN)[0];
    if (!mainStage || !mainStage.algorithmParams) {
      return null;
    }
    var vars = {
      TARGETS: /*#__PURE__*/_react.default.createElement(_FieldNames.default, {
        "data-test": "targets",
        fields: mainStage.targetVariables
      }),
      SPLIT_BYS: /*#__PURE__*/_react.default.createElement(_FieldNames.default, {
        "data-test": "split-bys",
        fields: mainStage.splitBy
      }),
      DISTRIBUTION_TYPE: /*#__PURE__*/_react.default.createElement(_ExperimentSummary.Variable, {
        "data-test": "distribution-type"
      }, distMap[mainStage.algorithmParams.dist] || mainStage.algorithmParams.dist || schema.properties.algorithmParams.properties.dist.default),
      THRESHOLD: /*#__PURE__*/_react.default.createElement(_ExperimentSummary.Variable, {
        "data-test": "threshold"
      }, mainStage.algorithmParams.threshold || schema.properties.algorithmParams.properties.threshold.default)
    };
    return /*#__PURE__*/_react.default.createElement(_ExperimentSummary.SummaryHeading, {
      "data-test": "experiment-summary-sod"
    }, /*#__PURE__*/_react.default.createElement(_JSXString.default, {
      string: summaryText,
      vars: vars
    }));
  };
  ExperimentSummary.propTypes = propTypes;
  var _default = _exports.default = ExperimentSummary;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/SmartOutlierContext.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/context/assistant.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/util/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayConcat, _esDateToPrimitive, _esNumberConstructor, _assistant, _constants, _util, _constants2, _constants3) {
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
  _exports.reducer = void 0;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * This file is responsible for maintaining global state within the context of SmartOutlierDetection.
 */
  var reducer = _exports.reducer = function reducer(state, action) {
    switch (action.type) {
      case _assistant.ASSISTANT_ACTIONS.SET_STEP:
        {
          var currentStepId = state.stepId,
            openModals = state.openModals;

          // store the stepId we're going to
          var _action$payload = action.payload,
            experiment = _action$payload.experiment,
            nextStepId = _action$payload.stepId;
          if (experiment != null && currentStepId !== nextStepId && currentStepId === _constants.STEP_LEARN) {
            // force the Experiment to always be up-to-date for things like promises resolving, etc.
            // pending a "real" fix in MLA-3515
            var updatedExperiment = experiment.update();
            var fitStage = updatedExperiment.getMainStage();
            var applyStage = (0, _util.getStageById)(updatedExperiment.data.postprocessingStages, _constants2.DF_APPLY_STAGE_ID);
            if (
            // if the apply stage has ever been run before, and it has a threshold that is different
            // from the main stage's threshold, block the user from proceeding until they resolve the discrepancy
            applyStage.status !== _constants3.STAGE_STATUSES.NEW && applyStage.algorithmParams.threshold != null && applyStage.algorithmParams.threshold !== fitStage.algorithmParams.threshold) {
              return _objectSpread(_objectSpread({}, state), {}, {
                openModals: [].concat(_toConsumableArray(openModals), [_constants2.THRESHOLD_MODAL_ID]),
                stepId: currentStepId,
                nextStepId: nextStepId
              });
            }
          }
          return (0, _assistant.reducer)(_objectSpread(_objectSpread({}, state), {}, {
            // clear out nextStepId
            nextStepId: undefined
          }), action);
        }
      default:
        {
          return (0, _assistant.reducer)(state, action);
        }
    }
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/SmartOutlierDetection.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentContainer/ExperimentContainer.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Define.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/Learn.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Review.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Operationalize.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/ExperimentSummary/ExperimentSummary.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _i18n, _swcMltk, _constants, _ExperimentContainer, _Define, _Learn, _Review, _Operationalize, _ExperimentSummary) {
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
  var titleStr = (0, _i18n.gettext)('Smart Outlier Detection: %s');
  var propTypes = {
    experimentContext: _propTypes.default.shape({
      experiment: _propTypes.default.shape({
        data: _propTypes.default.object
      }).isRequired
    }).isRequired
  };
  var WizardSteps = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _constants.STEP_DEFINE, _Define.default), _constants.STEP_LEARN, _Learn.default), _constants.STEP_REVIEW, _Review.default), _constants.STEP_OPERATIONALIZE, _Operationalize.default);
  var SmartOutlierDetection = function SmartOutlierDetection(props) {
    var experiment = props.experimentContext.experiment;
    var title = experiment.data ? _swcMltk.splunkUtil.sprintf(titleStr, experiment.data.title) : '';
    return /*#__PURE__*/_react.default.createElement(_ExperimentContainer.default, _extends({
      ExperimentSummary: _ExperimentSummary.default,
      title: title,
      WizardSteps: WizardSteps
    }, props));
  };
  SmartOutlierDetection.propTypes = propTypes;
  var _default = _exports.default = SmartOutlierDetection;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Define.jsx":
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

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Automatic/Automatic.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/TopDistributions.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/SelectDistributions/SelectDistributions.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Controls.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _TopDistributions, _SelectDistributions, _constants, _Controls) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _TopDistributions = _interopRequireDefault(_TopDistributions);
  _SelectDistributions = _interopRequireDefault(_SelectDistributions);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    dispatch: _propTypes.default.func.isRequired,
    /**
     * An array of available distributions
     */
    distributions: _propTypes.default.arrayOf(_propTypes.default.shape({
      outlierCount: _propTypes.default.number,
      // { <field1_name>: <field1_value>, <field2_name>: <field2_value>, ... }
      key: _propTypes.default.shape({})
    })).isRequired,
    numberOfDistributions: _propTypes.default.number.isRequired,
    /**
     * An array of selected distributions, in the form of objects that look like
     * { <field1_name>: <field1_value>, <field2_name>: <field2_value>, ... }
     */
    selectedDistributions: _propTypes.default.arrayOf(_propTypes.default.shape({}))
  };
  var defaultProps = {
    selectedDistributions: []
  };
  var Automatic = function Automatic(_ref) {
    var dispatch = _ref.dispatch,
      distributions = _ref.distributions,
      numberOfDistributions = _ref.numberOfDistributions,
      selectedDistributions = _ref.selectedDistributions;
    var handleMenuSelect = function handleMenuSelect(key) {
      dispatch({
        type: _constants.TOGGLE_AUTO_DISTRIBUTION,
        payload: key
      });
    };
    var handleSelect = function handleSelect(distributionsToSelect) {
      dispatch({
        type: _constants.SET_SELECTED_AUTO_DISTRIBUTIONS,
        payload: distributionsToSelect
      });
    };
    return distributions.length > 1 ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Controls.FlexControlGroup, {
      label: (0, _i18n.gettext)('View'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_TopDistributions.default, {
      dispatch: dispatch,
      numberOfDistributions: numberOfDistributions
    })), /*#__PURE__*/_react.default.createElement(_Controls.FlexControlGroup, {
      collapse: true,
      label: (0, _i18n.gettext)('Groups'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_SelectDistributions.default, {
      distributions: distributions,
      onMenuSelect: handleMenuSelect,
      onSelect: handleSelect,
      selectedDistributions: selectedDistributions
    }))) : null;
  };
  Automatic.propTypes = propTypes;
  Automatic.defaultProps = defaultProps;
  var _default = _exports.default = Automatic;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/ChartType/ChartType.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/RadioBar.js"), __webpack_require__("./node_modules/@splunk/react-icons/BarBeside.js"), __webpack_require__("./node_modules/@splunk/react-icons/ChartArea.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _RadioBar, _BarBeside, _ChartArea, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _RadioBar = _interopRequireDefault(_RadioBar);
  _BarBeside = _interopRequireDefault(_BarBeside);
  _ChartArea = _interopRequireDefault(_ChartArea);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  var propTypes = {
    isTimeView: _propTypes.default.bool,
    onChange: _propTypes.default.func.isRequired
  };
  var defaultProps = {
    isTimeView: false
  };
  var ChartType = /*#__PURE__*/(0, _react.memo)(function (_ref) {
    var onChange = _ref.onChange,
      isTimeView = _ref.isTimeView;
    return /*#__PURE__*/_react.default.createElement(_RadioBar.default, {
      onChange: onChange,
      value: isTimeView
    }, /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
      icon: /*#__PURE__*/_react.default.createElement(_BarBeside.default, {
        screenReaderText: ""
      }),
      label: (0, _i18n.gettext)('Density'),
      value: false
    }), /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
      icon: /*#__PURE__*/_react.default.createElement(_ChartArea.default, {
        screenReaderText: ""
      }),
      label: (0, _i18n.gettext)('Time'),
      value: true
    }));
  });
  ChartType.propTypes = propTypes;
  ChartType.defaultProps = defaultProps;
  var _default = _exports.default = ChartType;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Controls.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/SplitChartOptions/SplitChartOptions.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/ChartType/ChartType.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Mode/Mode.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Automatic/Automatic.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Manual/Manual.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Threshold/Threshold.jsx"), __webpack_require__("./src/main/webapp/data/algorithmSchemas/loadSchema.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Controls.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _ColumnLayout, _ControlGroup, _SingleValue, _SplitChartOptions, _constants, _ChartType, _Mode, _Automatic, _Manual, _Threshold, _loadSchema, _Controls) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  _SingleValue = _interopRequireDefault(_SingleValue);
  _SplitChartOptions = _interopRequireDefault(_SplitChartOptions);
  _ChartType = _interopRequireDefault(_ChartType);
  _Mode = _interopRequireDefault(_Mode);
  _Automatic = _interopRequireDefault(_Automatic);
  _Manual = _interopRequireDefault(_Manual);
  _Threshold = _interopRequireDefault(_Threshold);
  _loadSchema = _interopRequireDefault(_loadSchema);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  var schema = (0, _loadSchema.default)('DensityFunction');
  var thresholdKey = 'threshold';
  var thresholdSchema = schema.properties.algorithmParams.properties[thresholdKey];
  var propTypes = {
    /**
     * The fit or apply stage
     */
    activeStage: _propTypes.default.shape({
      guid: _propTypes.default.any
    }).isRequired,
    /**
     * An array of available distributions
     */
    autoDistributions: _propTypes.default.arrayOf(_propTypes.default.shape({
      outlierCount: _propTypes.default.number,
      key: _propTypes.default.shape({})
    })).isRequired,
    dispatch: _propTypes.default.func.isRequired,
    /**
     * The Experiment
     */
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
      }),
      getMainStage: _propTypes.default.any
    }).isRequired,
    /**
     * Whether or not split view is enabled
     */
    isSplitView: _propTypes.default.bool.isRequired,
    /**
     * Whether or not time view is enabled
     */
    isTimeView: _propTypes.default.bool.isRequired,
    /**
     * An array of the available fields, their values, and the number of outliners for each field
     */
    manualFields: _propTypes.default.arrayOf(_propTypes.default.shape({
      name: _propTypes.default.string.isRequired,
      value: _propTypes.default.arrayOf(_propTypes.default.shape({
        outlierCount: _propTypes.default.number,
        key: _propTypes.default.shape({
          /* <field_name>: <field_value> */
        })
      })).isRequired
    })).isRequired,
    mode: _propTypes.default.oneOf(['auto', 'manual']).isRequired,
    numberOfDistributions: _propTypes.default.number.isRequired,
    outlierCount: _propTypes.default.number,
    /**
     * An array of selected distributions, in the form of objects that look like
     * { <field1_name>: <field1_value>, <field2_name>: <field2_value>, ..; }
     */
    selectedAutoDistributions: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired,
    /**
     * The selected field values, as a map from field name to an array of field values
     */
    selectedManualFieldValues: _propTypes.default.objectOf(_propTypes.default.array).isRequired,
    /**
     * Whether or not to show the chart mode picker
     */
    showChartTypeToggle: _propTypes.default.bool
  };
  var defaultProps = {
    outlierCount: 0,
    showChartTypeToggle: false
  };
  var Controls = function Controls(_ref) {
    var activeStage = _ref.activeStage,
      autoDistributions = _ref.autoDistributions,
      dispatch = _ref.dispatch,
      experiment = _ref.experiment,
      isSplitView = _ref.isSplitView,
      isTimeView = _ref.isTimeView,
      manualFields = _ref.manualFields,
      mode = _ref.mode,
      numberOfDistributions = _ref.numberOfDistributions,
      outlierCount = _ref.outlierCount,
      selectedAutoDistributions = _ref.selectedAutoDistributions,
      selectedManualFieldValues = _ref.selectedManualFieldValues,
      showChartTypeToggle = _ref.showChartTypeToggle;
    var handleSplitChange = (0, _react.useCallback)(function (e, _ref2) {
      var value = _ref2.value;
      dispatch({
        type: _constants.SET_SPLIT_VIEW,
        payload: value
      });
    }, [dispatch]);
    var handleChartTypeChange = (0, _react.useCallback)(function (e, _ref3) {
      var value = _ref3.value;
      dispatch({
        type: _constants.SET_TIME_VIEW,
        payload: value
      });
    }, [dispatch]);
    var hasSplitBy = experiment.getMainStage().splitBy.length > 0;
    var colSpan = 3;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Controls.PaddedColumnLayout, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, null, hasSplitBy && /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: colSpan
    }, /*#__PURE__*/_react.default.createElement(_Mode.default, {
      dispatch: dispatch,
      value: mode
    })), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: colSpan * (hasSplitBy ? 2 : 3)
    }, /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      label: thresholdSchema.title,
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_Threshold.default
    // this component always want to work on the "apply" stage
    // but since it maintains its own internal state to avoid changing
    // without user interaction, we pass in the stage guid as a key
    // since that stage will either be the fit stage or apply stage
    // and when it changes between them we want to throw out the threshold's state
    , {
      key: activeStage.guid,
      experiment: experiment,
      thresholdKey: thresholdKey,
      thresholdSchema: thresholdSchema
    }))), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: colSpan
    }, /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      label: (0, _i18n.gettext)('Total Outliers'),
      labelPosition: "top",
      tooltip: (0, _i18n.gettext)('The total number of outliers in your data')
    }, /*#__PURE__*/_react.default.createElement(_SingleValue.default, {
      "data-test": "outlierCount",
      type: "warning",
      value: outlierCount
    }))))), /*#__PURE__*/_react.default.createElement(_Controls.FlexWrapper, null, showChartTypeToggle && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Controls.FlexControlGroup, {
      label: (0, _i18n.gettext)('Chart Type'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_ChartType.default, {
      isTimeView: isTimeView,
      onChange: handleChartTypeChange
    })), /*#__PURE__*/_react.default.createElement(_Controls.StyledDivider, null)), hasSplitBy && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, mode === 'auto' ? /*#__PURE__*/_react.default.createElement(_Automatic.default, {
      dispatch: dispatch,
      distributions: autoDistributions,
      isSplitView: isSplitView,
      numberOfDistributions: numberOfDistributions,
      selectedDistributions: selectedAutoDistributions
    }) : /*#__PURE__*/_react.default.createElement(_Manual.default, {
      dispatch: dispatch,
      isSplitView: isSplitView,
      isTimeView: isTimeView,
      manualFields: manualFields,
      selectedManualFieldValues: selectedManualFieldValues
    }), !isTimeView && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Controls.StyledDivider, null), /*#__PURE__*/_react.default.createElement(_Controls.FlexControlGroup, {
      label: (0, _i18n.gettext)('Chart Mode'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_SplitChartOptions.default, {
      compact: true,
      isSplitView: isSplitView,
      onSplitViewChange: handleSplitChange
    }))))));
  };
  Controls.propTypes = propTypes;
  Controls.defaultProps = defaultProps;
  var _default = _exports.default = Controls;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Controls.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes, _ColumnLayout, _ControlGroup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledDivider = _exports.PaddedColumnLayout = _exports.FlexWrapper = _exports.FlexControlGroup = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var PaddedColumnLayout = _exports.PaddedColumnLayout = (0, _styledComponents.default)(_ColumnLayout.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 10px 20px 0;\n    border-bottom: 1px solid ", ";\n"])), (0, _themes.variable)('borderLightColor'));
  var FlexWrapper = _exports.FlexWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n    padding: 0 20px;\n"])));
  var FlexControlGroup = _exports.FlexControlGroup = (0, _styledComponents.default)(_ControlGroup.default)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    flex: ", ";\n    margin: 4px 10px 10px;\n    /* needed to avoid overflow issues in IE11 */\n    width: ", ";\n\n    &:first-child {\n        margin-left: 0;\n    }\n\n    &:last-child {\n        margin-right: 0;\n    }\n\n    /* prevent the labels from overflowing with long field names */\n    > [data-test='label'] {\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n"])), function (props) {
    return props.collapse ? '1 1 auto' : '0 0 auto';
  }, function (props) {
    return props.collapse ? '100%' : 'auto';
  });
  var StyledDivider = _exports.StyledDivider = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    border-left: ", " 1px solid;\n    flex: 0 0 auto;\n    align-self: stretch;\n    margin: 10px 0;\n\n    /*\n    the divider is used to separate components that may return null depending on their props\n    so hide it when it's the last child because that means that the component that was after it returned null\n     */\n    &:last-child {\n        display: none;\n    }\n"])), (0, _themes.variable)('borderLightColor'));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Manual/Manual.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.object.values.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/SelectDistributions/SelectDistributions.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Controls.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Manual/Manual.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFilter, _esArrayMap, _esFunctionName, _esObjectToString, _esObjectValues, _react, _propTypes, _ColumnLayout, _constants, _util, _SelectDistributions, _Controls, _Manual) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _SelectDistributions = _interopRequireDefault(_SelectDistributions);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var propTypes = {
    dispatch: _propTypes.default.func.isRequired,
    isTimeView: _propTypes.default.bool,
    /**
     * An array of the available fields, their values, and the number of outliners for each field
     */
    manualFields: _propTypes.default.arrayOf(_propTypes.default.shape({
      name: _propTypes.default.string.isRequired,
      value: _propTypes.default.arrayOf(_propTypes.default.shape({
        outlierCount: _propTypes.default.number,
        key: _propTypes.default.shape({
          /* <field_name>: <field_value> */
        })
      })).isRequired
    })).isRequired,
    /**
     * The selected field values, as a map from field name to an array of field values
     */
    selectedManualFieldValues: _propTypes.default.objectOf(_propTypes.default.array)
  };
  var defaultProps = {
    isTimeView: false,
    selectedManualFieldValues: {}
  };
  var Manual = function Manual(_ref) {
    var dispatch = _ref.dispatch,
      isTimeView = _ref.isTimeView,
      manualFields = _ref.manualFields,
      selectedManualFieldValues = _ref.selectedManualFieldValues;
    var handleMenuSelect = function handleMenuSelect(key) {
      dispatch({
        type: _constants.TOGGLE_MANUAL_FIELD_VALUE,
        payload: key
      });
    };
    var handleSelect = function handleSelect(key) {
      return function (fieldValues) {
        dispatch({
          type: _constants.SET_SELECTED_MANUAL_FIELD_VALUES,
          payload: {
            key: key,
            // fieldValues has key and value pairs, we just want value
            value: fieldValues.map(function (fieldValue) {
              return Object.values(fieldValue)[0];
            })
          }
        });
      };
    };
    var filteredManualFields = manualFields.filter(function (_ref2) {
      var name = _ref2.name;
      return !isTimeView || isTimeView && !(0, _util.isTimeField)(name);
    });
    var span = 12 / Math.max(filteredManualFields.length, 1);
    return filteredManualFields.length > 0 ? /*#__PURE__*/_react.default.createElement(_Manual.GrowingColumnLayout, {
      gutter: 10
    }, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, null, filteredManualFields.map(function (_ref3) {
      var name = _ref3.name,
        value = _ref3.value;
      return /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
        key: name,
        span: span
      }, /*#__PURE__*/_react.default.createElement(_Controls.FlexControlGroup, {
        label: name,
        labelPosition: "top"
      }, /*#__PURE__*/_react.default.createElement(_SelectDistributions.default, {
        distributions: value,
        onMenuSelect: handleMenuSelect,
        onSelect: handleSelect(name),
        selectedDistributions: (selectedManualFieldValues[name] || []).map(function (distribution) {
          return _defineProperty({}, name, distribution);
        })
      })));
    }))) : null;
  };
  Manual.propTypes = propTypes;
  Manual.defaultProps = defaultProps;
  var _default = _exports.default = Manual;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Manual/Manual.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _ColumnLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GrowingColumnLayout = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var GrowingColumnLayout = _exports.GrowingColumnLayout = (0, _styledComponents.default)(_ColumnLayout.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    flex-grow: 1;\n    margin: 0 10px;\n\n    &:first-child {\n        margin-left: 0;\n    }\n\n    &:last-child {\n        margin-right: 0;\n    }\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Mode/Mode.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/RadioBar.js"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _RadioBar, _ControlGroup, _i18n, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _RadioBar = _interopRequireDefault(_RadioBar);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  var propTypes = {
    dispatch: _propTypes.default.func.isRequired,
    value: _propTypes.default.string.isRequired
  };
  var Mode = /*#__PURE__*/(0, _react.memo)(function (_ref) {
    var dispatch = _ref.dispatch,
      value = _ref.value;
    var handleModeChange = function handleModeChange(e, _ref2) {
      var newValue = _ref2.value;
      return dispatch({
        type: _constants.SET_MODE,
        payload: newValue
      });
    };
    return /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      controlsLayout: "none",
      label: (0, _i18n.gettext)('Mode'),
      labelPosition: "top",
      tooltip: (0, _i18n.gettext)('Select automatic or manual distribution mode.')
    }, /*#__PURE__*/_react.default.createElement(_RadioBar.default, {
      onChange: handleModeChange,
      value: value
    }, /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
      label: (0, _i18n.gettext)('Automatic'),
      value: "auto"
    }), /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
      label: (0, _i18n.gettext)('Manual'),
      value: "manual"
    })));
  });
  Mode.propTypes = propTypes;
  var _default = _exports.default = Mode;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/SelectDistributions/SelectDistributions.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.flat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.unscopables.flat.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/ClickableText/ClickableText.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/context/scrollContainerContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/SelectDistributions/SelectDistributions.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayFlat, _esArrayIncludes, _esArrayJoin, _esArrayMap, _esArrayUnscopablesFlat, _esObjectToString, _esRegexpToString, _esStringIncludes, _react, _propTypes, _swcMltk, _i18n, _Dropdown, _Menu, _ClickableText, _scrollContainerContext, _util, _SelectDistributions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _ClickableText = _interopRequireDefault(_ClickableText);
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
  var propTypes = {
    distributions: _propTypes.default.arrayOf(_propTypes.default.shape({
      outlierCount: _propTypes.default.number,
      key: _propTypes.default.shape({})
    })).isRequired,
    /**
     * Called to set which items are selected with an array of objects in the form of { <field_name>: <value> }
     */
    onSelect: _propTypes.default.func.isRequired,
    /**
     * Called to toggle object selection with an object in the form of { <field_name>: <value> }
     */
    onMenuSelect: _propTypes.default.func.isRequired,
    /**
     * An array of objects in the form of { <field_name>: <value> }
     */
    selectedDistributions: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
  };
  var SelectDistributions = function SelectDistributions(_ref) {
    var distributions = _ref.distributions,
      onSelect = _ref.onSelect,
      onMenuSelect = _ref.onMenuSelect,
      selectedDistributions = _ref.selectedDistributions;
    var _useState = (0, _react.useState)(''),
      _useState2 = _slicedToArray(_useState, 2),
      filteredText = _useState2[0],
      setFilteredText = _useState2[1];
    var _useState3 = (0, _react.useState)(distributions),
      _useState4 = _slicedToArray(_useState3, 2),
      filteredDistributions = _useState4[0],
      setFilteredDistributions = _useState4[1];
    (0, _react.useEffect)(function () {
      var lowerFilteredText = filteredText.toLowerCase();
      setFilteredDistributions(distributions.filter(function (_ref2) {
        var outlierCount = _ref2.outlierCount,
          key = _ref2.key;
        var label = (0, _util.parseKeyToLabel)(key);
        return label.toLowerCase().includes(lowerFilteredText) || outlierCount.toString().includes(lowerFilteredText);
      }));
    }, [filteredText, distributions]);
    var handleTextChange = (0, _react.useCallback)(function (e, _ref3) {
      var value = _ref3.value;
      return setFilteredText(value);
    }, []);
    var totalOutlierCount = distributions.reduce(function (total, distribution) {
      return total + distribution.outlierCount;
    }, 0);
    var partitionArray = function partitionArray(items, check) {
      // move items satisfying the condition to the front of array
      return items.reduce(function (_ref4, item) {
        var _ref5 = _slicedToArray(_ref4, 2),
          passed = _ref5[0],
          failed = _ref5[1];
        return check(item) ? [[].concat(_toConsumableArray(passed), [item]), failed] : [passed, [].concat(_toConsumableArray(failed), [item])];
      }, [[], []]).flat();
    };
    return /*#__PURE__*/_react.default.createElement(_SelectDistributions.StyledDropdown, {
      closeReasons: _Dropdown.default.possibleCloseReasons.filter(function (reason) {
        return reason !== 'contentClick';
      }),
      scrollContainer: (0, _react.useContext)(_scrollContainerContext.ScrollContainerContext),
      toggle: /*#__PURE__*/_react.default.createElement(_SelectDistributions.StyledButton, {
        inline: true,
        isMenu: true,
        label: selectedDistributions.length > 0 ? selectedDistributions.map(_util.parseKeyToLabel).join(', ') : (0, _i18n.gettext)('Select...')
      })
    }, /*#__PURE__*/_react.default.createElement(_SelectDistributions.StyledMenu, {
      stopScrollPropagation: true
    }, partitionArray(filteredDistributions, function (_ref6) {
      var key = _ref6.key;
      return selectedDistributions.some(function (distribution) {
        return _swcMltk.lodash.isEqual(distribution, key);
      });
    }).map(function (_ref7) {
      var outlierCount = _ref7.outlierCount,
        key = _ref7.key;
      var label = (0, _util.parseKeyToLabel)(key);
      return /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        key: label,
        onClick: function onClick() {
          return onMenuSelect(key);
        },
        selectable: true
        // distributions are objects, in order to check deep equivalence to
        // know user selected this distribution, use lodash's isEqual
        ,
        selected: selectedDistributions.some(function (distribution) {
          return _swcMltk.lodash.isEqual(distribution, key);
        })
      }, /*#__PURE__*/_react.default.createElement(_SelectDistributions.StyledBarEntry, {
        label: label,
        progress: Math.floor(outlierCount / totalOutlierCount * 100),
        value: outlierCount
      }));
    })), /*#__PURE__*/_react.default.createElement(_SelectDistributions.ControlsWrapper, null, /*#__PURE__*/_react.default.createElement(_SelectDistributions.ClickableWrapper, null, /*#__PURE__*/_react.default.createElement(_ClickableText.default, {
      "data-test": "Select All",
      onClick: function onClick() {
        return onSelect(_swcMltk.lodash.unionWith(selectedDistributions, filteredDistributions.map(function (_ref8) {
          var key = _ref8.key;
          return key;
        }), _swcMltk.lodash.isEqual));
      },
      text: filteredText !== '' ? (0, _i18n.gettext)('Select All Matches') : (0, _i18n.gettext)('Select All')
    }), /*#__PURE__*/_react.default.createElement(_ClickableText.default, {
      "data-test": "Clear All",
      onClick: function onClick() {
        onSelect(_swcMltk.lodash.differenceWith(selectedDistributions, filteredDistributions.map(function (_ref9) {
          var key = _ref9.key;
          return key;
        }), _swcMltk.lodash.isEqual));
      },
      text: filteredText !== '' ? (0, _i18n.gettext)('Clear All Matches') : (0, _i18n.gettext)('Clear All')
    })), /*#__PURE__*/_react.default.createElement(_SelectDistributions.StyledText, {
      appearance: "search",
      onChange: handleTextChange,
      placeholder: (0, _i18n.gettext)('filter'),
      value: filteredText
    })));
  };
  SelectDistributions.propTypes = propTypes;
  var _default = _exports.default = SelectDistributions;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/SelectDistributions/SelectDistributions.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/BarEntry/BarEntry.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Menu, _Text, _Dropdown, _Button, _themes, _BarEntry) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledText = _exports.StyledMenu = _exports.StyledDropdown = _exports.StyledButton = _exports.StyledBarEntry = _exports.ControlsWrapper = _exports.ClickableWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Menu = _interopRequireDefault(_Menu);
  _Text = _interopRequireDefault(_Text);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Button = _interopRequireDefault(_Button);
  _BarEntry = _interopRequireDefault(_BarEntry);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledMenu = _exports.StyledMenu = (0, _styledComponents.default)(_Menu.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    overflow-y: auto;\n    max-height: 15em;\n    max-width: 280px; /* width as per UX guidance */\n"])));
  var ControlsWrapper = _exports.ControlsWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    border-top: 1px solid ", ";\n    /* override bootstrap */\n    margin-bottom: 0 !important;\n"])), (0, _themes.variable)('gray80'));
  var ClickableWrapper = _exports.ClickableWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    margin: 1em;\n    display: flex;\n    justify-content: flex-start;\n    & > * {\n        margin: auto 1em auto 0;\n    }\n"])));
  var StyledText = _exports.StyledText = (0, _styledComponents.default)(_Text.default)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    margin: 0.5em;\n"])));
  var StyledBarEntry = _exports.StyledBarEntry = (0, _styledComponents.default)(_BarEntry.default)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    display: inline-block;\n"])));
  var StyledDropdown = _exports.StyledDropdown = (0, _styledComponents.default)(_Dropdown.default)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    width: 100%;\n"])));
  var StyledButton = _exports.StyledButton = (0, _styledComponents.default)(_Button.default)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    /* Fixes ie11 width when using flex shrink */\n    &[data-inline] {\n        width: 100%;\n    }\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Threshold/Threshold.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ml/SliderNumber.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Threshold/Threshold.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _SliderNumber, _util, _constants, _Threshold) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _SliderNumber = _interopRequireDefault(_SliderNumber);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var propTypes = {
    experiment: _propTypes.default.shape({
      changePostprocessingStage: _propTypes.default.func.isRequired,
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired,
        searchStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
      }),
      getSPL: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired
    }).isRequired,
    thresholdKey: _propTypes.default.string.isRequired,
    thresholdSchema: _propTypes.default.shape({
      maximum: _propTypes.default.any,
      minimum: _propTypes.default.any
    }).isRequired
  };
  var Threshold = function Threshold(_ref) {
    var experiment = _ref.experiment,
      thresholdKey = _ref.thresholdKey,
      thresholdSchema = _ref.thresholdSchema;
    var applyStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.DF_APPLY_STAGE_ID);

    // hold the state of the slider until the user applies it
    var _useState = (0, _react.useState)(applyStage.algorithmParams[thresholdKey]),
      _useState2 = _slicedToArray(_useState, 2),
      threshold = _useState2[0],
      setThreshold = _useState2[1];
    var disabled = (0, _util.isStageRunning)(applyStage);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_SliderNumber.default, {
      disabled: disabled,
      max: thresholdSchema.maximum,
      min: thresholdSchema.minimum,
      name: thresholdKey,
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        return setThreshold(value);
      },
      scale: "log",
      value: threshold
    }), /*#__PURE__*/_react.default.createElement(_Threshold.ApplyButton, {
      disabled: disabled,
      inline: true,
      label: (0, _i18n.gettext)('Apply'),
      onClick: function onClick() {
        // update the threshold
        experiment.changePostprocessingStage(_constants.DF_APPLY_STAGE_ID, _objectSpread(_objectSpread({}, applyStage), {}, {
          algorithmParams: _objectSpread(_objectSpread({}, applyStage.algorithmParams), {}, _defineProperty({}, thresholdKey, threshold))
        }));

        // run the postprocessing stage, using full SPL
        // to avoid the 500000 results limit inherent in loadjob
        experiment.runPostprocessingStage(_constants.DF_APPLY_STAGE_ID, {
          inputSPL: experiment.getSPL({
            excludeMainStage: true
          })
        });
      }
    }));
  };
  Threshold.propTypes = propTypes;
  var _default = _exports.default = Threshold;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Threshold/Threshold.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Button) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ApplyButton = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Button = _interopRequireDefault(_Button);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var ApplyButton = _exports.ApplyButton = (0, _styledComponents.default)(_Button.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    flex: 0 1 auto;\n    margin-left: 10px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/TopDistributions.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/context/scrollContainerContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _i18n, _format, _Select, _scrollContainerContext, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Select = _interopRequireDefault(_Select);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  var topOutliersLabel = function topOutliersLabel(value) {
    return (0, _format.sprintf)((0, _i18n.gettext)('Top %s groups with most outliers'), value);
  };
  var topOutliersValues = [3, 5, 10];
  var propTypes = {
    numberOfDistributions: _propTypes.default.number.isRequired,
    dispatch: _propTypes.default.func.isRequired
  };
  var defaultProps = {};

  // prevent component re-render if the props don't changes
  // does a shallow comparison
  var TopDistributions = /*#__PURE__*/(0, _react.memo)(function (_ref) {
    var dispatch = _ref.dispatch,
      numberOfDistributions = _ref.numberOfDistributions;
    return /*#__PURE__*/_react.default.createElement(_Select.default, {
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        return dispatch({
          type: _constants.SET_NUMBER_OF_DISTRIBUTIONS,
          payload: value
        });
      },
      scrollContainer: (0, _react.useContext)(_scrollContainerContext.ScrollContainerContext),
      value: numberOfDistributions
    }, topOutliersValues.map(function (value) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: value,
        label: topOutliersLabel(value),
        value: value
      });
    }));
  });
  TopDistributions.propTypes = propTypes;
  TopDistributions.defaultProps = defaultProps;
  var _default = _exports.default = TopDistributions;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/EvaluateTab.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/DistributionVizWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/Controls/Controls.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/useControlsReducer.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/util/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _util, _DistributionVizWrapper, _Controls, _useControlsReducer2, _constants, _StageStatusWrapper, _constants2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _DistributionVizWrapper = _interopRequireDefault(_DistributionVizWrapper);
  _Controls = _interopRequireDefault(_Controls);
  _useControlsReducer2 = _interopRequireDefault(_useControlsReducer2);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var DEFAULT_MODE = 'auto';
  var defaultInitialState = {
    autoDistributions: [],
    isSplitView: false,
    isTimeView: false,
    manualFields: [],
    numberOfDistributions: 3,
    selectedAutoDistributions: [],
    selectedManualFieldValues: {},
    selectedManualDistributions: [],
    mode: DEFAULT_MODE
  };
  var resetAutoDistributions = function resetAutoDistributions(parsedData, dispatch, isTimeView, numberOfDistributions) {
    var _parsedData$combinedD = parsedData.combinedDistributions,
      combinedDistributions = _parsedData$combinedD === void 0 ? {} : _parsedData$combinedD,
      _parsedData$combinedD2 = parsedData.combinedDistributionsMergedTime,
      combinedDistributionsMergedTime = _parsedData$combinedD2 === void 0 ? {} : _parsedData$combinedD2;
    dispatch({
      type: _constants.RESET_AUTO_DISTRIBUTIONS,
      payload: {
        combinedDistributions: isTimeView ? combinedDistributionsMergedTime : combinedDistributions,
        numberOfDistributions: numberOfDistributions
      }
    });
  };
  var resetManualFields = function resetManualFields(parsedData, dispatch) {
    var _parsedData$splitFiel = parsedData.splitFieldValues,
      splitFieldValues = _parsedData$splitFiel === void 0 ? [] : _parsedData$splitFiel;
    dispatch({
      type: _constants.RESET_MANUAL_FIELDS,
      payload: {
        splitFieldValues: splitFieldValues
      }
    });
  };
  var propTypes = {
    activeStage: _propTypes.default.shape({
      guid: _propTypes.default.string.isRequired,
      outputFields: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      searchManagerId: _propTypes.default.string.isRequired,
      type: _propTypes.default.string
    }).isRequired,
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
      })
    }).isRequired,
    /**
     * Used to pass in state for testing. Merged with the default state
     */
    initialState: _propTypes.default.shape({})
  };
  var defaultProps = {
    initialState: {}
  };
  var EvaluateTab = function EvaluateTab(_ref) {
    var activeStage = _ref.activeStage,
      experiment = _ref.experiment,
      initialState = _ref.initialState;
    var _useControlsReducer = (0, _useControlsReducer2.default)(_objectSpread(_objectSpread({}, defaultInitialState), initialState)),
      _useControlsReducer$s = _useControlsReducer.state,
      autoDistributions = _useControlsReducer$s.autoDistributions,
      isSplitView = _useControlsReducer$s.isSplitView,
      isTimeView = _useControlsReducer$s.isTimeView,
      manualFields = _useControlsReducer$s.manualFields,
      numberOfDistributions = _useControlsReducer$s.numberOfDistributions,
      selectedAutoDistributions = _useControlsReducer$s.selectedAutoDistributions,
      selectedManualDistributions = _useControlsReducer$s.selectedManualDistributions,
      selectedManualFieldValues = _useControlsReducer$s.selectedManualFieldValues,
      mode = _useControlsReducer$s.mode,
      dispatch = _useControlsReducer.dispatch;
    var _ref2 = activeStage || {},
      activeStageParsedData = _ref2.parsedData,
      stageType = _ref2.type;
    var _ref3 = activeStageParsedData || {},
      hasTimestamps = _ref3.hasTimestamps;
    var outlierAnalysisStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.OUTLIER_ANALYSIS_STAGE_ID);
    var _ref4 = outlierAnalysisStage || {},
      parsedData = _ref4.parsedData;
    var _ref5 = parsedData || {},
      outlierCount = _ref5.outlierCount;

    // update the autoDistributions when parsedData is done
    // OR the number of distributions has changed
    (0, _react.useEffect)(function () {
      if (parsedData != null) {
        resetAutoDistributions(parsedData, dispatch, isTimeView, numberOfDistributions);
      }
    }, [parsedData, dispatch, isTimeView, numberOfDistributions, stageType]);

    // update the split field values when parsedData is done
    // AND the data is from the fit stage
    (0, _react.useEffect)(function () {
      if (parsedData != null && stageType === _constants2.STAGE_TYPES.FIT) {
        resetManualFields(parsedData, dispatch);
      }
    }, [parsedData, dispatch, stageType]);

    // when stage is apply, we want to reset split field values only on mount
    // of this component, and not for mounts/unmounts of children components
    // autoDistributions should not be reset because the top outliers could change
    (0, _react.useEffect)(function () {
      if (stageType === _constants2.STAGE_TYPES.APPLY) {
        resetManualFields(parsedData, dispatch);
      }
      // We want this to only run on mount, so disable the eslint rule
      /* eslint-disable react-hooks/exhaustive-deps */
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    // in manual mode, switching between time and non-time view should not affect the selected fields
    // but will affect the selected distributions by re-calculating the available distributions
    // and ignoring time fields in time mode
    (0, _react.useEffect)(function () {
      dispatch({
        type: _constants.SET_SELECTED_MANUAL_DISTRIBUTIONS
      });
    }, [dispatch, isTimeView]);
    (0, _react.useEffect)(function () {
      if (parsedData != null && !hasTimestamps) {
        dispatch({
          type: _constants.SET_TIME_VIEW,
          payload: false
        });
      }
    }, [parsedData, hasTimestamps, dispatch]);
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: [activeStage, outlierAnalysisStage]
    }, /*#__PURE__*/_react.default.createElement(_Controls.default, {
      activeStage: activeStage,
      autoDistributions: autoDistributions,
      dispatch: dispatch,
      experiment: experiment,
      isSplitView: isSplitView,
      isTimeView: isTimeView,
      manualFields: manualFields,
      mode: mode,
      numberOfDistributions: numberOfDistributions,
      outlierCount: outlierCount,
      selectedAutoDistributions: selectedAutoDistributions,
      selectedManualFieldValues: selectedManualFieldValues,
      showChartTypeToggle: hasTimestamps
    }), /*#__PURE__*/_react.default.createElement(_DistributionVizWrapper.default, {
      distributions: mode === 'auto' ? selectedAutoDistributions : selectedManualDistributions,
      experiment: experiment,
      isSplitView: isSplitView,
      isTimeView: isTimeView,
      viewId: "evaluateDistributionViz",
      vizStage: activeStage
    }));
  };
  EvaluateTab.propTypes = propTypes;
  EvaluateTab.defaultProps = defaultProps;
  var _default = _exports.default = EvaluateTab;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/ExtractTime/ExtractTime.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.object.values.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/NewSearchTemplate.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomVizControls/CustomVizControls.jsx"), __webpack_require__("./src/main/webapp/components/shared/SPLModal/SPLModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/util.es"), __webpack_require__("./src/main/webapp/models/searchStage/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/ExtractTime/ExtractTime.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayConcat, _esArrayIncludes, _esArrayMap, _esDateToPrimitive, _esNumberConstructor, _esObjectToString, _esObjectValues, _esStringIncludes, _webDomCollectionsForEach, _react, _propTypes, _i18n, _swcMltk, _Card, _ColumnLayout, _constants, _NewSearchTemplate, _util, _CustomViz, _CustomVizControls, _SPLModal, _constants2, _util2, _constants3, _ExtractTime) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Card = _interopRequireDefault(_Card);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _NewSearchTemplate = _interopRequireDefault(_NewSearchTemplate);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _CustomVizControls = _interopRequireDefault(_CustomVizControls);
  _SPLModal = _interopRequireDefault(_SPLModal);
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
  var cardNames = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _constants2.TIME_HOUR_OF_DAY_STAGE_ID, (0, _i18n.gettext)('Hour of the day')), _constants2.TIME_DAY_OF_WEEK_STAGE_ID, (0, _i18n.gettext)('Day of the week')), _constants2.TIME_DAY_OF_MONTH_STAGE_ID, (0, _i18n.gettext)('Day of the month')), _constants2.TIME_MONTH_STAGE_ID, (0, _i18n.gettext)('Month of the year'));
  var vizOptions = {
    category: 'charting',
    'charting.legend.placement': 'none',
    'raw.drilldown': 'none',
    type: 'column'
  };
  var propTypes = {
    activeStage: _propTypes.default.shape({
      guid: _propTypes.default.string.isRequired,
      outputFields: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      sid: _propTypes.default.string.isRequired
    }).isRequired,
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({}))
      }),
      runPostprocessingStage: _propTypes.default.func.isRequired
    }).isRequired
  };
  var getDrilldownInfo = function getDrilldownInfo(_ref) {
    var activeStage = _ref.activeStage,
      experiment = _ref.experiment,
      vizStage = _ref.vizStage;
    var splOptions = {};
    splOptions.appendPostprocessingStageId = vizStage.id;
    splOptions.stopAtStageGuid = activeStage ? activeStage.guid : null;
    return experiment.getDrilldownInfo({
      splOptions: splOptions,
      vizOptions: vizOptions
    });
  };
  var ExtractTime = function ExtractTime(_ref2) {
    var activeStage = _ref2.activeStage,
      experiment = _ref2.experiment;
    var _useState = (0, _react.useState)({
        linkText: '',
        searchUrl: '',
        splCommentsArray: [],
        splArray: [],
        splModalOpen: false
      }),
      _useState2 = _slicedToArray(_useState, 2),
      drilldownInfo = _useState2[0],
      setDrilldownInfo = _useState2[1];
    var matchingTimeStageInfo = Object.values(_constants3.TIME_FIELD_NAMES).reduce(function (stageIds, timeField) {
      var stageId;
      if (activeStage.outputFields.includes(timeField)) {
        stageId = (0, _util2.getTimeStageFromField)(timeField);
      }
      return stageId != null ? stageIds.concat({
        field: timeField,
        stageId: stageId
      }) : stageIds;
    }, []);
    (0, _react.useEffect)(function () {
      matchingTimeStageInfo.forEach(function (_ref3) {
        var stageId = _ref3.stageId;
        return experiment.runPostprocessingStage(stageId, {
          afterStageGuid: activeStage.guid
        });
      });
      /*
       disable exhaustive deps here because we only want to re-run this
       if the active stage itself changes, and changes to experiment
       that matter will cause the activeStage to change anyways
       */

      /* eslint-disable react-hooks/exhaustive-deps */
    }, [activeStage.guid, activeStage.sid]);
    /* eslint-enable react-hooks/exhaustive-deps */

    var stagesByRow = [];

    // maps the stages into a grid
    matchingTimeStageInfo.forEach(function (stageInfo, i) {
      var rowNumber = Math.floor(i / 2);
      if (stagesByRow[rowNumber] == null) stagesByRow[rowNumber] = [];
      stagesByRow[rowNumber].push(stageInfo);
    });
    var handleMenuClick = function handleMenuClick(action, title, vizStage) {
      var splModalOpen = action === _constants.DRILLDOWN_ACTIONS.showSPL;
      setDrilldownInfo(_objectSpread(_objectSpread(_objectSpread({}, drilldownInfo), getDrilldownInfo({
        activeStage: activeStage,
        experiment: experiment,
        vizStage: vizStage
      })), {}, {
        linkText: title,
        splModalOpen: splModalOpen
      }));
      if (action === _constants.DRILLDOWN_ACTIONS.openInSearch) {
        var searchUrl = drilldownInfo.searchUrl;
        window.open(searchUrl, '_blank');
      }
    };
    return matchingTimeStageInfo.length > 0 ? /*#__PURE__*/_react.default.createElement(_ExtractTime.Wrapper, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default, {
      gutter: 10
    }, stagesByRow.map(function (stageRow) {
      return stageRow.length > 0 && /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, {
        key: JSON.stringify(stageRow)
      }, stageRow.map(function (_ref4) {
        var field = _ref4.field,
          stageId = _ref4.stageId;
        var vizStage = (0, _util.getStageById)(experiment.data.postprocessingStages, stageId) || {};
        var title = cardNames[stageId] != null ? cardNames[stageId] : field;
        return /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
          key: field,
          span: 12 / stageRow.length
        }, /*#__PURE__*/_react.default.createElement(_ExtractTime.FullWidthCard, null, /*#__PURE__*/_react.default.createElement(_Card.default.Header, null, /*#__PURE__*/_react.default.createElement(_CustomVizControls.default, {
          compact: true,
          controlsSchema: {
            properties: {}
          },
          onMenuClick: function onMenuClick(action) {
            return handleMenuClick(action, title, vizStage);
          },
          title: title
        })), /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
          managerId: vizStage.searchManagerId,
          options: vizOptions,
          viewId: "".concat(stageId, "Viz"),
          vizConstructor: _swcMltk.ChartView
        }))));
      }));
    })), /*#__PURE__*/_react.default.createElement(_SPLModal.default, {
      linkText: drilldownInfo.linkText,
      modalComments: drilldownInfo.splCommentsArray,
      modalSPL: drilldownInfo.splArray,
      modalUrl: drilldownInfo.searchUrl,
      onRequestClose: function onRequestClose() {
        setDrilldownInfo(_objectSpread(_objectSpread({}, drilldownInfo), {}, {
          splModalOpen: false
        }));
      },
      open: drilldownInfo.splModalOpen
    })) : /*#__PURE__*/_react.default.createElement(_NewSearchTemplate.default, {
      message: (0, _i18n.gettext)('No time fields could be extracted from your data.')
    });
  };
  ExtractTime.propTypes = propTypes;
  var _default = _exports.default = ExtractTime;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/ExtractTime/ExtractTime.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Card) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Wrapper = _exports.FullWidthCard = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Card = _interopRequireDefault(_Card);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var FullWidthCard = _exports.FullWidthCard = (0, _styledComponents.default)(_Card.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    width: 100%;\n"])));
  var Wrapper = _exports.Wrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    padding: 10px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/useControlsReducer.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/util.es"), __webpack_require__("./src/main/webapp/components/shared/fpUtil.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayMap, _esObjectEntries, _esObjectToString, _esRegexpToString, _react, _swcMltk, _constants, _util, _fpUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.toggleArrayEntry = _exports.reducer = _exports.default = void 0;
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  var defaultAction = function defaultAction(state, action) {
    console.error("No action defined for ".concat(action.type));
    return state;
  };

  // Does deep comparisons by value for entries in an array (objects & arrays)
  var toggleArrayEntry = _exports.toggleArrayEntry = function toggleArrayEntry() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var payload = arguments.length > 1 ? arguments[1] : undefined;
    return array.some(function (entry) {
      return _swcMltk.lodash.isEqual(entry, payload);
    }) ? array.filter(function (distribution) {
      return !_swcMltk.lodash.isEqual(distribution, payload);
    }) : [].concat(_toConsumableArray(array), [payload]);
  };
  var setSelectedManualDistributions = function setSelectedManualDistributions(state) {
    var isTimeView = state.isTimeView,
      selectedManualFieldValues = state.selectedManualFieldValues;
    var fieldValuesEntries = Object.entries(selectedManualFieldValues);

    // in time mode, distributions are formed out of only the non-time fields
    // because each distribution includes all possible times
    if (isTimeView) fieldValuesEntries = fieldValuesEntries.filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        key = _ref2[0];
      return !(0, _util.isTimeField)(key);
    });

    // format data to supply to cartesianProductObj
    var formattedData = fieldValuesEntries.map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];
      return _defineProperty({}, key, value);
    });
    return _objectSpread(_objectSpread({}, state), {}, {
      selectedManualDistributions: (0, _fpUtil.cartesianProductObj)(formattedData)
    });
  };
  var toggleManualFieldValue = function toggleManualFieldValue(state, action) {
    var payload = action.payload;
    var _Object$entries = Object.entries(payload),
      _Object$entries2 = _slicedToArray(_Object$entries, 1),
      _Object$entries2$ = _slicedToArray(_Object$entries2[0], 2),
      targetKey = _Object$entries2$[0],
      targetValue = _Object$entries2$[1];
    return _objectSpread(_objectSpread({}, state), {}, {
      selectedManualFieldValues: _objectSpread(_objectSpread({}, state.selectedManualFieldValues), {}, _defineProperty({}, targetKey, toggleArrayEntry(state.selectedManualFieldValues[targetKey], targetValue.toString())))
    });
  };
  var setSelectedManualFieldValues = function setSelectedManualFieldValues(state, action) {
    var _action$payload = action.payload,
      key = _action$payload.key,
      value = _action$payload.value;
    return _objectSpread(_objectSpread({}, state), {}, {
      selectedManualFieldValues: _objectSpread(_objectSpread({}, state.selectedManualFieldValues), {}, _defineProperty({}, key, value))
    });
  };

  // exporting only for testing
  var _reducer = _exports.reducer = function reducer(state, action) {
    switch (action.type) {
      case _constants.SET_SPLIT_VIEW:
        return _objectSpread(_objectSpread({}, state), {}, {
          isSplitView: action.payload
        });
      case _constants.SET_TIME_VIEW:
        return _objectSpread(_objectSpread({}, state), {}, {
          isTimeView: action.payload
        });
      case _constants.SET_NUMBER_OF_DISTRIBUTIONS:
        return _objectSpread(_objectSpread({}, state), {}, {
          numberOfDistributions: action.payload
        });
      case _constants.TOGGLE_AUTO_DISTRIBUTION:
        return _objectSpread(_objectSpread({}, state), {}, {
          selectedAutoDistributions: toggleArrayEntry(state.selectedAutoDistributions, action.payload)
        });
      case _constants.SET_SELECTED_AUTO_DISTRIBUTIONS:
        return _objectSpread(_objectSpread({}, state), {}, {
          selectedAutoDistributions: action.payload
        });
      case _constants.RESET_AUTO_DISTRIBUTIONS:
        {
          var _action$payload2 = action.payload,
            _action$payload2$comb = _action$payload2.combinedDistributions,
            combinedDistributions = _action$payload2$comb === void 0 ? {} : _action$payload2$comb,
            numberOfDistributions = _action$payload2.numberOfDistributions;
          var autoDistributions = (0, _util.sortDistributionsByOutliersValuesCompact)(combinedDistributions, numberOfDistributions);
          return _objectSpread(_objectSpread({}, state), {}, {
            autoDistributions: autoDistributions,
            selectedAutoDistributions: autoDistributions.map(function (autoDist) {
              return autoDist.key;
            })
          });
        }
      case _constants.RESET_MANUAL_FIELDS:
        {
          var splitFieldValues = action.payload.splitFieldValues;
          var newState = _objectSpread(_objectSpread({}, state), {}, {
            manualFields: splitFieldValues.map(function (v) {
              return {
                name: v.key,
                value: (0, _util.sortDistributionsByOutliersValuesCompact)(v.value)
              };
            }),
            selectedManualFieldValues: splitFieldValues.reduce(function (acc, _ref6) {
              var key = _ref6.key;
              return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, []));
            }, {})
          });
          return _reducer(newState, {
            type: _constants.SET_SELECTED_MANUAL_DISTRIBUTIONS
          });
        }
      case _constants.TOGGLE_MANUAL_FIELD_VALUE:
        {
          var _newState = toggleManualFieldValue(state, action);
          return _reducer(_newState, {
            type: _constants.SET_SELECTED_MANUAL_DISTRIBUTIONS
          });
        }
      case _constants.SET_MODE:
        return _objectSpread(_objectSpread({}, state), {}, {
          mode: action.payload
        });
      case _constants.SET_SELECTED_MANUAL_FIELD_VALUES:
        {
          var _newState2 = setSelectedManualFieldValues(state, action);
          return _reducer(_newState2, {
            type: _constants.SET_SELECTED_MANUAL_DISTRIBUTIONS
          });
        }
      case _constants.SET_SELECTED_MANUAL_DISTRIBUTIONS:
        return setSelectedManualDistributions(state, action);
      default:
        return defaultAction(state, action);
    }
  };
  var _default = _exports.default = function _default() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _useReducer = (0, _react.useReducer)(_reducer, initialState),
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

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/Learn.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/context/assistant.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/LearnContainer/LearnContainer.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/SearchStage/DensityFunction/DensityFunction.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/SearchStage/ExtractTime/ExtractTime.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/UpdateThresholdModal/UpdateThresholdModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/ExtractTime/ExtractTime.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/EvaluateTab/EvaluateTab.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _util, _constants, _assistant, _LearnContainer, _DensityFunction, _ExtractTime, _constants2, _UpdateThresholdModal, _ExtractTime2, _EvaluateTab) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _LearnContainer = _interopRequireDefault(_LearnContainer);
  _DensityFunction = _interopRequireDefault(_DensityFunction);
  _ExtractTime = _interopRequireDefault(_ExtractTime);
  _UpdateThresholdModal = _interopRequireDefault(_UpdateThresholdModal);
  _ExtractTime2 = _interopRequireDefault(_ExtractTime2);
  _EvaluateTab = _interopRequireDefault(_EvaluateTab);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var thresholdKey = 'threshold';
  var propTypes = {
    assistantContext: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape({
      nextStepId: _propTypes.default.string,
      openModals: _propTypes.default.array.isRequired
    }), _propTypes.default.func])).isRequired,
    experiment: _propTypes.default.shape({
      changePostprocessingStage: _propTypes.default.func.isRequired,
      changeSearchStage: _propTypes.default.func.isRequired,
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.array.isRequired,
        searchStages: _propTypes.default.array.isRequired
      }),
      getMainStage: _propTypes.default.func.isRequired,
      onMainStageComplete: _propTypes.default.func.isRequired,
      runAllSearchStages: _propTypes.default.any
    }).isRequired
  };
  var getStageRenderers = function getStageRenderers(stage) {
    if ((0, _util.checkStageState)(stage, {
      role: _constants.STAGE_ROLES.MAIN
    })) {
      return {
        render: function render(params) {
          return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DensityFunction.default, params));
        },
        submitText: (0, _i18n.gettext)('Detect Outliers'),
        title: (0, _i18n.gettext)('Detect Outliers')
      };
    } else if ((0, _util.checkStageState)(stage, {
      type: _constants.STAGE_TYPES.EXTRACTTIME
    })) {
      return {
        render: function render(params) {
          return /*#__PURE__*/_react.default.createElement(_ExtractTime.default, params);
        },
        submitText: (0, _i18n.gettext)('Extract')
      };
    }
    return null;
  };
  var stageAddTypes = [{
    label: (0, _i18n.gettext)('Extract time'),
    data: {
      type: _constants.STAGE_TYPES.EXTRACTTIME
    }
  }];
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
          var applyStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.DF_APPLY_STAGE_ID);

          // switch between the Fit and Apply stages depending on
          // whether or not the Apply stage has been run
          var evaluateStage = applyStage.status !== _constants.STAGE_STATUSES.NEW ? applyStage : activeStage;
          return /*#__PURE__*/_react.default.createElement(_EvaluateTab.default, {
            activeStage: evaluateStage,
            experiment: experiment
          });
        },
        /* eslint-enable react/prop-types */getPostprocessingStageId: function getPostprocessingStageId() {
          return null;
        },
        label: (0, _i18n.gettext)('Evaluate'),
        useDefaultRenderer: false
      };
    } else if ((0, _util.checkStageState)(stage, {
      role: _constants.STAGE_ROLES.PREPROCESSING,
      status: _constants.STAGE_STATUSES.DATA
    })) {
      return {
        /* eslint-disable react/prop-types */render: function render(_ref3) {
          var experiment = _ref3.experiment,
            previousStage = _ref3.previousStage,
            activeStage = _ref3.activeStage;
          return /*#__PURE__*/_react.default.createElement(_ExtractTime2.default, {
            activeStage: activeStage,
            experiment: experiment
          });
        },
        /* eslint-enable react/prop-types */
        useDefaultRenderer: false
      };
    } else {
      return {
        useDefaultRenderer: true
      };
    }
  };
  var Learn = function Learn(props) {
    var assistantContext = props.assistantContext,
      experiment = props.experiment;
    var _assistantContext = _slicedToArray(assistantContext, 2),
      _assistantContext$ = _assistantContext[0],
      openModals = _assistantContext$.openModals,
      nextStepId = _assistantContext$.nextStepId,
      dispatch = _assistantContext[1];
    var fitStage = experiment.getMainStage();
    var applyStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants2.DF_APPLY_STAGE_ID);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_LearnContainer.default, _extends({}, props, {
      getCustomEvaluateRendererInfo: getCustomEvaluateRendererInfo,
      getStageRenderers: getStageRenderers,
      stageAddTypes: stageAddTypes
    })), /*#__PURE__*/_react.default.createElement(_UpdateThresholdModal.default, {
      fitStage: fitStage,
      onRequestClose: function onRequestClose() {
        dispatch({
          type: _assistant.ASSISTANT_ACTIONS.SET_MODAL_CLOSED,
          payload: _constants2.THRESHOLD_MODAL_ID
        });
      },
      onRequestKeep: function onRequestKeep() {
        experiment.changePostprocessingStage(_constants2.DF_APPLY_STAGE_ID, _objectSpread(_objectSpread({}, applyStage), {}, {
          algorithmParams: _objectSpread(_objectSpread({}, applyStage.algorithmParams), {}, _defineProperty({}, thresholdKey, fitStage.algorithmParams[thresholdKey]))
        }));
        dispatch({
          type: _assistant.ASSISTANT_ACTIONS.SET_MODAL_CLOSED,
          payload: _constants2.THRESHOLD_MODAL_ID
        });

        // proceed to the state the user was trying to go to originally
        dispatch({
          type: _assistant.ASSISTANT_ACTIONS.SET_STEP,
          payload: {
            experiment: experiment,
            stepId: nextStepId
          }
        });

        // postprocessing stages can be modified by "apply" so we need to re-run them here
        // a future optimization would be detemining which ones were modified and only re-running those
        experiment.onMainStageComplete();
      },
      onRequestUpdate: function onRequestUpdate() {
        // update the threshold
        experiment.changeSearchStage(fitStage.guid, _objectSpread(_objectSpread({}, fitStage), {}, {
          algorithmParams: _objectSpread(_objectSpread({}, fitStage.algorithmParams), {}, _defineProperty({}, thresholdKey, applyStage.algorithmParams[thresholdKey]))
        }));

        // run the stage using runAllSearchStages() to get a Promise() API
        experiment.runAllSearchStages({
          from: experiment.data.searchStages.length - 1,
          to: experiment.data.searchStages.length,
          skipComplete: false
        }, {
          mode: 'draft'
        }).then(function () {
          dispatch({
            type: _assistant.ASSISTANT_ACTIONS.SET_MODAL_CLOSED,
            payload: _constants2.THRESHOLD_MODAL_ID
          });

          // proceed to the state the user was trying to go to originally
          dispatch({
            type: _assistant.ASSISTANT_ACTIONS.SET_STEP,
            payload: {
              experiment: experiment,
              stepId: nextStepId
            }
          });
          experiment.onMainStageComplete();
        });
        // error state is handled by UpdateThresholdModal
      },
      open: openModals.indexOf(_constants2.THRESHOLD_MODAL_ID) >= 0
    }));
  };
  Learn.propTypes = propTypes;
  var _default = _exports.default = Learn;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Learn/UpdateThresholdModal/UpdateThresholdModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/LoadingMessage/LoadingMessage.jsx"), __webpack_require__("./src/main/webapp/util/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _Button, _Message, _Modal, _util, _LoadingMessage, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
  _Message = _interopRequireDefault(_Message);
  _Modal = _interopRequireDefault(_Modal);
  _LoadingMessage = _interopRequireDefault(_LoadingMessage);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    fitStage: _propTypes.default.shape({
      error: _propTypes.default.string,
      status: _propTypes.default.string.isRequired
    }).isRequired,
    onRequestClose: _propTypes.default.func.isRequired,
    onRequestKeep: _propTypes.default.func.isRequired,
    onRequestUpdate: _propTypes.default.func.isRequired,
    open: _propTypes.default.bool
  };
  var defaultProps = {
    open: false
  };
  var UpdateThresholdModal = function UpdateThresholdModal(_ref) {
    var fitStage = _ref.fitStage,
      onRequestKeep = _ref.onRequestKeep,
      onRequestUpdate = _ref.onRequestUpdate,
      onRequestClose = _ref.onRequestClose,
      open = _ref.open;
    var bodyContent, footerContent;
    if (fitStage.status === _constants.STAGE_STATUSES.ERROR) {
      bodyContent = /*#__PURE__*/_react.default.createElement(_Message.default, {
        type: "error"
      }, (0, _i18n.gettext)('An error occurred while updating your threshold:'), " ", /*#__PURE__*/_react.default.createElement("br", null), fitStage.error);
    } else if ((0, _util.isStageRunning)(fitStage)) {
      bodyContent = /*#__PURE__*/_react.default.createElement(_LoadingMessage.default, {
        message: (0, _i18n.gettext)('Updating threshold...')
      });
    } else {
      bodyContent = /*#__PURE__*/_react.default.createElement("span", null, (0, _i18n.gettext)('Your threshold has been changed.'));
    }
    if (fitStage.status === _constants.STAGE_STATUSES.ERROR) {
      footerContent = /*#__PURE__*/_react.default.createElement(_Button.default, {
        "data-test": "cancel",
        label: (0, _i18n.gettext)('Close'),
        onClick: function onClick() {
          return onRequestClose();
        }
      });
    } else if ((0, _util.isStageRunning)(fitStage)) {
      footerContent = null;
    } else {
      footerContent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
        "data-test": "cancel",
        label: (0, _i18n.gettext)('Cancel'),
        onClick: function onClick() {
          return onRequestClose();
        }
      }), /*#__PURE__*/_react.default.createElement(_Button.default, {
        "data-test": "no",
        label: (0, _i18n.gettext)('Keep Original Threshold'),
        onClick: function onClick() {
          return onRequestKeep();
        }
      }), /*#__PURE__*/_react.default.createElement(_Button.default, {
        appearance: "primary",
        "data-test": "yes",
        label: (0, _i18n.gettext)('Update Threshold'),
        onClick: function onClick() {
          return onRequestUpdate();
        }
      }));
    }
    return /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: onRequestClose,
      open: open
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      title: (0, _i18n.gettext)('Update Threshold')
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, bodyContent), footerContent != null ? /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, footerContent) : null);
  };
  UpdateThresholdModal.propTypes = propTypes;
  UpdateThresholdModal.defaultProps = defaultProps;
  var _default = _exports.default = UpdateThresholdModal;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Operationalize.jsx":
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
  var title = (0, _i18n.gettext)('Operationalize Outlier Detection');
  var modelTitle = (0, _i18n.gettext)('Publish Outlier Models');
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

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Cardinality/Cardinality.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Cardinality/Cardinality.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Review.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _CustomViz, _i18n, _util, _constants, _Cardinality, _Review) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _CustomViz = _interopRequireDefault(_CustomViz);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  var Cardinality = function Cardinality(_ref) {
    var experiment = _ref.experiment;
    var cardinalityStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CARDINALITY_STAGE_ID);
    var managerId = cardinalityStage.searchManagerId;

    // No split-by's
    if (experiment.getMainStage().splitBy.length === 0) {
      return /*#__PURE__*/_react.default.createElement(_Review.StyledInfoMessage, {
        type: "info"
      }, (0, _i18n.gettext)("Cardinality histogram is only available if you've specified split by fields."));
    }
    return /*#__PURE__*/_react.default.createElement(_Cardinality.CardinalityWrapper, null, /*#__PURE__*/_react.default.createElement(_Review.StyledInfoMessage, {
      type: "info"
    }, (0, _i18n.gettext)('Fewer low cardinality values can indicate a more reliable model. You can change these results by increasing the amount of data in your search or by changing the split by fields in the Learn step.')), /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: managerId,
      namespacedOptions: {
        columnPadding: true
      },
      viewId: "reviewHistogramViz",
      vizType: "HistogramViz"
    }));
  };
  Cardinality.propTypes = propTypes;
  var _default = _exports.default = Cardinality;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Cardinality/Cardinality.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CardinalityWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var CardinalityWrapper = _exports.CardinalityWrapper = _styledComponents.default.section(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    border-top: 1px solid ", ";\n"])), (0, _themes.variable)('borderLightColor'));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/Card/Content.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/Card/Content.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _util, _constants, _StageStatusWrapper, _Content) {
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
  var DistributionPropertiesCard = function DistributionPropertiesCard(_ref) {
    var experiment = _ref.experiment;
    var meanStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.DISTRIBUTION_PROPERTIES_MEAN_STAGE_ID);
    if (!meanStage) {
      return null;
    }
    var parsedData = meanStage.parsedData;
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: meanStage
    }, /*#__PURE__*/_react.default.createElement(_Content.StyledMultiStatsPanel, {
      labelled: true,
      sort: true,
      value: parsedData
    }));
  };
  DistributionPropertiesCard.propTypes = propTypes;
  var _default = _exports.default = DistributionPropertiesCard;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/Card/Content.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/MultiStatsPanel/MultiStatsPanel.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _MultiStatsPanel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledMultiStatsPanel = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _MultiStatsPanel = _interopRequireDefault(_MultiStatsPanel);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledMultiStatsPanel = _exports.StyledMultiStatsPanel = (0, _styledComponents.default)(_MultiStatsPanel.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding-top: 12px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/DistributionProperties.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/CompactCard/CompactCard.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/DistributionProperties.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esArraySort, _esObjectKeys, _react, _propTypes, _util, _constants, _Card, _Message, _i18n, _format, _CustomViz, _StageStatusWrapper, _CompactCard, _Review, _DistributionProperties) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Card = _interopRequireDefault(_Card);
  _Message = _interopRequireDefault(_Message);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  var DistributionProperties = function DistributionProperties(_ref) {
    var experiment = _ref.experiment;
    // No split-by's
    if (experiment.getMainStage().splitBy.length === 0) {
      return /*#__PURE__*/_react.default.createElement(_Review.StyledInfoMessage, {
        type: "info"
      }, (0, _i18n.gettext)("Distribution properties are only available if you've specified split by fields."));
    }
    var meanStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.DISTRIBUTION_PROPERTIES_MEAN_STAGE_ID);
    var _ref2 = meanStage || {},
      meanManagerId = _ref2.searchManagerId,
      _ref2$parsedData = _ref2.parsedData,
      distributionCounts = _ref2$parsedData === void 0 ? {} : _ref2$parsedData;
    var distributionTypes = Object.keys(distributionCounts).sort();
    var stdStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.DISTRIBUTION_PROPERTIES_STD_STAGE_ID);
    var _ref3 = stdStage || {},
      stdManagerId = _ref3.searchManagerId;
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      noData: distributionTypes.length === 0,
      stage: meanStage
    }, /*#__PURE__*/_react.default.createElement(_DistributionProperties.StyledTabLayout, {
      defaultActivePanelId: distributionTypes[0]
    }, distributionTypes.map(function (distribution) {
      return /*#__PURE__*/_react.default.createElement(_DistributionProperties.StyledTabLayoutPanel, {
        key: distribution,
        label: distribution,
        panelId: distribution
      }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_DistributionProperties.StyledHeading, null, (0, _format.sprintf)((0, _i18n.gettext)('%s Distributions: %d'), distribution, distributionCounts[distribution])), /*#__PURE__*/_react.default.createElement(_Message.default, {
        type: "info"
      }, (0, _i18n.gettext)('View the histograms of means and standard deviations of the groups by their distribution type to understand the underlying statistical behavior at a higher level.'))), /*#__PURE__*/_react.default.createElement(_CompactCard.CompactCardLayout, null, /*#__PURE__*/_react.default.createElement(_CompactCard.CompactCard, null, /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
        managerId: meanManagerId,
        namespacedOptions: {
          filterFields: {
            type: [distribution]
          },
          title: {
            text: (0, _i18n.gettext)('Histogram of the Mean'),
            align: 'left',
            margin: 30
          },
          columnPadding: true
        },
        viewId: "".concat(distribution, "MeanHistogramViz"),
        vizType: "HistogramViz"
      }))), /*#__PURE__*/_react.default.createElement(_CompactCard.CompactCard, null, /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
        managerId: stdManagerId,
        namespacedOptions: {
          filterFields: {
            type: [distribution]
          },
          title: {
            text: (0, _i18n.gettext)('Histogram of Standard Deviation'),
            align: 'left',
            margin: 30
          },
          columnPadding: true
        },
        viewId: "".concat(distribution, "StdHistogramViz"),
        vizType: "HistogramViz"
      })))));
    })));
  };
  DistributionProperties.propTypes = propTypes;
  var _default = _exports.default = DistributionProperties;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/DistributionProperties.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js"), __webpack_require__("./node_modules/@splunk/react-ui/TabLayout.js"), __webpack_require__("./node_modules/@splunk/react-ui/Heading.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes, _TabLayout, _Heading) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledTabLayoutPanel = _exports.StyledTabLayout = _exports.StyledHeading = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _TabLayout = _interopRequireDefault(_TabLayout);
  _Heading = _interopRequireDefault(_Heading);
  var _templateObject, _templateObject2, _templateObject3;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledTabLayoutPanel = _exports.StyledTabLayoutPanel = (0, _styledComponents.default)(_TabLayout.default.Panel)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    background-color: ", ";\n    padding: 10px 20px;\n"])), (0, _themes.variable)('gray96'));
  var StyledHeading = _exports.StyledHeading = (0, _styledComponents.default)(_Heading.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: inline-block;\n    margin-top: 10px;\n"])));
  var StyledTabLayout = _exports.StyledTabLayout = (0, _styledComponents.default)(_TabLayout.default)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    margin-top: 0;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/ModelSummary/ModelSummary.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/shared/SearchTable/SearchTable.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/ModelSummary/ModelSummary.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _SearchTable, _util, _constants, _ModelSummary) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _SearchTable = _interopRequireDefault(_SearchTable);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  var ModelSummary = function ModelSummary(_ref) {
    var experiment = _ref.experiment;
    var modelSummaryStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.MODEL_SUMMARY_STAGE_ID);
    var managerId = modelSummaryStage.searchManagerId;
    return /*#__PURE__*/_react.default.createElement(_ModelSummary.SearchWrapper, null, /*#__PURE__*/_react.default.createElement(_SearchTable.default, {
      drilldownRedirect: false,
      managerId: managerId,
      perPage: true,
      showPager: true,
      viewId: "reviewModelSummary"
    }));
  };
  ModelSummary.propTypes = propTypes;
  var _default = _exports.default = ModelSummary;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/ModelSummary/ModelSummary.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SearchWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var SearchWrapper = _exports.SearchWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n    position: relative;\n    border-top: 1px solid ", ";\n"])), (0, _themes.variable)('borderLightColor'));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/Card/Content.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/Card/Content.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _util, _StageStatusWrapper, _constants, _Content) {
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
    var outlierAnalysisStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.OUTLIER_ANALYSIS_STAGE_ID);
    var _ref2 = outlierAnalysisStage.parsedData || {},
      outlierCount = _ref2.outlierCount;
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: outlierAnalysisStage
    }, /*#__PURE__*/_react.default.createElement(_Content.OutliersWrapper, null, /*#__PURE__*/_react.default.createElement(_Content.FlexSingleValue, {
      label: (0, _i18n.gettext)('Outliers'),
      type: "warning",
      value: outlierCount
    })));
  };
  Content.propTypes = propTypes;
  var _default = _exports.default = Content;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/Card/Content.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _SingleValue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.OutliersWrapper = _exports.FlexSingleValue = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _SingleValue = _interopRequireDefault(_SingleValue);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var OutliersWrapper = _exports.OutliersWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    padding-top: 12px;\n"])));
  var FlexSingleValue = _exports.FlexSingleValue = (0, _styledComponents.default)(_SingleValue.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    flex: 1 0 auto;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/OutlierAnalysis.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.object.values.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/BarPanel/BarPanel.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/CompactCard/CompactCard.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/OutlierAnalysis.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esArraySort, _esObjectValues, _react, _propTypes, _i18n, _Message, _constants, _util, _BarPanel, _StageStatusWrapper, _Review, _CompactCard, _OutlierAnalysis) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Message = _interopRequireDefault(_Message);
  _BarPanel = _interopRequireDefault(_BarPanel);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
  var OutlierAnalysis = function OutlierAnalysis(_ref) {
    var experiment = _ref.experiment;
    var outlierAnalysisStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.OUTLIER_ANALYSIS_STAGE_ID);
    var _ref2 = outlierAnalysisStage.parsedData || {},
      _ref2$splitFieldValue = _ref2.splitFieldValues,
      splitFieldValues = _ref2$splitFieldValue === void 0 ? [] : _ref2$splitFieldValue;

    /*
        example: splitFieldValues = [
            {
                key: 'dest_port',
                value: {
                    '{"dest_port":"p_0"}': {
                        fieldName: 'dest_port',
                        key: { dest_port: 'p_0' },
                        outlierCount: 34,
                    },
                },
            },
        ];
    */

    // No split-by's
    if (experiment.getMainStage().splitBy.length === 0) {
      return /*#__PURE__*/_react.default.createElement(_Review.StyledInfoMessage, {
        type: "info"
      }, (0, _i18n.gettext)("Outlier analysis is only available if you've specified split by fields."));
    }
    return /*#__PURE__*/_react.default.createElement(_OutlierAnalysis.OutlierAnalysisWrapper, null, /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: outlierAnalysisStage
    }, /*#__PURE__*/_react.default.createElement(_Message.default, {
      type: "info"
    }, (0, _i18n.gettext)('View outliers by any field selections made in the Split by fields section within Detect Outliers of the Learn step.')), /*#__PURE__*/_react.default.createElement(_CompactCard.CompactCardLayout, {
      cardWidth: 250
    }, splitFieldValues.map(function (_ref3) {
      var fieldName = _ref3.key,
        fieldValues = _ref3.value;
      /* entries: [
          ['user1outliers', 5],
          ['user2outliers', 3],
          ...
      ] */
      var entries = Object.values(fieldValues).map(function (_ref4) {
        var key = _ref4.key,
          outlierCount = _ref4.outlierCount;
        var fieldValue = key[fieldName];
        return [fieldValue, outlierCount];
      }).sort(function (_ref5, _ref6) {
        var _ref7 = _slicedToArray(_ref5, 2),
          outlierCount1 = _ref7[1];
        var _ref8 = _slicedToArray(_ref6, 2),
          outlierCount2 = _ref8[1];
        return outlierCount2 - outlierCount1;
      });
      return /*#__PURE__*/_react.default.createElement(_CompactCard.CompactCard, {
        key: fieldName,
        showBorder: false
      }, /*#__PURE__*/_react.default.createElement(_BarPanel.default, {
        entries: entries,
        label: fieldName
      }));
    }))));
  };
  OutlierAnalysis.propTypes = propTypes;
  var _default = _exports.default = OutlierAnalysis;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/OutlierAnalysis.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.OutlierAnalysisWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var OutlierAnalysisWrapper = _exports.OutlierAnalysisWrapper = _styledComponents.default.section(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    border-top: 1px solid ", ";\n    padding: 10px 20px;\n    display: flex;\n    flex-direction: column;\n    flex: 1 0 auto;\n"])), (0, _themes.variable)('borderLightColor'));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Review.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.reflect.construct.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/Wizard/WizardStep.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/Wizard/WizardStepTitleBar.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/constants.es"), __webpack_require__("./src/main/webapp/components/icons/Table.jsx"), __webpack_require__("./src/main/webapp/components/icons/Histogram.jsx"), __webpack_require__("./src/main/webapp/components/shared/RadioGroup/RadioGroup.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/ModelSummary/ModelSummary.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Cardinality/Cardinality.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/DistributionProperties.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/OutlierAnalysis.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/DistributionProperties/Card/Content.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/OutlierAnalysis/Card/Content.jsx"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Review.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _esObjectToString, _webDomCollectionsForEach, _react, _propTypes, _i18n, _Card, _Tooltip, _WizardStep, _WizardStepTitleBar, _constants, _Table, _Histogram, _RadioGroup, _ModelSummary, _Cardinality, _DistributionProperties, _OutlierAnalysis, _Content, _Content2, _constants2, _Review, _Review2) {
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
  _Table = _interopRequireDefault(_Table);
  _Histogram = _interopRequireDefault(_Histogram);
  _RadioGroup = _interopRequireDefault(_RadioGroup);
  _ModelSummary = _interopRequireDefault(_ModelSummary);
  _Cardinality = _interopRequireDefault(_Cardinality);
  _DistributionProperties = _interopRequireDefault(_DistributionProperties);
  _OutlierAnalysis = _interopRequireDefault(_OutlierAnalysis);
  _Content = _interopRequireDefault(_Content);
  _Content2 = _interopRequireDefault(_Content2);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
  var title = (0, _i18n.gettext)('Review Experiment');
  var modelSummaryTooltip = (0, _i18n.gettext)('View a summary of the model based on selections made in the Learn step.');
  var cardinalityTooltip = (0, _i18n.gettext)('View a histogram of groups by number of data points.');
  var distributionPropertiesTooltip = (0, _i18n.gettext)('View the histograms of means and standard deviations of the groups by their distribution type to understand the underlying statistical behavior at a higher level.');
  var outlierAnalysisTooltip = (0, _i18n.gettext)('View outliers by any field selections made in the split by section of the Learn step.');
  var contentMapper = function contentMapper(_ref) {
    var experiment = _ref.experiment;
    return _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _constants.MODEL_SUMMARY, /*#__PURE__*/_react.default.createElement(_ModelSummary.default, {
      experiment: experiment
    })), _constants.CARDINALITY, /*#__PURE__*/_react.default.createElement(_Cardinality.default, {
      experiment: experiment
    })), _constants.DISTRIBUTION_PROPERTIES, /*#__PURE__*/_react.default.createElement(_DistributionProperties.default, {
      experiment: experiment
    })), _constants.OUTLIER_ANALYSIS, /*#__PURE__*/_react.default.createElement(_OutlierAnalysis.default, {
      experiment: experiment
    }));
  };
  var Review = /*#__PURE__*/function (_Component) {
    function Review(props) {
      var _this;
      _classCallCheck(this, Review);
      _this = _callSuper(this, Review, [props]);
      _this.state = {
        content: _constants.MODEL_SUMMARY
      };
      // Populate card click handlers
      _this.handleCardClick = {};
      [_constants.MODEL_SUMMARY, _constants.CARDINALITY, _constants.DISTRIBUTION_PROPERTIES, _constants.OUTLIER_ANALYSIS].forEach(function (contentType) {
        _this.handleCardClick[contentType] = function () {
          return _this.setState({
            content: contentType
          });
        };
      });
      return _this;
    }
    _inherits(Review, _Component);
    return _createClass(Review, [{
      key: "render",
      value: function render() {
        var experiment = this.props.experiment;
        var content = this.state.content;
        return /*#__PURE__*/_react.default.createElement(_WizardStep.default, {
          bodyOverflow: "hidden",
          header: /*#__PURE__*/_react.default.createElement(_WizardStepTitleBar.default, {
            title: title
          })
        }, /*#__PURE__*/_react.default.createElement(_Review.FlexWrapper, null, /*#__PURE__*/_react.default.createElement(_Review.ReviewWrapper, null, /*#__PURE__*/_react.default.createElement(_Review.MainPanel, null, /*#__PURE__*/_react.default.createElement(_RadioGroup.default, null, /*#__PURE__*/_react.default.createElement(_Review.ReviewCardLayout, null, /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
          "data-test": _constants.MODEL_SUMMARY,
          defaultSelected: true,
          onClick: this.handleCardClick[_constants.MODEL_SUMMARY]
        }, /*#__PURE__*/_react.default.createElement(_Review2.StyledCardHeader, {
          subtitle: _constants2.UNICODE_NBSP /* empty subtitle for items alignment across cards */,
          title: (0, _i18n.gettext)('Model Summary')
        }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          content: modelSummaryTooltip
        })), /*#__PURE__*/_react.default.createElement(_Review2.StyledCardBody, null, /*#__PURE__*/_react.default.createElement(_Review.IconInCardWrapper, null, /*#__PURE__*/_react.default.createElement(_Table.default, {
          transform: "scale(1 0.75)"
        })))), /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
          "data-test": _constants.CARDINALITY,
          onClick: this.handleCardClick[_constants.CARDINALITY]
        }, /*#__PURE__*/_react.default.createElement(_Review2.StyledCardHeader, {
          subtitle: _constants2.UNICODE_NBSP /* empty subtitle for items alignment across cards */,
          title: (0, _i18n.gettext)('Cardinality Histogram')
        }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          content: cardinalityTooltip
        })), /*#__PURE__*/_react.default.createElement(_Review2.StyledCardBody, null, /*#__PURE__*/_react.default.createElement(_Review.IconInCardWrapper, null, /*#__PURE__*/_react.default.createElement(_Histogram.default, {
          transform: "translate(0 -40)"
        })))), /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
          "data-test": _constants.DISTRIBUTION_PROPERTIES,
          onClick: this.handleCardClick[_constants.DISTRIBUTION_PROPERTIES]
        }, /*#__PURE__*/_react.default.createElement(_Card.default.Header, {
          subtitle: _constants2.UNICODE_NBSP /* empty subtitle for items alignment across cards */,
          title: (0, _i18n.gettext)('Distribution Properties')
        }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          content: distributionPropertiesTooltip
        })), /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_Content.default, {
          experiment: experiment
        }))), /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
          "data-test": _constants.OUTLIER_ANALYSIS,
          onClick: this.handleCardClick[_constants.OUTLIER_ANALYSIS]
        }, /*#__PURE__*/_react.default.createElement(_Card.default.Header, {
          subtitle: _constants2.UNICODE_NBSP /* empty subtitle for items alignment across cards */,
          title: (0, _i18n.gettext)('Outlier Analysis')
        }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          content: outlierAnalysisTooltip
        })), /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_Content2.default, {
          experiment: experiment
        }))))))), /*#__PURE__*/_react.default.createElement(_Review.ContentWrapper, null, contentMapper(this.props)[content])));
      }
    }]);
  }(_react.Component);
  Review.propTypes = propTypes;
  var _default = _exports.default = Review;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartOutlierDetection/WizardSteps/Review/Review.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./src/main/webapp/components/shared/Panel/Panel.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Card, _Message, _Panel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledInfoMessage = _exports.StyledCardHeader = _exports.StyledCardBody = _exports.LoadingMessageWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Card = _interopRequireDefault(_Card);
  _Message = _interopRequireDefault(_Message);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledCardHeader = _exports.StyledCardHeader = (0, _styledComponents.default)(_Card.default.Header)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding-bottom: 0;\n"])));
  var StyledCardBody = _exports.StyledCardBody = (0, _styledComponents.default)(_Panel.CardBodyEnd)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    padding-bottom: 0;\n"])));
  var LoadingMessageWrapper = _exports.LoadingMessageWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    height: 400px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n"])));
  var StyledInfoMessage = _exports.StyledInfoMessage = (0, _styledComponents.default)(_Message.default)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    margin: 10px 20px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/BarEntry/BarEntry.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/BarEntry/BarEntry.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _Tooltip, _BarEntry) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Tooltip = _interopRequireDefault(_Tooltip);
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
    // Number from 0 to 100 inclusive indicating percentage of progress bar width
    progress: _propTypes.default.number,
    label: _propTypes.default.string.isRequired,
    value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
    // className is needed so users can style this component with styled-components
    className: _propTypes.default.string
  };
  var defaultProps = {
    progress: 100,
    className: ''
  };

  // As long as props are simple data structures, get perf boost from memo
  var BarEntry = /*#__PURE__*/(0, _react.memo)(function (_ref) {
    var progress = _ref.progress,
      label = _ref.label,
      value = _ref.value,
      className = _ref.className;
    var labelRef = (0, _react.useRef)();
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      hasOverflow = _useState2[0],
      setHasOverflow = _useState2[1];
    (0, _react.useEffect)(function () {
      setHasOverflow(labelRef.current != null && labelRef.current.scrollWidth > labelRef.current.clientWidth);
    }, [label]);
    var barProgress = Math.round(progress > 100 ? 100 : progress);
    return /*#__PURE__*/_react.default.createElement(_BarEntry.StyledBarPanel, {
      className: className
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: hasOverflow ? label : null,
      inline: false
    }, /*#__PURE__*/_react.default.createElement(_BarEntry.StyledContents, {
      barProgress: barProgress,
      inline: false
    }, /*#__PURE__*/_react.default.createElement(_BarEntry.StyledLabel, {
      ref: labelRef
    }, label), /*#__PURE__*/_react.default.createElement(_BarEntry.StyledValue, null, value))));
  });
  BarEntry.propTypes = propTypes;
  BarEntry.defaultProps = defaultProps;
  var _default = _exports.default = BarEntry;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/BarEntry/BarEntry.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js"), __webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes, _tinycolor) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledValue = _exports.StyledLabel = _exports.StyledContents = _exports.StyledBarPanel = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _tinycolor = _interopRequireDefault(_tinycolor);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledBarPanel = _exports.StyledBarPanel = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    width: 100%;\n"])));
  var StyledContents = _exports.StyledContents = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: space-between;\n\n    /* Progress Bar */\n    /* Tinycolor is used because ie11 only supports alpha as rgba */\n    background: linear-gradient(\n        to right,\n        rgba(255, 255, 255, 0) ", "%,\n        ", " ", "%\n    );\n"])), function (props) {
    return 100 - props.barProgress;
  }, function (props) {
    return (0, _tinycolor.default)((0, _themes.variable)('diverging3ColorB')(props)).setAlpha(0.4).toRgbString();
  }, function (props) {
    return 100 - props.barProgress;
  });
  var BaseText = _styledComponents.default.span(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n"])));
  var StyledLabel = _exports.StyledLabel = (0, _styledComponents.default)(BaseText)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    flex: 0 1 auto;\n    min-width: 0;\n"])));
  var StyledValue = _exports.StyledValue = (0, _styledComponents.default)(BaseText)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    flex: 0 0 auto;\n    padding-left: 10px;\n    max-width: 50%;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/BarPanel/BarPanel.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/BarPanel/BarPanel.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/CompactCard/CompactCard.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayIterator, _esArrayMap, _esObjectToString, _webDomCollectionsIterator, _react, _propTypes, _i18n, _BarPanel, _CompactCard) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var propTypes = {
    label: _propTypes.default.string,
    entries: _propTypes.default.arrayOf(_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]), _propTypes.default.number))
  };
  var defaultProps = {
    label: '',
    entries: []
  };
  var BarPanel = function BarPanel(_ref) {
    var label = _ref.label,
      _ref$entries = _ref.entries,
      entries = _ref$entries === void 0 ? [] : _ref$entries;
    // Use the sum of all the entries as progress basis
    var maxProgress = entries.reduce(function (acc, entry) {
      return acc + entry[1];
    }, 0);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CompactCard.CompactCardHeader, null, /*#__PURE__*/_react.default.createElement(_BarPanel.StyledLabelHeading, {
      level: 4
    }, label), /*#__PURE__*/_react.default.createElement(_BarPanel.StyledOutlierHeading, {
      level: 4
    }, (0, _i18n.gettext)('#'))), /*#__PURE__*/_react.default.createElement(_CompactCard.CompactCardBody, null, entries.map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];
      var progress = Math.floor(value / maxProgress * 100);
      return /*#__PURE__*/_react.default.createElement(_BarPanel.StyledBarEntry, {
        key: key,
        label: key,
        progress: progress,
        value: value
      });
    })));
  };
  BarPanel.propTypes = propTypes;
  BarPanel.defaultProps = defaultProps;
  var _default = _exports.default = BarPanel;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/BarPanel/BarPanel.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js"), __webpack_require__("./node_modules/@splunk/react-ui/Heading.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/BarEntry/BarEntry.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes, _Heading, _BarEntry) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledOutlierHeading = _exports.StyledLabelHeading = _exports.StyledBarEntry = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Heading = _interopRequireDefault(_Heading);
  _BarEntry = _interopRequireDefault(_BarEntry);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledBarEntry = _exports.StyledBarEntry = (0, _styledComponents.default)(_BarEntry.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding-bottom: 2px;\n    margin-bottom: 2px;\n    border-bottom: 1px solid ", ";\n"])), (0, _themes.variable)('gray92'));
  var StyledHeading = (0, _styledComponents.default)(_Heading.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    margin-top: 0;\n    padding-bottom: 2px;\n    border-bottom: 1px solid ", ";\n    user-select: none;\n"])), (0, _themes.variable)('gray60'));
  var StyledLabelHeading = _exports.StyledLabelHeading = (0, _styledComponents.default)(StyledHeading)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    /* Override react-ui */\n    flex: 1 0 auto !important;\n"])));
  var StyledOutlierHeading = _exports.StyledOutlierHeading = (0, _styledComponents.default)(StyledHeading)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    /* Override react-ui */\n    flex: 0 1 auto !important;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/CompactCard/CompactCard.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/react-ui/CardLayout.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Card, _CardLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CompactCardLayout = _exports.CompactCardHeader = _exports.CompactCardBody = _exports.CompactCard = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Card = _interopRequireDefault(_Card);
  _CardLayout = _interopRequireDefault(_CardLayout);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4; // A wrapper around ReactUI's <Card> and <CardLayout> components that removes the additional padding/margins
  // this allows the cards to be right against the edges of their container, simplifying alignment
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  /* remove the additional padding around the <CardLayout> */
  var CompactCardLayout = _exports.CompactCardLayout = (0, _styledComponents.default)(_CardLayout.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 0 !important;\n"])));

  /* removes margins before the first card and after the last card while preserving the inter-card gutter */
  var CompactCard = _exports.CompactCard = (0, _styledComponents.default)(_Card.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    &:first-child {\n        margin-left: 0 !important;\n    }\n\n    &:last-child {\n        margin-right: 0 !important;\n    }\n"])));
  var CompactCardHeader = _exports.CompactCardHeader = (0, _styledComponents.default)(_Card.default.Header)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    padding: 0;\n"])));
  var CompactCardBody = _exports.CompactCardBody = (0, _styledComponents.default)(_Card.default.Body)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    padding: 0;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/MultiStatsPanel/MultiStatsPanel.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/shared/fpUtil.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StatsRow/StatsRow.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/MultiStatsPanel/MultiStatsPanel.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esArraySort, _esObjectKeys, _react, _propTypes, _fpUtil, _SingleValue, _StatsRow, _MultiStatsPanel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _SingleValue = _interopRequireDefault(_SingleValue);
  _StatsRow = _interopRequireDefault(_StatsRow);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    className: _propTypes.default.string,
    labelled: _propTypes.default.bool,
    // if provided will sort the incoming data
    // set to "true" to use the default Array.sort() behaviour
    // or provide a comparison function
    sort: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.func]),
    value: _propTypes.default.oneOfType([_propTypes.default.objectOf(_propTypes.default.string), _propTypes.default.objectOf(_propTypes.default.number)])
  };
  var defaultProps = {
    className: '',
    labelled: false,
    sort: false,
    value: {}
  };
  var MultiStatsPanel = function MultiStatsPanel(_ref) {
    var value = _ref.value,
      labelled = _ref.labelled,
      className = _ref.className,
      sort = _ref.sort;
    var keys = Object.keys(value);
    if (typeof sort === 'function') keys.sort(sort);else if (sort === true) keys.sort();
    if (keys.length > 3) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, keys.map(function (fieldName) {
        return /*#__PURE__*/_react.default.createElement(_StatsRow.default, {
          key: fieldName,
          name: fieldName,
          value: value[fieldName]
        });
      }));
    }
    var mappedStats = keys.map(function (fieldName) {
      return /*#__PURE__*/_react.default.createElement(_MultiStatsPanel.FlexSingleValue, {
        key: fieldName,
        label: labelled !== false ? fieldName : null,
        value: value[fieldName]
      });
    });
    var mappedStatsWithDivider = (0, _fpUtil.intersperse)(function (index) {
      return /*#__PURE__*/_react.default.createElement(_SingleValue.default, {
        key: index,
        value: "|"
      });
    }, mappedStats);
    return /*#__PURE__*/_react.default.createElement(_MultiStatsPanel.StyledMultiStats, {
      className: className
    }, mappedStatsWithDivider);
  };
  MultiStatsPanel.defaultProps = defaultProps;
  MultiStatsPanel.propTypes = propTypes;
  var _default = _exports.default = MultiStatsPanel;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/MultiStatsPanel/MultiStatsPanel.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _SingleValue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledMultiStats = _exports.FlexSingleValue = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _SingleValue = _interopRequireDefault(_SingleValue);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledMultiStats = _exports.StyledMultiStats = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n"])));
  var FlexSingleValue = _exports.FlexSingleValue = (0, _styledComponents.default)(_SingleValue.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    /* intentionally flex-shrinking so that bigger values fit properly in narrow cards */\n    flex: 1 1 auto;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/SearchStage/DensityFunction/DensityFunction.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ml/Fit.js"), __webpack_require__("./node_modules/@splunk/react-ml/SliderNumber.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/context/scrollContainerContext.jsx"), __webpack_require__("./src/main/webapp/data/algorithmSchemas/loadSchema.es"), __webpack_require__("./src/main/webapp/util/confMLSpl.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFind, _esArrayFrom, _esFunctionName, _esObjectToString, _esStringIterator, _esStringTrim, _react, _propTypes, _Fit, _SliderNumber, _scrollContainerContext, _loadSchema, _confMLSpl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Fit = _interopRequireDefault(_Fit);
  _SliderNumber = _interopRequireDefault(_SliderNumber);
  _loadSchema = _interopRequireDefault(_loadSchema);
  var _excluded = ["maximum", "minimum", "onChange"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var appName = 'DensityFunction';
  var schema = (0, _loadSchema.default)(appName);
  var defaultProps = {
    alwaysShowValidation: false,
    disabled: false
  };
  var propTypes = {
    alwaysShowValidation: _propTypes.default.bool,
    disabled: _propTypes.default.bool,
    onChange: _propTypes.default.func.isRequired,
    stage: _propTypes.default.shape({
      algorithmParams: _propTypes.default.object.isRequired,
      featureVariables: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      inputFields: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      targetVariables: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      splitBy: _propTypes.default.any,
      validationError: _propTypes.default.any
    }).isRequired
  };
  var DensityFunction = function DensityFunction(_ref) {
    var alwaysShowValidation = _ref.alwaysShowValidation,
      disabled = _ref.disabled,
      _onChange = _ref.onChange,
      stage = _ref.stage;
    var specificLabelRef = (0, _react.useRef)(null);
    (0, _react.useEffect)(function () {
      (0, _confMLSpl.getMLSPLConfig)(appName).then(function (value) {
        schema.properties.splitBy.maxItems = parseInt(value.entry.find(function (item) {
          return item.name === 'max_fields_in_by_clause';
        }).content, 10);
      });
    }, []);
    (0, _react.useEffect)(function () {
      var labels = document.querySelectorAll('label[data-size="medium"][data-test="label"]');
      specificLabelRef.current = Array.from(labels).find(function (label) {
        return label.firstChild.data.trim() === schema.properties.algorithmParams.properties.supervise_split_by.title;
      });
    }, []);
    (0, _react.useEffect)(function () {
      var checkboxButton = document.querySelector('button[type="button"][role="checkbox"]');
      if (stage.splitBy.length <= 0) {
        if (specificLabelRef.current) {
          specificLabelRef.current.style.color = '#a6a6a6';
          specificLabelRef.current.style.float = 'right';
          specificLabelRef.current.style.marginRight = '85px';
        }
        if (stage.algorithmParams.supervise_split_by !== false) {
          _onChange(_objectSpread(_objectSpread({}, stage), {}, {
            algorithmParams: _objectSpread(_objectSpread({}, stage.algorithmParams), {}, {
              supervise_split_by: false
            })
          }));
        }
        checkboxButton.disabled = true;
      } else {
        if (specificLabelRef.current) {
          specificLabelRef.current.style.color = 'rgb(60, 68, 77)'; // Change the text color
        }
        checkboxButton.disabled = false;
      }
    }, [stage.splitBy, stage.algorithmParams.supervise_split_by, _onChange, stage]);
    return /*#__PURE__*/_react.default.createElement(_Fit.default, {
      algorithmParamRenderers: {
        threshold: function threshold(paramProps) {
          var maximum = paramProps.maximum,
            minimum = paramProps.minimum,
            onThresholdChange = paramProps.onChange,
            otherProps = _objectWithoutProperties(paramProps, _excluded);
          return /*#__PURE__*/_react.default.createElement(_SliderNumber.default, _extends({
            max: maximum,
            min: minimum,
            onChange: function onChange(e, _ref2) {
              var value = _ref2.value,
                name = _ref2.name;
              onThresholdChange(value, name);
            },
            scale: "log"
          }, otherProps));
        }
      },
      algorithmParams: stage.algorithmParams,
      alwaysShowValidation: alwaysShowValidation,
      disabled: disabled,
      featureVariables: stage.featureVariables,
      fields: stage.inputFields,
      layout: "vertical",
      onChange: function onChange(value, field, context) {
        if (context === 'algorithmParams') {
          _onChange(_objectSpread(_objectSpread({}, stage), {}, {
            algorithmParams: _objectSpread(_objectSpread({}, stage.algorithmParams), {}, _defineProperty({}, field, value))
          }));
        } else {
          _onChange(_objectSpread(_objectSpread({}, stage), {}, _defineProperty({}, field, value)));
        }
      },
      schemaProperties: schema.properties,
      scrollContainer: (0, _react.useContext)(_scrollContainerContext.ScrollContainerContext),
      splitBy: stage.splitBy,
      targetVariables: stage.targetVariables,
      validationErrors: stage.validationError
    });
  };
  DensityFunction.defaultProps = defaultProps;
  DensityFunction.propTypes = propTypes;
  var _default = _exports.default = DensityFunction;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/SearchStage/ExtractTime/ExtractTime.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.object.values.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js"), __webpack_require__("./node_modules/@splunk/react-ui/List.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/models/searchStage/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayIncludes, _esArrayMap, _esObjectToString, _esObjectValues, _esStringIncludes, _webDomCollectionsForEach, _react, _propTypes, _i18n, _Message, _List, _Tooltip, _util, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Message = _interopRequireDefault(_Message);
  _List = _interopRequireDefault(_List);
  _Tooltip = _interopRequireDefault(_Tooltip);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    stage: _propTypes.default.shape({
      outputFields: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
    }).isRequired
  };
  var ExtractTime = function ExtractTime(_ref) {
    var stage = _ref.stage;
    var timeFieldsComponent = null;
    if ((0, _util.isStageDataReady)(stage)) {
      var matchingTimeFields = [];
      var missingTimeFields = [];
      Object.values(_constants.TIME_FIELD_NAMES).forEach(function (timeField) {
        if (stage.outputFields.includes(timeField)) {
          matchingTimeFields.push(timeField);
        } else {
          missingTimeFields.push(timeField);
        }
      });
      var matchingComponent = matchingTimeFields.length > 0 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Extracted Fields:')), /*#__PURE__*/_react.default.createElement(_List.default, {
        "data-test": "matching-fields-list"
      }, matchingTimeFields.map(function (field) {
        return /*#__PURE__*/_react.default.createElement(_List.default.Item, {
          key: field
        }, field);
      })));
      var missingComponent = missingTimeFields.length > 0 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Could not extract these fields:'), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        content: (0, _i18n.gettext)('These time fields could not be extracted because insufficient unique values are present in the data')
      })), /*#__PURE__*/_react.default.createElement(_List.default, {
        "data-test": "missing-fields-list"
      }, missingTimeFields.map(function (field) {
        return /*#__PURE__*/_react.default.createElement(_List.default.Item, {
          key: field
        }, field);
      })));
      timeFieldsComponent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, matchingComponent, missingComponent);
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Message.default, {
      type: "info"
    }, (0, _i18n.gettext)('Extract common time values out of your data (such as hours of the day, days of the week, etc.) which can be used to take seasonality into account when analyzing your data.')), timeFieldsComponent);
  };
  ExtractTime.propTypes = propTypes;
  var _default = _exports.default = ExtractTime;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/icons/Histogram.jsx":
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
  var _excluded = ["transform"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var propTypes = {
    transform: _propTypes.default.string
  };
  var defaultProps = {
    transform: null
  };

  // Intentionally not using splunk's SVG because of conflicting css properties
  var Histogram = function Histogram(_ref) {
    var transform = _ref.transform,
      rest = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement("svg", _extends({
      viewBox: "0 0 250 136.8"
    }, rest), /*#__PURE__*/_react.default.createElement("title", null, (0, _i18n.gettext)('Histogram')), /*#__PURE__*/_react.default.createElement("g", {
      "data-name": "Layer 2",
      id: "Layer_2",
      transform: transform
    }, /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "95.5",
      width: "18",
      x: "158.5",
      y: "41"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "45.5",
      width: "18",
      x: "126.5",
      y: "91"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "66.5",
      width: "18",
      x: "94.5",
      y: "70"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "88.5",
      width: "18",
      x: "62.5",
      y: "48"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "30.5",
      width: "18",
      x: "30.5",
      y: "106"
    })));
  };
  Histogram.propTypes = propTypes;
  Histogram.defaultProps = defaultProps;
  var _default = _exports.default = Histogram;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/icons/Table.jsx":
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
  var _excluded = ["transform"];
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var propTypes = {
    transform: _propTypes.default.string
  };
  var defaultProps = {
    transform: null
  };

  // Intentionally not using splunk's SVG because of conflicting css properties
  var Table = function Table(_ref) {
    var transform = _ref.transform,
      rest = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement("svg", _extends({
      viewBox: "0 0 208.8 136.8"
    }, rest), /*#__PURE__*/_react.default.createElement("title", null, (0, _i18n.gettext)('Table')), /*#__PURE__*/_react.default.createElement("g", {
      transform: transform
    }, /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#c3cbd4",
      height: "21",
      width: "64",
      x: "0.2"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#c3cbd4",
      height: "21",
      width: "64",
      x: "73.2"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#c3cbd4",
      height: "21",
      width: "64",
      x: "145.2"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#4bbbe5",
      height: "21",
      width: "64",
      x: "0.2",
      y: "29"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#4bbbe5",
      height: "21",
      width: "64",
      x: "73.2",
      y: "29"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#4bbbe5",
      height: "21",
      width: "64",
      x: "145.2",
      y: "29"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#368abb",
      height: "21",
      width: "64",
      x: "0.2",
      y: "58"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#368abb",
      height: "21",
      width: "64",
      x: "73.2",
      y: "58"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#368abb",
      height: "21",
      width: "64",
      x: "145.2",
      y: "58"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#c3cbd4",
      height: "21",
      width: "64",
      x: "0.2",
      y: "87"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#c3cbd4",
      height: "21",
      width: "64",
      x: "73.2",
      y: "87"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#c3cbd4",
      height: "21",
      width: "64",
      x: "145.2",
      y: "87"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#4bbbe5",
      height: "21",
      width: "64",
      x: "0.2",
      y: "116"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#4bbbe5",
      height: "21",
      width: "64",
      x: "73.2",
      y: "116"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#4bbbe5",
      height: "21",
      width: "64",
      x: "145.2",
      y: "116"
    })));
  };
  Table.propTypes = propTypes;
  Table.defaultProps = defaultProps;
  var _default = _exports.default = Table;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/CardWrapper.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/mixins.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/SelectablePanel/SelectablePanel.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _mixins, _SelectablePanel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    children: _propTypes.default.node.isRequired
  };
  var CardWrapper = function CardWrapper(_ref) {
    var children = _ref.children;
    return /*#__PURE__*/_react.default.createElement(_mixins.VerticalLayoutWrapper, null, /*#__PURE__*/_react.default.createElement(_SelectablePanel.StyledBox, {
      disableSelection: true
    }, children));
  };
  CardWrapper.propTypes = propTypes;
  var _default = _exports.default = CardWrapper;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/DistributionViz.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomVizControls/CustomVizControls.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _CustomViz, _CustomVizControls) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _CustomVizControls = _interopRequireDefault(_CustomVizControls);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var propTypes = {
    distributionCount: _propTypes.default.number.isRequired,
    distributions: _propTypes.default.arrayOf(_propTypes.default.shape({})),
    height: _propTypes.default.number,
    namespacedOptions: _propTypes.default.shape({}),
    onMenuClick: _propTypes.default.func.isRequired,
    viewId: _propTypes.default.string.isRequired,
    vizStage: _propTypes.default.shape({
      searchManagerId: _propTypes.default.string
    })
  };
  var defaultProps = {
    distributions: [],
    height: undefined,
    namespacedOptions: {},
    vizStage: {}
  };
  var DistributionViz = function DistributionViz(_ref) {
    var distributionCount = _ref.distributionCount,
      distributions = _ref.distributions,
      height = _ref.height,
      namespacedOptions = _ref.namespacedOptions,
      onMenuClick = _ref.onMenuClick,
      viewId = _ref.viewId,
      vizStage = _ref.vizStage;
    var _useState = (0, _react.useState)({
        showHistogram: true,
        showOutlierArea: true,
        showOutliers: true
      }),
      _useState2 = _slicedToArray(_useState, 2),
      _useState2$ = _useState2[0],
      showHistogram = _useState2$.showHistogram,
      showOutlierArea = _useState2$.showOutlierArea,
      showOutliers = _useState2$.showOutliers,
      setState = _useState2[1];
    var handleControlsChange = function handleControlsChange(value, key) {
      setState(function (prevState) {
        return _objectSpread(_objectSpread({}, prevState), {}, _defineProperty({}, key, value));
      });
    };
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CustomVizControls.default, {
      controlsSchema: {
        properties: {
          showHistogram: {
            label: (0, _i18n.gettext)('show histogram'),
            type: 'boolean'
          },
          showOutlierArea: {
            label: (0, _i18n.gettext)('show outlier area'),
            type: 'boolean'
          },
          showOutliers: {
            label: (0, _i18n.gettext)('show outliers'),
            type: 'boolean'
          }
        }
      },
      controlsValues: {
        showHistogram: showHistogram,
        showOutlierArea: showOutlierArea,
        showOutliers: showOutliers
      },
      onChange: handleControlsChange,
      onMenuClick: onMenuClick
    }), /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      height: height,
      managerId: vizStage.searchManagerId,
      namespacedOptions: _objectSpread({
        distributionCount: distributionCount,
        showHistogram: showHistogram,
        showOutlierArea: showOutlierArea,
        showOutliers: showOutliers,
        whitelistDistributions: distributions
      }, namespacedOptions),
      viewId: viewId,
      vizType: "DistributionViz"
    }));
  };
  DistributionViz.propTypes = propTypes;
  DistributionViz.defaultProps = defaultProps;
  var _default = _exports.default = DistributionViz;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/DistributionVizWrapper.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.reflect.construct.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.from-entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/ChartLine.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/CustomVizWrapper.jsx"), __webpack_require__("./src/main/webapp/components/shared/SPLModal/SPLModal.jsx"), __webpack_require__("./src/main/webapp/util/forms.es"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/shared/fpUtil.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/NewSearchTemplate.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/util.es"), __webpack_require__("./src/main/webapp/plots/DistributionPlot.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/OutliersViz/OutliersViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/CardWrapper.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/DistributionViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/DistributionVizWrapper.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayConcat, _esArrayIterator, _esArrayJoin, _esArrayMap, _esArraySlice, _esDateToPrimitive, _esNumberConstructor, _esObjectEntries, _esObjectFromEntries, _esObjectToString, _react, _config, _i18n, _ChartLine, _propTypes, _CustomVizWrapper, _SPLModal, _forms, _constants, _fpUtil, _constants2, _NewSearchTemplate, _util, _DistributionPlot, _OutliersViz, _CardWrapper, _DistributionViz, _DistributionVizWrapper2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _ChartLine = _interopRequireDefault(_ChartLine);
  _propTypes = _interopRequireDefault(_propTypes);
  _CustomVizWrapper = _interopRequireDefault(_CustomVizWrapper);
  _SPLModal = _interopRequireDefault(_SPLModal);
  _NewSearchTemplate = _interopRequireDefault(_NewSearchTemplate);
  _OutliersViz = _interopRequireDefault(_OutliersViz);
  _CardWrapper = _interopRequireDefault(_CardWrapper);
  _DistributionViz = _interopRequireDefault(_DistributionViz);
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
  var propTypes = {
    /**
     * Each distributon is a list of column values that make up the distribtion, ie.
     * [
     *     { col1: 1, col2: 2 }
     *     { col1: 1, col2: 2 }
     *     { col1: 2, col2: 2 }
     * ]
     */
    distributions: _propTypes.default.arrayOf(_propTypes.default.shape({})),
    experiment: _propTypes.default.shape({
      getDrilldownInfo: _propTypes.default.func.isRequired,
      getDataSourceSearchStage: _propTypes.default.any,
      getMainStage: _propTypes.default.any
    }).isRequired,
    height: _propTypes.default.number,
    previousStage: _propTypes.default.shape({}),
    isSplitView: _propTypes.default.bool.isRequired,
    isTimeView: _propTypes.default.bool.isRequired,
    viewId: _propTypes.default.string.isRequired,
    vizStage: _propTypes.default.shape({
      searchManagerId: _propTypes.default.string.isRequired,
      type: _propTypes.default.any,
      id: _propTypes.default.any
    }).isRequired
  };
  var defaultProps = {
    height: undefined,
    previousStage: null,
    distributions: []
  };
  var DistributionVizWrapper = /*#__PURE__*/function (_Component) {
    function DistributionVizWrapper(props) {
      var _this;
      _classCallCheck(this, DistributionVizWrapper);
      _this = _callSuper(this, DistributionVizWrapper, [props]);
      /**
       * @param {string | string[]} distributions The distributions
       * @param {string} viz The viz name
       */
      _defineProperty(_this, "getDrilldownInfo", function (distributions, viz) {
        var _this$props = _this.props,
          experiment = _this$props.experiment,
          vizStage = _this$props.vizStage;
        var dataSourceStage = experiment.getDataSourceSearchStage();
        var splOptions = {};

        // the viz stage can be either the "fit" stage or the "apply" stage
        // if the "fit" stage is used as the viz stage, no additional postprocessing
        // stage needs to be appended; the fit stage SPL can be used as-is
        if (vizStage.type === _constants.STAGE_TYPES.APPLY) {
          splOptions.appendPostprocessingStageId = vizStage.id;
          splOptions.stopAtStageGuid = dataSourceStage ? dataSourceStage.guid : null;
        }
        return experiment.getDrilldownInfo({
          splOptions: splOptions,
          vizOptions: {
            category: 'custom',
            type: "".concat(_config.app, ".").concat(viz)
          },
          additionalSPL: (0, _fpUtil.asArray)(distributions).length > 0 && _this.createWhitelistSPL(distributions).length > 0 ? [_this.createWhitelistSPL(distributions)] : []
        });
      });
      /**
       * Takes an array of object of fieldNames: fieldValues and creates an SPL to filter only on these values
       *
       * @example
       * // returns '| where (\'BucketMinuteOfHour\'="45" and \'HourOfDay\'="8") or (\'BucketMinuteOfHour\'="5" and \'HourOfDay\'="3") or (\'BucketMinuteOfHour\'="5" and \'HourOfDay\'="4")'
       * createWhitelistSPL([{"BucketMinuteOfHour":"45","HourOfDay":"8"},{"BucketMinuteOfHour":"5","HourOfDay":"3"}])
       */
      _defineProperty(_this, "createWhitelistSPL", function () {
        var whitelistDistributions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var spl = whitelistDistributions.reduce(function (distributionSPLArray, distribution) {
          var distributionSPL = Object.entries(distribution).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];
            return "'".concat(key, "'=").concat((0, _forms.escape)(value));
          }).join(' and ');

          // empty distributions will produce zero-length SPL fragments
          // in which case we skip wrapping the fragment in brackets
          // since " or ()" isn't valid SPL
          return distributionSPL.length > 0 ? distributionSPLArray.concat(["(".concat(distributionSPL, ")")]) : distributionSPLArray;
        }, []).join(' or ');
        return spl.length > 0 ? "| where ".concat(spl) : '';
      });
      _defineProperty(_this, "handleMenuClick", function (distributions, viz, action) {
        if (action === 'openInSearch') _this.openInSearch(distributions, viz);else if (action === 'showSPL') _this.showSPLModal(distributions, viz);
      });
      _defineProperty(_this, "openInSearch", function (distributions, viz) {
        var _this$getDrilldownInf = _this.getDrilldownInfo(distributions, viz),
          searchUrl = _this$getDrilldownInf.searchUrl;
        window.open(searchUrl, '_blank');
      });
      _defineProperty(_this, "showSPLModal", function (distributions, viz) {
        _this.setState(_objectSpread({
          splModalOpen: true
        }, _this.getDrilldownInfo(distributions, viz)));
      });
      _defineProperty(_this, "hideSPLModal", function () {
        _this.setState({
          splModalOpen: false
        });
      });
      _this.state = {
        splModalOpen: false,
        splArray: [],
        splCommentsArray: [],
        searchUrl: ''
      };
      return _this;
    }
    _inherits(DistributionVizWrapper, _Component);
    return _createClass(DistributionVizWrapper, [{
      key: "render",
      value: function render() {
        var _this2 = this;
        var _this$props2 = this.props,
          distributions = _this$props2.distributions,
          experiment = _this$props2.experiment,
          height = _this$props2.height,
          isSplitView = _this$props2.isSplitView,
          isTimeView = _this$props2.isTimeView,
          previousStage = _this$props2.previousStage,
          viewId = _this$props2.viewId,
          vizStage = _this$props2.vizStage;
        var _this$state = this.state,
          searchUrl = _this$state.searchUrl,
          splArray = _this$state.splArray,
          splCommentsArray = _this$state.splCommentsArray,
          splModalOpen = _this$state.splModalOpen;
        var numberOfDistributions = distributions.length;
        var hasNoSplitBy = experiment.getMainStage().splitBy.length === 0;
        var limitReached = numberOfDistributions > _DistributionPlot.MAX_DISTRIBUTIONS;
        return distributions.length > 0 ? /*#__PURE__*/_react.default.createElement(_CustomVizWrapper.default, {
          managerId: vizStage.searchManagerId,
          previousStage: previousStage
        }, isSplitView || isTimeView ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, limitReached && /*#__PURE__*/_react.default.createElement(_DistributionVizWrapper2.StyledMessage, {
          type: "warning"
        }, _DistributionPlot.limitMessage), distributions.slice(0, _DistributionPlot.MAX_DISTRIBUTIONS).map(function (distribution, index) {
          return /*#__PURE__*/_react.default.createElement(_CardWrapper.default, {
            key: JSON.stringify(distribution)
          }, isTimeView ? /*#__PURE__*/_react.default.createElement(_OutliersViz.default, {
            height: height,
            namespacedOptions: {
              // maps the distribution from { field1: v1, field2: v2, ... } to { field1: [v1], field2: [v2], ... }
              // by turning it into an array, mapping it, then turning it back into an object
              filterFieldValues: Object.fromEntries(Object.entries(distribution).map(function (distributionField) {
                return [distributionField[0], (0, _fpUtil.asArray)(distributionField[1])];
              }))
            },
            onMenuClick: function onMenuClick(action) {
              return _this2.handleMenuClick([distribution], 'OutliersViz', action);
            },
            title: (0, _util.parseKeyToLabel)(distribution),
            viewId: "".concat(viewId, "-").concat(index),
            vizStage: vizStage
          }) : /*#__PURE__*/_react.default.createElement(_DistributionViz.default, {
            distributionCount: 1,
            distributions: [distribution],
            height: height,
            namespacedOptions: {
              colorIndexOffset: index
            },
            onMenuClick: function onMenuClick(action) {
              return _this2.handleMenuClick([distribution], 'DistributionViz', action);
            },
            viewId: "".concat(viewId, "-").concat(index),
            vizStage: vizStage
          }));
        })) : /*#__PURE__*/_react.default.createElement(_CardWrapper.default, null, /*#__PURE__*/_react.default.createElement(_DistributionViz.default, {
          distributionCount: numberOfDistributions
          // we need to distinguish the difference between no distributions
          // because they weren't selected, or because there is no splitbys
          ,
          distributions: hasNoSplitBy ? [] : distributions,
          height: height,
          onMenuClick: function onMenuClick(action) {
            return _this2.handleMenuClick(distributions, 'DistributionViz', action);
          },
          viewId: viewId,
          vizStage: vizStage
        })), /*#__PURE__*/_react.default.createElement(_SPLModal.default, {
          linkText: (0, _i18n.gettext)('View your model in a Distribution Plot'),
          modalComments: splCommentsArray,
          modalSPL: splArray,
          modalUrl: searchUrl,
          onRequestClose: this.hideSPLModal,
          open: splModalOpen
        })) : /*#__PURE__*/_react.default.createElement(_NewSearchTemplate.default, {
          iconType: _ChartLine.default,
          message: _constants2.VIZ_PLACEHOLDERS.SELECT_FIELDS
        });
      }
    }]);
  }(_react.Component);
  DistributionVizWrapper.propTypes = propTypes;
  DistributionVizWrapper.defaultProps = defaultProps;
  var _default = _exports.default = DistributionVizWrapper;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/DistributionViz/DistributionVizWrapper.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Message.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Message) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledMessage = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Message = _interopRequireDefault(_Message);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledMessage = _exports.StyledMessage = (0, _styledComponents.default)(_Message.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding-bottom: 0;\n    margin: 0 auto 0 1em;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/CustomViz/wrappers/OutliersViz/OutliersViz.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomVizControls/CustomVizControls.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _CustomViz, _CustomVizControls) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _CustomVizControls = _interopRequireDefault(_CustomVizControls);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var propTypes = {
    height: _propTypes.default.number,
    namespacedOptions: _propTypes.default.shape({}),
    onMenuClick: _propTypes.default.func.isRequired,
    title: _propTypes.default.string,
    viewId: _propTypes.default.string.isRequired,
    vizStage: _propTypes.default.shape({
      searchManagerId: _propTypes.default.string
    })
  };
  var defaultProps = {
    height: undefined,
    namespacedOptions: {},
    title: '',
    vizStage: {}
  };
  var OutliersViz = function OutliersViz(_ref) {
    var onMenuClick = _ref.onMenuClick,
      height = _ref.height,
      namespacedOptions = _ref.namespacedOptions,
      title = _ref.title,
      viewId = _ref.viewId,
      vizStage = _ref.vizStage;
    var _useState = (0, _react.useState)({
        showConfidenceInterval: true,
        showOutlierPoints: true
      }),
      _useState2 = _slicedToArray(_useState, 2),
      _useState2$ = _useState2[0],
      showConfidenceInterval = _useState2$.showConfidenceInterval,
      showOutlierPoints = _useState2$.showOutlierPoints,
      setState = _useState2[1];
    var handleControlsChange = function handleControlsChange(value, key) {
      setState(function (prevState) {
        return _objectSpread(_objectSpread({}, prevState), {}, _defineProperty({}, key, value));
      });
    };
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CustomVizControls.default, {
      controlsSchema: {
        properties: {
          showConfidenceInterval: {
            label: (0, _i18n.gettext)('show confidence interval'),
            type: 'boolean'
          },
          showOutlierPoints: {
            label: (0, _i18n.gettext)('show outliers'),
            type: 'boolean'
          }
        }
      },
      controlsValues: {
        showConfidenceInterval: showConfidenceInterval,
        showOutlierPoints: showOutlierPoints
      },
      onChange: handleControlsChange,
      onMenuClick: onMenuClick,
      title: title
    }), /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      height: height,
      managerId: vizStage.searchManagerId,
      namespacedOptions: _objectSpread({
        legendAlign: 'top',
        showConfidenceInterval: showConfidenceInterval,
        showOutlierPoints: showOutlierPoints
      }, namespacedOptions),
      viewId: viewId,
      vizType: "OutliersViz"
    }));
  };
  OutliersViz.propTypes = propTypes;
  OutliersViz.defaultProps = defaultProps;
  var _default = _exports.default = OutliersViz;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/contrib/highcharts/modules/highcharts-downsample/highcharts-downsample.es":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./src/main/webapp/contrib/highcharts/modules/highcharts-downsample/lttb.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_esSymbol, _esSymbolDescription, _esSymbolIterator, _esArrayIterator, _esArraySlice, _esObjectToString, _esRegexpToString, _esStringIterator, _webDomCollectionsIterator, _lttb) {
  "use strict";

  _lttb = _interopRequireDefault(_lttb);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); } /*
 * The MIT License

 Copyright (c) 2013 by Sveinn Steinarsson

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
  (function (factory) {
    if (( false ? undefined : _typeof(module)) === 'object' && module.exports) {
      module.exports = factory;
    } else {
      factory(Highcharts);
    }
  })(function (Highcharts) {
    (function (H) {
      "use strict";

      if (!Array.isArray) {
        Array.isArray = function (vArg) {
          return Object.prototype.toString.call(vArg) === "[object Array]";
        };
      }
      var floor = Math.floor,
        abs = Math.abs;
      H.wrap(H.Series.prototype, 'setData', function (proceed) {
        var opt = this.options;
        if (opt.hasOwnProperty('downsample') && arguments[1].length > 0) {
          if (Array.isArray(arguments[1][0]) && arguments[1][0].length == 2) {
            // Data is array of arrays with two values
            arguments[1] = (0, _lttb.default)(arguments[1], opt.downsample.threshold);
          } else if (!isNaN(parseFloat(arguments[1][0])) && isFinite(arguments[1][0])) {
            // Data is array of numerical values.
            var point_x = typeof opt.pointStart != 'undefined' ? opt.pointStart : 0; // First X
            var pointInterval = typeof opt.pointInterval != 'undefined' ? opt.pointInterval : 1;
            // Turn it into array of arrays with two values.
            for (var i = 0, len = arguments[1].length; i < len; i++) {
              arguments[1][i] = [point_x, arguments[1][i]];
              point_x += pointInterval;
            }
            arguments[1] = (0, _lttb.default)(arguments[1], opt.downsample.threshold);
          } else if (arguments[1][0].x !== null && arguments[1][0].y !== undefined) {
            arguments[1] = (0, _lttb.default)(arguments[1], opt.downsample.threshold);
          } else {
            console.log("Downsample Error: Invalid data format! Note: Range Series are not supported");
          }
        }
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      });
    })(Highcharts);
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/main/webapp/contrib/highcharts/modules/highcharts-downsample/lttb.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArraySort, _esObjectToString, _esRegexpToString) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = largestTriangleThreeBuckets;
  if (!Array.isArray) {
    Array.isArray = function (vArg) {
      return Object.prototype.toString.call(vArg) === "[object Array]";
    };
  }
  var floor = Math.floor,
    abs = Math.abs;
  function getX(point) {
    if (Array.isArray(point)) {
      return point[0];
    } else {
      return point.x;
    }
  }
  function getY(point) {
    if (Array.isArray(point)) {
      return point[1];
    } else {
      return point.y;
    }
  }
  function largestTriangleThreeBuckets(data, threshold) {
    var data_length = data.length;
    if (threshold >= data_length || threshold === 0 || threshold === null) {
      return data; // Nothing to do
    }
    var sampled = [],
      sampled_index = 0;

    // Bucket size. Leave room for start and end data points
    var every = (data_length - 2) / (threshold - 2);
    var a = 0,
      // Initially a is the first point in the triangle
      max_area_point,
      max_area,
      area,
      next_a;
    sampled[sampled_index++] = data[a]; // Always add the first point

    for (var i = 0; i < threshold - 2; i++) {
      // Calculate point average for next bucket (containing c)
      var avg_x = 0,
        avg_y = 0,
        avg_range_start = floor((i + 1) * every) + 1,
        avg_range_end = floor((i + 2) * every) + 1;
      avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;
      var avg_range_length = avg_range_end - avg_range_start;
      var required_points = [];
      for (; avg_range_start < avg_range_end; avg_range_start++) {
        avg_x += getX(data[avg_range_start]) * 1; // * 1 enforces Number (value may be Date)
        avg_y += getY(data[avg_range_start]) * 1;
      }
      avg_x /= avg_range_length;
      avg_y /= avg_range_length;

      // Get the range for this bucket
      var range_offs = floor((i + 0) * every) + 1,
        range_to = floor((i + 1) * every) + 1;

      // Point a
      var point_a_x = getX(data[a]) * 1,
        // Enforce Number (value may be Date)
        point_a_y = getY(data[a]) * 1;
      max_area = area = -1;
      for (; range_offs < range_to; range_offs++) {
        // Calculate triangle area over three buckets
        area = abs((point_a_x - avg_x) * (getY(data[range_offs]) - point_a_y) - (point_a_x - getX(data[range_offs])) * (avg_y - point_a_y)) * 0.5;
        if (area > max_area) {
          max_area = area;
          max_area_point = data[range_offs];
          next_a = range_offs; // Next a is this b
        }

        // push the required point into the set of required points
        if (data[range_offs].required) required_points.push(data[range_offs]);
      }
      if (!max_area_point.required) {
        required_points.push(max_area_point);
        required_points.sort(function (a, b) {
          return getX(a) - getX(b);
        });
      }
      sampled = sampled.concat(required_points); // include max_area_point and required points
      sampled_index += required_points.length; // increment the index

      a = next_a; // This a is the next a (chosen b)
    }
    sampled[sampled_index++] = data[data_length - 1]; // Always add last

    return sampled;
  }
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/contrib_shim/highcharts/extensions.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.flat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.array.unscopables.flat.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFlat, _esArraySlice, _esArrayUnscopablesFlat) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.addPlotLine = addPlotLine;
  _exports.getPlotLinePath = getPlotLinePath;
  _exports.renderItem = renderItem;
  _exports.updateColorForPoint = updateColorForPoint;
  /**
   * A collection of Highcharts extensions shared between Highcharts and Highstock.
   * Each function is expected to take either Highcharts of Highstock as an argument
   * and return a function that has been closed over it.
   * This file should only contain functions that work in both Highcharts and Highstock;
   * functions extending only one of them should be in highcharts.es or highstock.es, respectively.
   */

  // a workaround for MLA-2984, see https://github.com/highcharts/highcharts/issues/8477.
  // this issue is fixed in 6.1.1
  function getPlotLinePath(Highplot) {
    return function (proceed) {
      var path = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      if (path) {
        path.flat = false;
      }
      return path;
    };
  }

  // allows for theming of plotLines via Highcharts theme options
  function addPlotLine(Highplot) {
    return function (proceed) {
      var labelOptions = {
        label: {
          style: this.chart.options.labels != null ? this.chart.options.labels.style : {}
        }
      };
      var _arguments = Array.prototype.slice.call(arguments),
        args = _arguments[1];
      proceed.apply(this, [Highplot.merge(args, labelOptions)]);
    };
  }

  // adds "legendMouseOver" and "legendMouseOut" events to mirror the "mouseOver" and "mouseOut" events
  // this does not work if "useHTML" is true
  // see https://highcharts.uservoice.com/forums/55896-highcharts-javascript-api/suggestions/3166396-improve-series-highlight-on-legend-hover-event-by
  function renderItem(Highplot) {
    return function (proceed) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      // need to call this first to set up legendGroup.element
      proceed.call.apply(proceed, [this].concat(args));
      var item = args[0];

      // intentionally assigning to function param to get raw event
      // eslint-disable-next-line no-param-reassign
      item.legendGroup.element.onmouseover = function () {
        if (item.options.events.legendMouseOver != null) {
          item.options.events.legendMouseOver.call(item, {
            target: item.legendGroup,
            series: item
          });
        }
      };

      // intentionally assigning to function param to get raw event
      // eslint-disable-next-line no-param-reassign
      item.legendGroup.element.onmouseout = function () {
        if (item.options.events.legendMouseOut != null) {
          item.options.events.legendMouseOut.call(item, {
            target: item.legendGroup,
            series: item
          });
        }
      };
    };
  }

  /**
   * a util function to update the color for a Higchart Point without calling the "update" function so no "redraw" is called.
   * @param proceed {function | undefined} Highchart's builtin function if the function exists , otherwise undefined
   * @param color {string} the color code to be updated.
   */
  function updateColorForPoint(proceed, color) {
    if (this && this.graphic) {
      this.graphic.attr('fill', color);
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/contrib_shim/highcharts/highcharts.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/highcharts/modules/no-data-to-display.js"), __webpack_require__("./node_modules/@splunk/highcharts/highcharts.js"), __webpack_require__("./src/main/webapp/contrib/highcharts/modules/highcharts-downsample/highcharts-downsample.es"), __webpack_require__("./src/main/webapp/contrib_shim/highcharts/extensions.es"), __webpack_require__("./src/main/webapp/contrib_shim/highcharts/theme.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _noDataToDisplay, _highcharts, _highchartsDownsample, _extensions, _theme) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _noDataToDisplay = _interopRequireDefault(_noDataToDisplay);
  _highcharts = _interopRequireDefault(_highcharts);
  _highchartsDownsample = _interopRequireDefault(_highchartsDownsample);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // A utility class that sets global options that should be used by all Highcharts instances

  (0, _highchartsDownsample.default)(_highcharts.default);
  (0, _noDataToDisplay.default)(_highcharts.default);
  (0, _theme.setTheme)(_highcharts.default);

  // overwrite `seriesType` function in 5.0.12 with the one in version 5.0.13, there's a bug causing highchart
  // throws error when it loads highcharts-more.
  // see https://github.com/highcharts/highcharts/commit/38c895aae4b62e17142f8e9dbfac652edf17fd9b
  _highcharts.default.seriesType = function (type, parent, options, props, pointProps) {
    var defaultOptions = _highcharts.default.getOptions();
    var seriesTypes = _highcharts.default.seriesTypes;

    // Merge the options
    defaultOptions.plotOptions[type] = _highcharts.default.merge(defaultOptions.plotOptions[parent], options);

    // Create the class
    seriesTypes[type] = _highcharts.default.extendClass(seriesTypes[parent] || function () {}, props);
    seriesTypes[type].prototype.type = type;

    // Create the point class if needed
    if (pointProps) {
      seriesTypes[type].prototype.pointClass = _highcharts.default.extendClass(_highcharts.default.Point, pointProps);
    }
    return seriesTypes[type];
  };
  _highcharts.default.wrap(_highcharts.default.Axis.prototype, 'getPlotLinePath', (0, _extensions.getPlotLinePath)(_highcharts.default));
  _highcharts.default.wrap(_highcharts.default.Axis.prototype, 'addPlotLine', (0, _extensions.addPlotLine)(_highcharts.default));
  _highcharts.default.wrap(_highcharts.default.Point.prototype, 'updateColor', _extensions.updateColorForPoint);
  _highcharts.default.wrap(_highcharts.default.Legend.prototype, 'renderItem', (0, _extensions.renderItem)(_highcharts.default));
  var _default = _exports.default = _highcharts.default;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/contrib_shim/highcharts/theme.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/util/colorPalette.es"), __webpack_require__("./src/main/webapp/util/visualizationUtil.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _colorPalette, _visualizationUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setTheme = setTheme;
  // Sets global theming options for MLTK's Highcharts and Highstock

  function setTheme(Highplot) {
    var globalOptions = {
      colors: (0, _colorPalette.getColors)(),
      chart: {
        style: {
          'font-family': 'Splunk Platform Sans'
        }
      },
      credits: false,
      global: {
        useUTC: false
      },
      legend: {
        itemStyle: {
          'font-weight': 'normal'
        }
      }
    };
    var isDarkTheme = (0, _visualizationUtil.getCurrentTheme)() === 'dark';
    Highplot.setOptions(isDarkTheme ? Highplot.merge(globalOptions, _colorPalette.highchartsDarkTheme) : globalOptions);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/plots/DistributionPlot.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/themes/enterpriseDark.js"), __webpack_require__("./node_modules/@splunk/highcharts/highcharts-more.js"), __webpack_require__("./src/main/webapp/contrib_shim/highcharts/highcharts.es"), __webpack_require__("./src/main/webapp/util/colorPalette.es"), __webpack_require__("./src/main/webapp/util/options.es"), __webpack_require__("shared/controls/Messages"), __webpack_require__("./src/main/webapp/util/visualizationUtil.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayMap, _esFunctionName, _esObjectToString, _webDomCollectionsForEach, _i18n, _format, _enterpriseDark, _highchartsMore, _highchartsMltk, _colorPalette, _options, Messages, _visualizationUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.NUM_DISTRIBUTION_BINS = _exports.MAX_DISTRIBUTIONS = void 0;
  _exports.getBinColumns = getBinColumns;
  _exports.getBins = getBins;
  _exports.getBoundaryRangePoints = getBoundaryRangePoints;
  _exports.getXLimits = getXLimits;
  _exports.limitMessage = void 0;
  _enterpriseDark = _interopRequireDefault(_enterpriseDark);
  _highchartsMore = _interopRequireDefault(_highchartsMore);
  _highchartsMltk = _interopRequireDefault(_highchartsMltk);
  _options = _interopRequireDefault(_options);
  Messages = _interopRequireWildcard(Messages);
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  var MAX_DISTRIBUTIONS = _exports.MAX_DISTRIBUTIONS = 10;
  var NUM_DISTRIBUTION_BINS = _exports.NUM_DISTRIBUTION_BINS = 10;
  var limitMessage = _exports.limitMessage = (0, _format.sprintf)((0, _i18n.gettext)("The results in this visualization are truncated. This visualization displays a maximum of %d distributions."), MAX_DISTRIBUTIONS);

  /**
   * Highlight a series by setting it to its original color if it has a line and showing it otherwise
   * @param {Object} targetSeries The series to highlight
   */
  function highlightSeries(targetSeries) {
    var seriesGroup = (0, _visualizationUtil.getSeriesGroup)(targetSeries);
    seriesGroup.forEach(function (series) {
      if (series.graph != null) {
        series.graph.element.setAttribute('stroke', series.color);
      }
      if (series.area != null) {
        series.area.element.setAttribute('fill', series.color);
      }

      // set the fill of individual points to set the color of outlier points histogram bars, etc.
      series.data.forEach(function (hcPoint) {
        hcPoint.updateColor(series.color);
      });
    });
  }

  /**
   * Unhighlight a series by setting it to grayscale if it has a line and hiding it otherwise
   * @param {Object} targetSeries The series to unhighlight
   */
  function unHighlightSeries(targetSeries) {
    var seriesGroup = (0, _visualizationUtil.getSeriesGroup)(targetSeries);
    seriesGroup.forEach(function (series) {
      if (series.graph != null) {
        series.graph.element.setAttribute('stroke', _highchartsMltk.default.Color(_enterpriseDark.default.gray60).setOpacity(0.3).get('rgba'));
      }
      if (series.area != null) {
        // setting opacity to 0, but using the same color for consistency
        series.area.element.setAttribute('fill', _highchartsMltk.default.Color(_enterpriseDark.default.gray60).setOpacity(0).get('rgba'));
      }

      // unset the fill of individual points to clear the color of outlier points histogram bars, etc.
      series.data.forEach(function (hcPoint) {
        // setting opacity to 0, but using the same color for consistency
        hcPoint.updateColor(_highchartsMltk.default.Color(_enterpriseDark.default.gray60).setOpacity(0).get('rgba'));
      });
    });
  }

  /**
   * Filters the points inside the boundary range and orders them in a drawable order
   * @param {array} rows Rows of data in the form of { x, y }
   * @param {array} boundaryRange The boundary range as [left, right, percentage]
   */
  function getBoundaryRangePoints(rows, boundaryRange) {
    var boundaryRangePoints = [];
    rows.forEach(function (point) {
      if (point.x >= boundaryRange[0] && point.x <= boundaryRange[1]) {
        boundaryRangePoints.push([point.x, point.y]);
        // the order of the points matters, so we put half the points at the start
        // in reverse order so that this draws a square
        boundaryRangePoints.unshift([point.x, 0]);
      }
    });
    return boundaryRangePoints;
  }

  /**
   * Given rows of data, generates bins over the specified range and sorts the data into the bins
   * @param {array} rows Rows of data in the form of { x, y }
   * @param {array} numBins The number of bins to generate
   * @param {array} xMax The ending value of the last bin
   * @param {array} xMin The starting value of the first bin
   */
  function getBins(rows, numBins, xMax) {
    var xMin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    // initialize the bins
    // destructuring is necessary here because array methods won't
    // iterate correctly over arrays created via "new Array()"
    var bins = _toConsumableArray(new Array(numBins));
    var binWidth = (xMax - xMin) / numBins;
    rows.forEach(function (point) {
      var binNumber = Math.floor((point.x - xMin) / binWidth);
      if (point.x >= xMin && point.x <= xMax) {
        // the last point will always end up in its own bin
        // this will generate one more bin than we want
        // so we force it into the previous bin here
        if (binNumber === numBins) binNumber = numBins - 1;
        if (bins[binNumber] == null) bins[binNumber] = [];
        bins[binNumber].push(point);
      }
    });
    return {
      bins: bins,
      binWidth: binWidth
    };
  }

  /**
   * Generates columns coordinates for the bins
   * @param {array[]} bins An array of bins (each of which is an array)
   * @param {number} binWidth The width of the bins
   * @param {number} offset The amount to offset the columns from 0
   */
  function getBinColumns(bins, binWidth) {
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return bins.map(function (bin, binNumber) {
      return {
        x: binWidth * binNumber + offset,
        x2: binWidth * (binNumber + 1) + offset,
        y: bin != null ? bin.length : 0
      };
    });
  }

  /**
   * Given distributions of rows, calculate the overall min, max, and delta across them
   * @param {array} distributions See setSeries for contents
   */
  function getXLimits(distributions) {
    return distributions.reduce(function (xLimitsAccum, distribution) {
      var firstPoint = distribution.rows[0];
      var lastPoint = distribution.rows[distribution.rows.length - 1];
      var min = firstPoint != null && firstPoint.x < xLimitsAccum.min ? firstPoint.x : xLimitsAccum.min;
      var max = lastPoint != null && lastPoint.x > xLimitsAccum.max ? lastPoint.x : xLimitsAccum.max;
      var delta = max - min;
      return {
        min: min,
        max: max,
        delta: delta
      };
    }, {
      min: Infinity,
      max: -Infinity,
      delta: Infinity
    });
  }
  var DistributionPlot = _exports.default = /*#__PURE__*/function () {
    function DistributionPlot(containerEl) {
      _classCallCheck(this, DistributionPlot);
      (0, _highchartsMore.default)(_highchartsMltk.default);
      this.container = containerEl;
      this.highchartsWrapper = document.createElement('div');
      this.warningWrapper = document.createElement('div');
      this.warningWrapper.style.cssText = 'text-align: center, margin-left: 15px, visibility: hidden';
      this.warningMessageOn = false;
      Messages.setAlert(this.warningWrapper, limitMessage, 'warning', 'alert-inline');
      this.container.appendChild(this.highchartsWrapper);
      this.container.appendChild(this.warningWrapper);
      var chartOptions = {
        chart: {
          animation: false,
          renderTo: this.highchartsWrapper
        },
        legend: {
          align: 'right',
          itemMarginBottom: 3,
          itemStyle: {
            // prevent the multiple <tspan>s of each legend item from having spacing between them
            // which causes issues with mouseover events (because the <g> wrapper can't have mouseovers)
            lineHeight: '12px',
            // force the text to wrap
            textOverflow: null,
            width: 200
          },
          labelFormatter: function labelFormatter() {
            return this.name;
          },
          layout: 'vertical',
          verticalAlign: 'middle'
        },
        title: {
          text: ''
        },
        xAxis: [{
          title: {
            text: ''
          }
        }],
        yAxis: [{
          title: {
            text: ''
          }
        }, {
          opposite: true,
          title: {
            text: '',
            rotation: 270,
            margin: 20
          }
        }]
      };

      // not using $(el).highcharts() to avoid pulling in any Highcharts except the one explicitly loaded with RequireJS
      this.chart = new _highchartsMltk.default.Chart(chartOptions);
    }
    return _createClass(DistributionPlot, [{
      key: "setActiveSeries",
      value: function setActiveSeries(targetSeries) {
        this.primarySeries.forEach(function (series) {
          if (targetSeries == null || targetSeries === series) {
            highlightSeries(series);
          } else {
            unHighlightSeries(series);
          }
        });
      }

      /**
       * Render the series from the data
       * @param {object} data
       * @param {array} data.distributions The distributions within the data; a distribution is a group of points with the same values in its splitBy fields
       * @param {array} data.distributions[].boundaryRanges An array of boundary ranges of the form [left, right, percentage]
       * @param {string} data.distributions[].id The id of the distribution
       * @param {string} data.distributions[].name The name of the distribution
       * @param {array} data.distributions[].rows The rows within the distribution, assumed sorted by x-value
       * @param {number} data.distributions[].rows[].x
       * @param {number} data.distributions[].rows[].y
       * @param {boolean} data.distributions[].rows[].isOutlier
       * @param {object} options
       * @param {number} [options.colorIndexOffset=0] If specified, offset the first color index by this number
       * @param {boolean} options.isLoading Whether or not the plot is still waiting for data
       * @param {boolean} options.limitReached Whether or not to show a message that distribution limit has been exceeded
       * @param {boolean} options.showOutliers Whether or not to render outlier points
       * @param {boolean} options.showHistogram Whether or not to render the point count historgram
       * @param {boolean} options.showOutlierArea Whether or not to show the outlier area under the curve
       */
    }, {
      key: "setSeries",
      value: function setSeries(_ref) {
        var _this = this;
        var _ref$distributions = _ref.distributions,
          distributions = _ref$distributions === void 0 ? [] : _ref$distributions,
          _ref$fieldName = _ref.fieldName,
          fieldName = _ref$fieldName === void 0 ? '' : _ref$fieldName,
          _ref$pdFieldName = _ref.pdFieldName,
          pdFieldName = _ref$pdFieldName === void 0 ? '' : _ref$pdFieldName;
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$colorIndexOffse = _ref2.colorIndexOffset,
          colorIndexOffset = _ref2$colorIndexOffse === void 0 ? 0 : _ref2$colorIndexOffse,
          _ref2$isLoading = _ref2.isLoading,
          isLoading = _ref2$isLoading === void 0 ? null : _ref2$isLoading,
          _ref2$limitReached = _ref2.limitReached,
          limitReached = _ref2$limitReached === void 0 ? false : _ref2$limitReached,
          showOutliers = _ref2.showOutliers,
          showHistogram = _ref2.showHistogram,
          showOutlierArea = _ref2.showOutlierArea;
        var plotPointThreshold = _options.default.getOptionByName('plotPointThreshold');
        this.primarySeries = [];
        while (this.chart.series.length > 0) {
          this.chart.series[0].remove(false);
        }
        if (isLoading) {
          this.chart.showLoading();
          return;
        } else this.chart.hideLoading();
        var xLimits = getXLimits(distributions);
        distributions.forEach(function (distribution, index) {
          var color = (0, _colorPalette.getColorByIndex)(index + colorIndexOffset);
          var rows = showOutliers ? distribution.rows.map(function (row) {
            return _objectSpread({
              marker: {
                enabled: row.isOutlier,
                symbol: 'circle'
              }
            }, row);
          }) : distribution.rows;
          _this.primarySeries.push(_this.chart.addSeries({
            color: color,
            data: rows,
            downsample: {
              threshold: plotPointThreshold
            },
            events: {
              legendMouseOver: function legendMouseOver(e) {
                // don't do things if the series is not visible (ie. disabled in the legend)
                if (e.series.visible) {
                  _this.setActiveSeries(e.series);
                }
              },
              legendMouseOut: function legendMouseOut(e) {
                // don't do things if the series is not visible (ie. disabled in the legend)
                if (e.series.visible) {
                  _this.setActiveSeries();
                }
              },
              mouseOver: function mouseOver(e) {
                _this.setActiveSeries(e.target);
              },
              mouseOut: function mouseOut(e) {
                _this.setActiveSeries();
              }
            },
            id: distribution.id,
            name: "".concat(distribution.name, " (").concat(distribution.outlierCount, ")"),
            tooltip: {
              headerFormat: "<span style=\"color:{point.color}\">\u25CF</span><span style=\"font-size: 10px\">{series.name}</span><br/>",
              pointFormat: '<b>{series.xAxis.options.title.text}:</b> {point.x}<br/><b>{series.yAxis.options.title.text}:</b> {point.y}<br/>'
            },
            type: 'spline',
            turboThreshold: 0,
            yAxis: 0,
            zIndex: 2
          }, false));
          if (showOutlierArea) {
            distribution.boundaryRanges.forEach(function (boundaryRange) {
              var boundaryRangePoints = getBoundaryRangePoints(distribution.rows, boundaryRange);
              _this.chart.addSeries({
                animation: false,
                color: color,
                data: boundaryRangePoints,
                // prevent mouse interaction, these series are secondary and should not block interaction with the lines
                enableMouseTracking: false,
                id: "".concat(distribution.id, "-outlierArea"),
                linkedTo: distribution.id,
                type: 'polygon',
                yAxis: 0,
                zIndex: 2
              }, false);
            });
          }
          if (showHistogram && isFinite(xLimits.delta) && xLimits.delta > 0) {
            var _getBins = getBins(distribution.rows, NUM_DISTRIBUTION_BINS, xLimits.max, xLimits.min),
              bins = _getBins.bins,
              binWidth = _getBins.binWidth;
            _this.chart.addSeries({
              color: _highchartsMltk.default.Color(color).setOpacity(0.5).get('rgba'),
              data: getBinColumns(bins, binWidth, xLimits.min),
              // prevent mouse interaction, these series are secondary and should not block interaction with the lines
              enableMouseTracking: false,
              grouping: false,
              groupPadding: 0,
              fillOpacity: 0.1,
              name: distribution.name,
              pointPadding: 0,
              pointPlacement: 'between',
              pointRange: binWidth,
              linkedTo: distribution.id,
              tooltip: {
                headerFormat: "<span style=\"color:{point.color}\">\u25CF</span><span style=\"font-size: 10px\">{series.name}</span><br/>",
                pointFormat: '<b>{point.x} - {point.x2}:</b> {point.y}'
              },
              type: 'column',
              yAxis: 1,
              zIndex: 1
            }, false);
          }
        });

        // React doesn't play nicely with highcharts redrawing, so instead we toggle visibility
        // this.chart.reflow() nor window resize event seems to call reflow()
        if (limitReached) {
          this.warningWrapper.style.visibility = 'visible';
        } else {
          this.warningWrapper.style.visibility = 'hidden';
        }
        this.chart.xAxis[0].update({
          min: Math.min(xLimits.min, 0),
          max: xLimits.max,
          title: {
            text: fieldName
          }
        });
        this.chart.yAxis[0].update({
          title: {
            text: pdFieldName
          }
        });
        this.chart.yAxis[1].update({
          title: {
            text: (0, _format.sprintf)((0, _i18n.gettext)('count(%s)'), fieldName)
          }
        });
        this.chart.redraw();
      }
    }, {
      key: "reflow",
      value: function reflow() {
        if (this.chart != null) {
          this.highchartsWrapper.style.height = this.container.getBoundingClientRect().height - this.warningWrapper.getBoundingClientRect().height;
          this.chart.reflow();
        }
      }
    }]);
  }();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/SmartOutlierDetection.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("assistants/SmartOutlierDetection")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _SmartOutlierDetection) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _SmartOutlierDetection = _interopRequireDefault(_SmartOutlierDetection);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var SODRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Smart Outlier Detection'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.smartOutlierDetectionView) {
        // TODO: Properly handle the backbutton by not requiring the entire page to be re-instantiated.
        // This is a failsafe for now if the querystring gets updated and then the user clicks the backbutton.
        // In this case the DOM is guaranteed to be cleaned up. We have not yet confirmed that all listeners
        // will be cleaned up.
        this.smartOutlierDetectionView.remove();
      }
      this.smartOutlierDetectionView = new _SmartOutlierDetection.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = SODRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/util/confMLSpl.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/fetch.js"), __webpack_require__("./src/main/webapp/util/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esObjectToString, _esPromise, _config, _fetch, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getMLSPLConfig = getMLSPLConfig;
  function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  function getMLSPLConfig(_x) {
    return _getMLSPLConfig.apply(this, arguments);
  }
  function _getMLSPLConfig() {
    _getMLSPLConfig = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(appName) {
      var url, result;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            url = "".concat(_config.splunkdPath, "/servicesNS/").concat(_constants.NOBODY, "/").concat(_constants.SPLUNK_ML_TOOLKIT, "/properties/mlspl/").concat(appName, "?output_mode=json");
            _context.next = 3;
            return fetch(url, _objectSpread({}, _fetch.defaultFetchInit));
          case 3:
            result = _context.sent;
            return _context.abrupt("return", result.json());
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _getMLSPLConfig.apply(this, arguments);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "assistants/SmartOutlierDetection":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module, __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("shared/BaseSmartAssistant"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/SmartOutlierDetection.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartOutlierDetection/SmartOutlierContext.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _module, _PolymorphicExperiment, _BaseSmartAssistant, _SmartOutlierDetection, _SmartOutlierContext) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _BaseSmartAssistant = _interopRequireDefault(_BaseSmartAssistant);
  _SmartOutlierDetection = _interopRequireDefault(_SmartOutlierDetection);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _BaseSmartAssistant.default.extend({
    moduleId: _module.default.id,
    assistantComponent: _SmartOutlierDetection.default,
    assistantContext: {
      initialState: _SmartOutlierContext.initialState,
      reducer: _SmartOutlierContext.reducer
    },
    experimentType: _PolymorphicExperiment.default.TYPES.SMART_OUTLIER_DETECTION
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/smart_outlier_detection.es","pages_common"]]]);