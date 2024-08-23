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
    const categories = await Category.find();
    res.status(200).render('index', {
      title: 'Home',
      user,
      firstTenProducts,
      categories,
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
    const { category = 'all', page = 1, limit = 20 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Ensure page and limit are valid numbers
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Invalid page or limit value.',
      });
    }

    // Create a filter object based on category
    const filter =
      category && category.trim().toLowerCase() !== 'all'
        ? { superCategory: 'Afro shop', categorySlug: category.trim() }
        : { superCategory: 'Afro shop' };

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch products with category filter and pagination
    const afroShopItems = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber);

    // Get total count of products for pagination metadata
    const totalCount = await Product.countDocuments(filter);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Fetch categories from the database
    const categories = await Product.distinct('category', {
      superCategory: 'Afro shop',
    });

    // Render view with pagination data and category filter
    res.status(200).render('afro-shop', {
      title: 'Afro shop',
      user,
      afroShopItems,
      currentPage: pageNumber,
      totalPages,
      limit: limitNumber,
      currentCategory: category,
      categories, // Pass categories to the view
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
      message: 'Something went wrong',
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
      const pendingReviews = await PendingReview.find({ user: user.id });
      return res.status(200).render('account', {
        title: 'Account',
        user,
        orders,
        shippingAddress,
        pendingReviews,
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
      const users = await User.find({ confirmed: true });
      const orders = await Order.find();
      const pendingOrders = await Order.find({ status: 'Order placed' });
      const shippedOrders = await Order.find({ status: 'Shipped' });
      const cancelledOrders = await Order.find({ status: 'Cancelled' });
      const pendingSupports = await Support.find();
      const outOfStockProducts = await Product.find({ productStock: 0 });
      return res.status(200).render('admin-dashboard', {
        title: 'Admin Dashboard',
        user,
        users,
        orders,
        pendingOrders,
        shippedOrders,
        cancelledOrders,
        pendingSupports,
        outOfStockProducts,
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

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

exports.orders = async (req, res) => {
  try {
    const user = res.locals.user;
    const { status = 'all', page = 1, limit = 30 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Ensure page and limit are valid numbers
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Invalid page or limit value.',
      });
    }

    if (!user) {
      return res.status(302).redirect('/');
    }

    // Define the query object
    const query = {};

    // Define valid statuses and their corresponding slugified versions
    const validStatuses = {
      'order-placed': 'Order placed', // 'pending' is now 'order placed'
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };

    // If the status is not 'all', filter by the specified status
    const slugifiedStatus = slugify(status);
    if (status !== 'all' && validStatuses.hasOwnProperty(slugifiedStatus)) {
      query.status = validStatuses[slugifiedStatus];
    }

    // Admin can view orders, possibly with a filter applied
    if (user.role === 'admin') {
      const orders = await Order.find(query)
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
        .skip((pageNumber - 1) * limitNumber) // Skip the appropriate number of records for pagination
        .limit(limitNumber); // Limit the number of results returned

      return res.status(200).render('orders', {
        title: 'Orders',
        user,
        orders,
        currentPage: pageNumber, // Pass the current page to the view for pagination controls
        totalPages: Math.ceil(
          (await Order.countDocuments(query)) / limitNumber,
        ), // Calculate total pages
        status, // Pass the current status filter to the view
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
    const { category = 'all', page = 1, limit = 20 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Ensure page and limit are valid numbers
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Invalid page or limit value.',
      });
    }

    // Create a filter object based on category
    const filter =
      category && category.trim().toLowerCase() !== 'all'
        ? { superCategory: 'Afro shop', categorySlug: category.trim() }
        : { superCategory: 'Afro shop' };

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      // Fetch products with category filter and pagination
      const afroShopItems = await Product.find(filter)
        .skip(skip)
        .limit(limitNumber);
      // Get total count of products for pagination metadata
      const totalCount = await Product.countDocuments(filter);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limitNumber);

      // Fetch categories from the database
      const categories = await Product.distinct('category', {
        superCategory: 'Afro shop',
      });
      return res.status(200).render('afro-shop-items', {
        title: 'Afro shop',
        user,
        afroShopItems,
        currentPage: pageNumber,
        totalPages,
        limit: limitNumber,
        currentCategory: category,
        categories, // Pass categories to the view
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
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const supports = await Support.find();
      return res.status(200).render('supports', {
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
    return res.status(302).redirect('/');
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
    return res.status(302).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.categories = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const categories = await Category.find();
      return res.status(200).render('categories', {
        title: 'Categories',
        user,
        categories,
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

exports.outOfStock = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const outOfStockProducts = await Product.find({ productStock: 0 });
      return res.status(200).render('out-of-stock', {
        title: 'Out Of Stock',
        user,
        outOfStockProducts,
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.review = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/');
    }
    if (user.role === 'user') {
      const product = await Product.findById(productId);
      return res.status(200).render('review', {
        title: 'Submit a Review',
        user,
        product,
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

// Search endpoint
exports.search = async (req, res) => {
  try {
    const user = res.locals.user;
    const { query } = req.query;
    const regex = new RegExp(query, 'i'); // 'i' makes it case-insensitive
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        // Add other fields you want to search through
      ],
    });

    // Render the search results page with the found products
    res.status(200).render('search', {
      title: 'Search Results',
      user,
      products,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};
