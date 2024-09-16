const express = require('express');
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authController.protect);

router.post(
  '/create-transaction',
  orderController.uploadPaymentProof,
  transactionController.createTransaction,
);

router.use(authController.restrictTo('admin'));

router.patch(
  '/confirm-transaction/:transactionId',
  orderController.uploadPaymentProof,
  transactionController.confirmTransaction,
);

router.patch('/decline-transaction/:transactionId', transactionController.declineTransaction);

module.exports = router;
