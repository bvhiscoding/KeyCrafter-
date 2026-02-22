const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

const getProfile = asyncHandler(async (req, res) => {
  const response = await userService.getProfile(req.user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched profile'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const response = await userService.updateProfile(req.user._id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Updated profile'));
});

const changePassword = asyncHandler(async (req, res) => {
  const response = await userService.changePassword(
    req.user._id,
    req.body.currentPassword,
    req.body.newPassword,
  );
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Password changed'));
});

const addAddress = asyncHandler(async (req, res) => {
  const response = await userService.addAddress(req.user._id, req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Address added'));
});

const updateAddress = asyncHandler(async (req, res) => {
  const response = await userService.updateAddress(req.user._id, req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Address updated'));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const response = await userService.deleteAddress(req.user._id, req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Address deleted'));
});

const getWishlist = asyncHandler(async (req, res) => {
  const response = await userService.getWishlist(req.user._id);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched wishlist'));
});

const addToWishlist = asyncHandler(async (req, res) => {
  const response = await userService.addToWishlist(req.user._id, req.params.productId);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Added to wishlist'));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const response = await userService.removeFromWishlist(req.user._id, req.params.productId);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Removed from wishlist'));
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
