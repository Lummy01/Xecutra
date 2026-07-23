-- CreateTable
CREATE TABLE "Guardrail" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "maxVendorSpend" DOUBLE PRECISION NOT NULL,
    "minimumReserve" DOUBLE PRECISION NOT NULL,
    "escrowRequired" BOOLEAN NOT NULL DEFAULT true,
    "approvedVendorsOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guardrail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guardrail_organizationId_key" ON "Guardrail"("organizationId");

-- AddForeignKey
ALTER TABLE "Guardrail" ADD CONSTRAINT "Guardrail_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
