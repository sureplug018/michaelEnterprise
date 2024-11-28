const express = require('express');
const authController = require('../controllers/authController');
const shippingAddressController = require('../controllers/shippingAddressController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));

router.post(
  '/create-shipping-address',
  shippingAddressController.createShippingAddress,
);

router.patch(
  '/edit-shipping-address',
  shippingAddressController.editShippingAddress,
);

module.exports = router;
