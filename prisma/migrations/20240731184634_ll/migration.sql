/*
  Warnings:

  - You are about to alter the column `last_login` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "last_login" SET DATA TYPE INTEGER;
