-- CreateTable
CREATE TABLE "trx"."excel_template_header_settings" (
    "id" BIGSERIAL NOT NULL,
    "template_id" BIGINT NOT NULL,
    "grouping_column_label" TEXT NOT NULL,

    CONSTRAINT "excel_template_header_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx"."excel_template_header" (
    "id" BIGSERIAL NOT NULL,
    "header_setting_id" BIGINT NOT NULL,
    "is_multiple" BOOLEAN NOT NULL,

    CONSTRAINT "excel_template_header_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "excel_template_header_settings_template_id_key" ON "trx"."excel_template_header_settings"("template_id");

-- AddForeignKey
ALTER TABLE "trx"."excel_template_header_settings" ADD CONSTRAINT "fk_excel_template_header_settings_template" FOREIGN KEY ("template_id") REFERENCES "trx"."excel_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_template_header" ADD CONSTRAINT "fk_excel_template_header_template_header_settings" FOREIGN KEY ("header_setting_id") REFERENCES "trx"."excel_template_header_settings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
