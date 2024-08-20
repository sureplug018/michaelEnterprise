const express = require('express');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/sign-in', viewsController.signIn);

router.get('/admin/sign-in', viewsController.adminLogin);

router.get('/register', viewsController.register);

router.get(
  '/email-confirmed/:token',
  authController.confirmEmailFE,
  viewsController.emailConfirmed,
);

router.get('/reset-password/:token', viewsController.resetPassword);

router.get('/confirm-email', viewsController.confirmEmail);

router.get('/forgot-password', viewsController.forgotPassword);

router.use(authController.isLoggedIn);

router.get('/', viewsController.overview);

router.get('/faq', viewsController.faq);

router.get('/privacy-policy', viewsController.privacyPolicy);

router.get('/terms-conditions', viewsController.termsConditions);

router.get('/afro-shop', viewsController.afroShop);

router.get('/contact-us', viewsController.contact);

router.get('/account', viewsController.account);

router.get('/cart', viewsController.cart);

router.get('/error', viewsController.error);

router.get('/checkout', viewsController.checkout);

router.get('/afro-shop/:slug', viewsController.productDetail);

router.get('/store-locations', viewsController.store);

router.get('/wishlist', viewsController.wishlist);

////////////////////////////////////////////////////////////
//////////////////      ADMIN          //////////////////////

router.get('/admin/dashboard', viewsController.adminDashboard);

router.get('/admin/profile', viewsController.adminProfile);

router.get('/admin/users', viewsController.users);

router.get('/admin/orders', viewsController.orders);

router.get('/admin/afro-shop', viewsController.afroShopItems);

router.get('/admin/add-products', viewsController.addProducts);

router.get('/admin/add-category', viewsController.addCategory);

router.get('/admin/categories', viewsController.categories);

module.exports = router;
