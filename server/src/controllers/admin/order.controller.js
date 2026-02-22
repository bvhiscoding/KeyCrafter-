const HTTP_STATUS = require('../../constants/httpStatus');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const adminOrderService = require('../../services/admin-order.service');

const getAllOrders = asyncHandler(async (req, res) => {
  const response = await adminOrderService.getAllOrders(req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched admin orders'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const response = await adminOrderService.getOrderById(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched admin order'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const response = await adminOrderService.updateOrderStatus(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Updated order status'));
});

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
