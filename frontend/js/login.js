

// const loginForm = document.querySelector('.login-form');

// loginForm.addEventListener('submit', async (e) => {
//   e.preventDefault(); // از ریفرش شدن صفحه جلوگیری میکنیم
  
//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;

//   const response = await fetch('http://localhost:3000/auth/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username, password }),
//   });
  
  

//   const result = await response.json();

//   if (response.status === 200) {
//     alert(result.message); // ✅ ورود موفقیت‌آمیز
//     localStorage.setItem('token', result.token);
//     window.location.href = 'dashboard.html';
//   } else if (response.status === 404) {
//     alert(result.message); // ❌ کاربری یافت نشد
//   } else {
//     alert('❌ خطای سرور');
//   }
  
  
// });




//////////////////

const loginForm = document.querySelector('.login-form');

// ✅ هندل لاگین
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // جلوگیری از ریفرش شدن صفحه
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  if (response.status === 200) {
    alert(result.message); // ✅ ورود موفقیت‌آمیز
    localStorage.setItem('token', result.token); 
    window.location.href = 'dashboard.html';
  } else if (response.status === 404) {
    alert(result.message); // ❌ کاربری یافت نشد
    loginForm.reset(); // 👈 فیلدها خالی بشن
  } else {
    alert('❌ خطای سرور');
  }
});

// ✅ با Enter رفتن به فیلد بعدی
const inputs = document.querySelectorAll('input');

inputs.forEach((input, index) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = inputs[index + 1];
      if (nextInput) {
        nextInput.focus(); // 👈 میره به فیلد بعدی
      } else {
        loginForm.submit(); // ✅ اگر آخرین فیلد بود، فرم لاگین بشه
      }
    }
  });
});
////////////////

// خروج از حساب

// // ✅ دکمه خروج
// const logoutBtn = document.querySelector('.logout-btn');

// logoutBtn.addEventListener('click', async () => {
//   const confirmLogout = confirm('❓ آیا مطمئنی می‌خوای از حساب خارج بشی؟');

//   if (confirmLogout) {
//     const token = localStorage.getItem('token');

//     const response = await fetch('http://localhost:3000/auth/deleteUser', {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     const result = await response.json();

//     if (response.status === 200) {
//       alert(result.message); // ✅ کاربر با موفقیت حذف شد
//       localStorage.removeItem('token'); // ✅ توکن رو پاک میکنیم
//       window.location.href = 'login.html'; // 👈 برمی‌گرده به صفحه لاگین
//     } else {
//       alert('❌ خطا در حذف کاربر');
//     }
//   }
// });
