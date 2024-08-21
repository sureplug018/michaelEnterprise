const express = require('express');
const authController = require('../controllers/authController');
const supportController = require('../controllers/supportController');

const router = express.Router();

router.use(authController.protect);

router.post(
  '/send-support',
  authController.restrictTo('user'),
  supportController.createSupport,
);

router.post(
  '/reply-support/:email',
  authController.restrictTo('admin'),
  supportController.replySupport,
);

router.post(
  '/send-mail/:email',
  authController.restrictTo('admin'),
  supportController.sendMail,
);

module.exports = router;
