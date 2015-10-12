var express = require('express');
var router = express.Router();

var p = require('../db/project');
var r = require('../db/remote.js');



router.get('/projects', function(req, res) {
    p.getProjects(function(data){
        res.json(data);
    });
});

router.post('/projects', function(req, res){
    var project = req.body;
    p.addProject(project, function(data){
        res.json(data);
    });
});

router.get('/project/:id', function(req, res){
    p.getProject(req.params.id, function(doc){
        res.json(doc);
    }, function(err){
        res.status(422);
        res.json(err);
    });
});

router.post('/project/:id/restore', function(req, res){
    p.restoreProject(req.params.id, function(){
        res.status(204);
        res.end();
    });
});

router.delete('/project/:id', function(req, res){
    p.deleteProject(req.params.id, function(){
        res.status(204);
        res.end();
    });
});

router.post('/project/:id/remote/create', function(req, res){
    var remote = req.body;
    r.addRemote(remote, req.params.id, function(data){
       res.json(data);
    }, function(){
        res.status(422);
        res.end();
    });
});

router.delete('/project/:id/remote/delete/:remoteId', function(req, res){

    r.deleteRemote(req.params.id, req.params.remoteId, function(){
        res.status(204);
        res.end();
    }, function(){
        res.status(422);
        res.end();
    });

});

module.exports = router;