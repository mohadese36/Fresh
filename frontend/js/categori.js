
// import { supabase } from './supabaseClient.js';

// export async function loadProductsByCategory() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const slug = urlParams.get('slug');

//   const container = document.getElementById('products-container');
//   if (!container) {
//     console.error("❌ products-container not found in HTML!");
//     return;
//   }

//   if (!slug) {
//     container.innerHTML = '<p>Please select a category.</p>';
//     return;
//   }

//   const { data: category, error: catError } = await supabase
//     .from('categories')
//     .select('id')
//     .eq('slug', slug)
//     .single();

//   if (catError || !category) {
//     container.innerHTML = `<p>Category not found: ${slug}</p>`;
//     return;
//   }

//   const { data: products, error: prodError } = await supabase
//     .from('products')
//     .select('*')
//     .eq('category_id', category.id);

//   if (prodError) {
//     container.innerHTML = '<p>Error loading products.</p>';
//     return;
//   }

//   if (!products.length) {
//     container.innerHTML = '<p>No products found in this category.</p>';
//     return;
//   }

//   container.innerHTML = products.map(p => `
//     <div class="product">
//       <h3>${p.name}</h3>
//       <p>${p.description}</p>
//       <strong>$${p.price}</strong>
//     </div>
//   `).join('');
// }




import { supabase } from './supabaseClient.js';

export async function loadProductsByCategory() {
const urlParams = new URLSearchParams(window.location.search);
let slug = urlParams.get('slug');
if (!slug) {
  slug = 'sausage';  // مقدار پیش‌فرض
}
loadProductsByCategory(slug);


  const container = document.getElementById('products-container');
  const categoryTitle = document.getElementById('category-title');

  if (!container || !categoryTitle) {
    console.error("❌ 'products-container' یا 'category-title' در HTML پیدا نشد!");
    return;
  }

  if (!slug) {
    container.innerHTML = '<p>Please select a category.</p>';
    categoryTitle.textContent = '';
    return;
  }

  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (catError || !category) {
    container.innerHTML = `<p>Category not found: ${slug}</p>`;
    categoryTitle.textContent = '';
    return;
  }

  categoryTitle.textContent = category.name;

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id);

  if (prodError) {
    container.innerHTML = '<p>Error loading products.</p>';
    return;
  }

  if (!products.length) {
    container.innerHTML = '<p>No products found in this category.</p>';
    return;
  }

  container.innerHTML = ''; // پاک کردن محتوا قبل از افزودن

  products.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-3';

    const box = document.createElement('div');
    box.className = 'product-boxes__box';

    box.innerHTML = `
      <a href="#">
        <img src="${p.image_url || 'https://via.placeholder.com/150'}" alt="${p.name}" class="img-fluid improduct-box__img-main" />
      </a>
      <div class="product-box__main">
        <div class="col-7 ps-2 product-box__detiles">
          <a class="product-box__detiles-title">${p.name}</a>
          <p class="product-box__detiles-info">${p.description || ''}</p>
          <p class="product-box__detiles-info">£${p.price}/kg</p>
          <span class="product-box__detiles-price">Guide price: £${(p.price * 0.45).toFixed(2)}</span>
        </div>
      </div>
      <div class="product-box__footer"></div>
    `;

    col.appendChild(box);
    container.appendChild(col);
  });
}
