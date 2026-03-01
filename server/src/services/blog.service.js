const Blog = require('../models/blog.model');
const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

// ── Public: list published posts ──────────────────────────────────────────────
const getBlogs = async (query) => {
  const { page = 1, limit = 9, category, tag, search, sort = 'latest', featured } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const filter = { status: 'published' };

  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (featured !== undefined) filter.isFeatured = featured;

  if (search) {
    filter.$text = { $search: search };
  }

  let sortObj = { publishedAt: -1 };
  if (sort === 'oldest') sortObj = { publishedAt: 1 };
  if (sort === 'popular') sortObj = { viewCount: -1, publishedAt: -1 };

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .select('-content -seo')
      .populate('author', 'name avatar')
      .populate('relatedProducts', 'name slug thumbnail price salePrice')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Blog.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ── Public: single post by slug (increments viewCount) ───────────────────────
const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { viewCount: 1 } },
    { new: true },
  )
    .populate('author', 'name avatar')
    .populate('relatedProducts', 'name slug thumbnail price salePrice avgRating');

  if (!blog) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
  }

  return blog;
};

// ── Public: featured posts (for homepage widget) ──────────────────────────────
const getFeaturedBlogs = async (limit = 4) => {
  return Blog.find({ status: 'published', isFeatured: true })
    .select('-content -seo')
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 })
    .limit(Number(limit));
};

// ── Admin: list all posts (any status) ───────────────────────────────────────
const getAdminBlogs = async (query) => {
  const { page = 1, limit = 10, status, category, search, sort = 'latest' } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  let sortObj = { createdAt: -1 };
  if (sort === 'oldest') sortObj = { createdAt: 1 };
  if (sort === 'popular') sortObj = { viewCount: -1, createdAt: -1 };

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .select('-content')
      .populate('author', 'name avatar email')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Blog.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ── User: list own posts ──────────────────────────────────────────────────────
const getMyBlogs = async (userId, query) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    search,
    sort = 'latest',
  } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = { author: userId };

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  let sortObj = { createdAt: -1 };
  if (sort === 'oldest') sortObj = { createdAt: 1 };
  if (sort === 'popular') sortObj = { viewCount: -1, createdAt: -1 };

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .populate('author', 'name avatar')
      .populate('relatedProducts', 'name slug thumbnail price salePrice')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Blog.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ── Admin: single by ID (for edit form) ──────────────────────────────────────
const getAdminBlogById = async (id) => {
  const blog = await Blog.findById(id).populate('author', 'name avatar');
  if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
  return blog;
};

// ── Admin: create ─────────────────────────────────────────────────────────────
const createBlog = async (authorId, data) => {
  const blog = await Blog.create({ ...data, author: authorId });
  return blog;
};

// ── User: create (admin approval required) ───────────────────────────────────
const createUserBlog = async (authorId, data) => {
  const payload = {
    ...data,
    author: authorId,
    status: 'draft',
    isFeatured: false,
    rating: null,
  };

  const blog = await Blog.create(payload);
  return blog;
};

const importBlogs = async (authorId, payload) => {
  const { blogs, clearExisting } = payload;

  if (clearExisting) {
    await Blog.deleteMany({});
  }

  const created = [];
  const failed = [];

  for (const [index, blogData] of blogs.entries()) {
    try {
      const blog = await Blog.create({ ...blogData, author: authorId });
      created.push(blog);
    } catch (error) {
      failed.push({
        index,
        title: blogData.title,
        error: error.message,
      });
    }
  }

  return {
    createdCount: created.length,
    failedCount: failed.length,
    created,
    failed,
  };
};

// ── Admin: update ─────────────────────────────────────────────────────────────
const updateBlog = async (id, data) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');

  Object.assign(blog, data);
  await blog.save();
  return blog;
};

// ── User: update own post before approval ─────────────────────────────────────
const updateMyBlog = async (userId, id, data) => {
  const blog = await Blog.findOne({ _id: id, author: userId });
  if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');

  if (blog.status === 'published') {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      'Published posts cannot be edited by user. Contact admin.',
    );
  }

  const sanitized = { ...data };
  delete sanitized.status;
  delete sanitized.isFeatured;
  delete sanitized.rating;

  Object.assign(blog, sanitized);
  await blog.save();
  return blog;
};

// ── Admin: delete ─────────────────────────────────────────────────────────────
const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
  return blog;
};

// ── Admin: toggle publish ─────────────────────────────────────────────────────
const togglePublish = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');

  blog.status = blog.status === 'published' ? 'draft' : 'published';
  if (blog.status === 'published' && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }
  await blog.save();
  return blog;
};

// ── Admin: approve/reject submitted posts ─────────────────────────────────────
const approveBlog = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');

  blog.status = 'published';
  if (!blog.publishedAt) {
    blog.publishedAt = new Date();
  }
  await blog.save();
  return blog;
};

const rejectBlog = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');

  blog.status = 'archived';
  await blog.save();
  return blog;
};

// ── Public: available categories with post counts ─────────────────────────────
const getCategoryStats = async () => {
  return Blog.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getAdminBlogs,
  getMyBlogs,
  getAdminBlogById,
  createBlog,
  createUserBlog,
  importBlogs,
  updateBlog,
  updateMyBlog,
  deleteBlog,
  togglePublish,
  approveBlog,
  rejectBlog,
  getCategoryStats,
};
