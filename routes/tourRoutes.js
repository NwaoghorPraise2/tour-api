const express = require('express');
const controller = require('../controller/toursController');
const router = express.Router();

// router.param('id', controller.checkID);

router.route('/')
    .get()
    .post();

router.route('/:id')
    .get()
    .patch()
    .delete();
    
module.exports = router;