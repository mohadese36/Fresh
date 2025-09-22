// frontend/js/basket-box.js
import { supabase } from './supabaseClient.js';

const GUEST_USER_ID = 'guest'; // کاربر ثابتِ نمونه

// ==========================
// Badge: تعداد آیتم‌ها (نه مجموع تعدادها)
async function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;

  try {
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('id', { count: 'exact' })
      .eq('user_id', GUEST_USER_ID)
      .order('id', { ascending: true }); // ترتیب پایدار

    if (error) throw error;

    const count = cartItems ? cartItems.length : 0;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  } catch (err) {
    console.error('Badge update error:', err.message);
  }
}

// ==========================
// افزودن محصول به سبد
export async function addItemToBasket(product) {
  try {
    const { data: existing, error: selectError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', GUEST_USER_ID)
      .eq('product_id', product.id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error: upErr } = await supabase
        .from('cart_items')
        .update({ quantity: (existing.quantity || 1) + (product.quantity || 1) })
        .eq('id', existing.id);
      if (upErr) throw upErr;
    } else {
      const { error: insErr } = await supabase
        .from('cart_items')
        .insert([{
          user_id: GUEST_USER_ID,
          product_id: product.id,
          quantity: product.quantity || 1,
        }]);
      if (insErr) throw insErr;
    }

    await updateBasketUI();
    await updateCartBadge();
  } catch (err) {
    console.error('addItemToBasket:', err.message);
  }
}

// ==========================
// رندر UI از دیتابیس
export async function updateBasketUI() {
  const emptyMessage = document.querySelector('.basket-is-empty');
  const notEmptySections = document.querySelectorAll('.basket-is-not-empty');
  const basketBody = document.querySelector('.basket-items');
  if (!basketBody) return;

  try {
    const { data: cart, error } = await supabase
      .from('cart_items')
      .select(`id, quantity, products (id, name, price)`)
      .eq('user_id', GUEST_USER_ID)
      .order('id', { ascending: true }); // ← کلیدِ جلوگیری از جابه‌جایی ردیف‌ها

    if (error) throw error;

    if (!cart || cart.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      notEmptySections.forEach(el => (el.style.display = 'none'));
      basketBody.innerHTML = '';

      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    notEmptySections.forEach(el => (el.style.display = 'block'));

    // بازآفرینی بدنه‌ی جدول
    let total = 0;
    let rowsHtml = '';

    cart.forEach(item => {
      const price = Number(item?.products?.price || 0);
      const qty   = Number(item?.quantity || 1);
      total += price * qty;

      rowsHtml += `
        <tr data-rowid="${item.id}">
          <td class="side-basket-qty">
            ${qty}
            <div class="side-basket-controls side-basket-controls-qty">
              <button type="button" class="btn decrease" data-id="${item.id}" title="Decrease quantity">
                <i class="bi bi-dash-lg"></i>
              </button>
              <button type="button" class="btn increase" data-id="${item.id}" title="Increase quantity">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </td>
          <td class="side-basket-name">
            <a href="/p/${item.products.id}/" class="text-dark">${item.products.name}</a>
          </td>
          <td class="side-basket-price">
            £${(price * qty).toFixed(2)}
            <div class="side-basket-controls side-basket-controls-remove">
              <button type="button" class="btn remove" data-id="${item.id}" title="Remove item">
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

    // رویدادها را فقط یک‌بار وصل کن
    addBasketControlsListeners();

  } catch (err) {
    console.error('updateBasketUI:', err.message);
  }
}

// ==========================
// لیسنرهای کنترل دکمه‌ها (Event Delegation)
function addBasketControlsListeners() {
  const tbody = document.querySelector('.basket-items');
  if (!tbody) return;

  // قبلاً وصل شده؟ تکرار نکن
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

// ==========================
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

// ==========================
// حذف محصول
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

// ==========================
// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', async () => {
  await updateBasketUI();
  await updateCartBadge();
});
