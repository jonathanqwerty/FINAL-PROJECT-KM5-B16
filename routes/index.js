const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  profileRouter = require("./profile");

router.use("/auth", authRouter);
router.use("/profile", profileRouter);

module.exports = router;
