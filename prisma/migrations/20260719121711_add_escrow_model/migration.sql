-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Escrow_missionId_key" ON "Escrow"("missionId");

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
