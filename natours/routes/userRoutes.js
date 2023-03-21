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
    userController.updateMe);

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