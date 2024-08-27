// const axios = require('axios');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const ShippingAddress = require('../models/shippingAddressModel');
const OrderEmail = require('./../utilities/notificationEmail');
const Product = require('../models/productModel');
const PendingReview = require('../models/pendingReviewModel');

// const PAYSTACK_BASE_URL = 'https://api.paystack.co/transaction/initialize';
// const STRIPE_BASE_URL = 'https://api.stripe.com/v1/checkout/sessions';

// // Initialize checkout for Paystack
// async function initializePaystackCheckout(cartItems, userEmail, userId) {
//   const amount = calculateTotalAmount(cartItems); // Calculate total amount

//   const userAddress = await ShippingAddress.findOne({ user: userId });

//   if (!userAddress) {
//     throw new Error('User address not found');
//   }

//   try {
//     const response = await axios.post(
//       PAYSTACK_BASE_URL,
//       {
//         email: userEmail,
//         amount: amount * 100, // amount in kobo (1 NGN = 100 kobo)
//         currency: 'NGN',
//         metaData: {
//           userAddress,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );
//     console.log(response.data.data);
//     // Return the authorization URL
//     return {
//       status: 'success',
//       authorization_url: response.data.data.authorization_url,
//     };
//   } catch (error) {
//     throw new Error(`Failed to initiate Paystack payment: ${error.message}`);
//   }
// }

