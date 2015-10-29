var m = require('../components/mongo');
var p = require('./project');

module.exports = {
    addUpload: function(data, projectId, success, error){
        p.getProject(projectId, function(project){
            var id = p.getRandomId();
            data['id'] = id;
            if(!project.hasOwnProperty('uploads')) {
                project['uploads'] = [];
            }
            project.uploads.push(data);
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {uploads: project.uploads}}, function(){
                success(data);
            });
        }, error);
    },
    deleteUpload: function(projectId, symlinkId, success, error) {
        p.getProject(projectId, function(project){
            for(var i in project.uploads) {
                if(project.uploads[i].id == symlinkId) {
                    project.uploads.splice(i, 1);
                    break;
                }
            }
            m.db().collection('projects').updateOne({_id: project._id}, {$set: {uploads: project.uploads}}, function(){
                success();
            });
        }, error);
    }
};