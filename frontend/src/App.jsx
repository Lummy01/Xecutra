import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TreasuryCard from "./components/TreasuryCard";
import GuardrailCard from "./components/GuardrailCard";
import MissionForm from "./components/MissionForm";
import MissionHistory from "./components/MissionHistory";
import MissionTimeline from "./components/MissionTimeline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const API_BASE_URL = "https://xecutra-backend.onrender.com";

const ORGANIZATION_ID = "cmrqzq3640000fxs4r9tvvhea";

function App() {
  const [treasury, setTreasury] = useState(null);
  const [guardrails, setGuardrails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missionResult, setMissionResult] = useState(null);
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [aiDecision, setAiDecision] = useState({
    vendorScore: 96,
    budgetScore: 100,
    treasuryAfter: 10,
    risk: "LOW",
    approved: true
  });
  const totalMissions = missions.length;

const completedPayments = missions.filter(
  (mission) => mission.status === "Completed"
).length;

const rejectedMissions = missions.filter(
  (mission) => mission.status === "Rejected"
).length;

const escrowsCreated = missions.filter(
  (mission) => mission.status === "Completed"
).length;

  const activeEscrows = missions.filter(
    (mission) =>
      mission.status === "PENDING" ||
      mission.status === "IN_PROGRESS"
  ).length;
  const [executionLog, setExecutionLog] = useState([]);
  const [treasuryActivity, setTreasuryActivity] = useState([]);
  const [hoveredActivity, setHoveredActivity] = useState(null);
  const [treasuryAnalytics, setTreasuryAnalytics] = useState({
    totalMissions: 0,
    totalSpent: 0,
    escrowsCreated: 0,
    paymentsCompleted: 0,
    automationRate: "100%",
    violations: 0,
    averageConfidence: "96%"
  });

  const recentActivity = [
    {
      icon: "🤖",
      title: "Mission analyzed",
      time: "Just now"
    },
    {
      icon: "🛡",
      title: "Guardrails verified",
      time: "Just now"
    },
    {
      icon: "🔒",
      title: "Escrow locked",
      time: "Just now"
    },
    {
      icon: "💸",
      title: "Circle payment released",
      time: "Just now"
    }
  ];
  const [treasuryBalance, setTreasuryBalance] = useState({
    total: 10.0,
    locked: 0,
    available: 10.0,
    escrowStatus: "No Active Escrow"
  });
  const [balanceHistory, setBalanceHistory] = useState([
    {
      name: "Start",
      balance: 10
    }
  ]);
  const chartData = balanceHistory;
  const spendingData = [
    {
      name: "Available",
      value: treasuryBalance.available
    },
    {
      name: "Spent",
      value: treasuryAnalytics.totalSpent
    }
  ];

  const PIE_COLORS = [
    "#22c55e",
    "#2563eb"
  ];
  const [agentThinking, setAgentThinking] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState("");
  const [agentReasoning, setAgentReasoning] = useState("");
  const [aiDecisions, setAiDecisions] = useState([]);
  const [agentSummary, setAgentSummary] = useState("");
  const [missionOverview, setMissionOverview] = useState({
    mission: "Awaiting Mission",
    budget: "--",
    status: "Waiting",
    confidence: "--"
  });
  const [treasuryReport, setTreasuryReport] = useState("");
  const [agentRisk, setAgentRisk] = useState(null);
  const [completedMissionData, setCompletedMissionData] = useState(null);
  const completedMissionRef = useRef(null);
  const [activeStep, setActiveStep] = useState("");
  const totalSteps = 6;

  const completedSteps = executionLog.filter(
    (step) =>
      step.status === "success" &&
      step.step !== "connected"
  ).length;

  const progress =
  completedMissionRef.current?.missionResult?.plan?.approved === false
    ? 0
    : (completedSteps / totalSteps) * 100;
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
        `${API_BASE_URL}/treasury/${ORGANIZATION_ID}/balance`
      );

      const guardrailResponse = await axios.get(
        `${API_BASE_URL}/guardrails/${ORGANIZATION_ID}`
      );

      const missionResponse = await axios.get(
        `${API_BASE_URL}/missions/${ORGANIZATION_ID}`
      );

      setTreasury(treasuryResponse.data);

      setTreasuryBalance((prev) => ({
  ...prev,
  total: Number(treasuryResponse.data.balance),
  available: Number(treasuryResponse.data.balance) - prev.locked
}));

      setGuardrails(guardrailResponse.data);
      setMissions(missionResponse.data);
      const completed = missionResponse.data.filter(
  (m) => m.status === "Completed"
);

