// frontend/js/cart.js
import { supabase } from './supabaseClient.js';

// ===============================
// 🧠 مدیریت شناسه کاربر / مهمان
// ===============================
function getOrCreateGuestId() {
  let gid = localStorage.getItem('guest_id');
  if (!gid) {
    gid = 'guest_' + crypto.randomUUID();
    localStorage.setItem('guest_id', gid);
  }
  return gid;
}

async function getActiveUserId() {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (storedUser?.id) {
    await mergeGuestCartToUser(storedUser.id);
    return storedUser.id;
  }
  return getOrCreateGuestId();
}

async function mergeGuestCartToUser(userId) {
  const guestId = localStorage.getItem('guest_id');
  if (!guestId) return;
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ user_id: userId })
      .eq('user_id', guestId);
    if (error) throw error;
    localStorage.removeItem('guest_id');
    console.log('✅ سبد مهمان منتقل شد به کاربر');
  } catch (err) {
    console.error('mergeGuestCartToUser:', err.message);
  }
}

// ===============================
// 🛒 عملیات سبد
// ===============================
let USER_ID = null;

function getImageSrc(prod) {
  const u = (prod?.image_url || '').trim();
  return u || './images/products/deli-2880w.jpg';
}

// --- Badge ---
async function updateCartBadge() {
  if (!USER_ID) USER_ID = await getActiveUserId();
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;
  try {
    const { data: rows, error } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', USER_ID);
    if (error) throw error;
    const count = rows ? rows.length : 0;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  } catch (e) {
    console.error('updateCartBadge:', e.message);
  }
}

// --- Add item ---
export async function addItemToBasket(product) {
  if (!USER_ID) USER_ID = await getActiveUserId();
  const qtyToAdd = product.quantity || 1;
  try {
    const { data: existing, error: selErr } = await supabase
      .from('cart_items').select('id, quantity')
      .eq('user_id', USER_ID).eq('product_id', product.id).maybeSingle();
    if (selErr) throw selErr;

    if (existing) {
      const { error: upErr } = await supabase
        .from('cart_items')
        .update({ quantity: (existing.quantity || 1) + qtyToAdd })
        .eq('id', existing.id);
      if (upErr) throw upErr;
    } else {
      const { error: insErr } = await supabase
        .from('cart_items')
        .insert([{ user_id: USER_ID, product_id: product.id, quantity: qtyToAdd }]);
      if (insErr) throw insErr;
    }
    await updateBasketUI();
    await updateCartBadge();
  } catch (e) {
    console.error('addItemToBasket:', e.message);
  }
}

// --- Render UI ---
export async function updateBasketUI() {
  if (!USER_ID) USER_ID = await getActiveUserId();

  const emptyBox = document.querySelector('.basket-is-empty');
  const filledWrap = document.querySelector('.basket-is-not-empty');
  const tbody = document.querySelector('.basket-items');
  const totalEl = document.getElementById('cart-total');
  const checkout = document.getElementById('checkout-btn');
  if (!tbody) return;

  try {
    const { data: cart, error } = await supabase
      .from('cart_items')
      .select(`id, quantity, products (id, name, price, image_url)`)
      .eq('user_id', USER_ID)
      .order('id', { ascending: true });
    if (error) throw error;

    if (!cart || cart.length === 0) {
      emptyBox && (emptyBox.style.display = 'block');
      filledWrap && (filledWrap.style.display = 'none');
      tbody.innerHTML = '';
      totalEl && (totalEl.textContent = '£0.00');
      checkout && (checkout.style.display = 'none');
      return;
    }

    emptyBox && (emptyBox.style.display = 'none');
    filledWrap && (filledWrap.style.display = 'block');

    let grand = 0;
    let rowsHtml = '';

    cart.forEach(item => {
      const p = item.products || {};
      const qty = Number(item.quantity || 1);
      const unit = Number(p.price || 0);
      const rowTotal = unit * qty;
      grand += rowTotal;

      rowsHtml += `
      <tr data-rowid="${item.id}">
        <td class="side-basket-thumb">
          <a href="/p/${p.id}/">
          <img src="${getImageSrc(p)}" alt="${p.name || ''}"
            onerror="this.onerror=null;this.src='./images/products/deli-2880w.jpg';">
          </a>
        </td>
        <td class="side-basket-name">
          <a href="/p/${p.id}/" class="text-brown">${p.name || '—'}</a>
        </td>
        <td class="side-basket-unitprice">£${unit.toFixed(2)}</td>
        <td class="text-sm-start">
          <div class="side-basket-controls-qty">
            <button class="btn decrease" data-id="${item.id}">-</button>
            <span class="side-basket-qty">${qty}</span>
            <button class="btn increase" data-id="${item.id}">+</button>
          </div>
        </td>
        <td class="side-basket-footer">
          <div class="side-basket-total">£${rowTotal.toFixed(2)}</div>
          <button class="btn remove" data-id="${item.id}"><i class="bi bi-trash fs-4 text-warning"></i></button>
        </td>
      </tr>`;
    });

    tbody.innerHTML = rowsHtml;
    totalEl && (totalEl.textContent = `£${grand.toFixed(2)}`);
    checkout && (checkout.style.display = 'block');

    bindControls();
  } catch (e) {
    console.error('updateBasketUI:', e.message);
  }
}

// --- Controls ---
function bindControls() {
  const tbody = document.querySelector('.basket-items');
  if (!tbody || tbody.dataset.bound === '1') return;
  tbody.dataset.bound = '1';

  tbody.addEventListener('click', async (e) => {
    const inc = e.target.closest('.increase');
    const dec = e.target.closest('.decrease');
    const rem = e.target.closest('.remove');
    if (!inc && !dec && !rem) return;
    const id = parseInt((inc||dec||rem).dataset.id, 10);
    if (inc) return changeQty(id, 1);
    if (dec) return changeQty(id, -1);
    if (rem) return removeItem(id);
  });
}

async function changeQty(cartItemId, delta) {
  try {
    const { data, error } = await supabase
      .from('cart_items').select('quantity').eq('id', cartItemId).single();
    if (error) throw error;
    const newQty = Math.max((Number(data.quantity) || 1) + Number(delta), 1);
    const { error: upErr } = await supabase
      .from('cart_items').update({ quantity: newQty }).eq('id', cartItemId);
    if (upErr) throw upErr;
    await updateBasketUI();
    await updateCartBadge();
  } catch (e) {
    console.error('changeQty:', e.message);
  }
}

async function removeItem(cartItemId) {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
    if (error) throw error;
    await updateBasketUI();
    await updateCartBadge();
  } catch (e) {
    console.error('removeItem:', e.message);
  }
}

// --- Boot ---
document.addEventListener('DOMContentLoaded', async () => {
  USER_ID = await getActiveUserId();
  console.log('👤 cart.js USER_ID =', USER_ID);
  await updateBasketUI();
  await updateCartBadge();
});
