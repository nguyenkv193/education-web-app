import httpClient from './httpClient';

const authService = {
    login: async (email, password) => {
        const response = await httpClient.post('/auth/login', { email, password });
        if (response.data?.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    checkMe: async () => {
        try {
            const response = await httpClient.get('/auth/me');
            return response.data?.data;
        } catch {
            return null;
        }
    }
};

export default authService;
