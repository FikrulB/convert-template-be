-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mtr";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "trx";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "usr";

-- CreateTable
CREATE TABLE "mtr"."feature" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(23) NOT NULL,
    "name" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" BIGINT,

    CONSTRAINT "feature_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mtr"."role" (
    "id" BIGSERIAL NOT NULL,
    "code" CHAR(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" BIGINT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mtr"."role_feature" (
    "id" BIGSERIAL NOT NULL,
    "role_id" BIGINT NOT NULL,
    "feature_id" BIGINT NOT NULL,

    CONSTRAINT "role_feature_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mtr"."mapping_type" (
    "id" SERIAL NOT NULL,
    "code" CHAR(3) NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" BIGINT,

    CONSTRAINT "mapping_type_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx"."excel_mapping_detail" (
    "id" BIGSERIAL NOT NULL,
    "mapping_id" BIGINT NOT NULL,
    "target_column_id" BIGINT,
    "source_column_index" INTEGER,
    "source_column_name" VARCHAR(100),
    "source_label" VARCHAR(100),
    "mapping_type" VARCHAR(50),
    "formula_expression" TEXT,

    CONSTRAINT "excel_mapping_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx"."excel_mappings" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "user_id" BIGINT NOT NULL,
    "template_id" BIGINT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" BIGINT,

    CONSTRAINT "excel_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx"."excel_template_detail" (
    "id" BIGSERIAL NOT NULL,
    "template_id" BIGINT NOT NULL,
    "column_index" INTEGER,
    "row_index" INTEGER,
    "label" VARCHAR(100),
    "is_required" BOOLEAN DEFAULT false,
    "alignment" JSONB,
    "font_color" VARCHAR(20),
    "background_color" VARCHAR(20),

    CONSTRAINT "excel_template_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx"."excel_template_order" (
    "id" BIGSERIAL NOT NULL,
    "template_id" BIGINT NOT NULL,
    "column_index" INTEGER,
    "column_name" VARCHAR(100),
    "row_index" INTEGER,
    "row_order_number" INTEGER,

    CONSTRAINT "excel_template_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx"."excel_templates" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "data_orientation" VARCHAR(20),
    "is_multiple_header" BOOLEAN DEFAULT false,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" BIGINT,

    CONSTRAINT "excel_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usr"."user_authentication" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "access_token" VARCHAR NOT NULL,
    "refresh_token" VARCHAR,

    CONSTRAINT "user_authentication_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usr"."user_detail" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "avatar" TEXT,
    "fullname" TEXT NOT NULL,
    "address" TEXT,
    "phone_number" VARCHAR(16),

    CONSTRAINT "user_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usr"."user_password" (
    "id" BIGSERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" BIGINT,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "user_password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usr"."user_role" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usr"."users" (
    "id" BIGSERIAL NOT NULL,
    "unique_code" CHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP(6),
    "deleted_by" BIGINT,
    "start_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_unique" ON "mtr"."feature"("code");

-- CreateIndex
CREATE INDEX "feature_deleted_at_idx" ON "mtr"."feature"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "role_code_key" ON "mtr"."role"("code");

-- CreateIndex
CREATE INDEX "idx_role_code" ON "mtr"."role"("code");

-- CreateIndex
CREATE INDEX "idx_role_deleted_at" ON "mtr"."role"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "role_feature_unique" ON "mtr"."role_feature"("role_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "mapping_type_unique" ON "mtr"."mapping_type"("code", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "excel_mappings_unique" ON "trx"."excel_mappings"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_template_detail_position" ON "trx"."excel_template_detail"("template_id", "row_index", "column_index");

-- CreateIndex
CREATE UNIQUE INDEX "uq_template_order_position" ON "trx"."excel_template_order"("template_id", "row_index", "row_order_number");

-- CreateIndex
CREATE UNIQUE INDEX "excel_templates_unique" ON "trx"."excel_templates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_authentication_unique" ON "usr"."user_authentication"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_authentication_unique_1" ON "usr"."user_authentication"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "user_detail_unique" ON "usr"."user_detail"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_detail_user_id" ON "usr"."user_detail"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_password_deleted_at" ON "usr"."user_password"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_user_password_user" ON "usr"."user_password"("created_by");

-- CreateIndex
CREATE INDEX "user_password_user_id_idx" ON "usr"."user_password"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_password_unique" ON "usr"."user_password"("password", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_unique" ON "usr"."user_role"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_role_role_id" ON "usr"."user_role"("role_id");

-- CreateIndex
CREATE INDEX "idx_user_role_user_id" ON "usr"."user_role"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_role" ON "usr"."user_role"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_unique_code_key" ON "usr"."users"("unique_code");

-- CreateIndex
CREATE INDEX "idx_user_deleted_at" ON "usr"."users"("deleted_at");

-- AddForeignKey
ALTER TABLE "mtr"."role_feature" ADD CONSTRAINT "role_feature_feature_fk" FOREIGN KEY ("feature_id") REFERENCES "mtr"."feature"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mtr"."role_feature" ADD CONSTRAINT "role_feature_role_fk" FOREIGN KEY ("role_id") REFERENCES "mtr"."role"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_mapping_detail" ADD CONSTRAINT "fk_excel_mapping_detail_mapping" FOREIGN KEY ("mapping_id") REFERENCES "trx"."excel_mappings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_mappings" ADD CONSTRAINT "fk_excel_mappings_template" FOREIGN KEY ("template_id") REFERENCES "trx"."excel_templates"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_mappings" ADD CONSTRAINT "fk_excel_mappings_user" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_template_detail" ADD CONSTRAINT "fk_excel_template_detail_template" FOREIGN KEY ("template_id") REFERENCES "trx"."excel_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_template_order" ADD CONSTRAINT "fk_excel_template_order_template" FOREIGN KEY ("template_id") REFERENCES "trx"."excel_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_templates" ADD CONSTRAINT "fk_excel_templates_user" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usr"."user_authentication" ADD CONSTRAINT "user_authentication_user_fk" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usr"."user_detail" ADD CONSTRAINT "fk_user_detail_user_id" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usr"."user_password" ADD CONSTRAINT "user_password_user_fk" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usr"."user_role" ADD CONSTRAINT "fk_user_role_role" FOREIGN KEY ("role_id") REFERENCES "mtr"."role"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usr"."user_role" ADD CONSTRAINT "fk_user_role_user" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ======================================
-- Partial Unique Indexes for soft delete
-- ======================================

-- Users
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email_active
ON usr.users (email)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_unique_code_active
ON usr.users (unique_code)
WHERE deleted_at IS NULL;

-- User Password
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_password_user_active
ON usr.user_password (user_id, password)
WHERE deleted_at IS NULL;

-- Excel Mappings
CREATE UNIQUE INDEX IF NOT EXISTS uq_excel_mappings_code_active
ON trx.excel_mappings (code)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_excel_mappings_name_user_active
ON trx.excel_mappings (name, user_id)
WHERE deleted_at IS NULL;

-- Excel Templates
CREATE UNIQUE INDEX IF NOT EXISTS uq_excel_templates_code_active
ON trx.excel_templates (code)
WHERE deleted_at IS NULL;

-- Role
CREATE UNIQUE INDEX IF NOT EXISTS uq_role_code_active
ON mtr.role (code)
WHERE deleted_at IS NULL;

-- Feature
CREATE UNIQUE INDEX IF NOT EXISTS uq_feature_code_active
ON mtr.feature (code)
WHERE deleted_at IS NULL;

-- ======================================
-- Done
-- ======================================
