import mongoose from 'mongoose';
import slugify from 'slugify';

const learningPathSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tên lộ trình học'],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Vui lòng nhập mô tả'],
        },
        primaryDesc: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops'],
            required: true,
        },
        courses: [
            {
                courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                orderIndex: Number,
            },
        ],
        totalDuration: {
            type: String,
            default: '0 giờ 0 phút',
        },
        totalLessons: {
            type: Number,
            default: 0,
        },
        totalStudents: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            enum: ['Người mới bắt đầu', 'Trung cấp', 'Nâng cao'],
            default: 'Người mới bắt đầu',
        },
        image: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'archived'],
            default: 'active',
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

// Auto generate slug từ title
learningPathSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
        });
    }
    next();
});

export default mongoose.model('LearningPath', learningPathSchema);

