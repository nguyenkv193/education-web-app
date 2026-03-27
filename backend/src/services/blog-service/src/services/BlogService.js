import BlogPost from "../models/BlogPost.js";
import { ApiError } from "../../../../shared/utils/helpers.js";
import mongoose from "../../../../shared/config/mongoose.js";

// In-memory fallback store used when MongoDB is not available
const inMemoryStore = {
  blogs: [],
};

const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const useInMemory = () =>
  !!global.__USE_IN_MEMORY_BLOGS || mongoose.connection.readyState !== 1;

// Seed sample data for testing in-memory mode
const seedSampleData = () => {
  if (inMemoryStore.blogs.length > 0) return; // Already seeded
  const now = new Date();
  inMemoryStore.blogs = [
    {
      _id: genId(),
      title: "Bài viết chờ duyệt 1",
      description: "Đây là bài viết mẫu chờ admin duyệt",
      content: "<p>Nội dung bài viết mẫu 1</p>",
      author: "User 1",
      status: "pending",
      publishedAt: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      views: 0,
      likes: 0,
      likedBy: [],
      comments: [],
      image: "https://picsum.photos/800/400?random=1",
      tags: ["sample", "pending"],
    },
    {
      _id: genId(),
      title: "Bài viết chờ duyệt 2",
      description: "Đây là bài viết mẫu thứ 2 chờ admin duyệt",
      content: "<p>Nội dung bài viết mẫu 2</p>",
      author: "User 2",
      status: "pending",
      publishedAt: null,
      createdAt: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
      updatedAt: new Date(now.getTime() - 3600000).toISOString(),
      views: 0,
      likes: 0,
      likedBy: [],
      comments: [],
      image: "https://picsum.photos/800/400?random=2",
      tags: ["sample", "pending"],
    },
  ];
};

class BlogService {
  constructor() {
    if (global.__USE_IN_MEMORY_BLOGS) {
      seedSampleData();
    }
  }

  async _populateAuthorNames(blogs) {
    if (!blogs) return blogs;
    const isArray = Array.isArray(blogs);
    const blogList = isArray ? blogs : [blogs];

    // Find blogs with author as ObjectId string (24 hex chars)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    const blogsToPopulate = blogList.filter(
      (b) =>
        b.author && typeof b.author === "string" && objectIdRegex.test(b.author)
    );

    if (blogsToPopulate.length === 0) return blogs;

    const authorIds = [...new Set(blogsToPopulate.map((b) => b.author))];

