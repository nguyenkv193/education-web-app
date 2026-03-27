import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import CourseForm from "./pages/CourseForm";
import CourseDetail from "./pages/CourseDetail";
import Analytics from "./pages/Analytics";
import Payments from "./pages/Payments";

export default function App() {
  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Redirect từ "/" về "/admin" */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Courses />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/create"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CourseForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/:id/edit"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CourseForm />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CourseDetail />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Các route tạm thời - hiển thị trang đơn giản */}

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Payments />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
