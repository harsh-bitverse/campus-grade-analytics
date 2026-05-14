# Folder Guide

This document explains the major folders and files in a beginner-friendly way.

## Root folders

### `backend/`
This is the Node.js + Express API server. It handles authentication, course management, submissions, admin workflows, and communication with PostgreSQL through Prisma.

### `frontend/`
This is the React + Vite application. It contains the pages, charts, auth state, and forms that call the backend API.

### `python/`
This folder contains the statistical cleaning engine. The backend sends raw submission data to this module, and the Python script returns cleaned rows, flagged conflicts, and estimated cutoffs.

### `docs/`
This folder contains the learning-focused explanations so you can understand the architecture while rebuilding it yourself.

## Backend

### `backend/src/app.js`
Builds the Express app and connects middleware plus routes.

### `backend/src/server.js`
Starts the backend server by calling `app.listen`.

### `backend/src/config/env.js`
Reads environment variables in one place. This makes configuration easier to manage and safer for deployment.

### `backend/src/config/prisma.js`
Creates a reusable Prisma client so every service can talk to PostgreSQL.

### `backend/src/controllers/`
Controllers are the thin request handlers. They read the request and send the response, but keep business logic inside services.

### `backend/src/services/`
Services hold the main logic. This is where signup, submission validation, cleaning, exports, and analytics live.

### `backend/src/routes/`
Routes connect URLs like `/api/auth/login` or `/api/admin/clean/:courseId` to controller functions.

### `backend/src/middleware/`
Middleware runs before or after your controller. Examples here include JWT auth, admin protection, validation, and error handling.

### `backend/src/validators/`
Zod schemas live here. They check incoming request bodies before data reaches your service layer.

### `backend/src/utils/`
Small reusable helpers live here, such as grade normalization, duplicate hashing, and custom API errors.

### `backend/prisma/schema.prisma`
Defines the database structure. Prisma reads this file to generate typed database access code.

### `backend/prisma/seed.js`
Creates an initial admin account and demo courses.

## Frontend

### `frontend/src/App.jsx`
Defines the application routes.

### `frontend/src/context/AuthContext.jsx`
Stores login state and exposes helper functions like `login`, `signup`, and `logout`.

### `frontend/src/lib/api.js`
Creates one Axios client for the whole frontend and automatically attaches the JWT token.

### `frontend/src/pages/`
Each page is a route-level screen such as home, login, analytics, and admin.

### `frontend/src/components/`
Reusable UI pieces are split into layout, charts, and common helper components.

### `frontend/src/services/`
Frontend service files wrap API requests so page components stay simpler and easier to read.

### `frontend/src/hooks/useCourses.js`
A custom hook that loads the course list and keeps fetching logic out of the UI layer.

### `frontend/src/styles/index.css`
Loads Tailwind and global base styles.

## Python

### `python/grade_cleaner/main.py`
Reads JSON from standard input, cleans the rows with pandas and numpy, flags conflicts, and prints JSON back to the backend.

### `python/requirements.txt`
Lists Python libraries used by the cleaning engine.

