const express = require('express');
const multer = require('multer');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);


// protect all routes after this middleware. 
router.use(authController.protect)

router.patch('/updatemypassword', authController.updatePassword);

router.get('/me',
    userController.getMe,
    userController.getUser)

router.patch('/updateme', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);

router.delete('/deleteme', userController.deleteMe);

router.use(authController.restrictTo('admin'));
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router;