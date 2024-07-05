/*
  Warnings:

  - You are about to drop the column `farm` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "farm",
ADD COLUMN     "interest" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "locked" BIGINT NOT NULL DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE BIGINT;
