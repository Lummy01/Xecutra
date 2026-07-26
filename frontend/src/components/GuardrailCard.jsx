function GuardrailCard({ guardrails }) {
  return (
    <div className="card">
      <h2>🛡️ Guardrails</h2>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>💵 Max Vendor Spend</strong>
        </p>
        <p style={{ color: "#2563eb", fontSize: "22px", marginBottom: "18px" }}>
          ${guardrails?.maxVendorSpend}
        </p>

        <p>
          <strong>🏦 Minimum Reserve</strong>
        </p>
        <p style={{ color: "#2563eb", fontSize: "22px", marginBottom: "18px" }}>
          ${guardrails?.minimumReserve}
        </p>

        <hr style={{ margin: "18px 0" }} />

        <p>
          <strong>Escrow Required</strong>
        </p>

        <p
          style={{
            color: guardrails?.escrowRequired ? "green" : "red",
            fontWeight: "bold",
            marginBottom: "16px"
          }}
        >
          {guardrails?.escrowRequired ? "✅ Enabled" : "❌ Disabled"}
        </p>

        <p>
          <strong>Approved Vendors Only</strong>
        </p>

        <p
          style={{
            color: guardrails?.approvedVendorsOnly ? "green" : "red",
            fontWeight: "bold"
          }}
        >
          {guardrails?.approvedVendorsOnly
            ? "✅ Enabled"
            : "❌ Disabled"}
        </p>
      </div>
    </div>
  );
}

export default GuardrailCard;