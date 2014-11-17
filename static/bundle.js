(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/oren/projects/go/src/github.com/oren/jwt/static/main.js":[function(require,module,exports){
document.addEventListener('DOMContentLoaded', function() {
  var $ = document.querySelector.bind(document);

  var submit = $('form input[type=submit]');
  submit.addEventListener('click', auth);

  function auth (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('ajax call to /authenticate');
  }
});

},{}]},{},["/home/oren/projects/go/src/github.com/oren/jwt/static/main.js"]);
