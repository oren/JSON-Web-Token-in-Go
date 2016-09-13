# JSON Web Token in Go


Token-Based Authentication instead of Cookies

* [Setup](#setup)
* [Run](#run)

## Setup

    make keys
    browserify -t brfs static/main.js > static/bundle.js
    go get
    go build

## Run

    ./jwt
    open 0.0.0.0:3000

## References

* https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
* https://sendgrid.com/blog/tokens-tokens-intro-json-web-tokens-jwt-go/
* https://gist.github.com/cryptix/45c33ecf0ae54828e63b

## Misc

```
curl -v -H "Accept: application/json" -H "Content-type: application/json" POST -d '{"user":"test","pass":"known"}' http://localhost:3000/authenticate
curl -v -H "Accept: application/json" -H "Authorization: Bearer " localhost:3000/restricted

curl -v -H "Accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NzM3NTU3MjYsImlhdCI6MTQ3Mzc1MzkyNiwiVXNlcm5hbWUiOiJkYW4ifQ.PYwtmaHKaELUbK8RnFbYeO7OtQnJOAwjZpHGF4jA4m4" localhost:3000/restricted
```

```
<base64-encoded header>.<base64-encoded claims>.<base64-encoded signature>
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2Nlc3NUb2tlbiI6ImxldmVsMSIsIkN1c3RvbVVzZXJJbmZvIjp7Ik5hbWUiOiJ0ZXN0IiwiS2luZCI6Imh1bWFuIn0sImV4cCI6MTQxNjE5MTY5M30.oiZfXAZCUz9mK1ewxqJhui5zHFid6gXQdJRPxyBuN-gEuRidGOTBpwaTK0CBh2r0VskzVM-k3IRsg-o6FectOjQ4mAo7XqMVu17_khCPQs00uVZR0GfhmcGsdrRELYyNd3QwUZDDcFIZ4avoEyMoAeru8TqPDtiTfbaZ-IDNN4-S_ElcAkFnqYYaic03HNQxCoXdZ6VjIc1f21pkFzjOnjrxr70r6eQot9TEPh9nhbhRLUhdC3hnSCDseKpSi6tB7U5Jc-g9rxYjYj2IXIENp80Pm45ns7YEU_b0FvpWe0C-CWD78zTvIMkLossuGHqP_8kGpQJMWm6oUPWYyRX27g

sessionStorage - The data persisted there lives until the browser tab is closed.
  // Save
  window.sessionStorage.token = data.token;

  // Erase the token if the user fails to log in
  delete $window.sessionStorage.token;

browser sends jwt on each request:
  headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
```
