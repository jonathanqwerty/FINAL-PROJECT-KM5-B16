const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/courseControllers"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  TokenFlex = require('../middlewares/TokenFlex')
  CheckToken = require('../middlewares/checkToken')

router.get('/', TokenFlex,controller.FilterCourse)
router.get('/:id',TokenFlex, controller.detailCourse)
router.get('/popup/:id',TokenFlex, controller.popUpCourse)
router.post('/order/:id', CheckToken, controller.orderCourse)
router.get('/order/:id', CheckToken, controller.getOrderCourse)
router.patch('/order/:id', CheckToken, controller.payOrder)

module.exports = router