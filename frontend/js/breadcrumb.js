

// // breadcrumb.js
// import { supabase } from './supabaseClient.js';

// const params = new URLSearchParams(window.location.search);
// const productId = params.get('id');
// const categorySlug = params.get('category');
// const groupSlugParam = params.get('type'); // برای Featured Products

// const path = window.location.pathname.toLowerCase();
// const segments = path.split('/').filter(Boolean);
// const pageName = segments.length ? segments.pop() : 'index';

// async function loadBreadcrumb() {
//   const breadcrumbList = document.querySelector('.breadcrumb__list');
//   if (!breadcrumbList) return;

//   let breadcrumbHTML = `
//     <li class="breadcrumb__item">
//       <a href="index.html" class="breadcrumb__link">
//         Home
//         <i class="fas fa-angle-right breadcrumb__icon"></i>
//       </a>
//     </li>
//   `;

//   // ---------- Cart ----------
//   if (pageName.startsWith('cart')) {
//     breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">Cart</span></li>`;
//     breadcrumbList.innerHTML = breadcrumbHTML;
//     return;
//   }

//   // ---------- Checkout ----------
//   if (pageName.startsWith('checkout')) {
//     breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">Checkout</span></li>`;
//     breadcrumbList.innerHTML = breadcrumbHTML;
//     return;
//   }

//   // ---------- صفحه محصول ----------
//   if (productId) {
//     // بررسی اینکه محصول عضو Featured Products هست یا نه
//     const { data: productWithGroup } = await supabase
//       .from('featured_group_products')
//       .select(`
//         product_id,
//         products(id, name),
//         featured_groups(id, name, slug)
//       `)
//       .eq('product_id', productId)
//       .single();

//     if (productWithGroup) {
//       // محصول Featured Products
//       const productName = productWithGroup.products.name;
//       const group = productWithGroup.featured_groups;

//       breadcrumbHTML += `
//         <li class="breadcrumb__item">
//           <a href="featured-products.html" class="breadcrumb__link">
//             Featured Products
//             <i class="fas fa-angle-right breadcrumb__icon"></i>
//           </a>
//         </li>
//         <li class="breadcrumb__item">
//           <a href="featured-products.html?type=${group.slug}" class="breadcrumb__link">
//             ${group.name}
//             <i class="fas fa-angle-right breadcrumb__icon"></i>
//           </a>
//         </li>
//         <li class="breadcrumb__item">
//           <span class="breadcrumb__link">${productName}</span>
//         </li>
//       `;
//       breadcrumbList.innerHTML = breadcrumbHTML;
//       return;
//     }

//     // محصول معمولی Products
//     const { data: product } = await supabase
//       .from('products')
//       .select('id, name, category_id')
//       .eq('id', productId)
//       .single();

//     if (product) {
//       breadcrumbHTML += `
//         <li class="breadcrumb__item">
//           <a href="categori.html" class="breadcrumb__link">
//             Products
//             <i class="fas fa-angle-right breadcrumb__icon"></i>
//           </a>
//         </li>
//       `;

//       if (product.category_id) {
//         const { data: category } = await supabase
//           .from('categories')
//           .select('id, name')
//           .eq('id', product.category_id)
//           .single();

//         if (category) {
//           breadcrumbHTML += `
//             <li class="breadcrumb__item">
//               <a href="products.html?category=${category.id}" class="breadcrumb__link">
//                 ${category.name}
//                 <i class="fas fa-angle-right breadcrumb__icon"></i>
//               </a>
//             </li>
//           `;
//         }
//       }

//       breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">${product.name}</span></li>`;
//       breadcrumbList.innerHTML = breadcrumbHTML;
//       return;
//     }
//   }

//   // ---------- Featured Products صفحات زیرمنو ----------
//   if (pageName.startsWith('featured-products')) {
//     breadcrumbHTML += `
//       <li class="breadcrumb__item">
//         <a href="featured-products.html" class="breadcrumb__link">
//           Featured Products
//           <i class="fas fa-angle-right breadcrumb__icon"></i>
//         </a>
//       </li>
//     `;

//     if (groupSlugParam) {
//       const groupNames = {
//         "special-offers": "Special Offers",
//         "new-arrivals": "New Arrivals",
//         "best-sellers": "Best Sellers",
//         "discounted-products": "Discounted Products",
//         "organic-healthy-products": "Organic & Healthy Products",
//         "products-with-unique-features": "Products with Unique Features"
//       };

//       const displayName = groupNames[groupSlugParam] || groupSlugParam.replace(/-/g, ' ');
//       breadcrumbHTML += `
//         <li class="breadcrumb__item">
//           <span class="breadcrumb__link">${displayName}</span>
//         </li>
//       `;
//     }

