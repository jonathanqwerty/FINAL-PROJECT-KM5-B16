const { categories, reviews, courses, myCourse } = require("../models");

module.exports = {
  popularCourse: async (req, res) => {
    try {
      const data = await courses.findMany({
        include: {
          categories: true,
        },
      });
      const course = await Promise.all(
        data.map(async (item) => {
          const review = await reviews.aggregate({
            where: {
              course: item.id,
            },
            _avg: {
              rating: true,
            },
          });

          const order = await myCourse.count({
            where: {
              course: item.id,
            }
          });

          const modifiedItem = {
            id : item.id,
            title: item.title,
            outhor :item.author,
            price : item.price,
            image : item.image,
            categories : item.categories.name,
            reviewAverage: review._avg.rating || 0,
            orders : order
          };
          return modifiedItem;
        })
      );
      course.sort((a, b) => b.orders - a.orders);

      return res.status(200).json({
        data: course,
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
    try {
      const page = 1;
      const itemsPerPage = 5;
      const skip = (page - 1) * itemsPerPage;
      const data = await categories.findMany({
        skip,
        take: itemsPerPage,
      });

      const category = data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          image: item.image,
        };
      });

      return res.status(200).json({
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
