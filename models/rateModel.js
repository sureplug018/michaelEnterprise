const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
  {
    baseCurrency: {
      type: mongoose.Schema.ObjectId,
      ref: 'Currency',
      required: true,
    },
    targetCurrency: {
      type: mongoose.Schema.ObjectId,
      ref: 'Currency',
      required: true,
    },
    rate: { type: Number, required: true }, // Exchange rate from baseCurrency to targetCurrency
  },
  {
    timestamps: true,
  },
);

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
