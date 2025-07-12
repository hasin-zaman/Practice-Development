-- CreateTable
CREATE TABLE "Breach" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "breachDate" TIMESTAMP(3) NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL,
    "modifiedDate" TIMESTAMP(3) NOT NULL,
    "pwnCount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "logoPath" TEXT NOT NULL,
    "dataClasses" TEXT[],
    "isVerified" BOOLEAN NOT NULL,

    CONSTRAINT "Breach_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Breach_name_key" ON "Breach"("name");
