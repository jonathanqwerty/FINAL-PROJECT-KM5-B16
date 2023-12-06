const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/homeControlers"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  checkToken = require("../middlewares/checkToken");

router.get("/mycourse", controller.categories);

module.exports = router;
