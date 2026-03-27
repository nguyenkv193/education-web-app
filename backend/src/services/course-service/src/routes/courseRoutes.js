import { Router } from 'express';
import { getConfig } from '../../../../shared/config/env.js';
import { authMiddleware, instructorMiddleware } from '../../../../shared/middleware/auth.js';
import {
    getAllCourses,
    getCourseById,
    getCourseBySlug,
    getFreeCourses,
    getProCourses,
    searchCourses,
    getCourseLessonDetail,
    createCourse,
    updateCourse,
    deleteCourse,
} from '../controllers/courseController.js';

const config = getConfig('course');
const router = Router();

// Public routes
router.get('/', getAllCourses);
router.get('/free', getFreeCourses);
router.get('/pro', getProCourses);
router.get('/search', searchCourses);
router.get('/:id', getCourseById);
router.get('/slug/:slug', getCourseBySlug);
router.get('/lesson/:courseSlug', getCourseLessonDetail);

// Protected routes (Instructor/Admin) - TEMPORARILY DISABLED FOR TESTING
router.post(
    '/',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    createCourse
);
router.put(
    '/:id',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    updateCourse
);
router.delete(
    '/:id',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    deleteCourse
);

export default router;
