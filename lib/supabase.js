import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyvjdelvaczjzuoezxpy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dmpkZWx2YWN6anp1b2V6eHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzY2NjAsImV4cCI6MjA5MjI1MjY2MH0.eu9QD5QOLpizbf-i_tCR1cOdB9hnexR6mFmQYiwOeDE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
