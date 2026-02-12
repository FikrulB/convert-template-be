/*
  Warnings:

  - You are about to drop the column `source_column_name` on the `excel_mapping_detail` table. All the data in the column will be lost.
  - You are about to drop the column `column_name` on the `excel_template_order` table. All the data in the column will be lost.
  - Made the column `target_column_id` on table `excel_mapping_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source_column_index` on table `excel_mapping_detail` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `data_orientation` to the `excel_templates` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_multiple_header` on table `excel_templates` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "trx"."data_orientation" AS ENUM ('VERTICAL', 'HORIZONTAL');

-- DropIndex
DROP INDEX "trx"."uq_excel_templates_name_user_active";

-- AlterTable
ALTER TABLE "trx"."excel_mapping_detail" DROP COLUMN "source_column_name",
ALTER COLUMN "target_column_id" SET NOT NULL,
ALTER COLUMN "source_column_index" SET NOT NULL;

-- AlterTable
ALTER TABLE "trx"."excel_template_order" DROP COLUMN "column_name";

-- AlterTable
ALTER TABLE "trx"."excel_templates" DROP COLUMN "data_orientation",
ADD COLUMN     "data_orientation" "trx"."data_orientation" NOT NULL,
ALTER COLUMN "is_multiple_header" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "trx"."excel_mapping_detail" ADD CONSTRAINT "fk_excel_mapping_detail_template_detail" FOREIGN KEY ("target_column_id") REFERENCES "trx"."excel_template_detail"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
