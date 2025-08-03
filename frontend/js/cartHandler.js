////////این صفحه مخصوص صفحاتی مثل product.html هست که یک دکمه Add to Cart دارن.

import { updateBasketUI, addItemToBasket } from './cartManager.js';

document.addEventListener('DOMContentLoaded', () => {
  updateBasketUI();

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const product = {
        id: button.dataset.productId,
        name: button.dataset.productName,
        price: parseFloat(button.dataset.productPrice),
        quantity: 1
      };

      addItemToBasket(product);
    });
  });
});


cartHandler.js

