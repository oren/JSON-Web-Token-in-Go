package main

// using asymmetric crypto/RSA keys

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
)

// location of the files used for signing and verification
const (
	privKeyPath = "keys/app.rsa"     // openssl genrsa -out keys/app.rsa 1024
	pubKeyPath  = "keys/app.rsa.pub" // openssl rsa -in keys/app.rsa -pubout > keys/app.rsa.pub
)

// keys are held in global variables
// i havn't seen a memory corruption/info leakage in go yet
// but maybe it's a better idea, just to store the public key in ram?
// and load the signKey on every signing request? depends on  your usage i guess
var (
	verifyKey, signKey []byte
)

// read the key files before starting http handlers
func init() {
	var err error

	signKey, err = ioutil.ReadFile(privKeyPath)
	if err != nil {
		log.Fatal("Error reading private key")
		return
	}

	verifyKey, err = ioutil.ReadFile(pubKeyPath)
	if err != nil {
		log.Fatal("Error reading private key")
		return
	}
}

// just some html, to lazy for http.FileServer()
const (
	tokenName      = "AccessToken"
	successHtml    = `<h2>Token Set - have fun!</h2><p>Go <a href="/">Back...</a></p>`
	restrictedHtml = `<h1>Welcome!!</h1><img src="https://httpcats.herokuapp.com/200" alt="" />`
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
	http.Handle("/", http.FileServer(http.Dir("static")))

	http.ListenAndServe(":3000", nil)

	log.Println("Listening...")
}
