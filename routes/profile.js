const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/profileController"),
  checkToken = require("../middlewares/checkToken"),
  multer = require("multer")();

router.get("/profile", checkToken, controller.profile);
router.put(
  "/profile/update",
  multer.single("image"),
  checkToken,
  controller.profileUpdate
);

module.exports = router;
