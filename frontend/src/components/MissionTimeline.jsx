function MissionTimeline({
  missionResult,
  deliveryResult,
  paymentResult,
  activeStep
}) {

  const stepOrder = [
  "AI Analysis",
  "Vendor Selection",
  "Guardrails",
  "Escrow",
  "Delivery",
  "Payment"
];

const currentStepIndex = stepOrder.indexOf(activeStep);

const hasReached = (step) => {
  const stepIndex = stepOrder.indexOf(step);
  return currentStepIndex >= stepIndex;
};

 return (
  <div className="card">
    <h2>⚡ Autonomous Mission Flow</h2>

    <div
  style={{
    padding: "12px",
    borderRadius: "10px",
    background: hasReached("AI Analysis") ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {hasReached("AI Analysis")
  ? "🟢 Mission created"
  : "⚪ Mission Not Created"}
</div>

    <div
  style={{
    textAlign: "center",
    fontSize: "24px",
    color: "#9ca3af",
    margin: "6px 0"
  }}
>
  ↓
</div>

    <div
  style={{
    padding: "12px",
    borderRadius: "10px",
    background: hasReached("Guardrails") ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {hasReached("Guardrails")
  ? "🟢 AI Plan Generated"
  : "⚪ Awaiting AI Decision"}
</div>

    <div
  style={{
    textAlign: "center",
    fontSize: "24px",
    color: "#9ca3af",
    margin: "6px 0"
  }}
>
  ↓
</div>

    <div
  style={{
    padding: "12px",
    borderRadius: "10px",
    background: hasReached("Escrow") ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {hasReached("Escrow")
  ? "🟢 Escrow Locked"
  : "⚪ Awaiting Escrow"}
</div>

    <div
  style={{
    textAlign: "center",
    fontSize: "24px",
    color: "#9ca3af",
    margin: "6px 0"
  }}
>
  ↓
</div>

    <div
  style={{
    padding: "12px",
    borderRadius: "10px",
    background: hasReached("Delivery") ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {hasReached("Delivery")
  ? "🟢 Delivery Verified"
  : "⚪ Awaiting Delivery"}
</div>

    <div
  style={{
    textAlign: "center",
    fontSize: "24px",
    color: "#9ca3af",
    margin: "6px 0"
  }}
>
  ↓
</div>

    <div
  style={{
    padding: "12px",
    borderRadius: "10px",
    background: hasReached("Payment") ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {hasReached("Payment")
  ? "🟢 Payment Settled"
  : "⚪ Awaiting Payment"}
</div>
  </div>
);
}

export default MissionTimeline;
