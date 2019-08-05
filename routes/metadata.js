var express = require('express');
const metadataController = require('../controllers/metadata.controller');


var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/create', metadataController.createMetadataDoc);

router.put('/update/:id', metadataController.updateAddFieldValue);

//router.put('/update:id', metadataController.update);
//router.delete('/delete:id', metadataController.delete);
//router.get('/:id', metadataController.getById);

module.exports = router;
