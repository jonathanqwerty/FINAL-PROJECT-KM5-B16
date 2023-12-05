const { Prisma } = require("@prisma/client");
const { categories, reviews, courses, myCourse, orders,  progres, chapters,sources} = require("../models");
const {Course} = require('../utils/course');

 async function FilterCourse(){
  try {
    const kategori = null
    const search =  null
    const filter = 'paling'
    const level = null
    const progress =null
    // let user = res.user.id || 1

    const page =  1;
    const itemsPerPage = 12;
    const skip = (page - 1) * itemsPerPage;
    const data = await myCourse.findMany({
        skip,
        take : itemsPerPage,
        where: {
            // id : user,
            progress : progress !== null ? progress : {},
            courses:{
              categories: kategori !== null ? { name: kategori } : {},
              title : search !== null ? {contains: search}:{},
              level : level !== null ? level:{}
              }
        },
        include: {
          courses: true
        }
      });

      // console.log(data)
      let Data = await Promise.all(
        data.map(async (item) => {

          // categories
          const kategori = await categories.findFirst({
            where :{id : item.courses.categoryId},
            select:{name : true}
          })

          //modul 
          const chapter = await chapters.findMany({where:{courseId : item.courses.id}}) 
          const idChapters = chapter.map((obj) => obj.id);
          const modul = await sources.count({where :{chapterId : {in: idChapters}}})

          //duration
          const duration = await chapters.aggregate({
            _sum:{duration:true},
            where:{id :{in:idChapters}}
          })

          // rating
          const review = await reviews.aggregate({
            where: {course: item.courses.id},
            _avg: {rating: true,},
          });
          // popular
          const order = await myCourse.count({where: {course: item.course,}});

          //progres
          const progress = await progres.count({where:{myCourse : item.id}})

          return {
            id : item.id,
            title: item.courses.title,
            categories : kategori.name,
            outhor :item.courses.author,
            rating: review._avg.rating,
            level : item.courses.level,
            duration : `${duration._sum.duration} mnt`,
            modul : modul,
            image : item.courses.image,
            progres : progress,
            rilis : item.courses.createdAt,
            orders : order,
          }
        }))

        filter !== null ? 
        filter == 'paling baru' ? 
        Data.sort((a, b) => a.rilis - b.rilis) : 
        Data.sort((a, b) => b.orders - a.orders) : 
        
      console.log(Data)

} catch (error) {
    console.log(error)
}
};

FilterCourse()
