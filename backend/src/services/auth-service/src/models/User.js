import mongoose from "../../../../shared/config/mongoose.js";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Vui lòng nhập tên đầy đủ"],
      trim: true,
      minlength: [2, "Tên phải có ít nhất 2 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      default: null,
      trim: true,
    },
    website: {
      type: String,
      default: null,
    },
    github: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ["user", "instructor", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Enrolled courses stored as simple objects to allow quick frontend display without cross-service calls
    enrolledCourses: [
      {
        courseId: { type: String },
        title: { type: String },
        slug: { type: String },
        enrolledAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        thumbnail: { type: String, default: null },
      },
    ],
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
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

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method so sánh password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
