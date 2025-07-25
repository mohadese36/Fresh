

// // 📌 ایمپورت‌ها
// const express = require('express');
// const { login } = require('./auth');  
// const cors = require('cors');
// const { supabase } = require('./supabaseClient');
// require('dotenv').config();

// const app = express();

// // ✅ حل مشکل CORS و خواندن JSON
// app.use(cors());
// app.use(express.json());

// // ✅ استفاده از مسیر login
// app.use('/login', login); 



// // ✅ تست ارتباط با Supabase
// (async () => {
//     const { data, error } = await supabase.from('users').select('*').limit(1);
//     if (error) {
//         console.error('❌ خطا در ارتباط با Supabase:', error);
//     } else {
//         console.log('✅ ارتباط با Supabase برقرار شد:', data);
//     }
// })();

// // ✅ API برای ثبت نام
// app.post('/register', async (req, res) => {
//     console.log('✅ درخواست به سرور رسید!');
//     const { name, username, email, phone, password } = req.body;

//     const { data, error } = await supabase
//         .from('users')
//         .insert([{ name, username, email, phone, password }]);

//     if (error) {
//         return res.status(500).json({ message: '❌ خطا در ثبت کاربر', error });
//     }

//     res.status(201).json({ message: '✅ کاربر با موفقیت ثبت شد', data });
// });

// // ✅ راه‌اندازی سرور
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 سرور در حال اجرا روی پورت ${PORT}`);
// });

// module.exports = { app };

////////////////////

// این درسته

// // 📌 ایمپورت‌ها
// const express = require('express');
// const { login } = require('./auth');  
// const cors = require('cors');
// const { supabase } = require('./supabaseClient');
// require('dotenv').config();

// const app = express();

// // ✅ حل مشکل CORS و خواندن JSON
// // app.use(cors());

// app.use(cors({
//     origin: 'http://127.0.0.1:5500', // این آدرس فرانتت هست
//     credentials: true,
//   }));
// app.use(express.json());

// // ✅ استفاده از مسیر login
// app.use('/auth', login);
// // 📂 دسترسی به پوشه uploads برای نمایش عکس‌ها



// // ✅ حل مشکل CORS برای لاگین

  

// // ✅ تست ارتباط با Supabase
// (async () => {
//     const { data, error } = await supabase.from('users').select('*').limit(1);
//     if (error) {
//         console.error('❌ خطا در ارتباط با Supabase:', error);
//     } else {
//         console.log('✅ ارتباط با Supabase برقرار شد:', data);
//     }
// })();

// // ✅ API برای ثبت نام
// app.post('/register', async (req, res) => {
//     console.log('✅ درخواست به سرور رسید!');
//     const { name, username, email, phone, password } = req.body;

//     const { data, error } = await supabase
//         .from('users')
//         .insert([{ name, username, email, phone, password }]);

//     if (error) {
//         return res.status(500).json({ message: '❌ خطا در ثبت کاربر', error });
//     }

//     res.status(201).json({ message: '✅ کاربر با موفقیت ثبت شد', data });
// });

// // ✅ راه‌اندازی سرور
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 سرور در حال اجرا روی پورت ${PORT}`);
// });

// module.exports = { app };

// این درسته

















//////////////////



// 📌 ایمپورت‌ها
const express = require('express');
const { login } = require('./auth');  
const cors = require('cors');
const { supabase } = require('./supabaseClient');
require('dotenv').config();

const app = express();

// ✅ حل مشکل CORS و خواندن JSON
// app.use(cors());
// app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: 'http://127.0.0.1:5500', // این آدرس فرانتت هست
    credentials: true,
  }));
app.use(express.json());

// ✅ استفاده از مسیر login
app.use('/auth', login);
// 📂 دسترسی به پوشه uploads برای نمایش عکس‌ها
// 📂 دسترسی به پوشه uploads برای نمایش عکس‌ها




// ✅ حل مشکل CORS برای لاگین

  

// ✅ تست ارتباط با Supabase
(async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
        console.error('❌ خطا در ارتباط با Supabase:', error);
    } else {
        console.log('✅ ارتباط با Supabase برقرار شد:', data);
    }
})();

// ✅ API برای ثبت نام
app.post('/register', async (req, res) => {
    console.log('✅ درخواست به سرور رسید!');
    const { name, username, email, phone, password } = req.body;

    const { data, error } = await supabase
        .from('users')
        .insert([{ name, username, email, phone, password }]);

    if (error) {
        return res.status(500).json({ message: '❌ خطا در ثبت کاربر', error });
    }

    res.status(201).json({ message: '✅ کاربر با موفقیت ثبت شد', data });
});

// ✅ راه‌اندازی سرور
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 سرور در حال اجرا روی پورت ${PORT}`);
});

module.exports = { app };