import {
  asyncHandler,
  ApiResponse,
  ApiError,
} from "../../../../shared/utils/helpers.js";

import AuthService from "../services/AuthService.js";

// Cập nhật tiến độ học tập (slug + progress)
export const updateCourseProgress = asyncHandler(async (req, res) => {
  const userId = req.userId || req.user._id;
  const { slug, progress } = req.body;

  if (!slug || progress === undefined) {
    throw new ApiError(400, "Vui lòng cung cấp slug và progress");
  }

  const updatedUser = await AuthService.updateCourseProgress(userId, { slug, progress });

  res.status(200).json(new ApiResponse(200, updatedUser, "Cập nhật tiến độ thành công"));
});

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Vui lòng cung cấp đầy đủ thông tin"));
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Mật khẩu không khớp"));
  }

  const { user, token } = await AuthService.register(fullName, email, password);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: { ...user, password: undefined }, token },
        "Đăng ký thành công"
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Vui lòng nhập email và mật khẩu"));
  }

  const { user, token } = await AuthService.login(email, password);

  res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Đăng nhập thành công"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await AuthService.getCurrentUser(req.userId || req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Lấy thông tin người dùng thành công"));
});

export const logout = asyncHandler(async (req, res) => {
  const result = await AuthService.logout();
  res.status(200).json(new ApiResponse(200, null, result.message));
});

// Enroll a user into a course (simple): expects { courseId, title, slug } in body
export const enrollCourse = asyncHandler(async (req, res) => {
  const userId = req.userId || req.user._id;
  const { courseId, title, slug } = req.body;

  if (!courseId || !title || !slug) {
    throw new ApiError(400, "courseId, title và slug là bắt buộc");
  }

  const updatedUser = await AuthService.enrollCourse(userId, {
    courseId,
    title,
    slug,
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Đăng ký khóa học thành công"));
});

// Cập nhật profile người dùng hiện tại
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId || req.user._id;
  const payload = req.body || {};

  const updatedUser = await AuthService.updateProfile(userId, payload);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "Cập nhật thông tin người dùng thành công"
      )
    );
});

// Thay đổi mật khẩu
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.userId || req.user._id;
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    throw new ApiError(
      400,
      "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới"
    );
  }

  const result = await AuthService.changePassword(
    userId,
    currentPassword,
    newPassword
  );

  res.status(200).json(new ApiResponse(200, null, result.message));
});
