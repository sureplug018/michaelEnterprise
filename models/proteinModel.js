const mongoose = require('mongoose');

const proteinSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentProof: {
    type: String,
    required: true,
  },
});

proteinSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'productId',
    select: 'name price description imageCover categorySlug slug',
  });
  next();
});

const Protein = mongoose.model('Protein', proteinSchema);

module.exports = Protein;
