const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('../config/database');
const Product = require('../models/product.model');
const Review = require('../models/review.model');
const { uploadImageFromPath } = require('../services/cloudinary-upload.service');
const { isCloudinaryConfigured } = require('../config/cloudinary');

const normalizeUploadFilename = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const marker = '/uploads/';
  const markerIndex = value.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const start = markerIndex + marker.length;
  const afterMarker = value.slice(start);
  const [withoutQuery] = afterMarker.split(/[?#]/);
  const decoded = decodeURIComponent(withoutQuery || '');
  const safeName = path.basename(decoded);

  return safeName || null;
};

const localFilePathFromUrl = (urlValue) => {
  const fileName = normalizeUploadFilename(urlValue);
  if (!fileName) {
    return null;
  }

  return path.join(__dirname, '../../public/uploads', fileName);
};

const migrateUrl = async (urlValue, folder, uploadedMap, stats) => {
  const localPath = localFilePathFromUrl(urlValue);

  if (!localPath) {
    return urlValue;
  }

  if (uploadedMap.has(urlValue)) {
    stats.reused += 1;
    return uploadedMap.get(urlValue);
  }

  try {
    const result = await uploadImageFromPath(localPath, { folder });

    if (!result?.secure_url) {
      stats.skipped += 1;
      return urlValue;
    }

    uploadedMap.set(urlValue, result.secure_url);
    stats.uploaded += 1;
    return result.secure_url;
  } catch (error) {
    stats.errors += 1;
    return urlValue;
  }
};

const migrateProductImages = async (uploadedMap, stats) => {
  const products = await Product.find({
    $or: [
      { images: { $elemMatch: { $regex: '/uploads/' } } },
      { thumbnail: { $regex: '/uploads/' } },
    ],
  });

  for (const product of products) {
    let changed = false;

    if (Array.isArray(product.images) && product.images.length) {
      const nextImages = [];

      for (const imageUrl of product.images) {
        const migrated = await migrateUrl(
          imageUrl,
          `keycrafter/migration/products/${product._id}`,
          uploadedMap,
          stats,
        );
        nextImages.push(migrated);

        if (migrated !== imageUrl) {
          changed = true;
        }
      }

      product.images = nextImages;
    }

    if (typeof product.thumbnail === 'string') {
      const migratedThumbnail = await migrateUrl(
        product.thumbnail,
        `keycrafter/migration/products/${product._id}`,
        uploadedMap,
        stats,
      );

      if (migratedThumbnail !== product.thumbnail) {
        changed = true;
        product.thumbnail = migratedThumbnail;
      }
    }

    if (changed) {
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            images: product.images,
            thumbnail: product.thumbnail,
          },
        },
      );
      stats.productDocsUpdated += 1;
    }
  }
};

const migrateReviewImages = async (uploadedMap, stats) => {
  const reviews = await Review.find({ images: { $elemMatch: { $regex: '/uploads/' } } });

  for (const review of reviews) {
    if (!Array.isArray(review.images) || !review.images.length) {
      continue;
    }

    let changed = false;
    const nextImages = [];

    for (const imageUrl of review.images) {
      const migrated = await migrateUrl(
        imageUrl,
        `keycrafter/migration/reviews/${review._id}`,
        uploadedMap,
        stats,
      );
      nextImages.push(migrated);

      if (migrated !== imageUrl) {
        changed = true;
      }
    }

    if (changed) {
      await Review.updateOne(
        { _id: review._id },
        {
          $set: {
            images: nextImages,
          },
        },
      );
      stats.reviewDocsUpdated += 1;
    }
  }
};

const main = async () => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Check .env variables.');
  }

  await connectDB();

  const uploadedMap = new Map();
  const stats = {
    uploaded: 0,
    reused: 0,
    skipped: 0,
    errors: 0,
    productDocsUpdated: 0,
    reviewDocsUpdated: 0,
  };

  await migrateProductImages(uploadedMap, stats);
  await migrateReviewImages(uploadedMap, stats);

  console.log('Migration completed:', stats);
};

main()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
