const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  profileRouter = require("./profile"),
  notifRouter = require("./notif");

router.use("/auth", authRouter);
router.use("/me", notifRouter,profileRouter);
router.use("/auth", authRouter);


module.exports = router;
