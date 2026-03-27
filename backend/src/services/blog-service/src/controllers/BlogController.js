import { asyncHandler, ApiResponse } from "../../../../shared/utils/helpers.js";
import BlogService from "../services/BlogService.js";

export const getAllBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isVip } = req.query;
  const filter = {};

  if (isVip === "true") filter.isVip = true;

  const result = await BlogService.getAllBlogs(page, limit, filter);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Lấy danh sách bài viết thành công"));
});

export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await BlogService.getBlogById(id);

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Lấy chi tiết bài viết thành công"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const blog = await BlogService.getBlogBySlug(slug);

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Lấy chi tiết bài viết thành công"));
});

export const getVipBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await BlogService.getVipBlogs(page, limit);

  res
    .status(200)
    .json(
      new ApiResponse(200, result, "Lấy danh sách bài viết VIP thành công")
    );
});

export const searchBlogs = asyncHandler(async (req, res) => {
  const { keyword, page = 1, limit = 10 } = req.query;

  if (!keyword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Vui lòng cung cấp từ khóa tìm kiếm"));
  }

  const result = await BlogService.searchBlogs(keyword, page, limit);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Tìm kiếm bài viết thành công"));
});

export const getPopularBlogs = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  const blogs = await BlogService.getPopularBlogs(limit);

  res
    .status(200)
    .json(
      new ApiResponse(200, blogs, "Lấy danh sách bài viết nổi bật thành công")
    );
});

export const getPendingBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await BlogService.getBlogsByStatus("pending", page, limit);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Lấy danh sách bài viết chờ duyệt thành công"
      )
    );
});

export const updateBlogStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["published", "archived", "draft", "pending"].includes(status)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Trạng thái không hợp lệ"));
  }

  const blog = await BlogService.updateBlogStatus(id, status);

  res
    .status(200)
    .json(
      new ApiResponse(200, blog, "Cập nhật trạng thái bài viết thành công")
    );
});

export const createBlog = asyncHandler(async (req, res) => {
  // Any authenticated user can create a blog post; new posts are created with status 'pending'
  const blog = await BlogService.createBlog(
    req.body,
    {
      authorName: req.user.fullName || "Unknown User",
      authorId: req.userId || req.user._id
    }
  );

  res.status(201).json(new ApiResponse(201, blog, "Tạo bài viết thành công"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await BlogService.updateBlog(id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Cập nhật bài viết thành công"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await BlogService.deleteBlog(id);

  res.status(200).json(new ApiResponse(200, blog, "Xóa bài viết thành công"));
});

export const likeBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await BlogService.likeBlog(id, req.userId || req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Cập nhật yêu thích bài viết thành công"));
});

export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Vui lòng nhập nội dung bình luận"));
  }

  const blog = await BlogService.addComment(
    id,
    req.userId || req.user._id,
    content
  );

  res.status(201).json(new ApiResponse(201, blog, "Thêm bình luận thành công"));
});
