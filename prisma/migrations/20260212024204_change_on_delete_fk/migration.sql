-- DropForeignKey
ALTER TABLE "trx"."excel_mappings" DROP CONSTRAINT "fk_excel_mappings_user";

-- DropForeignKey
ALTER TABLE "trx"."excel_templates" DROP CONSTRAINT "fk_excel_templates_user";

-- AddForeignKey
ALTER TABLE "trx"."excel_mappings" ADD CONSTRAINT "fk_excel_mappings_user" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trx"."excel_templates" ADD CONSTRAINT "fk_excel_templates_user" FOREIGN KEY ("user_id") REFERENCES "usr"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
