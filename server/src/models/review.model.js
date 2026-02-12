const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },

    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [10, 'Comment must be at least 10 characters long'],
      maxlength: [1000, 'Comment must be at most 1000 characters long'],
    },

    images: [
      {
        type: String,
      },
    ],

    isApproved: {
      type: Boolean,
      default: true,
    },

    helpfulCount: {
      type: Number,
      default: 0, //Like useful votes
    },
  },
  {
    timestamps: true,
  }
);

// Ensure each user can only review once per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      avgRating: 0,
      reviewCount: 0,
    });
  }
};

// Middleware to update product ratings after review save
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

// Middleware to update product ratings after review delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
