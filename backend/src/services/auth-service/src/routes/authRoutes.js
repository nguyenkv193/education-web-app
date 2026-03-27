import { Router } from "express";
import { getConfig } from "../../../../shared/config/env.js";
import { authMiddleware } from "../../../../shared/middleware/auth.js";
import {
  register,
  login,
  getCurrentUser,
  logout,
  enrollCourse,
  updateProfile,
  changePassword,
  updateCourseProgress,
} from "../controllers/AuthController.js";

const config = getConfig("auth");
const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes - Auth service doesn't need user service for /me
router.get("/me", authMiddleware(config.jwtSecret, null), getCurrentUser);
router.post("/logout", authMiddleware(config.jwtSecret, null), logout);

// Enroll in a course
router.post("/enroll", authMiddleware(config.jwtSecret, null), enrollCourse);

// Update course progress
router.post("/enroll/progress", authMiddleware(config.jwtSecret, null), updateCourseProgress);

// Update current user's profile
router.put("/me", authMiddleware(config.jwtSecret, null), updateProfile);

// Change password
router.post(
  "/change-password",
  authMiddleware(config.jwtSecret, null),
  changePassword
);

export default router;
