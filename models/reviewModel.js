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
    productId: {
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

// Preventing duplicate reviews on a particular product from the same user
reviewSchema.index({ productId: 1, user: 1 }, { unique: true });

// Aggregation pipeline to calculate average ratings and rating quantity
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: '$productId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // Setting the values of the ratingsQuantity and the ratingsAverage
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Execute the aggregation pipeline after saving a review
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.productId);
});

// Update ratingsAverage and ratingsQuantity when reviews are deleted or updated
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // Storing the current review document
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.productId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