setTreasuryAnalytics({
  totalMissions: missionResponse.data.length,
  totalSpent: completed.reduce(
    (sum, m) => sum + Number(m.approvedAmount || 0),
    0
  ),
  escrowsCreated: completed.length,
  paymentsCompleted: completed.length,
  automationRate: "100%",
  violations: 0,
  averageConfidence:
    completed.length > 0
      ? `${Math.round(
          completed.reduce(
            (sum, m) => sum + Number(m.confidence || 0),
            0
          ) / completed.length
        )}%`
      : "0%"
});
      console.log(missionResponse.data);

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
        `${API_BASE_URL}/missions`,
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
        `${API_BASE_URL}/delivery`,
        {
          missionId: missionResult.mission.id,
          confirmedBy: "Organization Admin"
        }
      );

      setDeliveryResult(deliveryResponse.data);

      const paymentResponse = await axios.post(
        `${API_BASE_URL}/payment/release`,
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
          title: "Autonomous Demo Mission",
          description: "Autonomous execution demo",
          estimatedCost: 0.1,
          deadline: "2026-08-06"
        };

    if (!formData.title) {
      setFormData(missionData);
    }

    setTreasuryBalance((prev) => ({
  ...prev,
  locked: 0,
  available: prev.total,
  escrowStatus: "No Active Escrow"
}));

    setExecutionLog([]);
    setTreasuryActivity([]);
    setAiDecisions([]);

    setAgentThinking(true);
    setThinkingMessage("Analyzing mission requirements...");

    const eventSource = new EventSource(
      `${API_BASE_URL}/demo/stream`
    );

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);

      let activityIcon = "🤖";

      if (update.message.includes("Client")) {
        activityIcon = "🟢";
      } else if (update.message.includes("Vendor")) {
        activityIcon = "🔍";
      } else if (update.message.includes("Guardrail")) {
        activityIcon = "🛡";
      } else if (update.message.includes("escrow")) {
        activityIcon = "🔒";
      } else if (update.message.includes("Delivery")) {
        activityIcon = "📦";
      } else if (update.message.includes("Circle")) {
        activityIcon = "💸";
      } else if (update.message.includes("confirmed")) {
        activityIcon = "✅";
      }

      setTreasuryActivity((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: update.message,
          icon: activityIcon
        }
      ]);

      setAiDecisions((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          decision: update.message
        }
      ]);

      setAgentThinking(true);

      setActiveStep(update.step);

      // Reveal mission results progressively as each SSE step succeeds
