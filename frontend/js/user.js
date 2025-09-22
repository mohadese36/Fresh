
// // user.js
// import { supabase } from './supabaseClient.js';

// export function getVisitorId() {
//   let visitorId = localStorage.getItem('visitor_id');
//   if (!visitorId) {
//     visitorId = crypto.randomUUID(); // شناسه یکتا
//     localStorage.setItem('visitor_id', visitorId);
//   }
//   return visitorId;
// }

// // بررسی موجودیت کاربر ثبت‌نامی
// export async function registerUser(email, name, password) {
//   try {
//     // ابتدا بررسی وجود ایمیل
//     const { data: existing, error: selectError } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .maybeSingle();
//     if (selectError) throw selectError;

//     if (existing) {
//       return { success: false, message: 'User already exists' };
//     }

//     // اضافه کردن کاربر جدید
//     const { data, error } = await supabase
//       .from('users')
//       .insert([{ email, name, password }])
//       .select()
//       .single();
//     if (error) throw error;

//     // جایگزین کردن visitor_id با user_id واقعی
//     localStorage.setItem('visitor_id', data.id);
//     return { success: true, user: data };
//   } catch (err) {
//     return { success: false, message: err.message };
//   }
// }

// // دریافت شناسه فعلی (مهمان یا کاربر)
// export function getCurrentUserId() {
//   return localStorage.getItem('visitor_id');
// }



// user.js
export function getCurrentUserId() {
  // اگر کاربر وارد شده، user_id واقعی را برگردان
  const user = JSON.parse(localStorage.getItem('user')); // فرض می‌کنیم info کاربر ذخیره شده
  if (user && user.id) return user.id;

  // اگر وارد نشده، شناسه یکتا مهمان بساز
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}
