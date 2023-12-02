const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/adminController"),
  validate = require("../middlewares/validate"),
  schema = require("../validatorSchema/authValidatorSchema"),
  adminToken = require('../middlewares/adminToken');

  router.post("/login", validate(schema.loginValidator), controller.login);
  router.get("/active-user", adminToken, controller.activeUser );
  router.get("/active-class", adminToken, controller.activeClass );
  router.get("/active-premium", adminToken, controller.activePremium );
  router.get("/dashboard", adminToken, controller.dashboardData );
  router.get("/kelola-kelas", adminToken, controller.kelolaKelas );

  module.exports = router;