-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "users" (
    "id" BIGINT NOT NULL,
    "username" VARCHAR,
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "language_code" VARCHAR,
    "address" VARCHAR NOT NULL,
    "private_key" VARCHAR NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "ref_id" BIGINT,
    "created" BIGINT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonuses" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "ref_id" BIGINT NOT NULL,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "created" BIGINT NOT NULL,
    "applied" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "ref_id" BIGINT,
    "tx_id" VARCHAR,
    "tx_time" BIGINT NOT NULL,
    "tx_owner_address" VARCHAR,
    "tx_to_address" VARCHAR,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "internal" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "amount" BIGINT NOT NULL,
    "rate" INTEGER NOT NULL,
    "interest" BIGINT NOT NULL,
    "start" BIGINT NOT NULL,
    "finish" BIGINT NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "event_time" BIGINT,
    "event_type" VARCHAR,
    "event_text" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_tx_id_key" ON "transactions"("tx_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_ref_id_fkey" FOREIGN KEY ("ref_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonuses" ADD CONSTRAINT "bonuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE VIEW "users_info" AS
SELECT u.id                AS id,
       u.username          AS username,
       u.first_name        AS first_name,
       u.last_name         AS last_name,
       u.language_code     AS language_code,
       u.address           AS address,
       u.balance           AS balance,
       u.ref_id            AS ref_id,
       u.created           AS created,
       ii.invests_count    AS invests_count,
       ii.invests_amount   AS invests_amount,
       ii.invests_interest AS invests_interest
FROM users AS u
         LEFT JOIN (SELECT i.user_id       AS user_id,
                           count(id)       AS invests_count,
                           sum(i.amount)   AS invests_amount,
                           sum(i.interest) AS invests_interest
                    FROM investments AS i
                    WHERE i.closed IS false
                    GROUP BY i.user_id) AS ii ON ii.user_id = u.id;
