import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPlus,
  faMinus,
  faGaugeHigh,
  faFilm,
  faBatteryFull,
} from "@fortawesome/free-solid-svg-icons";
import courseService from "../services/courseService";

const formatCurrency = (value) => {
  if (value === null || value === undefined) return null;
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  } catch {
    return value;
  }
};

export default function CourseLessonDetail() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await courseService.getCourseLessonDetail(courseSlug);
        if (data) {
          setCourse(data);
        } else {
          setCourse(null);
        }
      } catch (err) {
        setError(err.message || "Không thể tải khóa học");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseSlug]);

  const normalizedChapters = useMemo(() => {
    if (!course?.chapters) return [];
    return course.chapters.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons || [],
    }));
  }, [course]);

  const toggleChapter = (chapterIdx) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterIdx)) {
        newSet.delete(chapterIdx);
      } else {
        newSet.add(chapterIdx);
      }
      return newSet;
    });
  };

  const toggleAllChapters = () => {
    if (!course || !course.chapters) return;

    if (expandedChapters.size === course.chapters.length) {
      setExpandedChapters(new Set());
    } else {
      setExpandedChapters(new Set(course.chapters.map((_, idx) => idx)));
    }
  };

  const handleEnrollAndGo = async () => {
    if (!course) return;

    // Free courses: enroll immediately and navigate to learn
    if (course.isFree) {
      try {
        await courseService.enrollCourse({
          courseId: course._id || course.id,
          title: course.title,
          slug: course.slug || course.slugUrl || courseSlug,
          thumbnail: course.image || course.thumbnail || null,
        });
      } catch (err) {
        console.warn("Enroll error:", err.message || err);
      }
      navigate(`/courses/${courseSlug}/learn`);
      return;
    }

    // Paid courses: route to a simple checkout page where user can pay
    navigate(`/courses/${courseSlug}/checkout`, { state: { course } });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto text-gray-600">
          Đang tải khóa học...
        </div>
      </div>
    );
  }

  if (!course || error) {
    return (
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-sm mb-6 text-blue-600 hover:text-blue-800"
          >
            ← Quay lại
          </button>
          <p className="text-gray-600">{error || "Không tìm thấy khóa học."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:min-h-screen py-4 lg:px-11 px-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Header */}
        <div className="lg:mt-4 mt-2 mb-8 md:col-span-2 flex flex-col gap-6">
          <div>
            <SectionHeader title={course.title} extra />
            <p className="text-sm text-gray-600 mt-4 max-w-2xl">
              {course.description}
            </p>
          </div>

          {/* Learnings */}
          <div>
            {course.learnings && course.learnings.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-black mb-4">
                  Bạn sẽ học được gì?
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {course.learnings.map((learning, idx) => (
                    <div
                      key={idx}
                      className="flex lg:flex-row items-center gap-2"
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="check"
                        role="img"
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-[#f05123]"
                      >
                        <path
                          fill="currentColor"
                          d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"
                        ></path>
                      </svg>
                      <p className="text-sm text-black">{learning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters */}
            <div className="space-y-4 mb-8">
              <div className="mb-6 space-y-2">
                <h3 className="text-xl font-bold text-black">
                  Nội dung khóa học
                </h3>
                <div className="flex justify-between items-center">
                  <ul className="flex sm:flex-row flex-col gap-2 text-sm">
                    <li className="lg:block hidden">
                      <strong className="text-black">
                        {normalizedChapters.length}
                      </strong>{" "}
                      chương
                    </li>
                    <li className="lg:block hidden">•</li>
                    <li>
                      <strong className="text-black">{course.lessons}</strong>{" "}
                      bài học
                    </li>
                    <li className="sm:block hidden">•</li>
                    <li>
                      Thời lượng{" "}
                      <strong className="text-black">{course.duration}</strong>
                    </li>
                  </ul>
                  <p
                    onClick={toggleAllChapters}
                    className="text-sm text-[#f05123] font-semibold cursor-pointer hover:underline"
                  >
                    {expandedChapters.size === course.chapters.length
                      ? "Thu nhỏ tất cả"
                      : "Mở rộng tất cả"}
                  </p>
                </div>
              </div>

              {normalizedChapters.map((chapter, idx) => (
                <div
                  key={chapter._id || chapter.id || idx}
                  className="border-2 border-gray-200 rounded-md overflow-hidden"
                >
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapter(idx)}
                    className="w-full px-6 py-3.5 bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      {expandedChapters.has(idx) ? (
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="text-xs text-[#f05123]"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-xs text-[#f05123]"
                        />
                      )}
                      <h4 className="font-semibold text-base text-gray-900">
                        {chapter.title}
                      </h4>
                    </div>
                    <span className="text-sm">
                      {chapter.lessons?.length || 0} bài học
                    </span>
                  </button>

                  {/* Lessons List */}
                  {expandedChapters.has(idx) &&
                    (() => {
                      const previousLessonsCount = normalizedChapters
                        .slice(0, idx)
                        .reduce(
                          (total, ch) => total + (ch.lessons?.length || 0),
                          0
                        );

                      return (
                        <div className="bg-white border-t-2 border-gray-200">
                          {(chapter.lessons || []).map((lesson, lessonIdx) => {
                            const lessonNumber =
                              previousLessonsCount + lessonIdx + 1;

                            return (
                              <div
                                key={lesson._id || lesson.id || lessonIdx}
                                className={`px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition ${
                                  lessonIdx !== chapter.lessons.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                                }`}
                              >
                                <svg
                                  data-prefix="fas"
                                  data-icon="circle-play"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  aria-hidden="true"
                                  className="w-3.5 h-3.5 text-[#f0512366]"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
                                  ></path>
                                </svg>

                                <div className="flex-1">
                                  <p className="text-sm text-gray-900">
                                    {lessonNumber}. {lesson.title}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <FontAwesomeIcon icon={faClock} />
                                  {lesson.duration}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                </div>
              ))}
            </div>

            {course.learnings && course.learnings.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-black mb-4">
                  Yêu cầu khi tham gia khoá học
                </h3>
                <div className="flex flex-col gap-3">
                  {course.requirements?.map((require, idx) => (
                    <div
                      key={idx}
                      className="flex lg:flex-row items-center gap-2"
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="check"
                        role="img"
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-[#f05123]"
                      >
                        <path
                          fill="currentColor"
                          d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"
                        ></path>
                      </svg>
                      <p className="text-sm text-black">{require}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:block hidden md:col-span-1 lg:pl-10">
          {/* Sidebar */}
          <div className="md:sticky md:top-20 md:self-start flex flex-col">
            {/* Course Image */}
            <div className="rounded-xl overflow-hidden mb-6 relative cursor-pointer">
              <img
                src={course.image}
                alt={course.title}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#1e1e1ce6]"></div>
              {/* Play Icon */}
              <svg
                data-prefix="fas"
                data-icon="circle-play"
                role="img"
                viewBox="0 0 512 512"
                aria-hidden="true"
                className="w-10 h-10 lg:w-15 lg:h-15 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <path
                  fill="currentColor"
                  d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
                ></path>
              </svg>
              {/* Text */}
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm lg:text-base text-white font-semibold z-10 whitespace-nowrap">
                Xem giới thiệu khoá học
              </p>
            </div>

            {course.isFree ? (
              <p className="text-2xl text-center text-[#f05123] mb-4 font-medium">
                Miễn phí
              </p>
            ) : (
              <div className="mx-auto mb-4">
                {course.originalPrice && (
                  <p className="text-gray-600 line-through font-medium text-center">
                    {formatCurrency(course.originalPrice)}
                  </p>
                )}
                <p className="text-2xl text-[#f05123] font-medium text-center">
                  {formatCurrency(course.price)}
                </p>
              </div>
            )}
            {/* CTA Button */}
            <button
              onClick={handleEnrollAndGo}
              className="min-w-[180px] bg-[#0093fc] lg:text-base text-sm hover:opacity-90 cursor-pointer text-white font-semibold py-1 px-4 uppercase rounded-full mb-4 self-center"
            >
              Đăng ký học
            </button>

            {/* Course Stats */}
            <div className="space-y-3 self-center pt-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faGaugeHigh}
                  className="text-sm text-[#494949]"
                />
                <span className="text-[#494949] text-sm">{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faFilm}
                  className="text-sm text-[#494949]"
                />
                <span className="text-[#494949] text-sm ">
                  Tổng số <strong>{course.lessons || 0}</strong> bài học
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-sm text-[#494949]"
                />
                <span className="text-[#494949] text-sm">
                  Thời lượng học <strong>{course.duration}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faBatteryFull}
                  className="text-sm text-[#494949]"
                />
                <span className="text-[#494949] text-sm">
                  Học mọi lúc, mọi nơi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden fixed left-0 right-0 bottom-[77px] border-y border-y-gray-200 px-4 z-50 bg-white py-2.5">
        <button
          onClick={handleEnrollAndGo}
          className="w-full bg-[#0093fc] text-white text-sm font-semibold py-3 uppercase rounded-full cursor-pointer h-8 flex items-center justify-center"
        >
          Đăng ký học
        </button>
      </div>
    </div>
  );
}
