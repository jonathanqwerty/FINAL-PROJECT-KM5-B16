const {myCourse,progres,reviews,courses} = require("../models")

module.exports = {
    detailCourse: async (req,res) =>{
        const idCourse = parseInt(req.params.id);
        if(!idCourse){
          return res.status(404).json({
            error : "error",
            message:"id params not found"
          })
        }
        try{
            const getData = await myCourse.findFirst({
                where: {
                  id: idCourse,
                },
                select: {
                  id: true,
                  user: true,
                  course: true,
                  progress: true,
                  progres: true,
                  courses: {
                    select: {
                      id: true,
                      title: true,
                      author: true,
                      telegram: true,
                      prepare:true,
                      description: true,
                      image: true,
                      level: true,
                      reviews:{
                        select:{
                          rating:true
                        }
                      },
                      goals: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                      chapters: {
                        select: {
                          id: true,
                          title: true,
                          duration: true,
                          sources: {
                            select: {
                              id: true,
                              name: true,
                              link: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
            });

            // Menghitung total progres yang ada 
            const progresCount = getData.progres.length;

            // Menghitung total duration dari semua chapters
            const totalDuration = getData.courses.chapters.reduce((total, chapter) => total + chapter.duration, 0);

            // Menghitung total jumlah sources dari semua chapters
            const totalSources = getData.courses.chapters.reduce((total, chapter) => total + chapter.sources.length, 0);

            // Menghitung rata-rata rating
            const averageRating = getData.courses.reviews.reduce((total, review) => total + review.rating, 0) / getData.courses.reviews.length;

            const roundedAverageRating = parseFloat(averageRating.toFixed(1));

            const data = {
              id: getData.id,
              user: getData.user,
              course: getData.course,
              progress: getData.progress,
              progres: progresCount,
              prepare : getData.courses.prepare,
              courses: {
                id: getData.courses.id,
                title: getData.courses.title,
                author: getData.courses.author,
                telegram: getData.courses.telegram,
                totalDuration: totalDuration,
                totalSources: totalSources,
                averageRating: roundedAverageRating,
                description: getData.courses.description,
                image: getData.courses.image,
                level: getData.courses.level,
                goals: getData.courses.goals,
                chapters: getData.courses.chapters
              }
            }
            return res.status(200).json({
              sucess : "success",
              course : data})
        }
        catch(err){
            return  res.status(500).json({
              error : "error",
              message:"Error while getting the data"
            })
        }
    },
    progresBelajar : async (req,res) =>{
      const { id, videoId } = req.params;
      try{
        const duplicate = await progres.findFirst({
          where:{
            myCourse: parseInt(id),
            sourceId: parseInt(videoId)
          }
        })
        const MyCourse = await myCourse.findFirst({
          where:{
            id:parseInt(id)
          },
          select:{
            courses:{
              select:{
                chapters:{
                  select:{
                    sources:{
                      select:{
                        id:true
                      }
                    }
                  }
                }
              }
            }
          }
        })

        function isSourceIdPresent(courseData, targetId) {
          for (const chapter of courseData.courses.chapters) {
              for (const source of chapter.sources) {
                  if (source.id === targetId) {
                      return true; 
                  }
              }
          }
          return false;
        }

        const exist = isSourceIdPresent(MyCourse,parseInt(videoId))
        if (!exist){
          return res.status(400).json({
            error : "error",
            message  : "the videoId was not found in the course"})
        }
        if (duplicate){
          return res.status(400).json({
            error:"error",
            message : "the progress from this video was saved before"})
        }
        const data = await progres.create({
            data:{
              myCourse: parseInt(id),
              sourceId: parseInt(videoId)
            }
        })
        
        if(!data){
          return res.status(400).json({
            error:"error",
            message:"Request failed please try again or using another params"})
        }
        return res.status(200).json({
          success : "success",
          message:"Request Successfull Progres Save Properly"})
      }
      catch(err){
        return res.status(400).json({
          error:"error",
          message: "Error while saving the data"
        })
      }
    },
    makeReview : async (req,res) =>{
      const myCourseid = parseInt(req.params.id)
      const idUser = parseInt(res.user.id)
      const rating = parseInt(req.body.rating)
      const coment = req.body.coment
      if (!idUser||!rating||!coment){
        return res.status(404).json({
          error:"error",
          message:"the req body has missed something"
        })
      }
      try{
        const MyCourse = await myCourse.findFirst({
          where:{
            id: myCourseid,
            user: idUser
          }
        })
        
        const course = await courses.findFirst({
          where:{
            id : parseInt(MyCourse.course)
          },
          select:{
            chapters:{
              include:{
                sources:true
              }
            }
          }
        })

        const totalSources = course.chapters.reduce((total, chapter) => total + chapter.sources.length, 0);

        const Progres = await progres.aggregate({
          where:{
            myCourse : myCourseid
          },
          _count:{
            _all:true
          }
        })

        const totalProgres = parseInt(Progres._count._all)

        if(totalProgres != totalSources){
          return res.status(400).json({
            error : "error",
            message : "You can review this courses yet because you not completed the modul"
          })
        }

        const review = await reviews.findFirst({
          where:{
            user: idUser,
            course : parseInt(MyCourse.course)
          }
        })

        if(review){
          return res.status(400).json({
            error : "error",
            message : "You've provided a review before"
          })
        }

        const upload = await reviews.create({
          data:{
            rating  : rating,
            user    : idUser,
            course  : parseInt(MyCourse.course),
            comment  : coment
          }
        })
        const update = await myCourse.update({
          where:{
            id : myCourseid
          },
          data : {
            progress : "completed"
          }
        })
        if(!upload){
          return res.status(400).json({
            error : "error",
            message : "Something error while uploading reviews please try again"
          })
        }
        return res.status(200).json({
          success : "success",
          message : "Success uploading data"})
      }
      catch(err){
          return res.status(400).json({
            error : "error",
            message : "Error hapend while procesing data"
          })
      }
    },
    viewReview : async (req,res) =>{
      const mycourse = parseInt(req.params.id)
      try{
        const MyCourse = await myCourse.findFirst({
          where:{
            id:mycourse
          }
        })

        const review = await reviews.findMany({
          where:{
            course : MyCourse.course
          },
          select: {
            id: true,
            rating: true,
            comment: true,
            users: {
              select: {
                profiles:{
                  select:{
                    name: true,
                    image: true,
                  }
                }
                // name: true,
                // image: true,
              },
            },
          },
        });

        // const review = await reviews.findMany({
        //   where:{
        //     course : MyCourse.course
        //   }
        // })
        

        if (!review){
          return res.status(400).json({
            error : "error",
            message : "error while getting data review"
          })
        }
        return res.status(200).json({
          success: "success",
          review : review})
      }
      catch(err){
        return res.status(400).json({
          error : "error",
          message : "error happend while getting the data"
        })
      }
    },
}