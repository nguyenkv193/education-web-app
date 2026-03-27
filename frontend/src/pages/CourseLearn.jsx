/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faChevronLeft,
  faCirclePlay,
  faClock,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faFile,
  faChevronRight,
  faArrowRight,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import { useAuth } from "../contexts/AuthContext";

export default function CourseLearn() {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const { checkAuth, updateEnrolledCourseProgress } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedChapters, setExpandedChapters] = useState(new Set([0]));
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load course and enrollment on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course details
        const courseData = await courseService.getCourseLessonDetail(courseSlug);
        setCourse(courseData);

        // Fetch enrollment progress
        if (courseData?._id) {
          try {
            const enrollmentData = await enrollmentService.getEnrollment(courseData._id);
            if (enrollmentData?.completedLessons) {
              // Ensure completedLessons serves strings for consistent comparison
              setCompletedLessons(new Set(enrollmentData.completedLessons));
            }
          } catch (enrollErr) {
            console.log("User not enrolled or error fetching enrollment", enrollErr);
            // If enrollment not found (404), try to auto-enroll
            if (enrollErr.message && (enrollErr.message.includes("404") || enrollErr.message.includes("Không tìm thấy"))) {
              try {
                console.log("Auto-enrolling user...");
                await enrollmentService.enrollCourse(courseData._id);
                // Retry fetch enrollment or just set empty state
                setCompletedLessons(new Set());
              } catch (autoEnrollErr) {
                // If error is "Already enrolled" (400), treat as success and retry fetch
                if (autoEnrollErr.response?.status === 400 || autoEnrollErr.message?.includes("đã đăng ký")) {
                  console.log("User already enrolled, retrying fetch...");
                  const retryEnrollment = await enrollmentService.getEnrollment(courseData._id);
                  if (retryEnrollment?.completedLessons) {
                    setCompletedLessons(new Set(retryEnrollment.completedLessons));
                  }
                } else {
                  console.error("Failed to auto-enroll", autoEnrollErr);
                }
              }
            }
          }
        }
      } catch (err) {
        setError(err.message || "Không thể tải khóa học");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseSlug]);

  // Refresh user auth after ~5 seconds to show newly enrolled course in Header
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 5000);

    return () => clearTimeout(timer);
  }, [checkAuth]);

  const normalizedChapters = useMemo(() => {
    if (!course?.chapters) return [];
    return course.chapters.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons || [],
    }));
  }, [course]);

  const getAllLessons = () => {
    const lessons = [];
    normalizedChapters.forEach((chapter, chapterIdx) => {
      chapter.lessons.forEach((lesson, lessonIdx) => {
        lessons.push({
          ...lesson,
          id: lesson._id || lesson.id,
          chapterIdx,
          chapterTitle: chapter.title,
          lessonIdx,
        });
      });
    });
    return lessons;
  };

  const allLessons = getAllLessons();
  const currentLesson =
    allLessons.find((l) => String(l.id) === String(lessonId)) ||
    allLessons[0] ||
    null;
  const [previousChapterIdx, setPreviousChapterIdx] = useState(null);

  useEffect(() => {
    if (currentLesson) {
      setCurrentLessonId(currentLesson.id);

      if (previousChapterIdx !== currentLesson.chapterIdx) {
        setExpandedChapters(
          (prev) => new Set([...prev, currentLesson.chapterIdx])
        );
        setPreviousChapterIdx(currentLesson.chapterIdx);
      }
    }
  }, [lessonId, currentLesson, previousChapterIdx]);

  // Supress YouTube console noise
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    const filterMessage = (msg) => {
      const str = String(msg);
      return str.includes("youtube") ||
        str.includes("doubleclick") ||
        str.includes("blocked by CORS") ||
        str.includes("Timed out") ||
        str.includes("base.js");
    };

    console.error = (...args) => {
      if (args.some(arg => filterMessage(arg))) return;
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      if (args.some(arg => filterMessage(arg))) return;
      originalWarn.apply(console, args);
    };

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, []);

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

  const handleLessonClick = (lesson) => {
    navigate(`/courses/${courseSlug}/learn/${lesson.id}`);
  };

  const getPreviousLesson = () => {
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  };

  const getNextLesson = () => {
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const handlePreviousLesson = () => {
    const prevLesson = getPreviousLesson();
    if (prevLesson) {
      handleLessonClick(prevLesson);
    }
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleLessonClick(nextLesson);
    }
  };

  useEffect(() => {
    if (currentLessonId && !completedLessons.has(currentLessonId) && course?._id) {
      const timer = setTimeout(async () => {
        try {
          // Optimistic update
          setCompletedLessons((prev) => new Set([...prev, currentLessonId]));

          // Call API to persist
          await enrollmentService.markLessonAsComplete(course._id, currentLessonId);

          // Sync with Auth Context for Header update
          updateEnrolledCourseProgress(
            course.slug,
            Math.round(((completedLessons.size + 1) / allLessons.length) * 100)
          );
        } catch (err) {
          console.error("Failed to mark lesson complete", err);
          // Revert if failed (optional, but good practice)
          setCompletedLessons(prev => {
            const newSet = new Set(prev);
            newSet.delete(currentLessonId);
            return newSet;
          });
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentLessonId, completedLessons, course]);

  if (loading) {
    return (
      <div className="min-h-screen py-10 px-4 flex items-center justify-center text-gray-600">
        Đang tải khóa học...
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

  const progressPercentage =
    allLessons.length === 0
      ? 0
      : Math.round((completedLessons.size / allLessons.length) * 100);

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // Handle YouTube URLs
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }

    return url;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#29303b] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate(`/courses/${courseSlug}`, {
                state: { fromCourseLearn: true },
              })
            }
            className="cursor-pointer w-15 h-[50px] hover:bg-[#0000001a] transition-colors duration-300"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-sm font-bold"
            />
          </button>
          <Link
            to="/"
            className="w-[30px] h-[30px] rounded-md bg-linear-to-br from-orange-400 to-orange-600 text-white grid place-items-center text-lg "
          >
            E
          </Link>
          <p className="text-sm font-bold ml-2">{course.title}</p>
        </div>
        <div className="flex items-center gap-8 pr-8">
          <div className="flex items-center gap-2">
            {/* Circular Progress */}
            <div className="relative w-[34px] h-[34px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#4d4f50"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#f05123"
                  strokeWidth="2"
                  strokeDasharray={`${(progressPercentage * 100.53) / 100
                    } 100.53`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-semibold">
                  {progressPercentage}%
                </span>
              </div>
            </div>
            <span className="text-xs">
              {completedLessons.size}/{allLessons.length} bài học
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs cursor-pointer">
            <FontAwesomeIcon icon={faFile} />
            <span>Ghi chú</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] relative">
        {/* Backdrop Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content - Video Player */}
        <div
          className={`${isSidebarOpen ? "lg:w-[77%] w-full" : "w-full"
            } bg-black flex flex-col overflow-y-auto transition-all duration-300`}
        >
          {/* Video Player - Fixed Height */}
          <div className="w-full bg-black relative flex items-center justify-center">
            <div className="w-full max-w-7xl aspect-video">
              {currentLesson?.videoUrl ? (
                <iframe
                  src={getEmbedUrl(currentLesson.videoUrl)}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentLesson.title}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faCirclePlay}
                      className="text-white text-6xl mb-4 opacity-80"
                    />
                    <p className="text-white text-lg">
                      Video: {currentLesson?.title}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Thời lượng: {currentLesson?.duration}
                    </p>
                    <p className="text-gray-500 text-xs mt-4">
                      (Hiện tại chưa có video cho khoá học này.)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentLesson?.title}
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                {currentLesson?.chapterTitle}
              </p>

              {/* Lesson Description */}
              {currentLesson?.description && (
                <div className="mt-6 pt-3">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Nội dung bài học
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentLesson.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div
          className={`
                        fixed lg:static top-0 left-0 bottom-0 h-full
                        bg-white border-l border-gray-200 
                        flex flex-col lg:max-h-[calc(100vh-60px)] overflow-hidden
                        z-50 lg:z-auto
                        w-full md:w-1/2 lg:w-auto lg:flex-1
                        transition-transform duration-300 ease-in-out
                        ${isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
            }
                        ${!isSidebarOpen ? "lg:hidden" : ""}
                    `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">
                Nội dung khóa học
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Đóng menu"
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-gray-600"
                />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <span>
                {completedLessons.size}/{allLessons.length} bài học
              </span>
              <span>•</span>
              <span>{progressPercentage}% hoàn thành</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-[#fc4700a1] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto">
            {normalizedChapters.map((chapter, chapterIdx) => {
              const chapterLessons = chapter.lessons || [];
              const completedInChapter = chapterLessons.filter((lesson) =>
                completedLessons.has(lesson._id || lesson.id)
              ).length;

              // Calculate total duration of chapter in mm:ss format
              const calculateChapterDuration = () => {
                let totalSeconds = 0;
                chapterLessons.forEach((lesson) => {
                  const [minutes, seconds] = lesson.duration
                    .split(":")
                    .map(Number);
                  totalSeconds += minutes * 60 + seconds;
                });
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
              };

              return (
                <div key={chapter._id || chapter.id || chapterIdx}>
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapter(chapterIdx)}
                    className="w-full px-4 py-3 bg-[#f7f8fa] hover:bg-gray-100 cursor-pointer transition border-b border-t border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {chapter.title}
                      </h3>
                      <FontAwesomeIcon
                        icon={
                          expandedChapters.has(chapterIdx)
                            ? faChevronUp
                            : faChevronDown
                        }
                        className="text-sm text-gray-700"
                      />
                    </div>

                    <p className="text-xs text-gray-500 text-left mt-1">
                      {completedInChapter}/{chapterLessons.length} |{" "}
                      {calculateChapterDuration()}
                    </p>
                  </button>

                  {/* Lessons */}
                  {expandedChapters.has(chapterIdx) && (
                    <div className="bg-white">
                      {chapterLessons.map((lesson, lessonIdx) => {
                        const lessonId = lesson._id || lesson.id;
                        const isActive = currentLessonId === lessonId;
                        const isCompleted = completedLessons.has(lessonId);
                        const lessonNumber =
                          normalizedChapters
                            .slice(0, chapterIdx)
                            .reduce(
                              (total, ch) => total + (ch.lessons?.length || 0),
                              0
                            ) +
                          lessonIdx +
                          1;

                        return (
                          <button
                            key={lessonId}
                            onClick={() => {
                              handleLessonClick({
                                ...lesson,
                                id: lessonId,
                                chapterTitle: chapter.title,
                              });
                              // Close sidebar on mobile after selecting a lesson
                              if (window.innerWidth < 1024) {
                                setIsSidebarOpen(false);
                              }
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-betweentransition border-l-4 cursor-pointer ${isActive
                              ? "border-[#fc4700a1] bg-[#f0512333]"
                              : "border-transparent"
                              }`}
                          >
                            {/* Lesson Info */}
                            <div className="flex-1 text-left">
                              <p
                                className={`text-sm text-black ${isActive ? "font-medium" : "font-normal"
                                  }`}
                              >
                                {lessonNumber}. {lesson.title}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="text-xs text-gray-400"
                                />
                                <span className="text-xs text-gray-500">
                                  {lesson.duration}
                                </span>
                              </div>
                            </div>
                            {/* Status Icon */}
                            <div className="shrink-0">
                              {isCompleted && (
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  className="text-green-500 text-xs"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Fixed */}
      <div className="flex lg:flex-row flex-row-reverse justify-between items-center gap-4 fixed bottom-0 left-0 right-0 h-[50px] bg-[#f0f0f0] px-4 lg:px-0">
        {/* Left side - empty for balance */}
        <div className="flex-1 lg:block hidden"></div>

        {/* Center - Navigation buttons */}
        <div className="flex gap-2 md:gap-4">
          <button
            onClick={handlePreviousLesson}
            disabled={!getPreviousLesson()}
            className={`px-6 py-1 min-w-30 h-8 rounded-full font-semibold transition uppercase text-xs whitespace-nowrap md:text-sm flex justify-center items-center bg-white border-2 border-[#0093fc] text-[#0093fc] ${!getPreviousLesson()
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
              }`}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="flex items-center justify-center"
            />
            <span>Bài trước</span>
          </button>

          <button
            onClick={handleNextLesson}
            disabled={!getNextLesson()}
            className={`px-6 py-1 min-w-30 h-8 rounded-full font-semibold transition uppercase text-xs whitespace-nowrap md:text-sm flex justify-center items-center bg-[#0093fc] text-white hover:bg-[#0080db] border-2 border-[#0085e4] ${!getNextLesson()
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
              }`}
          >
            <span>Bài tiếp theo</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        {/* Right side - Chapter title & Toggle */}
        <div className="flex-1 flex justify-end lg:flex-row flex-row-reverse items-center gap-2 lg:pr-4">
          <p className="text-sm font-bold sm:block hidden">
            {currentLesson?.chapterTitle}
          </p>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-[38px] h-[38px] p-2 rounded-full bg-white flex items-center justify-center cursor-pointer"
            title={isSidebarOpen ? "Đóng sidebar" : "Mở sidebar"}
          >
            <FontAwesomeIcon
              icon={isSidebarOpen ? faArrowRight : faBars}
              className="text-gray-700"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
