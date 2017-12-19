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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(18)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.11
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      if ("development" !== 'production' && isPlainObject(val)) {
        validatePropObject(name, val, vm);
      }
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Validate whether a prop object keys are valid.
 */
var propOptionsRE = /^(type|default|required|validator)$/;

function validatePropObject (
  propName,
  prop,
  vm
) {
  for (var key in prop) {
    if (!propOptionsRE.test(key)) {
      warn(
        ("Invalid key \"" + key + "\" in validation rules object for prop \"" + propName + "\"."),
        vm
      );
    }
  }
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if ("development" !== 'production' && inject) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm;
    vnode.fnOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.11';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = { value: value };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    if (value$1) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$1 = 0; i$1 < postTransforms.length; i$1++) {
        postTransforms[i$1](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim().replace(stripParensRE, '');
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = alias.replace(forIteratorRE, '');
      el.iterator1 = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        el.iterator2 = iteratorMatch[2].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (map['v-model'] && (map['v-bind:type'] || map[':type'])) {
      var typeBinding = getBindingAttr(el, 'type');
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

var model$2 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$2
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var code = keyCodes[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(code)) + "," +
    "$event.key)"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(11).setImmediate))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export Store */
/* unused harmony export install */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return mapState; });
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/* unused harmony export createNamespacedHelpers */
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["a"] = (index_esm);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__treemap_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__masonary_grid_vue__ = __webpack_require__(23);





/* harmony default export */ __webpack_exports__["a"] = ({
	components: {
		TreeMap: __WEBPACK_IMPORTED_MODULE_1__treemap_vue__["a" /* default */],
		MasonaryGrid: __WEBPACK_IMPORTED_MODULE_2__masonary_grid_vue__["a" /* default */]
	},
	computed: Object(__WEBPACK_IMPORTED_MODULE_0_vuex__["b" /* mapState */])([])
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//

// import { indexString } from '../data/index.images.js'

/* harmony default export */ __webpack_exports__["a"] = ({
    // computed: mapState([]),
});
// const data = [
//     {id:"root",value:null},
//     ...indexString.split("\n").map((imgPath, idx) => ({
//         id:`root.${idx}`,
//         value: null,
//         img:`../data/img/${imgPath.trim()}`,
//     }))
// ];
// const galleryEl = document.querySelector('#gallery');
// const images = indexString.split("\n");
// const html = images.map(imgPath => `<img src="../data/img/${imgPath.trim()}">`)
// galleryEl.innerHTML = html.join('');

// var width = document.querySelector("#graph").clientWidth
// var height = document.querySelector("#graph").clientHeight
// var div = d3.select("#graph").append("div").attr("width", width).attr("height", height)


// setInterval(draw, 20000)
// setTimeout(() => {
//     draw()
// },6000)


function draw() {

    randomize();

    var stratify = d3.stratify().parentId(function (d) {
        return d.id.substring(0, d.id.lastIndexOf("."));
    });

    var root = stratify(data).sum(function (d) {
        console.log("d.img", d.value, d.img);
        const img = document.querySelector(`img[src="${d.img}"]`);
        // console.log("img.clientWidth*img.clientHeight", (img.clientWidth*img.clientHeight)/100000);
        if (img) return img.clientWidth * img.clientHeight / 100000;
        return 0;
        // return d.value
    });

    var treemap = d3.treemap().tile(d3.treemapBinary).size([width, height]).padding(1).round(true);

    treemap(root);
    drawTreemap(root);
}

function randomize() {
    data.filter(function (d) {
        return d.id !== "root";
    }).forEach(function (d) {
        d.value = ~~d3.randomUniform(1, 10)();
    });
}

function drawTreemap(root) {

    var node = div.selectAll(".node").data(root.children);

    var newNode = node.enter().append("div").attr("class", "node");

    node.merge(newNode).transition().duration(1000).style("left", function (d) {
        return d.x0 + "px";
    }).style("top", function (d) {
        return d.y0 + "px";
    }).style("width", function (d) {
        return d.x1 - d.x0 + "px";
    }).style("height", function (d) {
        return d.y1 - d.y0 + "px";
    }).style("background-image", function (d) {
        return "url(" + d.data.img + ")";
    });
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_colors_one_js__ = __webpack_require__(26);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



function shuffleArray(array) {
	var currentIndex = array.length,
	    temporaryValue,
	    randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			fileColors: __WEBPACK_IMPORTED_MODULE_0__data_colors_one_js__["a" /* fileColors */],
			size: 1,
			random0: Math.floor(Math.random() * 10 + 1),
			random1: Math.floor(Math.random() * 10 + 1)
		};
	},
	methods: {
		shuffle() {
			console.log('shuffle222222');
			this.random0 = Math.floor(Math.random() * 10 + 1);
			this.random1 = Math.floor(Math.random() * 10 + 1);
		}
	},
	computed: {
		fileColorShuffled() {
			const sample = shuffleArray(__WEBPACK_IMPORTED_MODULE_0__data_colors_one_js__["a" /* fileColors */]).slice(0, 100);
			// localStorage.haxrandom = localStorage.haxrandom !== undefined ? false : localStorage.haxrandom
			if (this.random0 < 4) {
				return sample;
			} else {
				sample.sort(function (a, b) {
					return parseFloat(a.colors.hls[0]) - parseFloat(b.colors.hls[0]);
				});
				if (this.random1 > 2) sample.reverse();
				return sample;
			}
		}
	}
});

// const galleryEl = document.querySelector('#gallery');
// const images = indexString.split("\n");
// const html = shuffle(images).map(imgPath => `<img src="../data/img/${imgPath.trim()}">`)
// galleryEl.innerHTML = html.join('');

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vuex_store__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_index_vue__ = __webpack_require__(14);
/* eslint no-new: "off" */





function isMobile() {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  const x = w.innerWidth || e.clientWidth || g.clientWidth;
  const y = w.innerHeight || e.clientHeight || g.clientHeight;
  return x < y * 0.75;
}

new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
  el: '#app',
  render: h => h(__WEBPACK_IMPORTED_MODULE_2__components_index_vue__["a" /* default */]),
  store: __WEBPACK_IMPORTED_MODULE_1__vuex_store__["a" /* store */]
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(12);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(5)))

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(6);
/* eslint-disable no-multiple-empty-lines */




__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */]);

function initModule(state, moduleName, module, savedState, commit) {
  if (savedState) commit('recoverState', { [moduleName]: savedState });
  // addPresistMutations(moduleName, module.presistMutation);
  Object.assign(presistMutation, Object.entries(module.presistMutation).reduce((acc, [mutation, presistStates]) => Object.assign(acc, {
    [mutation]: presistStates.map(statePath => `${moduleName}.${statePath}`)
  }), {}));
  commit('setLoadedModules', moduleName);
}

