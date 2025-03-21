(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["models"],{

/***/ "./node_modules/@splunk/react-toast-notifications/ToastConstants.js":
/***/ (function(module, exports) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (t, r) => {
            /******/ for (var o in r) {
                /******/ if (e.o(r, o) && !e.o(t, o)) {
                    /******/ Object.defineProperty(t, o, {
                        enumerable: true,
                        get: r[o]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var t = {};
    e.r(t);
    /* harmony export */    e.d(t, {
        /* harmony export */ TOAST_POSITIONS: () => /* binding */ o
        /* harmony export */ ,
        TOAST_TYPES: () => /* binding */ r
        /* harmony export */    });
    var r = {
        INFO: "info",
        WARNING: "warning",
        SUCCESS: "success",
        ERROR: "error"
    };
    var o = {
        TOP_LEFT: "top-left",
        TOP_CENTER: "top-center",
        TOP_RIGHT: "top-right",
        BOTTOM_LEFT: "bottom-left",
        BOTTOM_CENTER: "bottom-center",
        BOTTOM_RIGHT: "bottom-right"
    };
    module.exports = t;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/ToastMessages.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/    var e = {
        /***/ 679: 
        /***/ (e, t, n) => {
            // EXPORTS
            n.d(t, {
                default: () => /* binding */ V
            });
            // EXTERNAL MODULE: external "react"
                        var r = n(497);
            var o =  n.n(r);
            // EXTERNAL MODULE: external "prop-types"
                        var i = n(23);
            var a =  n.n(i);
            // CONCATENATED MODULE: external "@splunk/react-icons/enterprise/Close"
            const s = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Close.js");
            var u =  n.n(s);
            // CONCATENATED MODULE: external "@splunk/ui-utils/keyboard"
            const c = __webpack_require__("./node_modules/@splunk/ui-utils/keyboard.js");
            // CONCATENATED MODULE: external "@splunk/react-icons/enterprise/InfoCircle"
            const l = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/InfoCircle.js");
            var f =  n.n(l);
            // CONCATENATED MODULE: external "@splunk/react-icons/enterprise/Success"
            const p = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Success.js");
            var d =  n.n(p);
            // CONCATENATED MODULE: external "@splunk/react-icons/enterprise/Error"
            const v = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Error.js");
            var b =  n.n(v);
            // CONCATENATED MODULE: external "@splunk/react-icons/enterprise/Warning"
            const m = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Warning.js");
            var y =  n.n(m);
            // CONCATENATED MODULE: external "@splunk/themes/useSplunkTheme"
            const T = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/useSplunkTheme.js");
            var h =  n.n(T);
            // EXTERNAL MODULE: ./src/ToastConstants.js
                        var O = n(535);
            // EXTERNAL MODULE: ./src/ToastStyles.js + 3 modules
                        var C = n(874);
            // CONCATENATED MODULE: ./src/ToastIcon.jsx
            var g = "24px";
            var S = "26px";
 // this icon renders smaller than intended
                        var x = function e(t) {
                switch (t) {
                  case O.TOAST_TYPES.SUCCESS:
                    
                    return o().createElement(d(), {
                        size: g
                    });

                  case O.TOAST_TYPES.INFO:
                    
                    return o().createElement(f(), {
                        size: g
                    });

                  case O.TOAST_TYPES.ERROR:
                    
                    return o().createElement(b(), {
                        size: S
                    });

                  case O.TOAST_TYPES.WARNING:
                    
                    return o().createElement(y(), {
                        size: g
                    });

                  default:
                    
                    return o().createElement(f(), {
                        size: g
                    });
                }
            };
            var E = function e(t) {
                var n = t.children;
                
                return o().createElement("svg", {
                    viewBox: "0 0 24 24",
                    width: g,
                    height: g,
                    xmlns: "http://www.w3.org/2000/svg"
                }, n);
            };
            E.propTypes = {
                children: a().node.isRequired
            };
            var w = function e(t) {
                switch (t) {
                  case O.TOAST_TYPES.SUCCESS:
                    
                    return o().createElement(E, null,  o().createElement("path", {
                        fillRule: "evenodd",
                        d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.8738 8.62627C17.2643 9.01679 17.2643 9.64996 16.8738 10.0405L11.5853 15.329C10.9996 15.9147 10.0499 15.9148 9.46414 15.3291L7.12637 12.9921C6.73579 12.6016 6.7357 11.9684 7.12616 11.5779C7.51663 11.1873 8.1498 11.1872 8.54038 11.5776L10.5246 13.5613L15.4596 8.62627C15.8501 8.23574 16.4833 8.23574 16.8738 8.62627Z",
                        fill: "currentColor"
                    }));

                  case O.TOAST_TYPES.INFO:
                    
                    return o().createElement(E, null,  o().createElement("path", {
                        fillRule: "evenodd",
                        d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11.0001 16.0094V11.9999C11.0001 11.4476 11.4478 10.9999 12.0001 10.9999C12.5524 10.9999 13.0001 11.4476 13.0001 11.9999V16.0094C13.0001 16.5617 12.5524 17.0094 12.0001 17.0094C11.4478 17.0094 11.0001 16.5617 11.0001 16.0094ZM12 6.9999C12.6628 6.9999 13.2 7.53716 13.2 8.1999C13.2 8.86264 12.6628 9.3999 12 9.3999C11.3373 9.3999 10.8 8.86264 10.8 8.1999C10.8 7.53716 11.3373 6.9999 12 6.9999Z",
                        fill: "currentColor"
                    }));

                  case O.TOAST_TYPES.ERROR:
                    
                    return o().createElement(E, null,  o().createElement("path", {
                        fillRule: "evenodd",
                        d: "M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM11.0001 7.9906V12.0001C11.0001 12.5524 11.4478 13.0001 12.0001 13.0001C12.5524 13.0001 13.0001 12.5524 13.0001 12.0001V7.9906C13.0001 7.43832 12.5524 6.9906 12.0001 6.9906C11.4478 6.9906 11.0001 7.43832 11.0001 7.9906ZM12.0001 17.0001C12.6628 17.0001 13.2001 16.4628 13.2001 15.8001C13.2001 15.1374 12.6628 14.6001 12.0001 14.6001C11.3373 14.6001 10.8001 15.1374 10.8001 15.8001C10.8001 16.4628 11.3373 17.0001 12.0001 17.0001Z",
                        fill: "currentColor"
                    }));

                  case O.TOAST_TYPES.WARNING:
                    
                    return o().createElement(E, null,  o().createElement("path", {
                        fillRule: "evenodd",
                        d: "M10.6827 2.82369C11.2341 1.72544 12.7659 1.72544 13.3173 2.82369L21.8338 19.7867C22.3412 20.7973 21.6254 22 20.5165 22H3.48349C2.37462 22 1.65878 20.7973 2.16616 19.7867L10.6827 2.82369ZM11.0002 13.6618V11.0133C11.0002 10.461 11.4479 10.0133 12.0002 10.0133C12.5525 10.0133 13.0002 10.461 13.0002 11.0133V13.6618C13.0002 14.2141 12.5525 14.6618 12.0002 14.6618C11.4479 14.6618 11.0002 14.2141 11.0002 13.6618ZM13.2002 16.9347C13.2002 17.5975 12.6629 18.1347 12.0002 18.1347C11.3374 18.1347 10.8002 17.5975 10.8002 16.9347C10.8002 16.272 11.3374 15.7347 12.0002 15.7347C12.6629 15.7347 13.2002 16.272 13.2002 16.9347Z",
                        fill: "currentColor"
                    }));

                  default:
                    
                    return o().createElement(E, null,  o().createElement("path", {
                        fillRule: "evenodd",
                        d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11.0001 16.0094V11.9999C11.0001 11.4476 11.4478 10.9999 12.0001 10.9999C12.5524 10.9999 13.0001 11.4476 13.0001 11.9999V16.0094C13.0001 16.5617 12.5524 17.0094 12.0001 17.0094C11.4478 17.0094 11.0001 16.5617 11.0001 16.0094ZM12 6.9999C12.6628 6.9999 13.2 7.53716 13.2 8.1999C13.2 8.86264 12.6628 9.3999 12 9.3999C11.3373 9.3999 10.8 8.86264 10.8 8.1999C10.8 7.53716 11.3373 6.9999 12 6.9999Z",
                        fill: "currentColor"
                    }));
                }
            };
            var R = function e(t) {
                var n = t.type;
                var r = h()(), i = r.family;
                var a = i === "prisma" ? w(n) : x(n);
                
                return o().createElement(C /* StyledIcon */ .xL, {
                    role: "img",
                    "data-test": n,
                    "aria-label": "".concat(n, " toast icon"),
                    $type: n
                }, a);
            };
            R.propTypes = {
                type: a().string.isRequired
            };
            /* harmony default export */            const P = R;
            // CONCATENATED MODULE: ./src/Toast.jsx
            function k(e) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    k = function e(t) {
                        return typeof t;
                    };
                } else {
                    k = function e(t) {
                        return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                    };
                }
                return k(e);
            }
            function A() {
                A = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) {
                            if (Object.prototype.hasOwnProperty.call(n, r)) {
                                e[r] = n[r];
                            }
                        }
                    }
                    return e;
                };
                return A.apply(this, arguments);
            }
            function _(e, t) {
                if (e == null) return {};
                var n = I(e, t);
                var r, o;
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    for (o = 0; o < i.length; o++) {
                        r = i[o];
                        if (t.indexOf(r) >= 0) continue;
                        if (!Object.prototype.propertyIsEnumerable.call(e, r)) continue;
                        n[r] = e[r];
                    }
                }
                return n;
            }
            function I(e, t) {
                if (e == null) return {};
                var n = {};
                var r = Object.keys(e);
                var o, i;
                for (i = 0; i < r.length; i++) {
                    o = r[i];
                    if (t.indexOf(o) >= 0) continue;
                    n[o] = e[o];
                }
                return n;
            }
            function j(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function q(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || false;
                    r.configurable = true;
                    if ("value" in r) r.writable = true;
                    Object.defineProperty(e, r.key, r);
                }
            }
            function M(e, t, n) {
                if (t) q(e.prototype, t);
                if (n) q(e, n);
                return e;
            }
            function N(e, t) {
                if (typeof t !== "function" && t !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: true,
                        configurable: true
                    }
                });
                if (t) Y(e, t);
            }
            function Y(e, t) {
                Y = Object.setPrototypeOf || function e(t, n) {
                    t.__proto__ = n;
                    return t;
                };
                return Y(e, t);
            }
            function D(e) {
                var t = z();
                return function n() {
                    var r = H(e), o;
                    if (t) {
                        var i = H(this).constructor;
                        o = Reflect.construct(r, arguments, i);
                    } else {
                        o = r.apply(this, arguments);
                    }
                    return L(this, o);
                };
            }
            function L(e, t) {
                if (t && (k(t) === "object" || typeof t === "function")) {
                    return t;
                }
                return F(e);
            }
            function F(e) {
                if (e === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return e;
            }
            function z() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], (function() {})));
                    return true;
                } catch (e) {
                    return false;
                }
            }
            function H(e) {
                H = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
                    return t.__proto__ || Object.getPrototypeOf(t);
                };
                return H(e);
            }
            function B(e, t, n) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: n,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = n;
                }
                return e;
            }
            /* eslint-disable jsx-a11y/no-noninteractive-tabindex */            var Z = 5e3;
            /**
 * The Toaster component leverages the function returned from `makeCreateToast(Toaster)`
 * which we refer to as `createToast`. This function expects a set of props as parameters
 * which are defined as follows:
 */            var W =  function(e) {
                N(n, e);
                var t = D(n);
                function n() {
                    var e;
                    j(this, n);
                    for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) {
                        o[i] = arguments[i];
                    }
                    e = t.call.apply(t, [ this ].concat(o));
                    B(F(e), "onMouseEnter", (function() {
                        if (e.props.autoDismiss) {
                            e.pause();
                        }
                    }));
                    B(F(e), "onMouseLeave", (function() {
                        if (e.props.autoDismiss) {
                            e.resume();
                        }
                    }));
                    B(F(e), "onActionClick", (function(t) {
                        e.fulfillActionCallback(t);
                    }));
                    B(F(e), "handleCloseKeyDown", (function(t) {
                        if (t.keyCode === (0, c.keycode)("enter")) {
                            e.requestHide();
                        }
                    }));
                    B(F(e), "handleActionButtonKeyDown", (function(t) {
                        if (t.keyCode === (0, c.keycode)("enter")) {
                            e.fulfillActionCallback(t);
                        }
                    }));
                    B(F(e), "isValidToastType", (function(e) {
                        switch (e) {
                          case O.TOAST_TYPES.SUCCESS:
                          case O.TOAST_TYPES.INFO:
                          case O.TOAST_TYPES.ERROR:
                          case O.TOAST_TYPES.WARNING:
                            return true;

                          default:
                            return false;
                        }
                    }));
                    B(F(e), "Timer", (function(t, n) {
                        var r = n;
                        var o = n;
                        e.pause = function() {
                            window.clearTimeout(e.timerId);
                            o -= new Date - r;
                        };
                        e.resume = function() {
                            r = new Date;
                            return window.setTimeout((function() {
                                t();
                            }), o);
                        };
                        return e.resume();
                    }));
                    B(F(e), "requestHide", (function() {
                        var t = e.props.onRequestHide;
                        t();
                    }));
                    return e;
                }
                M(n, [ {
                    key: "componentDidMount",
                    value: function e() {
                        if (this.props.autoDismiss) {
                            var t = this.props.timeout || Z;
                            this.timerId = this.Timer(this.requestHide, t);
                        }
                    }
                }, {
                    key: "componentWillUnmount",
                    value: function e() {
                        if (this.props.autoDismiss && this.timerId) {
                            window.clearTimeout(this.timerId);
                        }
                    }
                }, {
                    key: "fulfillActionCallback",
                    value: function e(t) {
                        var n = this.props, r = n.dismissOnActionClick, o = n.action;
                        o.callback(t);
                        if (r) {
                            this.requestHide();
                        }
                    }
                }, {
                    key: "render",
                    value: function e() {
                        var t = this.props, n = t.title, r = t.type, i = t.action, a = t.message, s = t.onFocus, c = t.onBlur, l = t.onRequestHide, f = _(t, [ "title", "type", "action", "message", "onFocus", "onBlur", "onRequestHide" ]);
                        if (false) {}
                        var p =  o().createElement(P, {
                            type: r
                        });
                        var d =  o().createElement(C /* StyledMessage */ .g5, {
                            "data-test": "toast-message",
                            "aria-label": a,
                            lang: navigator.language || navigator.userLanguage,
                            title: a
                        }, a);
                        var v = i ?  o().createElement(C /* StyledActionButton */ .lj, A({
                            "data-test": "toast-action",
                            tabIndex: 0,
                            onClick: this.onActionClick,
                            onFocus: s,
                            onBlur: c,
                            onKeyDown: this.handleActionButtonKeyDown,
                            type: "button"
                        }, i.props), i.label) : null;
 // TODO: The close icon is incorrect for Prisma SUI-2388
                        // Must be absolute positioned to ensure proper tabIndex order.
                                                var b =  o().createElement("div", {
                            role: "button",
                            "data-test": "toast-dismiss",
                            style: {
                                position: "absolute",
                                top: "13px",
                                right: "12px",
                                color: "#818d99",
                                cursor: "pointer"
                            },
                            tabIndex: 0,
                            focusable: "true",
                            onClick: this.requestHide,
                            onFocus: s,
                            onBlur: c,
                            onKeyDown: this.handleCloseKeyDown
                        },  o().createElement(u(), {
                            size: "12px"
                        }));
 // Placed in-line beneath absolutely positioned dismiss button to ensure
                        // proper wrapping of action button.
                                                var m =  o().createElement("div", {
                            style: // if title is defined, use the absolute position to align
                            // with the icon above.
                            n ? {
                                position: "absolute",
                                top: "13px",
                                right: "12px",
                                color: "#818d99",
                                cursor: "pointer"
                            } : {
                                display: "inline-block",
                                marginTop: "5px",
                                marginRight: "12px",
                                float: "right",
                                color: "#818d99",
                                cursor: "pointer"
                            }
                        },  o().createElement(u(), {
                            size: "12px"
                        }));
                        var y =  o().createElement(C /* StyledToastContent */ .OF, {
                            role: "group",
                            "aria-label": "Toast content"
                        }, n &&  o().createElement(C /* StyledMessageTitle */ .TL, {
                            "data-test": "toast-message-title",
                            $type: r
                        }, n), d, " ", m, " ", v, " ", b);
                        
                        return o().createElement(C /* StyledToast */ .f5, A({
                            role: "group",
                            "data-test": "toast",
                            "aria-label": "Toast container",
                            onMouseEnter: this.onMouseEnter,
                            onMouseLeave: this.onMouseLeave,
                            $type: r
                        }, f), p, y);
                    }
                } ]);
                return n;
            }(o().Component);
            W.propTypes = {
                /**
   * The message to be shown in the toast.
   */
                message: a().string.isRequired,
                /**
   * The type of toast. These types are pre-defined in `ToastConstants.js` as `TOAST_TYPES`.
   * If an unknown toast type is sent to `ToastMessages`, it will default to `TOAST_TYPES.INFO` and show warnings to the developer.
   * We do not enforce `TOAST_TYPES` in props because if multiple apps use the same `ToastMessages` container where
   * one of these versions have a newer version `Toaster` with perhaps new types, we do not want to show nothing,
   * but rather show the message and default to `TOAST_TYPES.INFO`.
   */
                type: a().string.isRequired,
                /**
   * Whether the toast message should automatically dismiss after 5 seconds.
   */
                autoDismiss: a().bool,
                /**
   * Whether the toast message should automatically dismiss after an action is clicked.
   */
                dismissOnActionClick: a().bool,
                /**
   * An actionable button that has a required label and callback function.
   * `props` can optionally be added to pass any additional props to the button.
   */
                action: a().shape({
                    label: a().oneOfType([ a().string, a().node ]).isRequired,
                    callback: a().func.isRequired,
                    props: a().object
                }),
                /**
   * The message title to be shown in the toast.
   */
                title: a().string,
                /**
   * Internally controlled props
   */
                /**
   * Time (ms) before the toast will dismiss
   */
                /** @private */
                timeout: a().number,
                /**
   * Callback for when a toast is dismissed
   */
                /** @private */
                onRequestHide: a().func,
                /**
   * Callback for when a toast focused
   */
                /** @private */
                onFocus: a().func,
                /**
   * Callback for when a toast unfocused
   */
                /** @private */
                onBlur: a().func
            };
            W.defaultProps = {
                title: "",
                autoDismiss: true,
                dismissOnActionClick: true,
                onRequestHide: function e() {},
                onFocus: function e() {},
                onBlur: function e() {}
            };
            /* harmony default export */            const V = W;
            /***/        },
        /***/ 535: 
        /***/ (e, t, n) => {
            /* harmony export */ n.d(t, {
                /* harmony export */ TOAST_POSITIONS: () => /* binding */ o
                /* harmony export */ ,
                TOAST_TYPES: () => /* binding */ r
                /* harmony export */            });
            var r = {
                INFO: "info",
                WARNING: "warning",
                SUCCESS: "success",
                ERROR: "error"
            };
            var o = {
                TOP_LEFT: "top-left",
                TOP_CENTER: "top-center",
                TOP_RIGHT: "top-right",
                BOTTOM_LEFT: "bottom-left",
                BOTTOM_CENTER: "bottom-center",
                BOTTOM_RIGHT: "bottom-right"
            };
            /***/        },
        /***/ 874: 
        /***/ (e, t, n) => {
            // EXPORTS
            n.d(t, {
                lj: () => /* binding */ N,
                ye: () => /* binding */ Y,
                xL: () => /* binding */ q,
                ZW: () => /* binding */ Z,
                g5: () => /* binding */ j,
                TL: () => /* binding */ W,
                f5: () => /* binding */ I,
                OF: () => /* binding */ M
            });
            // CONCATENATED MODULE: external "styled-components"
            const r = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");
            var o =  n.n(r);
            // CONCATENATED MODULE: external "react-flip-move"
            const i = __webpack_require__("./node_modules/react-flip-move/dist/react-flip-move.es.js");
            var a =  n.n(i);
            // CONCATENATED MODULE: external "@splunk/themes"
            const s = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/index.js");
            // EXTERNAL MODULE: ./src/ToastConstants.js
                        var u = n(535);
            // CONCATENATED MODULE: ./src/ToastStyles.js
            var c, l, f;
            function p() {
                var e = A([ "\n            color: ", ";\n        " ]);
                p = function t() {
                    return e;
                };
                return e;
            }
            function d() {
                var e = A([ "\n    ", ";\n    ", ";\n    font-size: 14px;\n    margin-left: 12px;\n    margin-right: 12px;\n    ", "\n    box-sizing: content-box;\n" ]);
                d = function t() {
                    return e;
                };
                return e;
            }
            function v() {
                var e = A([ "\n    ", "\n    position: fixed;\n    z-index: ", ";\n    ", ";\n" ]);
                v = function t() {
                    return e;
                };
                return e;
            }
            function b() {
                var e = A([ "\n    bottom: 16px;\n    left: 50%;\n    margin-left: calc(-1 * ", " / 2);\n" ]);
                b = function t() {
                    return e;
                };
                return e;
            }
            function m() {
                var e = A([ "\n    bottom: 16px;\n    right: 16px;\n" ]);
                m = function t() {
                    return e;
                };
                return e;
            }
            function y() {
                var e = A([ "\n    bottom: 16px;\n    left: 16px;\n" ]);
                y = function t() {
                    return e;
                };
                return e;
            }
            function T() {
                var e = A([ "\n    top: 16px;\n    left: 16px;\n" ]);
                T = function t() {
                    return e;
                };
                return e;
            }
            function h() {
                var e = A([ "\n    top: 16px;\n    right: 16px;\n" ]);
                h = function t() {
                    return e;
                };
                return e;
            }
            function O() {
                var e = A([ "\n    top: 16px;\n    left: 50%;\n    margin-left: calc(-1 * ", " / 2);\n" ]);
                O = function t() {
                    return e;
                };
                return e;
            }
            function C() {
                var e = A([ "\n    width: ", ";\n\n    & > div:not(:nth-last-child(1)) {\n        margin-bottom: 16px;\n    }\n" ]);
                C = function t() {
                    return e;
                };
                return e;
            }
            function g() {
                var e = A([ "\n    display: block;\n    position: relative;\n    float: right;\n    margin: 3px 12px 12px 0;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    width: auto;\n    color: ", ";\n    padding: 1px 0 2px;\n    border: none;\n    font-size: 14px;\n    line-height: 20px;\n    cursor: pointer;\n    max-width: calc(100% - 24px);\n    background-color: ", ";\n    box-sizing: content-box;\n" ]);
                g = function t() {
                    return e;
                };
                return e;
            }
            function S() {
                var e = A([ "\n    overflow-y: auto;\n    overflow-x: hidden;\n    margin-left: 47px;\n    width: 453px;\n    padding-top: 8px;\n    box-sizing: content-box;\n" ]);
                S = function t() {
                    return e;
                };
                return e;
            }
            function x() {
                var e = A([ "\n            border-radius: ", " 0 0 ", ";\n        " ]);
                x = function t() {
                    return e;
                };
                return e;
            }
            function E() {
                var e = A([ "\n    width: 36px;\n    height: 100%;\n    display: flex;\n    position: absolute;\n    align-items: center;\n    padding-left: 11px;\n    background: ", ";\n    color: ", ";\n    ", "\n    box-sizing: content-box;\n" ]);
                E = function t() {
                    return e;
                };
                return e;
            }
            function w() {
                var e = A([ "\n    display: inline-block;\n    height: 100%;\n    padding-top: 5px;\n    margin-left: 12px;\n    margin-right: 12px;\n    max-width: 404px;\n    hyphens: auto;\n    text-overflow: ellipsis;\n    padding-bottom: ", ";\n    box-sizing: content-box;\n" ]);
                w = function t() {
                    return e;
                };
                return e;
            }
            function R(e, t, n) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: n,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = n;
                }
                return e;
            }
            function P() {
                var e = A([ "\n            border: 1px solid\n                ", ";\n        " ]);
                P = function t() {
                    return e;
                };
                return e;
            }
            function k() {
                var e = A([ "\n    width: ", ";\n    min-height: 46px;\n    position: relative;\n    background-color: ", ";\n    box-shadow: ", ";\n    ", ";\n    border-radius: ", ";\n    box-sizing: content-box;\n" ]);
                k = function t() {
                    return e;
                };
                return e;
            }
            function A(e, t) {
                if (!t) {
                    t = e.slice(0);
                }
                return Object.freeze(Object.defineProperties(e, {
                    raw: {
                        value: Object.freeze(t)
                    }
                }));
            }
            var _ = "500px";
            var I = o().div(k(), _, (0, s.pick)({
                enterprise: s.variables.backgroundColor,
                prisma: s.variables.backgroundColorPopup
            }), (0, s.pick)({
                enterprise: s.variables.overlayShadow,
                prisma: s.variables.embossShadow
            }), (0, s.pick)({
                enterprise: (0, r.css)(P(), (0, s.pickVariant)("$type", (c = {}, R(c, u.TOAST_TYPES.INFO, s.variables.cat1Color), 
                R(c, u.TOAST_TYPES.WARNING, s.variables.warningColor), R(c, u.TOAST_TYPES.SUCCESS, s.variables.successColor), 
                R(c, u.TOAST_TYPES.ERROR, s.variables.errorColor), c)))
            }), s.variables.borderRadius);
            var j = o().div(w(), (function(e) {
                return e.action ? null : "13px";
            }));
            var q = o().div(E(), (0, s.pick)({
                enterprise: (0, s.pickVariant)("$type", (l = {}, R(l, u.TOAST_TYPES.INFO, s.variables.cat1Color), 
                R(l, u.TOAST_TYPES.WARNING, s.variables.warningColor), R(l, u.TOAST_TYPES.SUCCESS, s.variables.successColor), 
                R(l, u.TOAST_TYPES.ERROR, s.variables.errorColor), l)),
                prisma: (0, s.pickVariant)("$type", (f = {}, R(f, u.TOAST_TYPES.INFO, s.variables.contentColorActive), 
                R(f, u.TOAST_TYPES.WARNING, s.variables.accentColorWarning), R(f, u.TOAST_TYPES.SUCCESS, s.variables.accentColorPositive), 
                R(f, u.TOAST_TYPES.ERROR, s.variables.accentColorNegative), f))
            }), (0, s.pick)({
                enterprise: s.variables.white,
                prisma: s.variables.contentColorInverted
            }), (0, s.pick)({
                prisma: (0, r.css)(x(), s.variables.borderRadius, s.variables.borderRadius)
            }));
            var M = o().div(S());
            var N = o().button(g(), s.variables.linkColor, (0, s.pick)({
                enterprise: s.variables.backgroundColor,
                prisma: "transparent"
            }));
            var Y = o()(a())(C(), _);
            var D = (0, r.css)(O(), _);
            var L = (0, r.css)(h());
            var F = (0, r.css)(T());
            var z = (0, r.css)(y());
            var H = (0, r.css)(m());
            var B = (0, r.css)(b(), _);
            var Z = o().div(v(), s.mixins.reset("block"), s.variables.zindexToastMessages, (function(e) {
                switch (e.position) {
                  case u.TOAST_POSITIONS.TOP_LEFT:
                    return F;

                  case u.TOAST_POSITIONS.TOP_CENTER:
                    return D;

                  case u.TOAST_POSITIONS.TOP_RIGHT:
                    return L;

                  case u.TOAST_POSITIONS.BOTTOM_LEFT:
                    return z;

                  case u.TOAST_POSITIONS.BOTTOM_CENTER:
                    return B;

                  case u.TOAST_POSITIONS.BOTTOM_RIGHT:
                    return H;

                  default:
                    return D;
                }
            }));
            var W = o().p(d(), s.mixins.reset("block"), s.mixins.typography("title5"), (0, s.pick)({
                prisma: (0, r.css)(p(), (0, s.pickVariant)("$type", {
                    info: s.variables.contentColorActive,
                    warning: s.variables.accentColorWarning,
                    error: s.variables.accentColorNegative,
                    success: s.variables.accentColorPositive
                }))
            }));
            /***/        },
        /***/ 23: 
        /***/ e => {
            e.exports = __webpack_require__("./node_modules/prop-types/index.js");
            /***/        },
        /***/ 497: 
        /***/ e => {
            e.exports = __webpack_require__("./node_modules/react/index.js");
            /***/
            /******/        }
    };
    /************************************************************************/
    /******/ // The module cache
    /******/    var t = {};
    /******/
    /******/ // The require function
    /******/    function n(r) {
        /******/ // Check if module is in cache
        /******/ var o = t[r];
        /******/        if (o !== undefined) {
            /******/ return o.exports;
            /******/        }
        /******/ // Create a new module (and put it into the cache)
        /******/        var i = t[r] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
            /******/        };
        /******/
        /******/ // Execute the module function
        /******/        e[r](i, i.exports, n);
        /******/
        /******/ // Return the exports of the module
        /******/        return i.exports;
        /******/    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ n.n = e => {
            /******/ var t = e && e.__esModule ? 
            /******/ () => e["default"]
            /******/ : () => e
            /******/;
            n.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ n.d = (e, t) => {
            /******/ for (var r in t) {
                /******/ if (n.o(t, r) && !n.o(e, r)) {
                    /******/ Object.defineProperty(e, r, {
                        enumerable: true,
                        get: t[r]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ n.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
        (() => {
        // ESM COMPAT FLAG
        n.r(r);
        // EXPORTS
                n.d(r, {
            default: () => /* binding */ G
        });
        // EXTERNAL MODULE: external "react"
                var e = n(497);
        var t =  n.n(e);
        // EXTERNAL MODULE: external "prop-types"
                var o = n(23);
        var i =  n.n(o);
        // CONCATENATED MODULE: external "lodash/defer"
        const a = __webpack_require__("./node_modules/lodash/defer.js");
        var s =  n.n(a);
        // CONCATENATED MODULE: external "lodash/isNil"
        const u = __webpack_require__("./node_modules/lodash/isNil.js");
        var c =  n.n(u);
        // CONCATENATED MODULE: external "lodash/values"
        const l = __webpack_require__("./node_modules/lodash/values.js");
        var f =  n.n(l);
        // CONCATENATED MODULE: external "@splunk/react-ui/Layer"
        const p = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/Layer.js");
        var d =  n.n(p);
        // CONCATENATED MODULE: external "@splunk/react-toast-notifications/Toaster"
        const v = __webpack_require__("./node_modules/@splunk/react-toast-notifications/Toaster.js");
        var b =  n.n(v);
        // CONCATENATED MODULE: external "@splunk/ui-utils/focus"
        const m = __webpack_require__("./node_modules/@splunk/ui-utils/focus.js");
        // EXTERNAL MODULE: ./src/Toast.jsx + 8 modules
                var y = n(679);
        // EXTERNAL MODULE: ./src/ToastStyles.js + 3 modules
                var T = n(874);
        // EXTERNAL MODULE: ./src/ToastConstants.js
                var h = n(535);
        // CONCATENATED MODULE: ./src/ToastMessagesInternal.jsx
        function O(e) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                O = function e(t) {
                    return typeof t;
                };
            } else {
                O = function e(t) {
                    return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                };
            }
            return O(e);
        }
        function C() {
            C = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n) {
                        if (Object.prototype.hasOwnProperty.call(n, r)) {
                            e[r] = n[r];
                        }
                    }
                }
                return e;
            };
            return C.apply(this, arguments);
        }
        function g(e, t) {
            if (e == null) return {};
            var n = S(e, t);
            var r, o;
            if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (o = 0; o < i.length; o++) {
                    r = i[o];
                    if (t.indexOf(r) >= 0) continue;
                    if (!Object.prototype.propertyIsEnumerable.call(e, r)) continue;
                    n[r] = e[r];
                }
            }
            return n;
        }
        function S(e, t) {
            if (e == null) return {};
            var n = {};
            var r = Object.keys(e);
            var o, i;
            for (i = 0; i < r.length; i++) {
                o = r[i];
                if (t.indexOf(o) >= 0) continue;
                n[o] = e[o];
            }
            return n;
        }
        function x(e) {
            return P(e) || R(e) || w(e) || E();
        }
        function E() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function w(e, t) {
            if (!e) return;
            if (typeof e === "string") return k(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            if (n === "Object" && e.constructor) n = e.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(e);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return k(e, t);
        }
        function R(e) {
            if (typeof Symbol !== "undefined" && Symbol.iterator in Object(e)) return Array.from(e);
        }
        function P(e) {
            if (Array.isArray(e)) return k(e);
        }
        function k(e, t) {
            if (t == null || t > e.length) t = e.length;
            for (var n = 0, r = new Array(t); n < t; n++) {
                r[n] = e[n];
            }
            return r;
        }
        function A(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function _(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || false;
                r.configurable = true;
                if ("value" in r) r.writable = true;
                Object.defineProperty(e, r.key, r);
            }
        }
        function I(e, t, n) {
            if (t) _(e.prototype, t);
            if (n) _(e, n);
            return e;
        }
        function j(e, t) {
            if (typeof t !== "function" && t !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    writable: true,
                    configurable: true
                }
            });
            if (t) q(e, t);
        }
        function q(e, t) {
            q = Object.setPrototypeOf || function e(t, n) {
                t.__proto__ = n;
                return t;
            };
            return q(e, t);
        }
        function M(e) {
            var t = D();
            return function n() {
                var r = L(e), o;
                if (t) {
                    var i = L(this).constructor;
                    o = Reflect.construct(r, arguments, i);
                } else {
                    o = r.apply(this, arguments);
                }
                return N(this, o);
            };
        }
        function N(e, t) {
            if (t && (O(t) === "object" || typeof t === "function")) {
                return t;
            }
            return Y(e);
        }
        function Y(e) {
            if (e === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return e;
        }
        function D() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], (function() {})));
                return true;
            } catch (e) {
                return false;
            }
        }
        function L(e) {
            L = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
                return t.__proto__ || Object.getPrototypeOf(t);
            };
            return L(e);
        }
        function F(e, t, n) {
            if (t in e) {
                Object.defineProperty(e, t, {
                    value: n,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                e[t] = n;
            }
            return e;
        }
        var z = 200;
        var H = {
            from: {
                transform: "translateY(-100%)",
                opacity: "0"
            },
            to: {
                transform: "translateY(0)",
                opacity: ""
            }
        };
        var B = {
            from: {
                transform: "translateY(100%)",
                opacity: "0"
            },
            to: {
                transform: "translateY(0)",
                opacity: ""
            }
        };
        /**
 * An internal component responsible for displaying and managing toast messages.
 */        var Z =  function(e) {
            j(r, e);
            var n = M(r);
            function r(e) {
                var o;
                A(this, r);
                o = n.call(this, e);
                F(Y(o), "handleModalMount", (function(e) {
                    o.el = e;
                    if (e) {
                        s()(m.takeFocus, e, "container");
                    }
                }));
                F(Y(o), "handleModalKeyDown", (function(e) {
                    (0, m.handleTab)(o.el, e);
                }));
                F(Y(o), "handleToastCreate", (function(e) {
                    var t = o.props.position;
                    var n = t.indexOf("top") !== -1;
                    o.setState((function(t) {
                        if (n) {
                            return {
                                toasts: [ e ].concat(x(t.toasts))
                            };
                        }
                        return {
                            toasts: [].concat(x(t.toasts), [ e ])
                        };
                    }));
                }));
                F(Y(o), "handleToastFocus", (function(e) {
                    o.setState((function(t) {
                        var n = t.toasts.filter((function(t) {
                            return t.id === e;
                        }));
                        if (n.length > 0 && t.focusedToast !== n[0]) {
                            return {
                                focusedToast: n[0]
                            };
                        }
                        return null;
                    }));
                }));
                F(Y(o), "handleRequestHide", (function(e) {
                    o.setState((function(t) {
                        var n = t.focusedToast || e;
                        return {
                            toasts: t.toasts.filter((function(e) {
                                return n.id !== e.id;
                            })),
                            focusedToast: null
                        };
                    }));
                }));
                F(Y(o), "renderLayer", (function() {
                    var e = o.props, n = e.position, r = e.animationDuration;
                    var i = n.indexOf("top") !== -1;
                    var a = i ? H : B;
                    
                    return t().createElement(T /* StyledLayer */ .ZW, {
                        ref: o.handleModalMount,
                        position: n,
                        "data-test": "toast-messages",
                        role: "group",
                        "aria-label": "Toast messages container",
                        tabIndex: -1,
                        onKeyDown: o.handleModalKeyDown
                    },  t().createElement(T /* StyledFlipMove */ .ye, {
                        enterAnimation: a,
                        appearAnimation: a,
                        leaveAnimation: "fade",
                        duration: c()(r) ? z : r,
                        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        verticalAlignment: i ? "top" : "bottom"
                    }, o.state.toasts.map((function(e) {
                        var n = e.id, r = e.title, i = e.message, a = e.type, s = e.autoDismiss, u = e.dismissOnActionClick, c = e.action, l = e.timeOut, f = g(e, [ "id", "title", "message", "type", "autoDismiss", "dismissOnActionClick", "action", "timeOut" ]);
                        
                        return t().createElement(y["default"], C({
                            key: n,
                            title: r,
                            message: i,
                            type: a,
                            autoDismiss: s,
                            dismissOnActionClick: u,
                            action: c,
                            timeout: l,
                            onRequestHide: function t() {
                                return o.handleRequestHide(e);
                            },
                            onFocus: function e() {
                                return o.handleToastFocus(n);
                            },
                            onBlur: function e() {
                                return o.handleToastBlur();
                            }
                        }, f));
                    }))));
                }));
                o.state = {
                    toasts: e.toasts || [],
                    focusedToast: null
                };
                return o;
            }
            I(r, [ {
                key: "componentDidMount",
                value: function e() {
                    b().addCreateListener(this.handleToastCreate);
                }
            }, {
                key: "componentWillUnmount",
                value: function e() {
                    this.setState({
                        toasts: [],
                        focusedToast: null
                    });
                    b().removeCreateListener(this.handleToastCreate);
                }
            }, {
                key: "handleToastBlur",
                value: function e() {
                    if (this.state.focusedToast) {
                        this.setState({
                            focusedToast: null
                        });
                    }
                }
            }, {
                key: "render",
                value: function e() {
                    var n = this;
                    var r = this.props.position;
                    var o = r.indexOf("top") !== -1;
                    var i = o ? 0 : Math.max(this.state.toasts.length - 1, 0);
                    var a = this.state.toasts.length > 0;
                    return this.props.escapeToCloseToasts ?  t().createElement(d(), {
                        closeReasons: [ "escapeKey" ],
                        render: this.renderLayer,
                        onRequestClose: function e() {
                            return n.handleRequestHide(n.state.toasts[i]);
                        },
                        open: a
                    }, a && this.renderLayer()) : this.renderLayer();
                }
            } ]);
            return r;
        }(t().Component);
        Z.propTypes = {
            /**
   * The static position on the screen that toasts will display.
   */
            /** @private */
            position: i().oneOf(f()(h.TOAST_POSITIONS)).isRequired,
            /**
   * Duration (ms) that a toast will take to animate (in and out).
   */
            /** @private */
            animationDuration: i().number,
            /**
   * An array of all currently active Toast objects.
   */
            /** @private */
            toasts: i().arrayOf(i().object),
            /**
   * Whether or not clicking the escape key will close the most recent
   * toast message.
   */
            /** @private */
            escapeToCloseToasts: i().bool
        };
        Z.defaultProps = {
            escapeToCloseToasts: true
        };
        /* harmony default export */        const W = Z;
        // CONCATENATED MODULE: ./src/ToastMessages.jsx
        /**
 * This component is a singleton that is responsible for displaying posted toast notifications.
 * Because it is a singleton, only create one instance within an app.
 */
        var V = function e(n) {
            
            return t().createElement(W, {
                position: n.position
            });
        };
        V.propTypes = {
            /**
   * The static position on the screen that toasts will display.
   */
            position: i().oneOf([ "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right" ])
        };
        V.defaultProps = {
            position: "top-center"
        };
        /* harmony default export */        const G = V;
    })();
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/Toaster.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (t, r) => {
            /******/ for (var n in r) {
                /******/ if (e.o(r, n) && !e.o(t, n)) {
                    /******/ Object.defineProperty(t, n, {
                        enumerable: true,
                        get: r[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var t = {};
    // ESM COMPAT FLAG
        e.r(t);
    // EXPORTS
        e.d(t, {
        default: () => /* binding */ S,
        makeCreateToast: () => /* binding */ w
    });
    // CONCATENATED MODULE: external "@splunk/ui-utils/id"
    const r = __webpack_require__("./node_modules/@splunk/ui-utils/id.js");
    // CONCATENATED MODULE: external "events"
    const n = __webpack_require__("./node_modules/events/events.js");
    // CONCATENATED MODULE: ./src/Toaster.js
    function o(e) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            o = function e(t) {
                return typeof t;
            };
        } else {
            o = function e(t) {
                return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
            };
        }
        return o(e);
    }
    function i(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            if (t) n = n.filter((function(t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
            }));
            r.push.apply(r, n);
        }
        return r;
    }
    function u(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t] != null ? arguments[t] : {};
            if (t % 2) {
                i(Object(r), true).forEach((function(t) {
                    O(e, t, r[t]);
                }));
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
            } else {
                i(Object(r)).forEach((function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                }));
            }
        }
        return e;
    }
    function a(e, t) {
        if (!(e instanceof t)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function c(e, t) {
        for (var r = 0; r < t.length; r++) {
            var n = t[r];
            n.enumerable = n.enumerable || false;
            n.configurable = true;
            if ("value" in n) n.writable = true;
            Object.defineProperty(e, n.key, n);
        }
    }
    function f(e, t, r) {
        if (t) c(e.prototype, t);
        if (r) c(e, r);
        return e;
    }
    function l(e, t) {
        if (typeof t !== "function" && t !== null) {
            throw new TypeError("Super expression must either be null or a function");
        }
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                writable: true,
                configurable: true
            }
        });
        if (t) s(e, t);
    }
    function s(e, t) {
        s = Object.setPrototypeOf || function e(t, r) {
            t.__proto__ = r;
            return t;
        };
        return s(e, t);
    }
    function p(e) {
        var t = v();
        return function r() {
            var n = h(e), o;
            if (t) {
                var i = h(this).constructor;
                o = Reflect.construct(n, arguments, i);
            } else {
                o = n.apply(this, arguments);
            }
            return y(this, o);
        };
    }
    function y(e, t) {
        if (t && (o(t) === "object" || typeof t === "function")) {
            return t;
        }
        return b(e);
    }
    function b(e) {
        if (e === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return e;
    }
    function v() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
            Date.prototype.toString.call(Reflect.construct(Date, [], (function() {})));
            return true;
        } catch (e) {
            return false;
        }
    }
    function h(e) {
        h = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
            return t.__proto__ || Object.getPrototypeOf(t);
        };
        return h(e);
    }
    function O(e, t, r) {
        if (t in e) {
            Object.defineProperty(e, t, {
                value: r,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            e[t] = r;
        }
        return e;
    }
    var m = "toast_create";
    var d = 5e3;
    var j = [];
    var g = false;
    /**
 * Callback function used to bind a Toaster instance to the create function
 * which can then be passed props as parameters to create toasts.
 */    var w = function e(t) {
        return function(e) {
            t.create(e);
        };
    };
    /**
 * The Toaster component is a singleton responsible for validating and
 * publishing received toast payloads from the sender to the ToastMessages
 * component, which listens to the Toaster.
 */    var P =  function(e) {
        l(n, e);
        var t = p(n);
        function n() {
            var e;
            a(this, n);
            for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) {
                o[i] = arguments[i];
            }
            e = t.call.apply(t, [ this ].concat(o));
            O(b(e), "validateToastProps", (function(e) {
                if (!e.message) {
                    return "No toast message";
                }
                if (!e.type) {
                    return "No toast type";
                }
                if (e.action) {
                    if (!e.action.label) {
                        return "Toast with action has no label";
                    }
                    if (!e.action.callback) {
                        return "Toast with action has no callback";
                    }
                }
                return null;
            }));
            return e;
        }
        f(n, [ {
            key: "create",
            value: function e(t) {
                var n = this.validateToastProps(t);
                if (n) {
                    // eslint-disable-next-line no-console
                    console.warn("Cannot create toast: ".concat(n));
                    return;
                }
                var o = u(u({}, t), {}, {
                    id: (0, r.createGUID)(),
                    timeOut: t.timeout || d
                });
                this.emitCreate(o);
            }
        }, {
            key: "emitCreate",
            value: function e(t) {
                if (g) {
                    this.emit(m, t);
                } else {
                    j.push(t);
                }
            }
        }, {
            key: "addCreateListener",
            value: function e(t) {
                var r = this;
                g = true;
                this.addListener(m, t);
                j.forEach((function(e) {
                    r.emitCreate(e);
                }));
                j = [];
            }
        }, {
            key: "removeCreateListener",
            value: function e(t) {
                g = false;
                this.removeListener(m, t);
            }
        } ]);
        return n;
    }(n.EventEmitter);
    /* harmony default export */    const S = new P;
    module.exports = t;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGEnterprise.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var i in t) {
                /******/ if (e.o(t, i) && !e.o(r, i)) {
                    /******/ Object.defineProperty(r, i, {
                        enumerable: true,
                        get: t[i]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ m
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var i =  e.n(t);
    // CONCATENATED MODULE: external "prop-types"
    const n = __webpack_require__("./node_modules/prop-types/index.js");
    var o =  e.n(n);
    // CONCATENATED MODULE: external "lodash/isUndefined"
    const a = __webpack_require__("./node_modules/lodash/isUndefined.js");
    var l =  e.n(a);
    // CONCATENATED MODULE: external "lodash/isString"
    const d = __webpack_require__("./node_modules/lodash/isString.js");
    var s =  e.n(d);
    // CONCATENATED MODULE: external "styled-components"
    const c = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");
    var p =  e.n(c);
    // CONCATENATED MODULE: ./src/SVGEnterprise.tsx
    function u() {
        u = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var i in t) {
                    if (Object.prototype.hasOwnProperty.call(t, i)) {
                        e[i] = t[i];
                    }
                }
            }
            return e;
        };
        return u.apply(this, arguments);
    }
    function v(e, r) {
        if (e == null) return {};
        var t = f(e, r);
        var i, n;
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            for (n = 0; n < o.length; n++) {
                i = o[n];
                if (r.indexOf(i) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(e, i)) continue;
                t[i] = e[i];
            }
        }
        return t;
    }
    function f(e, r) {
        if (e == null) return {};
        var t = {};
        var i = Object.keys(e);
        var n, o;
        for (o = 0; o < i.length; o++) {
            n = i[o];
            if (r.indexOf(n) >= 0) continue;
            t[n] = e[n];
        }
        return t;
    }
    var x = p().svg.withConfig({
        displayName: "SVGEnterprise__InlineSVG",
        componentId: "sc-9jxj7k-0"
    })([ "display:inline-block;flex:0 0 auto;overflow:visible;vertical-align:middle;" ]);
    var h = p().svg.withConfig({
        displayName: "SVGEnterprise__BlockSVG",
        componentId: "sc-9jxj7k-1"
    })([ "display:block;flex:0 0 auto;margin:0 auto;overflow:visible;" ]);
    var y = /-?\d.?\d* -?\d+.?\d* \d+.?\d* \d+.?\d*/;
    var b = {
        children: o().node,
        height: o().oneOfType([ o().number, o().string ]),
        hideDefaultTooltip: o().bool,
        inline: o().bool,
        screenReaderText: o().oneOfType([ o().string, o().oneOf([ "null" ]) ]),
        size: o().oneOfType([ o().number, o().string ]),
        width: o().oneOfType([ o().number, o().string ]),
        viewBox: o().string.isRequired,
        preserveAspectRatio: o().oneOf([ "none", "xMinYMin", "xMidYMin", "xMaxYMin", "xMinYMid", "xMidYMid", "xMaxYMid", "xMinYMax", "xMidYMax", "xMaxYMax" ])
    };
    function g(e) {
        var r = e.children, t = e.height, n = e.hideDefaultTooltip, o = n === void 0 ? false : n, a = e.inline, d = a === void 0 ? true : a, c = e.preserveAspectRatio, p = c === void 0 ? "xMidYMid" : c, f = e.screenReaderText, y = e.size, b = y === void 0 ? .75 : y, g = e.viewBox, m = e.width, M = v(e, [ "children", "height", "hideDefaultTooltip", "inline", "preserveAspectRatio", "screenReaderText", "size", "viewBox", "width" ]);
        // @docs-props-type SVGPropsBase
                if (false) {}
        var O = typeof b !== "number" ? parseFloat(b) : b;
        var w = s()(b) ? b.match(/[^\d]+/) : "em";
        var j = parseFloat(g.split(" ")[3]);
        var T = parseFloat(g.split(" ")[2]);
        var S = Math.max(T, j);
        var Y = l()(t) ? j / S * O : t;
        var R = l()(m) ? T / S * O : m;
        var _ = d ? x : h;
        var P = f && !o;
        
        return i().createElement(_, u({
            focusable: "false",
            height: s()(Y) ? Y : "".concat(Y.toFixed(4)).concat(w),
            width: s()(R) ? R : "".concat(R.toFixed(4)).concat(w),
            viewBox: g,
            "aria-label": o ? f !== null && f !== void 0 ? f : undefined : undefined,
            "aria-hidden": !f,
            preserveAspectRatio: p,
            xmlns: "http://www.w3.org/2000/svg"
        }, M), P &&  i().createElement("title", null, f), r);
    }
    g.propTypes = b;
    /* harmony default export */    const m = g;
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGInternal.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ b
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "prop-types"
    const o = __webpack_require__("./node_modules/prop-types/index.js");
    var i =  e.n(o);
    // CONCATENATED MODULE: external "styled-components"
    const a = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");
    var l =  e.n(a);
    // CONCATENATED MODULE: external "@splunk/react-icons/SVGEnterprise"
    const u = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGEnterprise.js");
    var c =  e.n(u);
    // CONCATENATED MODULE: ./src/SVGInternal.tsx
    function p() {
        p = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var n in t) {
                    if (Object.prototype.hasOwnProperty.call(t, n)) {
                        e[n] = t[n];
                    }
                }
            }
            return e;
        };
        return p.apply(this, arguments);
    }
    function f(e, r) {
        if (e == null) return {};
        var t = s(e, r);
        var n, o;
        if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            for (o = 0; o < i.length; o++) {
                n = i[o];
                if (r.indexOf(n) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(e, n)) continue;
                t[n] = e[n];
            }
        }
        return t;
    }
    function s(e, r) {
        if (e == null) return {};
        var t = {};
        var n = Object.keys(e);
        var o, i;
        for (i = 0; i < n.length; i++) {
            o = n[i];
            if (r.indexOf(o) >= 0) continue;
            t[o] = e[o];
        }
        return t;
    }
    var v = l()(c()).withConfig({
        displayName: "SVGInternal__StyledSVG",
        componentId: "ksy9g7-0"
    })([ "circle,ellipse,path,polygon,rect{fill:currentColor;}" ]);
    var y = {
        viewBox: i().string
    };
    function d(e) {
        var r = e.viewBox, t = r === void 0 ? "0 0 1500 1500" : r, o = f(e, [ "viewBox" ]);
        
        return n().createElement(v, p({
            viewBox: t
        }, o));
    }
    d.propTypes = y;
    /* harmony default export */    const b = d;
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Clear.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ i
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "@splunk/ui-utils/i18n"
    const o = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");
    // CONCATENATED MODULE: external "@splunk/react-icons/SVGInternal"
    const a = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGInternal.js");
    var l =  e.n(a);
    // CONCATENATED MODULE: ./src/enterprise/Clear.tsx
    function u() {
        u = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var n in t) {
                    if (Object.prototype.hasOwnProperty.call(t, n)) {
                        e[n] = t[n];
                    }
                }
            }
            return e;
        };
        return u.apply(this, arguments);
    }
    /* eslint-disable max-len */    function i(e) {
        
        return n().createElement(l(), u({
            screenReaderText: (0, o._)("Clear")
        }, e),  n().createElement("path", {
            d: "M918.315 750.645L1500 1332.33 1332.33 1500 750.645 918.315 167.67 1500 0 1332.33l581.685-582.975L0 167.67 167.67 0l582.975 581.685L1332.33 0 1500 167.67"
        }));
    }
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Close.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ l
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "@splunk/ui-utils/i18n"
    const o = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");
    // CONCATENATED MODULE: external "@splunk/react-icons/enterprise/Clear"
    const a = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Clear.js");
    var u =  e.n(a);
    // CONCATENATED MODULE: ./src/enterprise/Close.tsx
    function i() {
        i = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var n in t) {
                    if (Object.prototype.hasOwnProperty.call(t, n)) {
                        e[n] = t[n];
                    }
                }
            }
            return e;
        };
        return i.apply(this, arguments);
    }
    function l(e) {
        
        return n().createElement(u(), i({
            screenReaderText: (0, o._)("Close")
        }, e));
    }
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Error.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ l
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "@splunk/ui-utils/i18n"
    const o = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");
    // CONCATENATED MODULE: external "@splunk/react-icons/SVGInternal"
    const a = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGInternal.js");
    var u =  e.n(a);
    // CONCATENATED MODULE: ./src/enterprise/Error.tsx
    function c() {
        c = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var n in t) {
                    if (Object.prototype.hasOwnProperty.call(t, n)) {
                        e[n] = t[n];
                    }
                }
            }
            return e;
        };
        return c.apply(this, arguments);
    }
    /* eslint-disable max-len */    function l(e) {
        
        return n().createElement(u(), c({
            screenReaderText: (0, o._)("Error")
        }, e, {
            viewBox: "0 0 1375 1500"
        }),  n().createElement("path", {
            d: "M187.5 61.5h1000c103.553 0 187.5 83.947 187.5 187.5v1000c0 103.553-83.947 187.5-187.5 187.5h-1000C83.947 1436.5 0 1352.553 0 1249V249C0 145.447 83.947 61.5 187.5 61.5zm400.79 413.083l32.145 257.167c4.908 39.264 34.086 74.685 69.815 91.187 36.612-16.018 64.87-50.826 69.914-91.187l32.146-257.167C799.18 419.623 759.582 374 703.7 374h-26.8c-55.908 0-95.555 45.033-88.61 100.583zm101.293 644.209c63.283 0 114.584-51.301 114.584-114.584 0-63.282-51.301-114.583-114.584-114.583-63.282 0-114.583 51.3-114.583 114.583s51.3 114.584 114.583 114.584z"
        }));
    }
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/InfoCircle.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ l
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "@splunk/ui-utils/i18n"
    const o = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");
    // CONCATENATED MODULE: external "@splunk/react-icons/SVGInternal"
    const a = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGInternal.js");
    var u =  e.n(a);
    // CONCATENATED MODULE: ./src/enterprise/InfoCircle.tsx
    function i() {
        i = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var n in t) {
                    if (Object.prototype.hasOwnProperty.call(t, n)) {
                        e[n] = t[n];
                    }
                }
            }
            return e;
        };
        return i.apply(this, arguments);
    }
    /* eslint-disable max-len */    function l(e) {
        
        return n().createElement(u(), i({
            screenReaderText: (0, o._)("Info Circle")
        }, e),  n().createElement("path", {
            d: "M843.75 750v-93.75H562.5V750h93.75v281.25H562.5V1125h375v-93.75h-93.75V750zM750 1500C335.786 1500 0 1164.214 0 750S335.786 0 750 0s750 335.786 750 750-335.786 750-750 750zm0-937.5c51.777 0 93.75-41.973 93.75-93.75S801.777 375 750 375s-93.75 41.973-93.75 93.75S698.223 562.5 750 562.5z"
        }));
    }
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Success.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ i
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "@splunk/ui-utils/i18n"
    const o = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");
    // CONCATENATED MODULE: external "@splunk/react-icons/SVGInternal"
    const a = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGInternal.js");
    var u =  e.n(a);
    // CONCATENATED MODULE: ./src/enterprise/Success.tsx
    function l() {
        l = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var n in t) {
                    if (Object.prototype.hasOwnProperty.call(t, n)) {
                        e[n] = t[n];
                    }
                }
            }
            return e;
        };
        return l.apply(this, arguments);
    }
    /* eslint-disable max-len */    function i(e) {
        
        return n().createElement(u(), l({
            screenReaderText: (0, o._)("Success")
        }, e),  n().createElement("path", {
            d: "M750 1500C335.786 1500 0 1164.214 0 750S335.786 0 750 0s750 335.786 750 750-335.786 750-750 750zm-138.327-414.388l511.677-511.677-105.185-105.185L611.53 875.385 453.004 716.573 347.819 821.76l263.854 263.853z"
        }));
    }
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/enterprise/Warning.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* binding */ u
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "@splunk/ui-utils/i18n"
    const o = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");
    // CONCATENATED MODULE: external "@splunk/react-icons/SVGInternal"
    const a = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-icons/SVGInternal.js");
    var l =  e.n(a);
    // CONCATENATED MODULE: ./src/enterprise/Warning.tsx
    function c() {
        c = Object.assign || function(e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var n in t) {
                    if (Object.prototype.hasOwnProperty.call(t, n)) {
                        e[n] = t[n];
                    }
                }
            }
            return e;
        };
        return c.apply(this, arguments);
    }
    /* eslint-disable max-len */    function u(e) {
        
        return n().createElement(l(), c({
            screenReaderText: (0, o._)("Warning"),
            viewBox: "0 0 1500 1313"
        }, e),  n().createElement("path", {
            d: "M.956 1196.326l668.58-1144.89C689.395 17.736 718.71 0 749.916 0c31.207 0 59.577 15.963 80.382 51.436l668.58 1144.89c7.565 12.416-23.642 116.174-77.544 116.174H85.474c-53.902 0-92.083-102.872-84.518-116.174zm643.333-684.743l32.146 257.167c4.908 39.264 34.086 74.685 69.815 91.187 36.612-16.018 64.87-50.826 69.914-91.187l32.146-257.167C855.18 456.623 815.582 411 759.7 411h-26.8c-55.908 0-95.555 45.033-88.61 100.583zm101.294 644.209c63.283 0 114.584-51.301 114.584-114.584 0-63.282-51.301-114.583-114.584-114.583-63.282 0-114.583 51.3-114.583 114.583s51.3 114.584 114.583 114.584z"
        }));
    }
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/EventListener.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = r => {
            /******/ var t = r && r.__esModule ? 
            /******/ () => r["default"]
            /******/ : () => r
            /******/;
            e.d(t, {
                a: t
            });
            /******/            return t;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (r, t) => {
            /******/ for (var n in t) {
                /******/ if (e.o(t, n) && !e.o(r, n)) {
                    /******/ Object.defineProperty(r, n, {
                        enumerable: true,
                        get: t[n]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var r = {};
    // ESM COMPAT FLAG
        e.r(r);
    // EXPORTS
        e.d(r, {
        default: () => /* reexport */ s
    });
    // CONCATENATED MODULE: external "react"
    const t = __webpack_require__("./node_modules/react/index.js");
    var n =  e.n(t);
    // CONCATENATED MODULE: external "prop-types"
    const o = __webpack_require__("./node_modules/prop-types/index.js");
    var a =  e.n(o);
    // CONCATENATED MODULE: external "use-typed-event-listener"
    const l = __webpack_require__("./node_modules/use-typed-event-listener/dist/index.esm.js");
    var u =  e.n(l);
    // CONCATENATED MODULE: ./src/EventListener/EventListener.tsx
    /**
 * This is a private component.
 * Please see the Readme file for more information.
 */
    var i = {
        children: a().node,
        target: a().oneOfType([ a().object, a().string ]),
        eventType: a().any,
        listener: a().func,
        options: a().oneOfType([ a().object, a().bool ])
    };
    function p(e) {
        var r = e.children, t = e.target, o = e.eventType, a = e.listener, l = e.options;
        u()(t, o, a, l);
        
        return n().createElement(n().Fragment, null, r || null);
    }
    p.propTypes = i;
    /* harmony default export */    const s = p;
    // CONCATENATED MODULE: ./src/EventListener/index.ts
    module.exports = r;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/Layer.js":
/***/ (function(module, exports, __webpack_require__) {

/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var e = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/    (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ e.n = t => {
            /******/ var n = t && t.__esModule ? 
            /******/ () => t["default"]
            /******/ : () => t
            /******/;
            e.d(n, {
                a: n
            });
            /******/            return n;
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ e.d = (t, n) => {
            /******/ for (var r in n) {
                /******/ if (e.o(n, r) && !e.o(t, r)) {
                    /******/ Object.defineProperty(t, r, {
                        enumerable: true,
                        get: n[r]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/global */
    /******/    (() => {
        /******/ e.g = function() {
            /******/ if (typeof globalThis === "object") return globalThis;
            /******/            try {
                /******/ return this || new Function("return this")();
                /******/            } catch (e) {
                /******/ if (typeof window === "object") return window;
                /******/            }
            /******/        }();
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ e.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ e.r = e => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(e, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var t = {};
    // ESM COMPAT FLAG
        e.r(t);
    // EXPORTS
        e.d(t, {
        LayerContext: () => /* reexport */ m,
        LayerStackContext: () => /* reexport */ h,
        LayerStackGlobalProvider: () => /* reexport */ k,
        default: () => /* reexport */ F
    });
    // CONCATENATED MODULE: external "react"
    const n = __webpack_require__("./node_modules/react/index.js");
    var r =  e.n(n);
    // CONCATENATED MODULE: external "react-dom"
    const o = __webpack_require__("./node_modules/react-dom/index.js");
    // CONCATENATED MODULE: external "prop-types"
    const i = __webpack_require__("./node_modules/prop-types/index.js");
    var a =  e.n(i);
    // CONCATENATED MODULE: external "lodash/includes"
    const c = __webpack_require__("./node_modules/lodash/includes.js");
    var u =  e.n(c);
    // CONCATENATED MODULE: external "lodash/last"
    const l = __webpack_require__("./node_modules/lodash/last.js");
    var s =  e.n(l);
    // CONCATENATED MODULE: external "lodash/pull"
    const f = __webpack_require__("./node_modules/lodash/pull.js");
    var p =  e.n(f);
    // CONCATENATED MODULE: external "@splunk/ui-utils/keyboard"
    const y = __webpack_require__("./node_modules/@splunk/ui-utils/keyboard.js");
    // CONCATENATED MODULE: external "@splunk/react-ui/EventListener"
    const d = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/EventListener.js");
    var v =  e.n(d);
    // CONCATENATED MODULE: ./src/Layer/LayerStack.tsx
    /**
 * `LayerStackContext` is used to manage the array that `Layer` (and components that
 * depend on it, such as `Modal`) uses to determine the order of open layers.
 * @public
 */
    var h =  r().createContext([]);
    var m =  r().createContext({});
    var b = {
        children: a().node,
        name: a().string,
        scope: a().object,
        separateStackingContexts: a().bool
    };
    /* global global */
    /**
 * A `LayerStackContext` provider that stores a shared layer stack using a global variable.
 * Applications should only use this provider if there's a known need to support multiple
 * instances of this library on the same page.
 */    function k(t) {
        var n = t.children, o = t.name, i = o === void 0 ? "__splunkui_layer_instances__" : o, a = t.scope, c = a === void 0 ? typeof window !== "undefined" ? window : e.g : a, u = t.separateStackingContexts, l = u === void 0 ? false : u;
        if (!c[i]) {
            c[i] = [];
 // eslint-disable-line no-param-reassign
                }
        
        return r().createElement(h.Provider, {
            value: c[i]
        },  r().createElement(m.Provider, {
            value: {
                separateStackingContexts: l
            }
        }, n));
    }
    k.propTypes = b;
    // CONCATENATED MODULE: external "styled-components"
    const w = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");
    var g =  e.n(w);
    // CONCATENATED MODULE: external "@splunk/themes"
    const C = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/index.js");
    // CONCATENATED MODULE: ./src/Layer/LayerStyles.ts
    var S = g().div.withConfig({
        displayName: "LayerStyles__StyledLayer",
        componentId: "ii6psl-0"
    })([ "", "" ], (function(e) {
        var t = e.$separateStackingContexts;
        return t && (0, w.css)([ "isolation:isolate;z-index:", ";" ], C.variables.zindexLayer);
    }));
    // CONCATENATED MODULE: ./src/utils/ssrDocument.ts
    /* eslint-disable @typescript-eslint/no-empty-function */
    var E = {
        body: {
            appendChild: function e() {
                return [];
            }
        },
        addEventListener: function e() {},
        removeEventListener: function e() {},
        activeElement: {
            blur: function e() {},
            nodeName: ""
        },
        querySelector: function e() {
            return null;
        },
        querySelectorAll: function e() {
            return [];
        },
        getElementById: function e() {
            return null;
        },
        createEvent: function e() {
            return {
                initEvent: function e() {}
            };
        },
        createElement: function e() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute: function e() {},
                getElementsByTagName: function e() {
                    return [];
                }
            };
        },
        createElementNS: function e() {
            return {};
        },
        importNode: function e() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function O() {
        var e = typeof document !== "undefined" ? document : E;
        return e;
    }
    // CONCATENATED MODULE: ./src/Layer/Layer.tsx
    function L(e) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            L = function e(t) {
                return typeof t;
            };
        } else {
            L = function e(t) {
                return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
            };
        }
        return L(e);
    }
    function _(e, t) {
        if (!(e instanceof t)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function x(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || false;
            r.configurable = true;
            if ("value" in r) r.writable = true;
            Object.defineProperty(e, r.key, r);
        }
    }
    function P(e, t, n) {
        if (t) x(e.prototype, t);
        if (n) x(e, n);
        return e;
    }
    function j(e, t) {
        if (typeof t !== "function" && t !== null) {
            throw new TypeError("Super expression must either be null or a function");
        }
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                writable: true,
                configurable: true
            }
        });
        if (t) q(e, t);
    }
    function q(e, t) {
        q = Object.setPrototypeOf || function e(t, n) {
            t.__proto__ = n;
            return t;
        };
        return q(e, t);
    }
    function T(e) {
        var t = A();
        return function n() {
            var r = K(e), o;
            if (t) {
                var i = K(this).constructor;
                o = Reflect.construct(r, arguments, i);
            } else {
                o = r.apply(this, arguments);
            }
            return R(this, o);
        };
    }
    function R(e, t) {
        if (t && (L(t) === "object" || typeof t === "function")) {
            return t;
        }
        return D(e);
    }
    function D(e) {
        if (e === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return e;
    }
    function A() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
            Date.prototype.toString.call(Reflect.construct(Date, [], (function() {})));
            return true;
        } catch (e) {
            return false;
        }
    }
    function K(e) {
        K = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
            return t.__proto__ || Object.getPrototypeOf(t);
        };
        return K(e);
    }
    function M(e, t, n) {
        if (t in e) {
            Object.defineProperty(e, t, {
                value: n,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            e[t] = n;
        }
        return e;
    }
    /** @public */    var N = [ "clickAway", "escapeKey" ];
    var W = {
        children: a().node,
        closeReasons: a().arrayOf(a().oneOf(N)),
        onRequestClose: a().func,
        open: a().bool
    };
    var z = {
        closeReasons: N,
        open: false
    };
    var B =  function(e) {
        j(n, e);
        var t = T(n);
        // @docs-props-type LayerPropsBase
        // eslint-disable-next-line react/sort-comp
        // LayerStackContext (an array) keeps track of the current instances of Layer. This is
        // used by Layer#handleKeyDown to determine if the escapeKey event should be handled by
        // the current instance. Only the topmost Layer instance should honor the escapeKey.
        // TODO: enable once this is sorted out within the babel/ts ecosystem
        // declare context: React.ContextType<typeof LayerStackContext>;
                function n(e) {
            var r;
            _(this, n);
            r = t.call(this, e);
            M(D(r), "layerClickEvent", null);
            M(D(r), "handleClickOnLayer", (function(e) {
                var t = e.nativeEvent;
                r.layerClickEvent = t;
            }));
            M(D(r), "handleClickOnWindow", (function(e) {
                var t, n;
                // clicks inside the layer should not be considered clickAways
                                if (!r.props.open || !u()(r.props.closeReasons, "clickAway") || r.layerClickEvent === e) {
                    return;
                }
                (t = (n = r.props).onRequestClose) === null || t === void 0 ? void 0 : t.call(n, {
                    event: e,
                    reason: "clickAway"
                });
            }));
            M(D(r), "handleKeyDownOnWindow", (function(e) {
                if (r.props.open && (0, y.keycode)(e) === "esc" && s()(r.getLayerStack()) === D(r) && u()(r.props.closeReasons, "escapeKey")) {
                    var t, n;
                    (t = (n = r.props).onRequestClose) === null || t === void 0 ? void 0 : t.call(n, {
                        event: e,
                        reason: "escapeKey"
                    });
                }
            }));
            var o = O();
            if (!n.layerContainer) {
                n.layerContainer = o.createElement("div");
                n.layerContainer.setAttribute("data-test", "layer-container");
                o.body.appendChild(n.layerContainer);
            }
            return r;
        }
        P(n, [ {
            key: "componentDidMount",
            value: function e() {
                if (this.props.open) {
                    this.getLayerStack().push(this);
                }
            }
        }, {
            key: "componentDidUpdate",
            value: function e(t) {
                if (!t.open && this.props.open) {
                    this.getLayerStack().push(this);
                } else if (t.open && !this.props.open) {
                    p()(this.getLayerStack(), this);
                }
            }
        }, {
            key: "componentWillUnmount",
            value: function e() {
                p()(this.getLayerStack(), this);
            }
        }, {
            key: "getLayerStack",
            value: function e() {
                return this.context;
            }
        }, {
            key: "render",
            value: function e() {
                var t = this;
                var i = this.props, a = i.children, c = i.open;
                if (c) {
                    var u =  (0, o.createPortal)( r().createElement(m.Consumer, null, (function(e) {
                        var n = e.separateStackingContexts, o = n === void 0 ? false : n;
                        
                        return r().createElement(S, {
                            $separateStackingContexts: o,
                            "data-test": "layer",
                            onMouseDown: t.handleClickOnLayer,
                            onTouchStart: t.handleClickOnLayer
                        }, a);
                    })), n.layerContainer);
                    
                    return r().createElement(r().Fragment, null,  r().createElement(v(), {
                        target: window,
                        eventType: "keydown",
                        listener: this.handleKeyDownOnWindow,
                        key: "eventListenerKeydown"
                    }),  r().createElement(v(), {
                        target: window,
                        eventType: "mousedown",
                        listener: this.handleClickOnWindow,
                        key: "eventListenerMouseDown"
                    }),  r().createElement(v(), {
                        target: window,
                        eventType: "touchstart",
                        listener: this.handleClickOnWindow,
                        key: "eventListenerTouchStart",
                        options: {
                            passive: true
                        }
                    }), u);
                }
                return null;
            }
        } ]);
        return n;
    }(n.Component);
    M(B, "layerContainer", null);
    M(B, "possibleCloseReasons", N);
    M(B, "propTypes", W);
    M(B, "defaultProps", z);
    M(B, "contextType", h);
    /* harmony default export */    const F = B;
    // CONCATENATED MODULE: ./src/Layer/index.ts
    module.exports = t;
    /******/})();

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/SplunkThemeProvider.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SplunkThemeProvider;

var _react = _interopRequireWildcard(__webpack_require__("./node_modules/react/index.js"));

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/** SplunkThemeProvider defaults to `prisma` `dark` `comfortable`, unless the properties have already been set.
 *
 * For example, here the nested `SplunkThemeProvider` defaults to `enterprise` `light`:
 * ```jsx
 * return (
 *     <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
 *         Main part of the page in enterprise-light-comfortable.
 *         <SplunkThemeProvider density="compact">
 *             Part of the page in enterprise-light-compact.
 *         </SplunkThemeProvider>
 *     </SplunkThemeProvider>
 * )
 */
function SplunkThemeProvider(_ref) {
  var family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density,
      additionalThemeProperties = _ref.additionalThemeProperties,
      customizeTheme = _ref.customizeTheme,
      otherProps = _objectWithoutProperties(_ref, ["family", "colorScheme", "density", "additionalThemeProperties", "customizeTheme"]);

  var _ref2 = (0, _react.useContext)(_styledComponents.ThemeContext) || {},
      _ref2$splunkThemeV = _ref2.splunkThemeV1,
      splunkThemeV1 = _ref2$splunkThemeV === void 0 ? {} : _ref2$splunkThemeV;

  var composedTheme = _objectSpread(_objectSpread({}, additionalThemeProperties), {}, {
    splunkThemeV1: {
      family: family || splunkThemeV1.family || 'prisma',
      colorScheme: colorScheme || splunkThemeV1.colorScheme || 'dark',
      density: density || splunkThemeV1.density || 'comfortable',
      customizer: customizeTheme || splunkThemeV1.customizer
    }
  });

  return /*#__PURE__*/_react["default"].createElement(_styledComponents.ThemeProvider, _extends({
    theme: composedTheme
  }, otherProps));
}

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/comfortable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 *
 * @valueSet
 */
var measures = {
  spacingQuarter: '5px',
  spacingHalf: '10px',
  spacing: '20px',
  fontSizeSmall: '12px',
  fontSize: '14px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '32px',
  borderRadius: '3px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/compact.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 * * Larger containers, such as `Card` or `Modal`, use `spacing`.
 * * `spacingHalf` and `spacingQuarter` are primarily for horizontal spacing between smaller elements.
 * * Just because a desired value equals 20, 10, or 5 pixels, does not mean it's appropriate to
 * use spacing variables.
 *
 * @valueSet
 */
var measures = {
  spacingQuarter: '5px',
  spacingHalf: '10px',
  spacing: '20px',
  fontSizeSmall: '12px',
  fontSize: '12px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '28px',
  borderRadius: '3px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/dark.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/light.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dragHandleDark = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA1SURBVHgB7dKhEQAgDAPAhHmwSKZHYtmHVtZVVNTkXS53UeG57yPYazLmrB8o6h8QgPqBOAOboRAPJUGIOAAAAABJRU5ErkJggg=="; // see babel-plugin-base64-png

var dark = {
  backgroundColor: _light["default"].gray20,
  backgroundColorHover: _light["default"].gray30,
  borderColor: _light["default"].gray22,
  borderColorWeak: _light["default"].gray60,
  borderColorStrong: _light["default"].black,
  borderActiveColor: "rgba(225,225,225, 0.5)",
  textColor: _light["default"].white,
  textGray: _light["default"].gray92,
  textDisabledColor: _light["default"].gray45,
  linkColor: _light["default"].accentColorL10,
  linkColorHover: _light["default"].accentColorL20,
  border: "1px solid ".concat(_light["default"].gray22),
  borderDark: "1px solid ".concat(_light["default"].black),
  borderLight: "1px solid ".concat(_light["default"].gray60),
  focusShadowInset: "inset 0 0 1px 1px ".concat(_light["default"].gray25, ", inset 0 0 0 3px ").concat(_light["default"].focusColor),
  draggableBackground: "url('data:image/png;base64,".concat(dragHandleDark, "') 0 0 / 8px 8px repeat")
};
/**
 * ## Syntax colors
 * Syntax colors are used only for code blocks.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#6cd0f0',
  syntaxBrown: '#fccf87',
  syntaxGray: '#b5b5b5',
  syntaxGreen: '#cef06c',
  syntaxOrange: '#f7994a',
  syntaxPink: '#f494e5',
  syntaxPurple: '#c99eff',
  syntaxRed: '#fa94aa',
  syntaxTeal: '#45d4ba'
};
/**
 * ## Interactive borders
 *
 * @borderSet
 */

var bordersInteractive = {
  activeBorder: "".concat(dark.borderActiveColor, " double")
};

var theme = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _light["default"]), dark), syntaxColors), bordersInteractive), {}, {
  borderLightColor: _light["default"].gray60 // @deprecated, SUI-5981

});

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/dark.js"));

var _compact = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/compact.js"));

var _comfortable = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/comfortable.js"));

var _prismaAliases = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/prismaAliases.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createEnterpriseTheme(_ref) {
  var colorScheme = _ref.colorScheme,
      density = _ref.density;
  var cs = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  var d = {
    compact: _compact["default"],
    comfortable: _comfortable["default"]
  }[density];
  var pa = (0, _prismaAliases["default"])({
    colorScheme: colorScheme,
    density: density
  });
  return _objectSpread(_objectSpread(_objectSpread({}, cs), d), pa);
}

var _default = createEnterpriseTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/light.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dragHandle = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA2SURBVHgB7dKhEQAgDAPAhDnxDMAcDIBnT1pZV1FRk3e53EWFc+2P4N3DmLN+oKh/QADqB+IMUKEQD/CeueAAAAAASUVORK5CYII="; // see babel-plugin-base64-pngimport {

/**
 * ## Brand colors
 *
 *  @colorSet
 */

var brandColors = {
  brandColorL50: '#f5fbf5',
  brandColorL40: '#dff2df',
  brandColorL30: '#bee6be',
  brandColorL20: '#9ed99e',
  brandColorL10: '#7ecd7e',
  brandColor: '#5cc05c',
  brandColorD10: '#49b849',
  brandColorD20: '#40a540',
  brandColorD30: '#389038',
  brandColorD40: '#307b30',
  brandColorD50: '#286728'
};
/**
 * ## Grayscale colors
 *
 * @colorSet
 */

var grays = {
  white: '#ffffff',
  gray98: '#f7f8fa',
  gray96: '#f2f4f5',
  gray92: '#e1e6eb',
  gray80: '#c3cbd4',
  gray60: '#818d99',
  gray45: '#5c6773',
  gray30: '#3c444d',
  gray25: '#31373e',
  gray22: '#2b3033',
  gray20: '#171d21',
  black: '#000000'
};
/**
 * ## Accent colors
 *
 * @colorSet
 */

var accentColors = {
  accentColorL50: '#ecf8ff',
  accentColorL40: '#bfe9ff',
  accentColorL30: '#7ed2ff',
  accentColorL20: '#3ebcff',
  accentColorL10: '#00a4fd',
  accentColor: '#007abd',
  accentColorD10: '#006eaa',
  accentColorD20: '#006297',
  accentColorD30: '#005684',
  accentColorD40: '#004a71',
  accentColorD50: '#003d5e'
};
/**
 * ## Error Colors
 *
 * @colorSet
 */

var errorColors = {
  errorColorL50: '#fcedec',
  errorColorL40: '#f8dcd9',
  errorColorL30: '#f1b9b3',
  errorColorL20: '#ea958d',
  errorColorL10: '#e37267',
  errorColor: '#dc4e41',
  errorColorD10: '#c84535',
  errorColorD20: '#b23d30',
  errorColorD30: '#9c3529',
  errorColorD40: '#852d24',
  errorColorD50: '#6f261d'
};
/**
 * ## Alert colors
 *
 * @colorSet
 * */

var alertColors = {
  alertColorL50: '#fef3ec',
  alertColorL40: '#fde6d9',
  alertColorL30: '#facdb3',
  alertColorL20: '#f7b48c',
  alertColorL10: '#f49b66',
  alertColor: '#f1813f',
  alertColorD10: '#da742e',
  alertColorD20: '#c2672a',
  alertColorD30: '#aa5a25',
  alertColorD40: '#914d1f',
  alertColorD50: '#79401a'
};
/**
 * ## Warning colors
 *
 *  @colorSet
 */

var warningColors = {
  warningColorL50: '#fff9eb',
  warningColorL40: '#fef2d7',
  warningColorL30: '#fde5ae',
  warningColorL20: '#fbd886',
  warningColorL10: '#facb5d',
  warningColor: '#f8be34',
  warningColorD10: '#e0ac16',
  warningColorD20: '#c79915',
  warningColorD30: '#ae8613',
  warningColorD40: '#957312',
  warningColorD50: '#7d600f'
};
/**
 * ## Success colors
 *
 * @colorSet
 */

var successColors = {
  successColorL50: '#eef6ee',
  successColorL40: '#ddecdd',
  successColorL30: '#bbd9ba',
  successColorL20: '#98c697',
  successColorL10: '#76b374',
  successColor: '#53a051',
  successColorD10: '#479144',
  successColorD20: '#40813d',
  successColorD30: '#387135',
  successColorD40: '#2f612e',
  successColorD50: '#275126'
};
/**
 * ## Info colors
 *
 *  @colorSet
 */

var infoColors = {
  infoColorL50: '#e5f0f5',
  infoColorL40: '#cce2eb',
  infoColorL30: '#99c5d7',
  infoColorL20: '#66a7c4',
  infoColorL10: '#338ab0',
  infoColor: '#006d9c',
  infoColorD10: '#00577c',
  infoColorD20: '#004c6c',
  infoColorD30: '#00415d',
  infoColorD40: '#00364d',
  infoColorD50: '#002b3e'
};
/**
 * ## Diverging colors
 *
 * @colorSet alphabetical
 */

var divergingColors = {
  diverging1ColorA: '#006d9c',
  diverging1ColorB: '#ec9960',
  diverging2ColorA: '#af575a',
  diverging2ColorB: '#62b3b2',
  diverging3ColorA: '#4fa484',
  diverging3ColorB: '#f8be34',
  diverging4ColorA: '#5a4575',
  diverging4ColorB: '#708794',
  diverging5ColorA: '#294e70',
  diverging5ColorB: '#b6c75a'
};
/**
 * ## Categorical Colors
 *
 * @colorSet alphabetical
 */

var categoricalColors = {
  cat1Color: '#297ba5',
  cat1ColorL: '#78b9d6',
  cat2Color: '#4fa484',
  cat2ColorL: '#74d5c2',
  cat3Color: '#b6c75a',
  cat3ColorL: '#dce6a5',
  cat4Color: '#3c6188',
  cat4ColorL: '#a0b2ca',
  cat5Color: '#ec9960',
  cat5ColorL: '#fac9a7',
  cat6Color: '#a65c7d',
  cat6ColorL: '#d3a7ba',
  cat7Color: '#708794',
  cat7ColorL: '#b2c0c8',
  cat8Color: '#38b8bf',
  cat8ColorL: '#92dde2',
  cat9Color: '#ffde63',
  cat9ColorL: '#ffeeae',
  cat10Color: '#c19975',
  cat10ColorL: '#d7bfab',
  cat11Color: '#5a4575',
  cat11ColorL: '#b7acca',
  cat12Color: '#7ea77b',
  cat12ColorL: '#b2cab0',
  cat13Color: '#576d83',
  cat13ColorL: '#a5b2bf',
  cat14Color: '#d7c6b7',
  cat14ColorL: '#e9ddd4',
  cat15Color: '#339bb2',
  cat15ColorL: '#66c3d0',
  cat16Color: '#236d9b',
  cat16ColorL: '#66a7c2',
  cat17Color: '#e5dc80',
  cat17ColorL: '#f1eab7',
  cat18Color: '#96907f',
  cat18ColorL: '#c1bcb3',
  cat19Color: '#87bc65',
  cat19ColorL: '#b6d7a3',
  cat20Color: '#cf7e60',
  cat20ColorL: '#e1b2a1',
  cat21Color: '#7b5547',
  cat21ColorL: '#dec4ba',
  cat22Color: '#77d6d8',
  cat22ColorL: '#abe6e8',
  cat23Color: '#4a7f2c',
  cat23ColorL: '#91b282',
  cat24Color: '#f589ad',
  cat24ColorL: '#f8b7ce',
  cat25Color: '#6a2c5d',
  cat25ColorL: '#cba3c2',
  cat26Color: '#aaabae',
  cat26ColorL: '#cccdce',
  cat27Color: '#9a7438',
  cat27ColorL: '#c3ab89',
  cat28Color: '#a4d563',
  cat28ColorL: '#c7e6a3',
  cat29Color: '#7672a4',
  cat29ColorL: '#ada9c8',
  cat30Color: '#184b81',
  cat30ColorL: '#a4bbe0'
};
/**
 * ## Usage-based colors
 *
 * @colorSet verbose
 */

var usageColors = {
  textColor: grays.gray30,
  textGray: '#6b7785',
  textDisabledColor: grays.gray80,
  linkColor: accentColors.accentColorD10,
  linkColorHover: accentColors.accentColor,
  borderActiveColor: "rgba(0,0,0, 0.5)",
  borderColor: grays.gray80,
  borderColorWeak: grays.gray92,
  borderColorStrong: grays.gray60,
  focusColor: accentColors.accentColorD10,
  backgroundColorHover: grays.gray96,
  backgroundColor: grays.white,
  transparent: 'transparent'
};
/**
 * ## Syntax colors
 * The following colors should only be used for syntax coloring of code.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#006aa3',
  syntaxBlueLight: '#006d9c',
  syntaxBrown: '#905b04',
  syntaxGray: '#5c6773',
  syntaxGreen: '#2f612e',
  syntaxGreenLight: '#5ba383',
  syntaxOrange: '#a44b0e',
  syntaxPink: '#b9139e',
  syntaxPurple: '#5317f2',
  syntaxPurpleLight: '#b19cd9',
  syntaxRed: '#ca163d',
  syntaxRedLight: '#af575a',
  syntaxTeal: '#1a7060'
};
/**
 * ## Shadows
 *
 * @shadowSet
 */

var shadows = {
  focusShadow: "0 0 1px 3px ".concat(usageColors.focusColor),
  focusShadowInset: "inset 0 0 1px 1px ".concat(grays.white, ", inset 0 0 0 3px ").concat(usageColors.focusColor),
  overlayShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
};
/**
 * ## Interactive borders
 *
 * @borderSet
 */

var bordersInteractive = {
  activeBorder: "".concat(usageColors.borderActiveColor, " double")
};
/**
 * ## Backgrounds
 *
 * @colorSet verbose
 */

var backgrounds = {
  draggableBackground: "url('data:image/png;base64,".concat(dragHandle, "') 0 0 / 8px 8px repeat")
};
/**
 * ## Border
 *
 * @valueSet
 */

var borders = {
  borderRadius: '3px',
  border: "1px solid ".concat(usageColors.borderColor)
};
var sansFontFamily = "'Splunk Platform Sans', 'Proxima Nova', Roboto, Droid, 'Helvetica Neue', Helvetica, Arial, sans-serif";
/**
 * ## Font family
 *
 * @valueSet
 */

var fontFamily = {
  sansFontFamily: sansFontFamily,
  serifFontFamily: "Georgia, 'Times New Roman', Times, serif",
  monoFontFamily: "'Splunk Platform Mono', Inconsolata, Consolas, 'Droid Sans Mono', Monaco, 'Courier New', Courier, monospace",
  fontFamily: sansFontFamily
};
/**
 * ## Font weights
 *
 * Based on [common weight name mappings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping)
 *
 * @valueSet
 */

var fontWeights = {
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightSemiBold: 500,
  fontWeightBold: 700,
  fontWeightHeavy: 800,
  fontWeightExtraBold: 900
};
/**
 * ## Layers
 * If a variable does not suit your purpose, set a value relatively, such as zindexModal +1.
 *
 * @valueSet
 */

var zindexes = {
  zindexLayer: 1000,
  zindexFixedNavbar: 1030,
  zindexModalBackdrop: 1040,
  zindexModal: 1050,
  zindexPopover: 1060,
  zindexToastMessages: 2000
};

var theme = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, brandColors), grays), accentColors), errorColors), alertColors), warningColors), successColors), infoColors), categoricalColors), divergingColors), syntaxColors), fontFamily), fontWeights), usageColors), backgrounds), shadows), bordersInteractive), borders), zindexes), {}, {
  borderLightColor: grays.gray92 // @deprecated SUI-5981

});

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/prismaAliases.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tinycolor = _interopRequireDefault(__webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js"));

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/dark.js"));

var _compact = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/compact.js"));

var _comfortable = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/comfortable.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createPrismaAliases(_ref) {
  var colorScheme = _ref.colorScheme,
      density = _ref.density;
  var cs = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  var d = {
    compact: _compact["default"],
    comfortable: _comfortable["default"]
  }[density];
  /**
   * # Prisma Aliases
   * The following aliases for prisma variables are provided for convenience. Just because an alias is provided,
   * does not mean it is ideal for enterprise themes in all scenarios.
   *
   * They cover all values except most `interactiveColor*` variables.
   *
   *
   * For example, use
   *  ``` css
   *  const myClickable = styled(Clickable)`
   *      color: ${variables.contentColorDefault};
   *  }
   *  ```
   * instead of
   *  ``` css
   *  const myClickable = styled(Clickable)`
   *      color: ${pick({
   *          enterprise: variables.textColor;
   *          prisma: variables.contentColorDefault;
   *      })};
   *  }
   *  ```
   *
   * @valueSet
   */

  var prismaAliases = {
    accentColorPositive: cs.successColor,
    accentColorWarning: cs.warningColor,
    accentColorAlert: cs.alertColor,
    accentColorNegative: cs.errorColor,
    statusColorInfo: cs.infoColorL10,
    statusColorNormal: cs.successColorL10,
    statusColorLow: cs.warningColorL10,
    statusColorMedium: cs.alertColorL10,
    statusColorHigh: cs.errorColorL10,
    statusColorCritical: cs.errorColorD20,
    embossShadow: cs.overlayShadow,
    dragShadow: cs.overlayShadow,
    modalShadow: cs.overlayShadow,
    backgroundColorPopup: cs.backgroundColor,
    backgroundColorSection: cs.backgroundColor,
    backgroundColorSidebar: cs.backgroundColor,
    backgroundColorPage: cs.backgroundColor,
    backgroundColorNavigation: cs.backgroundColor,
    backgroundColorFloating: cs.backgroundColor,
    backgroundColorDialog: cs.backgroundColor,
    backgroundColorScrim: (0, _tinycolor["default"])(cs.gray30).setAlpha(0.8).toRgbString(),
    contentColorActive: cs.textColor,
    contentColorDefault: cs.textColor,
    contentColorMuted: cs.textGray,
    contentColorDisabled: cs.textDisabledColor,
    contentColorInverted: colorScheme === 'dark' ? cs.gray30 : cs.gray30,
    neutral100: colorScheme === 'dark' ? cs.gray25 : cs.gray98,
    neutral200: colorScheme === 'dark' ? cs.gray30 : cs.gray96,
    neutral300: colorScheme === 'dark' ? cs.gray45 : cs.gray92,
    neutral400: colorScheme === 'dark' ? cs.gray60 : _tinycolor["default"].mix(cs.gray92, cs.gray80).toRgbString(),
    neutral500: cs.gray80,
    interactiveColorPrimary: cs.brandColor,
    interactiveColorBorder: colorScheme === 'dark' ? cs.gray20 : cs.gray60,
    interactiveColorBorderActive: colorScheme === 'dark' ? cs.gray20 : cs.gray60,
    interactiveColorBorderHover: colorScheme === 'dark' ? cs.gray20 : cs.gray60,
    interactiveColorBorderDisabled: colorScheme === 'dark' ? cs.gray30 : cs.gray92,
    interactiveColorBackgroundDisabled: colorScheme === 'dark' ? cs.gray22 : cs.gray96,
    spacingXSmall: d.spacingQuarter,
    spacingSmall: d.spacingHalf,
    spacingMedium: "calc(".concat(d.spacing, " * 0.75)"),
    spacingLarge: d.spacing,
    spacingXLarge: "calc(".concat(d.spacing, " * 1.5)"),
    spacingXXLarge: "calc(".concat(d.spacing, " * 2)"),
    spacingXXXLarge: "calc(".concat(d.spacing, " * 2.5)")
  };
  return prismaAliases;
}

var _default = createPrismaAliases;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/getSettingsFromThemedProps.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js");

/**
 * The theme settings in `props.theme` are not considered an API to allow support for fallbacks
 * and forward compatibility in future versions of `SplunkThemeProvider`. Use this utility to
 * access `family`, `colorScheme`, and `density` from a component's props. This is useful
 * in limited migration scenarios. Use `withSplunkTheme` or `useSplunkTheme` instead.
 *
 * ```js
 * import getSettingsFromThemedProps from '@splunk/themes/getSettingsFromThemedProps';
 * ...
 * const { family, colorScheme } = getSettingsFromThemedProps(props);
 *
 * ```
 * @param {object} props - The themed props passed to a styled-component.
 * @returns {object} An object consisting of `{ family, colorScheme, density }`.
 * @public
 */
function getSettingsFromThemedProps(props) {
  var _props$theme;

  // props.theme is sometimes null
  var _ref = ((_props$theme = props.theme) === null || _props$theme === void 0 ? void 0 : _props$theme.splunkThemeV1) || {},
      family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density;

  return (0, _utils.addThemeDefaults)({
    family: family,
    colorScheme: colorScheme,
    density: density
  });
}

var _default = getSettingsFromThemedProps;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/getTheme.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearGetThemeCache = exports["default"] = void 0;

var _memoize = _interopRequireDefault(__webpack_require__("./node_modules/lodash/memoize.js"));

var _enterprise = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/enterprise/index.js"));

var _prisma = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/index.js"));

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * **NOTE:** Use cases for this function are limited. Instead, use `useSplunkTheme` in React components and `variables` in styled-components' CSS.
 * This function is for use outside of React and styled-components.
 * @file
 */

/**
 * The `getTheme` function returns all theme variables for a given theme. This function is memoized.
 *
 * ```js
 * import getTheme from '@splunk/themes/getTheme';
 *
 * const baseTheme = getTheme({family: 'prisma', colorScheme: 'light', density: 'compact' });
 *
 * console.log(baseTheme.family, baseTheme.focusColor);
 * ```
 * @param {object} [options] - The attributes of the theme as defined below.
 * @param {'prisma' | 'enterprise'} [options.family = 'prisma']
 * @param {'dark' | 'light'} [options.colorScheme = 'dark']
 * @param {'comfortable' | 'compact'} [options.density = 'comfortable']
 * @param {Boolean} [options.isPrisma = true]
 * @param {Boolean} [options.isEnterprise = false]
 * @param {Boolean} [options.isComfortable = true]
 * @param {Boolean} [options.isCompact = false]
 * @param {Boolean} [options.isDark = true]
 * @param {Boolean} [options.isLight = false]
 * @returns {object} A flat object of all variables and their values.
 * @public
 */
function getTheme() {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _addThemeDefaults = (0, _utils.addThemeDefaults)(settings),
      family = _addThemeDefaults.family,
      colorScheme = _addThemeDefaults.colorScheme,
      density = _addThemeDefaults.density;

  var isPrisma = family === 'prisma';
  var isEnterprise = family === 'enterprise';
  var isComfortable = density === 'comfortable';
  var isCompact = density === 'compact';
  var isDark = colorScheme === 'dark';
  var isLight = colorScheme === 'light';
  return Object.freeze(_objectSpread({
    colorScheme: colorScheme,
    density: density,
    family: family,
    isPrisma: isPrisma,
    isEnterprise: isEnterprise,
    isComfortable: isComfortable,
    isCompact: isCompact,
    isDark: isDark,
    isLight: isLight
  }, family === 'enterprise' ? (0, _enterprise["default"])({
    colorScheme: colorScheme,
    density: density
  }) : (0, _prisma["default"])({
    colorScheme: colorScheme,
    density: density
  })));
}

var getThemeMemoized = (0, _memoize["default"])(getTheme, function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density;

  return "".concat(family).concat(colorScheme).concat(density);
});

var clearGetThemeCache = function clearGetThemeCache() {
  var _getThemeMemoized$cac, _getThemeMemoized$cac2;

  return (_getThemeMemoized$cac = (_getThemeMemoized$cac2 = getThemeMemoized.cache).clear) === null || _getThemeMemoized$cac === void 0 ? void 0 : _getThemeMemoized$cac.call(_getThemeMemoized$cac2);
};

exports.clearGetThemeCache = clearGetThemeCache;
var _default = getThemeMemoized;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getSettingsFromThemedProps: true,
  getTheme: true,
  mixins: true,
  pick: true,
  pickVariant: true,
  SplunkThemeProvider: true,
  useSplunkTheme: true,
  withSplunkTheme: true,
  variables: true
};
Object.defineProperty(exports, "getSettingsFromThemedProps", {
  enumerable: true,
  get: function get() {
    return _getSettingsFromThemedProps["default"];
  }
});
Object.defineProperty(exports, "getTheme", {
  enumerable: true,
  get: function get() {
    return _getTheme["default"];
  }
});
Object.defineProperty(exports, "mixins", {
  enumerable: true,
  get: function get() {
    return _mixins["default"];
  }
});
Object.defineProperty(exports, "pick", {
  enumerable: true,
  get: function get() {
    return _pick["default"];
  }
});
Object.defineProperty(exports, "pickVariant", {
  enumerable: true,
  get: function get() {
    return _pickVariant["default"];
  }
});
Object.defineProperty(exports, "SplunkThemeProvider", {
  enumerable: true,
  get: function get() {
    return _SplunkThemeProvider["default"];
  }
});
Object.defineProperty(exports, "useSplunkTheme", {
  enumerable: true,
  get: function get() {
    return _useSplunkTheme["default"];
  }
});
Object.defineProperty(exports, "withSplunkTheme", {
  enumerable: true,
  get: function get() {
    return _withSplunkTheme["default"];
  }
});
Object.defineProperty(exports, "variables", {
  enumerable: true,
  get: function get() {
    return _variables["default"];
  }
});

var _getSettingsFromThemedProps = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/getSettingsFromThemedProps.js"));

var _getTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/getTheme.js"));

var _mixins = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/mixins/index.js"));

var _pick = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/pick.js"));

var _pickVariant = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/pickVariant.js"));

var _SplunkThemeProvider = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/SplunkThemeProvider.js"));

var _useSplunkTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/useSplunkTheme.js"));

var _withSplunkTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/withSplunkTheme.js"));

var _variables = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/variables.js"));

var _types = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/types.js");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/mixins/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  typography: true
};
Object.defineProperty(exports, "typography", {
  enumerable: true,
  get: function get() {
    return _typography["default"];
  }
});
exports["default"] = void 0;

var _utilityMixins = _interopRequireWildcard(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/mixins/utilityMixins.js"));

Object.keys(_utilityMixins).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utilityMixins[key];
    }
  });
});

var _typography = _interopRequireWildcard(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/mixins/typography.js"));

Object.keys(_typography).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _typography[key];
    }
  });
});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _utilityMixins["default"]), {}, {
  typography: _typography["default"]
});

exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/mixins/typography.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typographyVariants = exports["default"] = void 0;

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _merge = _interopRequireDefault(__webpack_require__("./node_modules/lodash/merge.js"));

var _variables = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/variables.js"));

var _pick = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/pick.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n                    margin: 0;\n                    padding: 0;\n                "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        ", "\n\n        color: ", ";\n        font-family: ", ";\n        font-size: ", ";\n        font-weight: ", ";\n        line-height: ", ";\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var typographyVariants = ['body', 'title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'largeBody', 'smallBody', 'footnote', 'monoBody', 'monoSmallBody'];
exports.typographyVariants = typographyVariants;

function isTypographyVariant(s) {
  if (typeof s !== 'string') {
    return false;
  }

  return typographyVariants.includes(s);
}

function getStylesForVariant(variant) {
  var color = _variables["default"].contentColorDefault;
  var family = _variables["default"].fontFamily;
  var lineHeight = _variables["default"].lineHeight; // eslint-disable-line prefer-destructuring

  var size = _variables["default"].fontSize;
  var weight = 'normal'; // TODO: After sections are removed from Heading update HeadingStyles accordingly to preserve section styles as typography variants SUI-5268

  switch (variant) {
    case 'title1':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '48px'
      });
      size = (0, _pick["default"])({
        enterprise: '24px',
        prisma: '36px'
      });
      weight = (0, _pick["default"])({
        enterprise: '500',
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title2':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '24px'
      });
      size = (0, _pick["default"])({
        enterprise: '18px',
        prisma: '24px'
      });
      weight = (0, _pick["default"])({
        enterprise: '500',
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title3':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '24px'
      });
      size = (0, _pick["default"])({
        enterprise: '16px',
        prisma: '20px'
      });
      weight = (0, _pick["default"])({
        enterprise: '500',
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title4':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '24px'
      });
      size = (0, _pick["default"])({
        enterprise: _variables["default"].fontSize,
        prisma: '16px'
      });
      weight = _variables["default"].fontWeightBold;
      break;

    case 'title5':
      color = _variables["default"].contentColorActive;
      lineHeight = _variables["default"].lineHeight;
      size = (0, _pick["default"])({
        enterprise: '12px',
        prisma: _variables["default"].fontSize
      });
      weight = (0, _pick["default"])({
        enterprise: _variables["default"].fontWeightSemiBold,
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title6':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: _variables["default"].lineHeight,
        prisma: '16px'
      });
      size = (0, _pick["default"])({
        enterprise: '12px',
        prisma: '13px'
      });
      weight = _variables["default"].fontWeightSemiBold;
      break;

    case 'title7':
      color = _variables["default"].contentColorActive;
      lineHeight = '16px';
      size = _variables["default"].fontSizeSmall;
      weight = _variables["default"].fontWeightSemiBold;
      break;

    case 'largeBody':
      color = _variables["default"].contentColorDefault;
      lineHeight = '24px';
      size = _variables["default"].fontSizeLarge;
      weight = 'normal';
      break;

    case 'smallBody':
      color = _variables["default"].contentColorDefault;
      lineHeight = '16px';
      size = _variables["default"].fontSizeSmall;
      weight = 'normal';
      break;

    case 'footnote':
      color = _variables["default"].contentColorDefault;
      lineHeight = '13px';
      size = '10px';
      weight = 'normal';
      break;

    case 'monoBody':
      family = _variables["default"].monoFontFamily;
      break;

    case 'monoSmallBody':
      color = _variables["default"].contentColorDefault;
      family = _variables["default"].monoFontFamily;
      lineHeight = '16px';
      size = _variables["default"].fontSizeSmall;
      weight = 'normal';
      break;

    case 'body':
      // Theme defaults set the 'body' style
      break;

    default:
      {
        if (false) {} // Make sure this "never" happens https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking


        var exhaustiveCheck = variant;
        return exhaustiveCheck;
      }
  }

  return {
    color: color,
    family: family,
    size: size,
    weight: weight,
    lineHeight: lineHeight,
    withReset: true
  };
}

var colorPropToVariableMap = {
  active: _variables["default"].contentColorActive,
  "default": _variables["default"].contentColorDefault,
  disabled: _variables["default"].contentColorDisabled,
  inverted: _variables["default"].contentColorInverted,
  muted: _variables["default"].contentColorMuted,
  inherit: 'inherit'
};
var familyPropToVariableMap = {
  sansSerif: _variables["default"].sansFontFamily,
  monospace: _variables["default"].monoFontFamily
}; // As defined by [font-weight | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping)

var weightPropToValueMap = {
  light: _variables["default"].fontWeightLight,
  normal: _variables["default"].fontWeightNormal,
  semiBold: _variables["default"].fontWeightSemiBold,
  bold: _variables["default"].fontWeightBold,
  extraBold: _variables["default"].fontWeightExtraBold,
  heavy: _variables["default"].fontWeightHeavy
};
/**
 * A mixin for styling text content using predefined typography variants
 * and/or customizing font-settings with system parameters: e.g. size, weight, font-family.
 *
 * The default variant is `body` and will be used if no variant or settings
 * are given: i.e. `typography()` or `typography({})`.
 * Variants have the reset applied by default.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { typography } from '@splunk/themes/mixins';
 *
 *  const MyTitle = styled.h1`
 *      ${typography('title1')};
 *  `;
 *
 *  const MyCustomizedTitle = styled.h1`
 *      ${typography('title1', { color: 'inverted' })};
 *  `;
 *
 *  const CustomTitle = styled.h1`
 *      ${typography({size: 56, weight: 'light', color: 'inverted' })};
 *  `;
 *  ```
 * @name typography
 * @kind function
 * @param {string} [variant] Use a predefined typography variant:
 *  `'body'`,
 *  `'title1'`,
 *  `'title2'`,
 *  `'title3'`,
 *  `'title4'`,
 *  `'title5'`,
 *  `'title6'`,
 *  `'title7'`,
 *  `'largeBody'`,
 *  `'smallBody'`,
 *  `'footnote'`,
 *  `'monoBody'`, or
 *  `'monoSmallBody'`,
 * @param {object} [typographyParams] Customize the font settings or element using system values for: `family`, `size`, `lineHeight`, `color`, and `weight`.
 * Default margin and padding can be removed with `withReset`.
 * @public
 */

function typography(variantOrParams, additionalParams) {
  var variant = isTypographyVariant(variantOrParams) ? variantOrParams : undefined;
  var params;

  if (variant && additionalParams !== undefined) {
    params = additionalParams;
  } else if (variant === undefined && _typeof(variantOrParams) === 'object' && additionalParams === undefined) {
    params = variantOrParams;
  } else {
    params = {};
  }

  var variantParams = variant ? getStylesForVariant(variant) : {}; // Transform params to be ready for css literal below: i.e size="24" -> "24px"

  var transformedParams = _objectSpread(_objectSpread({}, params), {}, {
    size: params.size ? "".concat(params.size, "px") : undefined,
    lineHeight: params.lineHeight ? "".concat(params.lineHeight, "px") : undefined,
    color: params.color ? colorPropToVariableMap[params.color] : undefined,
    family: params.family ? familyPropToVariableMap[params.family] : undefined,
    weight: params.weight ? weightPropToValueMap[params.weight] : undefined
  });

  var defaultTypographyParams = {
    color: _variables["default"].contentColorDefault,
    family: _variables["default"].fontFamily,
    size: _variables["default"].fontSize,
    weight: 'normal',
    lineHeight: _variables["default"].lineHeight,
    withReset: false
  };
  var finalParams = (0, _merge["default"])(defaultTypographyParams, variantParams, transformedParams);
  return function () {
    return (0, _styledComponents.css)(_templateObject(), function () {
      return finalParams.withReset && (0, _styledComponents.css)(_templateObject2());
    }, finalParams.color, finalParams.family, finalParams.size, finalParams.weight, finalParams.lineHeight);
  };
}

var _default = typography;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/mixins/utilityMixins.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearfix = clearfix;
exports.ellipsis = ellipsis;
exports.printWidth100Percent = printWidth100Percent;
exports.printHide = printHide;
exports.printNoBackground = printNoBackground;
exports.printWrapAll = printWrapAll;
exports.screenReaderContent = screenReaderContent;
exports.overlayColors = overlayColors;
exports.colorWithAlpha = colorWithAlpha;
exports["default"] = exports.reset = void 0;

var _tinycolor = _interopRequireDefault(__webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js"));

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _colorBlend = __webpack_require__("./node_modules/color-blend/dist/index.mjs");

var _variables = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/variables.js"));

var _pick = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/pick.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        /* Generic resets */\n        animation: none 0s ease 0s 1 normal none running;\n        backface-visibility: visible;\n        background: transparent none repeat 0 0 / auto auto padding-box border-box scroll;\n        border: medium none currentColor;\n        border-collapse: separate;\n        border-image: none;\n        border-radius: 0;\n        border-spacing: 0;\n        bottom: auto;\n        box-shadow: none;\n        caption-side: top;\n        clear: none;\n        clip: auto;\n        color-scheme: ", ";\n        columns: auto;\n        column-count: auto;\n        column-fill: balance;\n        column-gap: normal;\n        column-rule: medium none currentColor;\n        column-span: 1;\n        column-width: auto;\n        content: normal;\n        counter-increment: none;\n        counter-reset: none;\n        empty-cells: show;\n        float: none;\n        font-style: normal;\n        font-variant: normal;\n        font-weight: normal;\n        font-stretch: normal;\n        height: auto;\n        hyphens: none;\n        left: auto;\n        letter-spacing: normal;\n        list-style: disc outside none;\n        margin: 0;\n        max-height: none;\n        max-width: none;\n        min-height: 0;\n        min-width: 0;\n        opacity: 1;\n        orphans: 2;\n        overflow: visible;\n        overflow-x: visible;\n        overflow-y: visible;\n        padding: 0;\n        page-break-after: auto;\n        page-break-before: auto;\n        page-break-inside: auto;\n        perspective: none;\n        perspective-origin: 50% 50%;\n        pointer-events: auto;\n        position: static;\n        right: auto;\n        tab-size: 8;\n        table-layout: auto;\n        text-align: left;\n        text-align-last: auto;\n        text-decoration: none;\n        text-indent: 0;\n        text-shadow: none;\n        text-transform: none;\n        top: auto;\n        transform: none;\n        transform-origin: 50% 50% 0;\n        transform-style: flat;\n        transition: none 0s ease 0s;\n        user-select: auto;\n        vertical-align: baseline;\n        white-space: normal;\n        widows: 2;\n        width: auto;\n        word-spacing: normal;\n        z-index: auto;\n        /* Splunk-specific resets */\n        border-width: 1px;\n        box-sizing: border-box;\n        color: ", ";\n        cursor: inherit;\n        display: ", ";\n        font-family: ", ";\n        font-size: ", ";\n        line-height: ", ";\n        outline: medium none ", ";\n        visibility: inherit;\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * @file
 * A collection of style-related helper functions. All of them return a single object containing
 * DOM CSS properties, for example: `{ display: …, fontFamily: … }`.
 */

/**
 * The `reset` mixin resets css properties to their browser defaults, plus many to
 * theme-specific values. This ensures an element is not inheriting inappropriate styles.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { reset } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      ${reset('block')};
 *  `
 *  ```
 * @name reset
 * @kind function
 * @param {string} [display=inline] Set the `display` property (block, inline-block, …)
 * @public
 */
var reset = function reset() {
  var display = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'inline';
  return function () {
    return (0, _styledComponents.css)(_templateObject(), (0, _pick["default"])({
      /*
          use pick() rather than relying on variables.colorScheme
          because there's no guarantee that variables.colorScheme
          has to match the css color-scheme prop
      */
      dark: 'dark',
      light: 'light'
    }), (0, _pick["default"])({
      enterprise: _variables["default"].textColor,
      prisma: _variables["default"].contentColorDefault
    }), display, _variables["default"].fontFamily, _variables["default"].fontSize, _variables["default"].lineHeight, _variables["default"].focusColor);
  };
};
/**
 * `clearfix` is used on a container to ensure its height is at least as tall as any floating
 * children.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { clearfix } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      ${clearfix()};
 *  `
 *  ```
 * @public
 */


exports.reset = reset;

function clearfix() {
  return {
    '&::after': {
      display: 'table',
      content: '""',
      clear: 'both'
    }
  };
}
/**
 * Use `ellipsis` for overflowing text. Requires `display` to be set to `inline-block` or `block`.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { ellipsis } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      ${ellipsis()};
 *      width: 300px;
 *  `
 *  ```
 * @public
 */


function ellipsis() {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };
}
/**
 * Force an element to be exactly 100% wide so that it doesn't overflow the page.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printWidth100Percent } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *             ${printWidth100Percent()};
 *          }
 *      }
 *  }
 *  `
 *  ```
 *  @public
 */


function printWidth100Percent() {
  return {
    maxWidth: '100% !important',
    width: '100% !important',
    overflow: 'hidden !important'
  };
}
/**
 * Hide an element (such as a button).
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printHide } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *              ${printHide()};
 *          }
 *      }
 *  }
 *  ```
 * @public
 */


function printHide() {
  return {
    display: 'none !important'
  };
}
/**
 * Remove background gradients and images.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printNoBackground } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *              ${printNoBackground()};
 *          }
 *      }
 *  }
 *  ```
 * @public
 */


function printNoBackground() {
  return {
    background: 'none !important'
  };
}
/**
 * Ensure that all text wraps so that it doesn't overflow the page.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printWrapAll } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *              ${printWrapAll()};
 *          }
 *      }
 *  }
 *  ```
 * @public
 */


function printWrapAll() {
  // TS: have to assert as CSSObject because csstype doesn't allow !important
  return {
    wordBreak: 'break-all !important',
    wordWrap: 'break-word !important',
    overflowWrap: 'break-word !important',
    whiteSpace: 'normal !important'
  };
}
/**
 * Visually hide content. Typically used to target content for assistive technologies.
 *
 *  ##### Example
 *  ``` js
 *  import screenReaderContent from '@splunk/themes/mixins';
 *
 *  .myElement {
 *      ${props => props.theme.mixins.screenReaderContent()};
 *  }
 *  ```
 * @public
 */


function screenReaderContent() {
  return {
    position: 'absolute',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    width: '1px',
    margin: '-1px',
    padding: 0,
    border: 0
  };
}

/**
 * Calculates how one color would appear over another using a normal blend mode.
 * Colors can either be strings or functions, such as variable functions.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { overlayColors } from '@splunk/themes/mixins';
 *  import { interactiveColorPrimary, interactiveColorOverlaySelected } from '@splunk/themes/variables';
 *
 *  const myButton = styled.button`
 *      background: ${overlayColors(interactiveColorPrimary, interactiveColorOverlaySelected)};
 *  `
 *  ```
 * @name overlayColors
 * @kind function
 * @param {string|function} background
 * @param {string|function} foreground The color to overlay over the background.
 * @public
 */
function overlayColors(c1, c2) {
  return function (props) {
    var c1Value = typeof c1 === 'function' ? c1(props) : c1;
    var c2Value = typeof c2 === 'function' ? c2(props) : c2;
    var c3 = (0, _colorBlend.normal)((0, _tinycolor["default"])(c1Value).toRgb(), (0, _tinycolor["default"])(c2Value).toRgb());
    return (0, _tinycolor["default"])(c3).toRgbString();
  };
}
/**
 * Sets the alpha value on a given color.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { colorWithAlpha } from '@splunk/themes/mixins';
 *  import { interactiveColorPrimary } from '@splunk/themes/variables';
 *
 *  const myButton = styled.button`
 *      background: ${colorWithAlpha(interactiveColorPrimary, 0.5)};
 *  `
 *  ```
 * @name colorWithAlpha
 * @kind function
 * @param {string|function} color
 * @param {number} alpha The alpha value accepts range between 0-1.
 * @public
 */


function colorWithAlpha(color, alpha) {
  return function (props) {
    var colorValue = typeof color === 'function' ? color(props) : color;

    if (false) {}

    return (0, _tinycolor["default"])(colorValue).setAlpha(alpha).toRgbString();
  };
}

var _default = {
  reset: reset,
  clearfix: clearfix,
  ellipsis: ellipsis,
  printWidth100Percent: printWidth100Percent,
  printHide: printHide,
  printNoBackground: printNoBackground,
  printWrapAll: printWrapAll,
  screenReaderContent: screenReaderContent,
  colorWithAlpha: colorWithAlpha,
  overlayColors: overlayColors
};
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/pick.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInterpolationResult = isInterpolationResult;
exports["default"] = exports.getThemeVariant = void 0;

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var valueToKey = {
  enterprise: 'family',
  prisma: 'family',
  light: 'colorScheme',
  dark: 'colorScheme',
  compact: 'density',
  comfortable: 'density'
};

function isInterpolationResult(tree) {
  // for this to work as expected for objects/CSSProperties, it may be necessary to change
  // it to only consider objects that have valid pick tree keys (but no other keys)
  // as trees
  return _typeof(tree) !== 'object' || Array.isArray(tree) || tree === null;
}
/**
 * This function is exported for use in pickVariant exclusively.
 */


var getThemeVariant = function getThemeVariant(tree, theme) {
  // If it's not an object with one of the six keys, it must be an end value.
  var treeKey = Object.keys(tree).shift();

  if (!treeKey) {
    throw new Error('A pick tree cannot be empty.');
  }

  var themeKey = valueToKey[treeKey];

  if (!themeKey) {
    throw new Error("Invalid pick tree key: ".concat(treeKey));
  } // Recursively crawl the tree.


  var themeCurrentValue = theme[themeKey];
  var treeValue = tree[themeCurrentValue]; // If it's not an object or it's a null value, it must be the end value.

  if (isInterpolationResult(treeValue)) {
    return treeValue; // this may be undefined, when the css does not support the theme
  }

  return getThemeVariant(treeValue, theme);
};
/**
 * Pick is used to create theme-specific css.
 *
 * This example selects an appropriate variable for the current theme.
 * ```
 * import { pick, variables } from '@splunk/themes';
 *
 * const Wrapper = styled.div`
 *      color: ${pick({
 *          enterprise: {
 *              light: variables.grey35,
 *              dark:  variables.grey92,
 *          },
 *          prisma: variables.contentColorDefault,
 *      })}
 * `;
 * ```
 * This example selects an appropriate block of css for the current theme.
 * ```
 *  const Label = styled.div`
 *      ${pick({
 *          enterprise: css`
 *              font-weight: ${variables.fontWeightSemiBold};
 *          `,
 *          prisma: css`
 *              color: ${variables.contentColorDefault),
 *          `,
 *      })}
 * `;
 * ```
 * @param {object} themeOptions - An object consisting of a tree of theme options (`enterprise|prisma`, `light|dark`, or `compact|comfortable`).
 * @returns {function} The returned function is called by `styled-components`, which provides the theme context.
 * @public
 */


exports.getThemeVariant = getThemeVariant;

var pick = function pick(tree) {
  return function (_ref) {
    var theme = _ref.theme;
    var themeCleaned = (0, _utils.addThemeDefaults)(theme === null || theme === void 0 ? void 0 : theme.splunkThemeV1);
    return getThemeVariant(tree, themeCleaned);
  };
};

var _default = pick;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/pickVariant.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pick = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/pick.js");

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js");

/**
 * Pick Variant is used to create theme-specific css.
 *
 * This example selects an appropriate variable for the current theme.
 * ```
 * import { pickVariant } from '@splunk/themes';
 *
 * ...
 *
 * const Wrapper = styled.div`
 *      ${pickVariant('appearance', {
 *          filled: 'background: red',
 *          open: 'border: 1px solid red',
 *      })}
 * `;
 * ```
 * This example selects an appropriate block of css for the current theme.
 * ```
 *  const Wrapper = styled.div`
 *      ${pickVariant('appearance', {
 *          filled: {
 *              enterprise: 'background: green',
 *              prisma: 'background: blue',
 *          },
 *          open: {
 *              enterprise: 'border: 1px solid green',
 *              prisma: 'border: 1px solid blue',
 *          },
 *      })}
 * `;
 * ```
 * @param {string} propName - The prop name used to resolve the variants. The prop value must be a `string` or `boolean`.
 * @param {object} themeOptions - An object consisting of a tree of theme options, with the prop variants the top of the tree and optional
 * theme variants below (`enterprise|prisma`, `light|dark`, or `compact|comfortable`).
 * @returns {function} The returned function is called by `styled-components`, which provides the props and theme context.
 * @public
 */
var pickVariant = function pickVariant(propName, tree) {
  return function (props) {
    var _props$theme;

    // TS: must assume prop value can be used as string key
    var variantKey = props[propName];
    var subTree = tree[variantKey];

    if ((0, _pick.isInterpolationResult)(subTree)) {
      return subTree;
    }

    var theme = (0, _utils.addThemeDefaults)((_props$theme = props.theme) === null || _props$theme === void 0 ? void 0 : _props$theme.splunkThemeV1);
    return (0, _pick.getThemeVariant)(subTree, theme);
  };
};

var _default = pickVariant;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tinycolor = _interopRequireDefault(__webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js"));

var _dataViz = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/dataViz.js"));

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/dark.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createPrismaBase(_ref) {
  var colorScheme = _ref.colorScheme;
  var colorSchemeVars = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  /**
   * ## Misc. colors
   *
   * @colorSet verbose
   */

  var usageColors = {
    focusColor: (0, _tinycolor["default"])(colorSchemeVars.interactiveColorPrimary).setAlpha(0.7).toRgbString(),
    transparent: 'transparent',
    linkColor: colorSchemeVars.interactiveColorPrimary
  };
  /**
   * ## Interactive state shadows
   *
   * @shadowSet
   *
   */

  var shadows = {
    hoverShadow: "0 0 0 2px ".concat(colorSchemeVars.backgroundColorPage, ", 0 0 0 5px ").concat(colorSchemeVars.interactiveColorOverlayHover),
    focusShadow: "0 0 0 2px ".concat(colorSchemeVars.backgroundColorPage, ", 0 0 0 5px ").concat(usageColors.focusColor),
    focusShadowInset: "inset 0 0 0 3px ".concat(usageColors.focusColor)
  };
  /**
   * ## Borders
   *
   * @borderSet
   *
   */

  var borders = {
    activeBorder: "double ".concat(colorSchemeVars.interactiveColorBorderActive),
    borderColor: "".concat(colorSchemeVars.neutral200),
    borderColorWeak: "".concat(colorSchemeVars.neutral100),
    borderColorStrong: "".concat(colorSchemeVars.neutral300)
  };
  /**
   * ## Backgrounds
   *
   * @colorSet verbose
   */

  var backgrounds = {
    draggableBackground: "radial-gradient(circle at 1px 1px, ".concat(colorSchemeVars.contentColorMuted, ", ").concat(colorSchemeVars.contentColorMuted, " 1px, transparent 1px) 0 0 / 4px 6px")
  };
  var sansFontFamily = "'Splunk Platform Sans', 'Splunk Data Sans', Roboto, Droid, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  /**
   * ## Font family
   *
   * @valueSet
   */

  var fontFamily = {
    sansFontFamily: sansFontFamily,
    serifFontFamily: "Georgia, 'Times New Roman', Times, serif",
    monoFontFamily: "'Splunk Platform Mono', 'Roboto Mono', Consolas, 'Droid Sans Mono', Monaco, 'Courier New', Courier, monospace",
    fontFamily: sansFontFamily
  };
  /**
   * ## Font weights
   *
   * Based on [common weight name mappings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping)
   *
   * @valueSet
   */

  var fontWeights = {
    fontWeightLight: 300,
    fontWeightNormal: 400,
    fontWeightSemiBold: 500,
    fontWeightBold: 700,
    fontWeightHeavy: 800,
    fontWeightExtraBold: 900
  };
  /**
   * ## Layers
   * If a variable does not suit your purpose, set a value relatively, such as zindexModal +1.
   *
   * @valueSet
   */

  var zindexes = {
    zindexLayer: 1000,
    zindexFixedNavbar: 1030,
    zindexModalBackdrop: 1040,
    zindexModal: 1050,
    zindexPopover: 1060,
    zindexToastMessages: 2000
  };
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, fontFamily), fontWeights), usageColors), _dataViz["default"]), shadows), borders), backgrounds), zindexes);
}

var _default = createPrismaBase;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/comfortable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 *
 * @valueSet
 */
var measures = {
  spacingXSmall: '4px',
  spacingSmall: '8px',
  spacingMedium: '12px',
  spacingLarge: '16px',
  spacingXLarge: '24px',
  spacingXXLarge: '32px',
  spacingXXXLarge: '40px',
  fontSizeSmall: '12px',
  fontSize: '14px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '40px',
  borderRadius: '4px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/compact.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 * * Larger containers, such as `Card` or `Modal`, use `spacing`.
 * * `spacingHalf` and `spacingQuarter` are primarily for horizontal spacing between smaller elements.
 * * Just because a desired value equals 20, 10, or 5 pixels, does not mean it's appropriate to
 * use spacing variables.
 *
 * @valueSet
 */
var measures = {
  spacingXSmall: '4px',
  spacingSmall: '8px',
  spacingMedium: '12px',
  spacingLarge: '16px',
  spacingXLarge: '24px',
  spacingXXLarge: '32px',
  spacingXXXLarge: '40px',
  fontSizeSmall: '12px',
  fontSize: '14px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '32px',
  borderRadius: '4px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/dark.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ## Background colors
 * Background colors should be used only for backgrounds of higher level sections & containers of a UI.
 *
 * @colorSet verbose
 */
var backgroundColors = {
  backgroundColorPopup: '#27292e',
  backgroundColorSection: '#1a1c20',
  backgroundColorSidebar: '#0b0c0e',
  backgroundColorPage: '#111215',
  backgroundColorNavigation: '#08090a',
  backgroundColorFloating: '#ffffff',
  backgroundColorDialog: '#1e2024',
  backgroundColorScrim: 'rgba(0, 0, 0, 0.8)'
};
/**
 * ## Content colors
 * Content colors should be used for text, icons and dividers.
 *
 * @colorSet verbose
 */

var contentColors = {
  contentColorActive: '#fafafa',
  contentColorDefault: '#b5b5b5',
  contentColorDisabled: '#6b6b6b',
  contentColorInverted: '#000000',
  contentColorMuted: '#909090'
};
/**
 * ## Interactive colors
 * Interactive colors are specifically chosen for borders and backgrounds of controls and other interactive content.
 * "Overlay" colors are intended to be placed over the default background color, such as interactiveColorPrimary.
 * If the default background color is not transparent, the `blend` mixin can be used to create a new color that combines the two.
 *
 * @colorSet verbose
 */

var interactiveColors = {
  interactiveColorPrimary: '#3993FF',
  interactiveColorBorder: 'rgba(255, 255, 255, 0.5)',
  interactiveColorBorderActive: 'rgba(225, 225, 225, 0.5)',
  interactiveColorBorderHover: 'rgba(255, 255, 255, 0.7)',
  interactiveColorBorderDisabled: 'rgba(255, 255, 255, 0.30)',
  interactiveColorOverlaySelected: 'rgba(255, 255, 255, 0.1)',
  interactiveColorOverlayHover: 'rgba(255, 255, 255, 0.05)',
  interactiveColorOverlayActive: 'rgba(0, 0, 0, 0.2)',
  interactiveColorOverlayDrag: 'rgba(57, 147, 255, 0.16)',
  interactiveColorBackground: '#272a2f',
  interactiveColorBackgroundDisabled: 'rgba(255, 255, 255, 0.15)'
};
/**
 * ## Neutral colors
 * Neutrals are used for dividers and as backup colors that can sparingly be used for cases, when the other defined colors are not enough.
 *
 * @colorSet verbose
 */

var neutralColors = {
  black: '#000000',
  neutral100: '#33343b',
  neutral200: '#43454b',
  neutral300: '#505158',
  neutral400: '#818285',
  neutral500: '#acacad',
  white: '#ffffff'
};
/**
 * ## Accent colors
 * Accent colors aid and categorize the visual communication of the system response.
 *
 * @colorSet verbose
 */

var accentColors = {
  accentColorPositive: '#85f415',
  accentColorWarning: '#f49106',
  accentColorAlert: '#f0581f',
  accentColorNegative: '#ff4242'
};
/**
 * ## Status colors
 * Status colors are reserved for communicating urgency and severity associated with data objects.
 *
 * @colorSet verbose
 */

var statusColors = {
  statusColorInfo: '#61cafa',
  statusColorNormal: '#85f415',
  statusColorLow: '#2cbda3',
  statusColorMedium: '#f49106',
  statusColorHigh: '#ff4242',
  statusColorCritical: '#ff3361'
};
/**
 * ## Elevation shadows
 *
 * @shadowSet
 *
 */

var elevationShadows = {
  embossShadow: '0px 1px 5px rgba(0, 0, 0, 0.35), 0px 0px 1px rgba(0, 0, 0, 0.35)',
  overlayShadow: '0px 26px 103px rgba(0, 0, 0, 0.64), 0px 11px 18px rgba(0, 0, 0, 0.32), 0px 3px 6px rgba(0, 0, 0, 0.3)',
  dragShadow: '0px 26px 103px rgba(0, 0, 0, 0.64), 0px 11px 18px rgba(0, 0, 0, 0.32), 0px 3px 6px rgba(0, 0, 0, 0.3)',
  modalShadow: '0px 50px 200px #000000, 0px 29px 66px rgba(0, 0, 0, 0.41), 0px 14px 47px rgba(0, 0, 0, 0.17), 0px 5px 10px rgba(0, 0, 0, 0.15)'
};
/**
 * ## Syntax colors
 * Syntax colors are used only for code blocks.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#6cd0f0',
  syntaxBrown: '#fccf87',
  syntaxGray: '#909090',
  syntaxGreen: '#cef06c',
  syntaxOrange: '#f7933f',
  syntaxPink: '#f494e5',
  syntaxPurple: '#ab74f1',
  syntaxRed: '#e9627f',
  syntaxTeal: '#45d4ba'
};

var theme = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, accentColors), statusColors), elevationShadows), backgroundColors), contentColors), neutralColors), interactiveColors), syntaxColors);

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/dataViz.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.highLow = exports.sequential = exports.divergent = exports.categorical = exports.staticColors = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  ## Data viz
 *
 * Colors should be used in their prescribed order.
 * Don't mix-and-match between sets in the same visualization.
 *
 * ### Static colors
 *
 * @colorSet verbose
 */
var staticColors = {
  static1: '#7B56DB',
  static2: '#009CEB',
  static3: '#00CDAF',
  static4: '#DD9900',
  static5: '#FF677B',
  static6: '#CB2196',
  static7: '#813193',
  static8: '#0051B5',
  static9: '#008C80',
  static10: '#99B100',
  static11: '#FFA476',
  static12: '#FF6ACE',
  static13: '#AE8CFF',
  static14: '#00689D',
  static15: '#00490A',
  static16: '#465D00',
  static17: '#9D6300',
  static18: '#F6540B',
  static19: '#FF969E',
  static20: '#E47BFE'
};
/**
 * ### Categorical 1D
 *
 * @colorSet verbose
 */

exports.staticColors = staticColors;
var categorical1D = {
  categorical1D1: '#5C33FF',
  categorical1D2: '#207865',
  categorical1D3: '#AD3F20',
  categorical1D4: '#003E80',
  categorical1D5: '#78062A',
  categorical1D6: '#2F8811',
  categorical1D7: '#555555'
};
/**
 * ### Categorical 1L
 *
 * @colorSet verbose
 */

var categorical1L = {
  categorical1L1: '#9980FF',
  categorical1L2: '#45D4BA',
  categorical1L3: '#FB865C',
  categorical1L4: '#66AAF9',
  categorical1L5: '#E85B79',
  categorical1L6: '#88EE66',
  categorical1L7: '#F0B000'
};
/**
 * ### Categorical 2D
 *
 * @colorSet verbose
 */

var categorical2D = {
  categorical2D1: '#1F4D5B',
  categorical2D2: '#CC0AD6',
  categorical2D3: '#017FA2',
  categorical2D4: '#D81E5B',
  categorical2D5: '#621FFF',
  categorical2D6: '#348350',
  categorical2D7: '#555555'
};
/**
 * ### Categorical 2L
 *
 * @colorSet verbose
 */

var categorical2L = {
  categorical2L1: '#5599BE',
  categorical2L2: '#FB9DFB',
  categorical2L3: '#00BBEE',
  categorical2L4: '#EE3399',
  categorical2L5: '#9980FF',
  categorical2L6: '#5FBF7F',
  categorical2L7: '#F58B00'
};

var categorical = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, categorical1D), categorical1L), categorical2D), categorical2L);
/**
 * ### Divergent 1D
 *
 * @colorSet verbose
 */


exports.categorical = categorical;
var divergent1D = {
  divergent1D1: '#118832',
  divergent1D2: '#1C6B2D',
  divergent1D3: '#284D27',
  divergent1D4: '#333022',
  divergent1D5: '#692A21',
  divergent1D6: '#9E2520',
  divergent1D7: '#D41F1F'
};
/**
 * ### Divergent 1L
 *
 * @colorSet verbose
 */

var divergent1L = {
  divergent1L1: '#08AE37',
  divergent1L2: '#55C169',
  divergent1L3: '#A1D59C',
  divergent1L4: '#EEE8CE',
  divergent1L5: '#F4BAA9',
  divergent1L6: '#F98C83',
  divergent1L7: '#FF5E5E'
};
/**
 * ### Divergent 2D
 *
 * @colorSet verbose
 */

var divergent2D = {
  divergent2D1: '#0070F3',
  divergent2D2: '#115BAD',
  divergent2D3: '#224468',
  divergent2D4: '#333022',
  divergent2D5: '#692A21',
  divergent2D6: '#9E2520',
  divergent2D7: '#D41F1F'
};
/**
 * ### Divergent 2L
 *
 * @colorSet verbose
 */

var divergent2L = {
  divergent2L1: '#2A99FF',
  divergent2L2: '#6BB3EE',
  divergent2L3: '#ADCCDD',
  divergent2L4: '#EEE8CE',
  divergent2L5: '#F4BAA9',
  divergent2L6: '#F98C83',
  divergent2L7: '#FF5E5E'
};
/**
 * ### Divergent 3D
 *
 * @colorSet verbose
 */

var divergent3D = {
  divergent3D1: '#299986',
  divergent3D2: '#277C52',
  divergent3D3: '#24551F',
  divergent3D4: '#333022',
  divergent3D5: '#422879',
  divergent3D6: '#602CA1',
  divergent3D7: '#8747DA'
};
/**
 * ### Divergent 3L
 *
 * @colorSet verbose
 */

var divergent3L = {
  divergent3L1: '#14846C',
  divergent3L2: '#45D4BA',
  divergent3L3: '#9ADEC4',
  divergent3L4: '#EEE8CE',
  divergent3L5: '#D7BEE4',
  divergent3L6: '#C093F9',
  divergent3L7: '#9156DD'
};
/**
 * ### Divergent 4D
 *
 * @colorSet verbose
 */

var divergent4D = {
  divergent4D1: '#0D8387',
  divergent4D2: '#1A6765',
  divergent4D3: '#264C44',
  divergent4D4: '#333022',
  divergent4D5: '#693623',
  divergent4D6: '#9F3B23',
  divergent4D7: '#D54124'
};
/**
 * ### Divergent 4L
 *
 * @colorSet verbose
 */

var divergent4L = {
  divergent4L1: '#008287',
  divergent4L2: '#2EA39B',
  divergent4L3: '#5CC3AF',
  divergent4L4: '#EEE8CE',
  divergent4L5: '#ECA14E',
  divergent4L6: '#E3723A',
  divergent4L7: '#DA4325'
};

var divergent = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, divergent1D), divergent1L), divergent2D), divergent2L), divergent3D), divergent3L), divergent4D), divergent4L);
/**
 * ### Sequential 1D
 *
 * @colorSet verbose
 */


exports.divergent = divergent;
var sequential1D = {
  sequential1D1: '#118832',
  sequential1D2: '#669922',
  sequential1D3: '#9D9F0D',
  sequential1D4: '#CBA700',
  sequential1D5: '#D97A0D',
  sequential1D6: '#D94E17',
  sequential1D7: '#D41F1F'
};
/**
 * ### Sequential 1L
 *
 * @colorSet verbose
 */

var sequential1L = {
  sequential1L1: '#088F44',
  sequential1L2: '#2EB82E',
  sequential1L3: '#C3CC33',
  sequential1L4: '#FFD442',
  sequential1L5: '#FFA857',
  sequential1L6: '#FF7149',
  sequential1L7: '#FE3A3A'
};
/**
 * ### Sequential 2D
 *
 * @colorSet verbose
 */

var sequential2D = {
  sequential2D1: '#333022',
  sequential2D2: '#3D2830',
  sequential2D3: '#562E4C',
  sequential2D4: '#6F3468',
  sequential2D5: '#873A83',
  sequential2D6: '#A0409F',
  sequential2D7: '#B846BB'
};
/**
 * ### Sequential 2L
 *
 * @colorSet verbose
 */

var sequential2L = {
  sequential2L1: '#EEE8CE',
  sequential2L2: '#E8C7CE',
  sequential2L3: '#E1A6CD',
  sequential2L4: '#DB86CD',
  sequential2L5: '#D465CD',
  sequential2L6: '#CE44CC',
  sequential2L7: '#C723CC'
};
/**
 * ### Sequential 3D
 *
 * @colorSet verbose
 */

var sequential3D = {
  sequential3D1: '#333022',
  sequential3D2: '#253223',
  sequential3D3: '#244333',
  sequential3D4: '#245442',
  sequential3D5: '#246451',
  sequential3D6: '#237561',
  sequential3D7: '#238570'
};
/**
 * ### Sequential 3L
 *
 * @colorSet verbose
 */

var sequential3L = {
  sequential3L1: '#EEE8CE',
  sequential3L2: '#B6ECD4',
  sequential3L3: '#7EEFDA',
  sequential3L4: '#45D4BA',
  sequential3L5: '#35B9A0',
  sequential3L6: '#249F86',
  sequential3L7: '#14846C'
};
/**
 * ### Sequential 4D
 *
 * @colorSet verbose
 */

var sequential4D = {
  sequential4D1: '#333022',
  sequential4D2: '#442519',
  sequential4D3: '#64271F',
  sequential4D4: '#832A24',
  sequential4D5: '#A0312E',
  sequential4D6: '#BD3737',
  sequential4D7: '#DA3B30'
};
/**
 * ### Sequential 4L
 *
 * @colorSet verbose
 */

var sequential4L = {
  sequential4L1: '#EEE8CE',
  sequential4L2: '#F5CEBF',
  sequential4L3: '#FCB4B0',
  sequential4L4: '#F99C96',
  sequential4L5: '#F6847C',
  sequential4L6: '#DF564D',
  sequential4L7: '#DD2E2E'
};
/**
 * ### Sequential 5D
 *
 * @colorSet verbose
 */

var sequential5D = {
  sequential5D1: '#2E2E55',
  sequential5D2: '#4B1773',
  sequential5D3: '#77136A',
  sequential5D4: '#A81A45',
  sequential5D5: '#D24620',
  sequential5D6: '#D97A0D',
  sequential5D7: '#CBA700'
};
/**
 * ### Sequential 5L
 *
 * @colorSet verbose
 */

var sequential5L = {
  sequential5L1: '#EEE8CE',
  sequential5L2: '#F2DD88',
  sequential5L3: '#FFC355',
  sequential5L4: '#FF9D66',
  sequential5L5: '#FF7777',
  sequential5L6: '#EE4477',
  sequential5L7: '#DD22BB'
};
/**
 * ### Sequential 6D
 *
 * @colorSet verbose
 */

var sequential6D = {
  sequential6D1: '#1C3355',
  sequential6D2: '#005580',
  sequential6D3: '#007575',
  sequential6D4: '#118832',
  sequential6D5: '#669922',
  sequential6D6: '#9D9F0D',
  sequential6D7: '#CBA700'
};
/**
 * ### Sequential 6L
 *
 * @colorSet verbose
 */

var sequential6L = {
  sequential6L1: '#EEE8CE',
  sequential6L2: '#E7E755',
  sequential6L3: '#A3E052',
  sequential6L4: '#0AD647',
  sequential6L5: '#00BBBB',
  sequential6L6: '#1182F3',
  sequential6L7: '#6666DD'
};

var sequential = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, sequential1D), sequential1L), sequential2D), sequential2L), sequential3D), sequential3L), sequential4D), sequential4L), sequential5D), sequential5L), sequential6D), sequential6L);
/**
 * ### High low 1D
 *
 * @colorSet verbose
 */


exports.sequential = sequential;
var highLow1D = {
  highLow1DHigh: '#1C6B2D',
  highLow1DLow: '#9E2520'
};
/**
 * ### High low 1L
 *
 * @colorSet verbose
 */

var highLow1L = {
  highLow1LHigh: '#55C169',
  highLow1LLow: '#F98C83'
};
/**
 * ### High low 2D
 *
 * @colorSet verbose
 */

var highLow2D = {
  highLow2DHigh: '#115BAD',
  highLow2DLow: '#9E2520'
};
/**
 * ### High low 2L
 *
 * @colorSet verbose
 */

var highLow2L = {
  highLow2LHigh: '#6BB3EE',
  highLow2LLow: '#F98C83'
};
/**
 * ### High low 3D
 *
 * @colorSet verbose
 */

var highLow3D = {
  highLow3DHigh: '#277C52',
  highLow3DLow: '#602CA1'
};
/**
 * ### High low 3L
 *
 * @colorSet verbose
 */

var highLow3L = {
  highLow3LHigh: '#45D4BA',
  highLow3LLow: '#C093F9'
};
/**
 * ### High low 4D
 *
 * @colorSet verbose
 */

var highLow4D = {
  highLow4DHigh: '#1A6765',
  highLow4DLow: '#9F3B23'
};
/**
 * ### High low 4L
 *
 * @colorSet verbose
 */

var highLow4L = {
  highLow4LHigh: '#2EA39B',
  highLow4LLow: '#E3723A'
};

var highLow = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, highLow1D), highLow1L), highLow2D), highLow2L), highLow3D), highLow3L), highLow4D), highLow4L);

exports.highLow = highLow;

var dataViz = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, staticColors), categorical), divergent), sequential), highLow);

var _default = dataViz;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/dark.js"));

var _compact = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/compact.js"));

var _comfortable = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/comfortable.js"));

var _base = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/base.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createPrismaTheme(_ref) {
  var colorScheme = _ref.colorScheme,
      density = _ref.density;
  var colorSchemeVars = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  var densityVars = {
    compact: _compact["default"],
    comfortable: _comfortable["default"]
  }[density];
  var prismaBase = (0, _base["default"])({
    colorScheme: colorScheme
  });
  return _objectSpread(_objectSpread(_objectSpread({}, prismaBase), colorSchemeVars), densityVars);
}

var _default = createPrismaTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/prisma/light.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ## Background colors
 * Background colors should be used only for backgrounds of higher level sections & containers of a UI.
 *
 * @colorSet verbose
 */
var backgroundColors = {
  backgroundColorPopup: '#ffffff',
  backgroundColorSection: '#ffffff',
  backgroundColorSidebar: '#f8f8f8',
  backgroundColorPage: '#f9f9f9',
  backgroundColorNavigation: '#f7f7f7',
  backgroundColorFloating: '#000000',
  backgroundColorDialog: '#ffffff',
  backgroundColorScrim: 'rgba(255, 255, 255, 0.75)'
};
/**
 * ## Content colors
 * Content colors should be used for text, icons and dividers.
 *
 * @colorSet verbose
 */

var contentColors = {
  contentColorActive: '#2c2c2c',
  contentColorDefault: '#4d4d4d',
  contentColorDisabled: '#878787',
  contentColorInverted: '#ffffff',
  contentColorMuted: '#6b6b6b'
};
/**
 * ## Interactive colors
 * Interactive colors are specifically chosen for borders and backgrounds of controls and other interactive content.
 * "Overlay" colors are intended to be placed over the default background color, such as interactiveColorPrimary.
 * If the default background color is not transparent, the `blend` mixin can be used to create a new color that combines the two.
 *
 * @colorSet verbose
 */

var interactiveColors = {
  interactiveColorPrimary: '#0264d7',
  interactiveColorBorder: 'rgba(0, 0, 0, 0.4)',
  interactiveColorBorderActive: 'rgba(0, 0, 0, 0.5)',
  interactiveColorBorderHover: 'rgba(0, 0, 0, 0.6)',
  interactiveColorBorderDisabled: 'rgba(0, 0, 0, 0.3)',
  interactiveColorOverlaySelected: 'rgba(0, 0, 0, 0.04)',
  interactiveColorOverlayHover: 'rgba(0, 0, 0, 0.03)',
  interactiveColorOverlayActive: 'rgba(0, 0, 0, 0.07)',
  interactiveColorOverlayDrag: 'rgba(2, 100, 215, 0.16)',
  interactiveColorBackground: '#eeeeee',
  interactiveColorBackgroundDisabled: 'rgba(0, 0, 0, 0.1)'
};
/**
 * ## Neutral colors
 * Neutrals are used for dividers and as backup colors that can sparingly be used for cases, when the other defined colors are not enough.
 *
 * @colorSet verbose
 */

var neutralColors = {
  white: '#ffffff',
  neutral100: '#f0f0f0',
  neutral200: '#e6e6e6',
  neutral300: '#dddddd',
  neutral400: '#cacaca',
  neutral500: '#b8b8b8',
  black: '#000000'
};
/**
 * ## Accent colors
 * Accent colors aid and categorize the visual communication of the system response.
 *
 * @colorSet verbose
 */

var accentColors = {
  accentColorPositive: '#407a06',
  accentColorWarning: '#c97705',
  accentColorAlert: '#c6400d',
  accentColorNegative: '#e00000'
};
/**
 * ## Status colors
 * Status colors are reserved for communicating urgency and severity associated with data objects.
 *
 * @colorSet verbose
 */

var statusColors = {
  statusColorInfo: '#006be5',
  statusColorNormal: '#407a06',
  statusColorLow: '#155a4e',
  statusColorMedium: '#c97705',
  statusColorHigh: '#e00000',
  statusColorCritical: '#9e1534'
};
/**
 * ## Elevation shadows
 *
 * @shadowSet
 *
 */

var elevationShadows = {
  embossShadow: ' 0px 1px 5px rgba(0, 0, 0, 0.07), 0px 0px 1px rgba(0, 0, 0, 0.07)',
  overlayShadow: '0px 26px 103px rgba(0, 0, 0, 0.13), 0px 11px 18px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.06)',
  dragShadow: '0px 26px 103px rgba(0, 0, 0, 0.13), 0px 11px 18px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.06)',
  modalShadow: '0px 50px 200px rgba(0, 0, 0, 0.3), 0px 29px 66px rgba(0, 0, 0, 0.08), 0px 29px 47px rgba(0, 0, 0, 0.08), 0px 5px 10px rgba(0, 0, 0, 0.03)'
};
/**
 * ## Syntax colors
 * Syntax colors are used only for code blocks.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#0f7594',
  syntaxBrown: '#9f6404',
  syntaxGray: '#6b6b6b',
  syntaxGreen: '#5c780c',
  syntaxOrange: '#ba4f08',
  syntaxPink: '#cc15ae',
  syntaxPurple: '#7b4df5',
  syntaxRed: '#db1e47',
  syntaxTeal: '#1d7c6b'
};

var theme = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, accentColors), statusColors), elevationShadows), backgroundColors), contentColors), neutralColors), interactiveColors), syntaxColors);

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/types.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/useSplunkTheme.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = __webpack_require__("./node_modules/react/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * React hook that allows theme variables to be easily used within a React functional component.
 * This includes the basic configuration of `family`, `colorScheme` and `density`,
 * as well as all the specific variables available in that theme.
 *
 * If no data `SplunkThemeProvider` was configured, the Prisma Dark Comfortable theme is returned.
 *
 * ```
 * import useSplunkTheme from '@splunk/themes/useSplunkTheme';
 * ...
 * export function() {
 *     const { isComfortable, focusColor } = useSplunkTheme();
 *
 *     const style = {
 *         color: focusColor,
 *         padding: isComfortable ? '10px' : '5px',
 *     }
 *
 *     ...
 *
 *     return (
 *         <div style={style}>
 *             Hello
 *         </div>
 *     )
 * }
 * ```
 * @public
 */
var useSplunkTheme = function useSplunkTheme() {
  var _ref = (0, _react.useContext)(_styledComponents.ThemeContext) || {},
      _ref$splunkThemeV = _ref.splunkThemeV1,
      splunkThemeV1 = _ref$splunkThemeV === void 0 ? {} : _ref$splunkThemeV,
      rest = _objectWithoutProperties(_ref, ["splunkThemeV1"]);

  var family = splunkThemeV1.family,
      colorScheme = splunkThemeV1.colorScheme,
      density = splunkThemeV1.density,
      customizer = splunkThemeV1.customizer;
  return _objectSpread(_objectSpread({}, rest), (0, _utils.getCustomizedTheme)({
    family: family,
    colorScheme: colorScheme,
    density: density
  }, customizer));
};

var _default = useSplunkTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomizedTheme = exports.addThemeDefaults = void 0;

var _memoize = _interopRequireDefault(__webpack_require__("./node_modules/lodash/memoize.js"));

var _getTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/getTheme.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Accepts a theme object and returns supported values and defaults.
 * @private
 */
var addThemeDefaults = function addThemeDefaults() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$family = _ref.family,
      family = _ref$family === void 0 ? 'prisma' : _ref$family,
      _ref$colorScheme = _ref.colorScheme,
      colorScheme = _ref$colorScheme === void 0 ? 'dark' : _ref$colorScheme,
      _ref$density = _ref.density,
      density = _ref$density === void 0 ? 'comfortable' : _ref$density,
      _ref$isPrisma = _ref.isPrisma,
      isPrisma = _ref$isPrisma === void 0 ? true : _ref$isPrisma,
      _ref$isEnterprise = _ref.isEnterprise,
      isEnterprise = _ref$isEnterprise === void 0 ? false : _ref$isEnterprise,
      _ref$isComfortable = _ref.isComfortable,
      isComfortable = _ref$isComfortable === void 0 ? true : _ref$isComfortable,
      _ref$isCompact = _ref.isCompact,
      isCompact = _ref$isCompact === void 0 ? false : _ref$isCompact,
      _ref$isDark = _ref.isDark,
      isDark = _ref$isDark === void 0 ? true : _ref$isDark,
      _ref$isLight = _ref.isLight,
      isLight = _ref$isLight === void 0 ? false : _ref$isLight;

  return {
    family: family,
    colorScheme: colorScheme,
    density: density,
    isPrisma: isPrisma,
    isEnterprise: isEnterprise,
    isComfortable: isComfortable,
    isCompact: isCompact,
    isDark: isDark,
    isLight: isLight
  };
};

exports.addThemeDefaults = addThemeDefaults;

function getCustomizedThemeUnmemo(settings, customizer) {
  var variables = (0, _getTheme["default"])(settings);

  if (!customizer) {
    return variables;
  }

  return customizer(variables);
}
/**
 * Accepts a theme object and customizer, and returns supported values and defaults.
 * @private
 */


var getCustomizedTheme = (0, _memoize["default"])(getCustomizedThemeUnmemo, function () {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      family = _ref2.family,
      colorScheme = _ref2.colorScheme,
      density = _ref2.density;

  var customizer = arguments.length > 1 ? arguments[1] : undefined;
  return "".concat(family, "-").concat(colorScheme, "-").concat(density, "-").concat(!!customizer);
});
exports.getCustomizedTheme = getCustomizedTheme;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/variables.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearVariablesCache = exports["default"] = void 0;

var _memoize = _interopRequireDefault(__webpack_require__("./node_modules/lodash/memoize.js"));

var _getTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/getTheme.js"));

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @file
 * ## Theme Variables
 * All variables are available in one util for use in styled-component templates.
 * Each variable is a function which styled-components will call with the available theme information.
 * If there is no SplunkThemeProvider, variables will default to Prisma Dark Comfortable.
 *
 * Variables will return `undefined` if the variable does not exist in the current theme.
 * ```
 * import variables from '@splunk/themes/variables';
 * import styled from 'styled-components';
 * ...
 * const PrismaWrapper = styled.div`
 *     color: ${variables.contentColorDefault};
 * `;
 * ```
 *
 * Variables may also be imported individually.
 * ```
 * import { contentColorDefault } from '@splunk/themes/variables';
 * import styled from 'styled-components';
 * ...
 * const PrismaWrapper = styled.div`
 *     color: ${contentColorDefault};
 * `;
 * ```
 *
 * This function must be used in conjunction with `pick` if different variables are needed in different themes.
 * ```
 * import { pick, variables } from '@splunk/themes';
 * import styled from 'styled-components';
 *
 * const Wrapper = styled.div`
 *     color: ${pick({
 *          enterprise: variables.textColor,
 *          prisma: variables.contentColorDefault
 *     });
 * `;
 * ```
 * ## Custom Variables
 * Custom variables cannot be added to this package. However, `pick()` can be used to create sets of
 * theme variables. These can be then be imported separately and used as above.
 * ```
 * import pick from '@splunk/themes/pick';
 *
 * export const myVariables = {
 *    orange: pick({
 *        light: '#C80',
 *        dark: '#F90',
 *    }),
 *    space: pick({
 *        enterprise: '20px',
 *        prisma: {
 *            comfortable: '16px',
 *            compact: '12px',
 *        },
 *    }),
 * };
 * ```
 */
var getThemeVariable = function getThemeVariable(name, settings, customizer) {
  var theme = (0, _utils.getCustomizedTheme)(settings, customizer);
  var returnValue = theme[name];

  if (false) {}

  return returnValue;
};

var getThemeVariableMemoized = (0, _memoize["default"])(getThemeVariable, function (name, _ref, customizer) {
  var family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density;
  return "".concat(name, "-").concat(family, "-").concat(colorScheme, "-").concat(density, "-").concat(!!customizer);
});

var clearVariablesCache = function clearVariablesCache() {
  var _getThemeVariableMemo, _getThemeVariableMemo2;

  return (_getThemeVariableMemo = (_getThemeVariableMemo2 = getThemeVariableMemoized.cache).clear) === null || _getThemeVariableMemo === void 0 ? void 0 : _getThemeVariableMemo.call(_getThemeVariableMemo2);
};
/**
 * The `get` helper will insert a theme variable into a `styled-components` css template.
 * Note, this will return `undefined` if the variable does not exist in the current theme.
 * This function must be used in conjunction with `pick` if different variables are needed in different themes.
 * ```
 * import get from '@splunk/themes/get';
 * ...
 * const Wrapper = styled.div`
 *     color: ${get('contentColorDefaultDefault')}; // prisma theme only
 * `;
 * ```
 * @param {string} name - The name of the variable to get from the current theme configuration.
 * @returns {function} The returned function is called by `styled-components`, which provides the theme context.
 * @private
 */


exports.clearVariablesCache = clearVariablesCache;

var get = function get(name) {
  return function (_ref2) {
    var _ref2$theme = _ref2.theme;
    _ref2$theme = _ref2$theme === void 0 ? {} : _ref2$theme;
    var splunkThemeV1 = _ref2$theme.splunkThemeV1;

    var _ref3 = splunkThemeV1 || {},
        family = _ref3.family,
        colorScheme = _ref3.colorScheme,
        density = _ref3.density,
        customizer = _ref3.customizer;

    return getThemeVariableMemoized(name, {
      family: family,
      colorScheme: colorScheme,
      density: density
    }, customizer);
  };
};

var variableNames = Object.keys(_objectSpread(_objectSpread({}, (0, _getTheme["default"])({
  family: 'prisma'
})), (0, _getTheme["default"])({
  family: 'enterprise'
}))); // each variable is converted to a get() function.
// TS: The AllVariables type allows safe access to all variables shared across themes,
// and unsafe access to variables exclusive to Enterprise or Prisma

var variables = variableNames.reduce(function (acc, currentValue) {
  // using defineProperty instead of acc[currentValue] to work around readonly issue
  Object.defineProperty(acc, currentValue, {
    value: get(currentValue)
  });
  return acc;
}, {});
var _default = variables;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/withSplunkTheme.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__("./node_modules/react/index.js"));

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/react-ui/node_modules/@splunk/themes/utils.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// implementation for both

/**
 * `withSplunkTheme` allows theme variables to be used within a React class component.
 * This includes the basic configuration of `family`, `colorScheme` and `density`,
 * as well as all the specific variables available in that theme.
 *
 * If no data `SplunkThemeProvider` was configured, the Prisma Dark Comfortable theme is returned.
 *
 * ```
 * import React, { Component } from 'react';
 * import PropTypes from 'prop-types';
 * import withSplunkTheme from '@splunk/themes/withSplunkTheme';
 *
 *
 * class MyComponent extends Component {
 *     static propTypes = {
 *         splunkTheme: PropTypes.object,
 *     };
 *
 *     render() {
 *         const { isComfortable, focusColor } = this.props.splunkTheme;
 *
 *         const style = {
 *             color: focusColor,
 *             padding: isComfortable ? '10px' : '5px',
 *         }
 *
 *         return (
 *             <div style={style}>
 *                 Hello
 *             </div>
 *         )
 *     }
 * }
 *
 * const MyComponentWithTheme = withSplunkTheme(MyComponent);
 * MyComponentWithTheme.propTypes = MyComponent.propTypes;
 *
 * export default MyComponentWithTheme;
 *
 * ```
 * @name withSplunkTheme
 * @function
 * @public
 */
function withSplunkTheme( // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
Component) {
  var ComponentWithSplunkTheme = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
    var _ref = (0, _react.useContext)(_styledComponents.ThemeContext) || {},
        splunkThemeV1 = _ref.splunkThemeV1,
        rest = _objectWithoutProperties(_ref, ["splunkThemeV1"]);

    var _ref2 = splunkThemeV1 || {},
        family = _ref2.family,
        colorScheme = _ref2.colorScheme,
        density = _ref2.density,
        customizer = _ref2.customizer;

    var themeSettings = (0, _utils.addThemeDefaults)({
      family: family,
      colorScheme: colorScheme,
      density: density
    });

    var splunkTheme = _objectSpread(_objectSpread({}, rest), (0, _utils.getCustomizedTheme)(themeSettings, customizer));

    return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
      ref: ref,
      splunkTheme: splunkTheme
    }));
  });

  var displayName = Component.displayName || Component.name || 'Component';
  ComponentWithSplunkTheme.displayName = "withSplunkTheme(".concat(displayName, ")");
  return ComponentWithSplunkTheme;
} // see https://github.com/Microsoft/TypeScript/issues/28938 for the two "as T" assertions above


var _default = withSplunkTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/SplunkThemeProvider.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SplunkThemeProvider;

var _react = _interopRequireWildcard(__webpack_require__("./node_modules/react/index.js"));

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/** SplunkThemeProvider defaults to `prisma` `dark` `comfortable`, unless the properties have already been set.
 *
 * For example, here the nested `SplunkThemeProvider` defaults to `enterprise` `light`:
 * ```jsx
 * return (
 *     <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
 *         Main part of the page in enterprise-light-comfortable.
 *         <SplunkThemeProvider density="compact">
 *             Part of the page in enterprise-light-compact.
 *         </SplunkThemeProvider>
 *     </SplunkThemeProvider>
 * )
 */
function SplunkThemeProvider(_ref) {
  var family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density,
      additionalThemeProperties = _ref.additionalThemeProperties,
      customizeTheme = _ref.customizeTheme,
      otherProps = _objectWithoutProperties(_ref, ["family", "colorScheme", "density", "additionalThemeProperties", "customizeTheme"]);

  var _ref2 = (0, _react.useContext)(_styledComponents.ThemeContext) || {},
      _ref2$splunkThemeV = _ref2.splunkThemeV1,
      splunkThemeV1 = _ref2$splunkThemeV === void 0 ? {} : _ref2$splunkThemeV;

  var composedTheme = _objectSpread(_objectSpread({}, additionalThemeProperties), {}, {
    splunkThemeV1: {
      family: family || splunkThemeV1.family || 'prisma',
      colorScheme: colorScheme || splunkThemeV1.colorScheme || 'dark',
      density: density || splunkThemeV1.density || 'comfortable',
      customizer: customizeTheme || splunkThemeV1.customizer
    }
  });

  return /*#__PURE__*/_react["default"].createElement(_styledComponents.ThemeProvider, _extends({
    theme: composedTheme
  }, otherProps));
}

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/comfortable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 *
 * @valueSet
 */
var measures = {
  spacingQuarter: '5px',
  spacingHalf: '10px',
  spacing: '20px',
  fontSizeSmall: '12px',
  fontSize: '14px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '32px',
  borderRadius: '3px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/compact.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 * * Larger containers, such as `Card` or `Modal`, use `spacing`.
 * * `spacingHalf` and `spacingQuarter` are primarily for horizontal spacing between smaller elements.
 * * Just because a desired value equals 20, 10, or 5 pixels, does not mean it's appropriate to
 * use spacing variables.
 *
 * @valueSet
 */
var measures = {
  spacingQuarter: '5px',
  spacingHalf: '10px',
  spacing: '20px',
  fontSizeSmall: '12px',
  fontSize: '12px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '28px',
  borderRadius: '3px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/dark.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/light.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dragHandleDark = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA1SURBVHgB7dKhEQAgDAPAhHmwSKZHYtmHVtZVVNTkXS53UeG57yPYazLmrB8o6h8QgPqBOAOboRAPJUGIOAAAAABJRU5ErkJggg=="; // see babel-plugin-base64-png

var dark = {
  backgroundColor: _light["default"].gray20,
  backgroundColorHover: _light["default"].gray30,
  borderColor: _light["default"].gray22,
  borderDarkColor: _light["default"].black,
  borderLightColor: _light["default"].gray60,
  textColor: _light["default"].white,
  textGray: _light["default"].gray92,
  textDisabledColor: _light["default"].gray45,
  linkColor: _light["default"].accentColorL10,
  linkColorHover: _light["default"].accentColorL20,
  border: "1px solid ".concat(_light["default"].gray22),
  borderDark: "1px solid ".concat(_light["default"].black),
  borderLight: "1px solid ".concat(_light["default"].gray60),
  focusShadowInset: "inset 0 0 1px 1px ".concat(_light["default"].gray25, ", inset 0 0 0 3px ").concat(_light["default"].focusColor),
  draggableBackground: "url('data:image/png;base64,".concat(dragHandleDark, "') 0 0 / 8px 8px repeat")
};
/**
 * ## Syntax colors
 * Syntax colors are used only for code blocks.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#6cd0f0',
  syntaxBrown: '#fccf87',
  syntaxGray: '#b5b5b5',
  syntaxGreen: '#cef06c',
  syntaxOrange: '#f7994a',
  syntaxPink: '#f494e5',
  syntaxPurple: '#c99eff',
  syntaxRed: '#fa94aa',
  syntaxTeal: '#45d4ba'
};

var theme = _objectSpread(_objectSpread(_objectSpread({}, _light["default"]), dark), syntaxColors);

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/dark.js"));

var _compact = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/compact.js"));

var _comfortable = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/comfortable.js"));

var _prismaAliases = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/prismaAliases.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createEnterpriseTheme(_ref) {
  var colorScheme = _ref.colorScheme,
      density = _ref.density;
  var cs = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  var d = {
    compact: _compact["default"],
    comfortable: _comfortable["default"]
  }[density];
  var pa = (0, _prismaAliases["default"])({
    colorScheme: colorScheme,
    density: density
  });
  return _objectSpread(_objectSpread(_objectSpread({}, cs), d), pa);
}

var _default = createEnterpriseTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/light.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dragHandle = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA2SURBVHgB7dKhEQAgDAPAhDnxDMAcDIBnT1pZV1FRk3e53EWFc+2P4N3DmLN+oKh/QADqB+IMUKEQD/CeueAAAAAASUVORK5CYII="; // see babel-plugin-base64-pngimport {

/**
 * ## Brand colors
 *
 *  @colorSet
 */

var brandColors = {
  brandColorL50: '#f5fbf5',
  brandColorL40: '#dff2df',
  brandColorL30: '#bee6be',
  brandColorL20: '#9ed99e',
  brandColorL10: '#7ecd7e',
  brandColor: '#5cc05c',
  brandColorD10: '#49b849',
  brandColorD20: '#40a540',
  brandColorD30: '#389038',
  brandColorD40: '#307b30',
  brandColorD50: '#286728'
};
/**
 * ## Grayscale colors
 *
 * @colorSet
 */

var grays = {
  white: '#ffffff',
  gray98: '#f7f8fa',
  gray96: '#f2f4f5',
  gray92: '#e1e6eb',
  gray80: '#c3cbd4',
  gray60: '#818d99',
  gray45: '#5c6773',
  gray30: '#3c444d',
  gray25: '#31373e',
  gray22: '#2b3033',
  gray20: '#171d21',
  black: '#000000'
};
/**
 * ## Accent colors
 *
 * @colorSet
 */

var accentColors = {
  accentColorL50: '#ecf8ff',
  accentColorL40: '#bfe9ff',
  accentColorL30: '#7ed2ff',
  accentColorL20: '#3ebcff',
  accentColorL10: '#00a4fd',
  accentColor: '#007abd',
  accentColorD10: '#006eaa',
  accentColorD20: '#006297',
  accentColorD30: '#005684',
  accentColorD40: '#004a71',
  accentColorD50: '#003d5e'
};
/**
 * ## Error Colors
 *
 * @colorSet
 */

var errorColors = {
  errorColorL50: '#fcedec',
  errorColorL40: '#f8dcd9',
  errorColorL30: '#f1b9b3',
  errorColorL20: '#ea958d',
  errorColorL10: '#e37267',
  errorColor: '#dc4e41',
  errorColorD10: '#c84535',
  errorColorD20: '#b23d30',
  errorColorD30: '#9c3529',
  errorColorD40: '#852d24',
  errorColorD50: '#6f261d'
};
/**
 * ## Alert colors
 *
 * @colorSet
 * */

var alertColors = {
  alertColorL50: '#fef3ec',
  alertColorL40: '#fde6d9',
  alertColorL30: '#facdb3',
  alertColorL20: '#f7b48c',
  alertColorL10: '#f49b66',
  alertColor: '#f1813f',
  alertColorD10: '#da742e',
  alertColorD20: '#c2672a',
  alertColorD30: '#aa5a25',
  alertColorD40: '#914d1f',
  alertColorD50: '#79401a'
};
/**
 * ## Warning colors
 *
 *  @colorSet
 */

var warningColors = {
  warningColorL50: '#fff9eb',
  warningColorL40: '#fef2d7',
  warningColorL30: '#fde5ae',
  warningColorL20: '#fbd886',
  warningColorL10: '#facb5d',
  warningColor: '#f8be34',
  warningColorD10: '#e0ac16',
  warningColorD20: '#c79915',
  warningColorD30: '#ae8613',
  warningColorD40: '#957312',
  warningColorD50: '#7d600f'
};
/**
 * ## Success colors
 *
 * @colorSet
 */

var successColors = {
  successColorL50: '#eef6ee',
  successColorL40: '#ddecdd',
  successColorL30: '#bbd9ba',
  successColorL20: '#98c697',
  successColorL10: '#76b374',
  successColor: '#53a051',
  successColorD10: '#479144',
  successColorD20: '#40813d',
  successColorD30: '#387135',
  successColorD40: '#2f612e',
  successColorD50: '#275126'
};
/**
 * ## Info colors
 *
 *  @colorSet
 */

var infoColors = {
  infoColorL50: '#e5f0f5',
  infoColorL40: '#cce2eb',
  infoColorL30: '#99c5d7',
  infoColorL20: '#66a7c4',
  infoColorL10: '#338ab0',
  infoColor: '#006d9c',
  infoColorD10: '#00577c',
  infoColorD20: '#004c6c',
  infoColorD30: '#00415d',
  infoColorD40: '#00364d',
  infoColorD50: '#002b3e'
};
/**
 * ## Diverging colors
 *
 * @colorSet alphabetical
 */

var divergingColors = {
  diverging1ColorA: '#006d9c',
  diverging1ColorB: '#ec9960',
  diverging2ColorA: '#af575a',
  diverging2ColorB: '#62b3b2',
  diverging3ColorA: '#4fa484',
  diverging3ColorB: '#f8be34',
  diverging4ColorA: '#5a4575',
  diverging4ColorB: '#708794',
  diverging5ColorA: '#294e70',
  diverging5ColorB: '#b6c75a'
};
/**
 * ## Categorical Colors
 *
 * @colorSet alphabetical
 */

var categoricalColors = {
  cat1Color: '#297ba5',
  cat1ColorL: '#78b9d6',
  cat2Color: '#4fa484',
  cat2ColorL: '#74d5c2',
  cat3Color: '#b6c75a',
  cat3ColorL: '#dce6a5',
  cat4Color: '#3c6188',
  cat4ColorL: '#a0b2ca',
  cat5Color: '#ec9960',
  cat5ColorL: '#fac9a7',
  cat6Color: '#a65c7d',
  cat6ColorL: '#d3a7ba',
  cat7Color: '#708794',
  cat7ColorL: '#b2c0c8',
  cat8Color: '#38b8bf',
  cat8ColorL: '#92dde2',
  cat9Color: '#ffde63',
  cat9ColorL: '#ffeeae',
  cat10Color: '#c19975',
  cat10ColorL: '#d7bfab',
  cat11Color: '#5a4575',
  cat11ColorL: '#b7acca',
  cat12Color: '#7ea77b',
  cat12ColorL: '#b2cab0',
  cat13Color: '#576d83',
  cat13ColorL: '#a5b2bf',
  cat14Color: '#d7c6b7',
  cat14ColorL: '#e9ddd4',
  cat15Color: '#339bb2',
  cat15ColorL: '#66c3d0',
  cat16Color: '#236d9b',
  cat16ColorL: '#66a7c2',
  cat17Color: '#e5dc80',
  cat17ColorL: '#f1eab7',
  cat18Color: '#96907f',
  cat18ColorL: '#c1bcb3',
  cat19Color: '#87bc65',
  cat19ColorL: '#b6d7a3',
  cat20Color: '#cf7e60',
  cat20ColorL: '#e1b2a1',
  cat21Color: '#7b5547',
  cat21ColorL: '#dec4ba',
  cat22Color: '#77d6d8',
  cat22ColorL: '#abe6e8',
  cat23Color: '#4a7f2c',
  cat23ColorL: '#91b282',
  cat24Color: '#f589ad',
  cat24ColorL: '#f8b7ce',
  cat25Color: '#6a2c5d',
  cat25ColorL: '#cba3c2',
  cat26Color: '#aaabae',
  cat26ColorL: '#cccdce',
  cat27Color: '#9a7438',
  cat27ColorL: '#c3ab89',
  cat28Color: '#a4d563',
  cat28ColorL: '#c7e6a3',
  cat29Color: '#7672a4',
  cat29ColorL: '#ada9c8',
  cat30Color: '#184b81',
  cat30ColorL: '#a4bbe0'
};
/**
 * ## Usage-based colors
 *
 * @colorSet verbose
 */

var usageColors = {
  textColor: grays.gray30,
  textGray: '#6b7785',
  textDisabledColor: grays.gray80,
  linkColor: accentColors.accentColorD10,
  linkColorHover: accentColors.accentColor,
  borderLightColor: grays.gray92,
  borderColor: grays.gray80,
  focusColor: accentColors.accentColorD10,
  backgroundColorHover: grays.gray96,
  backgroundColor: grays.white,
  transparent: 'transparent'
};
/**
 * ## Syntax colors
 * The following colors should only be used for syntax coloring of code.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#006aa3',
  syntaxBlueLight: '#006d9c',
  syntaxBrown: '#905b04',
  syntaxGray: '#5c6773',
  syntaxGreen: '#2f612e',
  syntaxGreenLight: '#5ba383',
  syntaxOrange: '#a44b0e',
  syntaxPink: '#b9139e',
  syntaxPurple: '#5317f2',
  syntaxPurpleLight: '#b19cd9',
  syntaxRed: '#ca163d',
  syntaxRedLight: '#af575a',
  syntaxTeal: '#1a7060'
};
/**
 * ## Shadows
 *
 * @shadowSet
 */

var shadows = {
  focusShadow: "0 0 1px 3px ".concat(usageColors.focusColor),
  focusShadowInset: "inset 0 0 1px 1px ".concat(grays.white, ", inset 0 0 0 3px ").concat(usageColors.focusColor),
  overlayShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
};
/**
 * ## Backgrounds
 *
 * @colorSet verbose
 */

var backgrounds = {
  draggableBackground: "url('data:image/png;base64,".concat(dragHandle, "') 0 0 / 8px 8px repeat")
};
/**
 * ## Border
 *
 * @valueSet
 */

var borders = {
  borderRadius: '3px',
  border: "1px solid ".concat(usageColors.borderColor)
};
var sansFontFamily = "'Splunk Platform Sans', 'Proxima Nova', Roboto, Droid, 'Helvetica Neue', Helvetica, Arial, sans-serif";
/**
 * ## Font family
 *
 * @valueSet
 */

var fontFamily = {
  sansFontFamily: sansFontFamily,
  serifFontFamily: "Georgia, 'Times New Roman', Times, serif",
  monoFontFamily: "'Splunk Platform Mono', Inconsolata, Consolas, 'Droid Sans Mono', Monaco, 'Courier New', Courier, monospace",
  fontFamily: sansFontFamily
};
/**
 * ## Font weights
 *
 * Based on [common weight name mappings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping)
 *
 * @valueSet
 */

var fontWeights = {
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightSemiBold: 500,
  fontWeightBold: 700,
  fontWeightHeavy: 800,
  fontWeightExtraBold: 900
};
/**
 * ## Layers
 * If a variable does not suit your purpose, set a value relatively, such as zindexModal +1.
 *
 * @valueSet
 */

var zindexes = {
  zindexLayer: 1000,
  zindexFixedNavbar: 1030,
  zindexModalBackdrop: 1040,
  zindexModal: 1050,
  zindexPopover: 1060,
  zindexToastMessages: 2000
};

var theme = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, brandColors), grays), accentColors), errorColors), alertColors), warningColors), successColors), infoColors), categoricalColors), divergingColors), syntaxColors), fontFamily), fontWeights), usageColors), backgrounds), shadows), borders), zindexes);

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/prismaAliases.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tinycolor = _interopRequireDefault(__webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js"));

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/dark.js"));

var _compact = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/compact.js"));

var _comfortable = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/comfortable.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createPrismaAliases(_ref) {
  var colorScheme = _ref.colorScheme,
      density = _ref.density;
  var cs = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  var d = {
    compact: _compact["default"],
    comfortable: _comfortable["default"]
  }[density];
  /**
   * # Prisma Aliases
   * The following aliases for prisma variables are provided for convenience. Just because an alias is provided,
   * does not mean it is ideal for enterprise themes in all scenarios.
   *
   * They cover all values except most `interactiveColor*` variables.
   *
   *
   * For example, use
   *  ``` css
   *  const myClickable = styled(Clickable)`
   *      color: ${variables.contentColorDefault};
   *  }
   *  ```
   * instead of
   *  ``` css
   *  const myClickable = styled(Clickable)`
   *      color: ${pick({
   *          enterprise: variables.textColor;
   *          prisma: variables.contentColorDefault;
   *      })};
   *  }
   *  ```
   *
   * @valueSet
   */

  var prismaAliases = {
    accentColorPositive: cs.successColor,
    accentColorWarning: cs.warningColor,
    accentColorAlert: cs.alertColor,
    accentColorNegative: cs.errorColor,
    statusColorInfo: cs.infoColorL10,
    statusColorNormal: cs.successColorL10,
    statusColorLow: cs.warningColorL10,
    statusColorMedium: cs.alertColorL10,
    statusColorHigh: cs.errorColorL10,
    statusColorCritical: cs.errorColorD20,
    embossShadow: cs.overlayShadow,
    dragShadow: cs.overlayShadow,
    modalShadow: cs.overlayShadow,
    backgroundColorPopup: cs.backgroundColor,
    backgroundColorSection: cs.backgroundColor,
    backgroundColorSidebar: cs.backgroundColor,
    backgroundColorPage: cs.backgroundColor,
    backgroundColorNavigation: cs.backgroundColor,
    backgroundColorFloating: cs.backgroundColor,
    backgroundColorDialog: cs.backgroundColor,
    backgroundColorScrim: (0, _tinycolor["default"])(cs.gray30).setAlpha(0.8).toRgbString(),
    contentColorActive: cs.textColor,
    contentColorDefault: cs.textColor,
    contentColorMuted: cs.textGray,
    contentColorDisabled: cs.textDisabledColor,
    contentColorInverted: colorScheme === 'dark' ? cs.gray30 : cs.gray30,
    neutral100: colorScheme === 'dark' ? cs.gray25 : cs.gray98,
    neutral200: colorScheme === 'dark' ? cs.gray30 : cs.gray96,
    neutral300: colorScheme === 'dark' ? cs.gray45 : cs.gray92,
    neutral400: colorScheme === 'dark' ? cs.gray60 : _tinycolor["default"].mix(cs.gray92, cs.gray80).toRgbString(),
    neutral500: cs.gray80,
    interactiveColorPrimary: cs.brandColor,
    interactiveColorBorder: cs.borderColor,
    spacingXSmall: d.spacingQuarter,
    spacingSmall: d.spacingHalf,
    spacingMedium: "calc(".concat(d.spacing, " * 0.75)"),
    spacingLarge: d.spacing,
    spacingXLarge: "calc(".concat(d.spacing, " * 1.5)"),
    spacingXXLarge: "calc(".concat(d.spacing, " * 2)"),
    spacingXXXLarge: "calc(".concat(d.spacing, " * 2.5)")
  };
  return prismaAliases;
}

var _default = createPrismaAliases;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/getSettingsFromThemedProps.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js");

/**
 * The theme settings in `props.theme` are not considered an API to allow support for fallbacks
 * and forward compatibility in future versions of `SplunkThemeProvider`. Use this utility to
 * access `family`, `colorScheme`, and `density` from a component's props. This is useful
 * in limited migration scenarios. Use `withSplunkTheme` or `useSplunkTheme` instead.
 *
 * ```js
 * import getSettingsFromThemedProps from '@splunk/themes/getSettingsFromThemedProps';
 * ...
 * const { family, colorScheme } = getSettingsFromThemedProps(props);
 *
 * ```
 * @param {object} props - The themed props passed to a styled-component.
 * @returns {object} An object consisting of `{ family, colorScheme, density }`.
 * @public
 */
function getSettingsFromThemedProps(props) {
  var _props$theme;

  // props.theme is sometimes null
  var _ref = ((_props$theme = props.theme) === null || _props$theme === void 0 ? void 0 : _props$theme.splunkThemeV1) || {},
      family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density;

  return (0, _utils.addThemeDefaults)({
    family: family,
    colorScheme: colorScheme,
    density: density
  });
}

var _default = getSettingsFromThemedProps;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/getTheme.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearGetThemeCache = exports["default"] = void 0;

var _memoize = _interopRequireDefault(__webpack_require__("./node_modules/lodash/memoize.js"));

var _enterprise = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/enterprise/index.js"));

var _prisma = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/index.js"));

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * **NOTE:** Use cases for this function are limited. Instead, use `useSplunkTheme` in React components and `variables` in styled-components' CSS.
 * This function is for use outside of React and styled-components.
 * @file
 */

/**
 * The `getTheme` function returns all theme variables for a given theme. This function is memoized.
 *
 * ```js
 * import getTheme from '@splunk/themes/getTheme';
 *
 * const baseTheme = getTheme({family: 'prisma', colorScheme: 'light', density: 'compact' });
 *
 * console.log(baseTheme.family, baseTheme.focusColor);
 * ```
 * @param {object} [options] - The attributes of the theme as defined below.
 * @param {'prisma' | 'enterprise'} [options.family = 'prisma']
 * @param {'dark' | 'light'} [options.colorScheme = 'dark']
 * @param {'comfortable' | 'compact'} [options.density = 'comfortable']
 * @param {Boolean} [options.isPrisma = true]
 * @param {Boolean} [options.isEnterprise = false]
 * @param {Boolean} [options.isComfortable = true]
 * @param {Boolean} [options.isCompact = false]
 * @param {Boolean} [options.isDark = true]
 * @param {Boolean} [options.isLight = false]
 * @returns {object} A flat object of all variables and their values.
 * @public
 */
function getTheme() {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _addThemeDefaults = (0, _utils.addThemeDefaults)(settings),
      family = _addThemeDefaults.family,
      colorScheme = _addThemeDefaults.colorScheme,
      density = _addThemeDefaults.density;

  var isPrisma = family === 'prisma';
  var isEnterprise = family === 'enterprise';
  var isComfortable = density === 'comfortable';
  var isCompact = density === 'compact';
  var isDark = colorScheme === 'dark';
  var isLight = colorScheme === 'light';
  return Object.freeze(_objectSpread({
    colorScheme: colorScheme,
    density: density,
    family: family,
    isPrisma: isPrisma,
    isEnterprise: isEnterprise,
    isComfortable: isComfortable,
    isCompact: isCompact,
    isDark: isDark,
    isLight: isLight
  }, family === 'enterprise' ? (0, _enterprise["default"])({
    colorScheme: colorScheme,
    density: density
  }) : (0, _prisma["default"])({
    colorScheme: colorScheme,
    density: density
  })));
}

var getThemeMemoized = (0, _memoize["default"])(getTheme, function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density;

  return "".concat(family).concat(colorScheme).concat(density);
});

var clearGetThemeCache = function clearGetThemeCache() {
  var _getThemeMemoized$cac, _getThemeMemoized$cac2;

  return (_getThemeMemoized$cac = (_getThemeMemoized$cac2 = getThemeMemoized.cache).clear) === null || _getThemeMemoized$cac === void 0 ? void 0 : _getThemeMemoized$cac.call(_getThemeMemoized$cac2);
};

exports.clearGetThemeCache = clearGetThemeCache;
var _default = getThemeMemoized;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getSettingsFromThemedProps: true,
  getTheme: true,
  mixins: true,
  pick: true,
  pickVariant: true,
  SplunkThemeProvider: true,
  useSplunkTheme: true,
  withSplunkTheme: true,
  variables: true
};
Object.defineProperty(exports, "getSettingsFromThemedProps", {
  enumerable: true,
  get: function get() {
    return _getSettingsFromThemedProps["default"];
  }
});
Object.defineProperty(exports, "getTheme", {
  enumerable: true,
  get: function get() {
    return _getTheme["default"];
  }
});
Object.defineProperty(exports, "mixins", {
  enumerable: true,
  get: function get() {
    return _mixins["default"];
  }
});
Object.defineProperty(exports, "pick", {
  enumerable: true,
  get: function get() {
    return _pick["default"];
  }
});
Object.defineProperty(exports, "pickVariant", {
  enumerable: true,
  get: function get() {
    return _pickVariant["default"];
  }
});
Object.defineProperty(exports, "SplunkThemeProvider", {
  enumerable: true,
  get: function get() {
    return _SplunkThemeProvider["default"];
  }
});
Object.defineProperty(exports, "useSplunkTheme", {
  enumerable: true,
  get: function get() {
    return _useSplunkTheme["default"];
  }
});
Object.defineProperty(exports, "withSplunkTheme", {
  enumerable: true,
  get: function get() {
    return _withSplunkTheme["default"];
  }
});
Object.defineProperty(exports, "variables", {
  enumerable: true,
  get: function get() {
    return _variables["default"];
  }
});

var _getSettingsFromThemedProps = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/getSettingsFromThemedProps.js"));

var _getTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/getTheme.js"));

var _mixins = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/mixins/index.js"));

var _pick = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/pick.js"));

var _pickVariant = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/pickVariant.js"));

var _SplunkThemeProvider = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/SplunkThemeProvider.js"));

var _useSplunkTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/useSplunkTheme.js"));

var _withSplunkTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/withSplunkTheme.js"));

var _variables = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/variables.js"));

var _types = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/types.js");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/mixins/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  typography: true
};
Object.defineProperty(exports, "typography", {
  enumerable: true,
  get: function get() {
    return _typography["default"];
  }
});
exports["default"] = void 0;

var _utilityMixins = _interopRequireWildcard(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/mixins/utilityMixins.js"));

Object.keys(_utilityMixins).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utilityMixins[key];
    }
  });
});

var _typography = _interopRequireWildcard(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/mixins/typography.js"));

Object.keys(_typography).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _typography[key];
    }
  });
});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _utilityMixins["default"]), {}, {
  typography: _typography["default"]
});

exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/mixins/typography.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typographyVariants = exports["default"] = void 0;

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _merge = _interopRequireDefault(__webpack_require__("./node_modules/lodash/merge.js"));

var _variables = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/variables.js"));

var _pick = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/pick.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n                    margin: 0;\n                    padding: 0;\n                "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        ", "\n\n        color: ", ";\n        font-family: ", ";\n        font-size: ", ";\n        font-weight: ", ";\n        line-height: ", ";\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var typographyVariants = ['body', 'title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'largeBody', 'smallBody', 'footnote', 'monoBody', 'monoSmallBody'];
exports.typographyVariants = typographyVariants;

function isTypographyVariant(s) {
  if (typeof s !== 'string') {
    return false;
  }

  return typographyVariants.includes(s);
}

function getStylesForVariant(variant) {
  var color = _variables["default"].contentColorDefault;
  var family = _variables["default"].fontFamily;
  var lineHeight = _variables["default"].lineHeight; // eslint-disable-line prefer-destructuring

  var size = _variables["default"].fontSize;
  var weight = 'normal'; // TODO: After sections are removed from Heading update HeadingStyles accordingly to preserve section styles as typography variants SUI-5268

  switch (variant) {
    case 'title1':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '48px'
      });
      size = (0, _pick["default"])({
        enterprise: '24px',
        prisma: '36px'
      });
      weight = (0, _pick["default"])({
        enterprise: '500',
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title2':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '24px'
      });
      size = (0, _pick["default"])({
        enterprise: '18px',
        prisma: '24px'
      });
      weight = (0, _pick["default"])({
        enterprise: '500',
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title3':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '24px'
      });
      size = (0, _pick["default"])({
        enterprise: '16px',
        prisma: '20px'
      });
      weight = (0, _pick["default"])({
        enterprise: '500',
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title4':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: '20px',
        prisma: '24px'
      });
      size = (0, _pick["default"])({
        enterprise: _variables["default"].fontSize,
        prisma: '16px'
      });
      weight = _variables["default"].fontWeightBold;
      break;

    case 'title5':
      color = _variables["default"].contentColorActive;
      lineHeight = _variables["default"].lineHeight;
      size = (0, _pick["default"])({
        enterprise: '12px',
        prisma: _variables["default"].fontSize
      });
      weight = (0, _pick["default"])({
        enterprise: _variables["default"].fontWeightSemiBold,
        prisma: _variables["default"].fontWeightBold
      });
      break;

    case 'title6':
      color = _variables["default"].contentColorActive;
      lineHeight = (0, _pick["default"])({
        enterprise: _variables["default"].lineHeight,
        prisma: '16px'
      });
      size = (0, _pick["default"])({
        enterprise: '12px',
        prisma: '13px'
      });
      weight = _variables["default"].fontWeightSemiBold;
      break;

    case 'title7':
      color = _variables["default"].contentColorActive;
      lineHeight = '16px';
      size = _variables["default"].fontSizeSmall;
      weight = _variables["default"].fontWeightSemiBold;
      break;

    case 'largeBody':
      color = _variables["default"].contentColorDefault;
      lineHeight = '24px';
      size = _variables["default"].fontSizeLarge;
      weight = 'normal';
      break;

    case 'smallBody':
      color = _variables["default"].contentColorDefault;
      lineHeight = '16px';
      size = _variables["default"].fontSizeSmall;
      weight = 'normal';
      break;

    case 'footnote':
      color = _variables["default"].contentColorDefault;
      lineHeight = '13px';
      size = '10px';
      weight = 'normal';
      break;

    case 'monoBody':
      family = _variables["default"].monoFontFamily;
      break;

    case 'monoSmallBody':
      color = _variables["default"].contentColorDefault;
      family = _variables["default"].monoFontFamily;
      lineHeight = '16px';
      size = _variables["default"].fontSizeSmall;
      weight = 'normal';
      break;

    case 'body':
      // Theme defaults set the 'body' style
      break;

    default:
      {
        if (false) {} // Make sure this "never" happens https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking


        var exhaustiveCheck = variant;
        return exhaustiveCheck;
      }
  }

  return {
    color: color,
    family: family,
    size: size,
    weight: weight,
    lineHeight: lineHeight,
    withReset: true
  };
}

var colorPropToVariableMap = {
  active: _variables["default"].contentColorActive,
  "default": _variables["default"].contentColorDefault,
  disabled: _variables["default"].contentColorDisabled,
  inverted: _variables["default"].contentColorInverted,
  muted: _variables["default"].contentColorMuted,
  inherit: 'inherit'
};
var familyPropToVariableMap = {
  sansSerif: _variables["default"].sansFontFamily,
  monospace: _variables["default"].monoFontFamily
}; // As defined by [font-weight | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping)

var weightPropToValueMap = {
  light: _variables["default"].fontWeightLight,
  normal: _variables["default"].fontWeightNormal,
  semiBold: _variables["default"].fontWeightSemiBold,
  bold: _variables["default"].fontWeightBold,
  extraBold: _variables["default"].fontWeightExtraBold,
  heavy: _variables["default"].fontWeightHeavy
};
/**
 * A mixin for styling text content using predefined typography variants
 * and/or customizing font-settings with system parameters: e.g. size, weight, font-family.
 *
 * The default variant is `body` and will be used if no variant or settings
 * are given: i.e. `typography()` or `typography({})`.
 * Variants have the reset applied by default.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { typography } from '@splunk/themes/mixins';
 *
 *  const MyTitle = styled.h1`
 *      ${typography('title1')};
 *  `;
 *
 *  const MyCustomizedTitle = styled.h1`
 *      ${typography('title1', { color: 'inverted' })};
 *  `;
 *
 *  const CustomTitle = styled.h1`
 *      ${typography({size: 56, weight: 'light', color: 'inverted' })};
 *  `;
 *  ```
 * @name typography
 * @kind function
 * @param {string} [variant] Use a predefined typography variant:
 *  `'body'`,
 *  `'title1'`,
 *  `'title2'`,
 *  `'title3'`,
 *  `'title4'`,
 *  `'title5'`,
 *  `'title6'`,
 *  `'title7'`,
 *  `'largeBody'`,
 *  `'smallBody'`,
 *  `'footnote'`,
 *  `'monoBody'`, or
 *  `'monoSmallBody'`,
 * @param {object} [typographyParams] Customize the font settings or element using system values for: `family`, `size`, `lineHeight`, `color`, and `weight`.
 * Default margin and padding can be removed with `withReset`.
 * @public
 */

function typography(variantOrParams, additionalParams) {
  var variant = isTypographyVariant(variantOrParams) ? variantOrParams : undefined;
  var params;

  if (variant && additionalParams !== undefined) {
    params = additionalParams;
  } else if (variant === undefined && _typeof(variantOrParams) === 'object' && additionalParams === undefined) {
    params = variantOrParams;
  } else {
    params = {};
  }

  var variantParams = variant ? getStylesForVariant(variant) : {}; // Transform params to be ready for css literal below: i.e size="24" -> "24px"

  var transformedParams = _objectSpread(_objectSpread({}, params), {}, {
    size: params.size ? "".concat(params.size, "px") : undefined,
    lineHeight: params.lineHeight ? "".concat(params.lineHeight, "px") : undefined,
    color: params.color ? colorPropToVariableMap[params.color] : undefined,
    family: params.family ? familyPropToVariableMap[params.family] : undefined,
    weight: params.weight ? weightPropToValueMap[params.weight] : undefined
  });

  var defaultTypographyParams = {
    color: _variables["default"].contentColorDefault,
    family: _variables["default"].fontFamily,
    size: _variables["default"].fontSize,
    weight: 'normal',
    lineHeight: _variables["default"].lineHeight,
    withReset: false
  };
  var finalParams = (0, _merge["default"])(defaultTypographyParams, variantParams, transformedParams);
  return function () {
    return (0, _styledComponents.css)(_templateObject(), function () {
      return finalParams.withReset && (0, _styledComponents.css)(_templateObject2());
    }, finalParams.color, finalParams.family, finalParams.size, finalParams.weight, finalParams.lineHeight);
  };
}

var _default = typography;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/mixins/utilityMixins.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearfix = clearfix;
exports.ellipsis = ellipsis;
exports.printWidth100Percent = printWidth100Percent;
exports.printHide = printHide;
exports.printNoBackground = printNoBackground;
exports.printWrapAll = printWrapAll;
exports.screenReaderContent = screenReaderContent;
exports.overlayColors = overlayColors;
exports.colorWithAlpha = colorWithAlpha;
exports["default"] = exports.reset = void 0;

var _tinycolor = _interopRequireDefault(__webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js"));

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _colorBlend = __webpack_require__("./node_modules/color-blend/dist/index.mjs");

var _variables = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/variables.js"));

var _pick = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/pick.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        /* Generic resets */\n        animation: none 0s ease 0s 1 normal none running;\n        backface-visibility: visible;\n        background: transparent none repeat 0 0 / auto auto padding-box border-box scroll;\n        border: medium none currentColor;\n        border-collapse: separate;\n        border-image: none;\n        border-radius: 0;\n        border-spacing: 0;\n        bottom: auto;\n        box-shadow: none;\n        caption-side: top;\n        clear: none;\n        clip: auto;\n        color-scheme: ", ";\n        columns: auto;\n        column-count: auto;\n        column-fill: balance;\n        column-gap: normal;\n        column-rule: medium none currentColor;\n        column-span: 1;\n        column-width: auto;\n        content: normal;\n        counter-increment: none;\n        counter-reset: none;\n        empty-cells: show;\n        float: none;\n        font-style: normal;\n        font-variant: normal;\n        font-weight: normal;\n        font-stretch: normal;\n        height: auto;\n        hyphens: none;\n        left: auto;\n        letter-spacing: normal;\n        list-style: disc outside none;\n        margin: 0;\n        max-height: none;\n        max-width: none;\n        min-height: 0;\n        min-width: 0;\n        opacity: 1;\n        orphans: 2;\n        overflow: visible;\n        overflow-x: visible;\n        overflow-y: visible;\n        padding: 0;\n        page-break-after: auto;\n        page-break-before: auto;\n        page-break-inside: auto;\n        perspective: none;\n        perspective-origin: 50% 50%;\n        pointer-events: auto;\n        position: static;\n        right: auto;\n        tab-size: 8;\n        table-layout: auto;\n        text-align: left;\n        text-align-last: auto;\n        text-decoration: none;\n        text-indent: 0;\n        text-shadow: none;\n        text-transform: none;\n        top: auto;\n        transform: none;\n        transform-origin: 50% 50% 0;\n        transform-style: flat;\n        transition: none 0s ease 0s;\n        user-select: auto;\n        vertical-align: baseline;\n        white-space: normal;\n        widows: 2;\n        width: auto;\n        word-spacing: normal;\n        z-index: auto;\n        /* Splunk-specific resets */\n        border-width: 1px;\n        box-sizing: border-box;\n        color: ", ";\n        cursor: inherit;\n        display: ", ";\n        font-family: ", ";\n        font-size: ", ";\n        line-height: ", ";\n        outline: medium none ", ";\n        visibility: inherit;\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * @file
 * A collection of style-related helper functions. All of them return a single object containing
 * DOM CSS properties, for example: `{ display: …, fontFamily: … }`.
 */

/**
 * The `reset` mixin resets css properties to their browser defaults, plus many to
 * theme-specific values. This ensures an element is not inheriting inappropriate styles.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { reset } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      ${reset('block')};
 *  `
 *  ```
 * @name reset
 * @kind function
 * @param {string} [display=inline] Set the `display` property (block, inline-block, …)
 * @public
 */
var reset = function reset() {
  var display = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'inline';
  return function () {
    return (0, _styledComponents.css)(_templateObject(), (0, _pick["default"])({
      /*
          use pick() rather than relying on variables.colorScheme
          because there's no guarantee that variables.colorScheme
          has to match the css color-scheme prop
      */
      dark: 'dark',
      light: 'light'
    }), (0, _pick["default"])({
      enterprise: _variables["default"].textColor,
      prisma: _variables["default"].contentColorDefault
    }), display, _variables["default"].fontFamily, _variables["default"].fontSize, _variables["default"].lineHeight, _variables["default"].focusColor);
  };
};
/**
 * `clearfix` is used on a container to ensure its height is at least as tall as any floating
 * children.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { clearfix } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      ${clearfix()};
 *  `
 *  ```
 * @public
 */


exports.reset = reset;

function clearfix() {
  return {
    '&::after': {
      display: 'table',
      content: '""',
      clear: 'both'
    }
  };
}
/**
 * Use `ellipsis` for overflowing text. Requires `display` to be set to `inline-block` or `block`.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { ellipsis } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      ${ellipsis()};
 *      width: 300px;
 *  `
 *  ```
 * @public
 */


function ellipsis() {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };
}
/**
 * Force an element to be exactly 100% wide so that it doesn't overflow the page.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printWidth100Percent } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *             ${printWidth100Percent()};
 *          }
 *      }
 *  }
 *  `
 *  ```
 *  @public
 */


function printWidth100Percent() {
  return {
    maxWidth: '100% !important',
    width: '100% !important',
    overflow: 'hidden !important'
  };
}
/**
 * Hide an element (such as a button).
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printHide } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *              ${printHide()};
 *          }
 *      }
 *  }
 *  ```
 * @public
 */


function printHide() {
  return {
    display: 'none !important'
  };
}
/**
 * Remove background gradients and images.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printNoBackground } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *              ${printNoBackground()};
 *          }
 *      }
 *  }
 *  ```
 * @public
 */


function printNoBackground() {
  return {
    background: 'none !important'
  };
}
/**
 * Ensure that all text wraps so that it doesn't overflow the page.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { printWrapAll } from '@splunk/themes/mixins';
 *
 *  const myBlock = styled.div`
 *      @media print {
 *          .myElement {
 *              ${printWrapAll()};
 *          }
 *      }
 *  }
 *  ```
 * @public
 */


function printWrapAll() {
  // TS: have to assert as CSSObject because csstype doesn't allow !important
  return {
    wordBreak: 'break-all !important',
    wordWrap: 'break-word !important',
    overflowWrap: 'break-word !important',
    whiteSpace: 'normal !important'
  };
}
/**
 * Visually hide content. Typically used to target content for assistive technologies.
 *
 *  ##### Example
 *  ``` js
 *  import screenReaderContent from '@splunk/themes/mixins';
 *
 *  .myElement {
 *      ${props => props.theme.mixins.screenReaderContent()};
 *  }
 *  ```
 * @public
 */


function screenReaderContent() {
  return {
    position: 'absolute',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    width: '1px',
    margin: '-1px',
    padding: 0,
    border: 0
  };
}

/**
 * Calculates how one color would appear over another using a normal blend mode.
 * Colors can either be strings or functions, such as variable functions.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { overlayColors } from '@splunk/themes/mixins';
 *  import { interactiveColorPrimary, interactiveColorOverlaySelected } from '@splunk/themes/variables';
 *
 *  const myButton = styled.button`
 *      background: ${overlayColors(interactiveColorPrimary, interactiveColorOverlaySelected)};
 *  `
 *  ```
 * @name overlayColors
 * @kind function
 * @param {string|function} background
 * @param {string|function} foreground The color to overlay over the background.
 * @public
 */
function overlayColors(c1, c2) {
  return function (props) {
    var c1Value = typeof c1 === 'function' ? c1(props) : c1;
    var c2Value = typeof c2 === 'function' ? c2(props) : c2;
    var c3 = (0, _colorBlend.normal)((0, _tinycolor["default"])(c1Value).toRgb(), (0, _tinycolor["default"])(c2Value).toRgb());
    return (0, _tinycolor["default"])(c3).toRgbString();
  };
}
/**
 * Sets the alpha value on a given color.
 *
 *  ##### Example
 *  ```js
 *  import styled from 'styled-components';
 *  import { colorWithAlpha } from '@splunk/themes/mixins';
 *  import { interactiveColorPrimary } from '@splunk/themes/variables';
 *
 *  const myButton = styled.button`
 *      background: ${colorWithAlpha(interactiveColorPrimary, 0.5)};
 *  `
 *  ```
 * @name colorWithAlpha
 * @kind function
 * @param {string|function} color
 * @param {number} alpha The alpha value accepts range between 0-1.
 * @public
 */


function colorWithAlpha(color, alpha) {
  return function (props) {
    var colorValue = typeof color === 'function' ? color(props) : color;

    if (false) {}

    return (0, _tinycolor["default"])(colorValue).setAlpha(alpha).toRgbString();
  };
}

var _default = {
  reset: reset,
  clearfix: clearfix,
  ellipsis: ellipsis,
  printWidth100Percent: printWidth100Percent,
  printHide: printHide,
  printNoBackground: printNoBackground,
  printWrapAll: printWrapAll,
  screenReaderContent: screenReaderContent,
  colorWithAlpha: colorWithAlpha,
  overlayColors: overlayColors
};
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/pick.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInterpolationResult = isInterpolationResult;
exports["default"] = exports.getThemeVariant = void 0;

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var valueToKey = {
  enterprise: 'family',
  prisma: 'family',
  light: 'colorScheme',
  dark: 'colorScheme',
  compact: 'density',
  comfortable: 'density'
};

function isInterpolationResult(tree) {
  // for this to work as expected for objects/CSSProperties, it may be necessary to change
  // it to only consider objects that have valid pick tree keys (but no other keys)
  // as trees
  return _typeof(tree) !== 'object' || Array.isArray(tree) || tree === null;
}
/**
 * This function is exported for use in pickVariant exclusively.
 */


var getThemeVariant = function getThemeVariant(tree, theme) {
  // If it's not an object with one of the six keys, it must be an end value.
  var treeKey = Object.keys(tree).shift();

  if (!treeKey) {
    throw new Error('A pick tree cannot be empty.');
  }

  var themeKey = valueToKey[treeKey];

  if (!themeKey) {
    throw new Error("Invalid pick tree key: ".concat(treeKey));
  } // Recursively crawl the tree.


  var themeCurrentValue = theme[themeKey];
  var treeValue = tree[themeCurrentValue]; // If it's not an object or it's a null value, it must be the end value.

  if (isInterpolationResult(treeValue)) {
    return treeValue; // this may be undefined, when the css does not support the theme
  }

  return getThemeVariant(treeValue, theme);
};
/**
 * Pick is used to create theme-specific css.
 *
 * This example selects an appropriate variable for the current theme.
 * ```
 * import { pick, variables } from '@splunk/themes';
 *
 * const Wrapper = styled.div`
 *      color: ${pick({
 *          enterprise: {
 *              light: variables.grey35,
 *              dark:  variables.grey92,
 *          },
 *          prisma: variables.contentColorDefault,
 *      })}
 * `;
 * ```
 * This example selects an appropriate block of css for the current theme.
 * ```
 *  const Label = styled.div`
 *      ${pick({
 *          enterprise: css`
 *              font-weight: ${variables.fontWeightSemiBold};
 *          `,
 *          prisma: css`
 *              color: ${variables.contentColorDefault),
 *          `,
 *      })}
 * `;
 * ```
 * @param {object} themeOptions - An object consisting of a tree of theme options (`enterprise|prisma`, `light|dark`, or `compact|comfortable`).
 * @returns {function} The returned function is called by `styled-components`, which provides the theme context.
 * @public
 */


exports.getThemeVariant = getThemeVariant;

var pick = function pick(tree) {
  return function (_ref) {
    var theme = _ref.theme;
    var themeCleaned = (0, _utils.addThemeDefaults)(theme === null || theme === void 0 ? void 0 : theme.splunkThemeV1);
    return getThemeVariant(tree, themeCleaned);
  };
};

var _default = pick;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/pickVariant.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pick = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/pick.js");

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js");

/**
 * Pick Variant is used to create theme-specific css.
 *
 * This example selects an appropriate variable for the current theme.
 * ```
 * import { pickVariant } from '@splunk/themes';
 *
 * ...
 *
 * const Wrapper = styled.div`
 *      ${pickVariant('appearance', {
 *          filled: 'background: red',
 *          open: 'border: 1px solid red',
 *      })}
 * `;
 * ```
 * This example selects an appropriate block of css for the current theme.
 * ```
 *  const Wrapper = styled.div`
 *      ${pickVariant('appearance', {
 *          filled: {
 *              enterprise: 'background: green',
 *              prisma: 'background: blue',
 *          },
 *          open: {
 *              enterprise: 'border: 1px solid green',
 *              prisma: 'border: 1px solid blue',
 *          },
 *      })}
 * `;
 * ```
 * @param {string} propName - The prop name used to resolve the variants. The prop value must be a `string` or `boolean`.
 * @param {object} themeOptions - An object consisting of a tree of theme options, with the prop variants the top of the tree and optional
 * theme variants below (`enterprise|prisma`, `light|dark`, or `compact|comfortable`).
 * @returns {function} The returned function is called by `styled-components`, which provides the props and theme context.
 * @public
 */
var pickVariant = function pickVariant(propName, tree) {
  return function (props) {
    var _props$theme;

    // TS: must assume prop value can be used as string key
    var variantKey = props[propName];
    var subTree = tree[variantKey];

    if ((0, _pick.isInterpolationResult)(subTree)) {
      return subTree;
    }

    var theme = (0, _utils.addThemeDefaults)((_props$theme = props.theme) === null || _props$theme === void 0 ? void 0 : _props$theme.splunkThemeV1);
    return (0, _pick.getThemeVariant)(subTree, theme);
  };
};

var _default = pickVariant;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tinycolor = _interopRequireDefault(__webpack_require__("./node_modules/tinycolor2/cjs/tinycolor.js"));

var _dataViz = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/dataViz.js"));

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/dark.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createPrismaBase(_ref) {
  var colorScheme = _ref.colorScheme;
  var colorSchemeVars = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  /**
   * ## Misc. colors
   *
   * @colorSet verbose
   */

  var usageColors = {
    focusColor: (0, _tinycolor["default"])(colorSchemeVars.interactiveColorPrimary).setAlpha(0.7).toRgbString(),
    transparent: 'transparent',
    linkColor: colorSchemeVars.interactiveColorPrimary
  };
  /**
   * ## Interactive state shadows
   *
   * @shadowSet
   *
   */

  var shadows = {
    hoverShadow: "0 0 0 2px ".concat(colorSchemeVars.backgroundColorPage, ", 0 0 0 5px ").concat(colorSchemeVars.interactiveColorOverlayHover),
    focusShadow: "0 0 0 2px ".concat(colorSchemeVars.backgroundColorPage, ", 0 0 0 5px ").concat(usageColors.focusColor),
    focusShadowInset: "inset 0 0 0 3px ".concat(usageColors.focusColor)
  };
  /**
   * ## Backgrounds
   *
   * @colorSet verbose
   */

  var backgrounds = {
    draggableBackground: "radial-gradient(circle at 1px 1px, ".concat(colorSchemeVars.contentColorMuted, ", ").concat(colorSchemeVars.contentColorMuted, " 1px, transparent 1px) 0 0 / 4px 6px")
  };
  var sansFontFamily = "'Splunk Platform Sans', 'Splunk Data Sans', Roboto, Droid, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  /**
   * ## Font family
   *
   * @valueSet
   */

  var fontFamily = {
    sansFontFamily: sansFontFamily,
    serifFontFamily: "Georgia, 'Times New Roman', Times, serif",
    monoFontFamily: "'Splunk Platform Mono', 'Roboto Mono', Consolas, 'Droid Sans Mono', Monaco, 'Courier New', Courier, monospace",
    fontFamily: sansFontFamily
  };
  /**
   * ## Font weights
   *
   * Based on [common weight name mappings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping)
   *
   * @valueSet
   */

  var fontWeights = {
    fontWeightLight: 300,
    fontWeightNormal: 400,
    fontWeightSemiBold: 500,
    fontWeightBold: 700,
    fontWeightHeavy: 800,
    fontWeightExtraBold: 900
  };
  /**
   * ## Layers
   * If a variable does not suit your purpose, set a value relatively, such as zindexModal +1.
   *
   * @valueSet
   */

  var zindexes = {
    zindexLayer: 1000,
    zindexFixedNavbar: 1030,
    zindexModalBackdrop: 1040,
    zindexModal: 1050,
    zindexPopover: 1060,
    zindexToastMessages: 2000
  };
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, fontFamily), fontWeights), usageColors), _dataViz["default"]), shadows), backgrounds), zindexes);
}

var _default = createPrismaBase;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/comfortable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 *
 * @valueSet
 */
var measures = {
  spacingXSmall: '4px',
  spacingSmall: '8px',
  spacingMedium: '12px',
  spacingLarge: '16px',
  spacingXLarge: '24px',
  spacingXXLarge: '32px',
  spacingXXXLarge: '40px',
  fontSizeSmall: '12px',
  fontSize: '14px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '40px',
  borderRadius: '4px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/compact.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * ## Measures
 * Spacing is used for margin on any element or padding on containers, but can be used for other
 * properties that position elements.
 * * Larger containers, such as `Card` or `Modal`, use `spacing`.
 * * `spacingHalf` and `spacingQuarter` are primarily for horizontal spacing between smaller elements.
 * * Just because a desired value equals 20, 10, or 5 pixels, does not mean it's appropriate to
 * use spacing variables.
 *
 * @valueSet
 */
var measures = {
  spacingXSmall: '4px',
  spacingSmall: '8px',
  spacingMedium: '12px',
  spacingLarge: '16px',
  spacingXLarge: '24px',
  spacingXXLarge: '32px',
  spacingXXXLarge: '40px',
  fontSizeSmall: '12px',
  fontSize: '14px',
  fontSizeLarge: '16px',
  fontSizeXLarge: '18px',
  fontSizeXXLarge: '24px',
  lineHeight: '20px',
  inputHeight: '32px',
  borderRadius: '4px'
};
var _default = measures;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/dark.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ## Background colors
 * Background colors should be used only for backgrounds of higher level sections & containers of a UI.
 *
 * @colorSet verbose
 */
var backgroundColors = {
  backgroundColorPopup: '#27292e',
  backgroundColorSection: '#1a1c20',
  backgroundColorSidebar: '#0b0c0e',
  backgroundColorPage: '#111215',
  backgroundColorNavigation: '#08090a',
  backgroundColorFloating: '#ffffff',
  backgroundColorDialog: '#1e2024',
  backgroundColorScrim: 'rgba(0, 0, 0, 0.8)'
};
/**
 * ## Content colors
 * Content colors should be used for text, icons and dividers.
 *
 * @colorSet verbose
 */

var contentColors = {
  contentColorActive: '#fafafa',
  contentColorDefault: '#b5b5b5',
  contentColorDisabled: '#6b6b6b',
  contentColorInverted: '#000000',
  contentColorMuted: '#909090'
};
/**
 * ## Interactive colors
 * Interactive colors are specifically chosen for borders and backgrounds of controls and other interactive content.
 * "Overlay" colors are intended to be placed over the default background color, such as interactiveColorPrimary.
 * If the default background color is not transparent, the `blend` mixin can be used to create a new color that combines the two.
 *
 * @colorSet verbose
 */

var interactiveColors = {
  interactiveColorPrimary: '#3993FF',
  interactiveColorBorder: 'rgba(255, 255, 255, 0.5)',
  interactiveColorBorderHover: 'rgba(255, 255, 255, 0.7)',
  interactiveColorBorderDisabled: 'rgba(255, 255, 255, 0.30)',
  interactiveColorOverlaySelected: 'rgba(255, 255, 255, 0.1)',
  interactiveColorOverlayHover: 'rgba(255, 255, 255, 0.05)',
  interactiveColorOverlayActive: 'rgba(0, 0, 0, 0.2)',
  interactiveColorOverlayDrag: 'rgba(57, 147, 255, 0.16)',
  interactiveColorBackground: '#272a2f',
  interactiveColorBackgroundDisabled: 'rgba(255, 255, 255, 0.15)'
};
/**
 * ## Neutral colors
 * Neutrals are used for dividers and as backup colors that can sparingly be used for cases, when the other defined colors are not enough.
 *
 * @colorSet verbose
 */

var neutralColors = {
  black: '#000000',
  neutral100: '#33343b',
  neutral200: '#43454b',
  neutral300: '#505158',
  neutral400: '#818285',
  neutral500: '#acacad',
  white: '#ffffff'
};
/**
 * ## Accent colors
 * Accent colors aid and categorize the visual communication of the system response.
 *
 * @colorSet verbose
 */

var accentColors = {
  accentColorPositive: '#85f415',
  accentColorWarning: '#f49106',
  accentColorAlert: '#f0581f',
  accentColorNegative: '#ff4242'
};
/**
 * ## Status colors
 * Status colors are reserved for communicating urgency and severity associated with data objects.
 *
 * @colorSet verbose
 */

var statusColors = {
  statusColorInfo: '#61cafa',
  statusColorNormal: '#85f415',
  statusColorLow: '#2cbda3',
  statusColorMedium: '#f49106',
  statusColorHigh: '#ff4242',
  statusColorCritical: '#ff3361'
};
/**
 * ## Elevation shadows
 *
 * @shadowSet
 *
 */

var elevationShadows = {
  embossShadow: '0px 1px 5px rgba(0, 0, 0, 0.35), 0px 0px 1px rgba(0, 0, 0, 0.35)',
  overlayShadow: '0px 26px 103px rgba(0, 0, 0, 0.64), 0px 11px 18px rgba(0, 0, 0, 0.32), 0px 3px 6px rgba(0, 0, 0, 0.3)',
  dragShadow: '0px 26px 103px rgba(0, 0, 0, 0.64), 0px 11px 18px rgba(0, 0, 0, 0.32), 0px 3px 6px rgba(0, 0, 0, 0.3)',
  modalShadow: '0px 50px 200px #000000, 0px 29px 66px rgba(0, 0, 0, 0.41), 0px 14px 47px rgba(0, 0, 0, 0.17), 0px 5px 10px rgba(0, 0, 0, 0.15)'
};
/**
 * ## Syntax colors
 * Syntax colors are used only for code blocks.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#6cd0f0',
  syntaxBrown: '#fccf87',
  syntaxGray: '#909090',
  syntaxGreen: '#cef06c',
  syntaxOrange: '#f7933f',
  syntaxPink: '#f494e5',
  syntaxPurple: '#ab74f1',
  syntaxRed: '#e9627f',
  syntaxTeal: '#45d4ba'
};

var theme = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, accentColors), statusColors), elevationShadows), backgroundColors), contentColors), neutralColors), interactiveColors), syntaxColors);

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/dataViz.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.highLow = exports.sequential = exports.divergent = exports.categorical = exports.staticColors = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  ## Data viz
 *
 * Colors should be used in their prescribed order.
 * Don't mix-and-match between sets in the same visualization.
 *
 * ### Static colors
 *
 * @colorSet verbose
 */
var staticColors = {
  static1: '#7B56DB',
  static2: '#009CEB',
  static3: '#00CDAF',
  static4: '#DD9900',
  static5: '#FF677B',
  static6: '#CB2196',
  static7: '#813193',
  static8: '#0051B5',
  static9: '#008C80',
  static10: '#99B100',
  static11: '#FFA476',
  static12: '#FF6ACE',
  static13: '#AE8CFF',
  static14: '#00689D',
  static15: '#00490A',
  static16: '#465D00',
  static17: '#9D6300',
  static18: '#F6540B',
  static19: '#FF969E',
  static20: '#E47BFE'
};
/**
 * ### Categorical 1D
 *
 * @colorSet verbose
 */

exports.staticColors = staticColors;
var categorical1D = {
  categorical1D1: '#5C33FF',
  categorical1D2: '#207865',
  categorical1D3: '#AD3F20',
  categorical1D4: '#003E80',
  categorical1D5: '#78062A',
  categorical1D6: '#2F8811',
  categorical1D7: '#555555'
};
/**
 * ### Categorical 1L
 *
 * @colorSet verbose
 */

var categorical1L = {
  categorical1L1: '#9980FF',
  categorical1L2: '#45D4BA',
  categorical1L3: '#FB865C',
  categorical1L4: '#66AAF9',
  categorical1L5: '#E85B79',
  categorical1L6: '#88EE66',
  categorical1L7: '#F0B000'
};
/**
 * ### Categorical 2D
 *
 * @colorSet verbose
 */

var categorical2D = {
  categorical2D1: '#1F4D5B',
  categorical2D2: '#CC0AD6',
  categorical2D3: '#017FA2',
  categorical2D4: '#D81E5B',
  categorical2D5: '#621FFF',
  categorical2D6: '#348350',
  categorical2D7: '#555555'
};
/**
 * ### Categorical 2L
 *
 * @colorSet verbose
 */

var categorical2L = {
  categorical2L1: '#5599BE',
  categorical2L2: '#FB9DFB',
  categorical2L3: '#00BBEE',
  categorical2L4: '#EE3399',
  categorical2L5: '#9980FF',
  categorical2L6: '#5FBF7F',
  categorical2L7: '#F58B00'
};

var categorical = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, categorical1D), categorical1L), categorical2D), categorical2L);
/**
 * ### Divergent 1D
 *
 * @colorSet verbose
 */


exports.categorical = categorical;
var divergent1D = {
  divergent1D1: '#118832',
  divergent1D2: '#1C6B2D',
  divergent1D3: '#284D27',
  divergent1D4: '#333022',
  divergent1D5: '#692A21',
  divergent1D6: '#9E2520',
  divergent1D7: '#D41F1F'
};
/**
 * ### Divergent 1L
 *
 * @colorSet verbose
 */

var divergent1L = {
  divergent1L1: '#08AE37',
  divergent1L2: '#55C169',
  divergent1L3: '#A1D59C',
  divergent1L4: '#EEE8CE',
  divergent1L5: '#F4BAA9',
  divergent1L6: '#F98C83',
  divergent1L7: '#FF5E5E'
};
/**
 * ### Divergent 2D
 *
 * @colorSet verbose
 */

var divergent2D = {
  divergent2D1: '#0070F3',
  divergent2D2: '#115BAD',
  divergent2D3: '#224468',
  divergent2D4: '#333022',
  divergent2D5: '#692A21',
  divergent2D6: '#9E2520',
  divergent2D7: '#D41F1F'
};
/**
 * ### Divergent 2L
 *
 * @colorSet verbose
 */

var divergent2L = {
  divergent2L1: '#2A99FF',
  divergent2L2: '#6BB3EE',
  divergent2L3: '#ADCCDD',
  divergent2L4: '#EEE8CE',
  divergent2L5: '#F4BAA9',
  divergent2L6: '#F98C83',
  divergent2L7: '#FF5E5E'
};
/**
 * ### Divergent 3D
 *
 * @colorSet verbose
 */

var divergent3D = {
  divergent3D1: '#299986',
  divergent3D2: '#277C52',
  divergent3D3: '#24551F',
  divergent3D4: '#333022',
  divergent3D5: '#422879',
  divergent3D6: '#602CA1',
  divergent3D7: '#8747DA'
};
/**
 * ### Divergent 3L
 *
 * @colorSet verbose
 */

var divergent3L = {
  divergent3L1: '#14846C',
  divergent3L2: '#45D4BA',
  divergent3L3: '#9ADEC4',
  divergent3L4: '#EEE8CE',
  divergent3L5: '#D7BEE4',
  divergent3L6: '#C093F9',
  divergent3L7: '#9156DD'
};
/**
 * ### Divergent 4D
 *
 * @colorSet verbose
 */

var divergent4D = {
  divergent4D1: '#0D8387',
  divergent4D2: '#1A6765',
  divergent4D3: '#264C44',
  divergent4D4: '#333022',
  divergent4D5: '#693623',
  divergent4D6: '#9F3B23',
  divergent4D7: '#D54124'
};
/**
 * ### Divergent 4L
 *
 * @colorSet verbose
 */

var divergent4L = {
  divergent4L1: '#008287',
  divergent4L2: '#2EA39B',
  divergent4L3: '#5CC3AF',
  divergent4L4: '#EEE8CE',
  divergent4L5: '#ECA14E',
  divergent4L6: '#E3723A',
  divergent4L7: '#DA4325'
};

var divergent = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, divergent1D), divergent1L), divergent2D), divergent2L), divergent3D), divergent3L), divergent4D), divergent4L);
/**
 * ### Sequential 1D
 *
 * @colorSet verbose
 */


exports.divergent = divergent;
var sequential1D = {
  sequential1D1: '#118832',
  sequential1D2: '#669922',
  sequential1D3: '#9D9F0D',
  sequential1D4: '#CBA700',
  sequential1D5: '#D97A0D',
  sequential1D6: '#D94E17',
  sequential1D7: '#D41F1F'
};
/**
 * ### Sequential 1L
 *
 * @colorSet verbose
 */

var sequential1L = {
  sequential1L1: '#088F44',
  sequential1L2: '#2EB82E',
  sequential1L3: '#C3CC33',
  sequential1L4: '#FFD442',
  sequential1L5: '#FFA857',
  sequential1L6: '#FF7149',
  sequential1L7: '#FE3A3A'
};
/**
 * ### Sequential 2D
 *
 * @colorSet verbose
 */

var sequential2D = {
  sequential2D1: '#333022',
  sequential2D2: '#3D2830',
  sequential2D3: '#562E4C',
  sequential2D4: '#6F3468',
  sequential2D5: '#873A83',
  sequential2D6: '#A0409F',
  sequential2D7: '#B846BB'
};
/**
 * ### Sequential 2L
 *
 * @colorSet verbose
 */

var sequential2L = {
  sequential2L1: '#EEE8CE',
  sequential2L2: '#E8C7CE',
  sequential2L3: '#E1A6CD',
  sequential2L4: '#DB86CD',
  sequential2L5: '#D465CD',
  sequential2L6: '#CE44CC',
  sequential2L7: '#C723CC'
};
/**
 * ### Sequential 3D
 *
 * @colorSet verbose
 */

var sequential3D = {
  sequential3D1: '#333022',
  sequential3D2: '#253223',
  sequential3D3: '#244333',
  sequential3D4: '#245442',
  sequential3D5: '#246451',
  sequential3D6: '#237561',
  sequential3D7: '#238570'
};
/**
 * ### Sequential 3L
 *
 * @colorSet verbose
 */

var sequential3L = {
  sequential3L1: '#EEE8CE',
  sequential3L2: '#B6ECD4',
  sequential3L3: '#7EEFDA',
  sequential3L4: '#45D4BA',
  sequential3L5: '#35B9A0',
  sequential3L6: '#249F86',
  sequential3L7: '#14846C'
};
/**
 * ### Sequential 4D
 *
 * @colorSet verbose
 */

var sequential4D = {
  sequential4D1: '#333022',
  sequential4D2: '#442519',
  sequential4D3: '#64271F',
  sequential4D4: '#832A24',
  sequential4D5: '#A0312E',
  sequential4D6: '#BD3737',
  sequential4D7: '#DA3B30'
};
/**
 * ### Sequential 4L
 *
 * @colorSet verbose
 */

var sequential4L = {
  sequential4L1: '#EEE8CE',
  sequential4L2: '#F5CEBF',
  sequential4L3: '#FCB4B0',
  sequential4L4: '#F99C96',
  sequential4L5: '#F6847C',
  sequential4L6: '#DF564D',
  sequential4L7: '#DD2E2E'
};
/**
 * ### Sequential 5D
 *
 * @colorSet verbose
 */

var sequential5D = {
  sequential5D1: '#2E2E55',
  sequential5D2: '#4B1773',
  sequential5D3: '#77136A',
  sequential5D4: '#A81A45',
  sequential5D5: '#D24620',
  sequential5D6: '#D97A0D',
  sequential5D7: '#CBA700'
};
/**
 * ### Sequential 5L
 *
 * @colorSet verbose
 */

var sequential5L = {
  sequential5L1: '#EEE8CE',
  sequential5L2: '#F2DD88',
  sequential5L3: '#FFC355',
  sequential5L4: '#FF9D66',
  sequential5L5: '#FF7777',
  sequential5L6: '#EE4477',
  sequential5L7: '#DD22BB'
};
/**
 * ### Sequential 6D
 *
 * @colorSet verbose
 */

var sequential6D = {
  sequential6D1: '#1C3355',
  sequential6D2: '#005580',
  sequential6D3: '#007575',
  sequential6D4: '#118832',
  sequential6D5: '#669922',
  sequential6D6: '#9D9F0D',
  sequential6D7: '#CBA700'
};
/**
 * ### Sequential 6L
 *
 * @colorSet verbose
 */

var sequential6L = {
  sequential6L1: '#EEE8CE',
  sequential6L2: '#E7E755',
  sequential6L3: '#A3E052',
  sequential6L4: '#0AD647',
  sequential6L5: '#00BBBB',
  sequential6L6: '#1182F3',
  sequential6L7: '#6666DD'
};

var sequential = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, sequential1D), sequential1L), sequential2D), sequential2L), sequential3D), sequential3L), sequential4D), sequential4L), sequential5D), sequential5L), sequential6D), sequential6L);
/**
 * ### High low 1D
 *
 * @colorSet verbose
 */


exports.sequential = sequential;
var highLow1D = {
  highLow1DHigh: '#1C6B2D',
  highLow1DLow: '#9E2520'
};
/**
 * ### High low 1L
 *
 * @colorSet verbose
 */

var highLow1L = {
  highLow1LHigh: '#55C169',
  highLow1LLow: '#F98C83'
};
/**
 * ### High low 2D
 *
 * @colorSet verbose
 */

var highLow2D = {
  highLow2DHigh: '#115BAD',
  highLow2DLow: '#9E2520'
};
/**
 * ### High low 2L
 *
 * @colorSet verbose
 */

var highLow2L = {
  highLow2LHigh: '#6BB3EE',
  highLow2LLow: '#F98C83'
};
/**
 * ### High low 3D
 *
 * @colorSet verbose
 */

var highLow3D = {
  highLow3DHigh: '#277C52',
  highLow3DLow: '#602CA1'
};
/**
 * ### High low 3L
 *
 * @colorSet verbose
 */

var highLow3L = {
  highLow3LHigh: '#45D4BA',
  highLow3LLow: '#C093F9'
};
/**
 * ### High low 4D
 *
 * @colorSet verbose
 */

var highLow4D = {
  highLow4DHigh: '#1A6765',
  highLow4DLow: '#9F3B23'
};
/**
 * ### High low 4L
 *
 * @colorSet verbose
 */

var highLow4L = {
  highLow4LHigh: '#2EA39B',
  highLow4LLow: '#E3723A'
};

var highLow = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, highLow1D), highLow1L), highLow2D), highLow2L), highLow3D), highLow3L), highLow4D), highLow4L);

exports.highLow = highLow;

var dataViz = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, staticColors), categorical), divergent), sequential), highLow);

var _default = dataViz;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _light = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/light.js"));

var _dark = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/dark.js"));

var _compact = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/compact.js"));

var _comfortable = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/comfortable.js"));

var _base = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/base.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createPrismaTheme(_ref) {
  var colorScheme = _ref.colorScheme,
      density = _ref.density;
  var colorSchemeVars = {
    light: _light["default"],
    dark: _dark["default"]
  }[colorScheme];
  var densityVars = {
    compact: _compact["default"],
    comfortable: _comfortable["default"]
  }[density];
  var prismaBase = (0, _base["default"])({
    colorScheme: colorScheme
  });
  return _objectSpread(_objectSpread(_objectSpread({}, prismaBase), colorSchemeVars), densityVars);
}

var _default = createPrismaTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/prisma/light.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ## Background colors
 * Background colors should be used only for backgrounds of higher level sections & containers of a UI.
 *
 * @colorSet verbose
 */
var backgroundColors = {
  backgroundColorPopup: '#ffffff',
  backgroundColorSection: '#ffffff',
  backgroundColorSidebar: '#f8f8f8',
  backgroundColorPage: '#f9f9f9',
  backgroundColorNavigation: '#f7f7f7',
  backgroundColorFloating: '#000000',
  backgroundColorDialog: '#ffffff',
  backgroundColorScrim: 'rgba(255, 255, 255, 0.75)'
};
/**
 * ## Content colors
 * Content colors should be used for text, icons and dividers.
 *
 * @colorSet verbose
 */

var contentColors = {
  contentColorActive: '#2c2c2c',
  contentColorDefault: '#4d4d4d',
  contentColorDisabled: '#878787',
  contentColorInverted: '#ffffff',
  contentColorMuted: '#6b6b6b'
};
/**
 * ## Interactive colors
 * Interactive colors are specifically chosen for borders and backgrounds of controls and other interactive content.
 * "Overlay" colors are intended to be placed over the default background color, such as interactiveColorPrimary.
 * If the default background color is not transparent, the `blend` mixin can be used to create a new color that combines the two.
 *
 * @colorSet verbose
 */

var interactiveColors = {
  interactiveColorPrimary: '#0264d7',
  interactiveColorBorder: 'rgba(0, 0, 0, 0.4)',
  interactiveColorBorderHover: 'rgba(0, 0, 0, 0.6)',
  interactiveColorBorderDisabled: 'rgba(0, 0, 0, 0.3)',
  interactiveColorOverlaySelected: 'rgba(0, 0, 0, 0.04)',
  interactiveColorOverlayHover: 'rgba(0, 0, 0, 0.03)',
  interactiveColorOverlayActive: 'rgba(0, 0, 0, 0.07)',
  interactiveColorOverlayDrag: 'rgba(2, 100, 215, 0.16)',
  interactiveColorBackground: '#eeeeee',
  interactiveColorBackgroundDisabled: 'rgba(0, 0, 0, 0.1)'
};
/**
 * ## Neutral colors
 * Neutrals are used for dividers and as backup colors that can sparingly be used for cases, when the other defined colors are not enough.
 *
 * @colorSet verbose
 */

var neutralColors = {
  white: '#ffffff',
  neutral100: '#f0f0f0',
  neutral200: '#e6e6e6',
  neutral300: '#dddddd',
  neutral400: '#cacaca',
  neutral500: '#b8b8b8',
  black: '#000000'
};
/**
 * ## Accent colors
 * Accent colors aid and categorize the visual communication of the system response.
 *
 * @colorSet verbose
 */

var accentColors = {
  accentColorPositive: '#407a06',
  accentColorWarning: '#c97705',
  accentColorAlert: '#c6400d',
  accentColorNegative: '#e00000'
};
/**
 * ## Status colors
 * Status colors are reserved for communicating urgency and severity associated with data objects.
 *
 * @colorSet verbose
 */

var statusColors = {
  statusColorInfo: '#006be5',
  statusColorNormal: '#407a06',
  statusColorLow: '#155a4e',
  statusColorMedium: '#c97705',
  statusColorHigh: '#e00000',
  statusColorCritical: '#9e1534'
};
/**
 * ## Elevation shadows
 *
 * @shadowSet
 *
 */

var elevationShadows = {
  embossShadow: ' 0px 1px 5px rgba(0, 0, 0, 0.07), 0px 0px 1px rgba(0, 0, 0, 0.07)',
  overlayShadow: '0px 26px 103px rgba(0, 0, 0, 0.13), 0px 11px 18px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.06)',
  dragShadow: '0px 26px 103px rgba(0, 0, 0, 0.13), 0px 11px 18px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.06)',
  modalShadow: '0px 50px 200px rgba(0, 0, 0, 0.3), 0px 29px 66px rgba(0, 0, 0, 0.08), 0px 29px 47px rgba(0, 0, 0, 0.08), 0px 5px 10px rgba(0, 0, 0, 0.03)'
};
/**
 * ## Syntax colors
 * Syntax colors are used only for code blocks.
 *
 * @colorSet verbose alphabetical
 */

var syntaxColors = {
  syntaxBlue: '#0f7594',
  syntaxBrown: '#9f6404',
  syntaxGray: '#6b6b6b',
  syntaxGreen: '#5c780c',
  syntaxOrange: '#ba4f08',
  syntaxPink: '#cc15ae',
  syntaxPurple: '#7b4df5',
  syntaxRed: '#db1e47',
  syntaxTeal: '#1d7c6b'
};

var theme = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, accentColors), statusColors), elevationShadows), backgroundColors), contentColors), neutralColors), interactiveColors), syntaxColors);

var _default = theme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/types.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/useSplunkTheme.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = __webpack_require__("./node_modules/react/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * React hook that allows theme variables to be easily used within a React functional component.
 * This includes the basic configuration of `family`, `colorScheme` and `density`,
 * as well as all the specific variables available in that theme.
 *
 * If no data `SplunkThemeProvider` was configured, the Prisma Dark Comfortable theme is returned.
 *
 * ```
 * import useSplunkTheme from '@splunk/themes/useSplunkTheme';
 * ...
 * export function() {
 *     const { isComfortable, focusColor } = useSplunkTheme();
 *
 *     const style = {
 *         color: focusColor,
 *         padding: isComfortable ? '10px' : '5px',
 *     }
 *
 *     ...
 *
 *     return (
 *         <div style={style}>
 *             Hello
 *         </div>
 *     )
 * }
 * ```
 * @public
 */
var useSplunkTheme = function useSplunkTheme() {
  var _ref = (0, _react.useContext)(_styledComponents.ThemeContext) || {},
      _ref$splunkThemeV = _ref.splunkThemeV1,
      splunkThemeV1 = _ref$splunkThemeV === void 0 ? {} : _ref$splunkThemeV,
      rest = _objectWithoutProperties(_ref, ["splunkThemeV1"]);

  var family = splunkThemeV1.family,
      colorScheme = splunkThemeV1.colorScheme,
      density = splunkThemeV1.density,
      customizer = splunkThemeV1.customizer;
  return _objectSpread(_objectSpread({}, rest), (0, _utils.getCustomizedTheme)({
    family: family,
    colorScheme: colorScheme,
    density: density
  }, customizer));
};

var _default = useSplunkTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomizedTheme = exports.addThemeDefaults = void 0;

var _memoize = _interopRequireDefault(__webpack_require__("./node_modules/lodash/memoize.js"));

var _getTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/getTheme.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Accepts a theme object and returns supported values and defaults.
 * @private
 */
var addThemeDefaults = function addThemeDefaults() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$family = _ref.family,
      family = _ref$family === void 0 ? 'prisma' : _ref$family,
      _ref$colorScheme = _ref.colorScheme,
      colorScheme = _ref$colorScheme === void 0 ? 'dark' : _ref$colorScheme,
      _ref$density = _ref.density,
      density = _ref$density === void 0 ? 'comfortable' : _ref$density,
      _ref$isPrisma = _ref.isPrisma,
      isPrisma = _ref$isPrisma === void 0 ? true : _ref$isPrisma,
      _ref$isEnterprise = _ref.isEnterprise,
      isEnterprise = _ref$isEnterprise === void 0 ? false : _ref$isEnterprise,
      _ref$isComfortable = _ref.isComfortable,
      isComfortable = _ref$isComfortable === void 0 ? true : _ref$isComfortable,
      _ref$isCompact = _ref.isCompact,
      isCompact = _ref$isCompact === void 0 ? false : _ref$isCompact,
      _ref$isDark = _ref.isDark,
      isDark = _ref$isDark === void 0 ? true : _ref$isDark,
      _ref$isLight = _ref.isLight,
      isLight = _ref$isLight === void 0 ? false : _ref$isLight;

  return {
    family: family,
    colorScheme: colorScheme,
    density: density,
    isPrisma: isPrisma,
    isEnterprise: isEnterprise,
    isComfortable: isComfortable,
    isCompact: isCompact,
    isDark: isDark,
    isLight: isLight
  };
};

exports.addThemeDefaults = addThemeDefaults;

function getCustomizedThemeUnmemo(settings, customizer) {
  var variables = (0, _getTheme["default"])(settings);

  if (!customizer) {
    return variables;
  }

  return customizer(variables);
}
/**
 * Accepts a theme object and customizer, and returns supported values and defaults.
 * @private
 */


var getCustomizedTheme = (0, _memoize["default"])(getCustomizedThemeUnmemo, function () {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      family = _ref2.family,
      colorScheme = _ref2.colorScheme,
      density = _ref2.density;

  var customizer = arguments.length > 1 ? arguments[1] : undefined;
  return "".concat(family, "-").concat(colorScheme, "-").concat(density, "-").concat(!!customizer);
});
exports.getCustomizedTheme = getCustomizedTheme;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/variables.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearVariablesCache = exports["default"] = void 0;

var _memoize = _interopRequireDefault(__webpack_require__("./node_modules/lodash/memoize.js"));

var _getTheme = _interopRequireDefault(__webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/getTheme.js"));

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @file
 * ## Theme Variables
 * All variables are available in one util for use in styled-component templates.
 * Each variable is a function which styled-components will call with the available theme information.
 * If there is no SplunkThemeProvider, variables will default to Prisma Dark Comfortable.
 *
 * Variables will return `undefined` if the variable does not exist in the current theme.
 * ```
 * import variables from '@splunk/themes/variables';
 * import styled from 'styled-components';
 * ...
 * const PrismaWrapper = styled.div`
 *     color: ${variables.contentColorDefault};
 * `;
 * ```
 *
 * Variables may also be imported individually.
 * ```
 * import { contentColorDefault } from '@splunk/themes/variables';
 * import styled from 'styled-components';
 * ...
 * const PrismaWrapper = styled.div`
 *     color: ${contentColorDefault};
 * `;
 * ```
 *
 * This function must be used in conjunction with `pick` if different variables are needed in different themes.
 * ```
 * import { pick, variables } from '@splunk/themes';
 * import styled from 'styled-components';
 *
 * const Wrapper = styled.div`
 *     color: ${pick({
 *          enterprise: variables.textColor,
 *          prisma: variables.contentColorDefault
 *     });
 * `;
 * ```
 * ## Custom Variables
 * Custom variables cannot be added to this package. However, `pick()` can be used to create sets of
 * theme variables. These can be then be imported separately and used as above.
 * ```
 * import pick from '@splunk/themes/pick';
 *
 * export const myVariables = {
 *    orange: pick({
 *        light: '#C80',
 *        dark: '#F90',
 *    }),
 *    space: pick({
 *        enterprise: '20px',
 *        prisma: {
 *            comfortable: '16px',
 *            compact: '12px',
 *        },
 *    }),
 * };
 * ```
 */
var getThemeVariable = function getThemeVariable(name, settings, customizer) {
  var theme = (0, _utils.getCustomizedTheme)(settings, customizer);
  var returnValue = theme[name];

  if (false) {}

  return returnValue;
};

var getThemeVariableMemoized = (0, _memoize["default"])(getThemeVariable, function (name, _ref, customizer) {
  var family = _ref.family,
      colorScheme = _ref.colorScheme,
      density = _ref.density;
  return "".concat(name, "-").concat(family, "-").concat(colorScheme, "-").concat(density, "-").concat(!!customizer);
});

var clearVariablesCache = function clearVariablesCache() {
  var _getThemeVariableMemo, _getThemeVariableMemo2;

  return (_getThemeVariableMemo = (_getThemeVariableMemo2 = getThemeVariableMemoized.cache).clear) === null || _getThemeVariableMemo === void 0 ? void 0 : _getThemeVariableMemo.call(_getThemeVariableMemo2);
};
/**
 * The `get` helper will insert a theme variable into a `styled-components` css template.
 * Note, this will return `undefined` if the variable does not exist in the current theme.
 * This function must be used in conjunction with `pick` if different variables are needed in different themes.
 * ```
 * import get from '@splunk/themes/get';
 * ...
 * const Wrapper = styled.div`
 *     color: ${get('contentColorDefaultDefault')}; // prisma theme only
 * `;
 * ```
 * @param {string} name - The name of the variable to get from the current theme configuration.
 * @returns {function} The returned function is called by `styled-components`, which provides the theme context.
 * @private
 */


exports.clearVariablesCache = clearVariablesCache;

var get = function get(name) {
  return function (_ref2) {
    var _ref2$theme = _ref2.theme;
    _ref2$theme = _ref2$theme === void 0 ? {} : _ref2$theme;
    var splunkThemeV1 = _ref2$theme.splunkThemeV1;

    var _ref3 = splunkThemeV1 || {},
        family = _ref3.family,
        colorScheme = _ref3.colorScheme,
        density = _ref3.density,
        customizer = _ref3.customizer;

    return getThemeVariableMemoized(name, {
      family: family,
      colorScheme: colorScheme,
      density: density
    }, customizer);
  };
};

var variableNames = Object.keys(_objectSpread(_objectSpread({}, (0, _getTheme["default"])({
  family: 'prisma'
})), (0, _getTheme["default"])({
  family: 'enterprise'
}))); // each variable is converted to a get() function.
// TS: The AllVariables type allows safe access to all variables shared across themes,
// and unsafe access to variables exclusive to Enterprise or Prisma

var variables = variableNames.reduce(function (acc, currentValue) {
  // using defineProperty instead of acc[currentValue] to work around readonly issue
  Object.defineProperty(acc, currentValue, {
    value: get(currentValue)
  });
  return acc;
}, {});
var _default = variables;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/withSplunkTheme.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__("./node_modules/react/index.js"));

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

var _utils = __webpack_require__("./node_modules/@splunk/react-toast-notifications/node_modules/@splunk/themes/utils.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// implementation for both

/**
 * `withSplunkTheme` allows theme variables to be used within a React class component.
 * This includes the basic configuration of `family`, `colorScheme` and `density`,
 * as well as all the specific variables available in that theme.
 *
 * If no data `SplunkThemeProvider` was configured, the Prisma Dark Comfortable theme is returned.
 *
 * ```
 * import React, { Component } from 'react';
 * import PropTypes from 'prop-types';
 * import withSplunkTheme from '@splunk/themes/withSplunkTheme';
 *
 *
 * class MyComponent extends Component {
 *     static propTypes = {
 *         splunkTheme: PropTypes.object,
 *     };
 *
 *     render() {
 *         const { isComfortable, focusColor } = this.props.splunkTheme;
 *
 *         const style = {
 *             color: focusColor,
 *             padding: isComfortable ? '10px' : '5px',
 *         }
 *
 *         return (
 *             <div style={style}>
 *                 Hello
 *             </div>
 *         )
 *     }
 * }
 *
 * const MyComponentWithTheme = withSplunkTheme(MyComponent);
 * MyComponentWithTheme.propTypes = MyComponent.propTypes;
 *
 * export default MyComponentWithTheme;
 *
 * ```
 * @name withSplunkTheme
 * @function
 * @public
 */
function withSplunkTheme( // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
Component) {
  var ComponentWithSplunkTheme = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
    var _ref = (0, _react.useContext)(_styledComponents.ThemeContext) || {},
        splunkThemeV1 = _ref.splunkThemeV1,
        rest = _objectWithoutProperties(_ref, ["splunkThemeV1"]);

    var _ref2 = splunkThemeV1 || {},
        family = _ref2.family,
        colorScheme = _ref2.colorScheme,
        density = _ref2.density,
        customizer = _ref2.customizer;

    var themeSettings = (0, _utils.addThemeDefaults)({
      family: family,
      colorScheme: colorScheme,
      density: density
    });

    var splunkTheme = _objectSpread(_objectSpread({}, rest), (0, _utils.getCustomizedTheme)(themeSettings, customizer));

    return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
      ref: ref,
      splunkTheme: splunkTheme
    }));
  });

  var displayName = Component.displayName || Component.name || 'Component';
  ComponentWithSplunkTheme.displayName = "withSplunkTheme(".concat(displayName, ")");
  return ComponentWithSplunkTheme;
} // see https://github.com/Microsoft/TypeScript/issues/28938 for the two "as T" assertions above


var _default = withSplunkTheme;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/@splunk/react-ui/File.js":
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
  return __webpack_require__(__webpack_require__.s = 94);
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
  /***/11: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/Clickable.js");

    /***/
  }),
  /***/14: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/react-event-listener/dist/react-event-listener.cjs.js");

    /***/
  }),
  /***/2: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/react/index.js");

    /***/
  }),
  /***/27: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-icons/SVG.js");

    /***/
  }),
  /***/3: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");

    /***/
  }),
  /***/33: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-icons/Remove.js");

    /***/
  }),
  /***/4: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/lodash/lodash.js");

    /***/
  }),
  /***/57: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/Progress.js");

    /***/
  }),
  /***/7: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js");

    /***/
  }),
  /***/9: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/Box.js");

    /***/
  }),
  /***/94: ( /***/function (module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);

    // EXTERNAL MODULE: external "react"
    var external_react_ = __webpack_require__(2);
    var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

    // EXTERNAL MODULE: external "prop-types"
    var external_prop_types_ = __webpack_require__(1);
    var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_);

    // EXTERNAL MODULE: external "react-event-listener"
    var external_react_event_listener_ = __webpack_require__(14);
    var external_react_event_listener_default = /*#__PURE__*/__webpack_require__.n(external_react_event_listener_);

    // EXTERNAL MODULE: external "lodash"
    var external_lodash_ = __webpack_require__(4);

    // EXTERNAL MODULE: external "styled-components"
    var external_styled_components_ = __webpack_require__(3);
    var external_styled_components_default = /*#__PURE__*/__webpack_require__.n(external_styled_components_);

    // EXTERNAL MODULE: external "@splunk/ui-utils/i18n"
    var i18n_ = __webpack_require__(7);

    // EXTERNAL MODULE: external "@splunk/ui-utils/id"
    var id_ = __webpack_require__(10);

    // EXTERNAL MODULE: external "@splunk/react-ui/themes"
    var themes_ = __webpack_require__(0);

    // EXTERNAL MODULE: external "@splunk/react-icons/Remove"
    var Remove_ = __webpack_require__(33);
    var Remove_default = /*#__PURE__*/__webpack_require__.n(Remove_);

    // EXTERNAL MODULE: external "@splunk/react-ui/Progress"
    var Progress_ = __webpack_require__(57);
    var Progress_default = /*#__PURE__*/__webpack_require__.n(Progress_);

    // EXTERNAL MODULE: external "@splunk/react-ui/Box"
    var Box_ = __webpack_require__(9);
    var Box_default = /*#__PURE__*/__webpack_require__.n(Box_);

    // EXTERNAL MODULE: external "@splunk/react-ui/Clickable"
    var Clickable_ = __webpack_require__(11);
    var Clickable_default = /*#__PURE__*/__webpack_require__.n(Clickable_);

    // CONCATENATED MODULE: ./src/File/ItemStyles.js

    var StyledBox = external_styled_components_default()(Box_default.a).withConfig({
      displayName: "ItemStyles__StyledBox",
      componentId: "mltk-sc-1b84262-0"
    })(["position:relative;width:100%;max-width:400px;margin:", " auto 0;background-color:", ";line-height:24px;border-radius:", ";min-height:32px;color:", ";&[data-size='small']{min-height:24px;line-height:", ";font-size:", ";}&[data-error]{background-color:", ";box-shadow:inset 0 0 0 1px ", ";}"], Object(themes_["variable"])('spacingQuarter'), Object(themes_["variable"])('File', 'Item', 'boxBackgroundColor'), Object(themes_["variable"])('File', 'Item', 'borderRadius'), Object(themes_["variable"])('File', 'Item', 'boxColor'), Object(themes_["variable"])('lineHeight'), Object(themes_["variable"])('fontSizeSmall'), Object(themes_["variable"])('File', 'Item', 'labelErrorBackgroundColor'), Object(themes_["variable"])('errorColor'));
    var scpRemoveClickableStyle = Object(external_styled_components_["css"])(["color:", ";width:24px;height:24px;display:flex;align-items:center;justify-content:center;position:absolute;top:4px;right:4px;background-color:", ";"], Object(themes_["variable"])('white'), Object(themes_["variable"])('File', 'Item', 'removeClickableBackgroundColor'));
    var StyledRemoveClickable = external_styled_components_default()(Clickable_default.a).withConfig({
      displayName: "ItemStyles__StyledRemoveClickable",
      componentId: "mltk-sc-1b84262-1"
    })(["color:inherit;flex:", ";border-radius:", ";padding:", ";text-align:center;height:inherit;", " [data-size='small'] > &{padding:3px 0;flex-basis:", ";", "}[data-error] > &{border:", ";border-left:none;background-color:", ";}&:focus{box-shadow:", ";background-color:", ";color:", ";&[data-error]{background-color:", ";}}&:hover{background-color:", ";color:", ";&[data-error]{background-color:", ";}}"], Object(themes_["variable"])('File', 'Item', 'flex'), Object(themes_["variable"])('File', 'Item', 'removeClickableBorderRadius'), Object(themes_["variable"])('File', 'Item', 'removeClickablePadding'), function (_ref) {
      var itemRemoveable = _ref.itemRemoveable;
      return itemRemoveable && scpRemoveClickableStyle;
    }, Object(themes_["variable"])('File', 'Item', 'removeClickableSmallFlexBasis'), function (_ref2) {
      var itemRemoveable = _ref2.itemRemoveable;
      return itemRemoveable && Object(external_styled_components_["css"])(["top:", ";"], Object(themes_["variable"])('File', 'Item', 'removeClickableSmallTop'));
    }, Object(themes_["variable"])('File', 'Item', 'removeClickableErrorBorder'), Object(themes_["variable"])('File', 'Item', 'removeClickableErrorBackgroundColor'), Object(themes_["variable"])('File', 'Item', 'removeClickableFocusShadow'), Object(themes_["variable"])('File', 'Item', 'removeClickableFocusBackgroundColor'), Object(themes_["variable"])('File', 'Item', 'removeClickableFocusColor'), Object(themes_["variable"])('File', 'Item', 'removeClickableErrorFocusBackgroundColor'), Object(themes_["variable"])('File', 'Item', 'removeClickableHoverBackgroundColor'), Object(themes_["variable"])('File', 'Item', 'removeClickableHoverColor'), Object(themes_["variable"])('File', 'Item', 'removeClickableErrorHoverBackgroundColor'));
    var StyledLabel = external_styled_components_default.a.div.withConfig({
      displayName: "ItemStyles__StyledLabel",
      componentId: "mltk-sc-1b84262-2"
    })(["color:", ";font-size:", ";overflow:hidden;white-space:nowrap;text-overflow:ellipsis;flex:1 0 0px;padding:", ";border-radius:", ";[data-disabled] > &{background-color:", ";color:", ";cursor:not-allowed;}"], Object(themes_["variable"])('File', 'Item', 'labelColor'), Object(themes_["variable"])('File', 'Item', 'fontSize'), Object(themes_["variable"])('File', 'Item', 'padding'), Object(themes_["variable"])('File', 'Item', 'borderRadius'), Object(themes_["variable"])('File', 'Item', 'labelDisabledBackgroundColor'), Object(themes_["variable"])('File', 'Item', 'labelDisabledTextColor'));

    // CONCATENATED MODULE: ./src/File/Item.jsx
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
      /** @private */
      disabled: external_prop_types_default.a.bool,
      /**
       * Invoked with the DOM element when the component mounts and null when it unmounts.
       */
      elementRef: external_prop_types_default.a.func,
      /** Show the Item in an error state. */
      error: external_prop_types_default.a.bool,
      /** A unique for this file. */
      itemId: external_prop_types_default.a.any,
      /** The name is displayed on the item. */
      name: external_prop_types_default.a.string.isRequired,
      /** @private */
      onClick: external_prop_types_default.a.func,
      /** @private */
      size: external_prop_types_default.a.oneOf(['small', 'medium']),
      /** @private */
      theme: external_prop_types_default.a.object,
      /** If the uploadPercentage is 0, the item is assumed to be queued. If the upload is complete or
       * not applicable, uploadPercentage must be undefined. */
      uploadPercentage: external_prop_types_default.a.number
    };
    var defaultProps = {
      disabled: false,
      error: false,
      theme: null
    };
    function Item(props) {
      var disabled = props.disabled,
        error = props.error,
        itemId = props.itemId,
        name = props.name,
        onClick = props.onClick,
        size = props.size,
        theme = props.theme,
        uploadPercentage = props.uploadPercentage,
        otherProps = _objectWithoutProperties(props, ["disabled", "error", "itemId", "name", "onClick", "size", "theme", "uploadPercentage"]);
      function handleRequestRemove(e) {
        e.preventDefault();
        onClick({
          itemId: itemId,
          name: name
        });
      }
      var removeLabel = Object(i18n_["_"])('Remove "%1"').replace('%1', name);
      var uploadLabel = Object(i18n_["_"])('Uploading "%1"').replace('%1', name);
      var itemRemoveable = Object(themes_["variable"])('File', 'Item', 'itemRemoveable')({
        theme: theme
      });
      return external_react_default.a.createElement(StyledBox, _extends({
        "data-test": "item"
      }, otherProps, {
        flex: true,
        "data-error": error || null,
        "data-size": size,
        "data-disabled": disabled || null
      }), external_react_default.a.createElement(StyledLabel, {
        "data-test": "label",
        "data-error": error || null,
        "data-disabled": disabled || null
      }, name), !disabled && external_react_default.a.createElement(StyledRemoveClickable, {
        "data-test": "remove",
        "data-error": error || null,
        onClick: handleRequestRemove,
        "aria-label": removeLabel,
        itemRemoveable: itemRemoveable
      }, external_react_default.a.createElement(Remove_default.a, {
        screenReaderText: null,
        style: itemRemoveable ? {
          width: 10,
          height: 10
        } : null
      })), !Object(external_lodash_["isUndefined"])(uploadPercentage) && uploadPercentage > 0 && external_react_default.a.createElement(Progress_default.a, {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          zIndex: 1
        },
        percentage: uploadPercentage,
        "aria-label": uploadLabel
      }));
    }
    Item.propTypes = propTypes;
    Item.defaultProps = defaultProps;
    /* harmony default export */
    var File_Item = Object(external_styled_components_["withTheme"])(Item);
    // EXTERNAL MODULE: external "@splunk/react-icons/SVG"
    var SVG_ = __webpack_require__(27);
    var SVG_default = /*#__PURE__*/__webpack_require__.n(SVG_);

    // CONCATENATED MODULE: ./src/File/Icon.jsx
    function Icon_extends() {
      Icon_extends = Object.assign || function (target) {
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
      return Icon_extends.apply(this, arguments);
    }
    function FileIcon(props) {
      return external_react_default.a.createElement(SVG_default.a, Icon_extends({
        hideDefaultTooltip: true,
        screenReaderText: Object(i18n_["_"])('File upload'),
        viewBox: "0 0 72 88"
      }, props), external_react_default.a.createElement("path", {
        d: "M50,27 L68.0005854,27 C70.2022516,27 72,28.7919267 72,31.0023804 L72,83.9976196 C72,86.2074215 70.2094011,88 68.0005854,88 L3.99941455,88 C1.79774843,88 0,86.2080733 0,83.9976196 L0,31.0023804 C0,28.7925785 1.79059889,27 3.99941455,27 L21,27 L21,32 L5.99898406,32 C5.4472604,32 5,32.4408979 5,32.9958767 L5,82.0041233 C5,82.5541308 5.44605521,83 5.99898406,83 L66.0010159,83 C66.5527396,83 67,82.5591021 67,82.0041233 L67,32.9958767 C67,32.4458692 66.5539448,32 66.0010159,32 L50,32 L50,27 Z"
      }), external_react_default.a.createElement("path", {
        d: "M41.9634682,10 L41.9634682,28 L46.9634682,28 L46.9634682,5 L44.4634682,5 L23.9634682,5 L23.9634682,10 L41.9634682,10 Z",
        transform: "translate(35.463468, 16.500000) rotate(-45.000000) translate(-35.463468, -16.500000) "
      }), external_react_default.a.createElement("rect", {
        x: "33",
        y: "3",
        width: "5",
        height: "51"
      }));
    }
    // CONCATENATED MODULE: ./src/File/IconCloud.jsx
    function IconCloud_extends() {
      IconCloud_extends = Object.assign || function (target) {
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
      return IconCloud_extends.apply(this, arguments);
    }
    function FileIconCloud(props) {
      return external_react_default.a.createElement(SVG_default.a, IconCloud_extends({
        hideDefaultTooltip: true,
        screenReaderText: Object(i18n_["_"])('File upload'),
        viewBox: "0 0 32 33"
      }, props), external_react_default.a.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M15.9934 7.54932C12.7409 7.54932 9.87218 9.67919 8.9312 12.7926L8.80364 13.2146C8.6851 13.6068 8.34137 13.8879 7.93429 13.927C4.75954 14.232 2.32568 16.9255 2.32568 20.1227C2.32568 23.5843 5.13282 26.4101 8.584 26.4101H24.1421C27.1902 26.4101 29.6611 23.9391 29.6611 20.8911C29.6611 18.6105 28.0236 16.6592 25.7776 16.2634L25.6055 16.2331C25.1569 16.154 24.8169 15.7844 24.7754 15.3308C24.3721 10.9231 20.6755 7.54932 16.2493 7.54932H15.9934ZM7.075 12.0281C8.32766 8.17206 11.9243 5.54932 15.9934 5.54932H16.2493C21.461 5.54932 25.8526 9.34093 26.6742 14.4143C29.5902 15.1831 31.6611 17.8289 31.6611 20.8911C31.6611 25.0437 28.2948 28.4101 24.1421 28.4101H8.584C4.01787 28.4101 0.325684 24.6785 0.325684 20.1227C0.325684 16.1292 3.19978 12.7244 7.075 12.0281Z"
      }), external_react_default.a.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M16.042 13.7891C15.4897 13.7891 15.042 14.2368 15.042 14.7891V21.8674C15.042 22.4196 15.4897 22.8674 16.042 22.8674C16.5943 22.8674 17.042 22.4196 17.042 21.8674V14.7891C17.042 14.2368 16.5943 13.7891 16.042 13.7891Z"
      }), external_react_default.a.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M11.3326 17.4136C11.6793 17.8436 12.3088 17.9111 12.7388 17.5645L16.0456 14.8984L19.3961 17.5681C19.828 17.9122 20.4572 17.8411 20.8014 17.4092C21.1455 16.9772 21.0744 16.3481 20.6425 16.0039L16.0383 12.3352L11.4835 16.0075C11.0535 16.3541 10.986 16.9837 11.3326 17.4136Z"
      }));
    }
    // CONCATENATED MODULE: ./src/File/FileStyles.js

    var StyledInput = external_styled_components_default.a.input.withConfig({
      displayName: "FileStyles__StyledInput",
      componentId: "mltk-sc-12ol6su-0"
    })(["&[type='file']{width:0.1px;height:0.1px;opacity:0;overflow:hidden;position:absolute;z-index:-1;}"]);
    var StyledMediumDropTargetBox = external_styled_components_default()(Box_default.a).withConfig({
      displayName: "FileStyles__StyledMediumDropTargetBox",
      componentId: "mltk-sc-12ol6su-1"
    })(["", ";flex-direction:column;justify-content:center;text-align:center;border-radius:", ";padding:", ";min-height:73px;line-height:calc(", " - 2px);border:1px dashed ", ";&[data-drag-over]{border:", ";background-color:", ";}&[data-error]:not([data-drag-over]){border:1px solid ", ";color:", ";", "{color:", ";}}&[data-disabled]{border:", ";color:", ";cursor:not-allowed;&[data-file-count='0']{background:", ";}}"], Object(themes_["mixin"])('reset')('flex'), Object(themes_["variable"])('borderRadius'), Object(themes_["variable"])('File', 'padding'), Object(themes_["variable"])('inputHeight'), Object(themes_["variable"])('File', 'mediumDropTargetBoxBorderColor'), Object(themes_["variable"])('File', 'borderDragOver'), Object(themes_["variable"])('File', 'backgroundColorDragOver'), Object(themes_["variable"])('errorColor'), Object(themes_["variable"])('File', 'errorTextColor'), /* sc-sel */
    StyledInput, Object(themes_["variable"])('File', 'errorTextColor'), Object(themes_["variable"])('File', 'disabledBorder'), Object(themes_["variable"])('File', 'mediumDropTargetBoxDisabledColor'), Object(themes_["variable"])('File', 'mediumDropTargetBoxDisabledFileCount0BackgroundColor'));
    var StyledSmallDropTargetBox = external_styled_components_default()(StyledMediumDropTargetBox).withConfig({
      displayName: "FileStyles__StyledSmallDropTargetBox",
      componentId: "mltk-sc-12ol6su-2"
    })(["padding:3px;min-height:63px;"]);
    var StyledLargeDropTargetBox = external_styled_components_default()(Box_default.a).withConfig({
      displayName: "FileStyles__StyledLargeDropTargetBox",
      componentId: "mltk-sc-12ol6su-3"
    })(["position:relative;text-align:center;min-height:250px;padding:", ";&[data-disabled='true']{color:", ";}"], Object(themes_["variable"])('spacing'), Object(themes_["variable"])('File', 'largeDropTargetBoxDisabledColor'));
    var icon = Object(external_styled_components_["css"])(["fill:", ";&[data-error]:not([data-drag-over]){fill:", ";}"], Object(themes_["variable"])('File', 'iconFill'), Object(themes_["variable"])('File', 'iconErrorFill'));
    var StyledMediumIcon = external_styled_components_default()(FileIcon).withConfig({
      displayName: "FileStyles__StyledMediumIcon",
      componentId: "mltk-sc-12ol6su-4"
    })(["", ";height:1.4em;width:1.4em;display:inline-block;vertical-align:middle;padding-bottom:3px;"], icon);
    var StyledLargeIcon = external_styled_components_default()(FileIcon).withConfig({
      displayName: "FileStyles__StyledLargeIcon",
      componentId: "mltk-sc-12ol6su-5"
    })(["", ";height:48px;width:48px;position:absolute;top:30px;left:50%;transform:translateX(-50%);"], icon);
    var StyledMediumIconCloud = external_styled_components_default()(FileIconCloud).withConfig({
      displayName: "FileStyles__StyledMediumIconCloud",
      componentId: "mltk-sc-12ol6su-6"
    })(["", ";width:32px;height:33px;margin:0 auto;", ""], icon, function (_ref) {
      var disabled = _ref.disabled;
      return disabled && Object(external_styled_components_["css"])(["fill:", ";"], Object(themes_["variable"])('File', 'iconDisabledFill'));
    });
    var cloudIconContainer = Object(external_styled_components_["css"])(["display:flex;font-size:12px;line-height:16px;flex-direction:column;padding:8px 0 5px;&:not([data-error]){color:", ";}&[disabled]{color:", ";}"], Object(themes_["variable"])('white'), Object(themes_["variable"])('textDisabledColor'));
    var StyledSmallText = external_styled_components_default.a.div.withConfig({
      displayName: "FileStyles__StyledSmallText",
      componentId: "mltk-sc-12ol6su-7"
    })(["display:block;", " font-size:", ";"], function (_ref2) {
      var cloudIcon = _ref2.cloudIcon;
      return cloudIcon && cloudIconContainer;
    }, Object(themes_["variable"])('fontSizeSmall'));
    var StyledMediumText = external_styled_components_default.a.div.withConfig({
      displayName: "FileStyles__StyledMediumText",
      componentId: "mltk-sc-12ol6su-8"
    })(["display:inline-block;", ""], function (_ref3) {
      var cloudIcon = _ref3.cloudIcon;
      return cloudIcon && cloudIconContainer;
    });
    var StyledLargeText = external_styled_components_default.a.div.withConfig({
      displayName: "FileStyles__StyledLargeText",
      componentId: "mltk-sc-12ol6su-9"
    })(["margin-top:calc(", " * 4);margin-bottom:", ";", " font-size:", ";"], Object(themes_["variable"])('spacing'), Object(themes_["variable"])('spacingHalf'), function (_ref4) {
      var cloudIcon = _ref4.cloudIcon;
      return cloudIcon && cloudIconContainer;
    }, Object(themes_["variable"])('fontSizeXLarge'));
    var StyledLink = external_styled_components_default.a.label.withConfig({
      displayName: "FileStyles__StyledLink",
      componentId: "mltk-sc-12ol6su-10"
    })(["", ";color:", ";cursor:pointer;font-size:inherit;font-weight:inherit;&:hover,&[data-focused]{text-decoration:underline;}&[data-focused]{box-shadow:", ";}&[data-error]:not([data-drag-over]){color:", ";}"], Object(themes_["mixin"])('reset')('inline'), Object(themes_["variable"])('File', 'linkColor'), Object(themes_["variable"])('File', 'linkFocusShadow'), Object(themes_["variable"])('File', 'linkErrorColor'));
    var StyledHelp = external_styled_components_default.a.div.withConfig({
      displayName: "FileStyles__StyledHelp",
      componentId: "mltk-sc-12ol6su-11"
    })(["margin-bottom:calc(", " * 1.5);"], Object(themes_["variable"])('spacing'));
    var StyledWindowDrop = external_styled_components_default.a.div.withConfig({
      displayName: "FileStyles__StyledWindowDrop",
      componentId: "mltk-sc-12ol6su-12"
    })(["position:fixed;top:0;left:0;right:0;bottom:0;border:", ";z-index:", " + 10;"], Object(themes_["variable"])('File', 'windowDropBorder'), Object(themes_["variable"])('zindexModal'));

    // CONCATENATED MODULE: ./src/File/File.jsx
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
    function File_extends() {
      File_extends = Object.assign || function (target) {
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
      return File_extends.apply(this, arguments);
    }
    function File_objectWithoutProperties(source, excluded) {
      if (source == null) return {};
      var target = File_objectWithoutPropertiesLoose(source, excluded);
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
    function File_objectWithoutPropertiesLoose(source, excluded) {
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
    var targets = {
      small: StyledSmallDropTargetBox,
      medium: StyledMediumDropTargetBox,
      large: StyledLargeDropTargetBox
    };
    var texts = {
      small: StyledSmallText,
      medium: StyledMediumText,
      large: StyledLargeText
    };
    var icons = {
      medium: StyledMediumIcon,
      large: StyledLargeIcon
    };
    var cloudIcons = {
      medium: StyledMediumIconCloud,
      large: StyledMediumIconCloud // currently not available
    };
    /**
     * File provides the ability to accept files and present uploaded files. It does not provide
     * file readers, only a reference to the file. This can be used to post binary content, or
     * upload using an array buffer.
     */

    var File_File = /*#__PURE__*/
    function (_Component) {
      _inherits(File, _Component);
      function File(props) {
        var _this;
        _classCallCheck(this, File);
        _this = _possibleConstructorReturn(this, _getPrototypeOf(File).call(this, props));
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleInputChange", function (e) {
          _this.addFiles(e.currentTarget.files);
        });
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleInputFocus", function () {
          _this.setState({
            focusedInput: true
          });
        });
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleInputBlur", function () {
          _this.setState({
            focusedInput: false
          });
        });
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDragOver", function (e) {
          if (!_this.setState.dragOver) {
            _this.setState({
              dragOver: true
            });
          }
          e.preventDefault();
        });
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDragLeave", function () {
          _this.setState({
            dragOver: false
          });
        });
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDrop", function (e) {
          e.preventDefault();
          _this.handleDragLeave();
          _this.addFiles(e.dataTransfer.files);
        });
        _this.state = {
          dragOver: false,
          focusedInput: false
        };
        _this.inputId = Object(id_["createDOMID"])();
        /* Each time a file is uploaded this is incremented and used to generate the
         * file input's key. In this way we get a new input without a value. */

        _this.inputCount = 0;
        _this.handleDragLeave = Object(external_lodash_["debounce"])(_this.handleDragLeave, 300);
        return _this;
      }
      _createClass(File, [{
        key: "addFiles",
        value: function addFiles(files) {
          var array = Array.prototype.slice.call(files, 0);
          var name = this.props.name;
          this.props.onRequestAdd(this.props.allowMultiple ? array : [array[0]], {
            name: name
          });
          this.inputCount += 1;
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props = this.props,
            accept = _this$props.accept,
            allowMultiple = _this$props.allowMultiple,
            children = _this$props.children,
            dropAnywhere = _this$props.dropAnywhere,
            disabled = _this$props.disabled,
            error = _this$props.error,
            help = _this$props.help,
            name = _this$props.name,
            onRequestRemove = _this$props.onRequestRemove,
            size = _this$props.size,
            theme = _this$props.theme,
            otherProps = File_objectWithoutProperties(_this$props, ["accept", "allowMultiple", "children", "dropAnywhere", "disabled", "error", "help", "name", "onRequestRemove", "size", "theme"]);
          var fileCount = 0;
          var childrenCloned = external_react_["Children"].toArray(children).filter(external_react_["isValidElement"]).map(function (item, index) {
            var handleRemove = function handleRemove(event) {
              onRequestRemove({
                event: event,
                index: index,
                itemId: item.props.itemId,
                name: name,
                filename: item.props.name
              });
            };
            fileCount += 1;
            return Object(external_react_["cloneElement"])(item, {
              disabled: disabled,
              onClick: handleRemove,
              key: item.key || item.props.itemId || "item-".concat(index),
              size: size === 'small' ? 'small' : null
            });
          });
          var isSmall = size === 'small';
          var isLarge = size === 'large';
          var dragOverWindow = isLarge || dropAnywhere;
          var dragOverOrDisabled = dragOverWindow || disabled;
          var dragOverNotDisabled = dragOverWindow && !disabled;
          var StyledDropTargetBox = targets[size];
          var StyledText = texts[size];
          var StyledIcon = icons[size];
          var StyledIconCloud = cloudIcons[size];
          var cloudIcon = Object(themes_["variable"])('File', 'cloudIcon')({
            theme: theme
          });
          return external_react_default.a.createElement(StyledDropTargetBox, File_extends({
            onDragOver: dragOverOrDisabled ? null : this.handleDragOver,
            onDragLeave: dragOverOrDisabled ? null : this.handleDragLeave,
            onDrop: dragOverOrDisabled ? null : this.handleDrop,
            "data-disabled": disabled || null,
            "data-drag-over": dragOverOrDisabled ? null : this.state.dragOver || null,
            "data-error": error || null,
            "data-file-count": fileCount,
            "data-test": "file"
          }, Object(external_lodash_["omit"])(otherProps, 'onRequestAdd', 'onRequestRemove')), external_react_default.a.createElement(StyledText, {
            cloudIcon: cloudIcon,
            "data-error": error || null,
            disabled: disabled
          }, !cloudIcon && !isSmall && !disabled && external_react_default.a.createElement(StyledIcon, {
            "data-error": error || null
          }), cloudIcon && !isSmall && external_react_default.a.createElement(StyledIconCloud, {
            "data-error": error || null,
            disabled: disabled
          }), ' ', external_react_default.a.createElement("span", null, !dragOverWindow && !disabled && Object(i18n_["_"])('Drop your file here or'), dragOverNotDisabled && Object(i18n_["_"])('Drop your file anywhere or'), ' ', fileCount === 0 && disabled && Object(i18n_["_"])('No Files Selected'), external_react_default.a.createElement(StyledLink, {
            htmlFor: this.inputId,
            "data-focused": this.state.focusedInput || null,
            "data-error": error || null
          }, external_react_default.a.createElement(StyledInput, {
            "data-test": "file-input",
            disabled: disabled,
            onChange: this.handleInputChange,
            onFocus: this.handleInputFocus,
            onBlur: this.handleInputBlur,
            id: this.inputId,
            key: "file-input-".concat(this.inputCount),
            type: "file",
            multiple: allowMultiple || null,
            accept: accept
          }), !disabled && Object(i18n_["_"])('browse...')), ' ')), isLarge && !disabled && external_react_default.a.createElement(StyledHelp, null, help), dragOverNotDisabled && this.state.dragOver && external_react_default.a.createElement(StyledWindowDrop, {
            "data-test": "file-window-drop",
            onDragLeave: this.handleDragLeave
          }), dragOverNotDisabled && external_react_default.a.createElement(external_react_event_listener_default.a, {
            target: window,
            onDragOver: this.handleDragOver,
            onDrop: this.handleDrop
          }), childrenCloned);
        }
      }]);
      return File;
    }(external_react_["Component"]);
    _defineProperty(File_File, "propTypes", {
      /** The accept attribute for the file browser. This does not filter dropped items,
       * which must be filtered manually. */
      accept: external_prop_types_default.a.string,
      /** Allow the user to upload multiple files. */
      allowMultiple: external_prop_types_default.a.bool,
      /** @private */
      children: external_prop_types_default.a.node,
      /** When size is medium or small, file can be dropped anywhere on the page. */
      dropAnywhere: external_prop_types_default.a.bool,
      /** Prevents user from dropping files. */
      disabled: external_prop_types_default.a.bool,
      /**
       * Invoked with the DOM element when the component mounts, and null when it unmounts.
       */
      elementRef: external_prop_types_default.a.func,
      /** Show the component in an error state. This has no effect on the large size.
       * Note: File.Item has a separate error property. */
      error: external_prop_types_default.a.bool,
      /** When size is large, help text can be shown. */
      help: external_prop_types_default.a.node,
      /** The name is returned with onRequestAdd and onRequestRemove events,
       * which can be used to identify the
       * control when multiple controls share an onChange callback. */
      name: external_prop_types_default.a.string,
      /** A callback for when the user selects one or more files. The function is
       * passed a file reference, which can then be used to read the file. This may
       * be used to enforce file constraints or upload the file. */
      onRequestAdd: external_prop_types_default.a.func,
      /** A callback for when the user requests to remove a file. The function is passed
       * the event and an object with the Item's index and name: `(event, {index, name})`. */
      onRequestRemove: external_prop_types_default.a.func,
      /** `medium` appears much like a native file input. `small` is for use on highly complex
       * pages, where data density is an issue. When `large` is used, there can only
       * be one File component on the page as it will take all files dropped on the page. */
      size: external_prop_types_default.a.oneOf(['small', 'medium', 'large']),
      /** @private */
      theme: external_prop_types_default.a.object
    });
    _defineProperty(File_File, "defaultProps", {
      allowMultiple: false,
      dropAnywhere: false,
      disabled: false,
      error: false,
      onRequestRemove: function onRequestRemove() {},
      size: 'medium',
      theme: null
    });
    _defineProperty(File_File, "Item", File_Item);
    var filewithTheme = Object(external_styled_components_["withTheme"])(File_File);
    filewithTheme.propTypes = File_File.propTypes;
    /* harmony default export */
    var src_File_File = filewithTheme;

    // CONCATENATED MODULE: ./src/File/index.js
    /* concated harmony reexport */
    __webpack_require__.d(__webpack_exports__, "default", function () {
      return src_File_File;
    });
    /* concated harmony reexport */
    __webpack_require__.d(__webpack_exports__, "Item", function () {
      return File_Item;
    });

    /***/
  })

  /******/
});

/***/ }),

/***/ "./node_modules/@splunk/react-ui/Progress.js":
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
  return __webpack_require__(__webpack_require__.s = 136);
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
  /***/136: ( /***/function (module, __webpack_exports__, __webpack_require__) {
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

    // EXTERNAL MODULE: external "@splunk/react-ui/Box"
    var Box_ = __webpack_require__(9);
    var Box_default = /*#__PURE__*/__webpack_require__.n(Box_);

    // EXTERNAL MODULE: external "styled-components"
    var external_styled_components_ = __webpack_require__(3);
    var external_styled_components_default = /*#__PURE__*/__webpack_require__.n(external_styled_components_);

    // EXTERNAL MODULE: external "@splunk/react-ui/Tooltip"
    var Tooltip_ = __webpack_require__(26);
    var Tooltip_default = /*#__PURE__*/__webpack_require__.n(Tooltip_);

    // EXTERNAL MODULE: external "@splunk/react-ui/themes"
    var themes_ = __webpack_require__(0);

    // CONCATENATED MODULE: ./src/Progress/ProgressStyles.js

    var StyledTooltip = external_styled_components_default()(Tooltip_default.a).withConfig({
      displayName: "ProgressStyles__StyledTooltip",
      componentId: "mltk-sc-1u3hxyb-0"
    })(["background-color:", ";height:3px;position:relative;transition:width 300ms;overflow:hidden;padding-left:", ";"], Object(themes_["variable"])('Progress', 'tooltipBackgroundColor'), Object(themes_["variable"])('spacingHalf'));
    var pulse = Object(external_styled_components_["keyframes"])(["from{opacity:0;}to{opacity:1;}"]);
    var StyledPuck = external_styled_components_default.a.div.withConfig({
      displayName: "ProgressStyles__StyledPuck",
      componentId: "mltk-sc-1u3hxyb-1"
    })(["animation-duration:1500ms;animation-name:", ";animation-iteration-count:infinite;animation-direction:alternate;height:3px;width:300px;position:absolute;right:0;top:0;background:linear-gradient( 90deg,", ",", ",40%,", ",80%,", " );"], pulse, Object(themes_["variable"])('accentColorD10'), Object(themes_["variable"])('accentColorL10'), Object(themes_["variable"])('accentColorL40'), Object(themes_["variable"])('accentColorL40'));

    // CONCATENATED MODULE: ./src/Progress/Progress.jsx
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
    var Progress_Progress = /*#__PURE__*/
    function (_Component) {
      _inherits(Progress, _Component);
      function Progress(props) {
        var _getPrototypeOf2;
        var _this;
        _classCallCheck(this, Progress);
        for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }
        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Progress)).call.apply(_getPrototypeOf2, [this, props].concat(rest)));
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleMouseEnter", function () {
          _this.setState({
            tooltipOpen: true
          });
        });
        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleMouseLeave", function () {
          _this.setState({
            tooltipOpen: false
          });
        });
        _this.state = {
          tooltipOpen: false
        };
        return _this;
      }
      _createClass(Progress, [{
        key: "render",
        value: function render() {
          // eslint-disable-next-line no-unused-vars
          var _this$props = this.props,
            percentage = _this$props.percentage,
            tooltip = _this$props.tooltip,
            otherProps = _objectWithoutProperties(_this$props, ["percentage", "tooltip"]);
          return external_react_default.a.createElement(Box_default.a, _extends({
            "data-test": "progress",
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave
          }, otherProps), Object(external_lodash_["isNumber"])(percentage) && external_react_default.a.createElement(StyledTooltip, {
            inline: false,
            open: this.state.tooltipOpen,
            content: tooltip || "".concat(percentage, "%"),
            style: {
              width: "".concat(percentage, "%")
            },
            role: "progressbar",
            "aria-valuenow": percentage,
            "aria-valuemin": "0",
            "aria-valuemax": "100"
          }, external_react_default.a.createElement(StyledPuck, null)));
        }
      }]);
      return Progress;
    }(external_react_["Component"]);
    _defineProperty(Progress_Progress, "propTypes", {
      /**
       * Invoked with the DOM element when the component mounts and null when it unmounts.
       */
      elementRef: external_prop_types_default.a.func,
      // eslint-disable-line react/no-unused-prop-types

      /**
       * The percentage complete. If unset, no progress bar will be shown.
       * Percentage must be number between 0 and 100.
       */
      percentage: function percentage(props, propName) {
        if (props[propName] !== undefined && !(props[propName] >= 0 && props[propName] <= 100)) {
          return new RangeError('Percentage must be number between 0 and 100 in Progress component.');
        }
        return null;
      },
      /** Tooltip will default to the percentage complete. */
      tooltip: external_prop_types_default.a.node
    });

    /* harmony default export */
    var src_Progress_Progress = Progress_Progress;
    // CONCATENATED MODULE: ./src/Progress/index.js
    /* concated harmony reexport */
    __webpack_require__.d(__webpack_exports__, "default", function () {
      return src_Progress_Progress;
    });

    /***/
  }),
  /***/2: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/react/index.js");

    /***/
  }),
  /***/26: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js");

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
  /***/9: ( /***/function (module, exports) {
    module.exports = __webpack_require__("./node_modules/@splunk/react-ui/Box.js");

    /***/
  })

  /******/
});

/***/ }),

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/models.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Models.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Models, _swcMltk) {
  "use strict";

  _Models = _interopRequireDefault(_Models);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Models.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./node_modules/color-blend/dist/index.mjs":
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normal", function() { return D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply", function() { return j; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "screen", function() { return z; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "overlay", function() { return A; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "darken", function() { return C; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lighten", function() { return E; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorDodge", function() { return F; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorBurn", function() { return G; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hardLight", function() { return H; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "softLight", function() { return J; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "difference", function() { return K; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exclusion", function() { return N; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hue", function() { return P; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saturation", function() { return Q; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "color", function() { return R; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "luminosity", function() { return S; });
function n(n,r,t){return{r:255*t(n.r/255,r.r/255),g:255*t(n.g/255,r.g/255),b:255*t(n.b/255,r.b/255)}}function r(n,r){return r}function t(n,r){return n*r}function u(n,r){return n+r-n*r}function o(n,r){return f(r,n)}function i(n,r){return Math.min(n,r)}function a(n,r){return Math.min(Math.max(n,r),1)}function e(n,r){return 0===n?0:1===r?1:Math.min(1,n/(1-r))}function c(n,r){return 1===n?1:0===r?0:1-Math.min(1,(1-n)/r)}function f(n,r){return r<=.5?t(n,2*r):u(n,2*r-1)}function g(n,r){return r<=.5?n-(1-2*r)*n*(1-n):n+(2*r-1)*((n<=.25?((16*n-12)*n+4)*n:Math.sqrt(n))-n)}function b(n,r){return Math.abs(n-r)}function s(n,r){return n+r-2*n*r}function h(n,r,t){return Math.min(Math.max(n,r),t)}function M(n){return{r:h(n.r,0,255),g:h(n.g,0,255),b:h(n.b,0,255),a:h(n.a,0,1)}}function m(n){return{r:255*n.r,g:255*n.g,b:255*n.b,a:n.a}}function d(n){return{r:n.r/255,g:n.g/255,b:n.b/255,a:n.a}}function l(n,r){void 0===r&&(r=0);var t=Math.pow(10,r);return{r:Math.round(n.r*t)/t,g:Math.round(n.g*t)/t,b:Math.round(n.b*t)/t,a:n.a}}function p(n,r,t,u,o,i){return(1-r/t)*u+r/t*Math.round((1-n)*o+n*i)}function v(n,r,t,u,o){void 0===o&&(o={unitInput:!1,unitOutput:!1,roundOutput:!0}),o.unitInput&&(n=m(n),r=m(r)),n=M(n);var i=(r=M(r)).a+n.a-r.a*n.a,a=t(n,r,u),e=M({r:p(n.a,r.a,i,n.r,r.r,a.r),g:p(n.a,r.a,i,n.g,r.g,a.g),b:p(n.a,r.a,i,n.b,r.b,a.b),a:i});return o.unitOutput?d(e):o.roundOutput?l(e):l(e,9)}function x(n,r,t){return m(t(d(n),d(r)))}function O(n){return.3*n.r+.59*n.g+.11*n.b}function y(n,r){var t=r-O(n);return function(n){var r=O(n),t=n.r,u=n.g,o=n.b,i=Math.min(t,u,o),a=Math.max(t,u,o);function e(n){return r+(n-r)*r/(r-i)}function c(n){return r+(n-r)*(1-r)/(a-r)}return i<0&&(t=e(t),u=e(u),o=e(o)),a>1&&(t=c(t),u=c(u),o=c(o)),{r:t,g:u,b:o}}({r:n.r+t,g:n.g+t,b:n.b+t})}function I(n){return Math.max(n.r,n.g,n.b)-Math.min(n.r,n.g,n.b)}function L(n,r){var t=["r","g","b"].sort(function(r,t){return n[r]-n[t]}),u=t[0],o=t[1],i=t[2],a={r:n.r,g:n.g,b:n.b};return a[i]>a[u]?(a[o]=(a[o]-a[u])*r/(a[i]-a[u]),a[i]=r):a[o]=a[i]=0,a[u]=0,a}function k(n,r){return y(L(r,I(n)),O(n))}function q(n,r){return y(L(n,I(r)),O(n))}function w(n,r){return y(r,O(n))}function B(n,r){return y(n,O(r))}function D(t,u){return v(t,u,n,r)}function j(r,u){return v(r,u,n,t)}function z(r,t){return v(r,t,n,u)}function A(r,t){return v(r,t,n,o)}function C(r,t){return v(r,t,n,i)}function E(r,t){return v(r,t,n,a)}function F(r,t){return v(r,t,n,e)}function G(r,t){return v(r,t,n,c)}function H(r,t){return v(r,t,n,f)}function J(r,t){return v(r,t,n,g)}function K(r,t){return v(r,t,n,b)}function N(r,t){return v(r,t,n,s)}function P(n,r){return v(n,r,x,k)}function Q(n,r){return v(n,r,x,q)}function R(n,r){return v(n,r,x,w)}function S(n,r){return v(n,r,x,B)}
//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/core-js/modules/es.promise.finally.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js/internals/export.js");
var IS_PURE = __webpack_require__("./node_modules/core-js/internals/is-pure.js");
var NativePromiseConstructor = __webpack_require__("./node_modules/core-js/internals/promise-native-constructor.js");
var fails = __webpack_require__("./node_modules/core-js/internals/fails.js");
var getBuiltIn = __webpack_require__("./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__("./node_modules/core-js/internals/is-callable.js");
var speciesConstructor = __webpack_require__("./node_modules/core-js/internals/species-constructor.js");
var promiseResolve = __webpack_require__("./node_modules/core-js/internals/promise-resolve.js");
var defineBuiltIn = __webpack_require__("./node_modules/core-js/internals/define-built-in.js");

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

/***/ "./node_modules/events/events.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/lodash/_baseIndexOfWith.js":
/***/ (function(module, exports) {

/**
 * This function is like `baseIndexOf` except that it accepts a comparator.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOfWith(array, value, fromIndex, comparator) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (comparator(array[index], value)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOfWith;


/***/ }),

/***/ "./node_modules/lodash/_basePullAll.js":
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__("./node_modules/lodash/_arrayMap.js"),
    baseIndexOf = __webpack_require__("./node_modules/lodash/_baseIndexOf.js"),
    baseIndexOfWith = __webpack_require__("./node_modules/lodash/_baseIndexOfWith.js"),
    baseUnary = __webpack_require__("./node_modules/lodash/_baseUnary.js"),
    copyArray = __webpack_require__("./node_modules/lodash/_copyArray.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * The base implementation of `_.pullAllBy` without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 */
function basePullAll(array, values, iteratee, comparator) {
  var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
      index = -1,
      length = values.length,
      seen = array;

  if (array === values) {
    values = copyArray(values);
  }
  if (iteratee) {
    seen = arrayMap(array, baseUnary(iteratee));
  }
  while (++index < length) {
    var fromIndex = 0,
        value = values[index],
        computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice.call(seen, fromIndex, 1);
      }
      splice.call(array, fromIndex, 1);
    }
  }
  return array;
}

module.exports = basePullAll;


/***/ }),

/***/ "./node_modules/lodash/isNil.js":
/***/ (function(module, exports) {

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

module.exports = isNil;


/***/ }),

/***/ "./node_modules/lodash/pull.js":
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__("./node_modules/lodash/_baseRest.js"),
    pullAll = __webpack_require__("./node_modules/lodash/pullAll.js");

/**
 * Removes all given values from `array` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
 * to remove elements from an array by predicate.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...*} [values] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pull(array, 'a', 'c');
 * console.log(array);
 * // => ['b', 'b']
 */
var pull = baseRest(pullAll);

module.exports = pull;


/***/ }),

/***/ "./node_modules/lodash/pullAll.js":
/***/ (function(module, exports, __webpack_require__) {

var basePullAll = __webpack_require__("./node_modules/lodash/_basePullAll.js");

/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */
function pullAll(array, values) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values)
    : array;
}

module.exports = pullAll;


/***/ }),

/***/ "./node_modules/react-flip-move/dist/react-flip-move.es.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);



function warnOnce(msg) {
  var hasWarned = false;
  return function () {
    if (!hasWarned) {
      console.warn(msg);
      hasWarned = true;
    }
  };
}


var statelessFunctionalComponentSupplied = warnOnce('\n>> Error, via react-flip-move <<\n\nYou provided a stateless functional component as a child to <FlipMove>. Unfortunately, SFCs aren\'t supported, because Flip Move needs access to the backing instances via refs, and SFCs don\'t have a public instance that holds that info.\n\nPlease wrap your components in a native element (eg. <div>), or a non-functional component.\n');

var primitiveNodeSupplied = warnOnce('\n>> Error, via react-flip-move <<\n\nYou provided a primitive (text or number) node as a child to <FlipMove>. Flip Move needs containers with unique keys to move children around.\n\nPlease wrap your value in a native element (eg. <span>), or a component.\n');

var invalidTypeForTimingProp = function invalidTypeForTimingProp(args
// prettier-ignore
) {
  return console.error('\n>> Error, via react-flip-move <<\n\nThe prop you provided for \'' + args.prop + '\' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is \'' + args.value + '\'.\n\nAs a result,  the default value for this parameter will be used, which is \'' + args.defaultValue + '\'.\n');
};

var invalidEnterLeavePreset = function invalidEnterLeavePreset(args
// prettier-ignore
) {
  return console.error('\n>> Error, via react-flip-move <<\n\nThe enter/leave preset you provided is invalid. We don\'t currently have a \'' + args.value + ' preset.\'\n\nAcceptable values are ' + args.acceptableValues + '. The default value of \'' + args.defaultValue + '\' will be used.\n');
};

var parentNodePositionStatic = warnOnce('\n>> Warning, via react-flip-move <<\n\nWhen using "wrapperless" mode (by supplying \'typeName\' of \'null\'), strange things happen when the direct parent has the default "static" position.\n\nFlipMove has added \'position: relative\' to this node, to ensure Flip Move animates correctly.\n\nTo avoid seeing this warning, simply apply a non-static position to that parent node.\n');

var childIsDisabled = warnOnce('\n>> Warning, via react-flip-move <<\n\nOne or more of Flip Move\'s child elements have the html attribute \'disabled\' set to true.\n\nPlease note that this will cause animations to break in Internet Explorer 11 and below. Either remove the disabled attribute or set \'animation\' to false.\n');

var enterPresets = {
  elevator: {
    from: { transform: 'scale(0)', opacity: '0' },
    to: { transform: '', opacity: '' }
  },
  fade: {
    from: { opacity: '0' },
    to: { opacity: '' }
  },
  accordionVertical: {
    from: { transform: 'scaleY(0)', transformOrigin: 'center top' },
    to: { transform: '', transformOrigin: 'center top' }
  },
  accordionHorizontal: {
    from: { transform: 'scaleX(0)', transformOrigin: 'left center' },
    to: { transform: '', transformOrigin: 'left center' }
  },
  none: null
};
/**
 * React Flip Move | enterLeavePresets
 * (c) 2016-present Joshua Comeau
 *
 * This contains the master list of presets available for enter/leave animations,
 * along with the mapping between preset and styles.
 */


var leavePresets = {
  elevator: {
    from: { transform: 'scale(1)', opacity: '1' },
    to: { transform: 'scale(0)', opacity: '0' }
  },
  fade: {
    from: { opacity: '1' },
    to: { opacity: '0' }
  },
  accordionVertical: {
    from: { transform: 'scaleY(1)', transformOrigin: 'center top' },
    to: { transform: 'scaleY(0)', transformOrigin: 'center top' }
  },
  accordionHorizontal: {
    from: { transform: 'scaleX(1)', transformOrigin: 'left center' },
    to: { transform: 'scaleX(0)', transformOrigin: 'left center' }
  },
  none: null
};

// For now, appearPresets will be identical to enterPresets.
// Assigning a custom export in case we ever want to add appear-specific ones.
var appearPresets = enterPresets;

var defaultPreset = 'elevator';
var disablePreset = 'none';

var find = function find(predicate, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) {
      return arr[i];
    }
  }

  return undefined;
};


var every = function every(predicate, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) {
      return false;
    }
  }
  return true;
};

// eslint-disable-next-line import/no-mutable-exports
var _isArray = function isArray(arr) {
  _isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
  return _isArray(arr);
};

var isElementAnSFC = function isElementAnSFC(element) {
  var isNativeDOMElement = typeof element.type === 'string';

  if (isNativeDOMElement) {
    return false;
  }

  return typeof element.type === 'function' && !element.type.prototype.isReactComponent;
};

function omit(obj) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var result = {};
  Object.keys(obj).forEach(function (key) {
    if (attrs.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });
  return result;
}

function arraysEqual(a, b) {
  var sameObject = a === b;
  if (sameObject) {
    return true;
  }

  var notBothArrays = !_isArray(a) || !_isArray(b);
  var differentLengths = a.length !== b.length;

  if (notBothArrays || differentLengths) {
    return false;
  }

  return every(function (element, index) {
    return element === b[index];
  }, a);
}

function memoizeString(fn) {
  var cache = {};

  return function (str) {
    if (!cache[str]) {
      cache[str] = fn(str);
    }
    return cache[str];
  };
}

var hyphenate = memoizeString(function (str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
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



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * React Flip Move | propConverter
 * (c) 2016-present Joshua Comeau
 *
 * Abstracted away a bunch of the messy business with props.
 *   - props flow types and defaultProps
 *   - Type conversion (We accept 'string' and 'number' values for duration,
 *     delay, and other fields, but we actually need them to be ints.)
 *   - Children conversion (we need the children to be an array. May not always
 *     be, if a single child is passed in.)
 *   - Resolving animation presets into their base CSS styles
 */
/* eslint-disable block-scoped-var */

// eslint-disable-next-line no-duplicate-imports


function propConverter(ComposedComponent) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    inherits(FlipMovePropConverter, _Component);

    function FlipMovePropConverter() {
      classCallCheck(this, FlipMovePropConverter);
      return possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    // eslint-disable-next-line class-methods-use-this
    FlipMovePropConverter.prototype.checkChildren = function checkChildren(children) {
      // Skip all console warnings in production.
      // Bail early, to avoid unnecessary work.
      if (true) {
        return;
      }

      // same as React.Node, but without fragments, see https://github.com/facebook/flow/issues/4781


      // FlipMove does not support stateless functional components.
      // Check to see if any supplied components won't work.
      // If the child doesn't have a key, it means we aren't animating it.
      // It's allowed to be an SFC, since we ignore it.
      react__WEBPACK_IMPORTED_MODULE_0__["Children"].forEach(children, function (child) {
        // null, undefined, and booleans will be filtered out by Children.toArray
        if (child == null || typeof child === 'boolean') {
          return;
        }

        if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) !== 'object') {
          primitiveNodeSupplied();
          return;
        }

        if (isElementAnSFC(child) && child.key != null) {
          statelessFunctionalComponentSupplied();
        }
      });
    };

    FlipMovePropConverter.prototype.convertProps = function convertProps(props) {
      var workingProps = {
        // explicitly bypass the props that don't need conversion
        children: props.children,
        easing: props.easing,
        onStart: props.onStart,
        onFinish: props.onFinish,
        onStartAll: props.onStartAll,
        onFinishAll: props.onFinishAll,
        typeName: props.typeName,
        disableAllAnimations: props.disableAllAnimations,
        getPosition: props.getPosition,
        maintainContainerHeight: props.maintainContainerHeight,
        verticalAlignment: props.verticalAlignment,

        // Do string-to-int conversion for all timing-related props
        duration: this.convertTimingProp('duration'),
        delay: this.convertTimingProp('delay'),
        staggerDurationBy: this.convertTimingProp('staggerDurationBy'),
        staggerDelayBy: this.convertTimingProp('staggerDelayBy'),

        // Our enter/leave animations can be specified as boolean (default or
        // disabled), string (preset name), or object (actual animation values).
        // Let's standardize this so that they're always objects
        appearAnimation: this.convertAnimationProp(props.appearAnimation, appearPresets),
        enterAnimation: this.convertAnimationProp(props.enterAnimation, enterPresets),
        leaveAnimation: this.convertAnimationProp(props.leaveAnimation, leavePresets),

        delegated: {}
      };

      this.checkChildren(workingProps.children);

      // Gather any additional props;
      // they will be delegated to the ReactElement created.
      var primaryPropKeys = Object.keys(workingProps);
      var delegatedProps = omit(this.props, primaryPropKeys);

      // The FlipMove container element needs to have a non-static position.
      // We use `relative` by default, but it can be overridden by the user.
      // Now that we're delegating props, we need to merge this in.
      delegatedProps.style = _extends({
        position: 'relative'
      }, delegatedProps.style);

      workingProps.delegated = delegatedProps;

      return workingProps;
    };

    FlipMovePropConverter.prototype.convertTimingProp = function convertTimingProp(prop) {
      var rawValue = this.props[prop];

      var value = typeof rawValue === 'number' ? rawValue : parseInt(rawValue, 10);

      if (isNaN(value)) {
        var defaultValue = FlipMovePropConverter.defaultProps[prop];

        if (false) {}

        return defaultValue;
      }

      return value;
    };

    // eslint-disable-next-line class-methods-use-this


    FlipMovePropConverter.prototype.convertAnimationProp = function convertAnimationProp(animation, presets) {
      switch (typeof animation === 'undefined' ? 'undefined' : _typeof(animation)) {
        case 'boolean':
          {
            // If it's true, we want to use the default preset.
            // If it's false, we want to use the 'none' preset.
            return presets[animation ? defaultPreset : disablePreset];
          }

        case 'string':
          {
            var presetKeys = Object.keys(presets);

            if (presetKeys.indexOf(animation) === -1) {
              if (false) {}

              return presets[defaultPreset];
            }

            return presets[animation];
          }

        default:
          {
            return animation;
          }
      }
    };

    FlipMovePropConverter.prototype.render = function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ComposedComponent, this.convertProps(this.props));
    };

    return FlipMovePropConverter;
  }(react__WEBPACK_IMPORTED_MODULE_0__["Component"]), _class.defaultProps = {
    easing: 'ease-in-out',
    duration: 350,
    delay: 0,
    staggerDurationBy: 0,
    staggerDelayBy: 0,
    typeName: 'div',
    enterAnimation: defaultPreset,
    leaveAnimation: defaultPreset,
    disableAllAnimations: false,
    getPosition: function getPosition(node) {
      return node.getBoundingClientRect();
    },
    maintainContainerHeight: false,
    verticalAlignment: 'top'
  }, _temp;
}

/**
 * React Flip Move
 * (c) 2016-present Joshua Comeau
 *
 * These methods read from and write to the DOM.
 * They almost always have side effects, and will hopefully become the
 * only spot in the codebase with impure functions.
 */
function applyStylesToDOMNode(_ref) {
  var domNode = _ref.domNode,
      styles = _ref.styles;

  // Can't just do an object merge because domNode.styles is no regular object.
  // Need to do it this way for the engine to fire its `set` listeners.
  Object.keys(styles).forEach(function (key) {
    domNode.style.setProperty(hyphenate(key), styles[key]);
  });
}

// Modified from Modernizr
function whichTransitionEvent() {
  var transitions = {
    transition: 'transitionend',
    '-o-transition': 'oTransitionEnd',
    '-moz-transition': 'transitionend',
    '-webkit-transition': 'webkitTransitionEnd'
  };

  // If we're running in a browserless environment (eg. SSR), it doesn't apply.
  // Return a placeholder string, for consistent type return.
  if (typeof document === 'undefined') return '';

  var el = document.createElement('fakeelement');

  var match = find(function (t) {
    return el.style.getPropertyValue(t) !== undefined;
  }, Object.keys(transitions));

  // If no `transition` is found, we must be running in a browser so ancient,
  // React itself won't run. Return an empty string, for consistent type return
  return match ? transitions[match] : '';
}

var getRelativeBoundingBox = function getRelativeBoundingBox(_ref2) {
  var childDomNode = _ref2.childDomNode,
      parentDomNode = _ref2.parentDomNode,
      getPosition = _ref2.getPosition;

  var parentBox = getPosition(parentDomNode);

  var _getPosition = getPosition(childDomNode),
      top = _getPosition.top,
      left = _getPosition.left,
      right = _getPosition.right,
      bottom = _getPosition.bottom,
      width = _getPosition.width,
      height = _getPosition.height;

  return {
    top: top - parentBox.top,
    left: left - parentBox.left,
    right: parentBox.right - right,
    bottom: parentBox.bottom - bottom,
    width: width,
    height: height
  };
};

/** getPositionDelta
 * This method returns the delta between two bounding boxes, to figure out
 * how many pixels on each axis the element has moved.
 *
 */
var getPositionDelta = function getPositionDelta(_ref3) {
  var childDomNode = _ref3.childDomNode,
      childBoundingBox = _ref3.childBoundingBox,
      parentBoundingBox = _ref3.parentBoundingBox,
      getPosition = _ref3.getPosition;

  // TEMP: A mystery bug is sometimes causing unnecessary boundingBoxes to
  var defaultBox = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    width: 0
  };

  // Our old box is its last calculated position, derived on mount or at the
  // start of the previous animation.
  var oldRelativeBox = childBoundingBox || defaultBox;
  var parentBox = parentBoundingBox || defaultBox;

  // Our new box is the new final resting place: Where we expect it to wind up
  // after the animation. First we get the box in absolute terms (AKA relative
  // to the viewport), and then we calculate its relative box (relative to the
  // parent container)
  var newAbsoluteBox = getPosition(childDomNode);
  var newRelativeBox = {
    top: newAbsoluteBox.top - parentBox.top,
    left: newAbsoluteBox.left - parentBox.left
  };

  return [oldRelativeBox.left - newRelativeBox.left, oldRelativeBox.top - newRelativeBox.top];
};

/** removeNodeFromDOMFlow
 * This method does something very sneaky: it removes a DOM node from the
 * document flow, but without actually changing its on-screen position.
 *
 * It works by calculating where the node is, and then applying styles
 * so that it winds up being positioned absolutely, but in exactly the
 * same place.
 *
 * This is a vital part of the FLIP technique.
 */
var removeNodeFromDOMFlow = function removeNodeFromDOMFlow(childData, verticalAlignment) {
  var domNode = childData.domNode,
      boundingBox = childData.boundingBox;


  if (!domNode || !boundingBox) {
    return;
  }

  // For this to work, we have to offset any given `margin`.
  var computed = window.getComputedStyle(domNode);

  // We need to clean up margins, by converting and removing suffix:
  // eg. '21px' -> 21
  var marginAttrs = ['margin-top', 'margin-left', 'margin-right'];
  var margins = marginAttrs.reduce(function (acc, margin) {
    var _babelHelpers$extends;

    var propertyVal = computed.getPropertyValue(margin);

    return _extends({}, acc, (_babelHelpers$extends = {}, _babelHelpers$extends[margin] = Number(propertyVal.replace('px', '')), _babelHelpers$extends));
  }, {});

  // If we're bottom-aligned, we need to add the height of the child to its
  // top offset. This is because, when the container is bottom-aligned, its
  // height shrinks from the top, not the bottom. We're removing this node
  // from the flow, so the top is going to drop by its height.
  var topOffset = verticalAlignment === 'bottom' ? boundingBox.top - boundingBox.height : boundingBox.top;

  var styles = {
    position: 'absolute',
    top: topOffset - margins['margin-top'] + 'px',
    left: boundingBox.left - margins['margin-left'] + 'px',
    right: boundingBox.right - margins['margin-right'] + 'px'
  };

  applyStylesToDOMNode({ domNode: domNode, styles: styles });
};

/** updateHeightPlaceholder
 * An optional property to FlipMove is a `maintainContainerHeight` boolean.
 * This property creates a node that fills space, so that the parent
 * container doesn't collapse when its children are removed from the
 * document flow.
 */
var updateHeightPlaceholder = function updateHeightPlaceholder(_ref4) {
  var domNode = _ref4.domNode,
      parentData = _ref4.parentData,
      getPosition = _ref4.getPosition;

  var parentDomNode = parentData.domNode;
  var parentBoundingBox = parentData.boundingBox;

  if (!parentDomNode || !parentBoundingBox) {
    return;
  }

  // We need to find the height of the container *without* the placeholder.
  // Since it's possible that the placeholder might already be present,
  // we first set its height to 0.
  // This allows the container to collapse down to the size of just its
  // content (plus container padding or borders if any).
  applyStylesToDOMNode({ domNode: domNode, styles: { height: '0' } });

  // Find the distance by which the container would be collapsed by elements
  // leaving. We compare the freshly-available parent height with the original,
  // cached container height.
  var originalParentHeight = parentBoundingBox.height;
  var collapsedParentHeight = getPosition(parentDomNode).height;
  var reductionInHeight = originalParentHeight - collapsedParentHeight;

  // If the container has become shorter, update the padding element's
  // height to take up the difference. Otherwise set its height to zero,
  // so that it has no effect.
  var styles = {
    height: reductionInHeight > 0 ? reductionInHeight + 'px' : '0'
  };

  applyStylesToDOMNode({ domNode: domNode, styles: styles });
};

var getNativeNode = function getNativeNode(element) {
  // When running in a windowless environment, abort!
  if (typeof HTMLElement === 'undefined') {
    return null;
  }

  // `element` may already be a native node.
  if (element instanceof HTMLElement) {
    return element;
  }

  // While ReactDOM's `findDOMNode` is discouraged, it's the only
  // publicly-exposed way to find the underlying DOM node for
  // composite components.
  var foundNode = Object(react_dom__WEBPACK_IMPORTED_MODULE_1__["findDOMNode"])(element);

  if (foundNode && foundNode.nodeType === Node.TEXT_NODE) {
    // Text nodes are not supported
    return null;
  }
  // eslint-disable-next-line flowtype/no-weak-types
  return foundNode;
};

var createTransitionString = function createTransitionString(index, props) {
  var delay = props.delay,
      duration = props.duration;
  var staggerDurationBy = props.staggerDurationBy,
      staggerDelayBy = props.staggerDelayBy,
      easing = props.easing;


  delay += index * staggerDelayBy;
  duration += index * staggerDurationBy;

  var cssProperties = ['transform', 'opacity'];

  return cssProperties.map(function (prop) {
    return prop + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms';
  }).join(', ');
};

/**
 * React Flip Move
 * (c) 2016-present Joshua Comeau
 *
 * For information on how this code is laid out, check out CODE_TOUR.md
 */

/* eslint-disable react/prop-types */

// eslint-disable-next-line no-duplicate-imports


var transitionEnd = whichTransitionEvent();
var noBrowserSupport = !transitionEnd;

function getKey(childData) {
  return childData.key || '';
}

function getElementChildren(children) {
  // Fix incomplete typing of Children.toArray
  // eslint-disable-next-line flowtype/no-weak-types
  return react__WEBPACK_IMPORTED_MODULE_0__["Children"].toArray(children);
}

var FlipMove$1 = function (_Component) {
  inherits(FlipMove, _Component);

  function FlipMove() {
    var _temp, _this, _ret;

    classCallCheck(this, FlipMove);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      children: getElementChildren(
      // `this.props` ought to always be defined at this point, but a report
      // was made about it not being defined in IE10.
      // TODO: Test in IE10, to see if there's an underlying cause that can
      // be addressed.
      _this.props ? _this.props.children : []).map(function (element) {
        return _extends({}, element, {
          element: element,
          appearing: true
        });
      })
    }, _this.childrenData = {}, _this.parentData = {
      domNode: null,
      boundingBox: null
    }, _this.heightPlaceholderData = {
      domNode: null
    }, _this.remainingAnimations = 0, _this.childrenToAnimate = [], _this.findDOMContainer = function () {
      // eslint-disable-next-line react/no-find-dom-node
      var domNode = react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(_this);
      var parentNode = domNode && domNode.parentNode;

      // This ought to be impossible, but handling it for Flow's sake.
      if (!parentNode || !(parentNode instanceof HTMLElement)) {
        return;
      }

      // If the parent node has static positioning, leave animations might look
      // really funky. Let's automatically apply `position: relative` in this
      // case, to prevent any quirkiness.
      if (window.getComputedStyle(parentNode).position === 'static') {
        parentNode.style.position = 'relative';
        parentNodePositionStatic();
      }

      _this.parentData.domNode = parentNode;
    }, _this.runAnimation = function () {
      var dynamicChildren = _this.state.children.filter(_this.doesChildNeedToBeAnimated);

      // Splitting DOM reads and writes to be peformed in batches
      var childrenInitialStyles = dynamicChildren.map(function (child) {
        return _this.computeInitialStyles(child);
      });
      dynamicChildren.forEach(function (child, index) {
        _this.remainingAnimations += 1;
        _this.childrenToAnimate.push(getKey(child));
        _this.animateChild(child, index, childrenInitialStyles[index]);
      });

      if (typeof _this.props.onStartAll === 'function') {
        _this.callChildrenHook(_this.props.onStartAll);
      }
    }, _this.doesChildNeedToBeAnimated = function (child) {
      // If the child doesn't have a key, it's an immovable child (one that we
      // do not want to do FLIP stuff to.)
      if (!getKey(child)) {
        return false;
      }

      var childData = _this.getChildData(getKey(child));
      var childDomNode = childData.domNode;
      var childBoundingBox = childData.boundingBox;
      var parentBoundingBox = _this.parentData.boundingBox;

      if (!childDomNode) {
        return false;
      }

      var _this$props = _this.props,
          appearAnimation = _this$props.appearAnimation,
          enterAnimation = _this$props.enterAnimation,
          leaveAnimation = _this$props.leaveAnimation,
          getPosition = _this$props.getPosition;


      var isAppearingWithAnimation = child.appearing && appearAnimation;
      var isEnteringWithAnimation = child.entering && enterAnimation;
      var isLeavingWithAnimation = child.leaving && leaveAnimation;

      if (isAppearingWithAnimation || isEnteringWithAnimation || isLeavingWithAnimation) {
        return true;
      }

      // If it isn't entering/leaving, we want to animate it if it's
      // on-screen position has changed.

      var _getPositionDelta = getPositionDelta({
        childDomNode: childDomNode,
        childBoundingBox: childBoundingBox,
        parentBoundingBox: parentBoundingBox,
        getPosition: getPosition
      }),
          dX = _getPositionDelta[0],
          dY = _getPositionDelta[1];

      return dX !== 0 || dY !== 0;
    }, _temp), possibleConstructorReturn(_this, _ret);
  }
  // Copy props.children into state.
  // To understand why this is important (and not an anti-pattern), consider
  // how "leave" animations work. An item has "left" when the component
  // receives a new set of props that do NOT contain the item.
  // If we just render the props as-is, the item would instantly disappear.
  // We want to keep the item rendered for a little while, until its animation
  // can complete. Because we cannot mutate props, we make `state` the source
  // of truth.


  // FlipMove needs to know quite a bit about its children in order to do
  // its job. We store these as a property on the instance. We're not using
  // state, because we don't want changes to trigger re-renders, we just
  // need a place to keep the data for reference, when changes happen.
  // This field should not be accessed directly. Instead, use getChildData,
  // putChildData, etc...


  // Similarly, track the dom node and box of our parent element.


  // If `maintainContainerHeight` prop is set to true, we'll create a
  // placeholder element which occupies space so that the parent height
  // doesn't change when items are removed from the document flow (which
  // happens during leave animations)


  // Keep track of remaining animations so we know when to fire the
  // all-finished callback, and clean up after ourselves.
  // NOTE: we can't simply use childrenToAnimate.length to track remaining
  // animations, because we need to maintain the list of animating children,
  // to pass to the `onFinishAll` handler.


  FlipMove.prototype.componentDidMount = function componentDidMount() {
    // Because React 16 no longer requires wrapping elements, Flip Move can opt
    // to not wrap the children in an element. In that case, find the parent
    // element using `findDOMNode`.
    if (this.props.typeName === null) {
      this.findDOMContainer();
    }

    // Run our `appearAnimation` if it was requested, right after the
    // component mounts.
    var shouldTriggerFLIP = this.props.appearAnimation && !this.isAnimationDisabled(this.props);

    if (shouldTriggerFLIP) {
      this.prepForAnimation();
      this.runAnimation();
    }
  };

  FlipMove.prototype.componentDidUpdate = function componentDidUpdate(previousProps) {
    if (this.props.typeName === null) {
      this.findDOMContainer();
    }
    // If the children have been re-arranged, moved, or added/removed,
    // trigger the main FLIP animation.
    //
    // IMPORTANT: We need to make sure that the children have actually changed.
    // At the end of the transition, we clean up nodes that need to be removed.
    // We DON'T want this cleanup to trigger another update.

    var oldChildrenKeys = getElementChildren(this.props.children).map(function (d) {
      return d.key;
    });
    var nextChildrenKeys = getElementChildren(previousProps.children).map(function (d) {
      return d.key;
    });

    var shouldTriggerFLIP = !arraysEqual(oldChildrenKeys, nextChildrenKeys) && !this.isAnimationDisabled(this.props);

    if (shouldTriggerFLIP) {
      this.prepForAnimation();
      this.runAnimation();
    }
  };

  FlipMove.prototype.calculateNextSetOfChildren = function calculateNextSetOfChildren(nextChildren) {
    var _this2 = this;

    // We want to:
    //   - Mark all new children as `entering`
    //   - Pull in previous children that aren't in nextChildren, and mark them
    //     as `leaving`
    //   - Preserve the nextChildren list order, with leaving children in their
    //     appropriate places.
    //

    var updatedChildren = nextChildren.map(function (nextChild) {
      var child = _this2.findChildByKey(nextChild.key);

      // If the current child did exist, but it was in the midst of leaving,
      // we want to treat it as though it's entering
      var isEntering = !child || child.leaving;

      return _extends({}, nextChild, { element: nextChild, entering: isEntering });
    });

    // This is tricky. We want to keep the nextChildren's ordering, but with
    // any just-removed items maintaining their original position.
    // eg.
    //   this.state.children  = [ 1, 2, 3, 4 ]
    //   nextChildren         = [ 3, 1 ]
    //
    // In this example, we've removed the '2' & '4'
    // We want to end up with:  [ 2, 3, 1, 4 ]
    //
    // To accomplish that, we'll iterate through this.state.children. whenever
    // we find a match, we'll append our `leaving` flag to it, and insert it
    // into the nextChildren in its ORIGINAL position. Note that, as we keep
    // inserting old items into the new list, the "original" position will
    // keep incrementing.
    var numOfChildrenLeaving = 0;
    this.state.children.forEach(function (child, index) {
      var isLeaving = !find(function (_ref) {
        var key = _ref.key;
        return key === getKey(child);
      }, nextChildren);

      // If the child isn't leaving (or, if there is no leave animation),
      // we don't need to add it into the state children.
      if (!isLeaving || !_this2.props.leaveAnimation) return;

      var nextChild = _extends({}, child, { leaving: true });
      var nextChildIndex = index + numOfChildrenLeaving;

      updatedChildren.splice(nextChildIndex, 0, nextChild);
      numOfChildrenLeaving += 1;
    });

    return updatedChildren;
  };

  FlipMove.prototype.prepForAnimation = function prepForAnimation() {
    var _this3 = this;

    // Our animation prep consists of:
    // - remove children that are leaving from the DOM flow, so that the new
    //   layout can be accurately calculated,
    // - update the placeholder container height, if needed, to ensure that
    //   the parent's height doesn't collapse.

    var _props = this.props,
        leaveAnimation = _props.leaveAnimation,
        maintainContainerHeight = _props.maintainContainerHeight,
        getPosition = _props.getPosition;

    // we need to make all leaving nodes "invisible" to the layout calculations
    // that will take place in the next step (this.runAnimation).

    if (leaveAnimation) {
      var leavingChildren = this.state.children.filter(function (child) {
        return child.leaving;
      });

      leavingChildren.forEach(function (leavingChild) {
        var childData = _this3.getChildData(getKey(leavingChild));

        // Warn if child is disabled
        if (!_this3.isAnimationDisabled(_this3.props) && childData.domNode && childData.domNode.disabled) {
          childIsDisabled();
        }

        // We need to take the items out of the "flow" of the document, so that
        // its siblings can move to take its place.
        if (childData.boundingBox) {
          removeNodeFromDOMFlow(childData, _this3.props.verticalAlignment);
        }
      });

      if (maintainContainerHeight && this.heightPlaceholderData.domNode) {
        updateHeightPlaceholder({
          domNode: this.heightPlaceholderData.domNode,
          parentData: this.parentData,
          getPosition: getPosition
        });
      }
    }

    // For all children not in the middle of entering or leaving,
    // we need to reset the transition, so that the NEW shuffle starts from
    // the right place.
    this.state.children.forEach(function (child) {
      var _getChildData = _this3.getChildData(getKey(child)),
          domNode = _getChildData.domNode;

      // Ignore children that don't render DOM nodes (eg. by returning null)


      if (!domNode) {
        return;
      }

      if (!child.entering && !child.leaving) {
        applyStylesToDOMNode({
          domNode: domNode,
          styles: {
            transition: ''
          }
        });
      }
    });
  };

  // eslint-disable-next-line camelcase


  FlipMove.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    // When the component is handed new props, we need to figure out the
    // "resting" position of all currently-rendered DOM nodes.
    // We store that data in this.parent and this.children,
    // so it can be used later to work out the animation.
    this.updateBoundingBoxCaches();

    // Convert opaque children object to array.
    var nextChildren = getElementChildren(nextProps.children);

    // Next, we need to update our state, so that it contains our new set of
    // children. If animation is disabled or unsupported, this is easy;
    // we just copy our props into state.
    // Assuming that we can animate, though, we have to do some work.
    // Essentially, we want to keep just-deleted nodes in the DOM for a bit
    // longer, so that we can animate them away.
    this.setState({
      children: this.isAnimationDisabled(nextProps) ? nextChildren.map(function (element) {
        return _extends({}, element, { element: element });
      }) : this.calculateNextSetOfChildren(nextChildren)
    });
  };

  FlipMove.prototype.animateChild = function animateChild(child, index, childInitialStyles) {
    var _this4 = this;

    var _getChildData2 = this.getChildData(getKey(child)),
        domNode = _getChildData2.domNode;

    if (!domNode) {
      return;
    }

    // Apply the relevant style for this DOM node
    // This is the offset from its actual DOM position.
    // eg. if an item has been re-rendered 20px lower, we want to apply a
    // style of 'transform: translate(-20px)', so that it appears to be where
    // it started.
    // In FLIP terminology, this is the 'Invert' stage.
    applyStylesToDOMNode({
      domNode: domNode,
      styles: childInitialStyles
    });

    // Start by invoking the onStart callback for this child.
    if (this.props.onStart) this.props.onStart(child, domNode);

    // Next, animate the item from it's artificially-offset position to its
    // new, natural position.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        // NOTE, RE: the double-requestAnimationFrame:
        // Sadly, this is the most browser-compatible way to do this I've found.
        // Essentially we need to set the initial styles outside of any request
        // callbacks to avoid batching them. Then, a frame needs to pass with
        // the styles above rendered. Then, on the second frame, we can apply
        // our final styles to perform the animation.

        // Our first order of business is to "undo" the styles applied in the
        // previous frames, while also adding a `transition` property.
        // This way, the item will smoothly transition from its old position
        // to its new position.

        // eslint-disable-next-line flowtype/require-variable-type
        var styles = {
          transition: createTransitionString(index, _this4.props),
          transform: '',
          opacity: ''
        };

        if (child.appearing && _this4.props.appearAnimation) {
          styles = _extends({}, styles, _this4.props.appearAnimation.to);
        } else if (child.entering && _this4.props.enterAnimation) {
          styles = _extends({}, styles, _this4.props.enterAnimation.to);
        } else if (child.leaving && _this4.props.leaveAnimation) {
          styles = _extends({}, styles, _this4.props.leaveAnimation.to);
        }

        // In FLIP terminology, this is the 'Play' stage.
        applyStylesToDOMNode({ domNode: domNode, styles: styles });
      });
    });

    this.bindTransitionEndHandler(child);
  };

  FlipMove.prototype.bindTransitionEndHandler = function bindTransitionEndHandler(child) {
    var _this5 = this;

    var _getChildData3 = this.getChildData(getKey(child)),
        domNode = _getChildData3.domNode;

    if (!domNode) {
      return;
    }

    // The onFinish callback needs to be bound to the transitionEnd event.
    // We also need to unbind it when the transition completes, so this ugly
    // inline function is required (we need it here so it closes over
    // dependent variables `child` and `domNode`)
    var transitionEndHandler = function transitionEndHandler(ev) {
      // It's possible that this handler is fired not on our primary transition,
      // but on a nested transition (eg. a hover effect). Ignore these cases.
      if (ev.target !== domNode) return;

      // Remove the 'transition' inline style we added. This is cleanup.
      domNode.style.transition = '';

      // Trigger any applicable onFinish/onFinishAll hooks
      _this5.triggerFinishHooks(child, domNode);

      domNode.removeEventListener(transitionEnd, transitionEndHandler);

      if (child.leaving) {
        _this5.removeChildData(getKey(child));
      }
    };

    domNode.addEventListener(transitionEnd, transitionEndHandler);
  };

  FlipMove.prototype.triggerFinishHooks = function triggerFinishHooks(child, domNode) {
    var _this6 = this;

    if (this.props.onFinish) this.props.onFinish(child, domNode);

    // Reduce the number of children we need to animate by 1,
    // so that we can tell when all children have finished.
    this.remainingAnimations -= 1;

    if (this.remainingAnimations === 0) {
      // Remove any items from the DOM that have left, and reset `entering`.
      var nextChildren = this.state.children.filter(function (_ref2) {
        var leaving = _ref2.leaving;
        return !leaving;
      }).map(function (item) {
        return _extends({}, item, {
          // fix for Flow
          element: item.element,
          appearing: false,
          entering: false
        });
      });

      this.setState({ children: nextChildren }, function () {
        if (typeof _this6.props.onFinishAll === 'function') {
          _this6.callChildrenHook(_this6.props.onFinishAll);
        }

        // Reset our variables for the next iteration
        _this6.childrenToAnimate = [];
      });

      // If the placeholder was holding the container open while elements were
      // leaving, we we can now set its height to zero.
      if (this.heightPlaceholderData.domNode) {
        this.heightPlaceholderData.domNode.style.height = '0';
      }
    }
  };

  FlipMove.prototype.callChildrenHook = function callChildrenHook(hook) {
    var _this7 = this;

    var elements = [];
    var domNodes = [];

    this.childrenToAnimate.forEach(function (childKey) {
      // If this was an exit animation, the child may no longer exist.
      // If so, skip it.
      var child = _this7.findChildByKey(childKey);

      if (!child) {
        return;
      }

      elements.push(child);

      if (_this7.hasChildData(childKey)) {
        domNodes.push(_this7.getChildData(childKey).domNode);
      }
    });

    hook(elements, domNodes);
  };

  FlipMove.prototype.updateBoundingBoxCaches = function updateBoundingBoxCaches() {
    var _this8 = this;

    // This is the ONLY place that parentData and childrenData's
    // bounding boxes are updated. They will be calculated at other times
    // to be compared to this value, but it's important that the cache is
    // updated once per update.
    var parentDomNode = this.parentData.domNode;

    if (!parentDomNode) {
      return;
    }

    this.parentData.boundingBox = this.props.getPosition(parentDomNode);

    // Splitting DOM reads and writes to be peformed in batches
    var childrenBoundingBoxes = [];

    this.state.children.forEach(function (child) {
      var childKey = getKey(child);

      // It is possible that a child does not have a `key` property;
      // Ignore these children, they don't need to be moved.
      if (!childKey) {
        childrenBoundingBoxes.push(null);
        return;
      }

      // In very rare circumstances, for reasons unknown, the ref is never
      // populated for certain children. In this case, avoid doing this update.
      // see: https://github.com/joshwcomeau/react-flip-move/pull/91
      if (!_this8.hasChildData(childKey)) {
        childrenBoundingBoxes.push(null);
        return;
      }

      var childData = _this8.getChildData(childKey);

      // If the child element returns null, we need to avoid trying to
      // account for it
      if (!childData.domNode || !child) {
        childrenBoundingBoxes.push(null);
        return;
      }

      childrenBoundingBoxes.push(getRelativeBoundingBox({
        childDomNode: childData.domNode,
        parentDomNode: parentDomNode,
        getPosition: _this8.props.getPosition
      }));
    });

    this.state.children.forEach(function (child, index) {
      var childKey = getKey(child);

      var childBoundingBox = childrenBoundingBoxes[index];

      if (!childKey) {
        return;
      }

      _this8.setChildData(childKey, {
        boundingBox: childBoundingBox
      });
    });
  };

  FlipMove.prototype.computeInitialStyles = function computeInitialStyles(child) {
    if (child.appearing) {
      return this.props.appearAnimation ? this.props.appearAnimation.from : {};
    } else if (child.entering) {
      if (!this.props.enterAnimation) {
        return {};
      }
      // If this child was in the middle of leaving, it still has its
      // absolute positioning styles applied. We need to undo those.
      return _extends({
        position: '',
        top: '',
        left: '',
        right: '',
        bottom: ''
      }, this.props.enterAnimation.from);
    } else if (child.leaving) {
      return this.props.leaveAnimation ? this.props.leaveAnimation.from : {};
    }

    var childData = this.getChildData(getKey(child));
    var childDomNode = childData.domNode;
    var childBoundingBox = childData.boundingBox;
    var parentBoundingBox = this.parentData.boundingBox;

    if (!childDomNode) {
      return {};
    }

    var _getPositionDelta2 = getPositionDelta({
      childDomNode: childDomNode,
      childBoundingBox: childBoundingBox,
      parentBoundingBox: parentBoundingBox,
      getPosition: this.props.getPosition
    }),
        dX = _getPositionDelta2[0],
        dY = _getPositionDelta2[1];

    return {
      transform: 'translate(' + dX + 'px, ' + dY + 'px)'
    };
  };

  // eslint-disable-next-line class-methods-use-this


  FlipMove.prototype.isAnimationDisabled = function isAnimationDisabled(props) {
    // If the component is explicitly passed a `disableAllAnimations` flag,
    // we can skip this whole process. Similarly, if all of the numbers have
    // been set to 0, there is no point in trying to animate; doing so would
    // only cause a flicker (and the intent is probably to disable animations)
    // We can also skip this rigamarole if there's no browser support for it.
    return noBrowserSupport || props.disableAllAnimations || props.duration === 0 && props.delay === 0 && props.staggerDurationBy === 0 && props.staggerDelayBy === 0;
  };

  FlipMove.prototype.findChildByKey = function findChildByKey(key) {
    return find(function (child) {
      return getKey(child) === key;
    }, this.state.children);
  };

  FlipMove.prototype.hasChildData = function hasChildData(key) {
    // Object has some built-in properties on its prototype, such as toString.  hasOwnProperty makes
    // sure that key is present on childrenData itself, not on its prototype.
    return Object.prototype.hasOwnProperty.call(this.childrenData, key);
  };

  FlipMove.prototype.getChildData = function getChildData(key) {
    return this.hasChildData(key) ? this.childrenData[key] : {};
  };

  FlipMove.prototype.setChildData = function setChildData(key, data) {
    this.childrenData[key] = _extends({}, this.getChildData(key), data);
  };

  FlipMove.prototype.removeChildData = function removeChildData(key) {
    delete this.childrenData[key];
    this.setState(function (prevState) {
      return _extends({}, prevState, {
        children: prevState.children.filter(function (child) {
          return child.element.key !== key;
        })
      });
    });
  };

  FlipMove.prototype.createHeightPlaceholder = function createHeightPlaceholder() {
    var _this9 = this;

    var typeName = this.props.typeName;

    // If requested, create an invisible element at the end of the list.
    // Its height will be modified to prevent the container from collapsing
    // prematurely.

    var isContainerAList = typeName === 'ul' || typeName === 'ol';
    var placeholderType = isContainerAList ? 'li' : 'div';

    return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(placeholderType, {
      key: 'height-placeholder',
      ref: function ref(domNode) {
        _this9.heightPlaceholderData.domNode = domNode;
      },
      style: { visibility: 'hidden', height: 0 }
    });
  };

  FlipMove.prototype.childrenWithRefs = function childrenWithRefs() {
    var _this10 = this;

    // We need to clone the provided children, capturing a reference to the
    // underlying DOM node. Flip Move needs to use the React escape hatches to
    // be able to do its calculations.
    return this.state.children.map(function (child) {
      return Object(react__WEBPACK_IMPORTED_MODULE_0__["cloneElement"])(child.element, {
        ref: function ref(element) {
          // Functional Components without a forwarded ref are not supported by FlipMove,
          // because they don't have instances.
          if (!element) {
            return;
          }

          var domNode = getNativeNode(element);
          _this10.setChildData(getKey(child), { domNode: domNode });
        }
      });
    });
  };

  FlipMove.prototype.render = function render() {
    var _this11 = this;

    var _props2 = this.props,
        typeName = _props2.typeName,
        delegated = _props2.delegated,
        leaveAnimation = _props2.leaveAnimation,
        maintainContainerHeight = _props2.maintainContainerHeight;


    var children = this.childrenWithRefs();
    if (leaveAnimation && maintainContainerHeight) {
      children.push(this.createHeightPlaceholder());
    }

    if (!typeName) return children;

    var props = _extends({}, delegated, {
      children: children,
      ref: function ref(node) {
        _this11.parentData.domNode = node;
      }
    });

    return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(typeName, props);
  };

  return FlipMove;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var enhancedFlipMove = /* #__PURE__ */propConverter(FlipMove$1);

/**
 * React Flip Move
 * (c) 2016-present Joshua Comeau
 */

/* harmony default export */ __webpack_exports__["default"] = (enhancedFlipMove);


/***/ }),

/***/ "./node_modules/use-typed-event-listener/dist/index.esm.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__("./node_modules/react/index.js");
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// CONCATENATED MODULE: ./node_modules/dequal/dist/index.mjs
var has = Object.prototype.hasOwnProperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (ctor === Set) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo.getInt8(len) === bar.getInt8(len));
			}
			return len === -1;
		}

		if (ArrayBuffer.isView(foo)) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

// CONCATENATED MODULE: ./node_modules/use-deep-compare/dist-web/index.js



function useDeepCompareMemoize(dependencies) {
  const dependenciesRef = react_default.a.useRef(dependencies);
  const signalRef = react_default.a.useRef(0);

  if (!dequal(dependencies, dependenciesRef.current)) {
    dependenciesRef.current = dependencies;
    signalRef.current += 1;
  }

  return react_default.a.useMemo(() => dependenciesRef.current, [signalRef.current]);
}

/**
 * `useDeepCompareCallback` will return a memoized version of the callback that
 * only changes if one of the `dependencies` has changed.
 *
 * Warning: `useDeepCompareCallback` should not be used with dependencies that
 * are all primitive values. Use `React.useCallback` instead.
 *
 * @see {@link https://react.dev/reference/react/useCallback}
 */

function useDeepCompareCallback(callback, dependencies) {
  return react_default.a.useCallback(callback, useDeepCompareMemoize(dependencies));
}

/**
 * Accepts a function that contains imperative, possibly effectful code.
 *
 * Warning: `useDeepCompareEffect` should not be used with dependencies that
 * are all primitive values. Use `React.useEffect` instead.
 *
 * @see {@link https://react.dev/reference/react/useEffect}
 */

function useDeepCompareEffect(effect, dependencies) {
  react_default.a.useEffect(effect, useDeepCompareMemoize(dependencies));
}

/**
 * `useDeepCompareImperativeHandle` customizes the instance value that is exposed to parent components when using `ref`.
 * As always, imperative code using refs should be avoided in most cases.
 *
 * `useDeepCompareImperativeHandle` should be used with `React.forwardRef`.
 *
 * It's similar to `useImperativeHandle`, but uses deep comparison on the dependencies.
 *
 * Warning: `useDeepCompareImperativeHandle` should not be used with dependencies that
 * are all primitive values. Use `React.useImperativeHandle` instead.
 *
 * @see {@link https://react.dev/reference/react/useImperativeHandle}
 */

function useDeepCompareImperativeHandle(ref, init, dependencies) {
  react_default.a.useImperativeHandle(ref, init, useDeepCompareMemoize(dependencies));
}

/**
 * The signature is identical to `useDeepCompareEffect`, but it fires synchronously after all DOM mutations.
 * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
 * `useDeepCompareLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
 *
 * Prefer the standard `useDeepCompareEffect` when possible to avoid blocking visual updates.
 *
 * If you’re migrating code from a class component, `useDeepCompareLayoutEffect` fires in the same phase as
 * `componentDidMount` and `componentDidUpdate`.
 *
 * Warning: `useDeepCompareLayoutEffect` should not be used with dependencies that
 * are all primitive values. Use `React.useLayoutEffect` instead.
 *
 * @see {@link https://react.dev/reference/react/useLayoutEffect}
 */

function useDeepCompareLayoutEffect(effect, dependencies) {
  react_default.a.useLayoutEffect(effect, useDeepCompareMemoize(dependencies));
}

/**
 * `useDeepCompareMemo` will only recompute the memoized value when one of the
 * `dependencies` has changed.
 *
 * Warning: `useDeepCompareMemo` should not be used with dependencies that
 * are all primitive values. Use `React.useMemo` instead.
 *
 * @see {@link https://react.dev/reference/react/useMemo}
 */

function useDeepCompareMemo(factory, dependencies) {
  return react_default.a.useMemo(factory, useDeepCompareMemoize(dependencies));
}


//# sourceMappingURL=index.js.map

// CONCATENATED MODULE: ./node_modules/use-typed-event-listener/dist/index.esm.js
/* harmony default export */ var index_esm = __webpack_exports__["default"] = (function(n,o,c,u){const i=Object(react["useRef"])(c);i.current=c;const m=useDeepCompareMemo(()=>u,[u]);Object(react["useEffect"])(()=>{if(!n)return;const e=e=>i.current.call(n,e);return n.addEventListener(o,e,m),()=>{n.removeEventListener(o,e,m)}},[n,o,m])});
//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./src/main/webapp/collections/MLModels.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/models/MLModel.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esRegexpExec, _esStringSearch, _swcMltk, _MLModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _MLModel = _interopRequireDefault(_MLModel);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.SplunkDsBaseCollection.extend({
    model: _MLModel.default,
    url: 'mltk/list_models',
    sync: function sync(method, collection, options) {
      var clonedOptions = _swcMltk.jquery.extend(true, {
        data: {}
      }, options);
      switch (method) {
        case 'read':
          {
            var filteredSearch = 'name!=__mlspl__exp*';
            if (clonedOptions.data.search) {
              clonedOptions.data.search = "(".concat(clonedOptions.data.search, ") AND (").concat(filteredSearch, ")");
            } else {
              clonedOptions.data.search = filteredSearch;
            }
            break;
          }
        default:
          break;
      }
      return _swcMltk.SplunkDsBaseCollection.prototype.sync.apply(this, [method, collection, clonedOptions]);
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/models/ModelsForm/ModalPop.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.finally.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.match.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./node_modules/@splunk/react-ui/File.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/WaitSpinner.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/models/ModelsForm/modelsApi.es"), __webpack_require__("./src/main/webapp/components/shared/ToastContext/ToastContext.ts"), __webpack_require__("./src/main/webapp/components/models/ModelsForm/ModelsForm.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esFunctionName, _esObjectToString, _esPromise, _esPromiseFinally, _esRegexpExec, _esStringMatch, _react, _propTypes, _Button, _ControlGroup, _File, _Modal, _Text, _WaitSpinner, _ToastConstants, _i18n, _modelsApi, _ToastContext, _ModelsForm) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.TARGETS_HELP = _exports.MODEL_NAME_HELP = _exports.MODEL_FILE = _exports.FILE_HELP = _exports.FEATURES_HELP = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  _File = _interopRequireDefault(_File);
  _Modal = _interopRequireDefault(_Modal);
  _Text = _interopRequireDefault(_Text);
  _WaitSpinner = _interopRequireDefault(_WaitSpinner);
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
  var MODEL_FILE = _exports.MODEL_FILE = (0, _i18n.gettext)('Model File');
  var MODEL_NAME_HELP = _exports.MODEL_NAME_HELP = (0, _i18n.gettext)('Model Name must be alphanumeric and can include underscores. Model name must end in .onnx.');
  var FEATURES_HELP = _exports.FEATURES_HELP = (0, _i18n.gettext)('Feature variable(s) must be alphanumeric and comma separated and can include underscores. Ex: feat1,feat2,feat3');
  var TARGETS_HELP = _exports.TARGETS_HELP = (0, _i18n.gettext)('Target variable must be alphanumeric and can include underscores.');
  var FILE_HELP = _exports.FILE_HELP = (0, _i18n.gettext)('Model File name must match the Model Name.');
  var initState = {
    error: false,
    value: ''
  };
  var propTypes = {
    initialState: _propTypes.default.shape({
      file: _propTypes.default.instanceOf(_File.default)
    })
  };
  var defaultProps = {
    initialState: {
      file: undefined
    }
  };
  var ModalPop = function ModalPop(_ref) {
    var initialState = _ref.initialState;
    var _useState = (0, _react.useState)(initState),
      _useState2 = _slicedToArray(_useState, 2),
      modelName = _useState2[0],
      setModelName = _useState2[1];
    var _useState3 = (0, _react.useState)(initState),
      _useState4 = _slicedToArray(_useState3, 2),
      features = _useState4[0],
      setFeatures = _useState4[1];
    var _useState5 = (0, _react.useState)(initState),
      _useState6 = _slicedToArray(_useState5, 2),
      targets = _useState6[0],
      setTargets = _useState6[1];
    var _useState7 = (0, _react.useState)(initialState.file || undefined),
      _useState8 = _slicedToArray(_useState7, 2),
      file = _useState8[0],
      setFile = _useState8[1];
    var createToast = (0, _react.useContext)(_ToastContext.ToastContext);
    var modalToggle = (0, _react.useRef)(null);
    var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      open = _useState10[0],
      setOpen = _useState10[1];
    // eslint-disable-next-line no-unused-vars
    var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      showAction = _useState12[0],
      setShowAction = _useState12[1];
    var _useState13 = (0, _react.useState)(false),
      _useState14 = _slicedToArray(_useState13, 2),
      loading = _useState14[0],
      setLoading = _useState14[1];
    var toastData = {
      type: _ToastConstants.TOAST_TYPES.SUCCESS,
      message: 'Model has been successfully uploaded. Refresh the page to get the updated table.',
      autoDismiss: true,
      dismissOnActionClick: true,
      showAction: showAction
    };

    // <File> handler code
    var fileReader = new FileReader();
    var handleAddFiles = function handleAddFiles(files) {
      if (files.length > 0) {
        var uploadedFile = files[0];
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
        fileReader.onload = function () {
          // can access fileReader.result
          setFile(uploadedFile);
        };
        fileReader.readAsDataURL(uploadedFile);
      }
    };
    var handleRemoveFile = function handleRemoveFile() {
      if (fileReader.readyState === 1) {
        fileReader.abort();
      }
      setFile(undefined);
    };
    // <File> handler code END

    var handleRequestOpen = function handleRequestOpen() {
      return setOpen(true);
    };
    var handleRequestClose = function handleRequestClose() {
      var _modalToggle$current;
      setOpen(false);
      // eslint-disable-next-line babel/no-unused-expressions
      modalToggle === null || modalToggle === void 0 ? void 0 : (_modalToggle$current = modalToggle.current) === null || _modalToggle$current === void 0 ? void 0 : _modalToggle$current.focus(); // Must return focus to the invoking element when the modal closes
    };
    var handleRequestSubmit = function handleRequestSubmit() {
      setLoading(true);
      var formdetails = {
        model_name: modelName.value,
        features: features.value,
        file: file,
        targets: targets.value
      };
      (0, _modelsApi.upload)(formdetails).then(function () {
        createToast(_objectSpread(_objectSpread({}, toastData), {}, {
          action: showAction ? {
            label: 'Close on click'
          } : undefined
        }));
        handleRequestClose();
      }).catch(function (e) {
        createToast(_objectSpread(_objectSpread({}, toastData), {}, {
          message: e.message,
          type: _ToastConstants.TOAST_TYPES.ERROR,
          action: showAction ? {
            label: 'Close on click'
          } : undefined
        }));
      }).finally(function () {
        return setLoading(false);
      });
    };
    var handleOnChange = function handleOnChange(setState, pattern) {
      return function (e, _ref2) {
        var value = _ref2.value;
        var error = value.match(pattern) == null;
        setState({
          error: error,
          value: value
        });
      };
    };
    var fileError = file ? (file === null || file === void 0 ? void 0 : file.name) !== modelName.value : false;
    var formDetails = [_objectSpread(_objectSpread({}, modelName), {}, {
      help: modelName.error && MODEL_NAME_HELP,
      label: (0, _i18n.gettext)('Model Name'),
      onChange: handleOnChange(setModelName, /^\w+\.onnx$/g),
      pattern: /^\w+\.onnx$/g
    }), _objectSpread(_objectSpread({}, features), {}, {
      help: features.error && FEATURES_HELP,
      label: (0, _i18n.gettext)('Feature Variables'),
      onChange: handleOnChange(setFeatures, /^\w+(,\w+)*$/g),
      pattern: /^\w+(,\w+)*$/g
    }), _objectSpread(_objectSpread({}, targets), {}, {
      help: targets.error && TARGETS_HELP,
      label: (0, _i18n.gettext)('Target Variable'),
      onChange: handleOnChange(setTargets, /^\w+$/g),
      pattern: /^\w+$/g
    }), {
      error: fileError,
      help: fileError && FILE_HELP,
      label: MODEL_FILE,
      name: file === null || file === void 0 ? void 0 : file.name
    }];
    var disableSubmit = formDetails.some(function (_ref3) {
      var error = _ref3.error,
        value = _ref3.value;
      return error === true || value === '' || file == null;
    });
    var controlGroups = formDetails.map(function (_ref4) {
      var error = _ref4.error,
        help = _ref4.help,
        label = _ref4.label,
        onChange = _ref4.onChange,
        name = _ref4.name,
        value = _ref4.value;
      return /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
        key: label,
        "data-test": "form-group",
        error: error,
        help: help,
        label: label
      }, label === MODEL_FILE ? /*#__PURE__*/_react.default.createElement(_File.default, {
        "data-test": "form-file",
        error: error,
        onRequestAdd: handleAddFiles,
        onRequestRemove: handleRemoveFile
      }, file && /*#__PURE__*/_react.default.createElement(_File.default.Item, {
        "data-test": "form-file-item",
        name: name
      })) : /*#__PURE__*/_react.default.createElement(_Text.default, {
        canClear: true,
        "data-test": "form-text",
        error: error,
        onChange: onChange,
        value: value
      }));
    });
    var submitBtnLabel = loading ? /*#__PURE__*/_react.default.createElement(_WaitSpinner.default, {
      size: "medium"
    }) : (0, _i18n.gettext)('Submit');
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      innerRef: modalToggle,
      label: (0, _i18n.gettext)('Upload ONNX model'),
      onClick: handleRequestOpen
    }), /*#__PURE__*/_react.default.createElement(_ModelsForm.StyledModal, {
      onRequestClose: handleRequestClose,
      open: open
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: handleRequestClose,
      title: (0, _i18n.gettext)('ONNX model upload')
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, controlGroups), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      label: (0, _i18n.gettext)('Cancel'),
      onClick: handleRequestClose
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: disableSubmit || loading,
      label: submitBtnLabel,
      onClick: handleRequestSubmit
    }))));
  };
  ModalPop.defaultProps = defaultProps;
  ModalPop.propTypes = propTypes;
  var _default = _exports.default = ModalPop;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/models/ModelsForm/ModelsForm.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _Modal, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledModal = void 0;
  _Modal = _interopRequireDefault(_Modal);
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledModal = _exports.StyledModal = (0, _styledComponents.default)(_Modal.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    width: 600px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/models/ModelsForm/modelsApi.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/fetch.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayConcat, _esDateToPrimitive, _esNumberConstructor, _esObjectKeys, _esObjectToString, _esPromise, _webDomCollectionsForEach, _config, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.upload = _exports.getFetchOptions = void 0;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var urlEncodedAppName = encodeURIComponent(_config.app);
  var urlEncodedUsername = encodeURIComponent(_config.username);
  var outputModeJson = '?output_mode=json';
  var getFetchOptions = _exports.getFetchOptions = function getFetchOptions(method, data) {
    var options = _objectSpread(_objectSpread({}, _fetch.defaultFetchInit), {}, {
      method: method
    });
    // options.headers['Content-Type'] = 'multipart/form-data;' this must be removed to pass boundary
    delete options.headers['Content-Type'];
    var formdata = new FormData();
    Object.keys(data).forEach(function (key) {
      return formdata.append(key, data[key]);
    });
    options.body = formdata;
    return options;
  };
  var upload = _exports.upload = function upload(formdetails) {
    var savedSearchEndpoint = "".concat(_config.splunkdPath, "/servicesNS/").concat(urlEncodedUsername, "/").concat(urlEncodedAppName, "/mltk/upload_model").concat(outputModeJson);
    return fetch(savedSearchEndpoint, getFetchOptions('POST', formdetails)).then((0, _fetch.handleResponse)(200)).catch(function (e) {
      return e.json().then(function (err) {
        return Promise.reject(new Error(err.message));
      });
    });
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/models/ModelsPage/ModelsPage.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastMessages.js"), __webpack_require__("./src/main/webapp/components/models/ModelsForm/ModalPop.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _ToastMessages, _ModalPop) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _ToastMessages = _interopRequireDefault(_ToastMessages);
  _ModalPop = _interopRequireDefault(_ModalPop);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * This is the starting component of the Models React part of the page
   */

  var ModelsPage = function ModelsPage() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ToastMessages.default, null), /*#__PURE__*/_react.default.createElement(_ModalPop.default, null));
  };
  var _default = _exports.default = ModelsPage;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/shared/ToastContext/ToastContext.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToastContext", function() { return ToastContext; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _splunk_react_toast_notifications_Toaster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@splunk/react-toast-notifications/Toaster.js");
/* harmony import */ var _splunk_react_toast_notifications_Toaster__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_splunk_react_toast_notifications_Toaster__WEBPACK_IMPORTED_MODULE_1__);



const createToast = Object(_splunk_react_toast_notifications_Toaster__WEBPACK_IMPORTED_MODULE_1__["makeCreateToast"])(_splunk_react_toast_notifications_Toaster__WEBPACK_IMPORTED_MODULE_1___default.a);
const ToastContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["createContext"])(createToast);


/***/ }),

/***/ "./src/main/webapp/models/Lookup.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  // A base model for MLTK lookup files, implementing some basic functionality
  var _default = _exports.default = _swcMltk.LookupTableFileModel.extend({
    getFormattedName: function getFormattedName() {
      return this.entry.get('name');
    },
    getDescription: function getDescription() {
      return '';
    },
    canEditPermissions: function canEditPermissions() {
      return this.canWrite() && this.entry.acl.get('can_change_perms');
    },
    canDelete: function canDelete() {
      return this.entry.links.has('remove');
    },
    canWrite: function canWrite() {
      return this.entry.acl.get('can_write');
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/models/MLModel.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/models/Lookup.es"), __webpack_require__("./src/main/webapp/models/MLSPLInfo.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _swcMltk, _Lookup, _MLSPLInfo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Lookup = _interopRequireDefault(_Lookup);
  _MLSPLInfo = _interopRequireDefault(_MLSPLInfo);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var mlSplNamespace = 'mlspl:model_info';
  var _default = _exports.default = _Lookup.default.extend({
    getModelInfo: function getModelInfo(key) {
      return this.entry.content.get("".concat(mlSplNamespace, ".").concat(key));
    },
    getType: function getType() {
      return this.getModelInfo('algo_name');
    },
    getFormattedName: function getFormattedName() {
      return this.getModelInfo('model_name');
    },
    getTargetVariable: function getTargetVariable() {
      var targetVariable = this.getModelInfo('target_variable');

      // pre-2.2 model compat: see convert_variable_names in models/base.py
      // this is weird because "target_variable" used to be encoded in "variables", but only when "explanatory_variables" was set
      if (targetVariable == null && this.getModelInfo('explanatory_variables') != null) {
        targetVariable = this.getModelInfo('variables');
      }
      return targetVariable;
    },
    getFeatureVariables: function getFeatureVariables() {
      var featureVariables = this.getModelInfo('feature_variables');
      if (featureVariables == null) {
        // pre-2.2 model compat: see convert_variable_names in models/base.py
        // this is weird because "feature_variables" used to be encoded in either "explanatory_variables" or "variables"
        var explanatoryVariables = this.getModelInfo('explanatory_variables');
        if (explanatoryVariables != null) featureVariables = explanatoryVariables;else featureVariables = this.getModelInfo('variables');
      }
      return featureVariables;
    }
  }, {
    Entry: _swcMltk.BaseModel.extend({}, {
      Links: _swcMltk.BaseModel,
      ACL: _swcMltk.ACLReadOnlyModel,
      Content: _MLSPLInfo.default.extend({
        mlSplNamespace: mlSplNamespace
      }),
      Fields: _swcMltk.BaseModel
    })
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/models/MLSPLInfo.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  // a custom model that allows the mlspl:... namespace to accept queries for its properties, ie. 'mlspl:model_info.model_name'
  var _default = _exports.default = _swcMltk.BaseModel.extend({
    mlSplNamespace: null,
    // the name of the key where mlspl-specific properties are stored, enabling some extra query abilities
    get: function get(attr) {
      if (this.mlSplNamespace != null && attr.indexOf("".concat(this.mlSplNamespace, ".")) === 0) {
        var attrValue = _swcMltk.BaseModel.prototype.get.apply(this, [this.mlSplNamespace]);
        var subAttr = attr.substring(this.mlSplNamespace.length + 1);
        return attrValue[subAttr];
      } else {
        return _swcMltk.BaseModel.prototype.get.apply(this, arguments);
      }
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Models.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("models/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var ModelsRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Models'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.modelsView) {
        // TODO: Properly handle the backbutton by not requiring the entire page to be re-instantiated.
        // This is a failsafe for now if the querystring gets updated and then the user clicks the backbutton.
        // In this case the DOM is guaranteed to be cleaned up. We have not yet confirmed that all listeners
        // will be cleaned up.
        this.modelsView.remove();
      }
      this.modelsView = new _Master.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = ModelsRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "lookups/table/DeleteDialog":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _module) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.ModalView.extend({
    moduleId: _module.default.id,
    /**
     * @param {Object} options
     * @param {Object} options.model
     * @param {Object} options.model.lookupsModel <models.lookupsModel>
     * @param {string} options.lookupType the label to use in the dialogue
     * @param {string} options.lookupName the name to use in the span text
     */
    initialize: function initialize(options) {
      _swcMltk.ModalView.prototype.initialize.apply(this, arguments);
      this.children.flashMessage = new _swcMltk.FlashMessagesView({
        model: this.model.lookupsModel
      });
    },
    events: _swcMltk.jquery.extend({}, _swcMltk.ModalView.prototype.events, {
      'click .btn-primary': function click_BtnPrimary(e) {
        var _this = this;
        var deleteDeferred = this.model.lookupsModel.destroy({
          wait: true
        });
        _swcMltk.jquery.when(deleteDeferred).then(function () {
          _this.hide();
        });
        e.preventDefault();
      }
    }),
    render: function render() {
      this.$el.html(_swcMltk.ModalView.TEMPLATE);
      this.children.flashMessage.render().prependTo(this.$(_swcMltk.ModalView.BODY_SELECTOR));
      this.$(_swcMltk.ModalView.HEADER_TITLE_SELECTOR).html("Delete ".concat(this.options.lookupType));
      this.$(_swcMltk.ModalView.BODY_SELECTOR).append("<span>Are you sure you want to delete <em>".concat(this.options.lookupName, "</em> ?</span>"));
      this.$(_swcMltk.ModalView.FOOTER_SELECTOR).append(_swcMltk.ModalView.BUTTON_CANCEL);
      this.$(_swcMltk.ModalView.FOOTER_SELECTOR).append(this.compiledTemplate({}));
      return this;
    },
    template: "\n        <a href=\"#\" class=\"btn btn-primary\">Delete</a>\n    "
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "models/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), module, __webpack_require__("./src/main/webapp/collections/MLModels.es"), __webpack_require__("lookups/table/TableCaption"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("models/table/Master"), __webpack_require__("./src/main/webapp/components/models/ModelsPage/ModelsPage.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFind, _esObjectToString, _root, _react, _reactDom, _swcMltk, _underscoreMltk, _module, _MLModels, _TableCaption, _BaseDashboard, _Master, _ModelsPage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _module = _interopRequireDefault(_module);
  _MLModels = _interopRequireDefault(_MLModels);
  _TableCaption = _interopRequireDefault(_TableCaption);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _Master = _interopRequireDefault(_Master);
  _ModelsPage = _interopRequireDefault(_ModelsPage);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var Page = (0, _root.hot)(_ModelsPage.default);
  var modelsListContainerId = 'modelsListContainer';
  var ModelsView = _BaseDashboard.default.extend({
    moduleId: _module.default.id,
    id: 'mltkModelsView',
    // required for spinner
    headerOptions: {
      title: 'Models'
    },
    initialize: function initialize(options) {
      var _this = this;
      _BaseDashboard.default.prototype.initialize.call(this, options);
      this.mlModelsCollection = new _MLModels.default();
      this.uiPrefsModel = new _swcMltk.UIPrefModel();
      this.applicationModel = _swcMltk.SharedModels.get('app');
      this.stateModel = new _swcMltk.BaseModel({
        sortKey: 'name',
        sortDirection: 'asc',
        count: 100,
        offset: 0,
        fetching: true
      });
      this.rawSearch = new _swcMltk.BaseModel();
      if (!this.uiPrefsDeferred) {
        this.uiPrefsDeferred = _swcMltk.jquery.Deferred();
        this.uiPrefsModel.bootstrap(this.uiPrefsDeferred, _swcMltk.SharedModels.get('app').get('page'), _swcMltk.SharedModels.get('app').get('app'), this.applicationModel.get('owner'));
      }
      this.uiPrefsModel.entry.content.on('change', function () {
        _this.populateUIPrefs();
      });
      this.uiPrefsModel.entry.content.on('change:display.prefs.aclFilter', function () {
        _this.fetchListCollection();
      });
    },
    populateUIPrefs: function populateUIPrefs() {
      var data = {};
      if (this.uiPrefsModel.isNew()) {
        data = {
          app: this.applicationModel.get('app'),
          owner: this.applicationModel.get('owner')
        };
      }
      this.uiPrefsModel.save({}, {
        data: data
      });
    },
    getButtonFilterSearch: function getButtonFilterSearch() {
      var buttonFilter = this.uiPrefsModel.entry.content.get('display.prefs.aclFilter');
      if (_underscoreMltk.default.isUndefined(buttonFilter) || buttonFilter === 'none') {
        return '';
      } else {
        switch (buttonFilter) {
          case 'owner':
            return "(eai:acl.owner=".concat(_swcMltk.splunkDUtils.quoteSearchFilterValue(this.applicationModel.get('owner')), ")");
          case 'app':
            return "(eai:acl.app=".concat(_swcMltk.splunkDUtils.quoteSearchFilterValue(this.applicationModel.get('app')), ")");
          default:
            return '';
        }
      }
    },
    fetchListCollection: function fetchListCollection() {
      var _this2 = this;
      var app = this.applicationModel.get('app') === 'system' ? '-' : this.applicationModel.get('app');
      var search = this.stateModel.get('search') || '';
      var buttonFilterSearch = this.getButtonFilterSearch();
      var sortDir = this.stateModel.get('sortDirection');
      var sortKey = this.stateModel.get('sortKey').split(',');
      var sortMode = 'natural';
      if (buttonFilterSearch) {
        search += buttonFilterSearch;
      }
      if (sortKey[0] === 'name' || sortKey[0] === 'eai:acl.owner' || sortKey[0] === 'eai:acl.app' || sortKey[0] === 'eai:acl.sharing') {
        sortDir = [sortDir, sortDir];
        sortMode = [sortMode, sortMode];
      }
      this.stateModel.set('fetching', true);
      return this.mlModelsCollection.fetch({
        data: {
          app: app,
          owner: _swcMltk.SharedModels.get('app').get('owner'),
          sort_dir: sortDir,
          sort_key: sortKey,
          sort_mode: sortMode,
          search: search,
          count: this.stateModel.get('count'),
          offset: this.stateModel.get('offset')
        },
        success: function success() {
          _this2.stateModel.set('fetching', false);
        }
      });
    },
    render: function render() {
      var _this3 = this;
      var self = this;
      _BaseDashboard.default.prototype.render.call(this);
      this.fetchListCollection();
      this.stateModel.on('change:sortDirection change:sortKey change:search change:offset', _underscoreMltk.default.debounce(function () {
        _this3.fetchListCollection();
      }, 0), this);
      this.mlModelsCollection.on('destroy', function () {
        _this3.fetchListCollection();
      }, this);
      // setup a few UI containers
      this.modelsList$El = self.$el.find("#".concat(modelsListContainerId));

      /**
       * Set up views for UI controls
       */
      this.children.caption = new _TableCaption.default({
        model: {
          state: this.stateModel,
          application: this.applicationModel,
          uiPrefs: this.uiPrefsModel,
          user: _swcMltk.SharedModels.get('user'),
          serverInfo: _swcMltk.SharedModels.get('serverInfo'),
          rawSearch: this.rawSearch
        },
        collection: {
          lookupModels: this.mlModelsCollection
        },
        filterKey: ['name'],
        countLabel: 'Models',
        inputPlaceholder: 'Filter by model name',
        filterTransform: function filterTransform(value) {
          // this allows us to add the __mlspl_* prefix to the value of the input
          // this is being done because we're filtering by the "name" property
          // which contains the __mlspl prefix and we don't want to match on it
          return value != null && value.length > 0 ? "__mlspl_*".concat(value) : value;
        }
      });
      this.children.caption.render().appendTo(self.$el.find("#".concat(modelsListContainerId)));
      this.children.modelsView = new _Master.default({
        model: {
          state: this.stateModel,
          application: this.applicationModel,
          uiPrefs: this.uiPrefsModel,
          userPref: _swcMltk.SharedModels.get('userPref'),
          user: _swcMltk.SharedModels.get('user'),
          appLocal: _swcMltk.SharedModels.get('app'),
          serverInfo: _swcMltk.SharedModels.get('serverInfo')
        },
        collection: {
          lookupModels: this.mlModelsCollection,
          roles: _swcMltk.SharedModels.get('roles'),
          apps: _swcMltk.SharedModels.get('appLocals')
        }
      });
      this.children.modelsView.startListening();
      this.children.modelsView.render().appendTo(self.$el.find("#".concat(modelsListContainerId)));
      this.modelsList$El.get(0).style.display = 'block';

      // Add React root for Models page
      var modelsRoot = document.createElement('div');
      modelsRoot.setAttribute('id', 'models-react-root');
      self.$el.find("#".concat(modelsListContainerId)).prepend(modelsRoot);
      _reactDom.default.render(_react.default.createElement(Page), modelsRoot);
      return this;
    },
    template: "\n        <div id=\"".concat(modelsListContainerId, "\">\n            <div class=\"divider\"></div>\n        </div>")
  });
  var _default = _exports.default = ModelsView;
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "models/table/Details":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), module, __webpack_require__("lookups/table/Details")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _underscoreMltk, _module, _Details) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _underscoreMltk = _interopRequireDefault(_underscoreMltk);
  _module = _interopRequireDefault(_module);
  _Details = _interopRequireDefault(_Details);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _Details.default.extend({
    moduleId: _module.default.id,
    render: function render() {
      _underscoreMltk.default.extend(this.innerTemplateParams, {
        algorithm: this.model.lookupsModel.getType(),
        targetVariable: this.model.lookupsModel.getTargetVariable(),
        featureVariables: this.model.lookupsModel.getFeatureVariables()
      });
      this.innerTemplate += "\n          <dl class=\"list-dotted\">\n            <dt class=\"mltk-algorithm\">Algorithm</dt>\n            <dd class=\"mltk-algorithm\"><%= algorithm %></dd>\n            <% if (targetVariable) { %>\n                <dt class=\"mltk-target-variable\">Target Variable(s)</dt>\n                <dd class=\"mltk-target-variable\"><%= targetVariable %></dd>\n            <% } %>\n            <% if (featureVariables) { %>\n                <dt class=\"mltk-feature-variables\">Feature Variables</dt>\n                <dd class=\"mltk-feature-variables\"><%= featureVariables %></dd>\n            <% } %>\n          </dl>\n        ";
      _Details.default.prototype.render.apply(this, arguments);
      return this;
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "models/table/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./src/main/webapp/contrib_shim/underscore/underscore.es"), module, __webpack_require__("lookups/table/Master"), __webpack_require__("models/table/Details"), __webpack_require__("models/table/TableRow")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectToString, _underscoreMltk, _module, _Master, _Details, _TableRow) {
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
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  // used as a column header and also passed to the permissions dialog
  var nameOptions = {
    nameLabel: 'Model Name',
    nameKey: 'mlspl:model_info.model_name'
  };
  var _default = _exports.default = _Master.default.extend({
    modeulId: _module.default.id,
    className: 'mltk-models-table',
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
    tbodyClass: 'mltk-models-listings',
    initialize: function initialize() {
      // has to be set here because .bind() doesn't work if set as an option above
      this.columns = [{
        label: 'i',
        className: 'col-info',
        html: '<i class="icon-info"></i>'
      }, {
        label: nameOptions.nameLabel,
        sortKey: 'name'
      }, {
        label: 'Algorithm',
        className: 'col-type'
      }, {
        label: 'Actions',
        className: 'col-actions',
        visible: function () {
          return this.tableRow.options.hasActions;
        }.bind(this)
      }, {
        label: 'Owner',
        sortKey: 'eai:acl.owner,name',
        className: 'col-owner'
      }, {
        label: 'App',
        sortKey: 'eai:acl.app,name',
        className: 'col-app'
      }, {
        label: 'Sharing',
        sortKey: 'eai:acl.sharing,name',
        className: 'col-sharing'
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

/***/ "models/table/TableRow":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("lookups/table/DeleteDialog"), __webpack_require__("lookups/table/PermissionsDialog"), __webpack_require__("lookups/table/TableRow")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFind, _esObjectToString, _swcMltk, _module, _DeleteDialog, _PermissionsDialog, _TableRow) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _DeleteDialog = _interopRequireDefault(_DeleteDialog);
  _PermissionsDialog = _interopRequireDefault(_PermissionsDialog);
  _TableRow = _interopRequireDefault(_TableRow);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _TableRow.default.extend({
    moduleId: _module.default.id,
    className: 'expand',
    /**
     * @param {Object} options {
     *     model: {
     *          lookupsModel: <models.Report>,
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
    },
    canEditPermissions: function canEditPermissions() {
      return this.model.lookupsModel.canWrite() && this.model.lookupsModel.canEditPermissions();
    },
    startListening: function startListening() {
      var _this = this;
      this.listenTo(this.model.lookupsModel, 'updateCollection', function () {
        _this.model.state.trigger('change:search');
      });
      this.listenTo(this.model.lookupsModel.entry.acl, 'change:sharing', this.updateSharing);
    },
    updateSharing: function updateSharing() {
      var sharing = this.model.lookupsModel.entry.acl.get('sharing');
      var canUseApps = this.model.user.canUseApps();
      if (sharing === 'app' && !canUseApps) {
        sharing = 'system';
      }
      var sharingTd = this.$('td.sharing');
      var editPermissionsTextTarget = this.canEditPermissions() ? sharingTd.find('a.edit-permissions') : sharingTd;
      editPermissionsTextTarget.text(_swcMltk.splunkDUtils.getSharingLabel(sharing));
    },
    events: {
      'click a.delete': function click_aDelete(e) {
        this.children.deleteDialog = new _DeleteDialog.default({
          model: {
            lookupsModel: this.model.lookupsModel
          },
          lookupType: 'Model',
          lookupName: this.model.lookupsModel.getFormattedName(),
          onHiddenRemove: true
        });
        this.children.deleteDialog.render().appendTo((0, _swcMltk.jquery)('body'));
        this.children.deleteDialog.show();
        e.preventDefault();
      },
      'click a.edit-permissions': function click_aEditPermissions(e) {
        this.children.permissionsDialog = new _PermissionsDialog.default({
          document: this.model.lookupsModel,
          nameModel: this.model.lookupsModel.entry.content,
          user: this.model.user,
          serverInfo: this.model.serverInfo,
          application: this.model.application
        }, this.collection, this.options);
        this.children.permissionsDialog.render().appendTo((0, _swcMltk.jquery)('body')).show();
        e.preventDefault();
      }
    },
    render: function render() {
      this.$el.html(this.compiledTemplate({
        mlModelName: this.model.lookupsModel.getFormattedName(),
        hasActions: this.options.hasActions,
        mlModelDisplayType: this.model.lookupsModel.getType(),
        canEditPermissions: this.canEditPermissions(),
        canDelete: this.model.lookupsModel.canDelete(),
        app: this.model.lookupsModel.entry.acl.get('app'),
        owner: this.model.lookupsModel.entry.acl.get('owner'),
        canUseApps: this.model.user.canUseApps()
      }));
      this.updateSharing();
      return this;
    },
    template: "\n        <td class=\"expands\">\n            <a href=\"#\"><i class=\"icon-triangle-right-small\"></i></a>\n        </td>\n        <td class=\"title\">\n            <span title=\"<%- mlModelName %>\"><%- mlModelName %></span>\n        </td>\n        <td class=\"type\">\n            <%- mlModelDisplayType %>\n        </td>\n        <% if (hasActions) { %>\n        <td class=\"actions actions-edit\">\n            <% if (canDelete) { %>\n            <a class=\"delete\">Delete</a>\n            <% } %>\n        </td>\n        <% } %>\n        <td class=\"owner\"><%- owner %></td>\n        <% if (canUseApps) { %>\n            <td class=\"app\"><%- app %></td>\n        <% } %>\n        <td class=\"sharing\">\n            <% if (canEditPermissions) { %>\n                <a class=\"edit-permissions\" href=\"#\"></a>\n            <% } %>\n        </td>\n    "
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/models.es","pages_common"]]]);