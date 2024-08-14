const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shippingAddressRoutes = require('./routes/shippingAddressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const supportRoutes = require('./routes/supportRoutes');
const viewsRoutes = require('./routes/viewsRoutes');

const app = express();
app.set('view engine', 'ejs');

if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
}

app.set('views', path.join(__dirname, 'views'));

// limiting the amount of requests from an IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this Ip, please try again in an hour!',
});

app.use('/api', limiter);

// limiting the amount of data that is parsed in body-parser by adding size in kb
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// DATA SANITIZATION
app.use(mongoSanitize());

app.use(express.static('./public'));

// routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/shipping-address', shippingAddressRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/supports', supportRoutes);
app.use('/', viewsRoutes);

module.exports = app;
