// // categori.js — Archive + Search + Filters + Chips + Skeleton (DROP-IN)

// // ========== Imports ==========
// import { updateHeaderUserInfo } from './user-header.js';
// import { supabase } from './supabaseClient.js';
// import { addItemToBasket } from './basket-box.js';

// // ========== Small Helpers ==========
// function getCategorySlugFromURL() {
//   const params = new URLSearchParams(window.location.search);
//   return params.get('category');
// }
// function getSearchQueryFromURL() {
//   const params = new URLSearchParams(window.location.search);
//   return (params.get('search') || '').trim();
// }
// function pickRandomProducts(arr, count) {
//   if (!arr || arr.length === 0) return [];
//   const shuffled = [...arr].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }
// function fixImageUrl(url) {
//   if (!url) return 'images/products/placeholder.jpg';
//   if (url.startsWith('http')) return url;
//   const base = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co/storage/v1/object/public/product-images/';
//   return base + url;
// }
// function escapeLike(s) {
//   return s.replace(/([%_\\])/g, '\\$1');
// }
// // ابتدای نام + ابتدای هر کلمه بعد از جداکننده‌های رایج
// function buildOrForWordPrefix(column, q) {
//   const seps = [' ', '-', '_', '/', '('];
//   const patterns = [`${q}%`, ...seps.map(sep => `%${sep}${q}%`)];
//   return patterns.map(p => `${column}.ilike.${p}`).join(',');
// }

// // ========== Filters & Sort ==========
// function getUrlFilterParams() {
//   const p = new URLSearchParams(location.search);
//   return {
//     sort: p.get('sort') || '',                    // price_asc | price_desc | name_asc | name_desc | ''
//     min:  p.get('min') ? parseFloat(p.get('min')) : NaN,
//     max:  p.get('max') ? parseFloat(p.get('max')) : NaN,
//     stockOnly: p.get('stock') === '1',
//   };
// }
// function applyFilters(query, { min, max, stockOnly }) {
//   if (!isNaN(min))      query = query.gte('price', min);
//   if (!isNaN(max))      query = query.lte('price', max);
//   if (stockOnly)        query = query.gt('stock', 0);
//   return query;
// }
// function applySort(query, sort) {
//   switch (sort) {
//     case 'price_asc':  return query.order('price', { ascending: true  });
//     case 'price_desc': return query.order('price', { ascending: false });
//     case 'name_asc':   return query.order('name',  { ascending: true  });
//     case 'name_desc':  return query.order('name',  { ascending: false });
//     default:           return query.order('id');
//   }
// }

// // ========== Sidebar wiring (Search/Filters → URL) ==========
// function wireSidebar() {
//   // Search form → categori.html?search=...
//   const form = document.getElementById('archive-search');
//   const qInput = document.getElementById('archive-q');
//   if (form && qInput) {
//     const urlQ = new URLSearchParams(location.search).get('search');
//     if (urlQ) qInput.value = urlQ;
//     form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       const q = qInput.value.trim();
//       const params = new URLSearchParams(location.search);
//       if (q) params.set('search', q); else params.delete('search');
//       params.delete('page');
//       location.href = `categori.html?${params.toString()}`;
//     });
//   }

//   // Sort & filters → URL params
//   const sortSel = document.getElementById('sort');
//   const minP = document.getElementById('minPrice');
//   const maxP = document.getElementById('maxPrice');
//   const inStock = document.getElementById('inStock');
//   const applyBtn = document.getElementById('applyFilters');

//   const p = new URLSearchParams(location.search);
//   if (sortSel) sortSel.value = p.get('sort') || '';
//   if (minP)    minP.value   = p.get('min')  || '';
//   if (maxP)    maxP.value   = p.get('max')  || '';
//   if (inStock) inStock.checked = p.get('stock') === '1';

