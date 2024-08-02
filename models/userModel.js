const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'A user must have a first name'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'A user must have a last name'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: 'Invalid email address',
    },
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: [true, 'A user must have a role'],
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return value.length >= 8;
      },
      message: 'Passwords must be up to 8 characters',
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Password does not match',
    },
  },
  confirmationTokenExpires: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  confirmationToken: String,
  createdAt: Date,
  phoneNumber: {
    type: String,
    required: [true, 'A user must have a phone a phone number'],
  },
  refreshToken: {
    type: String,
    select: false,
  },
});

//creating a timestamp for each time password is changed
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// hashing and salting password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// comparing provided password with the one saved in database before logging user in
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// comparing the timestamp date with the date of token generation when the timestamp is greater than when the token was generated
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// generating password reset token and setting time for expiration
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// adding timestamp to any created document
userSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  next();
});

// setting a query middleware for it to find only users that their active status is not equal to false
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
