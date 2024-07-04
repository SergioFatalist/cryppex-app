-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_epoch" INTEGER NOT NULL DEFAULT EXTRACT(epoch FROM now());
