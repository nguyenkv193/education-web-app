import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/helpers.js';
import axios from 'axios';

// Middleware để verify JWT token và lấy user info từ user service
export const authMiddleware = (jwtSecret, userServiceUrl) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

            if (!token) {
                throw new ApiError(401, 'Vui lòng đăng nhập');
            }

            const decoded = verifyToken(token, jwtSecret);
            if (!decoded) {
                throw new ApiError(401, 'Token không hợp lệ hoặc đã hết hạn');
            }

            // Set user ID from token
            req.userId = decoded.id;
            req.user = { _id: decoded.id };

            // Optionally fetch full user info from user service if URL provided
            if (userServiceUrl) {
                try {
                    console.log(`[Auth Middleware] Fetching user info from: ${userServiceUrl}/api/auth/me`);
                    const response = await axios.get(`${userServiceUrl}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.data && response.data.data) {
                        req.user = response.data.data;
                        console.log(`[Auth Middleware] User info fetched successfully. Role: ${req.user.role}`);
                    }
                } catch (error) {
                    // If user service is not available, continue with basic user info
                    console.warn('[Auth Middleware] Auth service call failed:', error.message);
                    console.warn('[Auth Middleware] Continuing with token info only - user will NOT have role!');
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const authOptional = (jwtSecret, userServiceUrl) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

            if (token) {
                const decoded = verifyToken(token, jwtSecret);
                if (decoded) {
                    req.userId = decoded.id;
                    req.user = { _id: decoded.id };

                    // Optionally fetch full user info
                    if (userServiceUrl) {
                        try {
                            const response = await axios.get(`${userServiceUrl}/api/auth/me`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            if (response.data && response.data.data) {
                                req.user = response.data.data;
                            }
                        } catch (error) {
                            // Ignore error for optional auth
                        }
                    }
                }
            }
            next();
        } catch (error) {
            next();
        }
    };
};

export const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return next(new ApiError(403, 'Bạn không có quyền thực hiện hành động này'));
    }
    next();
};

export const instructorMiddleware = (req, res, next) => {
    if (req.user?.role !== 'instructor' && req.user?.role !== 'admin') {
        return next(new ApiError(403, 'Bạn phải là giảng viên để thực hiện hành động này'));
    }
    next();
};

