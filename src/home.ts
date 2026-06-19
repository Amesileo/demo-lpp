import './main.ts';
import { characters, packages } from './ts/data.ts';
import { characterCard, packageCard } from './ts/render.ts';

const charWrap = document.getElementById('featuredCharacters');
if (charWrap) {
  charWrap.innerHTML = characters
    .filter((c) => c.category === 'princess')
    .slice(0, 4)
    .map(characterCard)
    .join('');
}

const pkgWrap = document.getElementById('featuredPackages');
if (pkgWrap) {
  pkgWrap.innerHTML = packages.map(packageCard).join('');
}
