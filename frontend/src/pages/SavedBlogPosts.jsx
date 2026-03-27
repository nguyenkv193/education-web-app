import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogAvatar from '../components/BlogAvatar';
import blogService from '../services/blogService';
import SectionHeader from '../components/SectionHeader';

// Helper to strip HTML tags
const stripHtmlTags = html => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
};

const SavedBlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    const fetchSavedPosts = async () => {
        setLoading(true);
        try {
            const res = await blogService.getSavedPosts(1, 20);
            const data = res.data?.data?.blogs || [];
            setPosts(data);
        } catch (err) {
            console.error('Error loading saved posts:', err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSaved = async postId => {
        if (!window.confirm('Bạn có chắc muốn bỏ lưu bài viết này?')) return;

        try {
            await blogService.removeSavedPost(postId);
            setPosts(posts.filter(p => p._id !== postId));
            alert('Bỏ lưu bài viết thành công!');
        } catch (err) {
            console.error('Error removing saved post:', err);
            alert('Có lỗi xảy ra khi bỏ lưu bài viết');
        }
    };

    return (
        <div className="min-h-screen md:px-11 px-3 py-8">
            {/* Header */}
            <div className="mb-8">
                <SectionHeader title="Bài viết đã lưu" />
                <p className="text-gray-600 mt-10">Những bài viết bạn đã lưu để xem lại sau</p>
            </div>

            {/* Posts Grid */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Đang tải...</p>
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <article
                            key={post._id}
                            className="rounded-xl overflow-hidden border-2 border-gray-200 p-5 hover:shadow-md transition-shadow"
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
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="shrink-0 text-red-500 hover:text-red-700 cursor-pointer font-medium text-sm"
                                            onClick={() => handleRemoveSaved(post._id)}
                                        >
                                            Bỏ lưu
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col items-start justify-between gap-2 mb-2 lg:pr-8 flex-1">
                                        <div className="space-y-2">
                                            <Link
                                                to={`/blog/${post._id}`}
                                                className="text-xl font-bold text-gray-900 leading-snug mt-1 line-clamp-2"
                                            >
                                                {post.title}
                                            </Link>
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {stripHtmlTags(post.description)}
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
                                                {new Date(post.createdAt).toLocaleDateString(
                                                    'vi-VN'
                                                )}
                                            </span>
                                            <span>•</span>
                                            <span>{post.views || 0} lượt xem</span>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="hidden lg:block shrink-0">
                                        <img
                                            src={
                                                post.image || 'https://via.placeholder.com/200x150'
                                            }
                                            alt={post.title}
                                            className="w-[200px] max-h-[150px] rounded-lg object-cover"
                                            onError={e =>
                                                (e.target.src =
                                                    'https://via.placeholder.com/200x150')
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Bạn chưa lưu bài viết nào</p>
                        <Link
                            to="/blog"
                            className="inline-block px-4 py-2 bg-[#f05123] text-white font-medium rounded-lg hover:brightness-95 transition-all"
                        >
                            Khám phá bài viết
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedBlogPosts;
