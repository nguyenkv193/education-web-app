import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import { getConfig } from "../../../shared/config/env.js";
import { connectDB } from "../../../shared/config/database.js";
import { errorHandler } from "../../../shared/middleware/errorHandler.js";
import blogRoutes from "./routes/blogRoutes.js";

const config = getConfig("blog");
const app = express();

// --- SỬA Ở ĐÂY: Tăng giới hạn lên 50mb ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Connect to MongoDB
console.log('Blog Service - Attempting to connect to MongoDB...');
console.log('MongoDB URI from config:', config.mongoUri ? config.mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') : 'UNDEFINED');
const conn = await connectDB(config.mongoUri);
if (!conn) {
  console.warn(
    "MongoDB not available — starting blog service in in-memory fallback mode"
  );
  global.__USE_IN_MEMORY_BLOGS = true;
} else {
  console.log('✅ Blog Service connected to MongoDB successfully');
  global.__USE_IN_MEMORY_BLOGS = false;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog Service đang hoạt động",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/blogs", blogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy endpoint này",
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = config.port || 5179; // Fallback port nếu config lỗi
app.listen(PORT, () => {
  console.log(
    `Blog Service đang chạy tại: http://localhost:${PORT} - Environment: ${config.nodeEnv}`
  );
});

export default app;
