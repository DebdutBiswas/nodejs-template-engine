const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
//const https = require('https');
const https = require('spdy');
const tlsSessionCache = require('tls-session-cache');
const helmet = require('helmet');

const config = require('./server_configs/config');
const routes = require('./routes-play');

const httpPort = 80;

const nodeServer = http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});
nodeServer.listen(httpPort);

const httpsPort = 443;
const httpsOptions = config.httpsCrypto;
const applyHelmetHeaders = helmet(config.securityHeaders);

const finalReqHandler = (req, res) => {
    applyHelmetHeaders(req, res, () => {
        routes.reqHandler(req, res);
    });
};

const nodeServerSecure = https.createServer(httpsOptions, finalReqHandler);
nodeServerSecure.listen(httpsPort, () => {
    tlsSessionCache(nodeServerSecure, { maxCachedSessions: 512 });
});