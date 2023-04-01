const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

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