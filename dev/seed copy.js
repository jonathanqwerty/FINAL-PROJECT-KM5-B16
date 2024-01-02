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
    "https://ik.imagekit.io/ihgyz0wbk/category/Software%20Dev.jpg",
    "https://ik.imagekit.io/ihgyz0wbk/category/Web%20Developer.jpg",
    "https://ik.imagekit.io/ihgyz0wbk/category/Mobile.jpg",
    "https://ik.imagekit.io/ihgyz0wbk/category/data%20science.jpg",
    "https://ik.imagekit.io/ihgyz0wbk/category/Fullstack.jpg",
    "https://ik.imagekit.io/ihgyz0wbk/category/cyber%20security.jpg",
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
      a =["Mahir Dasar","Belajar","Mempelajari","Belajar Dasar","mMnjadi Seorang"]
      b =["Sejak Dini","Dari Nol","Itu Mudah","",""]
    }if(level==1){
      a =["Upgrade Skill","Tingkatkan Skill","Menjadi Junior","Menguasai","Mengasah Skill"]
      b =["Dengan Cepat","Tanpa lama","Dengan mudah","Bersama Kami","Lebih lanjut"]
    }if(level==2){
      a =["Tuntas Menjadi","Expert dalam","Mendalami","Menguasai","Menjadi Senior"]
      b =["Sekarang Juga","Tanpa Ribet","Dengan Sempurna","Di Usia Muda","Itu Sulit?"]
    }
    return `${a[faker.number.int({min: 0, max: 3})]} ${kategori[TempKategori-1]} ${b[faker.number.int({min: 0, max: 3})]}`
  }
    const telegram = "safsdhf"
    const desc =[
    "Selamat datang di platform pengembangan perangkat lunak kami yang memukau. Kami hadir untuk memberikan pengalaman pengkodean yang mulus dan efisien. Dengan berbagai alat terkini, kami menyederhanakan proses pengembangan, memperkuat kolaborasi tim, dan meningkatkan manajemen proyek. Platform kami tidak hanya sekadar alat, tetapi juga katalisator kreativitas untuk mewujudkan ide-ide inovatif Anda. Temukan kekuatan coding dalam lingkungan yang ramah pengguna dan dapat disesuaikan. Bersama kami, buatlah perangkat lunak luar biasa yang memenuhi harapan Anda dan menginspirasi orang lain. Sambut era pengembangan perangkat lunak yang dinamis dan produktif bersama platform kami.",
    "Dalam dunia perkembangan teknologi saat ini, menjadi seorang pengembang web adalah kunci untuk membuka pintu dunia digital. Seorang pengembang web tidak hanya menciptakan situs web yang berfungsi, tetapi juga merancang pengalaman online yang memukau. Dengan pemahaman mendalam tentang HTML, CSS, dan JavaScript, seorang pengembang web minimalis dapat membentuk tampilan dan fungsionalitas dengan desain yang bersih dan efisien. Dari landing page yang menarik hingga aplikasi web yang canggih, pengembang web minimalis menciptakan solusi yang elegan dan mudah digunakan. Dengan fokus pada kecepatan, responsif, dan pengalaman pengguna yang intuitif, pengembang web minimalis adalah arsitek digital yang menciptakan jembatan antara ide kreatif dan realitas online.",
    "Telusuri dunia pengembangan aplikasi mobile dengan kursus Mobile Dev kami yang memukau. Tanamkan keterampilan untuk menghasilkan aplikasi mobile yang responsif dan ramah pengguna, baik untuk platform iOS maupun Android. Tak peduli apakah Anda seorang pengembang berpengalaman atau pemula yang bersemangat, kursus Mobile Dev kami akan memastikan Anda menguasai kompleksitas kedua platform tersebut. Pelajari desain antarmuka yang responsif, implementasikan fitur-fitur mutakhir, dan eksplorasi lanskap teknologi mobile yang terus berkembang. Melalui proyek langsung dan skenario dunia nyata, Anda akan memperoleh keterampilan yang diperlukan untuk membuat aplikasi yang berdampak besar dan siap untuk pasar. Bergabunglah dengan kami dalam petualangan ini, di mana kode bertemu dengan kreativitas, dan bentuklah masa depan teknologi mobile. Buka potensi di ujung jari Anda dan menjadi maestro Mobile Dev!",
    "Jelajahi dunia ilmu data melalui kursus komprehensif kami. Dirancang untuk pemula dan para penggemar data yang ingin mengembangkan keterampilan mereka, program ini merinci konsep dasar analisis data, pembelajaran mesin, dan pemodelan statistik. Telusuri proyek praktis yang mengaplikasikan skenario dunia nyata, membekali Anda dengan keterampilan praktis untuk mengekstrak wawasan berharga dari dataset yang kompleks. Instruktur ahli kami akan membimbing Anda melalui kerumitan pemrograman Python, visualisasi data, dan pemodelan prediktif, membentuk pemahaman holistik tentang ekosistem ilmu data. Bergabunglah bersama kami untuk membuka potensi pengambilan keputusan berbasis data, dan keluar dengan penguasaan alat dan teknik yang penting untuk karier sukses dalam dunia ilmu data yang dinamis.",
    "Terjunlah ke dalam dunia Full Stack Development melalui kursus komprehensif kami yang memberikan Anda keterampilan dan pengetahuan untuk menguasai teknologi baik di bagian depan (frontend) maupun di belakang (backend) sebuah situs web. Baik Anda seorang programmer berpengalaman atau pemula, kursus ini dirancang untuk meningkatkan kemampuan Anda dalam pengembangan web. Mulai dari pembuatan antarmuka pengguna responsif menggunakan kerangka kerja terkini seperti React dan Vue hingga membangun aplikasi sisi server yang tangguh dengan Node.js dan Django, Kursus Full Stack Dev kami menyediakan pengalaman praktis dan proyek nyata. Anda akan menjelajahi basis data, manajemen server, integrasi API, dan strategi penyebaran, memastikan Anda lulus dengan pemahaman menyeluruh tentang seluruh tumpukan pengembangan. Bergabunglah dengan kami dalam perjalanan transformasional ini dan buka potensi untuk membuat aplikasi web yang mulus, dapat diukur, dan inovatif. Mulai coding untuk masa depan sekarang juga!",
    "Jelajahi dunia yang dinamis dari keamanan cyber dengan kursus kami yang komprehensif, dirancang untuk membekali Anda dengan keterampilan dan pengetahuan yang diperlukan untuk menjelajahi lanskap digital secara aman. Kursus Keamanan Cyber kami tidak hanya sebatas dasar-dasar, melainkan merambah ke konsep-konsep tingkat lanjut, deteksi ancaman, dan strategi mitigasi risiko. Temukan latihan praktis yang mensimulasikan skenario dunia nyata, memberikan pengalaman langsung dalam mengamankan sistem dan jaringan. Mulai dari memahami protokol enkripsi hingga menguasai teknik ethical hacking, kursus ini memastikan Anda siap menghadapi ancaman cyber. Bergabunglah dengan kami dalam perjalanan pembelajaran ini untuk memperkuat keahlian keamanan cyber Anda, dan muncul dengan keyakinan untuk mengatasi tantangan lanskap digital yang selalu berkembang. Daftar sekarang dan menjadi penjaga dunia maya!"]
    const price =[0,1200,8888,0]
    //image 
    let imageCourse = [
      ["https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_Create_a_captivating_thumbnail_for_the_S_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_Craft_an_enthusiastic_redtoned_thumbnail_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_AI_Midjourney_provide_us_with_a_stunning_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_Can_you_generate_a_striking_thumbnail_fo_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_AI_Midjourney_assist_us_in_creating_a_co_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_Create_a_captivating_thumbnail_for_the_S_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_AI_Midjourney_provide_us_with_a_stunning_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_Can_you_generate_a_striking_thumbnail_fo_0.jpg","https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_Craft_an_enthusiastic_redtoned_thumbnail_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Sofware%20/Leonardo_Diffusion_XL_AI_Midjourney_assist_us_in_creating_a_co_0.jpg"],
      ["https://ik.imagekit.io/ihgyz0wbk/web%20dev/aaaaa.jpeg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Blue_Horizon_Learning_Elevate_Your_Web_D_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Code_with_Confidence_Transform_Your_Skil_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Craft_Your_Web_Development_Skills_with_D_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_course_Web_Development_with_colour_palet_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Craft_Your_Web_Development_Skills_with_D_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Code_with_Confidence_Transform_Your_Skil_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Blue_Horizon_Learning_Elevate_Your_Web_D_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Unlock_the_Web_Dive_into_Web_Development_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/web%20dev/Leonardo_Diffusion_XL_Unlock_the_Web_Dive_into_Web_Development_1.jpg"],
      ["https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_hand_phone_mobile_developer_with_colour_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_Create_an_eyecatching_course_thumbnail_f_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_Craft_a_vibrant_thumbnail_for_our_Mobile_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_desktop_and_mobile_web_developer_with_co_1%20(1).jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_hand_phone_and_pc_mobile_developer_with_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_Craft_a_vibrant_thumbnail_for_our_Mobile_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_desktop_and_mobile_web_developer_with_co_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_Create_an_eyecatching_course_thumbnail_f_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_Design_a_captivating_thumbnail_for_our_M_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/mobile/Leonardo_Diffusion_XL_Design_a_captivating_thumbnail_for_our_M_1.jpg"],
      ["https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_desktop_Data_Science_with_colour_palete_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Explore_Data_Science_Wonderland_with_AI_0%20(1).jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Data_Science_Odyssey_Journey_into_the_li_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Explore_Data_Science_Wonderland_with_AI_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Charting_Success_AI_Midjourneys_Green_Da_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Charting_Success_AI_Midjourneys_Green_Da_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_AI_Midjourney_Data_Science_Course_Unleas_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Data_Science_Mastery_in_soft_Green_AI_Mi_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Data_Science_Mastery_in_soft_Green_AI_Mi_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/data/Leonardo_Diffusion_XL_Explore_Data_Science_Wonderland_with_AI_0.jpg"],
      ["https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_desktop_Fullstack_programing_with_colour_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Collaborate_with_AI_Midjourney_to_design_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Golden_Opportunities_Await_Explore_Fulls_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Design_a_vibrant_course_thumbnail_for_Fu_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Design_a_vibrant_course_thumbnail_for_Fu_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Craft_an_eyecatching_Full_Stack_Dev_Cour_1%20(1).jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Collaborate_with_AI_Midjourney_to_design_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Illuminate_Your_Learning_with_AI_Midjour_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Illuminate_Your_Learning_with_AI_Midjour_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Fullstack/Leonardo_Diffusion_XL_Craft_an_eyecatching_Full_Stack_Dev_Cour_0.jpg"],
      ["https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Unleash_the_power_of_green_in_our_Cybers_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Calling_all_tech_enthusiasts_Design_a_co_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_course_Cyber_Cecurity_programing_with_co_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_desktop_Cyber_Cecurity_programing_with_c_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Create_a_captivating_AIdriven_thumbnail_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Unleash_the_power_of_green_in_our_Cybers_1.jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Calling_all_tech_enthusiasts_Design_a_co_0.jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Unleash_the_power_of_green_in_our_Cybers_0%20(1).jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Unleash_the_power_of_green_in_our_Cybers_1%20(1).jpg", "https://ik.imagekit.io/ihgyz0wbk/Cyber/Leonardo_Diffusion_XL_Create_a_captivating_AIdriven_thumbnail_1.jpg"]
  ];
  const prepare = [
    "Memerlukan sebuah software code editor",
    "Memerlukan sebuah software code editor",
    "Memerlukan sebuah software code editor",
    "Memerlukan sebuah software code editor",
    "Memerlukan sebuah software code editor"]
  

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
      const data2 = await prisma.chapters.create({ data: chapter });

  // sources
      const name =[["pengenalan","pengenalan dasar ","pengenalan dasar 2"],["materi 1","materi 2","materi 3","materi 4","materi 5","materi 6","materi 7"]]
      const link =[
      ["https://youtu.be/rRSK7n4oeew?si=6ZT5odXFhg7RhHYf",
      "https://www.youtube.com/watch?v=U2w1zNexdTA",
      "https://www.youtube.com/watch?v=yHQzRmpxpcQ"],
      
      ["https://www.youtube.com/watch?v=ZHJPogRLT4Q",
      "https://www.youtube.com/watch?v=veE1W-hTTqs",
      "https://www.youtube.com/watch?v=sjES4yMn7bk",
      "https://www.youtube.com/watch?v=tuYQo8Qo6Eg",
      "https://www.youtube.com/watch?v=Rrn_2-vVToU",
      "https://www.youtube.com/watch?v=ncD5n3RZe3M",
      "https://www.youtube.com/watch?v=oDbt01X1JIQ"]]
      
      for (let b = 0; b < video[a]; b++) {
        const sources = {
          name: name[a][b],
          link: link[a][b],
          chapterId: data2.id,
        };
        data3 = await prisma.sources.create({ data: sources });
      }
    }

  // goals
    const goal = [["menguasai","memahami konsep","mempraktikan langsung","membuat mini project","mengembangkan ide baru"],
    ["mengetahui dasar ","mempelajari teori","melakukan parkit langsung","memahami konsep","mengembangkan konsep"],["memahami konsep programing","mempelajari teori","praktikan coding","mengembangkan konsep","mengelola konsep"],
    ["memahami konsep dasar","menguasai konsep dasar","praktikan langsung","mengembangkan konsep data","mengelola data"],["","","","",""],
    ["meperkenalkan dunia cyber","memahami dasar keamanan","memahami model","praktik langsung","mengembangkan keamanan"]]

    for (let a = 1; a <= x5; a++) {
      const goals = {
        name: goal[temp-1][a-1],
        course: i,
      };
      data4 = await prisma.goals.create({ data: goals });
    }
  }
  console.log("course success");
  console.log("chapter success");
  console.log("sources success");
  console.log("goals success");
}
seed();
