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
    "created_epoch" INTEGER NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    "last_login_epoch" INTEGER,
    "curr_login_epoch" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "start_epoch" INTEGER NOT NULL,
    "end_epoch" INTEGER,
    "referral" TEXT,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "success" BOOLEAN,
    "operation" TEXT NOT NULL,
    "referral_id" UUID,
    "tx_id" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
