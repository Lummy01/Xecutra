require("dotenv").config();

console.log("API KEY:");
console.log(process.env.CIRCLE_API_KEY);

console.log("\nENTITY SECRET:");
console.log(process.env.CIRCLE_ENTITY_SECRET);