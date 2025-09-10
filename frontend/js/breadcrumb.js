

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


// breadcrumb.js
import { supabase } from './supabaseClient.js';

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const categorySlug = params.get('category');
const groupSlugParam = params.get('type'); // برای Featured Products

const path = window.location.pathname.toLowerCase();
const segments = path.split('/').filter(Boolean);
const pageName = segments.length ? segments.pop() : 'index';

// مقالات لوکال
const articles = [
  { slug: "benefits-of-lean-meat", title: "Why Lean Meat is Key to a Healthy Diet" },
  { slug: "perfect-steak-cooking-tips", title: "How to Cook the Perfect Steak Every Time" },
  { slug: "choosing-quality-meat", title: "How to Choose High-Quality Meat for Your Meals" }
];

// نام گروه‌های Featured Products
const groupNames = {
  "special-offers": "Special Offers",
  "new-arrivals": "New Arrivals",
  "best-sellers": "Best Sellers",
  "discounted-products": "Discounted Products",
  "organic-healthy-products": "Organic & Healthy Products",
  "products-with-unique-features": "Products with Unique Features"
};

async function loadBreadcrumb() {
  const breadcrumbList = document.querySelector('.breadcrumb__list');
  if (!breadcrumbList) return;

  let breadcrumbHTML = `
    <li class="breadcrumb__item">
      <a href="index.html" class="breadcrumb__link">
        Home
        <i class="fas fa-angle-right breadcrumb__icon"></i>
      </a>
    </li>
  `;

  // ---------- Cart ----------
  if (pageName.startsWith('cart')) {
    breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">Cart</span></li>`;
    breadcrumbList.innerHTML = breadcrumbHTML;
    return;
  }

  // ---------- Checkout ----------
  if (pageName.startsWith('checkout')) {
    breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">Checkout</span></li>`;
    breadcrumbList.innerHTML = breadcrumbHTML;
    return;
  }

  // ---------- صفحه محصول ----------
  if (productId) {
    // بررسی اینکه محصول عضو Featured Products هست یا نه
    const { data: productWithGroup } = await supabase
      .from('featured_group_products')
      .select(`
        product_id,
        products(id, name),
        featured_groups(id, name, slug)
      `)
      .eq('product_id', productId)
      .single();

    if (productWithGroup) {
      const productName = productWithGroup.products.name;
      const group = productWithGroup.featured_groups;

      breadcrumbHTML += `
        <li class="breadcrumb__item">
          <a href="featured-products.html" class="breadcrumb__link">
            Featured Products
            <i class="fas fa-angle-right breadcrumb__icon"></i>
          </a>
        </li>
        <li class="breadcrumb__item">
          <a href="featured-products.html?type=${group.slug}" class="breadcrumb__link">
            ${group.name}
            <i class="fas fa-angle-right breadcrumb__icon"></i>
          </a>
        </li>
        <li class="breadcrumb__item">
          <span class="breadcrumb__link">${productName}</span>
        </li>
      `;
      breadcrumbList.innerHTML = breadcrumbHTML;
      return;
    }

    // محصول معمولی Products
    const { data: product } = await supabase
      .from('products')
      .select('id, name, category_id')
      .eq('id', productId)
      .single();

    if (product) {
      breadcrumbHTML += `
        <li class="breadcrumb__item">
          <a href="categori.html" class="breadcrumb__link">
            Products
            <i class="fas fa-angle-right breadcrumb__icon"></i>
          </a>
        </li>
      `;

      if (product.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('id, name')
          .eq('id', product.category_id)
          .single();

        if (category) {
          breadcrumbHTML += `
            <li class="breadcrumb__item">
              <a href="products.html?category=${category.id}" class="breadcrumb__link">
                ${category.name}
                <i class="fas fa-angle-right breadcrumb__icon"></i>
              </a>
            </li>
          `;
        }
      }

      breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">${product.name}</span></li>`;
      breadcrumbList.innerHTML = breadcrumbHTML;
      return;
    }
  }

  // ---------- Featured Products صفحات زیرمنو ----------
  if (pageName.startsWith('featured-products')) {
    breadcrumbHTML += `
      <li class="breadcrumb__item">
        <a href="featured-products.html" class="breadcrumb__link">
          Featured Products
          <i class="fas fa-angle-right breadcrumb__icon"></i>
        </a>
      </li>
    `;

    if (groupSlugParam) {
      const displayName = groupNames[groupSlugParam] || groupSlugParam.replace(/-/g, ' ');
      breadcrumbHTML += `
        <li class="breadcrumb__item">
          <span class="breadcrumb__link">${displayName}</span>
        </li>
      `;
    }

    breadcrumbList.innerHTML = breadcrumbHTML;
    return;
  }

  // ---------- Articles ----------
  if (pageName.startsWith('blog')) {
    const slug = params.get('slug');
    const article = articles.find(a => a.slug === slug);

    breadcrumbHTML += `
      <li class="breadcrumb__item">
        <a href="blog.html" class="breadcrumb__link">
          Articles
          <i class="fas fa-angle-right breadcrumb__icon"></i>
        </a>
      </li>
    `;

    if (article) {
      breadcrumbHTML += `
        <li class="breadcrumb__item">
          <span class="breadcrumb__link">${article.title}</span>
        </li>
      `;
    }

    breadcrumbList.innerHTML = breadcrumbHTML;
    return;
  }

  // ---------- Products معمولی ----------
  breadcrumbHTML += `
    <li class="breadcrumb__item">
      <a href="categori.html" class="breadcrumb__link">
        Products
        <i class="fas fa-angle-right breadcrumb__icon"></i>
      </a>
    </li>
  `;

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id, name')
      .eq('slug', categorySlug)
      .single();

    if (category) {
      breadcrumbHTML += `<li class="breadcrumb__item"><span class="breadcrumb__link">${category.name}</span></li>`;
    }
  }

  breadcrumbList.innerHTML = breadcrumbHTML;
}

loadBreadcrumb();
