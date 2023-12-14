const { categories, reviews, courses, myCourse, orders,  progres, chapters,sources, goals, users} = require("../models");
const { Course } = require("../utils/course");
const {notif} = require('../utils/notification')

module.exports = {
  FilterCourse: async (req, res) => {
    // filtering sebuah course
    try {
      const kategori = req.query.kategori;
      const search = req.query.search;
      const filter = req.query.filter;
      const level = req.query.level || null;
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
          categories: kategori !== null ? Array.isArray(kategori)? { name: { in: kategori }  } : 
          { name: { contains: kategori } } : {},
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

      // mendapatkan count popularity dan memperbaiki return
      let course = await Course(data, user);

      // filter type course
      filter !== null
        ? filter == "paling-baru"
          ? course.sort((a, b) => a.rilis - b.rilis)
          : course.sort((a, b) => b.orders - a.orders)
        : filter = null

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
      let user = res.user ? res.user.id : null;

      if(isNaN(id) || isNaN(user)){
        return res.status(400).json({message : "bad req parameter url" })
      }

      let MyCourse
      let order
      if(user!== null){
        MyCourse = await myCourse.findFirst({
          where:{
            course: id,
            user: user
          }})
          if(MyCourse){
            order = await orders.findFirst({where:{id: MyCourse.id}})
          }
      }
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
            course : {
              id : course.id,
              title: course.title,
              author: course.author,
              categories : course.categories.name,
              telegram : course.telegram,
              modul,
              duration : `${duration._sum.duration} mnt`,
              rating : review._avg.rating,
              level : course.level,
              description : course.description,
              pembelian : MyCourse? "terbeli": "tidak terbeli",
              status : order? order.status : 'notPaid',
              goals : course.goals,
              chapters : course.chapters,
              
            }
          }) 
  } catch (error) {
      console.log(error)
      return res.status(500).json({
        message : 'internal server error'
      })
  }
  },
  popUpCourse : async(req, res)=>{
    try {
      const id = parseInt(req.params.id)
      if(isNaN(id)){
        return res.status(400).json({message : "bad req parameter url" })
      }
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
      if(!course){
        return res.status(500).json({
          message : 'data not found'
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
        popUpCourse : {
          id : course.id,
          title : course.title,
          image : course.image,
          author : course.author,
          categories: course.categories.name,
          level : course.level,
          price : course.price,
          modul,
          duration : `${duration._sum.duration} mnt`,
          rating : review._avg.rating,
        }
       })
  
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
      let order = null

      if(isNaN(id) || isNaN(user)){
        return res.status(400).json({message : "bad req parameter url" })
      }
      const existCourse = await courses.findFirst({where:{id}})
      if(!existCourse){
        return res.status(404).json({message : "data not found" })
      }
      const existMycourse = await myCourse.findFirst({
        where:{
          user : user,
          course : id,
        },select : {
          id : true,
        }
      })
      if (existMycourse){
        order = await orders.findFirst({where :{myCourseId : existMycourse.id}})
      }
      if(order){
        if(order.status == "paid"){
          return res.status(403).json({
            message : 'you already have this course lets to the next step',
            status : order.status,
            id : existMycourse.id
          })
        }
        else{
          return res.status(403).json({
            message : 'you already have this course but you dont finsihing the payment. lets finishing the step',
            status : order.status,
            id : existMycourse.id
          })
        }
        
      }
      const MyCourse = await myCourse.create({
        data:{
          user      : user,
          course    : id,
          orders    : {
            create: {
              status: 'notPaid'
            }
          }
        }
      })

      notif(user,'Successful buy course! Final step, please complete the payment process to access your course.')
      
      return res.status(201).json({
        message : 'Successful! Final step, please complete the payment process to access your course.',
        status : 'notPaid',
        id : MyCourse.id
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message : 'internal server error'
      })
    }
  },
  getOrderCourse : async(req, res)=>{
    const id = parseInt(req.params.id)
    const user = parseInt(res.user.id)

    if(isNaN(id) || isNaN(user)){
      return res.status(400).json({message : "bad req parameter url" })
    }
    const data = await myCourse.findFirst({
      where:{
        id : id,
        user : user
      },
      select:{
        id : true,
        courses:{
          select:{
            title : true,
            author : true,
            price : true,
            image : true,
          }
        }
      }
    })
    if(!data){
      return res.status(404).json({
        message : "Data not found " 
      })
    }
    const order = await orders.findFirst({where :{myCourseId : data.id}})
    return res.status(200).json({
      myCourse:{
        id : data.id,
        status : order.status,
        title : data.courses.title,
        author : data.courses.author,
        price : data.courses.price,
        image : data.courses.image,
      }
    })
  },
  payOrder: async(req, res)=>{
    const user = parseInt(res.user.id)
    const id = parseInt(req.params.id)
    if (isNaN(id)){
      return res.status(400).json({message : "bad req parameter url" })
    }
    const finData = await orders.findFirst({where : {id : id}})

    if(!finData){
      return res.status(400).json({message : "data not found"  })
    }

    const data = await orders.update({
      where:{
        id : id
      },
      data :{
        status : 'paid'
      }
    })
    
    notif(user, "Successful complete the payment procces, enjoy your class :)")
    return res.status(200).json({
      message : 'Successful complete the payment procces, enjoy your class :)',
      myCourseId : data.id
    })
  }
};
