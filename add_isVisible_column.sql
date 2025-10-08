-- Добавление колонки isVisible в таблицу Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "isVisible" BOOLEAN DEFAULT false;

-- Обновление существующих продуктов (по умолчанию скрыты)
UPDATE "Product" SET "isVisible" = false WHERE "isVisible" IS NULL;
