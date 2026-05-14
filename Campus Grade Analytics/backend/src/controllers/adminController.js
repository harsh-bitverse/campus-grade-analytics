import { exportCourseSubmissions, reviewFlag, runCleaningForCourse } from "../services/adminService.js";
import { listSubmissionsForAdmin } from "../services/submissionService.js";

export async function listSubmissionsController(req, res) {
  const submissions = await listSubmissionsForAdmin(req.query.courseId);
  res.json({ success: true, submissions });
}

export async function runCleaningController(req, res) {
  const result = await runCleaningForCourse(req.params.courseId);
  res.json({ success: true, result });
}

export async function reviewFlagController(req, res) {
  const result = await reviewFlag(req.params.flagId, req.user.id, req.body.action, req.body.notes);
  res.json({ success: true, result });
}

export async function exportCsvController(req, res) {
  const csv = await exportCourseSubmissions(req.query.courseId);
  res.header("Content-Type", "text/csv");
  res.attachment("submissions.csv");
  res.send(csv);
}

