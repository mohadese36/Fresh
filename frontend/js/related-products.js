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
  // 🔹 تعیین طول توضیحات بر اساس عرض صفحه
  let descLimit;

  if (window.innerWidth <= 480) {
    descLimit = 160; // 📱 موبایل کوچک
  } else if (window.innerWidth <= 768) {
    descLimit = 130; // 📲 موبایل بزرگ / تبلت عمودی
  } else if (window.innerWidth <= 1024) {
    descLimit = 190; // 💻 تبلت افقی / لپ‌تاپ کوچک
  } else {
    descLimit = 60; // 🖥 دسکتاپ
  }

  // 🔹 ساخت ساختار کارت
  const colDiv = document.createElement('div');
  colDiv.className = 'col-md-6 col-lg-3 mb-4';
  colDiv.innerHTML = `
    <a href="product.html?id=${p.id}" class="related-products__card-link">
      <div class="related-products__card shadow-sm">

        <!-- ✅ تصویر و برچسب‌ها -->
        <div class="related-products__card-img-wrapper">
          <img src="${p.image_url || 'images/products/placeholder.webp'}"
               class="img-fluid related-products__card-img"
               alt="${p.name}">
          
          <div class="related-products__card-seller">Top Seller</div>
          <div class="related-products__card-rating">
            <i class="fa-solid fa-star"></i> ${p.rating || "4.5"}
          </div>
        </div>

        <!-- ✅ بدنه‌ی کارت -->
        <div class="related-products__card-body text-center">
          <h5 class="related-products__card-title">${p.name}</h5>
          <p class="related-products__card-text">${truncateText(p.description, descLimit)}</p>
          <span class="related-products__card-price text-danger fw-bold">
            $${p.price || "0.00"}
          </span>
        </div>
      </div>
    </a>
  `;
  container.appendChild(colDiv);
  });

  // products.forEach(p => {
  // const colDiv = document.createElement('div');
  // colDiv.className = 'col-md-6 col-lg-3 mb-4';
  // colDiv.innerHTML = `
  //   <a href="product.html?id=${p.id}" class="related-products__card-link">
  //     <div class="related-products__card shadow-sm">
        
  //       <!-- ✅ بسته مخصوص تصویر -->
  //       <div class="related-products__card-img-wrapper">
  //         <img src="${p.image_url || 'images/products/placeholder.webp'}"
  //              class="img-fluid related-products__card-img"
  //              alt="${p.name}">
          
  //         <!-- نوار بالا و امتیاز -->
  //         <div class="related-products__card-seller">Top Seller</div>
  //         <div class="related-products__card-rating">
  //           <i class="fa-solid fa-star"></i> ${p.rating || "4.5"}
  //         </div>
  //       </div>

  //       <!-- بدنه‌ی کارت -->
  //       <div class="related-products__card-body text-center">
  //         <h5 class="related-products__card-title">${p.name}</h5>
  //         <p class="related-products__card-text">${truncateText(p.description, 70)}</p>
  //         <span class="related-products__card-price text-danger fw-bold">
  //           $${p.price || "0.00"}
  //         </span>
  //       </div>
  //     </div>
  //   </a>
  // `;
  // container.appendChild(colDiv);
  // });

  // products.forEach(p => {
  //   const colDiv = document.createElement('div');
  //   colDiv.className = 'col-md-6 col-lg-3 mb-4';
  //   colDiv.innerHTML = `
  //     <a href="product.html?id=${p.id}" class="related-products__card-link">
  //       <div class="related-products__card shadow-sm">
  //         <img src="${p.image_url || 'images/products/placeholder.webp'}" class="img-fluid related-products__card-img" alt="${p.name}">
  //         <div class="related-products__card-meta">
  //           <ul>
  //             <li class="related-products__card-seller">Top Seller</li>
  //             <li class="related-products__card-rating"><i class="fa-solid fa-star"></i> ${p.rating || "4.5"}</li>
  //           </ul>
  //         </div>
  //         <div class="related-products__card-body text-center">
  //           <h5 class="related-products__card-title">${p.name}</h5>
  //           <p class="related-products__card-text">${truncateText(p.description, 50)}</p>
  //           <span class="related-products__card-price text-danger fw-bold">$${p.price || "0.00"}</span>
  //         </div>
  //       </div>
  //     </a>
  //   `;
  //   container.appendChild(colDiv);
  // });
}

loadRelatedProducts();

///////////// بخش You May Also Like

// import { supabase } from './supabaseClient.js';
// import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('youMayAlsoLikeContainer');
  if (!container) return;

  try {
    // ✅ گرفتن محصولات مربوط به گروه Special Offers (id = 1)
    const { data, error } = await supabase
      .from('featured_group_products')
      .select(`
        product_id,
        products (
          id,
          name,
          image_url,
          price,
          description
        )
      `)
      .eq('featured_group_id', 1)
      .limit(6);

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = `<p style="color:#b91c1c; font-weight:600;">⚠️ No offers found.</p>`;
      return;
    }

    // ✅ ساخت کارت‌های محصولات آفر
    const cardsHTML = data.map(item => {
      const p = item.products;
      return `
        <div class="you-may-also-like__card">
          <img src="${p.image_url}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">$${p.price}</p>
        </div>
      `;
    }).join('');

    container.innerHTML = cardsHTML;

  } catch (err) {
    console.error('Error loading Special Offers:', err);
    container.innerHTML = `<p style="color:#b91c1c; font-weight:600;">⚠️ Failed to load offers.</p>`;
  }
});

// Slider buttons
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


