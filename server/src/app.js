const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes');
const paymentController = require('./controllers/payment.controller');

const app = express();

// Stripe webhook must use raw body
app.post(
  '/api/payments/stripe/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleStripeWebhook
);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api', routes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
