
// ////////این کد درست اجرا میشه


import { supabase } from './supabaseClient.js';
import { addItemToBasket} from './basket-box.js';
import { updateBasketUI } from './basket-box.js';

import { updateHeaderUserInfo } from './user-header.js';

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUserInfo();
});

// 1. گرفتن ID محصول از URL
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// 2. واکشی محصول از Supabase
async function fetchProductDetails(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return;
  }

  displayProductDetails(data);
  displayProductTabs(data);
  // initAddToCart(data); 
}

// 3. نمایش اطلاعات اصلی محصول
function displayProductDetails(product) {
  // عکس
  const img = document.getElementById('product-image');
  if (img) img.src = product.image_url;

  // عنوان
  const title = document.getElementById('product-title');
  if (title) title.textContent = product.name;

  // توضیح کوتاه
  const shortDesc = document.getElementById('product-description');
  if (shortDesc) shortDesc.textContent = product.description;

  // ویژگی‌ها
  const featuresList = document.getElementById('product-features');
  if (featuresList) {
    featuresList.innerHTML = '';
    if (product.features) {
      const features = product.features.split(';');
      features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f.trim();
        featuresList.appendChild(li);
      });
    }
  }

  // نحوه مصرف
  const usage = document.getElementById('product-usage');
  if (usage) usage.textContent = product.usage;

  // ترکیبات
  const ingredients = document.getElementById('product-ingredients');
  if (ingredients) ingredients.textContent = product.ingredients;

  // قیمت
  const price = document.getElementById('product-price');
  if (price) price.textContent = `$${parseFloat(product.price).toFixed(2)}`;

  //دگمه
  const btn = document.createElement('button');
  btn.className = 'add-to-cart-btn';
  btn.dataset.productId = product.id;
  btn.dataset.productName = product.name;
  btn.dataset.productPrice = product.price;
  btn.textContent = 'Add to Cart';
  price.insertAdjacentElement('afterend', btn);

  // اضافه کردن event
btn.addEventListener('click', () => {
  console.log("ppppp");

  const productToAdd = {
    id: btn.dataset.productId,
    name: btn.dataset.productName,
    price: parseFloat(btn.dataset.productPrice),
    quantity: 1
  };
  addItemToBasket(productToAdd);
  updateBasketUI();
});

}

// 4. نمایش تب‌ها
function displayProductTabs(product) {
  // 🟪 Description Tab
  document.getElementById('desc-title').textContent = product.name;
  document.getElementById('desc-text').textContent = product.description;
  document.getElementById('desc-extra').textContent = product.usage;

  // 🟩 Ingredients Tab
  document.getElementById('ingredients-title').textContent = 'Ingredients';
  document.getElementById('ingredients-description').textContent = `Our ${product.name} contains the following ingredients:`;

  const ingredientsContainer = document.getElementById('ingredients-container');
  ingredientsContainer.innerHTML = '';
  if (product.ingredients) {
    const ingredients = product.ingredients.split(',');
    ingredients.forEach(ing => {
      const div = document.createElement('div');
      div.classList.add('ingredient-item');
      div.textContent = ing.trim();
      ingredientsContainer.appendChild(div);
    });
  }

  document.getElementById('ingredients-no-artificial').textContent =
    'Our sausages do not contain any artificial additives, preservatives, or MSG. We only use the best quality natural spices to enhance the taste.';

  // 🟦 Storage Tab
  document.getElementById('storage-text').textContent = `To ensure the best quality and taste, we recommend the following storage conditions for our ${product.name}:`;

  const storageList = document.getElementById('storage-list');
  storageList.innerHTML = '';
  if (product.storage_conditions) {
    const conditions = product.storage_conditions.split('.');
    conditions.forEach(cond => {
      if (cond.trim()) {
        const li = document.createElement('li');
        li.textContent = cond.trim();
        storageList.appendChild(li);
      }
    });
  }

  document.getElementById('storage-note').textContent =
    'Always check the expiration date on the package for safety. Do not leave the sausage out at room temperature for extended periods.';

  // 🟨 Nutrition Tab
  const nutrition = product.nutrition_info;
  if (nutrition) {
    document.getElementById('nutrition-energy').textContent = nutrition.Energy || '-';
    document.getElementById('nutrition-protein').textContent = nutrition.Protein || '-';
    document.getElementById('nutrition-fat').textContent = nutrition.Fat || '-';
    document.getElementById('nutrition-saturated-fat').textContent = nutrition["Saturated Fat"] || '-';
    document.getElementById('nutrition-carbohydrates').textContent = nutrition.Carbohydrates || '-';
    document.getElementById('nutrition-sugars').textContent = nutrition.Sugars || '-';
    document.getElementById('nutrition-salt').textContent = nutrition.Salt || '-';
    document.getElementById('nutrition-fiber').textContent = nutrition.Fiber || '-';
  }

  document.getElementById('nutrition-note').textContent =
    `Our ${product.name} is packed with protein and healthy fats, making it a great addition to a balanced diet. Values shown are per 100g.`;
}

// 5. شروع
const productId = getProductIdFromURL();
if (productId) {
  fetchProductDetails(productId);

} else {
  console.error('No product ID found in URL.');
}


const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get('id'));

// // /////////////نمایش  سبد خرید در هر صفحه :

document.addEventListener('DOMContentLoaded', function () {
  fetch('basket-box.html')
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById('basket-box-container');
      if (container) {
        container.innerHTML = data;
      }
    });
});





