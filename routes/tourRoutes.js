const express = require('express');
const controller = require('../controller/toursController');
const router = express.Router();

// router.param('id', controller.checkID);

router.route('/')
    .get(controller.getAllTours)
    .post(controller.checkBody, controller.createTour);

router.route('/:id')
    .get(controller.getSingleTour)
    .patch(controller.updateTour)
    .delete(controller.deleteTour);
    
module.exports = router;