//   applyBtn?.addEventListener('click', () => {
//     const params = new URLSearchParams(location.search);
//     sortSel?.value ? params.set('sort', sortSel.value) : params.delete('sort');
//     minP?.value    ? params.set('min',  minP.value)    : params.delete('min');
//     maxP?.value    ? params.set('max',  maxP.value)    : params.delete('max');
//     inStock?.checked ? params.set('stock', '1')        : params.delete('stock');
//     params.delete('page');
//     location.href = `categori.html?${params.toString()}`;
//   });
// }

// // ========== Categories list with counts ==========
// async function loadCategoriesWithCounts() {
//   const list = document.getElementById('cats-list');
//   if (!list) return;

//   const { data: cats, error: catErr } = await supabase
//     .from('categories')
//     .select('id, name, slug')
//     .order('name', { ascending: true });

//   if (catErr) {
//     console.error('categories load error', catErr);
//     return;
//   }

//   const items = await Promise.all(
//     (cats || []).map(async (cat) => {
//       const { count } = await supabase
//         .from('products')
//         .select('id', { count: 'exact', head: true })
//         .eq('category_id', cat.id);
//       return { ...cat, count: count || 0 };
//     })
//   );

//   list.innerHTML = items.map(cat => `
//     <li class="list-group-item d-flex justify-content-between align-items-center">
//       <a class="d-block text-decoration-none" href="categori.html?category=${encodeURIComponent(cat.slug)}">${cat.name}</a>
//       <span class="badge bg-light text-dark">${cat.count}</span>
//     </li>
//   `).join('');
// }

// // ========== Skeleton Loading ==========
// function showSkeleton(count = 8) {
//   const container = document.getElementById('products-container');
//   if (!container) return;
//   const cards = Array.from({ length: count }).map(() => `
//     <div class="skel-card">
//       <div class="skel-img"></div>
//       <div class="skel-line w90"></div>
//       <div class="skel-line w70"></div>
//       <div class="skel-line w50"></div>
//     </div>
//   `).join('');
//   container.innerHTML = `<div class="skel-grid">${cards}</div>`;
// }

// // ========== Filter Chips ==========
// async function renderFilterChips(ctx = {}) {
//   const wrap = document.getElementById('active-filters');
//   if (!wrap) return;

//   const p = new URLSearchParams(location.search);
//   const chips = [];

//   const search = p.get('search');
//   if (search) chips.push({ key: 'search', label: `Search: "${search}"` });

//   let catName = ctx.categoryName;
//   const catSlug = p.get('category');
//   if (catSlug) {
//     if (!catName) {
//       const { data } = await supabase.from('categories').select('name').eq('slug', catSlug).maybeSingle();
//       catName = data?.name || catSlug;
//     }
//     chips.push({ key: 'category', label: `Category: ${catName}` });
//   }

//   const min = p.get('min'); if (min) chips.push({ key: 'min', label: `Min £${min}` });
//   const max = p.get('max'); if (max) chips.push({ key: 'max', label: `Max £${max}` });
//   if (p.get('stock') === '1') chips.push({ key: 'stock', label: 'In stock' });

//   const sortMap = { price_asc:'Price ↑', price_desc:'Price ↓', name_asc:'Name A→Z', name_desc:'Name Z→A' };
//   const sort = p.get('sort'); if (sort) chips.push({ key: 'sort', label: `Sort: ${sortMap[sort] || sort}` });

//   if (!chips.length) { wrap.innerHTML = ''; return; }

//   wrap.innerHTML =
//     chips.map(c => `<button class="chip" data-key="${c.key}">${c.label}<span class="chip-x">×</span></button>`).join('') +
//     `<button class="chip chip--clear" data-key="__clear">Clear all</button>`;

//   wrap.querySelectorAll('.chip').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const key = btn.dataset.key;
//       const params = new URLSearchParams(location.search);
//       const toClear = ['search','category','min','max','stock','sort','page'];
//       if (key === '__clear') toClear.forEach(k => params.delete(k));
//       else { params.delete(key); params.delete('page'); }
//       location.href = `categori.html?${params.toString()}`;
//     });
//   });
// }

// // ========== Rendering ==========
// function renderGroupedProducts(grouped, headingOverride) {
//   const container = document.getElementById('products-container');
//   container.innerHTML = '';

