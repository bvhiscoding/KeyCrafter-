const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/product.service');

const getAllProducts = asyncHandler(async (req, res) => {
  const response = await productService.getAllProducts();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched products'));
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const response = await productService.getProductBySlug(req.params.slug);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched product'));
});

const createProduct = asyncHandler(async (req, res) => {
  const response = await productService.createProduct(req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Product created'));
});
const updateProduct = asyncHandler(async (req, res) => {
  const response = await productService.updateProduct(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Product updated'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const response = await productService.deleteProduct(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Product deleted'));
});
module.exports = {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
