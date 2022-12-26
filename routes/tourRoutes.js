const express = require('express');
const {toursController} = require('../controller/index');

const router = express.Router();

// router.param('id', controller.checkID);
router
  .route('/top-5-cheap')
  .get(toursController.alaistopTours, toursController.getAllTours);

router
  .route('/')
  .get(toursController.getAllTours)
  .post(toursController.createTour);

router.route('/tour-stats').get(toursController.getTourStats);
router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router
  .route('/:id')
  .get(toursController.getSingleTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
