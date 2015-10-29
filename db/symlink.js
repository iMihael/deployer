var m = require('../components/mongo');
var p = require('./project');

module.exports = {
    addSymlink: function(data, projectId, success, error){
        p.getProject(projectId, function(project){
            var id = p.getRandomId();
            data['id'] = id;
            if(!project.hasOwnProperty('symlinks')) {
                project['symlinks'] = [];
            }
            project.symlinks.push(data);
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {symlinks: project.symlinks}}, function(){
                success(data);
            });
        }, error);
    },
    deleteSymlink: function(projectId, symlinkId, success, error) {
        p.getProject(projectId, function(project){
            for(var i in project.symlinks) {
                if(project.symlinks[i].id == symlinkId) {
                    project.symlinks.splice(i, 1);
                    break;
                }
            }
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {symlinks: project.symlinks}}, function(){
                success();
            });
        }, error);
    }
};