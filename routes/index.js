const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth");

router.use("/auth", authRouter);

module.exports = router;
