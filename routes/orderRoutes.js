const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authController.protect);

router.post('/initiate-cart-checkout', orderController.initiateCheckoutPayment);

module.exports = router;
