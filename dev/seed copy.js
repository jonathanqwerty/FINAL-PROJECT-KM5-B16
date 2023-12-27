const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker/locale/id_ID");
const bcrypt = require("bcrypt");
const { fa } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
  await prisma.$transaction([prisma.goals.deleteMany()]);
  await prisma.$executeRaw `ALTER TABLE goals AUTO_INCREMENT = 1`;
  // await prisma.$executeRaw`ALTER SEQUENCE "goals_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.sources.deleteMany()]);
  await prisma.$executeRaw `ALTER TABLE sources AUTO_INCREMENT = 1`;
  // await prisma.$executeRaw`ALTER SEQUENCE "sources_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.chapters.deleteMany()]);
  await prisma.$executeRaw `ALTER TABLE chapters AUTO_INCREMENT = 1`;
  // await prisma.$executeRaw`ALTER SEQUENCE "chapters_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.courses.deleteMany()]);
  await prisma.$executeRaw `ALTER TABLE courses AUTO_INCREMENT = 1`;
  // await prisma.$executeRaw`ALTER SEQUENCE "courses_id_seq" RESTART WITH 1`;

  await prisma.$transaction([prisma.categories.deleteMany()]);
  await prisma.$executeRaw `ALTER TABLE categories AUTO_INCREMENT = 1`;
  // await prisma.$executeRaw`ALTER SEQUENCE "categories_id_seq" RESTART WITH 1`;

  let data;
  
  
  const level = ["beginer", "intermediate", "expert"];
  // kategory
  const kategori = [
    "Software Enginer",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Fullstack",
    "Cyber Cecurity",
  ];
  const Imagekategori = [
    "aaaaaaa",
    "bbbbbbb",
    "CCCCCCCCCCC",
    "DDDDDDDDDDD",
    "EEEEEEEEEEEEE",
    "CFFFFFFFFFFy",
  ];
  let x1 = kategori.length; //kategory
  let x2 = x1 * 6; //course
  let x3 = 2; //chapter
  const video = [3,7]
  let x5 = 3; //goals

  for (let i = 1; i <= x1; i++) {
    const kategory = {
      name: kategori[i - 1],
      image: Imagekategori[i-1],
    };
    data = await prisma.categories.create({ data: kategory });
  }
  console.log("kategory success");
  // console.log(data)

  // courses
    // title
  const title = (TempKategori,level) =>{
    let a = []
    let b = []
    if(level==0){
      a =["","","","",""]
      b =["","","","",""]
    }if(level==1){
      a =["","","","",""]
      b =["","","","",""]
    }if(level==2){
      a =["","","","",""]
      b =["","","","",""]
    }
    return `${a[faker.number.int({min: 0, max: 3})]} ${kategori[TempKategori-1]} ${b[faker.number.int({min: 0, max: 3})]}`
  }
    const telegram = "safsdhf"
    const desc =["","","","","",""]
    const price =[0,1200,8888,0]
    //image 
    let imageCourse = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
      [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
      [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
  ];
  const prepare = ["","","","",""]
  

  // courses
  for (let i = 1; i <= x2; i++) {
    let temp = faker.number.int({ min: 1, max: x1 });
    let Level = faker.number.int({min: 0, max: 2})
    const course = {
      title: title(temp,Level),
      author: faker.person.fullName(),
      telegram: telegram,
      description: desc[kategori-1],
      price: parseInt(price[faker.number.int({ min: 0, max: 2 })]),
      categoryId: temp,
      image: imageCourse[kategori-1][faker.number.int({ min: 0, max: 9 })],
      prepare : prepare[kategori-1],
      level: level[Level],
    };
    const data1 = await prisma.courses.create({ data: course });

  // chapter
    arrayChapter = ["Chapter 1", "Chapter 2"];
    arrayDuration = [60, 50, 40, 30];

    for (let a = 0; a < x3; a++) {
      const chapter = {
        title: arrayChapter[a],
        duration: arrayDuration[faker.number.int({ min: 0, max: 3 })],
        courseId: data1.id,
      };
      data = await prisma.chapters.create({ data: chapter });

  // sources
      const name =[["","",""],["","","","","","",""]]
      const link =[["","",""],["","","","","","",""]]
      for (let b = 0; b < video[a]; b++) {
        const sources = {
          name: name[a][b],
          link: link[a][b],
          chapterId: i,
        };
        data = await prisma.sources.create({ data: sources });
      }
    }

  // goals
    const goal = [["","","","",""],
    ["","","","",""],["","","","",""],
    ["","","","",""],["","","","",""],
    ["","","","",""]]

    for (let a = 1; a <= x5; a++) {
      const goals = {
        name: goal[temp-1][a-1],
        course: i,
      };
      data = await prisma.goals.create({ data: goals });
    }
  }
  console.log("course success");
  console.log("chapter success");
  console.log("sources success");
  console.log("goals success");
}
seed();
