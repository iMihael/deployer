var config = require('../config.json');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
var db;

var ret = {
    getProjects: function(callback){
        var result = [];

        var cursor = db.collection('projects').find({deletedAt: {$exists: false}});
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
    addProject: function(project, callback) {
        db.collection('projects').insertOne(project, function(err, result){
            if(!err && result.ops && result.ops.length == 1) {
                if(callback) {
                    callback(result.ops[0]);
                }
            }
        });
    },
    getProject: function(id, callback, error) {
        var id = new mongo.ObjectID(id);

        db.collection('projects').findOne({'_id': id}, function(err, doc){
            if(!err) {
                if (doc != null) {
                    callback(doc);
                    return;
                }
            }

            error(err);
        });
    },
    deleteProject: function(id, callback) {
        var id = new mongo.ObjectID(id);
        db.collection('projects').updateOne({_id: id}, {$set: {deletedAt: new Date()}}, callback);
    },
    restoreProject: function(id, callback) {
        var id = new mongo.ObjectID(id);
        db.collection('projects').updateOne({_id: id}, {$unset: {deletedAt: new Date()}}, callback);
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