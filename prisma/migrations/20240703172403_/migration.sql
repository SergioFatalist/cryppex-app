/*
  Warnings:

  - You are about to drop the column `direction` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `operation` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "direction",
ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "operation" TEXT NOT NULL,
ADD COLUMN     "referral" TEXT;
