const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    user: String,
    duration: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    validity: {
      type: String,
      required: true,
      enum: ['Active', 'Used'],
    },
  },
  { timestamps: true },
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
