'use strict';

var $ = document.querySelector.bind(document);
var xhr = require('xhr');
var serialize = require('form-serialize');
var tmpl = require('microtemplates');
var fs = require('fs');
var restrictedTmpl = fs.readFileSync('./static/templates/restricted.html', 'utf8');
var homeTmpl = fs.readFileSync('./static/templates/home.html', 'utf8');

document.addEventListener('DOMContentLoaded', function() {
  var submit = $('form input[type=submit]');
  submit.addEventListener('click', auth);

  var restricted = $('.restricted');
  restricted.addEventListener('click', renderRestricted);

  // Store the initial content so we can revisit it later
    history.replaceState({url: '/'}, '', '/');
});

function auth (e) {
  e.preventDefault();
  e.stopPropagation();

  var form = $('form');
  var obj = serialize(form, { hash: true });
  callAuth(JSON.stringify(obj));
}

// back button
window.onpopstate = function(e) {
  console.log('onpopstate. pathname: ', e.state);
  route(e.state.url);
};

function route(url) {
  switch (url) {
    case '/':
      renderHome();
      break;
    case '/restricted':
      renderRestricted();
      break;
    default:
      renderHome();
  }
}

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

function renderRestricted(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  var current = '/';
  var newUrl = '/restricted';
  window.history.pushState({url: current}, '', newUrl);
  console.log('pushed', current);
  var main = $('main');
  main.innerHTML = tmpl(restrictedTmpl)({});

  // events
  var home = $('.home');
  home.addEventListener('click', renderHome);

}

function renderHome(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  var current = '/restricted';
  var newUrl= '/';
  window.history.pushState({url: current}, '', newUrl);
  console.log('pushed', current);
  var main = $('main');
  main.innerHTML = tmpl(homeTmpl)({});


  // events
  var submit = $('form input[type=submit]');
  submit.addEventListener('click', auth);

  var restricted = $('.restricted');
  restricted.addEventListener('click', renderRestricted);
}
