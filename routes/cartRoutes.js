const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));

router.post('/add-to-cart/:productId', cartController.addToCart);

router.delete(
  '/delete-from-cart/:productId',
  cartController.removeItemFromCart,
);

router.patch('/increase-quantity/:productId', cartController.increaseQuantity);

router.patch('/decrease-quantity/:productId', cartController.decreaseQuantity);

router.post(
  '/add-to-cart-with-protein/:productId',
  cartController.addToCartWithProtein,
);

module.exports = router;
