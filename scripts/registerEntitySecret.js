require("dotenv").config();

console.log(process.cwd());
console.log(process.env.CIRCLE_API_KEY);

const { randomBytes } = require("crypto");
const { appendFileSync, existsSync, mkdirSync, readFileSync } = require("fs");
const {
  registerEntitySecretCiphertext,
} = require("@circle-fin/developer-controlled-wallets");

async function main() {
  const apiKey = process.env.CIRCLE_API_KEY;

  if (!apiKey) {
    throw new Error("CIRCLE_API_KEY is missing in your .env file.");
  }

  const existingEnv = existsSync(".env")
    ? readFileSync(".env", "utf8")
    : "";
    console.log("----- .env contents -----");
console.log(existingEnv);
console.log("-------------------------");



  const entitySecret =
  "c17708e8000491a7bb5af8ff1dadb07fc81c3a551b955d38da890b34c3cd9682";

console.log(entitySecret);

  const recoveryFolder = "./recovery";
  mkdirSync(recoveryFolder, { recursive: true });

  await registerEntitySecretCiphertext({
    apiKey,
    entitySecret,
    recoveryFileDownloadPath: recoveryFolder,
  });

  appendFileSync(".env", `\nCIRCLE_ENTITY_SECRET=${entitySecret}\n`);

  console.log("✅ Entity secret registered.");
  console.log("✅ Recovery file saved in ./recovery");
  console.log("✅ CIRCLE_ENTITY_SECRET added to .env");
}

main().catch(console.error);