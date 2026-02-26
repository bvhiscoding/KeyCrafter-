const User = require('../models/user.model');
const emailService = require('./email.service');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');
const { OrderStatusTransitions } = require('../constants/enums');

const calculateOrderTotal = (items, shippingFee = 0, discount = 0) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal + shippingFee - discount;

  return {
    subtotal,
    shippingFee,
    discount,
    total,
  };
};

const createOrder = async (userId, orderData) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name thumbnail images price salePrice stock isActive isDeleted',
  });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cart is empty');
  }

  const orderItems = [];

  cart.items.forEach((cartItem) => {
    const { product } = cartItem;
    if (!product || !product.isActive || product.isDeleted) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Product ${product ? product.name : 'Unknown'} is not available`
      );
    }

    if (cartItem.quantity > product.stock) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Insufficient stock for product: ${product.name}`
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.thumbnail || product.images?.[0] || '',
      price: product.salePrice || product.price,
      quantity: cartItem.quantity,
    });
  });

  const totals = calculateOrderTotal(
    orderItems,
    orderData.shippingFee || 0,
    orderData.discount || 0
  );

  const order = await Order.create({
    user: userId,
    items: orderItems,
    ...totals,
    paymentMethod: orderData.paymentMethod,
    shippingAddress: orderData.shippingAddress,
    note: orderData.note,
    status: 'pending',
    paymentStatus: 'pending',
  });

  cart.items = [];
  await cart.save();

  const user = await User.findById(userId).select('email name');
  if (user?.email) {
    try {
      const emailResult = await emailService.sendOrderCreatedEmail({ user, order });
      if (emailResult.status !== 'sent') {
        console.warn('[Email] Order created email was not sent', {
          orderId: String(order._id),
          orderCode: order.orderCode,
          userId: String(userId),
          email: user.email,
          status: emailResult.status,
          reason: emailResult.reason || emailResult.error,
        });
      }
    } catch (error) {
      console.error('[Email] Order created email failed with exception', {
        orderId: String(order._id),
        orderCode: order.orderCode,
        userId: String(userId),
        email: user.email,
        error: error.message,
      });
    }
  }

  return order;
};

const getOrders = async (userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = { user: userId };

  if (query.status) {
    filter.status = query.status;
  }

  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate({
    path: 'items.product',
    select: 'name slug thumbnail',
  });
  if (!order) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
  }

  return order;
};

const deductStockForOrder = async (order) => {
  const updateResults = await Promise.all(
    order.items.map((item) =>
      Product.findOneAndUpdate(
        {
          _id: item.product,
          isDeleted: false,
          isActive: true,
          stock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity } },
        { returnDocument: 'after' }
      )
    )
  );

  const failedIndex = updateResults.findIndex((result) => !result);

  if (failedIndex !== -1) {
    const deductedItems = order.items.filter((_, index) => Boolean(updateResults[index]));

    await Promise.all(
      deductedItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        })
      )
    );

    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Insufficient stock for order item: ${order.items[failedIndex].name}`
    );
  }
};

const restoreStockForOrder = async (order) => {
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      })
    )
  );
};

const updateOrderStatus = async (orderId, status, note) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
  }

  if (order.status === status) {
    return order;
  }

  const allowedTransitions = OrderStatusTransitions[order.status] || [];
  if (!allowedTransitions.includes(status)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Invalid status transition from ${order.status} to ${status}`
    );
  }

  const statesWithoutStock = ['pending', 'cancelled'];
  const statesWithStock = ['confirmed', 'processing', 'shipped', 'delivered'];

  const needsStockDeduction =
    statesWithoutStock.includes(order.status) && statesWithStock.includes(status);
  if (needsStockDeduction) {
    await deductStockForOrder(order);
  }

  const needsStockRestore =
    statesWithStock.includes(order.status) && statesWithoutStock.includes(status);
  if (needsStockRestore) {
    await restoreStockForOrder(order);
  }

  if (status === 'delivered') {
    if (order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
    }
    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { soldCount: item.quantity },
        })
      )
    );
  }

  order.status = status;
  order.$locals.statusNote = note;
  await order.save();
  return order;
};

const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
  }

  if (order.status === 'cancelled') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Order already cancelled');
  }

  const cancelledOrder = await updateOrderStatus(order._id, 'cancelled', 'Cancelled by customer');

  const user = await User.findById(userId).select('name email');
  if (user?.email) {
    try {
      const emailResult = await emailService.sendOrderCancelledEmail({
        user,
        order: cancelledOrder,
      });
      if (emailResult.status !== 'sent') {
        console.warn('[Email] Order cancelled email was not sent', {
          orderId: String(cancelledOrder._id),
          orderCode: cancelledOrder.orderCode,
          userId: String(userId),
          email: user.email,
          status: emailResult.status,
          reason: emailResult.reason || emailResult.error,
        });
      }
    } catch (error) {
      console.error('[Email] Order cancelled email failed with exception', {
        orderId: String(cancelledOrder._id),
        orderCode: cancelledOrder.orderCode,
        userId: String(userId),
        email: user.email,
        error: error.message,
      });
    }
  }

  return cancelledOrder;
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  calculateOrderTotal,
};
