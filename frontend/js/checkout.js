import { supabase } from './supabaseClient.js';

const GUEST_USER_ID = 'guest';

async function renderCheckoutItems() {
  const { data: cart, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('user_id', GUEST_USER_ID);

  if (error) return console.error(error.message);

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

