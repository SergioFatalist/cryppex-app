/*
  Warnings:

  - Made the column `end_epoch` on table `investments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "investments" ALTER COLUMN "end_epoch" SET NOT NULL;
