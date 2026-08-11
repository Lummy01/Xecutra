function GuardrailCard({ guardrails }) {
  return (
    <div>
      <h2>🛡 Treasury Guardrails</h2>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>💵 Max Vendor Spend</strong>
        </p>

        <p
          style={{
            color: "#2563eb",
            fontSize: "22px",
            marginBottom: "18px"
          }}
        >
          ${guardrails?.maxVendorSpend ?? "0"}
        </p>

        <p>
          <strong>🏦 Minimum Reserve</strong>
        </p>

        <p
          style={{
            color: "#2563eb",
            fontSize: "22px",
            marginBottom: "18px"
          }}
        >
          ${guardrails?.minimumReserve ?? "0"}
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
          {guardrails?.escrowRequired
            ? "✅ Enabled"
            : "❌ Not Required"}
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
            : "❌ Not Required"}
        </p>
      </div>
    </div>
  );
}

export default GuardrailCard;
