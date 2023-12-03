const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/courseAdminController");

router.get("/course", controller.listCourse);
router.post("/course/create/:key", controller.course);

module.exports = router;
