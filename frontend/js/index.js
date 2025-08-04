
// وقتی صفحه کامل لود شد، وضعیت سبد خرید رو از localStorage بخون و در UI نمایش بده

console.log("✅ index.js loaded");

import { updateBasketUI } from './basket.js';
window.addEventListener('load', () => {
  updateBasketUI();
});






