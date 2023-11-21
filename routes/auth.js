const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/authController"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  { users } = require("../models");

router.post("/register", controller.register);
router.post("/login", validate(schema.loginValidator), controller.login);
router.post("/reset-password", controller.resetPassword);

router.get("/set-password/:key", async (req, res) => {
  try {
    const findData = await users.findFirst({
      where: {
        resetPasswordToken: req.params.key,
      },
    });
    if (!findData) {
      return res.status(404).json({
        error: "Your email is not registered in our system",
      });
    }

    return res.status(201).json("Password has been change");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
});
router.post("/set-password", controller.setPassword);

module.exports = router;
