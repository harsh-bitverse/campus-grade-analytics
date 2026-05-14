-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'FLAGGED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "professor" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "originalGrade" TEXT NOT NULL,
    "normalizedGrade" INTEGER NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "submissionHash" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleanedSubmission" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "cleanedMarks" DOUBLE PRECISION NOT NULL,
    "cleanedGrade" INTEGER NOT NULL,
    "isSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "cleaningReason" TEXT,
    "confidenceHint" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CleanedSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatedCutoff" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "gradeValue" INTEGER NOT NULL,
    "gradeLabel" TEXT NOT NULL,
    "estimatedLowerMark" DOUBLE PRECISION NOT NULL,
    "highestBelowMark" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstimatedCutoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlaggedEntry" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "details" JSONB,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlaggedEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseCode_semester_key" ON "Course"("courseCode", "semester");

-- CreateIndex
CREATE INDEX "Submission_courseId_normalizedGrade_totalMarks_idx" ON "Submission"("courseId", "normalizedGrade", "totalMarks");

-- CreateIndex
CREATE INDEX "Submission_submissionHash_idx" ON "Submission"("submissionHash");

-- CreateIndex
CREATE UNIQUE INDEX "CleanedSubmission_submissionId_key" ON "CleanedSubmission"("submissionId");

-- CreateIndex
CREATE INDEX "EstimatedCutoff_courseId_computedAt_idx" ON "EstimatedCutoff"("courseId", "computedAt");

-- CreateIndex
CREATE INDEX "FlaggedEntry_courseId_isResolved_idx" ON "FlaggedEntry"("courseId", "isResolved");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleanedSubmission" ADD CONSTRAINT "CleanedSubmission_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimatedCutoff" ADD CONSTRAINT "EstimatedCutoff_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlaggedEntry" ADD CONSTRAINT "FlaggedEntry_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlaggedEntry" ADD CONSTRAINT "FlaggedEntry_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlaggedEntry" ADD CONSTRAINT "FlaggedEntry_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
