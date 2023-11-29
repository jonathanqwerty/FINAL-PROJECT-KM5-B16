const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  profileRouter = require("./profile");
  homeRouter = require("./home");

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/home", homeRouter);


module.exports = router;
