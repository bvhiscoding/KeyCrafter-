const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name must be less than 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description must be less than 1000 characters'],
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description must be less than 300 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    salePrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || value < this.price;
        },
        message: 'Sale price must be less than the regular price',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock must be a positive number'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Product brand is required'],
    },
    images: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: [true, 'Product thumbnail is required'],
    },
    soundTestUrl: {
      type: String,
    },
    specs: {
      // Common specs
      material: String,
      weight: String,
      dimensions: String,

      // Switch-specific specs
      type: {
        type: String,
        enum: ['linear', 'tactile', 'clicky', null],
      },
      actuationForce: String, // e.g., "55g"
      bottomOutForce: String, // e.g., "65g"
      travelDistance: String, // e.g., "4mm"
      actuationPoint: String, // e.g., "2mm"
      pins: String, // e.g., "5-pin" or "3-pin"
      factoryLubed: Boolean,

      // Keycap-specific specs
      profile: String, // e.g., "Cherry", "SA", "OEM"
      legends: String, // e.g., "Doubleshot", "Dye-sub"
      compatibility: String, // e.g., "MX-style switches"

      // Keyboard kit specs
      layout: String, // e.g., "65%", "75%", "TKL"
      hotswap: Boolean,
      rgb: Boolean,
      connectivity: String, // e.g., "Wired", "Wireless", "Both"
      battery: String,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: true,
    },

    soldCount: {
      type: Number,
      default: 0,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'specs.type': 1 });
productSchema.index({ isActive: 1, isDeleted: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ avgRating: -1 });

// Text index for search
productSchema.index(
  {
    name: 'text',
    description: 'text',
    tags: 'text',
  },
  {
    weights: { name: 10, tags: 5, description: 1 },
  }
);

// Compound indexes
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, 'specs.type': 1, price: 1 });

// Tính phần trăm giảm giá
productSchema.virtual('discountPercent').get(function () {
  if (this.salePrice && this.price > 0) {
    return Math.round((1 - this.salePrice / this.price) * 100);
  }
  return 0;
});

// Giá hiển thị (salePrice nếu có, không thì price)
productSchema.virtual('displayPrice').get(function () {
  return this.salePrice || this.price;
});

// Check còn hàng
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});
