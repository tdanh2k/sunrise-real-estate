import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
// log: [
//   { emit: "stdout", level: "query" },
//   { emit: "stdout", level: "info" },
// ],
});
export const dbContext = prisma;
