-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "lastPlacedDate" TIMESTAMPTZ(6),
    "lastBitCount" INTEGER,
    "maxBits" INTEGER NOT NULL DEFAULT 5,
    "extraTime" INTEGER NOT NULL DEFAULT 0,
    "idNumber" INTEGER NOT NULL,
    "placeCount" INTEGER NOT NULL DEFAULT 0,
    "replaced" INTEGER NOT NULL DEFAULT 0,
    "placedBreak" INTEGER NOT NULL DEFAULT 0,
    "bonus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
