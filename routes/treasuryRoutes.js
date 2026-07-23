const express = require("express");
const router = express.Router();

const treasuryController = require("../controllers/treasuryController");

// Create Treasury
router.post("/create", treasuryController.createTreasury);

// Get Treasury
router.get("/", treasuryController.getTreasury);

// Get Treasury USDC Balance
router.get("/:organizationId/balance", treasuryController.getTreasuryBalance);

module.exports = router;