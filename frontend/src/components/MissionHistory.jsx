import React, { useState } from "react";

function MissionHistory({ missions, onSelectMission }) {
  const [searchTerm, setSearchTerm] = useState("");

  const matchesSearch = (mission) => {
  const search = searchTerm.toLowerCase().trim();

  if (!search) return true;

// Date searches
const missionDate = mission.createdAt
  ? new Date(mission.createdAt)
  : null;

const now = new Date();

if (missionDate) {
  if (search.includes("today")) {
    return (
      missionDate.toDateString() === now.toDateString()
    );
  }

  if (search.includes("yesterday")) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    return (
      missionDate.toDateString() === yesterday.toDateString()
    );
  }

  if (search.includes("this month")) {
    return (
      missionDate.getMonth() === now.getMonth() &&
      missionDate.getFullYear() === now.getFullYear()
    );
  }

  if (search.includes("last month")) {
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    return (
      missionDate.getMonth() === lastMonth.getMonth() &&
      missionDate.getFullYear() === lastMonth.getFullYear()
    );
  }

  if (search.includes("this year")) {
    return (
      missionDate.getFullYear() === now.getFullYear()
    );
  }
}

  // Natural-language status searches
  if (search.includes("completed")) {
    return mission.status?.toLowerCase() === "completed";
  }

  if (search.includes("rejected")) {
    return mission.status?.toLowerCase() === "rejected";
  }

  if (search.includes("pending")) {
    return mission.status?.toLowerCase() === "pending";
  }

// Amount searches
const amount = Number(mission.approvedAmount);

if (search.includes("below") || search.includes("under")) {
  const match = search.match(/(?:below|under)\s*(\d+(?:\.\d+)?)/);

  if (match) {
    return amount < Number(match[1]);
  }
}

if (search.includes("above") || search.includes("over")) {
  const match = search.match(/(?:above|over)\s*(\d+(?:\.\d+)?)/);

  if (match) {
    return amount > Number(match[1]);
  }
}

  // Confidence searches
  if (search.includes("high confidence")) {
    return Number(mission.confidence) >= 95;
  }

  if (search.includes("low confidence")) {
    return Number(mission.confidence) < 90;
  }

  // Vendor searches
  if (search.includes("orion")) {
    return mission.selectedVendor?.toLowerCase().includes("orion");
  }

  if (search.includes("quantum")) {
    return mission.selectedVendor?.toLowerCase().includes("quantum");
  }

  if (search.includes("nexus")) {
    return mission.selectedVendor?.toLowerCase().includes("nexus");
  }


  
  // Normal keyword search
  return (
    mission.title?.toLowerCase().includes(search) ||
    mission.description?.toLowerCase().includes(search) ||
    mission.selectedVendor?.toLowerCase().includes(search) ||
    mission.status?.toLowerCase().includes(search) ||
    String(mission.approvedAmount || "").includes(search) ||
    String(mission.confidence || "").includes(search)
  );
};

  const filteredMissions = [...missions]
    .filter(matchesSearch)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="card">
      <h2>📜 Mission History</h2>

      <div
        style={{
          margin: "18px 0"
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by title, vendor or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            outline: "none"
          }}
        />
      </div>

      {missions.length === 0 ? (
        <p>No missions found.</p>
      ) : (
        <table width="100%">
          <thead>
            <tr>
              <th align="left">Autonomous Mission</th>
              <th align="left">Vendor</th>
              <th align="left">Amount</th>
              <th align="left">Status</th>
              <th align="left">Confidence</th>
            </tr>
          </thead>

          <tbody>
            {filteredMissions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#6b7280"
                  }}
                >
                  🔍 No missions match your search.
                </td>
              </tr>
            ) : (
              filteredMissions.map((mission) => (
                <tr
                  key={mission.id}
                  onClick={() => onSelectMission(mission)}
                  style={{
                    cursor: "pointer"
                  }}
                >
                  <td>{mission.title}</td>

                  <td>{mission.selectedVendor || "-"}</td>

                  <td>
  {mission.status === "Rejected"
    ? "-"
    : mission.approvedAmount
    ? `${Number(mission.approvedAmount).toFixed(3)} USDC`
    : "-"}
</td>

                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontWeight: "700",
                        fontSize: "13px",
                        color:
  mission.status === "Completed"
    ? "#166534"
    : mission.status === "Rejected"
    ? "#991b1b"
    : mission.status === "Failed"
    ? "#991b1b"
    : "#1d4ed8",

background:
  mission.status === "Completed"
    ? "#dcfce7"
    : mission.status === "Rejected"
    ? "#fee2e2"
    : mission.status === "Failed"
    ? "#fee2e2"
    : "#dbeafe"
                      }}
                    >
                      {mission.status === "Completed"
                        ? "🟢 Completed"
                        : mission.status === "Rejected"
                        ? "🔴 Rejected"
                        : "🔵 Pending"}
                    </span>
                  </td>

                  <td>
                    {mission.confidence
                      ? `${mission.confidence}%`
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MissionHistory;