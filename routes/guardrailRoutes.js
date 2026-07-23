const express = require("express");
const router = express.Router();

const guardrailController = require("../controllers/guardrailController");

// Create or update guardrails
router.post("/", guardrailController.setGuardrails);

// Get guardrails for one organization
router.get("/:organizationId", guardrailController.getGuardrails);

module.exports = router;