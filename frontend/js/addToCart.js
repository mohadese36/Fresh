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
