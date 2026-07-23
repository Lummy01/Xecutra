const express = require("express");
const router = express.Router();

const circleController = require("../controllers/circleController");

router.post("/create-wallet", circleController.createWallet);

module.exports = router;