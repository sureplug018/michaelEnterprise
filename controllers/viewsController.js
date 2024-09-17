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
const Currency = require('../models/currencyModel');
const Rate = require('../models/rateModel');
const Transaction = require('../models/transactionModel');
const Beneficiary = require('../models/beneficiaryModel');

exports.home = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('index', {
      title: 'Home',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.homeContact = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('contact-home', {
      title: 'Contact Us',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.homeAbout = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('about', {
      title: 'About ss',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.overview = async (req, res) => {
  try {
    const user = res.locals.user;
    const firstTenProducts = await Product.find()
      .sort({ createdAt: 1 })
      .limit(10);
    const categories = await Category.find();
    res.status(200).render('afro-home', {
      title: 'Afro shop',
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
    const filter = {
      superCategory: 'Afro shop',
      availability: true,
      ...(category.trim().toLowerCase() !== 'all' && {
        categorySlug: category.trim(),
      }),
    };

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

exports.orders = async (req, res) => {
  try {
    const user = res.locals.user;
    const { page = 1, limit = 30 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit numbers
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Invalid page or limit value.',
      });
    }

    // Redirect if user is not authenticated
    if (!user) {
      return res.status(302).redirect('/');
    }

    // Define the aggregation pipeline
    const pipeline = [
      {
        $match: {
          reference: { $exists: true, $ne: null }, // Ensure the reference field exists and is not null
        },
      },
      {
        $sort: { createdAt: 1 }, // Sort by creation date, newest first
      },
      {
        $group: {
          _id: '$reference', // Group by reference
          order: { $first: '$$ROOT' }, // Get the first order from each reference group
        },
      },
      {
        $replaceRoot: { newRoot: '$order' }, // Replace root with the order document
      },
      {
        $lookup: {
          from: 'users', // Name of the collection to join with
          localField: 'user', // Field from 'Order' collection
          foreignField: '_id', // Field from 'User' collection
          as: 'userDetails', // The name of the array field to add
        },
      },
      {
        $unwind: '$userDetails', // Deconstruct the array field to output a document for each element
      },
      {
        $project: {
          _id: 1,
          orderId: 1,
          user: 1,
          productId: 1,
          quantity: 1,
          total: 1,
          paymentMethod: 1,
          orderNote: 1,
          deliveryMethod: 1,
          fullName: 1,
          address: 1,
          phoneNumber: 1,
          country: 1,
          region: 1,
          city: 1,
          postalCode: 1,
          postOfficeAddress: 1,
          passportNumber: 1,
          dateDelivered: 1,
          paymentProof: 1,
          reference: 1,
          createdAt: 1,
          'userDetails.firstName': 1, // Include user.firstName
          'userDetails.lastName': 1,
          'userDetails.email': 1, // Include user.email
        },
      },
      {
        $skip: (pageNumber - 1) * limitNumber, // Skip records for pagination
      },
      {
        $limit: limitNumber, // Limit the number of results returned
      },
    ];

    if (user.role === 'admin') {
      // Get the orders with the aggregation pipeline
      const orders = await Order.aggregate(pipeline);

      // Calculate total pages
      const totalOrders = await Order.aggregate([
        {
          $group: {
            _id: '$reference', // Group by reference for unique count
          },
        },
        {
          $count: 'totalUniqueReferences', // Count unique references
        },
      ]);

      const totalUniqueReferences =
        totalOrders.length > 0 ? totalOrders[0].totalUniqueReferences : 0;
      const totalPages = Math.ceil(totalUniqueReferences / limitNumber);

      const ordersWithoutReference = await Order.find({
        reference: { $exists: false },
      });

      return res.status(200).render('orders', {
        title: 'Orders',
        user,
        orders,
        currentPage: pageNumber, // Pass current page to the view
        totalPages, // Total pages for pagination
        ordersWithoutReference,
      });
    }

    // Redirect if the user is not an admin
    return res.status(302).redirect('/');
  } catch (err) {
    console.error('Error fetching orders:', err); // Log the error for debugging
    return res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.orderDetails = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      res.status(302).redirect('/');
    }
    if (user.role === 'admin') {
      const orders = await Order.find({ reference: req.params.reference });

      return res.status(200).render('orderDetails', {
        title: 'Order Details',
        user,
        orders,
      });
    }
    // Redirect if the user is not an admin
    return res.status(302).redirect('/');
  } catch (err) {
    console.error('Error fetching orders:', err); // Log the error for debugging
    return res.status(500).render('error', {
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
    return res.status(302).redirect('/');
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

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

exports.exchangeHome = async (req, res) => {
  try {
    const user = res.locals.user;
    const currencies = await Currency.find({ status: 'Enabled' });
    const rates = await Rate.find();
    return res.status(200).render('exchangeHome', {
      title: 'Exchange',
      user,
      rates,
      currencies,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.accounts = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      return res.status(200).render('accounts', {
        title: 'Account',
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

exports.history = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      const transactionHistory = await Transaction.find({ user: user.id }).sort(
        { createdAt: 1 },
      );
      return res.status(200).render('history', {
        title: 'History',
        user,
        transactionHistory,
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

exports.beneficiary = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      const beneficiaries = await Beneficiary.find({ user: user.id });
      return res.status(200).render('beneficiary', {
        title: 'Beneficiary',
        user,
        beneficiaries,
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

exports.exchange = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      const currencies = await Currency.find({ status: 'Enabled' });
      const rates = await Rate.find();
      const beneficiaries = await Beneficiary.find({ user: user.id });
      return res.status(200).render('exchange', {
        title: 'Exchange',
        user,
        rates,
        currencies,
        beneficiaries,
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

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////        ADMIN EXCHANGE            ////////////////////////////////////////

exports.addCurrency = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }
    if (user.role === 'admin') {
      return res.status(200).render('currencyAdd', {
        user,
        title: 'Add Currency',
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.addRate = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }
    if (user.role === 'admin') {
      const currencies = await Currency.find();
      return res.status(200).render('addRate', {
        user,
        title: 'Add Rate',
        currencies,
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.editCurrency = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }
    if (user.role === 'admin') {
      const currencies = await Currency.find();
      return res.status(200).render('editCurrency', {
        user,
        currencies,
        title: 'Edit Currency',
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.editRate = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }
    if (user.role === 'admin') {
      const rates = await Rate.find();
      const currencies = await Currency.find();
      return res.status(200).render('editRate', {
        user,
        rates,
        title: 'Edit Rate',
        currencies,
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.transactions = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(302).redirect('/sign-in');
    }
    if (user.role === 'admin') {
      const transactions = await Transaction.find().sort({ createdAt: 1 });
      return res.status(200).render('transactions', {
        user,
        transactions,
        title: 'Transactions',
      });
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};
