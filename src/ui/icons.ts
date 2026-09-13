const SVG_NS = 'http://www.w3.org/2000/svg';

/** Speaker cone shared by the sound on/off icons. */
const SPEAKER_BODY = 'M3 9h3.5L12 4.5v15L6.5 15H3z';

function createIconSvg(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('icon');
  return svg;
}

function addFilledPath(svg: SVGSVGElement, d: string): void {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'currentColor');
  svg.appendChild(path);
}

function addStrokedPath(svg: SVGSVGElement, d: string): void {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
}

export function createSoundOnIcon(): SVGSVGElement {
  const svg = createIconSvg();
  addFilledPath(svg, SPEAKER_BODY);
  addStrokedPath(svg, 'M15.25 9.5a4 4 0 0 1 0 5');
  addStrokedPath(svg, 'M18 7a7.5 7.5 0 0 1 0 10');
  return svg;
}

export function createSoundOffIcon(): SVGSVGElement {
  const svg = createIconSvg();
  addFilledPath(svg, SPEAKER_BODY);
  addStrokedPath(svg, 'M16 9.5l5 5');
  addStrokedPath(svg, 'M21 9.5l-5 5');
  return svg;
}

export function createFullscreenEnterIcon(): SVGSVGElement {
  const svg = createIconSvg();
  addStrokedPath(svg, 'M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9');
  addStrokedPath(svg, 'M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9');
  addStrokedPath(svg, 'M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15');
  addStrokedPath(svg, 'M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15');
  return svg;
}

export function createFullscreenExitIcon(): SVGSVGElement {
  const svg = createIconSvg();
  addStrokedPath(svg, 'M4 9h3.5A1.5 1.5 0 0 0 9 7.5V4');
  addStrokedPath(svg, 'M15 4v3.5A1.5 1.5 0 0 0 16.5 9H20');
  addStrokedPath(svg, 'M20 15h-3.5A1.5 1.5 0 0 0 15 16.5V20');
  addStrokedPath(svg, 'M9 20v-3.5A1.5 1.5 0 0 0 7.5 15H4');
  return svg;
}

export function createSunIcon(): SVGSVGElement {
  const svg = createIconSvg();
  const core = document.createElementNS(SVG_NS, 'circle');
  core.setAttribute('cx', '12');
  core.setAttribute('cy', '12');
  core.setAttribute('r', '4.25');
  core.setAttribute('fill', 'currentColor');
  svg.appendChild(core);

  const rays = [
    'M12 2v2',
    'M12 20v2',
    'M2 12h2',
    'M20 12h2',
    'M5.1 5.1l1.4 1.4',
    'M17.5 17.5l1.4 1.4',
    'M18.9 5.1l-1.4 1.4',
    'M6.5 17.5l-1.4 1.4',
  ];
  for (const ray of rays) {
    addStrokedPath(svg, ray);
  }
  return svg;
}

export function createMoonIcon(): SVGSVGElement {
  const svg = createIconSvg();
  addFilledPath(
    svg,
    'M20.5 15.3A9 9 0 0 1 8.7 3.5a9 9 0 1 0 11.8 11.8z',
  );
  return svg;
}

export function createBackIcon(): SVGSVGElement {
  const svg = createIconSvg();
  addStrokedPath(svg, 'M19 12H6');
  addStrokedPath(svg, 'M12 19l-7-7 7-7');
  return svg;
}

export function createClockIcon(): SVGSVGElement {
  const svg = createIconSvg();
  const face = document.createElementNS(SVG_NS, 'circle');
  face.setAttribute('cx', '12');
  face.setAttribute('cy', '12');
  face.setAttribute('r', '8');
  face.setAttribute('fill', 'none');
  face.setAttribute('stroke', 'currentColor');
  face.setAttribute('stroke-width', '2');
  svg.appendChild(face);
  addStrokedPath(svg, 'M12 7v5l3 2');
  return svg;
}

export function createClockOffIcon(): SVGSVGElement {
  const svg = createClockIcon();
  addStrokedPath(svg, 'M5 5l14 14');
  return svg;
}

export function createGitHubIcon(): SVGSVGElement {
  const svg = createIconSvg();
  addFilledPath(
    svg,
    'M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 4.307 2.794 7.96 6.675 9.245.487.09.668-.212.668-.47 0-.232-.008-.844-.013-1.652-2.712.59-3.285-1.306-3.285-1.306-.445-1.132-1.086-1.434-1.086-1.434-.888-.607.067-.595.067-.595.978.069 1.493 1.004 1.493 1.004.869 1.49 2.282 1.06 2.84.81.088-.63.342-1.06.622-1.305-2.165-.246-4.443-1.082-4.443-4.815 0-1.064.38-1.933 1.003-2.614-.101-.246-.436-1.236.095-2.577 0 0 .818-.262 2.68 1.004.777-.216 1.61-.324 2.438-.328.828.004 1.661.112 2.44.328 1.86-1.266 2.676-1.004 2.676-1.004.532 1.341.197 2.331.096 2.577.625.681.997 1.55.997 2.614 0 3.745-2.283 4.566-4.457 4.807.352.303.665.902.665 1.823 0 1.317-.012 2.378-.012 2.702 0 .262.178.565.673.468 3.877-1.287 6.665-4.94 6.665-9.245 0-5.385-4.365-9.75-9.75-9.75z',
  );
  return svg;
}
