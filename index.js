require("dotenv").config();
const express = require("express");
const cors = require("cors");
const treasuryRoutes = require("./routes/treasuryRoutes");
const guardrailRoutes = require("./routes/guardrailRoutes");
const missionRoutes = require("./routes/missionRoutes");
const escrowRoutes = require("./routes/escrowRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const circleRoutes = require("./routes/circleRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const circleService = require("./services/circleService");
const demoRoutes = require("./routes/demoRoutes");

console.log("✅ missionRoutes imported");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/treasury", treasuryRoutes);
app.use("/guardrails", guardrailRoutes);
app.use("/missions", missionRoutes);
app.use("/escrow", escrowRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/payment", paymentRoutes);
app.use("/circle", circleRoutes);
app.use("/organizations", organizationRoutes);
app.use("/transactions", transactionRoutes);
app.use("/demo", demoRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("🚀 Welcome to Xecutra!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Xecutra server is running on port ${PORT}`);
});
