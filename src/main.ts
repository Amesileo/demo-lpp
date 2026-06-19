// Shared bootstrap imported by every page: styles, nav behaviour, footer year.
import './styles/main.scss';
import { initPrincessTwirl } from './ts/princess-twirl.ts';

function initNav(): void {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close the mobile menu after following a link
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('is-open'))
    );
  }

  // Highlight the current page in the nav
  const page = document.body.dataset.page;
  if (page) {
    document
      .querySelector(`.nav__links a[data-nav="${page}"]`)
      ?.classList.add('is-active');
  }
}

function initYear(): void {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

initNav();
initYear();
initPrincessTwirl();
