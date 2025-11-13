
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('navbar'); // این همون <ul> است
  if (!menuList) return;

  // دریافت منوها
  const { data: menus, error: menuError } = await supabase
    .from('menus')
    .select('*')
    .order('id', { ascending: true });

  if (menuError) {
    console.error('خطا در دریافت منو:', menuError);
    return;
  }

  // دریافت دسته‌بندی‌ها
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('id', { ascending: true });

  // دریافت محصولات
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .order('id', { ascending: true });

  // دریافت featured_groups
  const { data: featuredGroups } = await supabase
    .from('featured_groups')
    .select('id, name, slug')
    .order('id', { ascending: true });

  // ساخت درخت
  function buildMenuTree(items, parentId = null) {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        children: buildMenuTree(items, item.id)
      }));
  }

  // ساخت HTML
  function buildMenuHTML(tree) {
    return tree.map(item => {
      const hasChildren = item.children.length > 0;
      let linkHTML = '';

      if (item.title === 'Featured Products') {
        linkHTML = `<a href="featured-products.html" class="main-header__link">${item.title}</a>`;
        let childrenHTML = '';
        if (featuredGroups?.length) {
          childrenHTML = `<ul class="main-header__dropdown">` +
            featuredGroups.map(fg => `
              <li class="main-header__item">
                <a href="featured-products.html?type=${fg.slug}" class="main-header__link ">${fg.name}</a>
              </li>`).join('') +
            `</ul>`;
        }
        return `<li class="main-header__item">${linkHTML}${childrenHTML}</li>`;
      }

      const cat = categories?.find(c => c.name === item.title);
      if (cat) {
        linkHTML = `<a href="categori.html?category=${cat.slug}" class="main-header__link">${item.title}</a>`;
      } else {
        const prod = products?.find(p => p.name === item.title);
        if (prod) {
          linkHTML = `<a href="product.html?id=${prod.id}" class="main-header__link">${item.title}</a>`;
        } else {
          linkHTML = item.url
            ? `<a href="${item.url.replace(/^\/frontend\//, '')}" class="main-header__link">${item.title}</a>`
            : `<span class="main-header__link">${item.title}</span>`;
        }
      }

      const childrenHTML = hasChildren
        ? `<ul class="main-header__dropdown border-0">${buildMenuHTML(item.children)}</ul>`
        : '';

      return `<li class="main-header__item">${linkHTML}${childrenHTML}</li>`;
    }).join('');
  }

  const menuTree = buildMenuTree(menus);
  const menuHTML = buildMenuHTML(menuTree);

  // ✅ فقط فرزندان <ul> را جایگزین می‌کنیم
  menuList.innerHTML = menuHTML;
});







/* ===== Isolated Offcanvas Mount (fixed for 768–992 and content) ===== */
/* ===== Offcanvas with 1-level Accordion (≤992px) ===== */
const toggler = document.querySelector('.main-header__toggle');
const navbarUL = document.getElementById('navbar');

