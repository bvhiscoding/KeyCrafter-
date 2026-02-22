const HTTP_STATUS = require('../../constants/httpStatus');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const adminUserService = require('../../services/admin-user.service');

const getAllUsers = asyncHandler(async (req, res) => {
  const response = await adminUserService.getAllUsers(req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched admin users'));
});

const getUserById = asyncHandler(async (req, res) => {
  const response = await adminUserService.getUserById(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched admin user'));
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const response = await adminUserService.updateUserStatus(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Updated user status'));
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
};
