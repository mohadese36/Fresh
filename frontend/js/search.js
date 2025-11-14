

import { supabase } from './supabaseClient.js';


const input = document.querySelector('#main-search');
if (!input) {
  console.warn('search.js: .Landing__searchBar-input not found on this page.');
} else {
  // ----- UI container -----
  const results = document.createElement('div');
  results.classList.add('search-results-container'); // استایل رو خودت بده
  input.parentNode.appendChild(results);

  // ----- Helpers -----
  const MIN_CHARS = 2;
  const MAX_RESULTS = 8;
  let articles = [];
  let activeIndex = -1;
  let token = 0; // برای جلوگیری از race

  function escapeLike(s) {
    return s.replace(/([%_\\])/g, '\\$1');
  }
  function escReg(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function debounce(fn, delay = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }
  function buildOrForWordPrefix(column, q) {
    // ابتدای کل نام + ابتدای کلمه بعد از جداکننده‌های رایج
    const seps = [' ', '-', '_', '/', '('];
    const patterns = [`${q}%`, ...seps.map(sep => `%${sep}${q}%`)];
    return patterns.map(p => `${column}.ilike.${p}`).join(',');
  }
  function highlightWordStarts(text, q) {
    if (!q) return text;
    // ابتدای رشته یا بعد از فاصله/خط‌تیره/آندرلاین/اسلش/(
    const re = new RegExp(`(^|[\\s\\-_/\\(])(${escReg(q)})`, 'ig');
    return text.replace(re, (_, pre, match) => `${pre}<mark>${match}</mark>`);
  }

  async function loadArticles() {
    if (articles.length) return;
    try {
      const res = await fetch('data/articles.json');
      articles = await res.json();
    } catch (e) {
      console.error('Error loading articles:', e);
    }
  }

  // ----- Data fetchers -----
  async function searchProductsPrefix(query) {
    try {
      const escaped = escapeLike(query);
      const orCond = buildOrForWordPrefix('name', escaped);
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .or(orCond)
        .order('name', { ascending: true })
        .limit(MAX_RESULTS);

      if (error) {
        console.error('Supabase search error:', error);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error('Error searching products:', e);
      return [];
    }
  }

  function searchArticlesPrefix(query) {
    const q = query.toLowerCase();
    const wordStart = (title = '') =>
      title
        .toLowerCase()
        .split(/[\s\-_\/(]+/)
        .some(w => w.startsWith(q)) || title.toLowerCase().startsWith(q);
    return (articles || []).filter(a => wordStart(a.title)).slice(0, MAX_RESULTS);
  }

  // ----- Render -----
  function render(products, arts, query) {
    activeIndex = -1;
    if ((!products || !products.length) && (!arts || !arts.length)) {
      results.innerHTML = `<div class="no-results">No results found</div>`;
      return;
    }

    let html = '';

    if (products?.length) {
      html += `<h4 class="search-section-title fs-4">Products</h4>`;
      html += products
        .map(
          (p, i) =>
            `<a href="product.html?id=${p.id}" class="search-result-item" data-idx="${i}" data-type="product">${highlightWordStarts(
              p.name,
              query
            )}</a>`
        )
        .join('');
    }

    if (arts?.length) {
      html += `<h4 class="search-section-title">Articles</h4>`;
      html += arts
        .map(
          (a, i) =>
            `<a href="blog.html?slug=${a.slug}" class="search-result-item" data-idx="${products.length + i}" data-type="article">${highlightWordStarts(
              a.title,
              query
            )}</a>`
        )
        .join('');
    }

    // View all
    const encoded = encodeURIComponent(query);
    html += `<a class="search-view-all text-center bg-warning fw-bold" href="categori.html?search=${encodeURIComponent(query)}&src=header">View all results</a>`;


    results.innerHTML = html;
  }

  function moveActive(delta) {
    const items = [...results.querySelectorAll('.search-result-item')];
    if (!items.length) return;
    activeIndex = (activeIndex + delta + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
  }

  // ----- Main handler -----
  const handle = debounce(async () => {
    const q = input.value.trim();
    const thisToken = ++token;

    if (!q || q.length < MIN_CHARS) {
      results.innerHTML = '';
      return;
    }

    await loadArticles();

    const [prods, arts] = await Promise.all([
      searchProductsPrefix(q),
      Promise.resolve(searchArticlesPrefix(q)),
    ]);

    // جلوگیری از رندر پاسخ کهنه
    if (thisToken !== token) return;

    render(prods, arts, q);
  }, 250);

  // ----- Events -----
  input.addEventListener('input', handle);

  input.addEventListener('keydown', e => {
    const items = [...results.querySelectorAll('.search-result-item')];
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex].click();
      }
    } else if (e.key === 'Escape') {
      results.innerHTML = '';
    }
  });

  // بستن نتایج با کلیک بیرون
  document.addEventListener('click', (e) => {
    if (e.target === input || results.contains(e.target)) return;
    results.innerHTML = '';
  });

  // فوکوسِ مجدد: اگر کوئری هست، نتایج را بازسازی کن
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= MIN_CHARS) handle();
  });
}


// --- Clear search input & results when returning from another page (back navigation)
// این کد وقتی صفحه از cache لود شده باشد، سرچ‌بار و نتایج را ریست می‌کند.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    const input = document.querySelector('#main-search');
    const results = document.querySelector('.search-results-container');

    if (input) input.value = '';
    if (results) results.innerHTML = '';
  }
});
