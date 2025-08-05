
export function addItemToBasket(product) {
  let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

  const existingItem = cart.find(item => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cart));

  updateBasketUI();
}

export function updateBasketUI() {
  const emptyMessage = document.querySelector('.basket-is-empty');
  const notEmptySections = document.querySelectorAll('.basket-is-not-empty');
  const basketBody = document.querySelector('.basket-items');

  let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (cart.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    notEmptySections.forEach(el => (el.style.display = 'none'));
    if (basketBody) basketBody.innerHTML = '';

    // ⛔ مخفی‌کردن دکمه‌ی checkout در حالت خالی
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';

    return;
  }

  if (emptyMessage) emptyMessage.style.display = 'none';
  notEmptySections.forEach(el => (el.style.display = 'block'));

  if (!basketBody) return;

  basketBody.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="side-basket-qty">
        ${item.quantity}
        <div class="side-basket-controls side-basket-controls-qty">
          <button class="btn decrease" data-id="${item.productId}" title="Decrease quantity"><i class="bi bi-dash-lg"></i></button>
          <button class="btn increase" data-id="${item.productId}" title="Increase quantity"><i class="bi bi-plus-lg"></i></button>
        </div>
      </td>
      <td class="side-basket-name">
        <a href="/p/${item.productId}/" class="text-dark">${item.name}</a>
      </td>
      <td class="side-basket-price">
        £${(item.price * item.quantity).toFixed(2)}
        <div class="side-basket-controls side-basket-controls-remove">
          <button class="btn remove" data-id="${item.productId}" title="Remove item"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    `;

    basketBody.appendChild(row);
  });

  const guidePriceEl = document.querySelector('.basket-guide-price');
  if (guidePriceEl) {
    guidePriceEl.textContent = `£${total.toFixed(2)}`;
  }

  // ✅ نمایش دکمه checkout فقط زمانی که cart پر است
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
  }

  addBasketControlsListeners();
  setTimeout(addBasketControlsListeners, 50);
}


function addBasketControlsListeners() {
  document.querySelectorAll('.basket-items .increase').forEach(btn => {
    btn.onclick = () => changeQuantity(btn.dataset.id, 1);
  });
  document.querySelectorAll('.basket-items .decrease').forEach(btn => {
    btn.onclick = () => changeQuantity(btn.dataset.id, -1);
  });
  document.querySelectorAll('.basket-items .remove').forEach(btn => {
    btn.onclick = () => removeItem(btn.dataset.id);
  });
}

function changeQuantity(productId, delta) {
  let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = cart.find(i => i.productId === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;

  localStorage.setItem('cartItems', JSON.stringify(cart));
  updateBasketUI();
}

function removeItem(productId) {
  let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  cart = cart.filter(i => i.productId !== productId);
  localStorage.setItem('cartItems', JSON.stringify(cart));
  updateBasketUI();
}


