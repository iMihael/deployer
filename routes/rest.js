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
    mongo.getProject(req.id, function(doc){
        res.json(doc);
    }, function(err){
        res.status(422);
        res.json(err);
    });
});

router.delete('/project/:id', function(req, res){

});

module.exports = router;