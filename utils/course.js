const { categories, reviews, courses, myCourse, users } = require("../models");

module.exports ={
    Course : async(data,data2) => {
      let MyCourse 
      data2 !== null ? MyCourse = await myCourse.findMany({where : {user : data2 }})
      :   
      console.log(MyCourse)
        let Data = await Promise.all(
            data.map(async (item) => {
              const review = await reviews.aggregate({
                where: {course: item.id},
                _avg: {rating: true,},
              });
              const order = await myCourse.count({
                where: {course: item.id,}
              });
              
              let pembelian = 'tidak terbeli'
              if (MyCourse){
                const course2 = await Promise.all(
                  MyCourse.map(async(item2)=>{
                    if(item.id == item2.course){
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
                type : type,
                rating: review._avg.rating || 0,
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