


// import { supabase } from './supabaseClient.js';
// import { getCurrentUserId } from './user.js';

// import { updateHeaderUserInfo } from './user-header.js';

// document.addEventListener('DOMContentLoaded', () => {
//   updateHeaderUserInfo();
// });


// const CURRENT_USER_ID = getCurrentUserId();

// async function updateCartBadge() {
//   const badge = document.getElementById('cart-count-badge');
//   if (!badge) return;

//   const { data: cartItems } = await supabase
//     .from('cart_items')
//     .select('id')
//     .eq('user_id', CURRENT_USER_ID);

//   const count = cartItems ? cartItems.length : 0;
//   badge.textContent = count;
//   badge.style.display = count > 0 ? 'inline-block' : 'none';
// }

// async function updateBasketUI() {
//   const { data: cart } = await supabase
//     .from('cart_items')
//     .select(`id, quantity, products(id, name, price, image_url)`)
//     .eq('user_id', CURRENT_USER_ID);

//   const basketBody = document.querySelector('.basket-items');
//   basketBody.innerHTML = '';
//   if (!cart || cart.length === 0) {
//     document.querySelector('.basket-is-empty').style.display = 'block';
//     document.querySelector('.basket-is-not-empty').style.display = 'none';
//     await updateCartBadge();
//     return;
//   }

//   document.querySelector('.basket-is-empty').style.display = 'none';
//   document.querySelector('.basket-is-not-empty').style.display = 'block';

//   let total = 0;
//   cart.forEach(item => {
//     total += item.products.price * item.quantity;
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td><img src="${item.products.image_url}" style="width:60px;height:60px;object-fit:cover;"></td>
//       <td>${item.products.name}</td>
//       <td>£${item.products.price.toFixed(2)}</td>
//       <td>
//         ${item.quantity}
//         <button class="increase" data-id="${item.id}">+</button>
//         <button class="decrease" data-id="${item.id}">-</button>
//         <button class="remove" data-id="${item.id}">🗑️</button>
//       </td>
//       <td>£${(item.products.price * item.quantity).toFixed(2)}</td>
//     `;
//     basketBody.appendChild(row);
//   });

//   document.getElementById('cart-total').textContent = `£${total.toFixed(2)}`;
//   document.getElementById('checkout-btn').style.display = cart.length > 0 ? 'block' : 'none';
//   await updateCartBadge();
// }

// document.querySelector('.basket-items').addEventListener('click', async e => {
//   const target = e.target.closest('button');
//   if (!target) return;
//   const cartItemId = parseInt(target.dataset.id);
//   if (target.classList.contains('increase')) await changeQuantity(cartItemId, 1);
//   else if (target.classList.contains('decrease')) await changeQuantity(cartItemId, -1);
//   else if (target.classList.contains('remove')) await removeItem(cartItemId);
// });

// async function changeQuantity(cartItemId, delta) {
//   const { data } = await supabase
//     .from('cart_items')
//     .select('quantity')
//     .eq('id', cartItemId)
//     .single();
//   const newQty = Math.max(data.quantity + delta, 1);
//   await supabase.from('cart_items').update({ quantity: newQty }).eq('id', cartItemId);
//   await updateBasketUI();
//   await updateCartBadge();
// }

// async function removeItem(cartItemId) {
//   await supabase.from('cart_items').delete().eq('id', cartItemId);
//   await updateBasketUI();
//   await updateCartBadge();
// }

// document.addEventListener('DOMContentLoaded', updateBasketUI);


// basket-box.js (Drop-in Replacement)
// حالت دوتایی: Guest (localStorage) + User (Supabase)
// نیازمند supabaseClient.js و user.js (getCurrentUserId)

import { supabase } from './supabaseClient.js';
import { getCurrentUserId } from './user.js';

// --- Helpers: User / Guest detection ---
function getUserIdNow() {
  // اگر getCurrentUserId همون لحظه مقدار میده، همینه کافیست.
  // در غیر این صورت می‌تونی نسخه async بسازی.
  try {
    return getCurrentUserId(); // باید null/undefined بده وقتی لاگین نیست
  } catch {
    return null;
  }
}

