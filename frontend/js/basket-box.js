
// export function addItemToBasket(product) {
//   let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

//   const existingItem = cart.find(item => item.productId === product.id);

//   if (existingItem) {
//     existingItem.quantity += product.quantity || 1;
//   } else {
//     cart.push({
//       productId: product.id,
//       name: product.name,
//       price: product.price,
//       quantity: product.quantity || 1,
//     });
//   }

//   localStorage.setItem('cartItems', JSON.stringify(cart));

//   updateBasketUI();
// }

// export function updateBasketUI() {
//   const emptyMessage = document.querySelector('.basket-is-empty');
//   const notEmptySections = document.querySelectorAll('.basket-is-not-empty');
//   const basketBody = document.querySelector('.basket-items');

//   let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

//   if (cart.length === 0) {
//     if (emptyMessage) emptyMessage.style.display = 'block';
//     notEmptySections.forEach(el => (el.style.display = 'none'));
//     if (basketBody) basketBody.innerHTML = '';

//     // ⛔ مخفی‌کردن دکمه‌ی checkout در حالت خالی
//     const checkoutBtn = document.getElementById('checkout-btn');
//     if (checkoutBtn) checkoutBtn.style.display = 'none';

//     return;
//   }

//   if (emptyMessage) emptyMessage.style.display = 'none';
//   notEmptySections.forEach(el => (el.style.display = 'block'));

//   if (!basketBody) return;

//   basketBody.innerHTML = '';

//   let total = 0;
//   cart.forEach(item => {
//     total += item.price * item.quantity;

//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td class="side-basket-qty">
//         ${item.quantity}
//         <div class="side-basket-controls side-basket-controls-qty">
//           <button class="btn decrease" data-id="${item.productId}" title="Decrease quantity"><i class="bi bi-dash-lg"></i></button>
//           <button class="btn increase" data-id="${item.productId}" title="Increase quantity"><i class="bi bi-plus-lg"></i></button>
//         </div>
//       </td>
//       <td class="side-basket-name">
//         <a href="/p/${item.productId}/" class="text-dark">${item.name}</a>
//       </td>
//       <td class="side-basket-price">
//         £${(item.price * item.quantity).toFixed(2)}
//         <div class="side-basket-controls side-basket-controls-remove">
//           <button class="btn remove" data-id="${item.productId}" title="Remove item"><i class="bi bi-trash"></i></button>
//         </div>
//       </td>
//     `;

//     basketBody.appendChild(row);
//   });

//   const guidePriceEl = document.querySelector('.basket-guide-price');
//   if (guidePriceEl) {
//     guidePriceEl.textContent = `£${total.toFixed(2)}`;
//   }

//   // ✅ نمایش دکمه checkout فقط زمانی که cart پر است
//   const checkoutBtn = document.getElementById('checkout-btn');
//   if (checkoutBtn) {
//     checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
//   }

//   addBasketControlsListeners();
//   setTimeout(addBasketControlsListeners, 50);
// }


// function addBasketControlsListeners() {
//   document.querySelectorAll('.basket-items .increase').forEach(btn => {
//     btn.onclick = () => changeQuantity(btn.dataset.id, 1);
//   });
//   document.querySelectorAll('.basket-items .decrease').forEach(btn => {
//     btn.onclick = () => changeQuantity(btn.dataset.id, -1);
//   });
//   document.querySelectorAll('.basket-items .remove').forEach(btn => {
//     btn.onclick = () => removeItem(btn.dataset.id);
//   });
// }

// function changeQuantity(productId, delta) {
//   let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
//   const item = cart.find(i => i.productId === productId);
//   if (!item) return;

//   item.quantity += delta;
//   if (item.quantity < 1) item.quantity = 1;

//   localStorage.setItem('cartItems', JSON.stringify(cart));
//   updateBasketUI();
// }

// function removeItem(productId) {
//   let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
//   cart = cart.filter(i => i.productId !== productId);
//   localStorage.setItem('cartItems', JSON.stringify(cart));
//   updateBasketUI();
// }

/////////////////////

import { supabase } from './supabaseClient.js';

