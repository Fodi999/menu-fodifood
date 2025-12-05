-- Create restaurant tables for online ordering system

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    name_pl VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    name_pl VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_pl TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    image TEXT NOT NULL,
    images TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_vegetarian BOOLEAN DEFAULT false,
    is_spicy BOOLEAN DEFAULT false,
    allergens TEXT[],
    weight VARCHAR(50),
    calories INTEGER,
    cooking_time INTEGER, -- in minutes
    ingredients TEXT[],
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    delivery_street VARCHAR(255) NOT NULL,
    delivery_building VARCHAR(50) NOT NULL,
    delivery_apartment VARCHAR(50),
    delivery_floor VARCHAR(50),
    delivery_entrance VARCHAR(50),
    delivery_intercom VARCHAR(50),
    delivery_city VARCHAR(100) NOT NULL,
    delivery_postal_code VARCHAR(20) NOT NULL,
    delivery_country VARCHAR(100) NOT NULL DEFAULT 'Poland',
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- cash, card, online, blik
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, preparing, ready, delivering, delivered, cancelled
    special_instructions TEXT,
    delivery_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    menu_item_name VARCHAR(255) NOT NULL, -- Snapshot in case item is deleted
    menu_item_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    special_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Restaurant info table (single row config)
CREATE TABLE IF NOT EXISTS restaurant_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    name_pl VARCHAR(255) NOT NULL,
    description TEXT,
    description_ru TEXT,
    description_pl TEXT,
    logo TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(500),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    opening_hours JSONB, -- {"monday": {"open": "10:00", "close": "22:00"}, ...}
    delivery_radius INTEGER DEFAULT 10, -- km
    minimum_order DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    free_delivery_from DECIMAL(10, 2) DEFAULT 0,
    average_delivery_time INTEGER DEFAULT 30, -- minutes
    social_media JSONB, -- {"facebook": "...", "instagram": "..."}
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_popular ON menu_items(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_info_updated_at BEFORE UPDATE ON restaurant_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, name_ru, name_pl, slug, description, "order") VALUES
('Sushi', 'Суши', 'Sushi', 'sushi', 'Traditional Japanese sushi rolls', 1),
('Rolls', 'Роллы', 'Rolki', 'rolls', 'Delicious sushi rolls', 2),
('Soups', 'Супы', 'Zupy', 'soups', 'Hot soups', 3),
('Salads', 'Салаты', 'Sałatki', 'salads', 'Fresh salads', 4),
('Drinks', 'Напитки', 'Napoje', 'drinks', 'Beverages', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (
    category_id, name, name_ru, name_pl, description, description_ru, description_pl,
    price, image, is_available, is_popular, weight
) VALUES
(2, 'California Roll', 'Калифорния', 'California', 
 'Crab, avocado, cucumber', 'Краб, авокадо, огурец', 'Krab, awokado, ogórek',
 28.00, '/products/california.jpg', true, true, '8 pcs'),
(2, 'Philadelphia Roll', 'Филадельфия', 'Philadelphia',
 'Salmon, cream cheese, cucumber', 'Лосось, сливочный сыр, огурец', 'Łosoś, ser śmietankowy, ogórek',
 32.00, '/products/philadelphia.jpg', true, true, '8 pcs'),
(2, 'Mix Set', 'Микс сет', 'Zestaw Mix',
 'Assorted sushi and rolls', 'Ассорти суши и роллов', 'Asortyment sushi i rolek',
 85.00, '/products/mix-set.jpg', true, true, '24 pcs'),
(1, 'Nigiri Salmon', 'Нигири с лососем', 'Nigiri z łososiem',
 'Fresh salmon on rice', 'Свежий лосось на рисе', 'Świeży łosoś na ryżu',
 12.00, '/products/nigiri-salmon.jpg', true, false, '2 pcs')
ON CONFLICT DO NOTHING;

-- Insert restaurant info
INSERT INTO restaurant_info (
    id, name, name_ru, name_pl, 
    description, description_ru, description_pl,
    phone, email, address, city, postal_code,
    delivery_radius, minimum_order, delivery_fee, free_delivery_from, average_delivery_time
) VALUES (
    1, 
    'FodiFood', 'FodiFood', 'FodiFood',
    'Authentic Japanese cuisine', 'Аутентичная японская кухня', 'Autentyczna kuchnia japońska',
    '+48 123 456 789', 'orders@fodifood.pl', 'ul. Przykładowa 123', 'Warsaw', '00-001',
    10, 30.00, 10.00, 100.00, 45
) ON CONFLICT (id) DO NOTHING;
