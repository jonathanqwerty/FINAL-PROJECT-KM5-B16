const { categories, reviews, courses, myCourse } = require("../models");
const {Course} = require('../utils/course')

module.exports = {
  popularCourse: async (req, res) => {
    // find seluruh course, urut berdasarkan popularitas
    try {
      let categori = req.query.categories || null
      let user = res.user ? res.user.id : null

      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 12;
      const skip = (page - 1) * itemsPerPage; 

      // filtering & pagingnation course 
      const data = await courses.findMany({
        skip,
        take : itemsPerPage,
        where: {
          available : true,
          categories: categori !== null ?  { name: { contains: categori } } : {},
        },
        include: {
          categories: true,
          chapters : true
        },
      });

      if(!data){return res.status(404).json({
        error : "error",
        message : "not found data"})}
      if (data.length == 0) {
        return res.status(404).json({ 
          error : "error",
          message: "not found data" });
      }

      // count popularity dan return yg dibutuhkan 
      let course = await Course(data, user)

      // sort desc popularity by order 
      course.sort((a, b) => b.orders - a.orders);

      // return
      return res.status(200).json({
        success : "success",
        popular : course,
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },
  categories: async (req, res) => {
    // find seluruh kategori yang tersedia
    try {
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 5;
      const skip = (page - 1) * itemsPerPage;

      // pagingnation
      const data = await categories.findMany({
        skip,
        take: itemsPerPage,
      });
      if(!data){return res.status(404).json({
        error : "error",
        message : "not found data"})}

      // return yg dibutuhkan 
      const category = data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          image: item.image,
        };
      });

      // return 
      return res.status(200).json({
        success : "success",
        categories: category,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },
};
