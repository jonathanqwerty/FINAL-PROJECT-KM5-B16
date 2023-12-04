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
router.use("/admin", adminRouter);

module.exports = router;
