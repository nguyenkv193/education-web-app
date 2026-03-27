import { asyncHandler, ApiResponse } from '../../../../shared/utils/helpers.js';
import ChapterService from '../services/ChapterService.js';

export const getChapterById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const chapter = await ChapterService.getChapterById(id);

    res.status(200).json(new ApiResponse(200, chapter, 'Lấy chi tiết chapter thành công'));
});

export const getChaptersByCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const chapters = await ChapterService.getChaptersByCourse(courseId);

    res.status(200).json(new ApiResponse(200, chapters, 'Lấy danh sách chapters thành công'));
});

export const createChapter = asyncHandler(async (req, res) => {
    if (req.user && req.user.role !== 'instructor' && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, 'Bạn không có quyền tạo chapter'));
    }

    const chapter = await ChapterService.createChapter(req.body);

    res.status(201).json(new ApiResponse(201, chapter, 'Tạo chapter thành công'));
});

export const updateChapter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const chapter = await ChapterService.updateChapter(id, req.body);

    res.status(200).json(new ApiResponse(200, chapter, 'Cập nhật chapter thành công'));
});

export const deleteChapter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const chapter = await ChapterService.deleteChapter(id);

    res.status(200).json(new ApiResponse(200, chapter, 'Xóa chapter thành công'));
});

export const reorderChapters = asyncHandler(async (req, res) => {
    const { courseId, chapterOrders } = req.body;

    if (!courseId || !chapterOrders || !Array.isArray(chapterOrders)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, 'Dữ liệu không hợp lệ'));
    }

    const chapters = await ChapterService.reorderChapters(courseId, chapterOrders);

    res.status(200).json(new ApiResponse(200, chapters, 'Sắp xếp chapters thành công'));
});
