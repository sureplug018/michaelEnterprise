const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  itemUnit: {
    type: String,
    required: true,
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

cartSchema.pre(/^find/, function next() {
  this.populate({
    path: 'product',
    select: 'name category',
  });
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
