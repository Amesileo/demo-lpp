import './main.ts';
import { characters } from './ts/data.ts';
import { characterCard } from './ts/render.ts';

const grid = document.getElementById('charGrid');
const filterBar = document.getElementById('charFilter');

type Filter = 'all' | 'princess' | 'character';

function render(filter: Filter): void {
  if (!grid) return;
  const list =
    filter === 'all' ? characters : characters.filter((c) => c.category === filter);
  grid.innerHTML = list.map(characterCard).join('');
}

filterBar?.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-filter]');
  if (!btn) return;
  filterBar.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  render(btn.dataset.filter as Filter);
});

render('all');
