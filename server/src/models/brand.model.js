const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Brand name must be less than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      required: [true, 'Brand logo is required'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description must be less than 500 characters'],
    },
    country: {
      type: String,
      maxlength: [100, 'Country name must be less than 100 characters'],
      default: 'Unknown',
    },
    website: {
      type: String,
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

brandSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brand',
  count: true,
});

// Indexes
brandSchema.index({ isActive: 1 });
brandSchema.index({ isDeleted: 1 });
brandSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});
module.exports = mongoose.model('Brand', brandSchema);
