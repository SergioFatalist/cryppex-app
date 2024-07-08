-- AlterTable
ALTER TABLE "investments" ALTER COLUMN "start_epoch" SET DEFAULT EXTRACT(epoch FROM now());
