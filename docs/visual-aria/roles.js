/*!
Visual ARIA Bookmarklet (CSS: 11/04/2019), JS last modified 12/10/2019
Copyright 2019 Bryan Garaventa
https://github.com/whatsock/visual-aria
Part of the ARIA Role Conformance Matrices, distributed under the terms of the Open Source Initiative OSI - MIT License
*/
!function(){var e,t;
/*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   v4.2.4+314e4831
   */if(
/*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   v4.2.4+314e4831
   */
e=this,t=function(){"use strict";function u(e){return"function"==typeof e}var r=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},i=0,t=void 0,n=void 0,a=function(e,t){f[i]=e,f[i+1]=t,2===(i+=2)&&(n?n(p):w())};var e="undefined"!=typeof window?window:void 0,o=e||{},s=o.MutationObserver||o.WebKitMutationObserver,l="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),d="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function c(){var e=setTimeout;return function(){return e(p,1)}}var f=new Array(1e3);function p(){for(var e=0;e<i;e+=2){(0,f[e])(f[e+1]),f[e]=void 0,f[e+1]=void 0}i=0}var A,m,b,g,w=void 0;function h(e,t){var r=this,i=new this.constructor(I);void 0===i[y]&&H(i);var n=r._state;if(n){var o=arguments[n-1];a(function(){return B(n,i,o,r._result)})}else C(r,i,e,t);return i}function v(e){if(e&&"object"==typeof e&&e.constructor===this)return e;var t=new this(I);return M(t,e),t}w=l?function(){return process.nextTick(p)}:s?(m=0,b=new s(p),g=document.createTextNode(""),b.observe(g,{characterData:!0}),function(){g.data=m=++m%2}):d?((A=new MessageChannel).port1.onmessage=p,function(){return A.port2.postMessage(0)}):void 0===e&&"function"==typeof require?function(){try{var e=Function("return this")().require("vertx");return void 0!==(t=e.runOnLoop||e.runOnContext)?function(){t(p)}:c()}catch(e){return c()}}():c();var y=Math.random().toString(36).substring(2);function I(){}var R=void 0,x=1,V=2,_={error:null};function k(e){try{return e.then}catch(e){return _.error=e,_}}function L(e,t,r){t.constructor===e.constructor&&r===h&&t.constructor.resolve===v?function(t,e){e._state===x?S(t,e._result):e._state===V?E(t,e._result):C(e,void 0,function(e){return M(t,e)},function(e){return E(t,e)})}(e,t):r===_?(E(e,_.error),_.error=null):void 0===r?S(e,t):u(r)?function(e,i,n){a(function(t){var r=!1,e=function(e,t,r,i){try{e.call(t,r,i)}catch(e){return e}}(n,i,function(e){r||(r=!0,i!==e?M(t,e):S(t,e))},function(e){r||(r=!0,E(t,e))},t._label);!r&&e&&(r=!0,E(t,e))},e)}(e,t,r):S(e,t)}function M(e,t){e===t?E(e,new TypeError("You cannot resolve a promise with itself")):!function(e){var t=typeof e;return null!==e&&("object"==t||"function"==t)}(t)?S(e,t):L(e,t,k(t))}function T(e){e._onerror&&e._onerror(e._result),N(e)}function S(e,t){e._state===R&&(e._result=t,e._state=x,0!==e._subscribers.length&&a(N,e))}function E(e,t){e._state===R&&(e._state=V,e._result=t,a(T,e))}function C(e,t,r,i){var n=e._subscribers,o=n.length;e._onerror=null,n[o]=t,n[o+x]=r,n[o+V]=i,0===o&&e._state&&a(N,e)}function N(e){var t=e._subscribers,r=e._state;if(0!==t.length){for(var i=void 0,n=void 0,o=e._result,a=0;a<t.length;a+=3)i=t[a],n=t[a+r],i?B(r,i,n,o):n(o);e._subscribers.length=0}}function B(e,t,r,i){var n=u(r),o=void 0,a=void 0,s=void 0,l=void 0;if(n){if((o=function(e,t){try{return e(t)}catch(e){return _.error=e,_}}(r,i))===_?(l=!0,a=o.error,o.error=null):s=!0,t===o)return void E(t,new TypeError("A promises callback cannot return that same promise."))}else o=i,s=!0;t._state!==R||(n&&s?M(t,o):l?E(t,a):e===x?S(t,o):e===V&&E(t,o))}var q=0;function H(e){e[y]=q++,e._state=void 0,e._result=void 0,e._subscribers=[]}var j=(z.prototype._enumerate=function(e){for(var t=0;this._state===R&&t<e.length;t++)this._eachEntry(e[t],t)},z.prototype._eachEntry=function(t,e){var r=this._instanceConstructor,i=r.resolve;if(i===v){var n=k(t);if(n===h&&t._state!==R)this._settledAt(t._state,e,t._result);else if("function"!=typeof n)this._remaining--,this._result[e]=t;else if(r===O){var o=new r(I);L(o,t,n),this._willSettleAt(o,e)}else this._willSettleAt(new r(function(e){return e(t)}),e)}else this._willSettleAt(i(t),e)},z.prototype._settledAt=function(e,t,r){var i=this.promise;i._state===R&&(this._remaining--,e===V?E(i,r):this._result[t]=r),0===this._remaining&&S(i,this._result)},z.prototype._willSettleAt=function(e,t){var r=this;C(e,void 0,function(e){return r._settledAt(x,t,e)},function(e){return r._settledAt(V,t,e)})},z);
/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/function z(e,t){this._instanceConstructor=e,this.promise=new e(I),this.promise[y]||H(this.promise),r(t)?(this.length=t.length,this._remaining=t.length,this._result=new Array(this.length),0===this.length?S(this.promise,this._result):(this.length=this.length||0,this._enumerate(t),0===this._remaining&&S(this.promise,this._result))):E(this.promise,new Error("Array Methods must be provided an Array"))}var O=(D.prototype.catch=function(e){return this.then(null,e)},D.prototype.finally=function(t){var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},D);function D(e){this[y]=q++,this._result=this._state=void 0,this._subscribers=[],I!==e&&("function"!=typeof e&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof D?function(t,e){try{e(function(e){M(t,e)},function(e){E(t,e)})}catch(e){E(t,e)}}(this,e):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return O.prototype.then=h,O.all=function(e){return new j(this,e).promise},O.race=function(n){var o=this;return r(n)?new o(function(e,t){for(var r=n.length,i=0;i<r;i++)o.resolve(n[i]).then(e,t)}):new o(function(e,t){return t(new TypeError("You must pass an array to race."))})}
/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/,O.resolve=v,O.reject=function(e){var t=new this(I);return E(t,e),t},O._setScheduler=function(e){n=e},O._setAsap=function(e){a=e},O._asap=a,O.polyfill=function(){var e=void 0;if("undefined"!=typeof global)e=global;else if("undefined"!=typeof self)e=self;else try{e=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var t=e.Promise;if(t){var r=null;try{r=Object.prototype.toString.call(t.resolve())}catch(e){}if("[object Promise]"===r&&!t.cast)return}e.Promise=O},(O.Promise=O).polyfill(),O},"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.ES6Promise=t(),window.VisualARIA={},!document.getElementById("ws-bm-aria-matrices-lnk")){var r=document.createElement("span");r.className="WS-BM-Loading-Msg",r.innerHTML='<span role="alert" style="position: fixed; z-index:10000; color: white; background-color: black; border: inset thick gray; top: 40%; left: 35%; padding: 20px; font-size: 18pt;">Loading Visual ARIA, please wait.<br /><i>(Hold down Ctrl+Shift then Left-click any role for more details.)</i></span>',window.VisualARIA.VisualARIALoadingMsg=r,document.body.appendChild(window.VisualARIA.VisualARIALoadingMsg)}window.top.VisualARIA.IsVisualARIALoaded=!0,window.VisualARIA.toggleVisualARIA=function(){window.VisualARIA.VisualARIALoadingMsg&&(window.VisualARIA.VisualARIALoadingMsg.parentNode.removeChild(window.VisualARIA.VisualARIALoadingMsg),window.VisualARIA.VisualARIALoadingMsg=null),window.top.VisualARIA.IsVisualARIALoaded=!window.top.VisualARIA.IsVisualARIALoaded,window.VisualARIA.VisualARIAToggle.setAttribute("aria-label",window.top.VisualARIA.IsVisualARIALoaded?"Unload Visual ARIA":"Load Visual ARIA"),window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng},window.VisualARIA.getVisualARIAStatus=function(){return{lng:window.top.VisualARIA.IsVisualARIALoaded?"Unload Visual ARIA":"Load Visual ARIA",shrt:window.top.VisualARIA.IsVisualARIALoaded?"X":"O"}};var z=function(e,_,k,L,M,T,S,E,C){function N(e){return"string"!=typeof e?"":e.replace(/^\s+|\s+$/g,"")}var B=this,q=null,H=null;T="aria-disabled,aria-readonly,aria-haspopup,aria-orientation,aria-label,aria-labelledby,aria-describedby,aria-pressed,aria-checked,aria-valuemin,aria-valuemax,aria-valuenow,aria-valuetext,aria-controls,aria-autocomplete,aria-expanded,aria-owns,aria-activedescendant,aria-posinset,aria-setsize,aria-level,role,alt".split(","),S=function(e,t){for(;e;)if((e=e.parentNode).getAttribute("role")===t)return"true";return"false"},E=function(e,t,r,i,n,o,a,s){if(window.top.VisualARIA.IsVisualARIALoaded){C&&C.init&&(C.comboboxListbox||M.getElementById("ws-visual-aria-7")||!M.querySelectorAll('*[role="combobox"], *[role="listbox"], *[role="option"]').length||(C.comboboxListbox=!0,j("7combobox-listbox.css","7")),C.menuMenubar||M.getElementById("ws-visual-aria-8")||!M.querySelectorAll('*[role="menu"], *[role="menubar"], *[role="menuitem"], *[role="menuitemradio"], *[role="menuitemcheckbox"]').length||(C.menuMenubar=!0,j("8menu-menubar.css","8")),C.radiogroup||M.getElementById("ws-visual-aria-9")||!M.querySelectorAll('*[role="radiogroup"], *[role="radio"]').length||(C.radiogroup=!0,j("9radiogroup.css","9")),C.tablist||M.getElementById("ws-visual-aria-10")||!M.querySelectorAll('*[role="tablist"], *[role="tab"], *[role="tabpanel"]').length||(C.tablist=!0,j("10tablist.css","10")),C.tree||M.getElementById("ws-visual-aria-11")||!M.querySelectorAll('*[role="tree"], *[role="treeitem"]').length||(C.tree=!0,j("11tree.css","11")),C.treegridGridTable||M.getElementById("ws-visual-aria-12")||!M.querySelectorAll('*[role="treegrid"], *[role="grid"], *[role="table"], *[role="rowgroup"], *[role="row"], *[role="columnheader"], *[role="rowheader"], *[role="gridcell"], *[role="cell"]').length||(C.treegridGridTable=!0,j("12treegrid-grid-table.css","12"))),C&&!C.init&&(C.init=!0,j("1roles.css","1"),C.landmarks=!0,j("2landmarks.css","2"),C.structural=!0,j("3structural.css","3"),C.dialogs=!0,j("4dialogs.css","4"),C.liveRegions=!0,j("5live-regions.css","5"),C.simpleWidgets=!0,j("6simple-widgets.css","6")),e=M.querySelectorAll("input[aria-owns], img[aria-owns], area[aria-owns], hr[aria-owns]");for(V=0;V<e.length;V++)e[V].setAttribute("data-ws-bm-aria-owns-invalid","true"),e[V].parentNode.setAttribute("data-ws-bm-aria-owns-invalid",e[V].nodeName.toUpperCase());e=M.querySelectorAll("input, *[role], img, progress"),t={},a=function(e,t,r){if(!e||1!==e.nodeType||!N(t)||!N(r)||-1===" application banner complementary contentinfo form main navigation region search article directory document list note table toolbar feed log status combobox grid listbox menu menubar radiogroup tablist tabpanel tree group treegrid ".indexOf(" "+t+" "))return!1;for(var i=!1,n=r.split(" "),o=0;o<n.length;o++)M.getElementById(n[o])===e&&(i=!0);return i&&e.setAttribute("data-ws-bm-self-ref","true"),i},s=function(e){for(var t=!0,r=e.split(" "),i=0;i<r.length;i++){var n=M.getElementById(r[i]);n&&1===n.nodeType&&"term"!==n.getAttribute("role")&&(n.setAttribute("data-ws-bm-dtr-missing","true"),t=!1)}return t};for(V=0;V<e.length;V++){for(var l=0;l<T.length;l++)t[T[l]]=e[V].getAttribute(T[l])||null;if(t["node-name"]=e[V].nodeName.toLowerCase(),t.tabindex=e[V].getAttribute("tabindex"),t["input-type"]="input"===t["node-name"]?e[V].getAttribute("type"):null,"radio"===t.role?t["role-nested"]=S(e[V],"radiogroup"):"tab"===t.role?t["role-nested"]=S(e[V],"tablist"):"treeitem"===t.role&&(t["role-nested"]=S(e[V],"tree")),a(e[V],t.role,t["aria-labelledby"]),"definition"===t.role&&t["aria-labelledby"]&&s(t["aria-labelledby"]),-1!==" input img progress ".indexOf(" "+t["node-name"]+" ")&&n!==e[V].parentNode)for(var u in n=e[V].parentNode,t)t[u]||!isNaN(parseInt(t[u]))?n.setAttribute("data-ws-bm-"+u,t[u]):n.removeAttribute("data-ws-bm-"+u)}if((i=M.querySelectorAll("*[aria-describedby]:focus")).length)for(var d=i[0].getAttribute("aria-describedby").split(" "),c=0;c<d.length;c++){var f=M.getElementById(d[c]);f&&1===f.nodeType&&f.setAttribute("data-ws-bm-db-match",d[c])}var p=null;if((i=M.querySelectorAll("*[aria-activedescendant]:focus")).length&&(p=M.getElementById(i[0].getAttribute("aria-activedescendant"))),i.length&&p&&i[0]===q&&p===H||!H||1!==H.nodeType||!H.getAttribute("data-ws-bm-ad-match")||(H.removeAttribute("data-ws-bm-ad-match"),H.removeAttribute("data-ws-bm-ad-invalid"),H=null),p&&1===p.nodeType){q=i[0];var A=(H=p).nodeName.toLowerCase(),m=p.getAttribute("href"),b=p.getAttribute("role");!b&&"a"===A&&m?b="link":b||"button"!==A||(b="button"),p.setAttribute("data-ws-bm-ad-match",b),b||p.setAttribute("data-ws-bm-ad-invalid","true")}o=M.querySelectorAll('*[hidefocus="true"]');for(var g=0;g<o.length;g++)o[g].removeAttribute("hidefocus");r=M.querySelectorAll("frame, iframe");for(var w=0;w<r.length;w++)try{r[w].contentDocument&&r[w].contentDocument.head&&!r[w].contentDocument.WSBMInit&&(r[w].contentDocument.WSBMInit=z,r[w].contentDocument.WSBMInit(!1,_,k,L,r[w].contentDocument))}catch(e){}for(var h=M.querySelectorAll('*[role="presentation"], *[role="none"]'),v=0;v<h.length;v++){var y=h[v],I=y.getAttribute("role"),R=y.nodeName.toUpperCase(),x="none"===I?"data-ws-role-none":"data-ws-role-presentation";-1!==" input textarea img progress ".indexOf(" "+R.toLowerCase()+" ")?y.parentNode.setAttribute(x,R):y.setAttribute(x,R)}}else if(B.cssLinks&&B.cssLinks.length){for(var V=0;V<B.cssLinks.length;V++)B.cssLinks[V].parentNode.removeChild(B.cssLinks[V]);B.cssLinks=[],C={init:!1,landmarks:!1,structural:!1,dialogs:!1,liveRegions:!1,simpleWidgets:!1,comboboxListbox:!1,menuMenubar:!1,radiogroup:!1,tablist:!1,tree:!1,treegridGridTable:!1}}setTimeout(E,L)};var t,r,i,n,o=function(){if(window.getAccName&&"function"==typeof window.getAccName)for(var e=M.querySelectorAll("a[href], area[href], article, aside, button, dialog, datalist, details, fieldset, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hr, iframe, img, input, ul, ol, li, main, math, menu, nav, output, progress, section, select, summary, table, th, textarea, *[role]"),t=0;t<e.length;t++)window.getAccName(e[t],function(e,t){-1!==" datalist iframe img input progress select textarea ".indexOf(" "+t.nodeName.toLowerCase()+" ")?(t.parentNode.setAttribute("data-ws-bm-name-prop",e.name),t.parentNode.setAttribute("data-ws-bm-desc-prop",e.desc)):(t.setAttribute("data-ws-bm-name-prop",e.name),t.setAttribute("data-ws-bm-desc-prop",e.desc))},!0);setTimeout(o,5e3)};if(setTimeout(o,5e3),!_){C={init:!1,landmarks:!1,structural:!1,dialogs:!1,liveRegions:!1,simpleWidgets:!1,comboboxListbox:!1,menuMenubar:!1,radiogroup:!1,tablist:!1,tree:!1,treegridGridTable:!1};var a={css:function(i,n){return new Promise(function(e,t){var r=M.createElement("link");r.type="text/css",r.rel="stylesheet",r.id=n,r.onload=function(){e(i)},r.onerror=function(){},r.href=i,B.cssLinks.push(r),M.head.appendChild(r)})}},j=function(e,t){B.cssLinks||(B.cssLinks=[]),Promise.all([a.css(k+e,"ws-visual-aria-"+t)])}}E(),t=M.body,r="mousedown",i=function(e){if(e.shiftKey&&e.ctrlKey){var t=null;e.target?t=e.target:e.srcElement&&(t=e.srcElement),3===t.nodeType&&(t=t.parentNode);var r=function(e){for(;e;){var t=e.getAttribute("role");if(t&&-1===" rowgroup row columnheader rowheader ".indexOf(" "+t+" "))return"cell"===t?t="table":"gridcell"===t?t="grid":"menuitem"===t||"menuitemcheckbox"===t||"menuitemradio"===t?t="menu":"option"===t?t="listbox":"radio"===t?t="radiogroup":"tab"===t||"tabpanel"===t?t="tablist":"treeitem"===t&&(t="tree"),t;e=e.parentNode}return""}(t);window.VisualARIA.VisualARIAMatrices.href="http://whatsock.com/training/matrices/#"+r,window.VisualARIA.VisualARIAMatrices.click()}},t.attachEvent?(t["e"+r+i]=i,t[r+i]=function(){t["e"+r+i](window.event)},t.attachEvent("on"+r,t[r+i])):t.addEventListener&&t.addEventListener(r,i,!1),(n=M.createElement("script")).type="text/javascript",n.async=!0,n.src="https://whatsock.github.io/w3c-alternative-text-computation/Sample%20JavaScript%20Recursion%20Algorithm/recursion.min.js",M.head.appendChild(n)};if(setTimeout(function(){z(!0,!1,"https://whatsock.github.io/visual-aria/visual-aria/public/",2e3,document)},3e3),!document.getElementById("ws-bm-aria-matrices-lnk")){var i=document.createElement("span");i.innerHTML='<span id="ws-bm-aria-matrices-lnk" style="text-align: center; position: fixed; top: 0; right: 0;padding: 3px; border: 1px solid #dedede; background: #f5f5f5; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#f9f9f9\', endColorstr=\'#f0f0f0\'); background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0)); background: -moz-linear-gradient(top,  #f9f9f9, #f0f0f0); border-color: #000; -webkit-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; -moz-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb;" onmouseenter="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onmouseleave="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;"><a id="ws-bm-aria-matrices-lnk-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" target="ws_aria_role_matrices" onmouseover="this.href=\'http://whatsock.com/training/matrices/\';" onfocus="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onblur="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;" href="http://whatsock.com/training/matrices/" aria-label="ARIA Role Matrices">?</a><br /><a id="ws-bm-aria-matrices-toggle-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" onclick="window.VisualARIA.toggleVisualARIA(); return false;" onfocus="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onblur="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;" href="#" aria-label="Unload Visual ARIA">X</a> </span>',document.body.appendChild(i),window.VisualARIA.VisualARIAMatrices=document.getElementById("ws-bm-aria-matrices-lnk-a"),window.VisualARIA.VisualARIAToggle=document.getElementById("ws-bm-aria-matrices-toggle-a")}}();