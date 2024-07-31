const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
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
  status: {
    type: String,
    require: true,
    enum: ['Order placed', 'Confirmed', 'Shipped', 'Delivered', 'Canceled'],
    default: 'Confirmed',
  },
  itemUnit: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  deliveryFee: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
    default: 'Door delivery',
  },
  deliveryAddress: {
    type: mongoose.Schema.ObjectId,
    ref: 'Address',
  },
  dateDelivered: String,
  deliveredBy: String,
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: 'name category',
  });
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
