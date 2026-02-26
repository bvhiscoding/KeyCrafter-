const express = require('express');
const path = require('path');
const multer = require('multer');

const productController = require('../../controllers/admin/product.controller');
const validate = require('../../middlewares/validation.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');
const {
  createProductSchema,
  updateProductSchema,
} = require('../../validations/product.validation');
const { adminProductListQuerySchema } = require('../../validations/admin-product.validation');

/* ── Multer – disk storage ── */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../../public/uploads'));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `product-${req.params.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(req, file, cb) {
    if (/image\/(jpeg|png|webp|gif)/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/', validate(adminProductListQuerySchema, 'query'), productController.getAllProducts);
router.post('/', validate(createProductSchema), productController.createProduct);
router.put('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/upload', upload.single('image'), productController.uploadProductImages);

module.exports = router;
