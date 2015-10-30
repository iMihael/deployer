var mongo = require('mongodb');
var m = require('../components/mongo');
var deploy = require('../components/deploy');

var getRandomArbitrary = function(min, max) {
    return parseInt(Math.random() * (max - min) + min);
};

var getTimeStamp = function() {
    return parseInt(Date.now() / 1000);
};

var getRandomId = function(){
    return getRandomArbitrary(10000, 99999).toString() + getTimeStamp().toString();
};

module.exports = {
    deployProject: function(id, success, error) {

        module.exports.getProject(id, function(project){
            success();
            deploy.deploy(project);
        }, error);
    },
    rollbackProject: function(id, success, error) {
        module.exports.getProject(id, function(project){
            success();
            deploy.rollback(project);
        }, error);
    },
    updateProject: function(id, data, success, error) {
        module.exports.getProject(id, function(project){
            m.db().collection('projects').updateOne({_id: project._id}, {$set: data}, success);
        }, error);
    },
    getProjects: function(callback){
        var result = [];

        var cursor = m.db().collection('projects').find({deletedAt: {$exists: false}});
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
        m.db().collection('projects').insertOne(project, function(err, result){
            if(!err && result.ops && result.ops.length == 1) {
                if(callback) {
                    callback(result.ops[0]);
                }
            }
        });
    },
    getProject: function(id, callback, error) {
        var id = new mongo.ObjectID(id);

        m.db().collection('projects').findOne({'_id': id}, function(err, doc){
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
        m.db().collection('projects').updateOne({_id: id}, {$set: {deletedAt: new Date()}}, callback);
    },
    restoreProject: function(id, callback) {
        var id = new mongo.ObjectID(id);
        m.db().collection('projects').updateOne({_id: id}, {$unset: {deletedAt: new Date()}}, callback);
    },
    getRandomId: getRandomId
};