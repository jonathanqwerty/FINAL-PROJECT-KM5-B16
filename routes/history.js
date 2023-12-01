const express = require("express"),
  router = express.Router(),
  historyPayment = require("../controllers/historyPaymentControllers"),
  checkToken = require("../middlewares/checkToken");

  router.get('/payment-history',checkToken, historyPayment.getPaymentHistory);

  module.exports = router;