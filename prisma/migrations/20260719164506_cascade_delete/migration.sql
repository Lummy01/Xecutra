-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_missionId_fkey";

-- DropForeignKey
ALTER TABLE "Escrow" DROP CONSTRAINT "Escrow_missionId_fkey";

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
