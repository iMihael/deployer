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
            if(!err) {
                if(callback) {
                    callback(result);
                }
            }
        });
    },
    getProject: function(id, callback, error) {
        //TODO: fix this
        var id = new mongo.ObjectID(id);
        console.log(id);
        var cursor = db.collection('projects').find({'_id': id});
        cursor.each(function(err, doc) {
            if(!err) {
                if (doc != null) {
                    callback(doc);
                    return;
                }
            }

            error(err);
        });
    },
    deleteProject: function(id, classback) {
        db.collection('projects').update({_id: id}, {deletedAt: new Date()});
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