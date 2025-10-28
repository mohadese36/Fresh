

////////////////////////////////////////

import { supabase } from './supabaseClient.js';
import { updateHeaderUserInfo } from './user-header.js';

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUserInfo();
});

// --- تابع کمکی: کوتاه کردن متن ---
function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// --- ایجاد کارت محصول ---
function createProductCard(product, labelText, sectionId) {
  // ✅ فقط در کارت‌ها ساخته بشه
  const div = document.createElement('div');

  // اگر سکشن اسلایدر باشه، swiper-slide
  if (sectionId === 'special-offers' || sectionId === 'best-sellers') {
    div.classList.add('swiper-slide');
  } else {
    div.className = 'col-md-6 col-lg-3 mb-4';
  }

  // 🧠 فقط داخل related-products__card المان‌ها اضافه بشن
  div.innerHTML = `
    <a href="product.html?id=${product.id}" class="related-products__card-link text-decoration-none">
      <div class="related-products__card shadow-sm h-100">
        <div class="related-products__card-img-wrapper">
          <img src="${product.image_url || 'images/products/placeholder.webp'}"
               class="img-fluid related-products__card-img"
               alt="${product.name}">
          
          <div class="related-products__card-seller">${labelText}</div>
          <div class="related-products__card-rating"><i class="fa-solid fa-star"></i> ${product.rating || "4.5"}</div>
        </div>

        <div class="related-products__card-body text-center">
          <h5 class="related-products__card-title">${product.name}</h5>
          <p class="related-products__card-text">${truncateText(product.description, 50)}</p>
          <span class="related-products__card-price text-danger fw-bold">$${product.price || "0.00"}</span>
        </div>
      </div>
    </a>
  `;

  return div;
}


// --- نمایش/مخفی کردن سکشن‌ها ---
function toggleSections(sections, selectedType) {
  for (const [sectionId] of Object.entries(sections)) {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) continue;
    sectionElement.style.display =
      selectedType && selectedType !== sectionId ? 'none' : 'block';
  }
}

// --- بارگذاری محصولات هر گروه ---
async function loadProductsForSection(sectionId, label) {
  const sectionElement = document.getElementById(sectionId);
  if (!sectionElement || sectionElement.style.display === 'none') return;

  const { data: group, error: groupError } = await supabase
    .from('featured_groups')
    .select('id')
    .eq('slug', sectionId)
    .single();

  if (groupError || !group) {
    console.warn(`Group not found: ${sectionId}`);
    return;
  }

  const { data: products, error: prodError } = await supabase
    .from('featured_group_products')
    .select('product_id, products(id, name, description, price, image_url)')
    .eq('featured_group_id', group.id);

  if (prodError) {
    console.error(`Error loading products for ${sectionId}`, prodError);
    return;
  }

  const container = sectionElement.querySelector('.products-container');
  if (!container) return;

  container.innerHTML = '';

  // ایجاد کارت محصول
  products.forEach(item => {
    const product = item.products;
    const card = createProductCard(product, label, sectionId);
    container.appendChild(card);
  });

  // ✅ بعد از لود شدن محصولات، Swiper رو فعال کن (فقط برای دو سکشن خاص)
  if (sectionId === 'special-offers' || sectionId === 'best-sellers') {
    initSwiper(sectionId);
  }
}

// 🔁 Global متغیر نگهدارنده

function initSwiper(sectionId) {
  let selector = '';
  if (sectionId === 'special-offers') selector = '.mySwiper';
  if (sectionId === 'best-sellers') selector = '.mySwiper-bestsellers'; // ✅ اضافه شد
  if (!selector) return;

  new Swiper(selector, {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    pagination: {
      el: `${selector} .swiper-pagination`,
      clickable: true,
    },
    autoplay: {
      delay: 2800,
      disableOnInteraction: false,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    }
  });
}
// document.addEventListener("DOMContentLoaded", () => {
//   initSwiper('special-offers');
//   initSwiper('best-sellers'); // ✅ اضافه شد
// });

// window.addEventListener('resize', () => {
//   initSwiper('special-offers');
//   initSwiper('best-sellers'); // ✅ اضافه شد
// });



// --- بارگذاری باکس سبد خرید ---
function loadBasketBox() {
  fetch('basket-box.html')
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById('basket-box-container');
      if (container) {
        container.innerHTML = data;
        updateBasketUI();
      }
    });
}

// --- شروع ---
document.addEventListener('DOMContentLoaded', async () => {
  const sections = {
    "special-offers": "Special Offers",
    "new-arrivals": "New Arrivals",
    "best-sellers": "Best Sellers",
    "discounted-products": "Discounted Products",
    "organic-healthy-products": "Organic & Healthy Products",
    "products-with-unique-features": "Products with Unique Features"
  };

  const urlParams = new URLSearchParams(window.location.search);
  const selectedType = urlParams.get('type');

  // ۱. مدیریت نمایش بخش‌ها
  toggleSections(sections, selectedType);

  // ۲. بارگذاری محصولات
  for (const [sectionId, label] of Object.entries(sections)) {
    await loadProductsForSection(sectionId, label);
  }

  // ۳. لود باکس سبد خرید
  // loadBasketBox();
});


//////

// === 🎠 New Arrivals Carousel (Final Version) ===
