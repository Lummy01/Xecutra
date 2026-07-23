const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

    await prisma.vendor.create({
        data: {
            name: "Vendor B",
            walletId: "ea0b38ad-df23-5818-a5d0-7b84c1b424f8",
            walletAddress: "0x799f740f71f5550f76b35395c668b81887951494"
        }
    });

    console.log("✅ Vendor B created");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });