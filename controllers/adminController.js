const validate = require("../middlewares/validate");
const { imageKit } = require("../utils/imageKit");
const {
    users,
    notifications,
    courses,
    orders,
    categories,
    chapters,
    sources,
  } = require("../models"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";

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

  // membuat course
  createCourse: async (req, res) => {
    try {
      // mencari course apakah sudah ada atau belum
      const findCourse = await courses.findFirst({
        where: {
          title: req.body.title,
        },
      });
      if (findCourse) {
        return res.status(302).json({
          error: "Course already exist  ",
        });
      }

      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      if (!findCourse) {
        const course = await courses.create({
          data: {
            categoryId: parseInt(req.params.categoryId),
            title: req.body.title,
            author: req.body.author,
            telegram: req.body.telegram,
            image: uploadFile.url,
            description: req.body.description,
            price: parseInt(req.body.price),
            level: req.body.level,
            prepare: req.body.prepare,
          },
        });
        return res.status(201).json({
          success: "course are created",
          course,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // menampilkan course berdasarkan category id
  listCourse: async (req, res) => {
    try {
      const course = await courses.findMany({
        where: {
          categoryId: parseInt(req.params.categoryId),
        },
      });
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

  // mengedit course
  editCourse: async (req, res) => {
    try {
      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });
      const editCourse = await courses.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          title: req.body.title || courses.title,
          author: req.body.author || courses.author,
          telegram: req.body.telegram || courses.telegram,
          image: uploadFile.url || courses.image,
          description: req.body.description || courses.description,
          price: parseInt(req.body.price) || courses.price,
          leve: req.body.level || courses.level,
          prepare: req.body.prepare || courses.prepare,
        },
      });
      return res.status(200).json({
        success: "Success edit this course",
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

  // meghapus course
  destroyCourse: async (req, res) => {
    try {
      const course = await courses.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(204).json({
        success: "success delete course",
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

  // memuat category
  createCategory: async (req, res) => {
    try {
      // mencari category apakah sudah ada atau belum
      const findCategory = await categories.findFirst({
        where: {
          name: req.body.name,
        },
      });
      console.log(req.body.name);
      if (findCategory) {
        return res.status(302).json({
          message: "Category already exist",
        });
      }
      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      if (!findCategory) {
        const category = await categories.create({
          data: {
            name: req.body.name,
            image: uploadFile.url,
          },
        });
        return res.status(201).json({
          success: "success crate category",
          category,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // melihat daftar category
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

  // mengedit category yang sudah ada
  editCategory: async (req, res) => {
    try {
      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      const editCategory = await categories.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: req.body.name || categories.name,
          image: uploadFile.url || categories.image,
        },
      });
      return res.status(200).json({
        success: "Success edit this category",
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

  // mendelete category yang sudah ada
  destroyCategory: async (req, res) => {
    try {
      const data = await categories.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(204).json({
        success: "success delete category",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // chapter
  createChapter: async (req, res) => {
    try {
      // mencari chapter apakah sudah ada atau belum
      const findChapter = await chapters.findFirst({
        where: {
          title: req.body.title,
        },
      });
      if (findChapter) {
        return res.status(302).json({
          error: "Chapter already exist",
        });
      }
      if (!findChapter) {
        const chapter = await chapters.create({
          data: {
            courseId: parseInt(req.params.courseId),
            title: req.body.title,
            duration: parseInt(req.body.duration),
          },
        });
        return res.status(201).json({
          chapter,
          success: "success create new chapter",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // melihat daftar chapter
  listChapter: async (req, res) => {
    try {
      const chapter = await chapters.findMany({
        where: {
          courseId: parseInt(req.params.courseId),
        },
      });
      return res.status(200).json({
        chapter,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // mengedit chapter yang sudah ada
  editChapter: async (req, res) => {
    try {
      const chapterEdit = await chapters.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          courseId: chapters.courseId,
          title: req.body.title || chapters.title,
          duration: parseInt(req.body.duration) || chapters.duration,
        },
      });
      return res.status(200).json({
        success: "success edit Chapter",
        chapterEdit,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // menghapus chapter yang telah ada
  destroyChapter: async (req, res) => {
    try {
      const data = await chapters.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(204).json({
        success: "success delete category",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // Source
  // membuat source baru
  createSource: async (req, res) => {
    try {
      // mencari apakah source telah di buat atau belum
      const findSource = await sources.findFirst({
        where: {
          name: req.body.name,
          link: req.body.link,
        },
      });
      if (findSource) {
        return res.status(302).json({
          error: "Source already exist",
        });
      }
      if (!findSource) {
        const source = await sources.create({
          data: {
            chapterId: parseInt(req.params.chapterId),
            name: req.body.name,
            link: req.body.link,
          },
        });
        return res.status(201).json({
          success: "success create source",
          source,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // menampilkan semua source berdasarkan chapter
  listSource: async (req, res) => {
    try {
      const source = await sources.findMany({
        where: {
          chapterId: parseInt(req.params.chapterId),
        },
      });
      return res.status(200).json({
        source,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // mengedit source yang sudah ada
  editSource: async (req, res) => {
    try {
      const sourceEdit = await sources.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          chapterId: sources.chapterId,
          name: req.boy.name || sources.name,
          link: req.body.link || sources.link,
        },
      });
      return res.status(200).json({
        success: "success edit source",
        sourceEdit,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // menghapus source yang sudah ada
  destroySource: async (req, res) => {
    try {
      const data = await sources.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(204).json({
        success: "success delete source",
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