const store = new __WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */].Store({
  mutations: {},
  getters: {},
  // The state of the submodules also needs to be initialize since it's not possible
  // to bind to changes in modules
  state: {},
  actions: {},
  plugins: [
    // vstore => {
    //   vstore.subscribe((mutation, state) => {
    //     const presistStates =
    //       mutation.type === 'loadBackup'
    //         ? [
    //             ...new Set(
    //               Object.values(presistMutation).reduce((acc, item) => [...acc, ...item], [])
    //             ),
    //           ]
    //         : presistMutation[mutation.type];

    //     if (presistStates === undefined) return;

    //     presistStates.forEach(stateName => {
    //       indexDB
    //         .writeStore(stateName, getDotPath(state, stateName))
    //         .then()
    //         .catch(error => vstore.commit('error', `IndexDB Error ${error}`));
    //     });
    //   });
    // },
  ]
});
/* harmony export (immutable) */ __webpack_exports__["a"] = store;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(7);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_47323bf2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(28);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(15)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_47323bf2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-47323bf2", Component.options)
  } else {
    hotAPI.reload("data-v-47323bf2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("c26e34e4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-47323bf2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js?indentedSyntax!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./index.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-47323bf2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js?indentedSyntax!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n@font-face {\n  font-family: 'Abel';\n  src: url(" + __webpack_require__(17) + ");\n  font-weight: 400;\n  font-style: normal;\n}\n* {\n  box-sizing: border-box;\n}\nh1, h2 {\n  font-weight: 400;\n}\nh1 {\n  font-size: 4em;\n}\nh2 {\n  font-size: 3em;\n}\nbody {\n  font-family: 'Abel', sans-serif;\n  color: #303641;\n  margin: 0;\n}\nbody a {\n    color: #303641;\n}\nbody a:visited {\n      color: #303641;\n}\nbody input:focus {\n    outline: 0;\n}\nbody ::-webkit-scrollbar {\n    width: 0.54rem;\n}\nbody ::-webkit-scrollbar-track {\n    background: #EFF1F7;\n}\nbody ::-webkit-scrollbar-thumb {\n    background: #A8ADB7;\n}\n.web-app {\n  padding-top: 3em;\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n}\n.spacer {\n  height: 2em;\n}\n.logo {\n  width: 10em;\n}\n", "", {"version":3,"sources":["/home/select/Dev/haxorpoda/haxorpoda.github.io/src/components/index.vue"],"names":[],"mappings":";AAAA;EACE,oBAAoB;EACpB,mCAAsC;EACtC,iBAAiB;EACjB,mBAAmB;CAAE;AAEvB;EACE,uBAAuB;CAAE;AAE3B;EACE,iBAAiB;CAAE;AAErB;EACE,eAAe;CAAE;AAEnB;EACE,eAAe;CAAE;AAEnB;EACE,gCAAgC;EAChC,eAAe;EACf,UAAU;CAAE;AACZ;IACE,eAAe;CAAE;AACjB;MACE,eAAe;CAAE;AACrB;IACE,WAAW;CAAE;AACf;IACE,eAAe;CAAE;AACnB;IACE,oBAAoB;CAAE;AACxB;IACE,oBAAoB;CAAE;AAE1B;EACE,iBAAiB;EACjB,cAAc;EACd,oBAAoB;EACpB,uBAAuB;CAAE;AAE3B;EACE,YAAY;CAAE;AAEhB;EACE,YAAY;CAAE","file":"index.vue","sourcesContent":["@font-face {\n  font-family: 'Abel';\n  src: url(\"../fonts/abel-regular.ttf\");\n  font-weight: 400;\n  font-style: normal; }\n\n* {\n  box-sizing: border-box; }\n\nh1, h2 {\n  font-weight: 400; }\n\nh1 {\n  font-size: 4em; }\n\nh2 {\n  font-size: 3em; }\n\nbody {\n  font-family: 'Abel', sans-serif;\n  color: #303641;\n  margin: 0; }\n  body a {\n    color: #303641; }\n    body a:visited {\n      color: #303641; }\n  body input:focus {\n    outline: 0; }\n  body ::-webkit-scrollbar {\n    width: 0.54rem; }\n  body ::-webkit-scrollbar-track {\n    background: #EFF1F7; }\n  body ::-webkit-scrollbar-thumb {\n    background: #A8ADB7; }\n\n.web-app {\n  padding-top: 3em;\n  display: flex;\n  align-items: center;\n  flex-direction: column; }\n\n.spacer {\n  height: 2em; }\n\n.logo {\n  width: 10em; }\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "data:font/ttf;base64,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/2QAFAAX/+wAFAAZ/98AFAAc/98AFQAY/9sAFQAZ/+cAFQAa/+wAFQAc/+cAFgAP/8cAFgAR/8cAFgAT/+wAFgAW/+wAFgAY/+wAFgAZ/9cAFgAa/9cAFgAb/+wAFgAc/9cAFwAT/+wAFwAW/+wAFwAY/+wAFwAa/9cAFwAc/9cAGAAP/8cAGAAR/8cAGAAT/+wAGAAW/+wAGAAY/+wAGAAZ/9cAGAAa/9cAGAAb/+wAGAAc/9cAGQAP/9sAGQAR/9sAGQAa/+wAGwAP/8cAGwAR/8cAGwAS/+cAGwAT/+wAGwAW/+wAGwAY/+wAGwAZ/9cAGwAa/9cAGwAb/+wAGwAc/9cAHAAP/9sAHAAR/9sAHAAZ/+wAHAAa/+wAJAAF/4EAJAAK/5EAJAAi/9cAJAA3/8MAJAA5/9cAJAA6/9cAJAA8/5oAJACe/6oAJADa/6oAJgAP/9sAJgAR/9sAJgA8/+wAJgCe/+wAJgDa/+wAJwAP/74AJwAR/74AJwAS/+cAJwA8/9cAJwBM/9cAJwCe/9cAJwDa/9cAKABX/9cAKQAP/lYAKQAR/lYAKQAS/4UAKQAk/9MAKQCB/9MAKQCC/9MAKQCD/9MAKQCE/9MAKQCF/9MAKQCG/9MAKgAP/9sAKgAR/9sAKgA8/+wAKgBM/+wAKgCe/+wAKgDa/+wAKwAP/9cAKwAR/9cAKwBE/+wAKwBI/+wAKwBM/8sAKwBS/+wAKwBY/+wAKwCh/+wAKwCi/+wAKwCj/+wAKwCk/+wAKwCl/+wAKwCm/+wAKwCn/+wAKwCp/+wAKwCq/+wAKwCr/+wAKwCs/+wAKwCz/+wAKwC0/+wAKwC1/+wAKwC2/+wAKwC3/+wAKwC6/+wAKwC7/+wAKwC8/+wAKwC9/+wALABM/9MALABO/8sALABP/8sALQAP/9sALQAR/9sALwAF/vYALwAK/wYALwAi/9sALwA3/8sALwA5/8cALwA6/9MALwA8/48ALwCe/48ALwDa/48AMAAE/+wAMAAP/9cAMAAR/9cAMABE/+wAMABG/+wAMABH/+wAMABI/+wAMABM/8sAMABR/+wAMABS/+wAMABY/+wAMACh/+wAMACi/+wAMACj/+wAMACk/+wAMACl/+wAMACm/+wAMACn/+wAMACp/+wAMACq/+wAMACr/+wAMACs/+wAMACz/+wAMAC0/+wAMAC1/+wAMAC2/+wAMAC3/+wAMAC6/+wAMAC7/+wAMAC8/+wAMAC9/+wAMQAP/9cAMQAR/9cAMQBE/+wAMQBI/+wAMQBM/8sAMQBS/+wAMQBY/+wAMQCh/+wAMQCi/+wAMQCj/+wAMQCk/+wAMQCl/+wAMQCm/+wAMQCn/+wAMQCp/+wAMQCq/+wAMQCr/+wAMQCs/+wAMQCz/+wAMQC0/+wAMQC1/+wAMQC2/+wAMQC3/+wAMQC6/+wAMQC7/+wAMQC8/+wAMQC9/+wAMgAP/8cAMgAR/8cAMgAS/+cAMgA8/9cAMgBM/9cAMgBO/9cAMgBP/9cAMgCe/9cAMgDa/9cAMwAP/lYAMwAR/lYAMwAS/6oAMwCe/+wAMwDa/+wANAAP/8cANAAR/8cANAAS/+cANAA8/9cANABM/9cANABO/9cANABP/9cANACe/9cANADa/9cANQA8/9cANQCe/9cANQDa/9cANgAP/9sANgAR/9sANgA8/9cANgBM/+wANgBO/+wANgBP/+wANgCe/9cANgDa/9cANwAP/1gANwAQ/7oANwAR/1gANwAS/40ANwAd/64ANwAe/64ANwAk/8MANwAt/zMANwBE/6IANwBI/64ANwBQ/8MANwBS/64ANwBV/8MANwBW/54ANwBY/8MANwBa/64ANwBd/9sANwCB/8MANwCC/8MANwCD/8MANwCE/8MANwCF/8MANwCG/8MANwCh/6IANwCi/6IANwCj/6IANwCk/6IANwCl/6IANwCm/6IANwCn/6IANwCp/64ANwCq/64ANwCr/64ANwCs/64ANwCz/64ANwC0/64ANwC1/64ANwC2/64ANwC3/64ANwC6/8MANwC7/8MANwC8/8MANwC9/8MANwDH/zMAOAAP/8cAOAAR/8cAOAAS/+cAOABM/98AOQAP/1QAOQAR/1QAOQAS/30AOQAk/9cAOQBE/98AOQBI/+cAOQBS/+cAOQCB/9cAOQCC/9cAOQCD/9cAOQCE/9cAOQCF/9cAOQCG/9cAOQCh/98AOQCi/98AOQCj/98AOQCk/98AOQCl/98AOQCm/98AOQCn/98AOQCp/+cAOQCq/+cAOQCr/+cAOQCs/+cAOQCz/+cAOQC0/+cAOQC1/+cAOQC2/+cAOQC3/+cAOgAP/1wAOgAR/1wAOgAS/4kAOgAk/9cAOgBE/9sAOgBH/+MAOgBI/+MAOgBS/+MAOgCB/9cAOgCC/9cAOgCD/9cAOgCE/9cAOgCF/9cAOgCG/9cAOgCh/9sAOgCi/9sAOgCj/9sAOgCk/9sAOgCl/9sAOgCm/9sAOgCn/9sAOgCp/+MAOgCq/+MAOgCr/+MAOgCs/+MAOgCz/+MAOgC0/+MAOgC1/+MAOgC2/+MAOgC3/+MAOgDE/+wAPAAk/5oAPABE/64APABI/64APABS/64APABY/8MAPACB/5oAPACC/5oAPACD/5oAPACE/5oAPACF/5oAPACG/5oAPACh/64APACi/64APACj/64APACk/64APACl/64APACm/64APACn/64APACp/64APACq/64APACr/64APACs/64APACz/64APAC0/64APAC1/64APAC2/64APAC3/64APAC6/8MAPAC7/8MAPAC8/8MAPAC9/8MARAAi/3EARQAP/+wARQAR/+wARQAi/20ARQBP/+wARgAP/+wARgAR/+wARgAi/20ARgBO/+wARgBP/+wASAAP/+wASAAR/+wASAAi/20ASQAP/8cASQAR/8cASgAi/7YASwAi/3EATAAP/9sATAAR/9sATAAd/9sATAAe/9sATQAP/9sATQAR/9sATQAd/9sATQAe/9sATQAi/+cATgAi/98ATwAE/+wATwAP/9cATwAR/9cATwAd/9cATwAe/9cATwBS/+wATwCz/+wATwC0/+wATwC1/+wATwC2/+wATwC3/+wAUAAi/3EAUQAi/3EAUgAP/+wAUgAR/+wAUgAi/20AUwAP/+wAUwAR/+wAUwAi/20AVAAi/40AVQAP/4UAVQAR/4UAVQAS/64AVQAi/+cAVgAi/2QAVwAi/7oAWAAi/40AWgAP/5EAWgAR/5EAWgAS/7YAWwAi/7YAXQAi/7YAZAAa/+wAZQAT/+wAZQAU/9sAZQAW/+wAZQAX/5oAZQAY/8cAZQAZ/9cAZQAa/9sAZQAb/+wAZQAc/9cAbABM/98AbABP/9cAgQAF/4EAgQAK/5EAgQAi/9cAgQA3/8MAgQA5/9cAgQA6/9cAgQA8/5oAgQCe/6oAgQDa/6oAggAF/4EAggAK/5EAggAi/9cAggA3/8MAggA5/9cAggA6/9cAggA8/5oAggCe/6oAggDa/6oAgwAF/4EAgwAK/5EAgwAi/9cAgwA3/8MAgwA5/9cAgwA6/9cAgwA8/5oAgwCe/6oAgwDa/6oAhAAF/4EAhAAK/5EAhAAi/9cAhAA3/8MAhAA5/9cAhAA6/9cAhAA8/5oAhACe/6oAhADa/6oAhQAF/4EAhQAK/5EAhQAi/9cAhQA3/8MAhQA5/9cAhQA6/9cAhQA8/5oAhQCe/6oAhQDa/6oAhgAF/4EAhgAK/5EAhgAi/9cAhgA3/8MAhgA5/9cAhgA6/9cAhgA8/5oAhgCe/6oAhgDa/6oAiAAP/9sAiAAR/9sAiAA8/+wAiACe/+wAiADa/+wAiQBX/9cAigBX/9cAiwBX/9cAjABX/9cAkwAP/8cAkwAR/8cAkwAS/+cAkwA8/9cAkwBM/9cAkwBO/9cAkwBP/9cAkwCe/9cAkwDa/9cAlAAP/8cAlAAR/8cAlAAS/+cAlAA8/9cAlABM/9cAlABO/9cAlABP/9cAlACe/9cAlADa/9cAlQAP/8cAlQAR/8cAlQAS/+cAlQA8/9cAlQBM/9cAlQBO/9cAlQBP/9cAlQCe/9cAlQDa/9cAlgAP/8cAlgAR/8cAlgAS/+cAlgA8/9cAlgBM/9cAlgBO/9cAlgBP/9cAlgCe/9cAlgDa/9cAlwAP/8cAlwAR/8cAlwAS/+cAlwA8/9cAlwBM/9cAlwBO/9cAlwBP/9cAlwCe/9cAlwDa/9cAmgAP/8cAmgAR/8cAmgAS/+cAmgBM/98AmwAP/8cAmwAR/8cAmwAS/+cAmwBM/98AnAAP/8cAnAAR/8cAnAAS/+cAnABM/98AnQAP/8cAnQAR/8cAnQAS/+cAnQBM/98AngBE/64AngBI/64AngBS/64AngBY/8MAngCh/64AngCi/64AngCj/64AngCk/64AngCl/64AngCm/64AngCn/64AngCp/64AngCq/64AngCr/64AngCs/64AngCz/64AngC0/64AngC1/64AngC2/64AngC3/64AngC6/8MAngC7/8MAngC8/8MAngC9/8MAoQAi/3EAogAi/3EAowAi/3EApAAi/3EApQAi/3EApgAi/3EApwAi/3EAqQAP/+wAqQAR/+wAqQAi/20AqgAP/+wAqgAR/+wAqgAi/20AqwAP/+wAqwAR/+wAqwAi/20ArAAP/+wArAAR/+wArAAi/20AswAP/+wAswAR/+wAswAi/20AtAAP/+wAtAAR/+wAtAAi/20AtQAP/+wAtQAR/+wAtQAi/20AtgAP/+wAtgAR/+wAtgAi/20AtwAP/+wAtwAR/+wAtwAi/20AugAi/40AuwAi/40AvAAi/40AvQAi/40AxwAP/9sAxwAR/9sA2gBE/64A2gBI/64A2gBS/64A2gBY/8MA2gCh/64A2gCi/64A2gCj/64A2gCk/64A2gCl/64A2gCm/64A2gCn/64A2gCp/64A2gCq/64A2gCr/64A2gCs/64A2gCz/64A2gC0/64A2gC1/64A2gC2/64A2gC3/64A2gC6/8MA2gC7/8MA2gC8/8MA2gC9/8MA3QAP/8cA3QAR/8cA6gBW/5YA8QAU/4kA8QAW/64A8QAX/8sA8QAZ/+wA8QAa/+wA8QAb/98A8QAc/9cAAAAAABwBVgABAAAAAAAAAHMAAAABAAAAAAABAAQAcwABAAAAAAACAAcAdwABAAAAAAADABcAfgABAAAAAAAEAAwAlQABAAAAAAAFAA0AoQABAAAAAAAGAAwArgABAAAAAAAHACcAugABAAAAAAAIAA8A4QABAAAAAAAJAA8A4QABAAAAAAALABYA8AABAAAAAAAMABYA8AABAAAAAAANAJABBgABAAAAAAAOABoBlgADAAEECQAAAOYBsAADAAEECQABAAgClgADAAEECQACAA4CngADAAEECQADAC4CrAADAAEECQAEABgC2gADAAEECQAFABoC8gADAAEECQAGABgDDAADAAEECQAHAE4DJAADAAEECQAIAB4DcgADAAEECQAJAB4DcgADAAEECQALACwDkAADAAEECQAMACwDkAADAAEECQANASADvAADAAEECQAOADQE3ENvcHlyaWdodCAoYykgMjAxMSwgTWF0dGhldyBEZXNtb25kIChodHRwOi8vd3d3Lm1hZHR5cGUuY29tIHwgbWF0dGRlc21vbmRAZ21haWwuY29tKSwgd2l0aCBSZXNlcnZlZCBGb250IE5hbWUgQWJlbC5BYmVsUmVndWxhcjEuMDAzO01BRFQ7QWJlbC1SZWd1bGFyQWJlbCBSZWd1bGFyVmVyc2lvbiAxLjAwM0FiZWwtUmVndWxhckFiZWwgaXMgYSB0cmFkZW1hcmsgb2YgTWF0dGhldyBEZXNtb25kLk1hdHRoZXcgRGVzbW9uZGh0dHA6Ly93d3cubWFkdHlwZS5jb21UaGlzIEZvbnQgU29mdHdhcmUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIFNJTCBPcGVuIEZvbnQgTGljZW5zZSwgVmVyc2lvbiAxLjEuIFRoaXMgbGljZW5zZSBpcyBhdmFpbGFibGUgd2l0aCBhIEZBUSBhdDogaHR0cDovL3NjcmlwdHMuc2lsLm9yZy9PRkxodHRwOi8vc2NyaXB0cy5zaWwub3JnL09GTABDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEAMQAsACAATQBhAHQAdABoAGUAdwAgAEQAZQBzAG0AbwBuAGQAIAAoAGgAdAB0AHAAOgAvAC8AdwB3AHcALgBtAGEAZAB0AHkAcABlAC4AYwBvAG0AIAB8ACAAbQBhAHQAdABkAGUAcwBtAG8AbgBkAEAAZwBtAGEAaQBsAC4AYwBvAG0AKQAsACAAdwBpAHQAaAAgAFIAZQBzAGUAcgB2AGUAZAAgAEYAbwBuAHQAIABOAGEAbQBlACAAQQBiAGUAbAAuAEEAYgBlAGwAUgBlAGcAdQBsAGEAcgAxAC4AMAAwADMAOwBNAEEARABUADsAQQBiAGUAbAAtAFIAZQBnAHUAbABhAHIAQQBiAGUAbAAgAFIAZQBnAHUAbABhAHIAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAMwBBAGIAZQBsAC0AUgBlAGcAdQBsAGEAcgBBAGIAZQBsACAAaQBzACAAYQAgAHQAcgBhAGQAZQBtAGEAcgBrACAAbwBmACAATQBhAHQAdABoAGUAdwAgAEQAZQBzAG0AbwBuAGQALgBNAGEAdAB0AGgAZQB3ACAARABlAHMAbQBvAG4AZABoAHQAdABwADoALwAvAHcAdwB3AC4AbQBhAGQAdAB5AHAAZQAuAGMAbwBtAFQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAbABpAGMAZQBuAHMAZQBkACAAdQBuAGQAZQByACAAdABoAGUAIABTAEkATAAgAE8AcABlAG4AIABGAG8AbgB0ACAATABpAGMAZQBuAHMAZQAsACAAVgBlAHIAcwBpAG8AbgAgADEALgAxAC4AIABUAGgAaQBzACAAbABpAGMAZQBuAHMAZQAgAGkAcwAgAGEAdgBhAGkAbABhAGIAbABlACAAdwBpAHQAaAAgAGEAIABGAEEAUQAgAGEAdAA6ACAAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAGgAdAB0AHAAOgAvAC8AcwBjAHIAaQBwAHQAcwAuAHMAaQBsAC4AbwByAGcALwBPAEYATAAAAAIAAAAAAAD+jwBSAAAAAAAAAAAAAAAAAAAAAAAAAAABAwAAAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEBAgCjAIQAhQC9AJYA6ACGAI4AiwCdAKkApACKANoAgwCTAPIA8wCNAJcAiADDAN4A8QCeAKoA9QD0APYAogCtAMkAxwCuAGIAYwCQAGQAywBlAMgAygDPAMwAzQDOAOkAZgDTANAA0QCvAGcA8ACRANYA1ADVAGgA6wDtAIkAagBpAGsAbQBsAG4AoABvAHEAcAByAHMAdQB0AHYAdwDqAHgAegB5AHsAfQB8ALgAoQB/AH4AgACBAOwA7gC6AQMBBAEFANcBBgEHAQgBCQEKAQsBDAENAOIA4wEOAQ8AsACxARABEQESARMBFADkAOUAuwDmAOcApgDYAOEA2wDcAN0A4ADZAN8BFQCyALMAtgC3AMQAtAC1AMUAggDCAIcAqwC+AL8AvAEWAIwA7wEXARgBGQEaARsBHAEdAR4BHwEgB3VuaTAwQTAEaGJhcgZJdGlsZGUGaXRpbGRlAklKAmlqC0pjaXJjdW1mbGV4C2pjaXJjdW1mbGV4DGtjb21tYWFjY2VudAxrZ3JlZW5sYW5kaWMKTGRvdGFjY2VudARsZG90Bk5hY3V0ZQZuYWN1dGUGUmFjdXRlDFJjb21tYWFjY2VudAxyY29tbWFhY2NlbnQGUmNhcm9uBnJjYXJvbgxkb3RhY2NlbnRjbWIERXVybwhkb3RsZXNzagtjb21tYWFjY2VudAtmb3VuZHJ5aWNvbglncmF2ZS5jYXAJYWN1dGUuY2FwCWNhcm9uLmNhcA5jaXJjdW1mbGV4LmNhcAhyaW5nLmNhcAxkaWVyZXNpcy5jYXAJdGlsZGUuY2FwAAEAAf//AA8AAAABAAAAAMmJbzEAAAAAyldKhAAAAADKWQTQ"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_treemap_vue__ = __webpack_require__(8);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f7f001e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_treemap_vue__ = __webpack_require__(22);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(20)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_treemap_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f7f001e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_treemap_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/treemap.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1f7f001e", Component.options)
  } else {
    hotAPI.reload("data-v-1f7f001e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("da50298a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1f7f001e\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./treemap.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1f7f001e\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./treemap.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\nhtml, body{\n    width: 100%;\n    height: 100%;\n    padding: 0px;\n    margin: 0px;\n}\n#graph {\n    width: 100%;\n    height: 100%;\n}\n.node {\n    position: absolute;\n    background-size:cover;\n}\n\n", "", {"version":3,"sources":["/home/select/Dev/haxorpoda/haxorpoda.github.io/src/components/src/components/treemap.vue?b6ab1900"],"names":[],"mappings":";AA6FA;IACA,YAAA;IACA,aAAA;IACA,aAAA;IACA,YAAA;CACA;AACA;IACA,YAAA;IACA,aAAA;CAEA;AACA;IACA,mBAAA;IACA,sBAAA;CACA","file":"treemap.vue","sourcesContent":["<template>\n    <div>\n        <div id=\"graph\"></div>\n        <div id=\"gallery\"></div>\n        <!-- <script src=\"//cdnjs.cloudflare.com/ajax/libs/d3/4.1.1/d3.min.js\"></script> -->\n    </div>\n</template>\n\n<script>\n// import { indexString } from '../data/index.images.js'\n\nexport default {\n  // computed: mapState([]),\n};\n    // const data = [\n    //     {id:\"root\",value:null},\n    //     ...indexString.split(\"\\n\").map((imgPath, idx) => ({\n    //         id:`root.${idx}`,\n    //         value: null,\n    //         img:`../data/img/${imgPath.trim()}`,\n    //     }))\n    // ];\n    // const galleryEl = document.querySelector('#gallery');\n    // const images = indexString.split(\"\\n\");\n    // const html = images.map(imgPath => `<img src=\"../data/img/${imgPath.trim()}\">`)\n    // galleryEl.innerHTML = html.join('');\n\n    // var width = document.querySelector(\"#graph\").clientWidth\n    // var height = document.querySelector(\"#graph\").clientHeight\n    // var div = d3.select(\"#graph\").append(\"div\").attr(\"width\", width).attr(\"height\", height)\n\n\n    // setInterval(draw, 20000)\n    // setTimeout(() => {\n    //     draw()\n    // },6000)\n\n\n    function draw() {\n\n        randomize()\n\n        var stratify = d3.stratify()\n            .parentId(function(d) {return d.id.substring(0, d.id.lastIndexOf(\".\")); });\n\n        var root = stratify(data).sum(function(d) {\n            console.log(\"d.img\", d.value, d.img);\n            const img = document.querySelector(`img[src=\"${d.img}\"]`);\n            // console.log(\"img.clientWidth*img.clientHeight\", (img.clientWidth*img.clientHeight)/100000);\n            if (img) return (img.clientWidth*img.clientHeight)/100000;\n            return 0;\n            // return d.value\n        })\n\n        var treemap = d3.treemap()\n            .tile(d3.treemapBinary)\n            .size([width, height])\n            .padding(1)\n            .round(true);\n\n        treemap(root)\n        drawTreemap(root)\n\n    }\n\n    function randomize() {\n        data.filter(function(d){ return d.id !== \"root\"})\n            .forEach(function(d){\n                d.value = ~~(d3.randomUniform(1, 10)())\n            })\n    }\n\n\n    function drawTreemap(root) {\n\n        var node = div.selectAll(\".node\").data(root.children)\n\n        var newNode = node.enter()\n           .append(\"div\").attr(\"class\", \"node\")\n\n        node.merge(newNode)\n            .transition()\n            .duration(1000)\n            .style(\"left\", function(d) { return d.x0 + \"px\" })\n            .style(\"top\", function(d) { return d.y0 + \"px\" })\n            .style(\"width\", function(d) { return (d.x1 - d.x0) + \"px\" })\n            .style(\"height\", function(d) { return (d.y1 - d.y0) + \"px\"})\n            .style(\"background-image\", function(d){ return \"url(\"+d.data.img+\")\"})\n    }\n\n</script>\n\n<style>\nhtml, body{\n    width: 100%;\n    height: 100%;\n    padding: 0px;\n    margin: 0px;\n}\n#graph {\n    width: 100%;\n    height: 100%;\n\n}\n.node {\n    position: absolute;\n    background-size:cover;\n}\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", [
      _c("div", { attrs: { id: "graph" } }),
      _vm._v(" "),
      _c("div", { attrs: { id: "gallery" } })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1f7f001e", esExports)
  }
}

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_masonary_grid_vue__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_957518ac_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_masonary_grid_vue__ = __webpack_require__(27);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(24)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_masonary_grid_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_957518ac_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_masonary_grid_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/masonary.grid.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-957518ac", Component.options)
  } else {
    hotAPI.reload("data-v-957518ac", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("35770b10", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-957518ac\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js?indentedSyntax!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./masonary.grid.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-957518ac\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js?indentedSyntax!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./masonary.grid.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\nhtml, body {\n  padding: 0;\n  margin: 0;\n}\nh1 {\n  text-align: center;\n}\n#gallery {\n  padding: 0 10em;\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n#gallery > div {\n    width: 10em;\n    height: 20em;\n    background-position: center;\n    background-size: contain;\n    background-repeat: no-repeat;\n    margin: 5em;\n}\n@media (max-width: 600px) {\n#gallery {\n    padding: 0;\n}\n}\n.controls {\n  position: fixed;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  top: 1em;\n  right: 1em;\n  color: #ccc;\n}\n.controls .size {\n    opacity: 0.4;\n    margin-bottom: 1em;\n}\n.controls .shuffle {\n    border: 1px solid #ccc;\n    border-radius: 3px;\n    width: 2em;\n    height: 2em;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n}\n", "", {"version":3,"sources":["/home/select/Dev/haxorpoda/haxorpoda.github.io/src/components/masonary.grid.vue"],"names":[],"mappings":";AAAA;EACE,WAAW;EACX,UAAU;CAAE;AAEd;EACE,mBAAmB;CAAE;AAEvB;EACE,gBAAgB;EAChB,YAAY;EACZ,cAAc;EACd,gBAAgB;EAChB,wBAAwB;CAAE;AAC1B;IACE,YAAY;IACZ,aAAa;IACb,4BAA4B;IAC5B,yBAAyB;IACzB,6BAA6B;IAC7B,YAAY;CAAE;AAElB;AACE;IACE,WAAW;CAAE;CAAE;AAEnB;EACE,gBAAgB;EAChB,cAAc;EACd,uBAAuB;EACvB,sBAAsB;EACtB,SAAS;EACT,WAAW;EACX,YAAY;CAAE;AACd;IACE,aAAa;IACb,mBAAmB;CAAE;AACvB;IACE,uBAAuB;IACvB,mBAAmB;IACnB,WAAW;IACX,YAAY;IACZ,cAAc;IACd,wBAAwB;IACxB,oBAAoB;IACpB,gBAAgB;CAAE","file":"masonary.grid.vue","sourcesContent":["html, body {\n  padding: 0;\n  margin: 0; }\n\nh1 {\n  text-align: center; }\n\n#gallery {\n  padding: 0 10em;\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center; }\n  #gallery > div {\n    width: 10em;\n    height: 20em;\n    background-position: center;\n    background-size: contain;\n    background-repeat: no-repeat;\n    margin: 5em; }\n\n@media (max-width: 600px) {\n  #gallery {\n    padding: 0; } }\n\n.controls {\n  position: fixed;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  top: 1em;\n  right: 1em;\n  color: #ccc; }\n  .controls .size {\n    opacity: 0.4;\n    margin-bottom: 1em; }\n  .controls .shuffle {\n    border: 1px solid #ccc;\n    border-radius: 3px;\n    width: 2em;\n    height: 2em;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer; }\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const fileColors = [{
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.100.jpg",
  "colors": {
    "hex": "#a1a396",
    "hls": [0.1923076923076923, 0.611328125, 0.06532663316582915]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.101.jpg",
  "colors": {
    "hex": "#9e9c8f",
    "hls": [0.14444444444444446, 0.587890625, 0.07109004739336493]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.102.jpg",
  "colors": {
    "hex": "#99958d",
    "hls": [0.11111111111111112, 0.57421875, 0.05504587155963303]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.103.jpg",
  "colors": {
    "hex": "#a29e96",
    "hls": [0.11111111111111112, 0.609375, 0.06]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.104.jpg",
  "colors": {
    "hex": "#938e82",
    "hls": [0.1176470588235294, 0.541015625, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.105.jpg",
  "colors": {
    "hex": "#868279",
    "hls": [0.11538461538461538, 0.498046875, 0.050980392156862744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.106.jpg",
  "colors": {
    "hex": "#8c887f",
    "hls": [0.11538461538461538, 0.521484375, 0.053061224489795916]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.107.jpg",
  "colors": {
    "hex": "#98968d",
    "hls": [0.13636363636363635, 0.572265625, 0.0502283105022831]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.108.jpg",
  "colors": {
    "hex": "#8c927d",
    "hls": [0.21428571428571427, 0.529296875, 0.08713692946058091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.109.jpg",
  "colors": {
    "hex": "#929780",
    "hls": [0.2028985507246377, 0.544921875, 0.09871244635193133]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.11.jpg",
  "colors": {
    "hex": "#9c9a88",
    "hls": [0.15, 0.5703125, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.110.jpg",
  "colors": {
    "hex": "#979d89",
    "hls": [0.21666666666666665, 0.57421875, 0.09174311926605505]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.111.jpg",
  "colors": {
    "hex": "#939a84",
    "hls": [0.21969696969696972, 0.55859375, 0.09734513274336283]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.112.jpg",
  "colors": {
    "hex": "#8f8a7f",
    "hls": [0.11458333333333333, 0.52734375, 0.06611570247933884]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.113.jpg",
  "colors": {
    "hex": "#948e83",
    "hls": [0.10784313725490195, 0.544921875, 0.07296137339055794]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.114.jpg",
  "colors": {
    "hex": "#918a7f",
    "hls": [0.10185185185185186, 0.53125, 0.075]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.115.jpg",
  "colors": {
    "hex": "#928d7f",
    "hls": [0.12280701754385966, 0.533203125, 0.0794979079497908]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.116.jpg",
  "colors": {
    "hex": "#8c867c",
    "hls": [0.10416666666666667, 0.515625, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.117.jpg",
  "colors": {
    "hex": "#aaa496",
    "hls": [0.11666666666666665, 0.625, 0.10416666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.118.jpg",
  "colors": {
    "hex": "#9f9888",
    "hls": [0.11594202898550725, 0.576171875, 0.10599078341013825]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.119.jpg",
  "colors": {
    "hex": "#8a867c",
    "hls": [0.11904761904761905, 0.51171875, 0.056]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.12.jpg",
  "colors": {
    "hex": "#b1b2a1",
    "hls": [0.17647058823529407, 0.662109375, 0.09826589595375723]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.120.jpg",
  "colors": {
    "hex": "#95988f",
    "hls": [0.22222222222222224, 0.576171875, 0.041474654377880185]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.121.jpg",
  "colors": {
    "hex": "#979288",
    "hls": [0.11111111111111112, 0.560546875, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.122.jpg",
  "colors": {
    "hex": "#a29c8e",
    "hls": [0.11666666666666665, 0.59375, 0.09615384615384616]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.123.jpg",
  "colors": {
    "hex": "#989384",
    "hls": [0.125, 0.5546875, 0.08771929824561403]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.124.jpg",
  "colors": {
    "hex": "#84837a",
    "hls": [0.15, 0.49609375, 0.03937007874015748]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.125.jpg",
  "colors": {
    "hex": "#9c9686",
    "hls": [0.12121212121212122, 0.56640625, 0.0990990990990991]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.126.jpg",
  "colors": {
    "hex": "#a39f90",
    "hls": [0.13157894736842105, 0.599609375, 0.09268292682926829]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.127.jpg",
  "colors": {
    "hex": "#969c8b",
    "hls": [0.22549019607843138, 0.576171875, 0.07834101382488479]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.128.jpg",
  "colors": {
    "hex": "#959586",
    "hls": [0.16666666666666666, 0.552734375, 0.06550218340611354]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.129.jpg",
  "colors": {
    "hex": "#949480",
    "hls": [0.16666666666666666, 0.5390625, 0.0847457627118644]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.13.jpg",
  "colors": {
    "hex": "#888780",
    "hls": [0.14583333333333334, 0.515625, 0.03225806451612903]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.130.jpg",
  "colors": {
    "hex": "#a1a69b",
    "hls": [0.24242424242424243, 0.626953125, 0.05759162303664921]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.132.jpg",
  "colors": {
    "hex": "#8f9180",
    "hls": [0.18627450980392157, 0.533203125, 0.07112970711297072]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.133.jpg",
  "colors": {
    "hex": "#a5a893",
    "hls": [0.19047619047619047, 0.615234375, 0.1065989847715736]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.134.jpg",
  "colors": {
    "hex": "#9b9c8c",
    "hls": [0.17708333333333334, 0.578125, 0.07407407407407407]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.135.jpg",
  "colors": {
    "hex": "#949a87",
    "hls": [0.2192982456140351, 0.564453125, 0.08520179372197309]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.136.jpg",
  "colors": {
    "hex": "#9c9e8b",
    "hls": [0.18421052631578946, 0.580078125, 0.08837209302325581]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.137.jpg",
  "colors": {
    "hex": "#8e9281",
    "hls": [0.2058823529411765, 0.537109375, 0.07172995780590717]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.14.jpg",
  "colors": {
    "hex": "#8e8f87",
    "hls": [0.1875, 0.54296875, 0.03418803418803419]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.15.jpg",
  "colors": {
    "hex": "#817d73",
    "hls": [0.11904761904761905, 0.4765625, 0.05737704918032787]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.16.jpg",
  "colors": {
    "hex": "#928e80",
    "hls": [0.12962962962962962, 0.53515625, 0.07563025210084033]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.17.jpg",
  "colors": {
    "hex": "#807b70",
    "hls": [0.11458333333333333, 0.46875, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.18.jpg",
  "colors": {
    "hex": "#7d7a6f",
    "hls": [0.13095238095238096, 0.4609375, 0.059322033898305086]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.19.jpg",
  "colors": {
    "hex": "#87847b",
    "hls": [0.125, 0.50390625, 0.047244094488188976]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.2.jpg",
  "colors": {
    "hex": "#9f9d8d",
    "hls": [0.14814814814814814, 0.5859375, 0.08490566037735849]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.20.jpg",
  "colors": {
    "hex": "#8c8d84",
    "hls": [0.1851851851851852, 0.533203125, 0.03765690376569038]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.21.jpg",
  "colors": {
    "hex": "#8d8a80",
    "hls": [0.1282051282051282, 0.525390625, 0.053497942386831275]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.23.jpg",
  "colors": {
    "hex": "#807e75",
    "hls": [0.13636363636363635, 0.478515625, 0.044897959183673466]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.24.jpg",
  "colors": {
    "hex": "#858075",
    "hls": [0.11458333333333333, 0.48828125, 0.064]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.25.jpg",
  "colors": {
    "hex": "#888579",
    "hls": [0.13333333333333333, 0.501953125, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.26.jpg",
  "colors": {
    "hex": "#898478",
    "hls": [0.1176470588235294, 0.501953125, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.27.jpg",
  "colors": {
    "hex": "#89887b",
    "hls": [0.15476190476190477, 0.5078125, 0.05555555555555555]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.28.jpg",
  "colors": {
    "hex": "#817f74",
    "hls": [0.14102564102564102, 0.478515625, 0.053061224489795916]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.29.jpg",
  "colors": {
    "hex": "#8c887e",
    "hls": [0.11904761904761905, 0.51953125, 0.056910569105691054]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.3.jpg",
  "colors": {
    "hex": "#939288",
    "hls": [0.15151515151515152, 0.552734375, 0.048034934497816595]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.30.jpg",
  "colors": {
    "hex": "#958f83",
    "hls": [0.11111111111111112, 0.546875, 0.07758620689655173]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.31.jpg",
  "colors": {
    "hex": "#8c9179",
    "hls": [0.20138888888888892, 0.51953125, 0.0975609756097561]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.32.jpg",
  "colors": {
    "hex": "#8c8c7e",
    "hls": [0.16666666666666666, 0.51953125, 0.056910569105691054]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.33.jpg",
  "colors": {
    "hex": "#87897d",
    "hls": [0.19444444444444442, 0.51171875, 0.048]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.34.jpg",
  "colors": {
    "hex": "#9a9a8a",
    "hls": [0.16666666666666666, 0.5703125, 0.07272727272727272]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.35.jpg",
  "colors": {
    "hex": "#8c8d7d",
    "hls": [0.17708333333333334, 0.51953125, 0.06504065040650407]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.36.jpg",
  "colors": {
    "hex": "#8e9184",
    "hls": [0.20512820512820515, 0.541015625, 0.05531914893617021]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.37.jpg",
  "colors": {
    "hex": "#979789",
    "hls": [0.16666666666666666, 0.5625, 0.0625]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.38.jpg",
  "colors": {
    "hex": "#8e9382",
    "hls": [0.2156862745098039, 0.541015625, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.39.jpg",
  "colors": {
    "hex": "#979c8f",
    "hls": [0.23076923076923075, 0.583984375, 0.06103286384976526]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.4.jpg",
  "colors": {
    "hex": "#929487",
    "hls": [0.1923076923076923, 0.552734375, 0.056768558951965066]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.40.jpg",
  "colors": {
    "hex": "#9d998c",
    "hls": [0.12745098039215685, 0.580078125, 0.07906976744186046]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.43.jpg",
  "colors": {
    "hex": "#827f75",
    "hls": [0.1282051282051282, 0.482421875, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.44.jpg",
  "colors": {
    "hex": "#8f8d80",
    "hls": [0.14444444444444446, 0.529296875, 0.06224066390041494]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.45.jpg",
  "colors": {
    "hex": "#868378",
    "hls": [0.13095238095238096, 0.49609375, 0.05511811023622047]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.46.jpg",
  "colors": {
    "hex": "#898579",
    "hls": [0.125, 0.50390625, 0.06299212598425197]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.47.jpg",
  "colors": {
    "hex": "#8e8a7f",
    "hls": [0.12222222222222223, 0.525390625, 0.06172839506172839]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.48.jpg",
  "colors": {
    "hex": "#8c8a7b",
    "hls": [0.14705882352941177, 0.513671875, 0.06827309236947791]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.49.jpg",
  "colors": {
    "hex": "#8f9281",
    "hls": [0.196078431372549, 0.537109375, 0.07172995780590717]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.5.jpg",
  "colors": {
    "hex": "#a2a393",
    "hls": [0.17708333333333334, 0.60546875, 0.07920792079207921]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.50.jpg",
  "colors": {
    "hex": "#8d8c7d",
    "hls": [0.15625, 0.51953125, 0.06504065040650407]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.51.jpg",
  "colors": {
    "hex": "#93947f",
    "hls": [0.17460317460317457, 0.537109375, 0.08860759493670886]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.52.jpg",
  "colors": {
    "hex": "#8e8c7d",
    "hls": [0.14705882352941177, 0.521484375, 0.06938775510204082]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.53.jpg",
  "colors": {
    "hex": "#8b9281",
    "hls": [0.2352941176470588, 0.537109375, 0.07172995780590717]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.54.jpg",
  "colors": {
    "hex": "#959383",
    "hls": [0.14814814814814814, 0.546875, 0.07758620689655173]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.55.jpg",
  "colors": {
    "hex": "#747773",
    "hls": [0.2916666666666667, 0.45703125, 0.017094017094017096]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.57.jpg",
  "colors": {
    "hex": "#919088",
    "hls": [0.14814814814814814, 0.548828125, 0.03896103896103896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.58.jpg",
  "colors": {
    "hex": "#9e9d92",
    "hls": [0.15277777777777776, 0.59375, 0.057692307692307696]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.59.jpg",
  "colors": {
    "hex": "#959489",
    "hls": [0.15277777777777776, 0.55859375, 0.05309734513274336]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.61.jpg",
  "colors": {
    "hex": "#95948b",
    "hls": [0.15, 0.5625, 0.044642857142857144]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.62.jpg",
  "colors": {
    "hex": "#9b988e",
    "hls": [0.1282051282051282, 0.580078125, 0.06046511627906977]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.63.jpg",
  "colors": {
    "hex": "#7e7c72",
    "hls": [0.1388888888888889, 0.46875, 0.05]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.65.jpg",
  "colors": {
    "hex": "#87897b",
    "hls": [0.19047619047619047, 0.5078125, 0.05555555555555555]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.66.jpg",
  "colors": {
    "hex": "#959086",
    "hls": [0.11111111111111112, 0.552734375, 0.06550218340611354]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.67.jpg",
  "colors": {
    "hex": "#919084",
    "hls": [0.15384615384615385, 0.541015625, 0.05531914893617021]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.68.jpg",
  "colors": {
    "hex": "#8d8b81",
    "hls": [0.1388888888888889, 0.52734375, 0.049586776859504134]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.73.jpg",
  "colors": {
    "hex": "#959285",
    "hls": [0.13541666666666666, 0.55078125, 0.06956521739130435]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.74.jpg",
  "colors": {
    "hex": "#838579",
    "hls": [0.19444444444444442, 0.49609375, 0.047244094488188976]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.75.jpg",
  "colors": {
    "hex": "#939082",
    "hls": [0.1372549019607843, 0.541015625, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.76.jpg",
  "colors": {
    "hex": "#8e8f81",
    "hls": [0.1785714285714286, 0.53125, 0.058333333333333334]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.77.jpg",
  "colors": {
    "hex": "#908d82",
    "hls": [0.13095238095238096, 0.53515625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.78.jpg",
  "colors": {
    "hex": "#8b887a",
    "hls": [0.1372549019607843, 0.509765625, 0.06772908366533864]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.79.jpg",
  "colors": {
    "hex": "#87867a",
    "hls": [0.15384615384615385, 0.501953125, 0.050980392156862744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.8.jpg",
  "colors": {
    "hex": "#aeb0a2",
    "hls": [0.19047619047619047, 0.66015625, 0.08045977011494253]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.82.jpg",
  "colors": {
    "hex": "#959387",
    "hls": [0.14285714285714288, 0.5546875, 0.06140350877192982]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.83.jpg",
  "colors": {
    "hex": "#8b8d82",
    "hls": [0.19696969696969693, 0.529296875, 0.04564315352697095]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.85.jpg",
  "colors": {
    "hex": "#8f8e85",
    "hls": [0.15, 0.5390625, 0.0423728813559322]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.86.jpg",
  "colors": {
    "hex": "#858579",
    "hls": [0.16666666666666666, 0.49609375, 0.047244094488188976]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.9.jpg",
  "colors": {
    "hex": "#acaea5",
    "hls": [0.20370370370370372, 0.662109375, 0.05202312138728324]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.91.jpg",
  "colors": {
    "hex": "#929882",
    "hls": [0.21212121212121207, 0.55078125, 0.09565217391304348]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.92.jpg",
  "colors": {
    "hex": "#8b8f78",
    "hls": [0.19565217391304346, 0.513671875, 0.09236947791164658]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.93.jpg",
  "colors": {
    "hex": "#8a9586",
    "hls": [0.2888888888888889, 0.552734375, 0.06550218340611354]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.94.jpg",
  "colors": {
    "hex": "#9b9c82",
    "hls": [0.17307692307692304, 0.55859375, 0.11504424778761062]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.96.jpg",
  "colors": {
    "hex": "#9c9f86",
    "hls": [0.18666666666666668, 0.572265625, 0.1141552511415525]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.97.jpg",
  "colors": {
    "hex": "#989b84",
    "hls": [0.1884057971014493, 0.560546875, 0.10222222222222223]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.98.jpg",
  "colors": {
    "hex": "#9c9e87",
    "hls": [0.18115942028985507, 0.572265625, 0.1050228310502283]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D004.99.jpg",
  "colors": {
    "hex": "#909781",
    "hls": [0.21969696969696972, 0.546875, 0.09482758620689655]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.10.jpg",
  "colors": {
    "hex": "#a3a68b",
    "hls": [0.1851851851851852, 0.595703125, 0.13043478260869565]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.100.jpg",
  "colors": {
    "hex": "#b1aa98",
    "hls": [0.12, 0.642578125, 0.1366120218579235]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.101.jpg",
  "colors": {
    "hex": "#97938a",
    "hls": [0.11538461538461538, 0.564453125, 0.05829596412556054]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.102.jpg",
  "colors": {
    "hex": "#aea99a",
    "hls": [0.125, 0.640625, 0.10869565217391304]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.103.jpg",
  "colors": {
    "hex": "#aea998",
    "hls": [0.12878787878787878, 0.63671875, 0.11827956989247312]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.104.jpg",
  "colors": {
    "hex": "#9a9589",
    "hls": [0.1176470588235294, 0.568359375, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.105.jpg",
  "colors": {
    "hex": "#959a87",
    "hls": [0.21052631578947367, 0.564453125, 0.08520179372197309]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.106.jpg",
  "colors": {
    "hex": "#96a289",
    "hls": [0.24666666666666667, 0.583984375, 0.11737089201877934]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.107.jpg",
  "colors": {
    "hex": "#989a7d",
    "hls": [0.17816091954022992, 0.544921875, 0.12446351931330472]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.108.jpg",
  "colors": {
    "hex": "#8c8e7a",
    "hls": [0.18333333333333335, 0.515625, 0.08064516129032258]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.109.jpg",
  "colors": {
    "hex": "#9da084",
    "hls": [0.18452380952380953, 0.5703125, 0.12727272727272726]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.11.jpg",
  "colors": {
    "hex": "#909087",
    "hls": [0.16666666666666666, 0.544921875, 0.03862660944206009]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.110.jpg",
  "colors": {
    "hex": "#939b82",
    "hls": [0.21999999999999997, 0.556640625, 0.11013215859030837]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.112.jpg",
  "colors": {
    "hex": "#9fa389",
    "hls": [0.1923076923076923, 0.5859375, 0.12264150943396226]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.113.jpg",
  "colors": {
    "hex": "#8c8f76",
    "hls": [0.18666666666666668, 0.509765625, 0.099601593625498]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.114.jpg",
  "colors": {
    "hex": "#939890",
    "hls": [0.2708333333333333, 0.578125, 0.037037037037037035]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.115.jpg",
  "colors": {
    "hex": "#b0a99b",
    "hls": [0.11111111111111112, 0.646484375, 0.11602209944751381]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.116.jpg",
  "colors": {
    "hex": "#a5a193",
    "hls": [0.12962962962962962, 0.609375, 0.09]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.117.jpg",
  "colors": {
    "hex": "#9b988d",
    "hls": [0.13095238095238096, 0.578125, 0.06481481481481481]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.118.jpg",
  "colors": {
    "hex": "#a19d89",
    "hls": [0.1388888888888889, 0.58203125, 0.11214953271028037]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.119.jpg",
  "colors": {
    "hex": "#99958a",
    "hls": [0.12222222222222223, 0.568359375, 0.06787330316742081]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.12.jpg",
  "colors": {
    "hex": "#9d9b8d",
    "hls": [0.14583333333333334, 0.58203125, 0.07476635514018691]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.120.jpg",
  "colors": {
    "hex": "#8d9084",
    "hls": [0.20833333333333334, 0.5390625, 0.05084745762711865]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.122.jpg",
  "colors": {
    "hex": "#9fa995",
    "hls": [0.25, 0.62109375, 0.10309278350515463]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.123.jpg",
  "colors": {
    "hex": "#a79f8b",
    "hls": [0.11904761904761905, 0.59765625, 0.13592233009708737]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.124.jpg",
  "colors": {
    "hex": "#939e91",
    "hls": [0.3076923076923077, 0.591796875, 0.06220095693779904]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.125.jpg",
  "colors": {
    "hex": "#9ea190",
    "hls": [0.196078431372549, 0.595703125, 0.0821256038647343]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.126.jpg",
  "colors": {
    "hex": "#939084",
    "hls": [0.13333333333333333, 0.544921875, 0.06437768240343347]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.127.jpg",
  "colors": {
    "hex": "#9fa68e",
    "hls": [0.21527777777777776, 0.6015625, 0.11764705882352941]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.128.jpg",
  "colors": {
    "hex": "#9a9482",
    "hls": [0.125, 0.5546875, 0.10526315789473684]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.129.jpg",
  "colors": {
    "hex": "#aca490",
    "hls": [0.11904761904761905, 0.6171875, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.13.jpg",
  "colors": {
    "hex": "#938e7e",
    "hls": [0.12698412698412698, 0.533203125, 0.08786610878661087]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.130.jpg",
  "colors": {
    "hex": "#9ea48b",
    "hls": [0.2066666666666667, 0.591796875, 0.11961722488038277]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.131.jpg",
  "colors": {
    "hex": "#999986",
    "hls": [0.16666666666666666, 0.560546875, 0.08444444444444445]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.132.jpg",
  "colors": {
    "hex": "#a0a087",
    "hls": [0.16666666666666666, 0.576171875, 0.1152073732718894]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.133.jpg",
  "colors": {
    "hex": "#a0ad94",
    "hls": [0.25333333333333335, 0.626953125, 0.13089005235602094]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.134.jpg",
  "colors": {
    "hex": "#9e9980",
    "hls": [0.1388888888888889, 0.55859375, 0.13274336283185842]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.135.jpg",
  "colors": {
    "hex": "#9ca990",
    "hls": [0.25333333333333335, 0.611328125, 0.12562814070351758]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.136.jpg",
  "colors": {
    "hex": "#949884",
    "hls": [0.20000000000000004, 0.5546875, 0.08771929824561403]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.137.jpg",
  "colors": {
    "hex": "#abac8d",
    "hls": [0.17204301075268816, 0.611328125, 0.15577889447236182]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.138.jpg",
  "colors": {
    "hex": "#9b9f82",
    "hls": [0.18965517241379307, 0.564453125, 0.13004484304932734]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.139.jpg",
  "colors": {
    "hex": "#afa999",
    "hls": [0.12121212121212122, 0.640625, 0.11956521739130435]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.14.jpg",
  "colors": {
    "hex": "#9a9484",
    "hls": [0.12121212121212122, 0.55859375, 0.09734513274336283]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.140.jpg",
  "colors": {
    "hex": "#abb09b",
    "hls": [0.20634920634920637, 0.646484375, 0.11602209944751381]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.141.jpg",
  "colors": {
    "hex": "#a8a48f",
    "hls": [0.13999999999999999, 0.607421875, 0.12437810945273632]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.142.jpg",
  "colors": {
    "hex": "#a9a992",
    "hls": [0.16666666666666666, 0.615234375, 0.116751269035533]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.143.jpg",
  "colors": {
    "hex": "#a8a893",
    "hls": [0.16666666666666666, 0.615234375, 0.1065989847715736]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.144.jpg",
  "colors": {
    "hex": "#a6a894",
    "hls": [0.18333333333333335, 0.6171875, 0.10204081632653061]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.145.jpg",
  "colors": {
    "hex": "#9fa387",
    "hls": [0.19047619047619047, 0.58203125, 0.1308411214953271]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.146.jpg",
  "colors": {
    "hex": "#969b86",
    "hls": [0.20634920634920637, 0.564453125, 0.09417040358744394]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.147.jpg",
  "colors": {
    "hex": "#a9a389",
    "hls": [0.13541666666666666, 0.59765625, 0.1553398058252427]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.148.jpg",
  "colors": {
    "hex": "#9d937d",
    "hls": [0.11458333333333333, 0.55078125, 0.1391304347826087]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.149.jpg",
  "colors": {
    "hex": "#a29884",
    "hls": [0.11111111111111112, 0.57421875, 0.13761467889908258]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.15.jpg",
  "colors": {
    "hex": "#a8a993",
    "hls": [0.17424242424242423, 0.6171875, 0.11224489795918367]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.150.jpg",
  "colors": {
    "hex": "#aca98d",
    "hls": [0.15053763440860216, 0.611328125, 0.15577889447236182]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.151.jpg",
  "colors": {
    "hex": "#7b756d",
    "hls": [0.09523809523809523, 0.453125, 0.0603448275862069]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.152.jpg",
  "colors": {
    "hex": "#8f9581",
    "hls": [0.21666666666666665, 0.54296875, 0.08547008547008547]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.153.jpg",
  "colors": {
    "hex": "#958e84",
    "hls": [0.09803921568627451, 0.548828125, 0.0735930735930736]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.157.jpg",
  "colors": {
    "hex": "#a9aa97",
    "hls": [0.1754385964912281, 0.626953125, 0.09947643979057591]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.158.jpg",
  "colors": {
    "hex": "#9a9d8c",
    "hls": [0.196078431372549, 0.580078125, 0.07906976744186046]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.159.jpg",
  "colors": {
    "hex": "#919285",
    "hls": [0.17948717948717952, 0.544921875, 0.055793991416309016]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.16.jpg",
  "colors": {
    "hex": "#b4b59e",
    "hls": [0.1739130434782609, 0.662109375, 0.1329479768786127]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.161.jpg",
  "colors": {
    "hex": "#a2a299",
    "hls": [0.16666666666666666, 0.615234375, 0.04568527918781726]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.162.jpg",
  "colors": {
    "hex": "#9a9b85",
    "hls": [0.17424242424242423, 0.5625, 0.09821428571428571]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.163.jpg",
  "colors": {
    "hex": "#aeb09e",
    "hls": [0.1851851851851852, 0.65234375, 0.10112359550561797]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.164.jpg",
  "colors": {
    "hex": "#90927b",
    "hls": [0.18115942028985507, 0.525390625, 0.09465020576131687]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.165.jpg",
  "colors": {
    "hex": "#999886",
    "hls": [0.15789473684210528, 0.560546875, 0.08444444444444445]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.166.jpg",
  "colors": {
    "hex": "#a4a598",
    "hls": [0.17948717948717952, 0.619140625, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.167.jpg",
  "colors": {
    "hex": "#989987",
    "hls": [0.1759259259259259, 0.5625, 0.08035714285714286]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.168.jpg",
  "colors": {
    "hex": "#97958c",
    "hls": [0.13636363636363635, 0.568359375, 0.049773755656108594]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.169.jpg",
  "colors": {
    "hex": "#a5ad98",
    "hls": [0.23015873015873015, 0.634765625, 0.11229946524064172]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.17.jpg",
  "colors": {
    "hex": "#a39e8d",
    "hls": [0.12878787878787878, 0.59375, 0.10576923076923077]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.170.jpg",
  "colors": {
    "hex": "#939786",
    "hls": [0.2058823529411765, 0.556640625, 0.07488986784140969]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.172.jpg",
  "colors": {
    "hex": "#b5b6a4",
    "hls": [0.1759259259259259, 0.67578125, 0.10843373493975904]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.173.jpg",
  "colors": {
    "hex": "#acb198",
    "hls": [0.20000000000000004, 0.642578125, 0.1366120218579235]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.174.jpg",
  "colors": {
    "hex": "#918d80",
    "hls": [0.12745098039215685, 0.533203125, 0.07112970711297072]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.175.jpg",
  "colors": {
    "hex": "#91978b",
    "hls": [0.25, 0.56640625, 0.05405405405405406]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.176.jpg",
  "colors": {
    "hex": "#bbbea3",
    "hls": [0.1851851851851852, 0.689453125, 0.16981132075471697]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.177.jpg",
  "colors": {
    "hex": "#a7ab9a",
    "hls": [0.2058823529411765, 0.634765625, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.178.jpg",
  "colors": {
    "hex": "#929381",
    "hls": [0.1759259259259259, 0.5390625, 0.07627118644067797]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.179.jpg",
  "colors": {
    "hex": "#a0a692",
    "hls": [0.21666666666666665, 0.609375, 0.1]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.180.jpg",
  "colors": {
    "hex": "#a3a99d",
    "hls": [0.25, 0.63671875, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.181.jpg",
  "colors": {
    "hex": "#979c89",
    "hls": [0.21052631578947367, 0.572265625, 0.0867579908675799]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.182.jpg",
  "colors": {
    "hex": "#979388",
    "hls": [0.12222222222222223, 0.560546875, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.183.jpg",
  "colors": {
    "hex": "#a29c90",
    "hls": [0.11111111111111112, 0.59765625, 0.08737864077669903]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.184.jpg",
  "colors": {
    "hex": "#a8ab98",
    "hls": [0.1929824561403509, 0.630859375, 0.10052910052910052]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.185.jpg",
  "colors": {
    "hex": "#b1b4a3",
    "hls": [0.196078431372549, 0.669921875, 0.10059171597633136]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.186.jpg",
  "colors": {
    "hex": "#a9aa97",
    "hls": [0.1754385964912281, 0.626953125, 0.09947643979057591]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.187.jpg",
  "colors": {
    "hex": "#858074",
    "hls": [0.1176470588235294, 0.486328125, 0.06827309236947791]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.188.jpg",
  "colors": {
    "hex": "#a3a798",
    "hls": [0.2111111111111111, 0.623046875, 0.07772020725388601]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.189.jpg",
  "colors": {
    "hex": "#afb29f",
    "hls": [0.1929824561403509, 0.658203125, 0.10857142857142857]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.190.jpg",
  "colors": {
    "hex": "#958d7f",
    "hls": [0.10606060606060606, 0.5390625, 0.09322033898305085]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.191.jpg",
  "colors": {
    "hex": "#9b9c8c",
    "hls": [0.17708333333333334, 0.578125, 0.07407407407407407]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.192.jpg",
  "colors": {
    "hex": "#9f9d85",
    "hls": [0.15384615384615385, 0.5703125, 0.11818181818181818]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.193.jpg",
  "colors": {
    "hex": "#b0b1a6",
    "hls": [0.1818181818181818, 0.669921875, 0.0650887573964497]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.194.jpg",
  "colors": {
    "hex": "#989487",
    "hls": [0.12745098039215685, 0.560546875, 0.07555555555555556]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.195.jpg",
  "colors": {
    "hex": "#8f968a",
    "hls": [0.2638888888888889, 0.5625, 0.05357142857142857]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.196.jpg",
  "colors": {
    "hex": "#a29c85",
    "hls": [0.13218390804597702, 0.576171875, 0.1336405529953917]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.197.jpg",
  "colors": {
    "hex": "#9e9d8d",
    "hls": [0.1568627450980392, 0.583984375, 0.07981220657276995]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.199.jpg",
  "colors": {
    "hex": "#939086",
    "hls": [0.1282051282051282, 0.548828125, 0.05627705627705628]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.20.jpg",
  "colors": {
    "hex": "#b5b5a2",
    "hls": [0.16666666666666666, 0.669921875, 0.11242603550295859]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.200.jpg",
  "colors": {
    "hex": "#a2a191",
    "hls": [0.1568627450980392, 0.599609375, 0.08292682926829269]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.201.jpg",
  "colors": {
    "hex": "#a3a094",
    "hls": [0.13333333333333333, 0.607421875, 0.07462686567164178]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.202.jpg",
  "colors": {
    "hex": "#848177",
    "hls": [0.1282051282051282, 0.490234375, 0.05179282868525897]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.203.jpg",
  "colors": {
    "hex": "#948f84",
    "hls": [0.11458333333333333, 0.546875, 0.06896551724137931]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.204.jpg",
  "colors": {
    "hex": "#a0a38f",
    "hls": [0.19166666666666665, 0.59765625, 0.0970873786407767]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.205.jpg",
  "colors": {
    "hex": "#a3aa92",
    "hls": [0.21527777777777776, 0.6171875, 0.12244897959183673]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.206.jpg",
  "colors": {
    "hex": "#938d82",
    "hls": [0.10784313725490195, 0.541015625, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.207.jpg",
  "colors": {
    "hex": "#939382",
    "hls": [0.16666666666666666, 0.541015625, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.208.jpg",
  "colors": {
    "hex": "#929f8c",
    "hls": [0.2807017543859649, 0.583984375, 0.0892018779342723]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.21.jpg",
  "colors": {
    "hex": "#a1a590",
    "hls": [0.19841269841269846, 0.603515625, 0.10344827586206896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.211.jpg",
  "colors": {
    "hex": "#938f85",
    "hls": [0.11904761904761905, 0.546875, 0.0603448275862069]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.212.jpg",
  "colors": {
    "hex": "#949485",
    "hls": [0.16666666666666666, 0.548828125, 0.06493506493506493]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.213.jpg",
  "colors": {
    "hex": "#aeac95",
    "hls": [0.15333333333333335, 0.630859375, 0.13227513227513227]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.214.jpg",
  "colors": {
    "hex": "#8e8d83",
    "hls": [0.15151515151515152, 0.533203125, 0.04602510460251046]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.215.jpg",
  "colors": {
    "hex": "#97917f",
    "hls": [0.125, 0.54296875, 0.10256410256410256]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.217.jpg",
  "colors": {
    "hex": "#949781",
    "hls": [0.18939393939393936, 0.546875, 0.09482758620689655]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.218.jpg",
  "colors": {
    "hex": "#a9a99f",
    "hls": [0.16666666666666666, 0.640625, 0.05434782608695652]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.219.jpg",
  "colors": {
    "hex": "#acad9a",
    "hls": [0.1754385964912281, 0.638671875, 0.10270270270270271]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.22.jpg",
  "colors": {
    "hex": "#989b84",
    "hls": [0.1884057971014493, 0.560546875, 0.10222222222222223]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.220.jpg",
  "colors": {
    "hex": "#b1ad93",
    "hls": [0.14444444444444446, 0.6328125, 0.1595744680851064]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.221.jpg",
  "colors": {
    "hex": "#b2b1a4",
    "hls": [0.15476190476190477, 0.66796875, 0.08235294117647059]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.222.jpg",
  "colors": {
    "hex": "#a4a398",
    "hls": [0.15277777777777776, 0.6171875, 0.061224489795918366]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.223.jpg",
  "colors": {
    "hex": "#9a9890",
    "hls": [0.13333333333333333, 0.58203125, 0.04672897196261682]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.224.jpg",
  "colors": {
    "hex": "#a9ad96",
    "hls": [0.19565217391304346, 0.630859375, 0.12169312169312169]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.225.jpg",
  "colors": {
    "hex": "#aaab9f",
    "hls": [0.18055555555555558, 0.64453125, 0.06593406593406594]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.226.jpg",
  "colors": {
    "hex": "#88867b",
    "hls": [0.14102564102564102, 0.505859375, 0.05138339920948617]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.229.jpg",
  "colors": {
    "hex": "#aca698",
    "hls": [0.11666666666666665, 0.6328125, 0.10638297872340426]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.23.jpg",
  "colors": {
    "hex": "#a5a58b",
    "hls": [0.16666666666666666, 0.59375, 0.125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.230.jpg",
  "colors": {
    "hex": "#89887a",
    "hls": [0.15555555555555556, 0.505859375, 0.05928853754940711]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.231.jpg",
  "colors": {
    "hex": "#959385",
    "hls": [0.14583333333333334, 0.55078125, 0.06956521739130435]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.232.jpg",
  "colors": {
    "hex": "#acae98",
    "hls": [0.1818181818181818, 0.63671875, 0.11827956989247312]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.233.jpg",
  "colors": {
    "hex": "#a2a399",
    "hls": [0.18333333333333335, 0.6171875, 0.05102040816326531]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.234.jpg",
  "colors": {
    "hex": "#a8aa98",
    "hls": [0.1851851851851852, 0.62890625, 0.09473684210526316]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.235.jpg",
  "colors": {
    "hex": "#adae9e",
    "hls": [0.17708333333333334, 0.6484375, 0.08888888888888889]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.236.jpg",
  "colors": {
    "hex": "#aca79a",
    "hls": [0.12037037037037036, 0.63671875, 0.0967741935483871]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.237.jpg",
  "colors": {
    "hex": "#9fa28f",
    "hls": [0.1929824561403509, 0.595703125, 0.09178743961352658]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.238.jpg",
  "colors": {
    "hex": "#908b82",
    "hls": [0.10714285714285714, 0.53515625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.239.jpg",
  "colors": {
    "hex": "#918f87",
    "hls": [0.13333333333333333, 0.546875, 0.04310344827586207]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.24.jpg",
  "colors": {
    "hex": "#8f8c7e",
    "hls": [0.1372549019607843, 0.525390625, 0.06995884773662552]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.240.jpg",
  "colors": {
    "hex": "#94948a",
    "hls": [0.16666666666666666, 0.55859375, 0.04424778761061947]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.241.jpg",
  "colors": {
    "hex": "#8b887e",
    "hls": [0.1282051282051282, 0.517578125, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.242.jpg",
  "colors": {
    "hex": "#adab9b",
    "hls": [0.14814814814814814, 0.640625, 0.09782608695652174]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.243.jpg",
  "colors": {
    "hex": "#b2b19d",
    "hls": [0.15873015873015872, 0.654296875, 0.11864406779661017]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.244.jpg",
  "colors": {
    "hex": "#929086",
    "hls": [0.1388888888888889, 0.546875, 0.05172413793103448]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.245.jpg",
  "colors": {
    "hex": "#a0a593",
    "hls": [0.21296296296296294, 0.609375, 0.09]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.246.jpg",
  "colors": {
    "hex": "#a9a191",
    "hls": [0.11111111111111112, 0.61328125, 0.12121212121212122]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.247.jpg",
  "colors": {
    "hex": "#9f9d8f",
    "hls": [0.14583333333333334, 0.58984375, 0.0761904761904762]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.248.jpg",
  "colors": {
    "hex": "#9e998d",
    "hls": [0.1176470588235294, 0.583984375, 0.07981220657276995]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.249.jpg",
  "colors": {
    "hex": "#b1afa0",
    "hls": [0.14705882352941177, 0.658203125, 0.09714285714285714]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.25.jpg",
  "colors": {
    "hex": "#989e88",
    "hls": [0.21212121212121207, 0.57421875, 0.10091743119266056]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.250.jpg",
  "colors": {
    "hex": "#a2a198",
    "hls": [0.15, 0.61328125, 0.050505050505050504]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.251.jpg",
  "colors": {
    "hex": "#a2a593",
    "hls": [0.19444444444444442, 0.609375, 0.09]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.252.jpg",
  "colors": {
    "hex": "#a5ae95",
    "hls": [0.22666666666666666, 0.630859375, 0.13227513227513227]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.253.jpg",
  "colors": {
    "hex": "#b3ac9e",
    "hls": [0.11111111111111112, 0.658203125, 0.12]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.254.jpg",
  "colors": {
    "hex": "#b3aea4",
    "hls": [0.11111111111111112, 0.669921875, 0.08875739644970414]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.255.jpg",
  "colors": {
    "hex": "#ada796",
    "hls": [0.12318840579710144, 0.630859375, 0.12169312169312169]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.257.jpg",
  "colors": {
    "hex": "#9a9c8f",
    "hls": [0.1923076923076923, 0.583984375, 0.06103286384976526]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.258.jpg",
  "colors": {
    "hex": "#a3a793",
    "hls": [0.20000000000000004, 0.61328125, 0.10101010101010101]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.259.jpg",
  "colors": {
    "hex": "#9e9f89",
    "hls": [0.17424242424242423, 0.578125, 0.10185185185185185]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.26.jpg",
  "colors": {
    "hex": "#abab94",
    "hls": [0.16666666666666666, 0.623046875, 0.11917098445595854]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.260.jpg",
  "colors": {
    "hex": "#9e9f8c",
    "hls": [0.1754385964912281, 0.583984375, 0.0892018779342723]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.261.jpg",
  "colors": {
    "hex": "#989a8c",
    "hls": [0.19047619047619047, 0.57421875, 0.06422018348623854]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.262.jpg",
  "colors": {
    "hex": "#9c998a",
    "hls": [0.1388888888888889, 0.57421875, 0.08256880733944955]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.263.jpg",
  "colors": {
    "hex": "#8f8b7d",
    "hls": [0.12962962962962962, 0.5234375, 0.07377049180327869]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.264.jpg",
  "colors": {
    "hex": "#909488",
    "hls": [0.22222222222222224, 0.5546875, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.265.jpg",
  "colors": {
    "hex": "#a8aba3",
    "hls": [0.22916666666666666, 0.65234375, 0.0449438202247191]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.266.jpg",
  "colors": {
    "hex": "#9e9a8d",
    "hls": [0.12745098039215685, 0.583984375, 0.07981220657276995]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.267.jpg",
  "colors": {
    "hex": "#a4a39c",
    "hls": [0.14583333333333334, 0.625, 0.041666666666666664]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.268.jpg",
  "colors": {
    "hex": "#b4b8a7",
    "hls": [0.2058823529411765, 0.685546875, 0.10559006211180125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.269.jpg",
  "colors": {
    "hex": "#a19c8d",
    "hls": [0.125, 0.58984375, 0.09523809523809523]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.27.jpg",
  "colors": {
    "hex": "#abad9c",
    "hls": [0.18627450980392157, 0.642578125, 0.09289617486338798]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.270.jpg",
  "colors": {
    "hex": "#9f9e8b",
    "hls": [0.15833333333333333, 0.58203125, 0.09345794392523364]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.271.jpg",
  "colors": {
    "hex": "#afaca0",
    "hls": [0.13333333333333333, 0.654296875, 0.0847457627118644]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.274.jpg",
  "colors": {
    "hex": "#9d968a",
    "hls": [0.10526315789473684, 0.576171875, 0.08755760368663594]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.275.jpg",
  "colors": {
    "hex": "#a39d8f",
    "hls": [0.11666666666666665, 0.59765625, 0.0970873786407767]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.276.jpg",
  "colors": {
    "hex": "#9ba188",
    "hls": [0.2066666666666667, 0.580078125, 0.11627906976744186]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.277.jpg",
  "colors": {
    "hex": "#b2ab9d",
    "hls": [0.11111111111111112, 0.654296875, 0.11864406779661017]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.278.jpg",
  "colors": {
    "hex": "#9f9789",
    "hls": [0.10606060606060606, 0.578125, 0.10185185185185185]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.28.jpg",
  "colors": {
    "hex": "#b1ae9a",
    "hls": [0.14492753623188406, 0.646484375, 0.1270718232044199]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.280.jpg",
  "colors": {
    "hex": "#ada596",
    "hls": [0.10869565217391304, 0.630859375, 0.12169312169312169]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.281.jpg",
  "colors": {
    "hex": "#ada697",
    "hls": [0.11363636363636365, 0.6328125, 0.11702127659574468]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.283.jpg",
  "colors": {
    "hex": "#9d998d",
    "hls": [0.125, 0.58203125, 0.07476635514018691]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.284.jpg",
  "colors": {
    "hex": "#8c8f76",
    "hls": [0.18666666666666668, 0.509765625, 0.099601593625498]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.285.jpg",
  "colors": {
    "hex": "#9a9588",
    "hls": [0.12037037037037036, 0.56640625, 0.08108108108108109]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.286.jpg",
  "colors": {
    "hex": "#999586",
    "hls": [0.13157894736842105, 0.560546875, 0.08444444444444445]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.287.jpg",
  "colors": {
    "hex": "#9e9e8d",
    "hls": [0.16666666666666666, 0.583984375, 0.07981220657276995]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.288.jpg",
  "colors": {
    "hex": "#989384",
    "hls": [0.125, 0.5546875, 0.08771929824561403]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.289.jpg",
  "colors": {
    "hex": "#878276",
    "hls": [0.1176470588235294, 0.494140625, 0.06719367588932806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.29.jpg",
  "colors": {
    "hex": "#a29d90",
    "hls": [0.12037037037037036, 0.59765625, 0.08737864077669903]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.30.jpg",
  "colors": {
    "hex": "#a5a99a",
    "hls": [0.2111111111111111, 0.630859375, 0.07936507936507936]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.31.jpg",
  "colors": {
    "hex": "#9ca391",
    "hls": [0.23148148148148148, 0.6015625, 0.08823529411764706]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.32.jpg",
  "colors": {
    "hex": "#a0a593",
    "hls": [0.21296296296296294, 0.609375, 0.09]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.33.jpg",
  "colors": {
    "hex": "#9ba18f",
    "hls": [0.22222222222222224, 0.59375, 0.08653846153846154]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.34.jpg",
  "colors": {
    "hex": "#929886",
    "hls": [0.22222222222222224, 0.55859375, 0.07964601769911504]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.35.jpg",
  "colors": {
    "hex": "#818178",
    "hls": [0.16666666666666666, 0.486328125, 0.03614457831325301]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.36.jpg",
  "colors": {
    "hex": "#8e8e84",
    "hls": [0.16666666666666666, 0.53515625, 0.04201680672268908]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.37.jpg",
  "colors": {
    "hex": "#8c8a81",
    "hls": [0.13636363636363635, 0.525390625, 0.04526748971193416]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.38.jpg",
  "colors": {
    "hex": "#878678",
    "hls": [0.15555555555555556, 0.498046875, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.39.jpg",
  "colors": {
    "hex": "#8d8d82",
    "hls": [0.16666666666666666, 0.529296875, 0.04564315352697095]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.4.jpg",
  "colors": {
    "hex": "#a3a494",
    "hls": [0.17708333333333334, 0.609375, 0.08]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.40.jpg",
  "colors": {
    "hex": "#a5a693",
    "hls": [0.1754385964912281, 0.611328125, 0.09547738693467336]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.41.jpg",
  "colors": {
    "hex": "#85837b",
    "hls": [0.13333333333333333, 0.5, 0.0390625]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.42.jpg",
  "colors": {
    "hex": "#7c7d76",
    "hls": [0.19047619047619047, 0.474609375, 0.02880658436213992]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.43.jpg",
  "colors": {
    "hex": "#828178",
    "hls": [0.15, 0.48828125, 0.04]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.44.jpg",
  "colors": {
    "hex": "#7e7d79",
    "hls": [0.13333333333333333, 0.482421875, 0.020242914979757085]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.45.jpg",
  "colors": {
    "hex": "#75746d",
    "hls": [0.14583333333333334, 0.44140625, 0.035398230088495575]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.46.jpg",
  "colors": {
    "hex": "#87867d",
    "hls": [0.15, 0.5078125, 0.03968253968253968]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.47.jpg",
  "colors": {
    "hex": "#83827c",
    "hls": [0.14285714285714288, 0.498046875, 0.027450980392156862]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.48.jpg",
  "colors": {
    "hex": "#979985",
    "hls": [0.18333333333333335, 0.55859375, 0.08849557522123894]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.49.jpg",
  "colors": {
    "hex": "#9da089",
    "hls": [0.1884057971014493, 0.580078125, 0.10697674418604651]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.5.jpg",
  "colors": {
    "hex": "#8f9587",
    "hls": [0.23809523809523805, 0.5546875, 0.06140350877192982]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.50.jpg",
  "colors": {
    "hex": "#9ba38e",
    "hls": [0.23015873015873015, 0.595703125, 0.10144927536231885]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.51.jpg",
  "colors": {
    "hex": "#8e8e7a",
    "hls": [0.16666666666666666, 0.515625, 0.08064516129032258]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.52.jpg",
  "colors": {
    "hex": "#9ba189",
    "hls": [0.20833333333333334, 0.58203125, 0.11214953271028037]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.53.jpg",
  "colors": {
    "hex": "#959b84",
    "hls": [0.21014492753623185, 0.560546875, 0.10222222222222223]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.54.jpg",
  "colors": {
    "hex": "#919785",
    "hls": [0.22222222222222224, 0.5546875, 0.07894736842105263]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.55.jpg",
  "colors": {
    "hex": "#969c81",
    "hls": [0.20370370370370372, 0.556640625, 0.11894273127753303]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.57.jpg",
  "colors": {
    "hex": "#949380",
    "hls": [0.15833333333333333, 0.5390625, 0.0847457627118644]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.58.jpg",
  "colors": {
    "hex": "#94987f",
    "hls": [0.19333333333333336, 0.544921875, 0.1072961373390558]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.59.jpg",
  "colors": {
    "hex": "#9aa094",
    "hls": [0.25, 0.6015625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.6.jpg",
  "colors": {
    "hex": "#b4b4a8",
    "hls": [0.16666666666666666, 0.6796875, 0.07317073170731707]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.60.jpg",
  "colors": {
    "hex": "#959c8b",
    "hls": [0.2352941176470588, 0.576171875, 0.07834101382488479]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.61.jpg",
  "colors": {
    "hex": "#a4a797",
    "hls": [0.19791666666666666, 0.62109375, 0.08247422680412371]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.62.jpg",
  "colors": {
    "hex": "#a2a89b",
    "hls": [0.2435897435897436, 0.630859375, 0.06878306878306878]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.63.jpg",
  "colors": {
    "hex": "#9da490",
    "hls": [0.225, 0.6015625, 0.09803921568627451]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.64.jpg",
  "colors": {
    "hex": "#9da191",
    "hls": [0.20833333333333334, 0.59765625, 0.07766990291262135]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.65.jpg",
  "colors": {
    "hex": "#9ca397",
    "hls": [0.2638888888888889, 0.61328125, 0.06060606060606061]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.66.jpg",
  "colors": {
    "hex": "#9aa193",
    "hls": [0.25, 0.6015625, 0.06862745098039216]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.68.jpg",
  "colors": {
    "hex": "#a19c8c",
    "hls": [0.12698412698412698, 0.587890625, 0.0995260663507109]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.69.jpg",
  "colors": {
    "hex": "#98948a",
    "hls": [0.11904761904761905, 0.56640625, 0.06306306306306306]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.70.jpg",
  "colors": {
    "hex": "#9f998b",
    "hls": [0.11666666666666665, 0.58203125, 0.09345794392523364]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.71.jpg",
  "colors": {
    "hex": "#a6a79e",
    "hls": [0.1851851851851852, 0.634765625, 0.0481283422459893]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.72.jpg",
  "colors": {
    "hex": "#aca192",
    "hls": [0.09615384615384615, 0.62109375, 0.13402061855670103]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.73.jpg",
  "colors": {
    "hex": "#a8a9a1",
    "hls": [0.1875, 0.64453125, 0.04395604395604396]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.74.jpg",
  "colors": {
    "hex": "#989b96",
    "hls": [0.26666666666666666, 0.595703125, 0.024154589371980676]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.75.jpg",
  "colors": {
    "hex": "#8d8e7b",
    "hls": [0.1754385964912281, 0.517578125, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.76.jpg",
  "colors": {
    "hex": "#868775",
    "hls": [0.1759259259259259, 0.4921875, 0.07142857142857142]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.77.jpg",
  "colors": {
    "hex": "#9a9d85",
    "hls": [0.1875, 0.56640625, 0.10810810810810811]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.78.jpg",
  "colors": {
    "hex": "#969682",
    "hls": [0.16666666666666666, 0.546875, 0.08620689655172414]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.79.jpg",
  "colors": {
    "hex": "#918d77",
    "hls": [0.14102564102564102, 0.515625, 0.10483870967741936]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.8.jpg",
  "colors": {
    "hex": "#9ba08f",
    "hls": [0.2156862745098039, 0.591796875, 0.08133971291866028]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.80.jpg",
  "colors": {
    "hex": "#969b7e",
    "hls": [0.19540229885057472, 0.548828125, 0.12554112554112554]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.81.jpg",
  "colors": {
    "hex": "#8d907b",
    "hls": [0.19047619047619047, 0.521484375, 0.08571428571428572]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.82.jpg",
  "colors": {
    "hex": "#969780",
    "hls": [0.1739130434782609, 0.544921875, 0.09871244635193133]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.83.jpg",
  "colors": {
    "hex": "#83827c",
    "hls": [0.14285714285714288, 0.498046875, 0.027450980392156862]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.84.jpg",
  "colors": {
    "hex": "#86857e",
    "hls": [0.14583333333333334, 0.5078125, 0.031746031746031744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.85.jpg",
  "colors": {
    "hex": "#888881",
    "hls": [0.16666666666666666, 0.517578125, 0.02834008097165992]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.86.jpg",
  "colors": {
    "hex": "#898a82",
    "hls": [0.1875, 0.5234375, 0.03278688524590164]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.87.jpg",
  "colors": {
    "hex": "#84847d",
    "hls": [0.16666666666666666, 0.501953125, 0.027450980392156862]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.88.jpg",
  "colors": {
    "hex": "#8e8c83",
    "hls": [0.13636363636363635, 0.533203125, 0.04602510460251046]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.89.jpg",
  "colors": {
    "hex": "#767570",
    "hls": [0.1388888888888889, 0.44921875, 0.02608695652173913]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.9.jpg",
  "colors": {
    "hex": "#848b78",
    "hls": [0.22807017543859645, 0.505859375, 0.07509881422924901]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.90.jpg",
  "colors": {
    "hex": "#8b8a83",
    "hls": [0.14583333333333334, 0.52734375, 0.03305785123966942]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.91.jpg",
  "colors": {
    "hex": "#a9ac97",
    "hls": [0.19047619047619047, 0.630859375, 0.1111111111111111]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.92.jpg",
  "colors": {
    "hex": "#9ea594",
    "hls": [0.2352941176470588, 0.611328125, 0.08542713567839195]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.93.jpg",
  "colors": {
    "hex": "#9da394",
    "hls": [0.2333333333333333, 0.607421875, 0.07462686567164178]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.94.jpg",
  "colors": {
    "hex": "#9ca296",
    "hls": [0.25, 0.609375, 0.06]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.95.jpg",
  "colors": {
    "hex": "#989e90",
    "hls": [0.23809523809523805, 0.58984375, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.96.jpg",
  "colors": {
    "hex": "#959b8b",
    "hls": [0.22916666666666666, 0.57421875, 0.07339449541284404]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.97.jpg",
  "colors": {
    "hex": "#a5a897",
    "hls": [0.196078431372549, 0.623046875, 0.08808290155440414]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.98.jpg",
  "colors": {
    "hex": "#9aa091",
    "hls": [0.2333333333333333, 0.595703125, 0.07246376811594203]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D010a.99.jpg",
  "colors": {
    "hex": "#aea995",
    "hls": [0.13333333333333333, 0.630859375, 0.13227513227513227]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.10.jpg",
  "colors": {
    "hex": "#a8afa5",
    "hls": [0.2833333333333334, 0.6640625, 0.05813953488372093]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.100.jpg",
  "colors": {
    "hex": "#949991",
    "hls": [0.2708333333333333, 0.58203125, 0.037383177570093455]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.101.jpg",
  "colors": {
    "hex": "#999d90",
    "hls": [0.21794871794871792, 0.587890625, 0.061611374407582936]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.102.jpg",
  "colors": {
    "hex": "#9a9a85",
    "hls": [0.16666666666666666, 0.560546875, 0.09333333333333334]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.103.jpg",
  "colors": {
    "hex": "#9b9e94",
    "hls": [0.21666666666666665, 0.59765625, 0.04854368932038835]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.104.jpg",
  "colors": {
    "hex": "#959789",
    "hls": [0.19047619047619047, 0.5625, 0.0625]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.105.jpg",
  "colors": {
    "hex": "#878d81",
    "hls": [0.25, 0.52734375, 0.049586776859504134]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.106.jpg",
  "colors": {
    "hex": "#b0b8b0",
    "hls": [0.3333333333333333, 0.703125, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.107.jpg",
  "colors": {
    "hex": "#a7ac97",
    "hls": [0.20634920634920637, 0.630859375, 0.1111111111111111]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.108.jpg",
  "colors": {
    "hex": "#abab99",
    "hls": [0.16666666666666666, 0.6328125, 0.09574468085106383]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.109.jpg",
  "colors": {
    "hex": "#a2a595",
    "hls": [0.19791666666666666, 0.61328125, 0.08080808080808081]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.11.jpg",
  "colors": {
    "hex": "#a3aa9f",
    "hls": [0.2727272727272727, 0.642578125, 0.060109289617486336]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.110.jpg",
  "colors": {
    "hex": "#9c9d88",
    "hls": [0.17460317460317457, 0.572265625, 0.0958904109589041]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.111.jpg",
  "colors": {
    "hex": "#aab0a2",
    "hls": [0.23809523809523805, 0.66015625, 0.08045977011494253]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.112.jpg",
  "colors": {
    "hex": "#b1b6a5",
    "hls": [0.2156862745098039, 0.677734375, 0.10303030303030303]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.113.jpg",
  "colors": {
    "hex": "#a6ac9f",
    "hls": [0.2435897435897436, 0.646484375, 0.0718232044198895]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.114.jpg",
  "colors": {
    "hex": "#8a938c",
    "hls": [0.3703703703703704, 0.556640625, 0.039647577092511016]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.115.jpg",
  "colors": {
    "hex": "#aeb2a0",
    "hls": [0.20370370370370372, 0.66015625, 0.10344827586206896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.116.jpg",
  "colors": {
    "hex": "#a2a598",
    "hls": [0.20512820512820515, 0.619140625, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.117.jpg",
  "colors": {
    "hex": "#b4b7ac",
    "hls": [0.21212121212121207, 0.693359375, 0.07006369426751592]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.118.jpg",
  "colors": {
    "hex": "#9da296",
    "hls": [0.23611111111111108, 0.609375, 0.06]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.119.jpg",
  "colors": {
    "hex": "#9ea18a",
    "hls": [0.1884057971014493, 0.583984375, 0.107981220657277]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.12.jpg",
  "colors": {
    "hex": "#84867e",
    "hls": [0.20833333333333334, 0.5078125, 0.031746031746031744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.120.jpg",
  "colors": {
    "hex": "#a8ad9e",
    "hls": [0.22222222222222224, 0.646484375, 0.08287292817679558]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.122.jpg",
  "colors": {
    "hex": "#aead9f",
    "hls": [0.15555555555555556, 0.650390625, 0.08379888268156424]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.123.jpg",
  "colors": {
    "hex": "#9ea08c",
    "hls": [0.18333333333333335, 0.5859375, 0.09433962264150944]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.124.jpg",
  "colors": {
    "hex": "#a1a28d",
    "hls": [0.17460317460317457, 0.591796875, 0.10047846889952153]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.127.jpg",
  "colors": {
    "hex": "#a0a38e",
    "hls": [0.19047619047619047, 0.595703125, 0.10144927536231885]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.128.jpg",
  "colors": {
    "hex": "#b1afa3",
    "hls": [0.14285714285714288, 0.6640625, 0.08139534883720931]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.129.jpg",
  "colors": {
    "hex": "#acaf9a",
    "hls": [0.19047619047619047, 0.642578125, 0.11475409836065574]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.13.jpg",
  "colors": {
    "hex": "#a4a59d",
    "hls": [0.1875, 0.62890625, 0.042105263157894736]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.130.jpg",
  "colors": {
    "hex": "#b3b6a0",
    "hls": [0.18939393939393936, 0.66796875, 0.12941176470588237]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.131.jpg",
  "colors": {
    "hex": "#b3b7a5",
    "hls": [0.20370370370370372, 0.6796875, 0.10975609756097561]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.132.jpg",
  "colors": {
    "hex": "#a9aa96",
    "hls": [0.17499999999999996, 0.625, 0.10416666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.133.jpg",
  "colors": {
    "hex": "#aba999",
    "hls": [0.14814814814814814, 0.6328125, 0.09574468085106383]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.135.jpg",
  "colors": {
    "hex": "#afb5a7",
    "hls": [0.23809523809523805, 0.6796875, 0.08536585365853659]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.136.jpg",
  "colors": {
    "hex": "#9a9f8f",
    "hls": [0.21875, 0.58984375, 0.0761904761904762]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.137.jpg",
  "colors": {
    "hex": "#a2a58e",
    "hls": [0.1884057971014493, 0.599609375, 0.11219512195121951]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.138.jpg",
  "colors": {
    "hex": "#989d8f",
    "hls": [0.2261904761904762, 0.5859375, 0.0660377358490566]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.139.jpg",
  "colors": {
    "hex": "#9b9d88",
    "hls": [0.18253968253968256, 0.572265625, 0.0958904109589041]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.14.jpg",
  "colors": {
    "hex": "#a6ad9f",
    "hls": [0.25, 0.6484375, 0.07777777777777778]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.140.jpg",
  "colors": {
    "hex": "#9ba296",
    "hls": [0.2638888888888889, 0.609375, 0.06]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.141.jpg",
  "colors": {
    "hex": "#9da196",
    "hls": [0.2272727272727273, 0.607421875, 0.05472636815920398]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.142.jpg",
  "colors": {
    "hex": "#9ca28d",
    "hls": [0.21428571428571427, 0.591796875, 0.10047846889952153]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.143.jpg",
  "colors": {
    "hex": "#9b9d8d",
    "hls": [0.1875, 0.58203125, 0.07476635514018691]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.144.jpg",
  "colors": {
    "hex": "#98a08c",
    "hls": [0.2333333333333333, 0.5859375, 0.09433962264150944]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.145.jpg",
  "colors": {
    "hex": "#a9ab94",
    "hls": [0.18115942028985507, 0.623046875, 0.11917098445595854]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.146.jpg",
  "colors": {
    "hex": "#8f9489",
    "hls": [0.24242424242424243, 0.556640625, 0.048458149779735685]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.147.jpg",
  "colors": {
    "hex": "#969d8f",
    "hls": [0.25, 0.5859375, 0.0660377358490566]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.148.jpg",
  "colors": {
    "hex": "#a0a795",
    "hls": [0.23148148148148148, 0.6171875, 0.09183673469387756]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.149.jpg",
  "colors": {
    "hex": "#a2a28e",
    "hls": [0.16666666666666666, 0.59375, 0.09615384615384616]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.15.jpg",
  "colors": {
    "hex": "#9fa698",
    "hls": [0.25, 0.62109375, 0.07216494845360824]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.150.jpg",
  "colors": {
    "hex": "#9da697",
    "hls": [0.26666666666666666, 0.619140625, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.151.jpg",
  "colors": {
    "hex": "#979a8b",
    "hls": [0.20000000000000004, 0.572265625, 0.0684931506849315]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.152.jpg",
  "colors": {
    "hex": "#9ba192",
    "hls": [0.2333333333333333, 0.599609375, 0.07317073170731707]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.153.jpg",
  "colors": {
    "hex": "#a09d89",
    "hls": [0.14492753623188406, 0.580078125, 0.10697674418604651]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.154.jpg",
  "colors": {
    "hex": "#a8a592",
    "hls": [0.14393939393939395, 0.61328125, 0.1111111111111111]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.155.jpg",
  "colors": {
    "hex": "#a0a491",
    "hls": [0.20175438596491224, 0.603515625, 0.09359605911330049]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.156.jpg",
  "colors": {
    "hex": "#adb09b",
    "hls": [0.19047619047619047, 0.646484375, 0.11602209944751381]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.157.jpg",
  "colors": {
    "hex": "#a0a896",
    "hls": [0.24074074074074078, 0.62109375, 0.09278350515463918]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.158.jpg",
  "colors": {
    "hex": "#afb39b",
    "hls": [0.19444444444444442, 0.65234375, 0.1348314606741573]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.159.jpg",
  "colors": {
    "hex": "#999680",
    "hls": [0.14666666666666667, 0.548828125, 0.10822510822510822]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.160.jpg",
  "colors": {
    "hex": "#a3a68d",
    "hls": [0.18666666666666668, 0.599609375, 0.12195121951219512]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.161.jpg",
  "colors": {
    "hex": "#8d9485",
    "hls": [0.24444444444444446, 0.548828125, 0.06493506493506493]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.162.jpg",
  "colors": {
    "hex": "#92927b",
    "hls": [0.16666666666666666, 0.525390625, 0.09465020576131687]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.163.jpg",
  "colors": {
    "hex": "#b2b6aa",
    "hls": [0.22222222222222224, 0.6875, 0.075]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.164.jpg",
  "colors": {
    "hex": "#aeb29b",
    "hls": [0.19565217391304346, 0.650390625, 0.12849162011173185]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.165.jpg",
  "colors": {
    "hex": "#a1a18d",
    "hls": [0.16666666666666666, 0.58984375, 0.09523809523809523]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.166.jpg",
  "colors": {
    "hex": "#a19e8a",
    "hls": [0.14492753623188406, 0.583984375, 0.107981220657277]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.167.jpg",
  "colors": {
    "hex": "#8f8f7e",
    "hls": [0.16666666666666666, 0.525390625, 0.06995884773662552]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.168.jpg",
  "colors": {
    "hex": "#9b9886",
    "hls": [0.14285714285714288, 0.564453125, 0.09417040358744394]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.169.jpg",
  "colors": {
    "hex": "#a1a290",
    "hls": [0.1759259259259259, 0.59765625, 0.08737864077669903]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.17.jpg",
  "colors": {
    "hex": "#989686",
    "hls": [0.14814814814814814, 0.55859375, 0.07964601769911504]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.170.jpg",
  "colors": {
    "hex": "#999b89",
    "hls": [0.1851851851851852, 0.5703125, 0.08181818181818182]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.171.jpg",
  "colors": {
    "hex": "#9ea18b",
    "hls": [0.18939393939393936, 0.5859375, 0.10377358490566038]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.172.jpg",
  "colors": {
    "hex": "#93907e",
    "hls": [0.14285714285714288, 0.533203125, 0.08786610878661087]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.173.jpg",
  "colors": {
    "hex": "#8b958b",
    "hls": [0.3333333333333333, 0.5625, 0.044642857142857144]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.174.jpg",
  "colors": {
    "hex": "#a7ac95",
    "hls": [0.2028985507246377, 0.626953125, 0.12041884816753927]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.175.jpg",
  "colors": {
    "hex": "#9ba28c",
    "hls": [0.21969696969696972, 0.58984375, 0.10476190476190476]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.176.jpg",
  "colors": {
    "hex": "#a3ac95",
    "hls": [0.2318840579710145, 0.626953125, 0.12041884816753927]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.178.jpg",
  "colors": {
    "hex": "#9d9c83",
    "hls": [0.16025641025641027, 0.5625, 0.11607142857142858]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.179.jpg",
  "colors": {
    "hex": "#a6aa95",
    "hls": [0.19841269841269846, 0.623046875, 0.10880829015544041]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.18.jpg",
  "colors": {
    "hex": "#9ea090",
    "hls": [0.1875, 0.59375, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.180.jpg",
  "colors": {
    "hex": "#a1a48e",
    "hls": [0.18939393939393936, 0.59765625, 0.10679611650485436]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.181.jpg",
  "colors": {
    "hex": "#aaac95",
    "hls": [0.18115942028985507, 0.626953125, 0.12041884816753927]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.182.jpg",
  "colors": {
    "hex": "#9c9e87",
    "hls": [0.18115942028985507, 0.572265625, 0.1050228310502283]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.183.jpg",
  "colors": {
    "hex": "#a4a58a",
    "hls": [0.17283950617283952, 0.591796875, 0.1291866028708134]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.184.jpg",
  "colors": {
    "hex": "#a4a593",
    "hls": [0.1759259259259259, 0.609375, 0.09]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.185.jpg",
  "colors": {
    "hex": "#9d9b82",
    "hls": [0.15432098765432098, 0.560546875, 0.12]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.186.jpg",
  "colors": {
    "hex": "#a1a28d",
    "hls": [0.17460317460317457, 0.591796875, 0.10047846889952153]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.187.jpg",
  "colors": {
    "hex": "#a1a38e",
    "hls": [0.18253968253968256, 0.595703125, 0.10144927536231885]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.188.jpg",
  "colors": {
    "hex": "#aab29d",
    "hls": [0.23015873015873015, 0.654296875, 0.11864406779661017]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.189.jpg",
  "colors": {
    "hex": "#999b88",
    "hls": [0.18421052631578946, 0.568359375, 0.08597285067873303]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.19.jpg",
  "colors": {
    "hex": "#a7aa99",
    "hls": [0.196078431372549, 0.630859375, 0.08994708994708994]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.190.jpg",
  "colors": {
    "hex": "#969986",
    "hls": [0.1929824561403509, 0.560546875, 0.08444444444444445]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.191.jpg",
  "colors": {
    "hex": "#a2a391",
    "hls": [0.1759259259259259, 0.6015625, 0.08823529411764706]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.192.jpg",
  "colors": {
    "hex": "#8c937f",
    "hls": [0.225, 0.53515625, 0.08403361344537816]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.193.jpg",
  "colors": {
    "hex": "#b1b8a0",
    "hls": [0.21527777777777776, 0.671875, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.194.jpg",
  "colors": {
    "hex": "#a9ad98",
    "hls": [0.19841269841269846, 0.634765625, 0.11229946524064172]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.196.jpg",
  "colors": {
    "hex": "#999880",
    "hls": [0.16, 0.548828125, 0.10822510822510822]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.197.jpg",
  "colors": {
    "hex": "#979b8c",
    "hls": [0.2111111111111111, 0.576171875, 0.06912442396313365]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.198.jpg",
  "colors": {
    "hex": "#a8a994",
    "hls": [0.17460317460317457, 0.619140625, 0.1076923076923077]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.199.jpg",
  "colors": {
    "hex": "#919889",
    "hls": [0.24444444444444446, 0.564453125, 0.06726457399103139]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.20.jpg",
  "colors": {
    "hex": "#919184",
    "hls": [0.16666666666666666, 0.541015625, 0.05531914893617021]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.200.jpg",
  "colors": {
    "hex": "#b0b499",
    "hls": [0.191358024691358, 0.650390625, 0.15083798882681565]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.201.jpg",
  "colors": {
    "hex": "#a9ad94",
    "hls": [0.19333333333333336, 0.626953125, 0.13089005235602094]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.203.jpg",
  "colors": {
    "hex": "#a6a58f",
    "hls": [0.15942028985507248, 0.603515625, 0.11330049261083744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.204.jpg",
  "colors": {
    "hex": "#989483",
    "hls": [0.1349206349206349, 0.552734375, 0.09170305676855896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.205.jpg",
  "colors": {
    "hex": "#9fa08c",
    "hls": [0.17499999999999996, 0.5859375, 0.09433962264150944]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.206.jpg",
  "colors": {
    "hex": "#b0b69d",
    "hls": [0.2066666666666667, 0.662109375, 0.14450867052023122]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.207.jpg",
  "colors": {
    "hex": "#969686",
    "hls": [0.16666666666666666, 0.5546875, 0.07017543859649122]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.208.jpg",
  "colors": {
    "hex": "#a3a695",
    "hls": [0.196078431372549, 0.615234375, 0.08629441624365482]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.209.jpg",
  "colors": {
    "hex": "#9ba08e",
    "hls": [0.21296296296296294, 0.58984375, 0.08571428571428572]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.21.jpg",
  "colors": {
    "hex": "#a4a994",
    "hls": [0.20634920634920637, 0.619140625, 0.1076923076923077]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.210.jpg",
  "colors": {
    "hex": "#9da291",
    "hls": [0.2156862745098039, 0.599609375, 0.08292682926829269]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.211.jpg",
  "colors": {
    "hex": "#afb59d",
    "hls": [0.20833333333333334, 0.66015625, 0.13793103448275862]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.212.jpg",
  "colors": {
    "hex": "#9d9d8a",
    "hls": [0.16666666666666666, 0.576171875, 0.08755760368663594]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.213.jpg",
  "colors": {
    "hex": "#acb097",
    "hls": [0.19333333333333336, 0.638671875, 0.13513513513513514]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.214.jpg",
  "colors": {
    "hex": "#a5ab9b",
    "hls": [0.22916666666666666, 0.63671875, 0.08602150537634409]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.215.jpg",
  "colors": {
    "hex": "#999d86",
    "hls": [0.19565217391304346, 0.568359375, 0.10407239819004525]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.216.jpg",
  "colors": {
    "hex": "#aeb8a5",
    "hls": [0.25438596491228066, 0.681640625, 0.1165644171779141]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.217.jpg",
  "colors": {
    "hex": "#a6a38b",
    "hls": [0.14814814814814814, 0.595703125, 0.13043478260869565]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.218.jpg",
  "colors": {
    "hex": "#969d85",
    "hls": [0.21527777777777776, 0.56640625, 0.10810810810810811]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.22.jpg",
  "colors": {
    "hex": "#9a9b8b",
    "hls": [0.17708333333333334, 0.57421875, 0.07339449541284404]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.220.jpg",
  "colors": {
    "hex": "#a7a792",
    "hls": [0.16666666666666666, 0.611328125, 0.10552763819095477]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.221.jpg",
  "colors": {
    "hex": "#a9ad96",
    "hls": [0.19565217391304346, 0.630859375, 0.12169312169312169]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.222.jpg",
  "colors": {
    "hex": "#adb59e",
    "hls": [0.22463768115942026, 0.662109375, 0.1329479768786127]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.224.jpg",
  "colors": {
    "hex": "#b3b39c",
    "hls": [0.16666666666666666, 0.654296875, 0.12994350282485875]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.226.jpg",
  "colors": {
    "hex": "#9d9e84",
    "hls": [0.17307692307692304, 0.56640625, 0.11711711711711711]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.227.jpg",
  "colors": {
    "hex": "#9fa38e",
    "hls": [0.19841269841269846, 0.595703125, 0.10144927536231885]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.229.jpg",
  "colors": {
    "hex": "#b0b5a4",
    "hls": [0.2156862745098039, 0.673828125, 0.10179640718562874]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.23.jpg",
  "colors": {
    "hex": "#9c9d8d",
    "hls": [0.17708333333333334, 0.58203125, 0.07476635514018691]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.230.jpg",
  "colors": {
    "hex": "#b3b59b",
    "hls": [0.17948717948717952, 0.65625, 0.14772727272727273]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.231.jpg",
  "colors": {
    "hex": "#b0b29a",
    "hls": [0.18055555555555558, 0.6484375, 0.13333333333333333]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.232.jpg",
  "colors": {
    "hex": "#a2a68f",
    "hls": [0.19565217391304346, 0.603515625, 0.11330049261083744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.233.jpg",
  "colors": {
    "hex": "#a9ab93",
    "hls": [0.18055555555555558, 0.62109375, 0.12371134020618557]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.234.jpg",
  "colors": {
    "hex": "#aeb59f",
    "hls": [0.21969696969696972, 0.6640625, 0.12790697674418605]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.236.jpg",
  "colors": {
    "hex": "#9b9e90",
    "hls": [0.2023809523809524, 0.58984375, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.237.jpg",
  "colors": {
    "hex": "#b0b6a4",
    "hls": [0.22222222222222224, 0.67578125, 0.10843373493975904]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.238.jpg",
  "colors": {
    "hex": "#a2a590",
    "hls": [0.19047619047619047, 0.603515625, 0.10344827586206896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.239.jpg",
  "colors": {
    "hex": "#a9a693",
    "hls": [0.14393939393939395, 0.6171875, 0.11224489795918367]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.24.jpg",
  "colors": {
    "hex": "#93978a",
    "hls": [0.21794871794871792, 0.564453125, 0.05829596412556054]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.240.jpg",
  "colors": {
    "hex": "#a2a395",
    "hls": [0.1785714285714286, 0.609375, 0.07]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.241.jpg",
  "colors": {
    "hex": "#b9bcab",
    "hls": [0.196078431372549, 0.701171875, 0.1111111111111111]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.242.jpg",
  "colors": {
    "hex": "#989e87",
    "hls": [0.21014492753623185, 0.572265625, 0.1050228310502283]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.243.jpg",
  "colors": {
    "hex": "#92978b",
    "hls": [0.23611111111111108, 0.56640625, 0.05405405405405406]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.244.jpg",
  "colors": {
    "hex": "#969588",
    "hls": [0.15476190476190477, 0.55859375, 0.061946902654867256]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.245.jpg",
  "colors": {
    "hex": "#a7ac9f",
    "hls": [0.23076923076923075, 0.646484375, 0.0718232044198895]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.247.jpg",
  "colors": {
    "hex": "#9fa08c",
    "hls": [0.17499999999999996, 0.5859375, 0.09433962264150944]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.248.jpg",
  "colors": {
    "hex": "#959c87",
    "hls": [0.22222222222222224, 0.568359375, 0.09502262443438914]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.249.jpg",
  "colors": {
    "hex": "#a8a690",
    "hls": [0.15277777777777776, 0.609375, 0.12]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.25.jpg",
  "colors": {
    "hex": "#9ca28c",
    "hls": [0.21212121212121207, 0.58984375, 0.10476190476190476]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.250.jpg",
  "colors": {
    "hex": "#8a8b76",
    "hls": [0.17460317460317457, 0.501953125, 0.08235294117647059]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.26.jpg",
  "colors": {
    "hex": "#949b92",
    "hls": [0.2962962962962963, 0.587890625, 0.04265402843601896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.29.jpg",
  "colors": {
    "hex": "#93907f",
    "hls": [0.14166666666666666, 0.53515625, 0.08403361344537816]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.30.jpg",
  "colors": {
    "hex": "#929784",
    "hls": [0.21052631578947367, 0.552734375, 0.08296943231441048]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.31.jpg",
  "colors": {
    "hex": "#b3b5a3",
    "hls": [0.1851851851851852, 0.671875, 0.10714285714285714]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.33.jpg",
  "colors": {
    "hex": "#a3a895",
    "hls": [0.21052631578947367, 0.619140625, 0.09743589743589744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.34.jpg",
  "colors": {
    "hex": "#8d8f86",
    "hls": [0.20370370370370372, 0.541015625, 0.03829787234042553]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.35.jpg",
  "colors": {
    "hex": "#8d8d81",
    "hls": [0.16666666666666666, 0.52734375, 0.049586776859504134]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.36.jpg",
  "colors": {
    "hex": "#abaf9c",
    "hls": [0.20175438596491224, 0.646484375, 0.10497237569060773]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.37.jpg",
  "colors": {
    "hex": "#979b8e",
    "hls": [0.21794871794871792, 0.580078125, 0.06046511627906977]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.38.jpg",
  "colors": {
    "hex": "#aaafa0",
    "hls": [0.22222222222222224, 0.654296875, 0.0847457627118644]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.39.jpg",
  "colors": {
    "hex": "#9ca08e",
    "hls": [0.20370370370370372, 0.58984375, 0.08571428571428572]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.41.jpg",
  "colors": {
    "hex": "#a3a490",
    "hls": [0.17499999999999996, 0.6015625, 0.09803921568627451]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.42.jpg",
  "colors": {
    "hex": "#9ea694",
    "hls": [0.24074074074074078, 0.61328125, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.43.jpg",
  "colors": {
    "hex": "#a0a18b",
    "hls": [0.17424242424242423, 0.5859375, 0.10377358490566038]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.44.jpg",
  "colors": {
    "hex": "#909487",
    "hls": [0.21794871794871792, 0.552734375, 0.056768558951965066]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.45.jpg",
  "colors": {
    "hex": "#9a9c8f",
    "hls": [0.1923076923076923, 0.583984375, 0.06103286384976526]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.46.jpg",
  "colors": {
    "hex": "#b0b4a5",
    "hls": [0.2111111111111111, 0.673828125, 0.08982035928143713]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.47.jpg",
  "colors": {
    "hex": "#9c9d90",
    "hls": [0.17948717948717952, 0.587890625, 0.061611374407582936]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.48.jpg",
  "colors": {
    "hex": "#a6a997",
    "hls": [0.19444444444444442, 0.625, 0.09375]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.49.jpg",
  "colors": {
    "hex": "#9fa494",
    "hls": [0.21875, 0.609375, 0.08]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.50.jpg",
  "colors": {
    "hex": "#a9ab96",
    "hls": [0.18253968253968256, 0.626953125, 0.1099476439790576]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.51.jpg",
  "colors": {
    "hex": "#a1a389",
    "hls": [0.17948717948717952, 0.5859375, 0.12264150943396226]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.52.jpg",
  "colors": {
    "hex": "#929481",
    "hls": [0.18421052631578946, 0.541015625, 0.08085106382978724]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.53.jpg",
  "colors": {
    "hex": "#8f9284",
    "hls": [0.2023809523809524, 0.54296875, 0.05982905982905983]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.54.jpg",
  "colors": {
    "hex": "#8f988c",
    "hls": [0.2916666666666667, 0.5703125, 0.05454545454545454]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.55.jpg",
  "colors": {
    "hex": "#929885",
    "hls": [0.2192982456140351, 0.556640625, 0.08370044052863436]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.56.jpg",
  "colors": {
    "hex": "#959a87",
    "hls": [0.21052631578947367, 0.564453125, 0.08520179372197309]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.57.jpg",
  "colors": {
    "hex": "#a6ae9e",
    "hls": [0.25, 0.6484375, 0.08888888888888889]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.58.jpg",
  "colors": {
    "hex": "#b8baa9",
    "hls": [0.18627450980392157, 0.693359375, 0.10828025477707007]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.59.jpg",
  "colors": {
    "hex": "#aeab95",
    "hls": [0.14666666666666667, 0.630859375, 0.13227513227513227]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.6.jpg",
  "colors": {
    "hex": "#8c897c",
    "hls": [0.13541666666666666, 0.515625, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.60.jpg",
  "colors": {
    "hex": "#a5a798",
    "hls": [0.18888888888888888, 0.623046875, 0.07772020725388601]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.61.jpg",
  "colors": {
    "hex": "#999987",
    "hls": [0.16666666666666666, 0.5625, 0.08035714285714286]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.62.jpg",
  "colors": {
    "hex": "#a2a492",
    "hls": [0.1851851851851852, 0.60546875, 0.0891089108910891]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.63.jpg",
  "colors": {
    "hex": "#aba992",
    "hls": [0.15333333333333335, 0.619140625, 0.1282051282051282]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.64.jpg",
  "colors": {
    "hex": "#92917e",
    "hls": [0.15833333333333333, 0.53125, 0.08333333333333333]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.66.jpg",
  "colors": {
    "hex": "#989e8c",
    "hls": [0.22222222222222224, 0.58203125, 0.08411214953271028]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.67.jpg",
  "colors": {
    "hex": "#90988e",
    "hls": [0.3, 0.57421875, 0.045871559633027525]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.68.jpg",
  "colors": {
    "hex": "#969d8f",
    "hls": [0.25, 0.5859375, 0.0660377358490566]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.69.jpg",
  "colors": {
    "hex": "#a9a292",
    "hls": [0.11594202898550725, 0.615234375, 0.116751269035533]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.7.jpg",
  "colors": {
    "hex": "#91887c",
    "hls": [0.09523809523809523, 0.525390625, 0.08641975308641975]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.70.jpg",
  "colors": {
    "hex": "#a1a194",
    "hls": [0.16666666666666666, 0.603515625, 0.06403940886699508]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.71.jpg",
  "colors": {
    "hex": "#9ba194",
    "hls": [0.2435897435897436, 0.603515625, 0.06403940886699508]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.72.jpg",
  "colors": {
    "hex": "#959a89",
    "hls": [0.2156862745098039, 0.568359375, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.73.jpg",
  "colors": {
    "hex": "#9ea096",
    "hls": [0.20000000000000004, 0.60546875, 0.04950495049504951]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.74.jpg",
  "colors": {
    "hex": "#949487",
    "hls": [0.16666666666666666, 0.552734375, 0.056768558951965066]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.76.jpg",
  "colors": {
    "hex": "#8d958c",
    "hls": [0.3148148148148148, 0.564453125, 0.04035874439461883]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.77.jpg",
  "colors": {
    "hex": "#929687",
    "hls": [0.2111111111111111, 0.556640625, 0.06607929515418502]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.78.jpg",
  "colors": {
    "hex": "#a3aa9e",
    "hls": [0.2638888888888889, 0.640625, 0.06521739130434782]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.79.jpg",
  "colors": {
    "hex": "#aeb2a3",
    "hls": [0.2111111111111111, 0.666015625, 0.08771929824561403]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.8.jpg",
  "colors": {
    "hex": "#a6aca3",
    "hls": [0.27777777777777773, 0.654296875, 0.05084745762711865]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.80.jpg",
  "colors": {
    "hex": "#acb1a1",
    "hls": [0.21875, 0.66015625, 0.09195402298850575]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.81.jpg",
  "colors": {
    "hex": "#979e93",
    "hls": [0.2727272727272727, 0.595703125, 0.05314009661835749]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.82.jpg",
  "colors": {
    "hex": "#acac99",
    "hls": [0.16666666666666666, 0.634765625, 0.10160427807486631]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.83.jpg",
  "colors": {
    "hex": "#8e9688",
    "hls": [0.26190476190476186, 0.55859375, 0.061946902654867256]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.84.jpg",
  "colors": {
    "hex": "#a4a493",
    "hls": [0.16666666666666666, 0.607421875, 0.0845771144278607]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.85.jpg",
  "colors": {
    "hex": "#aeb3a2",
    "hls": [0.2156862745098039, 0.666015625, 0.09941520467836257]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.86.jpg",
  "colors": {
    "hex": "#919481",
    "hls": [0.1929824561403509, 0.541015625, 0.08085106382978724]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.87.jpg",
  "colors": {
    "hex": "#999783",
    "hls": [0.15151515151515152, 0.5546875, 0.09649122807017543]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.88.jpg",
  "colors": {
    "hex": "#a4a38e",
    "hls": [0.1590909090909091, 0.59765625, 0.10679611650485436]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.89.jpg",
  "colors": {
    "hex": "#9a9f8c",
    "hls": [0.21052631578947367, 0.583984375, 0.0892018779342723]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.9.jpg",
  "colors": {
    "hex": "#a2a9a2",
    "hls": [0.3333333333333333, 0.646484375, 0.03867403314917127]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.90.jpg",
  "colors": {
    "hex": "#a1a48f",
    "hls": [0.19047619047619047, 0.599609375, 0.1024390243902439]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.91.jpg",
  "colors": {
    "hex": "#9ea08c",
    "hls": [0.18333333333333335, 0.5859375, 0.09433962264150944]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.92.jpg",
  "colors": {
    "hex": "#a0a694",
    "hls": [0.22222222222222224, 0.61328125, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.93.jpg",
  "colors": {
    "hex": "#959d91",
    "hls": [0.27777777777777773, 0.58984375, 0.05714285714285714]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.94.jpg",
  "colors": {
    "hex": "#a0a89e",
    "hls": [0.3, 0.63671875, 0.053763440860215055]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.95.jpg",
  "colors": {
    "hex": "#a1a08b",
    "hls": [0.1590909090909091, 0.5859375, 0.10377358490566038]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.96.jpg",
  "colors": {
    "hex": "#979482",
    "hls": [0.14285714285714288, 0.548828125, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.97.jpg",
  "colors": {
    "hex": "#a3a79c",
    "hls": [0.2272727272727273, 0.630859375, 0.0582010582010582]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.98.jpg",
  "colors": {
    "hex": "#a8a895",
    "hls": [0.16666666666666666, 0.619140625, 0.09743589743589744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D013.99.jpg",
  "colors": {
    "hex": "#9a9d8d",
    "hls": [0.19791666666666666, 0.58203125, 0.07476635514018691]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.10.jpg",
  "colors": {
    "hex": "#9ab390",
    "hls": [0.28571428571428575, 0.630859375, 0.18518518518518517]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.100.jpg",
  "colors": {
    "hex": "#92ad7e",
    "hls": [0.2624113475177305, 0.583984375, 0.22065727699530516]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.101.jpg",
  "colors": {
    "hex": "#94b48a",
    "hls": [0.29365079365079366, 0.62109375, 0.21649484536082475]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.102.jpg",
  "colors": {
    "hex": "#90b082",
    "hls": [0.2826086956521739, 0.59765625, 0.22330097087378642]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.11.jpg",
  "colors": {
    "hex": "#8dac87",
    "hls": [0.3063063063063063, 0.599609375, 0.18048780487804877]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.12.jpg",
  "colors": {
    "hex": "#bbb2ab",
    "hls": [0.07291666666666667, 0.69921875, 0.1038961038961039]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.13.jpg",
  "colors": {
    "hex": "#c2b8b3",
    "hls": [0.05555555555555556, 0.728515625, 0.1079136690647482]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.14.jpg",
  "colors": {
    "hex": "#83a88f",
    "hls": [0.3873873873873874, 0.583984375, 0.17370892018779344]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.15.jpg",
  "colors": {
    "hex": "#948a85",
    "hls": [0.05555555555555556, 0.548828125, 0.06493506493506493]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.17.jpg",
  "colors": {
    "hex": "#aec5a6",
    "hls": [0.2903225806451613, 0.708984375, 0.2080536912751678]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.18.jpg",
  "colors": {
    "hex": "#9ab391",
    "hls": [0.28921568627450983, 0.6328125, 0.18085106382978725]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.19.jpg",
  "colors": {
    "hex": "#a49692",
    "hls": [0.037037037037037035, 0.60546875, 0.0891089108910891]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.20.jpg",
  "colors": {
    "hex": "#90827e",
    "hls": [0.037037037037037035, 0.52734375, 0.0743801652892562]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.21.jpg",
  "colors": {
    "hex": "#8a8079",
    "hls": [0.06862745098039215, 0.505859375, 0.06719367588932806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.22.jpg",
  "colors": {
    "hex": "#8e8681",
    "hls": [0.0641025641025641, 0.529296875, 0.05394190871369295]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.23.jpg",
  "colors": {
    "hex": "#8c7e7d",
    "hls": [0.011111111111111108, 0.517578125, 0.06072874493927125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.24.jpg",
  "colors": {
    "hex": "#86a583",
    "hls": [0.31862745098039214, 0.578125, 0.1574074074074074]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.25.jpg",
  "colors": {
    "hex": "#81a77c",
    "hls": [0.31395348837209297, 0.568359375, 0.19457013574660634]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.26.jpg",
  "colors": {
    "hex": "#88ab82",
    "hls": [0.30894308943089427, 0.587890625, 0.1943127962085308]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.27.jpg",
  "colors": {
    "hex": "#88a992",
    "hls": [0.3838383838383838, 0.595703125, 0.15942028985507245]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.28.jpg",
  "colors": {
    "hex": "#7b9a8f",
    "hls": [0.44086021505376344, 0.541015625, 0.13191489361702127]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.29.jpg",
  "colors": {
    "hex": "#7c8995",
    "hls": [0.5800000000000001, 0.533203125, 0.10460251046025104]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.3.jpg",
  "colors": {
    "hex": "#8a827c",
    "hls": [0.07142857142857144, 0.51171875, 0.056]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.30.jpg",
  "colors": {
    "hex": "#9a8b8a",
    "hls": [0.010416666666666666, 0.5703125, 0.07272727272727272]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.31.jpg",
  "colors": {
    "hex": "#918684",
    "hls": [0.025641025641025644, 0.541015625, 0.05531914893617021]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.32.jpg",
  "colors": {
    "hex": "#a39998",
    "hls": [0.015151515151515157, 0.615234375, 0.05583756345177665]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.33.jpg",
  "colors": {
    "hex": "#998887",
    "hls": [0.009259259259259264, 0.5625, 0.08035714285714286]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.34.jpg",
  "colors": {
    "hex": "#81a586",
    "hls": [0.35648148148148145, 0.57421875, 0.1651376146788991]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.35.jpg",
  "colors": {
    "hex": "#95a383",
    "hls": [0.23958333333333334, 0.57421875, 0.14678899082568808]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.36.jpg",
  "colors": {
    "hex": "#84ac7f",
    "hls": [0.3148148148148148, 0.583984375, 0.2112676056338028]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.37.jpg",
  "colors": {
    "hex": "#8eae8b",
    "hls": [0.319047619047619, 0.611328125, 0.17587939698492464]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.38.jpg",
  "colors": {
    "hex": "#a6a187",
    "hls": [0.13978494623655915, 0.587890625, 0.14691943127962084]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.39.jpg",
  "colors": {
    "hex": "#899178",
    "hls": [0.21999999999999997, 0.517578125, 0.10121457489878542]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.4.jpg",
  "colors": {
    "hex": "#8e8380",
    "hls": [0.03571428571428572, 0.52734375, 0.05785123966942149]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.40.jpg",
  "colors": {
    "hex": "#8f8b84",
    "hls": [0.10606060606060606, 0.537109375, 0.046413502109704644]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.41.jpg",
  "colors": {
    "hex": "#9b9690",
    "hls": [0.0909090909090909, 0.583984375, 0.051643192488262914]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.42.jpg",
  "colors": {
    "hex": "#9f9a95",
    "hls": [0.08333333333333333, 0.6015625, 0.049019607843137254]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.43.jpg",
  "colors": {
    "hex": "#8a8581",
    "hls": [0.07407407407407407, 0.521484375, 0.036734693877551024]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.45.jpg",
  "colors": {
    "hex": "#a19591",
    "hls": [0.041666666666666664, 0.59765625, 0.07766990291262135]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.46.jpg",
  "colors": {
    "hex": "#9c8e86",
    "hls": [0.06060606060606061, 0.56640625, 0.0990990990990991]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.47.jpg",
  "colors": {
    "hex": "#918681",
    "hls": [0.052083333333333336, 0.53515625, 0.06722689075630252]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.48.jpg",
  "colors": {
    "hex": "#8b8078",
    "hls": [0.07017543859649122, 0.505859375, 0.07509881422924901]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.5.jpg",
  "colors": {
    "hex": "#94807f",
    "hls": [0.007936507936507945, 0.537109375, 0.08860759493670886]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.51.jpg",
  "colors": {
    "hex": "#90af86",
    "hls": [0.2926829268292683, 0.603515625, 0.2019704433497537]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.52.jpg",
  "colors": {
    "hex": "#afc2bb",
    "hls": [0.4385964912280702, 0.720703125, 0.13286713286713286]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.53.jpg",
  "colors": {
    "hex": "#84817b",
    "hls": [0.11111111111111112, 0.498046875, 0.03529411764705882]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.56.jpg",
  "colors": {
    "hex": "#86a883",
    "hls": [0.31981981981981983, 0.583984375, 0.17370892018779344]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.57.jpg",
  "colors": {
    "hex": "#87847f",
    "hls": [0.10416666666666667, 0.51171875, 0.032]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.58.jpg",
  "colors": {
    "hex": "#86837b",
    "hls": [0.12121212121212122, 0.501953125, 0.043137254901960784]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.59.jpg",
  "colors": {
    "hex": "#93918b",
    "hls": [0.125, 0.55859375, 0.035398230088495575]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.6.jpg",
  "colors": {
    "hex": "#8b7c79",
    "hls": [0.027777777777777773, 0.5078125, 0.07142857142857142]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.60.jpg",
  "colors": {
    "hex": "#938e88",
    "hls": [0.0909090909090909, 0.552734375, 0.048034934497816595]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.61.jpg",
  "colors": {
    "hex": "#93aa9f",
    "hls": [0.4202898550724638, 0.619140625, 0.11794871794871795]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.62.jpg",
  "colors": {
    "hex": "#96938c",
    "hls": [0.11666666666666665, 0.56640625, 0.04504504504504504]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.63.jpg",
  "colors": {
    "hex": "#84a093",
    "hls": [0.4226190476190476, 0.5703125, 0.12727272727272726]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.64.jpg",
  "colors": {
    "hex": "#819f82",
    "hls": [0.33888888888888885, 0.5625, 0.13392857142857142]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.65.jpg",
  "colors": {
    "hex": "#7e7671",
    "hls": [0.0641025641025641, 0.466796875, 0.05439330543933055]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.66.jpg",
  "colors": {
    "hex": "#90aa7f",
    "hls": [0.2674418604651163, 0.580078125, 0.2]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.67.jpg",
  "colors": {
    "hex": "#94a67e",
    "hls": [0.2416666666666667, 0.5703125, 0.18181818181818182]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.68.jpg",
  "colors": {
    "hex": "#92a57d",
    "hls": [0.24583333333333335, 0.56640625, 0.18018018018018017]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.69.jpg",
  "colors": {
    "hex": "#85949d",
    "hls": [0.5625, 0.56640625, 0.10810810810810811]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.7.jpg",
  "colors": {
    "hex": "#a7af95",
    "hls": [0.21794871794871792, 0.6328125, 0.13829787234042554]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.70.jpg",
  "colors": {
    "hex": "#888981",
    "hls": [0.1875, 0.51953125, 0.032520325203252036]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.71.jpg",
  "colors": {
    "hex": "#86827e",
    "hls": [0.08333333333333333, 0.5078125, 0.031746031746031744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.72.jpg",
  "colors": {
    "hex": "#938c84",
    "hls": [0.08888888888888889, 0.544921875, 0.06437768240343347]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.73.jpg",
  "colors": {
    "hex": "#857f76",
    "hls": [0.09999999999999999, 0.490234375, 0.05976095617529881]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.74.jpg",
  "colors": {
    "hex": "#85847c",
    "hls": [0.14814814814814814, 0.501953125, 0.03529411764705882]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.76.jpg",
  "colors": {
    "hex": "#a3b491",
    "hls": [0.24761904761904763, 0.634765625, 0.18716577540106952]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.77.jpg",
  "colors": {
    "hex": "#97b084",
    "hls": [0.2613636363636364, 0.6015625, 0.21568627450980393]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.78.jpg",
  "colors": {
    "hex": "#8aaf82",
    "hls": [0.30370370370370364, 0.595703125, 0.21739130434782608]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.79.jpg",
  "colors": {
    "hex": "#97938f",
    "hls": [0.08333333333333333, 0.57421875, 0.03669724770642202]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.8.jpg",
  "colors": {
    "hex": "#91b098",
    "hls": [0.3709677419354838, 0.626953125, 0.16230366492146597]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.80.jpg",
  "colors": {
    "hex": "#8d8a83",
    "hls": [0.11666666666666665, 0.53125, 0.041666666666666664]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.81.jpg",
  "colors": {
    "hex": "#95918f",
    "hls": [0.05555555555555556, 0.5703125, 0.02727272727272727]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.82.jpg",
  "colors": {
    "hex": "#8c8b83",
    "hls": [0.14814814814814814, 0.529296875, 0.03734439834024896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.83.jpg",
  "colors": {
    "hex": "#968c82",
    "hls": [0.08333333333333333, 0.546875, 0.08620689655172414]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.86.jpg",
  "colors": {
    "hex": "#93b284",
    "hls": [0.2789855072463768, 0.60546875, 0.22772277227722773]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.87.jpg",
  "colors": {
    "hex": "#9ab68f",
    "hls": [0.28632478632478636, 0.634765625, 0.20855614973262032]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.88.jpg",
  "colors": {
    "hex": "#8c8680",
    "hls": [0.08333333333333333, 0.5234375, 0.04918032786885246]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.89.jpg",
  "colors": {
    "hex": "#97928b",
    "hls": [0.09722222222222221, 0.56640625, 0.05405405405405406]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.9.jpg",
  "colors": {
    "hex": "#99b69f",
    "hls": [0.367816091954023, 0.654296875, 0.1638418079096045]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.90.jpg",
  "colors": {
    "hex": "#9f9283",
    "hls": [0.08928571428571429, 0.56640625, 0.12612612612612611]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.91.jpg",
  "colors": {
    "hex": "#8e8882",
    "hls": [0.08333333333333333, 0.53125, 0.05]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.92.jpg",
  "colors": {
    "hex": "#93908a",
    "hls": [0.11111111111111112, 0.556640625, 0.039647577092511016]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.93.jpg",
  "colors": {
    "hex": "#98958e",
    "hls": [0.11666666666666665, 0.57421875, 0.045871559633027525]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.94.jpg",
  "colors": {
    "hex": "#8c9182",
    "hls": [0.22222222222222224, 0.537109375, 0.06329113924050633]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.95.jpg",
  "colors": {
    "hex": "#908e89",
    "hls": [0.11904761904761905, 0.548828125, 0.030303030303030304]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.96.jpg",
  "colors": {
    "hex": "#89837d",
    "hls": [0.08333333333333333, 0.51171875, 0.048]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.97.jpg",
  "colors": {
    "hex": "#94a27f",
    "hls": [0.2333333333333333, 0.564453125, 0.15695067264573992]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.98.jpg",
  "colors": {
    "hex": "#adb398",
    "hls": [0.20370370370370372, 0.646484375, 0.14917127071823205]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D018.99.jpg",
  "colors": {
    "hex": "#91a080",
    "hls": [0.24479166666666666, 0.5625, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.10.jpg",
  "colors": {
    "hex": "#7f7b72",
    "hls": [0.11538461538461538, 0.470703125, 0.05394190871369295]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.100.jpg",
  "colors": {
    "hex": "#a0b593",
    "hls": [0.2696078431372549, 0.640625, 0.18478260869565216]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.101.jpg",
  "colors": {
    "hex": "#9bb19e",
    "hls": [0.356060606060606, 0.6484375, 0.12222222222222222]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.102.jpg",
  "colors": {
    "hex": "#8c9e8a",
    "hls": [0.31666666666666665, 0.578125, 0.09259259259259259]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.103.jpg",
  "colors": {
    "hex": "#80a189",
    "hls": [0.37878787878787873, 0.564453125, 0.14798206278026907]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.104.jpg",
  "colors": {
    "hex": "#80a084",
    "hls": [0.3541666666666667, 0.5625, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.105.jpg",
  "colors": {
    "hex": "#84a284",
    "hls": [0.3333333333333333, 0.57421875, 0.13761467889908258]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.106.jpg",
  "colors": {
    "hex": "#82a287",
    "hls": [0.359375, 0.5703125, 0.14545454545454545]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.107.jpg",
  "colors": {
    "hex": "#98ad82",
    "hls": [0.24806201550387597, 0.591796875, 0.20574162679425836]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.108.jpg",
  "colors": {
    "hex": "#88a38d",
    "hls": [0.36419753086419754, 0.583984375, 0.1267605633802817]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.109.jpg",
  "colors": {
    "hex": "#85a885",
    "hls": [0.3333333333333333, 0.587890625, 0.16587677725118483]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.11.jpg",
  "colors": {
    "hex": "#7a7b75",
    "hls": [0.19444444444444442, 0.46875, 0.025]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.110.jpg",
  "colors": {
    "hex": "#a1a980",
    "hls": [0.19918699186991873, 0.580078125, 0.19069767441860466]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.111.jpg",
  "colors": {
    "hex": "#83a895",
    "hls": [0.4144144144144144, 0.583984375, 0.17370892018779344]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.112.jpg",
  "colors": {
    "hex": "#919b80",
    "hls": [0.22839506172839505, 0.552734375, 0.11790393013100436]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.113.jpg",
  "colors": {
    "hex": "#a2b699",
    "hls": [0.28160919540229884, 0.654296875, 0.1638418079096045]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.117.jpg",
  "colors": {
    "hex": "#8ea28c",
    "hls": [0.3181818181818182, 0.58984375, 0.10476190476190476]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.12.jpg",
  "colors": {
    "hex": "#87837a",
    "hls": [0.11538461538461538, 0.501953125, 0.050980392156862744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.13.jpg",
  "colors": {
    "hex": "#7f7c74",
    "hls": [0.12121212121212122, 0.474609375, 0.04526748971193416]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.14.jpg",
  "colors": {
    "hex": "#86827d",
    "hls": [0.0925925925925926, 0.505859375, 0.03557312252964427]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.15.jpg",
  "colors": {
    "hex": "#8a8680",
    "hls": [0.09999999999999999, 0.51953125, 0.04065040650406504]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.16.jpg",
  "colors": {
    "hex": "#867f79",
    "hls": [0.07692307692307693, 0.498046875, 0.050980392156862744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.17.jpg",
  "colors": {
    "hex": "#908c82",
    "hls": [0.11904761904761905, 0.53515625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.18.jpg",
  "colors": {
    "hex": "#998b81",
    "hls": [0.06944444444444443, 0.55078125, 0.10434782608695652]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.19.jpg",
  "colors": {
    "hex": "#89867d",
    "hls": [0.125, 0.51171875, 0.048]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.2.jpg",
  "colors": {
    "hex": "#8e867d",
    "hls": [0.08823529411764706, 0.521484375, 0.06938775510204082]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.20.jpg",
  "colors": {
    "hex": "#9c9088",
    "hls": [0.06666666666666667, 0.5703125, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.22.jpg",
  "colors": {
    "hex": "#8c8982",
    "hls": [0.11666666666666665, 0.52734375, 0.04132231404958678]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.23.jpg",
  "colors": {
    "hex": "#8d8a84",
    "hls": [0.11111111111111112, 0.533203125, 0.03765690376569038]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.24.jpg",
  "colors": {
    "hex": "#958a81",
    "hls": [0.075, 0.54296875, 0.08547008547008547]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.25.jpg",
  "colors": {
    "hex": "#8f8680",
    "hls": [0.06666666666666667, 0.529296875, 0.06224066390041494]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.26.jpg",
  "colors": {
    "hex": "#908b82",
    "hls": [0.10714285714285714, 0.53515625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.27.jpg",
  "colors": {
    "hex": "#877f78",
    "hls": [0.07777777777777778, 0.498046875, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.28.jpg",
  "colors": {
    "hex": "#908782",
    "hls": [0.059523809523809514, 0.53515625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.29.jpg",
  "colors": {
    "hex": "#87887e",
    "hls": [0.18333333333333335, 0.51171875, 0.04]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.30.jpg",
  "colors": {
    "hex": "#928881",
    "hls": [0.06862745098039215, 0.537109375, 0.07172995780590717]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.31.jpg",
  "colors": {
    "hex": "#89817b",
    "hls": [0.07142857142857144, 0.5078125, 0.05555555555555555]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.32.jpg",
  "colors": {
    "hex": "#938a85",
    "hls": [0.059523809523809514, 0.546875, 0.0603448275862069]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.33.jpg",
  "colors": {
    "hex": "#8c8a85",
    "hls": [0.11904761904761905, 0.533203125, 0.029288702928870293]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.34.jpg",
  "colors": {
    "hex": "#a1908d",
    "hls": [0.025000000000000005, 0.58984375, 0.09523809523809523]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.35.jpg",
  "colors": {
    "hex": "#8d7f7a",
    "hls": [0.04385964912280702, 0.513671875, 0.07630522088353414]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.36.jpg",
  "colors": {
    "hex": "#93827d",
    "hls": [0.03787878787878788, 0.53125, 0.09166666666666666]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.37.jpg",
  "colors": {
    "hex": "#96827c",
    "hls": [0.03846153846153846, 0.53515625, 0.1092436974789916]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.38.jpg",
  "colors": {
    "hex": "#7c7674",
    "hls": [0.041666666666666664, 0.46875, 0.03333333333333333]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.39.jpg",
  "colors": {
    "hex": "#7c7973",
    "hls": [0.11111111111111112, 0.466796875, 0.03765690376569038]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.40.jpg",
  "colors": {
    "hex": "#857e79",
    "hls": [0.06944444444444443, 0.49609375, 0.047244094488188976]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.41.jpg",
  "colors": {
    "hex": "#9b8f87",
    "hls": [0.06666666666666667, 0.56640625, 0.09009009009009009]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.42.jpg",
  "colors": {
    "hex": "#91867e",
    "hls": [0.07017543859649122, 0.529296875, 0.07883817427385892]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.43.jpg",
  "colors": {
    "hex": "#827e76",
    "hls": [0.11111111111111112, 0.484375, 0.04838709677419355]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.44.jpg",
  "colors": {
    "hex": "#91867e",
    "hls": [0.07017543859649122, 0.529296875, 0.07883817427385892]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.45.jpg",
  "colors": {
    "hex": "#7b8472",
    "hls": [0.25, 0.48046875, 0.07317073170731707]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.46.jpg",
  "colors": {
    "hex": "#817d75",
    "hls": [0.11111111111111112, 0.48046875, 0.04878048780487805]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.47.jpg",
  "colors": {
    "hex": "#818678",
    "hls": [0.2261904761904762, 0.49609375, 0.05511811023622047]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.48.jpg",
  "colors": {
    "hex": "#7c7e7c",
    "hls": [0.3333333333333333, 0.48828125, 0.008]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.49.jpg",
  "colors": {
    "hex": "#9a8f79",
    "hls": [0.11111111111111112, 0.537109375, 0.13924050632911392]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.5.jpg",
  "colors": {
    "hex": "#989792",
    "hls": [0.1388888888888889, 0.58203125, 0.028037383177570093]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.50.jpg",
  "colors": {
    "hex": "#968b86",
    "hls": [0.052083333333333336, 0.5546875, 0.07017543859649122]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.51.jpg",
  "colors": {
    "hex": "#8e8a86",
    "hls": [0.08333333333333333, 0.5390625, 0.03389830508474576]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.52.jpg",
  "colors": {
    "hex": "#88827e",
    "hls": [0.06666666666666667, 0.51171875, 0.04]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.53.jpg",
  "colors": {
    "hex": "#a79995",
    "hls": [0.037037037037037035, 0.6171875, 0.09183673469387756]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.54.jpg",
  "colors": {
    "hex": "#a6918d",
    "hls": [0.026666666666666672, 0.599609375, 0.12195121951219512]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.55.jpg",
  "colors": {
    "hex": "#848077",
    "hls": [0.11538461538461538, 0.490234375, 0.05179282868525897]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.56.jpg",
  "colors": {
    "hex": "#9f9082",
    "hls": [0.08045977011494253, 0.564453125, 0.13004484304932734]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.57.jpg",
  "colors": {
    "hex": "#8a8a80",
    "hls": [0.16666666666666666, 0.51953125, 0.04065040650406504]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.58.jpg",
  "colors": {
    "hex": "#888279",
    "hls": [0.09999999999999999, 0.501953125, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.59.jpg",
  "colors": {
    "hex": "#8a827a",
    "hls": [0.08333333333333333, 0.5078125, 0.06349206349206349]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.6.jpg",
  "colors": {
    "hex": "#7f7d79",
    "hls": [0.11111111111111112, 0.484375, 0.024193548387096774]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.60.jpg",
  "colors": {
    "hex": "#85847e",
    "hls": [0.14285714285714288, 0.505859375, 0.02766798418972332]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.61.jpg",
  "colors": {
    "hex": "#8a8882",
    "hls": [0.125, 0.5234375, 0.03278688524590164]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.62.jpg",
  "colors": {
    "hex": "#8c8681",
    "hls": [0.07575757575757576, 0.525390625, 0.04526748971193416]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.63.jpg",
  "colors": {
    "hex": "#85827d",
    "hls": [0.10416666666666667, 0.50390625, 0.031496062992125984]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.64.jpg",
  "colors": {
    "hex": "#b4a69a",
    "hls": [0.07692307692307693, 0.65234375, 0.14606741573033707]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.65.jpg",
  "colors": {
    "hex": "#8c847f",
    "hls": [0.0641025641025641, 0.521484375, 0.053061224489795916]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.66.jpg",
  "colors": {
    "hex": "#82897b",
    "hls": [0.25, 0.5078125, 0.05555555555555555]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.67.jpg",
  "colors": {
    "hex": "#868a81",
    "hls": [0.24074074074074078, 0.521484375, 0.036734693877551024]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.68.jpg",
  "colors": {
    "hex": "#8c8b7f",
    "hls": [0.15384615384615385, 0.521484375, 0.053061224489795916]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.69.jpg",
  "colors": {
    "hex": "#807c7a",
    "hls": [0.05555555555555556, 0.48828125, 0.024]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.7.jpg",
  "colors": {
    "hex": "#85867d",
    "hls": [0.1851851851851852, 0.505859375, 0.03557312252964427]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.70.jpg",
  "colors": {
    "hex": "#868282",
    "hls": [0, 0.515625, 0.016129032258064516]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.71.jpg",
  "colors": {
    "hex": "#877e7c",
    "hls": [0.030303030303030293, 0.505859375, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.72.jpg",
  "colors": {
    "hex": "#8bad7e",
    "hls": [0.28723404255319146, 0.583984375, 0.22065727699530516]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.73.jpg",
  "colors": {
    "hex": "#96ae7c",
    "hls": [0.24666666666666667, 0.58203125, 0.2336448598130841]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.74.jpg",
  "colors": {
    "hex": "#94b48e",
    "hls": [0.30701754385964913, 0.62890625, 0.2]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.76.jpg",
  "colors": {
    "hex": "#809882",
    "hls": [0.34722222222222227, 0.546875, 0.10344827586206896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.77.jpg",
  "colors": {
    "hex": "#91ad85",
    "hls": [0.2833333333333334, 0.59765625, 0.1941747572815534]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.78.jpg",
  "colors": {
    "hex": "#7e908e",
    "hls": [0.48148148148148145, 0.52734375, 0.0743801652892562]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.79.jpg",
  "colors": {
    "hex": "#908880",
    "hls": [0.08333333333333333, 0.53125, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.8.jpg",
  "colors": {
    "hex": "#86867f",
    "hls": [0.16666666666666666, 0.509765625, 0.027888446215139442]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.80.jpg",
  "colors": {
    "hex": "#908982",
    "hls": [0.08333333333333333, 0.53515625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.81.jpg",
  "colors": {
    "hex": "#978e87",
    "hls": [0.07291666666666667, 0.55859375, 0.07079646017699115]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.82.jpg",
  "colors": {
    "hex": "#ada2a0",
    "hls": [0.025641025641025644, 0.650390625, 0.07262569832402235]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.83.jpg",
  "colors": {
    "hex": "#86827d",
    "hls": [0.0925925925925926, 0.505859375, 0.03557312252964427]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.84.jpg",
  "colors": {
    "hex": "#9c9c98",
    "hls": [0.16666666666666666, 0.6015625, 0.0196078431372549]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.87.jpg",
  "colors": {
    "hex": "#8bb08e",
    "hls": [0.34684684684684686, 0.615234375, 0.18781725888324874]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.88.jpg",
  "colors": {
    "hex": "#9da37f",
    "hls": [0.19444444444444442, 0.56640625, 0.16216216216216217]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.89.jpg",
  "colors": {
    "hex": "#80a882",
    "hls": [0.3416666666666666, 0.578125, 0.18518518518518517]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.9.jpg",
  "colors": {
    "hex": "#84877d",
    "hls": [0.21666666666666665, 0.5078125, 0.03968253968253968]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.90.jpg",
  "colors": {
    "hex": "#88a37c",
    "hls": [0.2820512820512821, 0.560546875, 0.17333333333333334]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.92.jpg",
  "colors": {
    "hex": "#88af87",
    "hls": [0.32916666666666666, 0.60546875, 0.19801980198019803]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.93.jpg",
  "colors": {
    "hex": "#9bae87",
    "hls": [0.24786324786324787, 0.603515625, 0.1921182266009852]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.94.jpg",
  "colors": {
    "hex": "#9cb087",
    "hls": [0.24796747967479674, 0.607421875, 0.20398009950248755]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.95.jpg",
  "colors": {
    "hex": "#8cac82",
    "hls": [0.29365079365079366, 0.58984375, 0.2]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.96.jpg",
  "colors": {
    "hex": "#bbb39f",
    "hls": [0.11904761904761905, 0.67578125, 0.1686746987951807]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.97.jpg",
  "colors": {
    "hex": "#8ba17a",
    "hls": [0.26068376068376065, 0.552734375, 0.1703056768558952]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.98.jpg",
  "colors": {
    "hex": "#8c9777",
    "hls": [0.22395833333333334, 0.52734375, 0.1322314049586777]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D019.99.jpg",
  "colors": {
    "hex": "#b2bda3",
    "hls": [0.23717948717948714, 0.6875, 0.1625]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.10.jpg",
  "colors": {
    "hex": "#84af85",
    "hls": [0.3372093023255814, 0.599609375, 0.2097560975609756]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.11.jpg",
  "colors": {
    "hex": "#99ae80",
    "hls": [0.24275362318840576, 0.58984375, 0.21904761904761905]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.12.jpg",
  "colors": {
    "hex": "#9c9c7c",
    "hls": [0.16666666666666666, 0.546875, 0.13793103448275862]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.13.jpg",
  "colors": {
    "hex": "#7f9d92",
    "hls": [0.4388888888888889, 0.5546875, 0.13157894736842105]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.14.jpg",
  "colors": {
    "hex": "#7b9b89",
    "hls": [0.40625, 0.54296875, 0.13675213675213677]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.15.jpg",
  "colors": {
    "hex": "#8ca989",
    "hls": [0.3177083333333333, 0.59765625, 0.1553398058252427]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.16.jpg",
  "colors": {
    "hex": "#8fa4a5",
    "hls": [0.5075757575757577, 0.6015625, 0.10784313725490197]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.17.jpg",
  "colors": {
    "hex": "#7d8d77",
    "hls": [0.2878787878787879, 0.5078125, 0.0873015873015873]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.18.jpg",
  "colors": {
    "hex": "#78978d",
    "hls": [0.44623655913978494, 0.529296875, 0.12863070539419086]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.19.jpg",
  "colors": {
    "hex": "#a1b28a",
    "hls": [0.23749999999999996, 0.6171875, 0.20408163265306123]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.20.jpg",
  "colors": {
    "hex": "#8b9f97",
    "hls": [0.43333333333333335, 0.58203125, 0.09345794392523364]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.21.jpg",
  "colors": {
    "hex": "#92a889",
    "hls": [0.2849462365591398, 0.595703125, 0.1497584541062802]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.22.jpg",
  "colors": {
    "hex": "#81a28e",
    "hls": [0.398989898989899, 0.568359375, 0.1493212669683258]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.23.jpg",
  "colors": {
    "hex": "#76908c",
    "hls": [0.4743589743589744, 0.51171875, 0.104]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.24.jpg",
  "colors": {
    "hex": "#89a789",
    "hls": [0.3333333333333333, 0.59375, 0.14423076923076922]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.25.jpg",
  "colors": {
    "hex": "#98ad86",
    "hls": [0.2564102564102564, 0.599609375, 0.1902439024390244]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.26.jpg",
  "colors": {
    "hex": "#919ca2",
    "hls": [0.5588235294117646, 0.599609375, 0.08292682926829269]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.27.jpg",
  "colors": {
    "hex": "#9cb997",
    "hls": [0.3088235294117647, 0.65625, 0.19318181818181818]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.28.jpg",
  "colors": {
    "hex": "#7d9989",
    "hls": [0.4047619047619048, 0.54296875, 0.11965811965811966]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.29.jpg",
  "colors": {
    "hex": "#8daf89",
    "hls": [0.31578947368421056, 0.609375, 0.19]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.3.jpg",
  "colors": {
    "hex": "#a8b9a6",
    "hls": [0.31578947368421056, 0.685546875, 0.11801242236024845]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.30.jpg",
  "colors": {
    "hex": "#a2a8a6",
    "hls": [0.4444444444444444, 0.64453125, 0.03296703296703297]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.31.jpg",
  "colors": {
    "hex": "#84a88e",
    "hls": [0.3796296296296296, 0.5859375, 0.16981132075471697]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.32.jpg",
  "colors": {
    "hex": "#849c97",
    "hls": [0.46527777777777773, 0.5625, 0.10714285714285714]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.34.jpg",
  "colors": {
    "hex": "#9eae8d",
    "hls": [0.2474747474747475, 0.615234375, 0.16751269035532995]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.35.jpg",
  "colors": {
    "hex": "#8aa885",
    "hls": [0.30952380952380953, 0.587890625, 0.16587677725118483]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.38.jpg",
  "colors": {
    "hex": "#99af8d",
    "hls": [0.2745098039215686, 0.6171875, 0.17346938775510204]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.4.jpg",
  "colors": {
    "hex": "#95b28b",
    "hls": [0.2905982905982906, 0.619140625, 0.2]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.40.jpg",
  "colors": {
    "hex": "#99a98a",
    "hls": [0.25268817204301075, 0.599609375, 0.15121951219512195]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.41.jpg",
  "colors": {
    "hex": "#8ead7f",
    "hls": [0.2789855072463768, 0.5859375, 0.2169811320754717]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.42.jpg",
  "colors": {
    "hex": "#91ac8a",
    "hls": [0.29901960784313725, 0.60546875, 0.16831683168316833]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.43.jpg",
  "colors": {
    "hex": "#9caf8b",
    "hls": [0.2546296296296296, 0.61328125, 0.18181818181818182]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.44.jpg",
  "colors": {
    "hex": "#92b696",
    "hls": [0.35185185185185186, 0.640625, 0.1956521739130435]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.46.jpg",
  "colors": {
    "hex": "#86af87",
    "hls": [0.33739837398373984, 0.603515625, 0.2019704433497537]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.48.jpg",
  "colors": {
    "hex": "#a8aa8f",
    "hls": [0.17901234567901234, 0.611328125, 0.135678391959799]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.49.jpg",
  "colors": {
    "hex": "#89a68f",
    "hls": [0.367816091954023, 0.591796875, 0.13875598086124402]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.5.jpg",
  "colors": {
    "hex": "#95b090",
    "hls": [0.3072916666666667, 0.625, 0.16666666666666666]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.51.jpg",
  "colors": {
    "hex": "#83af81",
    "hls": [0.3260869565217391, 0.59375, 0.22115384615384615]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.52.jpg",
  "colors": {
    "hex": "#849d91",
    "hls": [0.42, 0.564453125, 0.11210762331838565]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.53.jpg",
  "colors": {
    "hex": "#c8d4c8",
    "hls": [0.3333333333333333, 0.8046875, 0.12]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.55.jpg",
  "colors": {
    "hex": "#9aac8a",
    "hls": [0.2549019607843137, 0.60546875, 0.16831683168316833]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.56.jpg",
  "colors": {
    "hex": "#85a286",
    "hls": [0.3390804597701149, 0.576171875, 0.1336405529953917]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.57.jpg",
  "colors": {
    "hex": "#7ea87f",
    "hls": [0.33730158730158727, 0.57421875, 0.1926605504587156]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.58.jpg",
  "colors": {
    "hex": "#81a87e",
    "hls": [0.32142857142857145, 0.57421875, 0.1926605504587156]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.59.jpg",
  "colors": {
    "hex": "#86ab84",
    "hls": [0.3247863247863248, 0.591796875, 0.18660287081339713]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.6.jpg",
  "colors": {
    "hex": "#b1c2a8",
    "hls": [0.2756410256410256, 0.70703125, 0.17333333333333334]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.60.jpg",
  "colors": {
    "hex": "#99a77f",
    "hls": [0.225, 0.57421875, 0.1834862385321101]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.61.jpg",
  "colors": {
    "hex": "#7d9289",
    "hls": [0.4285714285714286, 0.529296875, 0.08713692946058091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.62.jpg",
  "colors": {
    "hex": "#9db7a2",
    "hls": [0.3653846153846154, 0.6640625, 0.1511627906976744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.63.jpg",
  "colors": {
    "hex": "#96a890",
    "hls": [0.2916666666666667, 0.609375, 0.12]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.64.jpg",
  "colors": {
    "hex": "#89a48c",
    "hls": [0.35185185185185186, 0.587890625, 0.12796208530805686]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.65.jpg",
  "colors": {
    "hex": "#99af88",
    "hls": [0.26068376068376065, 0.607421875, 0.19402985074626866]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.7.jpg",
  "colors": {
    "hex": "#90aa7f",
    "hls": [0.2674418604651163, 0.580078125, 0.2]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.8.jpg",
  "colors": {
    "hex": "#8faf8b",
    "hls": [0.3148148148148148, 0.61328125, 0.18181818181818182]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D020.9.jpg",
  "colors": {
    "hex": "#9ab485",
    "hls": [0.2588652482269504, 0.611328125, 0.23618090452261306]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.100.jpg",
  "colors": {
    "hex": "#908c76",
    "hls": [0.14102564102564102, 0.51171875, 0.104]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.11.jpg",
  "colors": {
    "hex": "#8a887b",
    "hls": [0.14444444444444446, 0.509765625, 0.05976095617529881]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.12.jpg",
  "colors": {
    "hex": "#9b9b8f",
    "hls": [0.16666666666666666, 0.58203125, 0.056074766355140186]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.14.jpg",
  "colors": {
    "hex": "#8b8975",
    "hls": [0.15151515151515152, 0.5, 0.0859375]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.15.jpg",
  "colors": {
    "hex": "#8a8c7d",
    "hls": [0.18888888888888888, 0.517578125, 0.06072874493927125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.17.jpg",
  "colors": {
    "hex": "#a1a294",
    "hls": [0.1785714285714286, 0.60546875, 0.06930693069306931]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.18.jpg",
  "colors": {
    "hex": "#949281",
    "hls": [0.14912280701754385, 0.541015625, 0.08085106382978724]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.19.jpg",
  "colors": {
    "hex": "#989683",
    "hls": [0.15079365079365079, 0.552734375, 0.09170305676855896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.2.jpg",
  "colors": {
    "hex": "#9d9c8b",
    "hls": [0.1574074074074074, 0.578125, 0.08333333333333333]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.21.jpg",
  "colors": {
    "hex": "#8b8774",
    "hls": [0.13768115942028986, 0.498046875, 0.09019607843137255]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.22.jpg",
  "colors": {
    "hex": "#888a77",
    "hls": [0.18421052631578946, 0.501953125, 0.07450980392156863]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.23.jpg",
  "colors": {
    "hex": "#7f8172",
    "hls": [0.18888888888888888, 0.474609375, 0.06172839506172839]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.24.jpg",
  "colors": {
    "hex": "#878978",
    "hls": [0.18627450980392157, 0.501953125, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.26.jpg",
  "colors": {
    "hex": "#868176",
    "hls": [0.11458333333333333, 0.4921875, 0.06349206349206349]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.27.jpg",
  "colors": {
    "hex": "#87887d",
    "hls": [0.1818181818181818, 0.509765625, 0.043824701195219126]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.28.jpg",
  "colors": {
    "hex": "#98978b",
    "hls": [0.15384615384615385, 0.568359375, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.29.jpg",
  "colors": {
    "hex": "#8d8d7e",
    "hls": [0.16666666666666666, 0.521484375, 0.061224489795918366]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.3.jpg",
  "colors": {
    "hex": "#9d9d8f",
    "hls": [0.16666666666666666, 0.5859375, 0.0660377358490566]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.30.jpg",
  "colors": {
    "hex": "#858476",
    "hls": [0.15555555555555556, 0.490234375, 0.05976095617529881]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.31.jpg",
  "colors": {
    "hex": "#8c8d7f",
    "hls": [0.1785714285714286, 0.5234375, 0.05737704918032787]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.32.jpg",
  "colors": {
    "hex": "#9e9d89",
    "hls": [0.15873015873015872, 0.576171875, 0.0967741935483871]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.33.jpg",
  "colors": {
    "hex": "#9d9c8c",
    "hls": [0.1568627450980392, 0.580078125, 0.07906976744186046]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.35.jpg",
  "colors": {
    "hex": "#97978a",
    "hls": [0.16666666666666666, 0.564453125, 0.05829596412556054]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.36.jpg",
  "colors": {
    "hex": "#8c8c7c",
    "hls": [0.16666666666666666, 0.515625, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.37.jpg",
  "colors": {
    "hex": "#9b9b89",
    "hls": [0.16666666666666666, 0.5703125, 0.08181818181818182]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.38.jpg",
  "colors": {
    "hex": "#8a8979",
    "hls": [0.1568627450980392, 0.505859375, 0.06719367588932806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.39.jpg",
  "colors": {
    "hex": "#9d9c83",
    "hls": [0.16025641025641027, 0.5625, 0.11607142857142858]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.4.jpg",
  "colors": {
    "hex": "#a4a48f",
    "hls": [0.16666666666666666, 0.599609375, 0.1024390243902439]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.40.jpg",
  "colors": {
    "hex": "#91927d",
    "hls": [0.17460317460317457, 0.529296875, 0.08713692946058091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.41.jpg",
  "colors": {
    "hex": "#9a977c",
    "hls": [0.15, 0.54296875, 0.1282051282051282]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.42.jpg",
  "colors": {
    "hex": "#909282",
    "hls": [0.1875, 0.5390625, 0.06779661016949153]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.43.jpg",
  "colors": {
    "hex": "#818075",
    "hls": [0.15277777777777776, 0.48046875, 0.04878048780487805]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.44.jpg",
  "colors": {
    "hex": "#7c7b6c",
    "hls": [0.15625, 0.453125, 0.06896551724137931]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.45.jpg",
  "colors": {
    "hex": "#90907b",
    "hls": [0.16666666666666666, 0.521484375, 0.08571428571428572]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.46.jpg",
  "colors": {
    "hex": "#93917f",
    "hls": [0.15, 0.53515625, 0.08403361344537816]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.47.jpg",
  "colors": {
    "hex": "#989683",
    "hls": [0.15079365079365079, 0.552734375, 0.09170305676855896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.48.jpg",
  "colors": {
    "hex": "#908f7f",
    "hls": [0.1568627450980392, 0.529296875, 0.07053941908713693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.51.jpg",
  "colors": {
    "hex": "#9d9a89",
    "hls": [0.14166666666666666, 0.57421875, 0.09174311926605505]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.54.jpg",
  "colors": {
    "hex": "#919489",
    "hls": [0.21212121212121207, 0.556640625, 0.048458149779735685]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.55.jpg",
  "colors": {
    "hex": "#979684",
    "hls": [0.15789473684210528, 0.552734375, 0.08296943231441048]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.56.jpg",
  "colors": {
    "hex": "#92907f",
    "hls": [0.14912280701754385, 0.533203125, 0.0794979079497908]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.58.jpg",
  "colors": {
    "hex": "#a1a18c",
    "hls": [0.16666666666666666, 0.587890625, 0.0995260663507109]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.59.jpg",
  "colors": {
    "hex": "#959581",
    "hls": [0.16666666666666666, 0.54296875, 0.08547008547008547]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.6.jpg",
  "colors": {
    "hex": "#a2a094",
    "hls": [0.14285714285714288, 0.60546875, 0.06930693069306931]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.60.jpg",
  "colors": {
    "hex": "#a2a28f",
    "hls": [0.16666666666666666, 0.595703125, 0.09178743961352658]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.61.jpg",
  "colors": {
    "hex": "#9a9b88",
    "hls": [0.1754385964912281, 0.568359375, 0.08597285067873303]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.63.jpg",
  "colors": {
    "hex": "#9a9782",
    "hls": [0.14583333333333334, 0.5546875, 0.10526315789473684]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.64.jpg",
  "colors": {
    "hex": "#969883",
    "hls": [0.18253968253968256, 0.552734375, 0.09170305676855896]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.65.jpg",
  "colors": {
    "hex": "#8f907e",
    "hls": [0.1759259259259259, 0.52734375, 0.0743801652892562]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.66.jpg",
  "colors": {
    "hex": "#989585",
    "hls": [0.14035087719298245, 0.556640625, 0.08370044052863436]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.67.jpg",
  "colors": {
    "hex": "#9f9e89",
    "hls": [0.1590909090909091, 0.578125, 0.10185185185185185]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.68.jpg",
  "colors": {
    "hex": "#8e8f7c",
    "hls": [0.1754385964912281, 0.521484375, 0.07755102040816327]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.69.jpg",
  "colors": {
    "hex": "#979682",
    "hls": [0.15873015873015872, 0.548828125, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.7.jpg",
  "colors": {
    "hex": "#828071",
    "hls": [0.14705882352941177, 0.474609375, 0.06995884773662552]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.70.jpg",
  "colors": {
    "hex": "#a6a393",
    "hls": [0.14035087719298245, 0.611328125, 0.09547738693467336]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.71.jpg",
  "colors": {
    "hex": "#8c8a7c",
    "hls": [0.14583333333333334, 0.515625, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.72.jpg",
  "colors": {
    "hex": "#908f7b",
    "hls": [0.15873015873015872, 0.521484375, 0.08571428571428572]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.73.jpg",
  "colors": {
    "hex": "#99978b",
    "hls": [0.14285714285714288, 0.5703125, 0.06363636363636363]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.74.jpg",
  "colors": {
    "hex": "#8b887a",
    "hls": [0.1372549019607843, 0.509765625, 0.06772908366533864]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.75.jpg",
  "colors": {
    "hex": "#908f78",
    "hls": [0.15972222222222224, 0.515625, 0.0967741935483871]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.76.jpg",
  "colors": {
    "hex": "#9f9d8d",
    "hls": [0.14814814814814814, 0.5859375, 0.08490566037735849]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.77.jpg",
  "colors": {
    "hex": "#90907f",
    "hls": [0.16666666666666666, 0.529296875, 0.07053941908713693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.78.jpg",
  "colors": {
    "hex": "#9e9f89",
    "hls": [0.17424242424242423, 0.578125, 0.10185185185185185]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.79.jpg",
  "colors": {
    "hex": "#8f8e7e",
    "hls": [0.1568627450980392, 0.525390625, 0.06995884773662552]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.8.jpg",
  "colors": {
    "hex": "#8c8c7d",
    "hls": [0.16666666666666666, 0.517578125, 0.06072874493927125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.80.jpg",
  "colors": {
    "hex": "#8a8875",
    "hls": [0.15079365079365079, 0.498046875, 0.08235294117647059]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.81.jpg",
  "colors": {
    "hex": "#92917d",
    "hls": [0.15873015873015872, 0.529296875, 0.08713692946058091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.82.jpg",
  "colors": {
    "hex": "#9b9980",
    "hls": [0.15432098765432098, 0.552734375, 0.11790393013100436]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.83.jpg",
  "colors": {
    "hex": "#92907c",
    "hls": [0.15151515151515152, 0.52734375, 0.09090909090909091]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.84.jpg",
  "colors": {
    "hex": "#a2a195",
    "hls": [0.15384615384615385, 0.607421875, 0.06467661691542288]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.85.jpg",
  "colors": {
    "hex": "#a1a08f",
    "hls": [0.1574074074074074, 0.59375, 0.08653846153846154]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.86.jpg",
  "colors": {
    "hex": "#a09f94",
    "hls": [0.15277777777777776, 0.6015625, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.87.jpg",
  "colors": {
    "hex": "#8c8a78",
    "hls": [0.15, 0.5078125, 0.07936507936507936]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.88.jpg",
  "colors": {
    "hex": "#9d9b8d",
    "hls": [0.14583333333333334, 0.58203125, 0.07476635514018691]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.89.jpg",
  "colors": {
    "hex": "#848174",
    "hls": [0.13541666666666666, 0.484375, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.90.jpg",
  "colors": {
    "hex": "#a39c84",
    "hls": [0.12903225806451613, 0.576171875, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.91.jpg",
  "colors": {
    "hex": "#8d8d7a",
    "hls": [0.16666666666666666, 0.513671875, 0.07630522088353414]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.93.jpg",
  "colors": {
    "hex": "#95907c",
    "hls": [0.13333333333333333, 0.533203125, 0.10460251046025104]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.94.jpg",
  "colors": {
    "hex": "#8c8672",
    "hls": [0.1282051282051282, 0.49609375, 0.10236220472440945]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.95.jpg",
  "colors": {
    "hex": "#a9a591",
    "hls": [0.1388888888888889, 0.61328125, 0.12121212121212122]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.96.jpg",
  "colors": {
    "hex": "#908d7e",
    "hls": [0.1388888888888889, 0.52734375, 0.0743801652892562]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.97.jpg",
  "colors": {
    "hex": "#989782",
    "hls": [0.1590909090909091, 0.55078125, 0.09565217391304348]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.98.jpg",
  "colors": {
    "hex": "#87877a",
    "hls": [0.16666666666666666, 0.501953125, 0.050980392156862744]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D023.99.jpg",
  "colors": {
    "hex": "#949181",
    "hls": [0.14035087719298245, 0.541015625, 0.08085106382978724]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.10.jpg",
  "colors": {
    "hex": "#8e827f",
    "hls": [0.033333333333333326, 0.525390625, 0.06172839506172839]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.101.jpg",
  "colors": {
    "hex": "#7e7373",
    "hls": [0, 0.470703125, 0.04564315352697095]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.104.jpg",
  "colors": {
    "hex": "#847a77",
    "hls": [0.03846153846153846, 0.490234375, 0.05179282868525897]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.105.jpg",
  "colors": {
    "hex": "#7f7574",
    "hls": [0.015151515151515157, 0.474609375, 0.04526748971193416]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.106.jpg",
  "colors": {
    "hex": "#887b77",
    "hls": [0.03921568627450981, 0.498046875, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.107.jpg",
  "colors": {
    "hex": "#82746f",
    "hls": [0.04385964912280702, 0.470703125, 0.07883817427385892]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.108.jpg",
  "colors": {
    "hex": "#847974",
    "hls": [0.052083333333333336, 0.484375, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.109.jpg",
  "colors": {
    "hex": "#887e7a",
    "hls": [0.047619047619047616, 0.50390625, 0.05511811023622047]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.11.jpg",
  "colors": {
    "hex": "#8f7c74",
    "hls": [0.04938271604938271, 0.505859375, 0.1067193675889328]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.110.jpg",
  "colors": {
    "hex": "#99867f",
    "hls": [0.04487179487179488, 0.546875, 0.11206896551724138]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.111.jpg",
  "colors": {
    "hex": "#89807e",
    "hls": [0.030303030303030293, 0.513671875, 0.04417670682730924]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.112.jpg",
  "colors": {
    "hex": "#8b7e7b",
    "hls": [0.03125, 0.51171875, 0.064]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.113.jpg",
  "colors": {
    "hex": "#847775",
    "hls": [0.022222222222222216, 0.486328125, 0.060240963855421686]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.114.jpg",
  "colors": {
    "hex": "#a38c7c",
    "hls": [0.06837606837606837, 0.560546875, 0.17333333333333334]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.115.jpg",
  "colors": {
    "hex": "#847772",
    "hls": [0.0462962962962963, 0.48046875, 0.07317073170731707]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.116.jpg",
  "colors": {
    "hex": "#7b7373",
    "hls": [0, 0.46484375, 0.03361344537815126]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.117.jpg",
  "colors": {
    "hex": "#998377",
    "hls": [0.0588235294117647, 0.53125, 0.14166666666666666]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.118.jpg",
  "colors": {
    "hex": "#94837b",
    "hls": [0.05333333333333332, 0.529296875, 0.1037344398340249]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.119.jpg",
  "colors": {
    "hex": "#93827b",
    "hls": [0.048611111111111105, 0.52734375, 0.09917355371900827]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.12.jpg",
  "colors": {
    "hex": "#8f7e76",
    "hls": [0.05333333333333332, 0.509765625, 0.099601593625498]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.120.jpg",
  "colors": {
    "hex": "#887b76",
    "hls": [0.0462962962962963, 0.49609375, 0.07086614173228346]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.121.jpg",
  "colors": {
    "hex": "#9e8d85",
    "hls": [0.05333333333333332, 0.568359375, 0.11312217194570136]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.123.jpg",
  "colors": {
    "hex": "#8d7d78",
    "hls": [0.03968253968253969, 0.509765625, 0.08366533864541832]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.124.jpg",
  "colors": {
    "hex": "#9a877d",
    "hls": [0.0574712643678161, 0.544921875, 0.12446351931330472]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.125.jpg",
  "colors": {
    "hex": "#9d867c",
    "hls": [0.0505050505050505, 0.548828125, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.126.jpg",
  "colors": {
    "hex": "#887a7a",
    "hls": [0, 0.50390625, 0.05511811023622047]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.127.jpg",
  "colors": {
    "hex": "#8c7b77",
    "hls": [0.031746031746031744, 0.505859375, 0.08300395256916997]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.128.jpg",
  "colors": {
    "hex": "#847a78",
    "hls": [0.027777777777777773, 0.4921875, 0.047619047619047616]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.129.jpg",
  "colors": {
    "hex": "#9a8780",
    "hls": [0.04487179487179488, 0.55078125, 0.11304347826086956]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.130.jpg",
  "colors": {
    "hex": "#857a79",
    "hls": [0.013888888888888895, 0.49609375, 0.047244094488188976]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.131.jpg",
  "colors": {
    "hex": "#8a7d78",
    "hls": [0.0462962962962963, 0.50390625, 0.07086614173228346]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.132.jpg",
  "colors": {
    "hex": "#807673",
    "hls": [0.03846153846153846, 0.474609375, 0.053497942386831275]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.133.jpg",
  "colors": {
    "hex": "#7e736e",
    "hls": [0.052083333333333336, 0.4609375, 0.06779661016949153]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.135.jpg",
  "colors": {
    "hex": "#8b8584",
    "hls": [0.02380952380952382, 0.529296875, 0.029045643153526972]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.136.jpg",
  "colors": {
    "hex": "#91817c",
    "hls": [0.03968253968253969, 0.525390625, 0.08641975308641975]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.137.jpg",
  "colors": {
    "hex": "#908786",
    "hls": [0.016666666666666663, 0.54296875, 0.042735042735042736]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.138.jpg",
  "colors": {
    "hex": "#a18f86",
    "hls": [0.05555555555555556, 0.576171875, 0.12442396313364056]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.139.jpg",
  "colors": {
    "hex": "#897e7b",
    "hls": [0.03571428571428572, 0.5078125, 0.05555555555555555]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.140.jpg",
  "colors": {
    "hex": "#8f7d79",
    "hls": [0.030303030303030293, 0.515625, 0.08870967741935484]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.141.jpg",
  "colors": {
    "hex": "#938178",
    "hls": [0.05555555555555556, 0.521484375, 0.11020408163265306]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.142.jpg",
  "colors": {
    "hex": "#98837a",
    "hls": [0.05000000000000001, 0.53515625, 0.12605042016806722]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.143.jpg",
  "colors": {
    "hex": "#8c7d78",
    "hls": [0.041666666666666664, 0.5078125, 0.07936507936507936]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.144.jpg",
  "colors": {
    "hex": "#8a7b77",
    "hls": [0.03508771929824561, 0.501953125, 0.07450980392156863]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.145.jpg",
  "colors": {
    "hex": "#897b77",
    "hls": [0.037037037037037035, 0.5, 0.0703125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.146.jpg",
  "colors": {
    "hex": "#887a77",
    "hls": [0.02941176470588236, 0.498046875, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.15.jpg",
  "colors": {
    "hex": "#84756f",
    "hls": [0.047619047619047616, 0.474609375, 0.08641975308641975]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.16.jpg",
  "colors": {
    "hex": "#837875",
    "hls": [0.03571428571428572, 0.484375, 0.056451612903225805]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.17.jpg",
  "colors": {
    "hex": "#7b7471",
    "hls": [0.05000000000000001, 0.4609375, 0.0423728813559322]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.18.jpg",
  "colors": {
    "hex": "#8c7973",
    "hls": [0.04, 0.498046875, 0.09803921568627451]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.19.jpg",
  "colors": {
    "hex": "#8a7c79",
    "hls": [0.02941176470588236, 0.505859375, 0.06719367588932806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.2.jpg",
  "colors": {
    "hex": "#907e75",
    "hls": [0.05555555555555556, 0.509765625, 0.10756972111553785]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.20.jpg",
  "colors": {
    "hex": "#8e7f7b",
    "hls": [0.03508771929824561, 0.517578125, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.21.jpg",
  "colors": {
    "hex": "#8b7e79",
    "hls": [0.0462962962962963, 0.5078125, 0.07142857142857142]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.22.jpg",
  "colors": {
    "hex": "#8b7a76",
    "hls": [0.031746031746031744, 0.501953125, 0.08235294117647059]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.23.jpg",
  "colors": {
    "hex": "#827573",
    "hls": [0.022222222222222216, 0.478515625, 0.061224489795918366]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.24.jpg",
  "colors": {
    "hex": "#837a79",
    "hls": [0.016666666666666663, 0.4921875, 0.03968253968253968]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.25.jpg",
  "colors": {
    "hex": "#867d7c",
    "hls": [0.016666666666666663, 0.50390625, 0.03937007874015748]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.26.jpg",
  "colors": {
    "hex": "#867974",
    "hls": [0.0462962962962963, 0.48828125, 0.072]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.27.jpg",
  "colors": {
    "hex": "#7b7370",
    "hls": [0.04545454545454545, 0.458984375, 0.04680851063829787]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.28.jpg",
  "colors": {
    "hex": "#81726f",
    "hls": [0.027777777777777773, 0.46875, 0.075]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.29.jpg",
  "colors": {
    "hex": "#807473",
    "hls": [0.012820512820512811, 0.474609375, 0.053497942386831275]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.3.jpg",
  "colors": {
    "hex": "#89786f",
    "hls": [0.05769230769230769, 0.484375, 0.10483870967741936]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.30.jpg",
  "colors": {
    "hex": "#837876",
    "hls": [0.025641025641025644, 0.486328125, 0.05220883534136546]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.31.jpg",
  "colors": {
    "hex": "#7e7370",
    "hls": [0.03571428571428572, 0.46484375, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.32.jpg",
  "colors": {
    "hex": "#817774",
    "hls": [0.03846153846153846, 0.478515625, 0.053061224489795916]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.33.jpg",
  "colors": {
    "hex": "#8c807a",
    "hls": [0.05555555555555556, 0.51171875, 0.072]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.34.jpg",
  "colors": {
    "hex": "#7b7170",
    "hls": [0.015151515151515157, 0.458984375, 0.04680851063829787]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.35.jpg",
  "colors": {
    "hex": "#79716f",
    "hls": [0.033333333333333326, 0.453125, 0.04310344827586207]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.36.jpg",
  "colors": {
    "hex": "#8b7c76",
    "hls": [0.047619047619047616, 0.501953125, 0.08235294117647059]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.37.jpg",
  "colors": {
    "hex": "#7f726e",
    "hls": [0.03921568627450981, 0.462890625, 0.07172995780590717]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.38.jpg",
  "colors": {
    "hex": "#847771",
    "hls": [0.05263157894736842, 0.478515625, 0.07755102040816327]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.39.jpg",
  "colors": {
    "hex": "#8a7b77",
    "hls": [0.03508771929824561, 0.501953125, 0.07450980392156863]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.4.jpg",
  "colors": {
    "hex": "#8c7c75",
    "hls": [0.050724637681159424, 0.501953125, 0.09019607843137255]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.40.jpg",
  "colors": {
    "hex": "#837773",
    "hls": [0.041666666666666664, 0.48046875, 0.06504065040650407]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.41.jpg",
  "colors": {
    "hex": "#8b7c77",
    "hls": [0.041666666666666664, 0.50390625, 0.07874015748031496]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.42.jpg",
  "colors": {
    "hex": "#85766e",
    "hls": [0.057971014492753624, 0.474609375, 0.09465020576131687]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.43.jpg",
  "colors": {
    "hex": "#837774",
    "hls": [0.033333333333333326, 0.482421875, 0.06072874493927125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.44.jpg",
  "colors": {
    "hex": "#807877",
    "hls": [0.018518518518518528, 0.482421875, 0.03643724696356275]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.45.jpg",
  "colors": {
    "hex": "#847571",
    "hls": [0.03508771929824561, 0.478515625, 0.07755102040816327]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.46.jpg",
  "colors": {
    "hex": "#8c807d",
    "hls": [0.033333333333333326, 0.517578125, 0.06072874493927125]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.47.jpg",
  "colors": {
    "hex": "#92837f",
    "hls": [0.03508771929824561, 0.533203125, 0.0794979079497908]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.48.jpg",
  "colors": {
    "hex": "#938582",
    "hls": [0.02941176470588236, 0.541015625, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.49.jpg",
  "colors": {
    "hex": "#8a7e7b",
    "hls": [0.033333333333333326, 0.509765625, 0.05976095617529881]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.5.jpg",
  "colors": {
    "hex": "#7e746f",
    "hls": [0.05555555555555556, 0.462890625, 0.06329113924050633]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.50.jpg",
  "colors": {
    "hex": "#847b79",
    "hls": [0.030303030303030293, 0.494140625, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.51.jpg",
  "colors": {
    "hex": "#827a76",
    "hls": [0.05555555555555556, 0.484375, 0.04838709677419355]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.52.jpg",
  "colors": {
    "hex": "#91827d",
    "hls": [0.041666666666666664, 0.52734375, 0.08264462809917356]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.53.jpg",
  "colors": {
    "hex": "#887670",
    "hls": [0.041666666666666664, 0.484375, 0.0967741935483871]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.54.jpg",
  "colors": {
    "hex": "#847774",
    "hls": [0.03125, 0.484375, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.55.jpg",
  "colors": {
    "hex": "#7e7370",
    "hls": [0.03571428571428572, 0.46484375, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.56.jpg",
  "colors": {
    "hex": "#8a7771",
    "hls": [0.04, 0.490234375, 0.099601593625498]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.57.jpg",
  "colors": {
    "hex": "#847a78",
    "hls": [0.027777777777777773, 0.4921875, 0.047619047619047616]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.58.jpg",
  "colors": {
    "hex": "#827672",
    "hls": [0.041666666666666664, 0.4765625, 0.06557377049180328]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.59.jpg",
  "colors": {
    "hex": "#77706f",
    "hls": [0.020833333333333332, 0.44921875, 0.034782608695652174]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.6.jpg",
  "colors": {
    "hex": "#837571",
    "hls": [0.037037037037037035, 0.4765625, 0.07377049180327869]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.60.jpg",
  "colors": {
    "hex": "#a2948d",
    "hls": [0.05555555555555556, 0.591796875, 0.10047846889952153]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.61.jpg",
  "colors": {
    "hex": "#83766f",
    "hls": [0.05833333333333333, 0.47265625, 0.08264462809917356]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.62.jpg",
  "colors": {
    "hex": "#8c7d76",
    "hls": [0.05303030303030304, 0.50390625, 0.08661417322834646]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.63.jpg",
  "colors": {
    "hex": "#8d7b73",
    "hls": [0.05128205128205129, 0.5, 0.1015625]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.64.jpg",
  "colors": {
    "hex": "#837572",
    "hls": [0.02941176470588236, 0.478515625, 0.06938775510204082]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.65.jpg",
  "colors": {
    "hex": "#978175",
    "hls": [0.0588235294117647, 0.5234375, 0.13934426229508196]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.66.jpg",
  "colors": {
    "hex": "#7f7471",
    "hls": [0.03571428571428572, 0.46875, 0.058333333333333334]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.67.jpg",
  "colors": {
    "hex": "#a18f84",
    "hls": [0.0632183908045977, 0.572265625, 0.1324200913242009]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.68.jpg",
  "colors": {
    "hex": "#7f7674",
    "hls": [0.030303030303030293, 0.474609375, 0.04526748971193416]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.69.jpg",
  "colors": {
    "hex": "#978378",
    "hls": [0.05913978494623656, 0.529296875, 0.12863070539419086]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.7.jpg",
  "colors": {
    "hex": "#8f7e78",
    "hls": [0.04347826086956522, 0.513671875, 0.09236947791164658]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.70.jpg",
  "colors": {
    "hex": "#998172",
    "hls": [0.0641025641025641, 0.521484375, 0.15918367346938775]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.72.jpg",
  "colors": {
    "hex": "#867b7b",
    "hls": [0, 0.501953125, 0.043137254901960784]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.74.jpg",
  "colors": {
    "hex": "#8d7f7b",
    "hls": [0.037037037037037035, 0.515625, 0.07258064516129033]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.75.jpg",
  "colors": {
    "hex": "#8e7d78",
    "hls": [0.03787878787878788, 0.51171875, 0.088]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.76.jpg",
  "colors": {
    "hex": "#92847e",
    "hls": [0.05000000000000001, 0.53125, 0.08333333333333333]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.77.jpg",
  "colors": {
    "hex": "#887771",
    "hls": [0.04347826086956522, 0.486328125, 0.09236947791164658]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.78.jpg",
  "colors": {
    "hex": "#8b807c",
    "hls": [0.04444444444444445, 0.513671875, 0.060240963855421686]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.8.jpg",
  "colors": {
    "hex": "#81736d",
    "hls": [0.05000000000000001, 0.46484375, 0.08403361344537816]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.80.jpg",
  "colors": {
    "hex": "#8f827c",
    "hls": [0.05263157894736842, 0.521484375, 0.07755102040816327]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.81.jpg",
  "colors": {
    "hex": "#9c8c84",
    "hls": [0.05555555555555556, 0.5625, 0.10714285714285714]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.82.jpg",
  "colors": {
    "hex": "#807a79",
    "hls": [0.02380952380952382, 0.486328125, 0.028112449799196786]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.83.jpg",
  "colors": {
    "hex": "#867c7b",
    "hls": [0.015151515151515157, 0.501953125, 0.043137254901960784]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.84.jpg",
  "colors": {
    "hex": "#817e79",
    "hls": [0.10416666666666667, 0.48828125, 0.032]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.86.jpg",
  "colors": {
    "hex": "#928076",
    "hls": [0.059523809523809514, 0.515625, 0.11290322580645161]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.87.jpg",
  "colors": {
    "hex": "#817571",
    "hls": [0.041666666666666664, 0.47265625, 0.06611570247933884]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.88.jpg",
  "colors": {
    "hex": "#96847a",
    "hls": [0.059523809523809514, 0.53125, 0.11666666666666667]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.89.jpg",
  "colors": {
    "hex": "#968175",
    "hls": [0.06060606060606061, 0.521484375, 0.1346938775510204]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.9.jpg",
  "colors": {
    "hex": "#78726e",
    "hls": [0.06666666666666667, 0.44921875, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.90.jpg",
  "colors": {
    "hex": "#827773",
    "hls": [0.04444444444444445, 0.478515625, 0.061224489795918366]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.91.jpg",
  "colors": {
    "hex": "#817876",
    "hls": [0.030303030303030293, 0.482421875, 0.044534412955465584]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.92.jpg",
  "colors": {
    "hex": "#857975",
    "hls": [0.041666666666666664, 0.48828125, 0.064]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.93.jpg",
  "colors": {
    "hex": "#7c706b",
    "hls": [0.04901960784313725, 0.451171875, 0.0735930735930736]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.94.jpg",
  "colors": {
    "hex": "#827470",
    "hls": [0.037037037037037035, 0.47265625, 0.0743801652892562]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.95.jpg",
  "colors": {
    "hex": "#8e7d75",
    "hls": [0.05333333333333332, 0.505859375, 0.09881422924901186]
  }
}, {
  "file": "MFNB_Col_Buprestidae_Julodinae_D030.97.jpg",
  "colors": {
    "hex": "#817572",
    "hls": [0.033333333333333326, 0.474609375, 0.06172839506172839]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.100.jpg",
  "colors": {
    "hex": "#817d75",
    "hls": [0.11111111111111112, 0.48046875, 0.04878048780487805]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.101.jpg",
  "colors": {
    "hex": "#837e75",
    "hls": [0.10714285714285714, 0.484375, 0.056451612903225805]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.102.jpg",
  "colors": {
    "hex": "#837d73",
    "hls": [0.10416666666666667, 0.48046875, 0.06504065040650407]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.105.jpg",
  "colors": {
    "hex": "#898377",
    "hls": [0.11111111111111112, 0.5, 0.0703125]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.106.jpg",
  "colors": {
    "hex": "#948d80",
    "hls": [0.10833333333333334, 0.5390625, 0.0847457627118644]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.109.jpg",
  "colors": {
    "hex": "#898274",
    "hls": [0.11111111111111112, 0.494140625, 0.08300395256916997]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.11.jpg",
  "colors": {
    "hex": "#888379",
    "hls": [0.11111111111111112, 0.501953125, 0.058823529411764705]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.111.jpg",
  "colors": {
    "hex": "#b6b6b2",
    "hls": [0.16666666666666666, 0.703125, 0.02631578947368421]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.117.jpg",
  "colors": {
    "hex": "#837c71",
    "hls": [0.10185185185185186, 0.4765625, 0.07377049180327869]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.12.jpg",
  "colors": {
    "hex": "#7e7b73",
    "hls": [0.12121212121212122, 0.470703125, 0.04564315352697095]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.124.jpg",
  "colors": {
    "hex": "#8f8c84",
    "hls": [0.12121212121212122, 0.537109375, 0.046413502109704644]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.13.jpg",
  "colors": {
    "hex": "#88837b",
    "hls": [0.10256410256410257, 0.505859375, 0.05138339920948617]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.15.jpg",
  "colors": {
    "hex": "#78746c",
    "hls": [0.11111111111111112, 0.4453125, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.16.jpg",
  "colors": {
    "hex": "#7a776f",
    "hls": [0.12121212121212122, 0.455078125, 0.04721030042918455]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.17.jpg",
  "colors": {
    "hex": "#78756e",
    "hls": [0.11666666666666665, 0.44921875, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.19.jpg",
  "colors": {
    "hex": "#8e8c86",
    "hls": [0.125, 0.5390625, 0.03389830508474576]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.20.jpg",
  "colors": {
    "hex": "#89857d",
    "hls": [0.11111111111111112, 0.51171875, 0.048]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.22.jpg",
  "colors": {
    "hex": "#88857d",
    "hls": [0.12121212121212122, 0.509765625, 0.043824701195219126]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.23.jpg",
  "colors": {
    "hex": "#9a9489",
    "hls": [0.10784313725490195, 0.568359375, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.24.jpg",
  "colors": {
    "hex": "#908a80",
    "hls": [0.10416666666666667, 0.53125, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.27.jpg",
  "colors": {
    "hex": "#8b8476",
    "hls": [0.11111111111111112, 0.501953125, 0.08235294117647059]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.30.jpg",
  "colors": {
    "hex": "#84817a",
    "hls": [0.11666666666666665, 0.49609375, 0.03937007874015748]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.33.jpg",
  "colors": {
    "hex": "#898479",
    "hls": [0.11458333333333333, 0.50390625, 0.06299212598425197]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.41.jpg",
  "colors": {
    "hex": "#8b8477",
    "hls": [0.10833333333333334, 0.50390625, 0.07874015748031496]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.42.jpg",
  "colors": {
    "hex": "#7f7e78",
    "hls": [0.14285714285714288, 0.482421875, 0.02834008097165992]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.44.jpg",
  "colors": {
    "hex": "#7c7b77",
    "hls": [0.13333333333333333, 0.474609375, 0.0205761316872428]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.46.jpg",
  "colors": {
    "hex": "#89867f",
    "hls": [0.11666666666666665, 0.515625, 0.04032258064516129]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.47.jpg",
  "colors": {
    "hex": "#807d74",
    "hls": [0.125, 0.4765625, 0.04918032786885246]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.5.jpg",
  "colors": {
    "hex": "#7a7670",
    "hls": [0.09999999999999999, 0.45703125, 0.042735042735042736]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.52.jpg",
  "colors": {
    "hex": "#7b7973",
    "hls": [0.125, 0.46484375, 0.03361344537815126]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.55.jpg",
  "colors": {
    "hex": "#9f9c93",
    "hls": [0.125, 0.59765625, 0.05825242718446602]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.65.jpg",
  "colors": {
    "hex": "#94928d",
    "hls": [0.11904761904761905, 0.564453125, 0.03139013452914798]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.66.jpg",
  "colors": {
    "hex": "#a4a099",
    "hls": [0.10606060606060606, 0.619140625, 0.05641025641025641]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.67.jpg",
  "colors": {
    "hex": "#938e85",
    "hls": [0.10714285714285714, 0.546875, 0.0603448275862069]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.70.jpg",
  "colors": {
    "hex": "#9f9a90",
    "hls": [0.11111111111111112, 0.591796875, 0.07177033492822966]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.72.jpg",
  "colors": {
    "hex": "#857f75",
    "hls": [0.10416666666666667, 0.48828125, 0.064]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.74.jpg",
  "colors": {
    "hex": "#777671",
    "hls": [0.1388888888888889, 0.453125, 0.02586206896551724]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.75.jpg",
  "colors": {
    "hex": "#797670",
    "hls": [0.11111111111111112, 0.455078125, 0.03862660944206009]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.76.jpg",
  "colors": {
    "hex": "#898782",
    "hls": [0.11904761904761905, 0.521484375, 0.02857142857142857]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.77.jpg",
  "colors": {
    "hex": "#898276",
    "hls": [0.10526315789473684, 0.498046875, 0.07450980392156863]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.78.jpg",
  "colors": {
    "hex": "#78746a",
    "hls": [0.11904761904761905, 0.44140625, 0.061946902654867256]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.79.jpg",
  "colors": {
    "hex": "#8f8a84",
    "hls": [0.0909090909090909, 0.537109375, 0.046413502109704644]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.80.jpg",
  "colors": {
    "hex": "#878580",
    "hls": [0.11904761904761905, 0.513671875, 0.028112449799196786]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.81.jpg",
  "colors": {
    "hex": "#7b7469",
    "hls": [0.10185185185185186, 0.4453125, 0.07894736842105263]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.82.jpg",
  "colors": {
    "hex": "#726f6b",
    "hls": [0.09523809523809523, 0.431640625, 0.03167420814479638]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.83.jpg",
  "colors": {
    "hex": "#6a6661",
    "hls": [0.0925925925925926, 0.396484375, 0.04433497536945813]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.84.jpg",
  "colors": {
    "hex": "#938d82",
    "hls": [0.10784313725490195, 0.541015625, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.85.jpg",
  "colors": {
    "hex": "#9d9991",
    "hls": [0.11111111111111112, 0.58984375, 0.05714285714285714]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.87.jpg",
  "colors": {
    "hex": "#8d877c",
    "hls": [0.10784313725490195, 0.517578125, 0.06882591093117409]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.88.jpg",
  "colors": {
    "hex": "#989389",
    "hls": [0.11111111111111112, 0.564453125, 0.06726457399103139]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.89.jpg",
  "colors": {
    "hex": "#848179",
    "hls": [0.12121212121212122, 0.494140625, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.9.jpg",
  "colors": {
    "hex": "#8e897f",
    "hls": [0.11111111111111112, 0.525390625, 0.06172839506172839]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.90.jpg",
  "colors": {
    "hex": "#9a9387",
    "hls": [0.10526315789473684, 0.564453125, 0.08520179372197309]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.91.jpg",
  "colors": {
    "hex": "#87847c",
    "hls": [0.12121212121212122, 0.505859375, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.92.jpg",
  "colors": {
    "hex": "#848077",
    "hls": [0.11538461538461538, 0.490234375, 0.05179282868525897]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.94.jpg",
  "colors": {
    "hex": "#8c8981",
    "hls": [0.12121212121212122, 0.525390625, 0.04526748971193416]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.95.jpg",
  "colors": {
    "hex": "#918a7e",
    "hls": [0.10526315789473684, 0.529296875, 0.07883817427385892]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.97.jpg",
  "colors": {
    "hex": "#87837a",
    "hls": [0.11538461538461538, 0.501953125, 0.050980392156862744]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.98.jpg",
  "colors": {
    "hex": "#8e8b84",
    "hls": [0.11666666666666665, 0.53515625, 0.04201680672268908]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D001.99.jpg",
  "colors": {
    "hex": "#878783",
    "hls": [0.16666666666666666, 0.51953125, 0.016260162601626018]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.106.jpg",
  "colors": {
    "hex": "#9b9d7b",
    "hls": [0.17647058823529407, 0.546875, 0.14655172413793102]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.107.jpg",
  "colors": {
    "hex": "#939a78",
    "hls": [0.20098039215686278, 0.53515625, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.11.jpg",
  "colors": {
    "hex": "#808c68",
    "hls": [0.22222222222222224, 0.4765625, 0.14754098360655737]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.110.jpg",
  "colors": {
    "hex": "#96a074",
    "hls": [0.2045454545454545, 0.5390625, 0.1864406779661017]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.116.jpg",
  "colors": {
    "hex": "#7d9468",
    "hls": [0.25378787878787873, 0.4921875, 0.1746031746031746]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.117.jpg",
  "colors": {
    "hex": "#a3b296",
    "hls": [0.25595238095238093, 0.640625, 0.15217391304347827]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.122.jpg",
  "colors": {
    "hex": "#9fa984",
    "hls": [0.2117117117117117, 0.587890625, 0.17535545023696683]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.128.jpg",
  "colors": {
    "hex": "#a4a884",
    "hls": [0.1851851851851852, 0.5859375, 0.16981132075471697]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.129.jpg",
  "colors": {
    "hex": "#99a082",
    "hls": [0.20555555555555557, 0.56640625, 0.13513513513513514]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.130.jpg",
  "colors": {
    "hex": "#8a8280",
    "hls": [0.033333333333333326, 0.51953125, 0.04065040650406504]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.131.jpg",
  "colors": {
    "hex": "#a0a282",
    "hls": [0.17708333333333334, 0.5703125, 0.14545454545454545]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.132.jpg",
  "colors": {
    "hex": "#a1a47d",
    "hls": [0.17948717948717952, 0.564453125, 0.17488789237668162]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.133.jpg",
  "colors": {
    "hex": "#9da383",
    "hls": [0.19791666666666666, 0.57421875, 0.14678899082568808]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.134.jpg",
  "colors": {
    "hex": "#9ca07f",
    "hls": [0.18686868686868685, 0.560546875, 0.14666666666666667]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.135.jpg",
  "colors": {
    "hex": "#b5baa0",
    "hls": [0.19871794871794876, 0.67578125, 0.1566265060240964]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.136.jpg",
  "colors": {
    "hex": "#aeb895",
    "hls": [0.21428571428571427, 0.650390625, 0.19553072625698323]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.137.jpg",
  "colors": {
    "hex": "#8d8682",
    "hls": [0.06060606060606061, 0.529296875, 0.04564315352697095]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.139.jpg",
  "colors": {
    "hex": "#8b8f73",
    "hls": [0.19047619047619047, 0.50390625, 0.11023622047244094]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.142.jpg",
  "colors": {
    "hex": "#9ba17d",
    "hls": [0.19444444444444442, 0.55859375, 0.1592920353982301]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.144.jpg",
  "colors": {
    "hex": "#949979",
    "hls": [0.19270833333333334, 0.53515625, 0.13445378151260504]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.146.jpg",
  "colors": {
    "hex": "#9ba07f",
    "hls": [0.1919191919191919, 0.560546875, 0.14666666666666667]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.147.jpg",
  "colors": {
    "hex": "#a1a883",
    "hls": [0.19819819819819817, 0.583984375, 0.17370892018779344]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.148.jpg",
  "colors": {
    "hex": "#9fa27b",
    "hls": [0.17948717948717952, 0.556640625, 0.17180616740088106]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.15.jpg",
  "colors": {
    "hex": "#98a080",
    "hls": [0.20833333333333334, 0.5625, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.150.jpg",
  "colors": {
    "hex": "#afba9d",
    "hls": [0.2298850574712644, 0.669921875, 0.17159763313609466]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.152.jpg",
  "colors": {
    "hex": "#8e8c88",
    "hls": [0.11111111111111112, 0.54296875, 0.02564102564102564]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.153.jpg",
  "colors": {
    "hex": "#a19f9a",
    "hls": [0.11904761904761905, 0.615234375, 0.03553299492385787]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.156.jpg",
  "colors": {
    "hex": "#94a385",
    "hls": [0.25, 0.578125, 0.1388888888888889]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.158.jpg",
  "colors": {
    "hex": "#9a9d78",
    "hls": [0.1801801801801802, 0.541015625, 0.1574468085106383]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.159.jpg",
  "colors": {
    "hex": "#9da07b",
    "hls": [0.1801801801801802, 0.552734375, 0.1615720524017467]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.16.jpg",
  "colors": {
    "hex": "#9ba280",
    "hls": [0.20098039215686278, 0.56640625, 0.15315315315315314]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.162.jpg",
  "colors": {
    "hex": "#9caa7c",
    "hls": [0.21739130434782608, 0.57421875, 0.21100917431192662]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.165.jpg",
  "colors": {
    "hex": "#95967c",
    "hls": [0.17307692307692304, 0.53515625, 0.1092436974789916]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.17.jpg",
  "colors": {
    "hex": "#9ba482",
    "hls": [0.2107843137254902, 0.57421875, 0.1559633027522936]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.170.jpg",
  "colors": {
    "hex": "#9a9c90",
    "hls": [0.19444444444444442, 0.5859375, 0.05660377358490566]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.171.jpg",
  "colors": {
    "hex": "#828769",
    "hls": [0.19444444444444442, 0.46875, 0.125]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.174.jpg",
  "colors": {
    "hex": "#9ea483",
    "hls": [0.19696969696969693, 0.576171875, 0.15207373271889402]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.176.jpg",
  "colors": {
    "hex": "#8e9777",
    "hls": [0.21354166666666666, 0.52734375, 0.1322314049586777]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.177.jpg",
  "colors": {
    "hex": "#a2a682",
    "hls": [0.1851851851851852, 0.578125, 0.16666666666666666]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.178.jpg",
  "colors": {
    "hex": "#a5a888",
    "hls": [0.18229166666666666, 0.59375, 0.15384615384615385]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.179.jpg",
  "colors": {
    "hex": "#989d77",
    "hls": [0.1885964912280702, 0.5390625, 0.16101694915254236]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.18.jpg",
  "colors": {
    "hex": "#9b9c81",
    "hls": [0.17283950617283952, 0.556640625, 0.11894273127753303]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.180.jpg",
  "colors": {
    "hex": "#99aa78",
    "hls": [0.2233333333333333, 0.56640625, 0.22522522522522523]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.181.jpg",
  "colors": {
    "hex": "#99a27b",
    "hls": [0.20512820512820515, 0.556640625, 0.17180616740088106]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.183.jpg",
  "colors": {
    "hex": "#9d9e7f",
    "hls": [0.17204301075268816, 0.556640625, 0.13656387665198239]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.184.jpg",
  "colors": {
    "hex": "#899677",
    "hls": [0.23655913978494625, 0.525390625, 0.12757201646090535]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.188.jpg",
  "colors": {
    "hex": "#909f7c",
    "hls": [0.23809523809523805, 0.552734375, 0.15283842794759825]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.189.jpg",
  "colors": {
    "hex": "#9aa681",
    "hls": [0.22072072072072077, 0.576171875, 0.17050691244239632]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.19.jpg",
  "colors": {
    "hex": "#8e9477",
    "hls": [0.20114942528735633, 0.521484375, 0.11836734693877551]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.191.jpg",
  "colors": {
    "hex": "#939276",
    "hls": [0.16091954022988506, 0.517578125, 0.11740890688259109]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.192.jpg",
  "colors": {
    "hex": "#9ca57e",
    "hls": [0.20512820512820515, 0.568359375, 0.17647058823529413]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.21.jpg",
  "colors": {
    "hex": "#8d9873",
    "hls": [0.21621621621621623, 0.521484375, 0.1510204081632653]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.23.jpg",
  "colors": {
    "hex": "#97ac7f",
    "hls": [0.24444444444444446, 0.583984375, 0.2112676056338028]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.26.jpg",
  "colors": {
    "hex": "#9cad81",
    "hls": [0.23106060606060605, 0.58984375, 0.20952380952380953]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.37.jpg",
  "colors": {
    "hex": "#878c6b",
    "hls": [0.1919191919191919, 0.482421875, 0.13360323886639677]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.40.jpg",
  "colors": {
    "hex": "#858d6b",
    "hls": [0.2058823529411765, 0.484375, 0.13709677419354838]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.43.jpg",
  "colors": {
    "hex": "#8f9a77",
    "hls": [0.21904761904761902, 0.533203125, 0.14644351464435146]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.45.jpg",
  "colors": {
    "hex": "#8e8e68",
    "hls": [0.16666666666666666, 0.48046875, 0.15447154471544716]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.46.jpg",
  "colors": {
    "hex": "#8c9a72",
    "hls": [0.225, 0.5234375, 0.16393442622950818]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.49.jpg",
  "colors": {
    "hex": "#879d76",
    "hls": [0.26068376068376065, 0.537109375, 0.16455696202531644]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.54.jpg",
  "colors": {
    "hex": "#8ea07a",
    "hls": [0.2456140350877193, 0.55078125, 0.16521739130434782]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.59.jpg",
  "colors": {
    "hex": "#9c9c81",
    "hls": [0.16666666666666666, 0.556640625, 0.11894273127753303]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.61.jpg",
  "colors": {
    "hex": "#9ca481",
    "hls": [0.20476190476190478, 0.572265625, 0.1598173515981735]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.62.jpg",
  "colors": {
    "hex": "#9ba079",
    "hls": [0.18803418803418803, 0.548828125, 0.16883116883116883]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.63.jpg",
  "colors": {
    "hex": "#838d64",
    "hls": [0.20731707317073175, 0.470703125, 0.17012448132780084]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.64.jpg",
  "colors": {
    "hex": "#8d9f76",
    "hls": [0.23983739837398374, 0.541015625, 0.17446808510638298]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.65.jpg",
  "colors": {
    "hex": "#90926e",
    "hls": [0.1759259259259259, 0.5, 0.140625]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.66.jpg",
  "colors": {
    "hex": "#828168",
    "hls": [0.16025641025641027, 0.45703125, 0.1111111111111111]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.67.jpg",
  "colors": {
    "hex": "#8b8667",
    "hls": [0.14351851851851852, 0.47265625, 0.1487603305785124]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.68.jpg",
  "colors": {
    "hex": "#88877c",
    "hls": [0.15277777777777776, 0.5078125, 0.047619047619047616]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.79.jpg",
  "colors": {
    "hex": "#969977",
    "hls": [0.18137254901960786, 0.53125, 0.14166666666666666]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D004.80.jpg",
  "colors": {
    "hex": "#9ea381",
    "hls": [0.19117647058823528, 0.5703125, 0.15454545454545454]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.0.jpg",
  "colors": {
    "hex": "#a7b49a",
    "hls": [0.25, 0.65234375, 0.14606741573033707]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.1.jpg",
  "colors": {
    "hex": "#b8bfb0",
    "hls": [0.24444444444444446, 0.716796875, 0.10344827586206896]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.10.jpg",
  "colors": {
    "hex": "#9ca691",
    "hls": [0.24603174603174605, 0.607421875, 0.1044776119402985]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.11.jpg",
  "colors": {
    "hex": "#8fac84",
    "hls": [0.28750000000000003, 0.59375, 0.19230769230769232]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.12.jpg",
  "colors": {
    "hex": "#94a888",
    "hls": [0.2708333333333333, 0.59375, 0.15384615384615385]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.14.jpg",
  "colors": {
    "hex": "#8b9f77",
    "hls": [0.25, 0.54296875, 0.17094017094017094]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.2.jpg",
  "colors": {
    "hex": "#a8b99f",
    "hls": [0.2756410256410256, 0.671875, 0.15476190476190477]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.22.jpg",
  "colors": {
    "hex": "#86a67b",
    "hls": [0.29069767441860467, 0.564453125, 0.19282511210762332]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.24.jpg",
  "colors": {
    "hex": "#b4c5ac",
    "hls": [0.28, 0.720703125, 0.17482517482517482]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.25.jpg",
  "colors": {
    "hex": "#86a279",
    "hls": [0.2804878048780488, 0.552734375, 0.17903930131004367]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.26.jpg",
  "colors": {
    "hex": "#85a578",
    "hls": [0.2851851851851852, 0.556640625, 0.19823788546255505]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.27.jpg",
  "colors": {
    "hex": "#84aa77",
    "hls": [0.2908496732026144, 0.564453125, 0.22869955156950672]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.28.jpg",
  "colors": {
    "hex": "#8da67f",
    "hls": [0.2735042735042735, 0.572265625, 0.1780821917808219]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.29.jpg",
  "colors": {
    "hex": "#9faa95",
    "hls": [0.25396825396825395, 0.623046875, 0.10880829015544041]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.42.jpg",
  "colors": {
    "hex": "#91a27b",
    "hls": [0.23931623931623935, 0.556640625, 0.17180616740088106]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.45.jpg",
  "colors": {
    "hex": "#87957f",
    "hls": [0.2727272727272727, 0.5390625, 0.09322033898305085]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.47.jpg",
  "colors": {
    "hex": "#787e76",
    "hls": [0.2916666666666667, 0.4765625, 0.03278688524590164]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.49.jpg",
  "colors": {
    "hex": "#859979",
    "hls": [0.2708333333333333, 0.53515625, 0.13445378151260504]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.52.jpg",
  "colors": {
    "hex": "#8c8780",
    "hls": [0.09722222222222221, 0.5234375, 0.04918032786885246]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.54.jpg",
  "colors": {
    "hex": "#909180",
    "hls": [0.17647058823529407, 0.533203125, 0.07112970711297072]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.55.jpg",
  "colors": {
    "hex": "#778270",
    "hls": [0.26851851851851855, 0.47265625, 0.0743801652892562]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.56.jpg",
  "colors": {
    "hex": "#848874",
    "hls": [0.20000000000000004, 0.4921875, 0.07936507936507936]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.58.jpg",
  "colors": {
    "hex": "#798d6f",
    "hls": [0.27777777777777773, 0.4921875, 0.11904761904761904]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.59.jpg",
  "colors": {
    "hex": "#78886f",
    "hls": [0.2733333333333334, 0.482421875, 0.10121457489878542]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.63.jpg",
  "colors": {
    "hex": "#85957a",
    "hls": [0.2654320987654321, 0.529296875, 0.11203319502074689]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.64.jpg",
  "colors": {
    "hex": "#8b9a84",
    "hls": [0.2803030303030303, 0.55859375, 0.09734513274336283]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.68.jpg",
  "colors": {
    "hex": "#767764",
    "hls": [0.1754385964912281, 0.427734375, 0.0867579908675799]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.69.jpg",
  "colors": {
    "hex": "#849876",
    "hls": [0.2647058823529412, 0.52734375, 0.14049586776859505]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.70.jpg",
  "colors": {
    "hex": "#909380",
    "hls": [0.1929824561403509, 0.537109375, 0.08016877637130802]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.71.jpg",
  "colors": {
    "hex": "#758a6b",
    "hls": [0.27956989247311825, 0.478515625, 0.12653061224489795]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.72.jpg",
  "colors": {
    "hex": "#8a9a6f",
    "hls": [0.22868217054263562, 0.517578125, 0.17408906882591094]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.73.jpg",
  "colors": {
    "hex": "#9daa8c",
    "hls": [0.23888888888888893, 0.60546875, 0.1485148514851485]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.75.jpg",
  "colors": {
    "hex": "#89a27b",
    "hls": [0.2735042735042735, 0.556640625, 0.17180616740088106]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.77.jpg",
  "colors": {
    "hex": "#8aa875",
    "hls": [0.2647058823529412, 0.556640625, 0.22466960352422907]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.78.jpg",
  "colors": {
    "hex": "#81926c",
    "hls": [0.24122807017543857, 0.49609375, 0.14960629921259844]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.79.jpg",
  "colors": {
    "hex": "#959c7c",
    "hls": [0.203125, 0.546875, 0.13793103448275862]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.80.jpg",
  "colors": {
    "hex": "#8e9b7f",
    "hls": [0.24404761904761907, 0.55078125, 0.12173913043478261]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.82.jpg",
  "colors": {
    "hex": "#949788",
    "hls": [0.20000000000000004, 0.560546875, 0.06666666666666667]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.83.jpg",
  "colors": {
    "hex": "#7c7f6a",
    "hls": [0.19047619047619047, 0.455078125, 0.09012875536480687]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.84.jpg",
  "colors": {
    "hex": "#8b967d",
    "hls": [0.24, 0.537109375, 0.10548523206751055]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.85.jpg",
  "colors": {
    "hex": "#7f9976",
    "hls": [0.2904761904761905, 0.529296875, 0.14522821576763487]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.90.jpg",
  "colors": {
    "hex": "#a0ac92",
    "hls": [0.2435897435897436, 0.62109375, 0.13402061855670103]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.92.jpg",
  "colors": {
    "hex": "#7b8e68",
    "hls": [0.25, 0.48046875, 0.15447154471544716]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.94.jpg",
  "colors": {
    "hex": "#7d9076",
    "hls": [0.2884615384615385, 0.51171875, 0.104]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.95.jpg",
  "colors": {
    "hex": "#b7baa6",
    "hls": [0.19166666666666665, 0.6875, 0.125]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.97.jpg",
  "colors": {
    "hex": "#b3beaa",
    "hls": [0.2583333333333333, 0.703125, 0.13157894736842105]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D018.99.jpg",
  "colors": {
    "hex": "#b8bda7",
    "hls": [0.2045454545454545, 0.6953125, 0.14102564102564102]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.10.jpg",
  "colors": {
    "hex": "#828079",
    "hls": [0.12962962962962962, 0.490234375, 0.035856573705179286]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.11.jpg",
  "colors": {
    "hex": "#7e7c75",
    "hls": [0.12962962962962962, 0.474609375, 0.037037037037037035]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.13.jpg",
  "colors": {
    "hex": "#87857e",
    "hls": [0.12962962962962962, 0.509765625, 0.035856573705179286]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.14.jpg",
  "colors": {
    "hex": "#8c8b84",
    "hls": [0.14583333333333334, 0.53125, 0.03333333333333333]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.15.jpg",
  "colors": {
    "hex": "#84837c",
    "hls": [0.14583333333333334, 0.5, 0.03125]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.16.jpg",
  "colors": {
    "hex": "#898882",
    "hls": [0.14285714285714288, 0.521484375, 0.02857142857142857]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.18.jpg",
  "colors": {
    "hex": "#8a8780",
    "hls": [0.11666666666666665, 0.51953125, 0.04065040650406504]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.19.jpg",
  "colors": {
    "hex": "#9a908b",
    "hls": [0.05555555555555556, 0.572265625, 0.0684931506849315]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.2.jpg",
  "colors": {
    "hex": "#96928c",
    "hls": [0.09999999999999999, 0.56640625, 0.04504504504504504]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.23.jpg",
  "colors": {
    "hex": "#7d7c75",
    "hls": [0.14583333333333334, 0.47265625, 0.03305785123966942]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.25.jpg",
  "colors": {
    "hex": "#7d7c74",
    "hls": [0.14814814814814814, 0.470703125, 0.03734439834024896]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.26.jpg",
  "colors": {
    "hex": "#b8b6b0",
    "hls": [0.125, 0.703125, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.27.jpg",
  "colors": {
    "hex": "#aba9a4",
    "hls": [0.11904761904761905, 0.654296875, 0.03954802259887006]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.30.jpg",
  "colors": {
    "hex": "#a09995",
    "hls": [0.06060606060606061, 0.603515625, 0.054187192118226604]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.33.jpg",
  "colors": {
    "hex": "#87847b",
    "hls": [0.125, 0.50390625, 0.047244094488188976]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.34.jpg",
  "colors": {
    "hex": "#82817c",
    "hls": [0.1388888888888889, 0.49609375, 0.023622047244094488]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.35.jpg",
  "colors": {
    "hex": "#7e7d76",
    "hls": [0.14583333333333334, 0.4765625, 0.03278688524590164]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.36.jpg",
  "colors": {
    "hex": "#8e8c84",
    "hls": [0.13333333333333333, 0.53515625, 0.04201680672268908]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.37.jpg",
  "colors": {
    "hex": "#84827a",
    "hls": [0.13333333333333333, 0.49609375, 0.03937007874015748]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.39.jpg",
  "colors": {
    "hex": "#847f76",
    "hls": [0.10714285714285714, 0.48828125, 0.056]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.42.jpg",
  "colors": {
    "hex": "#827f78",
    "hls": [0.11666666666666665, 0.48828125, 0.04]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.43.jpg",
  "colors": {
    "hex": "#8a877f",
    "hls": [0.12121212121212122, 0.517578125, 0.044534412955465584]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.44.jpg",
  "colors": {
    "hex": "#7e7c76",
    "hls": [0.125, 0.4765625, 0.03278688524590164]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.45.jpg",
  "colors": {
    "hex": "#b0a8a4",
    "hls": [0.05555555555555556, 0.6640625, 0.06976744186046512]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.46.jpg",
  "colors": {
    "hex": "#9a8c86",
    "hls": [0.05000000000000001, 0.5625, 0.08928571428571429]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.48.jpg",
  "colors": {
    "hex": "#979793",
    "hls": [0.16666666666666666, 0.58203125, 0.018691588785046728]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.49.jpg",
  "colors": {
    "hex": "#7b7a75",
    "hls": [0.1388888888888889, 0.46875, 0.025]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.5.jpg",
  "colors": {
    "hex": "#988b84",
    "hls": [0.05833333333333333, 0.5546875, 0.08771929824561403]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.52.jpg",
  "colors": {
    "hex": "#a29894",
    "hls": [0.047619047619047616, 0.60546875, 0.06930693069306931]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.54.jpg",
  "colors": {
    "hex": "#93908a",
    "hls": [0.11111111111111112, 0.556640625, 0.039647577092511016]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.57.jpg",
  "colors": {
    "hex": "#87857d",
    "hls": [0.13333333333333333, 0.5078125, 0.03968253968253968]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.6.jpg",
  "colors": {
    "hex": "#888780",
    "hls": [0.14583333333333334, 0.515625, 0.03225806451612903]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.61.jpg",
  "colors": {
    "hex": "#757570",
    "hls": [0.16666666666666666, 0.447265625, 0.021834061135371178]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.7.jpg",
  "colors": {
    "hex": "#97958f",
    "hls": [0.125, 0.57421875, 0.03669724770642202]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D030.8.jpg",
  "colors": {
    "hex": "#807c74",
    "hls": [0.11111111111111112, 0.4765625, 0.04918032786885246]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.15.jpg",
  "colors": {
    "hex": "#7b7972",
    "hls": [0.12962962962962962, 0.462890625, 0.0379746835443038]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.25.jpg",
  "colors": {
    "hex": "#98958f",
    "hls": [0.11111111111111112, 0.576171875, 0.041474654377880185]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.28.jpg",
  "colors": {
    "hex": "#929188",
    "hls": [0.15, 0.55078125, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.33.jpg",
  "colors": {
    "hex": "#736d65",
    "hls": [0.09523809523809523, 0.421875, 0.06481481481481481]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.36.jpg",
  "colors": {
    "hex": "#989690",
    "hls": [0.125, 0.578125, 0.037037037037037035]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.40.jpg",
  "colors": {
    "hex": "#76736b",
    "hls": [0.12121212121212122, 0.439453125, 0.04888888888888889]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.45.jpg",
  "colors": {
    "hex": "#89877b",
    "hls": [0.14285714285714288, 0.5078125, 0.05555555555555555]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D042.46.jpg",
  "colors": {
    "hex": "#827c75",
    "hls": [0.08974358974358974, 0.482421875, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.10.jpg",
  "colors": {
    "hex": "#999894",
    "hls": [0.13333333333333333, 0.587890625, 0.023696682464454975]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.100.jpg",
  "colors": {
    "hex": "#70797b",
    "hls": [0.5303030303030303, 0.458984375, 0.04680851063829787]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.101.jpg",
  "colors": {
    "hex": "#7a8483",
    "hls": [0.48333333333333334, 0.49609375, 0.03937007874015748]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.102.jpg",
  "colors": {
    "hex": "#787f80",
    "hls": [0.5208333333333334, 0.484375, 0.03225806451612903]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.103.jpg",
  "colors": {
    "hex": "#a18d7f",
    "hls": [0.06862745098039215, 0.5625, 0.15178571428571427]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.104.jpg",
  "colors": {
    "hex": "#958c7e",
    "hls": [0.10144927536231885, 0.537109375, 0.0970464135021097]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.105.jpg",
  "colors": {
    "hex": "#9d897e",
    "hls": [0.05913978494623656, 0.552734375, 0.13537117903930132]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.106.jpg",
  "colors": {
    "hex": "#828386",
    "hls": [0.625, 0.515625, 0.016129032258064516]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.107.jpg",
  "colors": {
    "hex": "#9b8573",
    "hls": [0.075, 0.52734375, 0.1652892561983471]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.108.jpg",
  "colors": {
    "hex": "#94796e",
    "hls": [0.048245614035087724, 0.50390625, 0.14960629921259844]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.109.jpg",
  "colors": {
    "hex": "#a39086",
    "hls": [0.0574712643678161, 0.580078125, 0.13488372093023257]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.110.jpg",
  "colors": {
    "hex": "#a99786",
    "hls": [0.08095238095238096, 0.591796875, 0.1674641148325359]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.111.jpg",
  "colors": {
    "hex": "#a79381",
    "hls": [0.07894736842105264, 0.578125, 0.17592592592592593]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.112.jpg",
  "colors": {
    "hex": "#a88e82",
    "hls": [0.05263157894736842, 0.58203125, 0.17757009345794392]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.113.jpg",
  "colors": {
    "hex": "#9c8775",
    "hls": [0.07692307692307693, 0.533203125, 0.16317991631799164]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.114.jpg",
  "colors": {
    "hex": "#a38e82",
    "hls": [0.06060606060606061, 0.572265625, 0.1506849315068493]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.115.jpg",
  "colors": {
    "hex": "#a89687",
    "hls": [0.07575757575757576, 0.591796875, 0.15789473684210525]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.118.jpg",
  "colors": {
    "hex": "#a1999c",
    "hls": [0.9375, 0.61328125, 0.04040404040404041]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.119.jpg",
  "colors": {
    "hex": "#7c7f85",
    "hls": [0.6111111111111112, 0.501953125, 0.03529411764705882]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.12.jpg",
  "colors": {
    "hex": "#a2947f",
    "hls": [0.09999999999999999, 0.564453125, 0.15695067264573992]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.120.jpg",
  "colors": {
    "hex": "#7d917a",
    "hls": [0.3115942028985507, 0.521484375, 0.09387755102040816]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.121.jpg",
  "colors": {
    "hex": "#7b867f",
    "hls": [0.393939393939394, 0.501953125, 0.043137254901960784]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.122.jpg",
  "colors": {
    "hex": "#819178",
    "hls": [0.2733333333333334, 0.517578125, 0.10121457489878542]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.123.jpg",
  "colors": {
    "hex": "#7d8488",
    "hls": [0.5606060606060606, 0.509765625, 0.043824701195219126]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.125.jpg",
  "colors": {
    "hex": "#8e9095",
    "hls": [0.6190476190476191, 0.568359375, 0.03167420814479638]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.127.jpg",
  "colors": {
    "hex": "#847868",
    "hls": [0.09523809523809523, 0.4609375, 0.11864406779661017]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.129.jpg",
  "colors": {
    "hex": "#979e81",
    "hls": [0.2068965517241379, 0.560546875, 0.1288888888888889]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.130.jpg",
  "colors": {
    "hex": "#907e71",
    "hls": [0.06989247311827956, 0.501953125, 0.12156862745098039]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.131.jpg",
  "colors": {
    "hex": "#959a7f",
    "hls": [0.19753086419753085, 0.548828125, 0.11688311688311688]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.132.jpg",
  "colors": {
    "hex": "#968279",
    "hls": [0.051724137931034475, 0.529296875, 0.12033195020746888]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.135.jpg",
  "colors": {
    "hex": "#a38377",
    "hls": [0.04545454545454545, 0.55078125, 0.19130434782608696]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.136.jpg",
  "colors": {
    "hex": "#9f8a79",
    "hls": [0.07456140350877193, 0.546875, 0.16379310344827586]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.137.jpg",
  "colors": {
    "hex": "#9c887d",
    "hls": [0.05913978494623656, 0.548828125, 0.1341991341991342]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.138.jpg",
  "colors": {
    "hex": "#a98f81",
    "hls": [0.05833333333333333, 0.58203125, 0.18691588785046728]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.139.jpg",
  "colors": {
    "hex": "#a08a80",
    "hls": [0.052083333333333336, 0.5625, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.140.jpg",
  "colors": {
    "hex": "#8a9290",
    "hls": [0.4583333333333333, 0.5546875, 0.03508771929824561]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.142.jpg",
  "colors": {
    "hex": "#919892",
    "hls": [0.35714285714285715, 0.580078125, 0.03255813953488372]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.143.jpg",
  "colors": {
    "hex": "#89918c",
    "hls": [0.3958333333333333, 0.55078125, 0.034782608695652174]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.144.jpg",
  "colors": {
    "hex": "#7a8382",
    "hls": [0.48148148148148145, 0.494140625, 0.03557312252964427]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.145.jpg",
  "colors": {
    "hex": "#7e9475",
    "hls": [0.2849462365591398, 0.517578125, 0.12550607287449392]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.146.jpg",
  "colors": {
    "hex": "#83917c",
    "hls": [0.27777777777777773, 0.525390625, 0.08641975308641975]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.147.jpg",
  "colors": {
    "hex": "#6d757e",
    "hls": [0.5882352941176471, 0.458984375, 0.07234042553191489]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.148.jpg",
  "colors": {
    "hex": "#a68e7f",
    "hls": [0.0641025641025641, 0.572265625, 0.1780821917808219]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.15.jpg",
  "colors": {
    "hex": "#868a72",
    "hls": [0.19444444444444442, 0.4921875, 0.09523809523809523]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.151.jpg",
  "colors": {
    "hex": "#a18b80",
    "hls": [0.05555555555555556, 0.564453125, 0.14798206278026907]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.155.jpg",
  "colors": {
    "hex": "#a68e82",
    "hls": [0.05555555555555556, 0.578125, 0.16666666666666666]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.156.jpg",
  "colors": {
    "hex": "#96837a",
    "hls": [0.05357142857142857, 0.53125, 0.11666666666666667]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.157.jpg",
  "colors": {
    "hex": "#9d877d",
    "hls": [0.052083333333333336, 0.55078125, 0.1391304347826087]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.158.jpg",
  "colors": {
    "hex": "#7fa177",
    "hls": [0.30158730158730157, 0.546875, 0.1810344827586207]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.159.jpg",
  "colors": {
    "hex": "#95989a",
    "hls": [0.5666666666666668, 0.591796875, 0.023923444976076555]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.160.jpg",
  "colors": {
    "hex": "#9c897e",
    "hls": [0.061111111111111116, 0.55078125, 0.13043478260869565]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.161.jpg",
  "colors": {
    "hex": "#9aa0a2",
    "hls": [0.5416666666666666, 0.6171875, 0.04081632653061224]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.162.jpg",
  "colors": {
    "hex": "#8b9091",
    "hls": [0.5277777777777778, 0.5546875, 0.02631578947368421]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.163.jpg",
  "colors": {
    "hex": "#919799",
    "hls": [0.5416666666666666, 0.58203125, 0.037383177570093455]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.164.jpg",
  "colors": {
    "hex": "#89958d",
    "hls": [0.3888888888888889, 0.55859375, 0.05309734513274336]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.165.jpg",
  "colors": {
    "hex": "#81907f",
    "hls": [0.3137254901960784, 0.529296875, 0.07053941908713693]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.166.jpg",
  "colors": {
    "hex": "#707673",
    "hls": [0.4166666666666667, 0.44921875, 0.02608695652173913]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.167.jpg",
  "colors": {
    "hex": "#8a9b78",
    "hls": [0.24761904761904763, 0.537109375, 0.14767932489451477]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.168.jpg",
  "colors": {
    "hex": "#939689",
    "hls": [0.20512820512820515, 0.560546875, 0.057777777777777775]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.170.jpg",
  "colors": {
    "hex": "#a5927e",
    "hls": [0.08547008547008546, 0.568359375, 0.17647058823529413]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.171.jpg",
  "colors": {
    "hex": "#a0887d",
    "hls": [0.05238095238095238, 0.556640625, 0.15418502202643172]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.174.jpg",
  "colors": {
    "hex": "#978175",
    "hls": [0.0588235294117647, 0.5234375, 0.13934426229508196]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.175.jpg",
  "colors": {
    "hex": "#90959a",
    "hls": [0.5833333333333334, 0.58203125, 0.04672897196261682]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.177.jpg",
  "colors": {
    "hex": "#9f8879",
    "hls": [0.06578947368421052, 0.546875, 0.16379310344827586]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.178.jpg",
  "colors": {
    "hex": "#889291",
    "hls": [0.48333333333333334, 0.55078125, 0.043478260869565216]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.179.jpg",
  "colors": {
    "hex": "#959c8e",
    "hls": [0.25, 0.58203125, 0.06542056074766354]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.18.jpg",
  "colors": {
    "hex": "#81866a",
    "hls": [0.1964285714285714, 0.46875, 0.11666666666666667]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.180.jpg",
  "colors": {
    "hex": "#898f86",
    "hls": [0.27777777777777773, 0.541015625, 0.03829787234042553]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.181.jpg",
  "colors": {
    "hex": "#777f76",
    "hls": [0.3148148148148148, 0.478515625, 0.036734693877551024]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.182.jpg",
  "colors": {
    "hex": "#ae9e97",
    "hls": [0.050724637681159424, 0.634765625, 0.12299465240641712]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.183.jpg",
  "colors": {
    "hex": "#97a38b",
    "hls": [0.25, 0.58984375, 0.11428571428571428]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.184.jpg",
  "colors": {
    "hex": "#8f9797",
    "hls": [0.5, 0.57421875, 0.03669724770642202]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.21.jpg",
  "colors": {
    "hex": "#928b7b",
    "hls": [0.11594202898550725, 0.525390625, 0.09465020576131687]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.22.jpg",
  "colors": {
    "hex": "#8a8b72",
    "hls": [0.17333333333333334, 0.494140625, 0.09881422924901186]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.23.jpg",
  "colors": {
    "hex": "#80876a",
    "hls": [0.2068965517241379, 0.470703125, 0.12033195020746888]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.24.jpg",
  "colors": {
    "hex": "#97a384",
    "hls": [0.23118279569892475, 0.576171875, 0.14285714285714285]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.26.jpg",
  "colors": {
    "hex": "#8e967b",
    "hls": [0.21604938271604937, 0.533203125, 0.11297071129707113]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.31.jpg",
  "colors": {
    "hex": "#8e9b7c",
    "hls": [0.23655913978494625, 0.544921875, 0.13304721030042918]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.32.jpg",
  "colors": {
    "hex": "#868973",
    "hls": [0.18939393939393936, 0.4921875, 0.0873015873015873]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.4.jpg",
  "colors": {
    "hex": "#869f75",
    "hls": [0.26587301587301587, 0.5390625, 0.17796610169491525]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.40.jpg",
  "colors": {
    "hex": "#a69a8b",
    "hls": [0.0925925925925926, 0.595703125, 0.13043478260869565]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.41.jpg",
  "colors": {
    "hex": "#8d8b74",
    "hls": [0.15333333333333335, 0.501953125, 0.09803921568627451]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.43.jpg",
  "colors": {
    "hex": "#9a8a7c",
    "hls": [0.07777777777777778, 0.54296875, 0.1282051282051282]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.5.jpg",
  "colors": {
    "hex": "#91a282",
    "hls": [0.2552083333333333, 0.5703125, 0.14545454545454545]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.50.jpg",
  "colors": {
    "hex": "#909679",
    "hls": [0.20114942528735633, 0.529296875, 0.12033195020746888]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.51.jpg",
  "colors": {
    "hex": "#8c9579",
    "hls": [0.22023809523809526, 0.52734375, 0.11570247933884298]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.52.jpg",
  "colors": {
    "hex": "#8d9883",
    "hls": [0.25396825396825395, 0.552734375, 0.09170305676855896]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.53.jpg",
  "colors": {
    "hex": "#76785c",
    "hls": [0.1785714285714286, 0.4140625, 0.1320754716981132]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.54.jpg",
  "colors": {
    "hex": "#788f68",
    "hls": [0.26495726495726496, 0.482421875, 0.15789473684210525]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.55.jpg",
  "colors": {
    "hex": "#92977b",
    "hls": [0.1964285714285714, 0.53515625, 0.11764705882352941]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.56.jpg",
  "colors": {
    "hex": "#8a957a",
    "hls": [0.23456790123456792, 0.529296875, 0.11203319502074689]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.57.jpg",
  "colors": {
    "hex": "#878a6d",
    "hls": [0.1839080459770115, 0.482421875, 0.11740890688259109]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.58.jpg",
  "colors": {
    "hex": "#868e6e",
    "hls": [0.20833333333333334, 0.4921875, 0.12698412698412698]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.6.jpg",
  "colors": {
    "hex": "#95897a",
    "hls": [0.0925925925925926, 0.529296875, 0.11203319502074689]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.66.jpg",
  "colors": {
    "hex": "#9b9080",
    "hls": [0.09876543209876543, 0.552734375, 0.11790393013100436]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.7.jpg",
  "colors": {
    "hex": "#8c8d78",
    "hls": [0.17460317460317457, 0.509765625, 0.08366533864541832]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.74.jpg",
  "colors": {
    "hex": "#888b77",
    "hls": [0.19166666666666665, 0.50390625, 0.07874015748031496]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.8.jpg",
  "colors": {
    "hex": "#968677",
    "hls": [0.08064516129032258, 0.525390625, 0.12757201646090535]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.89.jpg",
  "colors": {
    "hex": "#83886e",
    "hls": [0.19871794871794876, 0.48046875, 0.10569105691056911]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.9.jpg",
  "colors": {
    "hex": "#879575",
    "hls": [0.23958333333333334, 0.51953125, 0.13008130081300814]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.96.jpg",
  "colors": {
    "hex": "#7e8983",
    "hls": [0.4090909090909091, 0.513671875, 0.04417670682730924]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D086.98.jpg",
  "colors": {
    "hex": "#778378",
    "hls": [0.34722222222222227, 0.48828125, 0.048]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.1.jpg",
  "colors": {
    "hex": "#9da696",
    "hls": [0.2604166666666667, 0.6171875, 0.08163265306122448]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.10.jpg",
  "colors": {
    "hex": "#909482",
    "hls": [0.20370370370370372, 0.54296875, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.103.jpg",
  "colors": {
    "hex": "#98a288",
    "hls": [0.23076923076923075, 0.58203125, 0.12149532710280374]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.105.jpg",
  "colors": {
    "hex": "#85847c",
    "hls": [0.14814814814814814, 0.501953125, 0.03529411764705882]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.106.jpg",
  "colors": {
    "hex": "#7f7f79",
    "hls": [0.16666666666666666, 0.484375, 0.024193548387096774]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.107.jpg",
  "colors": {
    "hex": "#7d8572",
    "hls": [0.23684210526315788, 0.482421875, 0.07692307692307693]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.109.jpg",
  "colors": {
    "hex": "#898780",
    "hls": [0.12962962962962962, 0.517578125, 0.03643724696356275]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.114.jpg",
  "colors": {
    "hex": "#7f7e75",
    "hls": [0.15, 0.4765625, 0.040983606557377046]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.12.jpg",
  "colors": {
    "hex": "#838970",
    "hls": [0.2066666666666667, 0.486328125, 0.10040160642570281]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.120.jpg",
  "colors": {
    "hex": "#798c72",
    "hls": [0.2884615384615385, 0.49609375, 0.10236220472440945]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.121.jpg",
  "colors": {
    "hex": "#818c70",
    "hls": [0.23214285714285712, 0.4921875, 0.1111111111111111]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.122.jpg",
  "colors": {
    "hex": "#808573",
    "hls": [0.21296296296296294, 0.484375, 0.07258064516129033]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.123.jpg",
  "colors": {
    "hex": "#798470",
    "hls": [0.2583333333333333, 0.4765625, 0.08196721311475409]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.125.jpg",
  "colors": {
    "hex": "#8f8a7c",
    "hls": [0.12280701754385966, 0.521484375, 0.07755102040816327]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.126.jpg",
  "colors": {
    "hex": "#838a70",
    "hls": [0.21153846153846154, 0.48828125, 0.104]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.13.jpg",
  "colors": {
    "hex": "#8e877f",
    "hls": [0.08888888888888889, 0.525390625, 0.06172839506172839]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.132.jpg",
  "colors": {
    "hex": "#7c806b",
    "hls": [0.19841269841269846, 0.458984375, 0.08936170212765958]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.136.jpg",
  "colors": {
    "hex": "#7f8568",
    "hls": [0.20114942528735633, 0.462890625, 0.12236286919831224]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.14.jpg",
  "colors": {
    "hex": "#949189",
    "hls": [0.12121212121212122, 0.556640625, 0.048458149779735685]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.141.jpg",
  "colors": {
    "hex": "#849279",
    "hls": [0.26, 0.521484375, 0.10204081632653061]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.142.jpg",
  "colors": {
    "hex": "#717c67",
    "hls": [0.25396825396825395, 0.443359375, 0.09251101321585903]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.143.jpg",
  "colors": {
    "hex": "#7c7a73",
    "hls": [0.12962962962962962, 0.466796875, 0.03765690376569038]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.144.jpg",
  "colors": {
    "hex": "#7d7c76",
    "hls": [0.14285714285714288, 0.474609375, 0.02880658436213992]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.15.jpg",
  "colors": {
    "hex": "#867a74",
    "hls": [0.05555555555555556, 0.48828125, 0.072]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.159.jpg",
  "colors": {
    "hex": "#929b85",
    "hls": [0.23484848484848486, 0.5625, 0.09821428571428571]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.16.jpg",
  "colors": {
    "hex": "#80796c",
    "hls": [0.10833333333333334, 0.4609375, 0.0847457627118644]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.161.jpg",
  "colors": {
    "hex": "#8c9384",
    "hls": [0.24444444444444446, 0.544921875, 0.06437768240343347]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.162.jpg",
  "colors": {
    "hex": "#919b7e",
    "hls": [0.2241379310344828, 0.548828125, 0.12554112554112554]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.163.jpg",
  "colors": {
    "hex": "#93997f",
    "hls": [0.20512820512820515, 0.546875, 0.11206896551724138]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.164.jpg",
  "colors": {
    "hex": "#8a9484",
    "hls": [0.2708333333333333, 0.546875, 0.06896551724137931]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.166.jpg",
  "colors": {
    "hex": "#909984",
    "hls": [0.23809523809523805, 0.556640625, 0.09251101321585903]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.175.jpg",
  "colors": {
    "hex": "#818e75",
    "hls": [0.25333333333333335, 0.505859375, 0.09881422924901186]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.178.jpg",
  "colors": {
    "hex": "#8b957c",
    "hls": [0.2333333333333333, 0.533203125, 0.10460251046025104]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.18.jpg",
  "colors": {
    "hex": "#888376",
    "hls": [0.12037037037037036, 0.49609375, 0.07086614173228346]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.180.jpg",
  "colors": {
    "hex": "#979f8e",
    "hls": [0.2450980392156863, 0.587890625, 0.08056872037914692]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.182.jpg",
  "colors": {
    "hex": "#949d8b",
    "hls": [0.25, 0.578125, 0.08333333333333333]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.183.jpg",
  "colors": {
    "hex": "#8e8f80",
    "hls": [0.1777777777777778, 0.529296875, 0.06224066390041494]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.19.jpg",
  "colors": {
    "hex": "#889078",
    "hls": [0.22222222222222224, 0.515625, 0.0967741935483871]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.2.jpg",
  "colors": {
    "hex": "#92957c",
    "hls": [0.18666666666666668, 0.533203125, 0.10460251046025104]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.20.jpg",
  "colors": {
    "hex": "#7d8b6c",
    "hls": [0.24193548387096775, 0.482421875, 0.12550607287449392]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.22.jpg",
  "colors": {
    "hex": "#7c876e",
    "hls": [0.24, 0.478515625, 0.10204081632653061]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.23.jpg",
  "colors": {
    "hex": "#6c6d5b",
    "hls": [0.1759259259259259, 0.390625, 0.09]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.24.jpg",
  "colors": {
    "hex": "#7f776c",
    "hls": [0.09649122807017545, 0.458984375, 0.08085106382978724]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.26.jpg",
  "colors": {
    "hex": "#858076",
    "hls": [0.11111111111111112, 0.490234375, 0.05976095617529881]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.28.jpg",
  "colors": {
    "hex": "#8c8780",
    "hls": [0.09722222222222221, 0.5234375, 0.04918032786885246]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.3.jpg",
  "colors": {
    "hex": "#8f967c",
    "hls": [0.21153846153846154, 0.53515625, 0.1092436974789916]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.32.jpg",
  "colors": {
    "hex": "#92a086",
    "hls": [0.2564102564102564, 0.57421875, 0.11926605504587157]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.33.jpg",
  "colors": {
    "hex": "#8b7d77",
    "hls": [0.05000000000000001, 0.50390625, 0.07874015748031496]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.37.jpg",
  "colors": {
    "hex": "#9f9e8d",
    "hls": [0.1574074074074074, 0.5859375, 0.08490566037735849]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.38.jpg",
  "colors": {
    "hex": "#989389",
    "hls": [0.11111111111111112, 0.564453125, 0.06726457399103139]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.4.jpg",
  "colors": {
    "hex": "#9ea291",
    "hls": [0.2058823529411765, 0.599609375, 0.08292682926829269]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.44.jpg",
  "colors": {
    "hex": "#849276",
    "hls": [0.25, 0.515625, 0.11290322580645161]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.46.jpg",
  "colors": {
    "hex": "#90907f",
    "hls": [0.16666666666666666, 0.529296875, 0.07053941908713693]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.47.jpg",
  "colors": {
    "hex": "#979986",
    "hls": [0.18421052631578946, 0.560546875, 0.08444444444444445]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.49.jpg",
  "colors": {
    "hex": "#777866",
    "hls": [0.1759259259259259, 0.43359375, 0.08108108108108109]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.50.jpg",
  "colors": {
    "hex": "#787964",
    "hls": [0.17460317460317457, 0.431640625, 0.09502262443438914]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.51.jpg",
  "colors": {
    "hex": "#808170",
    "hls": [0.17647058823529407, 0.470703125, 0.07053941908713693]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.52.jpg",
  "colors": {
    "hex": "#7e7f6b",
    "hls": [0.17499999999999996, 0.45703125, 0.08547008547008547]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.54.jpg",
  "colors": {
    "hex": "#827f74",
    "hls": [0.13095238095238096, 0.48046875, 0.056910569105691054]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.58.jpg",
  "colors": {
    "hex": "#7c8a6e",
    "hls": [0.25, 0.484375, 0.11290322580645161]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.60.jpg",
  "colors": {
    "hex": "#83836c",
    "hls": [0.16666666666666666, 0.466796875, 0.09623430962343096]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.61.jpg",
  "colors": {
    "hex": "#83917a",
    "hls": [0.26811594202898553, 0.521484375, 0.09387755102040816]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.63.jpg",
  "colors": {
    "hex": "#8f9e87",
    "hls": [0.27536231884057977, 0.572265625, 0.1050228310502283]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.65.jpg",
  "colors": {
    "hex": "#878b73",
    "hls": [0.19444444444444442, 0.49609375, 0.09448818897637795]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.66.jpg",
  "colors": {
    "hex": "#959082",
    "hls": [0.12280701754385966, 0.544921875, 0.0815450643776824]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.70.jpg",
  "colors": {
    "hex": "#929181",
    "hls": [0.1568627450980392, 0.537109375, 0.07172995780590717]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.71.jpg",
  "colors": {
    "hex": "#959c84",
    "hls": [0.21527777777777776, 0.5625, 0.10714285714285714]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.72.jpg",
  "colors": {
    "hex": "#93997d",
    "hls": [0.2023809523809524, 0.54296875, 0.11965811965811966]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.73.jpg",
  "colors": {
    "hex": "#988e82",
    "hls": [0.0909090909090909, 0.55078125, 0.09565217391304348]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.79.jpg",
  "colors": {
    "hex": "#7f8a6d",
    "hls": [0.2298850574712644, 0.482421875, 0.11740890688259109]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.8.jpg",
  "colors": {
    "hex": "#828c73",
    "hls": [0.2333333333333333, 0.498046875, 0.09803921568627451]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.82.jpg",
  "colors": {
    "hex": "#a1a892",
    "hls": [0.21969696969696972, 0.61328125, 0.1111111111111111]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.85.jpg",
  "colors": {
    "hex": "#8e8b83",
    "hls": [0.12121212121212122, 0.533203125, 0.04602510460251046]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.86.jpg",
  "colors": {
    "hex": "#868480",
    "hls": [0.11111111111111112, 0.51171875, 0.024]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.9.jpg",
  "colors": {
    "hex": "#928f89",
    "hls": [0.11111111111111112, 0.552734375, 0.039301310043668124]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.90.jpg",
  "colors": {
    "hex": "#919989",
    "hls": [0.25, 0.56640625, 0.07207207207207207]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.92.jpg",
  "colors": {
    "hex": "#78806d",
    "hls": [0.23684210526315788, 0.462890625, 0.08016877637130802]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D111.95.jpg",
  "colors": {
    "hex": "#7d7b74",
    "hls": [0.12962962962962962, 0.470703125, 0.03734439834024896]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.10.jpg",
  "colors": {
    "hex": "#97938c",
    "hls": [0.10606060606060606, 0.568359375, 0.049773755656108594]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.12.jpg",
  "colors": {
    "hex": "#8c887c",
    "hls": [0.125, 0.515625, 0.06451612903225806]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.13.jpg",
  "colors": {
    "hex": "#736c62",
    "hls": [0.09803921568627451, 0.416015625, 0.07981220657276995]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.14.jpg",
  "colors": {
    "hex": "#837f72",
    "hls": [0.12745098039215685, 0.478515625, 0.06938775510204082]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.15.jpg",
  "colors": {
    "hex": "#7c786c",
    "hls": [0.125, 0.453125, 0.06896551724137931]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.16.jpg",
  "colors": {
    "hex": "#837c6f",
    "hls": [0.10833333333333334, 0.47265625, 0.08264462809917356]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.17.jpg",
  "colors": {
    "hex": "#8a867e",
    "hls": [0.11111111111111112, 0.515625, 0.04838709677419355]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.18.jpg",
  "colors": {
    "hex": "#848077",
    "hls": [0.11538461538461538, 0.490234375, 0.05179282868525897]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.20.jpg",
  "colors": {
    "hex": "#81796e",
    "hls": [0.09649122807017545, 0.466796875, 0.0794979079497908]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.21.jpg",
  "colors": {
    "hex": "#8a8377",
    "hls": [0.10526315789473684, 0.501953125, 0.07450980392156863]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.23.jpg",
  "colors": {
    "hex": "#79756b",
    "hls": [0.11904761904761905, 0.4453125, 0.06140350877192982]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.24.jpg",
  "colors": {
    "hex": "#787066",
    "hls": [0.0925925925925926, 0.43359375, 0.08108108108108109]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.25.jpg",
  "colors": {
    "hex": "#7a7363",
    "hls": [0.11594202898550725, 0.431640625, 0.10407239819004525]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.26.jpg",
  "colors": {
    "hex": "#837f74",
    "hls": [0.12222222222222223, 0.482421875, 0.06072874493927125]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.28.jpg",
  "colors": {
    "hex": "#837c71",
    "hls": [0.10185185185185186, 0.4765625, 0.07377049180327869]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.34.jpg",
  "colors": {
    "hex": "#7a7166",
    "hls": [0.09166666666666667, 0.4375, 0.08928571428571429]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.35.jpg",
  "colors": {
    "hex": "#6c6357",
    "hls": [0.09523809523809523, 0.380859375, 0.1076923076923077]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.36.jpg",
  "colors": {
    "hex": "#afaba3",
    "hls": [0.11111111111111112, 0.66015625, 0.06896551724137931]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.38.jpg",
  "colors": {
    "hex": "#8f877c",
    "hls": [0.09649122807017545, 0.521484375, 0.07755102040816327]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.40.jpg",
  "colors": {
    "hex": "#8a847b",
    "hls": [0.09999999999999999, 0.509765625, 0.05976095617529881]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.60.jpg",
  "colors": {
    "hex": "#807e78",
    "hls": [0.125, 0.484375, 0.03225806451612903]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.61.jpg",
  "colors": {
    "hex": "#82796b",
    "hls": [0.10144927536231885, 0.462890625, 0.0970464135021097]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.62.jpg",
  "colors": {
    "hex": "#8b8373",
    "hls": [0.11111111111111112, 0.49609375, 0.09448818897637795]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.80.jpg",
  "colors": {
    "hex": "#7f7d77",
    "hls": [0.125, 0.48046875, 0.032520325203252036]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.81.jpg",
  "colors": {
    "hex": "#7b7a73",
    "hls": [0.14583333333333334, 0.46484375, 0.03361344537815126]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.82.jpg",
  "colors": {
    "hex": "#85837d",
    "hls": [0.125, 0.50390625, 0.031496062992125984]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.83.jpg",
  "colors": {
    "hex": "#7c7a72",
    "hls": [0.13333333333333333, 0.46484375, 0.04201680672268908]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.85.jpg",
  "colors": {
    "hex": "#968a77",
    "hls": [0.10215053763440861, 0.525390625, 0.12757201646090535]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.86.jpg",
  "colors": {
    "hex": "#a79d89",
    "hls": [0.11111111111111112, 0.59375, 0.14423076923076922]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.87.jpg",
  "colors": {
    "hex": "#9e9481",
    "hls": [0.10919540229885057, 0.560546875, 0.1288888888888889]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Cetoniinae_D166a.88.jpg",
  "colors": {
    "hex": "#978d78",
    "hls": [0.11290322580645162, 0.529296875, 0.12863070539419086]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.10.jpg",
  "colors": {
    "hex": "#807f7a",
    "hls": [0.1388888888888889, 0.48828125, 0.024]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.100.jpg",
  "colors": {
    "hex": "#6d6a64",
    "hls": [0.11111111111111112, 0.408203125, 0.0430622009569378]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.103.jpg",
  "colors": {
    "hex": "#7a7670",
    "hls": [0.09999999999999999, 0.45703125, 0.042735042735042736]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.105.jpg",
  "colors": {
    "hex": "#78736c",
    "hls": [0.09722222222222221, 0.4453125, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.106.jpg",
  "colors": {
    "hex": "#6d6b64",
    "hls": [0.12962962962962962, 0.408203125, 0.0430622009569378]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.107.jpg",
  "colors": {
    "hex": "#83817a",
    "hls": [0.12962962962962962, 0.494140625, 0.03557312252964427]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.109.jpg",
  "colors": {
    "hex": "#6f6a64",
    "hls": [0.0909090909090909, 0.412109375, 0.052132701421800945]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.11.jpg",
  "colors": {
    "hex": "#a09e99",
    "hls": [0.11904761904761905, 0.611328125, 0.035175879396984924]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.110.jpg",
  "colors": {
    "hex": "#6f6c66",
    "hls": [0.11111111111111112, 0.416015625, 0.04225352112676056]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.111.jpg",
  "colors": {
    "hex": "#62625c",
    "hls": [0.16666666666666666, 0.37109375, 0.031578947368421054]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.113.jpg",
  "colors": {
    "hex": "#6e6a65",
    "hls": [0.0925925925925926, 0.412109375, 0.04265402843601896]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.114.jpg",
  "colors": {
    "hex": "#76716c",
    "hls": [0.08333333333333333, 0.44140625, 0.04424778761061947]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.115.jpg",
  "colors": {
    "hex": "#736860",
    "hls": [0.07017543859649122, 0.412109375, 0.09004739336492891]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.118.jpg",
  "colors": {
    "hex": "#6e6c66",
    "hls": [0.125, 0.4140625, 0.03773584905660377]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.12.jpg",
  "colors": {
    "hex": "#736b66",
    "hls": [0.0641025641025641, 0.423828125, 0.059907834101382486]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.120.jpg",
  "colors": {
    "hex": "#696762",
    "hls": [0.11904761904761905, 0.396484375, 0.034482758620689655]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.121.jpg",
  "colors": {
    "hex": "#6b6762",
    "hls": [0.0925925925925926, 0.400390625, 0.04390243902439024]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.13.jpg",
  "colors": {
    "hex": "#6c6862",
    "hls": [0.09999999999999999, 0.40234375, 0.04854368932038835]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.134.jpg",
  "colors": {
    "hex": "#717069",
    "hls": [0.14583333333333334, 0.42578125, 0.03669724770642202]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.14.jpg",
  "colors": {
    "hex": "#716e69",
    "hls": [0.10416666666666667, 0.42578125, 0.03669724770642202]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.140.jpg",
  "colors": {
    "hex": "#726e69",
    "hls": [0.0925925925925926, 0.427734375, 0.0410958904109589]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.145.jpg",
  "colors": {
    "hex": "#a09c98",
    "hls": [0.08333333333333333, 0.609375, 0.04]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.149.jpg",
  "colors": {
    "hex": "#76726d",
    "hls": [0.0925925925925926, 0.443359375, 0.039647577092511016]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.150.jpg",
  "colors": {
    "hex": "#726a65",
    "hls": [0.0641025641025641, 0.419921875, 0.06046511627906977]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.158.jpg",
  "colors": {
    "hex": "#73706a",
    "hls": [0.11111111111111112, 0.431640625, 0.04072398190045249]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.166.jpg",
  "colors": {
    "hex": "#786d67",
    "hls": [0.0588235294117647, 0.435546875, 0.07623318385650224]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.168.jpg",
  "colors": {
    "hex": "#827670",
    "hls": [0.05555555555555556, 0.47265625, 0.0743801652892562]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.17.jpg",
  "colors": {
    "hex": "#6d6a64",
    "hls": [0.11111111111111112, 0.408203125, 0.0430622009569378]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.174.jpg",
  "colors": {
    "hex": "#6b6962",
    "hls": [0.12962962962962962, 0.400390625, 0.04390243902439024]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.175.jpg",
  "colors": {
    "hex": "#706d67",
    "hls": [0.11111111111111112, 0.419921875, 0.04186046511627907]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.19.jpg",
  "colors": {
    "hex": "#6a6861",
    "hls": [0.12962962962962962, 0.396484375, 0.04433497536945813]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.68.jpg",
  "colors": {
    "hex": "#756d67",
    "hls": [0.07142857142857144, 0.4296875, 0.06363636363636363]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.7.jpg",
  "colors": {
    "hex": "#85837e",
    "hls": [0.11904761904761905, 0.505859375, 0.02766798418972332]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.74.jpg",
  "colors": {
    "hex": "#78746b",
    "hls": [0.11538461538461538, 0.443359375, 0.05726872246696035]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.77.jpg",
  "colors": {
    "hex": "#82807b",
    "hls": [0.11904761904761905, 0.494140625, 0.02766798418972332]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.8.jpg",
  "colors": {
    "hex": "#7b7973",
    "hls": [0.125, 0.46484375, 0.03361344537815126]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.80.jpg",
  "colors": {
    "hex": "#6e6863",
    "hls": [0.07575757575757576, 0.408203125, 0.05263157894736842]
  }
}, {
  "file": "MFNB_Col_Scarabaeidae_Dynastinae_D071.89.jpg",
  "colors": {
    "hex": "#807d77",
    "hls": [0.11111111111111112, 0.482421875, 0.03643724696356275]
  }
}];
/* harmony export (immutable) */ __webpack_exports__["a"] = fileColors;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "controls" }, [
      _c("div", [
        _vm._v("\n\t\t\t" + _vm._s(_vm.size) + "\n\t\t\t"),
        _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.size,
              expression: "size"
            }
          ],
          staticClass: "size",
          attrs: { type: "range", min: "0.3", max: "1.2", step: "0.01" },
          domProps: { value: _vm.size },
          on: {
            __r: function($event) {
              _vm.size = $event.target.value
            }
          }
        })
      ]),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "shuffle",
          on: {
            click: function($event) {
              _vm.shuffle()
            }
          }
        },
        [_vm._v("S")]
      )
    ]),
    _vm._v(" "),
    _c(
      "div",
      { attrs: { id: "gallery" } },
      _vm._l(_vm.fileColorShuffled.slice(0, 100), function(fileColor) {
        return _c("div", {
          style: {
            width: _vm.size * 10 + "em",
            height: _vm.size * 20 + "em",
            margin: _vm.size * 5 + "em",
            backgroundImage:
              "url(img/bugs-small-marked-bgremoved/" + fileColor.file + ")"
          }
        })
      })
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-957518ac", esExports)
  }
}

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "web-app" },
    [
      _c("div", { staticClass: "spacer" }),
      _vm._v(" "),
      _vm._m(0),
      _vm._v(" "),
      _c("h1", [_vm._v("Haxorpoda Collective")]),
      _vm._v(" "),
      _c("masonary-grid"),
      _vm._v(" "),
      _c("h2", [_vm._v("Reload to see more")]),
      _vm._v(" "),
      _vm._m(1)
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("a", { attrs: { href: "https://twitter.com/haxorpoda" } }, [
      _c("img", {
        staticClass: "logo",
        attrs: {
          src: "img/haxorpoda.logo.png",
          alt: "Haxorpoda Collective logo"
        }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("h3", [
      _c("a", { attrs: { href: "https://twitter.com/haxorpoda" } }, [
        _vm._v("@haxorpoda")
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-47323bf2", esExports)
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map