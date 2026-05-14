import { api } from "../lib/api";

export const courseService = {
  list: () => api.get("/courses"),
  create: (data) => api.post("/courses", data),
  update: (courseId, data) => api.put(`/courses/${courseId}`, data)
};

