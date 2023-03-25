const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController');
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.patch('/updatemypassword',
    authController.protect,
    authController.updatePassword);


router.patch('/updateme',
    authController.protect,
    userController.deleteMe);


router.delete('/deleteme',
    authController.protect,
    userController.updateMe);
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)



module.exports = router;