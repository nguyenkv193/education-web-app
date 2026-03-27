import Enrollment from '../models/Enrollment.js';
import { ApiError } from '../../../../shared/utils/helpers.js';
import { createHttpClient } from '../../../../shared/utils/httpClient.js';
import { getConfig } from '../../../../shared/config/env.js';

const config = getConfig('enrollment');
const courseClient = createHttpClient(config.courseServiceUrl);
const authClient = createHttpClient(config.authServiceUrl);

class EnrollmentService {
    async enrollCourse(userId, courseId, token) {
        // Verify course exists via course service and get details for sync
        let courseData = null;
        try {
            const courseRes = await courseClient.get(`/api/courses/${courseId}`);
            courseData = courseRes.data?.data;
        } catch (error) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        // Kiểm tra xem user đã enroll chưa
        console.log(`DEBUG: Checking existence for enrollCourse - userId: ${userId}, courseId: ${courseId}`);
        let enrollment = await Enrollment.findOne({ userId, courseId });
        console.log(`DEBUG: enrollCourse findOne result:`, enrollment);
        if (!enrollment) {
            enrollment = new Enrollment({
                userId,
                courseId,
            });
            await enrollment.save();

            // Notify course service to update enrollment count (async) causes only on new enrollment
            courseClient.put(`/api/courses/${courseId}/enrollments/increment`).catch(() => { });
        }

        // Sync with auth service (add to user's enrolledCourses) - ALWAYS try to sync to self-heal
        if (token && courseData) {
            authClient.post('/api/auth/enroll', {
                courseId,
                title: courseData.title,
                slug: courseData.slug,
                thumbnail: courseData.thumbnail
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(err => {
                console.error('[EnrollmentService] Failed to sync enrollment with auth service', err.message);
            });
        }

        return enrollment;
    }

    async getEnrollment(userId, courseId) {
        console.log(`DEBUG: getEnrollment - userId: ${userId}, courseId: ${courseId}`);
        const enrollment = await Enrollment.findOne({ userId, courseId });
        console.log(`DEBUG: getEnrollment findOne result:`, enrollment);
        if (!enrollment) {
            throw new ApiError(404, 'Không tìm thấy đăng ký khóa học');
        }
        return enrollment;
    }

    async getUserEnrollments(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const enrollments = await Enrollment.find({ userId })
            .skip(skip)
            .limit(limit)
            .sort({ enrolledAt: -1 });

        const total = await Enrollment.countDocuments({ userId });

        return {
            enrollments,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async markLessonAsComplete(userId, courseId, lessonId) {
        const enrollment = await Enrollment.findOne({ userId, courseId });
        if (!enrollment) {
            throw new ApiError(404, 'Không tìm thấy đăng ký khóa học');
        }

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            enrollment.lastAccessedLesson = lessonId;
            enrollment.lastAccessedAt = new Date();

            // Get course info to calculate progress
            try {
                const course = await courseClient.get(`/api/courses/${courseId}`);
                // Calculate total lessons from course
                // This is simplified - in real app, you'd get actual lesson count
                const totalLessons = course.data?.lessons || 100;
                enrollment.progressPercentage = Math.round(
                    (enrollment.completedLessons.length / totalLessons) * 100
                );
            } catch (error) {
                // If can't get course, just update progress based on completed lessons
                enrollment.progressPercentage = Math.min(
                    enrollment.completedLessons.length * 10,
                    100
                );
            }

            await enrollment.save();
        }

        return enrollment;
    }

    async rateAndReviewCourse(userId, courseId, rating, review) {
        const enrollment = await Enrollment.findOne({ userId, courseId });
        if (!enrollment) {
            throw new ApiError(404, 'Không tìm thấy đăng ký khóa học');
        }

        enrollment.rating = rating;
        enrollment.review = review;
        await enrollment.save();

        // Update course rating (async)
        courseClient.put(`/api/courses/${courseId}/rating`, { rating, review }).catch(() => { });

        return enrollment;
    }

    async unenrollCourse(userId, courseId) {
        const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });
        if (!enrollment) {
            throw new ApiError(404, 'Không tìm thấy đăng ký khóa học');
        }

        // Notify course service to decrement enrollment count (async)
        courseClient.put(`/api/courses/${courseId}/enrollments/decrement`).catch(() => { });

        return enrollment;
    }
}

export default new EnrollmentService();
