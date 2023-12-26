const { categories, reviews, courses, myCourse, orders,  progres, chapters,sources,goals} = require("../models");

module.exports = {
    MyCourse : async (req, res) => {
      try {
        const kategori = req.query.kategori 
        const search = req.query.search 
        const filter = req.query.filter 
        const level = req.query.level || null
        const progress = req.query.progress || null
        let user = res.user.id
    
        const page =  req.query.page || 1;
        const itemsPerPage = 12;
        const skip = (page - 1) * itemsPerPage;
        const data = await myCourse.findMany({
            skip,
            take : itemsPerPage,
            where: {
                user : user,
                progress : progress !== null ?  progress : {},
                courses:{
                  categories: kategori !== null ? Array.isArray(kategori)? { name: { in: kategori }  } : 
                  { name: { contains: kategori } } : {},
                  title : search !== null ? {contains: search, lte : 'insensitive'}:{},
                  level : level !== null ? Array.isArray(level)? { in: level }: level : {}
                  }
            },
            include: {
              courses: true
            }
          });
          if (data.length == 0) {
            return res.status(404).json({ 
              error : "error",
              message: "not found data" });
          }

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

              const status = await orders.findFirst({where: {myCourseId : item.id}})
              const persentase = (progress/modul)*100
              return {
                id : item.id,
                title: item.courses.title,
                categories : kategori.name,
                outhor :item.courses.author,
                rating: review._avg.rating !== null ? parseFloat(review._avg.rating.toFixed(1)) : "-",
                level : item.courses.level,
                duration : `${duration._sum.duration} mnt`,
                modul : modul,
                image : item.courses.image,
                progres : progress,
                persentaseProgres : `${persentase.toFixed(0)}%`,
                rilis : item.courses.createdAt,
                orders : order,
                status : status.status
              }
            }))
    
            filter !== null ? 
            filter == 'paling baru' ? 
            Data.sort((a, b) => a.rilis - b.rilis) : 
            Data.sort((a, b) => b.orders - a.orders) : filter = null

            return res.status(200).json({
              success : "success",
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