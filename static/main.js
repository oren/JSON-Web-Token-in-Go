'use strict';

var $ = document.querySelector.bind(document);
var xhr = require('xhr');
var serialize = require('form-serialize');
var tmpl = require('microtemplates');
var fs = require('fs');
var restrictedTmpl = fs.readFileSync('./static/templates/restricted.html', 'utf8');
var homeTmpl = fs.readFileSync('./static/templates/home.html', 'utf8');

document.addEventListener('DOMContentLoaded', function() {
  var main = $('main');

  var submit = $('form input[type=submit]');
  submit.addEventListener('click', auth);

  var restricted = $('.restricted');
  restricted.addEventListener('click', renderRestricted.bind(undefined, main));

  function auth (e) {
    e.preventDefault();
    e.stopPropagation();

    var form = $('form');
    var obj = serialize(form, { hash: true });
    callAuth(JSON.stringify(obj));
  }
});

function callAuth(formData) {
  xhr({
      uri: '/authenticate',
      method: 'POST',
      body: formData,
      headers: {
          'Content-Type': 'application/json'
      }
  }, function (err, resp, body) {
    if (resp.statusCode === 200) {
      window.sessionStorage.token = resp.body;
      return;
    }

    delete window.sessionStorage.token;
    console.log('code', resp.statusCode);
    console.log('body', resp.body);
  });
}

function renderRestricted(main, e) {
  console.log('main', main);
  e.preventDefault();
  e.stopPropagation();
  main.innerHTML = tmpl(restrictedTmpl)({});

  var home = $('.home');
  home.addEventListener('click', renderHome.bind(undefined, main));
}

function renderHome(main, e) {
  console.log('main', main);
  e.preventDefault();
  e.stopPropagation();
  main.innerHTML = tmpl(homeTmpl)({});

  var restricted = $('.restricted');
  restricted.addEventListener('click', renderRestricted.bind(undefined, main));
}
