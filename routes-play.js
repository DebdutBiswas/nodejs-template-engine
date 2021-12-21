const fs = require('fs');
const querystring = require('querystring');
const mongodb = require('mongodb');

const dbConfig = require('./db_configs/config');
const mongos = require('./mongo-play');
const httpStatic = require('./server_engine/http-static');

const mongoUri = `${dbConfig.dbScheme}://${dbConfig.dbUser}:${dbConfig.dbPassword}@${dbConfig.dbHost}/?authSource=${dbConfig.dbAuthSource}&replicaSet=${dbConfig.dbReplicaSet}&readPreference=${dbConfig.dbReadPreference}&appname=${dbConfig.dbAppname}&tls=${dbConfig.dbSsl}`;

const mongoClient = new mongodb.MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoClient.connect(mongos.dbHandler);

let mongoClientCall = {};
setTimeout(() => {
    mongoClientCall = new mongos.mongoPlay(mongoClient, dbConfig.dbDatabase);
}, 5000);

//Static route handler for serving static contents
const httpStaticCall = new httpStatic.initHttp('./static_webroot');

const reqHandler = (req, res) => {
    //console.log(req.url, req.method, req.headers);

    res.setHeader('Server', 'nodejs template engine');
    //res.setHeader('Last-Modified', new Date().toUTCString());
    
    //Static route
    if (req.url === '/') {
        httpStaticCall.serve(req, res, {
            uri: req.url,
            method: req.method,
            host: req.headers.host,
            remoteAddress: req.connection.remoteAddress
        });
    }

    else if (req.url === '/api/post' && req.method === 'POST') {
        const reqBody = [];
        let $_POST = {};

        req.on('data', reqChunk => {
            reqBody.push(reqChunk);
        });
        
        req.on('end', () => {
            $_POST = JSON.parse(JSON.stringify(querystring.parse(reqBody.toString())));
            console.log(`Post Data: ${JSON.stringify($_POST)}`);
            mongoClientCall.dbInsertOne(dbConfig.dbCollection, $_POST);
            mongoClientCall.dbFind(dbConfig.dbCollection, $_POST, 10, docsCallback => {
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(docsCallback));
    
                res.end();
            });
        });
    }

    else if (req.url === '/api/get' && req.method === 'GET') {
        fs.readFile('./static_webroot/index.html', (fileReadError, fileData) => {
            if (fileReadError) {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(404);
                res.write(fs.readFileSync('./static_webroot/http_errors/404.html'));
                res.end();
                return;
            }

            res.setHeader('Content-Type', 'text/html');
            res.write(
                fileData.toString().replaceAll({
                    uri: req.url,
                    method: req.method,
                    host: req.headers.host,
                    remoteAddress: req.connection.remoteAddress
                })
            );
            res.end();
        });
    }

    else {
        httpStaticCall.serve(req, res);
    }
};

module.exports = {
    reqHandler: reqHandler,
    moduleInfo: { name: 'Routes Play', version: '1.0-beta' }
};