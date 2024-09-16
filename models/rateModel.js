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

rateSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'baseCurrency',
    select: 'code name symbol',
  }).populate({
    path: 'targetCurrency',
    select: 'code name symbol',
  });
  next();
  rateSchema.pre(/^find/, function (next) {
    this.populate({
      path: 'baseCurrency',
      select: 'code name symbol',
    }).populate({
      path: 'targetCurrency',
      select: 'code name symbol',
    });

    next();
  });
});

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
