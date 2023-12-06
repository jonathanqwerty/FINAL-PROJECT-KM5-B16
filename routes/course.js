const CheckToken = require("../middlewares/checkToken")

const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/courseControllers"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  TokenFlex = require('../middlewares/TokenFlex')
  checkToken = require('../middlewares/checkToken')

router.get('/', TokenFlex,controller.FilterCourse)
router.get('/:id',controller.detailCourse)
router.get('/popup/:id',controller.popUpCourse)
router.post('/order/:id', CheckToken, controller.orderCourse)

module.exports = router