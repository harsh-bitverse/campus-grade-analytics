import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { env } from "../src/config/env.js";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN"
    }
  });

  const demoCourses = [
    {
      courseCode: "CS101",
      courseName: "Introduction to Programming",
      semester: "Monsoon 2026",
      professor: "Dr. Meera Rao"
    },
    {
      courseCode: "MA204",
      courseName: "Probability and Statistics",
      semester: "Monsoon 2026",
      professor: "Prof. V. Sharma"
    }
  ];

  for (const course of demoCourses) {
    await prisma.course.upsert({
      where: {
        courseCode_semester: {
          courseCode: course.courseCode,
          semester: course.semester
        }
      },
      update: course,
      create: course
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

