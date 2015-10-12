var config = require('../config.json');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
var db = null;

MongoClient.connect(url, function(err, _db) {
    if(!err) {
        db = _db;
        console.log("Connected correctly to mongodb server.");
    } else {
        console.log(err);
    }
});

module.exports = {
    db: function(){
        if(db) {
            return db;
        }
    }
};