// A decorative princess silhouette that pirouettes as the page scrolls.
// Spins on its vertical axis (rotateY + container perspective) in proportion
// to scroll progress. Disabled for users who prefer reduced motion.

const SILHOUETTE = `<img class="pt-fig" src="/images/Princess-twirl.png" alt="" role="presentation" />`;

export function initPrincessTwirl(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const stage = document.createElement('div');
  stage.className = 'princess-twirl';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = SILHOUETTE;
  document.body.appendChild(stage);

  const fig = stage.querySelector<SVGElement>('.pt-fig');
  if (!fig) return;

  let ticking = false;
  const update = (): void => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    // up to three full pirouettes across the page; gentle bob as it spins
    const spin = progress * 1080;
    const bob = Math.sin(progress * Math.PI * 4) * 6;
    fig.style.transform = `translateY(${bob}px) rotateY(${spin}deg)`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}
