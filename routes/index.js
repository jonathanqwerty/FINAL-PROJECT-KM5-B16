const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  profileRouter = require("./profile"),
  notifRouter = require("./notif"),
  homeRouter = require("./home"),
  courseRouter = require("./course"),
  historyRouter = require("./history"),
  adminRouter = require("./admin");
router.use("/auth", authRouter);
router.use("/home", homeRouter);
router.use("/course", courseRouter);
router.use("/me", notifRouter, profileRouter, historyRouter);
=========
  courseRouter = require("./course");
router.use("/auth", authRouter);
router.use("/home", homeRouter);
router.use("/course", courseRouter);
router.use("/me", notifRouter, profileRouter);
>>>>>>>>> Temporary merge branch 2

module.exports = router;
