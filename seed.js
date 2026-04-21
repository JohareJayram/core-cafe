const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oyvjdelvaczjzuoezxpy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dmpkZWx2YWN6anp1b2V6eHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzY2NjAsImV4cCI6MjA5MjI1MjY2MH0.eu9QD5QOLpizbf-i_tCR1cOdB9hnexR6mFmQYiwOeDE';

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
  { id: 'coffee',      name: 'Coffee',       icon: '☕', sort: 1 },
  { id: 'cold',        name: 'Cold Drinks',  icon: '🧊', sort: 2 },
  { id: 'snacks',      name: 'Snacks',       icon: '🥐', sort: 3 },
  { id: 'bakery',      name: 'Bakery',       icon: '🧁', sort: 4 },
  { id: 'specials',    name: 'Specials',     icon: '⭐', sort: 5 },
];

const MENU_ITEMS = [
  { id: 'c1', category_id: 'coffee', name: 'Signature Espresso', description: 'Rich, intense double shot pulled from our house-blend beans. The soul of CORE.', price: 180, tags: ['bestseller'], available: true, image: '/images/menu/espresso.jpg' },
  { id: 'c2', category_id: 'coffee', name: 'Flat White', description: 'Velvety micro-foam steamed milk over a ristretto shot. Smooth and balanced.', price: 220, tags: [], available: true, image: '/images/menu/flatwhite.jpg' },
  { id: 'c3', category_id: 'coffee', name: 'Cold Brew', description: '18-hour slow-steeped cold brew. Bold, low-acid, served over large ice.', price: 260, tags: ['bestseller', 'new'], available: true, image: '/images/menu/coldbrew.jpg' },
  { id: 'c4', category_id: 'coffee', name: 'Caramel Macchiato', description: 'Vanilla-scented milk, espresso, and housemade caramel drizzle.', price: 280, tags: [], available: true, image: '/images/menu/macchiato.jpg' },
  { id: 'c5', category_id: 'coffee', name: 'Matcha Latte', description: 'Ceremonial-grade Japanese matcha whisked with oat milk. Earthy and soothing.', price: 290, tags: ['veg', 'new'], available: true, image: '/images/menu/matcha.jpg' },
  { id: 'c6', category_id: 'coffee', name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and dense microfoam. A classic done right.', price: 200, tags: ['veg'], available: true, image: '/images/menu/cappuccino.jpg' },
  { id: 'd1', category_id: 'cold', name: 'Iced Americano', description: 'Double espresso poured over ice with chilled water. Clean, crisp, powerful.', price: 200, tags: [], available: true, image: '/images/menu/iced_americano.jpg' },
  { id: 'd2', category_id: 'cold', name: 'Mango Cold Fusion', description: 'Alphonso mango purée, sparkling water, and a hint of mint. Pure Pune summer.', price: 240, tags: ['veg', 'bestseller'], available: true, image: '/images/menu/mango_fusion.jpg' },
  { id: 'd3', category_id: 'cold', name: 'Strawberry Lemonade', description: 'Fresh-squeezed lemon, strawberry coulis, topped with sparkling water.', price: 220, tags: ['veg'], available: true, image: '/images/menu/strawberry_lemonade.jpg' },
  { id: 'd4', category_id: 'cold', name: 'Sparkling Water', description: 'Premium chilled sparkling mineral water. Still option also available.', price: 80, tags: ['veg'], available: true, image: '/images/menu/sparkling.jpg' },
  { id: 's1', category_id: 'snacks', name: 'Avocado Toast', description: 'Smashed avocado on sourdough with chilli flakes, feta, and cherry tomatoes.', price: 320, tags: ['veg'], available: true, image: '/images/menu/avocado_toast.jpg' },
  { id: 's2', category_id: 'snacks', name: 'Chicken Croissant', description: 'Flaky butter croissant stuffed with grilled chicken, lettuce, dijon mustard.', price: 290, tags: ['bestseller'], available: true, image: '/images/menu/chicken_croissant.jpg' },
  { id: 's3', category_id: 'snacks', name: 'Cheese Quesadilla', description: 'Golden-pressed flour tortilla with three-cheese blend and jalapeño.', price: 280, tags: ['veg'], available: true, image: '/images/menu/quesadilla.jpg' },
  { id: 's4', category_id: 'snacks', name: 'Brownie', description: 'Dense fudge chocolate brownie with a warm gooey centre. Served with cream.', price: 160, tags: ['veg', 'bestseller'], available: true, image: '/images/menu/brownie.jpg' },
  { id: 'b1', category_id: 'bakery', name: 'Butter Croissant', description: 'Classic French-style croissant baked in-house daily. Crisp, buttery, perfect.', price: 140, tags: ['veg'], available: true, image: '/images/menu/croissant.jpg' },
  { id: 'b2', category_id: 'bakery', name: 'Blueberry Muffin', description: 'Topped with a golden sugar crust, packed with wild blueberries.', price: 160, tags: ['veg', 'bestseller'], available: true, image: '/images/menu/blueberry_muffin.jpg' },
  { id: 'b3', category_id: 'bakery', name: 'Banana Bread', description: 'Moist loaf with dark chocolate chips and a honey walnut glaze.', price: 150, tags: ['veg'], available: true, image: '/images/menu/banana_bread.jpg' },
  { id: 'sp1', category_id: 'specials', name: 'CORE Combo', description: 'Signature Espresso + Butter Croissant + Brownie. The full CORE experience.', price: 420, tags: ['bestseller', 'new'], available: true, image: '/images/menu/combo.jpg' },
  { id: 'sp2', category_id: 'specials', name: 'Weekend Brunch Box', description: 'Avocado Toast, Cold Brew, Blueberry Muffin — available Sat & Sun 9am–12pm.', price: 580, tags: ['veg', 'new'], available: true, image: '/images/menu/brunch_box.jpg' },
];

const TABLES = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `t${i + 1}`, number: i + 1, floor: 1, seats: i % 3 === 0 ? 4 : 2, qr_url: `/menu?table=${i + 1}&floor=1`,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `t${i + 11}`, number: i + 11, floor: 2, seats: 4, qr_url: `/menu?table=${i + 11}&floor=2`,
  })),
];

async function seed() {
  console.log('Starting DB seed...');
  try {
    for (const cat of CATEGORIES) {
      const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'id' });
      if (error) console.error('Error inserting category', cat.id, error.message);
    }
    console.log('Categories seeded.');

    for (const item of MENU_ITEMS) {
      const { error } = await supabase.from('menu_items').upsert(item, { onConflict: 'id' });
      if (error) console.error('Error inserting menu item', item.id, error.message);
    }
    console.log('Menu items seeded.');

    for (const table of TABLES) {
      const { error } = await supabase.from('tables').upsert(table, { onConflict: 'id' });
      if (error) console.error('Error inserting table', table.id, error.message);
    }
    console.log('Tables seeded.');

    console.log('Finished seeding.');
  } catch (err) {
    console.error('Seed failed:', err);
  }
}

seed();
