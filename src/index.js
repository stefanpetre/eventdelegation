import SelectorSet from 'selector-set';

const bubbleEvents = new WeakMap();
const captureEvents = new WeakMap();
const propagationStopped = new WeakMap();
const immediatePropagationStopped = new WeakMap();

const currentTargets = new WeakMap();
const currentTargetDesc = Object.getOwnPropertyDescriptor(
    Event.prototype,
    'currentTarget'
);

function before(subject, verb, fn) {
    const source = subject[verb];
    subject[verb] = function () {
        fn.apply(subject, arguments);
        return source.apply(subject, arguments);
    };
    return subject;
}

function matches(selectors, target, reverse, parent) {
    const queue = [];
    let node = target;

    do {
        if (node.nodeType !== 1)
            break;
        const matches = selectors.matches(node);
        if (matches.length) {
            const matched = { node: node, observers: matches };
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

    const events = event.eventPhase === 1 ? captureEvents : bubbleEvents;

    const selectorsEl = events.get(event.currentTarget);
    if (!selectorsEl) {
        return;
    }

    const selectors = selectorsEl[event.type];
    if (!selectors)
        return;

    const queue = matches(selectors, event.target, event.eventPhase === 1, event.currentTarget);
    if (!queue.length)
        return;

    before(event, 'stopPropagation', trackPropagation);
    before(event, 'stopImmediatePropagation', trackImmediate);
    defineCurrentTarget(event, getCurrentTarget);

    for (let i = 0, len1 = queue.length; i < len1; i++) {
        if (propagationStopped.get(event))
            break;
        const matched = queue[i];
        currentTargets.set(event, matched.node);

        for (let j = 0, len2 = matched.observers.length; j < len2; j++) {
            if (immediatePropagationStopped.get(event))
                break;
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

const delegation = {

    on(el, type, selector, listener, options = {}) {
        const capture = options.capture ? true : false;
        const events = capture ? captureEvents : bubbleEvents;

        let selectorsEl = events.get(el);
        if (!selectorsEl) {
            selectorsEl = {};
            events.set(el, selectorsEl);
        }
        let selectors = selectorsEl[type];
        if (!selectors) {
            selectors = new SelectorSet();
            selectorsEl[type] = selectors;
            el.addEventListener(type, dispatch, capture);
        }
        selectors.add(selector, listener);
    },

    off(el, type, selector, listener, options = {}) {
        const capture = options.capture ? true : false;
        const events = capture ? captureEvents : bubbleEvents;

        let selectorsEl = events.get(el);
        if (!selectorsEl) {
            selectorsEl = {};
            events.set(el, selectorsEl);
        }
        let selectors = selectorsEl[type];
        if (!selectors) {
            return;
        }
        selectors.remove(selector, listener);

        if (selectors.size)
            return;
        delete events[type];
        el.removeEventListener(type, dispatch, capture);
    },

    trigger(target, type, detail) {
        return target.dispatchEvent(
            new CustomEvent(type, {
                bubbles: true,
                cancelable: true,
                detail: detail
            })
        );
    }
};

export default delegation;