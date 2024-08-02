const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.use(authController.protect);

router.post('/add-to-cart/:productId', cartController.addToCart);

router.delete(
  '/delete-from-cart/:productId',
  cartController.removeItemFromCart,
);

router.patch('/increase-quantity/:productId', cartController.increaseQuantity);

router.patch('/decrease-quantity/:productId', cartController.decreaseQuantity);

module.exports = router;
