const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., 'NGN', 'GHS'
  name: { type: String, required: true }, // e.g., 'Naira', 'Cedi'
  symbol: { type: String, required: true }, // e.g., '₽', '₵'
  status: {
    type: String,
    required: true,
    enum: ['Enabled', 'Disabled'],
    default: 'Enabled',
  },
});

const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;
