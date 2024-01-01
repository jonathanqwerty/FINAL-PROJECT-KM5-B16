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
    progres,
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

  // get all
  listCourse: async (req, res) => {
    try {
      const course = await course.findMany();
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

  // get by id
  course: async (req, res) => {
    try {
      const course = await courses.findUnique({
        where: {
          courseId: parseInt(req.params.courseId),
        },
      });
      return res.status(200).json({
        course,
      });
    } catch (error) {
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  // mengedit course
  editCourse: async (req, res) => {
    try {
      const courseDataToUpdate = {
        title: req.body.title || courses.title,
        author: req.body.author || courses.author,
        telegram: req.body.telegram || courses.telegram,
        description: req.body.description || courses.description,
        price: parseInt(req.body.price) || courses.price,
        level: req.body.level || courses.level,
        prepare: req.body.prepare || courses.prepare,
      };

      if (req.file) {
        const fileTostring = req.file.buffer.toString("base64");

        const uploadFile = await imageKit.upload({
          fileName: req.file.originalname,
          file: fileTostring,
        });

        courseDataToUpdate.image = uploadFile.url;
      }

      const courseId = parseInt(req.params.id);
      const existingCourse = await courses.findFirst({
        where: {
          id: courseId,
        },
      });

      if (!existingCourse) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      const updatedCourse = await courses.update({
        where: {
          id: courseId,
        },
        data: courseDataToUpdate,
      });

      return res.status(200).json({
        success: "Successfully updated course",
        updatedCourse,
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
      const course = await courses.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          available: false,
        },
      });
      return res.status(200).json({
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

  // get by id
  category: async (req, res) => {
    try {
      const category = await categories.findUnique({
        where: {
          id: parseInt(req.params.categoryId),
        },
      });
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
      let categoryDataToUpdate = {
        name: req.body.name,
      };

      if (req.file) {
        const fileTostring = req.file.buffer.toString("base64");

        const uploadFile = await imageKit.upload({
          fileName: req.file.originalname,
          file: fileTostring,
        });

        categoryDataToUpdate.image = uploadFile.url;
      }

      const categoryId = parseInt(req.params.id);
      const existingCategory = await categories.findFirst({
        where: {
          id: categoryId,
        },
      });

      if (!existingCategory) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      const updatedCategory = await categories.update({
        where: {
          id: categoryId,
        },
        data: categoryDataToUpdate,
      });

      return res.status(200).json({
        success: "Successfully updated category",
        updatedCategory,
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
      const data = await categories.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          available: false,
        },
      });
      return res.status(200).json({
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
          courseId: parseInt(req.params.courseId),
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
          success: true,
          message: "success create new chapter",
          chapter,
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

  // get by id
  listChapterById: async (req, res) => {
    try {
      const chapter = await chapters.findUnique({
        where: {
          id: parseInt(req.params.chapterId),
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

  // get all
  listChapter: async (req, res) => {
    try {
      const chapter = await chapters.findMany();
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
      const existChapter = await chapters.findFirst({
        where: {
          id: parseInt(req.params.id),
        },
      });
      if (!existChapter) {
        return res.status(404).json({
          error,
          message: "Not found data",
        });
      }
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
      //get source
      const source = await sources.findMany({
        where: {
          chapterId: parseInt(req.params.id),
        },
        select: {
          id: true,
        },
      });
      //object to array
      const arraySource = source.map((item) => item.id);
      // delete source dan progress
      if (source.length != 0) {
        await sources.deleteMany({
          where: {
            id: {
              in: arraySource,
            },
          },
        });
        await progres.deleteMany({
          where: {
            sourceId: {
              in: arraySource,
            },
          },
        });
      }
      // delete chapter
      const data = await chapters.deleteMany({
        where: {
          id: parseInt(req.params.id),
        },
      });
      if (data.count == 0) {
        return res.status(404).json({
          success: true,
          message: "not found source to deleted",
        });
      }
      return res.status(200).json({
        success: true,
        message: "success, chapter deleted",
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
          chapterId: parseInt(req.params.chapterId),
          name: req.body.name,
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
          success: true,
          message: "success create source",
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

  // get by id
  listSourceById: async (req, res) => {
    try {
      const source = await sources.findUnique({
        where: {
          id: parseInt(req.params.sourceId),
        },
      });
      return res.status(200).json({
        success: true,
        message: "success get the source video",
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

  // get all
  listSource: async (req, res) => {
    try {
      const source = await sources.findMany();
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
          name: req.body.name || sources.name,
          link: req.body.link || sources.link,
        },
      });
      return res.status(200).json({
        success: true,
        message: "success edit source",
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
      const progress = await progres.deleteMany({
        where: {
          sourceId: parseInt(req.params.id),
        },
      });
      const data = await sources.deleteMany({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (data.count == 0) {
        return res.status(404).json({
          success: true,
          message: "not found source to delete",
        });
      }

      return res.status(200).json({
        success: true,
        message: "success delete source",
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
