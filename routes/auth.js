const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/authController"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  { users } = require("../models");

router.post("/register", controller.register);
router.post("/login", validate(schema.loginValidator), controller.login);
router.post("/reset-password", controller.resetPassword);
router.post("/set-password/:key", controller.setPassword);

module.exports = router;
