// import { supabase } from './supabaseClient.js';
// import { updateHeaderUserInfo } from './user-header.js';

// document.addEventListener('DOMContentLoaded', () => {
//   updateHeaderUserInfo();
// });

// // ---- تنظیمات عمومی ----
// const LOCALE = 'en-GB';
// const DEFAULT_CURRENCY = 'USD';
// const FALLBACK_IMG = 'images/products/placeholder.webp';

// // مپ زیرمنوها به id کانتینر داخل HTML
// const SECTIONS = [
//   { subcategory: 'Special Offers',  containerId: 'special-offers-products' },
//   { subcategory: 'New Arrivals',    containerId: 'new-arrivals-products' },
//   { subcategory: 'Best Sellers',    containerId: 'best-sellers-products' },
//   { subcategory: 'Discounted Products', containerId: 'discounted-products-products' },
// ];

// // ابزارک: فرمت قیمت
// function formatPrice(value, currency = DEFAULT_CURRENCY) {
//   if (value == null || isNaN(Number(value))) return '';
//   try {
//     return new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).format(Number(value));
//   } catch {
//     return `${Number(value).toLocaleString(LOCALE)} ${currency}`;
//   }
// }

// // اسکلت لودینگ ساده
// function renderSkeletonCards(count = 4) {
//   const frag = document.createDocumentFragment();
//   for (let i = 0; i < count; i++) {
//     const col = document.createElement('div');
//     col.className = 'col-lg-6 col-md-6 col-sm-12 mb-3';
//     col.innerHTML = `
//       <div class="product-box d-flex align-items-center p-2 border rounded shadow-sm" aria-busy="true">
//         <div class="col-7 ps-2 product-box__detiles">
//           <span class="product-box__detiles-header placeholder-wave d-block" style="height:14px"></span>
//           <span class="product-box__detiles-title placeholder-wave d-block mt-2" style="height:18px"></span>
//           <p class="product-box__detiles-info placeholder-wave d-block mt-2" style="height:12px"></p>
//           <span class="product-box__detiles-price placeholder-wave d-block mt-2" style="height:16px"></span>
//         </div>
//         <div class="col-5 product-box__img">
//           <div class="w-100 ratio ratio-1x1 placeholder-wave" style="border-radius:8px;"></div>
//         </div>
//       </div>
//     `;
//     frag.appendChild(col);
//   }
//   return frag;
// }

// // کوتاه کردن متن
// function truncateText(text, maxLength = 50) {
//   if (!text) return '';
//   return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
// }

// // ایجاد کارت محصول با ظاهر جدید
// function createProductCard(item) {
//   const div = document.createElement('div');
//   div.className = 'col-md-6 col-lg-3 mb-4';
//   div.innerHTML = `
//     <a href="/product/${item.slug || item.id}" class="related-products__card-link text-decoration-none">
//       <div class="related-products__card shadow-sm h-100">
//         <img src="${item.image_url || FALLBACK_IMG}" 
//              class="img-fluid related-products__card-img" 
//              alt="${item.name}">
//         <div class="related-products__card-meta">
//           <ul>
//             <li class="related-products__card-rating"><i class="fa-solid fa-star"></i> ${item.rating || "4.5"}</li>
//           </ul>
//         </div>
//         <div class="related-products__card-body text-center">
//           <h5 class="related-products__card-title">${item.name}</h5>
//           <p class="related-products__card-text">${truncateText(item.description, 50)}</p>
//           <span class="related-products__card-price text-danger fw-bold">
//             ${formatPrice(item.price, item.currency)}
//           </span>
//         </div>
//       </div>
//     </a>
//   `;
//   return div;
// }

// // بارگذاری محصولات از Supabase
// async function loadProductsBySubcategory(subcategoryName, containerId, limit = 8) {
//   const container = document.getElementById(containerId);
//   if (!container) return;

//   container.innerHTML = '';
//   container.appendChild(renderSkeletonCards(Math.min(limit, 6)));

// const { data, error } = await supabase.from('products').select('*').limit(5);
// console.log("All products:", data, "Error:", error);


//   container.innerHTML = '';

//   if (error) {
//     console.error(`[Supabase] ${subcategoryName} error:`, error);
//     container.innerHTML = `
//       <div class="col-12">
//         <div class="alert alert-warning mb-0">مشکلی در بارگذاری «${subcategoryName}» پیش آمد.</div>
//       </div>`;
//     return;
//   }

//   if (!data || data.length === 0) {
//     container.innerHTML = `
//       <div class="col-12">
//         <div class="alert alert-info mb-0">فعلاً محصولی در «${subcategoryName}» موجود نیست.</div>
//       </div>`;
//     return;
//   }

//   const frag = document.createDocumentFragment();
//   data
//     .filter(p => p?.is_active !== false)
//     .forEach(item => frag.appendChild(createProductCard(item)));
//   container.appendChild(frag);
// }

// // هندل دکمه‌های افزودن به سبد
// document.addEventListener('click', async (e) => {
//   const btn = e.target.closest('.add-to-cart');
//   if (!btn) return;
//   const productId = btn.dataset.id;
//   try {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     cart.push({ product_id: productId, qty: 1 });
//     localStorage.setItem('cart', JSON.stringify(cart));
//     btn.innerHTML = '<i class="bi bi-check2"></i> Added';
//     btn.disabled = true;
//   } catch (err) {
//     console.error('Add to cart error:', err);
//   }
// });

// // اجرای همه سکشن‌ها
// async function initHomeSections() {
//   for (const s of SECTIONS) {
//     await loadProductsBySubcategory(s.subcategory, s.containerId, 8);
//   }
// }

// // شروع
// initHomeSections();