//   if (headingOverride) {
//     const h = document.createElement('h2');
//     h.className = 'product-category';
//     h.textContent = headingOverride;
//     container.appendChild(h);
//   }

//   for (const categoryName in grouped) {
//     const section = document.createElement('div');
//     section.classList.add('product-boxes');

//     section.innerHTML = `
//       ${headingOverride ? '' : `<h2 class="product-category">${categoryName}</h2>`}
//       <div class="row">
//         ${(grouped[categoryName] || []).map(prod => `
//           <div class="col-md-6 col-lg-4 mb-4">
//             <a href="product.html?id=${prod.id}" class="related-products__card-link text-decoration-none">
//               <div class="product-box__main shadow-sm h-100">
//                 <img src="${fixImageUrl(prod.image_url)}" alt="${prod.name}" class="img-fluid related-products__card-img">
//                 <div class="col-12 ps-2 product-box__detiles">
//                   <a class="product-box__detiles-title">${prod.name}</a>
//                   <p class="product-box__detiles-info">${prod.features || ''}</p>
//                   <p class="product-box__detiles-info">£${parseFloat(prod.price || 0).toFixed(2)}/kg</p>
//                   <button
//                     class="add-to-cart-btn"
//                     data-product-id="${prod.id}"
//                     data-product-name="${prod.name}"
//                     data-product-price="${prod.price}">
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//               <div class="product-box__footer"></div>
//             </a>
//           </div>
//         `).join('')}
//       </div>
//     `;

//     container.appendChild(section);
//   }

//   // Add to Cart handlers
//   container.querySelectorAll('.add-to-cart-btn').forEach(button => {
//     button.addEventListener('click', (e) => {
//       e.preventDefault();
//       const product = {
//         id: button.dataset.productId,
//         name: button.dataset.productName,
//         price: parseFloat(button.dataset.productPrice),
//         quantity: 1
//       };
//       addItemToBasket(product);
//     });
//   });
// }

// // ========== Data Loader ==========
// async function fetchProducts() {
//   // --- دقیقا همین‌جاست که اسکلتون را قبل از درخواست‌ها نشان می‌دهیم
//   showSkeleton(8);

//   const params = new URLSearchParams(window.location.search);
//   const searchQ      = (params.get('search') || '').trim();
//   const categorySlug = params.get('category');
//   const { sort, min, max, stockOnly } = getUrlFilterParams();

//   const selectCols = `
//     id, name, description, features, price, stock, image_url, category_id,
//     category:category_id (id, name, slug)
//   `;

//   // ===== حالت جستجو =====
//   if (searchQ) {
//     const escaped = escapeLike(searchQ);
//     let query = supabase.from('products').select(selectCols).or(buildOrForWordPrefix('name', escaped));
//     query = applyFilters(query, { min, max, stockOnly });
//     query = applySort(query, sort);

//     const { data: results, error } = await query;
//     if (error) {
//       console.error('Search error:', error);
//       renderGroupedProducts({ 'Search Results': [] }, `0 results for "${searchQ}"`);
//       await renderFilterChips();
//       return;
//     }
//     const list = results || [];
//     renderGroupedProducts({ 'Search Results': list }, `${list.length} result${list.length === 1 ? '' : 's'} for "${searchQ}"`);
//     await renderFilterChips();
//     return;
//   }

//   // ===== آرشیو یک دسته =====
//   if (categorySlug) {
//     const { data: categories, error: catError } = await supabase
//       .from('categories')
//       .select('id, name, slug')
//       .eq('slug', categorySlug)
//       .limit(1);

//     if (catError || !categories || categories.length === 0) {
//       console.error('Category not found');
//       renderGroupedProducts({ '': [] }, 'No products found');
//       await renderFilterChips();
//       return;
//     }

//     const category = categories[0];

//     let mainQ = supabase.from('products').select(selectCols).eq('category_id', category.id);
//     mainQ = applyFilters(mainQ, { min, max, stockOnly });
//     mainQ = applySort(mainQ, sort);

