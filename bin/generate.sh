#!/bin/bash

openssl genrsa -out keys/app.rsa 1024
openssl rsa -in keys/app.rsa -pubout > keys/app.rsa.pub
