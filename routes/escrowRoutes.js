const express = require("express");
const router = express.Router();

const escrowController = require("../controllers/escrowController");

// Create Escrow
router.post("/", escrowController.createEscrow);

// Get Escrow
router.get("/", escrowController.getEscrow);

module.exports = router;
