import LearningPath from '../models/LearningPath.js';
import { ApiError } from '../../../../shared/utils/helpers.js';
import { createHttpClient } from '../../../../shared/utils/httpClient.js';
import { getConfig } from '../../../../shared/config/env.js';

const config = getConfig('learningPath');
const courseClient = createHttpClient(config.courseServiceUrl);

class LearningPathService {
    async getLearningPathById(id) {
        const path = await LearningPath.findById(id);
        if (!path) {
            throw new ApiError(404, 'Lộ trình học không tồn tại');
        }

        // Populate course details from course service
        if (path.courses && path.courses.length > 0) {
            const courseIds = path.courses.map(c => c.courseId);
            // In real implementation, you'd fetch course details from course service
            // For now, just return the path with course IDs
        }

        return path;
    }

    async getLearningPathBySlug(slug) {
        const path = await LearningPath.findOne({ slug });
        if (!path) {
            throw new ApiError(404, 'Lộ trình học không tồn tại');
        }
        return path;
    }

    async getAllLearningPaths(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const paths = await LearningPath.find({ status: 'active' })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await LearningPath.countDocuments({ status: 'active' });

        return {
            paths,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getLearningPathByType(type) {
        const path = await LearningPath.findOne({ type, status: 'active' });
        if (!path) {
            throw new ApiError(404, `Lộ trình học cho ${type} không tồn tại`);
        }
        return path;
    }

    async createLearningPath(pathData) {
        const newPath = new LearningPath(pathData);
        await newPath.save();
        return newPath;
    }

    async updateLearningPath(id, updateData) {
        const path = await LearningPath.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!path) {
            throw new ApiError(404, 'Lộ trình học không tồn tại');
        }

        return path;
    }

    async deleteLearningPath(id) {
        const path = await LearningPath.findByIdAndDelete(id);
        if (!path) {
            throw new ApiError(404, 'Lộ trình học không tồn tại');
        }
        return path;
    }

    async addCoursePath(id, courseId, orderIndex = 0) {
        const path = await LearningPath.findById(id);
        if (!path) {
            throw new ApiError(404, 'Lộ trình học không tồn tại');
        }

        // Verify course exists
        try {
            await courseClient.get(`/api/courses/${courseId}`);
        } catch (error) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        path.courses.push({ courseId, orderIndex });
        await path.save();

        return path;
    }

    async removeCoursePath(id, courseId) {
        const path = await LearningPath.findById(id);
        if (!path) {
            throw new ApiError(404, 'Lộ trình học không tồn tại');
        }

        path.courses = path.courses.filter((c) => c.courseId.toString() !== courseId);
        await path.save();

        return path;
    }
}

export default new LearningPathService();

