import User from "../models/User.js";
import { generateToken } from "../../../../shared/utils/jwt.js";
import { ApiError } from "../../../../shared/utils/helpers.js";
import { getConfig } from "../../../../shared/config/env.js";

import { createHttpClient } from "../../../../shared/utils/httpClient.js";

const config = getConfig("auth");
const courseClient = createHttpClient(config.courseServiceUrl);

class AuthService {
  async register(fullName, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email đã được đăng ký");
    }

    const user = new User({
      fullName,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user._id, config.jwtSecret, config.jwtExpire);
    return {
      user: user.toObject(),
      token,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Email hoặc mật khẩu không đúng");
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Email hoặc mật khẩu không đúng");
    }

    const token = generateToken(user._id, config.jwtSecret, config.jwtExpire);
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token,
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    return user;
  }

  async updateProfile(userId, payload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    // Xử lý riêng trường email (kiểm tra unique và chuẩn hóa)
    if (payload.email && String(payload.email).trim() !== "") {
      const newEmail = String(payload.email).toLowerCase().trim();
      if (newEmail !== (user.email || "")) {
        const existing = await User.findOne({ email: newEmail });
        if (existing && String(existing._id) !== String(userId)) {
          throw new ApiError(400, "Email đã được sử dụng bởi người khác");
        }
        user.email = newEmail;
        // Khi đổi email, đánh dấu chưa xác thực
        user.isEmailVerified = false;
      }
    }

    // Chỉ cho phép cập nhật các trường an toàn khác
    const allowed = [
      "fullName",
      "username",
      "bio",
      "website",
      "github",
      "avatar",
      "phone",
    ];

    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        user[key] = payload[key];
      }
    });

    user.updatedAt = new Date();
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async enrollCourse(userId, course) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    // Avoid duplicates by courseId
    const exists = (user.enrolledCourses || []).some(
      (c) => String(c.courseId) === String(course.courseId)
    );
    if (!exists) {
      user.enrolledCourses = user.enrolledCourses || [];
      user.enrolledCourses.push({
        courseId: course.courseId,
        title: course.title,
        slug: course.slug,
        enrolledAt: new Date(),
        progress: 0,
        thumbnail: course.thumbnail || course.image || null,
      });
      await user.save();
    }

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async updateCourseProgress(userId, { slug, progress }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    const courseIndex = user.enrolledCourses.findIndex(c => c.slug === slug);

    if (courseIndex !== -1) {
      user.enrolledCourses[courseIndex].progress = progress;
      // Mark array as modified to ensure mongoose saves it
      user.markModified('enrolledCourses');
      await user.save();
    } else {
      // Course not found in user's enrolled list. Try to fetch from course-service and add it.
      try {
        const courseRes = await courseClient.get(`/api/courses/slug/${slug}`);
        // Connect to shared/utils/httpClient.js, response is already interceptor-processed (res.data)
        const courseData = courseRes.data;

        if (courseData) {
          user.enrolledCourses.push({
            courseId: courseData._id,
            title: courseData.title,
            slug: courseData.slug,
            enrolledAt: new Date(),
            progress: progress,
            thumbnail: courseData.thumbnail || courseData.image || null,
          });
          await user.save();
        }
      } catch (err) {
        console.error(`[AuthService] Failed to auto-add missing course ${slug} during progress update:`, err.message);
      }
    }

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async logout() {
    // Logout logic có thể thêm vào blacklist token nếu cần
    return { message: "Đăng xuất thành công" };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(401, "Mật khẩu hiện tại không đúng");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new ApiError(400, "Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    user.password = newPassword; // pre-save hook sẽ hash
    await user.save();

    return { message: "Đổi mật khẩu thành công" };
  }
}

export default new AuthService();
