
import { supabase } from './supabaseClient.js'; // فرض می‌کنیم اتصال به supabase اینجا تعریف شده

export async function fetchMenus() {
  const { data: menus, error } = await supabase
    .from('menus')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching menus:', error);
    return;
  }

  const menuTree = buildMenuTree(menus);
  const html = buildMenuHTML(menuTree);
  document.getElementById('navbar').innerHTML = html;
}

function buildMenuTree(items, parentId = null) {
  return items
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      ...item,
      children: buildMenuTree(items, item.id)
    }));
}

function buildMenuHTML(tree) {
  let html = '';
  tree.forEach(item => {
    const hasChildren = item.children.length > 0;
    html += `
      <li class="main-header__item">
        ${item.url ? `<a href="${item.url}">${item.title}</a>` : `<span>${item.title}</span>`}
        ${hasChildren ? `<ul class="main-header__dropdown">${buildMenuHTML(item.children)}</ul>` : ''}
      </li>
    `;
  });
  return html;
}
