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
    name: {
      type: String,
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
      // required: true,
    },
    orderNote: {
      type: String,
    },
    deliveryMethod: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    country: {
      type: String,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    postOfficeAddress: {
      type: String,
    },
    passportNumber: {
      type: String,
    },
    dateDelivered: {
      type: String,
    },
    paymentProof: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      unique: true,
    },
    entrance: String,
    entranceCode: String,
    floor: String,
    roomNumber: String,
  },
  {
    timestamps: true,
  },
);

// Add index on the reference field
orderSchema.index({ reference: 1 }, { unique: true });

// Populate user details when querying
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

// Populate product details when querying
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'productId',
    select:
      'name category imageCover slug price categorySlug superCategorySlug',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
