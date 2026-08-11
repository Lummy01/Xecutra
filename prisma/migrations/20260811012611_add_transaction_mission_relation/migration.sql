-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
