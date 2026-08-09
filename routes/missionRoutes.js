console.log("✅ missionRoutes file loaded");
const express = require("express");
const router = express.Router();

const missionController = require("../controllers/missionController");

// Create Mission
router.post("/", missionController.createMission);

router.get(
    "/transaction/:transactionId",
    missionController.getTransactionStatus
);

router.patch(
    "/:id/complete",
    missionController.completeMission
);

// Get Mission
router.get("/:organizationId", missionController.getMissions);

module.exports = router;
