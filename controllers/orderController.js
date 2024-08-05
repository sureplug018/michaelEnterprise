const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const ShippingAddress = require('../models/shippingAddressModel');

const PAYSTACK_BASE_URL = 'https://api.paystack.co/transaction/initialize';
const STRIPE_BASE_URL = 'https://api.stripe.com/v1/checkout/sessions';

// Initialize checkout for Paystack
async function initializePaystackCheckout(cartItems, userEmail, userId) {
  const amount = calculateTotalAmount(cartItems); // Calculate total amount

  const userAddress = await ShippingAddress.findOne({ user: userId });

  if (!userAddress) {
    throw new Error('User address not found');
  }

  try {
    const response = await axios.post(
      PAYSTACK_BASE_URL,
      {
        email: userEmail,
        amount: amount * 100, // amount in kobo (1 NGN = 100 kobo)
        currency: 'NGN',
        metaData: {
          userAddress,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response.data.data);
    // Return the authorization URL
    return {
      status: 'success',
      authorization_url: response.data.data.authorization_url,
    };
  } catch (error) {
    throw new Error(`Failed to initiate Paystack payment: ${error.message}`);
  }
}

// Initialize checkout for Stripe
async function initializeStripeCheckout(cartItems) {
  const amount = calculateTotalAmount(cartItems); // Calculate total amount
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'rub',
          product_data: {
            name: item.productId.name,
          },
          unit_amount: item.productId.price * 100, // amount in kopecks
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'your_success_url',
      cancel_url: 'your_cancel_url',
    });
    return { id: session.id };
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.initiateCheckoutPayment = async (req, res) => {
  const { id, email } = req.user; // Get user ID and email from request body

  try {
    // Fetch user's cart items from database
    const cart = await Cart.find({ user: id }).populate('productId'); // Find all cart items for the user and populate product details
    if (!cart.length) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const ip_address = await axios.get('https://api.ipify.org?format=json');
    const ip = ip_address.data.ip;
    const auth = '9c94a29d-e92e-4af5-88eb-fb8bfe91faac';
    const url = `https://ipfind.co/?auth=${auth}&ip=${ip}`;

    console.log('Request URL:', url); // Log the request URL

    const response = await axios.get(url);
    const country = response.data.country;

    if (country === 'Nigeria') {
      // Initialize Paystack checkout
      const paystackResponse = await initializePaystackCheckout(
        cart,
        email,
        id,
      );
      return res.json(paystackResponse);
    } else if (country === 'Russia') {
      // Initialize Stripe checkout
      const stripeResponse = await initializeStripeCheckout(cart);
      return res.json(stripeResponse);
    } else {
      return res.status(400).json({ error: 'Unsupported country' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Helper function to calculate total amount based on cart items
function calculateTotalAmount(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0,
  );
}


// add each product to the metadata 
// add each products quantity to the metadata
// add each products total to the metadata
// add payment method to the metadata