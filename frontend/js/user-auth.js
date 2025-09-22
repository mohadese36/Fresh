// import { updateHeaderUserInfo } from './user-header.js';

// document.addEventListener('DOMContentLoaded', () => {
//   updateHeaderUserInfo();
// });
// // user-auth.js
// import { supabase } from './supabaseClient.js';
// import { getCurrentUserId } from './user.js';

// export async function registerUser(name, email, password) {
//   // بررسی اینکه ایمیل قبلا ثبت شده؟
//   const { data: existingUser, error: selectError } = await supabase
//     .from('users')
//     .select('*')
//     .eq('email', email)
//     .maybeSingle();

//   if (selectError) throw selectError;

//   if (existingUser) {
//     return { success: false, message: 'Email already exists' };
//   }

//   // ثبت کاربر جدید
//   const { data, error: insertError } = await supabase
//     .from('users')
//     .insert([{ name, email, password }])
//     .select()
//     .maybeSingle();

//   if (insertError) throw insertError;

//   // ذخیره در localStorage
//   localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email }));
//   return { success: true, user: data };
// }

// export async function loginUser(email, password) {
//   const { data: user, error } = await supabase
//     .from('users')
//     .select('*')
//     .eq('email', email)
//     .eq('password', password)
//     .maybeSingle();

//   if (error) throw error;

//   if (!user) {
//     return { success: false, message: 'Email or password is incorrect' };
//   }

//   localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
//   return { success: true, user };
// }

// export function logoutUser() {
//   localStorage.removeItem('user');
// }






// // user-auth.js
// import { supabase } from './supabaseClient.js';
// import { updateHeaderUserInfo } from './user-header.js';

// // ثبت نام کاربر
// export async function registerUser(email, password, fullName) {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: { fullName }
//     }
//   });

//   if (error) return { success: false, message: error.message };
//   if (!data.user) return { success: false, message: 'Registration failed' };

//   localStorage.setItem('user', JSON.stringify({
//     id: data.user.id,
//     email: data.user.email,
//     fullName
//   }));

//   updateHeaderUserInfo();
//   return { success: true, user: data.user };
// }

// // ورود کاربر
// export async function loginUser(email, password) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password
//   });

//   if (error) return { success: false, message: error.message };
//   if (!data.user) return { success: false, message: 'Login failed' };

//   localStorage.setItem('user', JSON.stringify({
//     id: data.user.id,
//     email: data.user.email,
//     fullName: data.user.user_metadata?.fullName || ''
//   }));

//   updateHeaderUserInfo();
//   return { success: true, user: data.user };
// }

// // خروج
// export function logoutUser() {
//   supabase.auth.signOut();
//   localStorage.removeItem('user');
//   updateHeaderUserInfo();
// }

