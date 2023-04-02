const express = require('express');
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router()

// router.param('id', tourController.checkId)



router.use('/:tourId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'giudes'), tourController.getMonthlyPlan)

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin)

router.route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances);
router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)


router
    .route('/:tourId/reviews')
    .post(authController.protect, authController.restrictTo('users'), reviewController.createReview)
module.exports = router;

// authController.restrictTo('admin')