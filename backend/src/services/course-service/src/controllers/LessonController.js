import { asyncHandler, ApiResponse } from '../../../../shared/utils/helpers.js';
import LessonService from '../services/LessonService.js';

export const getLessonById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lesson = await LessonService.getLessonById(id);

    res.status(200).json(new ApiResponse(200, lesson, 'Lấy chi tiết bài học thành công'));
});

export const getLessonsByChapter = asyncHandler(async (req, res) => {
    const { chapterId } = req.params;
    const lessons = await LessonService.getLessonsByChapter(chapterId);

    res.status(200).json(new ApiResponse(200, lessons, 'Lấy danh sách bài học thành công'));
});

export const createLesson = asyncHandler(async (req, res) => {
    if (req.user && req.user.role !== 'instructor' && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, 'Bạn không có quyền tạo bài học'));
    }

    const lesson = await LessonService.createLesson(req.body);

    res.status(201).json(new ApiResponse(201, lesson, 'Tạo bài học thành công'));
});

export const updateLesson = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lesson = await LessonService.updateLesson(id, req.body);

    res.status(200).json(new ApiResponse(200, lesson, 'Cập nhật bài học thành công'));
});

export const deleteLesson = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lesson = await LessonService.deleteLesson(id);

    res.status(200).json(new ApiResponse(200, lesson, 'Xóa bài học thành công'));
});

export const reorderLessons = asyncHandler(async (req, res) => {
    const { chapterId, lessonOrders } = req.body;

    if (!chapterId || !lessonOrders || !Array.isArray(lessonOrders)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, 'Dữ liệu không hợp lệ'));
    }

    const lessons = await LessonService.reorderLessons(chapterId, lessonOrders);

    res.status(200).json(new ApiResponse(200, lessons, 'Sắp xếp bài học thành công'));
});
