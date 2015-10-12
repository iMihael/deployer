var m = require('../components/mongo');
var p = require('./project');

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
    addRemote: function(data, projectId, success, error){
        p.getProject(projectId, function(project){
            var id = getRandomId();
            data['id'] = id;
            if(!project.hasOwnProperty('remotes')) {
                project['remotes'] = [];
            }
            project.remotes.push(data);
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {remotes: project.remotes}}, function(){
                success(data);
            });
        }, error);
    },
    deleteRemote: function(projectId, remoteId, success, error) {
        p.getProject(projectId, function(project){
            for(var i in project.remotes) {
                if(project.remotes[i].id == remoteId) {
                    project.remotes.splice(i, 1);
                    break;
                }
            }
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {remotes: project.remotes}}, function(){
                success();
            });
        }, error);
    }
};