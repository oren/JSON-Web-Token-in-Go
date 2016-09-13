package main

// using asymmetric crypto/RSA keys

import (
	"fmt"
	"log"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
)

type YourCustomClaims struct {
	jwt.StandardClaims
	Username string
}

func CreateToken(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, YourCustomClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 30).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		username,
	})

	tokenString, err := token.SignedString([]byte("secret"))

	return tokenString, err
}

// Validate token from http request. Returns empty string if token not valid.
func ValidateTokenFromRequest(r *http.Request) (string, error) {
	claims := &YourCustomClaims{}
	_, err := request.ParseFromRequestWithClaims(r, request.AuthorizationHeaderExtractor, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret"), nil
	})

	if err != nil {
		return "", err
	}

	return claims.Username, nil
}

// reads the form values, checks them and creates the token
func authHandler(w http.ResponseWriter, r *http.Request) {
	// make sure its post
	if r.Method != "POST" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintln(w, "No POST", r.Method)
		return
	}

	tokenString, err := CreateToken("dan")

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, "error creating jwt token", err)
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, tokenString)
}

// only accessible with a valid token
func restrictedHandler(w http.ResponseWriter, r *http.Request) {

	name, err := ValidateTokenFromRequest(r)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, "error validating jwt token", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "success."+name)
	return
}

// setup the handlers and start listening to requests
func main() {
	http.HandleFunc("/authenticate", authHandler)
	http.HandleFunc("/restricted", restrictedHandler)

	http.ListenAndServe(":3000", nil)

	log.Println("Listening...")
}
