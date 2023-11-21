const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/authController"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/reset-password", controller.resetPassword);
router.post("/set-password", controller.setPassword);

module.exports = router;
