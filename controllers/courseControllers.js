const { categories, reviews, courses, myCourse, orders,  progres, chapters,sources, goals} = require("../models");
const { Course } = require("../utils/course");

module.exports = {
  FilterCourse: async (req, res) => {
    // filtering sebuah course
    try {
      const kategori = req.query.kategori;
      const search = req.query.search;
      const filter = req.query.filter;
      const level = req.query.level;
      const type = req.body.type;
      let user = res.user ? res.user.id : null;

      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 12;
      const skip = (page - 1) * itemsPerPage;

      // filter
      let data = await courses.findMany({
        skip,
        take: itemsPerPage,
        where: {
          categories: kategori !== null ? { name: kategori } : {},
          title: search !== null ? { contains: search } : {},
          level: level !== null ? level : {},
          price: type == null ? {} : type == "premium" ? { not: 0 } : 0,
        },
        include: {
          categories: true,
        },
      });

      // data = data.slice((page-1)*itemsPerPage,(page*itemsPerPage))

      if (data.length == 0) {
        return res.status(404).json({ message: "not found data" });
      }
      console.log("jumlah data : " + data.length);

      // mendapatkan count popularity dan memperbaiki return
      let course = await Course(data, user);

      // filter type course
      filter !== null
        ? filter == "paling baru"
          ? course.sort((a, b) => a.rilis - b.rilis)
          : course.sort((a, b) => b.orders - a.orders)
        : console.log("no filter");

      return res.status(200).json({
        course,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },
  detailCourse: async(req, res) =>{
    try {
      const id = parseInt(req.params.id)
  
      const course = await courses.findFirst({
        where:{id},
        select :{
          id  : true,
          title : true,
          author : true,
          telegram:true,
          description: true,
          level: true,
          categories :{
            select :{
              name : true,
            }
          },
          goals :{
            select :{
              name : true
            }
          },
          chapters : {
            select :{
              id : true,
              title : true,
              duration : true,
              sources :{
                select :{
                  id : true,
                  name: true,
                  link : true,
                }
              }
            }
          }
  
        }
      })

      if(!course){
        return res.status(404).json({
          message : "course not found"
        })
      }
          //modul 
          const chapter = await chapters.findMany({where:{courseId : course.id}}) 
          const idChapters = chapter.map((obj) => obj.id);
          const modul = await sources.count({where :{chapterId : {in: idChapters}}})
  
  
          //duration
          const duration = await chapters.aggregate({
            _sum:{duration:true},
            where:{id :{in:idChapters}}
          })
  
          //ratings
          const review = await reviews.aggregate({
            where: {course: course.id},
            _avg: {rating: true},
          });
  
          return res.status(200).json({
            detalCourse:{
              modul,
              duration : `${duration._sum.duration} mnt`,
              rating : review._avg.rating,
              course
            }
          }) 
  
          // console.log(JSON.stringify(a, null, 2));
          // console.log({
          //   level : course.level,
          //   modul,
          //   duration : duration._sum.duration,
          //   goal : goal,
          // })
  
  } catch (error) {
      console.log(error)
  }
  },
  popUpCourse : async(req, res)=>{
    try {
      const id = parseInt(req.params.id)
      const course = await courses.findFirst({
        where: {id},
        select:{
          id : true,
          title : true,
          image : true,
          author : true,
          level : true,
          price : true,
          categories:{
            select : {
              name:true
            }
          }
        }
      })
  
       //modul 
       const chapter = await chapters.findMany({where:{courseId : course.id}}) 
       const idChapters = chapter.map((obj) => obj.id);
       const modul = await sources.count({where :{chapterId : {in: idChapters}}})
  
  
       //duration
       const duration = await chapters.aggregate({
         _sum:{duration:true},
         where:{id :{in:idChapters}}
       })
  
       //ratings
       const review = await reviews.aggregate({
         where: {course: course.id},
         _avg: {rating: true},
       });
  
       return res.status(200).json({
        popUpCourse : {
          modul,
          duration : `${duration._sum.duration} mnt`,
          rating : review._avg.rating,
          course
        }
       })
      //  console.log(JSON.stringify(a,null,2))
  
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message : 'internal server error'
      })
    }
  },
  orderCourse : async(req, res)=>{
    try {
      const id = parseInt(req.params.id)
      const user = parseInt(res.user.id)
  
      const existMycourse = await myCourse.findFirst({
        where:{
          user : user,
          course : id,
        }
      })
      if(existMycourse){
        return res.status(403).json({
          message : 'you already have this course'
        })
      }
      const MyCourse = await myCourse.create({
        data:{
          user      : user,
          course    : id,
          order     : 1,
          orders    : {
            create: {
              status: 'notPaid'
            }
          }
        }
      })

      return res.status(201).json({
        message : 'Successful! Final step, please complete the payment process to access your course.',
        mycourseId : MyCourse.id
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message : 'internal server error'
      })
    }
  }
};
