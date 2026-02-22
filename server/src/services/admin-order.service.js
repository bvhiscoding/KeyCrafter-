const Order = require('../models/order.model');
const User = require('../models/user.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');
const orderService = require('./order.service');

const getAllOrders = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  if (query.search) {
    const users = await User.find({ email: { $regex: query.search, $options: 'i' } }).select('_id');
    const userIds = users.map((user) => user._id);

    filter.$or = [
      { orderCode: { $regex: query.search, $options: 'i' } },
      { user: { $in: userIds } },
    ];
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
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

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email phone')
    .populate('items.product', 'name slug thumbnail');

  if (!order) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
  }

  return order;
};

const updateOrderStatus = async (orderId, payload) => orderService.updateOrderStatus(
  orderId,
  payload.status,
  payload.note,
);

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
