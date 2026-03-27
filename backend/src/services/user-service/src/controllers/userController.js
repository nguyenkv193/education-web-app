import { asyncHandler, ApiResponse } from "../../../../shared/utils/helpers.js";
import UserService from "../services/UserService.js";

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.getUserById(id);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Lấy thông tin người dùng thành công"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.updateUser(id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Cập nhật thông tin thành công"));
});

export const addEnrolledCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { courseId } = req.body;
  const user = await UserService.addEnrolledCourse(id, courseId);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Thêm khóa học đã đăng ký thành công"));
});

export const addFavoriteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { courseId } = req.body;
  const user = await UserService.addFavoriteCourse(id, courseId);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Thêm vào yêu thích thành công"));
});

export const removeFavoriteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { courseId } = req.body;
  const user = await UserService.removeFavoriteCourse(id, courseId);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Xóa khỏi yêu thích thành công"));
});

export const addBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { blogId } = req.body;
  const user = await UserService.addBlog(id, blogId);

  res.status(200).json(new ApiResponse(200, user, "Thêm bài viết thành công"));
});

export const removeBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { blogId } = req.body;
  const user = await UserService.removeBlog(id, blogId);

  res.status(200).json(new ApiResponse(200, user, "Xóa bài viết thành công"));
});

export const getUserBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blogs = await UserService.getUserBlogs(id);

  res
    .status(200)
    .json(new ApiResponse(200, blogs, "Lấy danh sách bài viết thành công"));
});
