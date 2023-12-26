const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  users: prisma.users,
  profiles: prisma.profiles,
  notifications: prisma.notifications,
  categories: prisma.categories,
  courses: prisma.courses,
  reviews: prisma.reviews,
  orders: prisma.orders,
  myCourse: prisma.myCourse,
  progres : prisma.progres,
  chapters: prisma.chapters,
  sources : prisma.sources,
  goals : prisma.goals
  
};
