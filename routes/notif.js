const express = require("express"),
  router = express.Router(),
  notificationsController = require("../controllers/notificationController"),
  notifToken = require("../middlewares/notifToken");

  router.get('/notifications',notifToken, notificationsController.getUserNotifications);

  module.exports = router;