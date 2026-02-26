const Order = require('../models/order.model');
const User = require('../models/user.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');
const stripe = require('../config/stripe');
const orderService = require('./order.service');
const emailService = require('./email.service');

const createCheckoutSession = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
  }

  if (order.status === 'cancelled') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot pay a cancelled order');
  }

  if (order.paymentStatus === 'paid') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Order already paid');
  }

  if (order.discount > 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Stripe checkout does not support manual discount yet',
    );
  }

  const user = await User.findById(userId).select('email');

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: 'vnd',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price),
    },
    quantity: item.quantity,
  }));

  if (order.shippingFee > 0) {
    lineItems.push({
      price_data: {
        currency: 'vnd',
        product_data: {
          name: 'Shipping Fee',
        },
        unit_amount: Math.round(order.shippingFee),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout?cancelled=true&orderId=${order._id}`,
    customer_email: user?.email,
    metadata: {
      orderId: String(order._id),
      userId: String(userId),
    },
  });

  await Order.findByIdAndUpdate(order._id, {
    stripeSessionId: session.id,
    paymentMethod: 'stripe',
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
};

const processSuccessfulPayment = async (session) => {
  const orderId = session?.metadata?.orderId;
  if (!orderId) {
    return null;
  }
  const existingOrder = await Order.findById(orderId);
  if (!existingOrder) {
    return null;
  }
  const wasAlreadyPaid = existingOrder.paymentStatus === 'paid';
  if (!wasAlreadyPaid) {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      ...(session.payment_intent
        ? { stripePaymentIntentId: String(session.payment_intent) }
        : {}),
    });
  }
  let order = await Order.findById(orderId);
  if (!order) {
    return null;
  }
  if (order.status === 'pending') {
    await orderService.updateOrderStatus(
      order._id,
      'confirmed',
      'Auto-confirmed after Stripe payment',
    );
    order = await Order.findById(orderId);
  }
  if (!wasAlreadyPaid) {
    const user = await User.findById(order.user).select('name email');
    if (user?.email) {
      try {
        const emailResult = await emailService.sendPaymentSuccessEmail({ user, order });
        if (emailResult.status !== 'sent') {
          console.warn('[Email] Payment success email was not sent', {
            orderId: String(order._id),
            orderCode: order.orderCode,
            userId: String(order.user),
            email: user.email,
            status: emailResult.status,
            reason: emailResult.reason || emailResult.error,
          });
        }
      } catch (error) {
        console.error('[Email] Payment success email failed with exception', {
          orderId: String(order._id),
          orderCode: order.orderCode,
          userId: String(order.user),
          email: user.email,
          error: error.message,
        });
      }
    }
  }
  return order;
};
const processFailedPayment = async (session) => {
  const orderId = session?.metadata?.orderId;

  if (!orderId) {
    return null;
  }

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: 'failed',
  });

  return Order.findById(orderId);
};

const constructWebhookEvent = (payloadBuffer, signature) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Missing STRIPE_WEBHOOK_SECRET');
  }

  if (!signature) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Missing stripe-signature header');
  }

  try {
    return stripe.webhooks.constructEvent(
      payloadBuffer,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Webhook Error: ${error.message}`);
  }
};

const handleStripeWebhookEvent = async (event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      await processSuccessfulPayment(event.data.object);
      break;
    case 'checkout.session.async_payment_failed':
      await processFailedPayment(event.data.object);
      break;
    default:
      break;
  }
};

module.exports = {
  createCheckoutSession,
  processSuccessfulPayment,
  processFailedPayment,
  constructWebhookEvent,
  handleStripeWebhookEvent,
};
