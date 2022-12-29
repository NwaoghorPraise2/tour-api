const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'meduim', 'difficult'],
        message: 'Difficulty could only be: easy or meduim pr difficult'
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document Middlewares. best practice Fat Models, Thin Controllers
//pre middleware will do somrthin before saving to db
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Post middleware will push someting when the pre is done before pushing to db
// tourSchema.post('save', function (doc, next){
//   // console.log(doc);
//   next();
// });

//Query Middleware.
//Find PRE MIDDLE WARE
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true }});

//   this.start = Date.now();
//   next();
// });

//Find POST MIDDLE WARE
// tourSchema.post(/^find/, function (docc, next) {
//   console.log(docc);
//   console.log(`Query time = ${ Date.now() - this.start }`);
//   next();
// });

//Aggregaite Middleware
//Pre
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); 
  next();
});



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
