function MissionForm({
  formData,
  setFormData,
  createMission,
  missionResult,
  deliveryResult,
  paymentResult,
  confirmDelivery
}) {
  return (
    <div className="card">
      <h2>🚀 Create New Mission</h2>

<p
  style={{
    color: "#6b7280",
    marginBottom: "20px"
  }}
>
  Describe the task you want Xecutra to execute autonomously.
</p>

      <form onSubmit={createMission}>
        <div style={{ marginBottom: "18px" }}>
  <input
    type="text"
    placeholder="Mission Title"
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
  <textarea
    placeholder="Mission Description"
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
  <input
    type="number"
    placeholder="Estimated Cost (USDC)"
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
  🤖 Let Xecutra Plan Mission
</button>
      </form>

      {missionResult && (
        <>
          <hr />

          <h3>🤖 AI Mission Plan</h3>

<p
  style={{
    color: "#6b7280",
    marginBottom: "20px"
  }}
>
  Xecutra analyzed available vendors and generated the following execution plan.
</p>

          <p>
            <strong>Vendor:</strong>{" "}
            {missionResult.plan.selectedVendor}
          </p>

          <p>
            <strong>Price:</strong> $
            {missionResult.plan.price}
          </p>

          <p>
  <strong>Status</strong>
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
      <strong>Escrow</strong>
    </p>

    <div
      style={{
        display: "inline-block",
        padding: "8px 14px",
        borderRadius: "999px",
        background: "#dbeafe",
        color: "#1d4ed8",
        fontWeight: "bold",
        marginBottom: "20px"
      }}
    >
      🔒 {missionResult?.escrow?.status ?? "LOCKED"}
    </div>
  </>
)}

          <br />

          <button onClick={confirmDelivery}>
            Confirm Delivery
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
    <strong>Vendor:</strong>{" "}
    {missionResult.plan.selectedVendor}
  </p>

  <p>
    <strong>Amount:</strong>{" "}
    {missionResult.plan.price} USDC
  </p>

  <hr />

  <h4>🌐 Blockchain Payment</h4>

  <p>
    <strong>Circle Transaction ID:</strong><br />
    {paymentResult.circleTransaction?.id}
  </p>

  <p>
    <strong>Status:</strong>{" "}
    {paymentResult.circleTransaction?.state}
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