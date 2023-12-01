const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker/locale/id_ID");
const bcrypt = require("bcrypt");
const { fa, da } = require("@faker-js/faker");
const { courses } = require("../models");
const prisma = new PrismaClient();
const utils = require("../utils");

async function seed() {
  await prisma.$transaction([prisma.notifications.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE notifications AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "notifications_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.reviews.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE reviews AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "reviews_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.orders.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE orders AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "orders_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.myCourse.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE my_Course AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "my_Course_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.profiles.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE profiles AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "profiles_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.users.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE users AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "users_id_seq" RESTART WITH 1`;

  //===========================================================
  let data;
  let Seed = new Set();
  let Used = new Set();
  let Seed2 = new Set();
  let Used2 = new Set();
  let progres;
  let review;

  //-----------------------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const profile = {
      name: faker.person.fullName(),
      image: faker.image.avatarGitHub(),
      country: faker.location.country(),
      city: faker.location.city(),
    };
    data = await prisma.profiles.create({ data: profile });
    let email = [
      "nathanaeljonathan08@gmail.com",
      "nelanjoe@gmail.com",
      "email3@gmail.com",
      "email4@gmail.com",
      "email4@gmail.com",
      "email5@gmail.com",
      "email6@gmail.com",
      "email7@gmail.com",
      "email8@gmail.com",
      "email9@gmail.com",
      "email10@gmail.com",
      "email1@gmail.com",
    ];
    // console.log(data)

    do {
      Seed2 = faker.phone.number();
    } while (Used2.has(Seed2));
    Used2.add(Seed2);

    const user = {
      email: email[i - 1],
      phone: Seed2,
      password: await utils.cryptPassword("12345678"),
      profileId: i,
      isActive: true,
    };
    data = await prisma.users.create({ data: user });
    // console.log(data)
  }
  console.log("Profiles Success");
  console.log("Users Success");

  (Seed = new Set()), (Used = new Set());
  (Seed2 = new Set()), (Used2 = new Set());

  const progres1 = ["inProgres", "completed"];
  for (let i = 1; i <= 10; i++) {
    for (let a = 1; a <= 5; a++) {
      do {
        Seed2 = faker.number.int({ min: 1, max: 25 });
      } while (Used2.has(Seed2));
      Used2.add(Seed2);
      data = await prisma.myCourse.create({
        data: {
          user: i,
          course: Seed2,
          progress: progres1[faker.number.int({ min: 1, max: 2 })],
          order: 1,
          orders: {
            create: {
              status: "paid",
            },
          },
        },
      });
      review = await prisma.reviews.create({
        data: {
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.commerce.productDescription(),
          user: data.user,
          course: data.course,
        },
      });

      const messages = [
        "success login",
        "complete your payment course",
        "lets get start your course",
        "payment complete",
        "ayam bakar segera sampai",
        "driver lagi kena macet",
      ];
      data = await prisma.notifications.create({
        data: {
          userId: i,
          message: messages[faker.number.int({ min: 0, max: 5 })],
          isRead: faker.datatype.boolean(),
        },
      });
      // console.log(data)

      // const chapter = await prisma.chapters.findMany({
      //     where :{
      //         courseId : data.course
      //     }
      // })
      // const sources = await prisma.sources.findMany({
      //     where :{
      //         chapterId : chapter.id
      //     }
      // })
      // if (data.progress=='inProgress'){
      //     for(let i=4;i<=faker.number.int({min:4,max:9});i++){
      //         progresss = await prisma.progres.create({
      //             data:{
      //                 sourceId :
      //             }
      //         })
      //     }
      // }
    }
    (Used2 = new Set()), (Seed2 = new Set());
  }
  console.log("myCourse Success");
  console.log("Review Success");
  console.log("Notification Success");
}
seed();
