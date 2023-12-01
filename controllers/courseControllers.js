const { categories, reviews, courses, myCourse } = require("../models");
const {Course} = require('../utils/course')

module.exports = {
    FilterCourse : async(req, res)=>{
      // filtering sebuah course
        try {
        const kategori = req.query.kategori;
        const search = req.query.search;
        const filter = req.query.filter;
        const level = req.query.level;
        const type = req.body.type;
        let user = res.user ? res.user.id : null

        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 12;
        const skip = (page - 1) * itemsPerPage;


        // filter
        let data = await courses.findMany({
          skip,
          take : itemsPerPage,
          where: {
            categories: kategori !== null ? { name: kategori } : {},
            title : search !== null ? {contains: search}:{},
            level : level !== null ? level:{},
            price : type == null ? {} : type == 'premium' ? {not : 0}: 0
          },
          include: {
            categories: true,
          },
          
        });

        // data = data.slice((page-1)*itemsPerPage,(page*itemsPerPage))

        if(data.length == 0){return res.status(404).json({message : "not found data"})}
        console.log('jumlah data : '+ data.length)

        // mendapatkan count popularity dan memperbaiki return
        let course = await Course(data,user)

        // filter type course
        filter !== null ? 
        filter == 'paling baru' ? 
        course.sort((a, b) => a.rilis - b.rilis) : 
        course.sort((a, b) => b.orders - a.orders) : console.log('no filter')

        return res.status(200).json({
            course
        })
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            error,
            message: "Internal server error",
          });
        }
    }
}
