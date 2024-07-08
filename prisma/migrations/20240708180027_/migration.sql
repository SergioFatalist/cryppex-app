/*
  Warnings:

  - A unique constraint covering the columns `[tx_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "investments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "amount" BIGINT NOT NULL,
    "rate" INTEGER NOT NULL,
    "interest" BIGINT NOT NULL,
    "start_epoch" INTEGER NOT NULL,
    "end_epoch" INTEGER,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_tx_id_key" ON "transactions"("tx_id");

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
