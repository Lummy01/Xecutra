-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "confirmedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_missionId_key" ON "Delivery"("missionId");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