if (update.status === "success" && completedMissionRef.current) {
  if (update.step === "Guardrails" || update.step === "Escrow") {
    setMissionResult(
      completedMissionRef.current.missionResult
    );
  }

  if (update.step === "Delivery") {
    setDeliveryResult(
      completedMissionRef.current.deliveryResult
    );
  }

  if (update.step === "Payment") {
    setPaymentResult(
      completedMissionRef.current.paymentResult
    );
  }
}

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

  if (
    update.status === "success" &&
    completedMissionRef.current
  ) {
    const amount = Number(
      completedMissionRef.current.missionResult.mission.estimatedCost
    );

    setTreasuryBalance((prev) => ({
      ...prev,
      locked: amount,
      available: prev.total - amount,
      escrowStatus: "Locked in Escrow 🔒"
    }));
  }

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

      console.log(
        "Payment event:",
        update.step,
        update.status,
        completedMissionRef.current
      );

      if (
        update.step === "Payment" &&
        update.status === "success" &&
        completedMissionRef.current
      ) {

        const txId =
          completedMissionRef.current.paymentResult?.circleTransaction?.id;

        if (txId) {
          console.log("Starting polling:", txId);
          pollTransaction(txId);
        }

        const missionPlan =
  completedMissionRef.current.missionResult.plan;

setAgentSummary({
  vendor: missionPlan.selectedVendor || "No vendor selected",

  budget:
    `${completedMissionRef.current.missionResult.mission.estimatedCost} USDC`,

  mission:
    completedMissionRef.current.missionResult.mission.title,

  deliveryDays:
    missionPlan.deliveryDays || "-",

  status: missionPlan.approved
    ? "✅ Mission executed successfully within all treasury guardrails."
    : "❌ Mission rejected before execution."
});


setMissionOverview({
  mission:
    completedMissionRef.current.missionResult.mission.title,

  budget:
    `${completedMissionRef.current.missionResult.mission.estimatedCost} USDC`,

  status: missionPlan.approved
    ? "Completed ✅"
    : "Rejected ❌",

  confidence:
    `${missionPlan.confidence}%`
});

        console.log("Updating Treasury Analytics...");

        

        if (missionPlan.approved) {
  setBalanceHistory((prev) => {
    const amount = Number(
      completedMissionRef.current.missionResult.mission.estimatedCost
    );

    const previousBalance =
      prev.length > 0
        ? prev[prev.length - 1].balance
        : treasuryBalance.total;

    const newHistory = [
      ...prev,
      {
        name: `Mission ${prev.length + 1}`,
        balance: previousBalance - amount
      }
    ];

    console.log("Updated Balance History:", newHistory);

    return newHistory;
  });
}

setAgentRisk({
  confidence: missionPlan.confidence,

  level: !missionPlan.approved
    ? "CRITICAL"
    : missionPlan.confidence >= 95
    ? "LOW"
    : missionPlan.confidence >= 90
    ? "MEDIUM"
    : "HIGH",

  factors: missionPlan.approved
    ? [
        "Budget within treasury limits",
        "Approved vendor selected",
        "Guardrails satisfied",
        "Escrow protection enabled",
        "Delivery verification required before settlement"
      ]
    : [
        "No vendor met the minimum autonomous confidence threshold",
        "Mission rejected before escrow creation",
        "No payment execution permitted"
      ],

  recommendation: missionPlan.approved
    ? "AUTO-EXECUTE"
    : "DO NOT EXECUTE"
});


const missionCost = Number(
  completedMissionRef.current.missionResult.mission.estimatedCost
);

setAiDecision({
  vendorScore: missionPlan.confidence,

  budgetScore: missionPlan.approved ? 100 : 0,

  treasuryAfter: missionPlan.approved
    ? treasuryBalance.total - missionCost
    : treasuryBalance.total,

  risk: !missionPlan.approved
    ? "CRITICAL"
    : missionPlan.confidence >= 95
    ? "LOW"
    : missionPlan.confidence >= 90
    ? "MEDIUM"
    : "HIGH",

  approved: missionPlan.approved
});


setTreasuryReport({
  mission:
    completedMissionRef.current.missionResult.mission.title,

  vendor:
    missionPlan.selectedVendor || "No vendor selected",

  budget:
    `${completedMissionRef.current.missionResult.mission.estimatedCost} USDC`,

  result: missionPlan.approved
    ? "Mission completed successfully."
    : "Mission rejected before execution.",

  violations: missionPlan.approved
    ? "None"
    : missionPlan.reason || "Confidence threshold not met.",

  intervention: missionPlan.approved
    ? "Not Required"
    : "Execution blocked automatically."
});

        setActiveStep("Payment");
eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    try {
    const response = await axios.post(
      `${API_BASE_URL}/demo/execute-mission`,
      {
        organizationId: ORGANIZATION_ID,
        title: missionData.title,
        description: missionData.description,
        estimatedCost: Number(missionData.estimatedCost),
        deadline: missionData.deadline
      }
    );
    console.log(response.data);

if (!response.data.missionResult.plan.approved) {
  
  setDeliveryResult(null);
  setPaymentResult(null);

  setExecutionLog([]);
  setTreasuryActivity([]);
  setAiDecisions([]);

  setActiveStep("");
  setAgentThinking(false);
  setThinkingMessage("");
  setAgentReasoning("");

  setCompletedMissionData(response.data);
  completedMissionRef.current = response.data;

  console.log(
    "Mission rejected:",
    response.data.missionResult.plan.reason
  );

  // Refresh dashboard immediately
  await loadDashboard();

  // Stop live execution stream
  eventSource.close();

  return;
}



    setCompletedMissionData(response.data);
    completedMissionRef.current = response.data;
    console.log("Mission saved", completedMissionRef.current);
    console.log("Mission Plan", response.data.missionResult.plan);



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
        `${API_BASE_URL}/missions/transaction/${transactionId}`
      );

      const transaction = response.data.transaction.transaction;
      console.log("Polling state:", transaction.state);
      setPaymentResult((prev) => ({
        ...prev,
        circleTransaction: transaction
      }));

      console.log(
  "Treasury release check — Circle transaction state:",
  transaction.state
);

      if (
  transaction.state === "CONFIRMED" ||
  transaction.state === "COMPLETE"
) {

  setMissionResult((prev) => {
  if (!prev?.escrow) return prev;

  return {
    ...prev,
    escrow: {
      ...prev.escrow,
      status: "RELEASED"
    }
  };
});

  // Release escrow after successful payment
  const amount = Number(
  completedMissionRef.current?.missionResult?.mission?.estimatedCost || 0
);

setTreasuryBalance((prev) => {
  const newTotal = Math.max(
    0,
    Number((prev.total - amount).toFixed(2))
  );

  return {
    total: newTotal,
    locked: 0,
    available: newTotal,
    escrowStatus: "Released ✅"
  };
});

  await axios.patch(
    `${API_BASE_URL}/missions/${completedMissionRef.current.missionResult.mission.id}/complete`
  );

  await loadDashboard();

  clearInterval(interval);
}

      if (transaction.state === "FAILED") {
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
        AI-powered autonomous treasury agent that plans, secures, and executes payments on Arc using Circle and programmable escrow.
      </p>
    </div>

    {loading ? (
      <p>Loading dashboard...</p>
    ) : (
      <>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px",
            marginBottom: "25px"
          }}
        >
          <div className="card">
            <h3
              style={{
                marginBottom: "14px"
              }}
            >
              💰 Treasury
            </h3>

            <h2>{treasuryBalance.available.toFixed(2)} USDC</h2>
          </div>

          <div className="card">
            <h3
              style={{
                marginBottom: "14px"
              }}
            >
              📋 Missions
            </h3>

            <h2>{totalMissions}</h2>
          </div>

          <div className="card">
  <h3
    style={{
      marginBottom: "14px"
    }}
  >
    🔒 Escrows Created
  </h3>

  <h2>{escrowsCreated}</h2>
</div>

<div className="card">
  <h3
    style={{
      marginBottom: "14px"
    }}
  >
    ✅ Successful Payments
  </h3>

  <h2>{completedPayments}</h2>
</div>

<div className="card">
  <h3
    style={{
      marginBottom: "14px"
    }}
  >
    ❌ Rejected Missions
  </h3>

  <h2>{rejectedMissions}</h2>
</div>
        </div>
        <div
          className="dashboard-grid"
          style={{
            marginTop: "35px",
            marginBottom: "35px",
            gap: "25px"
          }}
        >
          <TreasuryCard
  treasury={treasury}
  treasuryBalance={treasuryBalance}
/>
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
  activeStep={activeStep}
  selectedMission={selectedMission}
/>

        {missionResult && (
          <MissionTimeline
            missionResult={missionResult}
            deliveryResult={deliveryResult}
            paymentResult={paymentResult}
            activeStep={activeStep}
          />
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

                <div
                  style={{
                    marginTop: "24px",
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
                      marginBottom: "18px"
                    }}
                  >
                    💰 Treasury Balance
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: "18px"
                    }}
                  >
                    <div>
                      <div style={{ color: "#6b7280", fontSize: "13px" }}>
                        Current Balance
                      </div>

                      <div style={{ fontSize: "26px", fontWeight: "700" }}>
                        {treasuryBalance.total.toFixed(2)} USDC
                      </div>
                    </div>

                    <div>
                      <div style={{ color: "#6b7280", fontSize: "13px" }}>
                        Locked
                      </div>

                      <div
                        style={{
                          fontSize: "26px",
                          fontWeight: "700",
                          color: "#2563eb"
                        }}
                      >
                        {treasuryBalance.locked.toFixed(2)} USDC
                      </div>
                    </div>

                    <div>
                      <div style={{ color: "#6b7280", fontSize: "13px" }}>
                        Available
                      </div>

                      <div
                        style={{
                          fontSize: "26px",
                          fontWeight: "700",
                          color: "#16a34a"
                        }}
                      >
                        {treasuryBalance.available.toFixed(2)} USDC
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "18px",
                        gridColumn: "1 / span 3",
                        padding: "14px",
                        borderRadius: "10px",
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe"
                      }}
                    >
                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: "13px",
                          marginBottom: "6px"
                        }}
                      >
                        Escrow Status
                      </div>

                      <div
                        style={{
                          fontWeight: "700",
                          color: "#2563eb"
                        }}
                      >
                        {treasuryBalance.escrowStatus}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

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
                        {missionOverview.mission}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: "#6b7280", fontSize: "13px" }}>Budget</div>
                      <div style={{ fontWeight: "700" }}>
                        {missionOverview.budget}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: "#6b7280", fontSize: "13px" }}>Status</div>
                      <div
                        style={{
                          fontWeight: "700",
                          color:
                            missionOverview.status === "Completed"
                              ? "#16a34a"
                              : missionOverview.status === "Failed"
                                ? "#dc2626"
                                : "#2563eb"
                        }}
                      >
                        {missionOverview.status}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: "#6b7280", fontSize: "13px" }}>Confidence</div>
                      <div style={{ fontWeight: "700" }}>
                        {missionOverview.confidence}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "24px",
                      marginBottom: "12px",
                      fontWeight: "700",
                      color: "#111827",
                      fontSize: "15px"
                    }}
                  >
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
                        background: "linear-gradient(90deg,#2563eb,#22c55e)",
                        transition: "width .8s ease"
                      }}
                    />
                  </div>

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

          {!agentThinking && agentRisk && (
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
                  marginBottom: "18px"
                }}
              >
                🛡 Agent Confidence & Risk Assessment
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
                    Confidence
                  </div>

                  <div
                    style={{
                      fontSize: "30px",
                      fontWeight: "700",
                      color: "#2563eb"
                    }}
                  >
                    {agentRisk.confidence}%
                  </div>
                </div>

                <div>
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>
                    Risk Level
                  </div>

                  <div
                    style={{
                      fontWeight: "700",
                      color: "#166534"
                    }}
                  >
                    🟢 {agentRisk.level}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "30px",
                  marginTop: "20px",
                  alignItems: "start"
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      marginBottom: "12px"
                    }}
                  >
                    Decision Factors
                  </div>

                  {agentRisk.factors.map((factor, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "10px",
                        color: "#374151"
                      }}
                    >
                      ✅ {factor}
                    </div>
                  ))}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      marginBottom: "12px"
                    }}
                  >
                    Recommendation
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      borderRadius: "12px",
                      background: "#dcfce7",
                      border: "1px solid #86efac"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#166534",
                        marginBottom: "10px"
                      }}
                    >
                      {agentRisk.recommendation}
                    </div>

                    <div
                      style={{
                        color: "#4b5563",
                        lineHeight: "1.6"
                      }}
                    >
                      Xecutra determined that this mission satisfies all treasury
                      guardrails and can be executed safely without human intervention.
                    </div>
                  </div>
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
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>Execution Deadline</div>
                  <div style={{ fontWeight: "700" }}>
                    {agentSummary.deliveryDays} days remaining
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
  activeStep === log.step && log.status !== "success"
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

        <div className="card">
          <h2>🧠 Live AI Decision Panel</h2>

          {aiDecisions.length === 0 ? (
            <div
              style={{
                color: "#9ca3af",
                marginTop: "16px"
              }}
            >
              AI has not started reasoning yet.
            </div>
          ) : (
            aiDecisions.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom:
                    index !== aiDecisions.length - 1
                      ? "1px solid #e5e7eb"
                      : "none"
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
                      color: "#2563eb",
                      fontSize: "18px"
                    }}
                  >
                    🤖
                  </span>

                  <span
                    style={{
                      color: "#374151"
                    }}
                  >
                    {item.decision}
                  </span>
                </div>

                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    fontFamily: "monospace"
                  }}
                >
                  {item.time}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>📊 Treasury Analytics</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginTop: "20px"
            }}
          >
            <div className="analytics-card">
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "10px"
                }}
              >
                📋
              </div>

              <div
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  marginBottom: "6px"
                }}
              >
                Total Missions
              </div>

              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "700"
                }}
              >
                {treasuryAnalytics.totalMissions}
              </div>
            </div>

            <div className="analytics-card">
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "10px"
                }}
              >
                💰
              </div>

              <div
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  marginBottom: "6px"
                }}
              >
                USDC Spent
              </div>

              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "700"
                }}
              >
                {treasuryAnalytics.totalSpent.toFixed(2)} USDC
              </div>
            </div>


            <div className="analytics-card">
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "10px"
                }}
              >
                🤖
              </div>

              <div
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  marginBottom: "6px"
                }}
              >
                Automation Rate
              </div>

              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "700",
                  color: "#16a34a"
                }}
              >
                {treasuryAnalytics.automationRate}
              </div>
            </div>

            <div className="analytics-card">
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "10px"
                }}
              >
                🛡
              </div>

              <div
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  marginBottom: "6px"
                }}
              >
                Guardrail Violations
              </div>

              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "700",
                  color: "#16a34a"
                }}
              >
                {treasuryAnalytics.violations}
              </div>
            </div>


          </div>
        </div>

        <div className="card">
          <h2>🕒 Treasury Activity</h2>

          {treasuryActivity.length === 0 ? (
            <div
              style={{
                color: "#9ca3af",
                marginTop: "15px"
              }}
            >
              Waiting for the next autonomous mission...
            </div>
          ) : (
            treasuryActivity.map((activity, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredActivity(index)}
                onMouseLeave={() => setHoveredActivity(null)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "18px 0",
                  background:
                    hoveredActivity === index ? "#f8fafc" : "transparent",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  borderBottom:
                    index === treasuryActivity.length - 1
                      ? "none"
                      : "1px solid #f3f4f6"
                }}
              >

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "#111827",
                      fontWeight: "600",
                      lineHeight: "1.5"
                    }}
                  >
                    {activity.message}
                  </div>

                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      marginTop: "4px"
                    }}
                  >
                    {activity.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <MissionHistory
          missions={missions}
          onSelectMission={setSelectedMission}
        />

        {selectedMission && (
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "420px",
              height: "100vh",
              background: "#ffffff",
              boxShadow: "-8px 0 25px rgba(0,0,0,.15)",
              padding: "28px",
              overflowY: "auto",
              zIndex: 9999
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px"
              }}
            >
              <h2 style={{ margin: 0 }}>📋 Mission Details</h2>

              <button
  onClick={() => setSelectedMission(null)}
  aria-label="Close mission details"
  style={{
    border: "none",
    background: "transparent",
    fontSize: "26px",
    lineHeight: "1",
    cursor: "pointer",
    color: "#111827",
    opacity: 1,
    padding: "4px 8px"
  }}
>
  ×
</button>
            </div>

            <p><strong>Mission:</strong> {selectedMission.title}</p>

            <p>
  <strong>Vendor:</strong>{" "}
  {selectedMission.selectedVendor || "No vendor selected"}
</p>

            <p>
  <strong>
    {selectedMission.status === "Rejected"
      ? "Requested Budget:"
      : "Approved Budget:"}
  </strong>{" "}
  {Number(
    selectedMission.status === "Rejected"
      ? selectedMission.estimatedCost
      : selectedMission.approvedAmount || 0
  ).toFixed(3)} USDC
</p>

            <p>
  <strong>Status:</strong>{" "}
  <span
    style={{
      color:
        selectedMission.status === "Completed"
          ? "#16a34a"
          : "#dc2626",
      fontWeight: "700"
    }}
  >
    {selectedMission.status}
  </span>
</p>

            <hr style={{ margin: "24px 0" }} />

            <h3>🤖 AI Treasury Decision</h3>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px"
              }}
            >
              <p><strong>AI Reasoning</strong></p>

              <p style={{ color: "#6b7280" }}>
                {selectedMission.aiReason}
              </p>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "18px",
                marginBottom: "20px"
              }}
            >
              <p>
  <strong>Vendor Score:</strong>{" "}
  {selectedMission.confidence || 0}%
