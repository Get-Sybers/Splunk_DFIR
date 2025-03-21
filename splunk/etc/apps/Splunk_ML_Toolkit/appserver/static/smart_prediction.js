(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["smart_prediction"],{

/***/ "./node_modules/@splunk/react-icons/ChartColumn.js":
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
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
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

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChartColumn; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




/* eslint-disable max-len */

function ChartColumn(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2___default.a, _extends({
    screenReaderText: Object(_splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__["_"])('Column Chart'),
    viewBox: "0 0 1418 1500"
  }, props), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
    d: "M1042.808 1500h375V0h-375v1500zm-525 0h376.028V375H517.808v1125zM0 1500h371.918V752.055H0V1500z"
  }));
}

/***/ })

/******/ });

/***/ }),

/***/ "./node_modules/@splunk/react-icons/Question.js":
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
/******/ 	return __webpack_require__(__webpack_require__.s = 124);
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

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Question; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




/* eslint-disable max-len */

function Question(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_splunk_react_icons_SVGInternal__WEBPACK_IMPORTED_MODULE_2___default.a, _extends({
    screenReaderText: Object(_splunk_ui_utils_i18n__WEBPACK_IMPORTED_MODULE_1__["_"])('Question'),
    viewBox: "0 0 932 1500"
  }, props), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
    d: "M620.983 930.057c0-36.862 10.633-70.18 31.9-99.953C674.15 800.33 699.905 773.63 730.15 750c30.247-23.63 60.73-48.913 91.447-75.85 30.72-26.938 56.71-62.62 77.978-107.042 21.266-44.424 31.9-95.463 31.9-153.12 0-145.557-30.955-250.945-92.864-316.162C776.7 32.61 669.66 0 517.487 0H413.99C262.76 0 155.954 33.318 93.572 99.953 31.19 166.588 0 270.793 0 412.57c0 30.247 9.924 55.294 29.773 75.143 19.85 19.848 44.896 29.773 75.142 29.773h100.662c30.245 0 55.293-9.688 75.14-29.064 19.85-19.377 29.774-43.715 29.774-73.016 0-30.245 9.926-55.293 29.775-75.14 19.848-19.85 44.896-29.775 75.14-29.775H516.07c32.136 0 57.656 9.69 76.56 29.066 18.903 19.376 28.355 44.187 28.355 74.433 0 31.19-10.633 60.49-31.9 87.9-21.266 27.41-47.023 51.75-77.268 73.015-30.246 21.267-60.728 43.242-91.446 65.927-30.72 22.684-56.712 50.094-77.98 82.23-21.265 32.136-31.9 67.108-31.9 104.915v102.08c0 30.245 9.926 55.293 29.775 75.14 19.848 19.85 44.896 29.775 75.14 29.775H516.07c30.246 0 55.293-9.925 75.142-29.774 19.85-19.848 29.773-44.896 29.773-75.14zM466.446 1500c42.533 0 78.923-15.123 109.168-45.37 30.246-30.244 45.37-67.106 45.37-110.585 0-43.478-15.124-80.104-45.37-109.877-30.245-29.773-66.635-44.66-109.168-44.66-43.478 0-80.34 15.123-110.586 45.37-30.246 30.245-45.37 66.634-45.37 109.167 0 43.48 15.124 80.34 45.37 110.586 30.246 30.247 67.108 45.37 110.586 45.37z"
  }));
}

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = __webpack_require__("./node_modules/@splunk/react-icons/SVGInternal.js");

/***/ })

/******/ });

/***/ }),

/***/ "./node_modules/@splunk/react-ui/RadioList.js":
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
  return __webpack_require__(__webpack_require__.s = 101);
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
  /***/101: ( /***/function (module, __webpack_exports__, __webpack_require__) {
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

    // EXTERNAL MODULE: external "styled-components"
    var external_styled_components_ = __webpack_require__(3);
    var external_styled_components_default = /*#__PURE__*/__webpack_require__.n(external_styled_components_);

    // EXTERNAL MODULE: external "@splunk/react-ui/Switch"
    var Switch_ = __webpack_require__(35);
    var Switch_default = /*#__PURE__*/__webpack_require__.n(Switch_);

    // EXTERNAL MODULE: external "@splunk/react-ui/themes"
    var themes_ = __webpack_require__(0);

    // CONCATENATED MODULE: ./src/RadioList/OptionStyles.js

    var StyledSwitch = external_styled_components_default()(Switch_default.a).withConfig({
      displayName: "OptionStyles__StyledSwitch",
      componentId: "mltk-y7kg4r-0"
    })(["flex-shrink:1;margin-right:calc(", " * 2);"], Object(themes_["variable"])('spacing'));

    // CONCATENATED MODULE: ./src/RadioList/Option.jsx
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
    function _objectWithoutProperties(source, excluded) {
      if (source == null) return {};
      var target = _objectWithoutPropertiesLoose(source, excluded);
      var key, i;
      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
          target[key] = source[key];
        }
      }
      return target;
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
      return target;
    }
    var propTypes = {
      /** @private. This will be be passed to the Switch component untouched. */
      children: external_prop_types_default.a.node,
      /**
       * The selectable value. If this matches the ControlRadioList value, the item is selceted.
       */
      value: external_prop_types_default.a.any.isRequired
    };
    function Option(props) {
      var children = props.children,
        otherProps = _objectWithoutProperties(props, ["children"]);
      return external_react_default.a.createElement(StyledSwitch, _extends({
        "data-test": "option",
        appearance: "radio"
      }, otherProps), children);
    }
    Option.propTypes = propTypes;
    /* harmony default export */
    var RadioList_Option = Option;
    // EXTERNAL MODULE: external "@splunk/react-ui/Box"
    var Box_ = __webpack_require__(9);
    var Box_default = /*#__PURE__*/__webpack_require__.n(Box_);

    // CONCATENATED MODULE: ./src/RadioList/RadioListStyles.js

    var StyledBox = external_styled_components_default()(Box_default.a).withConfig({
      displayName: "RadioListStyles__StyledBox",
      componentId: "mltk-sc-1walsgb-0"
    })(["align-items:flex-start;flex-direction:", ";flex-wrap:wrap;"], function (props) {
      return props.appearance === 'horizontal' ? 'row' : 'column';
    });

    // CONCATENATED MODULE: ./src/RadioList/RadioList.jsx
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
    function RadioList_extends() {
      RadioList_extends = Object.assign || function (target) {
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
      return RadioList_extends.apply(this, arguments);
    }
    function RadioList_objectWithoutProperties(source, excluded) {
      if (source == null) return {};
      var target = RadioList_objectWithoutPropertiesLoose(source, excluded);
      var key, i;
      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
          target[key] = source[key];
        }
      }
      return target;
    }
    function RadioList_objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
      return target;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
          ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          }));
        }
        ownKeys.forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      }
      return target;
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
    var RadioList_RadioList = /*#__PURE__*/
    function (_Component) {
      _inherits(RadioList, _Component);
      function RadioList(props) {
        var _this;
        _classCallCheck(this, RadioList);
        _this = _possibleConstructorReturn(this, _getPrototypeOf(RadioList).call(this, props));
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleClick", function (e, data) {
          var name = _this.props.name;
          if (!_this.isControlled()) {
            _this.setState({
              value: data.value
            });
          }
          _this.props.onChange(e, _objectSpread({}, data, {
            name: name
          }));
        });
        _this.controlledExternally = Object(external_lodash_["has"])(props, 'value');
        _this.state = {
          value: props.defaultValue
        };
        if (false) {}
        if (false) {}
        return _this;
      }
      _createClass(RadioList, [{
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
          var _this$props = this.props,
            appearance = _this$props.appearance,
            children = _this$props.children,
            describedBy = _this$props.describedBy,
            disabled = _this$props.disabled,
            error = _this$props.error,
            labelledBy = _this$props.labelledBy,
            size = _this$props.size,
            value = _this$props.value,
            otherProps = RadioList_objectWithoutProperties(_this$props, ["appearance", "children", "describedBy", "disabled", "error", "labelledBy", "size", "value"]);
          var selectedValue = this.isControlled() ? value : this.state.value;
          var clonedChildren = external_react_["Children"].toArray(children).filter(external_react_["isValidElement"]).map(function (option, i) {
            return Object(external_react_["cloneElement"])(option, {
              selected: option.props.value === selectedValue,
              key: option.key || i,
              disabled: disabled || option.props.disabled,
              error: error,
              size: size,
              onClick: _this2.handleClick
            });
          });
          return external_react_default.a.createElement(StyledBox, RadioList_extends({
            flex: true,
            appearance: appearance,
            "data-test": "radio-list",
            "data-test-value": value,
            role: "radiogroup",
            "aria-labelledby": labelledBy,
            "aria-describedby": describedBy
          }, otherProps), clonedChildren);
        }
      }]);
      return RadioList;
    }(external_react_["Component"]);
    _defineProperty(RadioList_RadioList, "propTypes", {
      /** Changes the layout of the RadioList. */
      appearance: external_prop_types_default.a.oneOf(['horizontal', 'vertical']),
      /**
       * `children` should be `RadioList.Option`s.
       */
      children: external_prop_types_default.a.node,
      /**
       * Set this property instead of value to make value uncontrolled. */
      defaultValue: external_prop_types_default.a.any,
      /**
       * The id of the description. When placed in a ControlGroup, this is automatically set to the
       * ControlGroup's help component.
       */
      describedBy: external_prop_types_default.a.string,
      disabled: external_prop_types_default.a.bool,
      /**
       * Invoked with the DOM element when the component mounts, and null when it unmounts.
       */
      elementRef: external_prop_types_default.a.func,
      /**
       * Highlight the field as having an error. The buttons and labels will turn red.
       */
      error: external_prop_types_default.a.bool,
      /**
       * The id of the label. When placed in a ControlGroup, this is automatically set to the
       * ControlGroup's label.
       */
      labelledBy: external_prop_types_default.a.string,
      /** The name is returned with onChange events, which can be used to identify the
       * control when multiple controls share an onChange callback. */
      name: external_prop_types_default.a.string,
      /**
       * A callback to receive the change events.
       * If value is set, this callback is required. This must set the value prop to retain the
       * change.
       */
      onChange: external_prop_types_default.a.func,
      /** The size of the text label. */
      size: external_prop_types_default.a.oneOf(['small', 'medium']),
      /** The current selected value.  Setting this value makes the property controlled. A
       * callback is required. */
      value: external_prop_types_default.a.any
    });
    _defineProperty(RadioList_RadioList, "defaultProps", {
      appearance: 'vertical',
      disabled: false,
      error: false,
      onChange: function onChange() {},
      size: 'medium'
    });
    _defineProperty(RadioList_RadioList, "Option", RadioList_Option);

    /* harmony default export */
    var src_RadioList_RadioList = RadioList_RadioList;

    // CONCATENATED MODULE: ./src/RadioList/index.js
    /* concated harmony reexport */
    __webpack_require__.d(__webpack_exports__, "default", function () {
      return src_RadioList_RadioList;
    });
    /* concated harmony reexport */
    __webpack_require__.d(__webpack_exports__, "Option", function () {
      return RadioList_Option;
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
  /***/35: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/Switch.js");

    /***/
  }),
  /***/4: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/lodash/lodash.js");

    /***/
  }),
  /***/9: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/Box.js");

    /***/
  })

  /******/
});

