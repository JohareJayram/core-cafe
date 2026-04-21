-- ══════════════════════════════════════════
-- CORE CAFE — Supabase SQL Schema
-- Copy and run this in your Supabase SQL Editor
-- ══════════════════════════════════════════

-- 1. Create tables
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort INTEGER NOT NULL
);

CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  available BOOLEAN DEFAULT true,
  image TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  target_audience TEXT
);

CREATE TABLE tables (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  floor INTEGER NOT NULL,
  seats INTEGER NOT NULL,
  qr_url TEXT NOT NULL
);

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' NOT NULL, -- 'customer', 'staff', 'manager'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  table_number INTEGER NOT NULL,
  floor INTEGER NOT NULL,
  status TEXT DEFAULT 'placed' NOT NULL, -- 'placed', 'confirmed', 'preparing', 'served', 'cancelled'
  total INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'UPI' NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'paid', 'failed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES menu_items(id),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

-- Real-time Publication setup
-- This enables real-time listeners for Next.js to auto-update
begin;
  -- remove the supabase_realtime publication
  drop publication if exists supabase_realtime;
  -- re-create the supabase_realtime publication with no tables
  create publication supabase_realtime;
commit;
-- add tables to the publication
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;


-- 2. Insert Base Categories
INSERT INTO categories (id, name, icon, sort) VALUES
('coffee', 'Coffee', '☕', 1),
('cold', 'Cold Drinks', '🧊', 2),
('snacks', 'Snacks', '🥐', 3),
('bakery', 'Bakery', '🧁', 4),
('specials', 'Specials', '⭐', 5);

-- 3. Insert Base Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, available, image, tags) VALUES
('c1', 'coffee', 'Signature Espresso', 'Rich, intense double shot pulled from our house-blend beans. The soul of CORE.', 180, true, '/images/menu/espresso.jpg', ARRAY['bestseller']),
('c2', 'coffee', 'Flat White', 'Velvety micro-foam steamed milk over a ristretto shot. Smooth and balanced.', 220, true, '/images/menu/flatwhite.jpg', ARRAY[]::TEXT[]),
('c3', 'coffee', 'Cold Brew', '18-hour slow-steeped cold brew. Bold, low-acid, served over large ice.', 260, true, '/images/menu/coldbrew.jpg', ARRAY['bestseller', 'new']),
('c4', 'coffee', 'Caramel Macchiato', 'Vanilla-scented milk, espresso, and housemade caramel drizzle.', 280, true, '/images/menu/macchiato.jpg', ARRAY[]::TEXT[]),
('c5', 'coffee', 'Matcha Latte', 'Ceremonial-grade Japanese matcha whisked with oat milk. Earthy and soothing.', 290, true, '/images/menu/matcha.jpg', ARRAY['veg', 'new']),
('c6', 'coffee', 'Cappuccino', 'Equal parts espresso, steamed milk, and dense microfoam. A classic done right.', 200, true, '/images/menu/cappuccino.jpg', ARRAY['veg']),

('d1', 'cold', 'Iced Americano', 'Double espresso poured over ice with chilled water. Clean, crisp, powerful.', 200, true, '/images/menu/iced_americano.jpg', ARRAY[]::TEXT[]),
('d2', 'cold', 'Mango Cold Fusion', 'Alphonso mango purée, sparkling water, and a hint of mint. Pure Pune summer.', 240, true, '/images/menu/mango_fusion.jpg', ARRAY['veg', 'bestseller']),
('d3', 'cold', 'Strawberry Lemonade', 'Fresh-squeezed lemon, strawberry coulis, topped with sparkling water.', 220, true, '/images/menu/strawberry_lemonade.jpg', ARRAY['veg']),
('d4', 'cold', 'Sparkling Water', 'Premium chilled sparkling mineral water. Still option also available.', 80, true, '/images/menu/sparkling.jpg', ARRAY['veg']),

('s1', 'snacks', 'Avocado Toast', 'Smashed avocado on sourdough with chilli flakes, feta, and cherry tomatoes.', 320, true, '/images/menu/avocado_toast.jpg', ARRAY['veg']),
('s2', 'snacks', 'Chicken Croissant', 'Flaky butter croissant stuffed with grilled chicken, lettuce, dijon mustard.', 290, true, '/images/menu/chicken_croissant.jpg', ARRAY['bestseller']),
('s3', 'snacks', 'Cheese Quesadilla', 'Golden-pressed flour tortilla with three-cheese blend and jalapeño.', 280, true, '/images/menu/quesadilla.jpg', ARRAY['veg']),
('s4', 'snacks', 'Brownie', 'Dense fudge chocolate brownie with a warm gooey centre. Served with cream.', 160, true, '/images/menu/brownie.jpg', ARRAY['veg', 'bestseller']),

('b1', 'bakery', 'Butter Croissant', 'Classic French-style croissant baked in-house daily. Crisp, buttery, perfect.', 140, true, '/images/menu/croissant.jpg', ARRAY['veg']),
('b2', 'bakery', 'Blueberry Muffin', 'Topped with a golden sugar crust, packed with wild blueberries.', 160, true, '/images/menu/blueberry_muffin.jpg', ARRAY['veg', 'bestseller']),
('b3', 'bakery', 'Banana Bread', 'Moist loaf with dark chocolate chips and a honey walnut glaze.', 150, true, '/images/menu/banana_bread.jpg', ARRAY['veg']),

('sp1', 'specials', 'CORE Combo', 'Signature Espresso + Butter Croissant + Brownie. The full CORE experience.', 420, true, '/images/menu/combo.jpg', ARRAY['bestseller', 'new']),
('sp2', 'specials', 'Weekend Brunch Box', 'Avocado Toast, Cold Brew, Blueberry Muffin — available Sat & Sun 9am–12pm.', 580, true, '/images/menu/brunch_box.jpg', ARRAY['veg', 'new']);

-- 4. Insert Fake Tables
INSERT INTO tables (id, number, floor, seats, qr_url)
SELECT 
  't' || a.n as id, 
  a.n as number, 
  1 as floor, 
  CASE WHEN a.n % 3 = 0 THEN 4 ELSE 2 END as seats, 
  '/menu?table=' || a.n || '&floor=1' as qr_url
FROM generate_series(1, 10) AS a(n);

INSERT INTO tables (id, number, floor, seats, qr_url)
SELECT 
  't' || a.n as id, 
  a.n as number, 
  2 as floor, 
  4 as seats, 
  '/menu?table=' || a.n || '&floor=2' as qr_url
FROM generate_series(11, 16) AS a(n);
