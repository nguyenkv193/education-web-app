import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../services/courseService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faTrash,
    faSave,
    faTimes,
    faChevronLeft,
    faImage,
} from '@fortawesome/free-solid-svg-icons';

export default function CourseForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        price: 0,
        originalPrice: 0,
        isFree: true,
        level: 'Người mới bắt đầu',
        category: 'Frontend',
        duration: '0 giờ 0 phút',
        learnings: [''],
        requirements: [''],
        status: 'draft',
    });

    useEffect(() => {
        if (isEditMode) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const response = await courseService.getCourseById(id);
            const course = response.data;
            setFormData({
                title: course.title || '',
                description: course.description || '',
                image: course.image || '',
                price: course.price || 0,
                originalPrice: course.originalPrice || 0,
                isFree: course.isFree || false,
                level: course.level || 'Người mới bắt đầu',
                category: course.category || 'Frontend',
                duration: course.duration || '0 giờ 0 phút',
                learnings: course.learnings || [''],
                requirements: course.requirements || [''],
                status: course.status || 'draft',
            });
        } catch (error) {
            console.error('Error fetching course:', error);
            alert('Không thể tải thông tin khóa học');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleArrayChange = (index, value, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }));
    };

    const addArrayItem = field => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], ''],
        }));
    };

    const removeArrayItem = (index, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Vui lòng nhập tên khóa học');
            return;
        }
        if (!formData.description.trim()) {
            alert('Vui lòng nhập mô tả');
            return;
        }
        if (!formData.image.trim()) {
            alert('Vui lòng nhập URL hình ảnh');
            return;
        }

        const cleanedData = {
            ...formData,
            learnings: formData.learnings.filter(item => item.trim()),
            requirements: formData.requirements.filter(item => item.trim()),
        };

        try {
            setLoading(true);
            if (isEditMode) {
                await courseService.updateCourse(id, cleanedData);
                alert('Cập nhật khóa học thành công!');
            } else {
                await courseService.createCourse(cleanedData);
                alert('Tạo khóa học thành công!');
            }
            navigate('/admin/courses');
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Có lỗi xảy ra khi lưu khóa học');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                <p className="text-gray-500 ml-4">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="lg:p-4 p-3">
            {/* Back Button */}
            <button
                onClick={() => navigate('/admin/courses')}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                <span className="font-medium">Quay lại danh sách</span>
            </button>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    {isEditMode
                        ? 'Cập nhật thông tin khóa học của bạn'
                        : 'Điền thông tin để tạo khóa học mới'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên khóa học <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ví dụ: Khóa học ReactJS từ cơ bản đến nâng cao"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Mô tả chi tiết về khóa học..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL hình ảnh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                            required
                        />
                        {formData.image && (
                            <div className="mt-3">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full max-w-md h-48 object-cover rounded-xl shadow-md"
                                    onError={e => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none bg-white"
                            >
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Full Stack">Full Stack</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cấp độ
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none bg-white"
                            >
                                <option value="Người mới bắt đầu">Người mới bắt đầu</option>
                                <option value="Trung cấp">Trung cấp</option>
                                <option value="Nâng cao">Nâng cao</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            id="isFree"
                            name="isFree"
                            checked={formData.isFree}
                            onChange={handleChange}
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="isFree" className="text-sm font-medium text-gray-900">
                            Khóa học miễn phí
                        </label>
                    </div>

                    {!formData.isFree && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="499000"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá gốc (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    placeholder="999000"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none bg-white"
                        >
                            <option value="draft">Nháp</option>
                            <option value="published">Đã xuất bản</option>
                            <option value="archived">Lưu trữ</option>
                        </select>
                    </div>
                </div>

                {/* Learnings */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Bạn sẽ học được gì</h2>
                        <button
                            type="button"
                            onClick={() => addArrayItem('learnings')}
                            className="px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-2 font-medium"
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                            Thêm
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.learnings.map((learning, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={learning}
                                    onChange={e =>
                                        handleArrayChange(index, e.target.value, 'learnings')
                                    }
                                    placeholder="Ví dụ: Hiểu về React Hooks"
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                />
                                {formData.learnings.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'learnings')}
                                        className="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Requirements */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Yêu cầu</h2>
                        <button
                            type="button"
                            onClick={() => addArrayItem('requirements')}
                            className="px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-2 font-medium"
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                            Thêm
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.requirements.map((requirement, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={requirement}
                                    onChange={e =>
                                        handleArrayChange(index, e.target.value, 'requirements')
                                    }
                                    placeholder="Ví dụ: Biết HTML/CSS cơ bản"
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                />
                                {formData.requirements.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'requirements')}
                                        className="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/courses')}
                        className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
                    >
                        <FontAwesomeIcon icon={faSave} />
                        {loading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo khóa học'}
                    </button>
                </div>
            </form>
        </div>
    );
}
