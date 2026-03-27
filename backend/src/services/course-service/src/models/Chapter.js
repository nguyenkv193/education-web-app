import mongoose from '../../../../shared/config/mongoose.js';

const chapterSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tên chương'],
            trim: true,
        },
        description: {
            type: String,
            default: null,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        lessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
            },
        ],
        orderIndex: {
            type: Number,
            required: true,
        },
        duration: {
            type: String,
            default: '0 giờ 0 phút',
        },
        lessonsCount: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Chapter', chapterSchema);

