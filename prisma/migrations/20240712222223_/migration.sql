-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "telegram_id" BIGINT NOT NULL,
    "username" VARCHAR,
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "language_code" VARCHAR,
    "address" VARCHAR NOT NULL,
    "private_key" VARCHAR NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "locked" BIGINT NOT NULL DEFAULT 0,
    "interest" BIGINT NOT NULL DEFAULT 0,
    "referrer_id" UUID,
    "created" BIGINT NOT NULL,
    "last_login" BIGINT,
    "curr_login_epoch" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "tx_id" VARCHAR,
    "tx_time" BIGINT NOT NULL,
    "tx_owner_address" VARCHAR,
    "tx_to_address" VARCHAR,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "internal" BOOLEAN NOT NULL DEFAULT true,
    "referral" TEXT,
    "type" TEXT NOT NULL,
    "referral_id" UUID,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "amount" BIGINT NOT NULL,
    "rate" INTEGER NOT NULL,
    "interest" BIGINT NOT NULL,
    "start" BIGINT NOT NULL,
    "finish" BIGINT NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_tx_id_key" ON "transactions"("tx_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
