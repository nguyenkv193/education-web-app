import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import { getConfig } from '../../../shared/config/env.js';
import { connectDB } from '../../../shared/config/database.js';
import { errorHandler } from '../../../shared/middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';

const config = getConfig('user');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    })
);

// Connect to MongoDB
await connectDB(config.mongoUri);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User Service đang hoạt động',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api/users', userRoutes);

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
        `User Service đang chạy tại: http://localhost:${PORT} - Environment: ${config.nodeEnv}`
    );
});

export default app;

