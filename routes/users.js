var express = require('express');
let userController = require('../controllers/user.controller');


var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/create', userController.createUser);

router.post('/login',userController.login)

module.exports = router;
