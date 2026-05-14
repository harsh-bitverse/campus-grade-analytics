import { api } from "../lib/api";

export const analyticsService = {
  getCourseAnalytics: (courseId) => api.get(`/analytics/courses/${courseId}`),
  runCleaning: (courseId) => api.post(`/admin/clean/${courseId}`),
  listSubmissions: () => api.get("/admin/submissions"),
  exportCsv: () => api.get("/admin/export", { responseType: "blob" })
};
