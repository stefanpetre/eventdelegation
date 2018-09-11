!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function r(){if(!(this instanceof r))return new r;this.size=0,this.uid=0,this.selectors=[],this.indexes=Object.create(this.indexes),this.activeIndexes=[]}n.r(t);var o=window.document.documentElement,i=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector;r.prototype.matchesSelector=function(e,t){return i.call(e,t)},r.prototype.querySelectorAll=function(e,t){return t.querySelectorAll(e)},r.prototype.indexes=[];var s=/^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;r.prototype.indexes.push({name:"ID",selector:function(e){var t;if(t=e.match(s))return t[0].slice(1)},element:function(e){if(e.id)return[e.id]}});var a=/^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;r.prototype.indexes.push({name:"CLASS",selector:function(e){var t;if(t=e.match(a))return t[0].slice(1)},element:function(e){var t=e.className;if(t){if("string"==typeof t)return t.split(/\s/);if("object"==typeof t&&"baseVal"in t)return t.baseVal.split(/\s/)}}});var u,c=/^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;r.prototype.indexes.push({name:"TAG",selector:function(e){var t;if(t=e.match(c))return t[0].toUpperCase()},element:function(e){return[e.nodeName.toUpperCase()]}}),r.prototype.indexes.default={name:"UNIVERSAL",selector:function(){return!0},element:function(){return[!0]}},u="function"==typeof window.Map?window.Map:function(){function e(){this.map={}}return e.prototype.get=function(e){return this.map[e+" "]},e.prototype.set=function(e,t){this.map[e+" "]=t},e}();var f=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;function l(e,t){var n,r,o,i,s,a,u=(e=e.slice(0).concat(e.default)).length,c=t,l=[];do{if(f.exec(""),(o=f.exec(c))&&(c=o[3],o[2]||!c))for(n=0;n<u;n++)if(s=(a=e[n]).selector(o[1])){for(r=l.length,i=!1;r--;)if(l[r].index===a&&l[r].key===s){i=!0;break}i||l.push({index:a,key:s});break}}while(o);return l}function p(e,t){var n,r,o;for(n=0,r=e.length;n<r;n++)if(o=e[n],t.isPrototypeOf(o))return o}function d(e,t){return e.id-t.id}r.prototype.logDefaultIndexUsed=function(){},r.prototype.add=function(e,t){var n,r,o,i,s,a,c,f,d=this.activeIndexes,h=this.selectors;if("string"==typeof e){for(n={id:this.uid++,selector:e,data:t},c=l(this.indexes,e),r=0;r<c.length;r++)i=(f=c[r]).key,(s=p(d,o=f.index))||((s=Object.create(o)).map=new u,d.push(s)),o===this.indexes.default&&this.logDefaultIndexUsed(n),(a=s.map.get(i))||(a=[],s.map.set(i,a)),a.push(n);this.size++,h.push(e)}},r.prototype.remove=function(e,t){if("string"==typeof e){var n,r,o,i,s,a,u,c,f=this.activeIndexes,p={},d=1===arguments.length;for(n=l(this.indexes,e),o=0;o<n.length;o++)for(r=n[o],i=f.length;i--;)if(a=f[i],r.index.isPrototypeOf(a)){if(u=a.map.get(r.key))for(s=u.length;s--;)(c=u[s]).selector!==e||!d&&c.data!==t||(u.splice(s,1),p[c.id]=!0);break}this.size-=Object.keys(p).length}},r.prototype.queryAll=function(e){if(!this.selectors.length)return[];var t,n,r,o,i,s,a,u,c={},f=[],l=this.querySelectorAll(this.selectors.join(", "),e);for(t=0,r=l.length;t<r;t++)for(i=l[t],n=0,o=(s=this.matches(i)).length;n<o;n++)c[(u=s[n]).id]?a=c[u.id]:(a={id:u.id,selector:u.selector,data:u.data,elements:[]},c[u.id]=a,f.push(a)),a.elements.push(i);return f.sort(d)},r.prototype.matches=function(e){if(!e)return[];var t,n,r,o,i,s,a,u,c,f,l,p=this.activeIndexes,h={},v=[];for(t=0,o=p.length;t<o;t++)if(u=(a=p[t]).element(e))for(n=0,i=u.length;n<i;n++)if(c=a.map.get(u[n]))for(r=0,s=c.length;r<s;r++)!h[l=(f=c[r]).id]&&this.matchesSelector(e,f.selector)&&(h[l]=!0,v.push(f));return v.sort(d)};var h=new WeakMap,v=new WeakMap,g=new WeakMap,m=new WeakMap,y=new WeakMap,b=Object.getOwnPropertyDescriptor(Event.prototype,"currentTarget");function x(e,t,n){var r=e[t];return e[t]=function(){return n.apply(e,arguments),r.apply(e,arguments)},e}function w(){g.set(this,!0)}function j(){g.set(this,!0),m.set(this,!0)}function S(){return y.get(this)||null}function k(e,t){b&&Object.defineProperty(e,"currentTarget",{configurable:!0,enumerable:!0,get:t||b.get})}function M(e){var t=(1===e.eventPhase?v:h).get(e.currentTarget);if(t){var n=t[e.type];if(n){var r=function(e,t,n,r){var o=[],i=t;do{if(1!==i.nodeType)break;var s=e.matches(i);if(s.length){var a={node:i,observers:s};n?o.unshift(a):o.push(a)}}while((i=i.parentElement)&&i!==r);return o}(n,e.target,1===e.eventPhase,e.currentTarget);if(r.length){x(e,"stopPropagation",w),x(e,"stopImmediatePropagation",j),k(e,S);for(var o,i=0,s=r.length;i<s&&!g.get(e);i++){o=r[i],y.set(e,o.node);for(var a=0,u=o.observers.length;a<u&&!m.get(e);a++)o.observers[a].data.call?o.observers[a].data.call(o.node,e):o.observers[a].data.handleEvent&&(e.matched=o.node,o.observers[a].data.handleEvent.call(o.observers[a].data,e))}y.delete(e),k(e)}}}}var O={on:function(e,t,n,o){var i=!!(4<arguments.length&&void 0!==arguments[4]?arguments[4]:{}).capture,s=i?v:h,a=s.get(e);a||(a={},s.set(e,a));var u=a[t];u||(u=new r,a[t]=u,e.addEventListener(t,M,i)),u.add(n,o)},off:function(e,t,n,r){var o=!!(4<arguments.length&&void 0!==arguments[4]?arguments[4]:{}).capture,i=o?v:h,s=i.get(e);s||(s={},i.set(e,s));var a=s[t];a&&(a.remove(n,r),a.size||(delete i[t],e.removeEventListener(t,M,o)))},trigger:function(e,t,n){return e.dispatchEvent(new CustomEvent(t,{bubbles:!0,cancelable:!0,detail:n}))}};t.default=O}])});