function getGuestCart() {
  return JSON.parse(localStorage.getItem('guest_cart') || '[]'); // [{productId, qty, name, price, image_url}]
}
function setGuestCart(items) {
  localStorage.setItem('guest_cart', JSON.stringify(items || []));
}

// --- Badge ---
async function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;

  const userId = getUserIdNow();

  try {
    let count = 0;

    if (!userId) {
      // Guest
      const items = getGuestCart();
      // اگر بخوای تعداد آیتم‌ها یا مجموع qty رو نمایش بدی یکی رو انتخاب کن:
      count = items.reduce((sum, it) => sum + (it.qty || 1), 0);
    } else {
      // Logged-in
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', userId);

      if (error) throw error;
      count = (cartItems || []).reduce((sum, it) => sum + (it.quantity || 1), 0);
    }

    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  } catch (err) {
    console.error('updateCartBadge:', err.message);
  }
}

// --- Add item ---
export async function addItemToBasket(product) {
  // product: { id, quantity?, name?, price?, image_url? }
  const userId = getUserIdNow();
  const qtyToAdd = product.quantity || 1;

  try {
    if (!userId) {
      // Guest mode: keep minimal product info for UI render
      const guest = getGuestCart();
      const idx = guest.findIndex(it => it.productId === product.id);
      if (idx > -1) {
        guest[idx].qty += qtyToAdd;
      } else {
        guest.push({
          productId: product.id,
          qty: qtyToAdd,
          // این ۳ تا برای رندر سمت مهمان لازمه
          name: product.name,
          price: product.price,
          image_url: product.image_url
        });
      }
      setGuestCart(guest);
    } else {
      // User mode: DB
      // آیا این محصول قبلاً در سبد هست؟
      const { data: existing, error: selErr } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .maybeSingle();

      if (selErr && selErr.code !== 'PGRST116') throw selErr;

      if (existing) {
        const newQty = (existing.quantity || 1) + qtyToAdd;
        const { error: upErr } = await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .eq('id', existing.id);
        if (upErr) throw upErr;
      } else {
        const { error: insErr } = await supabase
          .from('cart_items')
          .insert([{
            user_id: userId,
            product_id: product.id,
            quantity: qtyToAdd
          }]);
        if (insErr) throw insErr;
      }
    }

    await updateBasketUI();
    await updateCartBadge();
  } catch (err) {
    console.error('addItemToBasket:', err.message);
  }
}

