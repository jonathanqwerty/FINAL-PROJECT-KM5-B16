const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/courseControllers"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  TokenFlex = require('../middlewares/TokenFlex')

router.post('/', TokenFlex,controller.FilterCourse)

module.exports = router