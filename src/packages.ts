import './main.ts';
import { packages, addOns, formatGBP } from './ts/data.ts';
import { packageCard } from './ts/render.ts';

const grid = document.getElementById('pkgGrid');
if (grid) grid.innerHTML = packages.map(packageCard).join('');

const addonWrap = document.getElementById('addonGrid');
if (addonWrap) {
  addonWrap.innerHTML = addOns
    .map(
      (a) => `
      <article class="card feature">
        <h3>${a.name}</h3>
        <p>${a.description}</p>
        <div class="pkg__price" style="font-size:1.6rem">+${formatGBP(a.price)}</div>
        ${a.note ? `<p class="addon-note">⏳ ${a.note}</p>` : ''}
      </article>`
    )
    .join('');
}
