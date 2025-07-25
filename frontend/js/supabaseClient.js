
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYmd3cGJweHRtbHR6cnNiam54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzUxNzQsImV4cCI6MjA2ODI1MTE3NH0.Em8mM1z9xvVVKSi5kDfSoq-_Qof-u5JM7hDdqec6XA0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
