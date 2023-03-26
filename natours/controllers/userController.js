const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const mongoose = require('mongoose');
const factory = require('./handlerFactory')


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    //1)create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update, please use /updatemypassword route', 400))
    }

    // 2) filtered unwanted field names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) update user docuument
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined! plaease use signup route'
    })
}
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// do not update password with this
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)