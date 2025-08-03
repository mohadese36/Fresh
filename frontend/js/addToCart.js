



// export function initAddToCart(productId) {
//   const addToCartBtn = document.getElementById('add-to-cart');

//   if (!addToCartBtn) return;

//   addToCartBtn.addEventListener('click', () => {
//     const quantityInput = document.getElementById('quantity');
//     const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

//     const cartItem = {
//       productId,
//       quantity
//     };

//     localStorage.setItem('cart', JSON.stringify([cartItem]));

//     // ریدایرکت نسبی
//     window.location.href = './checkout.html';
//   });
// }

///////////////////

// export function initAddToCart(productId) {
//   const addToCartBtn = document.getElementById('add-to-cart');
//   const quantityInput = document.getElementById('quantity');

//   if (!addToCartBtn || !quantityInput) return;

//   // موقع لود صفحه، مقدار quantity رو از localStorage بارگذاری کن
//   setQuantityFromCart(productId);

//   addToCartBtn.addEventListener('click', () => {
//     const quantity = parseInt(quantityInput.value) || 1;

//     // دریافت سبد خرید قبلی یا آرایه جدید
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];

//     // بررسی وجود محصول در سبد خرید
//     const existingIndex = cart.findIndex(item => item.productId === productId);

//     if (existingIndex !== -1) {
//       // اگر محصول بود، مقدار quantity رو به‌روز کن
//       cart[existingIndex].quantity = quantity;
//     } else {
//       // اگر نبود، محصول جدید اضافه کن
//       cart.push({ productId, quantity });
//     }

//     // ذخیره سبد خرید جدید
//     localStorage.setItem('cart', JSON.stringify(cart));

//     // ریدایرکت به صفحه تسویه حساب
//     window.location.href = './checkout.html';
//   });
// }

// function setQuantityFromCart(productId) {
//   const quantityInput = document.getElementById('quantity');
//   if (!quantityInput) return;

//   const cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const item = cart.find(item => item.productId === productId);

//   if (item) {
//     quantityInput.value = item.quantity;
//   }
// }

/////////////////کدهای امروز یکشنبه

// export function initAddToCart(productId) {
//   document.addEventListener('DOMContentLoaded', () => {
//     const addToCartBtn = document.getElementById('add-to-cart');
//     const quantityInput = document.getElementById('quantity');

//     if (!addToCartBtn || !quantityInput) return;

//     addToCartBtn.addEventListener('click', () => {
//       const quantity = parseInt(quantityInput.value);
//       const name = document.getElementById('product-title')?.textContent;
//       const priceText = document.getElementById('product-price')?.textContent;
//       const price = priceText ? parseFloat(priceText.replace('$', '')) : 0;

//       const cart = JSON.parse(localStorage.getItem('cart')) || [];

//       const existingItem = cart.find(item => item.id === productId);

//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         cart.push({
//           id: productId,
//           name: name,
//           price: price,
//           quantity: quantity,
//         });
//       }

//       localStorage.setItem('cart', JSON.stringify(cart));
//       updateCartIcon();
//     });

//     function updateCartIcon() {
//       const cartIcon = document.getElementById('cart-count');
//       const cart = JSON.parse(localStorage.getItem('cart')) || [];
//       const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

//       if (cartIcon) {
//         cartIcon.textContent = totalItems;
//         cartIcon.style.display = totalItems > 0 ? 'inline-block' : 'none';
//       }
//     }

//     updateCartIcon();
//   });
// }
///////


export function initAddToCart(productId) {
  document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtn = document.getElementById('add-to-cart');
    const quantityInput = document.getElementById('quantity');

    if (!addToCartBtn || !quantityInput) return;

    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value);
      const name = document.getElementById('product-title')?.textContent;
      const priceText = document.getElementById('product-price')?.textContent;
      const price = priceText ? parseFloat(priceText.replace('$', '')) : 0;

      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingItem = cart.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: productId,
          name: name,
          price: price,
          quantity: quantity,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartIcon();
    });

    function updateCartIcon() {
      const cartIcon = document.getElementById('cart-count');
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

      if (cartIcon) {
        cartIcon.textContent = totalItems;
        cartIcon.style.display = totalItems > 0 ? 'inline-block' : 'none';
      }
    }

    updateCartIcon();
  });
}