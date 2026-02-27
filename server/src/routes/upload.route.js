const express = require('express');
const path = require('path');
const multer = require('multer');
const { protect } = require('../middlewares/auth.middleware');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');

/* ── Multer – disk storage for review images ── */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `review-${req.user._id}-${Date.now()}${ext}`);
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

/**
 * POST /api/upload/review-image
 * Upload up to 3 images for a review.
 * Returns array of URLs accessible at /uploads/<filename>
 */
router.post('/upload/review-image', protect, upload.array('images', 3), (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const urls = (req.files || []).map((f) => `${baseUrl}/uploads/${f.filename}`);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { urls }, 'Images uploaded'));
});

module.exports = router;
