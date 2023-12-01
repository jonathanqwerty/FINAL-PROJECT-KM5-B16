const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  profileRouter = require("./profile"),
  notifRouter = require ("./notif"),
  homeRouter = require("./home"),
  courseRouter = require("./course")
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/me", notifRouter);
router.use("/home", homeRouter);
router.use("/course", courseRouter);


module.exports = router;
