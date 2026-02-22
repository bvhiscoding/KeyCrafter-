const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

const checkCanReview = async (userId, productId, orderId) => {
  const filter = {
    user: userId,
    status: 'delivered',
    'items.product': productId,
  };

  if (orderId) {
    filter._id = orderId;
  }

  const deliveredOrder = await Order.findOne(filter);

  if (!deliveredOrder) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'You can only review products from delivered orders',
    );
  }

  return deliveredOrder;
};

const createReview = async (userId, productId, reviewData) => {
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
    isDeleted: false,
  });

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  const order = await checkCanReview(userId, productId, reviewData.orderId);

  try {
    const review = await Review.create({
      product: productId,
      user: userId,
      order: order._id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      images: reviewData.images || [],
    });

    return review;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        'You have already reviewed this product',
      );
    }

    throw error;
  }
};

const getProductReviews = async (productId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    product: productId,
    isApproved: true,
  };

  const [items, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
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

const getUserReviews = async (userId) => Review.find({ user: userId })
  .populate('product', 'name slug thumbnail')
  .sort({ createdAt: -1 });

const updateReview = async (reviewId, userId, reviewData) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });

  if (!review) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Review not found');
  }

  if (typeof reviewData.rating !== 'undefined') {
    review.rating = reviewData.rating;
  }

  if (typeof reviewData.comment !== 'undefined') {
    review.comment = reviewData.comment;
  }

  if (typeof reviewData.images !== 'undefined') {
    review.images = reviewData.images;
  }

  await review.save();
  return review;
};

const deleteReview = async (reviewId, userId) => {
  const deletedReview = await Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  });

  if (!deletedReview) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Review not found');
  }

  return deletedReview;
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  checkCanReview,
};
