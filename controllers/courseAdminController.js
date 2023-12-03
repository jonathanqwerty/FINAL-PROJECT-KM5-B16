const { courses, categories } = require("../models");

module.exports = {
  course: async (req, res) => {
    try {
      const course = await courses.create({
        data: {
          categoryId: parseInt(req.params.key),
          title: req.body.title,
          author: req.body.author,
          telegram: req.body.telegram,
          image: req.body.image,
          description: req.body.description,
          price: parseInt(req.body.price),
        },
      });
      return res.status(201).json({
        message: "course are created",
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

  listCourse: async (req, res) => {
    try {
      const course = await courses.findMany();
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
};
