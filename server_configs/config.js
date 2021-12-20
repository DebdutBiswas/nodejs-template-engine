const fs = require('fs');

const httpsCrypto = JSON.parse(fs.readFileSync('./server_configs/https_crypto.json'));
const securityHeaders = JSON.parse(fs.readFileSync('./server_configs/security_headers.json'));
const mimeTypes = JSON.parse(fs.readFileSync('./server_configs/mime_types.json'));

httpsCrypto.cert = [fs.readFileSync(httpsCrypto.cert_ecc), fs.readFileSync(httpsCrypto.cert_rsa)];
httpsCrypto.key = [fs.readFileSync(httpsCrypto.key_ecc), fs.readFileSync(httpsCrypto.key_rsa)];
httpsCrypto.dhparam = fs.readFileSync(httpsCrypto.dhparam);

//console.log(crypto.createHash('sha256').update(fs.readFileSync('./server_certs/server_ecc.crt')).digest('base64'));

module.exports = {
    securityHeaders: securityHeaders,
    mimeTypes: mimeTypes,
    httpsCrypto: httpsCrypto
};