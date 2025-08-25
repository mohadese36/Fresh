
// وقتی صفحه کامل لود شد، وضعیت سبد خرید رو از localStorage بخون و در UI نمایش بده

import { updateBasketUI } from './basket-box.js';

const observer = new MutationObserver((mutations, obs) => {
  const basket = document.querySelector('.basket-items');
  if (basket) {
    updateBasketUI();
    obs.disconnect(); // دیگه نیازی نیست بیشتر چک کنه
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});






