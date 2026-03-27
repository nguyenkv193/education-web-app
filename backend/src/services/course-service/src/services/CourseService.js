import Course from '../models/Course.js';
import Chapter from '../models/Chapter.js';
import Lesson from '../models/Lesson.js';
import { ApiError } from '../../../../shared/utils/helpers.js';

class CourseService {
    async getCourseById(id) {
        const course = await Course.findById(id)
            .populate({
                path: 'chapters',
                populate: {
                    path: 'lessons',
                },
            });

        if (!course) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        return course;
    }

    async getCourseBySlug(slug) {
        const course = await Course.findOne({ slug })
            .populate({
                path: 'chapters',
                populate: {
                    path: 'lessons',
                },
            });

        if (!course) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        return course;
    }

    async getAllCourses(page = 1, limit = 12, filter = {}) {
        const skip = (page - 1) * limit;
        const query = { status: 'published', ...filter };

        const courses = await Course.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Course.countDocuments(query);

        return {
            courses,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getCoursesByCategory(category, page = 1, limit = 12) {
        return this.getAllCourses(page, limit, { category });
    }

    async getFreeCourses(page = 1, limit = 12) {
        return this.getAllCourses(page, limit, { isFree: true });
    }

    async getProCourses(page = 1, limit = 12) {
        return this.getAllCourses(page, limit, { isFree: false });
    }

    async searchCourses(keyword, page = 1, limit = 12) {
        const query = {
            status: 'published',
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ],
        };

        const skip = (page - 1) * limit;
        const courses = await Course.find(query)
            .skip(skip)
            .limit(limit);

        const total = await Course.countDocuments(query);

        return {
            courses,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async createCourse(courseData, instructorId) {
        const newCourse = new Course({
            ...courseData,
            instructor: instructorId,
        });

        await newCourse.save();
        return newCourse;
    }

    async updateCourse(id, updateData) {
        const course = await Course.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!course) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        return course;
    }

    async deleteCourse(id) {
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        // Xóa các chapter liên quan
        await Chapter.deleteMany({ courseId: id });
        // Xóa các lesson liên quan
        await Lesson.deleteMany({ courseId: id });

        return course;
    }

    async getCourseLessonDetail(courseSlug) {
        const course = await Course.findOne({ slug: courseSlug })
            .populate({
                path: 'chapters',
                populate: {
                    path: 'lessons',
                },
            });

        if (!course) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        return course;
    }
}

export default new CourseService();
