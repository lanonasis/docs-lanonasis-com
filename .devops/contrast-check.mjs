// Quick WCAG contrast checker for the custom docs palette.
function lum(hex) {
  const c = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contrast(a, b) {
  const l1 = lum(a), l2 = lum(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
const pairs = [
  ['primary #4F46E5 on white', '#4F46E5', '#ffffff'],
  ['primary-light #6366F1 on white', '#6366F1', '#ffffff'],
  ['primary-lighter #818CF8 on white', '#818CF8', '#ffffff'],
  ['primary-lightest #A5B4FC on white', '#A5B4FC', '#ffffff'],
  ['gold #F59E0B on white (nav hover/badge)', '#F59E0B', '#ffffff'],
  ['white on gold #F59E0B (badge-warning)', '#ffffff', '#F59E0B'],
  ['amber-600 #D97706 on white', '#D97706', '#ffffff'],
  ['amber-700 #B45309 on white', '#B45309', '#ffffff'],
  ['indigo-500 #6366F1 on white', '#6366F1', '#ffffff'],
  ['purple-500 #A855F7 on white (hero gradient end)', '#A855F7', '#ffffff'],
  ['white on indigo-600 #4F46E5 (active menu)', '#ffffff', '#4F46E5'],
  ['white on red-500 #EF4444 (heroAIBtn end)', '#ffffff', '#EF4444'],
  ['emerald #10B981 on white (status-success text)', '#10B981', '#ffffff'],
  ['red #EF4444 on white (status-error text)', '#EF4444', '#ffffff'],
  ['midnight #0B1220 on white', '#0B1220', '#ffffff'],
  ['primary-lighter #818CF8 on midnight (dark h2)', '#818CF8', '#0B1220'],
  ['primary-light #A5B4FC on midnight (dark h3)', '#A5B4FC', '#0B1220'],
  ['primary #818CF8 on midnight (dark)', '#818CF8', '#0B1220'],
  ['gold #F59E0B on midnight', '#F59E0B', '#0B1220'],
  ['white on primary #4F46E5 (btn)', '#ffffff', '#4F46E5'],
  ['indigo-400 #818CF8 on white (hero stat)', '#818CF8', '#ffffff'],
];
for (const [name, fg, bg] of pairs) {
  const r = contrast(fg, bg);
  const aa = r >= 4.5 ? 'AA text' : r >= 3 ? 'AA large' : 'FAIL';
  console.log(`${r.toFixed(2).padStart(5)}  ${aa.padStart(8)}  ${name}`);
}
