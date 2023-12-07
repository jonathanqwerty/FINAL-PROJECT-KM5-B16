const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/adminController"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  adminToken = require("../middlewares/adminToken");

router.post("/login", validate(schema.loginValidator), controller.login);
router.get("/active-user", adminToken, controller.activeUser);
router.get("/active-class", adminToken, controller.activeClass);
router.get("/active-premium", adminToken, controller.activePremium);
router.get("/dashboard", adminToken, controller.dashboardData);
router.get("/kelola-kelas", adminToken, controller.kelolaKelas);
// course
router.get("/course/:categoryId", adminToken, controller.listCourse);
router.post("/course/create/:categoryId", adminToken, controller.createCourse);
router.put("/course/edit/:id", adminToken, controller.editCourse);
router.delete("/course/delete/:id", adminToken, controller.destroyCourse);
// category
router.get("/category", adminToken, controller.listCategory);
router.post("/category/create", adminToken, controller.createCategory);
router.put("/category/edit/:id", adminToken, controller.editCategory);
router.delete("/category/delete/:id", adminToken, controller.destroyCategory);
// chapter
router.get("/chapter/:courseId", adminToken, controller.listChapter);
router.post("/chapter/create/:courseId", adminToken, controller.createChapter);
router.put("/chapter/edit/:id", adminToken, controller.editChapter);
router.delete("/chapter/delete/:id", adminToken, controller.destroyChapter);
// source
router.get("/source/:chapterId", adminToken, controller.listSource);
router.post("/source/create/:chapterId", adminToken, controller.createSource);
router.put("/source/edit/:id", adminToken, controller.editSource);
router.delete("/source/delete/:id", adminToken, controller.destroySource);

module.exports = router;
