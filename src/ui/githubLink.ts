import { createGitHubIcon } from './icons';
import { strings } from './strings';

const GITHUB_REPO_URL = 'https://github.com/jatszotar/jatszotar.github.io';

export function createGitHubLink(): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = GITHUB_REPO_URL;
  link.className = 'btn icon-toggle github-link';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', strings.githubRepo);
  link.title = strings.githubRepo;
  link.appendChild(createGitHubIcon());
  return link;
}
