import mongoose from '../../../../shared/config/mongoose.js';

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tên bài học'],
            trim: true,
        },
        description: {
            type: String,
            default: null,
        },
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chapter',
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        videoUrl: {
            type: String,
            default: null,
        },
        videoTitle: {
            type: String,
            default: null,
        },
        duration: {
            type: String,
            default: '0:00',
        },
        content: {
            type: String,
            default: null,
        },
        resources: [
            {
                title: String,
                url: String,
                type: String,
            },
        ],
        orderIndex: {
            type: Number,
            required: true,
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
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

export default mongoose.model('Lesson', lessonSchema);