</p>

              <p>
  <strong>AI Confidence:</strong>{" "}
  {selectedMission.confidence || 0}%
</p>

              <p>
                <strong>Budget Score:</strong>{" "}
{selectedMission.status === "Completed" ? 100 : 0}%
              </p>

              <p>
  <strong>Treasury Balance:</strong>{" "}
  {treasuryBalance.total.toFixed(2)} USDC
</p>

              <p>
  <strong>Risk Level:</strong>{" "}
  {selectedMission.status !== "Completed"
    ? "CRITICAL"
    : selectedMission.confidence >= 95
    ? "LOW"
    : selectedMission.confidence >= 90
    ? "MEDIUM"
    : "HIGH"}
</p>

              <p
  style={{
    color:
      selectedMission.status === "Completed"
        ? "#16a34a"
        : "#111827",
    fontWeight: "700"
  }}
>
  {selectedMission.status === "Completed"
    ? "✅ Approved Autonomously"
    : (
  <>
    Execution:{" "}
    <span style={{ fontWeight: "400" }}>
      Blocked
    </span>
  </>
)}
</p>
            </div>

            <hr style={{ margin: "24px 0" }} />

            <h3>⚡ Execution Summary</h3>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "18px"
              }}
            >

              {/* AI Analysis */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "6px"
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#22c55e"
                    }}
                  />

                  <div
                    style={{
                      width: "2px",
                      height: "14px",
                      background: "#d1d5db",
                      marginTop: "4px"
                    }}
                  />
                </div>

                <span>🤖 AI Analysis Complete</span>
              </div>

              {/* Vendor */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "6px"
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
  selectedMission.status === "Completed"
    ? "#22c55e"
    : "#ef4444"
                    }}
                  />

                  <div
                    style={{
                      width: "2px",
                      height: "14px",
                      background: "#d1d5db",
                      marginTop: "4px"
                    }}
                  />
                </div>

                <span>
  {selectedMission.status === "Completed"
    ? `🏢 Vendor Selected — ${selectedMission.selectedVendor || "No vendor selected"}`
    : selectedMission.selectedVendor
    ? `🏢 Vendor Considered — ${selectedMission.selectedVendor} (Rejected by Guardrails)`
    : "🏢 No Vendor Met Confidence Threshold"}