//     breadcrumbList.innerHTML = breadcrumbHTML;
//     return;
//   }

//   // ---------- Products معمولی ----------
//   breadcrumbHTML += `
//     <li class="breadcrumb__item">
//       <a href="categori.html" class="breadcrumb__link">
//         Products
//         <i class="fas fa-angle-right breadcrumb__icon"></i>
//       </a>
//     </li>
//   `;

//   if (categorySlug) {
//     const { data: category } = await supabase
//       .from('categories')
//       .select('id, name')
//       .eq('slug', categorySlug)
//       .single();

//     if (category) {
//       breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">${category.name}</span></li>`;
//     }
//   }

//   breadcrumbList.innerHTML = breadcrumbHTML;
// }

// loadBreadcrumb();
/////////////////////////////////////////////////////////////////////////////////////////////////

// // breadcrumb.js
// import { supabase } from './supabaseClient.js';

// const params = new URLSearchParams(window.location.search);
// const productId = params.get('id');
// const categorySlug = params.get('category');
// const groupSlugParam = params.get('type'); // برای Featured Products

// const path = window.location.pathname.toLowerCase();
// const segments = path.split('/').filter(Boolean);
// const pageName = segments.length ? segments.pop() : 'index';

// // مقالات لوکال
// const articles = [
//   { slug: "benefits-of-lean-meat", title: "Why Lean Meat is Key to a Healthy Diet" },
//   { slug: "perfect-steak-cooking-tips", title: "How to Cook the Perfect Steak Every Time" },
//   { slug: "choosing-quality-meat", title: "How to Choose High-Quality Meat for Your Meals" }
// ];

// // نام گروه‌های Featured Products
// const groupNames = {
//   "special-offers": "Special Offers",
//   "new-arrivals": "New Arrivals",
//   "best-sellers": "Best Sellers",
//   "discounted-products": "Discounted Products",
//   "organic-healthy-products": "Organic & Healthy Products",
//   "products-with-unique-features": "Products with Unique Features"
// };

// async function loadBreadcrumb() {
//   const breadcrumbList = document.querySelector('.breadcrumb__list');
//   if (!breadcrumbList) return;

//   let breadcrumbHTML = `
//     <li class="breadcrumb__item">
//       <a href="index.html" class="breadcrumb__link">
//         Home
//         <i class="fas fa-angle-right breadcrumb__icon"></i>
//       </a>
//     </li>
//   `;

//   // ---------- Cart ----------
//   if (pageName.startsWith('cart')) {
//     breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">Cart</span></li>`;
//     breadcrumbList.innerHTML = breadcrumbHTML;
//     return;
//   }

//   // ---------- Checkout ----------
//   if (pageName.startsWith('checkout')) {
//     breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">Checkout</span></li>`;
//     breadcrumbList.innerHTML = breadcrumbHTML;
//     return;
//   }

//   // ---------- صفحه محصول ----------
//   if (productId) {
//     // بررسی اینکه محصول عضو Featured Products هست یا نه
//     const { data: productWithGroup } = await supabase
//       .from('featured_group_products')
//       .select(`
//         product_id,
//         products(id, name),
//         featured_groups(id, name, slug)
//       `)
//       .eq('product_id', productId)
//       .single();

//     if (productWithGroup) {
//       const productName = productWithGroup.products.name;
//       const group = productWithGroup.featured_groups;

//       breadcrumbHTML += `
//         <li class="breadcrumb__item">
//           <a href="featured-products.html" class="breadcrumb__link">
//             Featured Products
//             <i class="fas fa-angle-right breadcrumb__icon"></i>
//           </a>
//         </li>
//         <li class="breadcrumb__item">
//           <a href="featured-products.html?type=${group.slug}" class="breadcrumb__link">
//             ${group.name}
//             <i class="fas fa-angle-right breadcrumb__icon"></i>
//           </a>
//         </li>
//         <li class="breadcrumb__item">
//           <span class="breadcrumb__link">${productName}</span>
//         </li>
//       `;
//       breadcrumbList.innerHTML = breadcrumbHTML;
//       return;
//     }

//     // محصول معمولی Products
//     const { data: product } = await supabase
//       .from('products')
//       .select('id, name, category_id')
//       .eq('id', productId)
//       .single();

//     if (product) {
//       breadcrumbHTML += `
//         <li class="breadcrumb__item">
//           <a href="categori.html" class="breadcrumb__link">
//             Products
//             <i class="fas fa-angle-right breadcrumb__icon"></i>
//           </a>
//         </li>
//       `;

//       if (product.category_id) {
//         const { data: category } = await supabase
//           .from('categories')
//           .select('id, name')
//           .eq('id', product.category_id)
//           .single();

