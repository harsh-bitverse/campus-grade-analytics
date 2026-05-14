import { api } from "../lib/api";

export const authService = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data)
};

