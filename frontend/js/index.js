const $ = document;
const landingTitle = $.querySelector(".Landing__title");
// const landingProductsCount = $.querySelector("#products-count");
// const landingMinutesCount = $.querySelector("#minutes-counter");
// const landingUsersCount = $.querySelector("#users-counter");

window.addEventListener("load", () => {
  let landingText = "Craving Something Fresh & Satisfying !";
  let typeIndex = 0;

  typeWriter(landingText, typeIndex);
  // makeCounter(3_396, landingProductsCount);
  // makeCounter(3_320, landingMinutesCount);
  // makeCounter(3_071, landingUsersCount);
});

function typeWriter(text, index) {
  if (index < text.length) {
    landingTitle.innerHTML += text[index];
    index++;
  }

  setTimeout(() => {
    typeWriter(text, index);
  }, 150);
}

// function makeCounter(max, elem) {
//   let counter = 0;
//   const interval = setInterval(() => {
//     if (counter === max) {
//       clearInterval(interval);
//     }

//     elem.innerHTML = counter;
//     counter++;
//   }, 0.5);
// }



///////////////

// import { createClient } from '@supabase/supabase-js';

// // جایگزین کن با اطلاعات واقعی خودت
// const SUPABASE_URL = 'https://dowddaaqxhpkgjstkgqh.supabase.co';
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvd2RkYWFxeGhwa2dqc3RrZ3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDA5OTIsImV4cCI6MjA1NzI3Njk5Mn0.GBkh1bv-ch-tqKyx0gOCeBxPionzM9lSqL_Hcbp--qs';

// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// async function testConnection() {
//     const { data, error } = await supabase.from('your_table').select('*');
    
//     if (error) {
//         console.error('خطا در دریافت داده‌ها:', error);
//     } else {
//         console.log('داده‌های دریافت‌شده:', data);
//     }
// }

// testConnection();



/////////////




//     const SUPABASE_URL = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co';
//     const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYmd3cGJweHRtbHR6cnNiam54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzUxNzQsImV4cCI6MjA2ODI1MTE3NH0.Em8mM1z9xvVVKSi5kDfSoq-_Qof-u5JM7hDdqec6XA0';
//     const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
//     // منو
//     // اجرای اصلی بعد از بارگذاری
//     document.addEventListener('DOMContentLoaded', fetchMenus);
  
//     async function fetchMenus() {
//       const { data: menus, error } = await supabase
//         .from('menus')
//         .select('*')
//         .order('id', { ascending: true });
  
//       if (error) {
//         console.error('Error fetching menus:', error);
//         return;
//       }
  
//       const menuTree = buildMenuTree(menus);
//       const html = buildMenuHTML(menuTree);
//       document.getElementById('navbar').innerHTML = html;
//     }
  
//     // تبدیل لیست به درخت منو
//     function buildMenuTree(items, parentId = null) {
//       return items
//         .filter(item => item.parent_id === parentId)
//         .map(item => ({
//           ...item,
//           children: buildMenuTree(items, item.id)
//         }));
//     }
  
//     // تولید HTML از ساختار درختی
//     function buildMenuHTML(tree) {
//       let html = '';
//       tree.forEach(item => {
//         const hasChildren = item.children.length > 0;
//         html += `
//           <li class="main-header__item">
//             ${item.url ? `<a href="${item.url}">${item.title}</a>` : `<span>${item.title}</span>`}
//             ${hasChildren ? `<ul class="main-header__dropdown">${buildMenuHTML(item.children)}</ul>` : ''}
//           </li>
//         `;
//       });
//       return html;
//     }
// //////////////////////////////////////////////////////////////
// // بارگزاری صفحه ارشیو


// document.addEventListener('DOMContentLoaded', () => {
//     fetchMenus(); // از قبل هست
//     fetchProducts(); // این برای محصولات
//   });

