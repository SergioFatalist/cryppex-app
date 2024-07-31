/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Account";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "address" VARCHAR NOT NULL,
    "private_key" VARCHAR NOT NULL,
    "last_login" BIGINT NOT NULL,
    "last_counter" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_id_key" ON "accounts"("id");
