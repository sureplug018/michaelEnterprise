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
const crypto = require('crypto');

// generating unique random string for reference
// Function to generate a random alphanumeric string
const generateRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Return the required number of characters
};

const generateUniqueReference = async () => {
  let isUnique = false;
  let reference;

  // Keep generating until a unique reference is found
  while (!isUnique) {
    const randomString = generateRandomString(10); // 10 characters
    reference = `${randomString}${Date.now()}`;

    // Check if reference is unique
    const existingOrder = await Order.findOne({ reference });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return reference;
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let transformation = [];

    // Apply transformation only if the file is an image
    if (file.mimetype.startsWith('image')) {
      transformation = [{ width: 500, height: 500, crop: 'limit' }];
    }

    return {
      folder: 'payment_proofs', // Folder to store payment proofs
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'], // Allowed file formats including documents
      transformation, // Apply transformations if it's an image
    };
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
    const deliveryMethod = req.body.deliveryMethod;
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

    const reference = await generateUniqueReference(); // Generate and ensure unique reference

    if (deliveryMethod === 'delivery outside Rostov') {
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
              total: item.total,
              paymentMethod: 'Bank Transfer',
              paymentProof, // Save the payment proof URL
              fullName: deliveryDetails.fullName,
              address: deliveryDetails.address,
              phoneNumber: deliveryDetails.phoneNumber,
              country: deliveryDetails.country,
              region: deliveryDetails.region,
              city: deliveryDetails.city,
              postalCode: deliveryDetails.postalCode,
              postOfficeAddress: deliveryDetails.postOfficeAddress,
              passportNumber: deliveryDetails.passportNumber,
              orderNote,
              deliveryMethod,
              reference,
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
    } else if (deliveryMethod === 'delivery within Rostov') {
      const {
        fullName,
        address,
        phoneNumber,
        entrance,
        entranceCode,
        floor,
        roomNumber,
      } = req.body;

      if (!fullName) {
        return res.status(400).json({
          status: 'fail',
          message: 'Full name is required',
        });
      }

      if (!address) {
        return res.status(400).json({
          status: 'fail',
          message: 'Address is required',
        });
      }

      if (!phoneNumber) {
        return res.status(400).json({
          status: 'fail',
          message: 'Phone number is required',
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
              total: item.total,
              paymentMethod: 'Bank Transfer',
              paymentProof, // Save the payment proof URL
              fullName,
              address,
              phoneNumber,
              entrance,
              entranceCode,
              floor,
              roomNumber,
              orderNote,
              deliveryMethod,
              reference,
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
    } else {
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
              total: item.total,
              paymentMethod: 'Bank Transfer',
              paymentProof, // Save the payment proof URL
              orderNote,
              deliveryMethod,
              reference,
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
    }
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

      await Product.findByIdAndUpdate(order.productId.id, {
        $inc: { productStock: -order.quantity },
      });

      return res.status(200).json({
        status: 'success',
        data: {
          order,
        },
      });
    } else {
      return res.status(404).json({
        status: 'fail',
        message: 'Cannot perform this action again',
      });
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
    const url = req.body.url;
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

    if (order.status === 'Confirmed' && order.deliveryMethod === 'delivery') {
      if (!url) {
        return res.status(404).json({
          status: 'fail',
          message: 'Tracking Id is required',
        });
      }
      order.status = 'Shipped';
      await order.save();

      const user = order.user;

      // send order confirmation email to user
      await new OrderEmail(user, url, order).shipDelivery();

      return res.status(200).json({
        status: 'success',
        data: {
          order,
        },
      });
    } else {
      return res.status(404).json({
        status: 'fail',
        message: 'Cannot perform this action again',
      });
    }
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

    if (
      order.status === 'Shipped' ||
      (order.deliveryMethod === 'pick-up' && order.status === 'Confirmed')
    ) {
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
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot perform this action',
      });
    }
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

    if (order.status === 'Order placed') {
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

      return res.status(200).json({
        status: 'success',
        data: {
          order,
        },
      });
    } else {
      return res.status(500).json({
        status: 'fail',
        message: 'Cannot perform this action',
      });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
