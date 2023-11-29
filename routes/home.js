const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/homeControlers"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema");

router.get('/category', controller.categories)
router.post('/popular', controller.popularCourse)

module.exports = router