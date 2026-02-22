const express = require('express');

const brandController = require('../../controllers/admin/brand.controller');
const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const {
  createBrandSchema,
  updateBrandSchema,
  brandListQuerySchema,
} = require('../../validations/brand.validation');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/', validate(brandListQuerySchema, 'query'), brandController.getAllBrands);
router.post('/', validate(createBrandSchema), brandController.createBrand);
router.put('/:id', validate(updateBrandSchema), brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
