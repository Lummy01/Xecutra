import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TreasuryCard from "./components/TreasuryCard";
import GuardrailCard from "./components/GuardrailCard";
import MissionForm from "./components/MissionForm";
import MissionHistory from "./components/MissionHistory";
import MissionTimeline from "./components/MissionTimeline";

const ORGANIZATION_ID = "cmrqzq3640000fxs4r9tvvhea";

function App() {
  const [treasury, setTreasury] = useState(null);
  const [guardrails, setGuardrails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missionResult, setMissionResult] = useState(null);
  const [deliveryResult, setDeliveryResult] = useState(null);
const [paymentResult, setPaymentResult] = useState(null);
const [missions, setMissions] = useState([]);
const [executionLog, setExecutionLog] = useState([]);
const [agentThinking, setAgentThinking] = useState(false);
const [thinkingMessage, setThinkingMessage] = useState("");
const [agentReasoning, setAgentReasoning] = useState("");
const [agentSummary, setAgentSummary] = useState("");
const [treasuryReport, setTreasuryReport] = useState("");
const [completedMissionData, setCompletedMissionData] = useState(null);
const completedMissionRef = useRef(null);
const [activeStep, setActiveStep] = useState("");
const totalSteps = 6;

const completedSteps = executionLog.filter(
  (step) =>
    step.status === "success" &&
    step.step !== "connected"
).length;

const progress = (completedSteps / totalSteps) * 100;
const paymentCompleted = executionLog.some(
  (step) =>
    step.step === "Payment" &&
    step.status === "success"
);

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

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 👇 Paste it here
async function runDemo() {
  setAgentThinking(true);

 const missionData =
  formData.title
    ? formData
    : {
        title: "Demo Mission",
        description: "Autonomous execution demo",
        estimatedCost: 0.1,
        deadline: "2026-08-06"
      };

if (!formData.title) {
  setFormData(missionData);
}

 setExecutionLog([]);
 setAgentThinking(true);
 setThinkingMessage("Analyzing mission requirements...");

 const eventSource = new EventSource(
  "http://localhost:3000/demo/stream"
);

eventSource.onmessage = (event) => {
  const update = JSON.parse(event.data);

setAgentThinking(true);

setActiveStep(update.step);

switch (update.step) {
  case "AI Analysis":
  setThinkingMessage("Analyzing mission requirements...");
  setAgentReasoning(
    "Checking budget, deadline and execution feasibility."
  );
  break;

  case "Vendor Selection":
  setThinkingMessage("Searching approved vendors...");
  setAgentReasoning(
    "Comparing approved vendors by cost, availability and reliability."
  );
  break;

  case "Guardrails":
  setThinkingMessage("Verifying treasury guardrails...");
  setAgentReasoning(
    "Validating budget limits, approved vendors and spending policies."
  );
  break;

  case "Escrow":
  setThinkingMessage("Locking funds in Circle escrow...");
  setAgentReasoning(
    "Creating secure escrow so payment is released only after delivery."
  );
  break;

  case "Delivery":
  setThinkingMessage("Waiting for delivery confirmation...");
  setAgentReasoning(
    "Monitoring delivery status before authorizing fund release."
  );
  break;

  case "Payment":
  setThinkingMessage("Releasing USDC on Arc...");
  setAgentReasoning(
    "Delivery verified. Executing Circle transaction and settling payment on Arc."
  );
  break;

  default:
    break;
}
  
  setExecutionLog(prev => {
  const existing = prev.find(
    item => item.step === update.step
  );

  const timestamp = new Date().toLocaleTimeString();

  if (existing) {
    return prev.map(item =>
      item.step === update.step
        ? {
            ...item,
            ...update,
            time: timestamp
          }
        : item
    );
  }

  return [
    ...prev,
    {
      ...update,
      time: timestamp
    }
  ];
});

  if (update.status === "success") {
  setTimeout(() => {
    setAgentThinking(false);
  }, 1200);
}

if (
  update.step === "Payment" &&
  update.status === "success" &&
  completedMissionRef.current
) {
  setAgentSummary({
    vendor: completedMissionRef.current.missionResult.plan.selectedVendor,
    budget: `${completedMissionRef.current.missionResult.mission.estimatedCost} USDC`,
    mission: completedMissionRef.current.missionResult.mission.title,
    deliveryDays: completedMissionRef.current.missionResult.plan.deliveryDays,
    status: "Mission executed autonomously with no guardrail violations."
  });

  setTreasuryReport({
  mission:
    completedMissionRef.current.missionResult.mission.title,

  vendor:
    completedMissionRef.current.missionResult.plan.selectedVendor,

  budget:
    `${completedMissionRef.current.missionResult.mission.estimatedCost} USDC`,

  result:
    "Mission completed successfully.",

  violations:
    "None",

  intervention:
    "Not Required"
});

  setActiveStep("");

  eventSource.close();
}
};

eventSource.onerror = (error) => {
  console.error("SSE Error:", error);
  eventSource.close();
};

  try {
    const response = await axios.post(
  "http://localhost:3000/demo/execute-mission",
  {
    organizationId: ORGANIZATION_ID,
    title: missionData.title,
    description: missionData.description,
    estimatedCost: Number(missionData.estimatedCost),
    deadline: missionData.deadline
  }
);
console.log(response.data);
    setMissionResult(response.data.missionResult);


setDeliveryResult(response.data.deliveryResult);

    setPaymentResult(response.data.paymentResult);

    setCompletedMissionData(response.data);
    completedMissionRef.current = response.data;

    const transactionId =
  response.data.paymentResult.circleTransaction.id;

pollTransaction(transactionId);

    await loadDashboard();

    setFormData({
  title: "",
  description: "",
  estimatedCost: "",
  deadline: ""
});

  } catch (error) {
    console.error(error);
  }
}

async function pollTransaction(transactionId) {
  const interval = setInterval(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/missions/transaction/${transactionId}`
      );

      const transaction = response.data.transaction.transaction;

      setPaymentResult((prev) => ({
        ...prev,
        circleTransaction: transaction
      }));

      if (
  transaction.state === "CONFIRMED" ||
  transaction.state === "COMPLETE" ||
  transaction.state === "FAILED"
) {
  clearInterval(interval);
}

    } catch (error) {
      console.error(error);
      clearInterval(interval);
    }

  }, 3000);
}

  return (
    <div className="app">
      <div
  style={{
    textAlign: "center",
    marginBottom: "40px"
  }}
>
  <h1
    style={{
      fontSize: "42px",
      marginBottom: "10px"
    }}
  >
    🚀 Xecutra
  </h1>

  <p
    style={{
      fontSize: "18px",
      color: "#6b7280",
      maxWidth: "700px",
      margin: "0 auto"
    }}
  >
    Autonomous Treasury Agent powered by AI, Circle,
    programmable escrow and Arc.
  </p>
</div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
  <div
  className="dashboard-grid"
  style={{
    marginTop: "35px",
    marginBottom: "35px",
    gap: "25px"
  }}
>
    <TreasuryCard treasury={treasury} />
    <GuardrailCard guardrails={guardrails} />
  </div>

  <div
  style={{
    textAlign: "center",
    margin: "30px 0"
  }}
>
  <button
  onClick={runDemo}
  style={{
    padding: "18px 42px",
    fontSize: "18px",
    fontWeight: "700",
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(37,99,235,.25)",
    transition: "all .25s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow =
      "0 14px 30px rgba(37,99,235,.35)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 10px 25px rgba(37,99,235,.25)";
  }}
>
  🚀 Run Autonomous Mission
</button>
</div>

  <MissionForm
  formData={formData}
  setFormData={setFormData}
  createMission={createMission}
  missionResult={missionResult}
  deliveryResult={deliveryResult}
  paymentResult={paymentResult}
  confirmDelivery={confirmDelivery}
/>

{missionResult && (
  <MissionTimeline
    missionResult={missionResult}
    deliveryResult={deliveryResult}
    paymentResult={paymentResult}
  />
)}
{paymentCompleted && paymentResult?.circleTransaction && (
  <div className="card">
    <h2>💳 Circle Transaction</h2>

    <div
  style={{
    display: "grid",
    gap: "14px",
    marginTop: "18px"
  }}
>
  <div>
  <strong>Status</strong>

  <div
    style={{
      display: "inline-block",
      marginTop: "8px",
      padding: "6px 14px",
      borderRadius: "999px",
      fontWeight: "700",
      fontSize: "14px",

      color:
        paymentResult.circleTransaction.state === "CONFIRMED" ||
paymentResult.circleTransaction.state === "COMPLETE"
          ? "#166534"
          : paymentResult.circleTransaction.state === "FAILED"
          ? "#991b1b"
          : "#1d4ed8",

      background:
        paymentResult.circleTransaction.state === "CONFIRMED" ||
paymentResult.circleTransaction.state === "COMPLETE"
          ? "#dcfce7"
          : paymentResult.circleTransaction.state === "FAILED"
          ? "#fee2e2"
          : "#dbeafe"
    }}
  >
    {paymentResult.circleTransaction.state === "COMPLETE"
  ? "🟢 CONFIRMED"
  : paymentResult.circleTransaction.state === "CONFIRMED"
  ? "🟢 CONFIRMED"
  : paymentResult.circleTransaction.state === "FAILED"
  ? "🔴 FAILED"
  : "🔵 PENDING"}
  </div>
</div>

  <div>
    <strong>Transaction ID</strong>

    <div
      style={{
        fontFamily: "monospace",
        wordBreak: "break-all",
        marginTop: "4px"
      }}
    >
      {paymentResult.circleTransaction.id}
    </div>
  </div>

  <div>
    <strong>Network</strong>

    <div style={{ marginTop: "4px" }}>
      Arc Testnet
    </div>
  </div>
</div>
  </div>
)}


<div className="card">
  <div
    style={{
      marginBottom: "25px"
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827"
          }}
        >
          🤖 Treasury Agent
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#6b7280",
            fontSize: "15px",
            lineHeight: "1.5"
          }}
        >
          Autonomous financial execution powered by AI, programmable guardrails, escrow, and USDC on Arc.
        </p>

    </div>

    <div
    
  style={{
    marginBottom: "25px"
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "600"
    }}
  >

<div
  style={{
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "25px"
  }}
>
  <div
    style={{
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "18px",
      color: "#111827"
    }}
  >
    📌 Mission Overview
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "18px"
    }}
  >
    <div>
      <div style={{ color: "#6b7280", fontSize: "13px" }}>Mission</div>
      <div style={{ fontWeight: "700" }}>
        {formData.title || "Awaiting Mission"}
      </div>
    </div>

    <div>
      <div style={{ color: "#6b7280", fontSize: "13px" }}>Budget</div>
      <div style={{ fontWeight: "700" }}>
        {formData.estimatedCost
          ? `${formData.estimatedCost} USDC`
          : "--"}
      </div>
    </div>

    <div>
      <div style={{ color: "#6b7280", fontSize: "13px" }}>Status</div>
      <div style={{ fontWeight: "700", color: "#2563eb" }}>
        {agentThinking ? "Executing..." : "Waiting"}
      </div>
    </div>

    <div>
      <div style={{ color: "#6b7280", fontSize: "13px" }}>Confidence</div>
      <div style={{ fontWeight: "700" }}>
        {agentThinking ? "96%" : "--"}
      </div>
    </div>
  </div>
</div>

    <span>Mission Progress</span>

    <span>{Math.round(progress)}%</span>
  </div>

  <div
    style={{
      width: "100%",
      height: "10px",
      background: "#e5e7eb",
      borderRadius: "999px",
      overflow: "hidden"
    }}
  >
    <div
      style={{
        width: `${progress}%`,
        height: "100%",
        background:
          "linear-gradient(90deg,#2563eb,#22c55e)",
        transition: "width .8s ease"
      }}
    />
  </div>
</div>
  </div>
</div>

  {agentThinking && (
  <div
    style={{
      padding: "18px",
      marginBottom: "20px",
      borderRadius: "12px",
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }}
    
  >
    <div
      style={{
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        background: "#2563eb",
        animation: "pulse 1s infinite"
      }}
    />

    <div>
      <div
        style={{
          fontWeight: "700",
          color: "#1d4ed8"
        }}
      >
        🤖 Treasury Agent Decision Engine
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "14px",
          marginTop: "4px"
        }}
      >
        <div
  style={{
    marginTop: "6px",
    fontSize: "15px",
    color: "#374151",
    fontWeight: "600"
  }}
>
  {thinkingMessage}
</div>
      </div>

<div
  style={{
    marginTop: "10px",
    padding: "10px 12px",
    background: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #dbeafe",
    color: "#374151",
    fontSize: "13px",
    lineHeight: "1.5"
  }}
>
  <div
  style={{
    fontWeight: "700",
    marginBottom: "10px",
    color: "#111827"
  }}
>
🧠 Agent Reasoning
</div>

<div
  style={{
    color: "#4b5563",
    lineHeight: "1.7"
  }}
>
{agentReasoning}
</div>

<div
  style={{
    marginTop: "18px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }}
>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#dbeafe",
      color: "#1d4ed8",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    AI Analysis
  </span>

  <span
    style={{
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#dcfce7",
      color: "#166534",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    Guardrails Active
  </span>

  <span
    style={{
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#ede9fe",
      color: "#6d28d9",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    Treasury Secure
  </span>
</div>

</div>

<div
  style={{
    marginTop: "18px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }}
>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#dbeafe",
      color: "#1d4ed8",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    AI Analysis
  </span>

  <span
    style={{
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#dcfce7",
      color: "#166534",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    Guardrails Active
  </span>

  <span
    style={{
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#ede9fe",
      color: "#6d28d9",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    Treasury Secure
  </span>
</div>

    </div>
  </div>
)}

{!agentThinking && agentSummary && (
  <div
    style={{
      marginBottom: "20px",
      padding: "18px",
      borderRadius: "12px",
      background: "#f0fdf4",
      border: "1px solid #bbf7d0"
    }}
  >
    <div
      style={{
        fontWeight: "700",
        fontSize: "17px",
        color: "#166534",
        marginBottom: "12px"
      }}
    >
      📋 Treasury Agent Decision
    </div>

    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "18px"
  }}
>
  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>Mission</div>
    <div style={{ fontWeight: "700" }}>{agentSummary.mission}</div>
  </div>

  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>Vendor</div>
    <div style={{ fontWeight: "700" }}>{agentSummary.vendor}</div>
  </div>

  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>Approved Budget</div>
    <div style={{ fontWeight: "700" }}>{agentSummary.budget}</div>
  </div>

  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>Estimated Delivery</div>
    <div style={{ fontWeight: "700" }}>
      {agentSummary.deliveryDays} days
    </div>
  </div>

  <div style={{ gridColumn: "1 / span 2" }}>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>
      Final Decision
    </div>

    <div
      style={{
        fontWeight: "700",
        color: "#166534"
      }}
    >
      {agentSummary.status}
    </div>
  </div>
</div>
  </div>
)}

{!agentThinking && treasuryReport && (
  <div
    style={{
      marginBottom: "20px",
      padding: "20px",
      borderRadius: "14px",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(0,0,0,.05)"
    }}
  >
    <div
      style={{
        fontSize: "18px",
        fontWeight: "700",
        marginBottom: "16px",
        color: "#111827"
      }}
    >
      📋 Treasury Agent Report
    </div>

    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "18px"
  }}
>
  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>
      Mission
    </div>

    <div style={{ fontWeight: "700" }}>
      {treasuryReport.mission}
    </div>
  </div>

  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>
      Vendor
    </div>

    <div style={{ fontWeight: "700" }}>
      {treasuryReport.vendor}
    </div>
  </div>

  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>
      Budget
    </div>

    <div style={{ fontWeight: "700" }}>
      {treasuryReport.budget}
    </div>
  </div>

  <div>
    <div style={{ color: "#6b7280", fontSize: "13px" }}>
      Guardrail Violations
    </div>

    <div
      style={{
        color: "#166534",
        fontWeight: "700"
      }}
    >
      {treasuryReport.violations}
    </div>
  </div>

  <div
    style={{
      gridColumn: "1 / span 2",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "18px"
    }}
  >
    <div
      style={{
        fontWeight: "700",
        marginBottom: "10px"
      }}
    >
      Overall Result
    </div>

    <div
      style={{
        color: "#374151",
        lineHeight: "1.7"
      }}
    >
      {treasuryReport.result}
    </div>

    <div
      style={{
        marginTop: "14px",
        color: "#2563eb",
        fontWeight: "600"
      }}
    >
      Human Intervention: {treasuryReport.intervention}
    </div>
  </div>
</div>
  </div>
)}

  {executionLog.map((log, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px",
      marginBottom: "12px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      background:
  activeStep === log.step
    ? "#eff6ff"
    : "#ffffff",
      opacity: 0,
      animation: `fadeInUp .45s ease ${index * 0.35}s forwards`
    }}
  >
    <div
  style={{
    display: "flex",
    alignItems: "stretch",
    width: "100%"
  }}
>
    
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginRight: "18px"
    }}
  >
    <div
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background:
  log.status === "success"
    ? "#22c55e"
    : activeStep === log.step
    ? "#2563eb"
    : "#d1d5db"
      }}
    />

    {index !== executionLog.length - 1 && (
      <div
        style={{
          width: "2px",
          flex: 1,
          minHeight: "55px",
          background: "#d1d5db",
          marginTop: "6px"
        }}
      />
    )}
  </div>

  <div>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "4px"
    }}
  >
    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}
>
  <span
    style={{
      fontSize: "18px"
    }}
  >
    {log.status === "success"
      ? "✅"
      : log.status === "running"
      ? "⏳"
      : "⚪"}
  </span>

  <div
    style={{
      fontWeight: "700",
      fontSize: "15px",
      color: "#111827"
    }}
  >
    {log.step}
  </div>
</div>

    <span
      style={{
        fontSize: "12px",
        color: "#9ca3af",
        fontFamily: "monospace"
      }}
    >
      {log.time}
    </span>
  </div>

  <div
    style={{
      color: "#6b7280",
      fontSize: "14px"
    }}
  >
    {log.message}
  </div>
</div>
</div>

    <span
      style={{
        padding: "6px 12px",
        borderRadius: "999px",
        fontWeight: "bold",
        color:
  log.status === "success"
    ? "#166534"
    : log.status === "running"
    ? "#1d4ed8"
    : "#6b7280",

background:
  log.status === "success"
    ? "#dcfce7"
    : log.status === "running"
    ? "#dbeafe"
    : "#f3f4f6",

    animation:
  log.status === "running"
    ? "pulse 1.2s infinite"
    : "none",
      }}
    >
      {(log.status || "info").toUpperCase()}
   </span>
  </div>

))}
</div>

<MissionHistory missions={missions} />
</>
      )}
    </div>
  );
}

export default App;
