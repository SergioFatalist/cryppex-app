-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "amount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address_base58" VARCHAR,
ADD COLUMN     "address_hex" VARCHAR,
ADD COLUMN     "private_key" VARCHAR,
ADD COLUMN     "public_key" VARCHAR;
