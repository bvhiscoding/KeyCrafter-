const express = require('express');
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');

const {
  addToCartSchema,
  updateCartItemSchema,
  mergeGuestCartSchema,
} = require('../validations/cart.validation');

const router = express.Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/', validate(addToCartSchema), cartController.addToCart);
router.put('/:itemId', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:itemId', cartController.removeCartItem);
router.delete('/', cartController.clearCart);
router.post('/merge', validate(mergeGuestCartSchema), cartController.mergeGuestCart);
module.exports = router;
