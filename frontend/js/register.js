



// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const name = document.getElementById('name').value.trim();
//   const username = document.getElementById('username').value.trim();
//   const email = document.getElementById('email').value.trim();
//   const phone = document.getElementById('phone').value.replace(/\s/g, '').trim(); // حذف فاصله‌های خالی
//   const password = document.getElementById('password').value.trim();

//   const response = await fetch('http://localhost:3000/register', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ name, username, email, phone, password }),
//   });

//   if (response.ok) {
//     const data = await response.json();
//     console.log('✅ کاربر با موفقیت ثبت شد!');
//     console.log('📤 اطلاعات ارسال شده به سرور:', data);
//   } else {
//     const errorText = await response.json(); // تغییر به JSON به جای text
//     console.log('❌ خطا: ' + errorText.message);
//     console.error('❌ خطا:', errorText.message);
//     alert(errorText.message); // نمایش پیام خطا به کاربر
//   }
// });



document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.replace(/\s/g, '').trim(); // حذف فاصله‌های خالی
  const password = document.getElementById('password').value.trim();

  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, email, phone, password }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('✅ کاربر با موفقیت ثبت شد!');
    console.log('📤 اطلاعات ارسال شده به سرور:', data);

    // پاک کردن فیلدها بعد از ارسال موفق
    document.getElementById('name').value = '';
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('password').value = '';

    alert('✅ ثبت نام با موفقیت انجام شد!');
  } else {
    const errorText = await response.json(); // تغییر به JSON به جای text
    console.log('❌ خطا: ' + errorText.message);
    console.error('❌ خطا:', errorText.message);
    alert(errorText.message); // نمایش پیام خطا به کاربر
  }
});

// حرکت به فیلد بعدی با فشردن کلید اینتر
const inputs = document.querySelectorAll('#registerForm input');
inputs.forEach((input, index) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // جلوگیری از ارسال فرم
      e.preventDefault();
      if (index < inputs.length - 1) {
        // حرکت به فیلد بعدی
        inputs[index + 1].focus();
      }
    }
  });
});
