const User = require('../models/user.model');
const Product = require('../models/product.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

const WISHLIST_POPULATE = {
  path: 'wishlist',
  select: 'name slug thumbnail price salePrice stock isActive isDeleted',
};

const safeUserSelect = '-password -refreshToken -passwordResetToken -passwordResetExpires';

const getProfile = async (userId) => {
  const user = await User.findById(userId).select(safeUserSelect);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateProfile = async (userId, payload) => {
  const updateData = {};
  if (typeof payload.name !== 'undefined') updateData.name = payload.name;
  if (typeof payload.phone !== 'undefined') updateData.phone = payload.phone;
  if (typeof payload.avatar !== 'undefined') updateData.avatar = payload.avatar;
  const user = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: 'after',
    runValidators: true,
  }).select(safeUserSelect);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password +refreshToken');
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Current password is incorrect');
  }
  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();
  return { changed: true };
};

const normalizeDefaultAddress = (addresses, defaultId) => {
  addresses.forEach((item) => {
    item.set('isDefault', String(item._id) === String(defaultId));
  });
};

const addAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  const newAddress = {
    ...addressData,
  };
  user.addresses.push(newAddress);
  const createdAddress = user.addresses[user.addresses.length - 1];
  if (addressData.isDefault || user.addresses.length === 1) {
    normalizeDefaultAddress(user.addresses, createdAddress._id);
  }
  await user.save();
  return user.addresses;
};
const updateAddress = async (userId, addressId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  const address = user.addresses.id(addressId);
  if (!address) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Address not found');
  if (typeof addressData.label !== 'undefined') address.label = addressData.label;
  if (typeof addressData.name !== 'undefined') address.name = addressData.name;
  if (typeof addressData.address !== 'undefined') address.address = addressData.address;
  if (typeof addressData.ward !== 'undefined') address.ward = addressData.ward;
  if (typeof addressData.district !== 'undefined') address.district = addressData.district;
  if (typeof addressData.city !== 'undefined') address.city = addressData.city;
  if (typeof addressData.phone !== 'undefined') address.phone = addressData.phone;
  if (addressData.isDefault === true) {
    normalizeDefaultAddress(user.addresses, address._id);
  }
  await user.save();
  return user.addresses;
};
const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  const address = user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Address not found');
  }
  const wasDefault = Boolean(address.isDefault);
  user.addresses.pull(addressId);
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
    normalizeDefaultAddress(user.addresses, user.addresses[0]._id);
  }
  await user.save();
  return user.addresses;
};
const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate(WISHLIST_POPULATE);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  const items = (user.wishlist || []).filter((item) => item && item.isActive && !item.isDeleted);
  return items;
};

const addToWishlist = async (userId, productId) => {
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
    isDeleted: false,
  });
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: productId } },
    { returnDocument: 'after' },
  ).populate(WISHLIST_POPULATE);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  const items = (user.wishlist || []).filter((item) => item && item.isActive && !item.isDeleted);
  return items;
};

const removeFromWishlist = async (userId, productId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    { returnDocument: 'after' },
  ).populate(WISHLIST_POPULATE);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  const items = (user.wishlist || []).filter((item) => item && item.isActive && !item.isDeleted);
  return items;
};

const checkInWishlist = async (userId, productId) => {
  const user = await User.findOne({ _id: userId, wishlist: productId }).select('_id');
  return Boolean(user);
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkInWishlist,
};
