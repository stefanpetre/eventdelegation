# Event delegation

JavaScript library for events delegation. Based on [David Graham's delegated events](https://github.com/dgraham/delegated-events) with some changes:
* support to set as listeners objects that implement `EventListener` interface  (https://developer.mozilla.org/en-US/docs/Web/API/EventListener)
* attach the event to the parent element instead of the document
* the listener context is the element with attached listener if the listener is a function 

## Install

Via npm

```
npm install eventdelegation --save
```

or you can download from `dist`:
* [uncompressed version](https://github.com/stefanpetre/eventdelegation/blob/master/dist/eventdelegation.umd.js)
* [minified version](https://github.com/stefanpetre/eventdelegation/blob/master/dist/eventdelegation.umd.min.js)

## Dependencies

The library it relies on [`SelectorSet`](https://github.com/josh/selector-set). For Internet explorer you need to add some polyfills:
* [`WeakMap`](https://github.com/polygonplanet/weakmap-polyfill)
* [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)

## Usage
```js
import delegate from "eventdelegation";

delegate.on(document.querySelector('.nav'), 'click', 'a[dropdown-trigger]', toggleDropdown); 
```
Using `EventListener` interface.
```js
class dropdown {
    constructor(nav){
        delegate.on(nav, 'click', 'a[dropdown-trigger]', this);
    }
    handleEvent(ev) {
        ev.currentTarget.parentNode.classList.toggle('dropdown-opened');
        ev.preventDefault();
    }
}
```
## License

Distributed under the MIT license. See LICENSE for details.