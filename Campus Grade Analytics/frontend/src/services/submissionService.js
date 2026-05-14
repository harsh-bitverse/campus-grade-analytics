import { api } from "../lib/api";

export const submissionService = {
  submitAnonymous: (data) => api.post("/submissions", data),
  submitAuthenticated: (data) => api.post("/submissions/authenticated", data)
};

