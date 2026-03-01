const Joi = require('joi');

const BLOG_CATEGORIES = [
  'review',
  'comparison',
  'guide',
  'news',
  'keycap',
  'switch',
  'keyboard',
  'custom',
  'other',
];

const BLOG_STATUSES = ['draft', 'published', 'archived'];

const createBlogSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required(),
  excerpt: Joi.string().trim().max(500).allow('', null),
  content: Joi.string().trim().required(),
  coverImage: Joi.string().allow('', null),
  category: Joi.string()
    .valid(...BLOG_CATEGORIES)
    .default('other'),
  tags: Joi.array().items(Joi.string().lowercase().trim()).max(10).default([]),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)).max(10).default([]),
  rating: Joi.number().min(1).max(10).allow(null),
  status: Joi.string().valid(...BLOG_STATUSES).default('draft'),
  isFeatured: Joi.boolean().default(false),
  seo: Joi.object({
    metaTitle: Joi.string().trim().max(70).allow('', null),
    metaDescription: Joi.string().trim().max(160).allow('', null),
  }).default({}),
});

const createUserBlogSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required(),
  excerpt: Joi.string().trim().max(500).allow('', null),
  content: Joi.string().trim().required(),
  coverImage: Joi.string().allow('', null),
  category: Joi.string()
    .valid(...BLOG_CATEGORIES)
    .default('other'),
  tags: Joi.array().items(Joi.string().lowercase().trim()).max(10).default([]),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)).max(10).default([]),
  seo: Joi.object({
    metaTitle: Joi.string().trim().max(70).allow('', null),
    metaDescription: Joi.string().trim().max(160).allow('', null),
  }).default({}),
});

const importBlogsSchema = Joi.object({
  blogs: Joi.array().items(createBlogSchema).min(1).max(200).required(),
  clearExisting: Joi.boolean().default(false),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200),
  excerpt: Joi.string().trim().max(500).allow('', null),
  content: Joi.string().trim(),
  coverImage: Joi.string().allow('', null),
  category: Joi.string().valid(...BLOG_CATEGORIES),
  tags: Joi.array().items(Joi.string().lowercase().trim()).max(10),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)).max(10),
  rating: Joi.number().min(1).max(10).allow(null),
  status: Joi.string().valid(...BLOG_STATUSES),
  isFeatured: Joi.boolean(),
  seo: Joi.object({
    metaTitle: Joi.string().trim().max(70).allow('', null),
    metaDescription: Joi.string().trim().max(160).allow('', null),
  }),
}).min(1);

const updateUserBlogSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200),
  excerpt: Joi.string().trim().max(500).allow('', null),
  content: Joi.string().trim(),
  coverImage: Joi.string().allow('', null),
  category: Joi.string().valid(...BLOG_CATEGORIES),
  tags: Joi.array().items(Joi.string().lowercase().trim()).max(10),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)).max(10),
  seo: Joi.object({
    metaTitle: Joi.string().trim().max(70).allow('', null),
    metaDescription: Joi.string().trim().max(160).allow('', null),
  }),
}).min(1);

const blogQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(9),
  category: Joi.string().valid(...BLOG_CATEGORIES),
  tag: Joi.string().trim().lowercase(),
  search: Joi.string().trim().max(100),
  sort: Joi.string().valid('latest', 'oldest', 'popular').default('latest'),
  featured: Joi.boolean(),
});

const adminBlogQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid(...BLOG_STATUSES),
  category: Joi.string().valid(...BLOG_CATEGORIES),
  search: Joi.string().trim().max(100),
  sort: Joi.string().valid('latest', 'oldest', 'popular').default('latest'),
});

const myBlogQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid(...BLOG_STATUSES),
  category: Joi.string().valid(...BLOG_CATEGORIES),
  search: Joi.string().trim().max(100),
  sort: Joi.string().valid('latest', 'oldest', 'popular').default('latest'),
});

module.exports = {
  createBlogSchema,
  createUserBlogSchema,
  updateBlogSchema,
  updateUserBlogSchema,
  importBlogsSchema,
  blogQuerySchema,
  adminBlogQuerySchema,
  myBlogQuerySchema,
};
