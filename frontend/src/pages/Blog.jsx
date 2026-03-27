import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import BlogSidebar from '../components/BlogSidebar';
import BlogAvatar from '../components/BlogAvatar';
import Pagination from '../components/Pagination';
import blogService from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

// Helper to strip HTML tags from text
const stripHtmlTags = html => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
};

// Helper to get plain text description (max 150 chars)
const getPlainDescription = html => {
    const plain = stripHtmlTags(html);
    return plain.slice(0, 150).trim() + (plain.length > 150 ? '...' : '');
};

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const POSTS_PER_PAGE = 6;

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                setLoading(true);
                // Load published posts from API with pagination
                const res = await blogService.getPublished(currentPage, POSTS_PER_PAGE);
                const responseData = res.data?.data || {};
                const apiData = responseData.blogs || [];
                const paginationData = responseData.pagination || {};
                const total = paginationData.pages || 1;

                if (!mounted) return;

                let allPosts = [...apiData];

                // Only merge localStorage posts on page 1
                if (currentPage === 1) {
                    // Load published posts from localStorage (those created by user) scoped per user
                    const currentUser = authService.getUser();
                    const userKey = `userBlogPosts_${currentUser?._id || currentUser?.id || 'guest'}`;
                    const userPosts = JSON.parse(localStorage.getItem(userKey) || '[]');
                    const userPublished = userPosts.filter(p => p.status === 'published');

                    // Merge - but avoid duplicates by _id
                    const apiIds = new Set(apiData.map(p => p._id));
                    const userPostsFiltered = userPublished.filter(p => !apiIds.has(p._id));

                    allPosts = [...userPostsFiltered, ...apiData];
                    // Sort by createdAt descending
                    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }

                setPosts(allPosts);
                setTotalPages(total);
                setLoading(false); // Set loading to false immediately after setting posts

                // Load saved posts if authenticated
                if (isAuthenticated) {
                    try {
                        const savedRes = await blogService.getSavedPosts(1, 1000);
                        const savedIds = (savedRes.data?.data?.blogs || []).map(p => p._id);
                        setSavedPosts(new Set(savedIds));
                    } catch (err) {
                        console.error('Error loading saved posts:', err);
                    }
                }
            } catch (err) {
                console.error('Error loading blog posts', err);
                setLoading(false); // Also set loading to false on error
            }
        };
        fetch();
        return () => {
            mounted = false;
        };
    }, [isAuthenticated, currentPage, POSTS_PER_PAGE]);

    const handleSavePost = async (postId, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để lưu bài viết');
            return;
        }

        try {
            if (savedPosts.has(postId)) {
                await blogService.removeSavedPost(postId);
                setSavedPosts(prev => {
                    const next = new Set(prev);
                    next.delete(postId);
                    return next;
                });
                alert('Bỏ lưu bài viết thành công!');
            } else {
                await blogService.savePost(postId);
                setSavedPosts(prev => new Set(prev).add(postId));
                alert('Lưu bài viết thành công!');
            }
        } catch (err) {
            console.error('Error saving post:', err);
            alert('Có lỗi xảy ra khi lưu bài viết');
        }
    };

    const handlePageChange = newPage => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen md:px-11 px-3">
            <div className="mb-8">
                {/* Header */}
                <div className="mt-8 md:mb-20 mb-10">
                    <SectionHeader title="Bài viết nổi bật" />
                    <p className="text-gray-700 leading-relaxed max-w-[840px] my-4 text-sm">
                        Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các
                        kỹ thuật lập trình web.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 pb-12 items-start">
                    {/* Blog Posts */}
                    <div className="space-y-6 lg:col-span-2">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                    <p className="text-gray-600">Đang tải bài viết...</p>
                                </div>
                            </div>
                        ) : !loading && posts.length === 0 ? (
                            <div className="flex items-center justify-center py-20">
                                <p className="text-gray-500 text-lg">Không có bài viết nào</p>
                            </div>
                        ) : (
                            posts.map((post, idx) => (
                                <article
                                    key={idx}
                                    className="rounded-xl overflow-hidden border-2 border-gray-200 p-5"
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* Avatar */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <BlogAvatar
                                                    avatar={post.avatar}
                                                    isVip={post.isVip}
                                                    size="sm"
                                                    alt={post.author}
                                                />
                                                <p className="text-xs font-semibold text-gray-900">
                                                    {post.author}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    className="shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                                                    onClick={e => handleSavePost(post._id, e)}
                                                    title={
                                                        savedPosts.has(post._id)
                                                            ? 'Bỏ lưu'
                                                            : 'Lưu bài viết'
                                                    }
                                                >
                                                    <svg
                                                        data-prefix="far"
                                                        data-icon="bookmark"
                                                        className="svg-inline--fa fa-bookmark w-5 h-5"
                                                        role="img"
                                                        viewBox="0 0 384 512"
                                                        aria-hidden="true"
                                                        fill="currentColor"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            fill={
                                                                savedPosts.has(post._id)
                                                                    ? 'black'
                                                                    : 'currentColor'
                                                            }
                                                            stroke="currentColor"
                                                            strokeWidth={
                                                                savedPosts.has(post._id)
                                                                    ? '40'
                                                                    : '0'
                                                            }
                                                            d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 417.1c0 25.6-28.5 40.8-49.8 26.6L192 412.8 49.8 507.7C28.5 521.9 0 506.6 0 481.1L0 64zM64 48c-8.8 0-16 7.2-16 16l0 387.2 117.4-78.2c16.1-10.7 37.1-10.7 53.2 0L336 451.2 336 64c0-8.8-7.2-16-16-16L64 48z"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col items-start justify-between gap-2 mb-2 lg:pr-8">
                                                <div className="space-y-2">
                                                    <Link
                                                        to={`/blog/${post._id || post.id}`}
                                                        className="text-xl font-bold text-gray-900 leading-snug mt-1 line-clamp-2"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    <p className="text-sm text-gray-600 line-clamp-3">
                                                        {getPlainDescription(post.description)}
                                                    </p>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    {(post.tags || []).map((tag, tagIdx) => (
                                                        <span
                                                            key={tagIdx}
                                                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Meta */}
                                                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                                                    <span>
                                                        {post.createdAt
                                                            ? new Date(
                                                                post.createdAt
                                                            ).toLocaleDateString('vi-VN')
                                                            : ''}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{post.views || 0} lượt xem</span>
                                                </div>
                                            </div>

                                            {/* Image */}
                                            <div className="hidden lg:block shrink-0">
                                                <img
                                                    src={
                                                        post.image ||
                                                        'https://via.placeholder.com/200x150?text=No+Image'
                                                    }
                                                    alt={post.title}
                                                    className="w-[200px] max-h-[150px] rounded-lg object-cover"
                                                    onError={e =>
                                                    (e.target.src =
                                                        'https://via.placeholder.com/200x150?text=No+Image')
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}

                        {/* Pagination */}
                        {!loading && posts.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <BlogSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Blog;
