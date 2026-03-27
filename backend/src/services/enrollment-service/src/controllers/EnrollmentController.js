import { asyncHandler, ApiResponse } from '../../../../shared/utils/helpers.js';
import EnrollmentService from '../services/EnrollmentService.js';

export const enrollCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json(
            new ApiResponse(400, null, 'Vui lòng cung cấp courseId')
        );
    }

    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    const enrollment = await EnrollmentService.enrollCourse(req.userId || req.user._id, courseId, token);

    res.status(201).json(
        new ApiResponse(201, enrollment, 'Đăng ký khóa học thành công')
    );
});

export const getEnrollment = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    console.log(`DEBUG: [${req.method}] Controller getEnrollment called for ${courseId}`);
    const enrollment = await EnrollmentService.getEnrollment(req.userId || req.user._id, courseId);
    console.log(`DEBUG: Controller sending 200 response`);

    res.status(200).json(
        new ApiResponse(200, enrollment, 'Lấy thông tin đăng ký thành công')
    );
});

export const getUserEnrollments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await EnrollmentService.getUserEnrollments(req.userId || req.user._id, page, limit);

    res.status(200).json(
        new ApiResponse(200, result, 'Lấy danh sách khóa học đã đăng ký thành công')
    );
});

export const markLessonAsComplete = asyncHandler(async (req, res) => {
    const { courseId, lessonId } = req.body;

    if (!courseId || !lessonId) {
        return res.status(400).json(
            new ApiResponse(400, null, 'Vui lòng cung cấp courseId và lessonId')
        );
    }

    const enrollment = await EnrollmentService.markLessonAsComplete(
        req.userId || req.user._id,
        courseId,
        lessonId
    );

    res.status(200).json(
        new ApiResponse(200, enrollment, 'Đánh dấu bài học hoàn thành thành công')
    );
});

export const rateAndReviewCourse = asyncHandler(async (req, res) => {
    const { courseId, rating, review } = req.body;

    if (!courseId || !rating) {
        return res.status(400).json(
            new ApiResponse(400, null, 'Vui lòng cung cấp courseId và rating')
        );
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json(
            new ApiResponse(400, null, 'Rating phải từ 1 đến 5')
        );
    }

    const enrollment = await EnrollmentService.rateAndReviewCourse(
        req.userId || req.user._id,
        courseId,
        rating,
        review || null
    );

    res.status(200).json(
        new ApiResponse(200, enrollment, 'Đánh giá khóa học thành công')
    );
});

export const unenrollCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const enrollment = await EnrollmentService.unenrollCourse(req.userId || req.user._id, courseId);

    res.status(200).json(
        new ApiResponse(200, enrollment, 'Hủy đăng ký khóa học thành công')
    );
});
