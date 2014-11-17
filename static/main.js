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
