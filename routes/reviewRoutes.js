const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect, authController.restrictTo('user', 'super-admin'));

// Route to create a review for a product
router.post('/create-review/:productId', reviewController.createReview);

module.exports = router;
