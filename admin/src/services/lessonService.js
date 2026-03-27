import httpClient from './httpClient';

const API_URL = '/lessons';

const lessonService = {
    async getLessonById(id) {
        const response = await httpClient.get(`${API_URL}/${id}`);
        return response.data;
    },

    async getLessonsByChapter(chapterId) {
        const response = await httpClient.get(`${API_URL}/chapter/${chapterId}`);
        return response.data;
    },

    async createLesson(lessonData) {
        const response = await httpClient.post(API_URL, lessonData);
        return response.data;
    },

    async updateLesson(id, lessonData) {
        const response = await httpClient.put(`${API_URL}/${id}`, lessonData);
        return response.data;
    },

    async deleteLesson(id) {
        const response = await httpClient.delete(`${API_URL}/${id}`);
        return response.data;
    },

    async reorderLessons(chapterId, lessonOrders) {
        const response = await httpClient.put(`${API_URL}/reorder`, {
            chapterId,
            lessonOrders,
        });
        return response.data;
    },
};

export default lessonService;
