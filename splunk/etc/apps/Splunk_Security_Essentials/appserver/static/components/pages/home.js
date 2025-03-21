/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + "." + chunkId + ".js?" + {}[chunkId] + ""
/******/ 	}
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
/******/ 	// The chunk loading function for additional chunks
/******/ 	// Since all referenced chunks are already included
/******/ 	// in this file, this function is empty here.
/******/ 	__webpack_require__.e = function requireEnsure() {
/******/ 		return Promise.resolve();
/******/ 	};
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
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = this["webpackJsonp"] = this["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./package/src/components/pages/home.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/date/now.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/date/now.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/filter.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/instance/filter.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/find.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/instance/find.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/instance/for-each.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/instance/index-of.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/instance/map.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/instance/sort.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/instance/sort.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/json/stringify.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/json/stringify.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/object/define-property.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/object/keys.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/object/keys.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/promise.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/promise/index.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js-stable/set-timeout.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/core-js-pure/stable/set-timeout.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/arrayLikeToArray.js":
/***/ (function(module, exports) {

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/arrayWithHoles.js":
/***/ (function(module, exports, __webpack_require__) {

var _Array$isArray = __webpack_require__("./node_modules/core-js-pure/features/array/is-array.js");
function _arrayWithHoles(r) {
  if (_Array$isArray(r)) return r;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault.js":
/***/ (function(module, exports) {

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/iterableToArrayLimit.js":
/***/ (function(module, exports, __webpack_require__) {

var _Symbol = __webpack_require__("./node_modules/core-js-pure/features/symbol/index.js");
var _getIteratorMethod = __webpack_require__("./node_modules/core-js-pure/features/get-iterator-method.js");
var _pushInstanceProperty = __webpack_require__("./node_modules/core-js-pure/features/instance/push.js");
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof _Symbol && _getIteratorMethod(r) || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (_pushInstanceProperty(a).call(a, e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/nonIterableRest.js":
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js":
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/arrayWithHoles.js");
var iterableToArrayLimit = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/iterableToArrayLimit.js");
var unsupportedIterableToArray = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/unsupportedIterableToArray.js");
var nonIterableRest = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/nonIterableRest.js");
function _slicedToArray(r, e) {
  return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/unsupportedIterableToArray.js":
/***/ (function(module, exports, __webpack_require__) {

var _sliceInstanceProperty = __webpack_require__("./node_modules/core-js-pure/features/instance/slice.js");
var _Array$from = __webpack_require__("./node_modules/core-js-pure/features/array/from.js");
var arrayLikeToArray = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/arrayLikeToArray.js");
function _unsupportedIterableToArray(r, a) {
  if (r) {
    var _context;
    if ("string" == typeof r) return arrayLikeToArray(r, a);
    var t = _sliceInstanceProperty(_context = {}.toString.call(r)).call(_context, 8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? _Array$from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
  }
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/backbone/backbone.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Backbone.js 1.6.0

//     (c) 2010-2024 Jeremy Ashkenas and DocumentCloud
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global;

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./node_modules/underscore/modules/index-all.js"), __webpack_require__("./node_modules/jquery/dist/jquery.js"), exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else { var _, $; }

})(function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to a common array method we'll want to use later.
  var slice = Array.prototype.slice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.6.0';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... this will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // a custom event channel. You may bind a callback to an event with `on` or
  // remove with `off`; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {};

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // A private global variable to share between listeners and listenees.
  var _listening;

  // Iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jQuery-style event
  // maps `{event: callback}`).
  var eventsApi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // Handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space-separated event names by delegating them individually.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // Finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  Events.on = function(name, callback, context) {
    this._events = eventsApi(onApi, this._events || {}, name, callback, {
      context: context,
      ctx: this,
      listening: _listening
    });

    if (_listening) {
      var listeners = this._listeners || (this._listeners = {});
      listeners[_listening.id] = _listening;
      // Allow the listening to use a counter, instead of tracking
      // callbacks for library interop
      _listening.interop = false;
    }

    return this;
  };

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  Events.listenTo = function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = _listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      this._listenId || (this._listenId = _.uniqueId('l'));
      listening = _listening = listeningTo[id] = new Listening(this, obj);
    }

    // Bind callbacks on obj.
    var error = tryCatchOn(obj, name, callback, this);
    _listening = void 0;

    if (error) throw error;
    // If the target obj is not Backbone.Events, track events manually.
    if (listening.interop) listening.on(name, callback);

    return this;
  };

  // The reducing API that adds a callback to the `events` object.
  var onApi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
  };

  // An try-catch guarded #on function, to prevent poisoning the global
  // `_listening` variable.
  var tryCatchOn = function(obj, name, callback, context) {
    try {
      obj.on(name, callback, context);
    } catch (e) {
      return e;
    }
  };

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  Events.off = function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });

    return this;
  };

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  Events.stopListening = function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);
    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
      if (listening.interop) listening.off(name, callback);
    }
    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

    return this;
  };

  // The reducing API that removes a callback from the `events` object.
  var offApi = function(events, name, callback, options) {
    if (!events) return;

    var context = options.context, listeners = options.listeners;
    var i = 0, names;

    // Delete all event listeners and "drop" events.
    if (!name && !context && !callback) {
      for (names = _.keys(listeners); i < names.length; i++) {
        listeners[names[i]].cleanup();
      }
      return;
    }

    names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // Bail out if there are no events stored.
      if (!handlers) break;

      // Find any remaining events.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          var listening = handler.listening;
          if (listening) listening.off(name, callback);
        }
      }

      // Replace events if there are any remaining.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }

    return events;
  };

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  Events.once = function(name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
    if (typeof name === 'string' && context == null) callback = void 0;
    return this.on(events, callback, context);
  };

  // Inversion-of-control versions of `once`.
  Events.listenToOnce = function(obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
    return this.listenTo(obj, events);
  };

  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
  // `offer` unbinds the `onceWrapper` after it has been called.
  var onceMap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.trigger = function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // Handles triggering the appropriate event callbacks.
  var triggerApi = function(objEvents, name, callback, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // A listening class that tracks and cleans up memory bindings
  // when all callbacks have been offed.
  var Listening = function(listener, obj) {
    this.id = listener._listenId;
    this.listener = listener;
    this.obj = obj;
    this.interop = true;
    this.count = 0;
    this._events = void 0;
  };

  Listening.prototype.on = Events.on;

  // Offs a callback (or several).
  // Uses an optimized counter if the listenee uses Backbone.Events.
  // Otherwise, falls back to manual tracking to support events
  // library interop.
  Listening.prototype.off = function(name, callback) {
    var cleanup;
    if (this.interop) {
      this._events = eventsApi(offApi, this._events, name, callback, {
        context: void 0,
        listeners: void 0
      });
      cleanup = !this._events;
    } else {
      this.count--;
      cleanup = this.count === 0;
    }
    if (cleanup) this.cleanup();
  };

  // Cleans up memory bindings between the listener and the listenee.
  Listening.prototype.cleanup = function() {
    delete this.listener._listeningTo[this.obj._listenId];
    if (!this.interop) delete this.obj._listeners[this.id];
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    this.cid = _.uniqueId(this.cidPrefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    var defaults = _.result(this, 'defaults');

    // Just _.defaults would work fine, but the additional _.extends
    // is in there for historical reasons. See #3843.
    attrs = _.defaults(_.extend({}, defaults, attrs), defaults);

    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // The prefix is used to create the client id which is used to identify models locally.
    // You may want to override this if you're experiencing name clashes with model ids.
    cidPrefix: 'c',

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Model.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Special-cased proxy to underscore's `_.matches` method.
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      var unset      = options.unset;
      var silent     = options.silent;
      var changes    = [];
      var changing   = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }

      var current = this.attributes;
      var changed = this.changed;
      var prev    = this._previousAttributes;

      // For each `set` attribute, update or delete the current value.
      for (var attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          changed[attr] = val;
        } else {
          delete changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Update the `id`.
      if (this.idAttribute in attrs) {
        var prevId = this.id;
        this.id = this.get(this.idAttribute);
        this.trigger('changeId', this, prevId, options);
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      var changed = {};
      var hasChanged;
      for (var attr in diff) {
        var val = diff[attr];
        if (_.isEqual(old[attr], val)) continue;
        changed[attr] = val;
        hasChanged = true;
      }
      return hasChanged ? changed : false;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server, merging the response with the model's
    // local attributes. Any changed attributes will trigger a "change" event.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true, parse: true}, options);
      var wait = options.wait;

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else if (!this._validate(attrs, options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      var attributes = this.attributes;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
        if (serverAttrs && !model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      // Set temporary attributes if `{wait: true}` to properly find new ids.
      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

      var method = this.isNew() ? 'create' : options.patch ? 'patch' : 'update';
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      var xhr = this.sync(method, this, options);

      // Restore attributes.
      this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analogous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Splices `insert` into `array` at index `at`.
  var splice = function(array, insert, at) {
    at = Math.min(Math.max(at, 0), array.length);
    var tail = Array(array.length - at);
    var length = insert.length;
    var i;
    for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
    for (i = 0; i < length; i++) array[i + at] = insert[i];
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,


    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Collection.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model) { return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set. `models` may be Backbone
    // Models or raw JavaScript objects to be converted to Models, or any
    // combination of the two.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      options = _.extend({}, options);
      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();
      var removed = this._removeModels(models, options);
      if (!options.silent && removed.length) {
        options.changes = {added: [], merged: [], removed: removed};
        this.trigger('update', this, options);
      }
      return singular ? removed[0] : removed;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      if (models == null) return;

      options = _.extend({}, setOptions, options);
      if (options.parse && !this._isModel(models)) {
        models = this.parse(models, options) || [];
      }

      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();

      var at = options.at;
      if (at != null) at = +at;
      if (at > this.length) at = this.length;
      if (at < 0) at += this.length + 1;

      var set = [];
      var toAdd = [];
      var toMerge = [];
      var toRemove = [];
      var modelMap = {};

      var add = options.add;
      var merge = options.merge;
      var remove = options.remove;

      var sort = false;
      var sortable = this.comparator && at == null && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      var model, i;
      for (i = 0; i < models.length; i++) {
        model = models[i];

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        var existing = this.get(model);
        if (existing) {
          if (merge && model !== existing) {
            var attrs = this._isModel(model) ? model.attributes : model;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            toMerge.push(existing);
            if (sortable && !sort) sort = existing.hasChanged(sortAttr);
          }
          if (!modelMap[existing.cid]) {
            modelMap[existing.cid] = true;
            set.push(existing);
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(model, options);
          if (model) {
            toAdd.push(model);
            this._addReference(model, options);
            modelMap[model.cid] = true;
            set.push(model);
          }
        }
      }

      // Remove stale models.
      if (remove) {
        for (i = 0; i < this.length; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) toRemove.push(model);
        }
        if (toRemove.length) this._removeModels(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      var orderChanged = false;
      var replace = !sortable && add && remove;
      if (set.length && replace) {
        orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
          return m !== set[index];
        });
        this.models.length = 0;
        splice(this.models, set, 0);
        this.length = this.models.length;
      } else if (toAdd.length) {
        if (sortable) sort = true;
        splice(this.models, toAdd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort/update events.
      if (!options.silent) {
        for (i = 0; i < toAdd.length; i++) {
          if (at != null) options.index = at + i;
          model = toAdd[i];
          model.trigger('add', model, this, options);
        }
        if (sort || orderChanged) this.trigger('sort', this, options);
        if (toAdd.length || toRemove.length || toMerge.length) {
          options.changes = {
            added: toAdd,
            removed: toRemove,
            merged: toMerge
          };
          this.trigger('update', this, options);
        }
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      return this.remove(model, options);
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      return this.remove(model, options);
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id, cid, model object with id or cid
    // properties, or an attributes object that is transformed through modelId.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] ||
        this._byId[this.modelId(this._isModel(obj) ? obj.attributes : obj, obj.idAttribute)] ||
        obj.cid && this._byId[obj.cid];
    },

    // Returns `true` if the model is in the collection.
    has: function(obj) {
      return this.get(obj) != null;
    },

    // Get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      return this[first ? 'find' : 'filter'](attrs);
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      var comparator = this.comparator;
      if (!comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      var length = comparator.length;
      if (_.isFunction(comparator)) comparator = comparator.bind(this);

      // Run sort based on type of `comparator`.
      if (length === 1 || _.isString(comparator)) {
        this.models = this.sortBy(comparator);
      } else {
        this.models.sort(comparator);
      }
      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackOpts) {
        if (wait) {
          m.off('error', collection._forwardPristineError, collection);
          collection.add(m, callbackOpts);
        }
        if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
      };
      // In case of wait:true, our collection is not listening to any
      // of the model's events yet, so it will not forward the error
      // event. In this special case, we need to listen for it
      // separately and handle the event just once.
      // (The reason we don't need to do this for the sync event is
      // in the success handler above: we add the model first, which
      // causes the collection to listen, and then invoke the callback
      // that triggers the event.)
      if (wait) {
        model.once('error', this._forwardPristineError, this);
      }
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // Define how to uniquely identify models in the collection.
    modelId: function(attrs, idAttribute) {
      return attrs[idAttribute || this.model.prototype.idAttribute || 'id'];
    },

    // Get an iterator of all models in this collection.
    values: function() {
      return new CollectionIterator(this, ITERATOR_VALUES);
    },

    // Get an iterator of all model IDs in this collection.
    keys: function() {
      return new CollectionIterator(this, ITERATOR_KEYS);
    },

    // Get an iterator of all [ID, model] tuples in this collection.
    entries: function() {
      return new CollectionIterator(this, ITERATOR_KEYSVALUES);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;

      var model;
      if (this.model.prototype) {
        model = new this.model(attrs, options);
      } else {
        // ES class methods didn't have prototype
        model = this.model(attrs, options);
      }

      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method called by both remove and set.
    _removeModels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // Remove references before triggering 'remove' event to prevent an
        // infinite loop. #3693
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes, model.idAttribute);
        if (id != null) delete this._byId[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removeReference(model, options);
      }
      if (models.length > 0 && !options.silent) delete options.index;
      return removed;
    },

    // Method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _isModel: function(model) {
      return model instanceof Model;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes, model.idAttribute);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      delete this._byId[model.cid];
      var id = this.modelId(model.attributes, model.idAttribute);
      if (id != null) delete this._byId[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'changeId') {
          var prevId = this.modelId(model.previousAttributes(), model.idAttribute);
          var id = this.modelId(model.attributes, model.idAttribute);
          if (prevId != null) delete this._byId[prevId];
          if (id != null) this._byId[id] = model;
        }
      }
      this.trigger.apply(this, arguments);
    },

    // Internal callback method used in `create`. It serves as a
    // stand-in for the `_onModelEvent` method, which is not yet bound
    // during the `wait` period of the `create` call. We still want to
    // forward any `'error'` event at the end of the `wait` period,
    // hence a customized callback.
    _forwardPristineError: function(model, collection, options) {
      // Prevent double forward if the model was already in the
      // collection before the call to `create`.
      if (this.has(model)) return;
      this._onModelEvent('error', model, collection, options);
    }
  });

  // Defining an @@iterator method implements JavaScript's Iterable protocol.
  // In modern ES2015 browsers, this value is found at Symbol.iterator.
  /* global Symbol */
  var $$iterator = typeof Symbol === 'function' && Symbol.iterator;
  if ($$iterator) {
    Collection.prototype[$$iterator] = Collection.prototype.values;
  }

  // CollectionIterator
  // ------------------

  // A CollectionIterator implements JavaScript's Iterator protocol, allowing the
  // use of `for of` loops in modern browsers and interoperation between
  // Backbone.Collection and other JavaScript functions and third-party libraries
  // which can operate on Iterables.
  var CollectionIterator = function(collection, kind) {
    this._collection = collection;
    this._kind = kind;
    this._index = 0;
  };

  // This "enum" defines the three possible kinds of values which can be emitted
  // by a CollectionIterator that correspond to the values(), keys() and entries()
  // methods on Collection, respectively.
  var ITERATOR_VALUES = 1;
  var ITERATOR_KEYS = 2;
  var ITERATOR_KEYSVALUES = 3;

  // All Iterators should themselves be Iterable.
  if ($$iterator) {
    CollectionIterator.prototype[$$iterator] = function() {
      return this;
    };
  }

  CollectionIterator.prototype.next = function() {
    if (this._collection) {

      // Only continue iterating if the iterated collection is long enough.
      if (this._index < this._collection.length) {
        var model = this._collection.at(this._index);
        this._index++;

        // Construct a value depending on what kind of values should be iterated.
        var value;
        if (this._kind === ITERATOR_VALUES) {
          value = model;
        } else {
          var id = this._collection.modelId(model.attributes, model.idAttribute);
          if (this._kind === ITERATOR_KEYS) {
            value = id;
          } else { // ITERATOR_KEYSVALUES
            value = [id, model];
          }
        }
        return {value: value, done: false};
      }

      // Once exhausted, remove the reference to the collection so future
      // calls to the next method always return done.
      this._collection = void 0;
    }

    return {value: void 0, done: true};
  };

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this.preinitialize.apply(this, arguments);
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be set as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the View
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this._removeElement();
      this.stopListening();
      return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
      this.$el.remove();
    },

    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },

    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    _setElement: function(el) {
      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], method.bind(this));
      }
      return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Produces a DOM element to be assigned to your view. Exposed for
    // subclasses using an alternative DOM manipulation API.
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // Proxy Backbone class methods to Underscore functions, wrapping the model's
  // `attributes` object or collection's `models` array behind the scenes.
  //
  // collection.filter(function(model) { return model.get('age') > 10 });
  // collection.each(this.addView);
  //
  // `Function#apply` can be slow so we use the method's arg count, if we know it.
  var addMethod = function(base, length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return base[method](this[attribute]);
      };
      case 2: return function(value) {
        return base[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return base[method](this[attribute], cb(iteratee, this), context);
      };
      case 4: return function(iteratee, defaultVal, context) {
        return base[method](this[attribute], cb(iteratee, this), defaultVal, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return base[method].apply(base, args);
      };
    }
  };

  var addUnderscoreMethods = function(Class, base, methods, attribute) {
    _.each(methods, function(length, method) {
      if (base[method]) Class.prototype[method] = addMethod(base, length, method, attribute);
    });
  };

  // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
  var cb = function(iteratee, instance) {
    if (_.isFunction(iteratee)) return iteratee;
    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
  };
  var modelMatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
      return matcher(model.attributes);
    };
  };

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
    foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
    select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
    contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
    head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
    without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
    isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
    sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};


  // Underscore methods that we want to implement on the Model, mapped to the
  // number of arguments they take.
  var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
    omit: 0, chain: 1, isEmpty: 1};

  // Mix in each Underscore method as a proxy to `Collection#models`.

  _.each([
    [Collection, collectionMethods, 'models'],
    [Model, modelMethods, 'attributes']
  ], function(config) {
    var Base = config[0],
        methods = config[1],
        attribute = config[2];

    Base.mixin = function(obj) {
      var mappings = _.reduce(_.functions(obj), function(memo, name) {
        memo[name] = 0;
        return memo;
      }, {});
      addUnderscoreMethods(Base, obj, mappings, attribute);
    };

    addUnderscoreMethods(Base, _, methods, attribute);
  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // Pass along `textStatus` and `errorThrown` from jQuery.
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'read': 'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    this.preinitialize.apply(this, arguments);
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // preinitialize is an empty function by default. You can override it with a function
    // or object.  preinitialize will run before any instantiation logic is run in the Router.
    preinitialize: function(){},

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
      .replace(optionalParam, '(?:$1)?')
      .replace(namedParam, function(match, optional) {
        return optional ? match : '([^/?]+)';
      })
      .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    this.checkUrl = this.checkUrl.bind(this);

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getSearch();
    },

    // Does the pathname match the root?
    matchRoot: function() {
      var path = this.decodeFragment(this.location.pathname);
      var rootPath = path.slice(0, this.root.length - 1) + '/';
      return rootPath === this.root;
    },

    // Unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded parameter.
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    // In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error('Backbone.history has already been started');
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._trailingSlash   = this.options.trailingSlash;
      this._wantsHashChange = this.options.hashChange !== false;
      this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          var rootPath = this.root.slice(0, -1) || '/';
          this.location.replace(rootPath + '#' + this.getPath());
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot()) {
          this.navigate(this.getHash(), {replace: true});
        }

      }

      // Proxy an iframe to handle location events if the browser doesn't
      // support the `hashchange` event, HTML5 history, or the user wants
      // `hashChange` but not `pushState`.
      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'javascript:0';
        this.iframe.style.display = 'none';
        this.iframe.tabIndex = -1;
        var body = document.body;
        // Using `appendChild` will throw on IE < 9 if the document is not ready.
        var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
        iWindow.document.open();
        iWindow.document.close();
        iWindow.location.hash = '#' + this.fragment;
      }

      // Add a cross-platform `addEventListener` shim for older browsers.
      var addEventListener = window.addEventListener || function(eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._usePushState) {
        addEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        addEventListener('hashchange', this.checkUrl, false);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      // Add a cross-platform `removeEventListener` shim for older browsers.
      var removeEventListener = window.removeEventListener || function(eventName, listener) {
        return detachEvent('on' + eventName, listener);
      };

      // Remove window listeners.
      if (this._usePushState) {
        removeEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        removeEventListener('hashchange', this.checkUrl, false);
      }

      // Clean up the iframe if necessary.
      if (this.iframe) {
        document.body.removeChild(this.iframe);
        this.iframe = null;
      }

      // Some environments will throw when clearing an undefined interval.
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();

      // If the user pressed the back button, the iframe's hash will have
      // changed and we should use that for comparison.
      if (current === this.fragment && this.iframe) {
        current = this.getHash(this.iframe.contentWindow);
      }

      if (current === this.fragment) {
        if (!this.matchRoot()) return this.notfound();
        return false;
      }
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return this.notfound();
      fragment = this.fragment = this.getFragment(fragment);
      return _.some(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      }) || this.notfound();
    },

    // When no route could be matched, this method is called internally to
    // trigger the `'notfound'` event. It returns `false` so that it can be used
    // in tail position.
    notfound: function() {
      this.trigger('notfound');
      return false;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // Normalize the fragment.
      fragment = this.getFragment(fragment || '');

      // Strip trailing slash on the root unless _trailingSlash is true
      var rootPath = this.root;
      if (!this._trailingSlash && (fragment === '' || fragment.charAt(0) === '?')) {
        rootPath = rootPath.slice(0, -1) || '/';
      }
      var url = rootPath + fragment;

      // Strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathStripper, '');

      // Decode for matching.
      var decodedFragment = this.decodeFragment(fragment);

      if (this.fragment === decodedFragment) return;
      this.fragment = decodedFragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
          var iWindow = this.iframe.contentWindow;

          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if (!options.replace) {
            iWindow.document.open();
            iWindow.document.close();
          }

          this._updateHash(iWindow.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  // Provide useful information when things go wrong. This method is not meant
  // to be used directly; it merely provides the necessary introspection for the
  // external `debugInfo` function.
  Backbone._debug = function() {
    return {root: root, _: _};
  };

  return Backbone;
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/bootstrap/js/src/popover.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/bootstrap/js/src/util/index.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/bootstrap/js/src/tooltip.js");
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */




/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'popover'
const DATA_KEY = 'bs.popover'
const EVENT_KEY = `.${DATA_KEY}`
const CLASS_PREFIX = 'bs-popover'

const Default = {
  ..._tooltip__WEBPACK_IMPORTED_MODULE_1__["default"].Default,
  placement: 'right',
  offset: [0, 8],
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' +
              '<div class="popover-arrow"></div>' +
              '<h3 class="popover-header"></h3>' +
              '<div class="popover-body"></div>' +
            '</div>'
}

const DefaultType = {
  ..._tooltip__WEBPACK_IMPORTED_MODULE_1__["default"].DefaultType,
  content: '(string|element|function)'
}

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`
}

const SELECTOR_TITLE = '.popover-header'
const SELECTOR_CONTENT = '.popover-body'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Popover extends _tooltip__WEBPACK_IMPORTED_MODULE_1__["default"] {
  // Getters

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get Event() {
    return Event
  }

  static get DefaultType() {
    return DefaultType
  }

  // Overrides

  isWithContent() {
    return this.getTitle() || this._getContent()
  }

  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE)
    this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT)
  }

  // Private

  _getContent() {
    return this._resolvePossibleFunction(this._config.content)
  }

  _getBasicClassPrefix() {
    return CLASS_PREFIX
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config)

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Popover to jQuery only if jQuery is present
 */

Object(_util_index__WEBPACK_IMPORTED_MODULE_0__[/* defineJQueryPlugin */ "a"])(Popover)

/* harmony default export */ __webpack_exports__["default"] = (Popover);


/***/ }),

/***/ "./node_modules/bootstrap/js/src/tooltip.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// NAMESPACE OBJECT: ./node_modules/@popperjs/core/lib/index.js
var lib_namespaceObject = {};
__webpack_require__.r(lib_namespaceObject);
__webpack_require__.d(lib_namespaceObject, "top", function() { return enums_top; });
__webpack_require__.d(lib_namespaceObject, "bottom", function() { return bottom; });
__webpack_require__.d(lib_namespaceObject, "right", function() { return right; });
__webpack_require__.d(lib_namespaceObject, "left", function() { return left; });
__webpack_require__.d(lib_namespaceObject, "auto", function() { return auto; });
__webpack_require__.d(lib_namespaceObject, "basePlacements", function() { return basePlacements; });
__webpack_require__.d(lib_namespaceObject, "start", function() { return start; });
__webpack_require__.d(lib_namespaceObject, "end", function() { return end; });
__webpack_require__.d(lib_namespaceObject, "clippingParents", function() { return enums_clippingParents; });
__webpack_require__.d(lib_namespaceObject, "viewport", function() { return viewport; });
__webpack_require__.d(lib_namespaceObject, "popper", function() { return enums_popper; });
__webpack_require__.d(lib_namespaceObject, "reference", function() { return enums_reference; });
__webpack_require__.d(lib_namespaceObject, "variationPlacements", function() { return variationPlacements; });
__webpack_require__.d(lib_namespaceObject, "placements", function() { return enums_placements; });
__webpack_require__.d(lib_namespaceObject, "beforeRead", function() { return beforeRead; });
__webpack_require__.d(lib_namespaceObject, "read", function() { return read; });
__webpack_require__.d(lib_namespaceObject, "afterRead", function() { return afterRead; });
__webpack_require__.d(lib_namespaceObject, "beforeMain", function() { return beforeMain; });
__webpack_require__.d(lib_namespaceObject, "main", function() { return main; });
__webpack_require__.d(lib_namespaceObject, "afterMain", function() { return afterMain; });
__webpack_require__.d(lib_namespaceObject, "beforeWrite", function() { return beforeWrite; });
__webpack_require__.d(lib_namespaceObject, "write", function() { return write; });
__webpack_require__.d(lib_namespaceObject, "afterWrite", function() { return afterWrite; });
__webpack_require__.d(lib_namespaceObject, "modifierPhases", function() { return modifierPhases; });
__webpack_require__.d(lib_namespaceObject, "applyStyles", function() { return modifiers_applyStyles; });
__webpack_require__.d(lib_namespaceObject, "arrow", function() { return modifiers_arrow; });
__webpack_require__.d(lib_namespaceObject, "computeStyles", function() { return modifiers_computeStyles; });
__webpack_require__.d(lib_namespaceObject, "eventListeners", function() { return eventListeners; });
__webpack_require__.d(lib_namespaceObject, "flip", function() { return modifiers_flip; });
__webpack_require__.d(lib_namespaceObject, "hide", function() { return modifiers_hide; });
__webpack_require__.d(lib_namespaceObject, "offset", function() { return modifiers_offset; });
__webpack_require__.d(lib_namespaceObject, "popperOffsets", function() { return modifiers_popperOffsets; });
__webpack_require__.d(lib_namespaceObject, "preventOverflow", function() { return modifiers_preventOverflow; });
__webpack_require__.d(lib_namespaceObject, "popperGenerator", function() { return popperGenerator; });
__webpack_require__.d(lib_namespaceObject, "detectOverflow", function() { return detectOverflow; });
__webpack_require__.d(lib_namespaceObject, "createPopperBase", function() { return createPopper_createPopper; });
__webpack_require__.d(lib_namespaceObject, "createPopper", function() { return popper_createPopper; });
__webpack_require__.d(lib_namespaceObject, "createPopperLite", function() { return popper_lite_createPopper; });

// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/enums.js
var enums_top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [enums_top, bottom, right, left];
var start = 'start';
var end = 'end';
var enums_clippingParents = 'clippingParents';
var viewport = 'viewport';
var enums_popper = 'popper';
var enums_reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var enums_placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js


function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}


// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_applyStyles = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js

function getBasePlacement(placement) {
  return placement.split('-')[0];
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/math.js
var math_max = Math.max;
var math_min = Math.min;
var round = Math.round;
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/contains.js

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js



function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js








function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/within.js

function within(min, value, max) {
  return math_max(min, math_min(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/arrow.js








 // eslint-disable-next-line import/no-unused-modules

var arrow_toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = arrow_toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? enums_top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function arrow_effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_arrow = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: arrow_effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split('-')[1];
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = enums_top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === enums_top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, getWindow(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_computeStyles = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function eventListeners_effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var eventListeners = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: eventListeners_effect,
  data: {}
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var getOppositeVariationPlacement_hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return getOppositeVariationPlacement_hash[matched];
  });
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js




function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js















function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = math_max(rect.top, accRect.top);
    accRect.right = math_min(rect.right, accRect.right);
    accRect.bottom = math_min(rect.bottom, accRect.bottom);
    accRect.left = math_max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/computeOffsets.js




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case enums_top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/detectOverflow.js








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? enums_clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? enums_popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === enums_popper ? enums_reference : enums_popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === enums_popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === enums_popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [enums_top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? enums_placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/flip.js






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [enums_top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : enums_top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_flip = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/hide.js



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [enums_top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_hide = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/offset.js

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, enums_top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset_offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = enums_placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_offset = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset_offset
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js


function popperOffsets_popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_popperOffsets = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets_popperOffsets,
  data: {}
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? enums_top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? math_min(min, tetherMin) : min, offset, tether ? math_max(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? enums_top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [enums_top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ var modifiers_preventOverflow = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/index.js









// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js




function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/orderModifiers.js
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}
// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/createPopper.js









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper_createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules


// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/popper.js










var popper_defaultModifiers = [eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide];
var popper_createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: popper_defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules


// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/popper-lite.js





var popper_lite_defaultModifiers = [eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles];
var popper_lite_createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: popper_lite_defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules


// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/index.js

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules


// EXTERNAL MODULE: ./node_modules/bootstrap/js/src/util/index.js
var util = __webpack_require__("./node_modules/bootstrap/js/src/util/index.js");

// CONCATENATED MODULE: ./node_modules/bootstrap/js/src/util/sanitizer.js
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const uriAttributes = new Set([
  'background',
  'cite',
  'href',
  'itemtype',
  'longdesc',
  'poster',
  'src',
  'xlink:href'
])

const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i

/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
 */
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i

/**
 * A pattern that matches safe data URLs. Only matches image, video and audio types.
 *
 * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
 */
const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i

const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase()

  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue))
    }

    return true
  }

  const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp)

  // Check if a regular expression validates the attribute.
  for (let i = 0, len = regExp.length; i < len; i++) {
    if (regExp[i].test(attributeName)) {
      return true
    }
  }

  return false
}

const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
}

function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
  if (!unsafeHtml.length) {
    return unsafeHtml
  }

  if (sanitizeFn && typeof sanitizeFn === 'function') {
    return sanitizeFn(unsafeHtml)
  }

  const domParser = new window.DOMParser()
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html')
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'))

  for (let i = 0, len = elements.length; i < len; i++) {
    const element = elements[i]
    const elementName = element.nodeName.toLowerCase()

    if (!Object.keys(allowList).includes(elementName)) {
      element.remove()

      continue
    }

    const attributeList = [].concat(...element.attributes)
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || [])

    attributeList.forEach(attribute => {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName)
      }
    })
  }

  return createdDocument.body.innerHTML
}

// CONCATENATED MODULE: ./node_modules/bootstrap/js/src/dom/data.js
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const elementMap = new Map()

/* harmony default export */ var dom_data = ({
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map())
    }

    const instanceMap = elementMap.get(element)

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`)
      return
    }

    instanceMap.set(key, instance)
  },

  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null
    }

    return null
  },

  remove(element, key) {
    if (!elementMap.has(element)) {
      return
    }

    const instanceMap = elementMap.get(element)

    instanceMap.delete(key)

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element)
    }
  }
});

// CONCATENATED MODULE: ./node_modules/bootstrap/js/src/dom/event-handler.js
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */



/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/
const stripNameRegex = /\..*/
const stripUidRegex = /::\d+$/
const eventRegistry = {} // Events storage
let uidEvent = 1
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
}
const customEventsRegex = /^(mouseenter|mouseleave)/i
const nativeEvents = new Set([
  'click',
  'dblclick',
  'mouseup',
  'mousedown',
  'contextmenu',
  'mousewheel',
  'DOMMouseScroll',
  'mouseover',
  'mouseout',
  'mousemove',
  'selectstart',
  'selectend',
  'keydown',
  'keypress',
  'keyup',
  'orientationchange',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerleave',
  'pointercancel',
  'gesturestart',
  'gesturechange',
  'gestureend',
  'focus',
  'blur',
  'change',
  'reset',
  'select',
  'submit',
  'focusin',
  'focusout',
  'load',
  'unload',
  'beforeunload',
  'resize',
  'move',
  'DOMContentLoaded',
  'readystatechange',
  'error',
  'abort',
  'scroll'
])

