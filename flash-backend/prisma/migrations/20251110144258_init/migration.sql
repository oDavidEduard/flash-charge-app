-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chargers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "charger_type" TEXT NOT NULL,
    "power_kw" DECIMAL(5,2) NOT NULL,
    "price_per_kwh" DECIMAL(5,2),
    "available" BOOLEAN NOT NULL DEFAULT true,
    "submitted_by" INTEGER,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chargers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charger_requests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "charger_type" TEXT NOT NULL,
    "power_kw" DECIMAL(5,2) NOT NULL,
    "price_per_kwh" DECIMAL(5,2),
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "submitted_by" INTEGER NOT NULL,
    "reviewed_by" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "charger_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "chargers_latitude_longitude_idx" ON "chargers"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "chargers_available_idx" ON "chargers"("available");

-- CreateIndex
CREATE INDEX "charger_requests_status_idx" ON "charger_requests"("status");

-- CreateIndex
CREATE INDEX "charger_requests_submitted_by_idx" ON "charger_requests"("submitted_by");

-- AddForeignKey
ALTER TABLE "chargers" ADD CONSTRAINT "chargers_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charger_requests" ADD CONSTRAINT "charger_requests_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charger_requests" ADD CONSTRAINT "charger_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
