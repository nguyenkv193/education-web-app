import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import assets from '../assets';
import courseService from '../services/courseService';
import SectionHeader from '../components/SectionHeader';

export default function MyCourses() {
    const { user } = useAuth();
    const [courseThumbs, setCourseThumbs] = useState({});

    const courses = user?.enrolledCourses || [];

    // Fetch missing thumbnails when component mounts or courses change
    useEffect(() => {
        if (courses.length === 0) return;

        const missing = courses.map(c => c.slug).filter(s => s && !courseThumbs[s]);

        if (missing.length === 0) return;

        const fetchThumbs = async () => {
            try {
                const promises = missing.map(async slug => {
                    try {
                        const data = await courseService.getCourseBySlug(slug);
                        return { slug, image: data?.image || data?.thumbnail || null };
                    } catch (err) {
                        console.log(err);
                        return { slug, image: null };
                    }
                });

                const results = await Promise.all(promises);
                setCourseThumbs(prev => {
                    const next = { ...prev };
                    results.forEach(r => {
                        if (r && r.slug) next[r.slug] = r.image;
                    });
                    return next;
                });
            } catch (err) {
                console.log(err);
                // ignore
            }
        };

        fetchThumbs();
    }, [courses]);

    return (
        <div className="min-h-screen space-y-8 md:px-11 px-3">
            <div className="mt-8 mb-10">
                <SectionHeader title="Khóa học của tôi" />
                <p className="text-gray-700 leading-relaxed max-w-[840px] my-4 text-sm mt-10">
                    Bạn chưa hoàn thành khóa học nào.
                </p>
            </div>
            {courses.length === 0 ? (
                <p className="text-gray-600">Bạn chưa đăng ký khóa học nào.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {courses.map(c => {
                        const thumb = c.thumbnail || c.image || courseThumbs[c.slug];

                        const progress = Number(c.progress ?? c.progressPercentage ?? 0);

                        const enrolledText =
                            progress > 0 ? `${progress}% hoàn thành` : 'Bạn chưa học khóa này';

                        return (
                            <Link
                                key={c.courseId || c.slug}
                                to={`/courses/${c.slug}`}
                                className="flex gap-4 p-4 border border-gray-300 rounded-lg hover:shadow transition"
                            >
                                <img
                                    src={thumb || assets.default_avatar}
                                    alt={c.title}
                                    className="w-28 h-20 object-cover rounded-md"
                                    onError={e => {
                                        e.target.src = assets.default_avatar;
                                    }}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm">{c.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        {enrolledText}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Đăng ký:{' '}
                                        {new Date(c.enrolledAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                        <div
                                            className="bg-[#f05123] h-2 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
