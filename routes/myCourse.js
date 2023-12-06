const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/myCourseControllers"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  checkToken = require("../middlewares/checkToken");

router.get("/", checkToken, controller.MyCourse);

module.exports = router;
