
import { supabase } from './supabaseClient.js';

export async function loadProductsByCategory(slug) {
  const { data: category, error: catErr } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (catErr || !category) {
    document.getElementById("products-container").innerHTML = "<p>Category not found.</p>";
    return;
  }

  document.getElementById("category-title").textContent = category.name;

  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id);

  if (prodErr || !products) {
    document.getElementById("products-container").innerHTML = "<p>Error loading products.</p>";
    return;
  }

  const container = document.getElementById("products-container");
  container.innerHTML = '';

  products.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-3";

    const box = document.createElement("div");
    box.className = "product-boxes__box";

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
