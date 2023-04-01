const express = require('express');
const viewsController = require('./../controllers/viewController');
const authController = require('../controllers/authController')

const router = express.Router();


router.get('/overview', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/me', authController.protect, viewsController.getAccount);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData)

module.exports = router;