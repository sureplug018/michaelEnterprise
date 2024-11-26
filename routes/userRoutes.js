const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/admin-login', authController.loginAdmin);
router.post('/signup', authController.signup);
router.post('/confirm-email/:token', authController.confirmEmailBE);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
router.get('/logout', authController.protect, authController.logout);

router.patch(
  '/update',
  authController.protect,
  //   userController.uploadUserPhoto,
  //   userController.resizeUserPhoto,
  authController.updateUserData,
);

router.delete(
  '/deleteUser/:id',
  authController.protect,
  authController.restrictTo('admin'),
  authController.deleteUser,
);

router.patch(
  '/change-role',
  authController.protect,
  authController.restrictTo('super-admin'),
  userController.changeUserRole,
);

module.exports = router;
