import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import AuthForm from './AuthForm';
import SearchDropdown from './SearchDropdown';
import { useAuth } from '../contexts/AuthContext';
import assets from '../assets';
import courseService from '../services/courseService';
import blogService from '../services/blogService';

const Header = () => {
    const [toggleAuthForm, setToggleAuthForm] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMyCourses, setShowMyCourses] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ courses: [], blogs: [] });
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const { user, isAuthenticated, logout, loading } = useAuth();

    const userMenuRef = useRef(null);
    const myCoursesRef = useRef(null);
    const searchRef = useRef(null);
    const [courseThumbs, setCourseThumbs] = useState({});

    const location = useLocation();
    const navigate = useNavigate();

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isSubRoute = pathSegments.length > 1;

    const handleGoBack = () => {
        if (location.state?.fromCourseLearn) {
            navigate('/');
        } else {
            navigate(-1);
        }
    };

    const handleAuthForm = type => {
        setToggleAuthForm(type);
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    const handleToggleTypeMenu = type => {
        navigate(`/${type}`);
        setShowUserMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = event => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (myCoursesRef.current && !myCoursesRef.current.contains(event.target)) {
                setShowMyCourses(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ courses: [], blogs: [] });
            setShowSearchDropdown(false);
            return;
        }

        setSearching(true);
        const timer = setTimeout(async () => {
            try {
                const [coursesRes, blogsRes] = await Promise.all([
                    courseService.searchCourses(searchQuery, 1, 3),
                    blogService.searchBlogs(searchQuery, 3),
                ]);

                setSearchResults({
                    courses: coursesRes?.courses || [],
                    blogs: blogsRes.data?.data?.blogs || [],
                });
                setShowSearchDropdown(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults({ courses: [], blogs: [] });
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (!showMyCourses) return;
        if (!user?.enrolledCourses || user.enrolledCourses.length === 0) return;

        const missing = user.enrolledCourses.map(c => c.slug).filter(s => s && !courseThumbs[s]);

        if (missing.length === 0) return;

        const fetchThumbs = async () => {
            try {
                const results = await Promise.all(
                    missing.map(async slug => {
                        try {
                            const data = await courseService.getCourseBySlug(slug);
                            return { slug, image: data?.image || data?.thumbnail || null };
                        } catch {
                            return { slug, image: null };
                        }
                    })
                );

                setCourseThumbs(prev => {
                    const next = { ...prev };
                    results.forEach(r => {
                        if (r.slug) next[r.slug] = r.image;
                    });
                    return next;
                });
            } catch {
                // Thumbnail loading is optional and should not block the header.
            }
        };

        fetchThumbs();
    }, [showMyCourses, user, courseThumbs]);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="mx-auto px-4 md:px-7 py-3 flex items-center gap-3">
                {/* LEFT: Logo + back */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        to="/"
                        className="h-10 w-10 rounded-md bg-linear-to-br from-orange-400 to-orange-600 text-white grid place-items-center text-2xl font-bold"
                    >
                        E
                    </Link>

                    {isSubRoute ? (
                        <button
                            onClick={handleGoBack}
                            className="hidden md:flex items-center justify-center text-xs gap-1 text-[#808990] font-semibold cursor-pointer group"
                            title="Quay lại"
                        >
                            <svg
                                data-prefix="fas"
                                data-icon="chevron-left"
                                role="img"
                                viewBox="0 0 320 512"
                                aria-hidden="true"
                                className="w-2.5 h-2.5 group-hover:-translate-x-1 transition-transform duration-300"
                            >
                                <path
                                    fill="currentColor"
                                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                                ></path>
                            </svg>
                            <span className="uppercase">Quay lại</span>
                        </button>
                    ) : (
                        <Link to="/" className="text-sm lg:block hidden font-bold tracking-wide">
                            EduMaster
                        </Link>
                    )}
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="relative w-full max-w-[420px]" ref={searchRef}>
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                            placeholder="Tìm kiếm khóa học, bài viết..."
                            className="w-full h-10 rounded-full bg-gray-100 pl-4 pr-20 text-[13px] outline-none focus:ring-2 focus:ring-[#f54a00]/60 border-2 border-gray-200"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setShowSearchDropdown(false);
                                }}
                                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        )}
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            {searching ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                            )}
                        </span>
                        <SearchDropdown
                            searchQuery={searchQuery}
                            results={searchResults}
                            onClose={() => setShowSearchDropdown(false)}
                            isVisible={showSearchDropdown}
                        />
                    </div>
                </div>

                {/* RIGHT: User actions */}
                <div className="ml-auto flex items-center gap-3 shrink-0 justify-end">
                    {!loading && (
                        <>
                            {isAuthenticated && user ? (
                                <>
                                    {/* My courses */}
                                    <div className="relative" ref={myCoursesRef}>
                                        <button
                                            onClick={() => setShowMyCourses(!showMyCourses)}
                                            className="hidden md:inline-flex items-center text-[13px] font-medium text-[#333] pr-4 cursor-pointer whitespace-nowrap"
                                        >
                                            Khóa học của tôi
                                        </button>

                                        {showMyCourses && (
                                            <div className="absolute right-0 mt-2 min-w-[380px] bg-white rounded-lg shadow-lg border p-4 border-gray-200 z-50">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className="text-sm font-semibold">
                                                        Khóa học của tôi
                                                    </h4>
                                                    <Link
                                                        to="/my-courses"
                                                        onClick={() => setShowMyCourses(false)}
                                                        className="text-xs text-[#f05123] hover:underline"
                                                    >
                                                        Xem tất cả
                                                    </Link>
                                                </div>

                                                {user.enrolledCourses?.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {user.enrolledCourses.map(course => {
                                                            const thumb =
                                                                course.thumbnail ||
                                                                course.image ||
                                                                courseThumbs[course.slug];

                                                            const enrolledText =
                                                                course.progress > 0
                                                                    ? `${course.progress}% hoàn thành`
                                                                    : 'Bạn chưa học khóa này';

                                                            return (
                                                                <Link
                                                                    key={
                                                                        course.courseId ||
                                                                        course.slug
                                                                    }
                                                                    to={`/courses/${course.slug}`}
                                                                    onClick={() =>
                                                                        setShowMyCourses(false)
                                                                    }
                                                                    className="flex gap-3 transition"
                                                                >
                                                                    <img
                                                                        src={
                                                                            thumb ||
                                                                            assets.default_avatar
                                                                        }
                                                                        alt={course.title}
                                                                        className="w-30 min-h-15 rounded-md object-cover"
                                                                        onError={e =>
                                                                            (e.target.src =
                                                                                assets.default_avatar)
                                                                        }
                                                                    />

                                                                    <div className="flex-1 space-y-1">
                                                                        <p className="text-[13px] font-medium text-gray-900 truncate">
                                                                            {course.title}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 truncate">
                                                                            {enrolledText}
                                                                        </p>

                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-[#f05123] h-2 rounded-full"
                                                                                style={{
                                                                                    width: `${
                                                                                        course.progress ||
                                                                                        0
                                                                                    }%`,
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-600">
                                                        Bạn chưa đăng ký khóa học nào
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Notifications */}
                                    <button
                                        className="relative w-9 h-9 flex items-center justify-center cursor-pointer mr-2"
                                        title="Thông báo"
                                    >
                                        <FontAwesomeIcon
                                            icon={faBell}
                                            className="text-[#707070] text-xl hover:text-[#333] transition-colors duration-300"
                                        />
                                    </button>

                                    {/* User menu */}
                                    <div className="relative" ref={userMenuRef}>
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="w-7 h-7 rounded-full overflow-hidden cursor-pointer"
                                            title={user.fullName}
                                        >
                                            <img
                                                src={user.avatar || assets.default_avatar}
                                                alt={user.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>

                                        {showUserMenu && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border p-4 border-gray-200 pb-2 z-50">
                                                <div className="border-b border-gray-100 pb-4 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                                        <img
                                                            src={
                                                                user.avatar || assets.default_avatar
                                                            }
                                                            alt={user.fullName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {user.fullName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <ul className="border-b border-gray-100 space-y-4 py-3">
                                                    <li
                                                        className="block text-[13px] text-gray-600 hover:text-gray-700 md:hidden cursor-pointer"
                                                        onClick={() =>
                                                            handleToggleTypeMenu('my-courses')
                                                        }
                                                    >
                                                        Khoá học của tôi
                                                    </li>
                                                    <li
                                                        className="block text-[13px] text-gray-600 hover:text-gray-700 cursor-pointer"
                                                        onClick={() =>
                                                            handleToggleTypeMenu('blog/create')
                                                        }
                                                    >
                                                        Viết blog
                                                    </li>
                                                    <li
                                                        className="block text-[13px] text-gray-600 hover:text-gray-700 cursor-pointer"
                                                        onClick={() =>
                                                            handleToggleTypeMenu('my-blog-posts')
                                                        }
                                                    >
                                                        Bài viết của tôi
                                                    </li>
                                                    <li
                                                        className="block text-[13px] text-gray-600 hover:text-gray-700 cursor-pointer"
                                                        onClick={() =>
                                                            handleToggleTypeMenu('saved-blog-posts')
                                                        }
                                                    >
                                                        Bài viết đã lưu
                                                    </li>
                                                </ul>

                                                <div className="py-3 space-y-4">
                                                    <button
                                                        className="block w-full text-left text-[13px] text-gray-600 hover:text-gray-700 cursor-pointer"
                                                        onClick={() =>
                                                            handleToggleTypeMenu('settings')
                                                        }
                                                    >
                                                        Cài đặt
                                                    </button>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left text-[13px] text-gray-600 hover:text-gray-700 cursor-pointer"
                                                    >
                                                        Đăng xuất
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="hidden md:inline-flex h-9 items-center gap-2 rounded-full px-4 font-semibold text-sm cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                                        onClick={() => handleAuthForm('signup')}
                                    >
                                        Đăng ký
                                    </button>

                                    <button
                                        className="inline-flex h-9 items-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 px-4 text-sm font-semibold text-white hover:brightness-95 whitespace-nowrap"
                                        onClick={() => handleAuthForm('login')}
                                    >
                                        Đăng nhập
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {toggleAuthForm && (
                <AuthForm typeAuth={toggleAuthForm} onClose={() => setToggleAuthForm(null)} />
            )}
        </header>
    );
};

export default Header;
