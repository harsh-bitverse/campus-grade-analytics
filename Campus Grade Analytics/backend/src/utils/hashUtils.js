import crypto from "crypto";

export function createSubmissionHash({ courseId, totalMarks, originalGrade, userId }) {
  return crypto
    .createHash("sha256")
    .update([courseId, totalMarks, originalGrade?.trim()?.toUpperCase(), userId ?? "anonymous"].join("|"))
    .digest("hex");
}

