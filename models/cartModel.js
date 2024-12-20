const mongoose = require('mongoose');

const proteinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  total: Number,
});

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
  proteins: [proteinSchema], // Array of protein sub-documents
  quantity: {
    type: Number,
    default: 1,
  },
  total: Number,
});

// Combine populate middleware into one function
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  }).populate({
    path: 'productId',
    select:
      'name category price imageCover slug id categorySlug superCategorySlug',
  });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
