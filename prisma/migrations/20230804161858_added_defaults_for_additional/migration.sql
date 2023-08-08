/*
  Warnings:

  - Made the column `additional` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `additional` on table `joinRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "additional" SET NOT NULL,
ALTER COLUMN "additional" SET DEFAULT '{"public": {}, "private": {}, "limited": {}}';

-- AlterTable
ALTER TABLE "joinRequest" ALTER COLUMN "additional" SET NOT NULL,
ALTER COLUMN "additional" SET DEFAULT '{"public": {}, "private": {}, "limited": {}}';
