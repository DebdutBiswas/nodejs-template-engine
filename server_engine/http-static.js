const fs = require('fs');
const url = require('url');
const path = require('path');

const httpMime = require('./http-mime');
const httpRegx = require('./http-regx');

class initHttp {
    constructor(staticPath) {
        this.staticPath = staticPath;
    }

    serve = (req, res, dynamicObj, dynamicFilePath) => {
        let urlPath = decodeURI(url.parse(req.url).pathname);
    
        let filePath = path.normalize(this.staticPath + urlPath);
        let fileExt = path.extname(urlPath);
        // let fileName = path.basename(urlPath);
    
        let isDirPath = false;
        let isFilePath = false;

        if (typeof dynamicFilePath === 'undefined') {
            if (fs.existsSync(filePath)) {
                isDirPath = fs.statSync(filePath).isDirectory();
                if (isDirPath) {
                    filePath = path.join(filePath, 'index.html');
                    fileExt = path.extname(filePath);
                }
            } else if (fs.existsSync(filePath + '.html')) {
                isFilePath = fs.statSync(filePath + '.html').isFile();
                if (isFilePath) {
                    filePath = filePath + '.html';
                    fileExt = path.extname(filePath);
                }
            } else if (fs.existsSync(filePath.replace(/(\\$)/, '.html'))) {
                filePath = filePath.replace(/(\\$)/, '.html');
                isFilePath = fs.statSync(filePath).isFile();
                if (isFilePath) {
                    fileExt = path.extname(filePath);
                }
            }
        } else {
            if (fs.existsSync(this.staticPath + dynamicFilePath)) {
                filePath = this.staticPath + dynamicFilePath;
                fileExt = path.extname(filePath);
            }
        }
    
        fs.readFile(filePath, (fileReadError, fileData) => {
            if (fileReadError) {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(404);

                fs.readFile(this.staticPath + '/http_errors/404.html', (fileReadError404, fileData404) => {
                    if (fileReadError404) {
                        res.write(`
                            <http>
                                <head>
                                    <title>Error (404)</title>
                                </head>
                                <body>
                                    <center>
                                        <h1>404 Error!</h1>
                                    </center>
                                </body>
                            </http>
                        `);
                        res.end();
                        return;
                    }

                    res.write(fileData404);
                    res.end();
                });
                
                return;
            }
    
            res.setHeader('Content-Type', httpMime.setMimeType(fileExt));
            if (isDirPath && urlPath.length && urlPath.charAt(urlPath.length - 1) !== '/') {
                res.writeHead(301, { 'Location': urlPath + '/' });
            }
            else if ((fileExt === '.html') && (isFilePath && urlPath.length && urlPath.charAt(urlPath.length - 1) !== '/')) {
                res.writeHead(301, { 'Location': urlPath.replace(fileExt, '') + '/' });
            } else {
                res.writeHead(200);
            }
            
            if (typeof dynamicObj === 'undefined') {
                res.write(fileData);
            } else {
                res.write(httpRegx.regxReplaceAll(fileData, dynamicObj));
            }

            res.end();
        });
    };
}

module.exports = {
    initHttp: initHttp,
    moduleInfo: { name: 'Http Static', version: '1.0-beta' }
};