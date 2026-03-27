import { Router } from "express";
import { getConfig } from "../../../../shared/config/env.js";
import {
  authMiddleware,
  instructorMiddleware,
  adminMiddleware,
} from "../../../../shared/middleware/auth.js";

import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getVipBlogs,
  searchBlogs,
  getPopularBlogs,
  getPendingBlogs,
  updateBlogStatus,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
} from "../controllers/BlogController.js";

const config = getConfig("blog");
const router = Router();

/* ======================
      PUBLIC ROUTES
======================= */
router.get("/", getAllBlogs);
router.get("/popular", getPopularBlogs);
router.get("/vip", getVipBlogs);
router.get("/search", searchBlogs);
router.get("/slug/:slug", getBlogBySlug);
// Public route for admin to fetch pending blogs (no auth required)
router.get("/pending", getPendingBlogs);
router.get("/:id", getBlogById);

/* ======================
        ADMIN ROUTES
======================= */
// FE Admin gọi: /blog/admin/pending/list (deprecated, use /blogs/pending instead)
router.get(
  "/admin/pending/list",
  authMiddleware(config.jwtSecret, config.userServiceUrl),
  adminMiddleware,
  getPendingBlogs
);

/* ======================
      PROTECTED ROUTES
======================= */

// Create Blog - Người dùng có quyền (đã đăng nhập)
router.post(
  "/",
  authMiddleware(config.jwtSecret, config.authServiceUrl),
  createBlog
);

// Update Blog - Giáo viên / Instructor
router.put(
  "/:id",
  authMiddleware(config.jwtSecret, config.authServiceUrl),
  instructorMiddleware,
  updateBlog
);

// Delete Blog - Giáo viên / Instructor
router.delete(
  "/:id",
  authMiddleware(config.jwtSecret, config.authServiceUrl),
  instructorMiddleware,
  deleteBlog
);

// Update Blog Status - ADMIN
router.put(
  "/:id/status",
  authMiddleware(config.jwtSecret, config.authServiceUrl),
  adminMiddleware,
  updateBlogStatus
);

// Like blog - người dùng
router.post(
  "/:id/like",
  authMiddleware(config.jwtSecret, config.authServiceUrl),
  likeBlog
);

// Comment blog - người dùng
router.post(
  "/:id/comment",
  authMiddleware(config.jwtSecret, config.authServiceUrl),
  addComment
);

export default router;
