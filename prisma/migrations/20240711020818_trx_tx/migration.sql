-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "owner_address" VARCHAR,
ADD COLUMN     "to_address" VARCHAR,
ALTER COLUMN "tx_id" SET DATA TYPE VARCHAR;
