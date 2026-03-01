const HTTP_STATUS = require('../constants/httpStatus');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const blogService = require('../services/blog.service');

// ── Public ────────────────────────────────────────────────────────────────────

const getBlogs = asyncHandler(async (req, res) => {
  const response = await blogService.getBlogs(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched blogs'));
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  const response = await blogService.getBlogBySlug(req.params.slug);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched blog post'));
});

const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 4;
  const response = await blogService.getFeaturedBlogs(limit);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched featured blogs'));
});

const getCategoryStats = asyncHandler(async (req, res) => {
  const response = await blogService.getCategoryStats();
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched category stats'));
});

// ── User ──────────────────────────────────────────────────────────────────────
const getMyBlogs = asyncHandler(async (req, res) => {
  const response = await blogService.getMyBlogs(req.user._id, req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched my blogs'));
});

const createUserBlog = asyncHandler(async (req, res) => {
  const response = await blogService.createUserBlog(req.user._id, req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Blog submitted for admin approval'));
});

const updateMyBlog = asyncHandler(async (req, res) => {
  const response = await blogService.updateMyBlog(req.user._id, req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'My blog updated'));
});

// ── Admin ─────────────────────────────────────────────────────────────────────

const getAdminBlogs = asyncHandler(async (req, res) => {
  const response = await blogService.getAdminBlogs(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched all blogs'));
});

const getAdminBlogById = asyncHandler(async (req, res) => {
  const response = await blogService.getAdminBlogById(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Fetched blog post'));
});

const createBlog = asyncHandler(async (req, res) => {
  const response = await blogService.createBlog(req.user._id, req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, response, 'Blog post created'));
});

const importBlogs = asyncHandler(async (req, res) => {
  const response = await blogService.importBlogs(req.user._id, req.body);
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, response, 'Blog data imported'),
  );
});

const updateBlog = asyncHandler(async (req, res) => {
  const response = await blogService.updateBlog(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Blog post updated'));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const response = await blogService.deleteBlog(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Blog post deleted'));
});

const togglePublish = asyncHandler(async (req, res) => {
  const response = await blogService.togglePublish(req.params.id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, response, 'Blog publish status toggled'));
});

const approveBlog = asyncHandler(async (req, res) => {
  const response = await blogService.approveBlog(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Blog approved'));
});

const rejectBlog = asyncHandler(async (req, res) => {
  const response = await blogService.rejectBlog(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, 'Blog rejected'));
});

module.exports = {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getCategoryStats,
  getMyBlogs,
  createUserBlog,
  updateMyBlog,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  importBlogs,
  updateBlog,
  deleteBlog,
  togglePublish,
  approveBlog,
  rejectBlog,
};
