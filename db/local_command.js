var m = require('../components/mongo');
var p = require('./project');

module.exports = {
    addLocal: function(data, projectId, success, error){
        p.getProject(projectId, function(project){
            var id = p.getRandomId();
            data['id'] = id;
            if(!project.hasOwnProperty('local_commands')) {
                project['local_commands'] = [];
            }
            project.local_commands.push(data);
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {local_commands: project.local_commands}}, function(){
                success(data);
            });
        }, error);
    },
    deleteLocal: function(projectId, localId, success, error) {
        p.getProject(projectId, function(project){
            for(var i in project.local_commands) {
                if(project.local_commands[i].id == localId) {
                    project.local_commands.splice(i, 1);
                    break;
                }
            }
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {local_commands: project.local_commands}}, function(){
                success();
            });
        }, error);
    }
};