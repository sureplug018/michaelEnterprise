const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');
const PendingReview = require('../models/pendingReviewModel');

exports.createReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const user = req.user.id;
    const { productId } = req.params;

    const order = await Order.findOne({ user, productId, status: 'Delivered' });

    if (!order) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only review a product you have ordered',
      });
    }

    const deletePendingReview = await PendingReview.findOneAndDelete({
      user,
      productId,
    });

    if (!deletePendingReview) {
      return res.status(404).json({
        status: 'fail',
        message: 'Pending review not found',
      });
    }

    const newReview = await Review.create({
      review,
      rating,
      productId,
      user,
    });

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
