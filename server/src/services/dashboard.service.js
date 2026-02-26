const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');

const getDateFromPeriod = (period) => {
  const now = new Date();
  const date = new Date(now);

  const map = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '365d': 365,
  };

  const days = map[period] || 30;
  date.setDate(now.getDate() - days);
  date.setHours(0, 0, 0, 0);

  return date;
};

const getOverviewStats = async () => {
  const [orderAgg, totalOrders, totalUsers, totalProducts] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          $or: [{ paymentStatus: 'paid' }, { status: 'delivered' }],
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
        },
      },
    ]),
    Order.countDocuments(),
    User.countDocuments(),
    Product.countDocuments({ isDeleted: false }),
  ]);

  return {
    totalRevenue: orderAgg[0]?.totalRevenue || 0,
    totalOrders,
    totalUsers,
    totalProducts,
  };
};

const getRevenueChart = async (period) => {
  const dateFrom = getDateFromPeriod(period);

  const revenue = await Order.aggregate([
    {
      $match: {
        $or: [
          { paymentStatus: 'paid' },
          { status: 'delivered' }
        ],
        status: { $ne: 'cancelled' },
        createdAt: { $gte: dateFrom },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  return revenue.map((item) => ({
    date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
    revenue: item.revenue,
    orders: item.orders,
  }));
};

const getTopProducts = async (limit = 5) =>
  Product.find({ isDeleted: false })
    .select('name slug thumbnail soldCount avgRating price salePrice stock')
    .sort({ soldCount: -1, avgRating: -1 })
    .limit(Number(limit));

const getOrdersByStatus = async () => {
  const grouped = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const map = {};
  grouped.forEach((item) => {
    map[item._id] = item.count;
  });

  return map;
};

const getRecentOrders = async (limit = 5) =>
  Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(Number(limit));

const getCategoryStats = async () =>
  Category.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products',
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
        productCount: {
          $size: {
            $filter: {
              input: '$products',
              as: 'product',
              cond: {
                $and: [
                  { $eq: ['$$product.isDeleted', false] },
                  { $eq: ['$$product.isActive', true] },
                ],
              },
            },
          },
        },
      },
    },
    { $sort: { productCount: -1 } },
  ]);

module.exports = {
  getOverviewStats,
  getRevenueChart,
  getTopProducts,
  getOrdersByStatus,
  getRecentOrders,
  getCategoryStats,
};
