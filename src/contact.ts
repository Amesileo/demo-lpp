import './main.ts';

const form = document.getElementById('contactForm') as HTMLFormElement | null;
const success = document.getElementById('contactSuccess');

function setError(field: HTMLElement, on: boolean): void {
  field.closest('.field')?.classList.toggle('field--error', on);
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  let valid = true;

  const checks: Array<[string, (v: string) => boolean]> = [
    ['name', (v) => v.trim().length > 1],
    ['email', (v) => emailRe.test(v.trim())],
    ['message', (v) => v.trim().length > 4],
  ];

  for (const [name, test] of checks) {
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    if (el) {
      const ok = test(String(data.get(name) ?? ''));
      setError(el, !ok);
      if (!ok) valid = false;
    }
  }

  if (!valid) {
    form.querySelector<HTMLElement>('.field--error input, .field--error textarea')?.focus();
    return;
  }

  // Demo submission — in production this would POST to an email/API endpoint.
  form.hidden = true;
  if (success) success.hidden = false;
  success?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Clear an error as soon as the user edits the field
form?.addEventListener('input', (e) => {
  const t = e.target as HTMLElement;
  if (t.closest('.field--error')) setError(t, false);
});
