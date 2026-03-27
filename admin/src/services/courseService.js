import httpClient from './httpClient';

const API_URL = '/courses';

const courseService = {
    async getAllCourses(page = 1, limit = 12, filters = {}) {
        const params = new URLSearchParams({ page, limit, ...filters });
        const response = await httpClient.get(`${API_URL}?${params}`);
        return response.data;
    },

    async getCourseById(id) {
        const response = await httpClient.get(`${API_URL}/${id}`);
        return response.data;
    },

    async getCourseBySlug(slug) {
        const response = await httpClient.get(`${API_URL}/slug/${slug}`);
        return response.data;
    },

    async createCourse(courseData) {
        const response = await httpClient.post(API_URL, courseData);
        return response.data;
    },

    async updateCourse(id, courseData) {
        const response = await httpClient.put(`${API_URL}/${id}`, courseData);
        return response.data;
    },

    async deleteCourse(id) {
        const response = await httpClient.delete(`${API_URL}/${id}`);
        return response.data;
    },
};

export default courseService;
