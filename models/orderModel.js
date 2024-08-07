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
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  status: {
    type: String,
    require: true,
    enum: ['Order placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order placed',
  },
  quantity: {
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
  // deliveryFee: {
  //   type: String,
  //   required: true,
  // },
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
    path: 'productId',
    select: 'name category imageCover',
  });
  next();
});

orderSchema.pre('save', function (next) {
  this.populate({
    path: 'productId',
    select: 'price name',
  });
  next();
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'deliveryAddress',
    select: 'fullName address phoneNumber country city region',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
