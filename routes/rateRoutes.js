const express = require('express');
const authController = require('../controllers/authController');
const rateController = require('../controllers/rateController');

const router = express.Router();

router.get('/get-rate', rateController.getExchangeRate);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/create-rate', rateController.addRate);

router.post('/edit-rate', rateController.editExchangeRate);

module.exports = router;
