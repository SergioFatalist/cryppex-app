-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "AppUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);
