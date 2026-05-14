import { createSubmission } from "../services/submissionService.js";

export async function createSubmissionController(req, res) {
  const submission = await createSubmission(req.body, req.user);
  res.status(201).json({ success: true, submission });
}

