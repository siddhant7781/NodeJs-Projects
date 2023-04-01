const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {

    //1) get tour data from collection
    const tours = await Tour.find();


    //2) build template


    //3) render that templete using tour data from

    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

exports.getTour = async (req, res) => {

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: ' review rating user'
    });

    if (!tour) {
        return next(new AppError('there is no tour with this name.', 404))
    }
    res.status(200).render('tour', {
        title: `${tour.name} tour`,
        tour

    });
}

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'log into your account'
    })
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: ' your account'
    });
}

exports.updateUserData = async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).render('account', {
        title: ' your account',
        user: updatedUser
    });

}