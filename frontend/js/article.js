
import { updateHeaderUserInfo } from './user-header.js';

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUserInfo();
});



async function fetchArticles() {
  try {
    const response = await fetch('data/articles.json');
    const articles = await response.json();

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const article = articles.find(a => a.slug === slug) || articles[0];

    const articleContainer = document.getElementById('article-container');

    const fullStars = Math.floor(article.rating);
    const hasHalfStar = article.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const starsHtml = `
      ${'<img src="images/svgs/star_fill.svg" class="article__score-icon" />'.repeat(fullStars)}
      ${hasHalfStar ? '<img src="images/svgs/star_half.svg" class="article__score-icon" />' : ''}
      ${'<img src="images/svgs/star.svg" class="article__score-icon" />'.repeat(emptyStars)}
    `;

    let contentHtml = '';
    article.content.forEach(item => {
      if (item.type === 'paragraph') {
        contentHtml += `
          <div class="article-section">
            <p class="paragraph article-section__text">${item.text}</p>
        `;
      } else if (item.type === 'heading') {
        contentHtml += `<h2 class="article-section__title">${item.text}</h2>`;
      } else if (item.type === 'image') {
        contentHtml += `<img src="${item.src}" alt="${item.alt}" class="article__seconadary-banner " />`;
        if (contentHtml.includes('<div class="article-section">')) {
          contentHtml += `</div>`;
        }
      }
    });
    if (contentHtml.includes('<div class="article-section">')) {
      contentHtml += `</div>`;
    }

    const articleHtml = `
      <div class="article" id="article-${article.id}">
        <h1 class="article__title">${article.title}</h1>
        <div class="article__header">
          <div class="article-header__category article-header__item">
            <i class="far fa-folder article-header__icon"></i>
            <a href="#" class="article-header__text">${article.category}</a>
          </div>
          <div class="article-header__category article-header__item">
            <i class="far fa-user article-header__icon"></i>
            <span class="article-header__text">Posted by ${article.author}</span>
          </div>
          <div class="article-header__category article-header__item">
            <i class="far fa-clock article-header__icon"></i>
            <span class="article-header__text">${article.date}</span>
          </div>
          <div class="article-header__category article-header__item">
            <i class="far fa-eye article-header__icon"></i>
            <span class="article-header__text">${article.views} Views</span>
          </div>
        </div>
        <img src="${article.cover}" alt="Article Cover" class="article__banner" />
        <div class="article__score">
          <div class="article__score-icons">
            ${starsHtml}
          </div>
          <span class="article__score-text">${article.rating}/5 - (${article.ratingCount} Ratings)</span>
        </div>
        <div class="article-read">
          <span class="article-read__title">What You Will Learn in This Article</span>
          <ul class="article-read__list">
            <li class="article-read__item"><a href="#" class="article-read__link">Benefits of High-Protein Diets</a></li>
            <li class="article-read__item"><a href="#" class="article-read__link">Choosing Quality Meat Products</a></li>
            <li class="article-read__item"><a href="#" class="article-read__link">Shop Our Premium Collection</a></li>
          </ul>
        </div>
        ${contentHtml}
        <div class="article_social-media">
          <span class="article-social-media__text">Share</span>
          <a href="#" class="article-social-media__link"><i class="fab fa-telegram-plane article-social-media__icon"></i></a>
          <a href="#" class="article-social-media__link"><i class="fab fa-twitter article-social-media__icon"></i></a>
          <a href="#" class="article-social-media__link"><i class="fab fa-facebook-f article-social-media__icon"></i></a>
        </div>
      </div>
    `;
    articleContainer.innerHTML = articleHtml;

    const latestArticlesList = document.getElementById('latest-articles-list');
    const articlesHtml = articles.map(article => `
      <li class="last-articles__item">
        <a href="?slug=${article.slug}" class="last-articles__link">${article.title}</a>
      </li>
    `).join('');
    latestArticlesList.innerHTML = articlesHtml;
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('article-container').innerHTML = '<p>Error loading article. Please try again.</p>';
  }
}

