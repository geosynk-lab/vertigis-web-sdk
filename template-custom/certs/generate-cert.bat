@echo off
setlocal
set CERTS_DIR=%~dp0
if exist "%CERTS_DIR%cert.pem" if exist "%CERTS_DIR%key.pem" (
    echo [INFO] SSL certificate already exists in certs/
    exit /b 0
)
echo [INFO] Generating self-signed development SSL certificate via OpenSSL...
openssl req -x509 -newkey rsa:2048 -keyout "%CERTS_DIR%key.pem" -out "%CERTS_DIR%cert.pem" -days 365 -nodes -subj "/CN=localtest.me" -addext "subjectAltName=DNS:localtest.me,DNS:*.localtest.me,DNS:localhost,DNS:*.localhost,IP:127.0.0.1"
if errorlevel 1 (
    echo [WARN] OpenSSL command failed. Please ensure openssl is installed and in your PATH.
    exit /b 1
)
echo [SUCCESS] SSL certificate and private key generated in certs/ with SAN (localtest.me, localhost, 127.0.0.1)
echo [INFO] To make the browser trust it, run once: certutil -addstore -user Root "%CERTS_DIR%cert.pem"
