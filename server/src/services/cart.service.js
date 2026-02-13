const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

const cartPopulate = [
  {
    path: 'items.product',
    select: 'name slug price salePrice stock thumbnail isActive isDeleted',
  },
];

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(cartPopulate);

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate(cartPopulate);
  }

  return cart;
};

const ensureProductAvailable = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  return product;
};

const getCart = async (userId) => getOrCreateCart(userId);

const addToCart = async (userId, productId, quantity = 1) => {
  const product = await ensureProductAvailable(productId);
  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) => String(item.product._id || item.product) === String(productId),
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Insufficient stock');
    }
    existingItem.quantity = newQuantity;
  } else {
    if (quantity > product.stock) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Insufficient stock');
    }
    cart.items.push({
      product: product._id,
      quantity,
      addedAt: new Date(),
    });
  }

  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId }).populate(cartPopulate);

  if (!cart) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Cart item not found');
  }

  const productId = item.product._id || item.product;
  const product = await ensureProductAvailable(productId);

  if (quantity > product.stock) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Insufficient stock');
  }

  item.quantity = quantity;

  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

const removeCartItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId }).populate(cartPopulate);

  if (!cart) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Cart item not found');
  }

  item.deleteOne();
  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

const mergeGuestCart = async (userId, guestCartItems = []) => {
  if (!Array.isArray(guestCartItems) || guestCartItems.length === 0) {
    return getOrCreateCart(userId);
  }

  const cart = await getOrCreateCart(userId);

  const productIds = [...new Set(guestCartItems.map((item) => item.productId))];
  const products = await Product.find({
    _id: { $in: productIds },
    isDeleted: false,
    isActive: true,
  }).select('_id stock');

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  guestCartItems.forEach((guestItem) => {
    const product = productMap.get(String(guestItem.productId));
    if (!product) {
      return;
    }

    const existingItem = cart.items.find(
      (item) => String(item.product._id || item.product) === String(guestItem.productId),
    );

    const desiredQuantity = existingItem
      ? existingItem.quantity + guestItem.quantity
      : guestItem.quantity;

    const finalQuantity = Math.min(desiredQuantity, product.stock);

    if (finalQuantity <= 0) {
      return;
    }

    if (existingItem) {
      existingItem.quantity = finalQuantity;
      return;
    }

    cart.items.push({
      product: product._id,
      quantity: finalQuantity,
      addedAt: new Date(),
    });
  });

  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart,
};
