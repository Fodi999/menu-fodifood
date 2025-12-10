-- Add hero and featured dish fields to restaurant_info table
ALTER TABLE restaurant_info 
ADD COLUMN IF NOT EXISTS hero_image TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_image TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_title TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_description TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_price TEXT;

-- Update existing data with defaults
UPDATE restaurant_info 
SET 
  hero_image = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=1200&fit=crop',
  hero_title = 'Świeże sushi',
  hero_subtitle = 'z dostawą',
  hero_description = 'Autentyczna kuchnia japońska od profesjonalnego szefa kuchni. Tylko świeże składniki i tradycyjne przepisy.',
  featured_dish_image = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=1200&fit=crop',
  featured_dish_title = 'Popularny zestaw',
  featured_dish_description = '24 szt. • California, Philadelphia',
  featured_dish_price = '85 zł'
WHERE hero_image IS NULL;
