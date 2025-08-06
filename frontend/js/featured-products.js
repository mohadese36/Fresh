import { supabase } from './supabaseClient.js';

// دریافت پارامتر type از URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', async () => {
  const featuredGroupsList = document.getElementById('featured-groups-list');
  const productsList = document.getElementById('products-list');
  const productsContainer = document.getElementById('products-container');
  const message = document.getElementById('message');

  const type = getQueryParam('type');

  if (!type) {
    // نمایش لیست گروه‌های ویژه
    featuredGroupsList.style.display = 'block';

    const { data: groups, error } = await supabase
      .from('featured_groups')
      .select('*')
      .order('id');

    if (error) {
      message.textContent = 'خطا در دریافت گروه‌های ویژه';
      return;
    }

    const ul = featuredGroupsList.querySelector('ul');
    groups.forEach(group => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `featured-products.html?type=${group.slug}`;
      a.textContent = group.name;
      li.appendChild(a);
      ul.appendChild(li);
    });
  } else {
    // نمایش محصولات مربوط به گروه ویژه انتخاب شده
    productsList.style.display = 'block';

    // اول گروه ویژه رو می‌گیریم تا اسمش رو داشته باشیم
    const { data: groupData, error: groupError } = await supabase
      .from('featured_groups')
      .select('id, name')
      .eq('slug', type)
      .single();

    if (groupError) {
      message.textContent = 'گروه ویژه پیدا نشد';
      return;
    }

    document.querySelector('h2').textContent = `Products: ${groupData.name}`;

    // محصولات مرتبط با این گروه رو واکشی می‌کنیم
    const { data: products, error: prodError } = await supabase
      .from('featured_group_products')
      .select('product_id, products(id, name, price)')
      .eq('featured_group_id', groupData.id);

    if (prodError) {
      message.textContent = 'خطا در دریافت محصولات';
      return;
    }

    if (!products || products.length === 0) {
      message.textContent = 'محصولی برای این گروه وجود ندارد';
      return;
    }

    // نمایش محصولات
    products.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('product-card');
      div.innerHTML = `
        <h3>${item.products.name}</h3>
        <p>Price: $${item.products.price}</p>
      `;
      productsContainer.appendChild(div);
    });
  }
});


