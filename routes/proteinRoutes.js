const express = require('express');
const authController = require('../controllers/authController');
const proteinController = require('../controllers/proteinController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/find-proteins', proteinController.findProteins);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
);

router.post(
  '/add-protein/:productId',
  orderController.uploadPaymentProof,
  proteinController.addProteins,
);

router.patch(
  '/edit-protein/:proteinId',
  orderController.uploadPaymentProof,
  proteinController.editProtein,
);

router.delete('/delete-protein/:proteinId', proteinController.deleteProtein);

module.exports = router;
