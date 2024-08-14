const mongoose = require('mongoose');
const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

// add product to cart
exports.addToWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = req.user.id;
  if (!productId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Product not found',
    });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid product',
      });
    }

    // check if product exists in user cart
    const productExistsInUserCart = await Wishlist.findOne({ user, productId });

    if (productExistsInUserCart) {
      // Product already in the cart, increment quantity
      return res.status(400).json({
        status: 'fail',
        message: 'Item already on the wishlist',
      });
    }

    const cart = await Wishlist.create({
      user,
      productId,
    });

    res.status(200).json({
      status: 'success',
      message: 'Product added to cart successfully',
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = req.user.id;
  if (!productId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Product not found',
    });
  }
  try {
    const product = await Wishlist.findOneAndDelete({ user, productId });

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Item not found',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Product removed from wishlist successfully',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// add to cart from wishlist
exports.addToCartFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = req.user.id;

  if (!productId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Product not found',
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productStockCheck = await Product.findById(productId);

    if (productStockCheck.productStock === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product is out of stock',
      });
    }

    const product = await Wishlist.findOne({ user, productId }).session(
      session,
    );

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 'fail',
        message: 'Product not in your wishlist',
      });
    }

    const productAlreadyInCart = await Cart.findOne({
      user,
      productId,
    }).session(session);

    if (productAlreadyInCart) {
      await Wishlist.findOneAndDelete({ user, productId }).session(session);
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        status: 'success',
        message: 'Product already in cart and removed from wishlist',
      });
    }

    const toCart = await Cart.create([{ user, productId }], { session });

    await Wishlist.findOneAndDelete({ user, productId }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      message: 'Cart successfully updated',
      data: {
        toCart,
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
