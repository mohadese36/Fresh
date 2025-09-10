
// // search.js
// import { supabase } from './supabaseClient.js';

// const articlesJSONPath = './articles.json';
// const searchInput = document.querySelector('.Landing__searchBar-input');

// let articles = [];

// async function loadArticles() {
//   const res = await fetch(articlesJSONPath);
//   articles = await res.json();
// }

// loadArticles();

// // جستجوی محصولات از Supabase
// async function searchProducts(query) {
//   const { data: products } = await supabase
//     .from('products')
//     .select('id, name, category_id')
//     .ilike('name', `%${query}%`);

//   return products || [];
// }

// // جستجوی مقالات از JSON
// function searchArticles(query) {
//   return articles.filter(article =>
//     article.title.toLowerCase().includes(query.toLowerCase())
//   );
// }

// // وقتی Enter زده شد، صفحه نتایج باز شود
// searchInput.addEventListener('keydown', async (e) => {
//   if (e.key === 'Enter') {
//     e.preventDefault();
//     const query = searchInput.value.trim();
//     if (!query) return;
//     window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
//   }
// });

// search.js
import { supabase } from './supabaseClient.js';

const searchInput = document.querySelector('.Landing__searchBar-input');
const resultsContainer = document.createElement('div');
resultsContainer.classList.add('search-results-container');
searchInput.parentNode.appendChild(resultsContainer);

let articles = [];

// بارگذاری مقالات JSON
async function loadArticles() {
  try {
    const res = await fetch('data/articles.json');
    articles = await res.json();
    console.log('Articles loaded:', articles); // برای تست
  } catch (err) {
    console.error('Error loading articles:', err);
  }
}
loadArticles();

// جستجوی محصولات Supabase
async function searchProducts(query) {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name')
      .ilike('name', `%${query}%`);
    if (error) {
      console.error('Supabase search error:', error);
      return [];
    }
    return products || [];
  } catch (err) {
    console.error('Error searching products:', err);
    return [];
  }
}

// نمایش نتایج جستجو
async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }

  // منتظر باش تا مقالات بارگذاری بشن
  if (!articles || articles.length === 0) await loadArticles();

  const matchingArticles = articles.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const products = await searchProducts(query);

  let html = '';

  if (products.length) {
    html += `<h4>Products</h4>`;
    html += products
      .map(
        p =>
          `<a href="product.html?id=${p.id}" class="search-result-item">${p.name}</a>`
      )
      .join('');
  }

  if (matchingArticles.length) {
    html += `<h4>Articles</h4>`;
    html += matchingArticles
      .map(
        a =>
          `<a href="blog.html?slug=${a.slug}" class="search-result-item">${a.title}</a>`
      )
      .join('');
  }

  resultsContainer.innerHTML =
    html || '<span class="no-results">No results found</span>';
}

// event live search
searchInput.addEventListener('input', handleSearch);

// Enter هم کار کنه (اختیاری)
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // برای ساده‌سازی، روی اولین نتیجه کلیک کن
      const firstResult = resultsContainer.querySelector('a');
      if (firstResult) firstResult.click();
    }
  }
});
