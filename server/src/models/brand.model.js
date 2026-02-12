const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
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
  website:{
    type: String,
  },
  isActive:{
    type: Boolean,
    default: true,
  }
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


brandSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brand',
  count: true
});

// Indexes
brandSchema.index({ slug: 1 }, { unique: true });
brandSchema.index({ isActive: 1 });
brandSchema.index({ name: 1 });

module.exports = mongoose.model('Brand', brandSchema);