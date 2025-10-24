// ✅ our-menu.js (Final Animated Version)
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.circle-links__item');
  const badge = document.getElementById('our-menu-badge');
  const results = document.getElementById('our-menu-results');

  // 🌀 Animation mapping per category slug
  const animationMap = {
    sausage: 'zoomInUp',
    'sausage-varieties': 'zoomInLeft',
    salami: 'zoomInRight',
    burger: 'slideInDown',
    'diet-products': 'zoomInSoft',
    'special-offers': 'slideInLeft'
  };

  // 🎯 Load products from Supabase
  async function loadProducts(type, id, slug) {
    results.classList.add('fade-out');

    setTimeout(async () => {
      let products = [];

      try {
        if (type === 'category') {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', id)
            .eq('show_in_products_menu', true);
          if (error) throw error;
          products = data;
        }

        if (type === 'featured') {
          const { data: joinedData, error } = await supabase
            .from('featured_group_products')
            .select(`product_id, products (*)`)
            .eq('featured_group_id', id);
          if (error) throw error;
          products = joinedData.map((item) => item.products);
        }

        renderProducts(products, slug);
        results.classList.remove('fade-out');
      } catch (err) {
        console.error(err);
        results.innerHTML = `
          <div class="col-12 text-center py-4">
            <p style="color:var(--accent-red-600)">Error loading products.</p>
          </div>`;
        results.classList.remove('fade-out');
      }
    }, 200);
  }

  // ✂️ Truncate description based on screen width
  function truncateByScreen(text) {
    if (!text) return '';
    const width = window.innerWidth;
    let limit;

    if (width >= 1200) limit = 100; // Desktop
    else if (width >= 992) limit = 80;
    else if (width >= 768) limit = 60;
    else if (width >= 576) limit = 100;
    else limit = 44;

    return text.length > limit ? text.substring(0, limit) + '…' : text;
  }

  // 🧩 Render product cards with animation
  function renderProducts(products, slug) {
    results.innerHTML = '';

    products.forEach((p, index) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6';

      // 🎬 Apply animation per category
      const anim = animationMap[slug] || 'zoomInUp';
      col.style.animation = `${anim} 0.4s ease ${index * 0.05}s both`;

      col.innerHTML = `
        <a href="product.html?id=${p.id}" class="our-menu-card-link text-decoration-none">
          <article class="our-menu-card">
            <div class="our-menu-card__img">
              <img src="${p.image_url}" alt="${p.name}">
            </div>
            <div class="our-menu-card__body">
              <h3 class="our-menu-card__title">${p.name}</h3>
              <p class="our-menu-card__desc">${truncateByScreen(p.description)}</p>
              <span class="our-menu-card__price">$${p.price}</span>
            </div>
          </article>
        </a>
      `;

      results.appendChild(col);
    });
  }

  // 🖱 Handle clicks on icons
  items.forEach((item) => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      items.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');

      const type = item.dataset.type;
      const id = parseInt(item.dataset.id);
      const slug = item.dataset.slug;

      badge.textContent = `${type === 'category' ? 'Category:' : 'Featured:'} ${slug.replace(/-/g, ' ')}`;

      await loadProducts(type, id, slug);
    });
  });

  // 🚀 Load default active icon products on page load
  const firstActive = document.querySelector('.circle-links__item.active');
  if (firstActive) {
    loadProducts(firstActive.dataset.type, parseInt(firstActive.dataset.id), firstActive.dataset.slug);
  }
});
