-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "heightCm" REAL NOT NULL,
    "weightKg" REAL NOT NULL,
    "activityLevel" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "trainingLocation" TEXT NOT NULL DEFAULT 'GYM',
    "daysPerWeek" INTEGER NOT NULL DEFAULT 4,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GymProgram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bmi" REAL NOT NULL,
    "bmr" REAL NOT NULL,
    "tdee" REAL NOT NULL,
    "calorieTarget" REAL NOT NULL,
    "proteinG" REAL NOT NULL,
    "carbsG" REAL NOT NULL,
    "fatG" REAL NOT NULL,
    "ifSchedule" JSONB NOT NULL,
    "schedule" JSONB NOT NULL,
    "mealPlan" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GymProgram_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BodyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weightKg" REAL NOT NULL,
    "bodyFatPct" REAL,
    "muscleMassKg" REAL,
    "waistCm" REAL,
    "chestCm" REAL,
    "hipCm" REAL,
    "armCm" REAL,
    "thighCm" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BodyLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkinAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "photoUrl" TEXT,
    "skinType" TEXT NOT NULL,
    "concerns" JSONB NOT NULL,
    "severity" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "routine" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkinAnalysis_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BodyAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "photoUrl" TEXT,
    "skinType" TEXT NOT NULL,
    "concerns" JSONB NOT NULL,
    "severity" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "routine" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BodyAnalysis_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HairRoutine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "hairType" TEXT NOT NULL,
    "scalpType" TEXT NOT NULL,
    "concerns" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "routine" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HairRoutine_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GymProgram_profileId_idx" ON "GymProgram"("profileId");

-- CreateIndex
CREATE INDEX "BodyLog_profileId_idx" ON "BodyLog"("profileId");

-- CreateIndex
CREATE INDEX "SkinAnalysis_profileId_idx" ON "SkinAnalysis"("profileId");

-- CreateIndex
CREATE INDEX "BodyAnalysis_profileId_idx" ON "BodyAnalysis"("profileId");

-- CreateIndex
CREATE INDEX "HairRoutine_profileId_idx" ON "HairRoutine"("profileId");
