
import { supabase } from './supabaseClient.js';

export async function fetchProducts() {
  const { data, error } = await supabase
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
          name
        )
    `)
    .order('category_id', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export function renderProducts(products) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  const grouped = {};

  products.forEach(product => {
    const cat = product.category.name;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(product);
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
              <a href="#">
                <img src="${prod.image_url || 'images/products/placeholder.jpg'}" alt="${prod.name}" class="img-fluid improduct-box__img-main">
              </a>
              <div class="product-box__main">
                <div class="col-7 ps-2 product-box__detiles">
                  <a class="product-box__detiles-title">${prod.name}</a>
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