const GUEST_USER_ID = 'guest'; // شناسه ثابت برای کاربر نمونه کار

// ✅ اضافه کردن آیتم به سبد خرید در دیتابیس
export async function addItemToBasket(product) {
  // چک کنیم که آیا این محصول قبلاً توی سبد هست؟
  const { data: existing, error: selectError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', GUEST_USER_ID)
    .eq('product_id', product.id)
    .maybeSingle();

  if (selectError) {
    console.error(selectError.message);
    return;
  }

  if (existing) {
    // اگر بود: فقط تعدادش رو افزایش بده
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + (product.quantity || 1) })
      .eq('id', existing.id);

    if (updateError) console.error(updateError.message);
  } else {
    // اگر نبود: درج کن
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert([{
        user_id: GUEST_USER_ID,
        product_id: product.id,
        quantity: product.quantity || 1,
      }]);

    if (insertError) console.error(insertError.message);
  }

  await updateBasketUI();
}

// ✅ رندر UI با داده‌های دیتابیس
export async function updateBasketUI() {
  const emptyMessage = document.querySelector('.basket-is-empty');
  const notEmptySections = document.querySelectorAll('.basket-is-not-empty');
  const basketBody = document.querySelector('.basket-items');

  // واکشی آیتم‌های سبد خرید همراه با اطلاعات محصول
  const { data: cart, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price
      )
    `)
    .eq('user_id', GUEST_USER_ID);

  if (error) {
    console.error(error.message);
    return;
  }

  if (!cart || cart.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    notEmptySections.forEach(el => (el.style.display = 'none'));
    if (basketBody) basketBody.innerHTML = '';

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  if (emptyMessage) emptyMessage.style.display = 'none';
  notEmptySections.forEach(el => (el.style.display = 'block'));
  if (!basketBody) return;

  basketBody.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.products.price * item.quantity;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="side-basket-qty">
        ${item.quantity}
        <div class="side-basket-controls side-basket-controls-qty">
          <button class="btn decrease" data-id="${item.id}" title="Decrease quantity"><i class="bi bi-dash-lg"></i></button>
          <button class="btn increase" data-id="${item.id}" title="Increase quantity"><i class="bi bi-plus-lg"></i></button>
        </div>
      </td>
      <td class="side-basket-name">
        <a href="/p/${item.products.id}/" class="text-dark">${item.products.name}</a>
      </td>
      <td class="side-basket-price">
        £${(item.products.price * item.quantity).toFixed(2)}
        <div class="side-basket-controls side-basket-controls-remove">
          <button class="btn remove" data-id="${item.id}" title="Remove item"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    `;

    basketBody.appendChild(row);
  });

  const guidePriceEl = document.querySelector('.basket-guide-price');
  if (guidePriceEl) {
    guidePriceEl.textContent = `£${total.toFixed(2)}`;
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
  }

  addBasketControlsListeners();
  setTimeout(addBasketControlsListeners, 50);
}

// ✅ لیسنرهای کنترل دکمه‌ها
function addBasketControlsListeners() {
  document.querySelectorAll('.basket-items .increase').forEach(btn => {
    btn.onclick = () => changeQuantity(parseInt(btn.dataset.id), 1);
  });
  document.querySelectorAll('.basket-items .decrease').forEach(btn => {
    btn.onclick = () => changeQuantity(parseInt(btn.dataset.id), -1);
  });
  document.querySelectorAll('.basket-items .remove').forEach(btn => {
    btn.onclick = () => removeItem(parseInt(btn.dataset.id));
  });
}

// ✅ تغییر تعداد در دیتابیس
async function changeQuantity(cartItemId, delta) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('id', cartItemId)
    .single();

  if (error) return console.error(error.message);

  let newQty = data.quantity + delta;
  if (newQty < 1) newQty = 1;

  const { error: updateError } = await supabase
    .from('cart_items')
    .update({ quantity: newQty })
    .eq('id', cartItemId);

  if (updateError) console.error(updateError.message);

  await updateBasketUI();
}

// ✅ حذف از دیتابیس
async function removeItem(cartItemId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) console.error(error.message);

  await updateBasketUI();
}
