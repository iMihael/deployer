var express = require('express');
var router = express.Router();
var mongo = require('../components/mongo');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Deployer' });
});


module.exports = router;
