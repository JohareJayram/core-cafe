// ══════════════════════════════════════════
//  CORE CAFE — Mock Data (No DB Required)
//  Replace with Supabase calls when ready
// ══════════════════════════════════════════

export const CATEGORIES = [
  { id: 'coffee',      name: 'Coffee',       icon: '☕', sort: 1 },
  { id: 'cold',        name: 'Cold Drinks',  icon: '🧊', sort: 2 },
  { id: 'snacks',      name: 'Snacks',       icon: '🥐', sort: 3 },
  { id: 'bakery',      name: 'Bakery',       icon: '🧁', sort: 4 },
  { id: 'specials',    name: 'Specials',     icon: '⭐', sort: 5 },
];

export const MENU_ITEMS = [
  // ── Coffee ──
  {
    id: 'c1', category: 'coffee',
    name: 'Signature Espresso',
    description: 'Rich, intense double shot pulled from our house-blend beans. The soul of CORE.',
    price: 180, tags: ['bestseller'], available: true,
    image: '/images/menu/espresso.jpg',
  },
  {
    id: 'c2', category: 'coffee',
    name: 'Flat White',
    description: 'Velvety micro-foam steamed milk over a ristretto shot. Smooth and balanced.',
    price: 220, tags: [], available: true,
    image: '/images/menu/flatwhite.jpg',
  },
  {
    id: 'c3', category: 'coffee',
    name: 'Cold Brew',
    description: '18-hour slow-steeped cold brew. Bold, low-acid, served over large ice.',
    price: 260, tags: ['bestseller', 'new'], available: true,
    image: '/images/menu/coldbrew.jpg',
  },
  {
    id: 'c4', category: 'coffee',
    name: 'Caramel Macchiato',
    description: 'Vanilla-scented milk, espresso, and housemade caramel drizzle.',
    price: 280, tags: [], available: true,
    image: '/images/menu/macchiato.jpg',
  },
  {
    id: 'c5', category: 'coffee',
    name: 'Matcha Latte',
    description: 'Ceremonial-grade Japanese matcha whisked with oat milk. Earthy and soothing.',
    price: 290, tags: ['veg', 'new'], available: true,
    image: '/images/menu/matcha.jpg',
  },
  {
    id: 'c6', category: 'coffee',
    name: 'Cappuccino',
    description: 'Equal parts espresso, steamed milk, and dense microfoam. A classic done right.',
    price: 200, tags: ['veg'], available: true,
    image: '/images/menu/cappuccino.jpg',
  },

  // ── Cold Drinks ──
  {
    id: 'd1', category: 'cold',
    name: 'Iced Americano',
    description: 'Double espresso poured over ice with chilled water. Clean, crisp, powerful.',
    price: 200, tags: [], available: true,
    image: '/images/menu/iced_americano.jpg',
  },
  {
    id: 'd2', category: 'cold',
    name: 'Mango Cold Fusion',
    description: 'Alphonso mango purée, sparkling water, and a hint of mint. Pure Pune summer.',
    price: 240, tags: ['veg', 'bestseller'], available: true,
    image: '/images/menu/mango_fusion.jpg',
  },
  {
    id: 'd3', category: 'cold',
    name: 'Strawberry Lemonade',
    description: 'Fresh-squeezed lemon, strawberry coulis, topped with sparkling water.',
    price: 220, tags: ['veg'], available: true,
    image: '/images/menu/strawberry_lemonade.jpg',
  },
  {
    id: 'd4', category: 'cold',
    name: 'Sparkling Water',
    description: 'Premium chilled sparkling mineral water. Still option also available.',
    price: 80, tags: ['veg'], available: true,
    image: '/images/menu/sparkling.jpg',
  },

  // ── Snacks ──
  {
    id: 's1', category: 'snacks',
    name: 'Avocado Toast',
    description: 'Smashed avocado on sourdough with chilli flakes, feta, and cherry tomatoes.',
    price: 320, tags: ['veg'], available: true,
    image: '/images/menu/avocado_toast.jpg',
  },
  {
    id: 's2', category: 'snacks',
    name: 'Chicken Croissant',
    description: 'Flaky butter croissant stuffed with grilled chicken, lettuce, dijon mustard.',
    price: 290, tags: ['bestseller'], available: true,
    image: '/images/menu/chicken_croissant.jpg',
  },
  {
    id: 's3', category: 'snacks',
    name: 'Cheese Quesadilla',
    description: 'Golden-pressed flour tortilla with three-cheese blend and jalapeño.',
    price: 280, tags: ['veg'], available: true,
    image: '/images/menu/quesadilla.jpg',
  },
  {
    id: 's4', category: 'snacks',
    name: 'Brownie',
    description: 'Dense fudge chocolate brownie with a warm gooey centre. Served with cream.',
    price: 160, tags: ['veg', 'bestseller'], available: true,
    image: '/images/menu/brownie.jpg',
  },

  // ── Bakery ──
  {
    id: 'b1', category: 'bakery',
    name: 'Butter Croissant',
    description: 'Classic French-style croissant baked in-house daily. Crisp, buttery, perfect.',
    price: 140, tags: ['veg'], available: true,
    image: '/images/menu/croissant.jpg',
  },
  {
    id: 'b2', category: 'bakery',
    name: 'Blueberry Muffin',
    description: 'Topped with a golden sugar crust, packed with wild blueberries.',
    price: 160, tags: ['veg', 'bestseller'], available: true,
    image: '/images/menu/blueberry_muffin.jpg',
  },
  {
    id: 'b3', category: 'bakery',
    name: 'Banana Bread',
    description: 'Moist loaf with dark chocolate chips and a honey walnut glaze.',
    price: 150, tags: ['veg'], available: true,
    image: '/images/menu/banana_bread.jpg',
  },

  // ── Specials ──
  {
    id: 'sp1', category: 'specials',
    name: 'CORE Combo',
    description: 'Signature Espresso + Butter Croissant + Brownie. The full CORE experience.',
    price: 420, tags: ['bestseller', 'new'], available: true,
    image: '/images/menu/combo.jpg',
  },
  {
    id: 'sp2', category: 'specials',
    name: 'Weekend Brunch Box',
    description: 'Avocado Toast, Cold Brew, Blueberry Muffin — available Sat & Sun 9am–12pm.',
    price: 580, tags: ['veg', 'new'], available: true,
    image: '/images/menu/brunch_box.jpg',
  },
];

