
// js/menu.js
import { supabase } from './supabaseClient.js';

export async function loadMenu() {
  const { data: menus, error } = await supabase
    .from('menus')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error loading menu:', error);
    return;
  }

  const tree = buildTree(menus);
  document.getElementById('navbar').innerHTML = renderMenu(tree);
}

function buildTree(items, parent = null) {
  return items.filter(i => i.parent_id === parent).map(i => ({
    ...i,
    children: buildTree(items, i.id)
  }));
}

function renderMenu(tree) {
  return tree.map(item => `
    <li class="main-header__item">
      ${item.url ? `<a href="${item.url}">${item.title}</a>` : `<span>${item.title}</span>`}
      ${item.children.length ? `<ul class="main-header__dropdown">${renderMenu(item.children)}</ul>` : ''}
    </li>
  `).join('');
}
