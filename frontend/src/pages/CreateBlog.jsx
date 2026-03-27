/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import blogService from '../services/blogService';
import SectionHeader from '../components/SectionHeader';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [tags, setTags] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Load editing post from sessionStorage if available
    useEffect(() => {
        const editingPost = sessionStorage.getItem('editingPost');
        if (editingPost) {
            const post = JSON.parse(editingPost);
            setEditingPostId(post._id);
            setTitle(post.title || '');
            setContent(post.content || '');
            setThumbnail(post.image || '');
            setTags(post.tags?.join(', ') || '');
            sessionStorage.removeItem('editingPost');
        }
    }, []);

    // Handle file upload
    const handleThumbnailChange = e => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = event => {
                setThumbnail(event.target?.result || '');
            };
            reader.readAsDataURL(file);
        }
    };

    // Quill editor modules configuration
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'color',
        'background',
        'script',
        'list',
        'indent',
        'align',
        'blockquote',
        'code-block',
        'link',
        'image',
        'video',
    ];

    const handleSaveDraft = async () => {
        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề bài viết!');
            return;
        }

        try {
            const currentUser =
                user || (await import('../services/authService').then(m => m.default.getUser()));
            const userKey = `userBlogPosts_${currentUser?._id || currentUser?.id || 'guest'}`;
            const userPosts = JSON.parse(localStorage.getItem(userKey) || '[]');

            const draftPost = {
                _id: `draft-${Date.now()}`,
                title,
                description: content.slice(0, 200),
                // Don't save full content to avoid localStorage quota
                image: thumbnail || 'https://via.placeholder.com/800x400?text=No+Image',
                tags: tags ? tags.split(',').map(t => t.trim()) : [],
                status: 'draft',
                createdAt: new Date().toISOString(),
                views: 0,
                author: user?.fullName || 'Ẩn danh',
                avatar: user?.avatar || null,
            };

            userPosts.push(draftPost);
            localStorage.setItem(userKey, JSON.stringify(userPosts));

            alert('Lưu nháp thành công!');
            navigate('/my-blog-posts');
        } catch (err) {
            console.error('Error saving draft:', err);
            alert('Có lỗi xảy ra khi lưu nháp');
        }
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề bài viết!');
            return;
        }

        if (!content.trim()) {
            alert('Vui lòng nhập nội dung bài viết!');
            return;
        }

        if (!thumbnail) {
            alert('Vui lòng chọn ảnh thumbnail!');
            return;
        }

        setIsPublishing(true);
        try {
            const payload = {
                title,
                description: content.slice(0, 200),
                content,
                image: thumbnail,
                tags: tags ? tags.split(',').map(t => t.trim()) : [],
            };

            // If editing, update the post in localStorage
            if (editingPostId) {
                const currentUser =
                    user ||
                    (await import('../services/authService').then(m => m.default.getUser()));
                const userKey = `userBlogPosts_${currentUser?._id || currentUser?.id || 'guest'}`;
                const userPosts = JSON.parse(localStorage.getItem(userKey) || '[]');
                const updatedPosts = userPosts.map(p =>
                    p._id === editingPostId
                        ? {
                              ...p,
                              title,
                              description: payload.description,
                              content,
                              image: thumbnail,
                              tags: payload.tags,
                              updatedAt: new Date().toISOString(),
                          }
                        : p
                );
                localStorage.setItem(userKey, JSON.stringify(updatedPosts));

                alert('Bài viết đã được cập nhật thành công!');
                navigate('/my-blog-posts');
                return;
            }

            // Otherwise, create new post
            const res = await blogService.createBlog(payload);

            // Save to localStorage with published status for display purposes
            const currentUser =
                user || (await import('../services/authService').then(m => m.default.getUser()));
            const userKey = `userBlogPosts_${currentUser?._id || currentUser?.id || 'guest'}`;
            const userPosts = JSON.parse(localStorage.getItem(userKey) || '[]');
            const publishedPost = {
                _id: res.data?.data?._id || `pub-${Date.now()}`,
                title,
                description: payload.description,
                // Don't save full content to localStorage to avoid quota exceeded
                image: thumbnail,
                tags: payload.tags,
                status: 'published',
                author: user?.fullName || 'Ẩn danh',
                avatar: user?.avatar || null,
                views: 0,
                createdAt: new Date().toISOString(),
            };
            userPosts.push(publishedPost);
            localStorage.setItem(userKey, JSON.stringify(userPosts));

            alert(
                'Bài viết đã được xuất bản! Nếu admin duyệt, bài viết sẽ hiển thị trên trang Blog chính.'
            );
            navigate('/my-blog-posts');
        } catch (error) {
            console.error('Error publishing blog:', error);
            alert(error.message || 'Có lỗi xảy ra khi gửi bài viết');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleCancel = () => {
        if (title || content) {
            if (window.confirm('Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-fit bg-gray-50 sm:p-8 md:px-11 px-3 py-8">
            {/* Header */}
            <div className="mb-10">
                <SectionHeader title={editingPostId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'} />
            </div>

            {/* Title Input */}
            <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-semibold text-[#4e586b] mb-2">
                    Tiêu đề bài viết <span className="text-red-500">(*)</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề cho bài viết của bạn..."
                    className="w-full px-4 py-3 text-sm bg-[#eef4fc] rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Thumbnail Input */}
            <div className="mb-6">
                <label
                    htmlFor="thumbnail"
                    className="block text-sm font-semibold text-[#4e586b] mb-2"
                >
                    Ảnh <span className="text-red-500">(*)</span>
                </label>
                <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-full px-4 py-3 text-sm bg-[#eef4fc] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {thumbnail && (
                    <div className="mt-3 text-xs text-gray-600">
                        <p className="mb-2">Preview:</p>
                        <img
                            src={thumbnail}
                            alt="preview"
                            className="w-40 h-24 rounded object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Content Editor */}
            <div className="mb-6">
                <label
                    htmlFor="content"
                    className="block text-sm font-semibold text-[#4e586b] mb-2"
                >
                    Nội dung bài viết <span className="text-red-500">(*)</span>
                </label>
                <div className="quill-wrapper bg-[#eef4fc]">
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Bắt đầu viết nội dung bài viết của bạn..."
                        className="text-sm"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                    onClick={handleCancel}
                    className="min-w-40 h-8 px-6 py-1 flex items-center justify-center text-sm uppercase border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSaveDraft}
                    className="min-w-40 h-8 px-6 py-1 flex items-center justify-center text-sm uppercase border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer sm:ml-auto"
                >
                    Lưu nháp
                </button>
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="min-w-40 h-8 px-6 py-1 flex items-center justify-center text-sm uppercase bg-[#0093fc] text-white font-semibold rounded-lg hover:brightness-95 transition-all cursor-pointer"
                >
                    {isPublishing ? 'Đang lưu...' : editingPostId ? 'Cập nhật' : 'Xuất bản'}
                </button>
            </div>
        </div>
    );
};

export default CreateBlog;
