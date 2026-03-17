-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'STORE_ADMIN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "TipStatus" AS ENUM ('INICIADO', 'PAGADO', 'CANCELADO', 'FALLIDO', 'EXPIRADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "SplitMode" AS ENUM ('EQUAL', 'PERCENTAGE', 'MANUAL');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "dni_encrypted" TEXT,
    "photo_url" VARCHAR(500),
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "two_factor_secret" TEXT,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cuit" VARCHAR(20),
    "address" VARCHAR(500),
    "type" VARCHAR(50),
    "logo_url" VARCHAR(500),
    "qr_code" TEXT,
    "qr_token" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_sandbox" BOOLEAN NOT NULL DEFAULT true,
    "commission_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.0800,
    "mp_access_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venue_admins" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "venue_id" UUID NOT NULL,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venue_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectors" (
    "id" UUID NOT NULL,
    "venue_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "split_mode" "SplitMode" NOT NULL DEFAULT 'EQUAL',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "venue_id" UUID NOT NULL,
    "sector_id" UUID,
    "display_name" VARCHAR(100) NOT NULL,
    "photo_url" VARCHAR(500),
    "split_percentage" DECIMAL(5,2),
    "payment_account_enc" TEXT,
    "qr_personal_token" UUID NOT NULL,
    "mp_collector_id" VARCHAR(50),
    "mp_access_token_enc" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "id" UUID NOT NULL,
    "venue_id" UUID NOT NULL,
    "sector_id" UUID,
    "employee_id" UUID,
    "gross_amount" DECIMAL(12,2) NOT NULL,
    "commission_rate" DECIMAL(5,4) NOT NULL,
    "commission_amount" DECIMAL(12,2) NOT NULL,
    "net_amount" DECIMAL(12,2) NOT NULL,
    "rating" INTEGER,
    "comment" VARCHAR(500),
    "status" "TipStatus" NOT NULL DEFAULT 'INICIADO',
    "mp_preference_id" VARCHAR(100),
    "mp_payment_id" VARCHAR(100),
    "mp_status" VARCHAR(50),
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tip_splits" (
    "id" UUID NOT NULL,
    "tip_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "net_amount" DECIMAL(12,2) NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tip_splits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propinando_config" (
    "id" UUID NOT NULL,
    "commission_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.0800,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propinando_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "entity_id" UUID,
    "payload" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "venues_qr_token_key" ON "venues"("qr_token");

-- CreateIndex
CREATE INDEX "venue_admins_user_id_idx" ON "venue_admins"("user_id");

-- CreateIndex
CREATE INDEX "venue_admins_venue_id_idx" ON "venue_admins"("venue_id");

-- CreateIndex
CREATE UNIQUE INDEX "venue_admins_user_id_venue_id_key" ON "venue_admins"("user_id", "venue_id");

-- CreateIndex
CREATE INDEX "sectors_venue_id_idx" ON "sectors"("venue_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_qr_personal_token_key" ON "employees"("qr_personal_token");

-- CreateIndex
CREATE INDEX "employees_venue_id_idx" ON "employees"("venue_id");

-- CreateIndex
CREATE INDEX "employees_qr_personal_token_idx" ON "employees"("qr_personal_token");

-- CreateIndex
CREATE UNIQUE INDEX "tips_mp_payment_id_key" ON "tips"("mp_payment_id");

-- CreateIndex
CREATE INDEX "tips_venue_id_idx" ON "tips"("venue_id");

-- CreateIndex
CREATE INDEX "tips_employee_id_idx" ON "tips"("employee_id");

-- CreateIndex
CREATE INDEX "tips_status_idx" ON "tips"("status");

-- CreateIndex
CREATE INDEX "tips_mp_payment_id_idx" ON "tips"("mp_payment_id");

-- CreateIndex
CREATE INDEX "tips_created_at_idx" ON "tips"("created_at");

-- CreateIndex
CREATE INDEX "tip_splits_tip_id_idx" ON "tip_splits"("tip_id");

-- CreateIndex
CREATE INDEX "tip_splits_employee_id_idx" ON "tip_splits"("employee_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "audit_log_user_id_idx" ON "audit_log"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_entity_idx" ON "audit_log"("entity");

-- CreateIndex
CREATE INDEX "audit_log_entity_id_idx" ON "audit_log"("entity_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "venue_admins" ADD CONSTRAINT "venue_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_admins" ADD CONSTRAINT "venue_admins_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip_splits" ADD CONSTRAINT "tip_splits_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip_splits" ADD CONSTRAINT "tip_splits_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
