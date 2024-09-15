const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Success', 'Pending', 'Declined'],
      default: 'Pending',
    },
    senderName: {
      type: String,
      required: true,
    },
    senderPhoneNumber: {
      type: String,
      required: true,
    },
    rate: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    amountSent: {
      type: String,
      required: true,
    },
    amountToReceive: {
      type: String,
      required: true,
    },
    baseCurrency: {
      type: String,
      required: true,
    },
    targetCurrency: {
      type: String,
      required: true,
    },
    paymentProof: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
