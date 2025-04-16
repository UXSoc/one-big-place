/*
  Warnings:

  - Added the required column `idNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bonus" TEXT[],
ADD COLUMN     "extraTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "idNumber" INTEGER NOT NULL,
ADD COLUMN     "placeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "placedBreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "replaced" INTEGER NOT NULL DEFAULT 0;
