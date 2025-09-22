// import { supabase } from './supabaseClient.js';

// const GUEST_USER_ID = 'guest';

// async function renderCheckoutItems() {
//   const { data: cart, error } = await supabase
//     .from('cart_items')
//     .select(`
//       id,
//       quantity,
//       products (
//         id,
//         name,
//         price,
//         image_url
//       )
//     `)
//     .eq('user_id', GUEST_USER_ID);

//   if (error) return console.error(error.message);

//   const container = document.getElementById('checkout-items');
//   container.innerHTML = '';

//   if (!cart || cart.length === 0) {
//     container.innerHTML = `<p class="text-center">Your basket is empty.</p>`;
//     return;
//   }

//   let total = 0;
//   cart.forEach(item => {
//     total += item.products.price * item.quantity;

//     const card = document.createElement('div');
//     card.className = 'card mb-3';
//     card.innerHTML = `
//       <div class="row g-0 align-items-center">
//         <div class="col-3">
//           <img src="${item.products.image_url}" class="img-fluid rounded-start" alt="${item.products.name}">
//         </div>
//         <div class="col-6">
//           <div class="card-body p-2">
//             <h6 class="card-title mb-1">${item.products.name}</h6>
//             <p class="card-text mb-1">£${item.products.price.toFixed(2)} x ${item.quantity}</p>
//           </div>
//         </div>
//         <div class="col-3 text-end">
//           <p class="fw-bold mb-0">£${(item.products.price * item.quantity).toFixed(2)}</p>
//         </div>
//       </div>
//     `;
//     container.appendChild(card);
//   });
// }

// document.addEventListener('DOMContentLoaded', renderCheckoutItems);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////


// // checkout.js
// import { supabase } from './supabaseClient.js';
// import { getVisitorId } from './visitor.js';

// const VISITOR_ID = getVisitorId();

// export async function renderCheckoutItems() {
//   const { data: cart, error } = await supabase
//     .from('cart_items')
//     .select(`id, quantity, products (id, name, price, image_url)`)
//     .eq('user_id', VISITOR_ID);

//   if (error) return console.error(error.message);

//   const container = document.getElementById('checkout-items');
//   if (!container) return;
//   container.innerHTML = '';

//   if (!cart || cart.length === 0) {
//     container.innerHTML = `<p class="text-center">Your basket is empty.</p>`;
//     return;
//   }

//   let total = 0;
//   cart.forEach(item => {
//     total += item.products.price * item.quantity;

//     const card = document.createElement('div');
//     card.className = 'card mb-3';
//     card.innerHTML = `
//       <div class="row g-0 align-items-center">
//         <div class="col-3">
//           <img src="${item.products.image_url}" class="img-fluid rounded-start" alt="${item.products.name}">
//         </div>
//         <div class="col-6">
//           <div class="card-body p-2">
//             <h6 class="card-title mb-1">${item.products.name}</h6>
//             <p class="card-text mb-1">£${item.products.price.toFixed(2)} x ${item.quantity}</p>
//           </div>
//         </div>
//         <div class="col-3 text-end">
//           <p class="fw-bold mb-0">£${(item.products.price * item.quantity).toFixed(2)}</p>
//         </div>
//       </div>
//     `;
//     container.appendChild(card);
//   });

//   const totalEl = document.getElementById('checkout-total');
//   if (totalEl) totalEl.textContent = `£${total.toFixed(2)}`;
// }

// // -------------------------
// // بارگذاری اولیه
// document.addEventListener('DOMContentLoaded', renderCheckoutItems);




import { supabase } from './supabaseClient.js';
import { getCurrentUserId } from './user.js';
import { updateHeaderUserInfo } from './user-header.js';

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUserInfo();
});


const CURRENT_USER_ID = getCurrentUserId();

async function renderCheckoutItems() {
  const { data: cart } = await supabase
    .from('cart_items')
    .select(`id, quantity, products(id, name, price, image_url)`)
    .eq('user_id', CURRENT_USER_ID);

  const container = document.getElementById('checkout-items');
  container.innerHTML = '';

  if (!cart || cart.length === 0) {
    container.innerHTML = `<p class="text-center">Your basket is empty.</p>`;
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.products.price * item.quantity;
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="row g-0 align-items-center">
        <div class="col-3">
          <img src="${item.products.image_url}" class="img-fluid rounded-start" alt="${item.products.name}">
        </div>
        <div class="col-6">
          <div class="card-body p-2">
            <h6 class="card-title mb-1">${item.products.name}</h6>
            <p class="card-text mb-1">£${item.products.price.toFixed(2)} x ${item.quantity}</p>
          </div>
        </div>
        <div class="col-3 text-end">
          <p class="fw-bold mb-0">£${(item.products.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderCheckoutItems);

