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
router.post("/course/create/:key", adminToken, controller.createCourse);
router.put("/course/edit/:key", adminToken, controller.editCourse);
router.delete("/course/delete/:id", adminToken, controller.destroyCourse);
// category
router.get("/category", adminToken, controller.listCategory);
router.post("/category/create", adminToken, controller.createCategory);
router.put("/category/edit/:key", adminToken, controller.editCategory);
router.delete("/category/delete/:id", adminToken, controller.destroyCategory);
// chapter
router.post("/chapter/create/:id", adminToken, controller.createChapter);
router.get("/chapter/:id", adminToken, controller.listChapter);
router.put("/chapter/edit/:id", adminToken, controller.editChapter);
router.delete("/chapter/delete/:id", adminToken, controller.destroyChapter);

module.exports = router;
