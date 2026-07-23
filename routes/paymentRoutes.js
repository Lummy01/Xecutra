const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

// Release Payment
router.post("/release", paymentController.releasePayment);

module.exports = router;