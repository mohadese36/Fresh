// import { supabase } from './supabaseClient.js';

// document.addEventListener('DOMContentLoaded', async () => {
//   const params = new URLSearchParams(window.location.search);
//   const slug = params.get('slug');
//   if (!slug) return;

//   const { data: product, error } = await supabase
//     .from('products')
//     .select('*')
//     .eq('slug', slug)
//     .single();

//   if (error || !product) {
//     document.body.innerHTML = '<p>محصول پیدا نشد!</p>';
//     return;
//   }

//   const container = document.getElementById('product-container');
//   container.innerHTML = `
//     <h1>${product.name}</h1>
//     <img src="${product.image_url}" alt="${product.name}" />
//     <p>${product.description}</p>
//     <p><strong>قیمت:</strong> ${product.price} €</p>
//   `;
// });


/////////////
import { supabase } from './supabaseClient.js';





// import { supabase } from './supabaseClient.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function loadProduct() {
  if (!productId) {
    alert('Product ID is missing!');
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    alert('Error loading product: ' + error.message);
    return;
  }

  // پر کردن فیلدهای اصلی
  document.getElementById('product-title').textContent = data.name;
  document.getElementById('product-description').textContent = data.description;
  document.getElementById('product-price').textContent = `$${data.price}`;
  document.getElementById('product-image').src = data.image_url;

  // تب‌ها
  populateProductTabs(data);
}

window.addEventListener('DOMContentLoaded', loadProduct);

function populateProductTabs(product) {
  document.getElementById('desc-title').textContent = product.name || '';
  document.getElementById('desc-text').textContent = product.description || '';
  document.getElementById('desc-extra').textContent = product.extra_description || '';

  document.getElementById('ingredients-description').textContent = "Our " + (product.name || '') + " contains the following ingredients:";

  const ingredientsContainer = document.getElementById('ingredients-container');
  ingredientsContainer.innerHTML = '';
  if(product.ingredients){
    product.ingredients.split(',').forEach(ing => {
      const div = document.createElement('div');
      div.classList.add('ingredient-item');
      div.textContent = ing.trim();
      ingredientsContainer.appendChild(div);
    });
  } else {
    ingredientsContainer.textContent = 'No ingredients listed.';
  }

  document.getElementById('ingredients-no-artificial').textContent = product.no_artificial_note || 'Our sausages do not contain any artificial additives, preservatives, or MSG.';

  document.getElementById('storage-text').textContent = product.storage_conditions || 'No storage info available.';
  const storageList = document.getElementById('storage-list');
  storageList.innerHTML = '';
  if(product.storage_list && Array.isArray(product.storage_list)){
    product.storage_list.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      storageList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Keep refrigerated at 4°C (39°F) or below.';
    storageList.appendChild(li);
  }
  document.getElementById('storage-note').textContent = product.storage_note || 'Always check the expiration date on the package for safety.';

  const nutrition = product.nutrition_info || {};
  document.getElementById('nutrition-energy').textContent = nutrition.Energy || 'N/A';
  document.getElementById('nutrition-protein').textContent = nutrition.Protein || 'N/A';
  document.getElementById('nutrition-fat').textContent = nutrition.Fat || 'N/A';
  document.getElementById('nutrition-saturated-fat').textContent = nutrition['Saturated Fat'] || 'N/A';
  document.getElementById('nutrition-carbohydrates').textContent = nutrition.Carbohydrates || 'N/A';
  document.getElementById('nutrition-sugars').textContent = nutrition.Sugars || 'N/A';
  document.getElementById('nutrition-salt').textContent = nutrition.Salt || 'N/A';
  document.getElementById('nutrition-fiber').textContent = nutrition.Fiber || 'N/A';

  document.getElementById('nutrition-note').textContent = product.nutrition_note || 'Our ' + (product.name || '') + ' is packed with protein and healthy fats, making it a great addition to a balanced diet.';
}


///////////////////////
// import { supabase } from './supabaseClient.js';

// // گرفتن id محصول از URL
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

// if (error) {
//   alert('Error loading product: ' + error.message);
//   return;
// }

// // پر کردن فیلدهای صفحه با اطلاعات محصول
// document.getElementById('product-title').textContent = data.name;
// document.getElementById('product-description').textContent = data.description;
// document.getElementById('product-price').textContent = `$${data.price}`;
// document.getElementById('product-image').src = data.image_url;

// // ... سایر فیلدها ...

// // ⬅️ این خط رو همین‌جا اضافه کن:
// createProductTabs(data);


