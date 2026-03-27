import { Link } from 'react-router-dom';
import assets from '../assets';

const SearchDropdown = ({ searchQuery, results, onClose, isVisible }) => {
    if (!isVisible || !searchQuery.trim()) return null;

    const { courses = [], blogs = [] } = results;
    const hasResults = courses.length > 0 || blogs.length > 0;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 py-3 px-6 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50">
            {!hasResults ? (
                <div className="text-center text-gray-500 text-sm">
                    Không tìm thấy kết quả cho "{searchQuery}"
                </div>
            ) : (
                <div className="py-2">
                    {/* Search Query Header */}
                    <p className="text-xs text-gray-500 flex items-center">
                        <svg
                            className="inline w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        Kết quả cho "{searchQuery}"
                    </p>

                    {/* Courses Section */}
                    {courses.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between py-3 mt-3  border-b border-gray-200">
                                <h3 className="text-[13px] font-semibold text-gray-700 uppercase tracking-wide">
                                    Khóa học
                                </h3>
                                <Link
                                    to={`/courses?search=${encodeURIComponent(searchQuery)}`}
                                    onClick={onClose}
                                    className="text-xs text-[#f05123] hover:underline"
                                >
                                    Xem thêm
                                </Link>
                            </div>
                            <div className="space-y-1 py-2">
                                {courses.slice(0, 3).map(course => (
                                    <Link
                                        key={course._id || course.slug}
                                        to={`/courses/${course.slug}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 py-2 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100">
                                            <img
                                                src={
                                                    course.image ||
                                                    course.thumbnail ||
                                                    assets.default_avatar
                                                }
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                                onError={e =>
                                                    (e.target.src = assets.default_avatar)
                                                }
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-normal truncate">
                                                {course.title}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blogs Section */}
                    {blogs.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <h3 className="text-[13px] font-semibold text-gray-700 uppercase tracking-wide">
                                    Bài viết
                                </h3>
                                <Link
                                    to={`/blog?search=${encodeURIComponent(searchQuery)}`}
                                    onClick={onClose}
                                    className="text-xs text-[#f05123] hover:underline"
                                >
                                    Xem thêm
                                </Link>
                            </div>
                            <div className="space-y-1 py-2">
                                {blogs.slice(0, 3).map(blog => (
                                    <Link
                                        key={blog._id || blog.id}
                                        to={`/blog/${blog._id || blog.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 py-2 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100">
                                            <img
                                                src={blog.avatar || assets.default_avatar}
                                                alt={blog.author || 'Author'}
                                                className="w-full h-full object-cover"
                                                onError={e =>
                                                    (e.target.src = assets.default_avatar)
                                                }
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-normal truncate">
                                                {blog.title}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;
