/*
  Warnings:

  - You are about to drop the column `organization` on the `Treasury` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Treasury` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `Treasury` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Treasury` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treasury" DROP COLUMN "organization",
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_organizationId_key" ON "Treasury"("organizationId");

-- AddForeignKey
ALTER TABLE "Treasury" ADD CONSTRAINT "Treasury_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
