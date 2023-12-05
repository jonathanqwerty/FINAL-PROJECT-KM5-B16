const validate = require("../middlewares/validate");
const {
    users,
    notifications,
    courses,
    orders,
    categories,
  } = require("../models"),
  utils = require("../utils/index"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secrest";

module.exports = {
  login: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        return res.status(403).json({
          error: "Your email is not registered in our system",
        });
      }
      if (findUser && findUser.isActive === false) {
        return res.status(403).json({
          message: "Please verify you account first",
        });
      }
      if (findUser && findUser.role !== "admin") {
        return res.status(403).json({
          message: "You are not an admin to access this endpoint",
        });
      }
      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        const token = jwt.sign(
          {
            id: findUser.id,
            email: findUser.email,
            phone: findUser.phone,
            role: findUser.role,
          },
          secret_key,
          { expiresIn: "6h" }
        );
        await notifications.create({
          data: {
            userId: findUser.id,
            message: "You have successfully logged in.",
          },
        });
        return res.status(200).json({
          data: {
            token,
          },
        });
      }

      return res.status(403).json({
        message: "Invalid Password",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  activeUser: async (req, res) => {
    try {
      const activeUser = await users.count({
        where: {
          isActive: true,
        },
      });
      return res.status(200).json({
        activeUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  activeClass: async (req, res) => {
    try {
      const activeClass = await courses.count({
        where: {
          available: true,
        },
      });
      return res.status(200).json({
        activeClass,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  activePremium: async (req, res) => {
    try {
      const activePremium = await courses.count({
        where: {
          price: {
            not: 0,
          },
        },
      });
      return res.status(200).json({
        activePremium,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  dashboardData: async (req, res) => {
    try {
      const searchQuery = req.query.filter || "";
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const dashboardData = await orders.findMany({
        select: {
          id: true,
          status: true,
          createdAt: true,
          myCourse: {
            select: {
              progress: true,
              users: {
                select: {
                  email: true,
                  profiles: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              courses: {
                select: {
                  title: true,
                  categories: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          myCourse: {
            courses: {
              title: {
                contains: searchQuery,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: pageSize,
        skip: skip,
      });
      return res.status(200).json({
        data: dashboardData,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
  kelolaKelas: async (req, res) => {
    try {
      const searchQuery = req.query.filter || "";
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const kelas = await courses.findMany({
        select: {
          id: true,
          categories: {
            select: {
              name: true,
            },
          },
          title: true,
          price: true,
          level: true,
        },
        where: {
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        take: pageSize,
        skip: skip,
      });
      const filteredKelas = kelas.map((kelolakelas) => ({
        kelolakelas,
        priceType: kelolakelas.price === 0 ? "free" : "paid",
      }));

      res.status(200).json({
        data: filteredKelas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },

  // course
  createCourse: async (req, res) => {
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

  editCourse: async (req, res) => {
    try {
      const editCourse = await courses.update({
        where: {
          id: parseInt(req.params.key),
        },
        data: {
          title: req.body.title || courses.title,
          author: req.body.author || courses.author,
          telegram: req.body.telegram || courses.telegram,
          image: req.body.image || courses.image,
          description: req.body.description || courses.description,
          price: parseInt(req.body.price) || courses.price,
        },
      });
      return res.status(200).json({
        success: true,
        editCourse,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  destroyCourse: async (req, res) => {
    try {
      const course = await courses.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(204).json({
        message: "success delete course",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // category
  createCategory: async (req, res) => {
    try {
      const category = await categories.create({
        data: {
          name: req.body.name,
          image: req.body.image,
        },
      });
      return res.status(201).json({
        message: "success crate category",
        category,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  listCategory: async (req, res) => {
    try {
      const category = await categories.findMany();
      return res.status(200).json({
        category,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  editCategory: async (req, res) => {
    try {
      const editCategory = await categories.update({
        where: {
          id: parseInt(req.params.key),
        },
        data: {
          name: req.body.name || categories.name,
          image: req.body.image || categories.image,
        },
      });
      return res.status(200).json({
        success: true,
        editCategory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  destroyCategory: async (req, res) => {
    try {
      const data = await categories.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(204).json({
        message: "success delete category",
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
