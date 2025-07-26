// این کدها درست هستند و محصولات ارشیو رو نشون میدن

// import { supabase } from './supabaseClient.js';

// document.addEventListener('DOMContentLoaded', () => {
//   fetchProducts();
// });

// async function fetchProducts() {
//   const { data, error } = await supabase
//     .from('products')
//     .select(`
//       id,
//       name,
//       description,
//       price,
//       stock,
//       created_at,
//       updated_at,
//       category_id,
//       image_url,
//       category:category_id (
//         id,
//         name
//       )
//     `)
//     .order('category_id', { ascending: true })
//     .order('id', { ascending: true });

//   if (error) {
//     console.error('Error fetching products:', error);
//     return;
//   }

//   renderProducts(data);
// }

// function renderProducts(products) {
//   const container = document.getElementById('products-container');
//   container.innerHTML = '';

//   const grouped = {};

//   products.forEach(product => {
//     const catName = (product.category && product.category.name) ? product.category.name : 'Other';
//     if (!grouped[catName]) grouped[catName] = [];
//     grouped[catName].push(product);
//   });

//   for (const categoryName in grouped) {
//     const section = document.createElement('div');
//     section.classList.add('product-boxes');

//     section.innerHTML = `
//       <h2 class="product-category">${categoryName}</h2>
//       <div class="row">
//         ${grouped[categoryName].map(prod => `
//           <div class="col-3">
//             <div class="product-boxes__box">
//               <a href="#">
//                 <img src="${fixImageUrl(prod.image_url)}" alt="${prod.name}" class="img-fluid improduct-box__img-main">
//               </a>
//               <div class="product-box__main">
//                 <div class="col-7 ps-2 product-box__detiles">
//                   <a class="product-box__detiles-title">${prod.name}</a>
//                   <p class="product-box__detiles-info">${prod.description}</p>
//                   <p class="product-box__detiles-info">£${parseFloat(prod.price).toFixed(2)}/kg</p>
//                 </div>
//               </div>
//               <div class="product-box__footer"></div>
//             </div>
//           </div>
//         `).join('')}
//       </div>
//     `;

//     container.appendChild(section);
//   }
// }

// // اگر image_url ناقصه (مثلاً فقط نام فایل هست)، مسیر کامل رو بساز
// function fixImageUrl(url) {
//   if (!url) return 'images/products/placeholder.jpg';

//   if (url.startsWith('http')) return url;

//   const base = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co/storage/v1/object/public/product-images/';
//   return base + url;
// }
///////////////////////////







/////////////////

import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});

async function fetchProducts() {
  const categorySlug = getCategorySlugFromURL();

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      stock,
      created_at,
      updated_at,
      category_id,
      image_url,
      category:category_id (
        id,
        name,
        slug
      )
    `)
    .order('id', { ascending: true });

  if (categorySlug) {
    // فیلتر محصولات بر اساس slug دسته
    // چون فیلتر مستقیم روی slug داخل join شدنی نیست، باید ابتدا id دسته را بگیریم
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .limit(1);

    if (catError) {
      console.error('Error fetching category id:', catError);
      return;
    }

    if (categories.length > 0) {
      query = query.eq('category_id', categories[0].id);
    } else {
      // اگر دسته‌ای با این slug نبود، محصولات خالی نمایش داده شود
      query = query.eq('category_id', -1);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  renderProducts(data);
}

function getCategorySlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category'); // مثلا "sausage-varieties"
}

function renderProducts(products) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  const grouped = {};

  products.forEach(product => {
    const catName = (product.category && product.category.name) ? product.category.name : 'Other';
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(product);
  });

  for (const categoryName in grouped) {
    const section = document.createElement('div');
    section.classList.add('product-boxes');

    section.innerHTML = `
      <h2 class="product-category">${categoryName}</h2>
      <div class="row">
        ${grouped[categoryName].map(prod => `
          <div class="col-3">
            <div class="product-boxes__box">
              <a href="product.html?id=${prod.id}">
                <img src="${fixImageUrl(prod.image_url)}" alt="${prod.name}" class="img-fluid improduct-box__img-main">
              </a>
              <div class="product-box__main">
                <div class="col-7 ps-2 product-box__detiles">
                  <a href="product.html?id=${prod.id}" class="product-box__detiles-title">${prod.name}</a>
                  <p class="product-box__detiles-info">${prod.description}</p>
                  <p class="product-box__detiles-info">£${parseFloat(prod.price).toFixed(2)}/kg</p>
                </div>
              </div>
              <div class="product-box__footer"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(section);
  }
}

function fixImageUrl(url) {
  if (!url) return 'images/products/placeholder.jpg';
  if (url.startsWith('http')) return url;
  const base = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co/storage/v1/object/public/product-images/';
  return base + url;
}