// --- Render UI ---
export async function updateBasketUI() {
  const emptyMessage = document.querySelector('.basket-is-empty');
  const notEmptySections = document.querySelectorAll('.basket-is-not-empty');
  const basketBody = document.querySelector('.basket-items');

  const userId = getUserIdNow();

  try {
    let items = [];
    let mode = 'guest';

    if (!userId) {
      // Guest
      const guest = getGuestCart();
      // به فرمت یکسان با User تبدیل می‌کنیم:
      items = guest.map(it => ({
        id: `guest-${it.productId}`, // pseudo id
        quantity: it.qty || 1,
        products: {
          id: it.productId,
          name: it.name || '—',
          price: it.price || 0,
          image_url: it.image_url || ''
        }
      }));
    } else {
      // User
      mode = 'user';
      // توجه: اگر رابطه products اسم alias دارد، اصلاح کن (مثلاً products:product_id(...))
      const { data: cart, error } = await supabase
        .from('cart_items')
        .select(`id, quantity, products (id, name, price, image_url)`)
        .eq('user_id', userId);

      if (error) throw error;
      items = cart || [];
    }

    if (!items.length) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      notEmptySections.forEach(el => (el.style.display = 'none'));
      if (basketBody) basketBody.innerHTML = '';
      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    notEmptySections.forEach(el => (el.style.display = 'block'));
    if (basketBody) basketBody.innerHTML = '';

    let total = 0;

    items.forEach(item => {
      const price = Number(item?.products?.price || 0);
      const qty = Number(item?.quantity || 1);
      total += price * qty;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="side-basket-qty">
          ${qty}
          <div class="side-basket-controls side-basket-controls-qty">
            <button class="btn decrease" data-id="${item.id}" data-mode="${mode}">-</button>
            <button class="btn increase" data-id="${item.id}" data-mode="${mode}">+</button>
          </div>
        </td>
        <td class="side-basket-name">
          <a href="/p/${item.products.id}/" class="text-dark">${item.products.name}</a>
        </td>
        <td class="side-basket-price">
          £${(price * qty).toFixed(2)}
          <div class="side-basket-controls side-basket-controls-remove">
            <button class="btn remove" data-id="${item.id}" data-pid="${item.products.id}" data-mode="${mode}">🗑️</button>
          </div>
        </td>
      `;
      basketBody && basketBody.appendChild(row);
    });

    const guidePriceEl = document.querySelector('.basket-guide-price');
    if (guidePriceEl) guidePriceEl.textContent = `£${total.toFixed(2)}`;

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = items.length > 0 ? 'block' : 'none';

    addBasketControlsListeners();
  } catch (err) {
    console.error('updateBasketUI:', err.message);
  }
}

// --- Controls ---
function addBasketControlsListeners() {
  document.querySelectorAll('.basket-items .increase').forEach(btn => {
    btn.addEventListener('click', () => changeQuantity(btn.dataset.id, 1, btn.dataset.mode));
  });
  document.querySelectorAll('.basket-items .decrease').forEach(btn => {
    btn.addEventListener('click', () => changeQuantity(btn.dataset.id, -1, btn.dataset.mode));
  });
  document.querySelectorAll('.basket-items .remove').forEach(btn => {
    btn.addEventListener('click', () => removeItem(btn.dataset.id, btn.dataset.pid, btn.dataset.mode));
  });
}

// --- Quantity change ---
async function changeQuantity(cartItemId, delta, mode) {
  try {
    if (mode === 'guest' || cartItemId.startsWith('guest-')) {
      const productId = cartItemId.replace('guest-', '');
      const guest = getGuestCart();
      const idx = guest.findIndex(it => it.productId === productId);
      if (idx > -1) {
        const newQty = Math.max((guest[idx].qty || 1) + delta, 1);
        guest[idx].qty = newQty;
        setGuestCart(guest);
      }
    } else {
      // user mode
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('id', cartItemId)
        .single();

      if (error) throw error;
      const newQty = Math.max((data?.quantity || 1) + delta, 1);

      const { error: upErr } = await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', cartItemId);

      if (upErr) throw upErr;
    }

    await updateBasketUI();
    await updateCartBadge();
  } catch (err) {
    console.error('changeQuantity:', err.message);
  }
}

// --- Remove item ---
async function removeItem(cartItemId, productId, mode) {
  try {
    if (mode === 'guest' || cartItemId.startsWith('guest-')) {
      const guest = getGuestCart();
      const filtered = guest.filter(it => it.productId !== productId);
      setGuestCart(filtered);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
      if (error) throw error;
    }

    await updateBasketUI();
    await updateCartBadge();
  } catch (err) {
    console.error('removeItem:', err.message);
  }
}

// --- Optional: migrate guest cart after login ---
async function migrateGuestCartIfAny() {
  const userId = getUserIdNow();
  if (!userId) return;

  const guest = getGuestCart();
  if (!guest.length) return;

  const upserts = guest.map(it => ({
    user_id: userId,
    product_id: it.productId,
    quantity: it.qty || 1
  }));

  const { error } = await supabase
    .from('cart_items')
    .upsert(upserts, { onConflict: 'user_id,product_id' });

  if (!error) setGuestCart([]);
}

// --- Boot ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await updateBasketUI();
    await updateCartBadge();

    // اگر auth listener داری، می‌تونی اینجا بذاری
    // supabase.auth.onAuthStateChange(async () => {
    //   await migrateGuestCartIfAny();
    //   await updateBasketUI();
    //   await updateCartBadge();
    // });
  } catch (e) {
    console.error(e);
  }
});
