


// این کدها درست دارن اجرا میشن

// ////////////////
// import { supabase } from './supabaseClient.js';


// document.addEventListener('DOMContentLoaded', () => {
//   fetchProducts();
// });

// async function fetchProducts() {
//   const categorySlug = getCategorySlugFromURL();
//   let query = supabase
//     .from('products')
//     .select(`
//     id,
//     name,
//     description,
//     features,
//     price,
//     stock,
//     created_at,
//     updated_at,
//     category_id,
//     image_url,
//     category:category_id (
//       id,
//       name,
//       slug
//       )
//     `)
//     .order('id', { ascending: true });
   


//   if (categorySlug) {
//     // فیلتر محصولات بر اساس slug دسته
//     // چون فیلتر مستقیم روی slug داخل join شدنی نیست، باید ابتدا id دسته را بگیریم
//     const { data: categories, error: catError } = await supabase
//       .from('categories')
//       .select('id')
//       .eq('slug', categorySlug)
//       .limit(1);

//     if (catError) {
//       console.error('Error fetching category id:', catError);
//       return;
//     }

//     if (categories.length > 0) {
//       console.log('✅ Found category ID:', categories[0].id); // ← چاپ آی‌دی دسته
//       query = query.eq('category_id', categories[0].id);
//     } else {
//       // اگر دسته‌ای با این slug نبود، محصولات خالی نمایش داده شود
//       query = query.eq('category_id', -1);
//     }
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error('Error fetching products:', error);
//     return;
//   }

//   renderProducts(data);
// }



// function getCategorySlugFromURL() {
//   const params = new URLSearchParams(window.location.search);
//   return params.get('category'); // مثلا "sausage-varieties"
//   // return params.get('slug');

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

//   document.querySelectorAll('.add-to-cart-btn').forEach(button => {
//   button.addEventListener('click', () => {
//     const product = {
//       id: button.dataset.productId,
//       name: button.dataset.productName,
//       price: parseFloat(button.dataset.productPrice),
//       quantity: 1
//     };
//     addItemToBasket(product);
//   });
// });

// }




// function fixImageUrl(url) {
//   if (!url) return 'images/products/placeholder.jpg';
//   if (url.startsWith('http')) return url;
//   const base = 'https://lgbgwpbpxtmltzrsbjnx.supabase.co/storage/v1/object/public/product-images/';
//   return base + url;
// }

// /////////////نمایش  سبد خرید در هر صفحه :

// document.addEventListener('DOMContentLoaded', function () {
//   fetch('basket-box.html')
//     .then(res => res.text())
//     .then(data => {
//       const container = document.getElementById('basket-box-container');
//       if (container) {
//         container.innerHTML = data;
//       }
//     });
// });

// ///////////اضافه شدن محصول به باکس سبد خرید

// import { addItemToBasket} from './basket.js';


// // این کد slug موجود در URL رو استخراج می‌کنه
// const params = new URLSearchParams(window.location.search);
// const slug = params.get('slug');
// // console.log('📌 Current slug:', slug);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




import { supabase } from './supabaseClient.js';
import { addItemToBasket } from './basket.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});

async function fetchProducts() {
  const categorySlug = getCategorySlugFromURL();

  if (categorySlug) {
    // -------------------
    // صفحه آرشیو یک دسته خاص
    // -------------------
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('slug', categorySlug)
      .limit(1);

    if (catError || !categories || categories.length === 0) {
      console.error('Category not found');
      renderProducts([]);
      return;
    }

    const category = categories[0];

    // محصولات اصلی دسته
    const { data: mainProducts } = await supabase
      .from('products')
      .select(`
        id, name, description, features, price, stock, image_url, category_id,
        category:category_id (id, name, slug)
      `)
      .eq('category_id', category.id)
      .order('id');

    // محصولات Featured
    const { data: featData } = await supabase
      .from('featured_group_products')
      .select('products(id, name, description, features, price, image_url, category_id, category:category_id(id, name, slug))');

    const featuredProducts = featData ? featData.map(f => f.products) : [];
    const randomFeatured = pickRandomProducts(featuredProducts, 3);

    // ترکیب
    const allProducts = [...(mainProducts || []), ...randomFeatured];

    // رندر فقط یک دسته
    renderGroupedProducts({ [category.name]: allProducts });

  } else {
    // -------------------
    // صفحه آرشیو اصلی (Products)
    // -------------------
    const { data: allCategories } = await supabase
      .from('categories')
      .select('id, name, slug');

    const { data: productsData } = await supabase
      .from('products')
      .select(`
        id, name, description, features, price, stock, image_url, category_id,
        category:category_id (id, name, slug)
      `)
      .order('id');

    const { data: featData } = await supabase
      .from('featured_group_products')
      .select('products(id, name, description, features, price, image_url, category_id, category:category_id(id, name, slug))');

    const featuredProducts = featData ? featData.map(f => f.products) : [];

    // گروه‌بندی محصولات بر اساس دسته
    const grouped = {};
    (allCategories || []).forEach(cat => {
      grouped[cat.name] = (productsData || []).filter(p => p.category_id === cat.id);

      // اضافه کردن چند محصول Featured به هر دسته
      const randomFeatured = pickRandomProducts(featuredProducts, Math.floor(Math.random() * 4) + 1);
      grouped[cat.name] = [...grouped[cat.name], ...randomFeatured];
    });

    renderGroupedProducts(grouped);
  }
}

function getCategorySlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category');
}

function pickRandomProducts(arr, count) {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// اینجا رندر شبیه ساختار HTML کد خودت هست
function renderGroupedProducts(grouped) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

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
                  <p class="product-box__detiles-info">${prod.features || ''}</p>
                  <p class="product-box__detiles-info">£${parseFloat(prod.price).toFixed(2)}/kg</p>
                  <button
                    class="add-to-cart-btn"
                    data-product-id="${prod.id}"
                    data-product-name="${prod.name}"
                    data-product-price="${prod.price}">
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

  // هندل دکمه Add to Cart
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

// --- لود باکس سبد خرید ---
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
