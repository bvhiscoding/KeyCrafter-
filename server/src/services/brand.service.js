const Brand = require('../models/brand.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

const getAllBrands = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = { isDeleted: false };

  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }
  const [items, total] = await Promise.all([
    Brand.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Brand.countDocuments(filter),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getBrandBySlug = async (slug) => {
  const brand = await Brand.findOne({ slug, isDeleted: false });
  if (!brand) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Brand not found');
  }
  return brand;
};

const createBrand = async (payload) => {
  return Brand.create(payload);
};

const updateBrand = async (id, payload) => {
  const brand = await Brand.findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
    new: true,
    runValidators: true,
  });
  if (!brand) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Brand not found');
  }
  return brand;
};
const deleteBrand = async (id) => {
  const brand = await Brand.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true }
  );
  if (!brand) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Brand not found');
  return brand;
};
module.exports = {
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
};