//     const { data: mainProducts, error: mainErr } = await mainQ;
//     if (mainErr) {
//       console.error(mainErr);
//       renderGroupedProducts({ [category.name]: [] });
//       await renderFilterChips({ categoryName: category.name });
//       return;
//     }

//     const { data: featData } = await supabase
//       .from('featured_group_products')
//       .select('products(id, name, description, features, price, image_url, category_id, category:category_id(id, name, slug))');

//     const featuredProducts = featData ? featData.map(f => f.products) : [];
//     const randomFeatured = pickRandomProducts(featuredProducts, 3);
//     const allProducts = [...(mainProducts || []), ...randomFeatured];

//     renderGroupedProducts({ [category.name]: allProducts });
//     await renderFilterChips({ categoryName: category.name });
//     return;
//   }

//   // ===== آرشیو کامل Products =====
//   const { data: allCategories } = await supabase
//     .from('categories')
//     .select('id, name, slug');

//   let listQ = supabase.from('products').select(selectCols);
//   listQ = applyFilters(listQ, { min, max, stockOnly });
//   listQ = applySort(listQ, sort);

//   const { data: productsData, error: listErr } = await listQ;
//   if (listErr) {
//     console.error(listErr);
//     renderGroupedProducts({ '': [] }, 'No products found');
//     await renderFilterChips();
//     return;
//   }

//   const { data: featData } = await supabase
//     .from('featured_group_products')
//     .select('products(id, name, description, features, price, image_url, category_id, category:category_id(id, name, slug))');

//   const featuredProducts = featData ? featData.map(f => f.products) : [];

//   const grouped = {};
//   (allCategories || []).forEach(cat => {
//     grouped[cat.name] = (productsData || []).filter(p => p.category_id === cat.id);
//     const randomFeatured = pickRandomProducts(featuredProducts, Math.floor(Math.random() * 4) + 1);
//     grouped[cat.name] = [...grouped[cat.name], ...randomFeatured];
//   });

//   renderGroupedProducts(grouped);
//   await renderFilterChips();
// }

// // ========== Boot ==========
// document.addEventListener('DOMContentLoaded', () => {
//   updateHeaderUserInfo();
//   wireSidebar();
//   loadCategoriesWithCounts();
//   fetchProducts();

//   // (اختیاری) لود باکس سبد خرید
//   fetch('basket-box.html')
//     .then(res => res.text())
//     .then(data => {
//       const container = document.getElementById('basket-box-container');
//       if (container) {
//         container.innerHTML = data;
//         // اگر updateBasketUI را global کردی، اینجا می‌تونی صدا بزنی.
//       }
//     });
// });


// categori.js — Archive + Search + Filters + Chips + Skeleton + Sidebar Align

import { updateHeaderUserInfo } from './user-header.js';
import { supabase } from './supabaseClient.js';
import { addItemToBasket, updateBasketUI } from './basket-box.js';

// ---------- Helpers ----------
function getSearchQueryFromURL() {
  return (new URLSearchParams(location.search).get('search') || '').trim();
}
function getCategorySlugFromURL() {
  return new URLSearchParams(location.search).get('category');
}
function pickRandomProducts(arr, count) {
  if (!arr?.length) return [];
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count); // ← اصلاح شد
}
function fixImageUrl(url) {
  if (!url) return 'images/products/placeholder.jpg';
  if (url.startsWith('http')) return url;
  const base = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co/storage/v1/object/public/product-images/';
  return base + url;
}
function escapeLike(s) {
  return s.replace(/([%_\\])/g, '\\$1');
}
function buildOrForWordPrefix(column, q) {
  const seps = [' ', '-', '_', '/', '('];
  const patterns = [`${q}%`, ...seps.map(sep => `%${sep}${q}%`)];
  return patterns.map(p => `${column}.ilike.${p}`).join(',');
}

