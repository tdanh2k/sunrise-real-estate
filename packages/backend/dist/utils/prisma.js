"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbContext = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
// log: [
//   { emit: "stdout", level: "query" },
//   { emit: "stdout", level: "info" },
// ],
});
exports.dbContext = prisma;