</span>
              </div>

              {/* Guardrails */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "6px"
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
  selectedMission.status === "Completed"
    ? "#22c55e"
    : "#ef4444"
                    }}
                  />

                  <div
                    style={{
                      width: "2px",
                      height: "14px",
                      background: "#d1d5db",
                      marginTop: "4px"
                    }}
                  />
                </div>

                <span>
  {selectedMission.status === "Completed"
  ? "🛡 Guardrails Passed"
  : "🛡 Guardrails Check Failed"}
</span>
              </div>

              {/* Escrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "6px"
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
  selectedMission.status === "Completed"
    ? "#22c55e"
    : "#ef4444"
                    }}
                  />

                  <div
                    style={{
                      width: "2px",
                      height: "14px",
                      background: "#d1d5db",
                      marginTop: "4px"
                    }}
                  />
                </div>

                <span>
  {selectedMission.status === "Completed"
  ? "🔒 Escrow Locked"
  : "🔒 Escrow Not Created"}
</span>
              </div>

              {/* Delivery */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "6px"
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
  selectedMission.status === "Completed"
    ? "#22c55e"
    : "#ef4444"
                    }}
                  />

                  <div
                    style={{
                      width: "2px",
                      height: "14px",
                      background: "#d1d5db",
                      marginTop: "4px"
                    }}
                  />
                </div>

                <span
  style={{
    color: "#111827",
fontWeight: "400"
  }}