/**
 * ------------------------------------------------------------------------
 * Private methods
 * ------------------------------------------------------------------------
 */

function getUidEvent(element, uid) {
  return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++
}

function getEvent(element) {
  const uid = getUidEvent(element)

  element.uidEvent = uid
  eventRegistry[uid] = eventRegistry[uid] || {}

  return eventRegistry[uid]
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    event.delegateTarget = element

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn)
    }

    return fn.apply(element, [event])
  }
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector)

    for (let { target } = event; target && target !== this; target = target.parentNode) {
      for (let i = domElements.length; i--;) {
        if (domElements[i] === target) {
          event.delegateTarget = target

          if (handler.oneOff) {
            EventHandler.off(element, event.type, selector, fn)
          }

          return fn.apply(target, [event])
        }
      }
    }

    // To please ESLint
    return null
  }
}

function findHandler(events, handler, delegationSelector = null) {
  const uidEventList = Object.keys(events)

  for (let i = 0, len = uidEventList.length; i < len; i++) {
    const event = events[uidEventList[i]]

    if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
      return event
    }
  }

  return null
}

function normalizeParams(originalTypeEvent, handler, delegationFn) {
  const delegation = typeof handler === 'string'
  const originalHandler = delegation ? delegationFn : handler

  let typeEvent = getTypeEvent(originalTypeEvent)
  const isNative = nativeEvents.has(typeEvent)

  if (!isNative) {
    typeEvent = originalTypeEvent
  }

  return [delegation, originalHandler, typeEvent]
}

function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return
  }

  if (!handler) {
    handler = delegationFn
    delegationFn = null
  }

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (customEventsRegex.test(originalTypeEvent)) {
    const wrapFn = fn => {
      return function (event) {
        if (!event.relatedTarget || (event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget))) {
          return fn.call(this, event)
        }
      }
    }

    if (delegationFn) {
      delegationFn = wrapFn(delegationFn)
    } else {
      handler = wrapFn(handler)
    }
  }

  const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn)
  const events = getEvent(element)
  const handlers = events[typeEvent] || (events[typeEvent] = {})
  const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null)

  if (previousFn) {
    previousFn.oneOff = previousFn.oneOff && oneOff

    return
  }

  const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''))
  const fn = delegation ?
    bootstrapDelegationHandler(element, handler, delegationFn) :
    bootstrapHandler(element, handler)

  fn.delegationSelector = delegation ? handler : null
  fn.originalHandler = originalHandler
  fn.oneOff = oneOff
  fn.uidEvent = uid
  handlers[uid] = fn

  element.addEventListener(typeEvent, fn, delegation)
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector)

  if (!fn) {
    return
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector))
  delete events[typeEvent][fn.uidEvent]
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {}

  Object.keys(storeElementEvent).forEach(handlerKey => {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey]

      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector)
    }
  })
}

function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '')
  return customEvents[event] || event
}

const EventHandler = {
  on(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, false)
  },

  one(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, true)
  },

  off(element, originalTypeEvent, handler, delegationFn) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn)
    const inNamespace = typeEvent !== originalTypeEvent
    const events = getEvent(element)
    const isNamespace = originalTypeEvent.startsWith('.')

    if (typeof originalHandler !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!events || !events[typeEvent]) {
        return
      }

      removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null)
      return
    }

    if (isNamespace) {
      Object.keys(events).forEach(elementEvent => {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1))
      })
    }

    const storeElementEvent = events[typeEvent] || {}
    Object.keys(storeElementEvent).forEach(keyHandlers => {
      const handlerKey = keyHandlers.replace(stripUidRegex, '')

      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers]

        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector)
      }
    })
  },

  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null
    }

    const $ = Object(util["f" /* getjQuery */])()
    const typeEvent = getTypeEvent(event)
    const inNamespace = event !== typeEvent
    const isNative = nativeEvents.has(typeEvent)

    let jQueryEvent
    let bubbles = true
    let nativeDispatch = true
    let defaultPrevented = false
    let evt = null

    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args)

      $(element).trigger(jQueryEvent)
      bubbles = !jQueryEvent.isPropagationStopped()
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped()
      defaultPrevented = jQueryEvent.isDefaultPrevented()
    }

    if (isNative) {
      evt = document.createEvent('HTMLEvents')
      evt.initEvent(typeEvent, bubbles, true)
    } else {
      evt = new CustomEvent(event, {
        bubbles,
        cancelable: true
      })
    }

    // merge custom information in our event
    if (typeof args !== 'undefined') {
      Object.keys(args).forEach(key => {
        Object.defineProperty(evt, key, {
          get() {
            return args[key]
          }
        })
      })
    }

    if (defaultPrevented) {
      evt.preventDefault()
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt)
    }

    if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
      jQueryEvent.preventDefault()
    }

    return evt
  }
}

/* harmony default export */ var event_handler = (EventHandler);

// CONCATENATED MODULE: ./node_modules/bootstrap/js/src/dom/manipulator.js
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

function normalizeData(val) {
  if (val === 'true') {
    return true
  }

  if (val === 'false') {
    return false
  }

  if (val === Number(val).toString()) {
    return Number(val)
  }

  if (val === '' || val === 'null') {
    return null
  }

  return val
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`)
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value)
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`)
  },

  getDataAttributes(element) {
    if (!element) {
      return {}
    }

    const attributes = {}

    Object.keys(element.dataset)
      .filter(key => key.startsWith('bs'))
      .forEach(key => {
        let pureKey = key.replace(/^bs/, '')
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length)
        attributes[pureKey] = normalizeData(element.dataset[key])
      })

    return attributes
  },

  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`))
  },

  offset(element) {
    const rect = element.getBoundingClientRect()

    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    }
  },

  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    }
  }
}

/* harmony default export */ var manipulator = (Manipulator);

// CONCATENATED MODULE: ./node_modules/bootstrap/js/src/dom/selector-engine.js
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */



const NODE_TEXT = 3

const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector))
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector)
  },

  children(element, selector) {
    return [].concat(...element.children)
      .filter(child => child.matches(selector))
  },

  parents(element, selector) {
    const parents = []

    let ancestor = element.parentNode

    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
      if (ancestor.matches(selector)) {
        parents.push(ancestor)
      }

      ancestor = ancestor.parentNode
    }

    return parents
  },

  prev(element, selector) {
    let previous = element.previousElementSibling

    while (previous) {
      if (previous.matches(selector)) {
        return [previous]
      }

      previous = previous.previousElementSibling
    }

    return []
  },

  next(element, selector) {
    let next = element.nextElementSibling

    while (next) {
      if (next.matches(selector)) {
        return [next]
      }

      next = next.nextElementSibling
    }

    return []
  },

  focusableChildren(element) {
    const focusables = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      'details',
      '[tabindex]',
      '[contenteditable="true"]'
    ].map(selector => `${selector}:not([tabindex^="-"])`).join(', ')

    return this.find(focusables, element).filter(el => !Object(util["g" /* isDisabled */])(el) && Object(util["j" /* isVisible */])(el))
  }
}

/* harmony default export */ var selector_engine = (SelectorEngine);

// CONCATENATED MODULE: ./node_modules/bootstrap/js/src/base-component.js
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */





/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const VERSION = '5.1.3'

class base_component_BaseComponent {
  constructor(element) {
    element = Object(util["d" /* getElement */])(element)

    if (!element) {
      return
    }

    this._element = element
    dom_data.set(this._element, this.constructor.DATA_KEY, this)
  }

  dispose() {
    dom_data.remove(this._element, this.constructor.DATA_KEY)
    event_handler.off(this._element, this.constructor.EVENT_KEY)

    Object.getOwnPropertyNames(this).forEach(propertyName => {
      this[propertyName] = null
    })
  }

  _queueCallback(callback, element, isAnimated = true) {
    Object(util["b" /* executeAfterTransition */])(callback, element, isAnimated)
  }

  /** Static */

  static getInstance(element) {
    return dom_data.get(Object(util["d" /* getElement */])(element), this.DATA_KEY)
  }

  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null)
  }

  static get VERSION() {
    return VERSION
  }

  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!')
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`
  }
}

/* harmony default export */ var base_component = (base_component_BaseComponent);

// CONCATENATED MODULE: ./node_modules/bootstrap/js/src/tooltip.js
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */











/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'tooltip'
const DATA_KEY = 'bs.tooltip'
const EVENT_KEY = `.${DATA_KEY}`
const CLASS_PREFIX = 'bs-tooltip'
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn'])

const DefaultType = {
  animation: 'boolean',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string',
  delay: '(number|object)',
  html: 'boolean',
  selector: '(string|boolean)',
  placement: '(string|function)',
  offset: '(array|string|function)',
  container: '(string|element|boolean)',
  fallbackPlacements: 'array',
  boundary: '(string|element)',
  customClass: '(string|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  allowList: 'object',
  popperConfig: '(null|object|function)'
}

const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: Object(util["i" /* isRTL */])() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: Object(util["i" /* isRTL */])() ? 'right' : 'left'
}

const Default = {
  animation: true,
  template: '<div class="tooltip" role="tooltip">' +
              '<div class="tooltip-arrow"></div>' +
              '<div class="tooltip-inner"></div>' +
            '</div>',
  trigger: 'hover focus',
  title: '',
  delay: 0,
  html: false,
  selector: false,
  placement: 'top',
  offset: [0, 0],
  container: false,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  boundary: 'clippingParents',
  customClass: '',
  sanitize: true,
  sanitizeFn: null,
  allowList: DefaultAllowlist,
  popperConfig: null
}

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`
}

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_MODAL = 'modal'
const CLASS_NAME_SHOW = 'show'

const HOVER_STATE_SHOW = 'show'
const HOVER_STATE_OUT = 'out'

const SELECTOR_TOOLTIP_INNER = '.tooltip-inner'
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`

const EVENT_MODAL_HIDE = 'hide.bs.modal'

const TRIGGER_HOVER = 'hover'
const TRIGGER_FOCUS = 'focus'
const TRIGGER_CLICK = 'click'
const TRIGGER_MANUAL = 'manual'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class tooltip_Tooltip extends base_component {
  constructor(element, config) {
    if (typeof lib_namespaceObject === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)')
    }

    super(element)

    // private
    this._isEnabled = true
    this._timeout = 0
    this._hoverState = ''
    this._activeTrigger = {}
    this._popper = null

    // Protected
    this._config = this._getConfig(config)
    this.tip = null

    this._setListeners()
  }

  // Getters

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get Event() {
    return Event
  }

  static get DefaultType() {
    return DefaultType
  }

  // Public

  enable() {
    this._isEnabled = true
  }

  disable() {
    this._isEnabled = false
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled
  }

  toggle(event) {
    if (!this._isEnabled) {
      return
    }

    if (event) {
      const context = this._initializeOnDelegatedTarget(event)

      context._activeTrigger.click = !context._activeTrigger.click

      if (context._isWithActiveTrigger()) {
        context._enter(null, context)
      } else {
        context._leave(null, context)
      }
    } else {
      if (this.getTipElement().classList.contains(CLASS_NAME_SHOW)) {
        this._leave(null, this)
        return
      }

      this._enter(null, this)
    }
  }

  dispose() {
    clearTimeout(this._timeout)

    event_handler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler)

    if (this.tip) {
      this.tip.remove()
    }

    this._disposePopper()
    super.dispose()
  }

  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements')
    }

    if (!(this.isWithContent() && this._isEnabled)) {
      return
    }

    const showEvent = event_handler.trigger(this._element, this.constructor.Event.SHOW)
    const shadowRoot = Object(util["c" /* findShadowRoot */])(this._element)
    const isInTheDom = shadowRoot === null ?
      this._element.ownerDocument.documentElement.contains(this._element) :
      shadowRoot.contains(this._element)

    if (showEvent.defaultPrevented || !isInTheDom) {
      return
    }

    // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
    // This will be removed later in favor of a `setContent` method
    if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
      this._disposePopper()
      this.tip.remove()
      this.tip = null
    }

    const tip = this.getTipElement()
    const tipId = Object(util["e" /* getUID */])(this.constructor.NAME)

    tip.setAttribute('id', tipId)
    this._element.setAttribute('aria-describedby', tipId)

    if (this._config.animation) {
      tip.classList.add(CLASS_NAME_FADE)
    }

    const placement = typeof this._config.placement === 'function' ?
      this._config.placement.call(this, tip, this._element) :
      this._config.placement

    const attachment = this._getAttachment(placement)
    this._addAttachmentClass(attachment)

    const { container } = this._config
    dom_data.set(tip, this.constructor.DATA_KEY, this)

    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip)
      event_handler.trigger(this._element, this.constructor.Event.INSERTED)
    }

    if (this._popper) {
      this._popper.update()
    } else {
      this._popper = popper_createPopper(this._element, tip, this._getPopperConfig(attachment))
    }

    tip.classList.add(CLASS_NAME_SHOW)

    const customClass = this._resolvePossibleFunction(this._config.customClass)
    if (customClass) {
      tip.classList.add(...customClass.split(' '))
    }

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      [].concat(...document.body.children).forEach(element => {
        event_handler.on(element, 'mouseover', util["k" /* noop */])
      })
    }

    const complete = () => {
      const prevHoverState = this._hoverState

      this._hoverState = null
      event_handler.trigger(this._element, this.constructor.Event.SHOWN)

      if (prevHoverState === HOVER_STATE_OUT) {
        this._leave(null, this)
      }
    }

    const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE)
    this._queueCallback(complete, this.tip, isAnimated)
  }

  hide() {
    if (!this._popper) {
      return
    }

    const tip = this.getTipElement()
    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return
      }

      if (this._hoverState !== HOVER_STATE_SHOW) {
        tip.remove()
      }

      this._cleanTipClass()
      this._element.removeAttribute('aria-describedby')
      event_handler.trigger(this._element, this.constructor.Event.HIDDEN)

      this._disposePopper()
    }

    const hideEvent = event_handler.trigger(this._element, this.constructor.Event.HIDE)
    if (hideEvent.defaultPrevented) {
      return
    }

    tip.classList.remove(CLASS_NAME_SHOW)

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      [].concat(...document.body.children)
        .forEach(element => event_handler.off(element, 'mouseover', util["k" /* noop */]))
    }

    this._activeTrigger[TRIGGER_CLICK] = false
    this._activeTrigger[TRIGGER_FOCUS] = false
    this._activeTrigger[TRIGGER_HOVER] = false

    const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE)
    this._queueCallback(complete, this.tip, isAnimated)
    this._hoverState = ''
  }

  update() {
    if (this._popper !== null) {
      this._popper.update()
    }
  }

  // Protected

  isWithContent() {
    return Boolean(this.getTitle())
  }

  getTipElement() {
    if (this.tip) {
      return this.tip
    }

    const element = document.createElement('div')
    element.innerHTML = this._config.template

    const tip = element.children[0]
    this.setContent(tip)
    tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW)

    this.tip = tip
    return this.tip
  }

  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER)
  }

  _sanitizeAndSetContent(template, content, selector) {
    const templateElement = selector_engine.findOne(selector, template)

    if (!content && templateElement) {
      templateElement.remove()
      return
    }

    // we use append for html objects to maintain js events
    this.setElementContent(templateElement, content)
  }

  setElementContent(element, content) {
    if (element === null) {
      return
    }

    if (Object(util["h" /* isElement */])(content)) {
      content = Object(util["d" /* getElement */])(content)

      // content is a DOM node or a jQuery
      if (this._config.html) {
        if (content.parentNode !== element) {
          element.innerHTML = ''
          element.append(content)
        }
      } else {
        element.textContent = content.textContent
      }

      return
    }

    if (this._config.html) {
      if (this._config.sanitize) {
        content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn)
      }

      element.innerHTML = content
    } else {
      element.textContent = content
    }
  }

  getTitle() {
    const title = this._element.getAttribute('data-bs-original-title') || this._config.title

    return this._resolvePossibleFunction(title)
  }

  updateAttachment(attachment) {
    if (attachment === 'right') {
      return 'end'
    }

    if (attachment === 'left') {
      return 'start'
    }

    return attachment
  }

  // Private

  _initializeOnDelegatedTarget(event, context) {
    return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig())
  }

  _getOffset() {
    const { offset } = this._config

    if (typeof offset === 'string') {
      return offset.split(',').map(val => Number.parseInt(val, 10))
    }

    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element)
    }

    return offset
  }

  _resolvePossibleFunction(content) {
    return typeof content === 'function' ? content.call(this._element) : content
  }

  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        },
        {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        },
        {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        },
        {
          name: 'onChange',
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }
      ],
      onFirstUpdate: data => {
        if (data.options.placement !== data.placement) {
          this._handlePopperPlacementChange(data)
        }
      }
    }

    return {
      ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    }
  }

  _addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`)
  }

  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()]
  }

  _setListeners() {
    const triggers = this._config.trigger.split(' ')

    triggers.forEach(trigger => {
      if (trigger === 'click') {
        event_handler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event))
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ?
          this.constructor.Event.MOUSEENTER :
          this.constructor.Event.FOCUSIN
        const eventOut = trigger === TRIGGER_HOVER ?
          this.constructor.Event.MOUSELEAVE :
          this.constructor.Event.FOCUSOUT

        event_handler.on(this._element, eventIn, this._config.selector, event => this._enter(event))
        event_handler.on(this._element, eventOut, this._config.selector, event => this._leave(event))
      }
    })

    this._hideModalHandler = () => {
      if (this._element) {
        this.hide()
      }
    }

    event_handler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler)

    if (this._config.selector) {
      this._config = {
        ...this._config,
        trigger: 'manual',
        selector: ''
      }
    } else {
      this._fixTitle()
    }
  }

  _fixTitle() {
    const title = this._element.getAttribute('title')
    const originalTitleType = typeof this._element.getAttribute('data-bs-original-title')

    if (title || originalTitleType !== 'string') {
      this._element.setAttribute('data-bs-original-title', title || '')
      if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
        this._element.setAttribute('aria-label', title)
      }

      this._element.setAttribute('title', '')
    }
  }

  _enter(event, context) {
    context = this._initializeOnDelegatedTarget(event, context)

    if (event) {
      context._activeTrigger[
        event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = true
    }

    if (context.getTipElement().classList.contains(CLASS_NAME_SHOW) || context._hoverState === HOVER_STATE_SHOW) {
      context._hoverState = HOVER_STATE_SHOW
      return
    }

    clearTimeout(context._timeout)

    context._hoverState = HOVER_STATE_SHOW

    if (!context._config.delay || !context._config.delay.show) {
      context.show()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_SHOW) {
        context.show()
      }
    }, context._config.delay.show)
  }

  _leave(event, context) {
    context = this._initializeOnDelegatedTarget(event, context)

    if (event) {
      context._activeTrigger[
        event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = context._element.contains(event.relatedTarget)
    }

    if (context._isWithActiveTrigger()) {
      return
    }

    clearTimeout(context._timeout)

    context._hoverState = HOVER_STATE_OUT

    if (!context._config.delay || !context._config.delay.hide) {
      context.hide()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_OUT) {
        context.hide()
      }
    }, context._config.delay.hide)
  }

  _isWithActiveTrigger() {
    for (const trigger in this._activeTrigger) {
      if (this._activeTrigger[trigger]) {
        return true
      }
    }

    return false
  }

  _getConfig(config) {
    const dataAttributes = manipulator.getDataAttributes(this._element)

    Object.keys(dataAttributes).forEach(dataAttr => {
      if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
        delete dataAttributes[dataAttr]
      }
    })

    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    }

    config.container = config.container === false ? document.body : Object(util["d" /* getElement */])(config.container)

    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      }
    }

    if (typeof config.title === 'number') {
      config.title = config.title.toString()
    }

    if (typeof config.content === 'number') {
      config.content = config.content.toString()
    }

    Object(util["l" /* typeCheckConfig */])(NAME, config, this.constructor.DefaultType)

    if (config.sanitize) {
      config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn)
    }

    return config
  }

  _getDelegateConfig() {
    const config = {}

    for (const key in this._config) {
      if (this.constructor.Default[key] !== this._config[key]) {
        config[key] = this._config[key]
      }
    }

    // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`
    return config
  }

  _cleanTipClass() {
    const tip = this.getTipElement()
    const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g')
    const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex)
    if (tabClass !== null && tabClass.length > 0) {
      tabClass.map(token => token.trim())
        .forEach(tClass => tip.classList.remove(tClass))
    }
  }

  _getBasicClassPrefix() {
    return CLASS_PREFIX
  }

  _handlePopperPlacementChange(popperData) {
    const { state } = popperData

    if (!state) {
      return
    }

    this.tip = state.elements.popper
    this._cleanTipClass()
    this._addAttachmentClass(this._getAttachment(state.placement))
  }

  _disposePopper() {
    if (this._popper) {
      this._popper.destroy()
      this._popper = null
    }
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = tooltip_Tooltip.getOrCreateInstance(this, config)

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tooltip to jQuery only if jQuery is present
 */

Object(util["a" /* defineJQueryPlugin */])(tooltip_Tooltip)

/* harmony default export */ var tooltip = __webpack_exports__["default"] = (tooltip_Tooltip);


/***/ }),

/***/ "./node_modules/bootstrap/js/src/util/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getUID; });
/* unused harmony export getSelectorFromElement */
/* unused harmony export getElementFromSelector */
/* unused harmony export getTransitionDurationFromElement */
/* unused harmony export triggerTransitionEnd */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return isElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return typeCheckConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return isVisible; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return isDisabled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return findShadowRoot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return noop; });
/* unused harmony export getNextActiveElement */
/* unused harmony export reflow */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getjQuery; });
/* unused harmony export onDOMContentLoaded */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return isRTL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return defineJQueryPlugin; });
/* unused harmony export execute */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return executeAfterTransition; });
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const MAX_UID = 1000000
const MILLISECONDS_MULTIPLIER = 1000
const TRANSITION_END = 'transitionend'

// Shoutout AngusCroll (https://goo.gl/pxwQGp)
const toType = obj => {
  if (obj === null || obj === undefined) {
    return `${obj}`
  }

  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
}

/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID)
  } while (document.getElementById(prefix))

  return prefix
}

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target')

  if (!selector || selector === '#') {
    let hrefAttr = element.getAttribute('href')

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttr || (!hrefAttr.includes('#') && !hrefAttr.startsWith('.'))) {
      return null
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
      hrefAttr = `#${hrefAttr.split('#')[1]}`
    }

    selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null
  }

  return selector
}

const getSelectorFromElement = element => {
  const selector = getSelector(element)

  if (selector) {
    return document.querySelector(selector) ? selector : null
  }

  return null
}

const getElementFromSelector = element => {
  const selector = getSelector(element)

  return selector ? document.querySelector(selector) : null
}

const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0
  }

  // Get transition-duration of the element
  let { transitionDuration, transitionDelay } = window.getComputedStyle(element)

  const floatTransitionDuration = Number.parseFloat(transitionDuration)
  const floatTransitionDelay = Number.parseFloat(transitionDelay)

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0]
  transitionDelay = transitionDelay.split(',')[0]

  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
}

const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END))
}

const isElement = obj => {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  if (typeof obj.jquery !== 'undefined') {
    obj = obj[0]
  }

  return typeof obj.nodeType !== 'undefined'
}

const getElement = obj => {
  if (isElement(obj)) { // it's a jQuery object or a node element
    return obj.jquery ? obj[0] : obj
  }

  if (typeof obj === 'string' && obj.length > 0) {
    return document.querySelector(obj)
  }

  return null
}

