// ✅ related-products.js (نسخه اصلاح‌شده)
// related-products.js — نسخه‌ی پایدار با دیباگ و fallback
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id'); // رشته‌ای نگه می‌داریم (ممکنه UUID باشد)

  console.log('[related] productId from URL =', productId);
  if (!productId) return renderEmpty('No product id in URL.');

  loadRelatedProducts(productId);
});

function renderEmpty(msg) {
  const container = document.getElementById('related-products-container');
  if (!container) return;
  console.warn('[related] empty:', msg);
  container.innerHTML = `<p class="text-muted mb-4">No related products found.</p>`;
}

async function loadRelatedProducts(productId) {
  try {
    // 1) گرفتن دسته‌ی محصول فعلی
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, category_id')
      .eq('id', productId)
      .maybeSingle();

    if (productError) {
      console.error('[related] product fetch error:', productError);
      return renderEmpty('Product fetch error.');
    }
    if (!product) {
      return renderEmpty('Product not found.');
    }

    console.log('[related] current product:', product);

    // 2) اگر category_id نداشت → fallback
    if (!product.category_id) {
      console.warn('[related] product has no category_id; using fallback list.');
      const { data: fallback, error: fbErr } = await supabase
        .from('products')
        .select('*')
        .neq('id', productId)
        .limit(4);

      if (fbErr) {
        console.error('[related] fallback error:', fbErr);
        return renderEmpty('Fallback query failed.');
      }
      return renderRelatedProducts(fallback || []);
    }

    // 3) دریافت محصولات مرتبطِ همان دسته
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', productId)
      .limit(4);

    if (relatedError) {
      console.error('[related] related fetch error:', relatedError);
      return renderEmpty('Related fetch error.');
    }

    console.log('[related] relatedProducts:', relatedProducts);
    if (!relatedProducts || relatedProducts.length === 0) {
      return renderEmpty('No related in same category.');
    }

    renderRelatedProducts(relatedProducts);
  } catch (e) {
    console.error('[related] unexpected error:', e);
    renderEmpty('Unexpected error.');
  }
}

function truncateText(text, maxLength) {
  if (!text) return 'No description available.';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function renderRelatedProducts(products) {
  const container = document.getElementById('related-products-container');
  if (!container) {
    console.error('[related] container not found!');
    return;
  }

  container.innerHTML = '';

  products.forEach(p => {
    // طول توضیح نسبت به عرض صفحه
    let descLimit;
    if (window.innerWidth <= 480) descLimit = 160;
    else if (window.innerWidth <= 768) descLimit = 130;
    else if (window.innerWidth <= 1024) descLimit = 190;
    else descLimit = 60;

    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-6 col-lg-3 mb-4';
    colDiv.innerHTML = `
      <a href="product.html?id=${p.id}" class="related-products__card-link text-decoration-none">
        <div class="related-products__card shadow-sm h-100">
          <div class="related-products__card-img-wrapper">
            <img src="${p.image_url || 'images/products/placeholder.webp'}"
                 class="img-fluid related-products__card-img"
                 alt="${p.name}">
            <div class="related-products__card-seller">Top Seller</div>
            <div class="related-products__card-rating">
              <i class="fa-solid fa-star"></i> ${p.rating || '4.5'}
            </div>
          </div>
          <div class="related-products__card-body text-center">
            <h5 class="related-products__card-title">${p.name}</h5>
            <p class="related-products__card-text">${truncateText(p.description, descLimit)}</p>
            <span class="related-products__card-price text-danger fw-bold">$${p.price || '0.00'}</span>
          </div>
        </div>
      </a>
    `;
    container.appendChild(colDiv);
  });
}



// ------------------- بخش "You May Also Like" (هوشمند و ایزوله) -------------------
(function initYouMayAlsoLike() {
  const container = document.getElementById('youMayAlsoLikeContainer');
  if (!container) return;

  const params = new URLSearchParams(location.search);
  const productId = params.get('id');

  // توابع کمکی داخلی (ایزوله از بقیه فایل)
  function render(cards) {
    container.innerHTML = cards.map(p => `
      <div class="you-may-also-like__card">
        <a href="product.html?id=${p.id}" class="text-decoration-none">
          <img src="${p.image_url || 'images/products/placeholder.webp'}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">$${parseFloat(p.price || 0).toFixed(2)}</p>
        </a>
      </div>
    `).join('');

    // دکمه‌های اسلایدر (بعد از رندر کارت‌ها وصل شوند)
    const slider = document.querySelector('.you-may-also-like__slider');
    const btnPrev = document.querySelector('.slider-btn.prev');
    const btnNext = document.querySelector('.slider-btn.next');

    if (slider && btnPrev && btnNext) {
      btnPrev.onclick = () => slider.scrollBy({ left: -300, behavior: 'smooth' });
      btnNext.onclick = () => slider.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  async function fallbackFromFeatured() {
    try {
      const { data, error } = await supabase
        .from('featured_group_products')
        .select(`
          product_id,
          products ( id, name, image_url, price, description )
        `)
        .eq('featured_group_id', 1)
        .limit(6);

      if (error || !data?.length) {
        container.innerHTML = `<p class="text-muted">No suggestions available.</p>`;
        return;
      }
      render(data.map(x => x.products));
    } catch {
      container.innerHTML = `<p class="text-muted">No suggestions available.</p>`;
    }
  }

  async function loadSmart() {
    if (!productId) return fallbackFromFeatured();

    // 1) محصول فعلی
    const { data: current, error: currErr } = await supabase
      .from('products')
      .select('id, price, category_id')
      .eq('id', productId)
      .maybeSingle();

    if (currErr || !current) return fallbackFromFeatured();

    // اگر دسته ندارد → fallback قدیمی
    if (!current.category_id || current.price == null) return fallbackFromFeatured();

    const minPrice = Number(current.price) * 0.8;
    const maxPrice = Number(current.price) * 1.2;

    // 2) هم‌دسته + نزدیک قیمت
    const { data: byCatAndPrice, error: relErr } = await supabase
      .from('products')
      .select('id, name, image_url, price, description')
      .eq('category_id', current.category_id)
      .neq('id', productId)
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .limit(6);

    if (!relErr && byCatAndPrice?.length) {
      render(byCatAndPrice);
      return;
    }

    // 3) اگر چیزی نبود → فقط هم‌دسته
    const { data: byCat, error: catErr } = await supabase
      .from('products')
      .select('id, name, image_url, price, description')
      .eq('category_id', current.category_id)
      .neq('id', productId)
      .limit(6);

    if (!catErr && byCat?.length) {
      render(byCat);
      return;
    }

    // 4) آخرین انتخاب → fallback قدیمی
    fallbackFromFeatured();
  }

  loadSmart();
})();


// دکمه‌های اسلایدر
const slider = document.querySelector('.you-may-also-like__slider');
const btnPrev = document.querySelector('.slider-btn.prev');
const btnNext = document.querySelector('.slider-btn.next');

if (slider && btnPrev && btnNext) {
  btnPrev.addEventListener('click', () => {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
  });
  btnNext.addEventListener('click', () => {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
  });
}
