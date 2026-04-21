require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oyvjdelvaczjzuoezxpy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dmpkZWx2YWN6anp1b2V6eHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzY2NjAsImV4cCI6MjA5MjI1MjY2MH0.eu9QD5QOLpizbf-i_tCR1cOdB9hnexR6mFmQYiwOeDE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrder() {
  console.log('Testing placeOrder...');
  const orderData = {
    guestName: 'Test',
    tableNumber: 1,
    floor: 1,
    total: 100,
    items: [
      { id: 'c1', name: 'Test', price: 100, quantity: 1 }
    ]
  };

  const { data: newOrderData, error } = await supabase.from('orders').insert({
    customer_name: orderData.guestName || 'Guest',
    customer_phone: orderData.guestPhone || null,
    table_number: orderData.tableNumber,
    floor: orderData.floor,
    status: 'placed',
    total: orderData.total || 0,
    payment_method: orderData.paymentMethod || 'UPI',
    payment_status: 'paid',
    notes: orderData.specialInstructions || null,
  }).select().single();

  if (error) {
    console.error('Order insert error:', error);
    return;
  }
  
  console.log('Inserted order:', newOrderData);

  const dbItems = orderData.items.map(i => ({
    order_id: newOrderData.id,
    item_id: i.id,
    name: i.name,
    price: i.price,
    quantity: i.quantity
  }));
  
  const { error: itemsError } = await supabase.from('order_items').insert(dbItems);
  if (itemsError) {
    console.error('Items insert error:', itemsError);
    return;
  }
  console.log('Inserted order items perfectly!');
}

testOrder();
