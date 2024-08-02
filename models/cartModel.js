const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// Combine populate middleware into one function
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  }).populate({
    path: 'productId',
    select: 'name category',
  });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
