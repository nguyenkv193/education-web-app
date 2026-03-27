import { Router } from "express";
import { getConfig } from "../../../../shared/config/env.js";
import { authMiddleware } from "../../../../shared/middleware/auth.js";
import {
  getUserById,
  updateUser,
  addEnrolledCourse,
  addFavoriteCourse,
  removeFavoriteCourse,
  addBlog,
  removeBlog,
  getUserBlogs,
} from "../controllers/userController.js";

const config = getConfig("user");
const router = Router();

// Public routes
router.get("/:id", getUserById);

// Protected routes
router.put(
  "/:id",
  authMiddleware(config.jwtSecret, config.userServiceUrl),
  updateUser
);
router.post(
  "/:id/enrolled",
  authMiddleware(config.jwtSecret, config.userServiceUrl),
  addEnrolledCourse
);
router.post(
  "/:id/favorites",
  authMiddleware(config.jwtSecret, config.userServiceUrl),
  addFavoriteCourse
);
router.delete(
  "/:id/favorites/:courseId",
  authMiddleware(config.jwtSecret, config.userServiceUrl),
  removeFavoriteCourse
);
router.post(
  "/:id/blogs",
  authMiddleware(config.jwtSecret, config.userServiceUrl),
  addBlog
);
router.delete(
  "/:id/blogs/:blogId",
  authMiddleware(config.jwtSecret, config.userServiceUrl),
  removeBlog
);
router.get("/:id/blogs", getUserBlogs);

export default router;
