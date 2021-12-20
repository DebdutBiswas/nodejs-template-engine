const assert = require('assert');

const dbHandler = (err, dbClient) => {
    if (err) {
        console.log("Database not connected!");
        //throw err;
    }
    else {
        console.log("Database connected!");
    }
};

class mongoPlay {
    constructor(localDbHandler, dbName) {
        this.currDb = localDbHandler.db(dbName);
    }

    dbInsertOne = (collName, doc) => {
        this.currDb.collection(collName).insertOne(doc, (err, result) => {
            assert.equal(null, err);
            assert.equal(1, result.insertedCount);

            console.log('One document inserted!');
        });
    };

    dbInsertMany = (collName, docs) => {
        this.currDb.collection(collName).insertMany(docs, (err, result) => {
            assert.equal(null, err);
            assert.equal(docs.length, result.insertedCount);

            console.log(`${result.insertedCount} document(s) inserted!`);
        });
    };

    dbFind = (collName, match = {}, rlimit = 1, callback, ...extParams) => {
        this.currDb.collection(collName).find(match).limit(rlimit).toArray((err, docs) => {
            assert.equal(null, err);
            assert.ok(docs !== null);

            console.log(`${docs.length} document(s) found!`);
            callback(docs);
        });
    };
}

module.exports = {
    dbHandler: dbHandler,
    mongoPlay: mongoPlay,
    moduleInfo: { name: 'Mongos Play', version: '1.0-beta' }
};