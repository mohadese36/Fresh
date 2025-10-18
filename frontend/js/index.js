
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


////////اسکرول///////

// (function () {
//   const header = document.querySelector('header.header');

//   // دو آستانه: یکی برای فعال‌شدن، یکی برای برگشت
//   const ENTER = 80; // بعد از این مقدار، جمع شود
//   const EXIT  = 30; // وقتی برگشتیم اینقدر بالا، به حالت عادی برگرد

//   let shrunk = false;   // وضعیت فعلی
//   let rafId = null;     // برای rAF throttle

//   function update() {
//     const y = window.scrollY || document.documentElement.scrollTop || 0;

//     if (!shrunk && y > ENTER) {
//       header.classList.add('is-scrolled');
//       shrunk = true;
//     } else if (shrunk && y < EXIT) {
//       header.classList.remove('is-scrolled');
//       shrunk = false;
//     }
//     rafId = null;
//   }

//   function onScroll() {
//     if (rafId == null) rafId = requestAnimationFrame(update);
//   }

//   update();
//   window.addEventListener('scroll', onScroll, { passive: true });
// })();


(function () {
  const header = document.querySelector('header.header');
  const ENTER = 80, EXIT = 30;
  let shrunk = false, rafId = null;

  const mq = window.matchMedia('(max-width: 576px)');

  function update() {
    // موبایل: افکت خاموش
    if (mq.matches) {
      if (shrunk) { header.classList.remove('is-scrolled'); shrunk = false; }
      rafId = null; return;
    }

    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (!shrunk && y > ENTER) { header.classList.add('is-scrolled'); shrunk = true; }
    else if (shrunk && y < EXIT) { header.classList.remove('is-scrolled'); shrunk = false; }
    rafId = null;
  }

  function onScroll(){ if (rafId == null) rafId = requestAnimationFrame(update); }

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (mq.addEventListener) mq.addEventListener('change', update);
  else mq.addListener(update); // فallback برای سافاری قدیمی
  window.addEventListener('resize', update); // تغییر جهت/عرض
})();
// ///////////////////////////////////

// === Fade-in on scroll (Global) ===
document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll(".fade-in");
  if (!fadeEls.length) return; // اگه صفحه‌ای fade-in نداشت، هیچی اجرا نشه

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));
});

/////////////


/* ✅ اسکریپت فعال‌سازی انیمیشن بنر آفر فقط هنگام ورود به دید کاربر */







