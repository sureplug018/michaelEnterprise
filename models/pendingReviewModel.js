const mongoose = require('mongoose');

const pendingReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  deliveredOn: {
    type: String,
    required: true,
  },
});

pendingReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'productId',
    select: 'name',
  });
  next();
});

const PendingReview = mongoose.model('PendingReview', pendingReviewSchema);

module.exports = PendingReview;
