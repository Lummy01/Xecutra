require("dotenv").config();

const {
    initiateDeveloperControlledWalletsClient
} = require("@circle-fin/developer-controlled-wallets");

const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET
});

console.log(Object.keys(client));
console.log("-------------");

console.log(client.params);

console.log("-------------");

console.log(Object.keys(client.params.client));

console.log("-------------");

console.log(Object.keys(client.params.client.Transactions));