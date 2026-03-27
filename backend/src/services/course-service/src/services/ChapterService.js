import Chapter from '../models/Chapter.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { ApiError } from '../../../../shared/utils/helpers.js';

class ChapterService {
    async getChapterById(id) {
        const chapter = await Chapter.findById(id).populate('lessons');

        if (!chapter) {
            throw new ApiError(404, 'Chapter không tồn tại');
        }

        return chapter;
    }

    async getChaptersByCourse(courseId) {
        const chapters = await Chapter.find({ courseId })
            .populate('lessons')
            .sort({ orderIndex: 1 });

        return chapters;
    }

    async createChapter(chapterData) {
        const { courseId, title, description, orderIndex } = chapterData;

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, 'Khóa học không tồn tại');
        }

        // If orderIndex not provided, set it to the end
        let finalOrderIndex = orderIndex;
        if (finalOrderIndex === undefined) {
            const lastChapter = await Chapter.findOne({ courseId }).sort({ orderIndex: -1 });
            finalOrderIndex = lastChapter ? lastChapter.orderIndex + 1 : 0;
        }

        const newChapter = new Chapter({
            title,
            description,
            courseId,
            orderIndex: finalOrderIndex,
        });

        await newChapter.save();

        // Add chapter to course
        course.chapters.push(newChapter._id);
        await course.save();

        return newChapter;
    }

    async updateChapter(id, updateData) {
        const chapter = await Chapter.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!chapter) {
            throw new ApiError(404, 'Chapter không tồn tại');
        }

        return chapter;
    }

    async deleteChapter(id) {
        const chapter = await Chapter.findById(id);
        if (!chapter) {
            throw new ApiError(404, 'Chapter không tồn tại');
        }

        // Remove chapter from course
        await Course.findByIdAndUpdate(chapter.courseId, {
            $pull: { chapters: id },
        });

        // Delete all lessons in this chapter
        await Lesson.deleteMany({ chapterId: id });

        // Delete the chapter
        await Chapter.findByIdAndDelete(id);

        return chapter;
    }

    async reorderChapters(courseId, chapterOrders) {
        // chapterOrders is an array of { id, orderIndex }
        const updatePromises = chapterOrders.map(({ id, orderIndex }) =>
            Chapter.findByIdAndUpdate(id, { orderIndex })
        );

        await Promise.all(updatePromises);

        return await this.getChaptersByCourse(courseId);
    }

    async updateChapterStats(chapterId) {
        const lessons = await Lesson.find({ chapterId });

        // Calculate total duration
        let totalSeconds = 0;
        lessons.forEach(lesson => {
            const [minutes, seconds] = lesson.duration.split(':').map(Number);
            totalSeconds += (minutes || 0) * 60 + (seconds || 0);
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        let duration;
        if (hours > 0) {
            duration = `${hours} giờ ${minutes} phút`;
        } else {
            duration = `${minutes} phút`;
        }

        await Chapter.findByIdAndUpdate(chapterId, {
            lessonsCount: lessons.length,
            duration,
        });
    }
}

export default new ChapterService();
