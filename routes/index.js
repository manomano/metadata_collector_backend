var express = require('express');
var router = express.Router();
let generator = require('../generateInitialData');

/* GET home page. */
router.get('/', generator.generateFields);

module.exports = router;
