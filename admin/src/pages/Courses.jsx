import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faEdit,
    faTrash,
    faEye,
    faSearch,
    faPlus,
    faFilter,
    faChartLine,
    faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import courseService from '../services/courseService';

const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterIsFree, setFilterIsFree] = useState('');

    useEffect(() => {
        fetchCourses();
    }, [page, filterCategory, filterIsFree]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (filterCategory) filters.category = filterCategory;
            if (filterIsFree !== '') filters.isFree = filterIsFree;

            const response = await courseService.getAllCourses(page, 12, filters);
            setCourses(response.data.courses);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            fetchCourses();
            return;
        }

        try {
            setLoading(true);
            const response = await courseService.searchCourses(searchKeyword, page, 12);
            setCourses(response.data.courses);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error searching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;

        try {
            await courseService.deleteCourse(id);
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Có lỗi xảy ra khi xóa khóa học');
        }
    };

    const stats = [
        {
            label: 'Tổng khóa học',
            value: courses.length,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            icon: faBook,
        },
        {
            label: 'Miễn phí',
            value: courses.filter(c => c.isFree).length,
            color: 'text-green-600',
            bg: 'bg-green-50',
            icon: faChartLine,
        },
        {
            label: 'Trả phí',
            value: courses.filter(c => !c.isFree).length,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            icon: faDollarSign,
        },
    ];

    return (
        <div className="lg:p-4 p-3">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý khóa học</h1>
                <p className="text-gray-500 text-sm">Quản lý tất cả khóa học trong hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    {stat.label}
                                </p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div
                                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                            >
                                <FontAwesomeIcon icon={stat.icon} className={stat.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                            className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all text-sm"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            value={filterCategory}
                            onChange={e => {
                                setFilterCategory(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                        >
                            <option value="">Tất cả danh mục</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Full Stack">Full Stack</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Khác">Khác</option>
                        </select>

                        <select
                            value={filterIsFree}
                            onChange={e => {
                                setFilterIsFree(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                        >
                            <option value="">Tất cả loại</option>
                            <option value="true">Miễn phí</option>
                            <option value="false">Trả phí</option>
                        </select>

                        <button
                            onClick={() => navigate('/admin/courses/create')}
                            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="hidden sm:inline">Thêm khóa học</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                        <p className="text-gray-500 mt-4">Đang tải...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="py-12 text-center">
                        <FontAwesomeIcon icon={faBook} className="text-gray-300 text-5xl mb-4" />
                        <p className="text-gray-500 font-medium">Không có khóa học nào</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Thử thay đổi bộ lọc hoặc tìm kiếm
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Khóa học
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Loại
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Bài học
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {courses.map(course => (
                                    <tr
                                        key={course._id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={course.image}
                                                    alt={course.title}
                                                    className="w-16 h-16 rounded-lg object-cover shadow-sm"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {course.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {course.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${course.isFree
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${course.isFree
                                                            ? 'bg-green-500'
                                                            : 'bg-blue-500'
                                                        }`}
                                                />
                                                {course.isFree ? 'Miễn phí' : 'Trả phí'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {course.lessons || 0}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                bài học
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${course.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : course.status === 'draft'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${course.status === 'published'
                                                            ? 'bg-green-500'
                                                            : course.status === 'draft'
                                                                ? 'bg-yellow-500'
                                                                : 'bg-gray-500'
                                                        }`}
                                                />
                                                {course.status === 'published'
                                                    ? 'Đã xuất bản'
                                                    : course.status === 'draft'
                                                        ? 'Nháp'
                                                        : 'Lưu trữ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/admin/courses/${course._id}`)
                                                    }
                                                    className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex items-center justify-center"
                                                    title="Quản lý"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                        className="text-sm"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/courses/${course._id}/edit`
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
                                                    title="Sửa"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="text-sm"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                                                    title="Xóa"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="text-sm"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Trang <span className="font-semibold">{page}</span> trong tổng số{' '}
                            <span className="font-semibold">{totalPages}</span> trang
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Trước
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium">
                                {page}
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Courses;
