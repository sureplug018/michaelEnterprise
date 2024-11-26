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

router.get('/search', viewsController.search);

router.get('/reset-password/:token', viewsController.resetPassword);

router.get('/confirm-email', viewsController.confirmEmail);

router.get('/forgot-password', viewsController.forgotPassword);

router.use(authController.isLoggedIn);

router.get('/review/:productId', viewsController.review);

router.get('/', viewsController.home);

router.get('/contact', viewsController.homeContact);

router.get('/about', viewsController.homeAbout);

router.get('/afro-shop/index', viewsController.overviewAfro);

router.get('/michael-kitchen/index', viewsController.overviewKitchen);

router.get('/michael-gadgets/index', viewsController.overviewGadgets);

router.get('/faq', viewsController.faq);

router.get('/privacy-policy', viewsController.privacyPolicy);

router.get('/terms-conditions', viewsController.termsConditions);

router.get('/shop/:superCategorySlug', viewsController.shop);

router.get('/contact-us', viewsController.contact);

router.get('/account', viewsController.account);

router.get('/cart', viewsController.cart);

router.get('/error', viewsController.error);

router.get('/checkout', viewsController.checkout);

router.get(
  '/product/:superCategorySlug/:categorySlug/:slug',
  viewsController.productDetail,
);

router.get('/store-locations', viewsController.store);

router.get('/wishlist', viewsController.wishlist);

router.get('/michael-kitchen/faqs', viewsController.kitchenFaq);

router.get('/michael-kitchen/menu', viewsController.menu);

router.get('/michael-kitchen/menu/:categorySlug', viewsController.menuCategory);

router.get('/michael-kitchen/shop', viewsController.kitchenShop);

router.get('/michael-kitchen/contact-us', viewsController.kitchenContact);

////////////////////////////////////////////////////////////
//////////////////      ADMIN          //////////////////////

router.get('/admin/dashboard', viewsController.adminDashboard);

router.get('/admin/profile', viewsController.adminProfile);

router.get('/admin/users', viewsController.users);

router.get('/admin/orders', viewsController.orders);

router.get('/admin/afro-shop', viewsController.afroShopItems);

router.get('/admin/gadgets', viewsController.gadgetItems);

router.get('/admin/kitchen', viewsController.kitchenItems);

router.get('/admin/add-products', viewsController.addProducts);

router.get('/admin/add-category', viewsController.addCategory);

router.get('/admin/categories', viewsController.categories);

router.get('/admin/supports', viewsController.supports);

router.get('/admin/out-of-stock', viewsController.outOfStock);

router.get('/admin/orderDetails/:reference', viewsController.orderDetails);

router.get('/admin/transactions', viewsController.transactions);

router.get('/admin/add-rate', viewsController.addRate);

router.get('/admin/rates', viewsController.editRate);

router.get('/admin/currencies', viewsController.editCurrency);

router.get('/admin/add-currency', viewsController.addCurrency);

router.get('/admin/user-role', viewsController.userRole);

router.get(
  '/michael-kitchen/item/:categorySlug/:slug',
  viewsController.kitchenDetail,
);

router.get(
  '/michael-enterprise/shop/:categorySlug',
  viewsController.kitchenShopCategory,
);

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////       EXCHANGE                /////////////////////////////////////

router.get('/exchange/index', viewsController.exchangeHome);

router.get('/exchange/history', viewsController.history);

router.get('/exchange/account', viewsController.accounts);

router.get('/exchange/beneficiaries', viewsController.beneficiary);

router.get('/exchange/money-exchange', viewsController.exchange);

module.exports = router;
