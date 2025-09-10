// menu.js
//این کدها درست هستند 
// import { supabase } from './supabaseClient.js';

// document.addEventListener('DOMContentLoaded', async () => {
//   const menuContainer = document.getElementById('navbar');
//   if (!menuContainer) return;

//   const { data: menus, error } = await supabase
//     .from('menus')
//     .select('*')
//     .order('id', { ascending: true });

//   if (error) {
//     console.error('خطا در دریافت منو:', error);
//     return;
//   }

//   function buildMenuTree(items, parentId = null) {
//     return items
//       .filter(item => item.parent_id === parentId)
//       .map(item => ({
//         ...item,
//         children: buildMenuTree(items, item.id)
//       }));
//   }

//   function buildMenuHTML(tree) {
//     let html = '';
//     tree.forEach(item => {
//       const hasChildren = item.children.length > 0;
//       html += `
//         <li class="main-header__item">
//           ${item.url ? `<a href="${item.url}" class="main-header__link">${item.title}</a>` : `<span class="main-header__link">${item.title}</span>`}
//           ${hasChildren ? `<ul class="main-header__dropdown">${buildMenuHTML(item.children)}</ul>` : ''}
//         </li>
//       `;
//     });
//     return html;
//   }

//   const menuTree = buildMenuTree(menus);
//   const menuHTML = buildMenuHTML(menuTree);
//   menuContainer.innerHTML = menuHTML;
// });


//////////////

// import { supabase } from './supabaseClient.js';

// document.addEventListener('DOMContentLoaded', async () => {
//   const menuContainer = document.getElementById('navbar');
//   if (!menuContainer) return;

//   // دریافت منوها
//   const { data: menus, error: menuError } = await supabase
//     .from('menus')
//     .select('*')
//     .order('id', { ascending: true });

//   if (menuError) {
//     console.error('خطا در دریافت منو:', menuError);
//     return;
//   }

//   // دریافت دسته‌بندی‌ها
//   const { data: categories, error: catError } = await supabase
//     .from('categories')
//     .select('id, name, slug')
//     .order('id', { ascending: true });

//   if (catError) {
//     console.error('خطا در دریافت دسته‌بندی‌ها:', catError);
//     return;
//   }

//   // ساختار درختی منو
//   function buildMenuTree(items, parentId = null) {
//     return items
//       .filter(item => item.parent_id === parentId)
//       .map(item => ({
//         ...item,
//         children: buildMenuTree(items, item.id)
//       }));
//   }

//   // تولید HTML منو
//   function buildMenuHTML(tree) {
//     let html = '';
//     tree.forEach(item => {
//       const hasChildren = item.children.length > 0;

//       // اگر این آیتم زیرمنو داره و عنوانش یکی از دسته‌هاست، لینک مخصوص بساز
//       let linkHTML = '';
//       const matchedCategory = categories.find(cat => cat.name === item.title);
//       if (matchedCategory) {
//         // لینک به صفحه آرشیو با پارامتر slug
//         linkHTML = `<a href="categori.html?category=${matchedCategory.slug}" class="main-header__link">${item.title}</a>`;
//       } else {
//         // اگر url موجود است، استفاده کن، وگرنه span بساز
//         linkHTML = item.url
//           ? `<a href="${item.url}" class="main-header__link">${item.title}</a>`
//           : `<span class="main-header__link">${item.title}</span>`;
//       }

//       html += `
//         <li class="main-header__item">
//           ${linkHTML}
//           ${hasChildren ? `<ul class="main-header__dropdown">${buildMenuHTML(item.children)}</ul>` : ''}
//         </li>
//       `;
//     });
//     return html;
//   }

//   const menuTree = buildMenuTree(menus);
//   const menuHTML = buildMenuHTML(menuTree);
//   menuContainer.innerHTML = menuHTML;
// });



// //////////////////////////
// import { supabase } from './supabaseClient.js';

// document.addEventListener('DOMContentLoaded', async () => {
//   const menuContainer = document.getElementById('navbar');
//   if (!menuContainer) return;

//   // دریافت منوها
//   const { data: menus, error: menuError } = await supabase
//     .from('menus')
//     .select('*')
//     .order('id', { ascending: true });

//   if (menuError) {
//     console.error('خطا در دریافت منو:', menuError);
//     return;
//   }

//   // دریافت دسته‌بندی‌ها
//   const { data: categories, error: catError } = await supabase
//     .from('categories')
//     .select('id, name, slug')
//     .order('id', { ascending: true });

//   if (catError) {
//     console.error('خطا در دریافت دسته‌بندی‌ها:', catError);
//     return;
//   }

//   // دریافت محصولات
//   const { data: products, error: prodError } = await supabase
//     .from('products')
//     .select('id, name')
//     .order('id', { ascending: true });

//   if (prodError) {
//     console.error('خطا در دریافت محصولات:', prodError);
//     return;
//   }

