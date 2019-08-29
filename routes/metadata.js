var express = require('express');
const metadataController = require('../controllers/metadata.controller');
const asyncMiddleware = require('../utils/asyncMiddleware');


var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/create', metadataController.createMetadataDoc);

router.put('/update/:id', metadataController.updateAddFieldValue);

router.put('/updateDoc/:id', asyncMiddleware(metadataController.updateWholeDoc));

router.get('/', metadataController.getMetadataList)

//router.put('/update:id', metadataController.update);
//router.delete('/delete:id', metadataController.delete);
router.get('/:id', metadataController.getById);

module.exports = router;
