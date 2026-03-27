import mongoose from '../../../../shared/config/mongoose.js';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tên khóa học'],
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
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        originalPrice: {
            type: Number,
            default: null,
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        level: {
            type: String,
            enum: ['Người mới bắt đầu', 'Trung cấp', 'Nâng cao'],
            default: 'Người mới bắt đầu',
        },
        category: {
            type: String,
            enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'Khác'],
            default: 'Frontend',
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        duration: {
            type: String,
            default: '0 giờ 0 phút',
        },
        lessons: {
            type: Number,
            default: 0,
        },
        chapters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Chapter',
            },
        ],
        learnings: [String],
        requirements: [String],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
        enrollments: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
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

// Auto generate slug từ title
courseSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
        });
    }
    next();
});

export default mongoose.model('Course', courseSchema);

