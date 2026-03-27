import mongoose from '../../../../shared/config/mongoose.js';

const enrollmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        progressPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        lastAccessedLesson: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        lastAccessedAt: {
            type: Date,
            default: null,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        certificateIssued: {
            type: Boolean,
            default: false,
        },
        certificateUrl: {
            type: String,
            default: null,
        },
        rating: {
            type: Number,
            default: null,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            default: null,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound index để tránh duplicate enrollment
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);

