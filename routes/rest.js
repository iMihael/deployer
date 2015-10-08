var express = require('express');
var router = express.Router();
var mongo = require('../components/mongo');

router.get('/projects', function(req, res) {
    mongo.getProjects(function(data){
        res.json(data);
    });
});

router.post('/projects', function(req, res){
    var project = req.body;
    mongo.addProject(project, function(data){
        res.json(data);
    });
});

router.get('/project/:id', function(req, res){
    mongo.getProject(req.params.id, function(doc){
        res.json(doc);
    }, function(err){
        res.status(422);
        res.json(err);
    });
});

router.post('/project/:id/restore', function(req, res){
    mongo.restoreProject(req.params.id, function(){
        res.status(204);
        res.end();
    });
});

router.delete('/project/:id', function(req, res){
    mongo.deleteProject(req.params.id, function(){
        res.status(204);
        res.end();
    });
});

module.exports = router;