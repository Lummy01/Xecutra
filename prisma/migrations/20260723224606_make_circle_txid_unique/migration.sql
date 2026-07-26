/*
  Warnings:

  - A unique constraint covering the columns `[circleTxId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_circleTxId_key" ON "Transaction"("circleTxId");
