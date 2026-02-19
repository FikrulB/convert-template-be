/*
  Warnings:

  - Added the required column `header_index` to the `excel_template_header` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trx"."excel_template_header" ADD COLUMN     "header_index" TEXT NOT NULL;
