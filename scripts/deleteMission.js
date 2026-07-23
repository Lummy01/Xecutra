const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  // Delete escrow first
  await prisma.escrow.deleteMany({
    where: {
      mission: {
        title: "vu"
      }
    }
  });

  // Delete delivery too (if one exists)
  await prisma.delivery.deleteMany({
    where: {
      mission: {
        title: "vu"
      }
    }
  });

  // Now delete the mission
  const result = await prisma.mission.deleteMany({
    where: {
      title: "vu"
    }
  });

  console.log(result);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });