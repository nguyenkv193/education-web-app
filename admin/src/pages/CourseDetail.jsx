import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import chapterService from '../services/chapterService';
import lessonService from '../services/lessonService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faEdit,
    faTrash,
    faChevronDown,
    faChevronUp,
    faSave,
    faTimes,
    faBook,
    faVideo,
    faClock,
    faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState(new Set());
    const [editingChapter, setEditingChapter] = useState(null);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [showNewChapterForm, setShowNewChapterForm] = useState(false);
    const [globalLoadingMessage, setGlobalLoadingMessage] = useState('');

    useEffect(() => {
        fetchCourseAndChapters();
    }, [id]);

    const fetchCourseAndChapters = async () => {
        try {
            setLoading(true);
            const [courseRes, chaptersRes] = await Promise.all([
                courseService.getCourseById(id),
                chapterService.getChaptersByCourse(id),
            ]);
            setCourse(courseRes.data);
            setChapters(chaptersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleChapter = chapterId => {
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    const handleCreateChapter = async () => {
        if (!newChapterTitle.trim()) {
            alert('Vui lòng nhập tên chapter');
            return;
        }

        try {
            await chapterService.createChapter({
                courseId: id,
                title: newChapterTitle,
                description: '',
                orderIndex: chapters.length,
            });
            setNewChapterTitle('');
            setShowNewChapterForm(false);
            fetchCourseAndChapters();
        } catch (error) {
            console.error('Error creating chapter:', error);
            alert('Có lỗi xảy ra khi tạo chapter');
        }
    };

    const handleUpdateChapter = async (chapterId, title) => {
        try {
            await chapterService.updateChapter(chapterId, { title });
            setEditingChapter(null);
            fetchCourseAndChapters();
        } catch (error) {
            console.error('Error updating chapter:', error);
            alert('Có lỗi xảy ra khi cập nhật chapter');
        }
    };

    const handleDeleteChapter = async chapterId => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa chapter này? Tất cả bài học sẽ bị xóa.'))
            return;

        try {
            await chapterService.deleteChapter(chapterId);
            fetchCourseAndChapters();
        } catch (error) {
            console.error('Error deleting chapter:', error);
            alert('Có lỗi xảy ra khi xóa chapter');
        }
    };

    const handleCreateLesson = async (chapterId, lessonData) => {
        try {
            setGlobalLoadingMessage('Đang thêm bài học mới...');
            await lessonService.createLesson({
                ...lessonData,
                chapterId,
                courseId: id,
            });
            fetchCourseAndChapters();
        } catch (error) {
            console.error('Error creating lesson:', error);
            alert('Có lỗi xảy ra khi tạo bài học');
        } finally {
            setGlobalLoadingMessage('');
        }
    };

    const handleUpdateLesson = async (lessonId, lessonData) => {
        try {
            setGlobalLoadingMessage('Đang cập nhật bài học...');
            await lessonService.updateLesson(lessonId, lessonData);
            fetchCourseAndChapters();
        } catch (error) {
            console.error('Error updating lesson:', error);
            alert('Có lỗi xảy ra khi cập nhật bài học');
        } finally {
            setGlobalLoadingMessage('');
        }
    };

    const handleDeleteLesson = async lessonId => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;

        try {
            setGlobalLoadingMessage('Đang xóa bài học...');
            await lessonService.deleteLesson(lessonId);
            fetchCourseAndChapters();
        } catch (error) {
            console.error('Error deleting lesson:', error);
            alert('Có lỗi xảy ra khi xóa bài học');
        } finally {
            setGlobalLoadingMessage('');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                <p className="text-gray-500 ml-4">Đang tải...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <FontAwesomeIcon icon={faBook} className="text-gray-300 text-5xl mb-4" />
                <p className="text-gray-500 font-medium">Không tìm thấy khóa học</p>
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

            {/* Course Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full md:w-48 h-48 rounded-xl object-cover shadow-md"
                    />
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {course.title}
                                </h1>
                                <p className="text-gray-600 mb-4">{course.description}</p>
                            </div>
                            <button
                                onClick={() => navigate(`/admin/courses/${id}/edit`)}
                                className="px-4 py-2 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faEdit} />
                                <span className="hidden sm:inline">Chỉnh sửa</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-xs text-purple-600 font-medium mb-1">Danh mục</p>
                                <p className="text-sm font-bold text-gray-900">{course.category}</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-600 font-medium mb-1">Cấp độ</p>
                                <p className="text-sm font-bold text-gray-900">{course.level}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-xs text-green-600 font-medium mb-1">Bài học</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {course.lessons || 0}
                                </p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-xs text-orange-600 font-medium mb-1">
                                    Trạng thái
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                    {course.status === 'published'
                                        ? 'Đã xuất bản'
                                        : course.status === 'draft'
                                            ? 'Nháp'
                                            : 'Lưu trữ'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters Management */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {globalLoadingMessage && (
                    <div className="mb-4 flex items-center gap-3 text-sm text-orange-600 bg-orange-50 border border-orange-100 px-4 py-3 rounded-xl">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                        {globalLoadingMessage}
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Quản lý chapters và bài học của khóa học
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewChapterForm(true)}
                        className="px-4 py-2 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="hidden sm:inline">Thêm Chapter</span>
                    </button>
                </div>

                {/* New Chapter Form */}
                {showNewChapterForm && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newChapterTitle}
                                onChange={e => setNewChapterTitle(e.target.value)}
                                placeholder="Tên chapter mới..."
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                onKeyPress={e => e.key === 'Enter' && handleCreateChapter()}
                            />
                            <button
                                onClick={handleCreateChapter}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewChapterForm(false);
                                    setNewChapterTitle('');
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Chapters List */}
                {chapters.length === 0 ? (
                    <div className="text-center py-12">
                        <FontAwesomeIcon icon={faBook} className="text-gray-300 text-5xl mb-4" />
                        <p className="text-gray-500 font-medium">Chưa có chapter nào</p>
                        <p className="text-gray-400 text-sm mt-1">Hãy thêm chapter đầu tiên!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chapters.map((chapter, index) => (
                            <ChapterItem
                                key={chapter._id}
                                chapter={chapter}
                                index={index}
                                isExpanded={expandedChapters.has(chapter._id)}
                                onToggle={() => toggleChapter(chapter._id)}
                                onUpdate={handleUpdateChapter}
                                onDelete={handleDeleteChapter}
                                onCreateLesson={handleCreateLesson}
                                onDeleteLesson={handleDeleteLesson}
                                onUpdateLesson={handleUpdateLesson}
                                editingChapter={editingChapter}
                                setEditingChapter={setEditingChapter}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Chapter Item Component
function ChapterItem({
    chapter,
    index,
    isExpanded,
    onToggle,
    onUpdate,
    onDelete,
    onCreateLesson,
    onDeleteLesson,
    onUpdateLesson,
    editingChapter,
    setEditingChapter,
}) {
    const [editTitle, setEditTitle] = useState(chapter.title);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [newLesson, setNewLesson] = useState({
        title: '',
        duration: '0:00',
        videoUrl: '',
        description: '',
        isFree: false,
    });
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [lessonDraft, setLessonDraft] = useState(null);

    const handleSaveChapter = () => {
        onUpdate(chapter._id, editTitle);
    };

    const handleCreateLesson = () => {
        if (!newLesson.title.trim()) {
            alert('Vui lòng nhập tên bài học');
            return;
        }
        onCreateLesson(chapter._id, newLesson);
        setNewLesson({ title: '', duration: '0:00', videoUrl: '', description: '', isFree: false });
        setShowLessonForm(false);
    };

    const handleStartEditLesson = lesson => {
        setEditingLessonId(lesson._id);
        setLessonDraft({
            title: lesson.title || '',
            duration: lesson.duration || '0:00',
            videoUrl: lesson.videoUrl || '',
            description: lesson.description || '',
            isFree: !!lesson.isFree,
        });
    };

    const handleCancelEditLesson = () => {
        setEditingLessonId(null);
        setLessonDraft(null);
    };

    const handleSaveLesson = () => {
        if (!lessonDraft.title.trim()) {
            alert('Tên bài học không được để trống');
            return;
        }
        onUpdateLesson(editingLessonId, lessonDraft);
        handleCancelEditLesson();
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Chapter Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center gap-3 flex-1">
                    <button
                        onClick={onToggle}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                    {editingChapter === chapter._id ? (
                        <div className="flex gap-2 flex-1">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                onKeyPress={e => e.key === 'Enter' && handleSaveChapter()}
                            />
                            <button
                                onClick={handleSaveChapter}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                                onClick={() => {
                                    setEditingChapter(null);
                                    setEditTitle(chapter.title);
                                }}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1">
                                <span className="font-bold text-gray-900 text-base">
                                    Chapter {index + 1}: {chapter.title}
                                </span>
                                <span className="ml-3 text-sm text-gray-500">
                                    ({chapter.lessonsCount || 0} bài học)
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {editingChapter !== chapter._id && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditingChapter(chapter._id)}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faEdit} className="text-sm" />
                        </button>
                        <button
                            onClick={() => onDelete(chapter._id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                    </div>
                )}
            </div>

            {/* Lessons */}
            {isExpanded && (
                <div className="p-4 bg-white space-y-3">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                        chapter.lessons.map((lesson, lessonIndex) => (
                            <div
                                key={lesson._id}
                                className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:shadow-sm transition-shadow"
                            >
                                {editingLessonId === lesson._id ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={lessonDraft.title}
                                                onChange={e =>
                                                    setLessonDraft(prev => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                placeholder="Tên bài học"
                                                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={lessonDraft.duration}
                                                onChange={e =>
                                                    setLessonDraft(prev => ({
                                                        ...prev,
                                                        duration: e.target.value,
                                                    }))
                                                }
                                                placeholder="Thời lượng (mm:ss)"
                                                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                        <input
                                            type="url"
                                            value={lessonDraft.videoUrl}
                                            onChange={e =>
                                                setLessonDraft(prev => ({
                                                    ...prev,
                                                    videoUrl: e.target.value,
                                                }))
                                            }
                                            placeholder="URL video..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                        />
                                        <textarea
                                            value={lessonDraft.description}
                                            onChange={e =>
                                                setLessonDraft(prev => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            placeholder="Mô tả bài học..."
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveLesson}
                                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                                            >
                                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                                Lưu
                                            </button>
                                            <button
                                                onClick={handleCancelEditLesson}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900 mb-1">
                                                {lessonIndex + 1}. {lesson.title}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon
                                                        icon={faClock}
                                                        className="text-xs"
                                                    />
                                                    {lesson.duration}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon
                                                        icon={faVideo}
                                                        className="text-xs"
                                                    />
                                                    {lesson.videoUrl ? 'Có video' : 'Chưa có video'}
                                                </span>
                                                {lesson.isFree && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                            Miễn phí
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStartEditLesson(lesson)}
                                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="text-sm"
                                                />
                                            </button>
                                            <button
                                                onClick={() => onDeleteLesson(lesson._id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-sm"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            Chưa có bài học nào
                        </div>
                    )}

                    {/* New Lesson Form */}
                    {showLessonForm ? (
                        <div className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-300 space-y-3">
                            <input
                                type="text"
                                value={newLesson.title}
                                onChange={e =>
                                    setNewLesson({ ...newLesson, title: e.target.value })
                                }
                                placeholder="Tên bài học..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={newLesson.duration}
                                    onChange={e =>
                                        setNewLesson({ ...newLesson, duration: e.target.value })
                                    }
                                    placeholder="Thời lượng (mm:ss)"
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                />
                                <input
                                    type="url"
                                    value={newLesson.videoUrl}
                                    onChange={e =>
                                        setNewLesson({ ...newLesson, videoUrl: e.target.value })
                                    }
                                    placeholder="URL video..."
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                                />
                            </div>
                            <textarea
                                value={newLesson.description}
                                onChange={e =>
                                    setNewLesson({ ...newLesson, description: e.target.value })
                                }
                                placeholder="Mô tả bài học..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreateLesson}
                                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                                >
                                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                                    Lưu
                                </button>
                                <button
                                    onClick={() => {
                                        setShowLessonForm(false);
                                        setNewLesson({
                                            title: '',
                                            duration: '0:00',
                                            videoUrl: '',
                                            description: '',
                                        });
                                    }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowLessonForm(true)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Thêm bài học
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
