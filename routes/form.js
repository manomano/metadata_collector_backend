var express = require('express');
const fieldController = require('../controllers/fields.controller');


var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});





router.get('/fields', fieldController.getAllFields)




module.exports = router;
