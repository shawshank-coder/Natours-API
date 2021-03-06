const mongoose = require('mongoose')

const User = require('./userModel');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema({
    review: {
        type:String,
        required: true,
    },
    ratings: {
        type: Number,
        required: true,
        default: 5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: ['true', 'Review must have a user']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: ['true', 'Review must have a tour']
    }
      
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)

reviewSchema.index({tour: 1, user: 1}, {unique: true});

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match: {tour: tourId},
        },
        {
            $group: {
                _id: '$tour',
                nRating: {$sum: 1},
                avgRating: {$avg: '$ratings'}
            }
        }
    ])
    console.log(stats);

    if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    }else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
    
}

reviewSchema.post('save', function(){
    //this points to current review
    //this.constructor initializes model of Review before Model initialized below
    this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function(next){
    await this.r.constructor.calcAverageRatings(this.r.tour);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;