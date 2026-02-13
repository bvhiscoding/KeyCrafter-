const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const categoryService = require('../services/category.service');

const getAllCategories = asyncHandler(async (req, res) => {
  const response = await categoryService.getAllCategories();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched categories'));
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const response = await categoryService.getCategoryBySlug(req.params.slug);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched category'));
});
const createCategory = asyncHandler(async (req, res) => {
  const response = await categoryService.createCategory(req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Category created'));
});

const updateCategory = asyncHandler(async (req, res) => {
  const response = await categoryService.updateCategory(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Category updated'));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const response = await categoryService.deleteCategory(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Category deleted'));
});
module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