//   async function fetchProducts() {
//     const { data, error } = await supabase
//     .from('products')
//     .select(`
//         id,
//         name,
//         description,
//         price,
//         stock,
//         created_at,
//         updated_at,
//         category_id,
//         image_url,
//         category:category_id (
//         id,
//         name
//         )
//     `)
//     .order('category_id', { ascending: true })  // مرتب سازی بر اساس دسته
//     .order('id', { ascending: true });          // مرتب سازی محصولات داخل هر دسته بر اساس id



//     if (error) {
//       console.error('Error fetching products:', error);
//       return;
//     }

//     renderProducts(data);
//   }


// function renderProducts(products) {
//   const container = document.getElementById('products-container');
//   container.innerHTML = '';

//   const grouped = {};

//   products.forEach(product => {
//     const cat = product.category.name;
//     if (!grouped[cat]) grouped[cat] = [];
//     grouped[cat].push(product);
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
//                 <img src="${prod.image_url || 'images/products/placeholder.jpg'}" alt="${prod.name}" class="img-fluid improduct-box__img-main">
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

// //////////////////بارگزاری صفحه هر دسته 

// // گرفتن slug از URL
// const params = new URLSearchParams(window.location.search);
// const categorySlug = params.get("slug");

// if (!categorySlug) {
//   document.getElementById("products-container").innerHTML = "<p>Please select a category.</p>";
// } else {
//   loadProductsByCategory(categorySlug);
// }

// async function loadProductsByCategory(slug) {
//   const { data: category, error: catErr } = await supabase
//     .from('categories')
//     .select('id, name')
//     .eq('slug', slug)
//     .single();

//   if (catErr || !category) {
//     document.getElementById("products-container").innerHTML = "<p>Category not found.</p>";
//     return;
//   }

//   // نمایش عنوان دسته
//   document.getElementById("category-title").textContent = category.name;

//   const { data: products, error: prodErr } = await supabase
//     .from('products')
//     .select('*')
//     .eq('category_id', category.id);

//   if (prodErr || !products) {
//     document.getElementById("products-container").innerHTML = "<p>Error loading products.</p>";
//     return;
//   }

//   const container = document.getElementById("products-container");
//   container.innerHTML = ''; // پاک کردن محتوا قبل از نمایش محصولات

// products.forEach(p => {
//   const col = document.createElement("div");
//   col.className = "col-3";

//   const box = document.createElement("div");
//   box.className = "product-boxes__box";

//   box.innerHTML = `
//     <a href="#">
//       <img src="${p.image_url || 'https://via.placeholder.com/150'}"
//            alt="${p.name}"
//            class="img-fluid improduct-box__img-main" />
//     </a>
//     <div class="product-box__main">
//       <div class="col-7 ps-2 product-box__detiles">
//         <a class="product-box__detiles-title">${p.name}</a>
//         <p class="product-box__detiles-info">${p.description || ''}</p>
//         <p class="product-box__detiles-info">£${p.price}/kg</p>
//         <span class="product-box__detiles-price">Guide price: £${(p.price * 0.45).toFixed(2)}</span>
//       </div>
//     </div>
//     <div class="product-box__footer"></div>
//   `;

//   col.appendChild(box);
//   container.appendChild(col);
// });

// }

// ------------------------

//   import { fetchMenus } from './menu.js';
// import { fetchProducts, renderProducts } from './products.js';
// import { loadProductsByCategory } from './categori.js';

// document.addEventListener('DOMContentLoaded', () => {
//   fetchMenus();

//   const params = new URLSearchParams(window.location.search);
//   const categorySlug = params.get("slug");

//   if (categorySlug) {
//     loadProductsByCategory(categorySlug);
//   } else {
//     fetchProducts().then(products => {
//       renderProducts(products);
//     });
//   }
// });

// import { fetchMenus } from './menu.js';
// // import { fetchProducts, renderProducts } from './products.js';
// // import { loadProductsByCategory } from './categori.js';

// document.addEventListener("DOMContentLoaded", () => {
//   fetchMenus(); // بارگذاری منو
// });

// js/index.js
import { loadMenu } from './menu.js';
loadMenu();

