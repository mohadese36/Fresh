// ✅ لاگ‌اوت و حذف کاربر
const logoutBtn = document.querySelector('.logout-btn');

logoutBtn.addEventListener('click', async () => {
  const confirmLogout = confirm('❓ آیا مطمئنی میخوای از حساب خارج بشی؟');

  if (confirmLogout) {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/auth/deleteUser', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (response.status === 200) {
      alert(result.message); // ✅ کاربر با موفقیت حذف شد
      localStorage.removeItem('token'); // ✅ توکن حذف شد
      window.location.href = 'login.html'; // 👈 برگرد به صفحه لاگین
    } else {
      alert('❌ خطا در حذف کاربر');
    }
  }
});



////////////////
// اطلاعات کاربر در داشبورد

// ✅ چک میکنیم یوزر لاگین هست یا نه
const token = localStorage.getItem('token');

if (!token) {
  alert('⛔️ دسترسی غیرمجاز! لطفا لاگین کن');
  window.location.href = 'login.html';
}

// ✅ ارسال درخواست به سرور برای گرفتن اطلاعات یوزر
(async () => {
  const response = await fetch('http://localhost:3000/auth/user', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (response.status === 200) {
    document.getElementById('username').textContent = result.data.username;
    document.getElementById('email').textContent = result.data.email;
  } else {
    alert('❌ خطا در دریافت اطلاعات کاربر');
  }
})();


//////////

// هندل آپلود در جاوااسکریپت
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');

// ✅ آپلود عکس
uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  
  if (!file) {
    alert('لطفا یه عکس انتخاب کن');
    return;
  }

  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch('http://localhost:3000/auth/uploadAvatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  const result = await response.json();

  if (response.status === 200) {
    alert('✅ عکس با موفقیت آپلود شد');
    window.location.reload();
  } else {
    alert('❌ خطا در آپلود');
  }
});


// اطلاعات عکس
if (response.status === 200) {
    document.getElementById('username').textContent = result.data.username;
    document.getElementById('email').textContent = result.data.email;
    
    const avatar = result.data.avatar || 'default-avatar.png';
    document.getElementById('avatar').src = avatar;
  }
  
