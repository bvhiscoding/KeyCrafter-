const express = require('express');

const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validation.middleware');
const { productListQuerySchema } = require('../validations/product.validation');

const router = express.Router();

router.get('/', validate(productListQuerySchema, 'query'), productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
