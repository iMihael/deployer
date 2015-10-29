var m = require('../components/mongo');
var p = require('./project');

module.exports = {
    addRemote: function(data, projectId, success, error){
        p.getProject(projectId, function(project){
            var id = p.getRandomId();
            data['id'] = id;
            if(!project.hasOwnProperty('remote_commands')) {
                project['remote_commands'] = [];
            }
            project.remote_commands.push(data);
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {remote_commands: project.remote_commands}}, function(){
                success(data);
            });
        }, error);
    },
    deleteRemote: function(projectId, commandId, success, error) {
        p.getProject(projectId, function(project){
            for(var i in project.remote_commands) {
                if(project.remote_commands[i].id == commandId) {
                    project.remote_commands.splice(i, 1);
                    break;
                }
            }
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {remote_commands: project.remote_commands}}, function(){
                success();
            });
        }, error);
    }
};