-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "address" VARCHAR NOT NULL,
    "private_key" VARCHAR NOT NULL,
    "last_login" BIGINT NOT NULL,
    "last_counter" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");
