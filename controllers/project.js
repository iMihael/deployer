var p = require('../db/project');
var ssh = require('../components/ssh');

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
        }, function(error){
            res.status(422);
            res.json(error);
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
        }, function(err){
            res.status(422);
            res.json(err);
        });
    },
    deploy: function(req, res) {
        p.deployProject(req.params.id, req.body, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        });
    },
    rollback: function(req, res) {
        p.rollbackProject(req.params.id, req.body, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        });
    }
};