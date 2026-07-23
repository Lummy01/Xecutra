const { generateEntitySecret } = require("@circle-fin/developer-controlled-wallets");

const entitySecret = generateEntitySecret();

console.log(entitySecret);