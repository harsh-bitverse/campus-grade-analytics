# Request Flow Guide

This file explains how the app moves data from the browser to the database and back.

## Example 1: Signup

1. The user fills the signup form in the React page.
2. `AuthContext` calls `POST /api/auth/signup`.
3. The auth route uses Zod validation.
4. The controller calls `authService.signup`.
5. The service hashes the password with `bcryptjs`.
6. Prisma stores the new row in the `User` table.
7. The backend signs a JWT and sends it back.
8. The frontend stores the JWT in local storage and updates the logged-in user state.

## Example 2: Anonymous mark submission

1. A student opens the Submit Marks page.
2. The form sends `courseId`, `totalMarks`, `obtainedGrade`, and `isAnonymous`.
3. The backend validates the request body.
4. `submissionService.createSubmission` normalizes the grade.
5. If the grade is below `D`, the request is rejected.
6. The service creates a submission hash to detect duplicates.
7. Prisma inserts the row into the `Submission` table.

## Example 3: Cleaning engine run

1. An admin clicks `Run Cleaning`.
2. The backend fetches all submissions for that course.
3. The backend sends JSON to the Python script.
4. Python removes invalid rows and marks suspicious conflicts.
5. Python estimates cutoffs and returns JSON.
6. The backend stores cleaned rows in `CleanedSubmission`.
7. The backend stores suspicious cases in `FlaggedEntry`.
8. The backend stores grade cutoffs in `EstimatedCutoff`.
9. The analytics page reads this processed data through `/api/analytics/courses/:courseId`.

## Why use this layered flow?

- Routes stay small.
- Services hold the real business rules.
- Prisma is kept in the backend only.
- The frontend stays focused on forms, pages, and charts.
- The Python engine can grow into a more advanced ML pipeline later.

