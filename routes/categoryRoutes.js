const express = require('express');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin', 'super-admin'));

router.post('/create-category', categoryController.addCategory);

router.get('/find-categories', categoryController.fetchCategories);

module.exports = router;
