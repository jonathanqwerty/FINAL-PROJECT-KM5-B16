const { categories, reviews, courses, myCourse, orders,  progres, chapters,sources,goals} = require("../models");

module.exports = {
    MyCourse : async (req, res) => {
      try {
        const kategori = req.query.kategori;
        const search = req.query.search;
        const filter = req.query.filter;
        const level = req.query.level;
        const progress = req.query.progres;
        let user = res.user.id
    
        const page =  req.query.page || 1;
        const itemsPerPage = 12;
        const skip = (page - 1) * itemsPerPage;
        const data = await myCourse.findMany({
            skip,
            take : itemsPerPage,
            where: {
                user : user,
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
            Data.sort((a, b) => b.orders - a.orders) : console.log('no filter')

            return res.status(200).json({
              MyCourse : Data
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
          error : error
        })
    }
    }
}