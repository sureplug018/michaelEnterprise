const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Support = require('../models/supportModel');
const ShippingAddress = require('../models/shippingAddressModel');
const Review = require('../models/reviewModel');
const PendingReview = require('../models/pendingReviewModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Wishlist = require('../models/wishlistModel');

exports.overview = async (req, res) => {
  try {
    const user = res.locals.user;
    const firstTenProducts = await Product.find()
      .sort({ createdAt: 1 })
      .limit(10);

    res.status(200).render('index', {
      title: 'Home',
      user,
      firstTenProducts,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    res.status(200).render('login', {
      title: 'Sign in',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.register = async (req, res) => {
  try {
    res.status(200).render('register', {
      title: 'Sign up',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    res.status(200).render('confirm-email', {
      title: 'Confirm email',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.emailConfirmed = async (req, res) => {
  try {
    res.status(200).render('email-confirmed', {
      title: 'Email confirmed',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.faq = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('faq', {
      title: 'Faq',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.wishlist = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(302).redirect('/sign-in');
    }
    if (user.role === 'user') {
      const wishlists = await Wishlist.find({ user: user.id });
      return res.status(200).render('wishlist', {
        title: 'Wishlist',
        user,
        wishlists,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.cart = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(302).redirect('/sign-in');
    }
    if (user.role === 'user') {
      const carts = await Cart.find({ user: user.id });
      return res.status(200).render('cart', {
        title: 'Cart',
        user,
        carts,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.contact = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('contact', {
      title: 'Contact Us',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.checkout = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user.role === 'user') {
      const userDeliveryAddress = await ShippingAddress.findOne({
        user: user.id,
      });
      const cartItems = await Cart.find({ user: user.id });
      return res.status(200).render('checkout', {
        title: 'Checkout',
        user,
        cartItems,
        userDeliveryAddress,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.productDetail = async (req, res) => {
  try {
    const user = res.locals.user;
    const product = await Product.findOne({ slug: req.params.slug });
    const relatedProducts = await Product.aggregate([
      { $match: { category: product.category } }, // Filter by category
      { $sample: { size: 10 } }, // Randomly select up to 10 products
    ]);
    if (!product) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Something went wrong',
      });
    }

    res.status(200).render('product-details', {
      title: 'Product detail',
      user,
      product,
      relatedProducts,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.afroShop = async (req, res) => {
  try {
    const user = res.locals.user;
    const afroShopItems = await Product.find({ superCategory: 'Afro shop' });
    const userCart = await Cart.find({ user });
    res.status(200).render('afro-shop', {
      title: 'Afro shop',
      user,
      afroShopItems,
      userCart,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.termsConditions = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('terms-condition', {
      title: 'Terms and conditions',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.privacyPolicy = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('privacy-policy', {
      title: 'Privacy policy',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.store = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('store', {
      title: 'Store locations',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.error = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('error', {
      title: 'Error',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    res.status(200).render('forgotPassword', {
      title: 'Forgot password',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    res.status(200).render('resetPassword', {
      title: 'Reset password',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.account = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }
    if (user.role === 'user') {
      const shippingAddress = await ShippingAddress.findOne({ user: user.id });
      const orders = await Order.find({ user: user.id });
      return res.status(200).render('account', {
        title: 'Account',
        user,
        orders,
        shippingAddress,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////             ADMIN               ////////////////////////////////////////////////

exports.adminDashboard = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      return res.status(200).render('admin-dashboard', {
        title: 'Admin Dashboard',
        user,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.orders = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const orders = await Order.find();
      return res.status(200).render('orders', {
        title: 'Orders',
        user,
        orders,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.afroShopItems = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const afroShopItems = await Product.find({ category: 'Afro shop' });
      return res.status(200).render('afro-shop-items', {
        title: 'Afro Shop',
        user,
        afroShopItems,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.adminProfile = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      return res.status(200).render('admin-profile', {
        title: 'Admin Profile',
        user,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('admin-login', {
      title: 'Admin Login',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.supports = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const supports = await Support.find();
      res.status(200).render('supports', {
        title: 'Supports',
        user,
        supports,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.users = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const users = await User.find();
      return res.status(200).render('users', {
        title: 'Users',
        user,
        users,
      });
    }
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.addProducts = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const categories = await Category.find();
      return res.status(200).render('add-products', {
        title: 'Add Products',
        user,
        categories,
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      return res.status(200).render('add-category', {
        title: 'Add Category',
        user,
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};
