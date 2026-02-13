const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const orderService = require('../services/order.service');

const createOrder = asyncHandler(async (req, res) => {
  const response = await orderService.createOrder(req.user._id, req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Order created'));
});
const getOrders = asyncHandler(async (req, res) => {
  const response = await orderService.getOrders(req.user._id, req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched orders'));
});
const getOrderById = asyncHandler(async (req, res) => {
  const response = await orderService.getOrderById(req.user._id, req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched order'));
});
const cancelOrder = asyncHandler(async (req, res) => {
  const response = await orderService.cancelOrder(req.user._id, req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Order cancelled'));
});
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
};
