import { supabase } from './supabaseClient.js';

const GUEST_USER_ID = 'guest';

async function renderCheckoutItems() {
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
    card.innerHTML = `
      <div class="row g-0 align-items-start">
        <!-- تصویر -->
        <div class="col-3">
          <img src="${item.products.image_url}" class="img-fluid rounded-start" alt="${item.products.name}">
        </div>

        <!-- فقط نام محصول -->
        <div class="col-6">
          <div class="card-body p-2">
            <h6 class="card-title mb-0">${item.products.name}</h6>
          </div>
        </div>

        <!-- راست: £price × qty و زیرش Total -->
        <div class="col-3 text-end p-2">
          <p class="price-xqty fw-bold mb-1">
            £${item.products.price.toFixed(2)} × ${item.quantity}
          </p>
          <small class="line-total">
            Total £${(item.products.price * item.quantity).toFixed(2)}
          </small>
        </div>
      </div>
    `;



    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderCheckoutItems);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// گرفتن ارجاعات
const form = document.getElementById("checkout-form");
const popup = document.getElementById("demoPopup");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closePopup");

// تابع پاک‌سازی فرم
function clearForm() {
  if (!form) return;
  form.reset(); // همه input/textarea ها به حالت اولیه (خالی) برمی‌گردند
  // اگر از Bootstrap validation استفاده می‌کنی، این کلاس‌ها هم پاک شوند:
  form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
    el.classList.remove('is-valid', 'is-invalid');
  });
}

// ارسال فرم → فقط پاپ‌آپ را نشان بده
form.addEventListener("submit", (e) => {
  e.preventDefault();
  popup.style.display = "block";
  overlay.style.display = "block";
});

// دکمه OK در پاپ‌آپ
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  overlay.style.display = "none";
  clearForm();                 // ←ــــ این خط فرم را خالی می‌کند
});

// کلیک روی بیرونِ پاپ‌آپ (اختیاری: اگر می‌خواهی با این هم فرم خالی شود، clearForm را اضافه کن)
overlay.addEventListener("click", () => {
  popup.style.display = "none";
  overlay.style.display = "none";
  // clearForm();              // ← در صورت تمایل فعال کن
});
