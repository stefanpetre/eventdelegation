(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("SelectorSet"));
	else if(typeof define === 'function' && define.amd)
		define(["SelectorSet"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("SelectorSet")) : factory(root["SelectorSet"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var selector_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var selector_set__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(selector_set__WEBPACK_IMPORTED_MODULE_0__);

var bubbleEvents = new WeakMap();
var captureEvents = new WeakMap();
var propagationStopped = new WeakMap();
var immediatePropagationStopped = new WeakMap();
var currentTargets = new WeakMap();
var currentTargetDesc = Object.getOwnPropertyDescriptor(Event.prototype, 'currentTarget');

function before(subject, verb, fn) {
  var source = subject[verb];

  subject[verb] = function () {
    fn.apply(subject, arguments);
    return source.apply(subject, arguments);
  };

  return subject;
}

function matches(selectors, target, reverse, parent) {
  var queue = [];
  var node = target;

  do {
    if (node.nodeType !== 1) break;

    var _matches = selectors.matches(node);

    if (_matches.length) {
      var matched = {
        node: node,
        observers: _matches
      };

      if (reverse) {
        queue.unshift(matched);
      } else {
        queue.push(matched);
      }
    }
  } while ((node = node.parentElement) && node !== parent);

  return queue;
}

function trackPropagation() {
  propagationStopped.set(this, true);
}

function trackImmediate() {
  propagationStopped.set(this, true);
  immediatePropagationStopped.set(this, true);
}

function getCurrentTarget() {
  return currentTargets.get(this) || null;
}

function defineCurrentTarget(event, getter) {
  if (!currentTargetDesc) return;
  Object.defineProperty(event, 'currentTarget', {
    configurable: true,
    enumerable: true,
    get: getter || currentTargetDesc.get
  });
}

function dispatch(event) {
  var events = event.eventPhase === 1 ? captureEvents : bubbleEvents;
  var selectorsEl = events.get(event.currentTarget);

  if (!selectorsEl) {
    return;
  }

  var selectors = selectorsEl[event.type];
  if (!selectors) return;
  var queue = matches(selectors, event.target, event.eventPhase === 1, event.currentTarget);
  if (!queue.length) return;
  before(event, 'stopPropagation', trackPropagation);
  before(event, 'stopImmediatePropagation', trackImmediate);
  defineCurrentTarget(event, getCurrentTarget);

  for (var i = 0, len1 = queue.length; i < len1; i++) {
    if (propagationStopped.get(event)) break;
    var matched = queue[i];
    currentTargets.set(event, matched.node);

    for (var j = 0, len2 = matched.observers.length; j < len2; j++) {
      if (immediatePropagationStopped.get(event)) break;

      if (matched.observers[j].data.call) {
        matched.observers[j].data.call(matched.node, event);
      } else if (matched.observers[j].data.handleEvent) {
        event.matched = matched.node;
        matched.observers[j].data.handleEvent.call(matched.observers[j].data, event);
      }
    }
  }

  currentTargets.delete(event);
  defineCurrentTarget(event);
}

var delegation = {
  on: function on(el, type, selector, listener) {
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var capture = options.capture ? true : false;
    var events = capture ? captureEvents : bubbleEvents;
    var selectorsEl = events.get(el);

    if (!selectorsEl) {
      selectorsEl = {};
      events.set(el, selectorsEl);
    }

    var selectors = selectorsEl[type];

    if (!selectors) {
      selectors = new selector_set__WEBPACK_IMPORTED_MODULE_0___default.a();
      selectorsEl[type] = selectors;
      el.addEventListener(type, dispatch, capture);
    }

    selectors.add(selector, listener);
  },
  off: function off(el, type, selector, listener) {
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var capture = options.capture ? true : false;
    var events = capture ? captureEvents : bubbleEvents;
    var selectorsEl = events.get(el);

    if (!selectorsEl) {
      selectorsEl = {};
      events.set(el, selectorsEl);
    }

    var selectors = selectorsEl[type];

    if (!selectors) {
      return;
    }

    selectors.remove(selector, listener);
    if (selectors.size) return;
    delete events[type];
    el.removeEventListener(type, dispatch, capture);
  },
  trigger: function trigger(target, type, detail) {
    return target.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail
    }));
  }
};
/* harmony default export */ __webpack_exports__["default"] = (delegation);

/***/ })
/******/ ]);
});
//# sourceMappingURL=eventdelegation.js.map