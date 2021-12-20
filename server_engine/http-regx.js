const regxReplaceAll = (resBody, jsonObj) => {
    if (typeof jsonObj !== 'undefined') {
        Object.keys(jsonObj).forEach(key => {
            resBody = String(resBody).replace(new RegExp(`\\$nv\\{${key}\\}`, 'g'), JSON.stringify(jsonObj[key]).replace(/(^"|"$)/g, ''));
        });
    }

    return resBody;
}

String.prototype.replaceAll = function(jsonObj) {
    return regxReplaceAll(String(this), jsonObj);
};

module.exports = {
    regxReplaceAll: regxReplaceAll
};