// // Initialize checkout for Stripe
// async function initializeStripeCheckout(cartItems, userId) {
//   const amount = calculateTotalAmount(cartItems); // Calculate total amount
//   const userAddress = await ShippingAddress.findOne({ user: userId });

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: cartItems.map((item) => ({
//         price_data: {
//           currency: 'rub',
//           product_data: {
//             name: item.productId.name,
//           },
//           unit_amount: item.productId.price * 100, // amount in kopecks
//         },
//         quantity: item.quantity,
//       })),
//       metadata: {
//         user: userId.toString(),
//         fullName: userAddress.fullName,
//         address: userAddress.address,
//         phoneNumber: userAddress.phoneNumber,
//         country: userAddress.country,
//         region: userAddress.region,
//         city: userAddress.city,
//       },
//       mode: 'payment',
//       success_url: 'https://zeani.org',
//       cancel_url: 'https://zeani.org',
//     });
//     console.log(session);
//     return { id: session.id };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// exports.initiateCheckoutPayment = async (req, res) => {
//   const { id, email } = req.user; // Get user ID and email from request body

//   try {
//     // Fetch user's cart items from database
//     const cart = await Cart.find({ user: id }).populate('productId'); // Find all cart items for the user and populate product details
//     if (!cart.length) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }

//     const ip_address = await axios.get('https://api.ipify.org?format=json');
//     const ip = ip_address.data.ip;
//     const auth = '9c94a29d-e92e-4af5-88eb-fb8bfe91faac';
//     const url = `https://ipfind.co/?auth=${auth}&ip=${ip}`;

//     console.log('Request URL:', url); // Log the request URL

//     const response = await axios.get(url);
//     const country = response.data.country;

//     if (country === 'Nigeria') {
//       // Initialize Paystack checkout
//       const paystackResponse = await initializePaystackCheckout(
//         cart,
//         email,
//         id,
//       );
//       return res.json(paystackResponse);
//     } else if (country === 'Russia') {
//       // Initialize Stripe checkout
//       const stripeResponse = await initializeStripeCheckout(cart, id);
//       return res.json(stripeResponse);
//     } else {
//       return res.status(400).json({ error: 'Unsupported country' });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// // Helper function to calculate total amount based on cart items
// function calculateTotalAmount(cartItems) {
//   return cartItems.reduce(
//     (total, item) => total + item.productId.price * item.quantity,
//     0,
//   );
// }

// add each product to the metadata
// add each products quantity to the metadata
// add each products total to the metadata
// add payment method to the metadata

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'payment_proofs', // Folder to store payment proofs
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Multer middleware
const upload = multer({ storage });

exports.uploadPaymentProof = upload.single('paymentProof');

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = req.user.id;
    const orderNote = req.body.orderNote;
    const paymentProof = req.file ? req.file.path : null; // Get payment proof image URL

    if (!paymentProof) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: 'fail',
        data: {
          message: 'Payment proof is required',
        },
      });
    }

    // return array of cart created by user
    const cartItems = await Cart.find({ user }).session(session);

    if (cartItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: 'fail',
        data: {
          message: 'Cart is empty',
        },
      });
    }

    // Update product stocks
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.productId, // Use item.productId directly
        { $inc: { productStock: -item.quantity } }, // Decrement stock
        { session }, // Pass the session
      );
    }
    // console.log('cart items:', cartItems);
    if (cartItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 'fail',
        message: 'No item in the current user cart',
      });
    }
    const deliveryDetails = await ShippingAddress.findOne({ user }).session(
      session,
    );

    if (!deliveryDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 'fail',
        message: 'Delivery address not found',
      });
    }

    // create an empty array of orders
    const orders = [];
    for (const item of cartItems) {
      // Generate a random 10-digit number as the orderId
      const orderId = Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString();

      const order = await Order.create(
        [
          {
            orderId,
            user,
            productId: item.productId.id,
            quantity: item.quantity,
            price: item.productId.price,
            name: item.productId.name,
            total: item.productId.price * item.quantity,
            paymentMethod: 'Bank Transfer',
            paymentProof, // Save the payment proof URL
            fullName: deliveryDetails.fullName,
            address: deliveryDetails.address,
            phoneNumber: deliveryDetails.phoneNumber,
            country: deliveryDetails.country,
            city: deliveryDetails.city,
            region: deliveryDetails.region,
            orderNote,
          },
        ],
        { session },
      );

      orders.push(order[0]); //flatten the array by pushing the first element
    }

    // also delete those items that were ordered from user cart after a successful order
    await Cart.deleteMany({ user }, { session });

    // return array of admins
    const adminUsers = await User.find({ role: 'admin' }).session(session);

    const url = `${req.protocol}://${req.get('host')}/admin/orders`;

    // send emails to admin(s) is they are many or send to admin if only single
    for (const adminUser of adminUsers) {
      await new OrderEmail(adminUser, url, orders).sendOrderNotification();
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    if (err.hasErrorLabel('TransientTransactionError')) {
      // Retry logic here
      return exports.createOrder(req, res);
    }
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// order confirmation
exports.confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Order ID is required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    if (order.status === 'Order placed') {
      order.status = 'Confirmed';
      await order.save();

      const user = order.user;

      const url = `${req.protocol}://${req.get('host')}/account`;

      // send order confirmation email to user
      await new OrderEmail(user, url, order).sendOrderConfirmationEmail();

      res.status(200).json({
        status: 'success',
        data: {
          order,
        },
      });
    } else {
      return res.status(404).json({
        status: 'fail',
        message: 'Cannot perform this action'
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.shipOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Order ID is required',
      });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    if (order.status === 'Shipped') {
      return res.status(400).json({
        status: 'fail',
        message: 'Order have been shipped',
      });
    }

    order.status = 'Shipped';
    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Order ID is required',
      });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({
        status: 'fail',
        message: 'Order have been delivered',
      });
    }

    order.status = 'Delivered';
    order.dateDelivered = Date.now();
    await order.save();

    await PendingReview.create({
      productId: order.productId,
      user: order.user,
      deliveredOn: Date.now(),
    });
    const user = order.user;

    const reviewId = order.productId.id;

    const url = `${req.protocol}://${req.get('host')}/review/${reviewId}`;

    // send order cancelled email notification to user
    await new OrderEmail(user, url, order).sendDelivery();

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// cancel order
exports.cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Order ID is required',
      });
    }
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        status: 'fail',
        message: 'Order has been cancelled',
      });
    }

    order.status = 'Cancelled';
    await order.save({ session });

    const user = order.user;

    const url = `${req.protocol}://${req.get('host')}/account`;

    // send order cancelled email notification to user
    await new OrderEmail(user, url, order).sendOrderCancelled();

    // add the item back to user cart
    await Cart.create(
      [
        {
          user: user.id,
          productId: order.productId.id,
          quantity: order.quantity,
        },
      ],
      { session },
    );

    await Product.findByIdAndUpdate(
      order.productId.id,
      { $inc: { productStock: +order.quantity } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
