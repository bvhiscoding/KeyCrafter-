const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title must be less than 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt must be less than 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    coverImage: {
      type: String,
      default: null,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    // Blog categories relevant to keyboard community
    category: {
      type: String,
      enum: [
        'review',       // Đánh giá sản phẩm
        'comparison',   // So sánh sản phẩm
        'guide',        // Hướng dẫn
        'news',         // Tin tức
        'keycap',       // Keycap
        'switch',       // Switch
        'keyboard',     // Bàn phím
        'custom',       // Custom build
        'other',        // Khác
      ],
      default: 'other',
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    // Optional product references (for review/comparison posts)
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    // Rating for review-type posts (1-10 scale)
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // SEO metadata
    seo: {
      metaTitle: {
        type: String,
        maxlength: 70,
      },
      metaDescription: {
        type: String,
        maxlength: 160,
      },
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    readTime: {
      type: Number, // estimated minutes
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Indexes ──────────────────────────────────────────────
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ isFeatured: 1, status: 1 });
blogSchema.index(
  { title: 'text', excerpt: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, excerpt: 3, content: 1 } },
);

// ── Slug generation ───────────────────────────────────────
blogSchema.pre('save', async function () {
  if (this.isModified('title')) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    // Ensure uniqueness
    while (await mongoose.model('Blog').exists({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count}`;
      count += 1;
    }
    this.slug = slug;
  }

  // Auto-set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Auto-calculate read time (~200 words/min)
  if (this.isModified('content') && this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

});

// ── Virtuals ──────────────────────────────────────────────
blogSchema.virtual('isPublished').get(function () {
  return this.status === 'published';
});

module.exports = mongoose.model('Blog', blogSchema);
