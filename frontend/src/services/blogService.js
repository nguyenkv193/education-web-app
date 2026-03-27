import httpClient from "./httpClient";
import authService from "./authService";

// Local storage keys (scoped per user)
const BASE_SAVED_KEY = "savedBlogPosts";
const BASE_USER_POSTS_KEY = "userBlogPosts";

const getUserKey = (base) => {
  const user = authService.getUser();
  const id = user?._id || user?.id || "guest";
  return `${base}_${id}`;
};

const migrateLegacyKey = (base) => {
  // Move data from legacy base key (without user id) into current user's key if present
  try {
    const legacy = localStorage.getItem(base);
    if (!legacy) return;
    const parsed = JSON.parse(legacy || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) return;

    const user = authService.getUser();
    const id = user?._id || user?.id || null;
    if (!id) return; // do not migrate for guest

    // Only migrate items that belong to current user (by matching post.author._id or post.author)
    const toMigrate = parsed.filter((p) => {
      const authorId = p?.author?._id || p?.author || null;
      return authorId && String(authorId) === String(id);
    });
    if (toMigrate.length === 0) return;
    const destKey = `${base}_${id}`;
    const existing = JSON.parse(localStorage.getItem(destKey) || "[]");
    const merged = [...existing, ...toMigrate];
    localStorage.setItem(destKey, JSON.stringify(merged));
    // Remove only the migrated items from legacy store
    const remaining = parsed.filter((p) => !toMigrate.includes(p));
    if (remaining.length > 0) {
      localStorage.setItem(base, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(base);
    }
  } catch (err) {
    console.warn("Migration of legacy localStorage key failed", base, err);
  }
};

const API = {
  createBlog: (payload) => httpClient.post("/api/blogs", payload),
  getPopular: (limit = 5) =>
    httpClient.get(`/api/blogs/popular?limit=${limit}`),
  getPublished: (page = 1, limit = 12) =>
    httpClient.get(`/api/blogs?page=${page}&limit=${limit}`),
  getById: (id) => httpClient.get(`/api/blogs/${id}`),
  searchBlogs: (keyword, limit = 3) =>
    httpClient.get(`/api/blogs/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`),

  // Get user's posts - saved in localStorage (scoped by user)
  getMyPosts: (isPublished = true, page = 1, limit = 20) => {
    const key = getUserKey(BASE_USER_POSTS_KEY);
    const userPosts = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = userPosts.filter((p) =>
      isPublished ? p.status === "published" : p.status === "draft"
    );
    return Promise.resolve({
      data: {
        data: { blogs: filtered.slice((page - 1) * limit, page * limit) },
      },
    });
  },

  // Get saved posts - from localStorage (stores full post objects), scoped by user
  getSavedPosts: (page = 1, limit = 20) => {
    const key = getUserKey(BASE_SAVED_KEY);
    const savedPosts = JSON.parse(localStorage.getItem(key) || "[]");
    return Promise.resolve({
      data: {
        data: { blogs: savedPosts.slice((page - 1) * limit, page * limit) },
      },
    });
  },

  // Save post to localStorage
  savePost: async (postId) => {
    try {
      const res = await httpClient.get(`/api/blogs/${postId}`);
      const post = res.data?.data || res.data;

      const key = getUserKey(BASE_SAVED_KEY);
      let savedIds = JSON.parse(localStorage.getItem(key) || "[]");
      if (!savedIds.find((p) => p._id === postId)) {
        savedIds.push(post);
        localStorage.setItem(key, JSON.stringify(savedIds));
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  // Remove saved post
  removeSavedPost: (postId) => {
    const key = getUserKey(BASE_SAVED_KEY);
    const savedIds = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = savedIds.filter((p) => p._id !== postId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return Promise.resolve({ data: { success: true } });
  },

  // Update blog
  updateBlog: (postId, payload) =>
    httpClient.put(`/api/blogs/${postId}`, payload),

  // Delete blog
  deletePost: (postId) => httpClient.delete(`/api/blogs/${postId}`),
};

export default API;
