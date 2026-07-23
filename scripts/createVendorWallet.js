require("dotenv").config();

const circleService = require("./services/circleService");

async function main() {

    const result =
        await circleService.createTreasuryWallet("Vendor B");

    console.log(JSON.stringify(result, null, 2));
}

main();