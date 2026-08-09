function TreasuryCard({ treasury, treasuryBalance }) {
  const shortWallet = treasury?.walletAddress
    ? `${treasury.walletAddress.slice(0, 6)}...${treasury.walletAddress.slice(-4)}`
    : "Unavailable";

  return (
    <div className="card">
      <h2>💰 Treasury</h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "8px"
        }}
      >
        Available Balance
      </p>

      <h1
        style={{
          fontSize: "42px",
          marginBottom: "20px",
          color: "#2563eb"
        }}
      >
        {treasuryBalance.available.toFixed(2)} USDC
      </h1>

      <hr style={{ marginBottom: "18px" }} />

      <p style={{ color: "#6b7280" }}>
        Wallet Address
      </p>

      <strong>{shortWallet}</strong>
    </div>
  );
}

export default TreasuryCard;