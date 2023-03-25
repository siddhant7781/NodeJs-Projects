const Review = require('./../models/reviewModel');

const catchAsync = require('./../utils/catchAsync');


exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'sucess',
        results: reviews.length,
        data: {
            reviews
        }
    })
    next();

});

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'sucess',
        data: {
            newReview
        }
    })
    next();

})