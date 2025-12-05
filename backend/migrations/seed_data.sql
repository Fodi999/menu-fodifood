-- Seed data for restaurant database
-- Run this after migrations to populate initial data

-- Clear existing data (for testing)
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE restaurant_info CASCADE;

-- Insert Restaurant Info
INSERT INTO restaurant_info (
    id, name, name_ru, name_pl,
    description, description_ru, description_pl,
    phone, email, address, city, postal_code,
    delivery_radius, minimum_order, delivery_fee, free_delivery_from, average_delivery_time
) VALUES (
    1,
    'FodiFood Restaurant',
    'Ресторан FodiFood',
    'Restauracja FodiFood',
    'Best Asian cuisine in town with fast delivery',
    'Лучшая азиатская кухня в городе с быстрой доставкой',
    'Najlepsza kuchnia azjatycka w mieście z szybką dostawą',
    '+48 123 456 789',
    'info@fodifood.pl',
    'ul. Przykładowa 123',
    'Warszawa',
    '00-001',
    10, -- 10km radius
    30.00,
    5.00,
    100.00,
    30 -- 30 minutes
);

-- Insert Categories
INSERT INTO categories (id, name, name_ru, name_pl, slug, description, "order", is_active) VALUES
(1, 'Sushi', 'Суши', 'Sushi', 'sushi', 'Fresh sushi and rolls', 1, true),
(2, 'Ramen', 'Рамен', 'Ramen', 'ramen', 'Traditional Japanese noodle soup', 2, true),
(3, 'Appetizers', 'Закуски', 'Przystawki', 'appetizers', 'Delicious starters', 3, true),
(4, 'Desserts', 'Десерты', 'Desery', 'desserts', 'Sweet treats', 4, true),
(5, 'Drinks', 'Напитки', 'Napoje', 'drinks', 'Refreshing beverages', 5, true);

-- Reset category sequence
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Insert Menu Items

-- Sushi Category
INSERT INTO menu_items (
    category_id, name, name_ru, name_pl,
    description, description_ru, description_pl,
    price, image, is_popular, is_new, weight
) VALUES
(1, 'California Roll', 'Калифорния', 'California Roll',
 'Fresh avocado, crab stick, cucumber', 'Свежий авокадо, крабовая палочка, огурец', 'Świeże awokado, pałeczki krabowe, ogórek',
 45.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/sushi-california.jpg', true, false, '8 шт'),

(1, 'Philadelphia Roll', 'Филадельфия', 'Philadelphia Roll',
 'Salmon, cream cheese, cucumber', 'Лосось, сливочный сыр, огурец', 'Łosoś, serek śmietankowy, ogórek',
 55.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/sushi-philadelphia.jpg', true, false, '8 шт'),

(1, 'Spicy Tuna Roll', 'Острый тунец', 'Pikantny tuńczyk',
 'Tuna, spicy mayo, cucumber', 'Тунец, острый майонез, огурец', 'Tuńczyk, pikantny majonez, ogórek',
 50.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/sushi-spicy-tuna.jpg', false, true, '8 шт'),

(1, 'Dragon Roll', 'Дракон', 'Dragon Roll',
 'Eel, avocado, cucumber, special sauce', 'Угорь, авокадо, огурец, специальный соус', 'Węgorz, awokado, ogórek, specjalny sos',
 65.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/sushi-dragon.jpg', true, false, '8 шт');

-- Ramen Category
INSERT INTO menu_items (
    category_id, name, name_ru, name_pl,
    description, description_ru, description_pl,
    price, image, cooking_time, calories
) VALUES
(2, 'Tonkotsu Ramen', 'Тонкоцу рамен', 'Tonkotsu Ramen',
 'Rich pork bone broth, chashu pork, egg', 'Насыщенный свиной бульон, свинина чашу, яйцо', 'Bogaty bulion wieprzowy, wieprzowina chashu, jajko',
 42.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/ramen-tonkotsu.jpg', 15, 650),

(2, 'Miso Ramen', 'Мисо рамен', 'Miso Ramen',
 'Miso broth, vegetables, soft-boiled egg', 'Бульон мисо, овощи, яйцо всмятку', 'Bulion miso, warzywa, jajko na miękko',
 38.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/ramen-miso.jpg', 12, 550),

(2, 'Spicy Chicken Ramen', 'Острый куриный рамен', 'Pikantny ramen z kurczakiem',
 'Spicy chicken broth, chicken, vegetables', 'Острый куриный бульон, курица, овощи', 'Pikantny bulion z kurczaka, kurczak, warzywa',
 40.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/ramen-spicy-chicken.jpg', 13, 600);

-- Appetizers Category
INSERT INTO menu_items (
    category_id, name, name_ru, name_pl,
    description, description_ru, description_pl,
    price, image, is_vegetarian
) VALUES
(3, 'Edamame', 'Эдамаме', 'Edamame',
 'Steamed soybeans with sea salt', 'Вареные соевые бобы с морской солью', 'Gotowane soja z solą morską',
 15.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/edamame.jpg', true),

(3, 'Gyoza', 'Гёдза', 'Gyoza',
 'Pan-fried dumplings with pork and vegetables', 'Жареные пельмени со свининой и овощами', 'Smażone pierogi z wieprzowiną i warzywami',
 25.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/gyoza.jpg', false),

(3, 'Spring Rolls', 'Спринг роллы', 'Spring Rolls',
 'Crispy vegetable spring rolls', 'Хрустящие овощные роллы', 'Chrupiące wiosenne rolki warzywne',
 18.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/spring-rolls.jpg', true);

-- Desserts Category
INSERT INTO menu_items (
    category_id, name, name_ru, name_pl,
    description, description_ru, description_pl,
    price, image
) VALUES
(4, 'Mochi Ice Cream', 'Моти с мороженым', 'Mochi z lodami',
 'Traditional Japanese rice cake with ice cream', 'Традиционный японский рисовый пирог с мороженым', 'Tradycyjne japońskie ciasto ryżowe z lodami',
 12.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/mochi.jpg'),

(4, 'Matcha Cheesecake', 'Чизкейк матча', 'Sernik matcha',
 'Green tea cheesecake', 'Чизкейк с зеленым чаем', 'Sernik z zieloną herbatą',
 16.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/matcha-cheesecake.jpg');

-- Drinks Category
INSERT INTO menu_items (
    category_id, name, name_ru, name_pl,
    description, description_ru, description_pl,
    price, image
) VALUES
(5, 'Green Tea', 'Зеленый чай', 'Zielona herbata',
 'Traditional Japanese green tea', 'Традиционный японский зеленый чай', 'Tradycyjna japońska zielona herbata',
 8.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/green-tea.jpg'),

(5, 'Ramune Soda', 'Газировка рамунэ', 'Ramune Soda',
 'Japanese marble soda, various flavors', 'Японская газировка с мраморным шариком, разные вкусы', 'Japońska gazowana napój z kulką, różne smaki',
 10.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/ramune.jpg'),

(5, 'Sake (Hot)', 'Сакэ (горячее)', 'Sake (gorące)',
 'Traditional Japanese rice wine, served hot', 'Традиционное японское рисовое вино, подается горячим', 'Tradycyjne japońskie wino ryżowe, podawane na gorąco',
 22.00, 'https://res.cloudinary.com/demo/image/upload/v1/food/sake.jpg');

-- Reset menu items sequence
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));

-- Show summary
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Menu Items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Restaurant Info', COUNT(*) FROM restaurant_info;

SELECT 'Seed data inserted successfully!' as status;