if (toggler && navbarUL) {
  const originalParent = navbarUL.parentNode;
  const placeholder = document.createComment('navbar-slot');

  let offcanvas = null, backdrop = null, ro = null;

  // برای برگرداندن همه‌ی تغییراتِ inline
  const originalULStyle = navbarUL.getAttribute('style') || '';
  const originalDropdownStyles = new Map();   // <ul.main-header__dropdown> -> styleText
  const tweakedChildren = [];                 // [{el, styleText}]
  const accordionHandlers = [];               // [{trigger, handler}]

  // لنگرِ عمودی: موبایل زیرِ سرچ‌بار، تبلت از بالای صفحه
  const getTopForCurrentBP = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      const anchor = document.querySelector('header.header .top-bar .searchbar.desktop-search');
      const r = anchor ? anchor.getBoundingClientRect() : { bottom: 0 };
      return Math.max(0, Math.round(r.bottom));
    }
    if (window.matchMedia('(max-width: 992px)').matches) {
      return 0;
    }
    return 0;
  };

  const setTop = () => {
    if (!offcanvas) return;
    const top = getTopForCurrentBP();
    offcanvas.style.top = top + 'px';
    offcanvas.style.height = `calc(100dvh - ${top}px)`;
  };

  const onEsc = (e) => { if (e.key === 'Escape') closeNav(); };

  /* ---------- استایل‌های مخصوص آف‌کانس (فقط هنگامِ باز بودن) ---------- */
  function applyInlineOffcanvasStyles() {
    // خود UL ستونی
    navbarUL.style.display = 'block';
    navbarUL.style.padding = '16px';
    navbarUL.style.margin = '0';
    navbarUL.style.listStyle = 'none';

    // آیتم‌های سطح اول
    navbarUL.querySelectorAll(':scope > li').forEach(li => {
      li.style.display = 'block';
      li.style.padding = '.45rem 0';
    });

    // زیرمنوها: ایستاده و بدون position
    const dropdowns = navbarUL.querySelectorAll('.main-header__dropdown');
    dropdowns.forEach(dd => {
      originalDropdownStyles.set(dd, dd.getAttribute('style') || '');
      dd.style.display   = 'block';
      dd.style.position  = 'static';
      dd.style.width     = 'auto';
      dd.style.background= 'none';
      dd.style.padding   = '0';
      dd.style.border    = '0';
      dd.style.margin    = '0';
    });

    // «فقط یک سطح» را نگه می‌داریم: هر عمقِ بیشتر از 1 مخفی
    navbarUL.querySelectorAll('.main-header__dropdown ul ul, .main-header__dropdown li li')
      .forEach(el => {
        tweakedChildren.push({ el, styleText: el.getAttribute('style') || '' });
        el.style.display = 'none';
      });
  }

  /* ---------- آکاردئون 1 سطحی روی آیتم‌های دارای dropdown ---------- */
  function setupAccordion() {
    const topLevelItems = navbarUL.querySelectorAll(':scope > li');
    let idx = 0;

    topLevelItems.forEach(li => {
      const trigger = li.querySelector(':scope > a, :scope > span');
      const panel   = li.querySelector(':scope > .main-header__dropdown');
      if (!trigger || !panel) return;

      // فقط یک سطح: همین panel را آکاردئون می‌کنیم
      const panelId = `oc-panel-${++idx}`;
      panel.id = panelId;

      // ظاهرِ پانل برای انیمیشن
      panel.style.overflow   = 'hidden';
      panel.style.maxHeight  = '0px';
      panel.style.transition = 'max-height 250ms ease';

      // تریگر به‌صورت دکمه (بدون خراب‌کردن لینک در دسکتاپ)
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-controls', panelId);
      trigger.setAttribute('aria-expanded', 'false');
      trigger.dataset.ocTrigger = '1';

      const handler = (ev) => {
        // اگر لینک واقعی دارد، در آف‌کانس نگذاریم صفحه عوض شود
        ev.preventDefault();

        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        panel.style.maxHeight = isOpen ? '0px' : (panel.scrollHeight + 'px');
      };

      trigger.addEventListener('click', handler);
      accordionHandlers.push({ trigger, handler });
    });
  }

  /* ---------- برگرداندن همه‌چیز به حالت اول ---------- */
  function restoreInlineStyles() {
    // UL
    if (originalULStyle) navbarUL.setAttribute('style', originalULStyle);
    else navbarUL.removeAttribute('style');

    // زیرمنوها
    originalDropdownStyles.forEach((styleText, el) => {
      if (styleText) el.setAttribute('style', styleText);
      else el.removeAttribute('style');
    });
    originalDropdownStyles.clear();

    // بچه‌هایی که مخفی کرده بودیم
    tweakedChildren.forEach(({ el, styleText }) => {
      if (styleText) el.setAttribute('style', styleText);
      else el.removeAttribute('style');
    });
    tweakedChildren.length = 0;

    // تریگرهای آکاردئون
    accordionHandlers.forEach(({ trigger, handler }) => {
      trigger.removeEventListener('click', handler);
      trigger.removeAttribute('role');
      trigger.removeAttribute('aria-controls');
      trigger.removeAttribute('aria-expanded');
      delete trigger.dataset.ocTrigger;
    });
    accordionHandlers.length = 0;
  }

  /* ---------- باز/بستن آف‌کانس ---------- */
  function openNav(){
    if (offcanvas) return;

    offcanvas = document.createElement('aside');
    offcanvas.className = 'offcanvas-nav';

    // انتقال UL
    originalParent.insertBefore(placeholder, navbarUL);
    offcanvas.appendChild(navbarUL);

    // آماده‌سازی آف‌کانس
    applyInlineOffcanvasStyles();
    setupAccordion();

    // بک‌دراپ
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop is-visible';
    backdrop.addEventListener('click', closeNav);

    // درج و موقعیت
    document.body.append(offcanvas, backdrop);
    requestAnimationFrame(() => {
      setTop();
      offcanvas.classList.add('is-open');
    });

    // وضعیت دکمه/بدنه
    toggler.classList.add('is-open');
    toggler.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-lock');

    // رصد تغییر ارتفاع سرچ (فقط برای موبایل)
    const anchor = document.querySelector('header.header .top-bar .searchbar.desktop-search');
    if (anchor && 'ResizeObserver' in window) {
      ro = new ResizeObserver(setTop);
      ro.observe(anchor);
    }

    // لیسنرها
    document.addEventListener('keydown', onEsc);
    window.addEventListener('resize', setTop, { passive: true });
    window.addEventListener('scroll', setTop, { passive: true });
  }

  function closeNav(){
    if (!offcanvas) return;

    // برگرداندن UL
    if (placeholder.parentNode === originalParent) {
      originalParent.insertBefore(navbarUL, placeholder);
      placeholder.remove();
    } else {
      originalParent.appendChild(navbarUL);
    }

    // ریست کامل استایل‌ها و آکاردئون
    restoreInlineStyles();

    // پاکسازی
    offcanvas.remove(); offcanvas = null;
    if (backdrop) { backdrop.remove(); backdrop = null; }
    if (ro) { ro.disconnect(); ro = null; }

    toggler.classList.remove('is-open');
    toggler.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-lock');

    document.removeEventListener('keydown', onEsc);
    window.removeEventListener('resize', setTop);
    window.removeEventListener('scroll', setTop);
  }

  // کلیک دکمه
  toggler.addEventListener('click', () => {
    offcanvas ? closeNav() : openNav();
  });

  // خروج از حالت آف‌کانس در دسکتاپ
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 992px)').matches) closeNav();
  }, { passive: true });
}
