import Lesson from '../models/Lesson.js';
import Chapter from '../models/Chapter.js';
import Course from '../models/Course.js';
import ChapterService from './ChapterService.js';
import { ApiError } from '../../../../shared/utils/helpers.js';

class LessonService {
    async getLessonById(id) {
        const lesson = await Lesson.findById(id);

        if (!lesson) {
            throw new ApiError(404, 'Bài học không tồn tại');
        }

        return lesson;
    }

    async getLessonsByChapter(chapterId) {
        const lessons = await Lesson.find({ chapterId }).sort({ orderIndex: 1 });
        return lessons;
    }

    async createLesson(lessonData) {
        const { chapterId, courseId, title, description, videoUrl, duration, orderIndex, isFree } =
            lessonData;

        // Verify chapter exists
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            throw new ApiError(404, 'Chapter không tồn tại');
        }

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        // If orderIndex not provided, set it to the end
        let finalOrderIndex = orderIndex;
        if (finalOrderIndex === undefined) {
            const lastLesson = await Lesson.findOne({ chapterId }).sort({ orderIndex: -1 });
            finalOrderIndex = lastLesson ? lastLesson.orderIndex + 1 : 0;
        }

        const newLesson = new Lesson({
            title,
            description,
            chapterId,
            courseId,
            videoUrl,
            duration: duration || '0:00',
            orderIndex: finalOrderIndex,
            isFree: isFree || false,
        });

        await newLesson.save();

        // Add lesson to chapter
        chapter.lessons.push(newLesson._id);
        await chapter.save();

        // Update chapter stats
        await ChapterService.updateChapterStats(chapterId);

        // Update course lesson count
        await this.updateCourseLessonCount(courseId);

        return newLesson;
    }

    async updateLesson(id, updateData) {
        const lesson = await Lesson.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!lesson) {
            throw new ApiError(404, 'Bài học không tồn tại');
        }

        // Update chapter stats if duration changed
        if (updateData.duration) {
            await ChapterService.updateChapterStats(lesson.chapterId);
        }

        return lesson;
    }

    async deleteLesson(id) {
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            throw new ApiError(404, 'Bài học không tồn tại');
        }

        // Remove lesson from chapter
        await Chapter.findByIdAndUpdate(lesson.chapterId, {
            $pull: { lessons: id },
        });

        // Delete the lesson
        await Lesson.findByIdAndDelete(id);

        // Update chapter stats
        await ChapterService.updateChapterStats(lesson.chapterId);

        // Update course lesson count
        await this.updateCourseLessonCount(lesson.courseId);

        return lesson;
    }

    async reorderLessons(chapterId, lessonOrders) {
        // lessonOrders is an array of { id, orderIndex }
        const updatePromises = lessonOrders.map(({ id, orderIndex }) =>
            Lesson.findByIdAndUpdate(id, { orderIndex })
        );

        await Promise.all(updatePromises);

        return await this.getLessonsByChapter(chapterId);
    }

    async updateCourseLessonCount(courseId) {
        const totalLessons = await Lesson.countDocuments({ courseId });
        await Course.findByIdAndUpdate(courseId, { lessons: totalLessons });
    }
}

export default new LessonService();