//   // ساختار درختی منو
//   function buildMenuTree(items, parentId = null) {
//     return items
//       .filter(item => item.parent_id === parentId)
//       .map(item => ({
//         ...item,
//         children: buildMenuTree(items, item.id)
//       }));
//   }

//   // تولید HTML منو
//   function buildMenuHTML(tree) {
//     let html = '';
//     tree.forEach(item => {
//       const hasChildren = item.children.length > 0;

//       let linkHTML = '';

//       // بررسی دسته‌بندی
//       const matchedCategory = categories.find(cat => cat.name === item.title);
//       if (matchedCategory) {
//         linkHTML = `<a href="categori.html?category=${matchedCategory.slug}" class="main-header__link">${item.title}</a>`;
//       } else {
//         // بررسی محصول
//         const matchedProduct = products.find(p => p.name === item.title);
//         if (matchedProduct) {
//           linkHTML = `<a href="product.html?id=${matchedProduct.id}" class="main-header__link">${item.title}</a>`;
//         } else {
//           // لینک یا اسپن عادی
//           linkHTML = item.url
//             ? `<a href="${item.url}" class="main-header__link">${item.title}</a>`
//             : `<span class="main-header__link">${item.title}</span>`;
//         }
//       }

//       html += `
//         <li class="main-header__item">
//           ${linkHTML}
//           ${hasChildren ? `<ul class="main-header__dropdown">${buildMenuHTML(item.children)}</ul>` : ''}
//         </li>
//       `;
//     });
//     return html;
//   }

//   const menuTree = buildMenuTree(menus);
//   const menuHTML = buildMenuHTML(menuTree);
//   menuContainer.innerHTML = menuHTML;
// });


import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const menuContainer = document.getElementById('navbar');
  if (!menuContainer) return;

  // دریافت منوها
  const { data: menus, error: menuError } = await supabase
    .from('menus')
    .select('*')
    .order('id', { ascending: true });

  if (menuError) {
    console.error('خطا در دریافت منو:', menuError);
    return;
  }

  // دریافت دسته‌بندی‌ها
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('id', { ascending: true });

  if (catError) {
    console.error('خطا در دریافت دسته‌بندی‌ها:', catError);
    return;
  }

  // دریافت محصولات
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name')
    .order('id', { ascending: true });

  if (prodError) {
    console.error('خطا در دریافت محصولات:', prodError);
    return;
  }

  // دریافت featured_groups برای زیرمنوهای Featured Products
  const { data: featuredGroups, error: fgError } = await supabase
    .from('featured_groups')
    .select('id, name, slug')
    .order('id', { ascending: true });

  if (fgError) {
    console.error('خطا در دریافت featured groups:', fgError);
    return;
  }

  // ساختار درختی منو
  function buildMenuTree(items, parentId = null) {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        children: buildMenuTree(items, item.id)
      }));
  }

  // تولید HTML منو با پشتیبانی از Featured Products به شکل خاص
  function buildMenuHTML(tree) {
    let html = '';
    tree.forEach(item => {
      const hasChildren = item.children.length > 0;

      let linkHTML = '';

      if (item.title === 'Featured Products') {
        // لینک اصلی Featured Products
        linkHTML = `<a href="featured-products.html" class="main-header__link">${item.title}</a>`;

        // زیرمنوهای featured_groups به صورت دستی ساخته می‌شوند
        html += `<li class="main-header__item">
          ${linkHTML}`;

        if (featuredGroups.length > 0) {
          html += `<ul class="main-header__dropdown">`;
          featuredGroups.forEach(fg => {
            html += `
              <li class="main-header__item">
                <a href="featured-products.html?type=${fg.slug}" class="main-header__link">${fg.name}</a>
              </li>
            `;
          });
          html += `</ul>`;
        }
        html += `</li>`;
        return; // این آیتم را کامل ساختیم، بریم آیتم بعدی
      }

      // بررسی دسته‌بندی
      const matchedCategory = categories.find(cat => cat.name === item.title);
      if (matchedCategory) {
        linkHTML = `<a href="categori.html?category=${matchedCategory.slug}" class="main-header__link">${item.title}</a>`;
      } else {
        // بررسی محصول
        const matchedProduct = products.find(p => p.name === item.title);
        if (matchedProduct) {
          linkHTML = `<a href="product.html?id=${matchedProduct.id}" class="main-header__link">${item.title}</a>`;
        } else {
          // لینک یا اسپن عادی
          linkHTML = item.url
          ? `<a href="${item.url.replace(/^\/frontend\//, '')}" class="main-header__link">${item.title}</a>`
          : `<span class="main-header__link">${item.title}</span>`;

        }
      }

      html += `
        <li class="main-header__item">
          ${linkHTML}
          ${hasChildren ? `<ul class="main-header__dropdown">${buildMenuHTML(item.children)}</ul>` : ''}
        </li>
      `;
    });
    return html;
  }

  const menuTree = buildMenuTree(menus);
  const menuHTML = buildMenuHTML(menuTree);
  menuContainer.innerHTML = menuHTML;
});
