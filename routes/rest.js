var express = require('express');
var router = express.Router();
var mongo = require('../components/mongo');

router.get('/projects', function(req, res, next) {
    mongo.getProjects(function(data){
        res.json(data);
    });
});

router.post('/projects', function(req, res, next){
    var project = req.body;
    mongo.addProject(project, function(data){
        res.json(data);
    });
});

module.exports = router;