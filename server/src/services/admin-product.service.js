const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

const sortMap = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating_desc: { avgRating: -1 },
  best_selling: { soldCount: -1 },
};

const getAllProducts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) {
      filter.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.category) {
    const category = await Category.findOne({ slug: query.category }).select('_id');
    filter.category = category ? category._id : null;
  }

  if (query.brand) {
    const brand = await Brand.findOne({ slug: query.brand }).select('_id');
    filter.brand = brand ? brand._id : null;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  if (query.isDeleted !== undefined) {
    filter.isDeleted = query.isDeleted;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort(sortMap[query.sort] || sortMap.newest)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const createProduct = async (payload) => {
  const [category, brand] = await Promise.all([
    Category.findOne({ _id: payload.category, isDeleted: false }),
    Brand.findOne({ _id: payload.brand, isDeleted: false }),
  ]);

  if (!category) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid category');
  }

  if (!brand) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid brand');
  }

  return Product.create(payload);
};

const updateProduct = async (id, payload) => {
  if (payload.category) {
    const category = await Category.findOne({ _id: payload.category, isDeleted: false });
    if (!category) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid category');
    }
  }

  if (payload.brand) {
    const brand = await Brand.findOne({ _id: payload.brand, isDeleted: false });
    if (!brand) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid brand');
    }
  }

  const product = await Product.findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { returnDocument: 'after' },
  );

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  return product;
};

const uploadProductImages = async (id, payload) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  const images = payload.images || [];
  const thumbnail = payload.thumbnail || images[0] || product.thumbnail;

  if (!thumbnail) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Thumbnail is required');
  }

  product.images = images;
  product.thumbnail = thumbnail;
  await product.save();

  return product;
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
};
