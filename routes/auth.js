const { route } = require("./home");

const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/authController"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema");

// auth
router.post(
  "/register",
  validate(schema.registerValidator),
  controller.register
);
router.post(
  "/otp/:key",
  validate(schema.verifyValidator),
  controller.verifyUser
);
router.post("/reset-otp", controller.resetOtp);
router.post("/login", validate(schema.loginValidator), controller.login);
router.post("/reset-password", controller.resetPassword);
router.post("/set-password/:key", controller.setPassword);

//Oauth
router.post("/google", controller.callbackLogin);

module.exports = router;
