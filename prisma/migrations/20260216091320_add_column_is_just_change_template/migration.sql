-- AlterTable
ALTER TABLE "mtr"."feature" ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "trx"."excel_mappings" ADD COLUMN     "is_just_change" BOOLEAN NOT NULL DEFAULT false;
