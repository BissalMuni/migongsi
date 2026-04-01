-- CreateTable
CREATE TABLE "Housing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serialNo" INTEGER NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "eupmyeondong" TEXT NOT NULL,
    "detailAddress" TEXT NOT NULL,
    "roadName" TEXT,
    "name" TEXT NOT NULL,
    "dong" TEXT NOT NULL,
    "ho" TEXT NOT NULL,
    "area" REAL NOT NULL,
    "price" BIGINT NOT NULL,
    "roadAddr" TEXT,
    "jibunAddr" TEXT,
    "zipNo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Housing_sido_sigungu_eupmyeondong_idx" ON "Housing"("sido", "sigungu", "eupmyeondong");

-- CreateIndex
CREATE INDEX "Housing_name_idx" ON "Housing"("name");

-- CreateIndex
CREATE INDEX "Housing_roadName_idx" ON "Housing"("roadName");
