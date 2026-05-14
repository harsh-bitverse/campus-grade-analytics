import { createCourse, listCourses, updateCourse } from "../services/courseService.js";

export async function listCoursesController(req, res) {
  const courses = await listCourses();
  res.json({ success: true, courses });
}

export async function createCourseController(req, res) {
  console.log(req.body);
  const course = await createCourse(req.body);
  res.status(201).json({ success: true, course });
}

export async function updateCourseController(req, res) {
  const course = await updateCourse(req.params.courseId, req.body);
  res.json({ success: true, course });
}

