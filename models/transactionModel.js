const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'pending', 'declined'],
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
