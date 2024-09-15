const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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
});

beneficiarySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

module.exports = Beneficiary;
