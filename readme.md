# JSON Web Token in Go


Token-Based Authentication instead of Cookies

* [Setup](#setup)
* [Run](#run)

## Setup

    go get
    go build

## Run

```
./JSON-Web-Token-in-Go
open 0.0.0.0:3000
curl -v -H "Accept: application/json" -H "Content-type: application/json" POST -d '{"user":"test","pass":"known"}' http://localhost:3000/authenticate
curl -v -H "Accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NzM3NTU4OTksImlhdCI6MTQ3Mzc1NDA5OSwiVXNlcm5hbWUiOiJkYW4ifQ.I8t0TaZ85qWNtM7ZmnvSywTVHXjbXIkQrW-GOpCBTj4" localhost:3000/restricted
```

## References

* https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
* https://sendgrid.com/blog/tokens-tokens-intro-json-web-tokens-jwt-go/
* https://gist.github.com/cryptix/45c33ecf0ae54828e63b
