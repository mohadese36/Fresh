import { supabase } from './supabaseClient.js';
import { updateHeaderUserInfo } from './user-header.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('username').value.trim();
    const fullNameInput = (document.getElementById('fullName')?.value || '').trim();
    if (!email) {
      alert('Email is required.');
      return;
    }

    try {
      // 1) ساخت/به‌روزرسانی کاربر با ایمیل (بدون نیاز به select)
      const fallbackName = fullNameInput || email.split('@')[0];

      const { data: user, error: upErr } = await supabase
        .from('users')
        .upsert(
          { email, name: fallbackName },         // فیلدها را با schema خودت هماهنگ کن
          { onConflict: 'email' }                // یونیک ایمیل لازم است
        )
        .select()
        .single();

      if (upErr) throw upErr;
      if (!user) throw new Error('User upsert returned no data.');

      // 2) ذخیره در localStorage
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        fullName: user.name || user.fullName || email.split('@')[0],
        email: user.email
      }));

      // 3) مهاجرت سبد مهمان → کاربر (اگر خطا داشت، لاگ کن ولی لاگین را خراب نکن)
      try {
        await migrateGuestCartToUser(user.id);
      } catch (mErr) {
        console.warn('Cart migration failed (ignored):', mErr?.message || mErr);
      }

      // 4) هدر و ریدایرکت
      updateHeaderUserInfo();
      window.location.href = './index.html';

    } catch (err) {
      console.error('LOGIN ERROR =>', err);     // این پیام را در کنسول ببین
      alert('Login failed. Please try again.');
    }
  });
});

// مهاجرت سبد مهمان به DB
async function migrateGuestCartToUser(userId) {
  const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]'); // [{productId, qty, ...}]
  if (!guest.length) return;

  const upserts = guest.map(it => ({
    user_id: userId,
    product_id: it.productId,
    quantity: it.qty || 1
  }));

  const { error } = await supabase
    .from('cart_items')
    .upsert(upserts, { onConflict: 'user_id,product_id' });

  if (error) throw error;
  localStorage.removeItem('guest_cart');
}