const typeCheckConfig = (componentName, config, configTypes) => {
  Object.keys(configTypes).forEach(property => {
    const expectedTypes = configTypes[property]
    const value = config[property]
    const valueType = value && isElement(value) ? 'element' : toType(value)

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new TypeError(
        `${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
      )
    }
  })
}

const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false
  }

  return getComputedStyle(element).getPropertyValue('visibility') === 'visible'
}

const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true
  }

  if (element.classList.contains('disabled')) {
    return true
  }

  if (typeof element.disabled !== 'undefined') {
    return element.disabled
  }

  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false'
}

const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null
  }

  // Can find the shadow root otherwise it'll return the document
  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode()
    return root instanceof ShadowRoot ? root : null
  }

  if (element instanceof ShadowRoot) {
    return element
  }

  // when we don't find a shadow root
  if (!element.parentNode) {
    return null
  }

  return findShadowRoot(element.parentNode)
}

const noop = () => {}

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight
}

const getjQuery = () => {
  const { jQuery } = window

  if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return jQuery
  }

  return null
}

const DOMContentLoadedCallbacks = []

const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        DOMContentLoadedCallbacks.forEach(callback => callback())
      })
    }

    DOMContentLoadedCallbacks.push(callback)
  } else {
    callback()
  }
}

const isRTL = () => document.documentElement.dir === 'rtl'

const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery()
    /* istanbul ignore if */
    if ($) {
      const name = plugin.NAME
      const JQUERY_NO_CONFLICT = $.fn[name]
      $.fn[name] = plugin.jQueryInterface
      $.fn[name].Constructor = plugin
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT
        return plugin.jQueryInterface
      }
    }
  })
}

const execute = callback => {
  if (typeof callback === 'function') {
    callback()
  }
}

const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback)
    return
  }

  const durationPadding = 5
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding

  let called = false

  const handler = ({ target }) => {
    if (target !== transitionElement) {
      return
    }

    called = true
    transitionElement.removeEventListener(TRANSITION_END, handler)
    execute(callback)
  }

  transitionElement.addEventListener(TRANSITION_END, handler)
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement)
    }
  }, emulatedDuration)
}

/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  let index = list.indexOf(activeElement)

  // if the element does not exist in the list return an element depending on the direction and if cycle is allowed
  if (index === -1) {
    return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0]
  }

  const listLength = list.length

  index += shouldGetNext ? 1 : -1

  if (isCycleAllowed) {
    index = (index + listLength) % listLength
  }

  return list[Math.max(0, Math.min(index, listLength - 1))]
}




/***/ }),

/***/ "./node_modules/core-js-pure/actual/array/from.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/stable/array/from.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/array/is-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/stable/array/is-array.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/get-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/stable/get-iterator-method.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/push.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/stable/instance/push.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/stable/instance/slice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/stable/symbol/index.js");

__webpack_require__("./node_modules/core-js-pure/modules/esnext.function.metadata.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.async-dispose.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.dispose.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.metadata.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/from.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.array.from.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = path.Array.from;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/is-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.is-array.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = path.Array.isArray;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/filter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.filter.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'filter');


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/find.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.find.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'find');


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/for-each.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.for-each.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'forEach');


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/index-of.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.index-of.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'indexOf');


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.map.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'map');


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/push.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.push.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'push');


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.slice.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'slice');


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/sort.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.sort.js");
var getBuiltInPrototypeMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in-prototype-method.js");

module.exports = getBuiltInPrototypeMethod('Array', 'sort');


/***/ }),

/***/ "./node_modules/core-js-pure/es/date/now.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.date.now.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = path.Date.now;


/***/ }),

/***/ "./node_modules/core-js-pure/es/get-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.string.iterator.js");
var getIteratorMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-iterator-method.js");

module.exports = getIteratorMethod;


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/filter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/filter.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.filter) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/find.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/find.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.find;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.find) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/index-of.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/index-of.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.indexOf) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/map.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.map;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.map) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/push.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/push.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.push;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.push) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/slice.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.slice;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.slice) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/sort.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/sort.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.sort;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.sort) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/json/stringify.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.date.to-json.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.json.stringify.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");
var apply = __webpack_require__("./node_modules/core-js-pure/internals/function-apply.js");

// eslint-disable-next-line es/no-json -- safe
if (!path.JSON) path.JSON = { stringify: JSON.stringify };

// eslint-disable-next-line no-unused-vars -- required for `.length`
module.exports = function stringify(it, replacer, space) {
  return apply(path.JSON.stringify, null, arguments);
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/define-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.object.define-property.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

var Object = path.Object;

var defineProperty = module.exports = function defineProperty(it, key, desc) {
  return Object.defineProperty(it, key, desc);
};

if (Object.defineProperty.sham) defineProperty.sham = true;


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/keys.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.object.keys.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.keys;


/***/ }),

/***/ "./node_modules/core-js-pure/es/promise/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.aggregate-error.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.all-settled.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.any.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.with-resolvers.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.finally.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.string.iterator.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = path.Promise;


/***/ }),

/***/ "./node_modules/core-js-pure/es/symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.concat.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.has-instance.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.is-concat-spreadable.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.match.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.match-all.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.replace.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.search.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.species.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.split.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.unscopables.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.reflect.to-string-tag.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = path.Symbol;


/***/ }),

/***/ "./node_modules/core-js-pure/features/array/from.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__("./node_modules/core-js-pure/full/array/from.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/array/is-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__("./node_modules/core-js-pure/full/array/is-array.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/get-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__("./node_modules/core-js-pure/full/get-iterator-method.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/push.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__("./node_modules/core-js-pure/full/instance/push.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__("./node_modules/core-js-pure/full/instance/slice.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__("./node_modules/core-js-pure/full/symbol/index.js");


/***/ }),

/***/ "./node_modules/core-js-pure/full/array/from.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/actual/array/from.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/array/is-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/actual/array/is-array.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/get-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/actual/get-iterator-method.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/push.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/actual/instance/push.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/actual/instance/slice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/actual/symbol/index.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.is-registered-symbol.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.is-well-known-symbol.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.custom-matcher.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.observable.js");
// TODO: Remove from `core-js@4`
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.is-registered.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.is-well-known.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.matcher.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.metadata-key.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.pattern-match.js");
__webpack_require__("./node_modules/core-js-pure/modules/esnext.symbol.replace-all.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-callable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var tryToString = __webpack_require__("./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isConstructor = __webpack_require__("./node_modules/core-js-pure/internals/is-constructor.js");
var tryToString = __webpack_require__("./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-possible-prototype.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPossiblePrototype = __webpack_require__("./node_modules/core-js-pure/internals/is-possible-prototype.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/add-to-unscopables.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () { /* empty */ };


/***/ }),

/***/ "./node_modules/core-js-pure/internals/an-instance.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/an-object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-for-each.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__("./node_modules/core-js-pure/internals/array-iteration.js").forEach;
var arrayMethodIsStrict = __webpack_require__("./node_modules/core-js-pure/internals/array-method-is-strict.js");

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-from.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-context.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var callWithSafeIterationClosing = __webpack_require__("./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js");
var isArrayIteratorMethod = __webpack_require__("./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var isConstructor = __webpack_require__("./node_modules/core-js-pure/internals/is-constructor.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");
var createProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-property.js");
var getIterator = __webpack_require__("./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-iterator-method.js");

var $Array = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    result = IS_CONSTRUCTOR ? new this() : [];
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    for (;!(step = call(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-includes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__("./node_modules/core-js-pure/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-iteration.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-context.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/indexed-object.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__("./node_modules/core-js-pure/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE === 1;
  var IS_FILTER = TYPE === 2;
  var IS_SOME = TYPE === 3;
  var IS_EVERY = TYPE === 4;
  var IS_FIND_INDEX = TYPE === 6;
  var IS_FILTER_REJECT = TYPE === 7;
  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(self);
    var boundFunction = bind(callbackfn, that);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-method-has-species-support.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__("./node_modules/core-js-pure/internals/environment-v8-version.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-method-is-strict.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-set-length.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var isArray = __webpack_require__("./node_modules/core-js-pure/internals/is-array.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-sort.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arraySlice = __webpack_require__("./node_modules/core-js-pure/internals/array-slice.js");

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-species-constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isArray = __webpack_require__("./node_modules/core-js-pure/internals/is-array.js");
var isConstructor = __webpack_require__("./node_modules/core-js-pure/internals/is-constructor.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-species-create.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arraySpeciesConstructor = __webpack_require__("./node_modules/core-js-pure/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var iteratorClose = __webpack_require__("./node_modules/core-js-pure/internals/iterator-close.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/check-correctness-of-iteration.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  try {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/classof-raw.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/classof.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__("./node_modules/core-js-pure/internals/to-string-tag-support.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var classofRaw = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/copy-constructor-properties.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var ownKeys = __webpack_require__("./node_modules/core-js-pure/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/correct-prototype-getter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-iter-result-object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-property-descriptor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
  else object[key] = value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/date-to-iso-string.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var padStart = __webpack_require__("./node_modules/core-js-pure/internals/string-pad.js").start;

var $RangeError = RangeError;
var $isFinite = isFinite;
var abs = Math.abs;
var DatePrototype = Date.prototype;
var nativeDateToISOString = DatePrototype.toISOString;
var thisTimeValue = uncurryThis(DatePrototype.getTime);
var getUTCDate = uncurryThis(DatePrototype.getUTCDate);
var getUTCFullYear = uncurryThis(DatePrototype.getUTCFullYear);
var getUTCHours = uncurryThis(DatePrototype.getUTCHours);
var getUTCMilliseconds = uncurryThis(DatePrototype.getUTCMilliseconds);
var getUTCMinutes = uncurryThis(DatePrototype.getUTCMinutes);
var getUTCMonth = uncurryThis(DatePrototype.getUTCMonth);
var getUTCSeconds = uncurryThis(DatePrototype.getUTCSeconds);

// `Date.prototype.toISOString` method implementation
// https://tc39.es/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit fails here:
module.exports = (fails(function () {
  return nativeDateToISOString.call(new Date(-5e13 - 1)) !== '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  nativeDateToISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!$isFinite(thisTimeValue(this))) throw new $RangeError('Invalid time value');
  var date = this;
  var year = getUTCFullYear(date);
  var milliseconds = getUTCMilliseconds(date);
  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  return sign + padStart(abs(year), sign ? 6 : 4, 0) +
    '-' + padStart(getUTCMonth(date) + 1, 2, 0) +
    '-' + padStart(getUTCDate(date), 2, 0) +
    'T' + padStart(getUTCHours(date), 2, 0) +
    ':' + padStart(getUTCMinutes(date), 2, 0) +
    ':' + padStart(getUTCSeconds(date), 2, 0) +
    '.' + padStart(milliseconds, 3, 0) +
    'Z';
} : nativeDateToISOString;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-built-in-accessor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js");

module.exports = function (target, name, descriptor) {
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-built-in.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-global-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/delete-property-or-throw.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tryToString = __webpack_require__("./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw new $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/descriptors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/document-create-element.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/dom-iterables.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/enum-bug-keys.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-ff-version.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-is-ie-or-edge.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var UA = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-is-ios-pebble.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");

module.exports = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != 'undefined';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-is-ios.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");

// eslint-disable-next-line redos/no-vulnerable -- safe
module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-is-node.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ENVIRONMENT = __webpack_require__("./node_modules/core-js-pure/internals/environment.js");

module.exports = ENVIRONMENT === 'NODE';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-is-webos-webkit.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");

module.exports = /web0s(?!.*chrome)/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-user-agent.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-v8-version.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var userAgent = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment-webkit-version.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ "./node_modules/core-js-pure/internals/environment.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* global Bun, Deno -- detection */
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var userAgent = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");
var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");

var userAgentStartsWith = function (string) {
  return userAgent.slice(0, string.length) === string;
};

module.exports = (function () {
  if (userAgentStartsWith('Bun/')) return 'BUN';
  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
  if (userAgentStartsWith('Deno/')) return 'DENO';
  if (userAgentStartsWith('Node.js/')) return 'NODE';
  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
  if (classof(globalThis.process) === 'process') return 'NODE';
  if (globalThis.window && globalThis.document) return 'BROWSER';
  return 'REST';
})();


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-clear.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-install.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var clearErrorStack = __webpack_require__("./node_modules/core-js-pure/internals/error-stack-clear.js");
var ERROR_STACK_INSTALLABLE = __webpack_require__("./node_modules/core-js-pure/internals/error-stack-installable.js");

// non-standard V8
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-installable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var createPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = !fails(function () {
  var error = new Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/export.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var apply = __webpack_require__("./node_modules/core-js-pure/internals/function-apply.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var getOwnPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f;
var isForced = __webpack_require__("./node_modules/core-js-pure/internals/is-forced.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");
var bind = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-context.js");
var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
// add debugging info
__webpack_require__("./node_modules/core-js-pure/internals/shared-store.js");

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof Wrapper) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return apply(NativeConstructor, this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? globalThis : STATIC ? globalThis[TARGET] : globalThis[TARGET] && globalThis[TARGET].prototype;

  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty) continue;

    // bind methods to global for calling from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, globalThis);
    // wrap global constructors for prevent changes in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    createNonEnumerableProperty(target, key, resultProperty);

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
      // export real prototype methods
      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/fails.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-apply.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind-context.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind-native.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-call.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-name.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var classofRaw = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-built-in-prototype-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = function (CONSTRUCTOR, METHOD) {
  var Namespace = path[CONSTRUCTOR + 'Prototype'];
  var pureMethod = Namespace && Namespace[METHOD];
  if (pureMethod) return pureMethod;
  var NativeConstructor = globalThis[CONSTRUCTOR];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  return NativePrototype && NativePrototype[METHOD];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-built-in.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");

var aFunction = function (variable) {
  return isCallable(variable) ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis[namespace])
    : path[namespace] && path[namespace][method] || globalThis[namespace] && globalThis[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof.js");
var getMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-method.js");
var isNullOrUndefined = __webpack_require__("./node_modules/core-js-pure/internals/is-null-or-undefined.js");
var Iterators = __webpack_require__("./node_modules/core-js-pure/internals/iterators.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__("./node_modules/core-js-pure/internals/try-to-string.js");
var getIteratorMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-iterator-method.js");

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-json-replacer-function.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var isArray = __webpack_require__("./node_modules/core-js-pure/internals/is-array.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");
var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");

var push = uncurryThis([].push);

module.exports = function (replacer) {
  if (isCallable(replacer)) return replacer;
  if (!isArray(replacer)) return;
  var rawLength = replacer.length;
  var keys = [];
  for (var i = 0; i < rawLength; i++) {
    var element = replacer[i];
    if (typeof element == 'string') push(keys, element);
    else if (typeof element == 'number' || classof(element) === 'Number' || classof(element) === 'String') push(keys, toString(element));
  }
  var keysLength = keys.length;
  var root = true;
  return function (key, value) {
    if (root) {
      root = false;
      return value;
    }
    if (isArray(this)) return value;
    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__("./node_modules/core-js-pure/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/global-this.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/core-js-pure/internals/has-own-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/hidden-keys.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/host-report-errors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (a, b) {
  try {
    // eslint-disable-next-line no-console -- safe
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/html.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js-pure/internals/ie8-dom-define.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var createElement = __webpack_require__("./node_modules/core-js-pure/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/indexed-object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/inspect-source.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var store = __webpack_require__("./node_modules/core-js-pure/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/install-error-cause.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/internal-state.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__("./node_modules/core-js-pure/internals/weak-map-basic-detection.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var shared = __webpack_require__("./node_modules/core-js-pure/internals/shared-store.js");
var sharedKey = __webpack_require__("./node_modules/core-js-pure/internals/shared-key.js");
var hiddenKeys = __webpack_require__("./node_modules/core-js-pure/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-array-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__("./node_modules/core-js-pure/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-callable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var inspectSource = __webpack_require__("./node_modules/core-js-pure/internals/inspect-source.js");

var noop = function () { /* empty */ };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-forced.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-null-or-undefined.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-possible-prototype.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-pure.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = true;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-symbol.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__("./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-context.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__("./node_modules/core-js-pure/internals/try-to-string.js");
var isArrayIteratorMethod = __webpack_require__("./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");
var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var getIterator = __webpack_require__("./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-iterator-method.js");
var iteratorClose = __webpack_require__("./node_modules/core-js-pure/internals/iterator-close.js");

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-close.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var getMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-method.js");

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-create-constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__("./node_modules/core-js-pure/internals/iterators-core.js").IteratorPrototype;
var create = __webpack_require__("./node_modules/core-js-pure/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__("./node_modules/core-js-pure/internals/set-to-string-tag.js");
var Iterators = __webpack_require__("./node_modules/core-js-pure/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-define.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var FunctionName = __webpack_require__("./node_modules/core-js-pure/internals/function-name.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var createIteratorConstructor = __webpack_require__("./node_modules/core-js-pure/internals/iterator-create-constructor.js");
var getPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__("./node_modules/core-js-pure/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__("./node_modules/core-js-pure/internals/iterators.js");
var IteratorsCore = __webpack_require__("./node_modules/core-js-pure/internals/iterators-core.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    }

    return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterators-core.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var create = __webpack_require__("./node_modules/core-js-pure/internals/object-create.js");
var getPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterators.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/length-of-array-like.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toLength = __webpack_require__("./node_modules/core-js-pure/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/math-trunc.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/microtask.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var safeGetBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/safe-get-built-in.js");
var bind = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-context.js");
var macrotask = __webpack_require__("./node_modules/core-js-pure/internals/task.js").set;
var Queue = __webpack_require__("./node_modules/core-js-pure/internals/queue.js");
var IS_IOS = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-ios.js");
var IS_IOS_PEBBLE = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-ios-pebble.js");
var IS_WEBOS_WEBKIT = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-webos-webkit.js");
var IS_NODE = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-node.js");

var MutationObserver = globalThis.MutationObserver || globalThis.WebKitMutationObserver;
var document = globalThis.document;
var process = globalThis.process;
var Promise = globalThis.Promise;
var microtask = safeGetBuiltIn('queueMicrotask');
var notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!microtask) {
  var queue = new Queue();

  var flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (fn = queue.get()) try {
      fn();
    } catch (error) {
      if (queue.head) notify();
      throw error;
    }
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessage
  // - onreadystatechange
  // - setTimeout
  } else {
    // `webpack` dev server bug on IE global methods - use bind(fn, global)
    macrotask = bind(macrotask, globalThis);
    notify = function () {
      macrotask(flush);
    };
  }

  microtask = function (fn) {
    if (!queue.head) notify();
    queue.add(fn);
  };
}

module.exports = microtask;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/new-promise-capability.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/normalize-string-argument.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-create.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var definePropertiesModule = __webpack_require__("./node_modules/core-js-pure/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__("./node_modules/core-js-pure/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__("./node_modules/core-js-pure/internals/hidden-keys.js");
var html = __webpack_require__("./node_modules/core-js-pure/internals/html.js");
var documentCreateElement = __webpack_require__("./node_modules/core-js-pure/internals/document-create-element.js");
var sharedKey = __webpack_require__("./node_modules/core-js-pure/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-define-properties.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__("./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js");
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var objectKeys = __webpack_require__("./node_modules/core-js-pure/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-define-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__("./node_modules/core-js-pure/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__("./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var toPropertyKey = __webpack_require__("./node_modules/core-js-pure/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__("./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__("./node_modules/core-js-pure/internals/to-property-key.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__("./node_modules/core-js-pure/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-names-external.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-object-getownpropertynames -- safe */
var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");
var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var $getOwnPropertyNames = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-names.js").f;
var arraySlice = __webpack_require__("./node_modules/core-js-pure/internals/array-slice.js");

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) === 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-names.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__("./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__("./node_modules/core-js-pure/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-prototype-of.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var sharedKey = __webpack_require__("./node_modules/core-js-pure/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__("./node_modules/core-js-pure/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-is-prototype-of.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-keys-internal.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var indexOf = __webpack_require__("./node_modules/core-js-pure/internals/array-includes.js").indexOf;
var hiddenKeys = __webpack_require__("./node_modules/core-js-pure/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-keys.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__("./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__("./node_modules/core-js-pure/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-set-prototype-of.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var requireObjectCoercible = __webpack_require__("./node_modules/core-js-pure/internals/require-object-coercible.js");
var aPossiblePrototype = __webpack_require__("./node_modules/core-js-pure/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-to-string.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__("./node_modules/core-js-pure/internals/to-string-tag-support.js");
var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/ordinary-to-primitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/own-keys.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/path.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/perform.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-constructor-detection.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var NativePromiseConstructor = __webpack_require__("./node_modules/core-js-pure/internals/promise-native-constructor.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var isForced = __webpack_require__("./node_modules/core-js-pure/internals/is-forced.js");
var inspectSource = __webpack_require__("./node_modules/core-js-pure/internals/inspect-source.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var ENVIRONMENT = __webpack_require__("./node_modules/core-js-pure/internals/environment.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var V8_VERSION = __webpack_require__("./node_modules/core-js-pure/internals/environment-v8-version.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(globalThis.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  } return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === 'BROWSER' || ENVIRONMENT === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-native-constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");

module.exports = globalThis.Promise;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-resolve.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var newPromiseCapability = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NativePromiseConstructor = __webpack_require__("./node_modules/core-js-pure/internals/promise-native-constructor.js");
var checkCorrectnessOfIteration = __webpack_require__("./node_modules/core-js-pure/internals/check-correctness-of-iteration.js");
var FORCED_PROMISE_CONSTRUCTOR = __webpack_require__("./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR;

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/queue.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Queue = function () {
  this.head = null;
  this.tail = null;
};

Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    var tail = this.tail;
    if (tail) tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      var next = this.head = entry.next;
      if (next === null) this.tail = null;
      return entry.item;
    }
  }
};

module.exports = Queue;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/require-object-coercible.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isNullOrUndefined = __webpack_require__("./node_modules/core-js-pure/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/safe-get-built-in.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
module.exports = function (name) {
  if (!DESCRIPTORS) return globalThis[name];
  var descriptor = getOwnPropertyDescriptor(globalThis, name);
  return descriptor && descriptor.value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/schedulers-fix.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var apply = __webpack_require__("./node_modules/core-js-pure/internals/function-apply.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var ENVIRONMENT = __webpack_require__("./node_modules/core-js-pure/internals/environment.js");
var USER_AGENT = __webpack_require__("./node_modules/core-js-pure/internals/environment-user-agent.js");
var arraySlice = __webpack_require__("./node_modules/core-js-pure/internals/array-slice.js");
var validateArgumentsLength = __webpack_require__("./node_modules/core-js-pure/internals/validate-arguments-length.js");

var Function = globalThis.Function;
// dirty IE9- and Bun 0.3.0- checks
var WRAP = /MSIE .\./.test(USER_AGENT) || ENVIRONMENT === 'BUN' && (function () {
  var version = globalThis.Bun.version.split('.');
  return version.length < 3 || version[0] === '0' && (version[1] < 3 || version[1] === '3' && version[2] === '0');
})();

// IE9- / Bun 0.3.0- setTimeout / setInterval / setImmediate additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
// https://github.com/oven-sh/bun/issues/1633
module.exports = function (scheduler, hasTimeArg) {
  var firstParamIndex = hasTimeArg ? 2 : 1;
  return WRAP ? function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength(arguments.length, 1) > firstParamIndex;
    var fn = isCallable(handler) ? handler : Function(handler);
    var params = boundArgs ? arraySlice(arguments, firstParamIndex) : [];
    var callback = boundArgs ? function () {
      apply(fn, this, params);
    } : fn;
    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
  } : scheduler;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/set-species.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var defineBuiltInAccessor = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineBuiltInAccessor(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/set-to-string-tag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__("./node_modules/core-js-pure/internals/to-string-tag-support.js");
var defineProperty = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js").f;
var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var toString = __webpack_require__("./node_modules/core-js-pure/internals/object-to-string.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  var target = STATIC ? it : it && it.prototype;
  if (target) {
    if (!hasOwn(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared-key.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var shared = __webpack_require__("./node_modules/core-js-pure/internals/shared.js");
var uid = __webpack_require__("./node_modules/core-js-pure/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared-store.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var defineGlobalProperty = __webpack_require__("./node_modules/core-js-pure/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.38.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.38.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var store = __webpack_require__("./node_modules/core-js-pure/internals/shared-store.js");

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/species-constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var aConstructor = __webpack_require__("./node_modules/core-js-pure/internals/a-constructor.js");
var isNullOrUndefined = __webpack_require__("./node_modules/core-js-pure/internals/is-null-or-undefined.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/string-multibyte.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__("./node_modules/core-js-pure/internals/to-integer-or-infinity.js");
var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");
var requireObjectCoercible = __webpack_require__("./node_modules/core-js-pure/internals/require-object-coercible.js");

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/string-pad.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toLength = __webpack_require__("./node_modules/core-js-pure/internals/to-length.js");
var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");
var $repeat = __webpack_require__("./node_modules/core-js-pure/internals/string-repeat.js");
var requireObjectCoercible = __webpack_require__("./node_modules/core-js-pure/internals/require-object-coercible.js");

var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);
var ceil = Math.ceil;

// `String.prototype.{ padStart, padEnd }` methods implementation
var createMethod = function (IS_END) {
  return function ($this, maxLength, fillString) {
    var S = toString(requireObjectCoercible($this));
    var intMaxLength = toLength(maxLength);
    var stringLength = S.length;
    var fillStr = fillString === undefined ? ' ' : toString(fillString);
    var fillLen, stringFiller;
    if (intMaxLength <= stringLength || fillStr === '') return S;
    fillLen = intMaxLength - stringLength;
    stringFiller = repeat(fillStr, ceil(fillLen / fillStr.length));
    if (stringFiller.length > fillLen) stringFiller = stringSlice(stringFiller, 0, fillLen);
    return IS_END ? S + stringFiller : stringFiller + S;
  };
};

module.exports = {
  // `String.prototype.padStart` method
  // https://tc39.es/ecma262/#sec-string.prototype.padstart
  start: createMethod(false),
  // `String.prototype.padEnd` method
  // https://tc39.es/ecma262/#sec-string.prototype.padend
  end: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/string-repeat.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__("./node_modules/core-js-pure/internals/to-integer-or-infinity.js");
var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");
var requireObjectCoercible = __webpack_require__("./node_modules/core-js-pure/internals/require-object-coercible.js");

var $RangeError = RangeError;

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
module.exports = function repeat(count) {
  var str = toString(requireObjectCoercible(this));
  var result = '';
  var n = toIntegerOrInfinity(count);
  if (n < 0 || n === Infinity) throw new $RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__("./node_modules/core-js-pure/internals/environment-v8-version.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/symbol-define-to-primitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in.js");

module.exports = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, { arity: 1 });
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/symbol-is-registered.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

var Symbol = getBuiltIn('Symbol');
var keyFor = Symbol.keyFor;
var thisSymbolValue = uncurryThis(Symbol.prototype.valueOf);

// `Symbol.isRegisteredSymbol` method
// https://tc39.es/proposal-symbol-predicates/#sec-symbol-isregisteredsymbol
module.exports = Symbol.isRegisteredSymbol || function isRegisteredSymbol(value) {
  try {
    return keyFor(thisSymbolValue(value)) !== undefined;
  } catch (error) {
    return false;
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/symbol-is-well-known.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var shared = __webpack_require__("./node_modules/core-js-pure/internals/shared.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var isSymbol = __webpack_require__("./node_modules/core-js-pure/internals/is-symbol.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var Symbol = getBuiltIn('Symbol');
var $isWellKnownSymbol = Symbol.isWellKnownSymbol;
var getOwnPropertyNames = getBuiltIn('Object', 'getOwnPropertyNames');
var thisSymbolValue = uncurryThis(Symbol.prototype.valueOf);
var WellKnownSymbolsStore = shared('wks');

for (var i = 0, symbolKeys = getOwnPropertyNames(Symbol), symbolKeysLength = symbolKeys.length; i < symbolKeysLength; i++) {
  // some old engines throws on access to some keys like `arguments` or `caller`
  try {
    var symbolKey = symbolKeys[i];
    if (isSymbol(Symbol[symbolKey])) wellKnownSymbol(symbolKey);
  } catch (error) { /* empty */ }
}

// `Symbol.isWellKnownSymbol` method
// https://tc39.es/proposal-symbol-predicates/#sec-symbol-iswellknownsymbol
// We should patch it for newly added well-known symbols. If it's not required, this module just will not be injected
module.exports = function isWellKnownSymbol(value) {
  if ($isWellKnownSymbol && $isWellKnownSymbol(value)) return true;
  try {
    var symbol = thisSymbolValue(value);
    for (var j = 0, keys = getOwnPropertyNames(WellKnownSymbolsStore), keysLength = keys.length; j < keysLength; j++) {
      // eslint-disable-next-line eqeqeq -- polyfilled symbols case
      if (WellKnownSymbolsStore[keys[j]] == symbol) return true;
    }
  } catch (error) { /* empty */ }
  return false;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/symbol-registry-detection.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_SYMBOL = __webpack_require__("./node_modules/core-js-pure/internals/symbol-constructor-detection.js");

/* eslint-disable es/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/task.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var apply = __webpack_require__("./node_modules/core-js-pure/internals/function-apply.js");
var bind = __webpack_require__("./node_modules/core-js-pure/internals/function-bind-context.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var html = __webpack_require__("./node_modules/core-js-pure/internals/html.js");
var arraySlice = __webpack_require__("./node_modules/core-js-pure/internals/array-slice.js");
var createElement = __webpack_require__("./node_modules/core-js-pure/internals/document-create-element.js");
var validateArgumentsLength = __webpack_require__("./node_modules/core-js-pure/internals/validate-arguments-length.js");
var IS_IOS = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-ios.js");
var IS_NODE = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-node.js");

var set = globalThis.setImmediate;
var clear = globalThis.clearImmediate;
var process = globalThis.process;
var Dispatch = globalThis.Dispatch;
var Function = globalThis.Function;
var MessageChannel = globalThis.MessageChannel;
var String = globalThis.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;

fails(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = globalThis.location;
});

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var eventListener = function (event) {
  run(event.data);
};

var globalPostMessageDefer = function (id) {
  // old engines have not location.origin
  globalThis.postMessage(String(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    globalThis.addEventListener &&
    isCallable(globalThis.postMessage) &&
    !globalThis.importScripts &&
    $location && $location.protocol !== 'file:' &&
    !fails(globalPostMessageDefer)
  ) {
    defer = globalPostMessageDefer;
    globalThis.addEventListener('message', eventListener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-absolute-index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__("./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-indexed-object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__("./node_modules/core-js-pure/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var trunc = __webpack_require__("./node_modules/core-js-pure/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-length.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__("./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var requireObjectCoercible = __webpack_require__("./node_modules/core-js-pure/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-primitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var isSymbol = __webpack_require__("./node_modules/core-js-pure/internals/is-symbol.js");
var getMethod = __webpack_require__("./node_modules/core-js-pure/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__("./node_modules/core-js-pure/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-property-key.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__("./node_modules/core-js-pure/internals/to-primitive.js");
var isSymbol = __webpack_require__("./node_modules/core-js-pure/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-string-tag-support.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-string.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/try-to-string.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/uid.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__("./node_modules/core-js-pure/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/validate-arguments-length.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/weak-map-basic-detection.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js-pure/internals/well-known-symbol-define.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var wrappedWellKnownSymbolModule = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-wrapped.js");
var defineProperty = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js").f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/well-known-symbol-wrapped.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

exports.f = wellKnownSymbol;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/well-known-symbol.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var shared = __webpack_require__("./node_modules/core-js-pure/internals/shared.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var uid = __webpack_require__("./node_modules/core-js-pure/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__("./node_modules/core-js-pure/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__("./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var getPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var copyConstructorProperties = __webpack_require__("./node_modules/core-js-pure/internals/copy-constructor-properties.js");
var create = __webpack_require__("./node_modules/core-js-pure/internals/object-create.js");
var createNonEnumerableProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var createPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/create-property-descriptor.js");
var installErrorCause = __webpack_require__("./node_modules/core-js-pure/internals/install-error-cause.js");
var installErrorStack = __webpack_require__("./node_modules/core-js-pure/internals/error-stack-install.js");
var iterate = __webpack_require__("./node_modules/core-js-pure/internals/iterate.js");
var normalizeStringArgument = __webpack_require__("./node_modules/core-js-pure/internals/normalize-string-argument.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Error = Error;
var push = [].push;

var $AggregateError = function AggregateError(errors, message /* , options */) {
  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf(new $Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create(AggregateErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  installErrorStack(that, $AggregateError, that.stack, 1);
  if (arguments.length > 2) installErrorCause(that, arguments[2]);
  var errorsArray = [];
  iterate(errors, push, { that: errorsArray });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};

if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);
else copyConstructorProperties($AggregateError, $Error, { name: true });

var AggregateErrorPrototype = $AggregateError.prototype = create($Error.prototype, {
  constructor: createPropertyDescriptor(1, $AggregateError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({ global: true, constructor: true, arity: 2 }, {
  AggregateError: $AggregateError
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.aggregate-error.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__("./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.concat.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var isArray = __webpack_require__("./node_modules/core-js-pure/internals/is-array.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");
var doesNotExceedSafeInteger = __webpack_require__("./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js");
var createProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-property.js");
var arraySpeciesCreate = __webpack_require__("./node_modules/core-js-pure/internals/array-species-create.js");
var arrayMethodHasSpeciesSupport = __webpack_require__("./node_modules/core-js-pure/internals/array-method-has-species-support.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__("./node_modules/core-js-pure/internals/environment-v8-version.js");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        doesNotExceedSafeInteger(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.filter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var $filter = __webpack_require__("./node_modules/core-js-pure/internals/array-iteration.js").filter;
var arrayMethodHasSpeciesSupport = __webpack_require__("./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.find.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var $find = __webpack_require__("./node_modules/core-js-pure/internals/array-iteration.js").find;
var addToUnscopables = __webpack_require__("./node_modules/core-js-pure/internals/add-to-unscopables.js");

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
// eslint-disable-next-line es/no-array-prototype-find -- testing
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.for-each.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var forEach = __webpack_require__("./node_modules/core-js-pure/internals/array-for-each.js");

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({ target: 'Array', proto: true, forced: [].forEach !== forEach }, {
  forEach: forEach
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.from.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var from = __webpack_require__("./node_modules/core-js-pure/internals/array-from.js");
var checkCorrectnessOfIteration = __webpack_require__("./node_modules/core-js-pure/internals/check-correctness-of-iteration.js");

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.index-of.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var $indexOf = __webpack_require__("./node_modules/core-js-pure/internals/array-includes.js").indexOf;
var arrayMethodIsStrict = __webpack_require__("./node_modules/core-js-pure/internals/array-method-is-strict.js");

var nativeIndexOf = uncurryThis([].indexOf);

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: FORCED }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf(this, searchElement, fromIndex) || 0
      : $indexOf(this, searchElement, fromIndex);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.is-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var isArray = __webpack_require__("./node_modules/core-js-pure/internals/is-array.js");

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var addToUnscopables = __webpack_require__("./node_modules/core-js-pure/internals/add-to-unscopables.js");
var Iterators = __webpack_require__("./node_modules/core-js-pure/internals/iterators.js");
var InternalStateModule = __webpack_require__("./node_modules/core-js-pure/internals/internal-state.js");
var defineProperty = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js").f;
var defineIterator = __webpack_require__("./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__("./node_modules/core-js-pure/internals/create-iter-result-object.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  switch (state.kind) {
    case 'keys': return createIterResultObject(index, false);
    case 'values': return createIterResultObject(target[index], false);
  } return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var $map = __webpack_require__("./node_modules/core-js-pure/internals/array-iteration.js").map;
var arrayMethodHasSpeciesSupport = __webpack_require__("./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.push.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");
var setArrayLength = __webpack_require__("./node_modules/core-js-pure/internals/array-set-length.js");
var doesNotExceedSafeInteger = __webpack_require__("./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var isArray = __webpack_require__("./node_modules/core-js-pure/internals/is-array.js");
var isConstructor = __webpack_require__("./node_modules/core-js-pure/internals/is-constructor.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var toAbsoluteIndex = __webpack_require__("./node_modules/core-js-pure/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");
var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var createProperty = __webpack_require__("./node_modules/core-js-pure/internals/create-property.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var arrayMethodHasSpeciesSupport = __webpack_require__("./node_modules/core-js-pure/internals/array-method-has-species-support.js");
var nativeSlice = __webpack_require__("./node_modules/core-js-pure/internals/array-slice.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var $Array = Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array || Constructor === undefined) {
        return nativeSlice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.sort.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__("./node_modules/core-js-pure/internals/length-of-array-like.js");
var deletePropertyOrThrow = __webpack_require__("./node_modules/core-js-pure/internals/delete-property-or-throw.js");
var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var internalSort = __webpack_require__("./node_modules/core-js-pure/internals/array-sort.js");
var arrayMethodIsStrict = __webpack_require__("./node_modules/core-js-pure/internals/array-method-is-strict.js");
var FF = __webpack_require__("./node_modules/core-js-pure/internals/environment-ff-version.js");
var IE_OR_EDGE = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-ie-or-edge.js");
var V8 = __webpack_require__("./node_modules/core-js-pure/internals/environment-v8-version.js");
var WEBKIT = __webpack_require__("./node_modules/core-js-pure/internals/environment-webkit-version.js");

var test = [];
var nativeSort = uncurryThis(test.sort);
var push = uncurryThis(test.push);

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');

var STABLE_SORT = !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 70;
  if (FF && FF > 3) return;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 603;

  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);

    switch (code) {
      case 66: case 69: case 70: case 72: value = 3; break;
      case 68: case 71: value = 4; break;
      default: value = 2;
    }

    for (index = 0; index < 47; index++) {
      test.push({ k: chr + index, v: value });
    }
  }

  test.sort(function (a, b) { return b.v - a.v; });

  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }

  return result !== 'DGBEFHACIJK';
});

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString(x) > toString(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aCallable(comparefn);

    var array = toObject(this);

    if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);

    var items = [];
    var arrayLength = lengthOfArrayLike(array);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) push(items, array[index]);
    }

    internalSort(items, getSortCompare(comparefn));

    itemsLength = lengthOfArrayLike(items);
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) deletePropertyOrThrow(array, index++);

    return array;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.date.now.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");

var $Date = Date;
var thisTimeValue = uncurryThis($Date.prototype.getTime);

// `Date.now` method
// https://tc39.es/ecma262/#sec-date.now
$({ target: 'Date', stat: true }, {
  now: function now() {
    return thisTimeValue(new $Date());
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.date.to-json.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var toPrimitive = __webpack_require__("./node_modules/core-js-pure/internals/to-primitive.js");
var toISOString = __webpack_require__("./node_modules/core-js-pure/internals/date-to-iso-string.js");
var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof-raw.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

var FORCED = fails(function () {
  return new Date(NaN).toJSON() !== null
    || call(Date.prototype.toJSON, { toISOString: function () { return 1; } }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.es/ecma262/#sec-date.prototype.tojson
$({ target: 'Date', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O, 'number');
    return typeof pv == 'number' && !isFinite(pv) ? null :
      (!('toISOString' in O) && classof(O) === 'Date') ? call(toISOString, O) : O.toISOString();
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.json.stringify.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var apply = __webpack_require__("./node_modules/core-js-pure/internals/function-apply.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var isSymbol = __webpack_require__("./node_modules/core-js-pure/internals/is-symbol.js");
var arraySlice = __webpack_require__("./node_modules/core-js-pure/internals/array-slice.js");
var getReplacerFunction = __webpack_require__("./node_modules/core-js-pure/internals/get-json-replacer-function.js");
var NATIVE_SYMBOL = __webpack_require__("./node_modules/core-js-pure/internals/symbol-constructor-detection.js");

var $String = String;
var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')('stringify detection');
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) !== '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) !== '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) !== '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = getReplacerFunction(replacer);
  if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
  args[1] = function (key, value) {
    // some old implementations (like WebKit) could pass numbers as keys
    if (isCallable($replacer)) value = call($replacer, this, $String(key), value);
    if (!isSymbol(value)) return value;
  };
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.json.to-string-tag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var setToStringTag = __webpack_require__("./node_modules/core-js-pure/internals/set-to-string-tag.js");

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(globalThis.JSON, 'JSON', true);


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.math.to-string-tag.js":
/***/ (function(module, exports) {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.define-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var defineProperty = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js").f;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
// eslint-disable-next-line es/no-object-defineproperty -- safe
$({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty, sham: !DESCRIPTORS }, {
  defineProperty: defineProperty
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.get-own-property-symbols.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var NATIVE_SYMBOL = __webpack_require__("./node_modules/core-js-pure/internals/symbol-constructor-detection.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var getOwnPropertySymbolsModule = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({ target: 'Object', stat: true, forced: FORCED }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.keys.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var toObject = __webpack_require__("./node_modules/core-js-pure/internals/to-object.js");
var nativeKeys = __webpack_require__("./node_modules/core-js-pure/internals/object-keys.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.to-string.js":
/***/ (function(module, exports) {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.all-settled.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__("./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__("./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__("./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: error };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.all.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__("./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__("./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__("./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.any.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__("./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__("./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__("./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn('AggregateError');
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.catch.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var FORCED_PROMISE_CONSTRUCTOR = __webpack_require__("./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR;
var NativePromiseConstructor = __webpack_require__("./node_modules/core-js-pure/internals/promise-native-constructor.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['catch'];
  if (NativePromisePrototype['catch'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'catch', method, { unsafe: true });
  }
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var IS_NODE = __webpack_require__("./node_modules/core-js-pure/internals/environment-is-node.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in.js");
var setPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__("./node_modules/core-js-pure/internals/set-to-string-tag.js");
var setSpecies = __webpack_require__("./node_modules/core-js-pure/internals/set-species.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__("./node_modules/core-js-pure/internals/is-object.js");
var anInstance = __webpack_require__("./node_modules/core-js-pure/internals/an-instance.js");
var speciesConstructor = __webpack_require__("./node_modules/core-js-pure/internals/species-constructor.js");
var task = __webpack_require__("./node_modules/core-js-pure/internals/task.js").set;
var microtask = __webpack_require__("./node_modules/core-js-pure/internals/microtask.js");
var hostReportErrors = __webpack_require__("./node_modules/core-js-pure/internals/host-report-errors.js");
var perform = __webpack_require__("./node_modules/core-js-pure/internals/perform.js");
var Queue = __webpack_require__("./node_modules/core-js-pure/internals/queue.js");
var InternalStateModule = __webpack_require__("./node_modules/core-js-pure/internals/internal-state.js");
var NativePromiseConstructor = __webpack_require__("./node_modules/core-js-pure/internals/promise-native-constructor.js");
var PromiseConstructorDetection = __webpack_require__("./node_modules/core-js-pure/internals/promise-constructor-detection.js");
var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var PromiseConstructor = NativePromiseConstructor;
var PromisePrototype = NativePromisePrototype;
var TypeError = globalThis.TypeError;
var document = globalThis.document;
var process = globalThis.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && globalThis.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state === FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(new TypeError('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    globalThis.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, globalThis, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call(task, globalThis, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw new TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };

  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: null
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable(onRejected) && onRejected;
    reaction.domain = IS_NODE ? process.domain : undefined;
    if (state.state === PENDING) state.reactions.add(reaction);
    else microtask(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });

  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };

  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.finally.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var NativePromiseConstructor = __webpack_require__("./node_modules/core-js-pure/internals/promise-native-constructor.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__("./node_modules/core-js-pure/internals/is-callable.js");
var speciesConstructor = __webpack_require__("./node_modules/core-js-pure/internals/species-constructor.js");
var promiseResolve = __webpack_require__("./node_modules/core-js-pure/internals/promise-resolve.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromiseConstructor && fails(function () {
  // eslint-disable-next-line unicorn/no-thenable -- required for testing
  NativePromisePrototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = isCallable(onFinally);
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (NativePromisePrototype['finally'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'finally', method, { unsafe: true });
  }
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.constructor.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.all.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.catch.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.race.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.reject.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.promise.resolve.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.race.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__("./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__("./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__("./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__("./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.reject.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");
var FORCED_PROMISE_CONSTRUCTOR = __webpack_require__("./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR;

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    var capabilityReject = capability.reject;
    capabilityReject(r);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.resolve.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var NativePromiseConstructor = __webpack_require__("./node_modules/core-js-pure/internals/promise-native-constructor.js");
var FORCED_PROMISE_CONSTRUCTOR = __webpack_require__("./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR;
var promiseResolve = __webpack_require__("./node_modules/core-js-pure/internals/promise-resolve.js");

var PromiseConstructorWrapper = getBuiltIn('Promise');
var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$({ target: 'Promise', stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.with-resolvers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js-pure/internals/new-promise-capability.js");

// `Promise.withResolvers` method
// https://github.com/tc39/proposal-promise-with-resolvers
$({ target: 'Promise', stat: true }, {
  withResolvers: function withResolvers() {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    return {
      promise: promiseCapability.promise,
      resolve: promiseCapability.resolve,
      reject: promiseCapability.reject
    };
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.reflect.to-string-tag.js":
/***/ (function(module, exports) {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.string.iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__("./node_modules/core-js-pure/internals/string-multibyte.js").charAt;
var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");
var InternalStateModule = __webpack_require__("./node_modules/core-js-pure/internals/internal-state.js");
var defineIterator = __webpack_require__("./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__("./node_modules/core-js-pure/internals/create-iter-result-object.js");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.async-iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.constructor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var call = __webpack_require__("./node_modules/core-js-pure/internals/function-call.js");
var uncurryThis = __webpack_require__("./node_modules/core-js-pure/internals/function-uncurry-this.js");
var IS_PURE = __webpack_require__("./node_modules/core-js-pure/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__("./node_modules/core-js-pure/internals/descriptors.js");
var NATIVE_SYMBOL = __webpack_require__("./node_modules/core-js-pure/internals/symbol-constructor-detection.js");
var fails = __webpack_require__("./node_modules/core-js-pure/internals/fails.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var anObject = __webpack_require__("./node_modules/core-js-pure/internals/an-object.js");
var toIndexedObject = __webpack_require__("./node_modules/core-js-pure/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__("./node_modules/core-js-pure/internals/to-property-key.js");
var $toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");
var createPropertyDescriptor = __webpack_require__("./node_modules/core-js-pure/internals/create-property-descriptor.js");
var nativeObjectCreate = __webpack_require__("./node_modules/core-js-pure/internals/object-create.js");
var objectKeys = __webpack_require__("./node_modules/core-js-pure/internals/object-keys.js");
var getOwnPropertyNamesModule = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-names.js");
var getOwnPropertyNamesExternal = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-names-external.js");
var getOwnPropertySymbolsModule = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var getOwnPropertyDescriptorModule = __webpack_require__("./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js");
var definePropertiesModule = __webpack_require__("./node_modules/core-js-pure/internals/object-define-properties.js");
var propertyIsEnumerableModule = __webpack_require__("./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in.js");
var defineBuiltInAccessor = __webpack_require__("./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var shared = __webpack_require__("./node_modules/core-js-pure/internals/shared.js");
var sharedKey = __webpack_require__("./node_modules/core-js-pure/internals/shared-key.js");
var hiddenKeys = __webpack_require__("./node_modules/core-js-pure/internals/hidden-keys.js");
var uid = __webpack_require__("./node_modules/core-js-pure/internals/uid.js");
var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var wrappedWellKnownSymbolModule = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-wrapped.js");
var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");
var defineSymbolToPrimitive = __webpack_require__("./node_modules/core-js-pure/internals/symbol-define-to-primitive.js");
var setToStringTag = __webpack_require__("./node_modules/core-js-pure/internals/set-to-string-tag.js");
var InternalStateModule = __webpack_require__("./node_modules/core-js-pure/internals/internal-state.js");
var $forEach = __webpack_require__("./node_modules/core-js-pure/internals/array-iteration.js").forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);

var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = globalThis.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var RangeError = globalThis.RangeError;
var TypeError = globalThis.TypeError;
var QObject = globalThis.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var fallbackDefineProperty = function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
};

var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a !== 7;
}) ? fallbackDefineProperty : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, nativeObjectCreate(null)));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw new TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      var $this = this === undefined ? globalThis : this;
      if ($this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn($this, HIDDEN) && hasOwn($this[HIDDEN], tag)) $this[HIDDEN][tag] = false;
      var descriptor = createPropertyDescriptor(1, value);
      try {
        setSymbolDescriptor($this, tag, descriptor);
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        fallbackDefineProperty($this, tag, descriptor);
      }
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });

  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    defineBuiltInAccessor(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.description.js":
/***/ (function(module, exports) {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.for.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var toString = __webpack_require__("./node_modules/core-js-pure/internals/to-string.js");
var shared = __webpack_require__("./node_modules/core-js-pure/internals/shared.js");
var NATIVE_SYMBOL_REGISTRY = __webpack_require__("./node_modules/core-js-pure/internals/symbol-registry-detection.js");

var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.has-instance.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.hasInstance` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.is-concat-spreadable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.constructor.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.for.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.symbol.key-for.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.json.stringify.js");
__webpack_require__("./node_modules/core-js-pure/modules/es.object.get-own-property-symbols.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.key-for.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var isSymbol = __webpack_require__("./node_modules/core-js-pure/internals/is-symbol.js");
var tryToString = __webpack_require__("./node_modules/core-js-pure/internals/try-to-string.js");
var shared = __webpack_require__("./node_modules/core-js-pure/internals/shared.js");
var NATIVE_SYMBOL_REGISTRY = __webpack_require__("./node_modules/core-js-pure/internals/symbol-registry-detection.js");

var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw new TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.match-all.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.matchAll` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.matchall
defineWellKnownSymbol('matchAll');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.match.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.match` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.replace.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.replace` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.search.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.search` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.species.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.species` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.split.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.split` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.to-primitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");
var defineSymbolToPrimitive = __webpack_require__("./node_modules/core-js-pure/internals/symbol-define-to-primitive.js");

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.to-string-tag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("./node_modules/core-js-pure/internals/get-built-in.js");
var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");
var setToStringTag = __webpack_require__("./node_modules/core-js-pure/internals/set-to-string-tag.js");

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag(getBuiltIn('Symbol'), 'Symbol');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.symbol.unscopables.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.unscopables` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.function.metadata.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol.js");
var defineProperty = __webpack_require__("./node_modules/core-js-pure/internals/object-define-property.js").f;

var METADATA = wellKnownSymbol('metadata');
var FunctionPrototype = Function.prototype;

// Function.prototype[@@metadata]
// https://github.com/tc39/proposal-decorator-metadata
if (FunctionPrototype[METADATA] === undefined) {
  defineProperty(FunctionPrototype, METADATA, {
    value: null
  });
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.async-dispose.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-async-explicit-resource-management
defineWellKnownSymbol('asyncDispose');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.custom-matcher.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.customMatcher` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('customMatcher');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.dispose.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-explicit-resource-management
defineWellKnownSymbol('dispose');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.is-registered-symbol.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var isRegisteredSymbol = __webpack_require__("./node_modules/core-js-pure/internals/symbol-is-registered.js");

// `Symbol.isRegisteredSymbol` method
// https://tc39.es/proposal-symbol-predicates/#sec-symbol-isregisteredsymbol
$({ target: 'Symbol', stat: true }, {
  isRegisteredSymbol: isRegisteredSymbol
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.is-registered.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var isRegisteredSymbol = __webpack_require__("./node_modules/core-js-pure/internals/symbol-is-registered.js");

// `Symbol.isRegistered` method
// obsolete version of https://tc39.es/proposal-symbol-predicates/#sec-symbol-isregisteredsymbol
$({ target: 'Symbol', stat: true, name: 'isRegisteredSymbol' }, {
  isRegistered: isRegisteredSymbol
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.is-well-known-symbol.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var isWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/symbol-is-well-known.js");

// `Symbol.isWellKnownSymbol` method
// https://tc39.es/proposal-symbol-predicates/#sec-symbol-iswellknownsymbol
// We should patch it for newly added well-known symbols. If it's not required, this module just will not be injected
$({ target: 'Symbol', stat: true, forced: true }, {
  isWellKnownSymbol: isWellKnownSymbol
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.is-well-known.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var isWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/symbol-is-well-known.js");

// `Symbol.isWellKnown` method
// obsolete version of https://tc39.es/proposal-symbol-predicates/#sec-symbol-iswellknownsymbol
// We should patch it for newly added well-known symbols. If it's not required, this module just will not be injected
$({ target: 'Symbol', stat: true, name: 'isWellKnownSymbol', forced: true }, {
  isWellKnown: isWellKnownSymbol
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.matcher.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.matcher` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('matcher');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.metadata-key.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.metadataKey` well-known symbol
// https://github.com/tc39/proposal-decorator-metadata
defineWellKnownSymbol('metadataKey');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.metadata.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.metadata` well-known symbol
// https://github.com/tc39/proposal-decorators
defineWellKnownSymbol('metadata');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.observable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.pattern-match.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.symbol.replace-all.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__("./node_modules/core-js-pure/internals/well-known-symbol-define.js");

defineWellKnownSymbol('replaceAll');


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.dom-collections.for-each.js":
/***/ (function(module, exports) {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/es.array.iterator.js");
var DOMIterables = __webpack_require__("./node_modules/core-js-pure/internals/dom-iterables.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var setToStringTag = __webpack_require__("./node_modules/core-js-pure/internals/set-to-string-tag.js");
var Iterators = __webpack_require__("./node_modules/core-js-pure/internals/iterators.js");

for (var COLLECTION_NAME in DOMIterables) {
  setToStringTag(globalThis[COLLECTION_NAME], COLLECTION_NAME);
  Iterators[COLLECTION_NAME] = Iterators.Array;
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.set-interval.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var schedulersFix = __webpack_require__("./node_modules/core-js-pure/internals/schedulers-fix.js");

var setInterval = schedulersFix(globalThis.setInterval, true);

// Bun / IE9- setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
$({ global: true, bind: true, forced: globalThis.setInterval !== setInterval }, {
  setInterval: setInterval
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.set-timeout.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js-pure/internals/export.js");
var globalThis = __webpack_require__("./node_modules/core-js-pure/internals/global-this.js");
var schedulersFix = __webpack_require__("./node_modules/core-js-pure/internals/schedulers-fix.js");

var setTimeout = schedulersFix(globalThis.setTimeout, true);

// Bun / IE9- setTimeout additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
$({ global: true, bind: true, forced: globalThis.setTimeout !== setTimeout }, {
  setTimeout: setTimeout
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.timers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__("./node_modules/core-js-pure/modules/web.set-interval.js");
__webpack_require__("./node_modules/core-js-pure/modules/web.set-timeout.js");


/***/ }),

/***/ "./node_modules/core-js-pure/stable/array/from.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/array/from.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/array/is-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/array/is-array.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/array/virtual/for-each.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/array/virtual/for-each.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/date/now.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/date/now.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/get-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/get-iterator-method.js");
__webpack_require__("./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/filter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/instance/filter.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/find.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/instance/find.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/for-each.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__("./node_modules/core-js-pure/internals/classof.js");
var hasOwn = __webpack_require__("./node_modules/core-js-pure/internals/has-own-property.js");
var isPrototypeOf = __webpack_require__("./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__("./node_modules/core-js-pure/stable/array/virtual/for-each.js");
__webpack_require__("./node_modules/core-js-pure/modules/web.dom-collections.for-each.js");

var ArrayPrototype = Array.prototype;

var DOMIterables = {
  DOMTokenList: true,
  NodeList: true
};

module.exports = function (it) {
  var own = it.forEach;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.forEach)
    || hasOwn(DOMIterables, classof(it)) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/index-of.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/instance/index-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/instance/map.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/push.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/instance/push.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/slice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/instance/slice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/sort.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/instance/sort.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/json/stringify.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/json/stringify.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/define-property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/object/define-property.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/keys.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/object/keys.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/promise/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/promise/index.js");
__webpack_require__("./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/set-timeout.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("./node_modules/core-js-pure/modules/web.timers.js");
var path = __webpack_require__("./node_modules/core-js-pure/internals/path.js");

module.exports = path.setTimeout;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__("./node_modules/core-js-pure/es/symbol/index.js");
__webpack_require__("./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/jquery/dist/jquery.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
( function( global, factory ) {

	"use strict";

	if (  true && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var version = "3.7.1",

	rhtmlSuffix = /HTML$/i,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},


	// Retrieve the text value of an array of DOM nodes
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				ret += jQuery.text( node );
			}
		}
		if ( nodeType === 1 || nodeType === 11 ) {
			return elem.textContent;
		}
		if ( nodeType === 9 ) {
			return elem.documentElement.textContent;
		}
		if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	isXMLDoc: function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

		// Assume HTML when documentElement doesn't yet exist, such as inside
		// document fragments.
		return !rhtmlSuffix.test( namespace || docElem && docElem.nodeName || "HTML" );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}


function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var pop = arr.pop;


var sort = arr.sort;


var splice = arr.splice;


var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




// Note: an element does not contain itself
jQuery.contains = function( a, b ) {
	var bup = b && b.parentNode;

	return a === bup || !!( bup && bup.nodeType === 1 && (

		// Support: IE 9 - 11+
		// IE doesn't have `contains` on SVG.
		a.contains ?
			a.contains( bup ) :
			a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	) );
};




// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

function fcssescape( ch, asCodePoint ) {
	if ( asCodePoint ) {

		// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
		if ( ch === "\0" ) {
			return "\uFFFD";
		}

		// Control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
	}

	// Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;
}

jQuery.escapeSelector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};




var preferredDoc = document,
	pushNative = push;

( function() {

var i,
	Expr,
	outermostContext,
	sortInput,
	hasDuplicate,
	push = pushNative,

	// Local document vars
	document,
	documentElement,
	documentIsHTML,
	rbuggyQSA,
	matches,

	// Instance-specific data
	expando = jQuery.expando,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
		"loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
		whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		ID: new RegExp( "^#(" + identifier + ")" ),
		CLASS: new RegExp( "^\\.(" + identifier + ")" ),
		TAG: new RegExp( "^(" + identifier + "|[*])" ),
		ATTR: new RegExp( "^" + attributes ),
		PSEUDO: new RegExp( "^" + pseudos ),
		CHILD: new RegExp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		bool: new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		needsContext: new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		return high < 0 ?
			String.fromCharCode( high + 0x10000 ) :
			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes; see `setDocument`.
	// Support: IE 9 - 11+, Edge 12 - 18+
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE/Edge.
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && nodeName( elem, "fieldset" );
		},
		{ dir: "parentNode", next: "legend" }
	);

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android <=4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = {
		apply: function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		},
		call: function( target ) {
			pushNative.apply( target, slice.call( arguments, 1 ) );
		}
	};
}

function find( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE 9 only
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								push.call( results, elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE 9 only
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							find.contains( context, elem ) &&
							elem.id === m ) {

							push.call( results, elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( !nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when
					// strict-comparing two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( newContext != context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = jQuery.escapeSelector( nid );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrimCSS, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties
		// (see https://github.com/jquery/sizzle/issues/157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by jQuery selector module
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		return nodeName( elem, "input" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		return ( nodeName( elem, "input" ) || nodeName( elem, "button" ) ) &&
			elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11+
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a jQuery selector context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [node] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
function setDocument( node ) {
	var subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	documentElement = document.documentElement;
	documentIsHTML = !jQuery.isXMLDoc( document );

	// Support: iOS 7 only, IE 9 - 11+
	// Older browsers didn't support unprefixed `matches`.
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.msMatchesSelector;

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors
	// (see trac-13936).
	// Limit the fix to IE & Edge Legacy; despite Edge 15+ implementing `matches`,
	// all IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
	if ( documentElement.msMatchesSelector &&

		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 9 - 11+, Edge 12 - 18+
		subWindow.addEventListener( "unload", unloadHandler );
	}

	// Support: IE <10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		documentElement.appendChild( el ).id = jQuery.expando;
		return !document.getElementsByName ||
			!document.getElementsByName( jQuery.expando ).length;
	} );

	// Support: IE 9 only
	// Check to see if it's possible to do matchesSelector
	// on a disconnected node.
	support.disconnectedMatch = assert( function( el ) {
		return matches.call( el, "*" );
	} );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// IE/Edge don't support the :scope pseudo-class.
	support.scope = assert( function() {
		return document.querySelectorAll( ":scope" );
	} );

	// Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
	// Make sure the `:has()` argument is parsed unforgivingly.
	// We include `*` in the test to detect buggy implementations that are
	// _selectively_ forgiving (specifically when the list includes at least
	// one valid selector).
	// Note that we treat complete lack of support for `:has()` as if it were
	// spec-compliant support, which is fine because use of `:has()` in such
	// environments will fail in the qSA path and fall back to jQuery traversal
	// anyway.
	support.cssHas = assert( function() {
		try {
			document.querySelector( ":has(*,:jqfake)" );
			return false;
		} catch ( e ) {
			return true;
		}
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter.ID =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find.TAG = function( tag, context ) {
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			return context.getElementsByTagName( tag );

		// DocumentFragment nodes don't have gEBTN
		} else {
			return context.querySelectorAll( tag );
		}
	};

	// Class
	Expr.find.CLASS = function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	rbuggyQSA = [];

	// Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert( function( el ) {

		var input;

		documentElement.appendChild( el ).innerHTML =
			"<a id='" + expando + "' href='' disabled='disabled'></a>" +
			"<select id='" + expando + "-\r\\' disabled='disabled'>" +
			"<option selected=''></option></select>";

		// Support: iOS <=7 - 8 only
		// Boolean attributes and "value" are not treated correctly in some XML documents
		if ( !el.querySelectorAll( "[selected]" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
		}

		// Support: iOS <=7 - 8 only
		if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
			rbuggyQSA.push( "~=" );
		}

		// Support: iOS 8 only
		// https://bugs.webkit.org/show_bug.cgi?id=136851
		// In-page `selector#id sibling-combinator selector` fails
		if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
			rbuggyQSA.push( ".#.+[+~]" );
		}

		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		if ( !el.querySelectorAll( ":checked" ).length ) {
			rbuggyQSA.push( ":checked" );
		}

		// Support: Windows 8 Native Apps
		// The type and name attributes are restricted during .innerHTML assignment
		input = document.createElement( "input" );
		input.setAttribute( "type", "hidden" );
		el.appendChild( input ).setAttribute( "name", "D" );

		// Support: IE 9 - 11+
		// IE's :disabled selector does not pick up the children of disabled fieldsets
		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		documentElement.appendChild( el ).disabled = true;
		if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
			rbuggyQSA.push( ":enabled", ":disabled" );
		}

		// Support: IE 11+, Edge 15 - 18+
		// IE 11/Edge don't find elements on a `[name='']` query in some cases.
		// Adding a temporary attribute to the document before the selection works
		// around the issue.
		// Interestingly, IE 10 & older don't seem to have the issue.
		input = document.createElement( "input" );
		input.setAttribute( "name", "" );
		el.appendChild( input );
		if ( !el.querySelectorAll( "[name='']" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
				whitespace + "*(?:''|\"\")" );
		}
	} );

	if ( !support.cssHas ) {

		// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
		// Our regular `try-catch` mechanism fails to detect natively-unsupported
		// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
		// in browsers that parse the `:has()` argument as a forgiving selector list.
		// https://drafts.csswg.org/selectors/#relational now requires the argument
		// to be parsed unforgivingly, but browsers have not yet fully adjusted.
		rbuggyQSA.push( ":has" );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a === document || a.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b === document || b.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	};

	return document;
}

find.matches = function( expr, elements ) {
	return find( expr, null, null, elements );
};

find.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyQSA || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return find( expr, document, null, [ elem ] ).length > 0;
};

find.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return jQuery.contains( context, elem );
};


find.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (see trac-13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	if ( val !== undefined ) {
		return val;
	}

	return elem.getAttribute( name );
};

find.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	//
	// Support: Android <=4.0+
	// Testing for detecting duplicates is unpredictable so instead assume we can't
	// depend on duplicate detection in all browsers without a stable sort.
	hasDuplicate = !support.sortStable;
	sortInput = !support.sortStable && slice.call( results, 0 );
	sort.call( results, sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			splice.call( results, duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

jQuery.fn.uniqueSort = function() {
	return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
};

Expr = jQuery.expr = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		ATTR: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
				.replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		CHILD: function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				find.error( match[ 0 ] );
			}

			return match;
		},

		PSEUDO: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		TAG: function( nodeNameSelector ) {
			var expectedNodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return nodeName( elem, expectedNodeName );
				};
		},

		CLASS: function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace + ")" + className +
					"(" + whitespace + "|$)" ) ) &&
				classCache( className, function( elem ) {
					return pattern.test(
						typeof elem.className === "string" && elem.className ||
							typeof elem.getAttribute !== "undefined" &&
								elem.getAttribute( "class" ) ||
							""
					);
				} );
		},

		ATTR: function( name, operator, check ) {
			return function( elem ) {
				var result = find.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				if ( operator === "=" ) {
					return result === check;
				}
				if ( operator === "!=" ) {
					return result !== check;
				}
				if ( operator === "^=" ) {
					return check && result.indexOf( check ) === 0;
				}
				if ( operator === "*=" ) {
					return check && result.indexOf( check ) > -1;
				}
				if ( operator === "$=" ) {
					return check && result.slice( -check.length ) === check;
				}
				if ( operator === "~=" ) {
					return ( " " + result.replace( rwhitespace, " " ) + " " )
						.indexOf( check ) > -1;
				}
				if ( operator === "|=" ) {
					return result === check || result.slice( 0, check.length + 1 ) === check + "-";
				}

				return false;
			};
		},

		CHILD: function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || ( parent[ expando ] = {} );
							cache = outerCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {
								outerCache = elem[ expando ] || ( elem[ expando ] = {} );
								cache = outerCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );
											outerCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		PSEUDO: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// https://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					find.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as jQuery does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		not: markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrimCSS, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element
					// (see https://github.com/jquery/sizzle/issues/299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markFunction( function( selector ) {
			return function( elem ) {
				return find( selector, elem ).length > 0;
			};
		} ),

		contains: markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || jQuery.text( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// https://www.w3.org/TR/selectors/#lang-pseudo
		lang: markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				find.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		target: function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === documentElement;
		},

		focus: function( elem ) {
			return elem === safeActiveElement() &&
				document.hasFocus() &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		enabled: createDisabledPseudo( false ),
		disabled: createDisabledPseudo( true ),

		checked: function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			return ( nodeName( elem, "input" ) && !!elem.checked ) ||
				( nodeName( elem, "option" ) && !!elem.selected );
		},

		selected: function( elem ) {

			// Support: IE <=11+
			// Accessing the selectedIndex property
			// forces the browser to treat the default option as
			// selected when in an optgroup.
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		empty: function( elem ) {

			// https://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !Expr.pseudos.empty( elem );
		},

		// Element/input types
		header: function( elem ) {
			return rheader.test( elem.nodeName );
		},

		input: function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		button: function( elem ) {
			return nodeName( elem, "input" ) && elem.type === "button" ||
				nodeName( elem, "button" );
		},

		text: function( elem ) {
			var attr;
			return nodeName( elem, "input" ) && elem.type === "text" &&

				// Support: IE <10 only
				// New HTML5 attribute values (e.g., "search") appear
				// with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		first: createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		last: createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		odd: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i;

			if ( argument < 0 ) {
				i = argument + length;
			} else if ( argument > length ) {
				i = length;
			} else {
				i = argument;
			}

			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos.nth = Expr.pseudos.eq;

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrimCSS, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	if ( parseOnly ) {
		return soFar.length;
	}

	return soFar ?
		find.error( selector ) :

		// Cache the tokens
		tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						if ( skip && nodeName( elem, skip ) ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = outerCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							outerCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		find( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem, matcherOut,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed ||
				multipleContexts( selector || "*",
					context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems;

		if ( matcher ) {

			// If we have a postFinder, or filtered seed, or non-seed postFilter
			// or preexisting results,
			matcherOut = postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results;

			// Find primary matches
			matcher( matcherIn, matcherOut, context, xml );
		} else {
			matcherOut = matcherIn;
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf.call( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			var ret = ( !leadingRelative && ( xml || context != outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element
			// (see https://github.com/jquery/sizzle/issues/299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrimCSS, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find.TAG( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: iOS <=7 - 9 only
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
			// elements by id. (see trac-14142)
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							push.call( results, elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					jQuery.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

function compile( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
}

/**
 * A low-level selection function that works with jQuery's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with jQuery selector compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find.ID(
				token.matches[ 0 ].replace( runescape, funescape ),
				context
			) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) &&
						testContext( context.parentNode ) || context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Support: Android <=4.0 - 4.1+
// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Initialize against the default document
setDocument();

// Support: Android <=4.0 - 4.1+
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

jQuery.find = find;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.unique = jQuery.uniqueSort;

// These have always been private, but they used to be documented as part of
// Sizzle so let's maintain them for now for backwards compatibility purposes.
find.compile = compile;
find.select = select;
find.setDocument = setDocument;
find.tokenize = tokenize;

find.escape = jQuery.escapeSelector;
find.getText = jQuery.text;
find.isXML = jQuery.isXMLDoc;
find.selectors = jQuery.expr;
find.support = jQuery.support;
find.uniqueSort = jQuery.uniqueSort;

	/* eslint-enable */

} )();


var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to jQuery#find
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.error );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the error, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getErrorHook ) {
									process.error = jQuery.Deferred.getErrorHook();

								// The deprecated alias of the above. While the name suggests
								// returning the stack, not an error instance, jQuery just passes
								// it directly to `console.warn` so both will work; an instance
								// just better cooperates with source maps.
								} else if ( jQuery.Deferred.getStackHook ) {
									process.error = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// If `jQuery.Deferred.getErrorHook` is defined, `asyncError` is an error
// captured before the async barrier to get the original error cause
// which may otherwise be hidden.
jQuery.Deferred.exceptionHook = function( error, asyncError ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message,
			error.stack, asyncError );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", true );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, isSetup ) {

	// Missing `isSetup` indicates a trigger call, which must force setup through jQuery.event.add
	if ( !isSetup ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				if ( !saved ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					this[ type ]();
					result = dataPriv.get( this, type );
					dataPriv.set( this, type, false );

					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						return result;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering
				// the native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved ) {

				// ...and capture the result
				dataPriv.set( this, type, jQuery.event.trigger(
					saved[ 0 ],
					saved.slice( 1 ),
					this
				) );

				// Abort handling of the native event by all jQuery handlers while allowing
				// native handlers on the same element to run. On target, this is achieved
				// by stopping immediate propagation just on the jQuery event. However,
				// the native event is re-wrapped by a jQuery one on each level of the
				// propagation so the only way to stop it for jQuery is to stop it for
				// everyone via native `stopPropagation()`. This is not a problem for
				// focus/blur which don't bubble, but it does also stop click on checkboxes
				// and radios. We accept this limitation.
				event.stopPropagation();
				event.isImmediatePropagationStopped = returnTrue;
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {

	function focusMappedHandler( nativeEvent ) {
		if ( document.documentMode ) {

			// Support: IE 11+
			// Attach a single focusin/focusout handler on the document while someone wants
			// focus/blur. This is because the former are synchronous in IE while the latter
			// are async. In other browsers, all those handlers are invoked synchronously.

			// `handle` from private data would already wrap the event, but we need
			// to change the `type` here.
			var handle = dataPriv.get( this, "handle" ),
				event = jQuery.event.fix( nativeEvent );
			event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
			event.isSimulated = true;

			// First, handle focusin/focusout
			handle( nativeEvent );

			// ...then, handle focus/blur
			//
			// focus/blur don't bubble while focusin/focusout do; simulate the former by only
			// invoking the handler at the lower level.
			if ( event.target === event.currentTarget ) {

				// The setup part calls `leverageNative`, which, in turn, calls
				// `jQuery.event.add`, so event handle will already have been set
				// by this point.
				handle( event );
			}
		} else {

			// For non-IE browsers, attach a single capturing handler on the document
			// while someone wants focusin/focusout.
			jQuery.event.simulate( delegateType, nativeEvent.target,
				jQuery.event.fix( nativeEvent ) );
		}
	}

	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			var attaches;

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, true );

			if ( document.documentMode ) {

				// Support: IE 9 - 11+
				// We use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// Use `delegateType` as the key as `type` is already used by `leverageNative`.
				attaches = dataPriv.get( this, delegateType );
				if ( !attaches ) {
					this.addEventListener( delegateType, focusMappedHandler );
				}
				dataPriv.set( this, delegateType, ( attaches || 0 ) + 1 );
			} else {

				// Return false to allow normal processing in the caller
				return false;
			}
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		teardown: function() {
			var attaches;

			if ( document.documentMode ) {
				attaches = dataPriv.get( this, delegateType ) - 1;
				if ( !attaches ) {
					this.removeEventListener( delegateType, focusMappedHandler );
					dataPriv.remove( this, delegateType );
				} else {
					dataPriv.set( this, delegateType, attaches );
				}
			} else {

				// Return false to indicate standard teardown should be applied
				return false;
			}
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	//
	// Support: IE 9 - 11+
	// To preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
	// attach a single handler for both events in IE.
	jQuery.event.special[ delegateType ] = {
		setup: function() {

			// Handle: regular nodes (via `this.ownerDocument`), window
			// (via `this.document`) & document (via `this`).
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType );

			// Support: IE 9 - 11+
			// We use the same native handler for focusin & focus (and focusout & blur)
			// so we need to coordinate setup & teardown parts between those events.
			// Use `delegateType` as the key as `type` is already used by `leverageNative`.
			if ( !attaches ) {
				if ( document.documentMode ) {
					this.addEventListener( delegateType, focusMappedHandler );
				} else {
					doc.addEventListener( type, focusMappedHandler, true );
				}
			}
			dataPriv.set( dataHolder, delegateType, ( attaches || 0 ) + 1 );
		},
		teardown: function() {
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType ) - 1;

			if ( !attaches ) {
				if ( document.documentMode ) {
					this.removeEventListener( delegateType, focusMappedHandler );
				} else {
					doc.removeEventListener( type, focusMappedHandler, true );
				}
				dataPriv.remove( dataHolder, delegateType );
			} else {
				dataPriv.set( dataHolder, delegateType, attaches );
			}
		}
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Re-enable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew jQuery#find here for performance reasons:
			// https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "box-sizing:content-box;border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is `display: block`
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {

		// Support: IE <=9 - 11+
		// IE only supports `"float"` in `getPropertyValue`; in computed styles
		// it's only available as `"cssFloat"`. We no longer modify properties
		// sent to `.css()` apart from camelCasing, so we need to check both.
		// Normally, this would create difference in behavior: if
		// `getPropertyValue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. This is usually the case for
		// disconnected elements. However, in IE even disconnected elements
		// with no styles return `"none"` for `getPropertyValue( "float" )`
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105+, Chrome <=105+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace. Chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0,
		marginDelta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		// Count margin delta separately to only add it after scroll gutter adjustment.
		// This is needed to make negative margins work with `outerHeight( true )` (gh-3982).
		if ( box === "margin" ) {
			marginDelta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta + marginDelta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		animationIterationCount: true,
		aspectRatio: true,
		borderImageSlice: true,
		columnCount: true,
		flexGrow: true,
		flexShrink: true,
		fontWeight: true,
		gridArea: true,
		gridColumn: true,
		gridColumnEnd: true,
		gridColumnStart: true,
		gridRow: true,
		gridRowEnd: true,
		gridRowStart: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		scale: true,
		widows: true,
		zIndex: true,
		zoom: true,

		// SVG-related
		fillOpacity: true,
		floodOpacity: true,
		stopOpacity: true,
		strokeMiterlimit: true,
		strokeOpacity: true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this
			.on( "mouseenter", fnOver )
			.on( "mouseleave", fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),

/***/ "./node_modules/underscore/modules/_setup.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return root; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArrayProto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ObjProto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SymbolProto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return push; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return slice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return toString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return hasOwnProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return supportsArrayBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return supportsDataView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return nativeIsArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return nativeKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return nativeCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return nativeIsView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return _isNaN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return _isFinite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return hasEnumBug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return nonEnumerableProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MAX_ARRAY_INDEX; });
// Current version.
var VERSION = '1.13.7';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = (typeof self == 'object' && self.self === self && self) ||
          (typeof global == 'object' && global.global === global && global) ||
          Function('return this')() ||
          {};

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype, ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

// Modern feature detection.
var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
    supportsDataView = typeof DataView !== 'undefined';

// All **ECMAScript 5+** native function implementations that we hope to use
// are declared here.
var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create,
    nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

// Create references to these builtin functions because we override them.
var _isNaN = isNaN,
    _isFinite = isFinite;

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
  'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

// The largest integer that can be represented exactly.
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/underscore/modules/index-all.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* reexport */ index_default; });
__webpack_require__.d(__webpack_exports__, "VERSION", function() { return /* reexport */ _setup["e" /* VERSION */]; });
__webpack_require__.d(__webpack_exports__, "restArguments", function() { return /* reexport */ restArguments; });
__webpack_require__.d(__webpack_exports__, "isObject", function() { return /* reexport */ isObject; });
__webpack_require__.d(__webpack_exports__, "isNull", function() { return /* reexport */ isNull; });
__webpack_require__.d(__webpack_exports__, "isUndefined", function() { return /* reexport */ isUndefined; });
__webpack_require__.d(__webpack_exports__, "isBoolean", function() { return /* reexport */ isBoolean; });
__webpack_require__.d(__webpack_exports__, "isElement", function() { return /* reexport */ isElement; });
__webpack_require__.d(__webpack_exports__, "isString", function() { return /* reexport */ isString; });
__webpack_require__.d(__webpack_exports__, "isNumber", function() { return /* reexport */ isNumber; });
__webpack_require__.d(__webpack_exports__, "isDate", function() { return /* reexport */ isDate; });
__webpack_require__.d(__webpack_exports__, "isRegExp", function() { return /* reexport */ isRegExp; });
__webpack_require__.d(__webpack_exports__, "isError", function() { return /* reexport */ isError; });
__webpack_require__.d(__webpack_exports__, "isSymbol", function() { return /* reexport */ isSymbol; });
__webpack_require__.d(__webpack_exports__, "isArrayBuffer", function() { return /* reexport */ isArrayBuffer; });
__webpack_require__.d(__webpack_exports__, "isDataView", function() { return /* reexport */ modules_isDataView; });
__webpack_require__.d(__webpack_exports__, "isArray", function() { return /* reexport */ isArray; });
__webpack_require__.d(__webpack_exports__, "isFunction", function() { return /* reexport */ modules_isFunction; });
__webpack_require__.d(__webpack_exports__, "isArguments", function() { return /* reexport */ modules_isArguments; });
__webpack_require__.d(__webpack_exports__, "isFinite", function() { return /* reexport */ isFinite_isFinite; });
__webpack_require__.d(__webpack_exports__, "isNaN", function() { return /* reexport */ isNaN_isNaN; });
__webpack_require__.d(__webpack_exports__, "isTypedArray", function() { return /* reexport */ modules_isTypedArray; });
__webpack_require__.d(__webpack_exports__, "isEmpty", function() { return /* reexport */ isEmpty; });
__webpack_require__.d(__webpack_exports__, "isMatch", function() { return /* reexport */ isMatch; });
__webpack_require__.d(__webpack_exports__, "isEqual", function() { return /* reexport */ isEqual; });
__webpack_require__.d(__webpack_exports__, "isMap", function() { return /* reexport */ isMap; });
__webpack_require__.d(__webpack_exports__, "isWeakMap", function() { return /* reexport */ isWeakMap; });
__webpack_require__.d(__webpack_exports__, "isSet", function() { return /* reexport */ isSet; });
__webpack_require__.d(__webpack_exports__, "isWeakSet", function() { return /* reexport */ isWeakSet; });
__webpack_require__.d(__webpack_exports__, "keys", function() { return /* reexport */ keys_keys; });
__webpack_require__.d(__webpack_exports__, "allKeys", function() { return /* reexport */ allKeys; });
__webpack_require__.d(__webpack_exports__, "values", function() { return /* reexport */ values_values; });
__webpack_require__.d(__webpack_exports__, "pairs", function() { return /* reexport */ pairs_pairs; });
__webpack_require__.d(__webpack_exports__, "invert", function() { return /* reexport */ invert; });
__webpack_require__.d(__webpack_exports__, "functions", function() { return /* reexport */ functions; });
__webpack_require__.d(__webpack_exports__, "methods", function() { return /* reexport */ functions; });
__webpack_require__.d(__webpack_exports__, "extend", function() { return /* reexport */ extend; });
__webpack_require__.d(__webpack_exports__, "extendOwn", function() { return /* reexport */ extendOwn; });
__webpack_require__.d(__webpack_exports__, "assign", function() { return /* reexport */ extendOwn; });
__webpack_require__.d(__webpack_exports__, "defaults", function() { return /* reexport */ defaults; });
__webpack_require__.d(__webpack_exports__, "create", function() { return /* reexport */ create; });
__webpack_require__.d(__webpack_exports__, "clone", function() { return /* reexport */ clone; });
__webpack_require__.d(__webpack_exports__, "tap", function() { return /* reexport */ tap; });
__webpack_require__.d(__webpack_exports__, "get", function() { return /* reexport */ get; });
__webpack_require__.d(__webpack_exports__, "has", function() { return /* reexport */ has_has; });
__webpack_require__.d(__webpack_exports__, "mapObject", function() { return /* reexport */ mapObject; });
__webpack_require__.d(__webpack_exports__, "identity", function() { return /* reexport */ identity; });
__webpack_require__.d(__webpack_exports__, "constant", function() { return /* reexport */ constant; });
__webpack_require__.d(__webpack_exports__, "noop", function() { return /* reexport */ noop; });
__webpack_require__.d(__webpack_exports__, "toPath", function() { return /* reexport */ toPath; });
__webpack_require__.d(__webpack_exports__, "property", function() { return /* reexport */ property; });
__webpack_require__.d(__webpack_exports__, "propertyOf", function() { return /* reexport */ propertyOf; });
__webpack_require__.d(__webpack_exports__, "matcher", function() { return /* reexport */ matcher_matcher; });
__webpack_require__.d(__webpack_exports__, "matches", function() { return /* reexport */ matcher_matcher; });
__webpack_require__.d(__webpack_exports__, "times", function() { return /* reexport */ times; });
__webpack_require__.d(__webpack_exports__, "random", function() { return /* reexport */ random; });
__webpack_require__.d(__webpack_exports__, "now", function() { return /* reexport */ now; });
__webpack_require__.d(__webpack_exports__, "escape", function() { return /* reexport */ modules_escape; });
__webpack_require__.d(__webpack_exports__, "unescape", function() { return /* reexport */ modules_unescape; });
__webpack_require__.d(__webpack_exports__, "templateSettings", function() { return /* reexport */ templateSettings; });
__webpack_require__.d(__webpack_exports__, "template", function() { return /* reexport */ template_template; });
__webpack_require__.d(__webpack_exports__, "result", function() { return /* reexport */ result_result; });
__webpack_require__.d(__webpack_exports__, "uniqueId", function() { return /* reexport */ uniqueId; });
__webpack_require__.d(__webpack_exports__, "chain", function() { return /* reexport */ chain; });
__webpack_require__.d(__webpack_exports__, "iteratee", function() { return /* reexport */ iteratee_iteratee; });
__webpack_require__.d(__webpack_exports__, "partial", function() { return /* reexport */ modules_partial; });
__webpack_require__.d(__webpack_exports__, "bind", function() { return /* reexport */ bind; });
__webpack_require__.d(__webpack_exports__, "bindAll", function() { return /* reexport */ bindAll; });
__webpack_require__.d(__webpack_exports__, "memoize", function() { return /* reexport */ memoize_memoize; });
__webpack_require__.d(__webpack_exports__, "delay", function() { return /* reexport */ delay; });
__webpack_require__.d(__webpack_exports__, "defer", function() { return /* reexport */ defer; });
__webpack_require__.d(__webpack_exports__, "throttle", function() { return /* reexport */ throttle; });
__webpack_require__.d(__webpack_exports__, "debounce", function() { return /* reexport */ debounce; });
__webpack_require__.d(__webpack_exports__, "wrap", function() { return /* reexport */ wrap; });
__webpack_require__.d(__webpack_exports__, "negate", function() { return /* reexport */ negate; });
__webpack_require__.d(__webpack_exports__, "compose", function() { return /* reexport */ compose; });
__webpack_require__.d(__webpack_exports__, "after", function() { return /* reexport */ after; });
__webpack_require__.d(__webpack_exports__, "before", function() { return /* reexport */ before; });
__webpack_require__.d(__webpack_exports__, "once", function() { return /* reexport */ once; });
__webpack_require__.d(__webpack_exports__, "findKey", function() { return /* reexport */ findKey; });
__webpack_require__.d(__webpack_exports__, "findIndex", function() { return /* reexport */ findIndex; });
__webpack_require__.d(__webpack_exports__, "findLastIndex", function() { return /* reexport */ findLastIndex; });
__webpack_require__.d(__webpack_exports__, "sortedIndex", function() { return /* reexport */ sortedIndex_sortedIndex; });
__webpack_require__.d(__webpack_exports__, "indexOf", function() { return /* reexport */ indexOf; });
__webpack_require__.d(__webpack_exports__, "lastIndexOf", function() { return /* reexport */ lastIndexOf; });
__webpack_require__.d(__webpack_exports__, "find", function() { return /* reexport */ find; });
__webpack_require__.d(__webpack_exports__, "detect", function() { return /* reexport */ find; });
__webpack_require__.d(__webpack_exports__, "findWhere", function() { return /* reexport */ findWhere; });
__webpack_require__.d(__webpack_exports__, "each", function() { return /* reexport */ each; });
__webpack_require__.d(__webpack_exports__, "forEach", function() { return /* reexport */ each; });
__webpack_require__.d(__webpack_exports__, "map", function() { return /* reexport */ map_map; });
__webpack_require__.d(__webpack_exports__, "collect", function() { return /* reexport */ map_map; });
__webpack_require__.d(__webpack_exports__, "reduce", function() { return /* reexport */ reduce; });
__webpack_require__.d(__webpack_exports__, "foldl", function() { return /* reexport */ reduce; });
__webpack_require__.d(__webpack_exports__, "inject", function() { return /* reexport */ reduce; });
__webpack_require__.d(__webpack_exports__, "reduceRight", function() { return /* reexport */ reduceRight; });
__webpack_require__.d(__webpack_exports__, "foldr", function() { return /* reexport */ reduceRight; });
__webpack_require__.d(__webpack_exports__, "filter", function() { return /* reexport */ filter; });
__webpack_require__.d(__webpack_exports__, "select", function() { return /* reexport */ filter; });
__webpack_require__.d(__webpack_exports__, "reject", function() { return /* reexport */ reject; });
__webpack_require__.d(__webpack_exports__, "every", function() { return /* reexport */ every; });
__webpack_require__.d(__webpack_exports__, "all", function() { return /* reexport */ every; });
__webpack_require__.d(__webpack_exports__, "some", function() { return /* reexport */ some; });
__webpack_require__.d(__webpack_exports__, "any", function() { return /* reexport */ some; });
__webpack_require__.d(__webpack_exports__, "contains", function() { return /* reexport */ contains; });
__webpack_require__.d(__webpack_exports__, "includes", function() { return /* reexport */ contains; });
__webpack_require__.d(__webpack_exports__, "include", function() { return /* reexport */ contains; });
__webpack_require__.d(__webpack_exports__, "invoke", function() { return /* reexport */ invoke; });
__webpack_require__.d(__webpack_exports__, "pluck", function() { return /* reexport */ pluck; });
__webpack_require__.d(__webpack_exports__, "where", function() { return /* reexport */ where; });
__webpack_require__.d(__webpack_exports__, "max", function() { return /* reexport */ max; });
__webpack_require__.d(__webpack_exports__, "min", function() { return /* reexport */ min; });
__webpack_require__.d(__webpack_exports__, "shuffle", function() { return /* reexport */ shuffle; });
__webpack_require__.d(__webpack_exports__, "sample", function() { return /* reexport */ sample_sample; });
__webpack_require__.d(__webpack_exports__, "sortBy", function() { return /* reexport */ sortBy; });
__webpack_require__.d(__webpack_exports__, "groupBy", function() { return /* reexport */ groupBy; });
__webpack_require__.d(__webpack_exports__, "indexBy", function() { return /* reexport */ indexBy; });
__webpack_require__.d(__webpack_exports__, "countBy", function() { return /* reexport */ countBy; });
__webpack_require__.d(__webpack_exports__, "partition", function() { return /* reexport */ modules_partition; });
__webpack_require__.d(__webpack_exports__, "toArray", function() { return /* reexport */ toArray; });
__webpack_require__.d(__webpack_exports__, "size", function() { return /* reexport */ size; });
__webpack_require__.d(__webpack_exports__, "pick", function() { return /* reexport */ pick; });
__webpack_require__.d(__webpack_exports__, "omit", function() { return /* reexport */ omit; });
__webpack_require__.d(__webpack_exports__, "first", function() { return /* reexport */ first; });
__webpack_require__.d(__webpack_exports__, "head", function() { return /* reexport */ first; });
__webpack_require__.d(__webpack_exports__, "take", function() { return /* reexport */ first; });
__webpack_require__.d(__webpack_exports__, "initial", function() { return /* reexport */ initial_initial; });
__webpack_require__.d(__webpack_exports__, "last", function() { return /* reexport */ last_last; });
__webpack_require__.d(__webpack_exports__, "rest", function() { return /* reexport */ rest_rest; });
__webpack_require__.d(__webpack_exports__, "tail", function() { return /* reexport */ rest_rest; });
__webpack_require__.d(__webpack_exports__, "drop", function() { return /* reexport */ rest_rest; });
__webpack_require__.d(__webpack_exports__, "compact", function() { return /* reexport */ compact; });
__webpack_require__.d(__webpack_exports__, "flatten", function() { return /* reexport */ flatten_flatten; });
__webpack_require__.d(__webpack_exports__, "without", function() { return /* reexport */ without; });
__webpack_require__.d(__webpack_exports__, "uniq", function() { return /* reexport */ uniq; });
__webpack_require__.d(__webpack_exports__, "unique", function() { return /* reexport */ uniq; });
__webpack_require__.d(__webpack_exports__, "union", function() { return /* reexport */ union; });
__webpack_require__.d(__webpack_exports__, "intersection", function() { return /* reexport */ intersection; });
__webpack_require__.d(__webpack_exports__, "difference", function() { return /* reexport */ difference; });
__webpack_require__.d(__webpack_exports__, "unzip", function() { return /* reexport */ unzip; });
__webpack_require__.d(__webpack_exports__, "transpose", function() { return /* reexport */ unzip; });
__webpack_require__.d(__webpack_exports__, "zip", function() { return /* reexport */ zip; });
__webpack_require__.d(__webpack_exports__, "object", function() { return /* reexport */ object_object; });
__webpack_require__.d(__webpack_exports__, "range", function() { return /* reexport */ range; });
__webpack_require__.d(__webpack_exports__, "chunk", function() { return /* reexport */ chunk; });
__webpack_require__.d(__webpack_exports__, "mixin", function() { return /* reexport */ mixin; });

// NAMESPACE OBJECT: ./node_modules/underscore/modules/index.js
var modules_namespaceObject = {};
__webpack_require__.r(modules_namespaceObject);
__webpack_require__.d(modules_namespaceObject, "VERSION", function() { return _setup["e" /* VERSION */]; });
__webpack_require__.d(modules_namespaceObject, "restArguments", function() { return restArguments; });
__webpack_require__.d(modules_namespaceObject, "isObject", function() { return isObject; });
__webpack_require__.d(modules_namespaceObject, "isNull", function() { return isNull; });
__webpack_require__.d(modules_namespaceObject, "isUndefined", function() { return isUndefined; });
__webpack_require__.d(modules_namespaceObject, "isBoolean", function() { return isBoolean; });
__webpack_require__.d(modules_namespaceObject, "isElement", function() { return isElement; });
__webpack_require__.d(modules_namespaceObject, "isString", function() { return isString; });
__webpack_require__.d(modules_namespaceObject, "isNumber", function() { return isNumber; });
__webpack_require__.d(modules_namespaceObject, "isDate", function() { return isDate; });
__webpack_require__.d(modules_namespaceObject, "isRegExp", function() { return isRegExp; });
__webpack_require__.d(modules_namespaceObject, "isError", function() { return isError; });
__webpack_require__.d(modules_namespaceObject, "isSymbol", function() { return isSymbol; });
__webpack_require__.d(modules_namespaceObject, "isArrayBuffer", function() { return isArrayBuffer; });
__webpack_require__.d(modules_namespaceObject, "isDataView", function() { return modules_isDataView; });
__webpack_require__.d(modules_namespaceObject, "isArray", function() { return isArray; });
__webpack_require__.d(modules_namespaceObject, "isFunction", function() { return modules_isFunction; });
__webpack_require__.d(modules_namespaceObject, "isArguments", function() { return modules_isArguments; });
__webpack_require__.d(modules_namespaceObject, "isFinite", function() { return isFinite_isFinite; });
__webpack_require__.d(modules_namespaceObject, "isNaN", function() { return isNaN_isNaN; });
__webpack_require__.d(modules_namespaceObject, "isTypedArray", function() { return modules_isTypedArray; });
__webpack_require__.d(modules_namespaceObject, "isEmpty", function() { return isEmpty; });
__webpack_require__.d(modules_namespaceObject, "isMatch", function() { return isMatch; });
__webpack_require__.d(modules_namespaceObject, "isEqual", function() { return isEqual; });
__webpack_require__.d(modules_namespaceObject, "isMap", function() { return isMap; });
__webpack_require__.d(modules_namespaceObject, "isWeakMap", function() { return isWeakMap; });
__webpack_require__.d(modules_namespaceObject, "isSet", function() { return isSet; });
__webpack_require__.d(modules_namespaceObject, "isWeakSet", function() { return isWeakSet; });
__webpack_require__.d(modules_namespaceObject, "keys", function() { return keys_keys; });
__webpack_require__.d(modules_namespaceObject, "allKeys", function() { return allKeys; });
__webpack_require__.d(modules_namespaceObject, "values", function() { return values_values; });
__webpack_require__.d(modules_namespaceObject, "pairs", function() { return pairs_pairs; });
__webpack_require__.d(modules_namespaceObject, "invert", function() { return invert; });
__webpack_require__.d(modules_namespaceObject, "functions", function() { return functions; });
__webpack_require__.d(modules_namespaceObject, "methods", function() { return functions; });
__webpack_require__.d(modules_namespaceObject, "extend", function() { return extend; });
__webpack_require__.d(modules_namespaceObject, "extendOwn", function() { return extendOwn; });
__webpack_require__.d(modules_namespaceObject, "assign", function() { return extendOwn; });
__webpack_require__.d(modules_namespaceObject, "defaults", function() { return defaults; });
__webpack_require__.d(modules_namespaceObject, "create", function() { return create; });
__webpack_require__.d(modules_namespaceObject, "clone", function() { return clone; });
__webpack_require__.d(modules_namespaceObject, "tap", function() { return tap; });
__webpack_require__.d(modules_namespaceObject, "get", function() { return get; });
__webpack_require__.d(modules_namespaceObject, "has", function() { return has_has; });
__webpack_require__.d(modules_namespaceObject, "mapObject", function() { return mapObject; });
__webpack_require__.d(modules_namespaceObject, "identity", function() { return identity; });
__webpack_require__.d(modules_namespaceObject, "constant", function() { return constant; });
__webpack_require__.d(modules_namespaceObject, "noop", function() { return noop; });
__webpack_require__.d(modules_namespaceObject, "toPath", function() { return toPath; });
__webpack_require__.d(modules_namespaceObject, "property", function() { return property; });
__webpack_require__.d(modules_namespaceObject, "propertyOf", function() { return propertyOf; });
__webpack_require__.d(modules_namespaceObject, "matcher", function() { return matcher_matcher; });
__webpack_require__.d(modules_namespaceObject, "matches", function() { return matcher_matcher; });
__webpack_require__.d(modules_namespaceObject, "times", function() { return times; });
__webpack_require__.d(modules_namespaceObject, "random", function() { return random; });
__webpack_require__.d(modules_namespaceObject, "now", function() { return now; });
__webpack_require__.d(modules_namespaceObject, "escape", function() { return modules_escape; });
__webpack_require__.d(modules_namespaceObject, "unescape", function() { return modules_unescape; });
__webpack_require__.d(modules_namespaceObject, "templateSettings", function() { return templateSettings; });
__webpack_require__.d(modules_namespaceObject, "template", function() { return template_template; });
__webpack_require__.d(modules_namespaceObject, "result", function() { return result_result; });
__webpack_require__.d(modules_namespaceObject, "uniqueId", function() { return uniqueId; });
__webpack_require__.d(modules_namespaceObject, "chain", function() { return chain; });
__webpack_require__.d(modules_namespaceObject, "iteratee", function() { return iteratee_iteratee; });
__webpack_require__.d(modules_namespaceObject, "partial", function() { return modules_partial; });
__webpack_require__.d(modules_namespaceObject, "bind", function() { return bind; });
__webpack_require__.d(modules_namespaceObject, "bindAll", function() { return bindAll; });
__webpack_require__.d(modules_namespaceObject, "memoize", function() { return memoize_memoize; });
__webpack_require__.d(modules_namespaceObject, "delay", function() { return delay; });
__webpack_require__.d(modules_namespaceObject, "defer", function() { return defer; });
__webpack_require__.d(modules_namespaceObject, "throttle", function() { return throttle; });
__webpack_require__.d(modules_namespaceObject, "debounce", function() { return debounce; });
__webpack_require__.d(modules_namespaceObject, "wrap", function() { return wrap; });
__webpack_require__.d(modules_namespaceObject, "negate", function() { return negate; });
__webpack_require__.d(modules_namespaceObject, "compose", function() { return compose; });
__webpack_require__.d(modules_namespaceObject, "after", function() { return after; });
__webpack_require__.d(modules_namespaceObject, "before", function() { return before; });
__webpack_require__.d(modules_namespaceObject, "once", function() { return once; });
__webpack_require__.d(modules_namespaceObject, "findKey", function() { return findKey; });
__webpack_require__.d(modules_namespaceObject, "findIndex", function() { return findIndex; });
__webpack_require__.d(modules_namespaceObject, "findLastIndex", function() { return findLastIndex; });
__webpack_require__.d(modules_namespaceObject, "sortedIndex", function() { return sortedIndex_sortedIndex; });
__webpack_require__.d(modules_namespaceObject, "indexOf", function() { return indexOf; });
__webpack_require__.d(modules_namespaceObject, "lastIndexOf", function() { return lastIndexOf; });
__webpack_require__.d(modules_namespaceObject, "find", function() { return find; });
__webpack_require__.d(modules_namespaceObject, "detect", function() { return find; });
__webpack_require__.d(modules_namespaceObject, "findWhere", function() { return findWhere; });
__webpack_require__.d(modules_namespaceObject, "each", function() { return each; });
__webpack_require__.d(modules_namespaceObject, "forEach", function() { return each; });
__webpack_require__.d(modules_namespaceObject, "map", function() { return map_map; });
__webpack_require__.d(modules_namespaceObject, "collect", function() { return map_map; });
__webpack_require__.d(modules_namespaceObject, "reduce", function() { return reduce; });
__webpack_require__.d(modules_namespaceObject, "foldl", function() { return reduce; });
__webpack_require__.d(modules_namespaceObject, "inject", function() { return reduce; });
__webpack_require__.d(modules_namespaceObject, "reduceRight", function() { return reduceRight; });
__webpack_require__.d(modules_namespaceObject, "foldr", function() { return reduceRight; });
__webpack_require__.d(modules_namespaceObject, "filter", function() { return filter; });
__webpack_require__.d(modules_namespaceObject, "select", function() { return filter; });
__webpack_require__.d(modules_namespaceObject, "reject", function() { return reject; });
__webpack_require__.d(modules_namespaceObject, "every", function() { return every; });
__webpack_require__.d(modules_namespaceObject, "all", function() { return every; });
__webpack_require__.d(modules_namespaceObject, "some", function() { return some; });
__webpack_require__.d(modules_namespaceObject, "any", function() { return some; });
__webpack_require__.d(modules_namespaceObject, "contains", function() { return contains; });
__webpack_require__.d(modules_namespaceObject, "includes", function() { return contains; });
__webpack_require__.d(modules_namespaceObject, "include", function() { return contains; });
__webpack_require__.d(modules_namespaceObject, "invoke", function() { return invoke; });
__webpack_require__.d(modules_namespaceObject, "pluck", function() { return pluck; });
__webpack_require__.d(modules_namespaceObject, "where", function() { return where; });
__webpack_require__.d(modules_namespaceObject, "max", function() { return max; });
__webpack_require__.d(modules_namespaceObject, "min", function() { return min; });
__webpack_require__.d(modules_namespaceObject, "shuffle", function() { return shuffle; });
__webpack_require__.d(modules_namespaceObject, "sample", function() { return sample_sample; });
__webpack_require__.d(modules_namespaceObject, "sortBy", function() { return sortBy; });
__webpack_require__.d(modules_namespaceObject, "groupBy", function() { return groupBy; });
__webpack_require__.d(modules_namespaceObject, "indexBy", function() { return indexBy; });
__webpack_require__.d(modules_namespaceObject, "countBy", function() { return countBy; });
__webpack_require__.d(modules_namespaceObject, "partition", function() { return modules_partition; });
__webpack_require__.d(modules_namespaceObject, "toArray", function() { return toArray; });
__webpack_require__.d(modules_namespaceObject, "size", function() { return size; });
__webpack_require__.d(modules_namespaceObject, "pick", function() { return pick; });
__webpack_require__.d(modules_namespaceObject, "omit", function() { return omit; });
__webpack_require__.d(modules_namespaceObject, "first", function() { return first; });
__webpack_require__.d(modules_namespaceObject, "head", function() { return first; });
__webpack_require__.d(modules_namespaceObject, "take", function() { return first; });
__webpack_require__.d(modules_namespaceObject, "initial", function() { return initial_initial; });
__webpack_require__.d(modules_namespaceObject, "last", function() { return last_last; });
__webpack_require__.d(modules_namespaceObject, "rest", function() { return rest_rest; });
__webpack_require__.d(modules_namespaceObject, "tail", function() { return rest_rest; });
__webpack_require__.d(modules_namespaceObject, "drop", function() { return rest_rest; });
__webpack_require__.d(modules_namespaceObject, "compact", function() { return compact; });
__webpack_require__.d(modules_namespaceObject, "flatten", function() { return flatten_flatten; });
__webpack_require__.d(modules_namespaceObject, "without", function() { return without; });
__webpack_require__.d(modules_namespaceObject, "uniq", function() { return uniq; });
__webpack_require__.d(modules_namespaceObject, "unique", function() { return uniq; });
__webpack_require__.d(modules_namespaceObject, "union", function() { return union; });
__webpack_require__.d(modules_namespaceObject, "intersection", function() { return intersection; });
__webpack_require__.d(modules_namespaceObject, "difference", function() { return difference; });
__webpack_require__.d(modules_namespaceObject, "unzip", function() { return unzip; });
__webpack_require__.d(modules_namespaceObject, "transpose", function() { return unzip; });
__webpack_require__.d(modules_namespaceObject, "zip", function() { return zip; });
__webpack_require__.d(modules_namespaceObject, "object", function() { return object_object; });
__webpack_require__.d(modules_namespaceObject, "range", function() { return range; });
__webpack_require__.d(modules_namespaceObject, "chunk", function() { return chunk; });
__webpack_require__.d(modules_namespaceObject, "mixin", function() { return mixin; });
__webpack_require__.d(modules_namespaceObject, "default", function() { return underscore_array_methods; });

// EXTERNAL MODULE: ./node_modules/underscore/modules/_setup.js
var _setup = __webpack_require__("./node_modules/underscore/modules/_setup.js");

// CONCATENATED MODULE: ./node_modules/underscore/modules/restArguments.js
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, arguments[0], rest);
      case 2: return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isObject.js
// Is a given variable an object?
function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isNull.js
// Is a given value equal to null?
function isNull(obj) {
  return obj === null;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isUndefined.js
// Is a given variable undefined?
function isUndefined(obj) {
  return obj === void 0;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isBoolean.js


// Is a given value a boolean?
function isBoolean(obj) {
  return obj === true || obj === false || _setup["t" /* toString */].call(obj) === '[object Boolean]';
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isElement.js
// Is a given value a DOM element?
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_tagTester.js


// Internal function for creating a `toString`-based type tester.
function tagTester(name) {
  var tag = '[object ' + name + ']';
  return function(obj) {
    return _setup["t" /* toString */].call(obj) === tag;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isString.js


/* harmony default export */ var isString = (tagTester('String'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isNumber.js


/* harmony default export */ var isNumber = (tagTester('Number'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isDate.js


/* harmony default export */ var isDate = (tagTester('Date'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isRegExp.js


/* harmony default export */ var isRegExp = (tagTester('RegExp'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isError.js


/* harmony default export */ var isError = (tagTester('Error'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isSymbol.js


/* harmony default export */ var isSymbol = (tagTester('Symbol'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isArrayBuffer.js


/* harmony default export */ var isArrayBuffer = (tagTester('ArrayBuffer'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isFunction.js



var isFunction = tagTester('Function');

// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = _setup["p" /* root */].document && _setup["p" /* root */].document.childNodes;
if ( true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
  isFunction = function(obj) {
    return typeof obj == 'function' || false;
  };
}

/* harmony default export */ var modules_isFunction = (isFunction);

// CONCATENATED MODULE: ./node_modules/underscore/modules/_hasObjectTag.js


/* harmony default export */ var _hasObjectTag = (tagTester('Object'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_stringTagBug.js



// In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
// In IE 11, the most common among them, this problem also applies to
// `Map`, `WeakMap` and `Set`.
// Also, there are cases where an application can override the native
// `DataView` object, in cases like that we can't use the constructor
// safely and should just rely on alternate `DataView` checks
var hasDataViewBug = (
      _setup["s" /* supportsDataView */] && (!/\[native code\]/.test(String(DataView)) || _hasObjectTag(new DataView(new ArrayBuffer(8))))
    ),
    isIE11 = (typeof Map !== 'undefined' && _hasObjectTag(new Map));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isDataView.js





var isDataView = tagTester('DataView');

// In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.
// Also, in cases where the native `DataView` is
// overridden we can't rely on the tag itself.
function alternateIsDataView(obj) {
  return obj != null && modules_isFunction(obj.getInt8) && isArrayBuffer(obj.buffer);
}

/* harmony default export */ var modules_isDataView = (hasDataViewBug ? alternateIsDataView : isDataView);

// CONCATENATED MODULE: ./node_modules/underscore/modules/isArray.js



// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
/* harmony default export */ var isArray = (_setup["k" /* nativeIsArray */] || tagTester('Array'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_has.js


// Internal function to check whether `key` is an own property name of `obj`.
function has(obj, key) {
  return obj != null && _setup["i" /* hasOwnProperty */].call(obj, key);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isArguments.js



var isArguments = tagTester('Arguments');

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function() {
  if (!isArguments(arguments)) {
    isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }
}());

/* harmony default export */ var modules_isArguments = (isArguments);

// CONCATENATED MODULE: ./node_modules/underscore/modules/isFinite.js



// Is a given object a finite number?
function isFinite_isFinite(obj) {
  return !isSymbol(obj) && Object(_setup["f" /* _isFinite */])(obj) && !isNaN(parseFloat(obj));
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isNaN.js



// Is the given value `NaN`?
function isNaN_isNaN(obj) {
  return isNumber(obj) && Object(_setup["g" /* _isNaN */])(obj);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/constant.js
// Predicate-generating function. Often useful outside of Underscore.
function constant(value) {
  return function() {
    return value;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_createSizePropertyCheck.js


// Common internal logic for `isArrayLike` and `isBufferLike`.
function createSizePropertyCheck(getSizeProperty) {
  return function(collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= _setup["b" /* MAX_ARRAY_INDEX */];
  }
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_shallowProperty.js
// Internal helper to generate a function to obtain property `key` from `obj`.
function shallowProperty(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_getByteLength.js


// Internal helper to obtain the `byteLength` property of an object.
/* harmony default export */ var _getByteLength = (shallowProperty('byteLength'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_isBufferLike.js



// Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.
/* harmony default export */ var _isBufferLike = (createSizePropertyCheck(_getByteLength));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isTypedArray.js





// Is a given value a typed array?
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
  // `ArrayBuffer.isView` is the most future-proof, so use it when available.
  // Otherwise, fall back on the above regular expression.
  return _setup["l" /* nativeIsView */] ? (Object(_setup["l" /* nativeIsView */])(obj) && !modules_isDataView(obj)) :
                _isBufferLike(obj) && typedArrayPattern.test(_setup["t" /* toString */].call(obj));
}

/* harmony default export */ var modules_isTypedArray = (_setup["r" /* supportsArrayBuffer */] ? isTypedArray : constant(false));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_getLength.js


// Internal helper to obtain the `length` property of an object.
/* harmony default export */ var _getLength = (shallowProperty('length'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_collectNonEnumProps.js




// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.
function emulatedSet(keys) {
  var hash = {};
  for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
  return {
    contains: function(key) { return hash[key] === true; },
    push: function(key) {
      hash[key] = true;
      return keys.push(key);
    }
  };
}

// Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
// needed.
function collectNonEnumProps(obj, keys) {
  keys = emulatedSet(keys);
  var nonEnumIdx = _setup["n" /* nonEnumerableProps */].length;
  var constructor = obj.constructor;
  var proto = (modules_isFunction(constructor) && constructor.prototype) || _setup["c" /* ObjProto */];

  // Constructor is a special case.
  var prop = 'constructor';
  if (has(obj, prop) && !keys.contains(prop)) keys.push(prop);

  while (nonEnumIdx--) {
    prop = _setup["n" /* nonEnumerableProps */][nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
      keys.push(prop);
    }
  }
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/keys.js





// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
function keys_keys(obj) {
  if (!isObject(obj)) return [];
  if (_setup["m" /* nativeKeys */]) return Object(_setup["m" /* nativeKeys */])(obj);
  var keys = [];
  for (var key in obj) if (has(obj, key)) keys.push(key);
  // Ahem, IE < 9.
  if (_setup["h" /* hasEnumBug */]) collectNonEnumProps(obj, keys);
  return keys;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isEmpty.js






// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
  if (obj == null) return true;
  // Skip the more expensive `toString`-based type checks if `obj` has no
  // `.length`.
  var length = _getLength(obj);
  if (typeof length == 'number' && (
    isArray(obj) || isString(obj) || modules_isArguments(obj)
  )) return length === 0;
  return _getLength(keys_keys(obj)) === 0;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isMatch.js


// Returns whether an object has a given set of `key:value` pairs.
function isMatch(object, attrs) {
  var _keys = keys_keys(attrs), length = _keys.length;
  if (object == null) return !length;
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/underscore.js


// If Underscore is called as a function, it returns a wrapped object that can
// be used OO-style. This wrapper holds altered versions of all functions added
// through `_.mixin`. Wrapped objects may be chained.
function _(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}

_.VERSION = _setup["e" /* VERSION */];

// Extracts the result from a wrapped and chained object.
_.prototype.value = function() {
  return this._wrapped;
};

// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

_.prototype.toString = function() {
  return String(this._wrapped);
};

// CONCATENATED MODULE: ./node_modules/underscore/modules/_toBufferView.js


// Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to a new view, reusing the buffer.
function toBufferView(bufferSource) {
  return new Uint8Array(
    bufferSource.buffer || bufferSource,
    bufferSource.byteOffset || 0,
    _getByteLength(bufferSource)
  );
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/isEqual.js











// We use this string twice, so give it a name for minification.
var tagDataView = '[object DataView]';

// Internal recursive comparison function for `_.isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) return false;
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) return b !== b;
  // Exhaust primitive checks
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
  return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `_.isEqual`.
function deepEq(a, b, aStack, bStack) {
  // Unwrap any wrapped objects.
  if (a instanceof _) a = a._wrapped;
  if (b instanceof _) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = _setup["t" /* toString */].call(a);
  if (className !== _setup["t" /* toString */].call(b)) return false;
  // Work around a bug in IE 10 - Edge 13.
  if (hasDataViewBug && className == '[object Object]' && modules_isDataView(a)) {
    if (!modules_isDataView(b)) return false;
    className = tagDataView;
  }
  switch (className) {
    // These types are compared by value.
    case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case '[object Symbol]':
      return _setup["d" /* SymbolProto */].valueOf.call(a) === _setup["d" /* SymbolProto */].valueOf.call(b);
    case '[object ArrayBuffer]':
    case tagDataView:
      // Coerce to typed array so we can fall through.
      return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
  }

  var areArrays = className === '[object Array]';
  if (!areArrays && modules_isTypedArray(a)) {
      var byteLength = _getByteLength(a);
      if (byteLength !== _getByteLength(b)) return false;
      if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
      areArrays = true;
  }
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(modules_isFunction(aCtor) && aCtor instanceof aCtor &&
                             modules_isFunction(bCtor) && bCtor instanceof bCtor)
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    // Deep compare objects.
    var _keys = keys_keys(a), key;
    length = _keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (keys_keys(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = _keys[length];
      if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
  return eq(a, b);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/allKeys.js




// Retrieve all the enumerable property names of an object.
function allKeys(obj) {
  if (!isObject(obj)) return [];
  var keys = [];
  for (var key in obj) keys.push(key);
  // Ahem, IE < 9.
  if (_setup["h" /* hasEnumBug */]) collectNonEnumProps(obj, keys);
  return keys;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_methodFingerprint.js




// Since the regular `Object.prototype.toString` type tests don't work for
// some types in IE 11, we use a fingerprinting heuristic instead, based
// on the methods. It's not great, but it's the best we got.
// The fingerprint method lists are defined below.
function ie11fingerprint(methods) {
  var length = _getLength(methods);
  return function(obj) {
    if (obj == null) return false;
    // `Map`, `WeakMap` and `Set` have no enumerable keys.
    var keys = allKeys(obj);
    if (_getLength(keys)) return false;
    for (var i = 0; i < length; i++) {
      if (!modules_isFunction(obj[methods[i]])) return false;
    }
    // If we are testing against `WeakMap`, we need to ensure that
    // `obj` doesn't have a `forEach` method in order to distinguish
    // it from a regular `Map`.
    return methods !== weakMapMethods || !modules_isFunction(obj[forEachName]);
  };
}

// In the interest of compact minification, we write
// each string in the fingerprints only once.
var forEachName = 'forEach',
    hasName = 'has',
    commonInit = ['clear', 'delete'],
    mapTail = ['get', hasName, 'set'];

// `Map`, `WeakMap` and `Set` each have slightly different
// combinations of the above sublists.
var mapMethods = commonInit.concat(forEachName, mapTail),
    weakMapMethods = commonInit.concat(mapTail),
    setMethods = ['add'].concat(commonInit, forEachName, hasName);

// CONCATENATED MODULE: ./node_modules/underscore/modules/isMap.js




/* harmony default export */ var isMap = (isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isWeakMap.js




/* harmony default export */ var isWeakMap = (isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isSet.js




/* harmony default export */ var isSet = (isIE11 ? ie11fingerprint(setMethods) : tagTester('Set'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/isWeakSet.js


/* harmony default export */ var isWeakSet = (tagTester('WeakSet'));

// CONCATENATED MODULE: ./node_modules/underscore/modules/values.js


// Retrieve the values of an object's properties.
function values_values(obj) {
  var _keys = keys_keys(obj);
  var length = _keys.length;
  var values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[_keys[i]];
  }
  return values;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/pairs.js


// Convert an object into a list of `[key, value]` pairs.
// The opposite of `_.object` with one argument.
function pairs_pairs(obj) {
  var _keys = keys_keys(obj);
  var length = _keys.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/invert.js


// Invert the keys and values of an object. The values must be serializable.
function invert(obj) {
  var result = {};
  var _keys = keys_keys(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result[obj[_keys[i]]] = _keys[i];
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/functions.js


// Return a sorted list of the function names available on the object.
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (modules_isFunction(obj[key])) names.push(key);
  }
  return names.sort();
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_createAssigner.js
// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
  return function(obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/extend.js



// Extend a given object with all the properties in passed-in object(s).
/* harmony default export */ var extend = (createAssigner(allKeys));

// CONCATENATED MODULE: ./node_modules/underscore/modules/extendOwn.js



// Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
/* harmony default export */ var extendOwn = (createAssigner(keys_keys));

// CONCATENATED MODULE: ./node_modules/underscore/modules/defaults.js



// Fill in a given object with default properties.
/* harmony default export */ var defaults = (createAssigner(allKeys, true));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_baseCreate.js



// Create a naked function reference for surrogate-prototype-swapping.
function ctor() {
  return function(){};
}

// An internal function for creating a new object that inherits from another.
function baseCreate(prototype) {
  if (!isObject(prototype)) return {};
  if (_setup["j" /* nativeCreate */]) return Object(_setup["j" /* nativeCreate */])(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result = new Ctor;
  Ctor.prototype = null;
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/create.js



// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
function create(prototype, props) {
  var result = baseCreate(prototype);
  if (props) extendOwn(result, props);
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/clone.js




// Create a (shallow-cloned) duplicate of an object.
function clone(obj) {
  if (!isObject(obj)) return obj;
  return isArray(obj) ? obj.slice() : extend({}, obj);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/tap.js
// Invokes `interceptor` with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/toPath.js



// Normalize a (deep) property `path` to array.
// Like `_.iteratee`, this function can be customized.
function toPath(path) {
  return isArray(path) ? path : [path];
}
_.toPath = toPath;

// CONCATENATED MODULE: ./node_modules/underscore/modules/_toPath.js



// Internal wrapper for `_.toPath` to enable minification.
// Similar to `cb` for `_.iteratee`.
function _toPath_toPath(path) {
  return _.toPath(path);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_deepGet.js
// Internal function to obtain a nested property in `obj` along `path`.
function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/get.js




// Get the value of the (deep) property on `path` from `object`.
// If any property in `path` does not exist or if the value is
// `undefined`, return `defaultValue` instead.
// The `path` is normalized through `_.toPath`.
function get(object, path, defaultValue) {
  var value = deepGet(object, _toPath_toPath(path));
  return isUndefined(value) ? defaultValue : value;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/has.js



// Shortcut function for checking if an object has a given property directly on
// itself (in other words, not on a prototype). Unlike the internal `has`
// function, this public version can also traverse nested properties.
function has_has(obj, path) {
  path = _toPath_toPath(path);
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!has(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/identity.js
// Keep the identity function around for default iteratees.
function identity(value) {
  return value;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/matcher.js



// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
function matcher_matcher(attrs) {
  attrs = extendOwn({}, attrs);
  return function(obj) {
    return isMatch(obj, attrs);
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/property.js



// Creates a function that, when passed an object, will traverse that object’s
// properties down the given `path`, specified as an array of keys or indices.
function property(path) {
  path = _toPath_toPath(path);
  return function(obj) {
    return deepGet(obj, path);
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_optimizeCb.js
// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // The 2-argument case is omitted because we’re not using it.
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_baseIteratee.js








// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `_.identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function baseIteratee(value, context, argCount) {
  if (value == null) return identity;
  if (modules_isFunction(value)) return optimizeCb(value, context, argCount);
  if (isObject(value) && !isArray(value)) return matcher_matcher(value);
  return property(value);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/iteratee.js



// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only `argCount` argument.
function iteratee_iteratee(value, context) {
  return baseIteratee(value, context, Infinity);
}
_.iteratee = iteratee_iteratee;

// CONCATENATED MODULE: ./node_modules/underscore/modules/_cb.js




// The function we call internally to generate a callback. It invokes
// `_.iteratee` if overridden, otherwise `baseIteratee`.
function cb(value, context, argCount) {
  if (_.iteratee !== iteratee_iteratee) return _.iteratee(value, context);
  return baseIteratee(value, context, argCount);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/mapObject.js



// Returns the results of applying the `iteratee` to each element of `obj`.
// In contrast to `_.map` it returns an object.
function mapObject(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = keys_keys(obj),
      length = _keys.length,
      results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/noop.js
// Predicate-generating function. Often useful outside of Underscore.
function noop(){}

// CONCATENATED MODULE: ./node_modules/underscore/modules/propertyOf.js



// Generates a function for a given object that returns a given property.
function propertyOf(obj) {
  if (obj == null) return noop;
  return function(path) {
    return get(obj, path);
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/times.js


// Run a function **n** times.
function times(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = optimizeCb(iteratee, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee(i);
  return accum;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/random.js
// Return a random integer between `min` and `max` (inclusive).
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/now.js
// A (possibly faster) way to get the current timestamp as an integer.
/* harmony default export */ var now = (Date.now || function() {
  return new Date().getTime();
});

// CONCATENATED MODULE: ./node_modules/underscore/modules/_createEscaper.js


// Internal helper to generate functions for escaping and unescaping strings
// to/from HTML interpolation.
function createEscaper(map) {
  var escaper = function(match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = '(?:' + keys_keys(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_escapeMap.js
// Internal list of HTML entities for escaping.
/* harmony default export */ var _escapeMap = ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
});

// CONCATENATED MODULE: ./node_modules/underscore/modules/escape.js



// Function for escaping strings to HTML interpolation.
/* harmony default export */ var modules_escape = (createEscaper(_escapeMap));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_unescapeMap.js



// Internal list of HTML entities for unescaping.
/* harmony default export */ var _unescapeMap = (invert(_escapeMap));

// CONCATENATED MODULE: ./node_modules/underscore/modules/unescape.js



// Function for unescaping strings from HTML interpolation.
/* harmony default export */ var modules_unescape = (createEscaper(_unescapeMap));

// CONCATENATED MODULE: ./node_modules/underscore/modules/templateSettings.js


// By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.
/* harmony default export */ var templateSettings = (_.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
});

// CONCATENATED MODULE: ./node_modules/underscore/modules/template.js




// When customizing `_.templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

function escapeChar(match) {
  return '\\' + escapes[match];
}

// In order to prevent third-party code injection through
// `_.templateSettings.variable`, we test it against the following regular
// expression. It is intentionally a bit more liberal than just matching valid
// identifiers, but still prevents possible loopholes through defaults or
// destructuring assignment.
var bareIdentifier = /^\s*(\w|\$)+\s*$/;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function template_template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = defaults({}, settings, _.templateSettings);

  // Combine delimiters into one regular expression via alternation.
  var matcher = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join('|') + '|$', 'g');

  // Compile the template source, escaping string literals appropriately.
  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';\n";

  var argument = settings.variable;
  if (argument) {
    // Insure against third-party code injection. (CVE-2021-23358)
    if (!bareIdentifier.test(argument)) throw new Error(
      'variable is not a bare identifier: ' + argument
    );
  } else {
    // If a variable is not specified, place data values in local scope.
    source = 'with(obj||{}){\n' + source + '}\n';
    argument = 'obj';
  }

  source = "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source + 'return __p;\n';

  var render;
  try {
    render = new Function(argument, '_', source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  var template = function(data) {
    return render.call(this, data, _);
  };

  // Provide the compiled source as a convenience for precompilation.
  template.source = 'function(' + argument + '){\n' + source + '}';

  return template;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/result.js



// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
function result_result(obj, path, fallback) {
  path = _toPath_toPath(path);
  var length = path.length;
  if (!length) {
    return modules_isFunction(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }
    obj = modules_isFunction(prop) ? prop.call(obj) : prop;
  }
  return obj;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/uniqueId.js
// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/chain.js


// Start chaining a wrapped Underscore object.
function chain(obj) {
  var instance = _(obj);
  instance._chain = true;
  return instance;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_executeBound.js



// Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self = baseCreate(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if (isObject(result)) return result;
  return self;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/partial.js




// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. `_` acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var partial = restArguments(function(func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function() {
    var position = 0, length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});

partial.placeholder = _;
/* harmony default export */ var modules_partial = (partial);

// CONCATENATED MODULE: ./node_modules/underscore/modules/bind.js




// Create a function bound to a given object (assigning `this`, and arguments,
// optionally).
/* harmony default export */ var bind = (restArguments(function(func, context, args) {
  if (!modules_isFunction(func)) throw new TypeError('Bind must be called on a function');
  var bound = restArguments(function(callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_isArrayLike.js



// Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
/* harmony default export */ var _isArrayLike = (createSizePropertyCheck(_getLength));

// CONCATENATED MODULE: ./node_modules/underscore/modules/_flatten.js





// Internal implementation of a recursive `flatten` function.
function flatten(input, depth, strict, output) {
  output = output || [];
  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }
  var idx = output.length;
  for (var i = 0, length = _getLength(input); i < length; i++) {
    var value = input[i];
    if (_isArrayLike(value) && (isArray(value) || modules_isArguments(value))) {
      // Flatten current level of array or arguments object.
      if (depth > 1) {
        flatten(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0, len = value.length;
        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/bindAll.js




// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
/* harmony default export */ var bindAll = (restArguments(function(obj, keys) {
  keys = flatten(keys, false, false);
  var index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    var key = keys[index];
    obj[key] = bind(obj[key], obj);
  }
  return obj;
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/memoize.js


// Memoize an expensive function by storing its results.
function memoize_memoize(func, hasher) {
  var memoize = function(key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/delay.js


// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
/* harmony default export */ var delay = (restArguments(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/defer.js




// Defers a function, scheduling it to run after the current call stack has
// cleared.
/* harmony default export */ var defer = (modules_partial(delay, _, 1));

// CONCATENATED MODULE: ./node_modules/underscore/modules/throttle.js


// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var _now = now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/debounce.js



// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;

  var later = function() {
    var passed = now() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null;
    }
  };

  var debounced = restArguments(function(_args) {
    context = this;
    args = _args;
    previous = now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/wrap.js


// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
function wrap(func, wrapper) {
  return modules_partial(wrapper, func);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/negate.js
// Returns a negated version of the passed-in predicate.
function negate(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/compose.js
// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/after.js
// Returns a function that will only be executed on and after the Nth call.
function after(times, func) {
  return function() {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/before.js
// Returns a function that will only be executed up to (but not including) the
// Nth call.
function before(times, func) {
  var memo;
  return function() {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/once.js



// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
/* harmony default export */ var once = (modules_partial(before, 2));

// CONCATENATED MODULE: ./node_modules/underscore/modules/findKey.js



// Returns the first key on an object that passes a truth test.
function findKey(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = keys_keys(obj), key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_createPredicateIndexFinder.js



// Internal function to generate `_.findIndex` and `_.findLastIndex`.
function createPredicateIndexFinder(dir) {
  return function(array, predicate, context) {
    predicate = cb(predicate, context);
    var length = _getLength(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/findIndex.js


// Returns the first index on an array-like that passes a truth test.
/* harmony default export */ var findIndex = (createPredicateIndexFinder(1));

// CONCATENATED MODULE: ./node_modules/underscore/modules/findLastIndex.js


// Returns the last index on an array-like that passes a truth test.
/* harmony default export */ var findLastIndex = (createPredicateIndexFinder(-1));

// CONCATENATED MODULE: ./node_modules/underscore/modules/sortedIndex.js



// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
function sortedIndex_sortedIndex(array, obj, iteratee, context) {
  iteratee = cb(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0, high = _getLength(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
  }
  return low;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_createIndexFinder.js




// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function(array, item, idx) {
    var i = 0, length = _getLength(array);
    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(_setup["q" /* slice */].call(array, i, length), isNaN_isNaN);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/indexOf.js




// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
/* harmony default export */ var indexOf = (createIndexFinder(1, findIndex, sortedIndex_sortedIndex));

// CONCATENATED MODULE: ./node_modules/underscore/modules/lastIndexOf.js



// Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.
/* harmony default export */ var lastIndexOf = (createIndexFinder(-1, findLastIndex));

// CONCATENATED MODULE: ./node_modules/underscore/modules/find.js




// Return the first value which passes a truth test.
function find(obj, predicate, context) {
  var keyFinder = _isArrayLike(obj) ? findIndex : findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/findWhere.js



// Convenience version of a common use case of `_.find`: getting the first
// object containing specific `key:value` pairs.
function findWhere(obj, attrs) {
  return find(obj, matcher_matcher(attrs));
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/each.js




// The cornerstone for collection functions, an `each`
// implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
function each(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (_isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var _keys = keys_keys(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/map.js




// Return the results of applying the iteratee to each element.
function map_map(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = !_isArrayLike(obj) && keys_keys(obj),
      length = (_keys || obj).length,
      results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_createReduce.js




// Internal helper to create a reducing function, iterating left or right.
function createReduce(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function(obj, iteratee, memo, initial) {
    var _keys = !_isArrayLike(obj) && keys_keys(obj),
        length = (_keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function(obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/reduce.js


// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
/* harmony default export */ var reduce = (createReduce(1));

// CONCATENATED MODULE: ./node_modules/underscore/modules/reduceRight.js


// The right-associative version of reduce, also known as `foldr`.
/* harmony default export */ var reduceRight = (createReduce(-1));

// CONCATENATED MODULE: ./node_modules/underscore/modules/filter.js



// Return all the elements that pass a truth test.
function filter(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  each(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/reject.js




// Return all the elements for which a truth test fails.
function reject(obj, predicate, context) {
  return filter(obj, negate(cb(predicate)), context);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/every.js




// Determine whether all of the elements pass a truth test.
function every(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !_isArrayLike(obj) && keys_keys(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/some.js




// Determine if at least one element in the object passes a truth test.
function some(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !_isArrayLike(obj) && keys_keys(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/contains.js




// Determine if the array or object contains a given item (using `===`).
function contains(obj, item, fromIndex, guard) {
  if (!_isArrayLike(obj)) obj = values_values(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  return indexOf(obj, item, fromIndex) >= 0;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/invoke.js






// Invoke a method (with arguments) on every item in a collection.
/* harmony default export */ var invoke = (restArguments(function(obj, path, args) {
  var contextPath, func;
  if (modules_isFunction(path)) {
    func = path;
  } else {
    path = _toPath_toPath(path);
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return map_map(obj, function(context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = deepGet(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/pluck.js



// Convenience version of a common use case of `_.map`: fetching a property.
function pluck(obj, key) {
  return map_map(obj, property(key));
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/where.js



// Convenience version of a common use case of `_.filter`: selecting only
// objects containing specific `key:value` pairs.
function where(obj, attrs) {
  return filter(obj, matcher_matcher(attrs));
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/max.js





// Return the maximum element (or element-based computation).
function max(obj, iteratee, context) {
  var result = -Infinity, lastComputed = -Infinity,
      value, computed;
  if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
    obj = _isArrayLike(obj) ? obj : values_values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/min.js





// Return the minimum element (or element-based computation).
function min(obj, iteratee, context) {
  var result = Infinity, lastComputed = Infinity,
      value, computed;
  if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
    obj = _isArrayLike(obj) ? obj : values_values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/toArray.js








// Safely create a real, live array from anything iterable.
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if (isArray(obj)) return _setup["q" /* slice */].call(obj);
  if (isString(obj)) {
    // Keep surrogate pair characters together.
    return obj.match(reStrSymbol);
  }
  if (_isArrayLike(obj)) return map_map(obj, identity);
  return values_values(obj);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/sample.js






// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `_.map`.
function sample_sample(obj, n, guard) {
  if (n == null || guard) {
    if (!_isArrayLike(obj)) obj = values_values(obj);
    return obj[random(obj.length - 1)];
  }
  var sample = toArray(obj);
  var length = _getLength(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = random(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/shuffle.js


// Shuffle a collection.
function shuffle(obj) {
  return sample_sample(obj, Infinity);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/sortBy.js




// Sort the object's values by a criterion produced by an iteratee.
function sortBy(obj, iteratee, context) {
  var index = 0;
  iteratee = cb(iteratee, context);
  return pluck(map_map(obj, function(value, key, list) {
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
    };
  }).sort(function(left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), 'value');
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_group.js



// An internal function used for aggregate "group by" operations.
function group(behavior, partition) {
  return function(obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = cb(iteratee, context);
    each(obj, function(value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/groupBy.js



// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
/* harmony default export */ var groupBy = (group(function(result, value, key) {
  if (has(result, key)) result[key].push(value); else result[key] = [value];
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/indexBy.js


// Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.
/* harmony default export */ var indexBy = (group(function(result, value, key) {
  result[key] = value;
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/countBy.js



// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
/* harmony default export */ var countBy = (group(function(result, value, key) {
  if (has(result, key)) result[key]++; else result[key] = 1;
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/partition.js


// Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.
/* harmony default export */ var modules_partition = (group(function(result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true));

// CONCATENATED MODULE: ./node_modules/underscore/modules/size.js



// Return the number of elements in a collection.
function size(obj) {
  if (obj == null) return 0;
  return _isArrayLike(obj) ? obj.length : keys_keys(obj).length;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_keyInObj.js
// Internal `_.pick` helper function to determine whether `key` is an enumerable
// property name of `obj`.
function keyInObj(value, key, obj) {
  return key in obj;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/pick.js







// Return a copy of the object only containing the allowed properties.
/* harmony default export */ var pick = (restArguments(function(obj, keys) {
  var result = {}, iteratee = keys[0];
  if (obj == null) return result;
  if (modules_isFunction(iteratee)) {
    if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
    keys = allKeys(obj);
  } else {
    iteratee = keyInObj;
    keys = flatten(keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }
  return result;
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/omit.js








// Return a copy of the object without the disallowed properties.
/* harmony default export */ var omit = (restArguments(function(obj, keys) {
  var iteratee = keys[0], context;
  if (modules_isFunction(iteratee)) {
    iteratee = negate(iteratee);
    if (keys.length > 1) context = keys[1];
  } else {
    keys = map_map(flatten(keys, false, false), String);
    iteratee = function(value, key) {
      return !contains(keys, key);
    };
  }
  return pick(obj, iteratee, context);
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/initial.js


// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
function initial_initial(array, n, guard) {
  return _setup["q" /* slice */].call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/first.js


// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_.map`.
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return initial_initial(array, array.length - n);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/rest.js


// Returns everything but the first entry of the `array`. Especially useful on
// the `arguments` object. Passing an **n** will return the rest N values in the
// `array`.
function rest_rest(array, n, guard) {
  return _setup["q" /* slice */].call(array, n == null || guard ? 1 : n);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/last.js


// Get the last element of an array. Passing **n** will return the last N
// values in the array.
function last_last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest_rest(array, Math.max(0, array.length - n));
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/compact.js


// Trim out all falsy values from an array.
function compact(array) {
  return filter(array, Boolean);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/flatten.js


// Flatten out an array, either recursively (by default), or up to `depth`.
// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
function flatten_flatten(array, depth) {
  return flatten(array, depth, false);
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/difference.js





// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
/* harmony default export */ var difference = (restArguments(function(array, rest) {
  rest = flatten(rest, true, true);
  return filter(array, function(value){
    return !contains(rest, value);
  });
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/without.js



// Return a version of the array that does not contain the specified value(s).
/* harmony default export */ var without = (restArguments(function(array, otherArrays) {
  return difference(array, otherArrays);
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/uniq.js





// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
function uniq(array, isSorted, iteratee, context) {
  if (!isBoolean(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee != null) iteratee = cb(iteratee, context);
  var result = [];
  var seen = [];
  for (var i = 0, length = _getLength(array); i < length; i++) {
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted && !iteratee) {
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!contains(result, value)) {
      result.push(value);
    }
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/union.js




// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
/* harmony default export */ var union = (restArguments(function(arrays) {
  return uniq(flatten(arrays, true, true));
}));

// CONCATENATED MODULE: ./node_modules/underscore/modules/intersection.js



// Produce an array that contains every item shared between all the
// passed-in arrays.
function intersection(array) {
  var result = [];
  var argsLength = arguments.length;
  for (var i = 0, length = _getLength(array); i < length; i++) {
    var item = array[i];
    if (contains(result, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!contains(arguments[j], item)) break;
    }
    if (j === argsLength) result.push(item);
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/unzip.js




// Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
function unzip(array) {
  var length = (array && max(array, _getLength).length) || 0;
  var result = Array(length);

  for (var index = 0; index < length; index++) {
    result[index] = pluck(array, index);
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/zip.js



// Zip together multiple lists into a single array -- elements that share
// an index go together.
/* harmony default export */ var zip = (restArguments(unzip));

// CONCATENATED MODULE: ./node_modules/underscore/modules/object.js


// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of `_.pairs`.
function object_object(list, values) {
  var result = {};
  for (var i = 0, length = _getLength(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/range.js
// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/chunk.js


// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0, length = array.length;
  while (i < length) {
    result.push(_setup["q" /* slice */].call(array, i, i += count));
  }
  return result;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/_chainResult.js


// Helper function to continue chaining intermediate results.
function chainResult(instance, obj) {
  return instance._chain ? _(obj).chain() : obj;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/mixin.js






// Add your own custom functions to the Underscore object.
function mixin(obj) {
  each(functions(obj), function(name) {
    var func = _[name] = obj[name];
    _.prototype[name] = function() {
      var args = [this._wrapped];
      _setup["o" /* push */].apply(args, arguments);
      return chainResult(this, func.apply(_, args));
    };
  });
  return _;
}

// CONCATENATED MODULE: ./node_modules/underscore/modules/underscore-array-methods.js





// Add all mutator `Array` functions to the wrapper.
each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  var method = _setup["a" /* ArrayProto */][name];
  _.prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) {
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) {
        delete obj[0];
      }
    }
    return chainResult(this, obj);
  };
});

// Add all accessor `Array` functions to the wrapper.
each(['concat', 'join', 'slice'], function(name) {
  var method = _setup["a" /* ArrayProto */][name];
  _.prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return chainResult(this, obj);
  };
});

/* harmony default export */ var underscore_array_methods = (_);

// CONCATENATED MODULE: ./node_modules/underscore/modules/index.js
// Named Exports
// =============

//     Underscore.js 1.13.7
//     https://underscorejs.org
//     (c) 2009-2024 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// Baseline setup.



// Object Functions
// ----------------
// Our most fundamental functions operate on any JavaScript object.
// Most functions in Underscore depend on at least one function in this section.

// A group of functions that check the types of core JavaScript values.
// These are often informally referred to as the "isType" functions.



























// Functions that treat an object as a dictionary of key-value pairs.
















// Utility Functions
// -----------------
// A bit of a grab bag: Predicate-generating functions for use with filters and
// loops, string escaping and templating, create random numbers and unique ids,
// and functions that facilitate Underscore's chaining and iteration conventions.



















// Function (ahem) Functions
// -------------------------
// These functions take a function as an argument and return a new function
// as the result. Also known as higher-order functions.















// Finders
// -------
// Functions that extract (the position of) a single element from an object
// or array based on some criterion.









// Collection Functions
// --------------------
// Functions that work on any collection of elements: either an array, or
// an object of key-value pairs.
























// `_.pick` and `_.omit` are actually object functions, but we put
// them here in order to create a more natural reading order in the
// monolithic build as they depend on `_.contains`.



// Array Functions
// ---------------
// Functions that operate on arrays (and array-likes) only, because they’re
// expressed in terms of operations on an ordered list of values.

















// OOP
// ---
// These modules support the "object-oriented" calling style. See also
// `underscore.js` and `index-default.js`.



// CONCATENATED MODULE: ./node_modules/underscore/modules/index-default.js
// Default Export
// ==============
// In this module, we mix our bundled exports into the `_` object and export
// the result. This is analogous to setting `module.exports = _` in CommonJS.
// Hence, this module is also the entry point of our UMD bundle and the package
// entry point for CommonJS and AMD users. In other words, this is (the source
// of) the module you are interfacing with when you do any of the following:
//
// ```js
// // CommonJS
// var _ = require('underscore');
//
// // AMD
// define(['underscore'], function(_) {...});
//
// // UMD in the browser
// // _ is available as a global variable
// ```



// Add all of the Underscore functions to the wrapper object.
var index_default_ = mixin(modules_namespaceObject);
// Legacy Node.js API.
index_default_._ = index_default_;
// Export the Underscore API.
/* harmony default export */ var index_default = (index_default_);

// CONCATENATED MODULE: ./node_modules/underscore/modules/index-all.js
// ESM Exports
// ===========
// This module is the package entry point for ES module users. In other words,
// it is the module they are interfacing with when they import from the whole
// package instead of from a submodule, like this:
//
// ```js
// import { map } from 'underscore';
// ```
//
// The difference with `./index-default`, which is the package entry point for
// CommonJS, AMD and UMD users, is purely technical. In ES modules, named and
// default exports are considered to be siblings, so when you have a default
// export, its properties are not automatically available as named exports. For
// this reason, we re-export the named exports in addition to providing the same
// default export as in `./index-default`.




/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./package/src/components/data sync recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./package/src/components/data sync recursive";

/***/ }),

/***/ "./package/src/components/data sync recursive ^json!.*$":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./package/src/components/data sync recursive ^json!.*$";

/***/ }),

/***/ "./package/src/components/data sync recursive ^json!.*\\/services\\/pullCSV$":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./package/src/components/data sync recursive ^json!.*\\/services\\/pullCSV$";

/***/ }),

/***/ "./package/src/components/data/health_checks.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault.js");
var _keys = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/object/keys.js"));
var _stringify = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/json/stringify.js"));
var _indexOf = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js"));
var _promise = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/promise.js"));
function checkForMITREInLogReview(deferral) {
  $.ajax({
    url: Splunk.util.make_full_url("/splunkd/__raw/servicesNS/nobody/SA-ThreatIntelligence/properties/log_review/incident_review?output_mode=json"),
    async: true,
    error: function error() {
      deferral.resolve("errored");
    },
    success: function success(returneddata) {
      if (!returneddata || returneddata.length == 0 || (0, _keys["default"])(returneddata).length == 0) {
        deferral.resolve("errored");
      }
      var mystanza = {};
      for (var i = 0; i < returneddata.entry.length; i++) {
        mystanza[returneddata.entry[i].name] = returneddata.entry[i].content;
      }
      var newEventAttributes = JSON.parse(mystanza["event_attributes"]);
      var addMITRETactic = true;
      var addMITRETactic_Display = true;
      var addMITRETechnique = true;
      var addMITREAttack = true;
      var addMITRETechnique_Display = true;
      var addMITREDescription = false;
      var addKillChain = true;
      var addAnalyticStory = true;
      for (var _i2 = 0; _i2 < newEventAttributes.length; _i2++) {
        if (newEventAttributes[_i2].field == "annotations.mitre_attack") {
          addMITREAttack = false;
        }
        if (newEventAttributes[_i2].field == "annotations.mitre_attack.mitre_tactic") {
          addMITRETactic_Display = false;
        }
        if (newEventAttributes[_i2].field == "annotations.mitre_attack.mitre_tactic_id") {
          addMITRETactic = false;
        }
        if (newEventAttributes[_i2].field == "annotations.mitre_attack.mitre_technique") {
          addMITRETechnique_Display = false;
        }
        if (newEventAttributes[_i2].field == "annotations.mitre_attack.mitre_technique_id") {
          addMITRETechnique = false;
        }
        if (newEventAttributes[_i2].field == "mitre_description") {
          addMITREDescription = false;
        }
        if (newEventAttributes[_i2].field == "killchain") {
          addKillChain = false;
        }
        if (newEventAttributes[_i2].field == "analytic_story") {
          addAnalyticStory = false;
        }
      }
      var shouldUpdate = false;
      if (addMITREAttack) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "annotations.mitre_attack",
          label: "MITRE ATT&CK"
        });
      }
      if (addMITRETactic_Display) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "annotations.mitre_attack.mitre_tactic",
          label: "MITRE ATT&CK Tactic"
        });
      }
      if (addMITRETactic) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "annotations.mitre_attack.mitre_tactic_id",
          label: "MITRE ATT&CK Tactic ID"
        });
      }
      if (addMITRETechnique_Display) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "annotations.mitre_attack.mitre_technique",
          label: "MITRE ATT&CK Technique"
        });
      }
      if (addMITRETechnique) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "annotations.mitre_attack.mitre_technique_id",
          label: "MITRE ATT&CK Technique ID"
        });
      }
      if (addMITREDescription) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "mitre_description",
          label: "MITRE ATT&CK Description"
        });
      }
      if (addKillChain) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "killchain",
          label: "Kill Chain Phase"
        });
      }
      if (addAnalyticStory) {
        shouldUpdate = true;
        newEventAttributes.unshift({
          field: "analytic_story",
          label: "Analytic Story"
        });
      }
      mystanza["event_attributes"] = (0, _stringify["default"])(newEventAttributes);
      if (shouldUpdate) {
        deferral.resolve("needed", mystanza);
      } else {
        deferral.resolve("notneeded");
      }
    }
  });
}
function CheckWhatAppsArePresent(deferral) {
  var apps = {
    sankey_diagram_app: "sse-setup-app-sankey",
    "custom-radar-chart-viz": "sse-setup-app-radar",
    timeline_app: "sse-setup-app-timeline",
    "URL Toolbox": "sse-setup-app-utbox",
    "SA-Investigator": "sse-setup-app-sa-inv",
    InfoSec_App_for_Splunk: "sse-setup-app-infosec",
    "DA-ESS-ContentUpdate": "sse-setup-app-escu",
    lookup_editor: "sse-setup-app-lookup",
    Splunk_ML_Toolkit: "sse-setup-app-mltk",
    ThreatHunting: "sse-setup-app-threathunting",
    "SA-cim_vladiator": "sse-setup-app-sa-cim"
  };
  var returnObj = {};
  $.ajax({
    url: $C["SPLUNKD_PATH"] + "/services/apps/local?output_mode=json&count=0",
    type: "GET",
    async: false,
    success: function success(returneddata) {
      for (var i = 0; i < returneddata.entry.length; i++) {
        // console.log("Got app 1", returneddata.entry[i])
        if (apps[returneddata.entry[i].name]) {
          // console.log("Got app 2", returneddata.entry[i])
          returnObj[apps[returneddata.entry[i].name]] = {
            status: "installed",
            version: returneddata.entry[i].content.version
          };
          delete apps[returneddata.entry[i].name];
        }
        if (apps[returneddata.entry[i].content.label]) {
          // console.log("Got app 3", returneddata.entry[i])
          returnObj[apps[returneddata.entry[i].content.label]] = {
            status: "installed",
            version: returneddata.entry[i].content.version
          };
          delete apps[returneddata.entry[i].content.label];
        }
      }
      for (var _key2 in apps) {
        // console.log("No luck with", key, apps[key])
        returnObj[apps[_key2]] = {
          status: "not_installed",
          version: "N/A"
        };
      }
      deferral.resolve(returnObj);
    },
    error: function error(xhr, textStatus, _error) {}
  });
}
function CheckToSeeIfContentSourcesAreEnabled(deferral) {
  var returnObj = {};
  $.ajax({
    url: Splunk.util.make_full_url("/splunkd/__raw/servicesNS/nobody/" + splunkjs.mvc.Components.getInstance("env").toJSON()["app"] + "/properties/essentials_updates?output_mode=json"),
    async: true,
    success: function success(returneddata) {
      var deferralStack = [];
      var _loop = function _loop() {
        var name = returneddata.entry[i].name;
        var localDeferral = $.Deferred();
        deferralStack.push(localDeferral);
        $.ajax({
          url: Splunk.util.make_full_url("/splunkd/__raw/servicesNS/nobody/" + splunkjs.mvc.Components.getInstance("env").toJSON()["app"] + "/configs/conf-essentials_updates/" + name + "?output_mode=json"),
          //url: '/splunkd/__raw/servicesNS/nobody/' + splunkjs.mvc.Components.getInstance("env").toJSON()['app'] + '/properties/essentials_updates/' + name + '/value?output_mode=json',
          async: true,
          success: function success(returneddata) {
            var content = returneddata.entry[0].content;
            if (content.order && content.order > 0) {
              returnObj[name] = content.disabled;
            }
            localDeferral.resolve();
          },
          error: function error(xhr, textStatus, _error2) {
            localDeferral.resolve();
          }
        });
      };
      for (var i = 0; i < returneddata.entry.length; i++) {
        _loop();
      }
      $.when.apply($, deferralStack).then(function () {
        deferral.resolve(returnObj);
      });
    },
    error: function error(xhr, textStatus, _error3) {
      deferral.resolve(returnObj);
    }
  });
}
function CheckIfESInstalled(deferral) {
  var returnObj = {
    isPresent: false,
    isOld: false,
    version: "N/A"
  };
  $.ajax({
    url: Splunk.util.make_full_url("/splunkd/__raw/services/apps/local?output_mode=json&count=0"),
    async: true,
    error: function error() {
      deferral.resolve(returnObj);
    },
    success: function success(returneddata) {
      // console.log("Got the ES Version Check Result", returneddata)
      for (var i = 0; i < returneddata["entry"].length; i++) {
        if (returneddata["entry"][i].name == "SplunkEnterpriseSecuritySuite") {
          if (/^(5\.[012]\.*|4\..*|3\..*)/.test(returneddata["entry"][i].content.version)) {
            // console.log("Needs Update", returneddata['entry'][i].content.version)
            returnObj["isPresent"] = true;
            returnObj["isOld"] = true;
            returnObj["version"] = returneddata["entry"][i].content.version;
          } else {
            // console.log("No Update Needed", returneddata['entry'][i].content.version)
            returnObj["isPresent"] = true;
            returnObj["isOld"] = false;
            returnObj["version"] = returneddata["entry"][i].content.version;
          }
        }
      }
      deferral.resolve(returnObj);
    }
  });
}
function CheckWhatScheduledSearchesScheduled(deferral) {
  var relevantSearches = {
    "Generate Data Availability ML Model for Latency": {
      description: "Generates the nightly baseline for the Data Availability model. Only required if you have configured the Data Inventory.",
      desiredCron: "49 2 * * *",
      shortName: "Data_Availability_Model"
    }
  };
  var returnObj = {};
  for (var search in relevantSearches) {
    returnObj[relevantSearches[search].shortName] = false;
  }
  $.ajax({
    url: $C["SPLUNKD_PATH"] + "/servicesNS/-/Splunk_Security_Essentials/saved/searches?output_mode=json&count=0",
    type: "GET",
    async: true,
    success: function success(savedSearchObj) {
      for (var i = 0; i < savedSearchObj.entry.length; i++) {
        if (relevantSearches[savedSearchObj.entry[i].name]) {
          if (savedSearchObj.entry[i].content["disabled"] == false && savedSearchObj.entry[i].content.cron_schedule.length >= 9) {
            returnObj[relevantSearches[savedSearchObj.entry[i].name].shortName] = true;
          }
        }
      }
      deferral.resolve(returnObj);
    },
    error: function error() {
      deferral.resolve(returnObj);
    }
  });
}
function CheckIfDataInventoryComplete(deferral) {
  Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("./node_modules/jquery/dist/jquery.js"), __webpack_require__("./node_modules/underscore/modules/index-all.js"),
  //'json!' + $C['SPLUNKD_PATH'] + '/services/pullJSON?config=data_inventory&locale=' + window.localeString,
  __webpack_require__("./package/src/components/data sync recursive ^json!.*$")("json!" + $C["SPLUNKD_PATH"] + "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products?bust=" + Math.round(Math.random() * 50000)), __webpack_require__("./package/src/components/data sync recursive ^json!.*$")("json!" + $C["SPLUNKD_PATH"] + "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes?bust=" + Math.round(Math.random() * 50000)), __webpack_require__("./package/src/components/data sync recursive ^json!.*\\/services\\/pullCSV$")("json!" + $C["SPLUNKD_PATH"] + "/services/pullCSV")]; (function ($, _,
  //data_inventory,
  data_inventory_products, data_inventory_eventtypes, sse_default_products) {
    // console.log("I got this", data_inventory_products, data_inventory_eventtypes, sse_default_products)
    var dsc_count = 0;
    var dsc_checked = 0;
    var dscs_with_products = 0;
    var products_default_total = 0;
    var products_default_checked = 0;
    var products_custom_total = 0;
    var products_custom_needsReview = 0;
    var hash_products_default = {};
    var hash_dscs = {};
    for (var i = 0; i < data_inventory_eventtypes.length; i++) {
      dsc_count++;
      if (data_inventory_eventtypes[i].status == "complete" || data_inventory_eventtypes[i].status == "failure") {
        dsc_checked++;
      }
    }
    for (var _i4 = 0; _i4 < sse_default_products.length; _i4++) {
      if (!(sse_default_products[_i4]["default_sourcetype_search"] && sse_default_products[_i4]["vendorName"] && sse_default_products[_i4]["productName"])) {
        continue;
      }
      var productId = "";
      // this is 'cause of some weird bug in pullCSV where I think it's inserting an invalid character at the start of the first line. I don't use it much though, so just doing a workaround for now.
      for (key in sse_default_products[_i4]) {
        if ((0, _indexOf["default"])(key).call(key, "productId") >= 0) {
          productId = sse_default_products[_i4][key];
        }
      }
      hash_products_default[productId] = sse_default_products[_i4];
      // console.log("default product hash", hash_products_default)
      products_default_total++;
    }
    for (var _i6 = 0; _i6 < data_inventory_products.length; _i6++) {
      if (!(data_inventory_products[_i6].stage == "step-sourcetype" && (data_inventory_products[_i6].status == "pending" || data_inventory_products[_i6].status == "blocked" || data_inventory_products[_i6].status == "new"))) {
        // console.log("Looking at a product", data_inventory_products[i].productId, data_inventory_products[i], hash_products_default)
        if (hash_products_default[data_inventory_products[_i6].productId]) {
          products_default_checked++;
        } else {
          products_custom_total++;
          if (data_inventory_products[_i6].stage == "needsConfirmation") {
            products_custom_needsReview++;
          }
        }
        if (typeof data_inventory_products[_i6].eventtypeId != "undefined" && data_inventory_products[_i6].eventtypeId != "undefined") {
          var dscs = data_inventory_products[_i6].eventtypeId.split("|");
          for (var g = 0; g < dscs.length; g++) {
            if (hash_dscs[dscs[g]]) {
              hash_dscs[dscs[g]]++;
            } else {
              hash_dscs[dscs[g]] = 1;
            }
          }
        }
      }
    }
    dscs_with_products = (0, _keys["default"])(hash_dscs).length;
    var returnObj = {
      dsc_count: dsc_count,
      dsc_checked: dsc_checked,
      dscs_with_products: dscs_with_products,
      products_default_total: products_default_total,
      products_default_checked: products_default_checked,
      products_custom_total: products_custom_total,
      products_custom_needsReview: products_custom_needsReview
    };
    deferral.resolve(returnObj);
  }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}).catch(__webpack_require__.oe);
}
function CheckIfSearchesAreMapped(deferral) {
  Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("./node_modules/jquery/dist/jquery.js"), __webpack_require__("./node_modules/underscore/modules/index-all.js"), __webpack_require__("./package/src/components/data sync recursive")(Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/indexed.js")),
  //'json!' + $C['SPLUNKD_PATH'] + '/services/pullJSON?config=data_inventory&locale=' + window.localeString,
  __webpack_require__("./package/src/components/data sync recursive ^json!.*$")("json!" + $C["SPLUNKD_PATH"] + "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark?bust=" + Math.round(Math.random() * 50000)), __webpack_require__("./package/src/components/data sync recursive ^json!.*$")("json!" + $C["SPLUNKD_PATH"] + "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings?bust=" + Math.round(Math.random() * 50000)), __webpack_require__("./package/src/components/data sync recursive ^json!.*$")("json!" + $C["SPLUNKD_PATH"] + "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content?bust=" + Math.round(Math.random() * 50000))]; (function ($, _, indexed,
  //data_inventory,
  bookmarks, local_search_mappings, custom_content) {
    var getData = indexed.getData,
      KEY_SAVEDSEARCHES = indexed.KEY_SAVEDSEARCHES;
    getSavedSearches().then(function (data) {
      if (data) {
        saved_searches = data;
      }
      var standardESApps = ["SA-AccessProtection", "DA-ESS-AccessProtection", "SplunkEnterpriseSecuritySuite", "SA-AuditAndDataProtection", "SA-Utils", "DA-ESS-ThreatIntelligence", "SA-EndpointProtection", "Splunk_SA_CIM", "DA-ESS-NetworkProtection", "DA-ESS-EndpointProtection", "DA-ESS-ContentUpdate", "SA-IdentityManagement", "DA-ESS-IdentityManagement", "SA-NetworkProtection", "SA-ThreatIntelligence", "SA-UEBA"];
      var standardIrrelevantApps = ["splunk_archiver", "splunk_monitoring_console", "splunk_instrumentation"];
      var num_saved_searches = 0; // done
      var num_mapped_saved_searches = 0; // done
      var num_nondetection_searches = 0; // done

      var num_enabled_content = 0;
      var num_bookmarked_content = 0;
      var num_custom_content = custom_content.length;
      for (var i = 0; i < local_search_mappings.length; i++) {
        if (local_search_mappings[i].showcaseId == "") {
          num_nondetection_searches++;
        } else {
          num_mapped_saved_searches++;
        }
      }
      for (var _i8 = 0; _i8 < saved_searches.length; _i8++) {
        var _context, _context2, _context3;
        // console.log("saved_searches[i]",saved_searches[i])
        if (saved_searches[_i8]["isEnabled"] == "true" && saved_searches[_i8]["isScheduled"] == "true" && !((0, _indexOf["default"])(_context = saved_searches[_i8].name).call(_context, " - Lookup Gen") >= 0 || (0, _indexOf["default"])(_context2 = saved_searches[_i8].name).call(_context2, " - Threat Gen") >= 0 || (0, _indexOf["default"])(_context3 = saved_searches[_i8].name).call(_context3, " - Context Gen") >= 0 || (0, _indexOf["default"])(standardESApps).call(standardESApps, saved_searches[_i8].app) >= 0 && !(saved_searches[_i8]["isCorrelationSearch"] == "false") || (0, _indexOf["default"])(standardIrrelevantApps).call(standardIrrelevantApps, saved_searches[_i8].app) >= 0)) {
          num_saved_searches++;
          // console.log("Got saved search #",num_saved_searches, saved_searches[i])
        }
      }
      for (var _i10 = 0; _i10 < bookmarks.length; _i10++) {
        if (bookmarks[_i10].status == "successfullyImplemented") {
          num_enabled_content++;
        }
        if (bookmarks[_i10].status != "none") {
          num_bookmarked_content++;
        }
      }
      var returnObj = {
        num_enabled_content: num_enabled_content,
        num_bookmarked_content: num_bookmarked_content,
        num_saved_searches: num_saved_searches,
        num_mapped_saved_searches: num_mapped_saved_searches,
        num_nondetection_searches: num_nondetection_searches,
        num_custom_content: num_custom_content
      };
      deferral.resolve(returnObj);
    })["catch"](function (error) {
      console.log("Error: ", error);
    });
  }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}).catch(__webpack_require__.oe);
}
function getSavedSearchByName(name) {
  var searches = JSON.parse(localStorage["sse-savedsearches"]);
  for (var i = 0; i < searches.length; i++) {
    if (searches[i]["name"] === name) {
      return searches[i];
      break;
    }
  }
  return -1;
}
function getSavedSearches() {
  return new _promise["default"](function (resolve, reject) {
    getData(KEY_SAVEDSEARCHES).then(function (returneddata) {
      if (returneddata) {
        resolve(returneddata);
      }
    })["catch"](function (error) {
      console.log("Error: ", error);
      reject(error);
    });
  });
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./package/src/components/data/sendTelemetry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Object$defineProperty = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property.js");
var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault.js");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.SendTelemetryToSplunk = SendTelemetryToSplunk;
var _now = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/date/now.js"));
var _properties = __webpack_require__("./package/src/properties.js");
var splunk_metrics = function () {
  var app_id = undefined;
  return {
    trackEvent: function trackEvent(eventType, data) {
      if (!window._splunk_metrics_events) return;
      (0, _properties.properties)().then(function (props) {
        var version = props.entry[0].content.version;
        var event = {
          data: data || {},
          timestamp: (0, _now["default"])()
        };
        event['type'] = eventType;
        event['data']['app'] = app_id;
        event['data']['telemetry_type'] = 'customSSE';
        event['data']['version'] = version;
        window._splunk_metrics_events.push(event);
      });
    },
    init: function init(config, id) {
      app_id = id;
      if (config) splunk_metrics.trackEvent('config', config);
    }
  };
}();
splunk_metrics.init({
  "logging": true
  //"devMode": true,
}, "Splunk_Security_Essentials");
function SendTelemetryToSplunk(component, input) {
  splunk_metrics.trackEvent(component, input);
}

/***/ }),

/***/ "./package/src/components/pages/home.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault.js");
var _slicedToArray2 = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js"));
var _promise = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/promise.js"));
var _map = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js"));
var _find = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/find.js"));
var _filter = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/filter.js"));
var _keys = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/object/keys.js"));
var _sort = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/sort.js"));
var _forEach = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js"));
var _setTimeout2 = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/set-timeout.js"));
var _indexOf = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js"));
var _stringify = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/json/stringify.js"));
localStorage['sse-newUserRun'] = "New";
require(['jquery'], function ($) {
  var _context16;
  Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("./node_modules/underscore/modules/index-all.js"), __webpack_require__("./node_modules/backbone/backbone.js"), __webpack_require__("splunk.util"), __webpack_require__("./package/src/components/data/health_checks.js"), __webpack_require__("./node_modules/bootstrap/js/src/tooltip.js"), __webpack_require__("./node_modules/bootstrap/js/src/popover.js")]; (function (underscore, Backbone, splunkUtil, healthChecks) {
    _promise["default"].all([
    // $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString,
    fetch($C['SPLUNKD_PATH'] + '/services/pullJSON?config=usecases&locale=' + window.localeString), fetch($C['SPLUNKD_PATH'] + '/services/pullJSON?config=intro&locale=' + window.localeString), fetch($C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config')]).then(function (responses) {
      return _promise["default"].all((0, _map["default"])(responses).call(responses, function (response) {
        return response.json();
      }));
    }).then(function (_ref) {
      var _context, _context2;
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 3),
        UseCases = _ref2[0],
        PageGuides = _ref2[1],
        appConfig = _ref2[2];
      // Help while building out the page -- let's look through all nextFeature, nextFeatures, prereqs, and other_recommended_features and look for any not defined.
      var listOfRequiredFeatures = {};
      var listOfRelevantFields = ["nextFeature", "nextFeatures", "prereqs", "other_recommended_features"];
      for (var PageGuide in PageGuides['PageGuides']) {
        // console.log("Looking", PageGuide)
        for (var Item in PageGuides['PageGuides'][PageGuide]['items']) {
          // console.log("Looking", Item)
          for (var i = 0; i < listOfRelevantFields.length; i++) {
            if (PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]]) {
              // console.log("Looking for", listOfRelevantFields[i], PageGuide, Item, PageGuides['PageGuides'][PageGuide]['items'][Item][ listOfRelevantFields[i] ])
              if (typeof PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]] == "string") {
                if (!listOfRequiredFeatures[PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]]]) {
                  listOfRequiredFeatures[PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]]] = [];
                }
                listOfRequiredFeatures[PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]]].push(Item);
              } else {
                for (var g = 0; g < PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]].length; g++) {
                  if (!listOfRequiredFeatures[PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]][g]]) {
                    listOfRequiredFeatures[PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]][g]] = [];
                  }
                  listOfRequiredFeatures[PageGuides['PageGuides'][PageGuide]['items'][Item][listOfRelevantFields[i]][g]].push(Item);
                }
              }
            }
          }
        }
      }
      for (var Feature in PageGuides['Features']) {
        if (listOfRequiredFeatures[Feature]) {
          delete listOfRequiredFeatures[Feature];
        }
      }
      // console.log("MISSING FEATURES", listOfRequiredFeatures)

      var demoMode = "uninitialized";
      var demoModeInputSetting = '';
      for (var _i2 = 0; _i2 < appConfig.length; _i2++) {
        if (appConfig[_i2].param == "demoMode") {
          demoMode = appConfig[_i2].value;
        }
      }
      if (demoMode == "uninitialized") {
        demoMode = "false";
        setAppConfig("demoMode", "false");
      }
      if (demoMode == "true") {
        demoModeInputSetting = ' checked';
      }
      $("#DemoModeSwitch").html('<div class="tooltipcontainer  filterItem" style="margin-right: 45px;"><label class="filterswitch floatright" style="margin-left: 8px;">' /* + tooltipText*/ + '<input type="checkbox" id="FILTER_DEMOMODE" name="FILTER_DEMOMODE" ' + demoModeInputSetting + '><span class="filterslider "></span></label><div class="filterLine">Demo Mode <a href=\"#\" data-placement=\"bottom\" onclick=\"return false;\" class=\"icon-info\" title=\"SPL is hidden by default and <br />demo searches show up first.\"> </a></div></div> ').click(function (evt) {
        var setting = $(evt.target).is(":checked");
        if (setting) {
          setAppConfig("demoMode", "true");
        } else {
          setAppConfig("demoMode", "false");
        }
      });
      (0, _find["default"])(_context = $("#DemoModeSwitch")).call(_context, "a").tooltip({
        html: true
      });
      $("#processing").html('<div></div>');

      //These are helper functions for the lines
      var lines = {};
      function hideLines() {
        //console.log("inside hidelines")
        $.each(lines, function (intValue, lineGroup) {
          $.each(lineGroup[0], function (intValue2, line) {
            if (typeof line.hide != 'undefined' && $.isFunction(line.hide)) {
              line.hide();
            }
          });
        });
      }
      function refreshLinePositions() {
        $.each(lines, function (intValue, lineGroup) {
          $.each(lineGroup[0], function (intValue2, line) {
            if (typeof line.hide !== 'undefined' && $.isFunction(line.hide)) {
              line.position();
            }
          });
        });
      }
      function showLineGroup(group) {
        if (typeof lines[group] != "undefined") {
          $.each(lines[group][0], function (intValue, line) {
            if (typeof line.show !== 'undefined' && $.isFunction(line.show)) {
              line.show();
            }
          });
          refreshLinePositions();
        }
      }
      function createLineGroup(start) {
        lines[start] = [];
        var lineGroup = [];
        $("#" + start + "_drilldown a").each(function (idx, PageGuideDrillDown) {
          var end = $(PageGuideDrillDown).attr("id");
          var line = new LeaderLine(document.getElementById(start), document.getElementById(end), {
            hide: false,
            path: 'grid',
            startSocket: 'bottom',
            endSocket: 'top',
            positionByWindowResize: 'false',
            color: 'rgba(0, 110, 170,1)'
          });
          lineGroup.push(line);
        });
        lines[start].push(lineGroup);
        //console.log("Just created line group")
        //console.log(lines)
      }
      function createLine(start, end) {
        //console.log("inside createLine:"+start+" -> "+end)
        lines[start] = [];
        var lineGroup = [];
        var line = new LeaderLine(document.getElementById(start), document.getElementById(end), {
          hide: false,
          path: 'grid',
          startSocket: 'bottom',
          endSocket: 'top',
          positionByWindowResize: 'false',
          color: 'rgba(0, 110, 170,1)'
        });
        lineGroup.push(line);
        //console.log("Just created line")
        lines[start].push(lineGroup);
      }

      //This adds the first time entry boxes with bullet points

      var sorted_PageGuides = (0, _filter["default"])(_context2 = (0, _keys["default"])(PageGuides['PageGuides'])).call(_context2, function (PageGuide) {
        return PageGuides['PageGuides'][PageGuide]['enabled'];
      });
      (0, _sort["default"])(sorted_PageGuides).call(sorted_PageGuides, function (a, b) {
        if (PageGuides['PageGuides'][a].order > PageGuides['PageGuides'][b].order) return 1;
        if (PageGuides['PageGuides'][a].order < PageGuides['PageGuides'][b].order) return -1;
        return 0;
      });
      (0, _forEach["default"])(sorted_PageGuides).call(sorted_PageGuides, function (PageGuide) {
        var icon = "";
        if (PageGuides['PageGuides'] && PageGuides['PageGuides'][PageGuide] && PageGuides['PageGuides'][PageGuide]['icon']) {
          // icon = "<img src=\"" + PageGuides['PageGuides'][PageGuide]['icon'] + "\" />"
          icon = "<img src=" + Splunk.util.make_full_url(PageGuides['PageGuides'][PageGuide]['icon']) + "/>";
        }
        if (!(PageGuides['PageGuides'] && PageGuides['PageGuides'][PageGuide] && PageGuides['PageGuides'][PageGuide]['name'])) {
          // console.log("Skipping this use case", UseCases[UseCase])
        } else {
          var _context3;
          var PageGuideItemListItem = "";
          var addlClass = "";
          var title = "";
          if (localStorage["sse-pageGuide-toplevel"] && localStorage["sse-pageGuide-toplevel"] == PageGuide) {
            addlClass = "lastSelected";
            title = "You selected this last time you viewed this page.";
          }
          var sorted_Items = (0, _filter["default"])(_context3 = (0, _keys["default"])(PageGuides['PageGuides'][PageGuide]["items"])).call(_context3, function (item) {
            return PageGuides['PageGuides'][PageGuide]["items"][item]['enabled'];
          });
          (0, _sort["default"])(sorted_Items).call(sorted_Items, function (a, b) {
            if (PageGuides['PageGuides'][PageGuide]["items"][a].order > PageGuides['PageGuides'][PageGuide]["items"][b].order) return 1;
            if (PageGuides['PageGuides'][PageGuide]["items"][a].order < PageGuides['PageGuides'][PageGuide]["items"][b].order) return -1;
            return 0;
          });
          $("#ListOfPageGuidesFirstEntry").append($("<a class=\"PageGuide CardStyles\">").attr("title", title).addClass(addlClass).attr("id", "firstentry_" + PageGuide).click(function () {
            $(".lastSelected").attr("title", "").tooltip({
              html: true
            });
            $(".lastSelected").removeClass("lastSelected");

            //lineGroup=this.id.split("firstentry_")[1]
            $("#" + PageGuide).addClass("active");
            $("#ListOfPageGuidesFirstEntry").hide("300");

            //$("#ListOfPageGuides").show(300);
            $("#ListOfPageGuides").fadeIn(300).css('display', 'flex');
            $("#ListOfPageGuides").addClass("activated");
            $("div#" + PageGuide + "_drilldown").fadeIn(300).css('display', 'inline-block');
            (0, _setTimeout2["default"])(function () {
              if (localStorage["sse-pageGuide-bottomlevel"] && $("#" + localStorage["sse-pageGuide-bottomlevel"] + ":visible").length > 0) {
                $("#" + localStorage["sse-pageGuide-bottomlevel"]).click();
              } else {
                createLineGroup(PageGuide);
              }
            }, 400);
            sendTelemetryForIntro("browse", PageGuide);
            setLocalStorage(PageGuide);
          }).append($("<div class=\"BodyStyles\">").append($("<div class=\"PageGuideImg\">" + icon + "</div>"), $("<div class=\"PageGuideDescription\">").attr("data-id", PageGuide).append($("<h2 class=\"HeadingStyles\">").append(PageGuides['PageGuides'][PageGuide]['name']), (0, _forEach["default"])(sorted_Items).call(sorted_Items, function (PageGuideItem) {
            PageGuideItemListItem += "<li>" + PageGuides['PageGuides'][PageGuide]["items"][PageGuideItem]["name"] + "</li>";
          }), $("<p class=\"ParagraphStyles\">" + PageGuides['PageGuides'][PageGuide]['description']).append($("<ul>").append(PageGuideItemListItem))))));
          if (addlClass != "") {
            $(".lastSelected").tooltip({
              html: true
            });
          }
        }
      });

      //This controls the first level of boxes after you've clicked through the firsts entry
      (0, _forEach["default"])(sorted_PageGuides).call(sorted_PageGuides, function (PageGuide) {
        var icon = "";
        if (PageGuides['PageGuides'] && PageGuides['PageGuides'][PageGuide] && PageGuides['PageGuides'][PageGuide]['icon']) {
          // icon = "<img src=\"" + PageGuides['PageGuides'][PageGuide]['icon'] + "\" />"
          icon = "<img src=" + Splunk.util.make_full_url(PageGuides['PageGuides'][PageGuide]['icon']) + "/>";
        }
        if (!(PageGuides['PageGuides'] && PageGuides['PageGuides'][PageGuide] && PageGuides['PageGuides'][PageGuide]['name'])) {
          // console.log("Skipping this use case", UseCases[UseCase])
        } else {
          var _context4;
          var PageGuideItemListItem = "";
          $("#ListOfPageGuides").append($("<a id=\"" + PageGuide + "\" class=\"PageGuide CardStyles\">").click(function () {
            $(".DrillDownBox").hide();
            $(".ContentBox").hide();
            $(".PageGuide").removeClass("active");
            $(".PageGuide2").removeClass("active");
            $("#PageGuideDrilldown").removeClass("activated");
            $("div#" + this.id + "_drilldown").css('display', 'inline-block');
            $(this).addClass("active");
            $(this).parent().addClass("activated");
            hideLines();
            createLineGroup(this.id);
            $("#PageGuideDrillDownTitle").html("<h2 class=\"HeadingStyles\">" + PageGuides['PageGuides'][PageGuide]['name'] + "</h2>");
            //$("#PageGuideDrillDownTitle").show();
            $("#PageGuideContent").hide();
            sendTelemetryForIntro("browse", PageGuide);
            setLocalStorage(PageGuide);
          }).append($("<div class=\"BodyStyles\">").append($("<div class=\"PageGuideImg\">" + icon + "</div>"), $("<div class=\"PageGuideDescription\">").attr("data-id", PageGuide).append($("<h2 class=\"HeadingStyles\">").append(PageGuides['PageGuides'][PageGuide]['name'])))));
          //This controls the second level of boxeslet sorted_PageGuides = Object.keys(PageGuides['PageGuides']);
          var sorted_Items = (0, _filter["default"])(_context4 = (0, _keys["default"])(PageGuides['PageGuides'][PageGuide]["items"])).call(_context4, function (item) {
            return PageGuides['PageGuides'][PageGuide]["items"][item]['enabled'];
          });
          (0, _sort["default"])(sorted_Items).call(sorted_Items, function (a, b) {
            if (PageGuides['PageGuides'][PageGuide]["items"][a].order > PageGuides['PageGuides'][PageGuide]["items"][b].order) return 1;
            if (PageGuides['PageGuides'][PageGuide]["items"][a].order < PageGuides['PageGuides'][PageGuide]["items"][b].order) return -1;
            return 0;
          });
          (0, _forEach["default"])(sorted_Items).call(sorted_Items, function (PageGuideItem) {
            $("#PageGuideDrilldown").append($("<div id=\"" + PageGuide + "_drilldown\" class=\"DrillDownBox\">").append($("<a id=\"" + PageGuideItem + "\" class=\"PageGuide2 CardStyles\">").click(function (evt) {
              var _context5;
              // console.log("Got a click on ", evt.target)
              $(".DrillDownBox2").hide();
              $(".PageGuide2").removeClass("active");
              $("div#" + this.id + "_drilldown").css('display', 'inline-block');
              $(this).addClass("active");
              $(this).parent().parent().addClass("activated");
              $(".ContentBox").hide();
              $("div#" + this.id + "_contentbox").css('display', 'inline-block');
              $("#PageGuideContent").show();
              var start = $(this).parent().attr("id").split("_drilldown")[0];
              var end = this.id;
              hideLines();
              createLine(start, end);
              // $("div#" + this.id + "_contentbox").append()
              sendTelemetryForIntro("browse", PageGuide, PageGuides['PageGuides'][PageGuide]["items"][PageGuideItem]["name"]);
              setLocalStorage(PageGuide, PageGuideItem);
              loadPageGuideContent((0, _find["default"])(_context5 = $("div#" + this.id + "_contentbox")).call(_context5, ".page_guide_detail"), PageGuides['PageGuides'][PageGuide]["items"][PageGuideItem]);
            }).append($("<div class=\"BodyStyles\">").append($("<div class=\"PageGuideImg\">" + icon + "</div>"), $("<div class=\"PageGuideDescription\">").attr("data-id", PageGuideItem).append($("<h2 class=\"HeadingStyles\">").append(PageGuides['PageGuides'][PageGuide]["items"][PageGuideItem]["name"])))))),
            //This controls the third level with the details
            $("#PageGuideContent").append($("<div id=\"" + PageGuideItem + "_contentbox\" class=\"ContentBox\">").append($("<h2 class=\"HeadingStyles\">").append(PageGuides['PageGuides'][PageGuide]["items"][PageGuideItem]["name"]), PageGuides['PageGuides'][PageGuide]["items"][PageGuideItem]["description"], $('<div class="page_guide_detail">')));
          });
        }
      });
      function setLocalStorage(toplevel, bottomlevel) {
        localStorage["sse-pageGuide-toplevel"] = toplevel;
        if (bottomlevel) {
          localStorage["sse-pageGuide-bottomlevel"] = bottomlevel;
        }
      }
      function takeAction(nextFeature, actions, overrides, tour) {
        // console.log("Initiating action", nextFeature, actions, overrides)
        sendTelemetryForIntro("click", localStorage['sse-pageGuide-toplevel'], localStorage['sse-pageGuide-bottomlevel'], overrides);
        var demoModeInstruction = false;
        // console.log("Got next")
        if (actions) {
          for (var _i4 = 0; _i4 < actions.length; _i4++) {
            var _context6;
            if ((0, _indexOf["default"])(_context6 = actions[_i4].param).call(_context6, "-splMode") >= 0) {
              demoModeInstruction = true;
            }
            localStorage[actions[_i4].param] = actions[_i4].value;
          }
        }
        if (overrides) {
          for (var _i6 = 0; _i6 < overrides.length; _i6++) {
            var _context7;
            if ((0, _indexOf["default"])(_context7 = overrides[_i6].param).call(_context7, "-splMode") >= 0) {
              demoModeInstruction = true;
            }
            // console.log("Overriding", overrides[i].param, overrides[i].value)
            localStorage[overrides[_i6].param] = overrides[_i6].value;
          }
        }
        if (!demoModeInstruction) {
          if (demoMode == "true") {
            //localStorage[localStoragePreface + '-splMode'] = "false"
            //Always show the SPL - JB
            localStorage[localStoragePreface + '-splMode'] = "true";
          } else {
            localStorage[localStoragePreface + '-splMode'] = "true";
          }
        }
        if (tour) {
          if (PageGuides['Features'][nextFeature]['link']) {
            location.href = PageGuides['Features'][nextFeature]['link'] + "?tour=" + nextFeature.replace(/[^a-zA-Z0-9_\-]/g, "") + "-tour";
          } else {
            location.href = "home?tour=" + nextFeature.replace(/[^a-zA-Z0-9_\-]/g, "") + "-tour";
          }
        } else {
          //location.href=PageGuides['Features'][nextFeature]['link']
          location.href = nextFeature;
        }
      }
      function loadPageGuideContent($el, item) {
        var _context9, _context11, _context13;
        // console.log("loading", item)
        // $(".page_guide_detail").each(function(num, obj){
        //     $(obj).html("")
        // })
        // $(".pageGuideActions").remove()
        var myDiv = $('<div class="pageGuideActions" style="padding-top: 10px;">');

        // First Handle Pre-reqs
        if (item.prereqs && item.prereqs.length > 0) {
          var myId = item.name.replace(/[^a-zA-Z_]/g, "") + "_prereqs";
          var Template = "<table id=\"SHORTNAME_table\" class=\"dvexpand table table-chrome\"><colgroup><col span=\"1\" style=\"width: 30px\" /><col span=\"1\" style=\"width: 200px\" /><col span=\"1\" style=\"width: 120px\" /><col span=\"1\"  /></colgroup><thead><tr><th colspan=\"NUMCOLUMNS\" class=\"expands\"  onclick='$(\"#SHORTNAME-tbody\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");  $(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;'><h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\">&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE <div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a></h2> <label style=\"display: inline;\" for=\"SHORTNAME_statusIcon\">DESCRIPTION</label> <div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: none\" id=\"SHORTNAME-tbody\"></tbody></table>";
          myDiv.append(Template.replace(/SHORTNAME/g, myId).replace("TITLE", "Setup Steps").replace("DESCRIPTION", _("Completion of these steps is required to get the value for this area.")).replace("NUMCOLUMNS", "4"));
          for (var _i8 = 0; _i8 < item.prereqs.length; _i8++) {
            (0, _find["default"])(myDiv).call(myDiv, "#" + myId + "-tbody").append(generateFeatureRow(item.prereqs[_i8]));
          }
          myDiv.append($("<div style=\"clear: both; height: 20px; margin: 10px\"/>"));
        }

        // Then handle button
        if (item.nextFeature) {
          var newPageName = "";
          if (item.nextFeature && PageGuides['Features'][item.nextFeature] && PageGuides['Features'][item.nextFeature].name) {
            newPageName = ": " + PageGuides['Features'][item.nextFeature].name;
          }
          if (item.localStorageActions && item.localStorageActions.length > 0) {
            var tooltipText = _("We will automatically set the following configurations locally on your browser. All of these can be changed on the next page, but the defaults should make this app easier to use:");
            tooltipText += "<ul>";
            for (var _i10 = 0; _i10 < item.localStorageActions.length; _i10++) {
              if (item.localStorageActions[_i10].description && item.localStorageActions[_i10].description != "") {
                tooltipText += "<li>" + item.localStorageActions[_i10].description + "</li>";
              }
            }
            tooltipText += "</ul>";
            myDiv.append($("<button>").attr("data-placement", "top").attr("data-toggle", "popover").attr("data_trigger", "hover").attr("data-content", tooltipText).attr("title", tooltipText).text(_("Launch") + newPageName).addClass("launch-button btn btn-primary").attr("data-actions", (0, _stringify["default"])(item.localStorageActions)).click(function (evt) {
              var actions = JSON.parse($(evt.target).attr("data-actions"));
              takeAction(item.nextFeature, actions);
            }));
            // console.log("Looking for a tour in ", item.nextFeature, PageGuides['Features'][item.nextFeature], PageGuides['Features'][item.nextFeature].tour)
            if (PageGuides['Features'][item.nextFeature].tour && PageGuides['Features'][item.nextFeature].tour.length > 1) {
              myDiv.append($("<button>").attr("data-placement", "top").attr("data-toggle", "popover").attr("data_trigger", "hover").attr("data-content", tooltipText).attr("title", tooltipText).text(_("Launch with Tour")).addClass("launch-button btn").attr("data-actions", (0, _stringify["default"])(item.localStorageActions)).click(function (evt) {
                var actions = JSON.parse($(evt.target).attr("data-actions"));
                takeAction(item.nextFeature, actions, null, true);
              }));
            }
          } else {
            var _tooltipText = PageGuides['Features'][item.nextFeature].description;
            myDiv.append($("<button>").attr("data-placement", "top").attr("data-toggle", "popover").attr("data_trigger", "hover").attr("data-content", _tooltipText).attr("title", _tooltipText).addClass("launch-button btn btn-primary").text(_("Launch") + newPageName).click(function () {
              if (demoMode == "true") {
                localStorage[localStoragePreface + '-splMode'] = "false";
              } else {
                localStorage[localStoragePreface + '-splMode'] = "true";
              }
              takeAction(item.nextFeature);
            }));

            // console.log("Looking for a tour in ", item.nextFeature, PageGuides['Features'][item.nextFeature], PageGuides['Features'][item.nextFeature].tour)
            if (PageGuides['Features'][item.nextFeature].tour && PageGuides['Features'][item.nextFeature].tour.length > 1) {
              myDiv.append($("<button>").text(_("Launch with Tour")).addClass("launch-button btn").click(function (evt) {
                takeAction(item.nextFeature, null, null, true);
              }));
            }
          }
        }

        // Handle a list of next features
        if (item.nextFeatures) {
          var label = _("Launch Feature");
          if (item.nextFeatures.length > 1) {
            label = _("Launch Features");
          }
          var _myId = item.name.replace(/[^a-zA-Z_]/g, "") + "_next_steps";
          var _Template = "<table id=\"SHORTNAME_table\" class=\"dvexpand table table-chrome\"><colgroup><col span=\"1\" style=\"width: 30px\" /><col span=\"1\" style=\"width: 200px\" /><col span=\"1\" style=\"width: 120px\" /><col span=\"1\" /></colgroup><thead><tr><th colspan=\"NUMCOLUMNS\" class=\"expands\"  onclick='$(\"#SHORTNAME-tbody\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");  $(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;'><h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\">&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE <div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a></h2> <label style=\"display: inline;\" for=\"SHORTNAME_statusIcon\">DESCRIPTION</label> <div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: none\" id=\"SHORTNAME-tbody\"></tbody></table>";
          myDiv.append(_Template.replace(/SHORTNAME/g, _myId).replace("TITLE", label).replace("DESCRIPTION", _("")).replace("NUMCOLUMNS", "4"));
          for (var _i12 = 0; _i12 < item.nextFeatures.length; _i12++) {
            (0, _find["default"])(myDiv).call(myDiv, "#" + _myId + "-tbody").append(generateFeatureRow(item.nextFeatures[_i12], item.localStorageActions));
          }
          myDiv.append($("<div style=\"clear: both; height: 20px; margin: 10px\"/>"));
        }

        // Use Case List
        if (item.useUseCaseList) {
          var _context8;
          var _myId2 = item.name.replace(/[^a-zA-Z_]/g, "") + "_usecases";
          var _Template2 = "<table id=\"SHORTNAME_table\" class=\"dvexpand table table-chrome\"><colgroup><col span=\"1\" style=\"width: 30px\" /><col span=\"1\" style=\"width: 200px\" /><col span=\"1\" style=\"width: 120px\" /><col span=\"1\" /></colgroup><thead><tr><th colspan=\"NUMCOLUMNS\" class=\"expands\"  onclick='$(\"#SHORTNAME-tbody\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");  $(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;'><h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\">&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE <div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a></h2> <label style=\"display: inline;\" for=\"SHORTNAME_statusIcon\">DESCRIPTION</label> <div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: none\" id=\"SHORTNAME-tbody\"></tbody></table>";
          myDiv.append(_Template2.replace(/SHORTNAME/g, _myId2).replace("TITLE", _("Launch Content")).replace("DESCRIPTION", _("Clicking a use case below will bring you to the Security Content page.")).replace("NUMCOLUMNS", "1"));

          // let CountByUseCase = new Object;
          // Object.keys(ShowcaseInfo.summaries).forEach(function(ShowcaseName) {
          //     let ShowcaseSettings = ShowcaseInfo['summaries'][ShowcaseName]
          //     if(ShowcaseSettings['usecase']){
          //         let UseCases = ShowcaseSettings['usecase'].split("|")
          //         UseCases.forEach(function(UseCase) {
          //             if (typeof CountByUseCase[UseCase] == "undefined")
          //                 CountByUseCase[UseCase] = 0
          //             CountByUseCase[UseCase]++
          //         })
          //     }
          // })

          var keysInOrder = (0, _filter["default"])(_context8 = (0, _keys["default"])(UseCases)).call(_context8, function (item) {
            return UseCases[item].enable;
          });
          (0, _sort["default"])(keysInOrder).call(keysInOrder, function (a, b) {
            if ((!UseCases[a] || !UseCases[a].order) && (!UseCases[b] || !UseCases[b].order)) {
              return 0;
            }
            if (UseCases[a] && UseCases[a].order && (!UseCases[b] || !UseCases[b].order)) {
              return 1;
            }
            if ((!UseCases[a] || !UseCases[a].order) && UseCases[b] && UseCases[b].order) {
              return -1;
            }
            if (UseCases[a].order > UseCases[b].order) {
              return 1;
            }
            if (UseCases[a].order < UseCases[b].order) {
              return -1;
            }
            return 0;
          });
          (0, _forEach["default"])(keysInOrder).call(keysInOrder, function (UseCase) {
            var icon = "";
            if (UseCases && UseCases[UseCase] && UseCases[UseCase]['icon']) {
              icon = "<img src=\"" + UseCases[UseCase]['icon'] + "\" />";
            }
            if (!(UseCases && UseCases[UseCase] && UseCases[UseCase]['name'])) {
              // console.log("Skipping this use case", UseCases[UseCase])
            } else {
              (0, _find["default"])(myDiv).call(myDiv, "#" + _myId2 + "-tbody").append($("<div class=\"UseCase\">").append($("<div class=\"UseCaseImg\">" + icon + "</div>"), $("<div class=\"UseCaseDescription\">").append($("<h2>").append($("<a href=\"#\"> " + UseCases[UseCase]['name'] + "</a>").click(function () {
                //sendTelemetryForIntro(UseCase);
                //setLocalStorage(UseCase);
                var params = [{
                  "param": "sse-usecase-Multiple",
                  "value": "[\"" + UseCases[UseCase]['name'].replace(/ /g, "_") + "\"]"
                }];
                if (UseCases[UseCase]['name'].replace(/ /g, "_") == "SOC_Automation") {
                  params.push({
                    "param": "sse-journey-Multiple",
                    "value": "[\"Stage_1\",\"Stage_2\",\"Stage_3\",\"Stage_4\",\"Stage_5\"]"
                  });
                }
                takeAction("contents", item.localStorageActions, params);
                return false;
              })),
              // $("<h4>" + Splunk.util.sprintf(_("Featuring %s Examples!"), CountByUseCase[UseCase]) + "</h4>"),
              $("<p>" + UseCases[UseCase]['description'] + "</p>"))));
            }
          });
        }

        // Then handle Other Recommendations
        if (item.other_recommended_features && item.other_recommended_features.length > 0) {
          myDiv.append($("<div style=\"clear: both; height: 20px; margin: 10px\"/>"));
          var _myId3 = item.name.replace(/[^a-zA-Z_]/g, "") + "_additional_steps";
          var _Template3 = "<table id=\"SHORTNAME_table\" class=\"dvexpand table table-chrome\"><colgroup><col span=\"1\" style=\"width: 30px\" /><col span=\"1\" style=\"width: 200px\" /><col span=\"1\" style=\"width: 120px\" /><col span=\"1\" /></colgroup><thead><tr><th colspan=\"NUMCOLUMNS\" class=\"expands\"  onclick='$(\"#SHORTNAME-tbody\").toggle(); if($(\"#SHORTNAME_arrow\").attr(\"class\")==\"icon-chevron-right\"){$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-down\"); $(\"#SHORTNAME_table\").addClass(\"expanded\"); $(\"#SHORTNAME_table\").removeClass(\"table-chrome\");  $(\"#SHORTNAME_table\").find(\"th\").css(\"border-top\",\"1px solid darkgray\");  }else{$(\"#SHORTNAME_arrow\").attr(\"class\",\"icon-chevron-right\");  $(\"#SHORTNAME_table\").removeClass(\"expanded\");  $(\"#SHORTNAME_table\").addClass(\"table-chrome\"); } return false;'><h2 style=\"display: inline; line-height: 1.5em; font-size: 1.2em; margin-top: 0; margin-bottom: 0;\"><a href=\"#\" class=\"dropdowntext\" style=\"color: black;\">&nbsp;&nbsp;<i id=\"SHORTNAME_arrow\" class=\"icon-chevron-right\"></i> TITLE <div style=\"display: inline;\" id=\"SHORTNAME_statusIcon\" /></a></h2> <label style=\"display: inline;\" for=\"SHORTNAME_statusIcon\">DESCRIPTION</label> <div id=\"SHORTNAME_status\" style=\"float: right\"></div></th></tr></thead><tbody style=\"display: none\" id=\"SHORTNAME-tbody\"></tbody></table>";
          myDiv.append(_Template3.replace(/SHORTNAME/g, _myId3).replace("DESCRIPTION", item.other_recommended_text || "").replace("TITLE", "Other Recommendations").replace("NUMCOLUMNS", "4"));
          for (var _i14 = 0; _i14 < item.other_recommended_features.length; _i14++) {
            var myRow = generateFeatureRow(item.other_recommended_features[_i14]);
            // console.log("Working on feature", item.other_recommended_features[i], "got", myRow.html())
            (0, _find["default"])(myDiv).call(myDiv, "#" + _myId3 + "-tbody").append(myRow);
          }
        }
        // $(".pageGuideActions").remove()
        // $(".page_guide_detail:visible").append(myDiv)
        window.dvtest = myDiv;
        $el.html(myDiv);
        $(".launch-button").tooltip({
          html: true
        });
        if ((0, _find["default"])(_context9 = $("#" + item.name.replace(/[^a-zA-Z_]/g, "") + "_prereqs_table")).call(_context9, "a").length > 0) {
          var _context10;
          (0, _find["default"])(_context10 = $("#" + item.name.replace(/[^a-zA-Z_]/g, "") + "_prereqs_table")).call(_context10, "a").first().click();
        }
        if ((0, _find["default"])(_context11 = $("#" + item.name.replace(/[^a-zA-Z_]/g, "") + "_next_steps_table")).call(_context11, "a").length > 0) {
          var _context12;
          (0, _find["default"])(_context12 = $("#" + item.name.replace(/[^a-zA-Z_]/g, "") + "_next_steps_table")).call(_context12, "a").first().click();
        }
        if ((0, _find["default"])(_context13 = $("#" + item.name.replace(/[^a-zA-Z_]/g, "") + "_usecases_table")).call(_context13, "a").length > 0) {
          var _context14;
          (0, _find["default"])(_context14 = $("#" + item.name.replace(/[^a-zA-Z_]/g, "") + "_usecases_table")).call(_context14, "a").first().click();
        }
      }
      function generateFeatureRow(rowdata, localStorageActions) {
        // console.log("Hi There", rowdata, PageGuides['Features'][ rowdata ])
        var icon = $("<span>");
        var name = $("<a>");
        var tour = $("<span>");
        var description = $("<span>");
        if (PageGuides['Features'][rowdata].type == "pageguide") {
          name.attr("data-id", PageGuides['Features'][rowdata].id).click(function (evt) {
            if ($("#" + $(evt.target).attr("data-id")).is(":visible")) {
              $("#" + $(evt.target).attr("data-id")).click();
            } else {
              for (var _PageGuide2 in PageGuides['PageGuides']) {
                if (PageGuides['PageGuides'][_PageGuide2]['items'][$(evt.target).attr("data-id")]) {
                  localStorage['sse-pageGuide-bottomlevel'] = $(evt.target).attr("data-id");
                  $("div[data-id=" + _PageGuide2 + "]").click();
                }
              }
            }
            return true;
          }).text(PageGuides['Features'][rowdata].name);
        }
        if (PageGuides['Features'][rowdata].tour && PageGuides['Features'][rowdata].tour.length > 1) {
          tour = name.clone();
          tour.text("Launch w/ tour");
          tour.click(function () {
            takeAction(rowdata, localStorageActions, null, true);
          });
        }
        if (localStorageActions) {
          name.click(function () {
            takeAction(PageGuides['Features'][rowdata].link, localStorageActions);
          });
        } else {
          name.click(function () {
            takeAction(PageGuides['Features'][rowdata].link);
          });
        }
        if (PageGuides['Features'][rowdata].iconObj) {
          icon.html(PageGuides['Features'][rowdata].iconObj);
        } else if (PageGuides['Features'][rowdata].type == "link") {
          icon.html('<i style="font-size: 18pt;" class="icon-external" />');
        } else if (PageGuides['Features'][rowdata].type == "dashboard") {
          icon.html('<i style="font-size: 18pt;" class="icon-dashboard" />');
        } else if (PageGuides['Features'][rowdata].type == "pageguide") {
          icon.html('<i style="font-size: 18pt;" class="icon-distributed-environment" />');
        }
        if (PageGuides['Features'][rowdata].name && PageGuides['Features'][rowdata].name != "") {
          name.text(_("Launch") + ": " + PageGuides['Features'][rowdata].name);
        }
        if (PageGuides['Features'][rowdata].description && PageGuides['Features'][rowdata].description != "") {
          description.text(PageGuides['Features'][rowdata].description);
        }
        if (PageGuides['Features'][rowdata].type == "setup") {
          name = PageGuides['Features'][rowdata].linkObj;
        }
        return $("<tr>").append($("<td>").append(icon), $("<td>").append(name), $("<td>").append(tour), $("<td>").append(description));

        // if( PageGuides['Features'][ rowdata ].type=="setup"){
        //     name = $("<span>")
        //     icon.html( PageGuides['Features'][ rowdata ]['iconObj'] )
        //     name.html( PageGuides['Features'][ rowdata ]['displayObj'] )
        //     separator = $("<br/>")
        // }else if(PageGuides['Features'][rowdata].type == "link"){
        //     icon.html( '<i style="font-size: 18pt;" class="icon-external" />')
        //     name.click(function(){ location.href = PageGuides['Features'][rowdata].link}).text(PageGuides['Features'][rowdata].name)
        // }else if(PageGuides['Features'][rowdata].type == "dashboard"){
        //     icon.html( '<i style="font-size: 18pt;" class="icon-dashboard" />')
        //     name.click(function(){ location.href = PageGuides['Features'][rowdata].link}).text(PageGuides['Features'][rowdata].name)
        // }else if(PageGuides['Features'][rowdata].type == "pageguide"){
        //     icon.html( '<i style="font-size: 18pt;" class="icon-distributed-environment" />')
        //     name.attr("data-id", PageGuides['Features'][rowdata].id).click(function(evt){
        //         if($("#" + $(evt.target).attr("data-id")).is(":visible")){
        //             $("#" + $(evt.target).attr("data-id")).click()
        //         }else{
        //             for(let PageGuide in PageGuides['PageGuides']){
        //                 if(PageGuides['PageGuides'][PageGuide]['items'][$(evt.target).attr("data-id")]){
        //                     localStorage['sse-pageGuide-bottomlevel'] = $(evt.target).attr("data-id")
        //                     $("div[data-id=" + PageGuide + "]").click()
        //                 }
        //             }
        //         }
        //         return true;
        //     }).text(PageGuides['Features'][rowdata].name)
        // }else{
        //     icon.html( "N/A" )
        //     description.html( description.replace(/^: /, "") )
        // }
        // if(buttonVersion){
        //     return $("<tr>").append(
        //         $("<td>").append(name.prepend(_("Launch"), separator)),
        //         $("<td>").append(tour),
        //         $("<td>").append(description)
        //     )
        // }else{
        //     if(name.text() == ""){

        //         return $("<tr>").append(
        //             $("<td>").append(icon),
        //             $("<td>").append(tour),
        //             $("<td>").append(description ))
        //     }else{

        //         return $("<tr>").append(
        //             $("<td>").append(icon),
        //             $("<td>").append(tour),
        //             $("<td>").append(name, separator, description )
        //         )

        //     }

        // }
      }
      function sendTelemetryForIntro(action, category, guide, overrides) {
        var record = {
          "status": "selectedIntroUseCase",
          "action": action,
          "category": category,
          "guide": guide
        };
        if (overrides) {
          for (var _i16 = 0; _i16 < overrides.length; _i16++) {
            var _context15;
            if ((0, _indexOf["default"])(_context15 = overrides[_i16].param).call(_context15, "usecase") >= 0) {
              record.uc = overrides[_i16].value;
            }
          }
        }
        Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__("./package/src/components/data/sendTelemetry.js")]; (function (Telemetry) {
          fetch($C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config').then(function (response) {
            return response.json();
          }).then(function (appConfig) {
            for (var _i18 = 0; _i18 < appConfig.length; _i18++) {
              if (appConfig[_i18].param == "demoMode" && appConfig[_i18].value == "true") {
                record.demoMode = true;
              }
            }
            Telemetry.SendTelemetryToSplunk("PageStatus", record);
          });
        }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}).catch(__webpack_require__.oe);
      }
      function populateBookmarkNames() {
        // once we create the new collection we define the schema
        $.ajax({
          url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/config/bookmark_names',
          type: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': window.getFormKey()
          },
          data: {
            "field.name": "string",
            "field.referenceName": "string",
            "field.description": "string"
          },
          success: function success(data) {
            // now that the schema is defined add in the content for the bookmarks

            var bookmark_names_content = [{
              name: "Waiting on Data",
              referenceName: "needData",
              description: "Waiting on Data indicates that you have plans to ingest the data, but it's not currently on-board."
            }, {
              name: "Deployment Issues",
              referenceName: "issuesDeploying",
              description: "Deployment Issues indicates that you've attempted to start building out the detection, but ran into a problem with scale, field extractions... anything except for too many alerts. Content with this status isn't ready for use yet."
            }, {
              name: "Needs Tuning",
              referenceName: "needsTuning",
              description: "Needs Tuning indicates that the content has successfully been implemented, but too many alerts are being sent. Detections in this category are generally in use despite the noise."
            }, {
              name: "Ready for Deployment",
              referenceName: "inQueue",
              description: "Ready for Deployment indicates that the data in ingested, and it's now time to start implementing this detection."
            }];
            for (var _i20 = 0; _i20 < bookmark_names_content.length; _i20++) {
              $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names',
                type: 'POST',
                headers: {
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-Splunk-Form-Key': window.getFormKey()
                },
                contentType: 'application/json',
                data: (0, _stringify["default"])({
                  name: bookmark_names_content[_i20]["name"],
                  referenceName: bookmark_names_content[_i20]["referenceName"],
                  description: bookmark_names_content[_i20]["description"]
                }),
                error: function error(_error) {
                  console.log(_error);
                }
              });
            }
          },
          error: function error(_error2) {
            console.log(_error2);
          }
        });
      }
      // check to see if the kvstore we need is available
      // is there a better api to do this? only one I could find is one that returns xml.
      $.ajax({
        // this first request checks to see if the kvstore is already created
        url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_names',
        type: 'GET',
        contentType: 'application/json',
        success: function success(_success) {
          if (_success.length < 1) {
            populateBookmarkNames();
          }
        },
        error: function error(_error3) {
          // if we get an error checking for the above collection we create a new one
          $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/config',
            type: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'X-Splunk-Form-Key': window.getFormKey()
            },
            data: {
              name: "bookmark_names"
            },
            success: function success(data) {
              populateBookmarkNames();
            },
            error: function error(_error4) {
              console.log("error creating kvstore: {error}");
            }
          });
        }
      });

      // Now let's launch all the setup steps!
      var _loop = function _loop(feature) {
        if (PageGuides['Features'][feature].type == "setup") {
          if (PageGuides['Features'][feature].id == "data_inventory_complete") {
            PageGuides['Features'][feature].deferral = $.Deferred();
            var deferral = $.Deferred();
            (0, _setTimeout2["default"])(function () {
              if (typeof healthChecks.CheckIfDataInventoryComplete != "undefined") {
                healthChecks.CheckIfDataInventoryComplete(deferral);
              }
            }, 1000);
            $.when(deferral).then(function (returnObj) {
              if (returnObj["dsc_checked"] == 0 || returnObj["dscs_with_products"] == 0) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-error" style="font-size: 18pt; color: red">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration not yet started.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="data_inventory"> ' + _("Configure on the Data Inventory page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="data_inventory"> ' + _("Configure on the Data Inventory page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else if (returnObj["products_custom_needsReview"] > 0) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-warning" style="font-size: 18pt; color: orange">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration started but not yet complete.")), $('<a target="_blank" rel="noopener noreferrer" rel="noopener noreferrer"  class="external drilldown-link" href="data_inventory"> ' + _("Configure on the Data Inventory page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" rel="noopener noreferrer" class="external drilldown-link" href="data_inventory"> ' + _("Configure on the Data Inventory page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else if (returnObj["products_default_checked"] == returnObj["products_default_total"]) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: green">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Successfully Configured!")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="data_inventory"> ' + _("Re-visit configuration on the Data Inventory page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="data_inventory"> ' + _("Configure on the Data Inventory page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-question-circle" style="font-size: 18pt; color: gray">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration status mixed.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="data_inventory"> ' + _("Re-visit configuration on the Data Inventory page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="data_inventory"> ' + _("Configure on the Data Inventory page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              }
            });
          } else if (PageGuides['Features'][feature].id == "check_enabled_content_sources") {
            PageGuides['Features'][feature].deferral = $.Deferred();
            var _deferral = $.Deferred();
            (0, _setTimeout2["default"])(function () {
              if (typeof healthChecks.CheckToSeeIfContentSourcesAreEnabled != "undefined") {
                healthChecks.CheckToSeeIfContentSourcesAreEnabled(_deferral);
              }
            }, 1000);
            $.when(_deferral).then(function (returnObj) {
              // console.log("Got a return from the app thing", returnObj)
              var count = 0;
              var enabled_count = 0;
              for (var app in returnObj) {
                if (returnObj[app]) {
                  enabled_count += 1;
                }
                count += 1;
              }
              if (count == 0) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-warning" style="font-size: 18pt; color: orange">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Error checking, but very likely to be correct.")));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure enabled sources.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              } else if (count == enabled_count) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: green">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(Splunk.util.sprintf(_("Success. %s out of %s content sources are enabled."), enabled_count, count)), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure enabled sources.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                }));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure enabled sources.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              } else {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: green">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Success. All are enabled.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure enabled sources.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                }));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure enabled sources.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              }
            });
          } else if (PageGuides['Features'][feature].id == "search_mapping_complete") {
            PageGuides['Features'][feature].deferral = $.Deferred();
            var _deferral2 = $.Deferred();
            (0, _setTimeout2["default"])(function () {
              if (typeof healthChecks.CheckIfSearchesAreMapped != "undefined") {
                healthChecks.CheckIfSearchesAreMapped(_deferral2);
              }
            }, 1000);
            $.when(_deferral2).then(function (returnObj) {
              if (returnObj["num_bookmarked_content"] == 0) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-error" style="font-size: 18pt; color: red">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration not yet started.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Configure on the Manage Bookmarks page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Configure on the Manage Bookmarks page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else if (returnObj["num_bookmarked_content"] >= 1 && returnObj["num_enabled_content"] == 0) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-warning" style="font-size: 18pt; color: orange">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration started but not yet complete.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Configure on the Manage Bookmarks page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Configure on the Manage Bookmarks page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else if (returnObj["num_bookmarked_content"] > 0 && returnObj["num_enabled_content"] < 20) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: orange">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration started, but not many searches are marked as enabled.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Configure on the Manage Bookmarks page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Configure on the Manage Bookmarks page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else if (returnObj["num_bookmarked_content"] > 0 && returnObj["num_enabled_content"] >= 20) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: green">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Successfully Configured!")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Re-visit configuration on the Manage Bookmarks page.") + '</a>'));
                PageGuides['Features'][feature].deferral.resolve();
              } else {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-question-circle" style="font-size: 18pt; color: gray">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration status mixed.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Re-visit configuration on the Manage Bookmarks page.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="bookmarked_content"> ' + _("Configure on the Manage Bookmarks page.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              }
            });
          } else if (PageGuides['Features'][feature].id == "check_es_integration") {
            PageGuides['Features'][feature].deferral = $.Deferred();
            var _deferral3 = $.Deferred();
            (0, _setTimeout2["default"])(function () {
              if (typeof healthChecks.checkForMITREInLogReview != "undefined") {
                healthChecks.checkForMITREInLogReview(_deferral3);
              }
            }, 1000);
            $.when(_deferral3).then(function (status) {
              if (status == "errored") {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-warning" style="font-size: 18pt; color: orange">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Splunk Enterprise Security not present.")));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure ES Integration.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              } else if (status == "needed") {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-error" style="font-size: 18pt; color: red">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Configuration not yet complete.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure ES Integration.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                }));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure ES Integration.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              } else if (status == "notneeded") {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: green">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Successfully Configured!")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure ES Integration.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                }));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure ES Integration.") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              }
            });
          } else if (PageGuides['Features'][feature].id == "check_data_availability") {
            PageGuides['Features'][feature].deferral = $.Deferred();
            var _deferral4 = $.Deferred();
            (0, _setTimeout2["default"])(function () {
              if (typeof healthChecks.CheckWhatScheduledSearchesScheduled != "undefined") {
                healthChecks.CheckWhatScheduledSearchesScheduled(_deferral4);
              }
            }, 1000);
            $.when(_deferral4).then(function (searches) {
              if (searches["Data_Availability_Model"]) {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: green">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("The Machine Learning Baseline search is scheduled!")));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure Scheduled Searches") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              } else {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-error" style="font-size: 18pt; color: red">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("The Machine Learning Baseline search is not scheduled")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure Scheduled Searches") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                }));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="#"> ' + _("Configure Scheduled Searches") + '</a>').click(function () {
                  document.getElementById('launchConfigurationLink').click();
                  return false;
                });
                PageGuides['Features'][feature].deferral.resolve();
              }
            });
          } else if (PageGuides['Features'][feature].id == "check_mltk_present") {
            PageGuides['Features'][feature].deferral = $.Deferred();
            var _deferral5 = $.Deferred();
            (0, _setTimeout2["default"])(function () {
              if (typeof healthChecks.CheckWhatAppsArePresent != "undefined") {
                healthChecks.CheckWhatAppsArePresent(_deferral5);
              }
            }, 1000);
            $.when(_deferral5).then(function (apps) {
              // console.log("MLTKCHECK: Got some apps!", apps)
              var status = "not installed";
              for (var app in apps) {
                // console.log("MLTKCHECK: Looking at ", app, apps[app], app=="sse-setup-app-mltk", apps[app].status == "installed", apps[app].version.match(/^([5-9]|4.[2-9])/))
                if (app == "sse-setup-app-mltk" && apps[app].status == "installed") {
                  if (apps[app].version.match(/^([5-9]|4.[2-9])/)) {
                    status = "installed";
                  } else {
                    status = "out of date";
                  }
                }
              }
              if (status == "out of date") {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-warning" style="font-size: 18pt; color: orange">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Splunk Machine Learning Toolkit present, but is too old to use for SSE Functionality.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="https://splunkbase.splunk.com/app/2890/"> ' + _("Download via Splunkbase.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="https://splunkbase.splunk.com/app/2890/"> ' + _("Download via Splunkbase.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else if (status == "not installed") {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-error" style="font-size: 18pt; color: red">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Splunk Machine Learning Toolkit not present.")), $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="https://splunkbase.splunk.com/app/2890/"> ' + _("Download via Splunkbase.") + '</a>'));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="https://splunkbase.splunk.com/app/2890/"> ' + _("Download via Splunkbase.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              } else if (status == "installed") {
                PageGuides['Features'][feature].iconObj = $('<i class="icon-check-circle" style="font-size: 18pt; color: green">');
                PageGuides['Features'][feature].displayObj = $("<span></span>").append($("<span>").text(_("Splunk Machine Learning Toolkit is present!")));
                PageGuides['Features'][feature].linkObj = $('<a target="_blank" rel="noopener noreferrer" class="external drilldown-link" href="https://splunkbase.splunk.com/app/2890/"> ' + _("Download via Splunkbase.") + '</a>');
                PageGuides['Features'][feature].deferral.resolve();
              }
            });
          }
        }
      };
      for (var feature in PageGuides['Features']) {
        _loop(feature);
      }
    });
  }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}).catch(__webpack_require__.oe);
  (0, _find["default"])(_context16 = $("#sse_doc_link")).call(_context16, "a").attr("href", window.makeHelpLinkURL("Splunk_Security_Essentials", "home.sse", "latest"));
});

/***/ }),

/***/ "./package/src/properties.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Object$defineProperty = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property.js");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.properties = properties;
function properties() {
  return fetch($C['SPLUNKD_PATH'] + '/services/apps/local/Splunk_Security_Essentials?output_mode=json').then(function (response) {
    return response.json();
  }).then(function (props) {
    return props;
  });
}

/***/ }),

/***/ "splunk.util":
/***/ (function(module, exports) {

module.exports = splunk.util;

/***/ })

/******/ });