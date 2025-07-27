import { supabase } from './supabaseClient.js';

// گرفتن ID محصول از URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

async function loadRelatedProducts() {
  if (!productId) return;

  // گرفتن category_id محصول
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('category_id')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    console.error('خطا در دریافت دسته محصول:', productError);
    return;
  }

  const { data: relatedProducts, error: relatedError } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', productId)
    .limit(4);

  if (relatedError) {
    console.error('خطا در دریافت محصولات مرتبط:', relatedError);
    return;
  }

  renderRelatedProducts(relatedProducts);
}

function truncateText(text, maxLength) {
  if (!text) return "No description available.";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function renderRelatedProducts(products) {
  const container = document.getElementById('related-products-container');
  if (!container) {
    console.error('Container for related products not found!');
    return;
  }

  container.innerHTML = ''; // پاکسازی قبل از افزودن کارت‌ها

  products.forEach(p => {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-6 col-lg-3 mb-4';
    colDiv.innerHTML = `
      <a href="product.html?id=${p.id}" class="related-products__card-link">
        <div class="related-products__card shadow-sm">
          <img src="${p.image_url || 'images/products/placeholder.webp'}" class="img-fluid related-products__card-img" alt="${p.name}">
          <div class="related-products__card-meta">
            <ul>
              <li class="related-products__card-seller">Top Seller</li>
              <li class="related-products__card-rating"><i class="fa-solid fa-star"></i> ${p.rating || "4.5"}</li>
            </ul>
          </div>
          <div class="related-products__card-body text-center">
            <h5 class="related-products__card-title">${p.name}</h5>
            <p class="related-products__card-text">${truncateText(p.description, 50)}</p>
            <span class="related-products__card-price text-danger fw-bold">$${p.price || "0.00"}</span>
          </div>
        </div>
      </a>
    `;
    container.appendChild(colDiv);
  });
}

loadRelatedProducts();
