const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a tour must have name'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour must have less than or equal to 40 characters'],
        minLength: [10, 'A tour must have more than or equal to 10 characters']
    },


    slug: String,

    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'a tour have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have adifficulty'],
        enum: {
            values: ['easy', 'meduim', 'difficult'],
            message: 'Difficulty is either easy, medium or difficult'
        }
    },
    rating: {
        type: Number,
        default: 4.5
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, ' rating must be above 1.0'],
        max: [5, ' rating must be below or equal 5 .0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'a tour must have price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                //this only points to current doc on NEW DOCUMENT CREATION 
                return val < this.price;
            },
            message: 'Discount price  should be below regular price'
        }
    },

    summary: {
        type: String,
        trim: true,
        required: [true, 'a tour must have summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'a tour must have cover image']
    },
    images: [String],

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

//Document middleware :runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function (next) {
//     console.log('will save document');
//     next();
// })

// tourSchema.post('save', function (doc, next) {
//     next();
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })

    next();
})

tourSchema.post(/^find/, function (docs, next) {

    next();
})

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;



// const testTour = new Tour({
//     name: 'The Forest Hiker',
//     rating: 4.7,
//     price: 499
// })
// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('ERROR: ', err);
// })