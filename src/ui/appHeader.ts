import { strings } from './strings';
import { createBrandMarkIcon } from './icons';

export function createAppHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'app-header';

  header.appendChild(createBrandMarkIcon());

  const brand = document.createElement('span');
  brand.className = 'app-brand';
  brand.textContent = strings.appName;
  header.appendChild(brand);

  return header;
}