>
  {selectedMission.status === "Completed"
  ? "📦 Delivery Verified"
  : "📦 Delivery Not Executed"}
</span>
              </div>

              {/* Payment */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "6px"
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
  selectedMission.status === "Completed"
    ? "#22c55e"
    : "#ef4444"
                    }}
                  />

                  <div
                    style={{
                      width: "2px",
                      height: "14px",
                      background: "#d1d5db",
                      marginTop: "4px"
                    }}
                  />
                </div>

                <span>{selectedMission.status === "Completed"
  ? "💸 Circle Payment Settled"
  : "💸 Circle Payment Not Executed"}</span>
              </div>

              {/* Complete */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px"
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background:
  selectedMission.status === "Completed"
    ? "#22c55e"
    : "#ef4444",
                    marginTop: "6px",
                    flexShrink: 0
                  }}
                />

                <span
                  style={{
                    color: "#111827",
fontWeight: "400"
                  }}
                >
                  {selectedMission.status === "Completed" ? (
  <>
    <p>🎉 Mission Complete</p>
  </>
) : (
  <>
    <p>❌ Mission Rejected</p>
  </>
)}
                </span>
              </div>

            </div>

            <hr style={{ margin: "24px 0" }} />

            <h3>🔗 Circle Settlement</h3>

