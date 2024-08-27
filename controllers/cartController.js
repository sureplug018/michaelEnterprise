const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// add product to cart
exports.addToCart = async (req, res) => {
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

    if (product.productStock <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product is out of stock',
      });
    }

    // check if product exists in user cart
    const productExistsInUserCart = await Cart.findOne({ user, productId });

    if (productExistsInUserCart) {
      // Check if the new quantity would exceed productStock
      if (productExistsInUserCart.quantity + 1 > product.productStock) {
        return res.status(400).json({
          status: 'fail',
          message:
            'Stock limit reached.',
        });
      }
      // Product already in the cart, increment quantity
      productExistsInUserCart.quantity += 1;
      await productExistsInUserCart.save();

      return res.status(200).json({
        status: 'success',
        message: 'Product quantity updated in cart',
        data: productExistsInUserCart,
      });
    }

    const cart = await Cart.create({
      user,
      productId,
    });

    res.status(200).json({
      status: 'success',
      message: 'Product added to cart successfully',
      data: cart,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const user = req.user.id;
  if (!productId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Product not found',
    });
  }
  try {
    const product = await Cart.findOneAndDelete({ user, productId });

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Item not found',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.increaseQuantity = async (req, res) => {
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

    if (product.productStock <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product is out of stock',
      });
    }

    // Step 1: Find the Cart Item
    const cart = await Cart.findOne({ user, productId });

    // if the item is not in the user cart, add it
    if (!cart) {
      const uploadToCart = await Cart.create({
        user,
        productId,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        data: uploadToCart,
      });
    }

    // Step 2: Manually Increment the Quantity and Save
    cart.quantity += 1; // Increment the quantity by 1
    await cart.save(); // Save the updated cart item

    // Now you can work with the saved cart item

    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      data: cart,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.decreaseQuantity = async (req, res) => {
  const { productId } = req.params;
  const user = req.user.id;
  if (!productId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Product not found',
    });
  }
  try {
    const productInCart = await Cart.findOne({ user, productId });

    if (!productInCart) {
      return res.status(400).json({
        status: 'fail',
        message: 'Item is not in cart',
      });
    }

    if (productInCart.quantity <= 1) {
      await Cart.findByIdAndDelete(productInCart.id);
      return res.status(200).json({
        status: 'success',
        message: 'Item removed from cart',
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { user, productId }, // Query to find the correct cart item
      { $inc: { quantity: -1 } }, // Increment the quantity by 1
      { new: true }, // Return the updated document
    );

    if (!cart) {
      return res.status(404).json({
        status: 'fail',
        message: 'Item not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      data: cart,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
