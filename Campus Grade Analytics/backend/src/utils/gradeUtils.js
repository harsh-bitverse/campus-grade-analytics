export const GRADE_TO_POINTS = {
  A: 10,
  "A-": 9,
  B: 8,
  "B-": 7,
  C: 6,
  "C-": 5,
  D: 4
};

export const POINTS_TO_GRADE = Object.fromEntries(
  Object.entries(GRADE_TO_POINTS).map(([label, value]) => [value, label])
);

export function normalizeGrade(grade) {
  if (!grade) {
    return null;
  }

  const cleanedGrade = grade.trim().toUpperCase();
  return GRADE_TO_POINTS[cleanedGrade] ?? null;
}

export function isPassingGrade(grade) {
  const normalized = normalizeGrade(grade);
  return normalized !== null && normalized >= 4;
}

