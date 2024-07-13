/*
  Warnings:

  - You are about to drop the column `curr_login_epoch` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users"
RENAME COLUMN "curr_login_epoch" TO "curr_login";
