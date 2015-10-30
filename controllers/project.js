var p = require('../db/project');


module.exports = {
    getAll: function(req, res) {
        p.getProjects(function (data) {
            res.json(data);
        });
    },
    update: function(req, res) {
        p.updateProject(req.params.id, req.body, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        })
    },
    add: function(req, res) {
        var project = req.body;
        p.addProject(project, function(data){
            res.json(data);
        });
    },
    getOne: function(req, res) {
        p.getProject(req.params.id, function(doc){
            res.json(doc);
        }, function(err){
            res.status(422);
            res.json(err);
        });
    },
    restore: function(req, res) {
        p.restoreProject(req.params.id, function(){
            res.status(204);
            res.end();
        });
    },
    delete: function(req, res) {
        p.deleteProject(req.params.id, function(){
            res.status(204);
            res.end();
        });
    }
};