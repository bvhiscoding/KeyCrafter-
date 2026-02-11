const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [100, 'Category name must be at most 100 characters long'],
        unique: true,
    },
    slug:{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [100, 'Slug must be at most 100 characters long'],
        unique: true,
    },
    description:{
        type: String,
        trim: true,
        maxlength: [500, 'Description must be at most 500 characters long'],
    },
    icon:{
        type: String,
        trim: true,
        default: 'package',
    },
    image:{
        type: String,
        trim: true,
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

categorySchema.virtual('products',{
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    count: true,
})

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ isActive: 1, order: 1 });


// Auto generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});