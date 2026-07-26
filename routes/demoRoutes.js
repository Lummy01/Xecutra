const express = require("express");
const router = express.Router();

const demoController = require("../controllers/demoController");

router.post(
  "/execute-mission",
  demoController.executeDemo
);

router.get("/stream", demoController.streamMission);

module.exports = router;