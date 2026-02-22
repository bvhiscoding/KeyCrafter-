const HTTP_STATUS = require('../../constants/httpStatus');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const dashboardService = require('../../services/dashboard.service');

const getStats = asyncHandler(async (req, res) => {
  const [overview, ordersByStatus, recentOrders, categoryStats] = await Promise.all([
    dashboardService.getOverviewStats(),
    dashboardService.getOrdersByStatus(),
    dashboardService.getRecentOrders(5),
    dashboardService.getCategoryStats(),
  ]);

  const response = {
    overview,
    ordersByStatus,
    recentOrders,
    categoryStats,
  };

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched dashboard stats'));
});

const getRevenueChart = asyncHandler(async (req, res) => {
  const response = await dashboardService.getRevenueChart(req.query.period);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched revenue chart'));
});

const getTopProducts = asyncHandler(async (req, res) => {
  const response = await dashboardService.getTopProducts(req.query.limit);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched top products'));
});

module.exports = {
  getStats,
  getRevenueChart,
  getTopProducts,
};
