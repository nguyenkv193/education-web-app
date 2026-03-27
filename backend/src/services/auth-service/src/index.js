import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getConfig } from '../../../shared/config/env.js';
import { connectDB } from '../../../shared/config/database.js';
import { errorHandler } from '../../../shared/middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnv = (envPath, override = false) => {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath, override });
    }
};

const rootEnvPath = path.resolve(__dirname, '../../../../.env');
loadEnv(rootEnvPath);

const serviceEnvPath = path.resolve(__dirname, '../.env');
loadEnv(serviceEnvPath, true);

const config = getConfig('auth');
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
        message: 'Auth Service đang hoạt động',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api/auth', authRoutes);

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
        `Auth Service đang chạy tại: http://localhost:${PORT} - Environment: ${config.nodeEnv}`
    );
});

export default app;
