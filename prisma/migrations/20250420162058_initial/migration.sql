-- CreateTable
CREATE TABLE "year_statistics" (
    "year" INTEGER NOT NULL,
    "pixelCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "year_statistics_pkey" PRIMARY KEY ("year")
);
