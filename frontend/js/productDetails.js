

// import { supabase } from './supabaseClient.js';

// // import { supabase } from './supabaseClient.js';

// const urlParams = new URLSearchParams(window.location.search);
// const productId = urlParams.get('id');

// async function loadProduct() {
//   if (!productId) {
//     alert('Product ID is missing!');
//     return;
//   }

//   const { data, error } = await supabase
//     .from('products')
//     .select('*')
//     .eq('id', productId)
//     .single();

//   if (error) {
//     alert('Error loading product: ' + error.message);
//     return;
//   }

//   // پر کردن فیلدهای اصلی
//   document.getElementById('product-title').textContent = data.name;
//   document.getElementById('product-description').textContent = data.description;
//   document.getElementById('product-price').textContent = `$${data.price}`;
//   document.getElementById('product-image').src = data.image_url;

//   // تب‌ها
//   populateProductTabs(data);
// }

// window.addEventListener('DOMContentLoaded', loadProduct);

// function populateProductTabs(product) {
//   // ====================== Description Tab ======================
//   const descTab = document.getElementById('desc');
//   descTab.innerHTML = `
//     <h3>${product.name || ''}</h3>
//     <p>${product.description || ''}</p>
//     <p>${product.extra_description || ''}</p>
//   `;

//   // ====================== Ingredients Tab ======================
//   const ingredientsTab = document.getElementById('ingredients');
//   const ingredients = product.ingredients ? product.ingredients.split(',') : [];
//   const ingredientHTML = ingredients.map(item => `
//     <div class="ingredient-item">${item.trim()}</div>
//   `).join('');

//   ingredientsTab.innerHTML = `
//     <h3 class="section-title">Ingredients</h3>
//     <p class="section-description">Our ${product.name || ''} contains the following ingredients:</p>
//     <div class="ingredients-container">
//       ${ingredientHTML || '<div class="ingredient-item">No ingredients listed.</div>'}
//     </div>
//     <p class="no-artificial">${product.no_artificial_note || 'Our sausages do not contain any artificial additives, preservatives, or MSG.'}</p>
//   `;

//   // ====================== Storage Conditions Tab ======================
//   const storageTab = document.getElementById('storage');
//   const storageItems = (product.storage_list && Array.isArray(product.storage_list)) ? product.storage_list : [
//     'Keep refrigerated at 4°C (39°F) or below.',
//     'If you do not plan to use the sausage within a week, we suggest freezing it for up to 3 months.',
//     'For frozen sausages, ensure that they are thawed properly in the refrigerator before cooking.',
//     'Once opened, consume within 3 days for optimal flavor and freshness.'
//   ];

//   const storageHTML = storageItems.map(item => `<li>${item}</li>`).join('');
//   storageTab.innerHTML = `
//     <h3>Storage Conditions</h3>
//     <p>${product.storage_conditions || 'To ensure the best quality and taste, we recommend the following storage conditions:'}</p>
//     <ul>${storageHTML}</ul>
//     <p>${product.storage_note || 'Always check the expiration date on the package for safety. Do not leave the sausage out at room temperature for extended periods.'}</p>
//   `;

//   // ====================== Nutritional Info Tab ======================
//   const nutrition = product.nutrition_info || {};
//   const nutritionTab = document.getElementById('nutrition');
//   nutritionTab.innerHTML = `
//     <div>
//       <h3>Nutritional Information (Per 100g)</h3>
//       <table class="table table-bordered">
//         <thead>
//           <tr><th>Component</th><th>Amount</th></tr>
//         </thead>
//         <tbody>
//           <tr><td>Energy</td><td>${nutrition.Energy || 'N/A'}</td></tr>
//           <tr><td>Protein</td><td>${nutrition.Protein || 'N/A'}</td></tr>
//           <tr><td>Fat</td><td>${nutrition.Fat || 'N/A'}</td></tr>
//           <tr><td>Saturated Fat</td><td>${nutrition['Saturated Fat'] || 'N/A'}</td></tr>
//           <tr><td>Carbohydrates</td><td>${nutrition.Carbohydrates || 'N/A'}</td></tr>
//           <tr><td>Sugars</td><td>${nutrition.Sugars || 'N/A'}</td></tr>
//           <tr><td>Salt</td><td>${nutrition.Salt || 'N/A'}</td></tr>
//           <tr><td>Fiber</td><td>${nutrition.Fiber || 'N/A'}</td></tr>
//         </tbody>
//       </table>
//     </div>
//     <p>${product.nutrition_note || `Our ${product.name || ''} is packed with protein and healthy fats, making it a great addition to a balanced diet.`}</p>
//   `;
// }
import { supabase } from './supabaseClient.js';

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
