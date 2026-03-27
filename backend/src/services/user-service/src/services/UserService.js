import User from "../models/User.js";
import { ApiError } from "../../../../shared/utils/helpers.js";

class UserService {
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }
    // Ensure blogs field exists
    if (!user.blogs) {
      user.blogs = [];
      await user.save();
    }
    return user;
  }

  async updateUser(id, updateData) {
    const user = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true, upsert: true }
    );

    return user;
  }

  async addEnrolledCourse(userId, courseId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    return user;
  }

  async addFavoriteCourse(userId, courseId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    if (!user.favoritesCourses.includes(courseId)) {
      user.favoritesCourses.push(courseId);
      await user.save();
    }

    return user;
  }

  async removeFavoriteCourse(userId, courseId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    user.favoritesCourses = user.favoritesCourses.filter(
      (id) => id.toString() !== courseId
    );
    await user.save();

    return user;
  }

  async addBlog(userId, blogId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    // Ensure blogs array exists
    if (!user.blogs) {
      user.blogs = [];
    }

    if (!user.blogs.includes(blogId)) {
      user.blogs.push(blogId);
      await user.save();
    }

    return user;
  }

  async removeBlog(userId, blogId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    // Ensure blogs array exists
    if (!user.blogs) {
      user.blogs = [];
    } else {
      user.blogs = user.blogs.filter((id) => id.toString() !== blogId);
    }

    await user.save();
    return user;
  }

  async getUserBlogs(userId) {
    const user = await User.findById(userId).populate("blogs");
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }
    return user.blogs || [];
  }
}

export default new UserService();
