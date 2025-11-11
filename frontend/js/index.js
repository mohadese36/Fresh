
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


/* فوتر*/


  // Tiny email validation with aria-live feedback
  // (function(){
  // const form = document.getElementById('newsletterForm');
  // const email = document.getElementById('email');
  // const live = form.querySelector('.newsletter__live');

  //   form.addEventListener('submit', function(e){
  //     e.preventDefault();
  //     const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  //     if(!ok){
  //       live.textContent = 'Please enter a valid email address.';
  //       email.focus();
  //       email.setAttribute('aria-invalid', 'true');
  //     }else{
  //       live.textContent = 'Thanks! Please check your inbox to confirm.';
  //       email.value = '';
  //       email.removeAttribute('aria-invalid');
  //     }
  //   });
  // })();


(function () {
  const form  = document.getElementById('newsletterForm');
  const email = document.getElementById('email');
  const live  = form.querySelector('.newsletter__live');

  let successTimer = null;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // ایمیل معتبر؟
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

    // هر پیام/تایمر قدیمی را پاک کن
    if (successTimer) {
      clearTimeout(successTimer);
      successTimer = null;
    }
    live.classList.remove('is-error', 'is-success');

    if (!ok) {
      live.textContent = 'Please enter a valid email address.';
      live.classList.add('is-error');
      email.setAttribute('aria-invalid', 'true');
      email.focus();
    } else {
      live.textContent = 'Thanks! Please check your inbox to confirm.';
      live.classList.add('is-success');
      email.value = '';
      email.removeAttribute('aria-invalid');

      // پیام موفقیت بعد از چند ثانیه حذف شود
      successTimer = setTimeout(() => {
        live.textContent = '';
        live.classList.remove('is-success');
      }, 3500); // هر عددی خواستی (میلی‌ثانیه)
    }
  });
})();








// ///////////////////////fجلوگیری از تداخل کلیک روی لینک‌ها داخل Bootstrap Carousel ///////////////////////



document.querySelectorAll('#carouselHomePage a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.stopPropagation(); // اجازه نده Carousel عوض بشه
    
    
    window.location.href = link.href; // برو به لینک
  });
});



///////////برای پارالاکس  لندینگ صفحه خانه /////

window.addEventListener("scroll", function () {
  const landing = document.querySelector(".Landing");
  let offset = window.pageYOffset;
  landing.style.backgroundPositionY = offset * 0.5 + "px";
});





///////////////////////////////////////////////////



// وقتی کل محتوای صفحه (DOM) لود شد، این کد اجرا می‌شه
document.addEventListener("DOMContentLoaded", () => {

  // بررسی می‌کنه که کتابخونه AOS از قبل لود شده باشه (از طریق CDN در HTML)
  if (typeof AOS !== "undefined") {

    // راه‌اندازی اولیه AOS برای انیمیشن‌های اسکرولی
    AOS.init({
      duration: 1000,     // مدت زمان اجرای انیمیشن‌ها (به میلی‌ثانیه)
      once: true,         // انیمیشن‌ها فقط یک‌بار هنگام ورود اجرا بشن (نه هر بار اسکرول)
      offset: 100         // فاصله از پایین صفحه قبل از شروع انیمیشن (پیش‌فعال‌سازی)
    });

  }
});

