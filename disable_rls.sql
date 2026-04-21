-- Run this script in your Supabase SQL Editor to disable RLS
-- This is necessary for your client presentation to ensure 
-- the customer flows and admin dashboard can read/write data flawlessly 
-- without needing complex authentication policies for now.

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
