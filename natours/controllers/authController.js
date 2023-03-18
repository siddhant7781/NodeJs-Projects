const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(
        //     //{
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password,
        //     passwordConfirm: req.password.confirm
        // }//
        req.body);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    }); 2

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


