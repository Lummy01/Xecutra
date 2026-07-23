require("dotenv").config();

const {
    initiateDeveloperControlledWalletsClient
} = require("@circle-fin/developer-controlled-wallets");

const sdk = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET
});

(async () => {
    try {
        await sdk.params.client.Transactions.createDeveloperTransactionTransfer({});
    } catch (err) {
        console.log(err);
    }
})();