//   // پر کردن فیلدهای صفحه با اطلاعات محصول
//   document.getElementById('product-title').textContent = data.name;
//   document.getElementById('product-description').textContent = data.description;
//   document.getElementById('product-price').textContent = `$${data.price}`;
//   document.getElementById('product-image').src = data.image_url;

//   // اگر فیلدهای features, usage, ingredients داری
//   if (data.features) {
//     const featuresList = document.getElementById('product-features');
//     featuresList.innerHTML = '';
//     data.features.split(';').forEach(feature => {
//       const li = document.createElement('li');
//       li.textContent = feature.trim();
//       featuresList.appendChild(li);
//     });
//   }

//   if (data.usage) {
//     document.getElementById('product-usage').textContent = data.usage;
//   }

//   if (data.ingredients) {
//     document.getElementById('product-ingredients').textContent = data.ingredients;
//   }

//   // تب‌ها (Description، Ingredients، Storage، Nutrition) رو هم اینجا داینامیک کن اگر داده داری
// }

// window.addEventListener('DOMContentLoaded', loadProduct);





// function createProductTabs(product) {
//   const container = document.getElementById('product-tabs-container');

//   container.innerHTML = `
//     <!-- Navigation Tabs -->
//     <ul class="nav nav-tabs" id="productTab" role="tablist">
//       <li class="nav-item" role="presentation">
//         <button class="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc" type="button" role="tab">Description</button>
//       </li>
//       <li class="nav-item" role="presentation">
//         <button class="nav-link" id="ingredients-tab" data-bs-toggle="tab" data-bs-target="#ingredients" type="button" role="tab">Ingredients</button>
//       </li>
//       <li class="nav-item" role="presentation">
//         <button class="nav-link" id="storage-tab" data-bs-toggle="tab" data-bs-target="#storage" type="button" role="tab">Storage Conditions</button>
//       </li>
//       <li class="nav-item" role="presentation">
//         <button class="nav-link" id="nutrition-tab" data-bs-toggle="tab" data-bs-target="#nutrition" type="button" role="tab">Nutritional Info</button>
//       </li>
//     </ul>

//     <!-- Tab Content -->
//     <div class="tab-content mt-3" id="productTabContent">

//       <!-- Description Tab -->
//       <div class="tab-pane fade show active" id="desc" role="tabpanel">
//         <h3>${product.name}</h3>
//         <p>${product.description}</p>
//         <p>${product.extra_description || ''}</p>
//       </div>

//       <!-- Ingredients Tab -->
//       <div class="tab-pane fade" id="ingredients" role="tabpanel">
//         <h3 class="section-title">Ingredients</h3>
//         <p>${product.ingredients_description || 'Contains:'}</p>
//         <div class="ingredients-container">
//           ${(product.ingredients_list || [])
//             .map(item => `<div class="ingredient-item">${item}</div>`)
//             .join('')}
//         </div>
//         <p class="no-artificial">${product.no_artificial_note || ''}</p>
//       </div>

//       <!-- Storage Conditions Tab -->
//       <div class="tab-pane fade" id="storage" role="tabpanel">
//         <h3>Storage Conditions</h3>
//         <p>${product.storage_text || ''}</p>
//         <ul>
//           ${(product.storage_list || []).map(item => `<li>${item}</li>`).join('')}
//         </ul>
//         <p>${product.storage_note || ''}</p>
//       </div>

//       <!-- Nutritional Info Tab -->
//       <div class="tab-pane fade" id="nutrition" role="tabpanel">
//         <h3>Nutritional Information (Per 100g)</h3>
//         <table class="table table-bordered">
//           <thead>
//             <tr><th>Component</th><th>Amount</th></tr>
//           </thead>
//           <tbody>
//             ${product.nutrition
//               ? Object.entries(product.nutrition).map(
//                   ([key, value]) =>
//                     `<tr><td>${key}</td><td>${value}</td></tr>`
//                 ).join('')
//               : '<tr><td colspan="2">No data available</td></tr>'}
//           </tbody>
//         </table>
//         <p>${product.nutrition_note || ''}</p>
//       </div>

//     </div>
//   `;
// }


// --------------------
// // import { supabase } from './supabaseClient.js';

// document.addEventListener('DOMContentLoaded', async () => {
//   const { data, error } = await supabase
//     .from('products')
//     .select('*');

//   if (error) {
//     console.error('Error fetching products:', error.message);
//   } else {
//     console.table(data);
//   }
// });
// --------------------