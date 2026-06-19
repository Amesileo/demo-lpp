import './main.ts';
import {
  packages,
  characters,
  addOns,
  formatGBP,
  type Package,
} from './ts/data.ts';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface BookingState {
  package: string;
  character: string;
  addOns: string[];
  details: Record<string, string>;
  contact: Record<string, string>;
}

const STORAGE_KEY = 'lpp-booking';
const TOTAL_STEPS = 6;

const blank: BookingState = {
  package: '',
  character: '',
  addOns: [],
  details: {},
  contact: {},
};

function load(): BookingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...blank, ...(JSON.parse(raw) as BookingState) };
  } catch {
    /* ignore */
  }
  return structuredClone(blank);
}

const state = load();
let step = 0;

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

// Apply ?package= / ?character= from the URL
const params = new URLSearchParams(location.search);
if (params.get('package') && packages.some((p) => p.id === params.get('package'))) {
  state.package = params.get('package')!;
}
if (params.get('character') && characters.some((c) => c.id === params.get('character'))) {
  state.character = params.get('character')!;
}

// ---------------------------------------------------------------------------
// Element refs
// ---------------------------------------------------------------------------

const root = document.getElementById('bookingApp');
const panels = Array.from(document.querySelectorAll<HTMLElement>('.step-panel'));
const progressItems = Array.from(
  document.querySelectorAll<HTMLElement>('.wizard-progress__item')
);
const backBtn = document.getElementById('wizardBack') as HTMLButtonElement;
const nextBtn = document.getElementById('wizardNext') as HTMLButtonElement;
const submitBtn = document.getElementById('wizardSubmit') as HTMLButtonElement;

// ---------------------------------------------------------------------------
// Inject option grids
// ---------------------------------------------------------------------------

function packageOptionsHTML(): string {
  return packages
    .map(
      (p) => `
      <label class="option">
        <input type="radio" name="package" value="${p.id}" ${
        state.package === p.id ? 'checked' : ''
      }>
        <span class="option__inner">
          <span class="option__emoji" aria-hidden="true">🎉</span>
          <span class="option__title">${p.name}</span>
          <span class="option__meta">${p.durationLabel} &middot; ${p.capacity}</span>
          <span class="option__price">${formatGBP(p.price)}</span>
        </span>
        <span class="option__check" aria-hidden="true">✓</span>
      </label>`
    )
    .join('');
}

function characterOptionsHTML(): string {
  return characters
    .map(
      (c) => `
      <label class="option">
        <input type="radio" name="character" value="${c.id}" ${
        state.character === c.id ? 'checked' : ''
      }>
        <span class="option__inner">
          <span class="option__emoji" aria-hidden="true">${c.emoji}</span>
          <span class="option__title">${c.name}</span>
          <span class="option__meta">${c.tagline}</span>
        </span>
        <span class="option__check" aria-hidden="true">✓</span>
      </label>`
    )
    .join('');
}

function addonOptionsHTML(): string {
  return addOns
    .map(
      (a) => `
      <label class="option">
        <input type="checkbox" name="addon" value="${a.id}" ${
        state.addOns.includes(a.id) ? 'checked' : ''
      }>
        <span class="option__inner">
          <span class="option__title">${a.name}</span>
          <span class="option__meta">${a.description}</span>
          ${a.note ? `<span class="option__note">⏳ ${a.note}</span>` : ''}
          <span class="option__price">+${formatGBP(a.price)}</span>
        </span>
        <span class="option__check" aria-hidden="true">✓</span>
      </label>`
    )
    .join('');
}

const pkgGrid = document.getElementById('packageOptions');
const charGrid = document.getElementById('characterOptions');
const addonGrid = document.getElementById('addonOptions');
if (pkgGrid) pkgGrid.innerHTML = packageOptionsHTML();
if (charGrid) charGrid.innerHTML = characterOptionsHTML();
if (addonGrid) addonGrid.innerHTML = addonOptionsHTML();

// Restore saved detail/contact field values
function restoreFields(): void {
  for (const [name, val] of Object.entries({ ...state.details, ...state.contact })) {
    const el = root?.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (el) el.value = val;
  }
}
restoreFields();

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