// --- align sidebars with grid head (title + chips)
function alignSidebarsWithGrid() {
  const wrap = document.querySelector('.products-wrapper');
  if (!wrap) return;
  const firstHead = document.querySelector('.product-category'); // عنوان دسته/سرچ
  const chips = document.getElementById('active-filters');      // چیپس فیلتر
  const h = (firstHead?.offsetHeight || 0) + (chips?.offsetHeight || 0);
  wrap.style.setProperty('--grid-head-h', h + 'px');
}

// ---------- Filters & Sort ----------
function getUrlFilterParams() {
  const p = new URLSearchParams(location.search);
  return {
    sort: p.get('sort') || '',
    min:  p.get('min') ? parseFloat(p.get('min')) : NaN,
    max:  p.get('max') ? parseFloat(p.get('max')) : NaN,
    stockOnly: p.get('stock') === '1',
  };
}
function applyFilters(q, { min, max, stockOnly }) {
  if (!isNaN(min)) q = q.gte('price', min);
  if (!isNaN(max)) q = q.lte('price', max);
  if (stockOnly)   q = q.gt('stock', 0);
  return q;
}
function applySort(q, sort) {
  switch (sort) {
    case 'price_asc':  return q.order('price', { ascending: true  });
    case 'price_desc': return q.order('price', { ascending: false });
    case 'name_asc':   return q.order('name',  { ascending: true  });
    case 'name_desc':  return q.order('name',  { ascending: false });
    default:           return q.order('id');
  }
}

// ---------- Sidebar wiring ----------
function wireSidebar() {
  // Search → URL
  const form   = document.getElementById('archive-search');
  const qInput = document.getElementById('archive-q');
  if (form && qInput) {
    const urlQ = new URLSearchParams(location.search).get('search');
    if (urlQ) qInput.value = urlQ;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = qInput.value.trim();
      const params = new URLSearchParams(location.search);
      if (q) params.set('search', q); else params.delete('search');
      params.delete('page');
      location.href = `categori.html?${params.toString()}`;
    });
  }

  // Sort/Filters → URL
  const sortSel = document.getElementById('sort');
  const minP    = document.getElementById('minPrice');
  const maxP    = document.getElementById('maxPrice');
  const inStock = document.getElementById('inStock');
  const applyBtn= document.getElementById('applyFilters');

  const p = new URLSearchParams(location.search);
  if (sortSel) sortSel.value = p.get('sort') || '';
  if (minP)    minP.value    = p.get('min')  || '';
  if (maxP)    maxP.value    = p.get('max')  || '';
  if (inStock) inStock.checked = (p.get('stock') === '1');

  applyBtn?.addEventListener('click', () => {
    const params = new URLSearchParams(location.search);
    sortSel?.value    ? params.set('sort', sortSel.value) : params.delete('sort');
    minP?.value       ? params.set('min',  minP.value)     : params.delete('min');
    maxP?.value       ? params.set('max',  maxP.value)     : params.delete('max');
    inStock?.checked  ? params.set('stock','1')            : params.delete('stock');
    params.delete('page');
    location.href = `categori.html?${params.toString()}`;
  });
}

