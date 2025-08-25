
// import { supabase } from './supabaseClient.js';

// const GUEST_USER_ID = 'guest';

// // تابع اصلی بروزرسانی badge
// async function updateHeaderCartBadge() {
//   // ابتدا DOM را چک می‌کنیم
//   const badge = document.getElementById('cart-count-badge');
//   if (!badge) return console.warn('Badge element not found');

//   try {
//     const { data: cart, error } = await supabase
//       .from('cart_items')
//       .select('quantity')
//       .eq('user_id', GUEST_USER_ID);

//     if (error) throw error;

//     // جمع تعداد آیتم‌ها
//     const totalQty = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
//     badge.textContent = totalQty;
//     badge.style.display = totalQty > 0 ? 'inline-block' : 'none';
//   } catch (err) {
//     console.error('Supabase error:', err.message);
//   }
// }

// // فراخوانی وقتی DOM آماده شد
// document.addEventListener('DOMContentLoaded', () => {
//   updateHeaderCartBadge();
// });

// // تابع عمومی برای بروزرسانی بعد از Add/Remove/Update
// window.onCartChange = updateHeaderCartBadge;


//////////////////////


import { supabase } from './supabaseClient.js';

const GUEST_USER_ID = 'guest';
const badge = document.getElementById('cart-count-badge');

// state محلی
let cartState = []; // هر آیتم { product_id, quantity }

// ------------------
// نمایش badge
function renderBadge() {
  if (!badge) return;

  // فقط تعداد محصولات یکتا (نه quantity)
  const uniqueCount = cartState.length;

  badge.textContent = uniqueCount;
  badge.style.display = uniqueCount > 0 ? 'inline-block' : 'none';
}

// ------------------
// بارگذاری اولیه از دیتابیس
async function loadCartFromDB() {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .eq('user_id', GUEST_USER_ID);

    if (error) throw error;
    cartState = data || [];
    renderBadge();
  } catch (err) {
    console.error('Supabase error:', err.message);
  }
}

document.addEventListener('DOMContentLoaded', loadCartFromDB);

// ------------------
// افزودن محصول جدید
export async function addItemToBasket(product) {
  const existing = cartState.find(i => i.product_id === product.id);
  if (existing) {
    // فقط quantity زیاد میشه (badge تغییر نمی‌کنه)
    existing.quantity += product.quantity || 1;
  } else {
    // محصول جدید → badge باید آپدیت بشه
    cartState.push({ product_id: product.id, quantity: product.quantity || 1 });
    renderBadge();
  }

  // ذخیره در دیتابیس
  await supabase.from('cart_items').upsert({
    user_id: GUEST_USER_ID,
    product_id: product.id,
    quantity: existing ? existing.quantity : product.quantity || 1
  });
}

// ------------------
// حذف محصول
export async function removeItemFromBasket(productId) {
  cartState = cartState.filter(i => i.product_id !== productId);
  renderBadge();

  await supabase.from('cart_items')
    .delete()
    .eq('user_id', GUEST_USER_ID)
    .eq('product_id', productId);
}

// ------------------
// تغییر quantity (badge تغییر نمی‌کنه)
export async function changeItemQuantity(productId, delta) {
  const item = cartState.find(i => i.product_id === productId);
  if (!item) return;

  item.quantity = Math.max(item.quantity + delta, 1);

  await supabase.from('cart_items')
    .update({ quantity: item.quantity })
    .eq('user_id', GUEST_USER_ID)
    .eq('product_id', productId);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


