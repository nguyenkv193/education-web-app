import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
// import courseRoutes from './routes/courseRoutes.js';
// import blogRoutes from './routes/blogRoutes.js';
// import learningPathRoutes from './routes/learningPathRoutes.js';
// import enrollmentRoutes from './routes/enrollmentRoutes.js';
// import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - hỗ trợ nhiều origins
const allowedOrigins = config.frontendUrl.flatMap(url =>
    url.split(',').map(u => u.trim())
);

app.use(
    cors({
        origin: function (origin, callback) {
            // Cho phép requests không có origin (như mobile apps hoặc curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Connect to MongoDB
await connectDB();

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server đang hoạt động',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/learning-paths', learningPathRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Không tìm thấy endpoint này',
    });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(
        `Server đang chạy tại: http://localhost:${PORT} - Environment: ${config.nodeEnv} - Database: ${config.mongoUri} `
    );
});

export default app;
