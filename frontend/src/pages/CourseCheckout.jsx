import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

export default function CourseCheckout() {
  const { courseSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIfNeeded = async () => {
      if (course) return;
      try {
        const data = await courseService.getCourseBySlug(courseSlug);
        setCourse(data);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin khóa học");
      }
    };

    fetchIfNeeded();
  }, [courseSlug, course]);

  const handlePay = async () => {
    if (!course) return;
    setLoading(true);
    setError("");
    try {
      // Simulate payment processing delay
      await new Promise((r) => setTimeout(r, 1200));

      // After (fake) payment success, enroll the user
      await courseService.enrollCourse({
        courseId: course._id || course.id,
        title: course.title,
        slug: course.slug || courseSlug,
        thumbnail: course.image || course.thumbnail || null,
      });

      // Navigate to learning page
      navigate(`/courses/${courseSlug}/learn`);
    } catch (err) {
      setError(err.message || "Thanh toán thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto text-center text-gray-600">
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Thanh toán khóa học</h2>

        <div className="flex items-center gap-4">
          <img
            src={course.image || course.thumbnail}
            alt={course.title}
            className="w-28 h-20 object-cover rounded"
          />
          <div>
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-[#f05123]">
              {formatCurrency(course.price)}
            </p>
          </div>
          <div>
            <button
              onClick={handlePay}
              disabled={loading}
              className="bg-[#0093fc] text-white px-4 py-2 rounded font-semibold hover:opacity-90"
            >
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Đây là mô phỏng thanh toán. Khi thanh toán thành công, bạn sẽ được
          đăng ký và chuyển tới giao diện học ngay lập tức.
        </p>
      </div>
    </div>
  );
}
