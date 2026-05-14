import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const data = [
  { marks: 74.5, grade: "A-" },
  { marks: 87.5, grade: "A" },
  { marks: 52, grade: "B-" },
  { marks: 50, grade: "B-" },
  { marks: 73, grade: "A-" },
  { marks: 81.5, grade: "A" }
];

async function main() {
  const course = await prisma.course.findFirst({
    where: {
      courseCode: "MTL1001"
    }
  });

  if (!course) {
    console.log("Course not found");
    return;
  }

  for (const entry of data) {
    await prisma.submission.create({
      data: {
        totalMarks: entry.marks,
        obtainedGrade: entry.grade,
        normalizedGrade: entry.grade,
        isAnonymous: true,
        courseId: course.id
      }
    });
  }

  console.log("Bulk upload complete");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });