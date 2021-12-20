const { mimeTypes } = require('../server_configs/config');

setMimeType = fileExt => {
    let mimeType = ((typeof mimeTypes[fileExt] === 'undefined') ? 'application/octet-stream' : mimeTypes[fileExt]);
    return mimeType;
}

module.exports = {
    setMimeType: setMimeType
};