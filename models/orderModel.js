const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
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
      required: true,
      enum: ['Order placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Order placed',
    },
    quantity: {
      type: Number,
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
    orderNote: {
      type: String,
    },
    deliveryMethod: {
      type: String,
      required: true,
      default: 'Door delivery',
    },
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    dateDelivered: String,
  },
  {
    timestamps: true,
  },
);

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
    select: 'name category imageCover slug',
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

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
