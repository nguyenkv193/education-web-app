import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';
import BlogAvatar from '../components/BlogAvatar';
import BlogContent from '../components/BlogContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import DOMPurify from 'dompurify';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                const res = await blogService.getById(id);
                const data = res.data?.data;
                if (mounted) setPost(data);

                // Check if post is saved and liked
                if (isAuthenticated && data?._id) {
                    try {
                        const user = authService.getUser();
                        const uid = user?._id || user?.id || 'guest';
                        const savedKey = `savedBlogPosts_${uid}`;
                        const likedKey = `likedBlogPosts_${uid}`;

                        const savedPosts = JSON.parse(localStorage.getItem(savedKey) || '[]');
                        const isSavedPost = savedPosts.some(p => p._id === data._id);
                        if (mounted) setIsSaved(isSavedPost);

                        const likedPosts = JSON.parse(localStorage.getItem(likedKey) || '[]');
                        const isLikedPost = likedPosts.some(p => p._id === data._id);
                        if (mounted) {
                            setIsLiked(isLikedPost);
                            setLikeCount(likedPosts.length);
                        }
                    } catch (err) {
                        console.error('Error checking saved/liked posts:', err);
                    }
                }
            } catch (err) {
                console.error('Error loading post', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetch();
        return () => {
            mounted = false;
        };
    }, [id, isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleSavePost = async e => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để lưu bài viết');
            return;
        }

        try {
            if (isSaved) {
                await blogService.removeSavedPost(post._id);
                setIsSaved(false);
                alert('Bỏ lưu bài viết thành công!');
            } else {
                await blogService.savePost(post._id);
                setIsSaved(true);
                alert('Lưu bài viết thành công!');
            }
        } catch (err) {
            console.error('Error saving post:', err);
            alert('Có lỗi xảy ra khi lưu bài viết');
        }
    };

    const handleLikePost = async e => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để thích bài viết');
            return;
        }

        try {
            const user = authService.getUser();
            const uid = user?._id || user?.id || 'guest';
            const likedKey = `likedBlogPosts_${uid}`;

            const likedPosts = JSON.parse(localStorage.getItem(likedKey) || '[]');

            if (isLiked) {
                const filtered = likedPosts.filter(p => p._id !== post._id);
                localStorage.setItem(likedKey, JSON.stringify(filtered));
                setIsLiked(false);
                setLikeCount(filtered.length);
            } else {
                if (!likedPosts.find(p => p._id === post._id)) {
                    likedPosts.push({
                        _id: post._id,
                        title: post.title,
                        author: post.author,
                        likedAt: new Date().toISOString(),
                    });
                    localStorage.setItem(likedKey, JSON.stringify(likedPosts));
                }
                setIsLiked(true);
                setLikeCount(likedPosts.length);
            }
        } catch (err) {
            console.error('Error liking post:', err);
            alert('Có lỗi xảy ra khi thích bài viết');
        }
    };

    if (!post) {
        return (
            <div className="min-h-screen md:px-11 px-3">
                <p className="text-center py-12">Bài viết không tìm thấy.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 py-4">
            <div className="flex items-start gap-8 md:p-4 xl:p-8">
                <div className="flex-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 ">
                            <BlogAvatar
                                avatar={post.author?.avatar || post.avatar}
                                isVip={post.isVip}
                                size="md"
                                alt={post.author?.fullName || post.author}
                            />

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {post.author?.fullName || post.author}
                                        </p>
                                        <p className="text-xs text-gray-500">{post.meta}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-1">
                                <button
                                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                                    onClick={handleLikePost}
                                    title={isLiked ? 'Bỏ thích' : 'Thích bài viết'}
                                >
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className={`text-base ${
                                            isLiked ? 'text-black' : 'text-gray-400'
                                        }`}
                                    />
                                </button>
                                <span className="text-xs text-gray-500">{likeCount}</span>
                            </div>
                            <div className="w-5 h-5 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faComment}
                                    className="text-base text-gray-400 cursor-pointer"
                                />
                            </div>
                            <button
                                className="w-5 h-5 flex items-center justify-center text-gray-400 cursor-pointer transition-colors"
                                onClick={handleSavePost}
                                title={isSaved ? 'Bỏ lưu' : 'Lưu bài viết'}
                            >
                                <svg
                                    data-prefix="far"
                                    data-icon="bookmark"
                                    className="svg-inline--fa fa-bookmark w-5 h-5"
                                    role="img"
                                    viewBox="0 0 384 512"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill={isSaved ? 'black' : 'currentColor'}
                                        stroke="currentColor"
                                        strokeWidth={isSaved ? '20' : '0'}
                                        d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 417.1c0 25.6-28.5 40.8-49.8 26.6L192 412.8 49.8 507.7C28.5 521.9 0 506.6 0 481.1L0 64zM64 48c-8.8 0-16 7.2-16 16l0 387.2 117.4-78.2c16.1-10.7 37.1-10.7 53.2 0L336 451.2 336 64c0-8.8-7.2-16-16-16L64 48z"
                                    ></path>
                                </svg>
                            </button>
                            <div className="w-5 h-5 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faEllipsis}
                                    className="text-base cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        <p className="text-3xl font-bold">{post.title}</p>
                        <div
                            className="text-base text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.description || ''),
                            }}
                        />
                    </div>
                    <div className="mt-4">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full rounded-lg object-cover max-h-[420px]"
                        />
                    </div>
                    <div className="mt-6">
                        <BlogContent content={post.content || post.description || ''} />
                    </div>
                </div>

                <aside className="hidden lg:block flex-1">
                    <p className="text-sm font-semibold px-4 py-2 bg-gray-100 inline-block rounded-full whitespace-nowrap">
                        Xem thêm các bài viết khác
                    </p>
                    <RelatedPosts currentId={post._id} />
                </aside>
            </div>
        </div>
    );
};

function RelatedPosts({ currentId }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                const res = await blogService.getPublished(1, 6);
                const data = res.data?.data?.blogs || [];
                if (!mounted) return;
                setItems(data.filter(b => b._id !== currentId));
            } catch (err) {
                console.error('Error fetching related posts', err);
            }
        };
        fetch();
        return () => {
            mounted = false;
        };
    }, [currentId]);

    return (
        <ul className="mt-3 space-y-4 text-sm pl-4">
            {items.map(p => (
                <li key={p._id}>
                    <Link
                        to={`/blog/${p._id}`}
                        className="text-gray-700 text-sm hover:text-gray-900 hover:underline underline-offset-2"
                    >
                        {p.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default BlogDetail;
