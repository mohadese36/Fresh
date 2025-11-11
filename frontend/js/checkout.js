// frontend/js/checkout.js
import { supabase } from './supabaseClient.js';

// ===============================
// 🧠 شناسه‌ی کاربر / مهمان
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
  if (storedUser?.id) return storedUser.id;
  return getOrCreateGuestId();
}

// ===============================
// 🧾 رندر محصولات سبد در صفحه‌ی پرداخت
// ===============================
async function renderCheckoutItems() {
  const USER_ID = await getActiveUserId();

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
    .eq('user_id', USER_ID);

  if (error) return console.error(error.message);

  const container = document.getElementById('checkout-items');
  container.innerHTML = '';

  if (!cart || cart.length === 0) {
    container.innerHTML = `<p class="text-center">Your basket is empty.</p>`;
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.products.price * item.quantity;

    const card = document.createElement('div');
    card.className = 'card mb-3 basket-item';

    // ✅ افزودن لینک برای هدایت به صفحه‌ی معرفی محصول
    card.innerHTML = `
      <a href="product.html?id=${item.products.id}" class="text-decoration-none text-dark">
        <div class="row g-0 align-items-start">
          <div class="col-3">
            <img src="${item.products.image_url || './images/products/deli-2880w.jpg'}" class="img-fluid rounded-start" alt="${item.products.name}">
          </div>
          <div class="col-6">
            <div class="card-body p-2">
              <h6 class="card-title mb-0">${item.products.name}</h6>
            </div>
          </div>
          <div class="col-3 text-end p-2">
            <p class="price-xqty fw-bold mb-1">
              £${item.products.price.toFixed(2)} × ${item.quantity}
            </p>
            <small class="line-total">
              Total £${(item.products.price * item.quantity).toFixed(2)}
            </small>
          </div>
        </div>
      </a>
    `;

    container.appendChild(card);
  });

  // مجموع کل در انتها
  const totalEl = document.getElementById('checkout-total');
  if (totalEl) totalEl.textContent = `£${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', renderCheckoutItems);


// ===============================
// 💳 پاپ‌آپ و فرم پرداخت با انیمیشن نرم (zoom in/out)
// ===============================
const form = document.getElementById("checkout-form");
const popup = document.getElementById("demoPopup");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closePopup");

function clearForm() {
  if (!form) return;
  form.reset();
  form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
    el.classList.remove('is-valid', 'is-invalid');
  });
}

// باز شدن پاپ‌آپ با افکت آرام
form.addEventListener("submit", (e) => {
  e.preventDefault();
  popup.classList.add("show");
  overlay.classList.add("show");
});

// بستن پاپ‌آپ با افکت آرام
function closePopup() {
  popup.classList.remove("show");
  overlay.classList.remove("show");
  clearForm();
}

closeBtn.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);
