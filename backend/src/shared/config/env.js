// dotenv is loaded by each service individually

export const getConfig = serviceName => {
    const defaultPorts = {
        auth: 5176,
        user: 5177,
        course: 5178,
        blog: 5179,
        enrollment: 5180,
        learningPath: 5181,
        gateway: 5175,
    };

    const config = {
        port:
            process.env[`${serviceName.toUpperCase()}_PORT`] ||
            process.env.PORT ||
            defaultPorts[serviceName] ||
            5000,
        mongoUri:
            process.env[`${serviceName.toUpperCase()}_MONGO_URI`] ||
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/education-web-app',
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        jwtExpire: process.env.JWT_EXPIRE || '7d',
        nodeEnv: process.env.NODE_ENV || 'development',
        frontendUrl: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            process.env.ADMIN_URL || 'http://localhost:5174',
        ],
        // Service URLs for inter-service communication
        authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5176',
        userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:5177',
        courseServiceUrl: process.env.COURSE_SERVICE_URL || 'http://localhost:5178',
        blogServiceUrl: process.env.BLOG_SERVICE_URL || 'http://localhost:5179',
        enrollmentServiceUrl: process.env.ENROLLMENT_SERVICE_URL || 'http://localhost:5180',
        learningPathServiceUrl: process.env.LEARNING_PATH_SERVICE_URL || 'http://localhost:5181',
    };
    return config;
};
