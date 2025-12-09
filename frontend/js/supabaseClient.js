
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.5/dist/umd/supabase.min.js';
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';



// // js/supabaseClient.js
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// const SUPABASE_URL = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYmd3cGJweHRtbHR6cnNiam54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzUxNzQsImV4cCI6MjA2ODI1MTE3NH0.Em8mM1z9xvVVKSi5kDfSoq-_Qof-u5JM7hDdqec6XA0';


// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// js/supabaseClient.js

// Supabase SDK is loaded globally via <script> tag
// We create a single client instance and ALSO export it for ES modules.

const SUPABASE_URL = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYmd3cGJweHRtbHR6cnNiam54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzUxNzQsImV4cCI6MjA2ODI1MTE3NH0.Em8mM1z9xvVVKSi5kDfSoq-_Qof-u5JM7hDdqec6XA0';

// Create global client (for compatibility)
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for ES imports (so your old code continues working)
export const supabase = window.supabase;

// Supabase configuration reset successfully
