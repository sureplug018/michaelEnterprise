const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

// preventing duplicate reviews on a particular tour from on same user
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// this is a aggregation pipeline that calculates the ratings average and the rating quantity
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // setting the values of the ratingsQuantity and the ratingsAverage
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// this is the code that runs executes the aggregation pipeline, and this runs after saving a review
reviewSchema.post('save', function () {
  // this points to the current review document
  this.constructor.calcAverageRatings(this.product);
});

// updating ratingsAverage and ratingsQuantity when they are deleted or updated
// this code will find the review before deleting or updating it
reviewSchema.pre(/^findOneAnd/, async function (next) {
//   console.log(this.r);
  //   // we are using findOneAnd regular expression because update and delete are being done by findOneAndUpdate and findOneAndDelete
  this.r = await this.findOne(); // we are using this.r for we to be able to make use of the await in another middleware
  next();
});

// this code awaits the first one to find and then runs the calculation of ratingsAverage and ratingsQuantity
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
