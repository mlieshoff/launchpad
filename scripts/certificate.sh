#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
umask 077
mkdir -p certs
if [ -e certs/localhost.key ] || [ -e certs/localhost.crt ]; then
  echo 'Certificate files already exist; remove them explicitly to regenerate.' >&2
  exit 1
fi
openssl req -x509 -newkey rsa:2048 -sha256 -nodes -days 365 \
  -keyout certs/localhost.key -out certs/localhost.crt \
  -subj '/CN=localhost' \
  -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1' \
  -addext 'extendedKeyUsage=serverAuth'
