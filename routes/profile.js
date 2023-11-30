const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/profileController"),
  checkToken = require("../middlewares/checkToken");

router.get("/", checkToken, controller.profile);
router.put("/update", checkToken, controller.profileUpdate);

module.exports = router;
