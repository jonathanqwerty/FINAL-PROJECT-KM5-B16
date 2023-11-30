const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/profileController"),
  checkToken = require("../middlewares/checkToken");

router.get("/profile", checkToken, controller.profile);
router.put("/profile", checkToken, controller.profileUpdate);

module.exports = router;
