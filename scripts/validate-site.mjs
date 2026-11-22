import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = resolve(fileURLToPath(new URL('..', import.meta.url)));
const site = join(base, 'docs');
const read = p => readFileSync(p, 'utf8');
const html = read(join(site, 'index.html'));
const css = read(join(site, 'styles.css'));
const js = read(join(site, 'script.js'));
const readme = read(join(base, 'README.md'));
let passes = 0, failures = 0;
function check(ok, description) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${description}`);
  if (ok) passes++; else failures++;
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
check(new Set(ids).size === ids.length, 'HTML IDs are unique');
for (const id of ['top','main','work','about','capabilities','writing','contact','project-grid','scroll-progress','copy-email','year'])
  check(ids.includes(id), `Section/control ID: ${id}`);
for (const [, path] of html.matchAll(/(?:src|href)="((?:assets\/)[^"]+)"/g))
  check(existsSync(join(site, path)), `Local site asset: ${path}`);
for (const [, path] of readme.matchAll(/(?:src|srcset)="((?:assets\/profile\/)[^"]+)"/g))
  check(existsSync(join(base, path)), `Profile asset: ${path}`);
check((html.match(/class="project reveal"/g) || []).length === 4, 'Four featured projects');
check((html.match(/data-category="(?:mobile|web)"/g) || []).length === 4, 'All projects have filter categories');
check(html.includes('class="skip-link"'), 'Keyboard skip navigation');
check(html.includes('aria-controls="site-links"'), 'Accessible mobile navigation');
check(html.includes('aria-pressed="true"'), 'Filter controls have selection state');
check(html.includes('not a real app screenshot'), 'Concept artwork identified accurately');
check(html.includes('mailto:muhammadirfan.infosec@gmail.com'), 'Contact address is available');
check(css.includes('prefers-reduced-motion'), 'Reduced motion setting respected');
check(js.includes('IntersectionObserver'), 'Reveal animation logic present');
check(js.includes('navigator.clipboard'), 'Copy email action implemented');
check(js.includes('projectCards.forEach') && js.includes('aria-pressed'), 'Accessible project filtering implemented');
check(readme.includes('<!-- BLOG:START -->') && readme.includes('<!-- BLOG:END -->'), 'Blog refresh markers preserved');
check(existsSync(join(base, '.github/workflows/refresh-profile.yml')), 'Existing profile refresh workflow preserved');
for (const repo of ['food-fight-app','mandi-pro-erp','teamsync-saas','ai-interview-pro'])
  check(html.includes(`github.com/Ir786106/${repo}`), `Featured repository link: ${repo}`);
check(readme.includes('https://ir786106.github.io/Ir786106/'), 'Profile links to this repository Pages site');
console.log(`\nValidation: ${passes} passed, ${failures} failed`);
if (failures > 0) process.exitCode = 1;
