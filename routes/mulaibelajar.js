const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/mulaiBelajarController"),
  validateToken = require("../middlewares/checkToken");


router.get("/:id",validateToken,controller.detailCourse)
router.post("/progres/:id/:videoId",validateToken,controller.progresBelajar)
router.post('/review/:id',validateToken ,controller.makeReview)
router.get('/review/:id',validateToken ,controller.viewReview)

module.exports = router