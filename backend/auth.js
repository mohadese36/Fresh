// const express = require('express');
// const { supabase } = require('./supabaseClient');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const router = express.Router(); // 👈 به جای app از این استفاده می‌کنیم

// // ✅ API برای لاگین
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('username', username)
//         .eq('password', password)
//         .single();

//         console.log('درخواست لاگین:', req.body); // ببین اطلاعات داره میاد یا نه
//         console.log('✅ فایل auth.js ایمپورت شد!');

//         if (error || !data) {
//             return res.status(404).json({ message: '❌ کاربری با این مشخصات یافت نشد!' });
//         }
        
//         res.json({ message: '✅ ورود موفقیت‌آمیز بود', token });
        

//     const token = jwt.sign({ id: data.id, username: data.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ message: '✅ ورود موفقیت‌آمیز بود', token });
// });

// module.exports = { login: router }; // 👈 اینجا خروجی گرفتیم

////////////////////

const express = require('express');
const { supabase } = require('./supabaseClient');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// ✅ لاگین
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

    if (error || !data) {
        return res.status(404).json({ message: '❌ کاربری با این مشخصات یافت نشد!' });
    }

    // ✅ اینجا توکن ساخته میشه، نه بیرون از فانکشن
    const token = jwt.sign({ id: data.id, username: data.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: '✅ ورود موفقیت‌آمیز بود', token });
});

module.exports = { login: router };
////////////////////

// خروج از حساب

// ✅ حذف کاربر (لاگ‌اوت)
router.delete('/deleteUser', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: '❌ دسترسی غیرمجاز' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', decoded.id);
  
      if (error) {
        return res.status(500).json({ message: '❌ خطا در حذف کاربر', error });
      }
  
      res.json({ message: '✅ کاربر با موفقیت حذف شد' });
  
    } catch (err) {
      res.status(401).json({ message: '❌ توکن نامعتبر' });
    }
  });


//   اطلاعات کاربر 

// ✅ گرفتن اطلاعات یوزر
router.get('/user', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: '❌ دسترسی غیرمجاز' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const { data, error } = await supabase
        .from('users')
        .select('username, email')
        .eq('id', decoded.id)
        .single();
  
      if (error) {
        return res.status(500).json({ message: '❌ خطا در دریافت اطلاعات کاربر' });
      }
  
      res.json({ data });
  
    } catch (err) {
      res.status(401).json({ message: '❌ توکن نامعتبر' });
    }
  });

  
  ////////////
//   اضافه کردن تصویر

// const multer = require('multer');
// const path = require('path');

// // 📂 ذخیره فایل در فولدر uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// // ✅ آپلود عکس پروفایل
// router.post('/uploadAvatar', upload.single('avatar'), async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: '❌ دسترسی غیرمجاز' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const filePath = `http://localhost:3000/uploads/${req.file.filename}`;

//     const { error } = await supabase
//       .from('users')
//       .update({ avatar: filePath })
//       .eq('id', decoded.id);

//     if (error) {
//       return res.status(500).json({ message: '❌ خطا در آپلود' });
//     }

//     res.json({ message: '✅ عکس با موفقیت آپلود شد', filePath });

//   } catch (err) {
//     res.status(401).json({ message: '❌ توکن نامعتبر' });
//   }
// });

  