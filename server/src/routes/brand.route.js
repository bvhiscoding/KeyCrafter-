const express = require('express');

const brandController = require('../controllers/brand.controller');
const validate = require('../middlewares/validation.middleware');
const { brandListQuerySchema } = require('../validations/brand.validation');

const router = express.Router();

router.get('/', validate(brandListQuerySchema, 'query'), brandController.getAllBrands);
router.get('/:slug', brandController.getBrandBySlug);

module.exports = router;