<div
  style={{
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "16px",
    lineHeight: "2"
  }}
>
  <div>
    <strong>Transaction Status:</strong>{" "}
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        fontWeight: "700",
        fontSize: "13px",
        color:
          selectedMission.status === "Rejected"
            ? "#4b5563"
            : selectedMission.transactions?.[0]?.status === "CONFIRMED" ||
              selectedMission.transactions?.[0]?.status === "COMPLETE"
            ? "#166534"
            : "#1d4ed8",
        background:
          selectedMission.status === "Rejected"
            ? "#f3f4f6"
            : selectedMission.transactions?.[0]?.status === "CONFIRMED" ||
              selectedMission.transactions?.[0]?.status === "COMPLETE"
            ? "#dcfce7"
            : "#dbeafe"
      }}
    >
      {selectedMission.status === "Rejected"
        ? "⚪ Not Executed"
        : selectedMission.transactions?.[0]?.status === "CONFIRMED" ||
          selectedMission.transactions?.[0]?.status === "COMPLETE"
        ? "🟢 Confirmed"
        : "🔵 Pending"}
    </span>
  </div>

  <div>
    <strong>Transaction ID:</strong>
    <br />
    <span
      style={{
        fontSize: "12px",
        color: "#6b7280",
        wordBreak: "break-all"
      }}
    >
      {selectedMission.transactions?.[0]?.circleTxId || "-"}
    </span>
  </div>

  <div>
    <strong>Transaction Hash:</strong>
    <br />
    <span
      style={{
        fontSize: "12px",
        color: "#2563eb",
        wordBreak: "break-all"
      }}
    >
      {selectedMission.transactions?.[0]?.txHash || "-"}
    </span>
  </div>
</div>

                    </div>
        )}
      </>
    )}
  </div>
);
}

export default App;
