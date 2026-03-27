import { asyncHandler, ApiResponse } from '../../../../shared/utils/helpers.js';
import CourseService from '../services/CourseService.js';

export const getAllCourses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12, category, isFree } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isFree === 'true') filter.isFree = true;
    if (isFree === 'false') filter.isFree = false;

    const result = await CourseService.getAllCourses(page, limit, filter);

    res.status(200).json(
        new ApiResponse(200, result, 'Lấy danh sách khóa học thành công')
    );
});

export const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await CourseService.getCourseById(id);

    res.status(200).json(
        new ApiResponse(200, course, 'Lấy chi tiết khóa học thành công')
    );
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const course = await CourseService.getCourseBySlug(slug);

    res.status(200).json(
        new ApiResponse(200, course, 'Lấy chi tiết khóa học thành công')
    );
});

export const getFreeCourses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12 } = req.query;
    const result = await CourseService.getFreeCourses(page, limit);

    res.status(200).json(
        new ApiResponse(200, result, 'Lấy danh sách khóa học miễn phí thành công')
    );
});

export const getProCourses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12 } = req.query;
    const result = await CourseService.getProCourses(page, limit);

    res.status(200).json(
        new ApiResponse(200, result, 'Lấy danh sách khóa học Pro thành công')
    );
});

export const searchCourses = asyncHandler(async (req, res) => {
    const { keyword, page = 1, limit = 12 } = req.query;

    if (!keyword) {
        return res.status(400).json(
            new ApiResponse(400, null, 'Vui lòng cung cấp từ khóa tìm kiếm')
        );
    }

    const result = await CourseService.searchCourses(keyword, page, limit);

    res.status(200).json(
        new ApiResponse(200, result, 'Tìm kiếm khóa học thành công')
    );
});

export const getCourseLessonDetail = asyncHandler(async (req, res) => {
    const { courseSlug } = req.params;
    const course = await CourseService.getCourseLessonDetail(courseSlug);

    res.status(200).json(
        new ApiResponse(200, course, 'Lấy chi tiết bài học thành công')
    );
});

export const createCourse = asyncHandler(async (req, res) => {
    console.log('DEBUG - createCourse hit');
    console.log('DEBUG - req.body:', req.body);

    // TEMPORARILY DISABLED FOR TESTING
    // if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    //     return res.status(403).json(
    //         new ApiResponse(403, null, 'Bạn không có quyền tạo khóa học')
    //     );
    // }

    try {
        const course = await CourseService.createCourse(req.body, '507f1f77bcf86cd799439011');
        console.log('DEBUG - Course created:', course);
        res.status(201).json(
            new ApiResponse(201, course, 'Tạo khóa học thành công')
        );
    } catch (error) {
        console.error('DEBUG - createCourse error:', error);
        throw error;
    }
});

export const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await CourseService.updateCourse(id, req.body);

    res.status(200).json(
        new ApiResponse(200, course, 'Cập nhật khóa học thành công')
    );
});

export const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await CourseService.deleteCourse(id);

    res.status(200).json(
        new ApiResponse(200, course, 'Xóa khóa học thành công')
    );
});