fetchArticles();



    // async function fetchArticles() {
    //   try {
    //     // فرض می‌کنیم فایل JSON در مسیر data/articles.json قرار دارد
    //     const response = await fetch('data/articles.json');
    //     const articles = await response.json();

    //     // لود مقاله بر اساس slug از URL
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const slug = urlParams.get('slug');
    //     const article = articles.find(a => a.slug === slug) || articles[0]; // اگه slug نبود، اولین مقاله لود می‌شه

    //     const articleContainer = document.getElementById('article-container');

    //     // محاسبه ستاره‌های پر، نیمه‌پر و خالی
    //     const fullStars = Math.floor(article.rating);
    //     const hasHalfStar = article.rating % 1 >= 0.5;
    //     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    //     const starsHtml = `
    //       ${'<img src="images/svgs/star_fill.svg" class="article__score-icon" />'.repeat(fullStars)}
    //       ${hasHalfStar ? '<img src="images/svgs/star_half.svg" class="article__score-icon" />' : ''}
    //       ${'<img src="images/svgs/star.svg" class="article__score-icon" />'.repeat(emptyStars)}
    //     `;

    //     // رندر محتوای مقاله (پاراگراف‌ها و تصاویر)
    //     let contentHtml = '';
    //     let sectionCount = 0;
    //     article.content.forEach(item => {
    //       if (item.type === 'paragraph') {
    //         // هر پاراگراف را در یک section قرار می‌دهیم
    //         sectionCount++;
    //         contentHtml += `
    //           <div class="article-section">
    //             <h2 class="article-section__title">Section ${sectionCount}</h2>
    //             <p class="paragraph article-section__text">${item.text}</p>
    //         `;
    //       } else if (item.type === 'image') {
    //         contentHtml += `<img src="${item.src}" alt="${item.alt}" class="article__seconadary-banner" />`;
    //         // بستن div فقط در صورتی که پاراگراف قبلی باز شده باشد
    //         if (contentHtml.includes('<div class="article-section">')) {
    //           contentHtml += `</div>`;
    //         }
    //       }
    //     });
    //     // بستن div آخر اگر باز مانده باشد
    //     if (contentHtml.includes('<div class="article-section">')) {
    //       contentHtml += `</div>`;
    //     }

    //     // ساختار HTML مقاله
    //     const articleHtml = `
    //       <div class="article" id="article-${article.id}">
    //         <h1 class="article__title">${article.title}</h1>
    //         <div class="article__header">
    //           <div class="article-header__category article-header__item">
    //             <i class="far fa-folder article-header__icon"></i>
    //             <a href="#" class="article-header__text">${article.category}</a>
    //           </div>
    //           <div class="article-header__category article-header__item">
    //             <i class="far fa-user article-header__icon"></i>
    //             <span class="article-header__text">Posted by ${article.author}</span>
    //           </div>
    //           <div class="article-header__category article-header__item">
    //             <i class="far fa-clock article-header__icon"></i>
    //             <span class="article-header__text">${article.date}</span>
    //           </div>
    //           <div class="article-header__category article-header__item">
    //             <i class="far fa-eye article-header__icon"></i>
    //             <span class="article-header__text">${article.views} Views</span>
    //           </div>
    //         </div>
    //         <img src="${article.cover}" alt="Article Cover" class="article__banner" />
    //         <div class="article__score">
    //           <div class="article__score-icons">
    //             ${starsHtml}
    //           </div>
    //           <span class="article__score-text">${article.rating}/5 - (${article.ratingCount} Ratings)</span>
    //         </div>
    //         ${contentHtml}
    //         <div class="article-read">
    //           <span class="article-read__title">What You Will Learn in This Article</span>
    //           <ul class="article-read__list">
    //             <li class="article-read__item"><a href="#" class="article-read__link">Benefits of High-Protein Diets</a></li>
    //             <li class="article-read__item"><a href="#" class="article-read__link">Choosing Quality Meat Products</a></li>
    //             <li class="article-read__item"><a href="#" class="article-read__link">Shop Our Premium Collection</a></li>
    //           </ul>
    //         </div>
    //         <div class="article_social-media">
    //           <span class="article-social-media__text">Share</span>
    //           <a href="#" class="article-social-media__link"><i class="fab fa-telegram-plane article-social-media__icon"></i></a>
    //           <a href="#" class="article-social-media__link"><i class="fab fa-twitter article-social-media__icon"></i></a>
    //           <a href="#" class="article-social-media__link"><i class="fab fa-facebook-f article-social-media__icon"></i></a>
    //         </div>
    //       </div>
    //     `;
    //     articleContainer.innerHTML = articleHtml;

    //     // رندر لیست مقاله‌ها در سایدبار
    //     const latestArticlesList = document.getElementById('latest-articles-list');
    //     const articlesHtml = articles.map(article => `
    //       <li class="last-articles__item">
    //         <a href="?slug=${article.slug}" class="last-articles__link">${article.title}</a>
    //       </li>
    //     `).join('');
    //     latestArticlesList.innerHTML = articlesHtml;
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //     document.getElementById('article-container').innerHTML = '<p>Error loading article. Please try again.</p>';
    //   }
    // }

    // // اجرای تابع دریافت مقاله‌ها
    // fetchArticles();
////////////////////////////////////////////////////////////////////////

// برای واکشی محصولات Best Sellers از دیتابیس 
import { supabase } from './supabaseClient.js';

async function loadBestSellers() {
  const productList = document.querySelector('.product-info__products-list');
  productList.innerHTML = ''; // خالی کردن آیتم‌های استاتیک

  // گرفتن محصولات Best Sellers از دیتابیس
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url')
    .in('id', [66, 67, 68, 69, 70, 71]) // آی‌دی‌های Best Sellers
    .limit(5);

  if (error) {
    console.error('Error fetching best sellers:', error.message);
    return;
  }

  // ساخت HTML داینامیک
  products.forEach(product => {
    const li = document.createElement('li');
    li.className = 'product-info__products-list-item';

    li.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-info__products-link">
        <img src="${product.image_url}" alt="${product.name}" class="product-info__products-img" />
        <span class="product-info__products-text">${product.name}</span>
      </a>
    `;

    productList.appendChild(li);
  });
}

// اجرای تابع بعد از لود شدن صفحه
document.addEventListener('DOMContentLoaded', loadBestSellers);
