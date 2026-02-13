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
  const filter = { isDeleted: false, isActive: true };

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
    if (query.category) {
      const category = await Category.findOne({ slug: query.category });
      if (category) {
        filter.category = category._id;
      } else {
        filter.category = null; // No products will match
      }
    }
    if (query.brand) {
      const brand = await Brand.findOne({ slug: query.brand });
      if (brand) {
        filter.brand = brand._id;
      } else {
        filter.brand = null; // No products will match
      }
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
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isDeleted: false, isActive: true })
    .populate('category', 'name slug')
    .populate('brand', 'name slug');

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }
  return product;
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
  const product = await Product.findByIdAndUpdate({ _id: id, isDeleted: false }, payload, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true }
  );
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }
  return product;
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
