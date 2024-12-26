const mongoose = require('mongoose');

const proteinSchema = new mongoose.Schema({
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
  availability: {
    type: Boolean,
    default: true,
  },
});

const Protein = mongoose.model('Protein', proteinSchema);

module.exports = Protein;
