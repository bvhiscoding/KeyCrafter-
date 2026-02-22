const express = require('express');

const productController = require('../../controllers/admin/product.controller');
const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const {
  createProductSchema,
  updateProductSchema,
} = require('../../validations/product.validation');
const {
  adminProductListQuerySchema,
  adminProductUploadSchema,
} = require('../../validations/admin-product.validation');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/', validate(adminProductListQuerySchema, 'query'), productController.getAllProducts);
router.post('/', validate(createProductSchema), productController.createProduct);
router.put('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/upload', validate(adminProductUploadSchema), productController.uploadProductImages);

module.exports = router;
