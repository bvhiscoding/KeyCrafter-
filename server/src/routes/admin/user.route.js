const express = require('express');

const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const adminUserController = require('../../controllers/admin/user.controller');
const {
  adminUserQuerySchema,
  adminUpdateUserStatusSchema,
} = require('../../validations/admin-user.validation');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/', validate(adminUserQuerySchema, 'query'), adminUserController.getAllUsers);
router.get('/:id', adminUserController.getUserById);
router.put('/:id/status', validate(adminUpdateUserStatusSchema), adminUserController.updateUserStatus);

module.exports = router;