    try {
      // Use the User model we registered earlier
      const User = mongoose.model("User");
      const users = await User.find({ _id: { $in: authorIds } }).select(
        "fullName"
      );
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user.fullName;
        return acc;
      }, {});

      blogList.forEach((blog) => {
        if (objectIdRegex.test(blog.author) && userMap[blog.author]) {
          blog.author = userMap[blog.author];
        }
      });
    } catch (error) {
      console.warn("Failed to populate legacy author names:", error.message);
    }

    return blogs;
  }
  async getBlogById(id) {
    if (useInMemory()) {
      const post = inMemoryStore.blogs.find(
        (b) => b._id === id || b._id === String(id)
      );
      if (!post) throw new ApiError(404, "Bài viết không tồn tại");
      post.views = (post.views || 0) + 1;
      return post;
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      throw new ApiError(404, "Bài viết không tồn tại");
    }

    return this._populateAuthorNames(post);
  }

  async getBlogBySlug(slug) {
    if (useInMemory()) {
      const post = inMemoryStore.blogs.find((b) => b.slug === slug);
      if (!post) throw new ApiError(404, "Bài viết không tồn tại");
      post.views = (post.views || 0) + 1;
      return post;
    }

    const post = await BlogPost.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      throw new ApiError(404, "Bài viết không tồn tại");
    }

    return this._populateAuthorNames(post);
  }

  async getAllBlogs(page = 1, limit = 10, filter = {}) {
    const skip = (page - 1) * limit;
    const query = { status: "published", ...filter };
    if (useInMemory()) {
      const filtered = inMemoryStore.blogs.filter((b) => {
        let ok = true;
        Object.keys(filter).forEach((k) => {
          if (b[k] !== filter[k]) ok = false;
        });
        return b.status === "published" && ok;
      });
      const total = filtered.length;
      const blogs = filtered
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + limit);
      return {
        blogs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      };
    }

    const blogs = await BlogPost.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1, publishedAt: -1 });

    const total = await BlogPost.countDocuments(query);

    return {
      blogs: await this._populateAuthorNames(blogs),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getVipBlogs(page = 1, limit = 10) {
    return this.getAllBlogs(page, limit, { isVip: true });
  }

  async searchBlogs(keyword, page = 1, limit = 10) {
    const query = {
      status: "published",
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
        { tags: { $in: [new RegExp(keyword, "i")] } },
      ],
    };

    const skip = (page - 1) * limit;
    if (useInMemory()) {
      const regex = new RegExp(keyword, "i");
      const filtered = inMemoryStore.blogs.filter(
        (b) =>
          b.status === "published" &&
          (regex.test(b.title) ||
            regex.test(b.description) ||
            regex.test(b.content) ||
            (b.tags || []).some((t) => regex.test(t)))
      );
      const total = filtered.length;
      const blogs = filtered.slice(skip, skip + limit);
      return {
        blogs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      };
    }

    const blogs = await BlogPost.find(query).skip(skip).limit(limit);

    const total = await BlogPost.countDocuments(query);

    return {
      blogs: await this._populateAuthorNames(blogs),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createBlog(blogData, { authorName, authorId }) {
    if (useInMemory()) {
      const now = new Date().toISOString();
      const blogId = genId();
      const newBlog = {
        _id: blogId,
        ...blogData,
        author: authorName,
        authorId: authorId,
        status: "pending",
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
        views: 0,
        likes: 0,
        likedBy: [],
        comments: [],
      };
      inMemoryStore.blogs.push(newBlog);
      return newBlog;
    }

    const newBlog = new BlogPost({
      ...blogData,
      author: authorName,
      authorId: authorId,
      // New posts created by instructors should be pending approval
      status: "pending",
      publishedAt: null,
    });

    await newBlog.save();

    // Try to update user's blogs array (non-blocking)
    try {
      // Update user-service
      const User = await import("../../user-service/src/models/User.js").then(
        (m) => m.default
      );
      await User.findByIdAndUpdate(
        authorId,
        { $addToSet: { blogs: newBlog._id } },
        { new: true }
      ).catch(() => { });

      // Update auth-service
      const AuthUser = await import(
        "../../../auth-service/src/models/User.js"
      ).then((m) => m.default);
      await AuthUser.findByIdAndUpdate(
        authorId,
        { $addToSet: { blogs: newBlog._id } },
        { new: true }
      ).catch(() => { });
    } catch (err) {
      console.log("Could not update user blogs array:", err.message);
    }

    return newBlog;
  }

  async getBlogsByStatus(status = "pending", page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { status };
    if (useInMemory()) {
      const filtered = inMemoryStore.blogs.filter((b) => b.status === status);
      const total = filtered.length;
      const blogs = filtered
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + limit);
      return {
        blogs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      };
    }

    const blogs = await BlogPost.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BlogPost.countDocuments(query);

    return {
      blogs: await this._populateAuthorNames(blogs),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateBlogStatus(id, status) {
    if (useInMemory()) {
      const blog = inMemoryStore.blogs.find(
        (b) => b._id === id || b._id === String(id)
      );
      if (!blog) throw new ApiError(404, "Bài viết không tồn tại");
      blog.status = status;
      blog.updatedAt = new Date().toISOString();
      if (status === "published") blog.publishedAt = new Date().toISOString();
      return blog;
    }

    const update = { status, updatedAt: Date.now() };
    if (status === "published") {
      update.publishedAt = new Date();
    }

    const blog = await BlogPost.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      throw new ApiError(404, "Bài viết không tồn tại");
    }

    return blog;
  }

  async updateBlog(id, updateData) {
    if (useInMemory()) {
      const blog = inMemoryStore.blogs.find(
        (b) => b._id === id || b._id === String(id)
      );
      if (!blog) throw new ApiError(404, "Bài viết không tồn tại");
      Object.assign(blog, updateData);
      blog.updatedAt = new Date().toISOString();
      return blog;
    }

    const blog = await BlogPost.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!blog) {
      throw new ApiError(404, "Bài viết không tồn tại");
    }

    return blog;
  }

  async deleteBlog(id) {
    if (useInMemory()) {
      const idx = inMemoryStore.blogs.findIndex(
        (b) => b._id === id || b._id === String(id)
      );
      if (idx === -1) throw new ApiError(404, "Bài viết không tồn tại");
      const [removed] = inMemoryStore.blogs.splice(idx, 1);
      return removed;
    }

    const blog = await BlogPost.findByIdAndDelete(id);
    if (!blog) {
      throw new ApiError(404, "Bài viết không tồn tại");
    }
    return blog;
  }

  async likeBlog(id, userId) {
    if (useInMemory()) {
      const blog = inMemoryStore.blogs.find(
        (b) => b._id === id || b._id === String(id)
      );
      if (!blog) throw new ApiError(404, "Bài viết không tồn tại");
      blog.likedBy = blog.likedBy || [];
      if (blog.likedBy.includes(userId)) {
        blog.likedBy = blog.likedBy.filter((x) => x !== userId);
        blog.likes = Math.max(0, (blog.likes || 0) - 1);
      } else {
        blog.likedBy.push(userId);
        blog.likes = (blog.likes || 0) + 1;
      }
      return blog;
    }

    const blog = await BlogPost.findById(id);
    if (!blog) {
      throw new ApiError(404, "Bài viết không tồn tại");
    }

    if (blog.likedBy.includes(userId)) {
      // Unlike
      blog.likedBy = blog.likedBy.filter((id) => id.toString() !== userId);
      blog.likes -= 1;
    } else {
      // Like
      blog.likedBy.push(userId);
      blog.likes += 1;
    }

    await blog.save();
    return blog;
  }

  async addComment(id, userId, content) {
    if (useInMemory()) {
      const blog = inMemoryStore.blogs.find(
        (b) => b._id === id || b._id === String(id)
      );
      if (!blog) throw new ApiError(404, "Bài viết không tồn tại");
      blog.comments = blog.comments || [];
      blog.comments.push({
        userId,
        content,
        createdAt: new Date().toISOString(),
      });
      return blog;
    }

    const blog = await BlogPost.findById(id);
    if (!blog) {
      throw new ApiError(404, "Bài viết không tồn tại");
    }

    blog.comments.push({
      userId,
      content,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    await blog.save();
    return blog;
  }

  async getPopularBlogs(limit = 5) {
    if (useInMemory()) {
      const blogs = inMemoryStore.blogs
        .filter((b) => b.status === "published")
        .sort(
          (a, b) =>
            (b.views || 0) - (a.views || 0) || (b.likes || 0) - (a.likes || 0)
        )
        .slice(0, limit);
      return blogs;
    }

    const blogs = await BlogPost.find({ status: "published" })
      .sort({ views: -1, likes: -1 })
      .limit(limit);

    return this._populateAuthorNames(blogs);
  }
}

export default new BlogService();
