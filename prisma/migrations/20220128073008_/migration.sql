-- CreateTable
CREATE TABLE "_ban" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ban_AB_unique" ON "_ban"("A", "B");

-- CreateIndex
CREATE INDEX "_ban_B_index" ON "_ban"("B");

-- AddForeignKey
ALTER TABLE "_ban" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ban" ADD FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
