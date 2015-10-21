var express = require('express');
var router = express.Router();

//project
var projectController = require('../controllers/project');

router.get('/projects', projectController.getAll);
router.post('/projects', projectController.add);
router.get('/project/:id', projectController.getOne);
router.post('/project/:id/restore', projectController.restore);
router.delete('/project/:id', projectController.delete);

//remote
var remoteController = require('../controllers/remote');

router.post('/project/:id/remote/create', remoteController.create);
router.delete('/project/:id/remote/delete/:remoteId', remoteController.delete);

//local command
var localCommandController = require('../controllers/local_command');

router.post('/project/:id/local_command/create', localCommandController.create);
router.delete('/project/:id/local_command/delete/:remoteId', localCommandController.delete);

module.exports = router;