
// 📌 اتصال به Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();  // برای بارگذاری متغیرهای محیطی از فایل .env

// تنظیمات Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// ایجاد و صادر کردن کلاینت Supabase
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL یا SUPABASE_KEY تنظیم نشده!');
  process.exit(1);  // اگر تنظیمات در .env نبود، برنامه متوقف می‌شود
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };  // صادر کردن Supabase برای استفاده در دیگر فایل‌ها
