export function createClockFace(hour: number, minute: number): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.classList.add('clock-face');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '100');
  circle.setAttribute('cy', '100');
  circle.setAttribute('r', '90');
  circle.classList.add('clock-dial');
  circle.setAttribute('stroke-width', '4');
  svg.appendChild(circle);

  for (let i = 0; i < 12; i += 1) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x1 = 100 + Math.cos(angle) * 75;
    const y1 = 100 + Math.sin(angle) * 75;
    const x2 = 100 + Math.cos(angle) * 85;
    const y2 = 100 + Math.sin(angle) * 85;
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', String(x1));
    tick.setAttribute('y1', String(y1));
    tick.setAttribute('x2', String(x2));
    tick.setAttribute('y2', String(y2));
    tick.classList.add('clock-tick');
    tick.setAttribute('stroke-width', '2');
    svg.appendChild(tick);
  }

  const minuteAngle = (minute / 60) * 360 - 90;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30 - 90;

  const hourHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  hourHand.setAttribute('x1', '100');
  hourHand.setAttribute('y1', '100');
  hourHand.setAttribute('x2', String(100 + Math.cos(hourAngle * Math.PI / 180) * 45));
  hourHand.setAttribute('y2', String(100 + Math.sin(hourAngle * Math.PI / 180) * 45));
  hourHand.classList.add('clock-hand-hour');
  hourHand.setAttribute('stroke-width', '6');
  hourHand.setAttribute('stroke-linecap', 'round');
  svg.appendChild(hourHand);

  const minuteHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  minuteHand.setAttribute('x1', '100');
  minuteHand.setAttribute('y1', '100');
  minuteHand.setAttribute('x2', String(100 + Math.cos(minuteAngle * Math.PI / 180) * 65));
  minuteHand.setAttribute('y2', String(100 + Math.sin(minuteAngle * Math.PI / 180) * 65));
  minuteHand.classList.add('clock-hand-minute');
  minuteHand.setAttribute('stroke-width', '4');
  minuteHand.setAttribute('stroke-linecap', 'round');
  svg.appendChild(minuteHand);

  const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  center.setAttribute('cx', '100');
  center.setAttribute('cy', '100');
  center.setAttribute('r', '5');
  center.classList.add('clock-center');
  svg.appendChild(center);

  return svg;
}
