import httpClient from "./httpClient";

const BASE_URL = "/api/courses";

const courseService = {
  async getCourses(params = {}) {
    const response = await httpClient.get(BASE_URL, { params });
    return response.data?.data;
  },

  async getFreeCourses(limit = 10) {
    return this.getCourses({ isFree: true, limit });
  },

  async getProCourses(limit = 10) {
    return this.getCourses({ isFree: false, limit });
  },

  async getCourseById(id) {
    const response = await httpClient.get(`${BASE_URL}/${id}`);
    return response.data?.data;
  },

  async getCourseBySlug(slug) {
    const response = await httpClient.get(`${BASE_URL}/slug/${slug}`);
    return response.data?.data;
  },

  async getCourseLessonDetail(courseSlug) {
    const response = await httpClient.get(`${BASE_URL}/lesson/${courseSlug}`);
    return response.data?.data;
  },

  async enrollCourse(course) {
    // course: { courseId, title, slug }
    const response = await httpClient.post("/api/auth/enroll", course);
    return response.data?.data;
  },

  async searchCourses(keyword, page = 1, limit = 12) {
    const response = await httpClient.get(`${BASE_URL}/search`, {
      params: { keyword, page, limit },
    });
    return response.data?.data;
  },
};

export default courseService;
