




// import { supabase } from './supabaseClient.js';
// import { updateBasketUI } from './basket-box.js';

// // برای کوتاه کردن متن (truncateText)
// function truncateText(text, maxLength) {
//   if (!text) return "";
//   return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
// }

// // ایجاد کارت محصول (فقط لینک به صفحه معرفی محصول)
// function createProductCard(product, labelText) {
//   const div = document.createElement('div');
//   div.className = 'col-md-6 col-lg-3 mb-4';
//   div.innerHTML = `
//     <a href="product.html?id=${product.id}" class="related-products__card-link text-decoration-none">
//       <div class="related-products__card shadow-sm h-100">
//         <img src="${product.image_url || 'images/products/placeholder.webp'}" 
//              class="img-fluid related-products__card-img" 
//              alt="${product.name}">
//         <div class="related-products__card-meta">
//           <ul>
//             <li class="related-products__card-seller">${labelText}</li>
//             <li class="related-products__card-rating"><i class="fa-solid fa-star"></i> ${product.rating || "4.5"}</li>
//           </ul>
//         </div>
//         <div class="related-products__card-body text-center">
//           <h5 class="related-products__card-title">${product.name}</h5>
//           <p class="related-products__card-text">${truncateText(product.description, 50)}</p>
//           <span class="related-products__card-price text-danger fw-bold">
//             $${product.price || "0.00"}
//           </span>
//         </div>
//       </div>
//     </a>
//   `;
//   return div;
// }

// document.addEventListener('DOMContentLoaded', async () => {
//   const sections = {
//     "special-offers": "Special Offers",
//     "new-arrivals": "New Arrivals",
//     "best-sellers": "Best Sellers",
//     "discounted-products": "Discounted Products",
//     "organic-healthy-products": "Organic & Healthy Products",
//     "products-with-unique-features": "Products with Unique Features"
//   };

//   const urlParams = new URLSearchParams(window.location.search);
//   const selectedType = urlParams.get('type');

//   // کنترل نمایش بخش‌ها بر اساس پارامتر type
//   for (const [sectionId, label] of Object.entries(sections)) {
//     const sectionElement = document.getElementById(sectionId);
//     if (!sectionElement) continue;

//     if (selectedType && selectedType !== sectionId) {
//       sectionElement.style.display = 'none';
//     } else {
//       sectionElement.style.display = 'block';
//     }
//   }

//   // بارگذاری محصولات فقط برای بخش‌های نمایش داده شده
//   for (const [sectionId, label] of Object.entries(sections)) {
//     const sectionElement = document.getElementById(sectionId);
//     if (!sectionElement || sectionElement.style.display === 'none') continue;

//     const { data: group, error: groupError } = await supabase
//       .from('featured_groups')
//       .select('id')
//       .eq('slug', sectionId)
//       .single();

//     if (groupError || !group) {
//       console.warn(`Group not found: ${sectionId}`);
//       continue;
//     }

//     const { data: products, error: prodError } = await supabase
//       .from('featured_group_products')
//       .select('product_id, products(id, name, description, price, image_url)')
//       .eq('featured_group_id', group.id);

//     if (prodError) {
//       console.error(`Error loading products for ${sectionId}`, prodError);
//       continue;
//     }

//     const container = sectionElement.querySelector('.products-container');
//     if (!container) continue;

//     container.innerHTML = '';

//     products.forEach(item => {
//       const product = item.products;
//       product.rating = (3 + Math.random() * 2).toFixed(1);
//       const card = createProductCard(product, label);
//       container.appendChild(card);
//     });
//   }
// });

// // --- لود باکس سبد خرید ---
// document.addEventListener('DOMContentLoaded', function () {
//   fetch('basket-box.html')
//     .then(res => res.text())
//     .then(data => {
//       const container = document.getElementById('basket-box-container');
//       if (container) {
//         container.innerHTML = data;
//         updateBasketUI(); // نمایش وضعیت سبد بعد از لود
//       }
//     });
// });





import { supabase } from './supabaseClient.js';
import { updateBasketUI } from './basket-box.js';

// --- تابع کمکی: کوتاه کردن متن ---
function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// --- ایجاد کارت محصول ---
function createProductCard(product, labelText) {
  const div = document.createElement('div');
  div.className = 'col-md-6 col-lg-3 mb-4';
  div.innerHTML = `
    <a href="product.html?id=${product.id}" class="related-products__card-link text-decoration-none">
      <div class="related-products__card shadow-sm h-100">
        <img src="${product.image_url || 'images/products/placeholder.webp'}" 
             class="img-fluid related-products__card-img" 
             alt="${product.name}">
        <div class="related-products__card-meta">
          <ul>
            <li class="related-products__card-seller">${labelText}</li>
            <li class="related-products__card-rating"><i class="fa-solid fa-star"></i> ${product.rating || "4.5"}</li>
          </ul>
        </div>
        <div class="related-products__card-body text-center">
          <h5 class="related-products__card-title">${product.name}</h5>
          <p class="related-products__card-text">${truncateText(product.description, 50)}</p>
          <span class="related-products__card-price text-danger fw-bold">
            $${product.price || "0.00"}
          </span>
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

  products.forEach(item => {
    const product = item.products;
    product.rating = (3 + Math.random() * 2).toFixed(1);
    const card = createProductCard(product, label);
    container.appendChild(card);
  });
}

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
  loadBasketBox();
});
