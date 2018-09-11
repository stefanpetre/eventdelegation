import SelectorSet from 'selector-set';

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
        matched.observers[j].data.call(this, event);
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
      selectors = new SelectorSet();
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

export default delegation;
