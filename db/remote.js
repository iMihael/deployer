var m = require('../components/mongo');
var p = require('./project');

module.exports = {
    addRemote: function(data, projectId, success, error){
        p.getProject(projectId, function(project){
            var id = p.getRandomId();
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