const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const cartService = require('../services/cart.service');

const getCart = asyncHandler(async (req, res) => {
  const response = await cartService.getCart(req.user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched cart'));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const response = await cartService.addToCart(req.user._id, productId, quantity);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Added to cart'));
});
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const response = await cartService.updateCartItem(req.user._id, req.params.itemId, quantity);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Updated cart item'));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const response = await cartService.removeCartItem(req.user._id, req.params.itemId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Removed cart item'));
});
const clearCart = asyncHandler(async (req, res) => {
  const response = await cartService.clearCart(req.user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Cleared cart'));
});
const mergeGuestCart = asyncHandler(async (req, res) => {
  const response = await cartService.mergeGuestCart(req.user._id, req.body.items);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Merged guest cart'));
});
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart,
};
