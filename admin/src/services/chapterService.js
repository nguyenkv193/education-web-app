import httpClient from './httpClient';

const API_URL = '/chapters';

const chapterService = {
    async getChapterById(id) {
        const response = await httpClient.get(`${API_URL}/${id}`);
        return response.data;
    },

    async getChaptersByCourse(courseId) {
        const response = await httpClient.get(`${API_URL}/course/${courseId}`);
        return response.data;
    },

    async createChapter(chapterData) {
        const response = await httpClient.post(API_URL, chapterData);
        return response.data;
    },

    async updateChapter(id, chapterData) {
        const response = await httpClient.put(`${API_URL}/${id}`, chapterData);
        return response.data;
    },

    async deleteChapter(id) {
        const response = await httpClient.delete(`${API_URL}/${id}`);
        return response.data;
    },

    async reorderChapters(courseId, chapterOrders) {
        const response = await httpClient.put(`${API_URL}/reorder`, {
            courseId,
            chapterOrders,
        });
        return response.data;
    },
};

export default chapterService;
