import httpClient from "./httpClient";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user";

class AuthService {
  // Đăng ký tài khoản mới
  async register(fullName, email, password, confirmPassword) {
    const response = await httpClient.post("/api/auth/register", {
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (response.data && response.data.data) {
      const { user, token } = response.data.data;
      this.saveToken(token);
      this.saveUser(user);
      return { user, token };
    }

    throw new Error("Invalid response from server");
  }

  // Đăng nhập
  async login(email, password) {
    const response = await httpClient.post("/api/auth/login", {
      email,
      password,
    });

    if (response.data && response.data.data) {
      const { user, token } = response.data.data;
      this.saveToken(token);
      this.saveUser(user);
      return { user, token };
    }

    throw new Error("Invalid response from server");
  }

  // Đăng xuất
  async logout() {
    try {
      await httpClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Luôn xóa token và user khỏi localStorage
      this.removeToken();
      this.removeUser();
    }
  }

  // Lấy thông tin user hiện tại từ server
  async getCurrentUser() {
    try {
      const response = await httpClient.get("/api/auth/me");
      if (response.data && response.data.data) {
        this.saveUser(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      this.removeToken();
      this.removeUser();
      throw error;
    }
  }

  // Lưu token vào localStorage
  saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Lấy token từ localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Xóa token khỏi localStorage
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  // Lưu user info vào localStorage
  saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Lấy user info từ localStorage
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Xóa user info khỏi localStorage
  removeUser() {
    localStorage.removeItem(USER_KEY);
  }

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated() {
    return !!this.getToken();
  }

  // Cập nhật profile người dùng
  async updateProfile(payload) {
    const response = await httpClient.put("/api/auth/me", payload);
    if (response.data && response.data.data) {
      const user = response.data.data;
      this.saveUser(user);
      return user;
    }
    throw new Error("Invalid response from server");
  }

  // Thay đổi mật khẩu
  async changePassword(currentPassword, newPassword) {
    const response = await httpClient.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    if (response.data) {
      return response.data;
    }
    throw new Error("Invalid response from server");
  }
}

export default new AuthService();
