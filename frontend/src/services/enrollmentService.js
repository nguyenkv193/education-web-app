import httpClient from "./httpClient";

const BASE_URL = "/api/enrollments";

const enrollmentService = {
    async getEnrollment(courseId) {
        const response = await httpClient.get(`${BASE_URL}/${courseId}?_t=${Date.now()}`);
        return response.data?.data;
    },

    async markLessonAsComplete(courseId, lessonId) {
        const response = await httpClient.post(`${BASE_URL}/mark-complete`, {
            courseId,
            lessonId,
        });
        return response.data?.data;
    },

    async enrollCourse(courseId) {
        const response = await httpClient.post(`${BASE_URL}/enroll`, { courseId });
        return response.data?.data;
    },
};

export default enrollmentService;
