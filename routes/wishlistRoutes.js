const express = require('express');
const authController = require('../controllers/authController');
const wishlistController = require('../controllers/wishlistController');

const router = express.Router();

router.use(authController.protect);

router.post('/add-to-wishlist/:productId', wishlistController.addToWishlist);

router.delete(
  '/delete-from-wishlist/:productId',
  wishlistController.removeFromWishlist,
);

router.post(
  '/add-to-cart-from-wishlist/:productId',
  wishlistController.addToCartFromWishlist,
);

module.exports = router;
