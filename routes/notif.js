const express = require("express"),
  router = express.Router(),
  notificationsController = require("../controllers/notificationController"),
  checkToken = require("../middlewares/checkToken");

  router.get('/:userId/notifications',checkToken, notificationsController.getUserNotifications);

  module.exports = router;