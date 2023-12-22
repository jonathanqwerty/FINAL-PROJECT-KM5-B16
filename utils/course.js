const { categories, reviews, courses, myCourse, users ,chapters,sources, orders} = require("../models");

module.exports ={
    Course : async(data,data2) => {
      let MyCourse 
      data2 !== null ? MyCourse = await myCourse.findMany({
        where : {
          user : data2 
        }
      })
      :   data2 = null

        let Data = await Promise.all(
            data.map(async (item) => {

              //ratings
              const review = await reviews.aggregate({
                where: {course: item.id},
                _avg: {rating: true,},
              });

              //order/popular
              const order = await myCourse.count({
                where: {course: item.id,}
              });

              //modul 
              const chapter = await chapters.findMany({where:{courseId : item.id}}) 
              const idChapters = chapter.map((obj) => obj.id);
              const modul = await sources.count({where :{chapterId : {in: idChapters}}})

              //duration
              const duration = await chapters.aggregate({
                _sum:{duration:true},
                where:{id :{in:idChapters}}
              })
              
              let pembelian = 'tidak terbeli'
              if (MyCourse){
                const course2 = await Promise.all(
                  MyCourse.map(async(item2)=>{
                    const order = await orders.findFirst({where : {myCourseId : item2.id}})
                    if(item.id == item2.course && order.status == "paid" ){
                      return 'terbeli'
                    }
                  }))
                  const filteredData = course2.filter((item3) => item3 == 'terbeli');
                  filteredData == 'terbeli' ? pembelian = 'terbeli' : pembelian = 'tidak terbeli'
              }

              let type
              item.price == 0? type = 'gratis' : type = 'premium' 
              const modifiedItem = {
                id : item.id,
                title: item.title,
                categories : item.categories.name,
                outhor :item.author,
                price : item.price,
                rating: review._avg.rating !== null ? parseFloat(review._avg.rating.toFixed(1)) : "-",
                level : item.level,
                duration : `${duration._sum.duration} mnt`,
                modul : modul,
                type : type,
                orders : order,
                image : item.image,
                rilis : item.createdAt,
                pembelian : pembelian
              };
              return modifiedItem;
            })
          );
        return Data
    }
}