/*
  Warnings:

  - The primary key for the `joinRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `joinRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "joinRequest" DROP CONSTRAINT "joinRequest_pkey",
DROP COLUMN "uuid",
ADD CONSTRAINT "joinRequest_pkey" PRIMARY KEY ("senderId", "receiverId");
