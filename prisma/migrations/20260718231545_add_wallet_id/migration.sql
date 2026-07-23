/*
  Warnings:

  - Added the required column `walletId` to the `Treasury` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treasury" ADD COLUMN     "walletId" TEXT NOT NULL;
