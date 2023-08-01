/*
  Warnings:

  - The `tasks` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tasks",
ADD COLUMN     "tasks" JSONB[];
