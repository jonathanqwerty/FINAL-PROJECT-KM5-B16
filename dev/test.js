const { categories, reviews, courses, myCourse } = require("../models");
const {Course} = require('../utils/course');

 async function FilterCourse(){
  try {
    const kategori = 'Fullstack'
    const search =  null
    const filter = null
    const level = null
    const type =null
    let user = 1

    const page =  1;
    const itemsPerPage = 12;
    const skip = (page - 1) * itemsPerPage;

    let data = await myCourse.findMany({
        skip,
        take : itemsPerPage,
        where: {
          courses:{
          categories: kategori !== null ? { name: kategori } : {},
          title : search !== null ? {contains: search}:{},
          level : level !== null ? level:{},
          price : type !== null ? type == 'premium' ? {not : 0}: 0 : {}
          }
        },
        include: {
          courses: {
            include:{
              categories:true
            }
          } 
        },
      });
      console.log(data)
      console.log('data')



} catch (error) {
    console.log(error)
}
};

FilterCourse()
