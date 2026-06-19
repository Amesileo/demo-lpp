// Shared HTML builders for characters and packages.
import { type Character, type Package, formatGBP } from './data.ts';

export function characterCard(c: Character): string {
  const label = c.category === 'princess' ? 'Princess' : 'Character';
  return `
    <article class="card char-card">
      <div class="char-card__portrait" style="background:linear-gradient(150deg, ${c.colors[0]}, ${c.colors[1]})">
        <span aria-hidden="true">${c.emoji}</span>
        <span class="char-card__tag">${label}</span>
      </div>
      <div class="char-card__body">
        <h3>${c.name}</h3>
        <p class="char-card__tagline">${c.tagline}</p>
        <p>${c.description}</p>
        <a class="btn btn--block" href="/booking?character=${c.id}">Book ${c.name.split(' ').pop()} ✨</a>
      </div>
    </article>`;
}

export function packageCard(p: Package): string {
  const items = p.includes.map((i) => `<li>${i}</li>`).join('');
  return `
    <article class="card pkg ${p.popular ? 'pkg--popular' : ''}">
      ${p.popular ? '<span class="pkg__flag">Most Popular</span>' : ''}
      <h3>${p.name}</h3>
      <div class="pkg__price">${formatGBP(p.price)}</div>
      <p class="pkg__meta">${p.durationLabel} &middot; ${p.capacity}</p>
      <ul class="pkg__list">${items}</ul>
      <a class="btn btn--block" href="/booking?package=${p.id}">Book this package</a>
    </article>`;
}
