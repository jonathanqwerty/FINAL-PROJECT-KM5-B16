const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/profileController"),
  checkToken = require("../middlewares/checkToken"),
  updateToken = require("../middlewares/updateToken");

router.get("/", checkToken, controller.profile);
router.put("/update", updateToken, controller.profileUpdate);

module.exports = router;
