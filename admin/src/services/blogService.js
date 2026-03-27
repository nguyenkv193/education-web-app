import httpClient from "./httpClient";

const API = {
  getPending: (page = 1, limit = 20) =>
    httpClient.get(`/blogs/pending?page=${page}&limit=${limit}`),
  updateStatus: (id, status) =>
    httpClient.put(`/blogs/${id}/status`, { status }),
  deleteBlog: (id) => httpClient.delete(`/blogs/${id}`),
};

export default API;
