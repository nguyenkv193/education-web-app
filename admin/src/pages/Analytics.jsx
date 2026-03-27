import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faEye,
  faHeart,
  faCheck,
  faClock,
  faBan,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const approvePost = (id) => {
    // call API
    handleUpdateStatus(id, "published");
  };

  const rejectPost = (id) => {
    handleUpdateStatus(id, "archived");
  };

  const deletePost = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      handleDelete(id);
    }
  };

  const stats = {
    totalPosts: posts.length,
    pending: posts.filter((p) => p.status === "pending").length,
    approved: posts.filter((p) => p.status === "published").length,
    rejected: posts.filter((p) => p.status === "archived").length,
  };

  // API integration
  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await import("../services/blogService").then((m) =>
        m.default.getPending()
      );
      const data = res.data?.data?.blogs || [];
      // map fields to expected shape
      const mapped = data.map((b) => ({
        id: b._id,
        title: b.title,
        students: b.author?.fullName || b.author || "Unknown",
        views: b.views || 0,
        likes: b.likes || 0,
        status: b.status,
        createdDate: b.createdAt
          ? new Date(b.createdAt).toISOString().slice(0, 10)
          : "",
      }));
      setPosts(mapped);
    } catch (err) {
      console.error("Error fetching pending blogs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await import("../services/blogService").then((m) =>
        m.default.updateStatus(id, status)
      );
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch (err) {
      console.error("Error updating status", err);
      alert("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await import("../services/blogService").then((m) =>
        m.default.deleteBlog(id)
      );
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting blog", err);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="lg:p-4 p-3">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Thống kê & Kiểm duyệt bài viết
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faNewspaper}
                className="text-blue-600 text-xl"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng bài viết</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faClock}
                className="text-yellow-600 text-xl"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
          <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCheck}
                className="text-green-600 text-xl"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
          <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBan} className="text-red-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Từ chối</p>
          <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Danh sách bài viết
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lượt thích
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{post.students}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faEye} className="text-xs" />
                      {post.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faHeart} className="text-xs" />
                      {post.likes}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {post.createdDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${
                        post.status === "published"
                          ? "bg-green-50 text-green-700"
                          : post.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          post.status === "approved"
                            ? "bg-green-500"
                            : post.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {post.status === "published"
                        ? "Đã duyệt"
                        : post.status === "pending"
                        ? "Chờ duyệt"
                        : "Từ chối"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {post.status === "pending" && (
                        <>
                          <button
                            onClick={() => approvePost(post.id)}
                            className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => rejectPost(post.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deletePost(post.id)}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
