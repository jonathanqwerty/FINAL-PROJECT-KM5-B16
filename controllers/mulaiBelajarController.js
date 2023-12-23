const {myCourse,progres,reviews,courses} = require("../models")

module.exports = {
    detailCourse: async (req,res) =>{
        const idCourse = parseInt(req.params.id);
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
                      description: true,
                      prepare : true,
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

            // menambahkan validasi read pada setiap source
            const idProgres = getData.progres.map(item=>(item.id))
            let Data = await Promise.all(
              getData.courses.chapters.map(async (item) => {
                const source = await Promise.all(
                  item.sources.map(async (item2)=>{
                    if(idProgres.some(value => value === item2.id)){
                      return {
                        ...item2,
                        read : true
                      }
                    }else{
                      return {
                        ...item2,
                        read : false
                      }
                    }
                  }))
                return{
                  id : item.id,
                  tittle : item.title,
                  duration :item.duration,
                  sources : source
                }
              }))

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
                chapters: Data
              }
            }
            return res.status(200).json({data})
            
        }
        catch(err){
            console.log(err)
            return  res.status(500).json({message:"Error while getting the data"})
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
          return res.status(400).json({message  : "the videoId was not found in the course"})
        }
        if (duplicate){
          return res.status(400).json({message : "the progress from this video was saved before"})
        }
        const data = await progres.create({
            data:{
              myCourse: parseInt(id),
              sourceId: parseInt(videoId)
            }
        })
        
        if(!data){
          return res.status(400).json({message:"Request failed please try again or using another params"})
        }
        return res.status(200).json({message:"Request Successfull Progres Save Properly"})
      }
      catch(err){
        console.log("The error is",err)
        return res.status(400).json({message: "Error while saving the data"})
      }
    },
    makeReview : async (req,res) =>{
      const myCourseid = parseInt(req.params.id)
      const idUser = parseInt(res.user.id)
      const rating = parseInt(req.body.rating)
      const coment = req.body.coment
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
          return res.status(400).json({message : "You can review this courses yet because you not completed the modul"})
        }

        const review = await reviews.findFirst({
          where:{
            user: idUser,
            course : parseInt(MyCourse.course)
          }
        })

        if(review){
          return res.status(400).json({message : "You've provided a review before"})
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
          return res.status(400).json({message : "Something error while uploading reviews please try again"})
        }
        return res.status(200).json({message : "Success uploading data"})
      }
      catch(err){
          return res.status(400).json({message : "Error hapend while procesing data"})
      }
    },
    viewReview : async (req,res) =>{
      const mycourse = parseInt(req.params.id)
      const idUser = parseInt(res.user.id)
      try{
        const MyCourse = await myCourse.findFirst({
          where:{
            id:mycourse
          }
        })

        const review = await reviews.findFirst({
          where:{
            course : MyCourse.course,
            user: idUser
          }
        })

        if (!review){
          return res.status(400).json({message : "error while getting data review"})
        }
        return res.status(200).json({review})
      }
      catch(err){
        return res.status(400).json({message : "error happend while getting the data"})
      }
    }
}