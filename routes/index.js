var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.send({ hello: 'my name is mano and abrakadabra is here and my husband and my sister' });
  //res.render('index', { title: 'Express' });

});

module.exports = router;
