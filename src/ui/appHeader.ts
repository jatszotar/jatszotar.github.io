import { strings } from './strings';

export function createAppHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'app-header';

  const brand = document.createElement('span');
  brand.className = 'app-brand';
  brand.textContent = strings.appName;
  header.appendChild(brand);

  return header;
}
