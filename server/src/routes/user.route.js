const express = require('express');
const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const {
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
} = require('../validations/user.validation');

const router = express.Router();

router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.put('/change-password', validate(changePasswordSchema), userController.changePassword);
router.post('/addresses', validate(addressSchema), userController.addAddress);
router.put('/addresses/:id', validate(addressSchema), userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:productId', userController.addToWishlist);
router.delete('/wishlist/:productId', userController.removeFromWishlist);

module.exports = router;
