import dotenv from "dotenv";

dotenv.config();

function requireEnv(name, fallback = "") {
  return process.env[name] || fallback;
}

export const env = {
  PORT: Number(requireEnv("PORT", "5000")),
  DATABASE_URL: requireEnv("DATABASE_URL"),
  JWT_SECRET: requireEnv("JWT_SECRET", "development-secret"),
  JWT_EXPIRES_IN: requireEnv("JWT_EXPIRES_IN", "7d"),
  CLIENT_URL: requireEnv("CLIENT_URL", "http://localhost:5173"),
  ADMIN_EMAIL: requireEnv("ADMIN_EMAIL", "admin@campusanalytics.dev"),
  ADMIN_PASSWORD: requireEnv("ADMIN_PASSWORD", "admin123456"),
  PYTHON_BIN: requireEnv("PYTHON_BIN", "python")
};

