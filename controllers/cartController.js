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
        message: 'Product not found',
      });
    }

    if (product.productStock <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Item is out of stock',
      });
    }

    // check if product exists in user cart
    const productExistsInUserCart = await Cart.findOne({ user, productId });

    if (productExistsInUserCart) {
      // Check if the new quantity would exceed productStock
      if (productExistsInUserCart.quantity + 1 > product.productStock) {
        return res.status(400).json({
          status: 'fail',
          message: 'Item is out of stock.',
        });
      }
      // Product already in the cart, increment quantity
      productExistsInUserCart.quantity += 1;
      productExistsInUserCart.total += parseInt(product.price);
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
      total: parseInt(product.price),
    });

    res.status(200).json({
      status: 'success',
      message: 'Product added to cart successfully',
      data: {
        cart,
      },
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

    if (cart.quantity + 1 > product.productStock) {
      return res.status(400).json({
        status: 'fail',
        message: 'Stock limit reached.',
      });
    }

    // Step 2: Manually Increment the Quantity and Save
    cart.quantity += 1; // Increment the quantity by 1
    cart.total += parseInt(product.price);
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

    const productPrice = productInCart.productId?.price || 0; // Ensure price is safe
    productInCart.quantity -= 1;
    productInCart.total -= parseInt(productPrice);

    await productInCart.save();

    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      data: {
        productInCart,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.addToCartWithProtein = async (req, res) => {
  const { productId } = req.params;
  const user = req.user.id;
  if (!productId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Product not found',
    });
  }

  const { proteins = [] } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    if (product.productStock <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Item is out of stock',
      });
    }

    // check if product exists in user cart
    const productExistsInUserCart = await Cart.findOne({ user, productId });

    if (productExistsInUserCart) {
      // Check if the new quantity would exceed productStock
      if (productExistsInUserCart.quantity + 1 > product.productStock) {
        return res.status(400).json({
          status: 'fail',
          message: 'Item is out of stock.',
        });
      }

      const newProteins = req.body.proteins || [];

      // Update proteins logic
      if (newProteins.length > 0) {
        // Merge proteins: update existing or add new ones
        const updatedProteins = [...productExistsInUserCart.proteins];

        newProteins.forEach((newProtein) => {
          const existingProteinIndex = updatedProteins.findIndex(
            (protein) => protein.name === newProtein.name,
          );

          if (existingProteinIndex !== -1) {
            // Update existing protein quantity
            updatedProteins[existingProteinIndex].quantity +=
              newProtein.quantity;
            updatedProteins[existingProteinIndex].total =
              parseInt(updatedProteins[existingProteinIndex].price) *
              updatedProteins[existingProteinIndex].quantity;
          } else {
            // Add new protein to the array
            updatedProteins.push({
              name: newProtein.name,
              quantity: newProtein.quantity,
              price: newProtein.price,
              total: newProtein.price * newProtein.quantity,
            });
          }
        });

        // Update the proteins in the cart
        productExistsInUserCart.proteins = updatedProteins;

        // Product already in the cart, increment quantity
        productExistsInUserCart.quantity += 1;
        // Calculate totals AFTER updating quantities
        const productTotal =
          parseInt(product.price) * productExistsInUserCart.quantity;
        productExistsInUserCart.proteins.quantity += proteins.quantity;

        // Calculate proteinsTotal safely, even if no proteins are added
        const proteinsTotal = updatedProteins.reduce(
          (acc, protein) => acc + protein.total,
          0,
        );

        productExistsInUserCart.total =
          parseInt(productTotal) + parseInt(proteinsTotal);
        await productExistsInUserCart.save();

        return res.status(200).json({
          status: 'success',
          message: 'Product quantity updated in cart',
          data: productExistsInUserCart,
        });
      } else {
        // Product already in the cart, increment quantity
        productExistsInUserCart.quantity += 1;

        productExistsInUserCart.total += parseInt(product.price);
        await productExistsInUserCart.save();

        return res.status(200).json({
          status: 'success',
          message: 'Product quantity updated in cart',
          data: productExistsInUserCart,
        });
      }
    }

    // If product is not already in the cart, create a new cart item
    const proteinsWithTotal = proteins.map((protein) => ({
      ...protein,
      total: protein.price * protein.quantity,
    }));

    const productTotal = product.price;
    const proteinsTotal = proteinsWithTotal.reduce(
      (acc, protein) => acc + protein.total,
      0,
    );

    const total = parseInt(productTotal) + parseInt(proteinsTotal);

    // If product is not already in the cart, create a new cart item
    const newCartItem = await Cart.create({
      user,
      productId,
      proteins: proteinsWithTotal,
      total,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Product added to cart',
      data: {
        newCartItem,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