function selectedPackage(): Package | undefined {
  return packages.find((p) => p.id === state.package);
}

function total(): number {
  const base = selectedPackage()?.price ?? 0;
  const extras = state.addOns.reduce(
    (sum, id) => sum + (addOns.find((a) => a.id === id)?.price ?? 0),
    0
  );
  return base + extras;
}

// ---------------------------------------------------------------------------
// Summary sidebar
// ---------------------------------------------------------------------------

function renderSummary(): void {
  const wrap = document.getElementById('summaryBody');
  if (!wrap) return;
  const pkg = selectedPackage();
  const char = characters.find((c) => c.id === state.character);
  const rows: string[] = [];

  rows.push(
    pkg
      ? `<div class="summary__row"><span>${pkg.name}</span><span>${formatGBP(pkg.price)}</span></div>`
      : `<div class="summary__row summary__row--muted"><span>No package selected yet</span><span></span></div>`
  );

  if (char) {
    rows.push(
      `<div class="summary__row"><span>Character</span><span>${char.name}</span></div>`
    );
  }

  for (const id of state.addOns) {
    const a = addOns.find((x) => x.id === id);
    if (a) {
      rows.push(
        `<div class="summary__row"><span>+ ${a.name}</span><span>${formatGBP(a.price)}</span></div>`
      );
      if (a.note) {
        rows.push(
          `<div class="summary__row summary__row--muted"><span>⏳ ${a.note}</span><span></span></div>`
        );
      }
    }
  }

  if (state.details.date) {
    rows.push(
      `<div class="summary__row"><span>Date</span><span>${state.details.date}${
        state.details.time ? ` · ${state.details.time}` : ''
      }</span></div>`
    );
  }

  wrap.innerHTML = rows.join('');

  const totalEl = document.getElementById('summaryTotal');
  if (totalEl) totalEl.textContent = formatGBP(total());
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function markError(el: HTMLElement, on: boolean): void {
  el.closest('.field')?.classList.toggle('field--error', on);
}

function validateStep(index: number): boolean {
  const panel = panels[index];
  if (!panel) return true;

  // Steps 0 & 1: a radio must be chosen
  if (index === 0 || index === 1) {
    const checked = panel.querySelector('input:checked');
    const note = panel.querySelector<HTMLElement>('.choice-error');
    if (note) note.hidden = !!checked;
    return !!checked;
  }

  // Steps with text fields (2 details, 4 contact, 5 terms)
  let ok = true;
  panel.querySelectorAll<HTMLInputElement>('[data-required]').forEach((el) => {
    let valid = el.value.trim().length > 0;
    if (valid && el.type === 'email') valid = emailRe.test(el.value.trim());
    if (valid && el.dataset.required === 'date') {
      // must be today or later
      valid = !!el.value && new Date(el.value) >= new Date(new Date().toDateString());
    }
    if (valid && el.dataset.required === 'phone') {
      valid = el.value.replace(/\D/g, '').length >= 10;
    }
    if (valid && el.type === 'checkbox') valid = el.checked;
    markError(el, !valid);
    if (!valid) ok = false;
  });

  if (!ok) {
    panel.querySelector<HTMLElement>('.field--error input, .field--error select, .field--error textarea')?.focus();
  }
  return ok;
}

// ---------------------------------------------------------------------------
// Persist field values from the active panel into state
// ---------------------------------------------------------------------------

function captureStep(index: number): void {
  if (index === 2) {
    panels[2]?.querySelectorAll<HTMLInputElement>('[name]').forEach((el) => {
      state.details[el.name] = el.value;
    });
  }
  if (index === 4) {
    panels[4]?.querySelectorAll<HTMLInputElement>('[name]').forEach((el) => {
      if (el.name) state.contact[el.name] = el.value;
    });
  }
  save();
}

// ---------------------------------------------------------------------------
// Review step
// ---------------------------------------------------------------------------

function renderReview(): void {
  const wrap = document.getElementById('reviewBody');
  if (!wrap) return;
  const pkg = selectedPackage();
  const char = characters.find((c) => c.id === state.character);
  const d = state.details;
  const c = state.contact;
  const selectedAddOns = state.addOns
    .map((id) => addOns.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const extras =
    selectedAddOns
      .map((a) => (a.note ? `${a.name}*` : a.name))
      .join(', ') || 'None';
  const addOnNotes = selectedAddOns
    .filter((a) => a.note)
    .map((a) => `*${a.note}`);

  const rows: Array<[string, string]> = [
    ['Package', pkg ? `${pkg.name} — ${formatGBP(pkg.price)}` : '—'],
    ['Character', char?.name ?? '—'],
    ['Add-ons', extras],
    ['Date & time', `${d.date ?? '—'} ${d.time ?? ''}`.trim()],
    ['Guests', d.children ? `${d.children} children` : '—'],
    ['Venue', d.venueType ?? '—'],
    ['Address', [d.address, d.town, d.postcode].filter(Boolean).join(', ') || '—'],
    ['Name', `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || '—'],
    ['Email', c.email ?? '—'],
    ['Phone', c.phone ?? '—'],
    ['Birthday child', c.childName ? `${c.childName}${c.childAge ? `, age ${c.childAge}` : ''}` : '—'],
    ['Special requests', c.notes || 'None'],
  ];

  wrap.innerHTML =
    rows
      .map(
        ([dt, dd]) =>
          `<div class="review-list__row"><dt>${dt}</dt><dd>${dd}</dd></div>`
      )
      .join('') +
    addOnNotes.map((n) => `<p class="review-note">${n}</p>`).join('');

  const totalEl = document.getElementById('reviewTotal');
  if (totalEl) totalEl.textContent = formatGBP(total());
}

// ---------------------------------------------------------------------------
// Step navigation
// ---------------------------------------------------------------------------

function showStep(index: number): void {
  step = Math.max(0, Math.min(TOTAL_STEPS - 1, index));
  panels.forEach((p, i) => p.classList.toggle('is-active', i === step));
  progressItems.forEach((item, i) => {
    item.classList.toggle('is-active', i === step);
    item.classList.toggle('is-done', i < step);
  });

  backBtn.hidden = step === 0;
  const last = step === TOTAL_STEPS - 1;
  nextBtn.hidden = last;
  submitBtn.hidden = !last;

  if (last) renderReview();
  renderSummary();
  root?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

nextBtn?.addEventListener('click', () => {
  if (!validateStep(step)) return;
  captureStep(step);
  showStep(step + 1);
});

backBtn?.addEventListener('click', () => {
  captureStep(step);
  showStep(step - 1);
});

// ---------------------------------------------------------------------------
// Live option selection -> state + summary
// ---------------------------------------------------------------------------

root?.addEventListener('change', (e) => {
  const el = e.target as HTMLInputElement;
  if (el.name === 'package') {
    state.package = el.value;
    panels[0]?.querySelector<HTMLElement>('.choice-error')?.setAttribute('hidden', '');
  } else if (el.name === 'character') {
    state.character = el.value;
    panels[1]?.querySelector<HTMLElement>('.choice-error')?.setAttribute('hidden', '');
  } else if (el.name === 'addon') {
    state.addOns = Array.from(
      root.querySelectorAll<HTMLInputElement>('input[name="addon"]:checked')
    ).map((i) => i.value);
  }
  save();
  renderSummary();
});

// Clear field errors on input
root?.addEventListener('input', (e) => {
  const t = e.target as HTMLElement;
  if (t.closest('.field--error')) markError(t, false);
});

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------

submitBtn?.addEventListener('click', () => {
  if (!validateStep(TOTAL_STEPS - 1)) return;
  captureStep(TOTAL_STEPS - 1);

  // Demo submission — production would POST `state` to a booking endpoint.
  const success = document.getElementById('bookingSuccess');
  const wizard = document.getElementById('bookingWizard');
  const refEl = document.getElementById('bookingRef');
  if (refEl) {
    refEl.textContent =
      'LPP-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  }
  if (wizard) wizard.hidden = true;
  if (success) {
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  localStorage.removeItem(STORAGE_KEY);
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

showStep(0);
renderSummary();
