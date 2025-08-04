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
//   <h2 class="product-category">${categoryName}</h2>
//   <div class="row">
//     ${grouped[categoryName].map(prod => `
//       <div class="col-md-6 col-lg-4 mb-4">
//         <a href="product.html?id=${prod.id}" class="related-products__card-link text-decoration-none">
//           <div class="product-box__main shadow-sm h-100">
//             <img src="${fixImageUrl(prod.image_url)}" alt="${prod.name}" class="img-fluid related-products__card-img">
//             <div class="col-12 ps-2 product-box__detiles">
//               <a class="product-box__detiles-title">${prod.name}</a>
//               <p class="product-box__detiles-info">${prod.features}</p>
//               <p class="product-box__detiles-info">£${parseFloat(prod.price).toFixed(2)}/kg</p>
//               <button
//                 class="add-to-cart-btn"
//                 data-product-id="${prod.id}"
//                 data-product-name="${prod.name}"
//                 data-product-price="${prod.price}"
//                 >
//                 Add to Cart
//             </button>
//             </div>
//           </div>
//           <div class="product-box__footer"></div>
//         </a>
//       </div>
//     `).join('')}
//   </div>
// `;

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







////////////////
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
    features,
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
      <div class="col-md-6 col-lg-4 mb-4">
        <a href="product.html?id=${prod.id}" class="related-products__card-link text-decoration-none">
          <div class="product-box__main shadow-sm h-100">
            <img src="${fixImageUrl(prod.image_url)}" alt="${prod.name}" class="img-fluid related-products__card-img">
            <div class="col-12 ps-2 product-box__detiles">
              <a class="product-box__detiles-title">${prod.name}</a>
              <p class="product-box__detiles-info">${prod.features}</p>
              <p class="product-box__detiles-info">£${parseFloat(prod.price).toFixed(2)}/kg</p>
              <button
                class="add-to-cart-btn"
                data-product-id="${prod.id}"
                data-product-name="${prod.name}"
                data-product-price="${prod.price}"
                >
                Add to Cart
            </button>
            </div>
          </div>
          <div class="product-box__footer"></div>
        </a>
      </div>
    `).join('')}
  </div>
`;

    container.appendChild(section);
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      id: button.dataset.productId,
      name: button.dataset.productName,
      price: parseFloat(button.dataset.productPrice),
      quantity: 1
    };
    addItemToBasket(product);
  });
});

}




function fixImageUrl(url) {
  if (!url) return 'images/products/placeholder.jpg';
  if (url.startsWith('http')) return url;
  const base = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co/storage/v1/object/public/product-images/';
  return base + url;
}

/////////////نمایش  سبد خرید در هر صفحه :

document.addEventListener('DOMContentLoaded', function () {
  fetch('basket-box.html')
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById('basket-box-container');
      if (container) {
        container.innerHTML = data;
      }
    });
});

///////////اضافه شدن محصول به باکس سبد خرید

import { addItemToBasket} from './basket.js';


