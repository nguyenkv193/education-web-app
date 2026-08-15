/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef } from "react";
import authService from "../services/authService";
import httpClient from "../services/httpClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra authentication khi app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      if (token) {
        // Có token, lấy thông tin user từ localStorage trước
        const savedUser = authService.getUser();
        if (savedUser) {
          setUser(savedUser);
        }

        // Sau đó verify token với server
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch {
          // Token không hợp lệ, xóa và logout
          setUser(null);
          authService.removeToken();
          authService.removeUser();
        }
      }
    } catch (err) {
      console.error("Check auth error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      const { user: userData } = await authService.register(
        fullName,
        email,
        password,
        confirmPassword
      );

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.message || "Đăng ký thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { user: userData } = await authService.login(
        email,
        password
      );

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.message || "Đăng nhập thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(payload);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("updateProfile error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const res = await authService.changePassword(
        currentPassword,
        newPassword
      );
      return res;
    } catch (err) {
      console.error("changePassword error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Debounce timers per course slug to avoid flooding the server with progress updates
  const progressTimersRef = useRef({});

  const updateEnrolledCourseProgress = (slug, progress) => {
    try {
      // Update local state immediately for responsive UI
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        if (Array.isArray(next.enrolledCourses)) {
          next.enrolledCourses = next.enrolledCourses.map((ec) =>
            ec.slug === slug ? { ...ec, progress } : ec
          );
        }
        // persist into localStorage as well
        try {
          authService.saveUser(next);
        } catch (err) {
          console.warn("Failed to save user to localStorage", err);
        }
        return next;
      });

      // Debounce server persistence per slug
      const existing = progressTimersRef.current[slug];
      if (existing) clearTimeout(existing);

      progressTimersRef.current[slug] = setTimeout(async () => {
        try {
          const payload = { slug, progress };
          await httpClient.post(
            "/api/auth/enroll/progress",
            payload
          );

          // After successful persist, refresh auth to ensure server-side sync
          try {
            await checkAuth();
          } catch (err) {
            console.warn("checkAuth after progress persist failed", err);
          }
        } catch (err) {
          console.warn(
            "[updateEnrolledCourseProgress] Backend persist failed",
            err
          );
        } finally {
          // clear timer reference
          delete progressTimersRef.current[slug];
        }
      }, 1500);
    } catch (err) {
      console.error("[updateEnrolledCourseProgress] error", err);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    clearError,
    checkAuth,
    updateEnrolledCourseProgress,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
