const Category = require('../models/category.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

const getAllCategories = async (query) => {
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
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);
  return {
    items,
    pagination: {
      page, limit, total, totalPages: Math.ceil(total / limit),
    },
  };
};

const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, isDeleted: false });
  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  }
  return category;
};

const createCategory = async (payload) => Category.create(payload);

const updateCategory = async (id, payload) => {
  const category = await Category.findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  }
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true },
  );

  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  }
  return category;
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
