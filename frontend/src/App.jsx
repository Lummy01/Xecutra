import { useEffect, useState } from "react";
import axios from "axios";

const ORGANIZATION_ID = "cmrqzq3640000fxs4r9tvvhea";

function App() {
  const [treasury, setTreasury] = useState(null);
  const [guardrails, setGuardrails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missionResult, setMissionResult] = useState(null);
  const [deliveryResult, setDeliveryResult] = useState(null);
const [paymentResult, setPaymentResult] = useState(null);
const [missions, setMissions] = useState([]);

const [formData, setFormData] = useState({
  title: "",
  description: "",
  estimatedCost: "",
  deadline: ""
});

  async function loadDashboard() {
  try {
    const treasuryResponse = await axios.get(
      `http://localhost:3000/treasury/${ORGANIZATION_ID}/balance`
    );

    const guardrailResponse = await axios.get(
      `http://localhost:3000/guardrails/${ORGANIZATION_ID}`
    );

    const missionResponse = await axios.get(
  `http://localhost:3000/missions/${ORGANIZATION_ID}`
);

    setTreasury(treasuryResponse.data);
    setGuardrails(guardrailResponse.data);
    setMissions(missionResponse.data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
useEffect(() => {
  loadDashboard();
}, []);

  async function createMission(e) {
  e.preventDefault();

  console.log("Create Mission button clicked");

  try {
    const response = await axios.post(
      "http://localhost:3000/missions",
      {
        organizationId: ORGANIZATION_ID,
        title: formData.title,
        description: formData.description,
        estimatedCost: Number(formData.estimatedCost),
        deadline: formData.deadline
      }
    );

    console.log("Mission Response:", response.data);

    setMissionResult(response.data);

  } catch (error) {
    console.error(error);
  }
}
async function confirmDelivery() {
  try {
    const deliveryResponse = await axios.post(
  "http://localhost:3000/delivery",
  {
    missionId: missionResult.mission.id,
    confirmedBy: "Organization Admin"
  }
);

    setDeliveryResult(deliveryResponse.data);

    const paymentResponse = await axios.post(
  "http://localhost:3000/payment/release",
  {
    missionId: missionResult.mission.id
  }
);

    setPaymentResult(paymentResponse.data);

    // Refresh AFTER payment has been released
    await loadDashboard();

    console.log("Delivery:", deliveryResponse.data);
    console.log("Payment:", paymentResponse.data);

  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="app">
      <h1>Xecutra</h1>
      <p>Autonomous Treasury Agent</p>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="card">
            <h2>Treasury</h2>

            <p>
              <strong>Wallet:</strong>{" "}
              {treasury?.walletAddress || "Unavailable"}
            </p>

            <p>
              <strong>Balance:</strong>{" "}
{treasury?.balance || 0} USDC
            </p>
          </div>


          <div className="card">
            <h2>Guardrails</h2>

            <p>
              <strong>Max Vendor Spend:</strong>{" "}
              ${guardrails?.maxVendorSpend}
            </p>

            <p>
              <strong>Minimum Reserve:</strong>{" "}
              ${guardrails?.minimumReserve}
            </p>

            <p>
              <strong>Escrow Required:</strong>{" "}
              {guardrails?.escrowRequired ? "Yes" : "No"}
            </p>

            <p>
              <strong>Approved Vendors Only:</strong>{" "}
              {guardrails?.approvedVendorsOnly ? "Yes" : "No"}
            </p>
          </div>
          <div className="card">
  <h2>Create Mission</h2>

  <form onSubmit={createMission}>

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
    <br /><br />

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
<br /><br />

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
<br /><br />

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
<br /><br />

<button type="submit">
  Create Mission
</button>

  </form>

{missionResult && (
  <>
    <hr />

    <h3>AI Decision</h3>

    <p>
      <strong>Vendor:</strong>{" "}
      {missionResult.plan.selectedVendor}
    </p>

    <p>
      <strong>Price:</strong>{" "}
      ${missionResult.plan.price}
    </p>

    <p>
      <strong>Status:</strong>{" "}
      {missionResult.plan.approved ? "Approved" : "Rejected"}
    </p>

    <p>
      <strong>Reason:</strong>{" "}
      {missionResult.plan.reason}
    </p>

    {missionResult.escrow && (
      <p>
        <strong>Escrow:</strong>{" "}
        {missionResult.escrow.status}
      </p>
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
      {deliveryResult.delivery.status}
    </p>

    <p>
      <strong>Confirmed By:</strong>{" "}
      {deliveryResult.delivery.confirmedBy}
    </p>
  </>
)}
{paymentResult && (
  <>
    <hr />

    <h3>Payment Released</h3>

    <p>
      <strong>Result:</strong>{" "}
      {paymentResult.message}
    </p>

    <p>
      <strong>Escrow Status:</strong>{" "}
      {paymentResult.escrow.status}
    </p>
  </>
)}

  </>
)}
</div>
<div className="card">
  <h2>Mission History</h2>

  {missions.length === 0 ? (
    <p>No missions found.</p>
  ) : (
    <table width="100%">
      <thead>
        <tr>
          <th align="left">Mission</th>
          <th align="left">Vendor</th>
          <th align="left">Amount</th>
          <th align="left">Status</th>
        </tr>
      </thead>

      <tbody>
        {missions.map((mission) => (
          <tr key={mission.id}>
            <td>{mission.title}</td>

            <td>{mission.selectedVendor || "-"}</td>

            <td>
              {mission.approvedAmount
                ? `${mission.approvedAmount} USDC`
                : "-"}
            </td>

            <td>{mission.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
        </>
      )}
    </div>
  );
}

export default App;