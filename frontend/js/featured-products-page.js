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
  const div = document.createElement('div');
  const isSlider = sectionId === 'special-offers' || sectionId === 'best-sellers';

  if (isSlider) {
    div.classList.add('swiper-slide');
  } else {
    div.className = 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4';
  }

  div.innerHTML = `
    <a href="product.html?id=${product.id}" class="related-products__card-link text-decoration-none">
      <div class="related-products__card shadow-sm h-100"
           data-aos="zoom-out-up"
           data-aos-delay="10"
           data-aos-duration="800"
           data-aos-easing="ease-in-out">
        <div class="related-products__card-img-wrapper">
          <img src="${product.image_url || 'images/products/placeholder.webp'}"
               class="img-fluid related-products__card-img"
               alt="${product.name}">
          <div class="related-products__card-seller">${labelText}</div>
          <div class="related-products__card-rating">
            <i class="fa-solid fa-star"></i> ${product.rating || "4.5"}
          </div>
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

  if (groupError || !group) return;

  const { data: products, error: prodError } = await supabase
    .from('featured_group_products')
    .select('product_id, products(id, name, description, price, image_url, rating)')
    .eq('featured_group_id', group.id);

  if (prodError) return;

  const container = sectionElement.querySelector('.products-container');
  if (!container) return;
  container.innerHTML = '';

  products.forEach(item => {
    const product = item.products;
    const card = createProductCard(product, label, sectionId);
    container.appendChild(card);
  });

  if (sectionId === 'special-offers' || sectionId === 'best-sellers') {
    initSwiper(sectionId);
  }
}

// --- مقداردهی اولیه Swiper ---
function initSwiper(sectionId) {
  let selector = '';
  if (sectionId === 'special-offers') selector = '.mySwiper';
  if (sectionId === 'best-sellers') selector = '.mySwiper-bestsellers';
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
      576: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 24 },
      992: { slidesPerView: 4, spaceBetween: 24 },
      1200: { slidesPerView: 4, spaceBetween: 24 },
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

  toggleSections(sections, selectedType);

  for (const [sectionId, label] of Object.entries(sections)) {
    await loadProductsForSection(sectionId, label);
  }
});
