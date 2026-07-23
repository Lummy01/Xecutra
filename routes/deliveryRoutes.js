const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/deliveryController");

// Confirm Delivery
router.post("/", deliveryController.confirmDelivery);

// Get Delivery
router.get("/", deliveryController.getDelivery);

module.exports = router;