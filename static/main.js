'use strict';

var $ = document.querySelector.bind(document);
var xhr = require('xhr');
var serialize = require('form-serialize');

document.addEventListener('DOMContentLoaded', function() {

  var submit = $('form input[type=submit]');
  submit.addEventListener('click', auth);

  function auth (e) {
    e.preventDefault();
    e.stopPropagation();

    var form = $('form');
    var obj = serialize(form, { hash: true });
    callAuth(JSON.stringify(obj));
    console.log('ajax call to /authenticate');
  }
});

function callAuth(formData) {
  console.log('data', formData);

  xhr({
      uri: '/authenticate',
      method: 'POST',
      body: formData,
      headers: {
          'Content-Type': 'application/json'
      }
  }, function (err, resp, body) {
    console.log('code', resp.statusCode);
    console.log('body', resp.body);
    window.sessionStorage.token = resp.body;
  });
}

var form = document.querySelector('#example-form');