/***/ }),

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/smart_prediction.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/SmartPrediction.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_SmartPrediction, _swcMltk) {
  "use strict";

  _SmartPrediction = _interopRequireDefault(_SmartPrediction);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _SmartPrediction.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/ExperimentSummary/ExperimentSummary.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentContext/ExperimentContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/shared/JSXString.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentSummary/ExperimentSummary.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentSummary/FieldNames.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayConcat, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _i18n, _constants, _ExperimentContext, _util, _constants2, _JSXString, _ExperimentSummary, _FieldNames) {
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
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * Natural language summary of the experiment.
 * Hangs out under the experiment title bar.
 * Displays whenever it has enough information to generate its content (requires the postProcessing steps to run)
 */
  var summaryText = (0, _i18n.gettext)('Predict %{MODE} field %{TARGETS} using %{FEATURES} with training/testing split %{SPLIT}');
  var nameMapper = function nameMapper(key) {
    return _defineProperty(_defineProperty({}, _constants2.CATEGORICAL_MODE, (0, _i18n.gettext)('categorical')), _constants2.NUMERIC_MODE, (0, _i18n.gettext)('numerical'))[key] || '';
  };
  var propTypes = {
    assistantContext: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape({}), _propTypes.default.func.isRequired])).isRequired,
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        searchStages: _propTypes.default.array.isRequired,
        postprocessingStages: _propTypes.default.array
      })
    }).isRequired
  };
  var ExperimentSummary = function ExperimentSummary(_ref) {
    var experiment = _ref.experiment,
      assistantContext = _ref.assistantContext;
    var _assistantContext = _slicedToArray(assistantContext, 1),
      predictionMode = _assistantContext[0].predictionMode;
    var searchStages = experiment.data.searchStages;
    var searchStagesDone = (0, _util.isAllStageDataReady)(searchStages);
    var mainStage = (0, _util.getStagesByRole)(searchStages, _constants.STAGE_ROLES.MAIN)[0];
    if (!searchStagesDone || !mainStage || !mainStage.algorithmParams || predictionMode == null) {
      return null;
    }
    var testSplitRatio = mainStage.algorithmParams.test_split_ratio;
    var testValue = Math.round(testSplitRatio * 100);
    var split = "".concat(100 - testValue, "/").concat(testValue);
    var vars = {
      TARGETS: /*#__PURE__*/_react.default.createElement(_FieldNames.default, {
        "data-test": "targets",
        fields: mainStage.targetVariables
      }),
      MODE: /*#__PURE__*/_react.default.createElement(_ExperimentSummary.Variable, {
        "data-test": "mode"
      }, nameMapper(predictionMode)),
      FEATURES: /*#__PURE__*/_react.default.createElement(_FieldNames.default, {
        "data-test": "features",
        fields: mainStage.featureVariables
      }),
      SPLIT: /*#__PURE__*/_react.default.createElement(_ExperimentSummary.Variable, {
        "data-test": "split"
      }, split)
    };
    return /*#__PURE__*/_react.default.createElement(_ExperimentSummary.SummaryHeading, {
      "data-test": "experiment-summary-sp"
    }, /*#__PURE__*/_react.default.createElement(_JSXString.default, {
      string: summaryText,
      vars: vars
    }));
  };
  ExperimentSummary.propTypes = propTypes;
  var _default = _exports.default = (0, _ExperimentContext.withExperimentContext)(ExperimentSummary);
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/SmartPrediction.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentContainer/ExperimentContainer.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Define.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/Learn.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Operationalize.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/Review.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/ExperimentSummary/ExperimentSummary.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _i18n, _swcMltk, _constants, _ExperimentContainer, _Define, _Learn, _Operationalize, _Review, _ExperimentSummary) {
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
  _Operationalize = _interopRequireDefault(_Operationalize);
  _Review = _interopRequireDefault(_Review);
  _ExperimentSummary = _interopRequireDefault(_ExperimentSummary);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var titleStr = (0, _i18n.gettext)('Smart Prediction: %s');
  var WizardSteps = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _constants.STEP_DEFINE, _Define.default), _constants.STEP_LEARN, _Learn.default), _constants.STEP_REVIEW, _Review.default), _constants.STEP_OPERATIONALIZE, _Operationalize.default);
  var propTypes = {
    experimentContext: _propTypes.default.shape({
      experiment: _propTypes.default.shape({
        data: _propTypes.default.object,
        changeMainStage: _propTypes.default.func.isRequired
      }).isRequired
    }).isRequired
  };
  var SmartPrediction = function SmartPrediction(props) {
    var experiment = props.experimentContext.experiment;
    var title = experiment.data ? _swcMltk.splunkUtil.sprintf(titleStr, experiment.data.title) : '';
    return /*#__PURE__*/_react.default.createElement(_ExperimentContainer.default, _extends({
      ExperimentSummary: _ExperimentSummary.default,
      title: title,
      WizardSteps: WizardSteps
    }, props));
  };
  SmartPrediction.propTypes = propTypes;
  var _default = _exports.default = SmartPrediction;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/SmartPredictionContext.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/context/assistant.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _assistant, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.reducer = _exports.initialState = void 0;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * This file is responsible for maintaining global state within the context of SmartPrediction.
 */
  var initialState = _exports.initialState = _objectSpread(_objectSpread({}, _assistant.initialState), {}, {
    predictionMode: null
  });
  var reducer = _exports.reducer = function reducer(state, action) {
    switch (action.type) {
      case _constants.ASSISTANT_ACTIONS.SET_PREDICTION_MODE:
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            predictionMode: action.payload
          });
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

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Define.jsx":
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

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ConfusionMatrix/ConfusionMatrix.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.assign.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/util.es"), __webpack_require__("./src/main/webapp/components/shared/SPLModal/SPLModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/useDrilldown.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Controls/Controls.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomVizControls/CustomVizControls.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ConfusionMatrix/ConfusionMatrix.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectAssign, _react, _propTypes, _i18n, _format, _themes, _swcMltk, _util, _constants, _util2, _SPLModal, _useDrilldown2, _Controls, _StageStatusWrapper, _CustomViz, _CustomVizControls, _ConfusionMatrix) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _SPLModal = _interopRequireDefault(_SPLModal);
  _useDrilldown2 = _interopRequireDefault(_useDrilldown2);
  _Controls = _interopRequireDefault(_Controls);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _CustomVizControls = _interopRequireDefault(_CustomVizControls);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  var _mvcUtils$getPageInfo = _swcMltk.mvcUtils.getPageInfo(),
    appName = _mvcUtils$getPageInfo.app;
  var propTypes = {
    experiment: _propTypes.default.shape({
      getDrilldownInfo: _propTypes.default.func.isRequired,
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          searchManagerId: _propTypes.default.string,
          id: _propTypes.default.string
        }))
      }),
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired,
      getMainStage: _propTypes.default.func.isRequired
    }).isRequired,
    viewMode: _propTypes.default.string,
    onViewModeChange: _propTypes.default.func
  };
  var defaultProps = {
    viewMode: _constants.ALL_DATA_VALUE,
    onViewModeChange: function onViewModeChange() {}
  };
  var ConfusionMatrix = function ConfusionMatrix(_ref) {
    var experiment = _ref.experiment,
      viewMode = _ref.viewMode,
      onViewModeChange = _ref.onViewModeChange;
    var confusionMatrixTrainingStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CONFUSION_MATRIX_TRAINING_STAGE_ID);
    var confusionMatrixTestStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CONFUSION_MATRIX_TEST_STAGE_ID);
    var _useDrilldown = (0, _useDrilldown2.default)({
        experiment: experiment,
        vizOptions: {
          category: 'custom',
          type: "".concat(appName, ".HeatmapViz")
        }
      }),
      modalTitle = _useDrilldown.modalTitle,
      modalState = _useDrilldown.modalState,
      handleMenuClick = _useDrilldown.handleMenuClick,
      handleModalClose = _useDrilldown.handleModalClose;
    var testTitle = (0, _i18n.gettext)('Testing Confusion Matrix');
    var trainingTitle = (0, _i18n.gettext)('Training Confusion Matrix');
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: [confusionMatrixTrainingStage, confusionMatrixTestStage]
    }, /*#__PURE__*/_react.default.createElement(_Controls.default, {
      experiment: experiment,
      hasSPLDrilldown: false,
      onViewModeChange: onViewModeChange,
      viewMode: viewMode
    }), /*#__PURE__*/_react.default.createElement(_ConfusionMatrix.ContentWrapper, null, (0, _util2.experimentHasTestRow)(experiment) && (viewMode === _constants.ALL_DATA_VALUE || viewMode === _constants.TEST_VALUE) && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CustomVizControls.default, {
      compact: true,
      "data-test": "test-viz-controls",
      onMenuClick: handleMenuClick({
        stage: confusionMatrixTestStage,
        title: testTitle
      }),
      title: testTitle
    }), /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: confusionMatrixTestStage.searchManagerId,
      namespacedOptions: {
        seriesColor: [{
          index: 1,
          color: (0, _themes.variable)('diverging5ColorB')({})
        }]
      },
      viewId: "heatmapTestViz",
      vizType: "HeatmapViz"
    })), (viewMode === _constants.ALL_DATA_VALUE || viewMode === _constants.TRAINING_VALUE) && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CustomVizControls.default, {
      compact: true,
      "data-test": "training-viz-controls",
      onMenuClick: handleMenuClick({
        stage: confusionMatrixTrainingStage,
        title: testTitle
      }),
      title: trainingTitle
    }), /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: confusionMatrixTrainingStage.searchManagerId,
      namespacedOptions: {
        seriesColor: [{
          index: 1,
          color: (0, _themes.variable)('accentColorD10')({})
        }]
      },
      viewId: "heatmapTrainingViz",
      vizType: "HeatmapViz"
    }))), /*#__PURE__*/_react.default.createElement(_SPLModal.default, _extends({
      linkText: (0, _format.sprintf)((0, _i18n.gettext)('View %s in a heatmap chart.'), modalTitle)
    }, modalState, {
      onRequestClose: handleModalClose
    })));
  };
  ConfusionMatrix.propTypes = propTypes;
  ConfusionMatrix.defaultProps = defaultProps;
  var _default = _exports.default = ConfusionMatrix;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ConfusionMatrix/ConfusionMatrix.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ContentWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var ContentWrapper = _exports.ContentWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin: 0 15px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Controls/Controls.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./node_modules/@splunk/react-ui/RadioList.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/util.es"), __webpack_require__("./src/main/webapp/components/shared/DrilldownMenu/DrilldownMenu.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Controls/Controls.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _ColumnLayout, _RadioList, _i18n, _constants, _util, _DrilldownMenu, _Controls) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _RadioList = _interopRequireDefault(_RadioList);
  _DrilldownMenu = _interopRequireDefault(_DrilldownMenu);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    experiment: _propTypes.default.shape({}).isRequired,
    viewMode: _propTypes.default.string.isRequired,
    onViewModeChange: _propTypes.default.func,
    hasSPLDrilldown: _propTypes.default.bool,
    onMenuClick: _propTypes.default.func
  };
  var defaultProps = {
    onViewModeChange: function onViewModeChange() {},
    hasSPLDrilldown: true,
    onMenuClick: function onMenuClick() {}
  };
  var Controls = function Controls(_ref) {
    var viewMode = _ref.viewMode,
      onViewModeChange = _ref.onViewModeChange,
      hasSPLDrilldown = _ref.hasSPLDrilldown,
      onMenuClick = _ref.onMenuClick,
      experiment = _ref.experiment;
    return (0, _util.experimentHasTestRow)(experiment) ? /*#__PURE__*/_react.default.createElement(_ColumnLayout.default, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 11
    }, /*#__PURE__*/_react.default.createElement(_Controls.StyledControlGroup, {
      label: (0, _i18n.gettext)('View data for'),
      labelWidth: 100
    }, /*#__PURE__*/_react.default.createElement(_RadioList.default, {
      appearance: "horizontal",
      onChange: onViewModeChange,
      value: viewMode
    }, /*#__PURE__*/_react.default.createElement(_RadioList.default.Option, {
      value: _constants.ALL_DATA_VALUE
    }, (0, _i18n.gettext)('All')), /*#__PURE__*/_react.default.createElement(_RadioList.default.Option, {
      value: _constants.TRAINING_VALUE
    }, (0, _i18n.gettext)('Training')), /*#__PURE__*/_react.default.createElement(_RadioList.default.Option, {
      value: _constants.TEST_VALUE
    }, (0, _i18n.gettext)('Testing'))))), /*#__PURE__*/_react.default.createElement(_Controls.ShowSPLColumn, {
      span: 1
    }, hasSPLDrilldown && /*#__PURE__*/_react.default.createElement(_DrilldownMenu.default, {
      onClick: onMenuClick
    })))) : null;
  };
  Controls.propTypes = propTypes;
  Controls.defaultProps = defaultProps;
  var _default = _exports.default = Controls;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Controls/Controls.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _ControlGroup, _ColumnLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledControlGroup = _exports.ShowSPLColumn = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledControlGroup = _exports.StyledControlGroup = (0, _styledComponents.default)(_ControlGroup.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin: 15px 0 10px 20px;\n    > [data-test='label'] {\n        text-align: left;\n    }\n"])));
  var ShowSPLColumn = _exports.ShowSPLColumn = (0, _styledComponents.default)(_ColumnLayout.default.Column)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/EvaluateTab.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./node_modules/@splunk/react-ui/RadioBar.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Statistics/Statistics.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ConfusionMatrix/ConfusionMatrix.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ScatterPlot/ScatterPlot.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Histogram/Histogram.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/context/withMultipleModes/withMultipleModes.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/EvaluateTab.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayMap, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _ColumnLayout, _RadioBar, _constants, _Statistics, _ConfusionMatrix, _ScatterPlot, _Histogram, _withMultipleModes, _util, _StageStatusWrapper, _EvaluateTab) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _RadioBar = _interopRequireDefault(_RadioBar);
  _Statistics = _interopRequireDefault(_Statistics);
  _ConfusionMatrix = _interopRequireDefault(_ConfusionMatrix);
  _ScatterPlot = _interopRequireDefault(_ScatterPlot);
  _Histogram = _interopRequireDefault(_Histogram);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
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
  var numericStageIds = [_constants.RSQUARED_STAGE_ID, _constants.RMSE_STAGE_ID];
  var numericPostProcessingStageIds = [_constants.SCATTER_PLOT_STAGE_ID, _constants.HISTOGRAM_STAGE_ID];
  var categoricalStageIds = [_constants.CLASSIFICATION_STATS_STAGE_ID];
  var categoricalPostProcessingStageIds = [_constants.CONFUSION_MATRIX_TRAINING_STAGE_ID, _constants.CONFUSION_MATRIX_TEST_STAGE_ID];
  var contentMapper = function contentMapper(_ref, _ref2) {
    var experiment = _ref.experiment;
    var viewMode = _ref2.viewMode,
      handleViewModeChange = _ref2.handleViewModeChange;
    return _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _constants.STATISTICS, /*#__PURE__*/_react.default.createElement(_Statistics.default, {
      experiment: experiment,
      onViewModeChange: handleViewModeChange,
      viewMode: viewMode
    })), _constants.SCATTER_PLOT, /*#__PURE__*/_react.default.createElement(_ScatterPlot.default, {
      experiment: experiment,
      onViewModeChange: handleViewModeChange,
      viewMode: viewMode
    })), _constants.HISTOGRAM, /*#__PURE__*/_react.default.createElement(_Histogram.default, {
      experiment: experiment,
      onViewModeChange: handleViewModeChange,
      viewMode: viewMode
    })), _constants.CONFUSION_MATRIX, /*#__PURE__*/_react.default.createElement(_ConfusionMatrix.default, {
      experiment: experiment,
      onViewModeChange: handleViewModeChange,
      viewMode: viewMode
    }));
  };
  var propTypes = {
    assistantContext: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape({}), _propTypes.default.func])).isRequired,
    onViewModeChangeContext: _propTypes.default.func,
    radioList: _propTypes.default.arrayOf(_propTypes.default.shape({})),
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          searchManagerId: _propTypes.default.string
        }))
      }),
      getMainStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired
    }).isRequired
  };
  var defaultProps = {
    onViewModeChangeContext: function onViewModeChangeContext() {},
    radioList: []
  };
  var EvaluateTab = function EvaluateTab(props) {
    var onViewModeChangeContext = props.onViewModeChangeContext,
      radioList = props.radioList,
      experiment = props.experiment,
      _props$assistantConte = _slicedToArray(props.assistantContext, 2),
      dispatch = _props$assistantConte[1];
    var _useState = (0, _react.useState)(_constants.STATISTICS),
      _useState2 = _slicedToArray(_useState, 2),
      chart = _useState2[0],
      setChart = _useState2[1];
    var _useState3 = (0, _react.useState)(_constants.ALL_DATA_VALUE),
      _useState4 = _slicedToArray(_useState3, 2),
      viewMode = _useState4[0],
      setViewMode = _useState4[1];
    var modelSummary = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.MODEL_SUMMARY_STAGE_ID);
    var runPostprocessingStage = experiment.runPostprocessingStage;
    var mainStageGuid = experiment.getMainStage().guid;

    // when we reach this point, determine if the experiment is numeric or categorical
    (0, _react.useEffect)(function () {
      if (modelSummary.parsedData != null) {
        var mode = modelSummary.parsedData.mode;
        if (mode != null) {
          dispatch({
            type: _constants.ASSISTANT_ACTIONS.SET_PREDICTION_MODE,
            payload: mode
          });
          if (mode === _constants.NUMERIC_MODE) {
            runPostprocessingStage(numericStageIds);
            runPostprocessingStage(numericPostProcessingStageIds, {
              afterStageGuid: mainStageGuid
            });
          } else {
            runPostprocessingStage(categoricalStageIds);
            runPostprocessingStage(categoricalPostProcessingStageIds, {
              afterStageGuid: mainStageGuid
            });
          }
        }
      }
    }, [dispatch, mainStageGuid, modelSummary.parsedData, runPostprocessingStage]);

    // #region callbacks
    var handleChartChange = function handleChartChange(e, _ref4) {
      var value = _ref4.value;
      setChart(value);
    };
    var handleViewModeChange = function handleViewModeChange() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var value = args[1].value;
      onViewModeChangeContext.apply(void 0, args);
      setViewMode(value);
    };
    // #endregion callbacks

    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: modelSummary
    }, /*#__PURE__*/_react.default.createElement(_EvaluateTab.Wrapper, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, null, /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 3
    }), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 6
    }, /*#__PURE__*/_react.default.createElement(_RadioBar.default, {
      onChange: handleChartChange,
      value: chart
    }, radioList.map(function (_ref5) {
      var icon = _ref5.icon,
        label = _ref5.label,
        value = _ref5.value;
      return /*#__PURE__*/_react.default.createElement(_RadioBar.default.Option, {
        key: value,
        "data-test": value,
        icon: icon,
        label: label,
        value: value
      });
    }))), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 3
    }))), /*#__PURE__*/_react.default.createElement(_EvaluateTab.ContentWrapper, null, contentMapper(props, {
      viewMode: viewMode,
      handleViewModeChange: handleViewModeChange
    })[chart])));
  };
  EvaluateTab.propTypes = propTypes;
  EvaluateTab.defaultProps = defaultProps;
  var _default = _exports.default = (0, _withMultipleModes.withMultipleModes)(EvaluateTab);
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/EvaluateTab.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Wrapper = _exports.ContentWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var Wrapper = _exports.Wrapper = _styledComponents.default.section(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 10px 0 0 0;\n"])));
  var ContentWrapper = _exports.ContentWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    border-top: 1px solid ", ";\n    margin: 10px 0 0 0 ;\n"])), (0, _themes.variable)('gray92'));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Histogram/Histogram.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/util/forms.es"), __webpack_require__("./src/main/webapp/components/shared/SPLModal/SPLModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/useDrilldown.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Controls/Controls.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Histogram/Histogram.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _react, _propTypes, _tinycolor, _i18n, _swcMltk, _constants, _forms, _SPLModal, _useDrilldown2, _Controls, _StageStatusWrapper, _util, _CustomViz, _Histogram) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _tinycolor = _interopRequireDefault(_tinycolor);
  _SPLModal = _interopRequireDefault(_SPLModal);
  _useDrilldown2 = _interopRequireDefault(_useDrilldown2);
  _Controls = _interopRequireDefault(_Controls);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _CustomViz = _interopRequireDefault(_CustomViz);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var _mvcUtils$getPageInfo = _swcMltk.mvcUtils.getPageInfo(),
    appName = _mvcUtils$getPageInfo.app;
  var getFilteredSearchString = function getFilteredSearchString(viewMode) {
    return viewMode !== _constants.ALL_DATA_VALUE ? "| table ".concat((0, _forms.escape)(_constants.RESIDUAL_ERROR_LABEL), " ").concat((0, _forms.escape)(viewMode)) : '';
  };
  var OPACITY = 0.5;
  var colorMapper = _defineProperty(_defineProperty({}, _constants.TRAINING_VALUE, (0, _tinycolor.default)(_constants.TRAINING_COLOR).setAlpha(OPACITY).toRgbString()), _constants.TEST_VALUE, (0, _tinycolor.default)(_constants.TEST_COLOR).setAlpha(OPACITY).toRgbString());
  var propTypes = {
    experiment: _propTypes.default.shape({
      getDrilldownInfo: _propTypes.default.func.isRequired,
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          searchManagerId: _propTypes.default.string
        }))
      }),
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired,
      getMainStage: _propTypes.default.func.isRequired
    }).isRequired,
    viewMode: _propTypes.default.string,
    onViewModeChange: _propTypes.default.func
  };
  var defaultProps = {
    viewMode: _constants.ALL_DATA_VALUE,
    onViewModeChange: function onViewModeChange() {}
  };
  var Histogram = function Histogram(_ref) {
    var experiment = _ref.experiment,
      onViewModeChange = _ref.onViewModeChange,
      viewMode = _ref.viewMode;
    var histogramStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.HISTOGRAM_STAGE_ID);
    var histogramFilteredStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.HISTOGRAM_FILTERED_STAGE_ID);
    var _useDrilldown = (0, _useDrilldown2.default)({
        experiment: experiment,
        vizOptions: {
          category: 'custom',
          type: "".concat(appName, ".HistogramViz")
        }
      }),
      modalState = _useDrilldown.modalState,
      handleMenuClick = _useDrilldown.handleMenuClick,
      handleModalClose = _useDrilldown.handleModalClose;
    var runFilteredStage = function runFilteredStage() {
      experiment.changePostprocessingStage(_constants.HISTOGRAM_FILTERED_STAGE_ID, {
        searchString: getFilteredSearchString(viewMode)
      });
      experiment.runPostprocessingStage(_constants.HISTOGRAM_FILTERED_STAGE_ID, {
        afterStageGuid: histogramStage.guid
      });
    };
    (0, _react.useEffect)(function () {
      runFilteredStage();
      /* eslint-disable react-hooks/exhaustive-deps */
      // re-run search when viewMode changes only
    }, [viewMode]);
    /* eslint-enable react-hooks/exhaustive-deps */

    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: histogramStage
    }, /*#__PURE__*/_react.default.createElement(_Controls.default, {
      experiment: experiment,
      hasSPLDrilldown: true,
      onMenuClick: handleMenuClick({
        stage: histogramStage,
        additionalSPL: getFilteredSearchString(viewMode)
      }),
      onViewModeChange: onViewModeChange,
      viewMode: viewMode
    }), /*#__PURE__*/_react.default.createElement(_Histogram.MarginWrapper, null, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: histogramFilteredStage.searchManagerId,
      namespacedOptions: {
        maxOpacity: OPACITY,
        stacking: true,
        stackingMode: 'overlap',
        showLegend: true,
        yAxisLabel: (0, _i18n.gettext)('Sample Count'),
        colorMapper: colorMapper,
        legendAlign: 'bottom'
      },
      viewId: "histogramViz",
      vizType: "HistogramViz"
    })), /*#__PURE__*/_react.default.createElement(_SPLModal.default, _extends({
      linkText: (0, _i18n.gettext)('View the data in a histogram chart.')
    }, modalState, {
      onRequestClose: handleModalClose
    })));
  };
  Histogram.propTypes = propTypes;
  Histogram.defaultProps = defaultProps;
  var _default = _exports.default = Histogram;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Histogram/Histogram.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MarginWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var MarginWrapper = _exports.MarginWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin: 0 10px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ScatterPlot/ScatterPlot.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/util/forms.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/util/formatters/compactTemplateString.es"), __webpack_require__("./src/main/webapp/components/shared/SPLModal/SPLModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/useDrilldown.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Controls/Controls.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ScatterPlot/ScatterPlot.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayMap, _react, _propTypes, _Select, _ColumnLayout, _i18n, _swcMltk, _forms, _util, _constants, _CustomViz, _compactTemplateString, _SPLModal, _useDrilldown2, _Controls, _StageStatusWrapper, _ScatterPlot) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Select = _interopRequireDefault(_Select);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _compactTemplateString = _interopRequireDefault(_compactTemplateString);
  _SPLModal = _interopRequireDefault(_SPLModal);
  _useDrilldown2 = _interopRequireDefault(_useDrilldown2);
  _Controls = _interopRequireDefault(_Controls);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var _mvcUtils$getPageInfo = _swcMltk.mvcUtils.getPageInfo(),
    appName = _mvcUtils$getPageInfo.app;
  var getFilteredSearchString = function getFilteredSearchString(viewMode, xAxis, yAxis) {
    var filterString = viewMode !== _constants.ALL_DATA_VALUE ? "| where ".concat(_constants.SPLIT_FROM_SPL, "=").concat((0, _forms.escape)(viewMode)) : '';
    return (0, _compactTemplateString.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["| table ", " ", " ", "\n    ", ""])), (0, _forms.escape)(_constants.SPLIT_FROM_SPL), (0, _forms.escape)(xAxis), (0, _forms.escape)(yAxis), filterString);
  };
  var colorMapper = _defineProperty(_defineProperty({}, _constants.TRAINING_VALUE, _constants.TRAINING_COLOR), _constants.TEST_VALUE, _constants.TEST_COLOR);
  var propTypes = {
    experiment: _propTypes.default.shape({
      getDrilldownInfo: _propTypes.default.func.isRequired,
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          searchManagerId: _propTypes.default.string,
          id: _propTypes.default.string
        }))
      }),
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired,
      getMainStage: _propTypes.default.func.isRequired
    }).isRequired,
    viewMode: _propTypes.default.string,
    onViewModeChange: _propTypes.default.func
  };
  var defaultProps = {
    viewMode: _constants.ALL_DATA_VALUE,
    onViewModeChange: function onViewModeChange() {}
  };
  var ScatterPlot = function ScatterPlot(_ref) {
    var experiment = _ref.experiment,
      viewMode = _ref.viewMode,
      onViewModeChange = _ref.onViewModeChange;
    var _experiment$getMainSt = experiment.getMainStage(),
      _experiment$getMainSt2 = _slicedToArray(_experiment$getMainSt.targetVariables, 1),
      targetVariable = _experiment$getMainSt2[0],
      featureVariables = _experiment$getMainSt.featureVariables;
    var predictedVariable = "predicted(".concat(targetVariable, ")");
    var scatterPlotStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.SCATTER_PLOT_STAGE_ID);
    var scatterPlotFilteredStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.SCATTER_PLOT_FILTERED_STAGE_ID);
    var _useState = (0, _react.useState)(predictedVariable),
      _useState2 = _slicedToArray(_useState, 2),
      yAxis = _useState2[0],
      setYAxis = _useState2[1];
    var _useState3 = (0, _react.useState)(targetVariable),
      _useState4 = _slicedToArray(_useState3, 2),
      xAxis = _useState4[0],
      setXAxis = _useState4[1];
    var _useDrilldown = (0, _useDrilldown2.default)({
        experiment: experiment,
        vizOptions: {
          category: 'custom',
          type: "".concat(appName, ".ScatterLineViz")
        }
      }),
      modalState = _useDrilldown.modalState,
      handleMenuClick = _useDrilldown.handleMenuClick,
      handleModalClose = _useDrilldown.handleModalClose;
    var showIdentityLine = yAxis === predictedVariable && xAxis === targetVariable;
    var runFilteredStage = function runFilteredStage(_xAxis, _yAxis) {
      experiment.changePostprocessingStage(_constants.SCATTER_PLOT_FILTERED_STAGE_ID, {
        searchString: getFilteredSearchString(viewMode, _xAxis, _yAxis)
      });
      experiment.runPostprocessingStage(_constants.SCATTER_PLOT_FILTERED_STAGE_ID, {
        afterStageGuid: scatterPlotStage.guid
      });
    };
    (0, _react.useEffect)(function () {
      runFilteredStage(xAxis, yAxis);
      /* eslint-disable react-hooks/exhaustive-deps */
      // re-run search when viewMode changes only
    }, [viewMode]);
    /* eslint-enable react-hooks/exhaustive-deps */

    var handleYAxisChange = function handleYAxisChange(e, _ref2) {
      var value = _ref2.value;
      runFilteredStage(xAxis, value);
      setYAxis(value);
    };
    var handleXAxisChange = function handleXAxisChange(e, _ref3) {
      var value = _ref3.value;
      runFilteredStage(value, yAxis);
      setXAxis(value);
    };
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: scatterPlotStage
    }, /*#__PURE__*/_react.default.createElement(_Controls.default, {
      experiment: experiment,
      hasSPLDrilldown: true,
      onMenuClick: handleMenuClick({
        stage: scatterPlotStage,
        additionalSPL: getFilteredSearchString(viewMode, xAxis, yAxis)
      }),
      onViewModeChange: onViewModeChange,
      viewMode: viewMode
    }), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default, null, /*#__PURE__*/_react.default.createElement(_ScatterPlot.StyledRow, null, /*#__PURE__*/_react.default.createElement(_ScatterPlot.ControlsColumn, {
      span: 2
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "y-axis-select",
      onChange: handleYAxisChange,
      value: yAxis
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: predictedVariable,
      value: predictedVariable
    }), /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('residual'),
      value: _constants.RESIDUAL_FIELD_NAME
    }))), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Column, {
      span: 10
    }, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: scatterPlotFilteredStage.searchManagerId,
      namespacedOptions: {
        identityLine: showIdentityLine,
        legendAlign: 'right',
        showAxisLabels: false,
        colorMapper: colorMapper
      },
      viewId: "scatterLineViz",
      vizType: "ScatterLineViz"
    }))), /*#__PURE__*/_react.default.createElement(_ColumnLayout.default.Row, null, /*#__PURE__*/_react.default.createElement(_ScatterPlot.NoMarginCenteredColumn, {
      span: 2
    }), /*#__PURE__*/_react.default.createElement(_ScatterPlot.NoMarginCenteredColumn, {
      span: 10
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "x-axis-select",
      onChange: handleXAxisChange,
      value: xAxis
    }, [targetVariable].concat(_toConsumableArray(featureVariables)).map(function (featureVariable) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: featureVariable,
        label: featureVariable,
        value: featureVariable
      });
    }))))), /*#__PURE__*/_react.default.createElement(_SPLModal.default, _extends({
      linkText: (0, _i18n.gettext)('View the data in a scatter plot.')
    }, modalState, {
      onRequestClose: handleModalClose
    })));
  };
  ScatterPlot.propTypes = propTypes;
  ScatterPlot.defaultProps = defaultProps;
  var _default = _exports.default = ScatterPlot;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/ScatterPlot/ScatterPlot.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/ColumnLayout.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _ColumnLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledRow = _exports.NoMarginCenteredColumn = _exports.ControlsColumn = _exports.CenteredColumn = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _ColumnLayout = _interopRequireDefault(_ColumnLayout);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledRow = _exports.StyledRow = (0, _styledComponents.default)(_ColumnLayout.default.Row)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin: 0 !important;\n"])));
  var CenteredColumn = _exports.CenteredColumn = (0, _styledComponents.default)(_ColumnLayout.default.Column)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: center;\n    align-items: center;\n"])));
  var ControlsColumn = _exports.ControlsColumn = (0, _styledComponents.default)(CenteredColumn)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    margin: 0 0 0 15px !important;\n"])));
  var NoMarginCenteredColumn = _exports.NoMarginCenteredColumn = (0, _styledComponents.default)(CenteredColumn)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    margin: 0 !important;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Statistics/Statistics.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/shared/SPLModal/SPLModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/util.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/DrilldownMenu/DrilldownMenu.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/context/withMultipleModes/withMultipleModes.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/useDrilldown.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Controls/Controls.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Statistics/Statistics.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayMap, _react, _propTypes, _i18n, _format, _Card, _swcMltk, _SPLModal, _constants, _util, _StageStatusWrapper, _CustomViz, _DrilldownMenu, _withMultipleModes, _useDrilldown2, _Controls, _Statistics) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Card = _interopRequireDefault(_Card);
  _SPLModal = _interopRequireDefault(_SPLModal);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _DrilldownMenu = _interopRequireDefault(_DrilldownMenu);
  _useDrilldown2 = _interopRequireDefault(_useDrilldown2);
  _Controls = _interopRequireDefault(_Controls);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var CHARTING_FIELD_COLORS = _swcMltk.mvc.tokenSafe("{".concat(_constants.TRAINING_VALUE, ": '").concat(_constants.TRAINING_COLOR, "', ").concat(_constants.TEST_VALUE, ": '").concat(_constants.TEST_COLOR, "'}"));
  var columnOptions = {
    type: 'column',
    height: 450,
    'charting.axisTitleX.visibility': 'collapsed',
    'charting.axisTitleY.visibility': 'collapsed',
    'charting.chart.showDataLabels': 'all',
    'charting.legend.placement': 'bottom',
    'charting.fieldColors': CHARTING_FIELD_COLORS,
    'charting.chart.columnSpacing': 30,
    'charting.drilldown': 'none'
  };
  var propTypes = {
    experiment: _propTypes.default.shape({
      getDrilldownInfo: _propTypes.default.func.isRequired,
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          searchManagerId: _propTypes.default.string
        }))
      })
    }).isRequired,
    viewMode: _propTypes.default.string,
    columnOptions: _propTypes.default.shape({}),
    stages: _propTypes.default.arrayOf(_propTypes.default.shape({
      main: _propTypes.default.shape({})
    })),
    onViewModeChange: _propTypes.default.func
  };
  var defaultProps = {
    viewMode: _constants.ALL_DATA_VALUE,
    columnOptions: {},
    stages: [],
    onViewModeChange: function onViewModeChange() {}
  };
  var Statistics = function Statistics(_ref) {
    var experiment = _ref.experiment,
      viewMode = _ref.viewMode,
      stages = _ref.stages,
      columnOptionsFromProps = _ref.columnOptions,
      onViewModeChange = _ref.onViewModeChange;
    var _useDrilldown = (0, _useDrilldown2.default)({
        experiment: experiment,
        vizOptions: {
          category: 'charting',
          type: 'column'
        },
        splOptions: {
          excludeDataSource: true,
          excludeMainStage: true,
          excludePreprocessingStages: true
        }
      }),
      modalTitle = _useDrilldown.modalTitle,
      modalState = _useDrilldown.modalState,
      handleMenuClick = _useDrilldown.handleMenuClick,
      handleModalClose = _useDrilldown.handleModalClose;
    return /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      stage: stages.map(function (_ref2) {
        var main = _ref2.main;
        return main;
      })
    }, /*#__PURE__*/_react.default.createElement(_Controls.default, {
      experiment: experiment,
      hasSPLDrilldown: false,
      onViewModeChange: onViewModeChange,
      viewMode: viewMode
    }), /*#__PURE__*/_react.default.createElement(_Statistics.StyledCardLayout, null, stages.map(function (_ref3) {
      var main = _ref3.main,
        filtered = _ref3.filtered,
        title = _ref3.title,
        vizId = _ref3.vizId;
      return /*#__PURE__*/_react.default.createElement(_Card.default, {
        key: title
      }, /*#__PURE__*/_react.default.createElement(_Statistics.StyledCardHeader, {
        title: title
      }, /*#__PURE__*/_react.default.createElement(_Statistics.DrilldownWrapper, null, /*#__PURE__*/_react.default.createElement(_DrilldownMenu.default, {
        onClick: handleMenuClick({
          stage: main,
          title: title,
          additionalSPL: (0, _util.filteredStatisticsSearchString)(viewMode)
        })
      }))), /*#__PURE__*/_react.default.createElement(_Card.default.Body, null, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
        managerId: viewMode === _constants.ALL_DATA_VALUE ? main.searchManagerId : filtered.searchManagerId,
        options: _objectSpread(_objectSpread({}, columnOptions), columnOptionsFromProps),
        viewId: vizId,
        vizConstructor: _swcMltk.ChartView
      })));
    })), /*#__PURE__*/_react.default.createElement(_SPLModal.default, _extends({
      linkText: (0, _format.sprintf)((0, _i18n.gettext)('View %s in a column chart.'), modalTitle)
    }, modalState, {
      onRequestClose: handleModalClose
    })));
  };
  Statistics.propTypes = propTypes;
  Statistics.defaultProps = defaultProps;
  var _default = _exports.default = (0, _withMultipleModes.withMultipleModes)(Statistics);
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/Statistics/Statistics.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/CardLayout.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _CardLayout, _Card) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledCardLayout = _exports.StyledCardHeader = _exports.DrilldownWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _CardLayout = _interopRequireDefault(_CardLayout);
  _Card = _interopRequireDefault(_Card);
  var _templateObject, _templateObject2, _templateObject3;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledCardLayout = _exports.StyledCardLayout = (0, _styledComponents.default)(_CardLayout.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding-top: 0 !important;\n"])));
  var StyledCardHeader = _exports.StyledCardHeader = (0, _styledComponents.default)(_Card.default.Header)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    align-items: center;\n"])));
  var DrilldownWrapper = _exports.DrilldownWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: flex-end;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/useDrilldown.es":
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
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
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
  var useDrilldown = function useDrilldown() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      experiment = _ref.experiment,
      _ref$vizOptions = _ref.vizOptions,
      vizOptions = _ref$vizOptions === void 0 ? {} : _ref$vizOptions,
      _ref$splOptions = _ref.splOptions,
      splOptions = _ref$splOptions === void 0 ? {} : _ref$splOptions;
    var _useState = (0, _react.useState)(function () {
        return experiment.getDrilldownInfo({
          vizOptions: vizOptions,
          splOptions: splOptions
        });
      }),
      _useState2 = _slicedToArray(_useState, 2),
      _useState2$ = _useState2[0],
      modalComments = _useState2$.splCommentsArray,
      modalSPL = _useState2$.splArray,
      modalUrl = _useState2$.searchUrl,
      setDrilldownInfo = _useState2[1];
    var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      modalOpen = _useState4[0],
      setModalOpen = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      modalTitle = _useState6[0],
      setModalTitle = _useState6[1];
    var handleMenuClick = function handleMenuClick() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$stage = _ref2.stage,
        _ref2$stage2 = _ref2$stage === void 0 ? {} : _ref2$stage,
        id = _ref2$stage2.id,
        _ref2$title = _ref2.title,
        title = _ref2$title === void 0 ? '' : _ref2$title,
        _ref2$additionalSPL = _ref2.additionalSPL,
        additionalSPL = _ref2$additionalSPL === void 0 ? '' : _ref2$additionalSPL;
      return function (action) {
        var newDrilldownInfo = experiment.getDrilldownInfo({
          vizOptions: vizOptions,
          splOptions: _objectSpread(_objectSpread({}, splOptions), {}, {
            appendPostprocessingStageId: id || undefined
          }),
          additionalSPL: additionalSPL ? [additionalSPL] : []
        });
        setDrilldownInfo(newDrilldownInfo);
        setModalTitle(title);
        if (action === _constants.DRILLDOWN_ACTIONS.openInSearch) {
          var searchUrl = newDrilldownInfo.searchUrl;
          window.open(searchUrl, '_blank');
        } else if (action === _constants.DRILLDOWN_ACTIONS.showSPL) {
          setModalOpen(true);
        }
      };
    };
    var handleModalClose = function handleModalClose() {
      setModalOpen(false);
    };
    return {
      modalTitle: modalTitle,
      modalState: {
        modalComments: modalComments,
        modalSPL: modalSPL,
        modalUrl: modalUrl,
        open: modalOpen
      },
      handleMenuClick: handleMenuClick,
      handleModalClose: handleModalClose
    };
  };
  var _default = _exports.default = useDrilldown;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/Learn.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.assign.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/shared/TrainingFraction/TrainingFraction.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/LearnContainer/LearnContainer.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/Fit/FitWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/SearchStage/FieldSelector/FieldSelector.jsx"), __webpack_require__("./src/main/webapp/data/algorithmSchemas/loadSchema.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Learn/EvaluateTab/EvaluateTab.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectAssign, _react, _i18n, _TrainingFraction, _util, _constants, _LearnContainer, _FitWrapper, _FieldSelector, _loadSchema, _EvaluateTab) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _TrainingFraction = _interopRequireDefault(_TrainingFraction);
  _LearnContainer = _interopRequireDefault(_LearnContainer);
  _FitWrapper = _interopRequireDefault(_FitWrapper);
  _FieldSelector = _interopRequireDefault(_FieldSelector);
  _loadSchema = _interopRequireDefault(_loadSchema);
  _EvaluateTab = _interopRequireDefault(_EvaluateTab);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  var getStageRenderers = function getStageRenderers(stage) {
    var title = stage.algorithm;
    var submitText = (0, _i18n.gettext)('Preprocess');
    if ((0, _util.checkStageState)(stage, {
      type: _constants.STAGE_TYPES.FIT
    })) {
      var renderMethod;
      switch (stage.algorithm) {
        case 'AutoPrediction':
          {
            var AutoPredictionSchema = (0, _loadSchema.default)('AutoPrediction');
            renderMethod = function renderMethod(params) {
              return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({
                algorithmParamRenderers: {
                  test_split_ratio: function test_split_ratio(props) {
                    return /*#__PURE__*/_react.default.createElement(_TrainingFraction.default, props);
                  }
                },
                schema: AutoPredictionSchema
              }, params));
            };
            submitText = (0, _i18n.gettext)('Predict');
            title = (0, _i18n.gettext)('Predict field');
            break;
          }
        case 'PCA':
          {
            var PCASchema = (0, _loadSchema.default)('PCA');
            renderMethod = function renderMethod(params) {
              return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({
                schema: PCASchema
              }, params));
            };
            break;
          }
        case 'KernelPCA':
          {
            var KernelPCASchema = (0, _loadSchema.default)('KernelPCA');
            renderMethod = function renderMethod(params) {
              return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({
                schema: KernelPCASchema
              }, params));
            };
            break;
          }
        case 'FieldSelector':
          {
            var FieldSelectorSchema = (0, _loadSchema.default)('FieldSelector');
            renderMethod = function renderMethod(params) {
              return /*#__PURE__*/_react.default.createElement(_FieldSelector.default, _extends({
                schema: FieldSelectorSchema
              }, params));
            };
            break;
          }
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
    label: (0, _i18n.gettext)('FieldSelector'),
    data: {
      type: 'fit',
      algorithm: 'FieldSelector'
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

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Operationalize.jsx":
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
  var title = (0, _i18n.gettext)('Operationalize Prediction');
  var modelTitle = (0, _i18n.gettext)('Publish Prediction Models');
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

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/PredictorImportance/PredictorImportance.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/PredictorImportance/PredictorImportance.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _swcMltk, _util, _CustomViz, _StageStatusWrapper, _constants, _PredictorImportance) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array]),
          status: _propTypes.default.string
        }))
      })
    }).isRequired
  };
  var PredictorImportance = function PredictorImportance(_ref) {
    var experiment = _ref.experiment;
    var predictorImportanceStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.PREDICTOR_IMPORTANCE_STAGE_ID);
    return /*#__PURE__*/_react.default.createElement(_PredictorImportance.ContentWrapper, null, /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      "data-test": "spa-predictor-importance-stage",
      stage: predictorImportanceStage
    }, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
      managerId: predictorImportanceStage.searchManagerId,
      options: {
        'charting.axisTitleX.visibility': 'collapsed',
        'charting.axisTitleY.visibility': 'collapsed',
        'charting.chart.showDataLabels': 'all',
        'charting.legend.placement': 'none',
        'charting.drilldown': 'none',
        height: 500,
        type: 'bar'
      },
      viewId: "predictorImportanceViz",
      vizConstructor: _swcMltk.ChartView
    })));
  };
  PredictorImportance.propTypes = propTypes;
  var _default = _exports.default = PredictorImportance;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/PredictorImportance/PredictorImportance.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/mixins.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _mixins) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ContentWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var ContentWrapper = _exports.ContentWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    ", "\n"])), _mixins.assistantContentWrapper);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/Review.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/shared/RadioGroup/RadioGroup.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/Wizard/WizardStep.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/Wizard/WizardStepTitleBar.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/icons/BarChart.jsx"), __webpack_require__("./src/main/webapp/components/icons/WhatIfAnalysisIcon.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/PredictorImportance/PredictorImportance.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/Review.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfAnalysis.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esDateToPrimitive, _esNumberConstructor, _react, _propTypes, _Card, _Tooltip, _i18n, _RadioGroup, _WizardStep, _WizardStepTitleBar, _Review, _BarChart, _WhatIfAnalysisIcon, _constants, _PredictorImportance, _Review2, _WhatIfAnalysis) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Card = _interopRequireDefault(_Card);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _RadioGroup = _interopRequireDefault(_RadioGroup);
  _WizardStep = _interopRequireDefault(_WizardStep);
  _WizardStepTitleBar = _interopRequireDefault(_WizardStepTitleBar);
  _BarChart = _interopRequireDefault(_BarChart);
  _WhatIfAnalysisIcon = _interopRequireDefault(_WhatIfAnalysisIcon);
  _PredictorImportance = _interopRequireDefault(_PredictorImportance);
  _WhatIfAnalysis = _interopRequireDefault(_WhatIfAnalysis);
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
      getMainStage: _propTypes.default.func.isRequired
    }).isRequired
  };
  var title = (0, _i18n.gettext)('Review Experiment');
  var predictorImportanceTooltip = (0, _i18n.gettext)('View a summary of the model based on selections made in the Learn step.');
  var whatIfAnalysisTooltip = (0, _i18n.gettext)('Adjust field values to examine and compare different model scenarios.');
  var contentMapper = function contentMapper(props) {
    return _defineProperty(_defineProperty({}, _constants.PREDICTOR_IMPORTANCE, /*#__PURE__*/_react.default.createElement(_PredictorImportance.default, props)), _constants.WHAT_IF_ANALYSIS, /*#__PURE__*/_react.default.createElement(_WhatIfAnalysis.default, props));
  };
  var Review = function Review(_ref2) {
    var experiment = _ref2.experiment;
    var _useState = (0, _react.useState)(_constants.PREDICTOR_IMPORTANCE),
      _useState2 = _slicedToArray(_useState, 2),
      content = _useState2[0],
      setContent = _useState2[1];
    var handleCardClick = function handleCardClick(value) {
      return function () {
        return setContent(value);
      };
    };
    return /*#__PURE__*/_react.default.createElement(_WizardStep.default, {
      header: /*#__PURE__*/_react.default.createElement(_WizardStepTitleBar.default, {
        title: title
      })
    }, /*#__PURE__*/_react.default.createElement(_Review.FlexWrapper, null, /*#__PURE__*/_react.default.createElement(_Review.ReviewWrapper, null, /*#__PURE__*/_react.default.createElement(_Review.MainPanel, null, /*#__PURE__*/_react.default.createElement(_RadioGroup.default, null, /*#__PURE__*/_react.default.createElement(_Review.ReviewCardLayout, null, /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
      "data-test": _constants.PREDICTOR_IMPORTANCE,
      defaultSelected: true,
      onClick: handleCardClick(_constants.PREDICTOR_IMPORTANCE)
    }, /*#__PURE__*/_react.default.createElement(_Card.default.Header, {
      title: (0, _i18n.gettext)('Predictor Importance')
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: predictorImportanceTooltip
    })), /*#__PURE__*/_react.default.createElement(_Review2.CardBody, null, /*#__PURE__*/_react.default.createElement(_BarChart.default, null))), /*#__PURE__*/_react.default.createElement(_RadioGroup.default.Card, {
      "data-test": _constants.WHAT_IF_ANALYSIS,
      onClick: handleCardClick(_constants.WHAT_IF_ANALYSIS)
    }, /*#__PURE__*/_react.default.createElement(_Card.default.Header, {
      title: (0, _i18n.gettext)('What-If Analysis')
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: whatIfAnalysisTooltip
    })), /*#__PURE__*/_react.default.createElement(_Review2.CardBody, null, /*#__PURE__*/_react.default.createElement(_WhatIfAnalysisIcon.default, null))))))), /*#__PURE__*/_react.default.createElement(_Review.ContentWrapper, null, contentMapper({
      experiment: experiment
    })[content])));
  };
  Review.propTypes = propTypes;
  var _default = _exports.default = Review;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/Review.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Card.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Card) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CardBody = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Card = _interopRequireDefault(_Card);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  // Smaller icons than usual to save vertical space
  var CardBody = _exports.CardBody = (0, _styledComponents.default)(_Card.default.Body)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    & svg {\n        display: block;\n        margin: auto;\n        width: 40px;\n        height: 40px;\n    }\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldListItem/FieldListItem.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.number.to-fixed.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Number.js"), __webpack_require__("./node_modules/@splunk/react-ui/RadioList.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/shared/usePrevious/usePrevious.es"), __webpack_require__("./src/main/webapp/util/formatters/numberFormatters.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldListItem/FieldListItem.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esNumberToFixed, _react, _propTypes, _Number2, _RadioList, _Select, _Tooltip, _format, _i18n, _constants, _usePrevious, _numberFormatters, _FieldListItem) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Number2 = _interopRequireDefault(_Number2);
  _RadioList = _interopRequireDefault(_RadioList);
  _Select = _interopRequireDefault(_Select);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _usePrevious = _interopRequireDefault(_usePrevious);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
    dispatch: _propTypes.default.func.isRequired,
    fieldValues: _propTypes.default.shape({
      availableValues: _propTypes.default.arrayOf(_propTypes.default.string),
      max: _propTypes.default.number,
      median: _propTypes.default.number,
      middle: _propTypes.default.number,
      min: _propTypes.default.number,
      mostFreq: _propTypes.default.string,
      sliderStep: _propTypes.default.number,
      type: _propTypes.default.string.isRequired
    }).isRequired,
    headerTitle: _propTypes.default.string.isRequired,
    initialContentValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
    setVariableChosen: _propTypes.default.func.isRequired,
    sliderStep: _propTypes.default.number,
    variableChosen: _propTypes.default.string
  };
  var defaultProps = {
    sliderStep: undefined,
    variableChosen: null
  };

  /**
   * Arbitrary small number chosen past 2 decimal places
   * We use this to format the displayValue of the slider to look nicer.
   * However on really small numbers, we can't know where it'll end so we just let it be
   */
  var smallNumThreshold = 0.009;
  var FieldListItem = function FieldListItem(_ref) {
    var dispatch = _ref.dispatch,
      fieldValues = _ref.fieldValues,
      headerTitle = _ref.headerTitle,
      initialContentValue = _ref.initialContentValue,
      setVariableChosen = _ref.setVariableChosen,
      sliderStep = _ref.sliderStep,
      variableChosen = _ref.variableChosen;
    var isNumerical = fieldValues.type === _constants.NUMERICAL;
    var _useState = (0, _react.useState)(initialContentValue),
      _useState2 = _slicedToArray(_useState, 2),
      contentValue = _useState2[0],
      setContentValue = _useState2[1];
    var prevContentValue = (0, _usePrevious.default)(contentValue);
    var disabled = headerTitle === variableChosen;
    var onlyOneNumber, content, max, min;
    if (isNumerical) {
      // This check is here to prevent Slider component from rendering when min === max
      max = fieldValues.max;
      min = fieldValues.min;
      onlyOneNumber = max === min;
    }
    var contentOnChange = function contentOnChange(e, _ref2) {
      var value = _ref2.value;
      setContentValue(value);
      if (value !== prevContentValue) {
        dispatch({
          payload: _defineProperty({}, headerTitle, {
            isNumerical: isNumerical,
            value: value
          }),
          type: _constants.UPDATE_FIELDS
        });
      }
    };
    if (isNumerical) {
      content = onlyOneNumber ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", null, (0, _format.sprintf)((0, _i18n.gettext)('Only one available value: %d'), min)), /*#__PURE__*/_react.default.createElement(_FieldListItem.NumberWrapper, null, /*#__PURE__*/_react.default.createElement(_Number2.default, {
        disabled: true,
        value: contentValue
      }))) : /*#__PURE__*/_react.default.createElement(_FieldListItem.NumericalContentWrapper, null, /*#__PURE__*/_react.default.createElement(_FieldListItem.SliderWrapper, null, /*#__PURE__*/_react.default.createElement(_FieldListItem.SliderMinLabel, null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        content: min
      }, /*#__PURE__*/_react.default.createElement(_FieldListItem.SliderLabelValue, {
        disabled: disabled
      }, (0, _numberFormatters.safeAbbreviateNumber)(min)))), /*#__PURE__*/_react.default.createElement(_FieldListItem.ItemSlider, {
        disabled: disabled,
        displayValue: contentValue > smallNumThreshold ? contentValue.toFixed(2) : contentValue,
        max: max,
        maxLabel: null,
        min: min,
        minLabel: null,
        onChange: contentOnChange,
        step: sliderStep,
        value: contentValue
      }), /*#__PURE__*/_react.default.createElement(_FieldListItem.SliderMaxLabel, null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        content: max
      }, /*#__PURE__*/_react.default.createElement(_FieldListItem.SliderLabelValue, {
        disabled: disabled
      }, (0, _numberFormatters.safeAbbreviateNumber)(max))))), /*#__PURE__*/_react.default.createElement(_FieldListItem.NumberWrapper, null, /*#__PURE__*/_react.default.createElement(_Number2.default, {
        disabled: disabled,
        max: max,
        min: min,
        onChange: contentOnChange,
        step: sliderStep,
        value: contentValue
      })));
    } else {
      var availableValues = fieldValues.availableValues;
      onlyOneNumber = false;
      content = /*#__PURE__*/_react.default.createElement(_Select.default, {
        filter: true,
        onChange: contentOnChange,
        value: contentValue
      }, availableValues.map(function (val) {
        return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
          key: val,
          disabled: disabled,
          label: val,
          value: val
        });
      }));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_FieldListItem.ItemHeader, {
      "data-test": "field-list-item-header",
      "data-test-value": headerTitle
    }, /*#__PURE__*/_react.default.createElement(_FieldListItem.HeaderTitle, null, headerTitle), /*#__PURE__*/_react.default.createElement(_RadioList.default, {
      disabled: onlyOneNumber,
      onChange: setVariableChosen,
      value: variableChosen
    }, /*#__PURE__*/_react.default.createElement(_RadioList.default.Option, {
      value: headerTitle
    }))), /*#__PURE__*/_react.default.createElement(_FieldListItem.ItemContent, {
      "data-test": "field-list-item-content",
      "data-test-value": headerTitle
    }, content));
  };
  FieldListItem.defaultProps = defaultProps;
  FieldListItem.propTypes = propTypes;
  var _default = _exports.default = FieldListItem;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldListItem/FieldListItem.styles.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Slider.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Slider, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SliderWrapper = _exports.SliderMinLabel = _exports.SliderMaxLabel = _exports.SliderLabelValue = _exports.NumericalContentWrapper = _exports.NumberWrapper = _exports.ItemSlider = _exports.ItemHeader = _exports.ItemContent = _exports.HeaderTitle = void 0;
  _styledComponents = _interopRequireWildcard(_styledComponents);
  _Slider = _interopRequireDefault(_Slider);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var NumberWrapper = _exports.NumberWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    max-width: 20%;\n    margin-left: 30px;\n"])));
  var HeaderTitle = _exports.HeaderTitle = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    padding-left: 10px;\n"])));
  var ItemContent = _exports.ItemContent = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    padding: 10px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n"])));
  var ItemHeader = _exports.ItemHeader = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    background-color: ", ";\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    height: 40px;\n"])), (0, _themes.variable)('gray92'));
  var ItemSlider = _exports.ItemSlider = (0, _styledComponents.default)(_Slider.default)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    padding-right: 45px;\n    flex: 4;\n"])));
  var SliderLabelValue = _exports.SliderLabelValue = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    ", "\n"])), function (props) {
    return props.disabled && (0, _styledComponents.css)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["color: ", ""])), (0, _themes.variable)('gray92'));
  });
  var SliderMaxLabel = _exports.SliderMaxLabel = _styledComponents.default.div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    flex: 1;\n"])));
  var SliderMinLabel = _exports.SliderMinLabel = _styledComponents.default.div(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    flex: 1;\n    margin-left: 5px;\n"])));
  var NumericalContentWrapper = _exports.NumericalContentWrapper = _styledComponents.default.div(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: space-between;\n    width: 100%;\n"])));
  var SliderWrapper = _exports.SliderWrapper = _styledComponents.default.div(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    width: 100%;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldVariableList.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldVariableList.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldListItem/FieldListItem.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayMap, _esDateToPrimitive, _esNumberConstructor, _esObjectEntries, _esObjectKeys, _react, _propTypes, _Button, _Tooltip, _i18n, _constants, _util, _FieldVariableList, _FieldListItem) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _FieldListItem = _interopRequireDefault(_FieldListItem);
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
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array])
        }))
      }),
      runPostprocessingStage: _propTypes.default.func
    }).isRequired,
    listData: _propTypes.default.shape({}),
    mode: _propTypes.default.string,
    setDrilldownSPL: _propTypes.default.func.isRequired,
    setVariableChosen: _propTypes.default.func.isRequired,
    setWhatIfClicked: _propTypes.default.func.isRequired,
    variableChosen: _propTypes.default.string
  };
  var defaultProps = {
    listData: {},
    mode: null,
    variableChosen: null
  };
  var fieldTitle = (0, _i18n.gettext)('Field');
  var variableTitle = (0, _i18n.gettext)('Variable');
  var variableTooltip = (0, _i18n.gettext)('Select a field to adjust values. Click the What-If button to generate model scenario.');
  var fieldVariableListReducer = function fieldVariableListReducer(state, action) {
    switch (action.type) {
      case _constants.UPDATE_FIELDS:
        return _objectSpread(_objectSpread({}, state), action.payload);
      default:
        return state;
    }
  };
  var FieldVariableList = function FieldVariableList(_ref) {
    var experiment = _ref.experiment,
      listData = _ref.listData,
      mode = _ref.mode,
      setDrilldownSPL = _ref.setDrilldownSPL,
      setVariableChosen = _ref.setVariableChosen,
      setWhatIfClicked = _ref.setWhatIfClicked,
      variableChosen = _ref.variableChosen;
    var _useReducer = (0, _react.useReducer)(fieldVariableListReducer, {}),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      fieldListValues = _useReducer2[0],
      dispatch = _useReducer2[1];
    var chosenVarData = variableChosen && {
      variableChosen: variableChosen,
      varListData: listData[variableChosen]
    };
    var initialFieldListValues = {};
    var fieldListItems = Object.entries(listData).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        fieldName = _ref3[0],
        fieldValues = _ref3[1];
      var contentVal, sliderStepValue;
      var isNumerical = fieldValues.type === _constants.NUMERICAL;
      if (!isNumerical) {
        contentVal = fieldValues.mostFreq;
      } else if (isNumerical) {
        var middle = fieldValues.middle,
          sliderStep = fieldValues.sliderStep;
        contentVal = middle;
        sliderStepValue = sliderStep;
      }
      initialFieldListValues[fieldName] = {
        isNumerical: isNumerical,
        value: contentVal
      };
      return /*#__PURE__*/_react.default.createElement(_FieldListItem.default, {
        key: fieldName,
        dispatch: dispatch,
        fieldValues: fieldValues,
        headerTitle: fieldName,
        initialContentValue: contentVal,
        setVariableChosen: setVariableChosen,
        sliderStep: sliderStepValue,
        variableChosen: variableChosen
      });
    });
    if (Object.keys(fieldListValues).length === 0) {
      dispatch({
        payload: initialFieldListValues,
        type: _constants.UPDATE_FIELDS
      });
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_FieldVariableList.ListHeader, null, /*#__PURE__*/_react.default.createElement(_FieldVariableList.FieldTitle, null, fieldTitle), /*#__PURE__*/_react.default.createElement(_FieldVariableList.VariableWrapper, null, /*#__PURE__*/_react.default.createElement(_FieldVariableList.VariableTitle, null, variableTitle), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: variableTooltip
    }))), /*#__PURE__*/_react.default.createElement(_FieldVariableList.ListWrapper, null, /*#__PURE__*/_react.default.createElement(_FieldVariableList.ListContent, null, fieldListItems)), /*#__PURE__*/_react.default.createElement(_FieldVariableList.WhatIfButton, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      label: (0, _i18n.gettext)('What-If'),
      onClick: function onClick() {
        var _getWhatIfAnalysisSPL = (0, _util.getWhatIfAnalysisSPL)(experiment, fieldListValues, chosenVarData, mode),
          drilldownSPL = _getWhatIfAnalysisSPL.drilldownSPL,
          inputSPL = _getWhatIfAnalysisSPL.searchString;
        experiment.runPostprocessingStage(_constants.WHAT_IF_ANALYSIS_VIZ_STAGE_ID, {
          inputSPL: inputSPL
        });
        if (drilldownSPL != null) setDrilldownSPL(drilldownSPL);
        // Set to a nonVariable for if the user chooses to not select a variable
        setWhatIfClicked(variableChosen || _constants.NON_VARIABLE);
      }
    })));
  };
  FieldVariableList.defaultProps = defaultProps;
  FieldVariableList.propTypes = propTypes;
  var _default = _exports.default = FieldVariableList;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldVariableList.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WhatIfButton = _exports.VariableWrapper = _exports.VariableTitle = _exports.ListWrapper = _exports.ListHeader = _exports.ListContent = _exports.FieldTitle = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var FieldTitle = _exports.FieldTitle = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    font-weight: 500;\n    padding-left: 10px;\n"])));
  var VariableTitle = _exports.VariableTitle = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    padding-right: 10px;\n"])));
  var VariableWrapper = _exports.VariableWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    display: flex;\n    padding-right: 20px;\n"])));
  var ListHeader = _exports.ListHeader = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    min-height: 40px;\n    flex: 0 0 auto;\n"])));
  var WhatIfButton = _exports.WhatIfButton = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    flex: 0 0 auto;\n    align-self: flex-end;\n    margin: 10px;\n"])));
  var ListWrapper = _exports.ListWrapper = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    flex: 1 1 100%;\n    position: relative;\n"])));
  var ListContent = _exports.ListContent = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    overflow: auto;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfAnalysis.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/shared/Drawer/Drawer.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("shared/controls/DrilldownLinker"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/FieldVariableList/FieldVariableList.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfAnalysis.styles.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfDetail/WhatIfDetail.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _util, _Drawer, _StageStatusWrapper, _constants, _DrilldownLinker, _FieldVariableList, _WhatIfAnalysis, _WhatIfDetail) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.MemoizedWhatIfDetail = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Drawer = _interopRequireDefault(_Drawer);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  _FieldVariableList = _interopRequireDefault(_FieldVariableList);
  _WhatIfDetail = _interopRequireDefault(_WhatIfDetail);
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
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          parsedData: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.number, _propTypes.default.array]),
          status: _propTypes.default.string
        }))
      }),
      getSearchInfo: _propTypes.default.func
    }).isRequired
  };
  var shouldDetailRender = function shouldDetailRender(prevProps, nextProps) {
    return prevProps.detailData === nextProps.detailData && prevProps.whatIfClicked === nextProps.whatIfClicked;
  };
  var MemoizedWhatIfDetail = _exports.MemoizedWhatIfDetail = /*#__PURE__*/_react.default.memo(_WhatIfDetail.default, shouldDetailRender);
  var WhatIfAnalysis = function WhatIfAnalysis(_ref) {
    var _modelSummaryStage$pa;
    var experiment = _ref.experiment;
    var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      variableChosen = _useState2[0],
      setVariableChosen = _useState2[1];
    var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      whatIfClicked = _useState4[0],
      setWhatIfClicked = _useState4[1];
    var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      drilldownSPL = _useState6[0],
      setDrilldownSPL = _useState6[1];
    var modelSummaryStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.MODEL_SUMMARY_STAGE_ID);
    var whatIfAnalysisStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.WHAT_IF_ANALYSIS_STAGE_ID);
    var whatIfAnalysisVizStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.WHAT_IF_ANALYSIS_VIZ_STAGE_ID);
    var parsedData = whatIfAnalysisVizStage.parsedData;
    (0, _react.useEffect)(function () {
      // When returning to the review step, if variableChosen, then set previously chosen
      if ((parsedData === null || parsedData === void 0 ? void 0 : parsedData.variableChosen) != null) {
        setVariableChosen(parsedData.variableChosen);
      }
      /* eslint-disable react-hooks/exhaustive-deps */
      // Only need to set variableChosen on mount
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    var handleVariableChosen = function handleVariableChosen(e, _ref2) {
      var value = _ref2.value;
      return setVariableChosen(value === variableChosen ? null : value);
    };
    var onClick;
    if ((parsedData === null || parsedData === void 0 ? void 0 : parsedData.type) === _constants.NUMERICAL && drilldownSPL != null) {
      onClick = function onClick() {
        var _experiment$getSearch = experiment.getSearchInfo(),
          timeRange = _experiment$getSearch.timeRange;
        var url = (0, _DrilldownLinker.getDrilldownUrl)({
          searchString: drilldownSPL,
          timeRange: timeRange
        });
        window.open(url, '_blank');
      };
    }
    return /*#__PURE__*/_react.default.createElement(_WhatIfAnalysis.WhatIfAnalysisWrapper, null, /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      "data-test": "what-if-analyis-stage",
      stage: [modelSummaryStage, whatIfAnalysisStage]
    }, /*#__PURE__*/_react.default.createElement(_Drawer.default, null, /*#__PURE__*/_react.default.createElement(_FieldVariableList.default, {
      experiment: experiment,
      listData: whatIfAnalysisStage.parsedData,
      mode: (_modelSummaryStage$pa = modelSummaryStage.parsedData) === null || _modelSummaryStage$pa === void 0 ? void 0 : _modelSummaryStage$pa.mode,
      setDrilldownSPL: setDrilldownSPL,
      setVariableChosen: handleVariableChosen,
      setWhatIfClicked: setWhatIfClicked,
      variableChosen: variableChosen
    })), /*#__PURE__*/_react.default.createElement(MemoizedWhatIfDetail, {
      detailData: parsedData,
      onClick: onClick,
      stage: whatIfAnalysisVizStage,
      whatIfClicked: whatIfClicked
    })));
  };
  WhatIfAnalysis.propTypes = propTypes;
  var _default = _exports.default = WhatIfAnalysis;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfAnalysis.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WhatIfAnalysisWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var WhatIfAnalysisWrapper = _exports.WhatIfAnalysisWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    flex: 1 1 auto;\n    border-top: 1px solid ", ";\n    display: flex;\n    overflow: hidden;\n"])), (0, _themes.variable)('borderLightColor'));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfDetail/WhatIfDetail.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/Question.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/NewSearchTemplate.jsx"), __webpack_require__("./src/main/webapp/components/shared/CustomViz/CustomViz.jsx"), __webpack_require__("./src/main/webapp/components/shared/SearchTable/SearchTable.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/SingleValue/SingleValue.jsx"), __webpack_require__("./src/main/webapp/components/experiments/shared/StageStatusWrapper/StageStatusWrapper.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfDetail/WhatIfDetail.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _i18n, _Question, _NewSearchTemplate, _CustomViz, _SearchTable, _SingleValue, _StageStatusWrapper, _constants, _WhatIfDetail) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Question = _interopRequireDefault(_Question);
  _NewSearchTemplate = _interopRequireDefault(_NewSearchTemplate);
  _CustomViz = _interopRequireDefault(_CustomViz);
  _SearchTable = _interopRequireDefault(_SearchTable);
  _SingleValue = _interopRequireDefault(_SingleValue);
  _StageStatusWrapper = _interopRequireDefault(_StageStatusWrapper);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var propTypes = {
    detailData: _propTypes.default.shape({
      predictedData: _propTypes.default.shape({
        predictedVariable: _propTypes.default.string
      }),
      targetVariable: _propTypes.default.string,
      isVariable: _propTypes.default.bool,
      predictedValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
      type: _propTypes.default.string,
      variableChosen: _propTypes.default.string
    }),
    onClick: _propTypes.default.func,
    stage: _propTypes.default.shape({
      searchManagerId: _propTypes.default.string,
      status: _propTypes.default.string
    }),
    whatIfClicked: _propTypes.default.string
  };
  var defaultProps = {
    detailData: null,
    onClick: null,
    stage: null,
    whatIfClicked: null
  };
  var message = (0, _i18n.gettext)('Submit the current step to analyze.');
  var WhatIfDetail = function WhatIfDetail(_ref) {
    var detailData = _ref.detailData,
      onClick = _ref.onClick,
      stage = _ref.stage,
      whatIfClicked = _ref.whatIfClicked;
    var status = stage.status;
    var content = '';
    var isVariable = (detailData === null || detailData === void 0 ? void 0 : detailData.isVariable) || false;
    var isData = detailData != null;
    if (isData && !isVariable) {
      var targetVariable = detailData.targetVariable,
        predictedValue = detailData.predictedValue;
      content = /*#__PURE__*/_react.default.createElement(_WhatIfDetail.SingleValueWrapper, null, /*#__PURE__*/_react.default.createElement(_SingleValue.default, {
        label: targetVariable,
        size: 6,
        value: predictedValue
      }));
    } else if (isData && isVariable) {
      var isNumerical = detailData.type === _constants.NUMERICAL;
      if (isNumerical) {
        var predictedVariable = detailData.predictedData.predictedVariable,
          variableChosen = detailData.variableChosen;
        var namespacedOptions = {
          onClick: onClick,
          sortXAxis: true,
          xAxisLabel: variableChosen,
          yAxisLabel: predictedVariable
        };
        content = /*#__PURE__*/_react.default.createElement(_WhatIfDetail.CustomVizWrapper, null, /*#__PURE__*/_react.default.createElement(_CustomViz.default, {
          managerId: stage.searchManagerId,
          namespacedOptions: namespacedOptions,
          viewId: "whatIfAnalysisViz",
          vizType: "LinesViz"
        }));
      } else {
        content = /*#__PURE__*/_react.default.createElement(_SearchTable.default, {
          drilldownRedirect: false,
          managerId: stage.searchManagerId,
          perPage: true,
          showPager: true,
          viewId: "reviewWhatIfTable"
        });
      }
    }
    var statusIsNew = status === 'new';
    var whatIfNotClicked = whatIfClicked == null;
    return /*#__PURE__*/_react.default.createElement(_WhatIfDetail.WhatIfDetailWrapper, null, whatIfNotClicked && statusIsNew ? /*#__PURE__*/_react.default.createElement(_NewSearchTemplate.default, {
      iconType: _Question.default,
      message: message
    }) : /*#__PURE__*/_react.default.createElement(_StageStatusWrapper.default, {
      "data-test": "what-if-anaylsis-viz-stage",
      isLoading: statusIsNew && !whatIfNotClicked,
      stage: stage
    }, content));
  };
  WhatIfDetail.defaultProps = defaultProps;
  WhatIfDetail.propTypes = propTypes;
  var _default = _exports.default = WhatIfDetail;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/WizardSteps/Review/WhatIfAnalysis/WhatIfDetail/WhatIfDetail.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WhatIfDetailWrapper = _exports.SingleValueWrapper = _exports.CustomVizWrapper = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2, _templateObject3;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var CustomVizWrapper = _exports.CustomVizWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 10px;\n"])));
  var SingleValueWrapper = _exports.SingleValueWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    line-height: 1.2;\n    height: 100%;\n"])));
  var WhatIfDetailWrapper = _exports.WhatIfDetailWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    flex: 1 0 200px;\n    overflow: auto;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/context/withCategorical/withCategorical.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.assign.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/BarBeside.js"), __webpack_require__("./node_modules/@splunk/react-icons/Table.js"), __webpack_require__("./src/main/webapp/util/reactUtils.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/util.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectAssign, _react, _propTypes, _i18n, _BarBeside, _Table, _reactUtils, _util, _constants, _util2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _BarBeside = _interopRequireDefault(_BarBeside);
  _Table = _interopRequireDefault(_Table);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          searchManagerId: _propTypes.default.string
        }))
      }),
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired
    }).isRequired
  };
  var withCategorical = function withCategorical(WrappedComponent) {
    var categorical = function categorical(props) {
      var experiment = props.experiment;
      var classificationStatsStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLASSIFICATION_STATS_STAGE_ID);
      var classificationStatsFilteredStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.CLASSIFICATION_STATS_FILTERED_STAGE_ID);

      // #region Statistics
      var CLASSIFICATION_STATS_VIZ = 'classificationStatsViz';
      var stages = [{
        main: classificationStatsStage,
        filtered: classificationStatsFilteredStage,
        title: '',
        vizId: CLASSIFICATION_STATS_VIZ
      }];
      var columnOptions = {
        'charting.chart.columnSpacing': 0
      };
      // #endregion Statistics

      // #region EvaluateTab
      var radioList = [{
        icon: /*#__PURE__*/_react.default.createElement(_BarBeside.default, null),
        label: (0, _i18n.gettext)('Statistics'),
        value: _constants.STATISTICS
      }, {
        icon: /*#__PURE__*/_react.default.createElement(_Table.default, null),
        label: (0, _i18n.gettext)('Confusion Matrix'),
        value: _constants.CONFUSION_MATRIX
      }];
      var handleViewModeChange = function handleViewModeChange(e, _ref) {
        var value = _ref.value;
        if (value) {
          experiment.changePostprocessingStage(_constants.CLASSIFICATION_STATS_FILTERED_STAGE_ID, {
            searchString: (0, _util2.filteredStatisticsSearchString)(value)
          });
          experiment.runPostprocessingStage(_constants.CLASSIFICATION_STATS_FILTERED_STAGE_ID, {
            afterStageGuid: classificationStatsStage.guid
          });
        }
      };
      // #endregion EvaluateTab

      return /*#__PURE__*/_react.default.createElement(WrappedComponent, _extends({}, props, {
        columnOptions: columnOptions,
        onViewModeChangeContext: handleViewModeChange,
        radioList: radioList,
        stages: stages
      }));
    };
    categorical.displayName = "WithCategorical(".concat((0, _reactUtils.getDisplayName)(WrappedComponent), ")");
    categorical.propTypes = propTypes;
    return categorical;
  };
  var _default = _exports.default = withCategorical;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/context/withMultipleModes/withMultipleModes.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/util/reactUtils.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/ExperimentContext/ExperimentContext.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/context/withCategorical/withCategorical.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/context/withNumeric/withNumeric.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _reactUtils, _ExperimentContext, _constants, _withCategorical, _withNumeric) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.withMultipleModes = void 0;
  _withCategorical = _interopRequireDefault(_withCategorical);
  _withNumeric = _interopRequireDefault(_withNumeric);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var withMultipleModes = _exports.withMultipleModes = function withMultipleModes(WrappedComponent) {
    var selectMode = function selectMode(props) {
      var _props$assistantConte = props.assistantContext,
        _props$assistantConte2 = _props$assistantConte === void 0 ? [] : _props$assistantConte,
        _props$assistantConte3 = _slicedToArray(_props$assistantConte2, 1),
        _props$assistantConte4 = _props$assistantConte3[0],
        _props$assistantConte5 = _props$assistantConte4 === void 0 ? {} : _props$assistantConte4,
        predictionMode = _props$assistantConte5.predictionMode;
      return predictionMode === _constants.NUMERIC_MODE ? (0, _withNumeric.default)(WrappedComponent)(props) : (0, _withCategorical.default)(WrappedComponent)(props);
    };
    selectMode.displayName = "WithMultipleModes(".concat((0, _reactUtils.getDisplayName)(WrappedComponent), ")");
    return (0, _ExperimentContext.withExperimentContext)(selectMode);
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/SmartPrediction/context/withNumeric/withNumeric.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.assign.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/BarBeside.js"), __webpack_require__("./node_modules/@splunk/react-icons/ChartScatter.js"), __webpack_require__("./node_modules/@splunk/react-icons/ChartColumn.js"), __webpack_require__("./src/main/webapp/util/reactUtils.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/util.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/util.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectAssign, _react, _propTypes, _i18n, _BarBeside, _ChartScatter, _ChartColumn, _reactUtils, _util, _constants, _util2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _BarBeside = _interopRequireDefault(_BarBeside);
  _ChartScatter = _interopRequireDefault(_ChartScatter);
  _ChartColumn = _interopRequireDefault(_ChartColumn);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  var propTypes = {
    experiment: _propTypes.default.shape({
      data: _propTypes.default.shape({
        postprocessingStages: _propTypes.default.arrayOf(_propTypes.default.shape({
          searchManagerId: _propTypes.default.string
        }))
      }),
      changePostprocessingStage: _propTypes.default.func.isRequired,
      runPostprocessingStage: _propTypes.default.func.isRequired
    }).isRequired
  };
  var withNumeric = function withNumeric(WrappedComponent) {
    var numeric = function numeric(props) {
      var experiment = props.experiment;
      var r2Stage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.RSQUARED_STAGE_ID);
      var rmseStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.RMSE_STAGE_ID);
      var r2FilteredStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.RSQUARED_FILTERED_STAGE_ID);
      var rmseFilteredStage = (0, _util.getStageById)(experiment.data.postprocessingStages, _constants.RMSE_FILTERED_STAGE_ID);

      // #region Statistics
      var R2_TITLE = (0, _i18n.gettext)('R² Statistic');
      var RMSE_TITLE = (0, _i18n.gettext)('Root Mean Squared Error (RMSE)');
      var R2_STATISTIC_VIZ = 'r2StatisticViz';
      var RMSE_STATISTIC_VIZ = 'rmseStatisticViz';
      var stages = [{
        main: r2Stage,
        filtered: r2FilteredStage,
        title: R2_TITLE,
        vizId: R2_STATISTIC_VIZ
      }, {
        main: rmseStage,
        filtered: rmseFilteredStage,
        title: RMSE_TITLE,
        vizId: RMSE_STATISTIC_VIZ
      }];
      // #endregion Statistics

      // #region EvaluateTab
      var radioList = [{
        icon: /*#__PURE__*/_react.default.createElement(_BarBeside.default, null),
        label: (0, _i18n.gettext)('Statistics'),
        value: _constants.STATISTICS
      }, {
        icon: /*#__PURE__*/_react.default.createElement(_ChartScatter.default, null),
        label: (0, _i18n.gettext)('Scatter Plot'),
        value: _constants.SCATTER_PLOT
      }, {
        icon: /*#__PURE__*/_react.default.createElement(_ChartColumn.default, null),
        label: (0, _i18n.gettext)('Residual Histogram'),
        value: _constants.HISTOGRAM
      }];
      var handleViewModeChange = function handleViewModeChange(e, _ref) {
        var value = _ref.value;
        if (value) {
          experiment.changePostprocessingStage(_constants.RSQUARED_FILTERED_STAGE_ID, {
            searchString: (0, _util2.filteredStatisticsSearchString)(value)
          });
          experiment.runPostprocessingStage(_constants.RSQUARED_FILTERED_STAGE_ID, {
            afterStageGuid: r2Stage.guid
          });
          experiment.changePostprocessingStage(_constants.RMSE_FILTERED_STAGE_ID, {
            searchString: (0, _util2.filteredStatisticsSearchString)(value)
          });
          experiment.runPostprocessingStage(_constants.RMSE_FILTERED_STAGE_ID, {
            afterStageGuid: rmseStage.guid
          });
        }
      };
      // #endregion EvaluateTab

      return /*#__PURE__*/_react.default.createElement(WrappedComponent, _extends({}, props, {
        onViewModeChangeContext: handleViewModeChange,
        radioList: radioList,
        stages: stages
      }));
    };
    numeric.displayName = "WithNumeric(".concat((0, _reactUtils.getDisplayName)(WrappedComponent), ")");
    numeric.propTypes = propTypes;
    return numeric;
  };
  var _default = _exports.default = withNumeric;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/SearchStage/FieldSelector/FieldSelector.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/components/experiments/shared/Fit/FitWrapper.jsx"), __webpack_require__("./src/main/webapp/data/algorithmSchemas/loadSchema.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/SearchStage/FieldSelector/fieldSelectorModeSchemas.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esObjectToString, _react, _swcMltk, _propTypes, _FitWrapper, _loadSchema, _fieldSelectorModeSchemas) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _FitWrapper = _interopRequireDefault(_FitWrapper);
  _loadSchema = _interopRequireDefault(_loadSchema);
  var _excluded = ["onChange", "schema"]; // adapter for FieldSelector to dynamically set constraints on 'parameter' based on 'mode', these are FieldSelector fields
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
  var FieldSelectorSchema = (0, _loadSchema.default)('FieldSelector');
  var setInitialSchema = function setInitialSchema(schema) {
    var newSchema = _swcMltk.lodash.cloneDeep(schema);
    // delete 'param' here, it will be set later on when user selects 'mode'
    delete newSchema.properties.algorithmParams.properties.param;
    // filter out the required 'param', it will be required later when user selects 'mode'
    newSchema.properties.algorithmParams.required = newSchema.properties.algorithmParams.required.filter(function (param) {
      return param !== 'param';
    });
    return newSchema;
  };
  var propTypes = {
    onChange: _propTypes.default.func.isRequired,
    schema: _propTypes.default.shape({
      properties: _propTypes.default.any
    }).isRequired
  };
  var FieldSelector = function FieldSelector(_ref) {
    var onChange = _ref.onChange,
      schema = _ref.schema,
      otherProps = _objectWithoutProperties(_ref, _excluded);
    // set initial schema (lazily) from props, this is likely from a json file
    var _useState = (0, _react.useState)(function () {
        return setInitialSchema(schema);
      }),
      _useState2 = _slicedToArray(_useState, 2),
      currentSchema = _useState2[0],
      setSchema = _useState2[1];
    // remember our current mode, don't need updates when mode has not changed
    var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      currentMode = _useState4[0],
      setMode = _useState4[1];
    var handleOnChange = function handleOnChange(stage) {
      var _stage$algorithmParam;
      var mode = (_stage$algorithmParam = stage.algorithmParams) === null || _stage$algorithmParam === void 0 ? void 0 : _stage$algorithmParam.mode;
      if (typeof mode === 'string' && mode.length > 0 && mode !== currentMode) {
        var _ref2 = _fieldSelectorModeSchemas.modeControlParams[mode] || {},
          defaultParamValue = _ref2.defaultParamValue,
          minimum = _ref2.minimum,
          maximum = _ref2.maximum,
          multipleOf = _ref2.multipleOf,
          paramTitle = _ref2.paramTitle,
          paramTooltip = _ref2.paramTooltip;
        var newSchema = _swcMltk.lodash.cloneDeep(currentSchema);

        // set the new constraints on param
        newSchema.properties.algorithmParams.properties.param = _objectSpread(_objectSpread(_objectSpread({}, FieldSelectorSchema.properties.algorithmParams.properties.param), newSchema.properties.algorithmParams.properties.param), {}, {
          minimum: minimum,
          maximum: maximum,
          multipleOf: multipleOf,
          default: defaultParamValue,
          title: paramTitle,
          description: paramTooltip
        });
        // make param required
        newSchema.properties.algorithmParams.required = [].concat(_toConsumableArray(newSchema.properties.algorithmParams.required), ['param']);
        setSchema(newSchema);
        setMode(mode);
        onChange(_objectSpread(_objectSpread({}, stage), {}, {
          algorithmParams: _objectSpread(_objectSpread({}, stage.algorithmParams), {}, {
            param: defaultParamValue
          })
        }));
      } else {
        onChange(stage);
      }
    };
    return /*#__PURE__*/_react.default.createElement(_FitWrapper.default, _extends({}, otherProps, {
      onChange: handleOnChange,
      schema: currentSchema
    }));
  };
  FieldSelector.propTypes = propTypes;
  var _default = _exports.default = FieldSelector;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/shared/SearchStage/FieldSelector/fieldSelectorModeSchemas.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.modeControlParams = void 0;
  var modeControlParams = _exports.modeControlParams = {
    percentile: {
      label: (0, _i18n.gettext)('Percentile'),
      description: (0, _i18n.gettext)('Select a percentage of fields with the highest scores.'),
      paramTitle: (0, _i18n.gettext)('Percent'),
      paramTooltip: (0, _i18n.gettext)('The percent of features to return.'),
      defaultParamValue: 10,
      minimum: 0,
      maximum: 100
    },
    k_best: {
      label: (0, _i18n.gettext)('K-best'),
      description: (0, _i18n.gettext)('Select the k fields with the highest scores.'),
      paramTitle: (0, _i18n.gettext)('K (# of fields)'),
      paramTooltip: (0, _i18n.gettext)('The number of returned fields.'),
      defaultParamValue: 10,
      minimum: 0
    },
    fpr: {
      label: (0, _i18n.gettext)('False positive rate'),
      description: (0, _i18n.gettext)('Select fields with p-values below alpha based on a False Positive Rate (FPR) test.'),
      paramTitle: (0, _i18n.gettext)('Alpha'),
      paramTooltip: (0, _i18n.gettext)('The highest p-value for fields to be returned.'),
      defaultParamValue: 0.05,
      minimum: 0.01,
      maximum: 0.99,
      multipleOf: 0.01
    },
    fdr: {
      label: (0, _i18n.gettext)('False discovery rate'),
      description: (0, _i18n.gettext)('Select fields with p-values below alpha for an estimated False Discovery Rate (FDR) test.'),
      paramTitle: (0, _i18n.gettext)('Alpha'),
      paramTooltip: (0, _i18n.gettext)('The highest uncorrected p-value for fields to be returned.'),
      defaultParamValue: 0.05,
      minimum: 0.01,
      maximum: 0.99,
      multipleOf: 0.01
    },
    fwe: {
      label: (0, _i18n.gettext)('Family-wise error rate'),
      description: (0, _i18n.gettext)('Select fields with p-values below alpha based on Family-Wise Error (FWE) rate.'),
      paramTitle: (0, _i18n.gettext)('Alpha'),
      paramTooltip: (0, _i18n.gettext)('The highest uncorrected p-value for fields to be returned.'),
      defaultParamValue: 0.05,
      minimum: 0.01,
      maximum: 0.99,
      multipleOf: 0.01
    }
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/icons/BarChart.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.assign.js"), __webpack_require__("./node_modules/react/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectAssign, _react) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
  // Intentionally not using splunk's splunk/react-icons/SVG.js because of conflicting css properties
  var BarChart = function BarChart(props) {
    return /*#__PURE__*/_react.default.createElement("svg", _extends({
      viewBox: "0 0 160 160"
    }, props), /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "18",
      width: "160",
      x: "0",
      y: "135"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "18",
      width: "80",
      x: "0",
      y: "103"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "18",
      width: "123",
      x: "0",
      y: "71"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "18",
      width: "148",
      x: "0",
      y: "39"
    }), /*#__PURE__*/_react.default.createElement("rect", {
      fill: "#22a9de",
      height: "18",
      width: "41",
      x: "0",
      y: "7"
    })));
  };
  var _default = _exports.default = BarChart;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/icons/WhatIfAnalysisIcon.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.array.includes.js");
