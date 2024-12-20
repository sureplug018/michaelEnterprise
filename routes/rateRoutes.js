const express = require('express');
const authController = require('../controllers/authController');
const rateController = require('../controllers/rateController');

const router = express.Router();

router.get('/get-rate', rateController.getExchangeRate);

router.use(authController.protect, authController.restrictTo('admin', 'super-admin'));

router.post('/create-rate', rateController.addRate);

router.patch('/edit-rate/:rateId', rateController.editExchangeRate);

module.exports = router;
