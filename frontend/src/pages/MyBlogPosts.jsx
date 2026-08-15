import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlogAvatar from '../components/BlogAvatar';
import blogService from '../services/blogService';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import SectionHeader from '../components/SectionHeader';

// Helper to strip HTML tags
const stripHtmlTags = html => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
};

const MyBlogPosts = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('published'); // "published" or "draft"
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        fetchAllPosts();
    }, [isAuthenticated, navigate]);

    const fetchAllPosts = async () => {
        setLoading(true);
        try {
            // Fetch both published and draft posts
            const [publishedRes, draftRes] = await Promise.all([
                blogService.getMyPosts(true, 1, 20),
                blogService.getMyPosts(false, 1, 20),
            ]);
            const published = publishedRes.data?.data?.blogs || [];
            const draft = draftRes.data?.data?.blogs || [];

            // Combine and mark with status
            let combined = [
                ...published.map(p => ({ ...p, status: 'published' })),
                ...draft.map(p => ({ ...p, status: 'draft' })),
            ];

            // For each post with an API _id, try to fetch real view count from API
            combined = await Promise.all(
                combined.map(async post => {
                    // If post has valid API _id (not draft-* or pub-*), try to get real data
                    if (
                        post._id &&
                        !post._id.startsWith('draft-') &&
                        !post._id.startsWith('pub-')
                    ) {
                        try {
                            const postDetail = await blogService.getById(post._id);
                            const apiPost = postDetail.data?.data;
                            if (apiPost) {
                                return { ...post, views: apiPost.views || 0 };
                            }
                        } catch {
                            // If can't fetch, keep local data
                            console.log('Could not fetch post details from API');
                        }
                    }
                    return post;
                })
            );

            setAllPosts(combined);
        } catch (err) {
            console.error('Error loading posts:', err);
            setAllPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async postId => {
        if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

        try {
            // Try to delete from API first (if it's published)
            try {
                await blogService.deletePost(postId);
            } catch {
                console.log('Could not delete from API, deleting from localStorage');
            }

            // Also delete from localStorage
            const user = authService.getUser();
            const userKey = `userBlogPosts_${user?._id || user?.id || 'guest'}`;
            const userPosts = JSON.parse(localStorage.getItem(userKey) || '[]');
            const filtered = userPosts.filter(p => p._id !== postId);
            localStorage.setItem(userKey, JSON.stringify(filtered));

            setAllPosts(allPosts.filter(p => p._id !== postId));
            alert('Xóa bài viết thành công!');
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Có lỗi xảy ra khi xóa bài viết');
        }
    };

    const handleEditPost = postId => {
        // Get post from localStorage
        const user = authService.getUser();
        const userKey = `userBlogPosts_${user?._id || user?.id || 'guest'}`;
        const userPosts = JSON.parse(localStorage.getItem(userKey) || '[]');
        const post = userPosts.find(p => p._id === postId);

        if (post) {
            // Store post data in sessionStorage for edit page to use
            sessionStorage.setItem('editingPost', JSON.stringify(post));
            navigate('/blog/create');
        } else {
            alert('Không tìm thấy bài viết để sửa');
        }
    };

    const filteredPosts = allPosts.filter(post => post.status === activeTab);

    return (
        <div className="min-h-screen md:px-11 px-3 py-8">
            {/* Header */}
            <div className="mb-8">
                <SectionHeader title="Bài viết của tôi" />
                <p className="text-gray-600 mt-10">
                    Quản lý các bài viết nháp và bài viết đã xuất bản của bạn
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('published')}
                    className={`pb-3 px-2 font-semibold text-sm transition-colors cursor-pointer ${
                        activeTab === 'published'
                            ? 'text-[#f05123] border-b-2 border-[#f05123]'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Đã xuất bản ({allPosts.filter(p => p.status === 'published').length})
                </button>
                <button
                    onClick={() => setActiveTab('draft')}
                    className={`pb-3 px-2 font-semibold text-sm transition-colors cursor-pointer ${
                        activeTab === 'draft'
                            ? 'text-[#f05123] border-b-2 border-[#f05123]'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Nháp ({allPosts.filter(p => p.status === 'draft').length})
                </button>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Đang tải...</p>
                ) : filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <div
                            key={post._id}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            {/* Post Info */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <img
                                    src={post.image || 'https://via.placeholder.com/80'}
                                    alt={post.title}
                                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/blog/${post._id}`}
                                        className="text-lg font-semibold text-gray-900 hover:text-[#f05123] truncate block"
                                    >
                                        {post.title}
                                    </Link>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                        {stripHtmlTags(post.description)}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                                        <span>
                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span>•</span>
                                        <span>{post.views || 0} lượt xem</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button
                                    onClick={() => handleEditPost(post._id)}
                                    className="px-3 py-2 text-sm font-medium text-[#f05123] hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                            Bạn chưa có bài viết{' '}
                            {activeTab === 'published' ? 'đã xuất bản' : 'nháp'}
                        </p>
                        <Link
                            to="/blog/create"
                            className="inline-block px-4 py-2 bg-[#f05123] text-white font-medium rounded-lg hover:brightness-95 transition-all text-sm"
                        >
                            Viết bài viết mới
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBlogPosts;
