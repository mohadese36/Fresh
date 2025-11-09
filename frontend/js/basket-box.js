// frontend/js/basket-box.js
import { supabase } from './supabaseClient.js';

// ===============================
// 🧠 دریافت شناسه‌ی فعال (کاربر یا مهمان)
// ===============================
function getOrCreateGuestId() {
  let gid = localStorage.getItem('guest_id');
  if (!gid) {
    gid = 'guest_' + crypto.randomUUID();
    localStorage.setItem('guest_id', gid);
  }
  return gid;
}

// برگرداندن شناسه‌ی واقعی کاربر در صورت وجود
async function getActiveUserId() {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (storedUser?.id) {
    await mergeGuestCartToUser(storedUser.id);
    return storedUser.id;
  }
  return getOrCreateGuestId();
}

// ادغام سبد مهمان با حساب کاربر در دیتابیس
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
    console.log('✅ سبد مهمان به حساب کاربر منتقل شد');
  } catch (err) {
    console.error('mergeGuestCartToUser:', err.message);
  }
}

// ===============================
// 🛒 منطق سبد خرید
// ===============================
let USER_ID = null;

// Badge: تعداد آیتم‌ها
async function updateCartBadge() {
  if (!USER_ID) USER_ID = await getActiveUserId();
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;

  try {
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', USER_ID);

    if (error) throw error;

    const count = items ? items.length : 0;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  } catch (err) {
    console.error('updateCartBadge:', err.message);
  }
}

// افزودن محصول به سبد
export async function addItemToBasket(product) {
  if (!USER_ID) USER_ID = await getActiveUserId();

  try {
    const { data: existing, error: selErr } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('product_id', product.id)
      .maybeSingle();

    if (selErr) throw selErr;

    if (existing) {
      const { error: upErr } = await supabase
        .from('cart_items')
        .update({
          quantity: (existing.quantity || 1) + (product.quantity || 1),
        })
        .eq('id', existing.id);
      if (upErr) throw upErr;
    } else {
      const { error: insErr } = await supabase
        .from('cart_items')
        .insert([
          {
            user_id: USER_ID,
            product_id: product.id,
            quantity: product.quantity || 1,
          },
        ]);
      if (insErr) throw insErr;
    }

    await updateBasketUI();
    await updateCartBadge();
  } catch (err) {
    console.error('addItemToBasket:', err.message);
  }
}

// رندر UI
export async function updateBasketUI() {
  if (!USER_ID) USER_ID = await getActiveUserId();
  const emptyMessage = document.querySelector('.basket-is-empty');
  const notEmptySections = document.querySelectorAll('.basket-is-not-empty');
  const basketBody = document.querySelector('.basket-items');
  if (!basketBody) return;

  try {
    const { data: cart, error } = await supabase
      .from('cart_items')
      .select(`id, quantity, products (id, name, price)`)
      .eq('user_id', USER_ID)
      .order('id', { ascending: true });

    if (error) throw error;

    if (!cart || cart.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      notEmptySections.forEach((el) => (el.style.display = 'none'));
      basketBody.innerHTML = '';
      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    notEmptySections.forEach((el) => (el.style.display = 'block'));

    let total = 0;
    let rowsHtml = '';

    cart.forEach((item) => {
      const price = Number(item?.products?.price || 0);
      const qty = Number(item?.quantity || 1);
      total += price * qty;

      rowsHtml += `
        <tr data-rowid="${item.id}">
          <td class="side-basket-qty">
            ${qty}
            <div class="side-basket-controls side-basket-controls-qty">
              <button type="button" class="btn decrease" data-id="${item.id}" title="کاهش تعداد">
                <i class="bi bi-dash-lg"></i>
              </button>
              <button type="button" class="btn increase" data-id="${item.id}" title="افزایش تعداد">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </td>
          <td class="side-basket-name">
            <a href="/p/${item.products.id}/">${item.products.name}</a>
          </td>
          <td class="side-basket-price">
            £${(price * qty).toFixed(2)}
            <div class="side-basket-controls side-basket-controls-remove">
              <button type="button" class="btn remove" data-id="${item.id}" title="حذف آیتم">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>`;
    });

    basketBody.innerHTML = rowsHtml;
    const guidePriceEl = document.querySelector('.basket-guide-price');
    if (guidePriceEl) guidePriceEl.textContent = `£${total.toFixed(2)}`;

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';

    addBasketControlsListeners();
  } catch (err) {
    console.error('updateBasketUI:', err.message);
  }
}

// کنترل دکمه‌ها
function addBasketControlsListeners() {
  const tbody = document.querySelector('.basket-items');
  if (!tbody) return;
  if (tbody.dataset.bound === '1') return;
  tbody.dataset.bound = '1';

  tbody.addEventListener('click', (e) => {
    const inc = e.target.closest('.increase');
    const dec = e.target.closest('.decrease');
    const rem = e.target.closest('.remove');
    if (!inc && !dec && !rem) return;

    e.preventDefault();
    const btn = inc || dec || rem;
    const id = parseInt(btn.dataset.id, 10);

    if (inc) return changeQuantity(id, 1);
    if (dec) return changeQuantity(id, -1);
    if (rem) return removeItem(id);
  });
}

// تغییر تعداد
async function changeQuantity(cartItemId, delta) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('id', cartItemId)
      .single();
    if (error) throw error;
    const newQty = Math.max(Number(data.quantity || 1) + Number(delta), 1);
    const { error: upErr } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', cartItemId);
    if (upErr) throw upErr;
    await updateBasketUI();
    await updateCartBadge();
  } catch (err) {
    console.error('changeQuantity:', err.message);
  }
}

// حذف آیتم
async function removeItem(cartItemId) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    if (error) throw error;
    await updateBasketUI();
    await updateCartBadge();
  } catch (err) {
    console.error('removeItem:', err.message);
  }
}

// ===============================
// 🚀 اجرای اولیه
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
  USER_ID = await getActiveUserId();
  console.log('👤 basket-box USER_ID =', USER_ID);
  await updateBasketUI();
  await updateCartBadge();
});
