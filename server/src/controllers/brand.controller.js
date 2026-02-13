const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const brandService = require('../services/brand.service');

const getAllBrands = asyncHandler(async (req, res) => {
  const response = await brandService.getAllBrands();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched brands'));
});

const getBrandBySlug = asyncHandler(async (req, res) => {
  const response = await brandService.getBrandBySlug(req.params.slug);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched brand'));
});

const createBrand = asyncHandler(async (req, res) => {
  const response = await brandService.createBrand(req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Brand created'));
});

const updateBrand = asyncHandler(async (req, res) => {
  const response = await brandService.updateBrand(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Brand updated'));
});

const deleteBrand = asyncHandler(async (req, res) => {
  const response = await brandService.deleteBrand(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Brand deleted'));
});
module.exports = {
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
};
