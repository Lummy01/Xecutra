-- CreateTable
CREATE TABLE "Treasury" (
    "id" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Treasury_pkey" PRIMARY KEY ("id")
);
