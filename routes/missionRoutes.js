console.log("✅ missionRoutes file loaded");
const express = require("express");
const router = express.Router();

const missionController = require("../controllers/missionController");

// Create Mission
router.post("/", missionController.createMission);

// Get Mission
router.get("/:organizationId", missionController.getMissions);

module.exports = router;