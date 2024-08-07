const mongoose = require('mongoose');

const pendingReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  deliveredOn: {
    type: String,
    required: true,
  },
});

const PendingReview = mongoose.model('PendingReview', pendingReviewSchema);

module.exports = PendingReview;
