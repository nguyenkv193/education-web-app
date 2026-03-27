import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const initAuth = async () => {
            const token = authService.getToken();
            if (token) {
                try {
                    const userData = await authService.checkMe();
                    if (userData && userData.role === 'admin') {
                        setUser(userData);
                    } else {
                        // Not an admin, clear storage
                        authService.logout();
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const userData = response.data?.user || response.data;

            // Check if user is admin
            if (userData.role !== 'admin') {
                authService.logout();
                throw new Error('Bạn không có quyền truy cập trang quản trị');
            }

            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng nhập thất bại'
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
