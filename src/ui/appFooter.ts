import { strings } from './strings';

const LICENSE_URL =
  'https://github.com/jatszotar/jatszotar.github.io/blob/main/LICENSE';

export function createAppFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';

  footer.append(strings.footerCopyright, ' · ');

  const licenseLink = document.createElement('a');
  licenseLink.href = LICENSE_URL;
  licenseLink.target = '_blank';
  licenseLink.rel = 'noopener noreferrer';
  licenseLink.textContent = strings.footerLicense;
  footer.appendChild(licenseLink);

  footer.append(` ${strings.footerLicenseSuffix}`);
  return footer;
}