// ---------- Categories with counts ----------
async function loadCategoriesWithCounts() {
  const list = document.getElementById('cats-list'); if (!list) return;

  const { data: cats, error: catErr } = await supabase
    .from('categories').select('id, name, slug').order('name', { ascending: true });

  if (catErr) { console.error('categories load error', catErr); return; }

  const items = await Promise.all((cats || []).map(async (cat) => {
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', cat.id);
    return { ...cat, count: count || 0 };
  }));

  list.innerHTML = items.map(cat => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <a class="d-block text-decoration-none" href="categori.html?category=${encodeURIComponent(cat.slug)}">${cat.name}</a>
      <span class="badge bg-light text-dark">${cat.count}</span>
    </li>
  `).join('');
}

// ---------- Skeleton ----------
function showSkeleton(count = 8) {
  const container = document.getElementById('products-container'); if (!container) return;
  const cards = Array.from({ length: count }).map(() => `
    <div class="skel-card">
      <div class="skel-img"></div>
      <div class="skel-line w90"></div>
      <div class="skel-line w70"></div>
      <div class="skel-line w50"></div>
    </div>
  `).join('');
  container.innerHTML = `<div class="skel-grid">${cards}</div>`;
}

// ---------- Filter Chips ----------
async function renderFilterChips(ctx = {}) {
  const wrap = document.getElementById('active-filters'); if (!wrap) return;

  const p = new URLSearchParams(location.search);
  const chips = [];

  const search = p.get('search'); if (search) chips.push({ key: 'search', label: `Search: "${search}"` });
  const min = p.get('min');       if (min)    chips.push({ key: 'min',    label: `Min £${min}` });
  const max = p.get('max');       if (max)    chips.push({ key: 'max',    label: `Max £${max}` });
  if (p.get('stock') === '1')              chips.push({ key: 'stock',  label: 'In stock' });

  let catName = ctx.categoryName;
  const catSlug = p.get('category');
  if (catSlug) {
    if (!catName) {
      const { data } = await supabase.from('categories').select('name').eq('slug', catSlug).maybeSingle();
      catName = data?.name || catSlug;
    }
    chips.push({ key: 'category', label: `Category: ${catName}` });
  }

  const sortMap = { price_asc:'Price ↑', price_desc:'Price ↓', name_asc:'Name A→Z', name_desc:'Name Z→A' };
  const sort = p.get('sort'); if (sort) chips.push({ key: 'sort', label: `Sort: ${sortMap[sort] || sort}` });

  if (!chips.length) { wrap.innerHTML = ''; return; }

  wrap.innerHTML =
    chips.map(c => `<button class="chip" data-key="${c.key}">${c.label}<span class="chip-x">×</span></button>`).join('') +
    `<button class="chip chip--clear" data-key="__clear">Clear all</button>`;

  wrap.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const params = new URLSearchParams(location.search);
      const toClear = ['search','category','min','max','stock','sort','page'];
      if (key === '__clear') toClear.forEach(k => params.delete(k));
      else { params.delete(key); params.delete('page'); }
      location.href = `categori.html?${params.toString()}`;
    });
  });
}

// ---------- Rendering ----------
function renderGroupedProducts(grouped, headingOverride) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  if (headingOverride) {
    const h = document.createElement('h2');
    h.className = 'product-category';
    h.textContent = headingOverride;
    container.appendChild(h);
  }

  for (const categoryName in grouped) {
    const section = document.createElement('div');
    section.classList.add('product-boxes');

    section.innerHTML = `
      ${headingOverride ? '' : `<h2 class="product-category">${categoryName}</h2>`}
      <div class="row g-3 g-md-4">
        ${(grouped[categoryName] || []).map(prod => `
          <div class="col-12 col-sm-6">
            <a href="product.html?id=${prod.id}" class="related-products__card-link text-decoration-none">
              <div class="product-box__main product-card shadow-sm h-100">
                <img src="${fixImageUrl(prod.image_url)}" alt="${prod.name}" class="img-fluid related-products__card-img">
                <div class="col-12 product-box__detiles">
                  <a class="product-box__detiles-title">${prod.name}</a>
                  <p class="product-box__detiles-info">${prod.features || ''}</p>
                  <div class="product-box__price">£${parseFloat(prod.price || 0).toFixed(2)}/kg</div>

                  <button
                    class="add-to-cart-btn btn-cart"
                    data-product-id="${prod.id}"
                    data-product-name="${prod.name}"
                    data-product-price="${prod.price}">
                    <i class="bi bi-bag-plus"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </a>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(section);
  }

  // add-to-cart handlers
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await addItemToBasket({
        id: btn.dataset.productId,
        name: btn.dataset.productName,
        price: parseFloat(btn.dataset.productPrice),
        quantity: 1
      });
      await updateBasketUI();
    });
  });
}

// ---------- Data Loader ----------
async function fetchProducts() {
  showSkeleton(8);

  const params       = new URLSearchParams(location.search);
  const searchQ      = (params.get('search') || '').trim();
  const categorySlug = params.get('category');
  const { sort, min, max, stockOnly } = getUrlFilterParams();

  const selectCols = `
    id, name, description, features, price, stock, image_url, category_id,
    category:category_id (id, name, slug)
  `;

  // حالت جستجو
  if (searchQ) {
    const escaped = escapeLike(searchQ);
    let query = supabase.from('products').select(selectCols).or(buildOrForWordPrefix('name', escaped));
    query = applyFilters(query, { min, max, stockOnly });
    query = applySort(query, sort);

    const { data: results, error } = await query;
    if (error) {
      console.error('Search error:', error);
      renderGroupedProducts({ 'Search Results': [] }, `0 results for "${searchQ}"`);
      await renderFilterChips();
      alignSidebarsWithGrid(); // ← مهم
      return;
    }
    const list = results || [];
    renderGroupedProducts({ 'Search Results': list }, `${list.length} result${list.length === 1 ? '' : 's'} for "${searchQ}"`);
    await renderFilterChips();
    alignSidebarsWithGrid(); // ← مهم
    return;
  }

  // آرشیو یک دسته
  if (categorySlug) {
    const { data: catRows, error: catError } = await supabase
      .from('categories').select('id, name, slug').eq('slug', categorySlug).limit(1);

    if (catError || !catRows?.length) {
      console.error('Category not found');
      renderGroupedProducts({ '': [] }, 'No products found');
      await renderFilterChips();
      alignSidebarsWithGrid(); // ← مهم
      return;
    }
    const category = catRows[0];

    let mainQ = supabase.from('products').select(selectCols).eq('category_id', category.id);
    mainQ = applyFilters(mainQ, { min, max, stockOnly });
    mainQ = applySort(mainQ, sort);

    const { data: mainProducts, error: mainErr } = await mainQ;
    if (mainErr) {
      console.error(mainErr);
      renderGroupedProducts({ [category.name]: [] });
      await renderFilterChips({ categoryName: category.name });
      alignSidebarsWithGrid(); // ← مهم
      return;
    }

    const { data: featData } = await supabase
      .from('featured_group_products')
      .select('products(id, name, description, features, price, image_url, category_id, category:category_id(id, name, slug))');

    const featured = featData ? featData.map(f => f.products) : [];
    const all = [...(mainProducts || []), ...pickRandomProducts(featured, 3)];

    renderGroupedProducts({ [category.name]: all });
    await renderFilterChips({ categoryName: category.name });
    alignSidebarsWithGrid(); // ← مهم
    return;
  }

  // آرشیو کامل Products
  const { data: allCategories } = await supabase.from('categories').select('id, name, slug');

  let listQ = supabase.from('products').select(selectCols);
  listQ = applyFilters(listQ, { min, max, stockOnly });
  listQ = applySort(listQ, sort);

  const { data: productsData, error: listErr } = await listQ;
  if (listErr) {
    console.error(listErr);
    renderGroupedProducts({ '': [] }, 'No products found');
    await renderFilterChips();
    alignSidebarsWithGrid(); // ← مهم
    return;
  }

  const { data: featData } = await supabase
    .from('featured_group_products')
    .select('products(id, name, description, features, price, image_url, category_id, category:category_id(id, name, slug))');

  const featured = featData ? featData.map(f => f.products) : [];

  const grouped = {};
  (allCategories || []).forEach(cat => {
    grouped[cat.name] = (productsData || []).filter(p => p.category_id === cat.id);
    grouped[cat.name] = [...grouped[cat.name], ...pickRandomProducts(featured, Math.floor(Math.random() * 4) + 1)];
  });

  renderGroupedProducts(grouped);
  await renderFilterChips();
  alignSidebarsWithGrid(); // ← مهم
}

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', async () => {
  updateHeaderUserInfo();
  wireSidebar();
  loadCategoriesWithCounts();
  fetchProducts();

  // مینی‌بسکت
  const holder = document.getElementById('basket-box-container');
  if (holder) {
    const res = await fetch('basket-box.html');
    holder.innerHTML = await res.text();
    await updateBasketUI();
  }

  // تغییر اندازه پنجره → هم‌ترازی مجدد
  window.addEventListener('resize', alignSidebarsWithGrid);
});

