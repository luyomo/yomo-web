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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function setCookie(name, value, options) {
	options = options || {};

	const days = options.days || options.expires || '';
	const cpath = options.path || '';
	const domain = options.domain || '';
	const secure = options.secure || '';

	if(!name) {
		throw new Error('Cookie must have name.');
	}
	else if(!value) {
		throw new Error('Cookie must have value.');
	}

	if(typeof value === 'object') {
		value = JSON.stringify(value);
	}

	value = escape(value);

	let cookieString = `${name}=${value}`;
	if(days) {
		let time = new Date();
		let expires = time.setDate(time.getDate() + days);
		
		cookieString += `; expires=${new Date(expires).toGMTString()}`;
	}
	if(cpath) cookieString += `; path=${cpath}`;
	if(domain) cookieString += `; domain=${domain}`;
	if(secure) cookieString += `; secure`;

	document.cookie = cookieString;
}

function getCookie(name) {
	let findName = new RegExp(name + '=([^;]*)');
	let result = findName.test(document.cookie) ? unescape(RegExp.$1) : '';

	// try deserialize
	try {
		let resultJSON = JSON.parse(result);
		result = resultJSON; 
	}
	// it is not a object!
	catch(e) {}

	return result;
}

function deleteCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}

module.exports = {
	set: setCookie,
	get: getCookie,
	delete: deleteCookie
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {



(function() {
  const $node = {
    jsonCookie: __webpack_require__(0)
  };

  window.$node = $node;
})();



/***/ })
/******/ ]);