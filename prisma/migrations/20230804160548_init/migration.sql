-- CreateTable
CREATE TABLE "User" (
    "uuid" INTEGER NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "bio" JSONB NOT NULL,
    "additional" JSONB NOT NULL DEFAULT '{"public": {}, "private": {}, "limited": {}}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "tasks" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB NOT NULL,
    "additional" JSONB,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "joinRequest" (
    "senderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiverId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "additional" JSONB,

    CONSTRAINT "joinRequest_pkey" PRIMARY KEY ("senderId","receiverId")
);

-- CreateTable
CREATE TABLE "_members" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ban" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_members_AB_unique" ON "_members"("A", "B");

-- CreateIndex
CREATE INDEX "_members_B_index" ON "_members"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ban_AB_unique" ON "_ban"("A", "B");

-- CreateIndex
CREATE INDEX "_ban_B_index" ON "_ban"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "joinRequest" ADD CONSTRAINT "joinRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "joinRequest" ADD CONSTRAINT "joinRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ban" ADD CONSTRAINT "_ban_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ban" ADD CONSTRAINT "_ban_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
