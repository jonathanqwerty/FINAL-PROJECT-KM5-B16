const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/homeControlers"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  TokenFlex = require('../middlewares/TokenFlex')


router.get('/category', controller.categories)
router.post('/popular',TokenFlex, controller.popularCourse)

module.exports = router