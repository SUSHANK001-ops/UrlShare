const router = require('express').Router();
const downloadController = require('../controller/downloadController.js');

router.get('/:shortCode', downloadController);   // matches /d/anything
module.exports = router;