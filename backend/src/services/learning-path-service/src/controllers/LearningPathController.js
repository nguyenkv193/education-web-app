import { asyncHandler, ApiResponse } from '../../../../shared/utils/helpers.js';
import LearningPathService from '../services/LearningPathService.js';

export const getAllLearningPaths = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await LearningPathService.getAllLearningPaths(page, limit);

    res.status(200).json(
        new ApiResponse(200, result, 'Lấy danh sách lộ trình học thành công')
    );
});

export const getLearningPathById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const path = await LearningPathService.getLearningPathById(id);

    res.status(200).json(
        new ApiResponse(200, path, 'Lấy chi tiết lộ trình học thành công')
    );
});

export const getLearningPathBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const path = await LearningPathService.getLearningPathBySlug(slug);

    res.status(200).json(
        new ApiResponse(200, path, 'Lấy chi tiết lộ trình học thành công')
    );
});

export const getLearningPathByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const path = await LearningPathService.getLearningPathByType(type);

    res.status(200).json(
        new ApiResponse(200, path, 'Lấy chi tiết lộ trình học thành công')
    );
});

export const createLearningPath = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json(
            new ApiResponse(403, null, 'Bạn không có quyền tạo lộ trình học')
        );
    }

    const path = await LearningPathService.createLearningPath(req.body);

    res.status(201).json(
        new ApiResponse(201, path, 'Tạo lộ trình học thành công')
    );
});

export const updateLearningPath = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const path = await LearningPathService.updateLearningPath(id, req.body);

    res.status(200).json(
        new ApiResponse(200, path, 'Cập nhật lộ trình học thành công')
    );
});

export const deleteLearningPath = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const path = await LearningPathService.deleteLearningPath(id);

    res.status(200).json(
        new ApiResponse(200, path, 'Xóa lộ trình học thành công')
    );
});

