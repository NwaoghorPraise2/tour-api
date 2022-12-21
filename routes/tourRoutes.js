const express = require('express');
const controller = require('../controller/toursController');

const router = express.Router();

// router.param('id', controller.checkID);
router
  .route('/top-5-cheap')
  .get(controller.alaistopTours, controller.getAllTours);

router.route('/').get(controller.getAllTours).post(controller.createTour);

router
  .route('/:id')
  .get(controller.getSingleTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