//         if (category) {
//           breadcrumbHTML += `
//             <li class="breadcrumb__item">
//               <a href="products.html?category=${category.id}" class="breadcrumb__link">
//                 ${category.name}
//                 <i class="fas fa-angle-right breadcrumb__icon"></i>
//               </a>
//             </li>
//           `;
//         }
//       }

//       breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">${product.name}</span></li>`;
//       breadcrumbList.innerHTML = breadcrumbHTML;
//       return;
//     }
//   }

//   // ---------- Featured Products صفحات زیرمنو ----------
//   if (pageName.startsWith('featured-products')) {
//     breadcrumbHTML += `
//       <li class="breadcrumb__item">
//         <a href="featured-products.html" class="breadcrumb__link">
//           Featured Products
//           <i class="fas fa-angle-right breadcrumb__icon"></i>
//         </a>
//       </li>
//     `;

//     if (groupSlugParam) {
//       const displayName = groupNames[groupSlugParam] || groupSlugParam.replace(/-/g, ' ');
//       breadcrumbHTML += `
//         <li class="breadcrumb__item">
//           <span class="breadcrumb__link">${displayName}</span>
//         </li>
//       `;
//     }

//     breadcrumbList.innerHTML = breadcrumbHTML;
//     return;
//   }

//   // ---------- Articles ----------
//   if (pageName.startsWith('blog')) {
//     const slug = params.get('slug');
//     const article = articles.find(a => a.slug === slug);

//     breadcrumbHTML += `
//       <li class="breadcrumb__item">
//         <a href="blog.html" class="breadcrumb__link">
//           Articles
//           <i class="fas fa-angle-right breadcrumb__icon"></i>
//         </a>
//       </li>
//     `;

//     if (article) {
//       breadcrumbHTML += `
//         <li class="breadcrumb__item">
//           <span class="breadcrumb__link">${article.title}</span>
//         </li>
//       `;
//     }

//     breadcrumbList.innerHTML = breadcrumbHTML;
//     return;
//   }

//   // ---------- Products معمولی ----------
//   breadcrumbHTML += `
//     <li class="breadcrumb__item">
//       <a href="categori.html" class="breadcrumb__link">
//         Products
//         <i class="fas fa-angle-right breadcrumb__icon"></i>
//       </a>
//     </li>
//   `;

//   if (categorySlug) {
//     const { data: category } = await supabase
//       .from('categories')
//       .select('id, name')
//       .eq('slug', categorySlug)
//       .single();

//     if (category) {
//       breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">${category.name}</span></li>`;
//     }
//   }

//   breadcrumbList.innerHTML = breadcrumbHTML;
// }

// loadBreadcrumb();


// breadcrumb.js (replacement)
// پوشش می‌دهد: Products archive + Category + Search، Featured Products + Group + Search، Product page، Cart/Checkout، Blog
import { supabase } from './supabaseClient.js';

const params        = new URLSearchParams(window.location.search);
const productId     = params.get('id');
const categorySlug  = params.get('category');   // در categori.html به‌صورت slug استفاده می‌کنیم
const groupSlug     = params.get('type');       // برای Featured Products
const searchQ       = (params.get('search') || '').trim();

const path      = window.location.pathname.toLowerCase();
const pageFile  = (path.split('/').filter(Boolean).pop() || 'index.html');

// نام‌های نمایشی گروه‌های Featured
const groupNames = {
  'special-offers': 'Special Offers',
  'new-arrivals': 'New Arrivals',
  'best-sellers': 'Best Sellers',
  'discounted-products': 'Discounted Products',
  'organic-healthy-products': 'Organic & Healthy Products',
  'products-with-unique-features': 'Products with Unique Features'
};

// مقالات نمونه (همان قبلی)
const articles = [
  { slug: 'benefits-of-lean-meat',       title: 'Why Lean Meat is Key to a Healthy Diet' },
  { slug: 'perfect-steak-cooking-tips',  title: 'How to Cook the Perfect Steak Every Time' },
  { slug: 'choosing-quality-meat',       title: 'How to Choose High-Quality Meat for Your Meals' }
];

// کمک برای ساخت آیتم‌ها
function crumbLink(title, href) { return { title, href }; }
function crumbText(title)       { return { title, href: null }; }

