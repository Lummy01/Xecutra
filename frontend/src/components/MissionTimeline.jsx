function MissionTimeline({
  missionResult,
  deliveryResult,
  paymentResult
}) {
 return (
  <div className="card">
    <h2>📋 Mission Timeline</h2>

    <div
  style={{
    padding: "12px",
    borderRadius: "10px",
    background: missionResult ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {missionResult
    ? "🟢 Mission Created"
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
    background: missionResult?.plan ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {missionResult?.plan
    ? "🟢 AI Vendor Selected"
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
    background: missionResult?.escrow ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {missionResult?.escrow
    ? "🟢 Escrow Locked"
    : "⚪ Waiting for Escrow"}
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
    background: deliveryResult ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {deliveryResult
    ? "🟢 Delivery Confirmed"
    : "⚪ Waiting for Delivery"}
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
    background: paymentResult?.success ? "#dcfce7" : "#f3f4f6",
    marginBottom: "10px",
    fontWeight: "bold"
  }}
>
  {paymentResult?.success
    ? "🟢 Payment Released"
    : "⚪ Awaiting Payment"}
</div>
  </div>
);
}

export default MissionTimeline;
