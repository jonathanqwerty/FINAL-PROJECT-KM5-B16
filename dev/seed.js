const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker/locale/id_ID");
const bcrypt = require("bcrypt");
const { fa } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
  await prisma.$transaction([prisma.goals.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE goals AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "goals_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.sources.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE sources AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "sources_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.chapters.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE chapters AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "chapters_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.courses.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE courses AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "courses_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.categories.deleteMany()]);
  // await prisma.$executeRaw `ALTER TABLE categories AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "categories_id_seq" RESTART WITH 1`;

  let data;
  const kategori = [
    "Ui&Ux",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Fullstack",
    "Cyber Cecurity",
  ];
  const level = ["beginer", "intermediate", "expert"];
  // kategory

  let x1 = kategori.length; //kategory
  let x2 = x1 * 6; //course
  let x3 = 2; //chapter
  let x4a = 3; //sources1
  let x4b = 7; //sources2
  let x5 = 3; //goals

  for (let i = 1; i <= x1; i++) {
    const kategory = {
      name: kategori[i - 1],
      image: faker.image.avatar(),
    };
    data = await prisma.categories.create({ data: kategory });
  }
  console.log("kategory success");
  // console.log(data)

  // courses
  for (let a = 1; a <= x2; a++) {
    let temp = faker.number.int({ min: 1, max: x1 });
    let priceTemp = ["0", faker.commerce.price(), faker.commerce.price()];
    const course = {
      title: `${kategori[temp - 1]} ${faker.commerce.productName()}`,
      author: faker.person.fullName(),
      telegram: faker.internet.url(),
      description: faker.commerce.productDescription(),
      price: parseInt(priceTemp[faker.number.int({ min: 0, max: 2 })]),
      categoryId: temp,
      image: faker.image.avatarLegacy(),
      prepare : faker.commerce.productDescription(),
      level: level[faker.number.int({ min: 0, max: 2 })],
    };
    data = await prisma.courses.create({ data: course });
    // console.log(data)
  }
  console.log("course success");

  // chapter
  arrayChapter = ["Chapter 1", "Chapter 2"];
  arrayDuration = [60, 50, 40, 30];
  for (let i = 1; i <= x2; i++) {
    for (let a = 1; a <= x3; a++) {
      const chapter = {
        title: arrayChapter[a - 1],
        duration: arrayDuration[faker.number.int({ min: 0, max: 3 })],
        courseId: i,
      };
      data = await prisma.chapters.create({ data: chapter });
      // console.log(data)
    }
  }
  console.log("chapter success");

  // sources
  for (let i = 1; i <= x2 * x3; i++) {
    if (i % 2 == 1) {
      for (let a = 1; a <= x4a; a++) {
        const sources = {
          name: faker.music.songName(),
          link: "https://www.youtube.com/watch?v=rRSK7n4oeew&pp=ygUNYmluYXIgYWNhZGVteQ%3D%3D",
          chapterId: i,
        };
        data = await prisma.sources.create({ data: sources });
        // console.log(data)
      }
    } else {
      for (let a = 1; a <= x4b; a++) {
        const sources = {
          name: faker.music.songName(),
          link: "https://youtu.be/fCWOBU8OnMI?si=3gQDLaul4P9GU2LT",
          chapterId: i,
        };
        data = await prisma.sources.create({ data: sources });
        // console.log(data)
      }
    }
  }
  console.log("sources success");

  // goals
  for (let i = 1; i <= x2; i++) {
    for (let a = 1; a <= x5; a++) {
      const goals = {
        name: faker.system.fileName(),
        course: i,
      };
      data = await prisma.goals.create({ data: goals });
      // console.log(data)
    }
  }
  console.log("goals success");
}
seed();