function renderBreadcrumb(listEl, items) {
  // items: آرایه‌ای از {title, href} که آخری tail است
  if (!listEl || !Array.isArray(items) || !items.length) return;
  let html = '';

  // Home همیشه اول
  html += `
    <li class="breadcrumb__item">
      <a href="index.html" class="breadcrumb__link">
        Home
        <i class="fas fa-angle-right breadcrumb__icon"></i>
      </a>
    </li>
  `;

  // بقیه
  const lastIdx = items.length - 1;
  items.forEach((it, idx) => {
    const isTail = idx === lastIdx;
    if (!isTail) {
      html += `
        <li class="breadcrumb__item">
          <a href="${it.href}" class="breadcrumb__link">
            ${it.title}
            <i class="fas fa-angle-right breadcrumb__icon"></i>
          </a>
        </li>
      `;
    } else {
      // tail بدون لینک
      html += `
        <li class="breadcrumb__item">
          <span class="breadcrumb__link">${it.title}</span>
        </li>
      `;
    }
  });

  listEl.innerHTML = html;
}

// گرفتن نام/اسلاگ دسته برای محصول
async function getCategoryById(catId) {
  if (!catId) return null;
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('id', catId)
    .single();
  if (error) return null;
  return data;
}

// بررسی عضویت محصول در گروه Featured
async function getFeaturedGroupForProduct(prodId) {
  try {
    const { data } = await supabase
      .from('featured_group_products')
      .select(`
        product_id,
        products ( id, name ),
        featured_groups ( id, name, slug )
      `)
      .eq('product_id', prodId)
      .maybeSingle();
    return data || null;
  } catch {
    return null;
  }
}

async function loadBreadcrumb() {
  const list = document.querySelector('.breadcrumb__list');
  if (!list) return;

  // CART
  if (pageFile.startsWith('cart')) {
    renderBreadcrumb(list, [crumbText('Cart')]);
    return;
  }

  // CHECKOUT
  if (pageFile.startsWith('checkout')) {
    renderBreadcrumb(list, [crumbText('Checkout')]);
    return;
  }

  // PRODUCT DETAIL (product.html?id=...)
  if (productId) {
    // اول سعی می‌کنیم ببینیم تو Featured Group هست یا نه
    const fg = await getFeaturedGroupForProduct(productId);
    if (fg && fg.products && fg.featured_groups) {
      const items = [
        crumbLink('Featured Products', 'featured-products.html'),
        crumbLink(fg.featured_groups.name, `featured-products.html?type=${fg.featured_groups.slug}`),
        crumbText(fg.products.name)
      ];
      renderBreadcrumb(list, items);
      return;
    }

    // محصول معمولی
    const { data: product } = await supabase
      .from('products')
      .select('id, name, category_id')
      .eq('id', productId)
      .single();

    if (product) {
      const items = [crumbLink('Products', 'categori.html')];
      if (product.category_id) {
        const cat = await getCategoryById(product.category_id);
        if (cat) {
          items.push(crumbLink(cat.name, `categori.html?category=${encodeURIComponent(cat.slug)}`));
        }
      }
      items.push(crumbText(product.name));
      renderBreadcrumb(list, items);
      return;
    }

    // اگر محصول پیدا نشد، بیفت روی Products
    renderBreadcrumb(list, [crumbText('Products')]);
    return;
  }

  // FEATURED PRODUCTS صفحه
  if (pageFile.startsWith('featured-products')) {
    // حالت سرچ در Featured
    if (searchQ) {
      const items = [
        crumbLink('Featured Products', 'featured-products.html'),
        crumbText(`Search: "${searchQ}"`)
      ];
      renderBreadcrumb(list, items);
      return;
    }

    // حالت گروه
    if (groupSlug) {
      const display = groupNames[groupSlug] || groupSlug.replace(/-/g, ' ');
      const items = [
        crumbLink('Featured Products', 'featured-products.html'),
        crumbText(display)
      ];
      renderBreadcrumb(list, items);
      return;
    }

    // خود Featured Products
    renderBreadcrumb(list, [crumbText('Featured Products')]);
    return;
  }

  // BLOG صفحه
  if (pageFile.startsWith('blog')) {
    const slug = params.get('slug');
    const article = articles.find(a => a.slug === slug);
    const items = [crumbLink('Articles', 'blog.html')];
    if (article) items.push(crumbText(article.title));
    renderBreadcrumb(list, items);
    return;
  }

  // PRODUCTS آرشیو (categori.html) + دسته + سرچ
  // پیش‌فرض: Products
  let items = [crumbLink('Products', 'categori.html')];

  // اگر دسته انتخاب شده
  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('slug', categorySlug)
      .single();
    if (cat) {
      items.push(crumbText(cat.name)); // در آرشیو، دسته tail است
      renderBreadcrumb(list, items);
      return;
    }
  }

  // اگر سرچ فعال است (View all results در Products)
  if (searchQ) {
    items.push(crumbText(`Search: "${searchQ}"`));
    renderBreadcrumb(list, items);
    return;
  }

  // آرشیو کلی Products
  renderBreadcrumb(list, items); // فقط Home > Products
}

loadBreadcrumb();
