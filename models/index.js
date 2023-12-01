const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  users: prisma.users,
  profiles: prisma.profiles,
  notifications: prisma.notifications,
<<<<<<< HEAD
  prisma,
  categories : prisma.categories,
  courses: prisma.courses,
  reviews: prisma.reviews,
  orders : prisma.orders,
  myCourse : prisma.myCourse
=======
>>>>>>> 3d5a167dc8199e8a8c4190ebb6d5f48f5a92bea3
};
