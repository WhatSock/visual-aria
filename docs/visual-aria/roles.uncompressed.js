/*!
Visual ARIA Bookmarklet (CSS: 08/06/2018), JS last modified 09/11/2018
Copyright 2018 Bryan Garaventa
https://github.com/accdc/visual-aria
Part of the ARIA Role Conformance Matrices, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

// Visual ARIA

(function() {
  // Set useOffline=true to disable the dynamic loader,
  // or reference an https:// path to ensure that both secure and non-secure sites can be accessed by Visual ARIA when useOffline=false.
  // When useOffline=true, the roles.css file must be manually added to provide visual feedback within the same document where roles.js is being processed.
  var useOffline = false,
    // Base path for dynamic loading of individual CSS files.
    basePath = "https://accdc.github.io/visual-aria/visual-aria/public/",
    // Set millisecond interval for dynamically loading supporting CSS files and performing the naming calculation for widget roles
    msInterval = 2000;

  // Promise pollyfill
  /*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.4+314e4831
 */

  (function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
      ? (module.exports = factory())
      : typeof define === "function" && define.amd
        ? define(factory)
        : (global.ES6Promise = factory());
  })(this, function() {
    "use strict";

    function objectOrFunction(x) {
      var type = typeof x;
      return x !== null && (type === "object" || type === "function");
    }

    function isFunction(x) {
      return typeof x === "function";
    }

    var _isArray = void 0;
    if (Array.isArray) {
      _isArray = Array.isArray;
    } else {
      _isArray = function(x) {
        return Object.prototype.toString.call(x) === "[object Array]";
      };
    }

    var isArray = _isArray;

    var len = 0;
    var vertxNext = void 0;
    var customSchedulerFn = void 0;

    var asap = function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (customSchedulerFn) {
          customSchedulerFn(flush);
        } else {
          scheduleFlush();
        }
      }
    };

    function setScheduler(scheduleFn) {
      customSchedulerFn = scheduleFn;
    }

    function setAsap(asapFn) {
      asap = asapFn;
    }

    var browserWindow = typeof window !== "undefined" ? window : undefined;
    var browserGlobal = browserWindow || {};
    var BrowserMutationObserver =
      browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isNode =
      typeof self === "undefined" &&
      typeof process !== "undefined" &&
      {}.toString.call(process) === "[object process]";

    // test for web worker but not in IE10
    var isWorker =
      typeof Uint8ClampedArray !== "undefined" &&
      typeof importScripts !== "undefined" &&
      typeof MessageChannel !== "undefined";

    // node
    function useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        return process.nextTick(flush);
      };
    }

    // vertx
    function useVertxTimer() {
      if (typeof vertxNext !== "undefined") {
        return function() {
          vertxNext(flush);
        };
      }

      return useSetTimeout();
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode("");
      observer.observe(node, { characterData: true });

      return function() {
        node.data = iterations = ++iterations % 2;
      };
    }

    // web worker
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function() {
        return channel.port2.postMessage(0);
      };
    }

    function useSetTimeout() {
      // Store setTimeout reference so es6-promise will be unaffected by
      // other code modifying setTimeout (like sinon.useFakeTimers())
      var globalSetTimeout = setTimeout;
      return function() {
        return globalSetTimeout(flush, 1);
      };
    }

    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i += 2) {
        var callback = queue[i];
        var arg = queue[i + 1];

        callback(arg);

        queue[i] = undefined;
        queue[i + 1] = undefined;
      }

      len = 0;
    }

    function attemptVertx() {
      try {
        var vertx = Function("return this")().require("vertx");
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
      } catch (e) {
        return useSetTimeout();
      }
    }

    var scheduleFlush = void 0;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (isNode) {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else if (browserWindow === undefined && typeof require === "function") {
      scheduleFlush = attemptVertx();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function then(onFulfillment, onRejection) {
      var parent = this;

      var child = new this.constructor(noop);

      if (child[PROMISE_ID] === undefined) {
        makePromise(child);
      }

      var _state = parent._state;

      if (_state) {
        var callback = arguments[_state - 1];
        asap(function() {
          return invokeCallback(_state, child, callback, parent._result);
        });
      } else {
        subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }

    /**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
    function resolve$1(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (
        object &&
        typeof object === "object" &&
        object.constructor === Constructor
      ) {
        return object;
      }

      var promise = new Constructor(noop);
      resolve(promise, object);
      return promise;
    }

    var PROMISE_ID = Math.random()
      .toString(36)
      .substring(2);

    function noop() {}

    var PENDING = void 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var TRY_CATCH_ERROR = { error: null };

    function selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function cannotReturnOwn() {
      return new TypeError(
        "A promises callback cannot return that same promise."
      );
    }

    function getThen(promise) {
      try {
        return promise.then;
      } catch (error) {
        TRY_CATCH_ERROR.error = error;
        return TRY_CATCH_ERROR;
      }
    }

    function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
      try {
        then$$1.call(value, fulfillmentHandler, rejectionHandler);
      } catch (e) {
        return e;
      }
    }

    function handleForeignThenable(promise, thenable, then$$1) {
      asap(function(promise) {
        var sealed = false;
        var error = tryThen(
          then$$1,
          thenable,
          function(value) {
            if (sealed) {
              return;
            }
            sealed = true;
            if (thenable !== value) {
              resolve(promise, value);
            } else {
              fulfill(promise, value);
            }
          },
          function(reason) {
            if (sealed) {
              return;
            }
            sealed = true;

            reject(promise, reason);
          },
          "Settle: " + (promise._label || " unknown promise")
        );

        if (!sealed && error) {
          sealed = true;
          reject(promise, error);
        }
      }, promise);
    }

    function handleOwnThenable(promise, thenable) {
      if (thenable._state === FULFILLED) {
        fulfill(promise, thenable._result);
      } else if (thenable._state === REJECTED) {
        reject(promise, thenable._result);
      } else {
        subscribe(
          thenable,
          undefined,
          function(value) {
            return resolve(promise, value);
          },
          function(reason) {
            return reject(promise, reason);
          }
        );
      }
    }

    function handleMaybeThenable(promise, maybeThenable, then$$1) {
      if (
        maybeThenable.constructor === promise.constructor &&
        then$$1 === then &&
        maybeThenable.constructor.resolve === resolve$1
      ) {
        handleOwnThenable(promise, maybeThenable);
      } else {
        if (then$$1 === TRY_CATCH_ERROR) {
          reject(promise, TRY_CATCH_ERROR.error);
          TRY_CATCH_ERROR.error = null;
        } else if (then$$1 === undefined) {
          fulfill(promise, maybeThenable);
        } else if (isFunction(then$$1)) {
          handleForeignThenable(promise, maybeThenable, then$$1);
        } else {
          fulfill(promise, maybeThenable);
        }
      }
    }

    function resolve(promise, value) {
      if (promise === value) {
        reject(promise, selfFulfillment());
      } else if (objectOrFunction(value)) {
        handleMaybeThenable(promise, value, getThen(value));
      } else {
        fulfill(promise, value);
      }
    }

    function publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      publish(promise);
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) {
        return;
      }

      promise._result = value;
      promise._state = FULFILLED;

      if (promise._subscribers.length !== 0) {
        asap(publish, promise);
      }
    }

    function reject(promise, reason) {
      if (promise._state !== PENDING) {
        return;
      }
      promise._state = REJECTED;
      promise._result = reason;

      asap(publishRejection, promise);
    }

    function subscribe(parent, child, onFulfillment, onRejection) {
      var _subscribers = parent._subscribers;
      var length = _subscribers.length;

      parent._onerror = null;

      _subscribers[length] = child;
      _subscribers[length + FULFILLED] = onFulfillment;
      _subscribers[length + REJECTED] = onRejection;

      if (length === 0 && parent._state) {
        asap(publish, parent);
      }
    }

    function publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) {
        return;
      }

      var child = void 0,
        callback = void 0,
        detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch (e) {
        TRY_CATCH_ERROR.error = e;
        return TRY_CATCH_ERROR;
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
        value = void 0,
        error = void 0,
        succeeded = void 0,
        failed = void 0;

      if (hasCallback) {
        value = tryCatch(callback, detail);

        if (value === TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value.error = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          reject(promise, cannotReturnOwn());
          return;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (settled === FULFILLED) {
        fulfill(promise, value);
      } else if (settled === REJECTED) {
        reject(promise, value);
      }
    }

    function initializePromise(promise, resolver) {
      try {
        resolver(
          function resolvePromise(value) {
            resolve(promise, value);
          },
          function rejectPromise(reason) {
            reject(promise, reason);
          }
        );
      } catch (e) {
        reject(promise, e);
      }
    }

    var id = 0;
    function nextId() {
      return id++;
    }

    function makePromise(promise) {
      promise[PROMISE_ID] = id++;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];
    }

    function validationError() {
      return new Error("Array Methods must be provided an Array");
    }

    var Enumerator = (function() {
      function Enumerator(Constructor, input) {
        this._instanceConstructor = Constructor;
        this.promise = new Constructor(noop);

        if (!this.promise[PROMISE_ID]) {
          makePromise(this.promise);
        }

        if (isArray(input)) {
          this.length = input.length;
          this._remaining = input.length;

          this._result = new Array(this.length);

          if (this.length === 0) {
            fulfill(this.promise, this._result);
          } else {
            this.length = this.length || 0;
            this._enumerate(input);
            if (this._remaining === 0) {
              fulfill(this.promise, this._result);
            }
          }
        } else {
          reject(this.promise, validationError());
        }
      }

      Enumerator.prototype._enumerate = function _enumerate(input) {
        for (var i = 0; this._state === PENDING && i < input.length; i++) {
          this._eachEntry(input[i], i);
        }
      };

      Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
        var c = this._instanceConstructor;
        var resolve$$1 = c.resolve;

        if (resolve$$1 === resolve$1) {
          var _then = getThen(entry);

          if (_then === then && entry._state !== PENDING) {
            this._settledAt(entry._state, i, entry._result);
          } else if (typeof _then !== "function") {
            this._remaining--;
            this._result[i] = entry;
          } else if (c === Promise$2) {
            var promise = new c(noop);
            handleMaybeThenable(promise, entry, _then);
            this._willSettleAt(promise, i);
          } else {
            this._willSettleAt(
              new c(function(resolve$$1) {
                return resolve$$1(entry);
              }),
              i
            );
          }
        } else {
          this._willSettleAt(resolve$$1(entry), i);
        }
      };

      Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
        var promise = this.promise;

        if (promise._state === PENDING) {
          this._remaining--;

          if (state === REJECTED) {
            reject(promise, value);
          } else {
            this._result[i] = value;
          }
        }

        if (this._remaining === 0) {
          fulfill(promise, this._result);
        }
      };

      Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
        var enumerator = this;

        subscribe(
          promise,
          undefined,
          function(value) {
            return enumerator._settledAt(FULFILLED, i, value);
          },
          function(reason) {
            return enumerator._settledAt(REJECTED, i, reason);
          }
        );
      };

      return Enumerator;
    })();

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
*/
    function all(entries) {
      return new Enumerator(this, entries).promise;
    }

    /**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
    function race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      if (!isArray(entries)) {
        return new Constructor(function(_, reject) {
          return reject(new TypeError("You must pass an array to race."));
        });
      } else {
        return new Constructor(function(resolve, reject) {
          var length = entries.length;
          for (var i = 0; i < length; i++) {
            Constructor.resolve(entries[i]).then(resolve, reject);
          }
        });
      }
    }

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
*/
    function reject$1(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(noop);
      reject(promise, reason);
      return promise;
    }

    function needsResolver() {
      throw new TypeError(
        "You must pass a resolver function as the first argument to the promise constructor"
      );
    }

    function needsNew() {
      throw new TypeError(
        "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
      );
    }

    /**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

    var Promise$2 = (function() {
      function Promise(resolver) {
        this[PROMISE_ID] = nextId();
        this._result = this._state = undefined;
        this._subscribers = [];

        if (noop !== resolver) {
          typeof resolver !== "function" && needsResolver();
          this instanceof Promise
            ? initializePromise(this, resolver)
            : needsNew();
        }
      }

      /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

      /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */

      Promise.prototype.catch = function _catch(onRejection) {
        return this.then(null, onRejection);
      };

      /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */

      Promise.prototype.finally = function _finally(callback) {
        var promise = this;
        var constructor = promise.constructor;

        return promise.then(
          function(value) {
            return constructor.resolve(callback()).then(function() {
              return value;
            });
          },
          function(reason) {
            return constructor.resolve(callback()).then(function() {
              throw reason;
            });
          }
        );
      };

      return Promise;
    })();

    Promise$2.prototype.then = then;
    Promise$2.all = all;
    Promise$2.race = race;
    Promise$2.resolve = resolve$1;
    Promise$2.reject = reject$1;
    Promise$2._setScheduler = setScheduler;
    Promise$2._setAsap = setAsap;
    Promise$2._asap = asap;

    /*global self*/
    function polyfill() {
      var local = void 0;

      if (typeof global !== "undefined") {
        local = global;
      } else if (typeof self !== "undefined") {
        local = self;
      } else {
        try {
          local = Function("return this")();
        } catch (e) {
          throw new Error(
            "polyfill failed because global object is unavailable in this environment"
          );
        }
      }

      var P = local.Promise;

      if (P) {
        var promiseToString = null;
        try {
          promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
          // silently ignored
        }

        if (promiseToString === "[object Promise]" && !P.cast) {
          return;
        }
      }

      local.Promise = Promise$2;
    }

    // Strange compat..
    Promise$2.polyfill = polyfill;
    Promise$2.Promise = Promise$2;

    Promise$2.polyfill();

    return Promise$2;
  });

  //# sourceMappingURL=es6-promise.auto.map
  // Promise pollyfill end

  // Visual ARIA

  // Store global variable as namespace
  window.VisualARIA = {};

  if (!document.getElementById("ws-bm-aria-matrices-lnk")) {
    var s = document.createElement("span");
    s.className = "WS-BM-Loading-Msg";
    s.innerHTML =
      '<span role="alert" style="position: fixed; z-index:10000; color: white; background-color: black; border: inset thick gray; top: 40%; left: 35%; padding: 20px; font-size: 18pt;">Loading Visual ARIA, please wait.<br /><i>(Hold down Ctrl+Shift then Left-click any role for more details.)</i></span>';
    window.VisualARIA.VisualARIALoadingMsg = s;
    document.body.appendChild(window.VisualARIA.VisualARIALoadingMsg);
  }

  window.top.VisualARIA.IsVisualARIALoaded = true;

  window.VisualARIA.toggleVisualARIA = function() {
    if (window.VisualARIA.VisualARIALoadingMsg) {
      window.VisualARIA.VisualARIALoadingMsg.parentNode.removeChild(
        window.VisualARIA.VisualARIALoadingMsg
      );
      window.VisualARIA.VisualARIALoadingMsg = null;
    }
    window.top.VisualARIA.IsVisualARIALoaded = window.top.VisualARIA
      .IsVisualARIALoaded
      ? false
      : true;
    window.VisualARIA.VisualARIAToggle.setAttribute(
      "aria-label",
      window.top.VisualARIA.IsVisualARIALoaded
        ? "Unload Visual ARIA"
        : "Load Visual ARIA"
    );
    window.VisualARIA.VisualARIAToggle.innerHTML = window.VisualARIA.getVisualARIAStatus().lng;
  };

  window.VisualARIA.getVisualARIAStatus = function() {
    return {
      lng: window.top.VisualARIA.IsVisualARIALoaded
        ? "Unload Visual ARIA"
        : "Load Visual ARIA",
      shrt: window.top.VisualARIA.IsVisualARIALoaded ? "X" : "O"
    };
  };

  var WSBMInit = function(
    isTop,
    useOffline,
    basePath,
    msInterval,
    document,
    attrs,
    isNested,
    check,
    loaded
  ) {
    var loader = this;

    var bind = function(obj, type, fn) {
        if (obj.attachEvent) {
          obj["e" + type + fn] = fn;

          obj[type + fn] = function() {
            obj["e" + type + fn](window.event);
          };

          obj.attachEvent("on" + type, obj[type + fn]);
        } else if (obj.addEventListener) {
          obj.addEventListener(type, fn, false);
        }

        return obj;
      },
      trim = function(str) {
        if (typeof str !== "string") return "";

        return str.replace(/^\s+|\s+$/g, "");
      },
      activeObj = null,
      activeDObj = null;

    attrs = "aria-disabled,aria-readonly,aria-haspopup,aria-orientation,aria-label,aria-labelledby,aria-describedby,aria-pressed,aria-checked,aria-valuemin,aria-valuemax,aria-valuenow,aria-valuetext,aria-controls,aria-autocomplete,aria-expanded,aria-owns,aria-activedescendant,aria-posinset,aria-setsize,aria-level,role,alt".split(
      ","
    );
    isNested = function(start, role) {
      while (start) {
        start = start.parentNode;

        if (start.getAttribute("role") == role) return "true";
      }

      return "false";
    };

    check = function(
      nodes,
      obj,
      frames,
      focused,
      pNode,
      focusHidden,
      isSelfRef,
      isDefTerm
    ) {
      if (!window.top.VisualARIA.IsVisualARIALoaded) {
        if (loader.cssLinks && loader.cssLinks.length) {
          for (var i = 0; i < loader.cssLinks.length; i++) {
            loader.cssLinks[i].parentNode.removeChild(loader.cssLinks[i]);
          }
          loader.cssLinks = [];
          loaded = {
            init: false,
            landmarks: false,
            structural: false,
            dialogs: false,
            liveRegions: false,
            simpleWidgets: false,
            comboboxListbox: false,
            menuMenubar: false,
            radiogroup: false,
            tablist: false,
            tree: false,
            treegridGridTable: false
          };
        }
      } else {
        if (loaded && loaded.init) {
          if (
            !loaded.comboboxListbox &&
            !document.getElementById("ws-visual-aria-7") &&
            document.querySelectorAll(
              '*[role="combobox"], *[role="listbox"], *[role="option"]'
            ).length
          ) {
            loaded.comboboxListbox = true;
            loadCSS("7combobox-listbox.css", "7");
          }

          if (
            !loaded.menuMenubar &&
            !document.getElementById("ws-visual-aria-8") &&
            document.querySelectorAll(
              '*[role="menu"], *[role="menubar"], *[role="menuitem"], *[role="menuitemradio"], *[role="menuitemcheckbox"]'
            ).length
          ) {
            loaded.menuMenubar = true;
            loadCSS("8menu-menubar.css", "8");
          }

          if (
            !loaded.radiogroup &&
            !document.getElementById("ws-visual-aria-9") &&
            document.querySelectorAll('*[role="radiogroup"], *[role="radio"]')
              .length
          ) {
            loaded.radiogroup = true;
            loadCSS("9radiogroup.css", "9");
          }

          if (
            !loaded.tablist &&
            !document.getElementById("ws-visual-aria-10") &&
            document.querySelectorAll(
              '*[role="tablist"], *[role="tab"], *[role="tabpanel"]'
            ).length
          ) {
            loaded.tablist = true;
            loadCSS("10tablist.css", "10");
          }

          if (
            !loaded.tree &&
            !document.getElementById("ws-visual-aria-11") &&
            document.querySelectorAll('*[role="tree"], *[role="treeitem"]')
              .length
          ) {
            loaded.tree = true;
            loadCSS("11tree.css", "11");
          }

          if (
            !loaded.treegridGridTable &&
            !document.getElementById("ws-visual-aria-12") &&
            document.querySelectorAll(
              '*[role="treegrid"], *[role="grid"], *[role="table"], *[role="rowgroup"], *[role="row"], *[role="columnheader"], *[role="rowheader"], *[role="gridcell"], *[role="cell"]'
            ).length
          ) {
            loaded.treegridGridTable = true;
            loadCSS("12treegrid-grid-table.css", "12");
          }
        }

        if (loaded && !loaded.init) {
          loaded.init = true;
          loadCSS("1roles.css", "1");
          loaded.landmarks = true;
          loadCSS("2landmarks.css", "2");
          loaded.structural = true;
          loadCSS("3structural.css", "3");
          loaded.dialogs = true;
          loadCSS("4dialogs.css", "4");
          loaded.liveRegions = true;
          loadCSS("5live-regions.css", "5");
          loaded.simpleWidgets = true;
          loadCSS("6simple-widgets.css", "6");
        }

        // BG:12/18/2017: Added the AREA and HR elements to check for improper usage of aria-owns as well.
        nodes = document.querySelectorAll(
          "input[aria-owns], img[aria-owns], area[aria-owns], hr[aria-owns]"
        );

        for (var i = 0; i < nodes.length; i++) {
          nodes[i].setAttribute("data-ws-bm-aria-owns-invalid", "true");
          nodes[i].parentNode.setAttribute(
            "data-ws-bm-aria-owns-invalid",
            nodes[i].nodeName.toUpperCase()
          );
        }

        nodes = document.querySelectorAll("input, *[role], img, progress");

        obj = {};

        isSelfRef = function(node, role, ids) {
          if (
            !node ||
            node.nodeType !== 1 ||
            !trim(role) ||
            !trim(ids) ||
            " application banner complementary contentinfo form main navigation region search article directory document list note table toolbar feed log status combobox grid listbox menu menubar radiogroup tablist tabpanel tree group treegrid ".indexOf(
              " " + role + " "
            ) === -1
          )
            return false;

          var isF = false,
            a = ids.split(" ");

          for (var i = 0; i < a.length; i++) {
            if (document.getElementById(a[i]) == node) isF = true;
          }

          if (isF) node.setAttribute("data-ws-bm-self-ref", "true");
          return isF;
        };

        isDefTerm = function(ids) {
          var isT = true,
            a = ids.split(" ");

          for (var i = 0; i < a.length; i++) {
            var o = document.getElementById(a[i]);

            if (o && o.nodeType === 1 && o.getAttribute("role") != "term") {
              o.setAttribute("data-ws-bm-dtr-missing", "true");
              isT = false;
            }
          }
          return isT;
        };

        for (var i = 0; i < nodes.length; i++) {
          for (var j = 0; j < attrs.length; j++)
            obj[attrs[j]] = nodes[i].getAttribute(attrs[j]) || null;
          obj["node-name"] = nodes[i].nodeName.toLowerCase();
          obj.tabindex = nodes[i].getAttribute("tabindex");
          obj["input-type"] =
            obj["node-name"] == "input" ? nodes[i].getAttribute("type") : null;

          if (obj.role == "radio")
            obj["role-nested"] = isNested(nodes[i], "radiogroup");
          else if (obj.role == "tab")
            obj["role-nested"] = isNested(nodes[i], "tablist");
          else if (obj.role == "treeitem")
            obj["role-nested"] = isNested(nodes[i], "tree");

          isSelfRef(nodes[i], obj.role, obj["aria-labelledby"]);

          if (obj.role == "definition" && obj["aria-labelledby"])
            isDefTerm(obj["aria-labelledby"]);

          if (
            " input img progress ".indexOf(" " + obj["node-name"] + " ") !== -1
          ) {
            if (pNode != nodes[i].parentNode) {
              pNode = nodes[i].parentNode;

              for (var a in obj) {
                if (obj[a] || !isNaN(parseInt(obj[a])))
                  pNode.setAttribute("data-ws-bm-" + a, obj[a]);
                else pNode.removeAttribute("data-ws-bm-" + a);
              }
            }
          }
        }

        focused = document.querySelectorAll("*[aria-describedby]:focus");

        if (focused.length) {
          var dbs = focused[0].getAttribute("aria-describedby").split(" ");

          for (var d = 0; d < dbs.length; d++) {
            var t = document.getElementById(dbs[d]);

            if (t && t.nodeType === 1)
              t.setAttribute("data-ws-bm-db-match", dbs[d]);
          }
        }

        focused = document.querySelectorAll("*[aria-activedescendant]:focus");
        var fO = null;

        if (focused.length)
          fO = document.getElementById(
            focused[0].getAttribute("aria-activedescendant")
          );

        if (
          (!focused.length ||
            !fO ||
            focused[0] != activeObj ||
            fO != activeDObj) &&
          (activeDObj &&
            activeDObj.nodeType === 1 &&
            activeDObj.getAttribute("data-ws-bm-ad-match"))
        ) {
          activeDObj.removeAttribute("data-ws-bm-ad-match");
          activeDObj.removeAttribute("data-ws-bm-ad-invalid");
          activeDObj = null;
        }

        if (fO && fO.nodeType === 1) {
          activeObj = focused[0];
          activeDObj = fO;
          var nn = fO.nodeName.toLowerCase(),
            href = fO.getAttribute("href"),
            rl = fO.getAttribute("role");

          if (!rl && nn == "a" && href) rl = "link";
          else if (!rl && nn == "button") rl = "button";
          fO.setAttribute("data-ws-bm-ad-match", rl);

          if (!rl) fO.setAttribute("data-ws-bm-ad-invalid", "true");
        }

        focusHidden = document.querySelectorAll('*[hidefocus="true"]');

        for (var h = 0; h < focusHidden.length; h++)
          focusHidden[h].removeAttribute("hidefocus");

        frames = document.querySelectorAll("frame, iframe");

        for (var f = 0; f < frames.length; f++) {
          try {
            if (
              frames[f].contentDocument &&
              frames[f].contentDocument.head &&
              !frames[f].contentDocument.WSBMInit
            ) {
              frames[f].contentDocument.WSBMInit = WSBMInit;
              frames[f].contentDocument.WSBMInit(
                false,
                useOffline,
                basePath,
                msInterval,
                frames[f].contentDocument
              );
            }
          } catch (e) {}
        }

        var presentational = document.querySelectorAll(
          '*[role="presentation"], *[role="none"]'
        );

        for (var p = 0; p < presentational.length; p++) {
          var pO = presentational[p],
            oR = pO.getAttribute("role"),
            oN = pO.nodeName.toUpperCase(),
            aN =
              oR == "none" ? "data-ws-role-none" : "data-ws-role-presentation";

          if (
            " input textarea img progress ".indexOf(
              " " + oN.toLowerCase() + " "
            ) !== -1
          )
            pO.parentNode.setAttribute(aN, oN);
          else pO.setAttribute(aN, oN);
        }
      }

      setTimeout(check, msInterval);
    };

    var checkNames = function() {
      /*
AccName Prototype 2.16, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
      var calcNames = function(node, fnc, preventVisualARIASelfCSSRef) {
        var props = { name: "", desc: "" };
        if (!node || node.nodeType !== 1) {
          return props;
        }
        var topNode = node;

        // Track nodes to prevent duplicate node reference parsing.
        var nodes = [];
        // Track aria-owns references to prevent duplicate parsing.
        var owns = [];

        // Recursively process a DOM node to compute an accessible name in accordance with the spec
        var walk = function(
          refNode,
          stop,
          skip,
          nodesToIgnoreValues,
          skipAbort,
          ownedBy
        ) {
          var fullResult = {
            name: "",
            title: ""
          };

          /*
  ARIA Role Exception Rule Set 1.1
  The following Role Exception Rule Set is based on the following ARIA Working Group discussion involving all relevant browser venders.
  https://lists.w3.org/Archives/Public/public-aria/2017Jun/0057.html
  */
          var isException = function(node, refNode) {
            if (
              !refNode ||
              !node ||
              refNode.nodeType !== 1 ||
              node.nodeType !== 1
            ) {
              return false;
            }

            var inList = function(node, list) {
              var role = getRole(node);
              var tag = node.nodeName.toLowerCase();
              return (
                (role && list.roles.indexOf(role) >= 0) ||
                (!role && list.tags.indexOf(tag) >= 0)
              );
            };

            // The list3 overrides must be checked first.
            if (inList(node, list3)) {
              if (
                node === refNode &&
                !(node.id && ownedBy[node.id] && ownedBy[node.id].node)
              ) {
                return !isFocusable(node);
              } else {
                // Note: the inParent checker needs to be present to allow for embedded roles matching list3 when the referenced parent is referenced using aria-labelledby, aria-describedby, or aria-owns.
                return !(
                  (inParent(node, ownedBy.top) &&
                    node.nodeName.toLowerCase() !== "select") ||
                  inList(refNode, list1)
                );
              }
            }
            // Otherwise process list2 to identify roles to ignore processing name from content.
            else if (
              inList(node, list2) ||
              (node === topNode && !inList(node, list1))
            ) {
              return true;
            } else {
              return false;
            }
          };

          var inParent = function(node, parent) {
            var trackNodes = [];
            while (node) {
              if (
                node.id &&
                ownedBy[node.id] &&
                ownedBy[node.id].node &&
                trackNodes.indexOf(node) === -1
              ) {
                trackNodes.push(node);
                node = ownedBy[node.id].node;
              } else {
                node = node.parentNode;
              }
              if (node && node === parent) {
                return true;
              } else if (
                !node ||
                node === ownedBy.top ||
                node === document.body
              ) {
                return false;
              }
            }
            return false;
          };

          // Placeholder for storing CSS before and after pseudo element text values for the top level node
          var cssOP = {
            before: "",
            after: ""
          };

          if (ownedBy.ref) {
            if (isParentHidden(refNode, document.body, true, true)) {
              // If referenced via aria-labelledby or aria-describedby, do not return a name or description if a parent node is hidden.
              return fullResult;
            } else if (isHidden(refNode, document.body)) {
              // Otherwise, if aria-labelledby or aria-describedby reference a node that is explicitly hidden, then process all children regardless of their individual hidden states.
              var ignoreHidden = true;
            }
          }

          if (nodes.indexOf(refNode) === -1) {
            // Store the before and after pseudo element 'content' values for the top level DOM node
            // Note: If the pseudo element includes block level styling, a space will be added, otherwise inline is asumed and no spacing is added.
            cssOP = getCSSText(refNode, null);

            // Enabled in Visual ARIA to prevent self referencing by Visual ARIA tooltips
            if (preventVisualARIASelfCSSRef) {
              if (
                cssOP.before.indexOf(" [ARIA] ") !== -1 ||
                cssOP.before.indexOf(" aria-") !== -1 ||
                cssOP.before.indexOf(" accName: ") !== -1
              )
                cssOP.before = "";
              if (
                cssOP.after.indexOf(" [ARIA] ") !== -1 ||
                cssOP.after.indexOf(" aria-") !== -1 ||
                cssOP.after.indexOf(" accDescription: ") !== -1
              )
                cssOP.after = "";
            }
          }

          // Recursively apply the same naming computation to all nodes within the referenced structure
          var walkDOM = function(node, fn, refNode) {
            var res = {
              name: "",
              title: ""
            };
            if (!node) {
              return res;
            }
            var nodeIsBlock =
              node && node.nodeType === 1 && isBlockLevelElement(node)
                ? true
                : false;
            var fResult = fn(node) || {};
            if (fResult.name && fResult.name.length) {
              res.name += fResult.name;
            }
            if (!isException(node, ownedBy.top, ownedBy)) {
              node = node.firstChild;
              while (node) {
                res.name += walkDOM(node, fn, refNode).name;
                node = node.nextSibling;
              }
            }
            res.name += fResult.owns || "";
            if (!trim(res.name) && trim(fResult.title)) {
              res.name = addSpacing(fResult.title);
            } else {
              res.title = addSpacing(fResult.title);
            }
            if (trim(fResult.desc)) {
              res.title = addSpacing(fResult.desc);
            }
            if (nodeIsBlock || fResult.isWidget) {
              res.name = addSpacing(res.name);
            }
            return res;
          };

          fullResult = walkDOM(
            refNode,
            function(node) {
              var i = 0;
              var element = null;
              var ids = [];
              var parts = [];
              var result = {
                name: "",
                title: "",
                owns: ""
              };
              var isEmbeddedNode =
                node &&
                node.nodeType === 1 &&
                nodesToIgnoreValues &&
                nodesToIgnoreValues.length &&
                nodesToIgnoreValues.indexOf(node) !== -1 &&
                node === topNode &&
                node !== refNode
                  ? true
                  : false;

              if (
                (skip ||
                  !node ||
                  nodes.indexOf(node) !== -1 ||
                  (!ignoreHidden && isHidden(node, ownedBy.top))) &&
                !skipAbort &&
                !isEmbeddedNode
              ) {
                // Abort if algorithm step is already completed, or if node is a hidden child of refNode, or if this node has already been processed, or skip abort if aria-labelledby self references same node.
                return result;
              }

              if (nodes.indexOf(node) === -1) {
                nodes.push(node);
              }

              // Store name for the current node.
              var name = "";
              // Store name from aria-owns references if detected.
              var ariaO = "";
              // Placeholder for storing CSS before and after pseudo element text values for the current node container element
              var cssO = {
                before: "",
                after: ""
              };

              var parent = refNode === node ? node : node.parentNode;
              if (nodes.indexOf(parent) === -1) {
                nodes.push(parent);
                // Store the before and after pseudo element 'content' values for the current node container element
                // Note: If the pseudo element includes block level styling, a space will be added, otherwise inline is asumed and no spacing is added.
                cssO = getCSSText(parent, refNode);

                // Enabled in Visual ARIA to prevent self referencing by Visual ARIA tooltips
                if (preventVisualARIASelfCSSRef) {
                  if (
                    cssO.before.indexOf(" [ARIA] ") !== -1 ||
                    cssO.before.indexOf(" aria-") !== -1 ||
                    cssO.before.indexOf(" accName: ") !== -1
                  )
                    cssO.before = "";
                  if (
                    cssO.after.indexOf(" [ARIA] ") !== -1 ||
                    cssO.after.indexOf(" aria-") !== -1 ||
                    cssO.after.indexOf(" accDescription: ") !== -1
                  )
                    cssO.after = "";
                }
              }

              // Process standard DOM element node
              if (node.nodeType === 1) {
                var aLabelledby = node.getAttribute("aria-labelledby") || "";
                var aDescribedby = node.getAttribute("aria-describedby") || "";
                var aLabel = node.getAttribute("aria-label") || "";
                var nTitle = node.getAttribute("title") || "";
                var nTag = node.nodeName.toLowerCase();
                var nRole = getRole(node);

                var isNativeFormField = nativeFormFields.indexOf(nTag) !== -1;
                var isNativeButton = ["input"].indexOf(nTag) !== -1;
                var isRangeWidgetRole = rangeWidgetRoles.indexOf(nRole) !== -1;
                var isEditWidgetRole = editWidgetRoles.indexOf(nRole) !== -1;
                var isSelectWidgetRole =
                  selectWidgetRoles.indexOf(nRole) !== -1;
                var isSimulatedFormField =
                  isRangeWidgetRole ||
                  isEditWidgetRole ||
                  isSelectWidgetRole ||
                  nRole === "combobox";
                var isWidgetRole =
                  (isSimulatedFormField ||
                    otherWidgetRoles.indexOf(nRole) !== -1) &&
                  nRole !== "link";
                result.isWidget = isNativeFormField || isWidgetRole;

                var hasName = false;
                var aOwns = node.getAttribute("aria-owns") || "";
                var isSeparatChildFormField =
                  !isEmbeddedNode &&
                  ((node !== refNode &&
                    (isNativeFormField || isSimulatedFormField)) ||
                    (node.id &&
                      ownedBy[node.id] &&
                      ownedBy[node.id].target &&
                      ownedBy[node.id].target === node))
                    ? true
                    : false;

                if (!stop && node === refNode) {
                  // Check for non-empty value of aria-labelledby if current node equals reference node, follow each ID ref, then stop and process no deeper.
                  if (aLabelledby) {
                    ids = aLabelledby.split(/\s+/);
                    parts = [];
                    for (i = 0; i < ids.length; i++) {
                      element = document.getElementById(ids[i]);
                      // Also prevent the current form field from having its value included in the naming computation if nested as a child of label
                      parts.push(
                        walk(element, true, skip, [node], element === refNode, {
                          ref: ownedBy,
                          top: element
                        }).name
                      );
                    }
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(parts.join(" "));

                    if (trim(name)) {
                      hasName = true;
                      // Abort further recursion if name is valid.
                      skip = true;
                    }
                  }

                  // Check for non-empty value of aria-describedby if current node equals reference node, follow each ID ref, then stop and process no deeper.
                  if (aDescribedby) {
                    var desc = "";
                    ids = aDescribedby.split(/\s+/);
                    parts = [];
                    for (i = 0; i < ids.length; i++) {
                      element = document.getElementById(ids[i]);
                      // Also prevent the current form field from having its value included in the naming computation if nested as a child of label
                      parts.push(
                        walk(element, true, false, [node], false, {
                          ref: ownedBy,
                          top: element
                        }).name
                      );
                    }
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    desc = trim(parts.join(" "));

                    if (trim(desc)) {
                      result.desc = desc;
                    }
                  }
                }

                // Otherwise, if the current node is a nested widget control within the parent ref obj, then add only its value and process no deeper within the branch.
                if (isSeparatChildFormField) {
                  // Prevent the referencing node from having its value included in the case of form control labels that contain the element with focus.
                  if (
                    !(
                      nodesToIgnoreValues &&
                      nodesToIgnoreValues.length &&
                      nodesToIgnoreValues.indexOf(node) !== -1
                    )
                  ) {
                    if (isRangeWidgetRole) {
                      // For range widgets, append aria-valuetext if non-empty, or aria-valuenow if non-empty, or node.value if applicable.
                      name = getObjectValue(nRole, node, true);
                    } else if (
                      isEditWidgetRole ||
                      (nRole === "combobox" && isNativeFormField)
                    ) {
                      // For simulated edit widgets, append text from content if applicable, or node.value if applicable.
                      name = getObjectValue(nRole, node, false, true);
                    } else if (isSelectWidgetRole) {
                      // For simulated select widgets, append same naming computation algorithm for all child nodes including aria-selected="true" separated by a space when multiple.
                      // Also filter nodes so that only valid child roles of relevant parent role that include aria-selected="true" are included.
                      name = getObjectValue(nRole, node, false, false, true);
                    } else if (
                      isNativeFormField &&
                      ["input", "textarea"].indexOf(nTag) !== -1 &&
                      (!isWidgetRole || isEditWidgetRole)
                    ) {
                      // For native edit fields, append node.value when applicable.
                      name = getObjectValue(
                        nRole,
                        node,
                        false,
                        false,
                        false,
                        true
                      );
                    } else if (
                      isNativeFormField &&
                      nTag === "select" &&
                      (!isWidgetRole || nRole === "combobox")
                    ) {
                      // For native select fields, get text from content for all options with selected attribute separated by a space when multiple, but don't process if another widget role is present unless it matches role="combobox".
                      // Reference: https://github.com/WhatSock/w3c-alternative-text-computation/issues/7
                      name = getObjectValue(
                        nRole,
                        node,
                        false,
                        false,
                        true,
                        true
                      );
                    }

                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(name);
                  }

                  if (trim(name)) {
                    hasName = true;
                  }
                }

                // Otherwise, if current node has a non-empty aria-label then set as name and process no deeper within the branch.
                if (!hasName && trim(aLabel) && !isSeparatChildFormField) {
                  name = aLabel;

                  // Check for blank value, since whitespace chars alone are not valid as a name
                  if (trim(name)) {
                    hasName = true;
                    if (node === refNode) {
                      // If name is non-empty and both the current and refObject nodes match, then don't process any deeper within the branch.
                      skip = true;
                    }
                  }
                }

                // Otherwise, if name is still empty and the current node matches the ref node and is a standard form field with a non-empty associated label element, process label with same naming computation algorithm.
                if (!hasName && node === refNode && isNativeFormField) {
                  // Logic modified to match issue
                  // https://github.com/WhatSock/w3c-alternative-text-computation/issues/12 */
                  var labels = document.querySelectorAll("label");
                  var implicitLabel = getParent(node, "label") || false;
                  var explicitLabel =
                    node.id &&
                    document.querySelectorAll('label[for="' + node.id + '"]')
                      .length
                      ? document.querySelector('label[for="' + node.id + '"]')
                      : false;
                  var implicitI = 0;
                  var explicitI = 0;
                  for (i = 0; i < labels.length; i++) {
                    if (labels[i] === implicitLabel) {
                      implicitI = i;
                    } else if (labels[i] === explicitLabel) {
                      explicitI = i;
                    }
                  }
                  var isImplicitFirst =
                    implicitLabel &&
                    implicitLabel.nodeType === 1 &&
                    explicitLabel &&
                    explicitLabel.nodeType === 1 &&
                    implicitI < explicitI
                      ? true
                      : false;

                  if (implicitLabel && explicitLabel && isImplicitFirst) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(implicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: implicitLabel
                      }).name +
                        " " +
                        walk(explicitLabel, true, skip, [node], false, {
                          ref: ownedBy,
                          top: explicitLabel
                        }).name
                    );
                  } else if (explicitLabel && implicitLabel) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(explicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: explicitLabel
                      }).name +
                        " " +
                        walk(implicitLabel, true, skip, [node], false, {
                          ref: ownedBy,
                          top: implicitLabel
                        }).name
                    );
                  } else if (explicitLabel) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(explicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: explicitLabel
                      }).name
                    );
                  } else if (implicitLabel) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(
                      walk(implicitLabel, true, skip, [node], false, {
                        ref: ownedBy,
                        top: implicitLabel
                      }).name
                    );
                  }

                  if (trim(name)) {
                    hasName = true;
                  }
                }

                // Process native form field buttons in accordance with the HTML AAM
                // https://w3c.github.io/html-aam/#accessible-name-and-description-computation
                var btnType =
                  (isNativeButton && node.getAttribute("type")) || false;
                var btnValue =
                  (btnType && trim(node.getAttribute("value"))) || false;

                var rolePresentation =
                  !hasName &&
                  nRole &&
                  presentationRoles.indexOf(nRole) !== -1 &&
                  !isFocusable(node) &&
                  !hasGlobalAttr(node)
                    ? true
                    : false;
                var nAlt = rolePresentation
                  ? ""
                  : trim(node.getAttribute("alt"));

                // Otherwise, if name is still empty and current node is a standard non-presentational img or image button with a non-empty alt attribute, set alt attribute value as the accessible name.
                if (
                  !hasName &&
                  !rolePresentation &&
                  (nTag === "img" || btnType === "image") &&
                  nAlt
                ) {
                  // Check for blank value, since whitespace chars alone are not valid as a name
                  name = trim(nAlt);
                  if (trim(name)) {
                    hasName = true;
                  }
                }

                if (
                  !hasName &&
                  node === refNode &&
                  btnType &&
                  ["button", "image", "submit", "reset"].indexOf(btnType) !== -1
                ) {
                  if (btnValue) {
                    name = btnValue;
                  } else {
                    switch (btnType) {
                      case "submit":
                      case "image":
                        name = "Submit Query";
                        break;
                      case "reset":
                        name = "Reset";
                        break;
                      default:
                        name = "";
                    }
                  }
                  if (trim(name)) {
                    hasName = true;
                  }
                }

                if (
                  hasName &&
                  node === refNode &&
                  btnType &&
                  ["button", "submit", "reset"].indexOf(btnType) !== -1 &&
                  btnValue &&
                  btnValue !== name &&
                  !result.desc
                ) {
                  result.desc = btnValue;
                }

                // Otherwise, if current node is non-presentational and includes a non-empty title attribute and is not a separate embedded form field, store title attribute value as the accessible name if name is still empty, or the description if not.
                if (
                  !rolePresentation &&
                  trim(nTitle) &&
                  !isSeparatChildFormField
                ) {
                  if (node === refNode) {
                    result.title = trim(nTitle);
                  }
                }

                // Check for non-empty value of aria-owns, follow each ID ref, then process with same naming computation.
                // Also abort aria-owns processing if contained on an element that does not support child elements.
                if (aOwns && !isNativeFormField && nTag !== "img") {
                  ids = aOwns.split(/\s+/);
                  parts = [];
                  for (i = 0; i < ids.length; i++) {
                    element = document.getElementById(ids[i]);
                    // Abort processing if the referenced node has already been traversed
                    if (element && owns.indexOf(ids[i]) === -1) {
                      owns.push(ids[i]);
                      var oBy = { ref: ownedBy, top: ownedBy.top };
                      oBy[ids[i]] = {
                        refNode: refNode,
                        node: node,
                        target: element
                      };
                      if (!isParentHidden(element, document.body, true)) {
                        parts.push(
                          walk(element, true, skip, [], false, oBy).name
                        );
                      }
                    }
                  }
                  // Join without adding whitespace since this is already handled by parsing individual nodes within the algorithm steps.
                  ariaO = parts.join("");
                }
              }

              // Otherwise, process text node
              else if (node.nodeType === 3) {
                name = node.data;
              }

              // Prepend and append the current CSS pseudo element text, plus normalize all whitespace such as newline characters and others into flat spaces.
              name = cssO.before + name.replace(/\s+/g, " ") + cssO.after;

              if (
                name.length &&
                !hasParentLabelOrHidden(
                  node,
                  ownedBy.top,
                  ownedBy,
                  ignoreHidden
                )
              ) {
                result.name = name;
              }

              result.owns = ariaO;

              return result;
            },
            refNode
          );

          // Prepend and append the refObj CSS pseudo element text, plus normalize whitespace chars into flat spaces.
          fullResult.name =
            cssOP.before + fullResult.name.replace(/\s+/g, " ") + cssOP.after;

          return fullResult;
        };

        var getRole = function(node) {
          var role = node && node.getAttribute ? node.getAttribute("role") : "";
          if (!trim(role)) {
            return "";
          }
          var inList = function(list) {
            return trim(role).length > 0 && list.roles.indexOf(role) >= 0;
          };
          var roles = role.split(/\s+/);
          for (var i = 0; i < roles.length; i++) {
            role = roles[i];
            if (
              inList(list1) ||
              inList(list2) ||
              inList(list3) ||
              presentationRoles.indexOf(role) !== -1
            ) {
              return role;
            }
          }
          return "";
        };

        var isFocusable = function(node) {
          var nodeName = node.nodeName.toLowerCase();
          if (node.getAttribute("tabindex")) {
            return true;
          }
          if (nodeName === "a" && node.getAttribute("href")) {
            return true;
          }
          if (
            ["button", "input", "select", "textarea"].indexOf(nodeName) !==
              -1 &&
            node.getAttribute("type") !== "hidden"
          ) {
            return true;
          }
          return false;
        };

        // ARIA Role Exception Rule Set 1.1
        // The following Role Exception Rule Set is based on the following ARIA Working Group discussion involving all relevant browser venders.
        // https://lists.w3.org/Archives/Public/public-aria/2017Jun/0057.html

        // Always include name from content when the referenced node matches list1, as well as when child nodes match those within list3
        // Note: gridcell was added to list1 to account for focusable gridcells that match the ARIA 1.0 paradigm for interactive grids.
        var list1 = {
          roles: [
            "button",
            "checkbox",
            "link",
            "option",
            "radio",
            "switch",
            "tab",
            "treeitem",
            "menuitem",
            "menuitemcheckbox",
            "menuitemradio",
            "cell",
            "gridcell",
            "columnheader",
            "rowheader",
            "tooltip",
            "heading"
          ],
          tags: [
            "a",
            "button",
            "summary",
            "input",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "menuitem",
            "option",
            "td",
            "th"
          ]
        };
        // Never include name from content when current node matches list2
        var list2 = {
          roles: [
            "application",
            "alert",
            "log",
            "marquee",
            "timer",
            "alertdialog",
            "dialog",
            "banner",
            "complementary",
            "form",
            "main",
            "navigation",
            "region",
            "search",
            "article",
            "document",
            "feed",
            "figure",
            "img",
            "math",
            "toolbar",
            "menu",
            "menubar",
            "grid",
            "listbox",
            "radiogroup",
            "textbox",
            "searchbox",
            "spinbutton",
            "scrollbar",
            "slider",
            "tablist",
            "tabpanel",
            "tree",
            "treegrid",
            "separator"
          ],
          tags: [
            "article",
            "aside",
            "body",
            "select",
            "datalist",
            "optgroup",
            "dialog",
            "figure",
            "footer",
            "form",
            "header",
            "hr",
            "img",
            "textarea",
            "input",
            "main",
            "math",
            "menu",
            "nav",
            "section"
          ]
        };
        // As an override of list2, conditionally include name from content if current node is focusable, or if the current node matches list3 while the referenced parent node matches list1.
        var list3 = {
          roles: [
            "term",
            "definition",
            "directory",
            "list",
            "group",
            "note",
            "status",
            "table",
            "rowgroup",
            "row",
            "contentinfo"
          ],
          tags: [
            "dl",
            "ul",
            "ol",
            "dd",
            "details",
            "output",
            "table",
            "thead",
            "tbody",
            "tfoot",
            "tr"
          ]
        };

        var nativeFormFields = ["button", "input", "select", "textarea"];
        var rangeWidgetRoles = ["scrollbar", "slider", "spinbutton"];
        var editWidgetRoles = ["searchbox", "textbox"];
        var selectWidgetRoles = [
          "grid",
          "listbox",
          "tablist",
          "tree",
          "treegrid"
        ];
        var otherWidgetRoles = [
          "button",
          "checkbox",
          "link",
          "switch",
          "option",
          "menu",
          "menubar",
          "menuitem",
          "menuitemcheckbox",
          "menuitemradio",
          "radio",
          "tab",
          "treeitem",
          "gridcell"
        ];
        var presentationRoles = ["presentation", "none"];

        var hasGlobalAttr = function(node) {
          var globalPropsAndStates = [
            "busy",
            "controls",
            "current",
            "describedby",
            "details",
            "disabled",
            "dropeffect",
            "errormessage",
            "flowto",
            "grabbed",
            "haspopup",
            "invalid",
            "keyshortcuts",
            "live",
            "owns",
            "roledescription"
          ];
          for (var i = 0; i < globalPropsAndStates.length; i++) {
            var a = trim(node.getAttribute("aria-" + globalPropsAndStates[i]));
            if (a) {
              return true;
            }
          }
          return false;
        };

        var isHidden = function(node, refNode) {
          var hidden = function(node) {
            if (node.nodeType !== 1 || node === refNode) {
              return false;
            }
            if (node.getAttribute("aria-hidden") === "true") {
              return true;
            }
            if (node.getAttribute("hidden")) {
              return true;
            }
            var style = getStyleObject(node);
            if (
              style["display"] === "none" ||
              style["visibility"] === "hidden"
            ) {
              return true;
            }
            return false;
          };
          return hidden(node);
        };

        var isParentHidden = function(node, refNode, skipOwned, skipCurrent) {
          while (node && node !== refNode) {
            if (
              !skipCurrent &&
              node.nodeType === 1 &&
              isHidden(node, refNode)
            ) {
              return true;
            } else skipCurrent = false;
            node = node.parentNode;
          }
          return false;
        };

        var getStyleObject = function(node) {
          var style = {};
          if (document.defaultView && document.defaultView.getComputedStyle) {
            style = document.defaultView.getComputedStyle(node, "");
          } else if (node.currentStyle) {
            style = node.currentStyle;
          }
          return style;
        };

        var cleanCSSText = function(node, text) {
          var s = text;
          if (s.indexOf("attr(") !== -1) {
            var m = s.match(/attr\((.|\n|\r\n)*?\)/g);
            for (var i = 0; i < m.length; i++) {
              var b = m[i].slice(5, -1);
              b = node.getAttribute(b) || "";
              s = s.replace(m[i], b);
            }
          }
          return s || text;
        };

        var isBlockLevelElement = function(node, cssObj) {
          var styleObject = cssObj || getStyleObject(node);
          for (var prop in blockStyles) {
            var values = blockStyles[prop];
            for (var i = 0; i < values.length; i++) {
              if (
                styleObject[prop] &&
                ((values[i].indexOf("!") === 0 &&
                  [values[i].slice(1), "inherit", "initial", "unset"].indexOf(
                    styleObject[prop]
                  ) === -1) ||
                  styleObject[prop].indexOf(values[i]) !== -1)
              ) {
                return true;
              }
            }
          }
          if (
            !cssObj &&
            node.nodeName &&
            blockElements.indexOf(node.nodeName.toLowerCase()) !== -1
          ) {
            return true;
          }
          return false;
        };

        // CSS Block Styles indexed from:
        // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
        var blockStyles = {
          display: ["block", "grid", "table", "flow-root", "flex"],
          position: ["absolute", "fixed"],
          float: ["left", "right", "inline"],
          clear: ["left", "right", "both", "inline"],
          overflow: ["hidden", "scroll", "auto"],
          "column-count": ["!auto"],
          "column-width": ["!auto"],
          "column-span": ["all"],
          contain: ["layout", "content", "strict"]
        };

        // HTML5 Block Elements indexed from:
        // https://github.com/webmodules/block-elements
        // Note: 'br' was added to this array because it impacts visual display and should thus add a space .
        // Reference issue: https://github.com/w3c/accname/issues/4
        // Note: Added in 1.13, td, th, tr, and legend
        var blockElements = [
          "address",
          "article",
          "aside",
          "blockquote",
          "br",
          "canvas",
          "dd",
          "div",
          "dl",
          "dt",
          "fieldset",
          "figcaption",
          "figure",
          "footer",
          "form",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "header",
          "hgroup",
          "hr",
          "legend",
          "li",
          "main",
          "nav",
          "noscript",
          "ol",
          "output",
          "p",
          "pre",
          "section",
          "table",
          "td",
          "tfoot",
          "th",
          "tr",
          "ul",
          "video"
        ];

        var getObjectValue = function(
          role,
          node,
          isRange,
          isEdit,
          isSelect,
          isNative
        ) {
          var val = "";
          var bypass = false;

          if (isRange && !isNative) {
            val =
              node.getAttribute("aria-valuetext") ||
              node.getAttribute("aria-valuenow") ||
              "";
          } else if (isEdit && !isNative) {
            val = getText(node) || "";
          } else if (isSelect && !isNative) {
            var childRoles = [];
            if (role === "grid" || role === "treegrid") {
              childRoles = ["gridcell", "rowheader", "columnheader"];
            } else if (role === "listbox") {
              childRoles = ["option"];
            } else if (role === "tablist") {
              childRoles = ["tab"];
            } else if (role === "tree") {
              childRoles = ["treeitem"];
            }
            val = joinSelectedParts(
              node,
              node.querySelectorAll('*[aria-selected="true"]'),
              false,
              childRoles
            );
            bypass = true;
          }
          val = trim(val);
          if (!val && (isRange || isEdit) && node.value) {
            val = node.value;
          }
          if (!bypass && !val && isNative) {
            if (isSelect) {
              val = joinSelectedParts(
                node,
                node.querySelectorAll("option[selected]"),
                true
              );
            } else {
              val = node.value;
            }
          }

          return val;
        };

        var addSpacing = function(s) {
          return trim(s).length ? " " + s + " " : " ";
        };

        var joinSelectedParts = function(node, nOA, isNative, childRoles) {
          if (!nOA || !nOA.length) {
            return "";
          }
          var parts = [];
          for (var i = 0; i < nOA.length; i++) {
            var role = getRole(nOA[i]);
            var isValidChildRole =
              !childRoles || childRoles.indexOf(role) !== -1;
            if (isValidChildRole) {
              parts.push(
                isNative
                  ? getText(nOA[i])
                  : walk(nOA[i], true, false, [], false, { top: nOA[i] }).name
              );
            }
          }
          return parts.join(" ");
        };

        var getPseudoElStyleObj = function(node, position) {
          var styleObj = {};
          for (var prop in blockStyles) {
            styleObj[prop] = document.defaultView
              .getComputedStyle(node, position)
              .getPropertyValue(prop);
          }
          styleObj["content"] = document.defaultView
            .getComputedStyle(node, position)
            .getPropertyValue("content")
            .replace(/^"|\\|"$/g, "");
          return styleObj;
        };

        var getText = function(node, position) {
          if (!position && node.nodeType === 1) {
            return node.innerText || node.textContent || "";
          }
          var styles = getPseudoElStyleObj(node, position);
          var text = styles["content"];
          if (!text || text === "none") {
            return "";
          }
          if (isBlockLevelElement({}, styles)) {
            if (position === ":before") {
              text += " ";
            } else if (position === ":after") {
              text = " " + text;
            }
          }
          return text;
        };

        var getCSSText = function(node, refNode) {
          if (
            (node && node.nodeType !== 1) ||
            node === refNode ||
            ["input", "select", "textarea", "img", "iframe"].indexOf(
              node.nodeName.toLowerCase()
            ) !== -1
          ) {
            return { before: "", after: "" };
          }
          if (document.defaultView && document.defaultView.getComputedStyle) {
            return {
              before: cleanCSSText(node, getText(node, ":before")),
              after: cleanCSSText(node, getText(node, ":after"))
            };
          } else {
            return { before: "", after: "" };
          }
        };

        var getParent = function(node, nTag) {
          while (node) {
            node = node.parentNode;
            if (node && node.nodeName && node.nodeName.toLowerCase() === nTag) {
              return node;
            }
          }
          return {};
        };

        var hasParentLabelOrHidden = function(
          node,
          refNode,
          ownedBy,
          ignoreHidden
        ) {
          var trackNodes = [];
          while (node && node !== refNode) {
            if (
              node.id &&
              ownedBy &&
              ownedBy[node.id] &&
              ownedBy[node.id].node &&
              trackNodes.indexOf(node) === -1
            ) {
              trackNodes.push(node);
              node = ownedBy[node.id].node;
            } else {
              node = node.parentNode;
            }
            if (node && node.getAttribute) {
              if (
                trim(node.getAttribute("aria-label")) ||
                (!ignoreHidden && isHidden(node, refNode))
              ) {
                return true;
              }
            }
          }
          return false;
        };

        var trim = function(str) {
          if (typeof str !== "string") {
            return "";
          }
          return str.replace(/^\s+|\s+$/g, "");
        };

        if (isParentHidden(node, document.body, true)) {
          return props;
        }

        // Compute accessible Name and Description properties value for node
        var accProps = walk(node, false, false, [], false, { top: node });

        var accName = trim(accProps.name.replace(/\s+/g, " "));
        var accDesc = trim(accProps.title.replace(/\s+/g, " "));

        if (accName === accDesc) {
          // If both Name and Description properties match, then clear the Description property value.
          accDesc = "";
        }

        props.name = accName;
        props.desc = accDesc;

        // Clear track variables
        nodes = [];
        owns = [];

        if (fnc && typeof fnc === "function") {
          return fnc.apply(node, [node, props]);
        } else {
          return props;
        }
      };

      var accNames = document.querySelectorAll(
        'textarea, input, select, button, a[href], progress, *[role="button"], *[role="checkbox"], *[role="link"], *[role="searchbox"], *[role="scrollbar"], *[role="slider"], *[role="spinbutton"], *[role="switch"], *[role="textbox"], *[role="combobox"], *[role="option"], *[role="menuitem"], *[role="menuitemcheckbox"], *[role="menuitemradio"], *[role="radio"], *[role="tab"], *[role="treeitem"], h1, h2, h3, h4, h5, h6, *[role="heading"], ul[aria-labelledby], ol[aria-labelledby], *[role="list"][aria-labelledby], *[role="directory"][aria-labelledby], ul[aria-label], ol[aria-label], *[role="list"][aria-label], *[role="directory"][aria-label], table[aria-labelledby], *[role="table"][aria-labelledby], *[role="grid"][aria-labelledby], *[role="treegrid"][aria-labelledby], table[aria-label], *[role="table"][aria-label], *[role="grid"][aria-label], *[role="treegrid"][aria-label], *[role="row"][aria-labelledby], *[role="row"][aria-label], *[role="cell"], *[role="gridcell"], th, *[role="columnheader"], *[role="rowheader"], *[role="alertdialog"][aria-labelledby], dialog[aria-labelledby], *[role="dialog"][aria-labelledby], *[role="alertdialog"][aria-label], dialog[aria-label], *[role="dialog"][aria-label], header[aria-labelledby], *[role="banner"][aria-labelledby], aside[aria-labelledby], *[role="complementary"][aria-labelledby], footer[aria-labelledby], *[role="contentinfo"][aria-labelledby], header[aria-label], *[role="banner"][aria-label], aside[aria-label], *[role="complementary"][aria-label], footer[aria-label], *[role="contentinfo"][aria-label], form[aria-labelledby], *[role="form"][aria-labelledby], form[aria-label], *[role="form"][aria-label], main[aria-labelledby], *[role="main"][aria-labelledby], nav[aria-labelledby], *[role="navigation"][aria-labelledby], main[aria-label], *[role="main"][aria-label], nav[aria-label], *[role="navigation"][aria-label], section[aria-labelledby], section[aria-label], *[role="region"][aria-labelledby], *[role="search"][aria-labelledby], *[role="article"][aria-labelledby], *[role="definition"][aria-labelledby], *[role="document"][aria-labelledby], *[role="feed"][aria-labelledby], *[role="figure"][aria-labelledby], *[role="img"][aria-labelledby], *[role="math"][aria-labelledby], *[role="note"][aria-labelledby], *[role="application"][aria-labelledby], *[role="region"][aria-label], *[role="search"][aria-label], *[role="article"][aria-label], *[role="definition"][aria-label], *[role="document"][aria-label], *[role="feed"][aria-label], *[role="figure"][aria-label], *[role="img"][aria-label], *[role="math"][aria-label], *[role="note"][aria-label], *[role="application"][aria-label], *[role="log"][aria-labelledby], *[role="marquee"][aria-labelledby], *[role="status"][aria-labelledby], *[role="timer"][aria-labelledby], *[role="log"][aria-label], *[role="marquee"][aria-label], *[role="status"][aria-label], *[role="timer"][aria-label], *[role="toolbar"][aria-labelledby], *[role="group"][aria-labelledby], *[role="listbox"][aria-labelledby], *[role="menu"][aria-labelledby], *[role="menubar"][aria-labelledby], *[role="toolbar"][aria-label], *[role="group"][aria-label], *[role="listbox"][aria-label], *[role="menu"][aria-label], *[role="menubar"][aria-label], *[role="radiogroup"][aria-labelledby], *[role="tree"][aria-labelledby], *[role="tablist"][aria-labelledby], *[role="tabpanel"][aria-labelledby], *[role="radiogroup"][aria-label], *[role="tree"][aria-label], *[role="tablist"][aria-label], *[role="tabpanel"][aria-label]'
      );

      for (var aN = 0; aN < accNames.length; aN++) {
        calcNames(
          accNames[aN],
          function(node, props) {
            if (
              " input textarea img progress ".indexOf(
                " " + node.nodeName.toLowerCase() + " "
              ) !== -1
            ) {
              node.parentNode.setAttribute("data-ws-bm-name-prop", props.name);

              node.parentNode.setAttribute("data-ws-bm-desc-prop", props.desc);
            } else {
              node.setAttribute("data-ws-bm-name-prop", props.name);

              node.setAttribute("data-ws-bm-desc-prop", props.desc);
            }
          },
          true
        );
      }

      setTimeout(checkNames, 5000);
    };

    setTimeout(checkNames, 5000);

    if (!useOffline) {
      loaded = {
        init: false,
        landmarks: false,
        structural: false,
        dialogs: false,
        liveRegions: false,
        simpleWidgets: false,
        comboboxListbox: false,
        menuMenubar: false,
        radiogroup: false,
        tablist: false,
        tree: false,
        treegridGridTable: false
      };

      var load = (function() {
        function _load() {
          return function(url, id) {
            return new Promise(function(resolve, reject) {
              var t = document.createElement("link");
              t.type = "text/css";
              t.rel = "stylesheet";
              t.id = id;
              t.onload = function() {
                resolve(url);
              };
              t.onerror = function() {
                // reject(url);
              };
              t.href = url;
              loader.cssLinks.push(t);
              document.head.appendChild(t);
            });
          };
        }
        return {
          css: _load()
        };
      })();

      var loadCSS = function(file, i) {
        if (!loader.cssLinks) loader.cssLinks = [];
        /*
        var l = document.createElement("link");
        l.type = "text/css";
        l.rel = "stylesheet";
        l.href = basePath + file;
        l.id = "ws-visual-aria-" + i;
        loader.cssLinks.push(l);
        document.head.appendChild(l);
*/
        Promise.all([load.css(basePath + file, "ws-visual-aria-" + i)]);
      };
    }

    check();

    bind(document.body, "mousedown", function(ev) {
      if (ev.shiftKey && ev.ctrlKey) {
        var targ = null;

        if (!ev) ev = window.event;

        if (ev.target) targ = ev.target;
        else if (ev.srcElement) targ = ev.srcElement;

        if (targ.nodeType == 3) targ = targ.parentNode;
        var getClosestRole = function(o) {
          while (o) {
            var r = o.getAttribute("role");

            if (
              r &&
              " rowgroup row columnheader rowheader menuitem menuitemcheckbox menuitemradio group ".indexOf(
                " " + r + " "
              ) === -1
            ) {
              if (r == "option") r = "listbox";
              else if (r == "radio") r = "radiogroup";
              else if (r == "tab" || r == "tabpanel") r = "tablist";
              else if (r == "treeitem") r = "tree";
              return r;
            }
            o = o.parentNode;
          }
          return null;
        };
        var role = getClosestRole(targ),
          rmo = window.VisualARIAMatrices;

        if (role && rmo.nodeType === 1)
          rmo.href = "http://whatsock.com/training/matrices/#" + role;

        if (rmo.nodeType === 1) rmo.click();
      }
    });
  };

  setTimeout(function() {
    WSBMInit(true, useOffline, basePath, msInterval, document);
  }, 3000);

  if (!document.getElementById("ws-bm-aria-matrices-lnk")) {
    var m = document.createElement("span");
    m.innerHTML =
      '<span id="ws-bm-aria-matrices-lnk" style="text-align: center; position: fixed; top: 0; right: 0;padding: 3px; border: 1px solid #dedede; background: #f5f5f5; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#f9f9f9\', endColorstr=\'#f0f0f0\'); background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0)); background: -moz-linear-gradient(top,  #f9f9f9, #f0f0f0); border-color: #000; -webkit-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; -moz-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb;" onmouseenter="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onmouseleave="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;"><a id="ws-bm-aria-matrices-lnk-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" target="ws_aria_role_matrices" onmouseover="this.href=\'http://whatsock.com/training/matrices/\';" onclick="this.href=\'http://whatsock.com/training/matrices/\';" onfocus="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onblur="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;" href="http://whatsock.com/training/matrices/" aria-label="ARIA Role Matrices">?</a><br /><a id="ws-bm-aria-matrices-toggle-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" onclick="window.VisualARIA.toggleVisualARIA(); return false;" onfocus="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onblur="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;" href="#" aria-label="Unload Visual ARIA">X</a> </span>';
    document.body.appendChild(m);
    window.VisualARIA.VisualARIAMatrices = document.getElementById(
      "ws-bm-aria-matrices-lnk-a"
    );
    window.VisualARIA.VisualARIAToggle = document.getElementById(
      "ws-bm-aria-matrices-toggle-a"
    );
  }
})();
