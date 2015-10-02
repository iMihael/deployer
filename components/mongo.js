var config = require('../config.json');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
var db;

var ret = {
    getProjects: function(callback){
        var result = [];

        var cursor = db.collection('projects').find();
        cursor.each(function(err, doc) {
            if(!err) {
                if (doc != null) {
                    result.push(doc);
                } else {
                    callback(result);
                }
            }
        });
    },
    addProject: function(name, callback) {
        db.collection('projects').insertOne({
            name: name
        }, function(err, result){
            if(!err) {
                callback(result);
            }
        });
    }
};

MongoClient.connect(url, function(err, _db) {
    if(!err) {
        ret['db'] = _db;
        db = _db;

        console.log("Connected correctly to mongodb server.");
    } else {
        console.log(err);
    }
});

module.exports = ret;