export const TABLES = [
  // Floor 1: Tables 1–10
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `t${i + 1}`,
    number: i + 1,
    floor: 1,
    seats: i % 3 === 0 ? 4 : 2,
    qrUrl: `/menu?table=${i + 1}&floor=1`,
  })),
  // Floor 2: Tables 11–16
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `t${i + 11}`,
    number: i + 11,
    floor: 2,
    seats: 4,
    qrUrl: `/menu?table=${i + 11}&floor=2`,
  })),
];

export const FEATURED_ITEMS = [
  'c1', 'c3', 'd2', 's2', 's4', 'b2'
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Mehta',
    role: 'Regular Customer',
    text: "Honestly the best café experience I've had in Pune. Scanned the QR, ordered my Cold Brew in 30 seconds. By the time I set my laptop down, it was at my table. Magic.",
    rating: 5,
    initials: 'PM',
  },
  {
    id: 2,
    name: 'Aditya Kulkarni',
    role: 'Tech Professional',
    text: "I work out of CORE three days a week. The no-waiter system is genius for getting work done. No interruptions, no waiting. Just great coffee and focus.",
    rating: 5,
    initials: 'AK',
  },
  {
    id: 3,
    name: 'Shreya Joshi',
    role: 'Food Blogger',
    text: "The Avocado Toast with the Matcha Latte is an absolute WIN. The digital menu has amazing photos and descriptions — I knew exactly what I was ordering.",
    rating: 5,
    initials: 'SJ',
  },
];

export const CAFE_INFO = {
  name: 'CORE Cafe',
  tagline: 'Order Your Way. No Waiting.',
  address: 'Hinjwadi Phase 3, Pune, Maharashtra 411057, India',
  phone: '+91 98765 43210',
  email: 'hello@corecafe.in',
  hours: {
    weekdays: '8:00 AM – 10:00 PM',
    weekends: '8:00 AM – 11:00 PM',
  },
  social: {
    instagram: 'https://instagram.com/corecafepune',
    twitter:   'https://twitter.com/corecafepune',
  },
};

// ── Order Status Config ──
export const ORDER_STATUSES = {
  placed:     { label: 'Order Placed',   color: '#A09880', step: 0 },
  confirmed:  { label: 'Confirmed',      color: '#5599EE', step: 1 },
  preparing:  { label: 'Preparing',      color: '#F0A500', step: 2 },
  served:     { label: 'Ready to Serve', color: '#4CAF7D', step: 3 },
  cancelled:  { label: 'Cancelled',      color: '#E05555', step: -1 },
};

// ── Mock Staff Accounts (for demo) ──
export const DEMO_ACCOUNTS = {
  manager: { email: 'manager@corecafe.in', password: 'core2024', role: 'manager', name: 'Ravi Sharma' },
  staff:   { email: 'staff@corecafe.in',   password: 'staff123',  role: 'staff',   name: 'Priya Staff' },
};
