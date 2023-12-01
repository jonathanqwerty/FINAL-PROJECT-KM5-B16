const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function delSeed2(){
    await prisma.$transaction([prisma.notifications.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE notifications AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "notifications_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.reviews.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE reviews AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "reviews_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.orders.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE orders AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "orders_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.myCourse.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE my_Course AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "my_Course_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.profiles.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE profiles AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "profiles_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.users.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE users AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "users_id_seq" RESTART WITH 1`;
}

async function delSeed(){
    await prisma.$transaction([prisma.goals.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE goals AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "goals_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.sources.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE sources AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "sources_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.chapters.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE chapters AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "chapters_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.courses.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE courses AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "courses_id_seq" RESTART WITH 1`;

    await prisma.$transaction([prisma.categories.deleteMany()]);
    await prisma.$executeRaw `ALTER TABLE categories AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw `ALTER SEQUENCE "categories_id_seq" RESTART WITH 1`;
}
// delSeed2()
delSeed()