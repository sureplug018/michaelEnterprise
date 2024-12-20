const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/find', productController.find);

router.get('/find-tem', productController.findItem);

// apply authentication and authorization to all routes
router.use(
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
);

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
