const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/find', productController.find);

// apply authentication and authorization to all routes
router.use(authController.protect, authController.restrictTo('admin'));

// add product
router.post(
  '/add-product',
  productController.uploadProductFiles,
  productController.addProduct,
);

// delete product
router.delete('/delete-product/:productId', productController.deleteProduct);

// update product
router.patch(
  '/edit-product/:productId',
  productController.uploadProductFiles,
  productController.editProduct,
);

router.patch(
  '/increase-product-stock/:productId',
  productController.increaseProductStock,
);

module.exports = router;
