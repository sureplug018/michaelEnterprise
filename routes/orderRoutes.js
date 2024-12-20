const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authController.protect);

// router.post('/initiate-cart-checkout', orderController.initiateCheckoutPayment);

router.post(
  '/create-order',
  authController.restrictTo('user'),
  orderController.uploadPaymentProof,
  orderController.createOrder,
);

router.patch(
  '/confirm-order/:orderId',
  authController.restrictTo('admin', 'super-admin'),
  orderController.confirmOrder,
);

router.patch(
  '/ship-order/:orderId',
  authController.restrictTo('admin', 'super-admin'),
  orderController.shipOrder,
);

router.patch(
  '/deliver-order/:orderId',
  authController.restrictTo('admin', 'super-admin'),
  orderController.deliverOrder,
);

router.patch(
  '/cancel-order/:orderId',
  authController.restrictTo('admin', 'super-admin'),
  orderController.cancelOrder,
);

module.exports = router;
