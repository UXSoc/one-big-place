-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(6) NOT NULL,
    "lastPlacedDate" TIMESTAMPTZ(6),
    "lastBitCount" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
