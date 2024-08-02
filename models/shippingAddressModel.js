const mongoose = require('mongoose');

const shippingAddress = new mongoose.Schema.ObjectId({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
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
    enum: ['Nigeria', 'Russia'],
  },
  region: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

shippingAddress.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddress);

module.exports = ShippingAddress;
