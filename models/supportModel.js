const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

supportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName',
  });
  next();
});

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;
