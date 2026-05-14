import { getCourseAnalytics } from "../services/cleaningService.js";

export async function getCourseAnalyticsController(req, res) {
  const analytics = await getCourseAnalytics(req.params.courseId);
  res.json({ success: true, analytics });
}