__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");
__webpack_require__("./node_modules/core-js/modules/es.string.includes.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes) {
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
    transform: undefined
  };
  var WhatIfAnalysisIcon = function WhatIfAnalysisIcon(_ref) {
    var transform = _ref.transform,
      rest = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/_react.default.createElement("svg", _extends({
      fill: "none",
      transform: transform,
      viewBox: "0 0 80 80",
      xmlns: "http://www.w3.org/2000/svg"
    }, rest), /*#__PURE__*/_react.default.createElement("path", {
      clipRule: "evenodd",
      d: "M40.5549 0C37.9315 0 35.6699 0.424549 33.7865 1.29435C31.9424 2.13191 30.5066 3.298 29.5027 4.80098C28.499 6.30363 28 8.01167 28 9.90967V10.3945H37.67L37.704 9.9468C37.7539 9.29077 38.0084 8.78953 38.4648 8.40589L38.475 8.39684C38.937 7.9857 39.529 7.76724 40.2886 7.76724C40.8919 7.76724 41.3242 7.91421 41.6319 8.16196L41.6398 8.1683L41.6479 8.1743C41.9284 8.38134 42.0726 8.66117 42.0726 9.07561C42.0726 9.51931 41.8892 9.91588 41.4533 10.2819C40.9398 10.6835 40.3667 11.0738 39.7333 11.4524L38.9773 11.912L38.9765 11.9125C37.7857 12.6297 36.834 13.4306 36.1382 14.3219L36.1364 14.3242C35.4342 15.2351 35.1029 16.3907 35.1029 17.7498C35.1029 18.6041 35.2283 19.4945 35.4745 20.4195L35.57 20.7785H43.6097V19.96C43.6097 19.2529 43.7846 18.8392 44.0337 18.6053L44.0402 18.5991L44.0465 18.5928C44.3887 18.2466 45.0132 17.7849 45.9533 17.2053L45.9546 17.2045L46.7067 16.7473L46.7104 16.745C48.3129 15.7509 49.5877 14.6597 50.5187 13.4653C51.5168 12.2236 52 10.6645 52 8.82539C52 6.04549 50.9625 3.85143 48.877 2.30636C46.8413 0.74857 44.048 0 40.5549 0ZM44.0536 24.1077H34.9697V32H44.0536V24.1077ZM22.0568 38.2244H3.5V58.7198H12.5V47.2244H22.0568H61.633H64.8027V58.7198H73.8027V38.2244H61.633H22.0568ZM80 80H59L69.5 63L80 80ZM16.5014 64H0V80H16.5014V64Z",
      fill: "#50A7D9",
      fillRule: "evenodd"
    }));
  };
  WhatIfAnalysisIcon.defaultProps = defaultProps;
  WhatIfAnalysisIcon.propTypes = propTypes;
  var _default = _exports.default = WhatIfAnalysisIcon;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/Drawer/Drawer.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./src/main/webapp/components/shared/Drawer/Drawer.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _Button, _Drawer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
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
    children: _propTypes.default.node
  };
  var defaultProps = {
    children: null
  };
  var drawerBarWidth = '34px';
  var defaultDrawerWidth = '45%';
  var Drawer = function Drawer(_ref) {
    var children = _ref.children;
    var _useState = (0, _react.useState)(true),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];
    // Use this ref so we can track changes to open in our transition callbacks.
    // The callbacks behave slightly differently in IE and moderm browsers. In IE,
    // if you console.log the values of `open` and `openRef.current`, you'll get different values;
    // this is because the callback is invoked during the render of the DrawerWrapper which is
    // BEFORE the function ref gets updated by useCallback, even if we list `open` as one
    // of the dependencies. I KNOW RIGHT. Anyway, this is kind of unusual but gets things working
    // cross-browser.
    var openRef = (0, _react.useRef)();
    openRef.current = open;
    var _useState3 = (0, _react.useState)(defaultDrawerWidth),
      _useState4 = _slicedToArray(_useState3, 2),
      drawerWidth = _useState4[0],
      setDrawerWidth = _useState4[1];
    var drawerRef = (0, _react.useRef)(null);
    var transitionEndCallback = (0, _react.useCallback)(function (e) {
      if (e.target === e.currentTarget && !openRef.current) {
        setDrawerWidth(drawerBarWidth);
      }
    }, [setDrawerWidth]);
    var transitionStartCallback = (0, _react.useCallback)(function (e) {
      if (e.target === e.currentTarget && openRef.current) {
        setDrawerWidth(defaultDrawerWidth);
      }
    }, [setDrawerWidth]);
    (0, _react.useEffect)(function () {
      var contentEl = drawerRef.current;
      contentEl.addEventListener('transitionend', transitionEndCallback);
      contentEl.addEventListener('transitionstart', transitionStartCallback);
      return function () {
        contentEl.removeEventListener('transitionend', transitionEndCallback);
        contentEl.removeEventListener('transitionstart', transitionStartCallback);
      };
      /* eslint-disable react-hooks/exhaustive-deps */
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    return /*#__PURE__*/_react.default.createElement(_Drawer.DrawerWrapper, {
      ref: drawerRef,
      drawerWidth: drawerWidth,
      open: open
    }, /*#__PURE__*/_react.default.createElement(_Drawer.DrawerContent, null, children), /*#__PURE__*/_react.default.createElement(_Drawer.DrawerBar, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "pill",
      icon: /*#__PURE__*/_react.default.createElement(_Drawer.LeftArrow, {
        open: open,
        screenReaderText: open ? 'Close' : 'Open'
      }),
      onClick: function onClick() {
        return setOpen(!open);
      }
    })));
  };
  Drawer.defaultProps = defaultProps;
  Drawer.propTypes = propTypes;
  var _default = _exports.default = Drawer;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/Drawer/Drawer.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-icons/ChevronLeft.js"), __webpack_require__("./node_modules/@splunk/react-ui/themes.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _ChevronLeft, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LeftArrow = _exports.DrawerWrapper = _exports.DrawerContent = _exports.DrawerBar = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _ChevronLeft = _interopRequireDefault(_ChevronLeft);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var drawerBarWidth = '34px';
  var DrawerWrapper = _exports.DrawerWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    flex: 0 0 ", ";\n    transform: ", ";\n    transition: transform 0.5s ", ";\n    overflow: hidden;\n"])), function (props) {
    return props.drawerWidth;
  }, function (props) {
    return props.open ? 'translateX(0)' : "translateX(calc(-100% + ".concat(drawerBarWidth, "))");
  }, function (props) {
    return props.open ? 'ease-out' : 'ease-in';
  });
  var DrawerBar = _exports.DrawerBar = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    border-left: 1px solid ", ";\n    border-right: 1px solid ", ";\n"])), (0, _themes.variable)('borderLightColor'), (0, _themes.variable)('borderLightColor'));
  var DrawerContent = _exports.DrawerContent = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    flex: 1 1 100%;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n"])));
  var LeftArrow = _exports.LeftArrow = (0, _styledComponents.default)(_ChevronLeft.default)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    transition: all 0.5s;\n    ", ";\n"])), function (props) {
    return !props.open && 'transform: rotate(-180deg);';
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/usePrevious/usePrevious.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  /**
   * This hook is to be used as prevState would have been used
   * Simply initialize you initial state and then set a var for the prev state
   * const prevVarState = usePrevious(varState);
   */

  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    });
    return ref.current;
  };
  var _default = _exports.default = usePrevious;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/SmartPrediction.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("assistants/SmartPrediction")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _SmartPrediction) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _SmartPrediction = _interopRequireDefault(_SmartPrediction);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var SPRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Smart Prediction'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.smartPredictionView) {
        // TODO: Properly handle the backbutton by not requiring the entire page to be re-instantiated.
        // This is a failsafe for now if the querystring gets updated and then the user clicks the backbutton.
        // In this case the DOM is guaranteed to be cleaned up. We have not yet confirmed that all listeners
        // will be cleaned up.
        this.smartPredictionView.remove();
      }
      this.smartPredictionView = new _SmartPrediction.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = SPRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/util/reactUtils.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.function.name.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esFunctionName) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getDisplayName = void 0;
  // helper to generate displayNames for HOC components
  // https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
  var getDisplayName = _exports.getDisplayName = function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "assistants/SmartPrediction":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module, __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("shared/BaseSmartAssistant"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/SmartPrediction.jsx"), __webpack_require__("./src/main/webapp/components/experiments/SmartPrediction/SmartPredictionContext.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _module, _PolymorphicExperiment, _BaseSmartAssistant, _SmartPrediction, _SmartPredictionContext) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _BaseSmartAssistant = _interopRequireDefault(_BaseSmartAssistant);
  _SmartPrediction = _interopRequireDefault(_SmartPrediction);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _BaseSmartAssistant.default.extend({
    moduleId: _module.default.id,
    assistantComponent: _SmartPrediction.default,
    assistantContext: {
      initialState: _SmartPredictionContext.initialState,
      reducer: _SmartPredictionContext.reducer
    },
    experimentType: _PolymorphicExperiment.default.TYPES.SMART_PREDICTION
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/smart_prediction.es","pages_common"]]]);