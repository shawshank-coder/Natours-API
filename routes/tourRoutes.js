const express = require('express');

const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(authController.protect, authController.restrictTo('admin','lead-guide','guide'), tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.route('/tour-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);

router.route('/')
    .get( tourController.getAllTours)
    .post(tourController.checkBody, authController.protect, authController.restrictTo('admin', 'lead-guide'),
     tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin'), tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin'), tourController.deleteTour);

// router
//     .route('/:tourId/reviews')
//     .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

module.exports = router;

