// user-header.js (replacement)
export function updateHeaderUserInfo() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const headerProfileLink = document.querySelector('.main-header__profile');
  const headerProfileText = document.querySelector('.main-header__profile-text');
  const logoutBtn = document.getElementById('logout-btn');

  if (!headerProfileLink || !headerProfileText) return;

  if (user) {
    headerProfileText.textContent = user.fullName || user.email || 'User';
    headerProfileLink.setAttribute('href', '#'); // یا صفحه پروفایل در آینده
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    headerProfileText.textContent = 'Login';
    headerProfileLink.setAttribute('href', './login.html');
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
  });
}

// اجرا در لود
document.addEventListener('DOMContentLoaded', updateHeaderUserInfo);
