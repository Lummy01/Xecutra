require("dotenv").config();

const {
  initiateDeveloperControlledWalletsClient,
} = require("@circle-fin/developer-controlled-wallets");

const entitySecret = process.argv[2];

if (!entitySecret) {
  console.log("Usage:");
  console.log("node testEntitySecret.js <ENTITY_SECRET>");
  process.exit(1);
}

async function main() {
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret,
  });

  try {
    // Make a simple authenticated request
    const response = await client.listWallets({
      pageSize: 1,
    });

    console.log("✅ SUCCESS!");
    console.log("This entity secret is valid.");
    console.log(response.data);
  } catch (err) {
    console.log("❌ FAILED");
    console.log(err.message);

    if (err.response?.data) {
      console.log(err.response.data);
    }
  }
}

main();