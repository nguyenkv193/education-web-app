import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
// app.use(express.json()); // Removed to prevent body consumption before proxy
// app.use(express.urlencoded({ extended: true })); // Removed to prevent body consumption before proxy

// Parse FRONTEND_URL to support multiple origins (comma-separated)
const frontendUrls = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(',')
  .map(url => url.trim());
const adminUrl = process.env.ADMIN_URL || "http://localhost:5174";
const allowedOrigins = [...frontendUrls, adminUrl];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Service URLs
const services = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:5176",
  user: process.env.USER_SERVICE_URL || "http://localhost:5177",
  course: process.env.COURSE_SERVICE_URL || "http://localhost:5178",
  blog: process.env.BLOG_SERVICE_URL || "http://localhost:5179",
  enrollment: process.env.ENROLLMENT_SERVICE_URL || "http://localhost:5180",
  learningPath:
    process.env.LEARNING_PATH_SERVICE_URL || "http://localhost:5181",
};

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway đang hoạt động",
    services,
    timestamp: new Date().toISOString(),
  });
});

// Proxy middleware configuration
const createProxy = (target, pathRewrite = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      res.status(503).json({
        success: false,
        message: "Service không khả dụng",
        error: err.message,
      });
    },
    onProxyReq: (proxyReq, req) => {
      // Forward original headers
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
    },
  });
};

// Route proxies
app.use("/api/auth", createProxy(services.auth));
app.use("/api/users", createProxy(services.user));
app.use("/api/courses", createProxy(services.course));
app.use("/api/chapters", createProxy(services.course));
app.use("/api/lessons", createProxy(services.course));
app.use("/api/blogs", createProxy(services.blog));
app.use("/api/enrollments", createProxy(services.enrollment));
app.use("/api/learning-paths", createProxy(services.learningPath));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy endpoint này",
  });
});

// Start server
const PORT = process.env.PORT || 5175;
app.listen(PORT, () => {
  console.log(`API Gateway đang chạy tại: http://localhost:${PORT}`);
  console.log("Services:", services);
});

export default app;
