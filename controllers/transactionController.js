const crypto = require('crypto');
const mongoose = require('mongoose');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const TransactionEmail = require('../utilities/transactionEmail');

// generating unique random string for reference
// Function to generate a random alphanumeric string
const generateRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Return the required number of characters
};

const generateUniqueReference = async () => {
  let isUnique = false;
  let reference;

  // Keep generating until a unique reference is found
  while (!isUnique) {
    const randomString = generateRandomString(10); // 10 characters
    reference = `${randomString}${Date.now()}`;

    // Check if reference is unique
    const existingOrder = await Transaction.findOne({ reference });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return reference;
};

exports.createTransaction = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  const user = req.user.id;
  const {
    senderName,
    senderPhoneNumber,
    accountName,
    bankName,
    accountNumber,
    amountSent,
    amountToReceive,
    baseCurrency,
    targetCurrency,
    rate,
  } = req.body;
  const paymentProof = req.file ? req.file.path : null; // Get payment proof image URL

  if (!paymentProof) {
    // await session.abortTransaction();
    // session.endSession();
    return res.status(400).json({
      status: 'fail',
      data: {
        message: 'Payment proof is required',
      },
    });
  }

  if (!user) {
    return res.status(404).json({
      status: 'status',
      message: 'User not found',
    });
  }

  // Validate all inputs
  if (!accountName) {
    return res.status(400).json({
      status: 'fail',
      message: 'Account name is required',
    });
  }

  if (!bankName) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bank name is required',
    });
  }

  if (!accountNumber) {
    return res.status(400).json({
      status: 'fail',
      message: 'Account number is required',
    });
  }

  if (!amountSent || isNaN(amountSent) || amountSent <= 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'A valid amount is required',
    });
  }

  if (!amountToReceive || isNaN(amountToReceive) || amountToReceive <= 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'A valid amount to receive is required',
    });
  }

  if (!baseCurrency) {
    return res.status(400).json({
      status: 'fail',
      message: 'Base currency pair is required',
    });
  }

  if (!targetCurrency) {
    return res.status(400).json({
      status: 'fail',
      message: 'Target currency pair is required',
    });
  }

  if (!rate) {
    return res.status(400).json({
      status: 'fail',
      message: 'Rate is required',
    });
  }

  const reference = await generateUniqueReference(); // Generate and ensure unique reference

  try {
    const transaction = await Transaction.create({
      user,
      senderName,
      senderPhoneNumber,
      accountName,
      bankName,
      accountNumber,
      reference,
      amountSent,
      amountToReceive,
      baseCurrency,
      targetCurrency,
      paymentProof,
      rate,
    });

    // return array of admins
    const adminUsers = await User.find({ role: 'admin' }) //.session(session);

    const url = `${req.protocol}://${req.get('host')}/admin/transactions`;

    // send emails to admin(s) is they are many or send to admin if only single
    for (const adminUser of adminUsers) {
      await new TransactionEmail(
        adminUser,
        url,
        transaction,
      ).sendTransactionNotification();
    }

    // await session.commitTransaction();
    // session.endSession();

    return res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    console.log(err);
    if (err.hasErrorLabel('TransientTransactionError')) {
      // Retry logic here
      return exports.createOrder(req, res);
    }
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.confirmTransaction = async (req, res) => {
  const { transactionId } = req.params;
  if (!transactionId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Transaction Id not found',
    });
  }

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found',
      });
    }

    transaction.status = 'Success';
    const update = await transaction.save();

    return res.status(200).json({
      status: 'success',
      data: {
        update,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.declineTransaction = async (req, res) => {
  const { transactionId } = req.params;
  if (!transactionId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Transaction Id not found',
    });
  }

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found',
      });
    }

    transaction.status = 'Declined';
    const update = await transaction.save();

    return res.status(200).json({
      status: 'success',
      data: {
        update,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
