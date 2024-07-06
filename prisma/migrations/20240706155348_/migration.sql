/*
  Warnings:

  - You are about to drop the column `address_base58` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `address_hex` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "tx_id" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "address_base58",
DROP COLUMN "address_hex";

-- DropTable
DROP TABLE "addresses";
