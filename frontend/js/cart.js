

import { supabase } from './supabaseClient.js';

const GUEST_USER_ID = 'guest';

// واکشی و رندر سبد خرید
async function updateBasketUI() {
  const { data: cart, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('user_id', GUEST_USER_ID);

  if (error) return console.error(error.message);

  // ← اینجا منطق خالی بودن سبد رو اضافه کن
  if (!cart || cart.length === 0) {
    document.querySelector('.basket-is-empty').style.display = 'block';
    document.querySelector('.basket-is-not-empty').style.display = 'none';
    return; // چون سبد خالیه، دیگه نیازی به رندر جدول نیست
  } else {
    document.querySelector('.basket-is-empty').style.display = 'none';
    document.querySelector('.basket-is-not-empty').style.display = 'block';
  }

  // ادامه: رندر جدول و subtotal وقتی سبد پره
  const basketBody = document.querySelector('.basket-items');
  basketBody.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    total += item.products.price * item.quantity;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${item.products.image_url}" alt="${item.products.name}" style="width:60px;height:60px;object-fit:cover;"></td>
      <td>${item.products.name}</td>
      <td>£${item.products.price.toFixed(2)}</td>
      <td>
        ${item.quantity}
        <button class="increase" data-id="${item.id}">+</button>
        <button class="decrease" data-id="${item.id}">-</button>
        <button class="remove" data-id="${item.id}">🗑️</button>
      </td>
      <td>£${(item.products.price * item.quantity).toFixed(2)}</td>
    `;
    basketBody.appendChild(row);
  });

  // نمایش جمع کل
  document.getElementById('cart-total').textContent = `£${total.toFixed(2)}`;
  document.getElementById('checkout-btn').style.display = cart.length > 0 ? 'block' : 'none';
}


// تغییر تعداد محصول
async function changeQuantity(cartItemId, delta) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('id', cartItemId)
    .single();
  if (error) return console.error(error.message);

  let newQty = data.quantity + delta;
  if (newQty < 1) newQty = 1;

  await supabase
    .from('cart_items')
    .update({ quantity: newQty })
    .eq('id', cartItemId);

  updateBasketUI();
}

// حذف محصول
async function removeItem(cartItemId) {
  await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  updateBasketUI();
}

// Event Delegation برای دکمه‌ها
document.querySelector('.basket-items').addEventListener('click', async (e) => {
  const target = e.target.closest('button');
  if (!target) return;
  const cartItemId = parseInt(target.dataset.id);
  if (target.classList.contains('increase')) await changeQuantity(cartItemId, 1);
  else if (target.classList.contains('decrease')) await changeQuantity(cartItemId, -1);
  else if (target.classList.contains('remove')) await removeItem(cartItemId);
});

// اجرا در لود صفحه
document.addEventListener('DOMContentLoaded', updateBasketUI);
