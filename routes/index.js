const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  profileRouter = require("./profile"),
  notifRouter = require("./notif");

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/me", notifRouter);

module.exports = router;
