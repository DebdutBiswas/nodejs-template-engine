const fs = require('fs');

const dbCredentials = JSON.parse(fs.readFileSync('./db_configs/db_creds.json'));

module.exports = dbCredentials;