function MissionHistory({ missions }) {
  return (
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
  );
}

export default MissionHistory;