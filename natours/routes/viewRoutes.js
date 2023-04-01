const express = require('express');
const viewsController = require('./../controllers/viewController');
const router = express.Router();
const authController = require('../controllers/authController')


router.get('/overview', viewsController.getOverview);


router.get('/tour/:slug', authController.protect, viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

module.exports = router;