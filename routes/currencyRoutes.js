const express = require('express');
const authController = require('../controllers/authController');
const currencyController = require('../controllers/currencyController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/add-currency', currencyController.addCurrency);

router.patch('/edit-currency/:currencyId', currencyController.editCurrency);

module.exports = router;
