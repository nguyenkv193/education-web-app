import { ApiError, ApiResponse } from '../utils/helpers.js';

export const errorHandler = (err, req, res, next) => {
    let error = err;

    // Handle Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
        error = new ApiError(400, message);
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        error = new ApiError(400, `${field} đã tồn tại`);
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi máy chủ nội bộ';

    console.log(`[ErrorHandler] Sending error response: ${statusCode} - ${message}`);

    res.status(statusCode).json(
        new ApiResponse(statusCode, null, message)
    );
};

