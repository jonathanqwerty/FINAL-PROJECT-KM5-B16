const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  profileRouter = require("./profile"),
<<<<<<< HEAD
  notifRouter = require ("./notif"),
  homeRouter = require("./home"),
  courseRouter = require("./course")
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/me", notifRouter);
router.use("/home", homeRouter);
router.use("/course", courseRouter);
=======
  notifRouter = require("./notif");

router.use("/auth", authRouter);
router.use("/me", notifRouter,profileRouter);
router.use("/auth", authRouter);
>>>>>>> 3d5a167dc8199e8a8c4190ebb6d5f48f5a92bea3


module.exports = router;
