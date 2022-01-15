const Review = require('./../models/reviewModel')
// const APIfeatures = require('./../utils/apiFeatures')
// const catchAsync = require('./../utils/catchAsync')
// const AppError = require('./../utils/appError')
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.setTourUserIds = (req, res, next)=>{
    if(!req.body.user)req.body.user = req.user.id;
    if(!req.body.tour)req.body.tour = req.params.tourId;
    next();
}

exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);


// exports.createReview = catchAsync(async (req, res, next) => {
//     //Allow nested routes
    

//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     })
// })