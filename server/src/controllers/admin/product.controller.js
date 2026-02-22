const HTTP_STATUS = require('../../constants/httpStatus');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const adminProductService = require('../../services/admin-product.service');

const getAllProducts = asyncHandler(async (req, res) => {
  const response = await adminProductService.getAllProducts(req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched admin products'));
});

const createProduct = asyncHandler(async (req, res) => {
  const response = await adminProductService.createProduct(req.body);

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Product created'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const response = await adminProductService.updateProduct(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Product updated'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const response = await adminProductService.deleteProduct(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Product deleted'));
});

const uploadProductImages = asyncHandler(async (req, res) => {
  const response = await adminProductService.uploadProductImages(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Product images updated'));
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
};
