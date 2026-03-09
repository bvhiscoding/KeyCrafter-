const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes');
const paymentController = require('./controllers/payment.controller');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

const normalizeOrigin = (origin) => (origin || '').trim().replace(/\/$/, '');

const buildOriginRegex = (pattern) => {
  const normalizedPattern = normalizeOrigin(pattern);

  if (!normalizedPattern) {
    return null;
  }

  const escapedPattern = normalizedPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`^${escapedPattern.replace(/\*/g, '.*')}$`);
};

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || '').split(','),
  process.env.LOCAL_CLIENT_URL,
  'http://localhost:5174',
]
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const localhostOriginPatterns = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];

const envOriginPatterns = (process.env.CLIENT_URL_PATTERNS || '')
  .split(',')
  .map((pattern) => buildOriginRegex(pattern))
  .filter(Boolean);

const vercelPreviewPatterns = allowedOrigins
  .map((origin) => {
    const match = origin.match(/^(https:\/\/.+-)[a-z0-9]+(\.vercel\.app)$/i);

    if (!match) {
      return null;
    }

    const escapedPrefix = match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedSuffix = match[2].replace('.', '\\.');

    return new RegExp(`^${escapedPrefix}[a-z0-9]+${escapedSuffix}$`, 'i');
  })
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    const normalizedOrigin = normalizeOrigin(origin);
    const isAllowedByPattern = [
      ...localhostOriginPatterns,
      ...envOriginPatterns,
      ...vercelPreviewPatterns,
    ].some((pattern) => pattern.test(normalizedOrigin));

    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin) || isAllowedByPattern) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
};

// Stripe webhook must use raw body
app.post(
  '/api/payments/stripe/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleStripeWebhook
);

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting middleware globally
app.use(globalLimiter);

// Serve uploaded images - set Cross-Origin-Resource-Policy: cross-origin
// so the frontend (different port in dev) can load images via <img> tags.
// helmet() defaults to 'same-origin' which blocks cross-origin embedding.
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '../public/uploads'))
);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api', routes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
