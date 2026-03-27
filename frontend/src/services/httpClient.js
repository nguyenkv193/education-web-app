import axios from "axios";

// Lấy base URL từ environment variable hoặc sử dụng default
// Sử dụng API Gateway (port 5175) thay vì gọi trực tiếp đến backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5175";

// Tạo axios instance
const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
});

// Request interceptor - Tự động thêm JWT token vào headers
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý errors
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server trả về response với status code ngoài 2xx
      const { status, data } = error.response;

      if (status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        // Có thể redirect về login page nếu cần
        // window.location.href = '/';
      }

      // Trả về error message từ server
      const errorMessage = data?.message || "Đã có lỗi xảy ra";
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      return Promise.reject(new Error("Không thể kết nối đến server"));
    } else {
      // Lỗi khác
      return Promise.reject(error);
    }
  }
);

export default httpClient;
