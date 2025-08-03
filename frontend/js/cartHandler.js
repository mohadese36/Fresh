////////این صفحه مخصوص صفحاتی مثل product.html هست که یک دکمه Add to Cart دارن.


import { updateBasketUI, addItemToBasket } from './cartManager.js';

document.addEventListener('DOMContentLoaded', () => {
  updateBasketUI();

  const addToCartBtn = document.querySelector('.add-to-cart-btn');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const product = {
        id: addToCartBtn.dataset.productId,
        name: addToCartBtn.dataset.productName,
        price: parseFloat(addToCartBtn.dataset.productPrice),
        quantity: 1
      };

      addItemToBasket(product);
      updateBasketUI(); // 👈 این خط خیلی مهمه
    });
  }
});


