CREATE UNIQUE INDEX IF NOT EXISTS uq_excel_templates_name_user_active
ON trx.excel_templates (name, user_id)
WHERE deleted_at IS NULL;
