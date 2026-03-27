import { Router } from 'express';
import { getConfig } from '../../../../shared/config/env.js';
import { authMiddleware } from '../../../../shared/middleware/auth.js';
import {
    enrollCourse,
    getEnrollment,
    getUserEnrollments,
    markLessonAsComplete,
    rateAndReviewCourse,
    unenrollCourse,
} from '../controllers/EnrollmentController.js';

const config = getConfig('enrollment');
const router = Router();

// All routes require authentication
router.post('/enroll', authMiddleware(config.jwtSecret, config.authServiceUrl), enrollCourse);
router.get('/:courseId', authMiddleware(config.jwtSecret, config.authServiceUrl), getEnrollment);
router.get('/', authMiddleware(config.jwtSecret, config.authServiceUrl), getUserEnrollments);
router.post('/mark-complete', authMiddleware(config.jwtSecret, config.authServiceUrl), markLessonAsComplete);
router.post('/rate', authMiddleware(config.jwtSecret, config.authServiceUrl), rateAndReviewCourse);
router.delete('/:courseId', authMiddleware(config.jwtSecret, config.authServiceUrl), unenrollCourse);

export default router;
