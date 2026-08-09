function MissionForm({
  formData,
  setFormData,
  createMission,
  missionResult,
  deliveryResult,
  paymentResult,
  confirmDelivery,
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
      <h2>📋 Create Mission</h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "20px"
        }}
      >
        Define your mission and let Xecutra plan, secure, and execute it
        autonomously.
      </p>

      <form onSubmit={createMission}>
        <div style={{ marginBottom: "18px" }}>
          <p>
            <strong>Mission Title</strong>
          </p>

          <input
            type="text"
            placeholder="Enter a mission title..."
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value
              })
            }
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <p>
            <strong>Mission Details</strong>
          </p>

          <textarea
            placeholder="Describe what you want Xecutra to accomplish..."
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value
              })
            }
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <p>
            <strong>Estimated Cost (USDC)</strong>
          </p>

          <input
            type="number"
            placeholder="Enter estimated cost..."
            value={formData.estimatedCost}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedCost: e.target.value
              })
            }
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <p>
            <strong>Execution Deadline</strong>
          </p>

          <input
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({
                ...formData,
                deadline: e.target.value
              })
            }
          />
        </div>

        <button type="submit">
          🤖 Generate Mission Plan
        </button>
      </form>

      {/* AI Mission Plan appears only after Guardrails is reached */}
      {missionResult && hasReached("Guardrails") && (
        <>
          <hr />

          <h3>🤖 AI Mission Plan</h3>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "20px"
            }}
          >
            Xecutra analyzed your mission, evaluated guardrails, selected the
            best vendor, and generated the execution plan below.
          </p>

          <p>
            <strong>Selected Vendor:</strong>{" "}
            {missionResult.plan.selectedVendor}
          </p>

          <p>
            <strong>Estimated Cost:</strong>{" "}
            {Number(
              missionResult.mission.estimatedCost
            ).toFixed(2)} USDC
          </p>

          <p>
            <strong>Approval Status</strong>
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: missionResult.plan.approved
                ? "#dcfce7"
                : "#fee2e2",
              color: missionResult.plan.approved
                ? "#166534"
                : "#991b1b",
              fontWeight: "bold",
              marginBottom: "18px"
            }}
          >
            {missionResult.plan.approved
              ? "✅ APPROVED"
              : "❌ REJECTED"}
          </div>

          <p>
            <strong>Reason:</strong>{" "}
            {missionResult.plan.reason}
          </p>

          {missionResult?.escrow && (
            <>
              <p>
                <strong>Escrow Status</strong>
              </p>

              <div
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background:
                    missionResult.escrow.status === "LOCKED"
                      ? "#dbeafe"
                      : "#dcfce7",
                  color:
                    missionResult.escrow.status === "LOCKED"
                      ? "#1d4ed8"
                      : "#166534",
                  fontWeight: "bold",
                  marginBottom: "20px"
                }}
              >
                {missionResult?.escrow?.status === "LOCKED"
                  ? "🔒 LOCKED"
                  : "✅ RELEASED"}
              </div>
            </>
          )}

          <br />

          <button onClick={confirmDelivery}>
            📦 Verify Delivery
          </button>

          {deliveryResult && (
            <>
              <hr />

              <h3>Delivery</h3>

              <p>
                <strong>Status:</strong>{" "}
                {deliveryResult.status}
              </p>

              <p>
                <strong>Confirmed By:</strong>{" "}
                {deliveryResult.confirmedBy}
              </p>
            </>
          )}

          {paymentResult?.success && (
            <>
              <hr />

              <h3>💸 Payment Released</h3>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "18px",
                  marginTop: "15px"
                }}
              >
                <p>
                  <strong>Result:</strong>{" "}
                  {paymentResult.message}
                </p>

                <p>
                  <strong>Escrow Status:</strong>{" "}
                  {paymentResult.escrow?.status}
                </p>

                <p>
                  <strong>Selected Vendor:</strong>{" "}
                  {missionResult.plan.selectedVendor}
                </p>

                <p>
                  <strong>Amount:</strong>{" "}
                  {Number(
                    missionResult.mission.estimatedCost
                  ).toFixed(2)} USDC
                </p>

                <hr />

                <h4>💳 Circle Transaction</h4>

                <p>
                  <strong>Transaction ID:</strong>
                  <br />
                  {paymentResult.circleTransaction?.id || "-"}
                </p>

                <p>
                  <strong>Transaction Hash:</strong>
                  <br />

                  <span
                    style={{
                      fontSize: "12px",
                      color: "#2563eb",
                      wordBreak: "break-all"
                    }}
                  >
                    {paymentResult.circleTransaction?.txHash || "-"}
                  </span>
                </p>

                <p>
                  <strong>Transaction Status:</strong>{" "}

                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontWeight: "700",
                      fontSize: "13px",
                      color:
                        paymentResult.circleTransaction?.state ===
                          "CONFIRMED" ||
                        paymentResult.circleTransaction?.state ===
                          "COMPLETE"
                          ? "#166534"
                          : paymentResult.circleTransaction?.state ===
                            "FAILED"
                          ? "#991b1b"
                          : "#1d4ed8",
                      background:
                        paymentResult.circleTransaction?.state ===
                          "CONFIRMED" ||
                        paymentResult.circleTransaction?.state ===
                          "COMPLETE"
                          ? "#dcfce7"
                          : paymentResult.circleTransaction?.state ===
                            "FAILED"
                          ? "#fee2e2"
                          : "#dbeafe"
                    }}
                  >
                    {paymentResult.circleTransaction?.state ===
                      "CONFIRMED" ||
                    paymentResult.circleTransaction?.state ===
                      "COMPLETE"
                      ? "🟢 Confirmed"
                      : paymentResult.circleTransaction?.state ===
                        "FAILED"
                      ? "🔴 Failed"
                      : "🔵 Pending"}
                  </span>
                </p>

                <p>
                  <strong>Network:</strong>{" "}
                  {paymentResult?.circleTransaction?.blockchain ||
                    "Arc Testnet"}
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MissionForm;
