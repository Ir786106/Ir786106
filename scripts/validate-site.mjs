import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = resolve(fileURLToPath(new URL('..', import.meta.url)));
const site = join(base, 'docs');
const text = file => readFileSync(file, 'utf8');
const html = text(join(site, 'index.html'));
const css = text(join(site, 'styles.css'));
const js = text(join(site, 'script.js'));
const readme = text(join(base, 'README.md'));
let failed = 0, passed = 0;
function check(ok, message) {
  if (ok) { passed++; console.log('PASS', message); }
  else { failed++; console.error('FAIL', message); }
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
check(new Set(ids).size === ids.length, 'No duplicate HTML IDs');
for (const required of ['main','about','work','expertise','journal','contact','project-grid','typed-role'])
  check(ids.includes(required), `Anchor exists: ${required}`);
for (const [,path] of html.matchAll(/(?:src|href)="((?:assets\/)[^"]+)"/g))
  check(existsSync(join(site,path)), `Local asset exists: ${path}`);
for (const [,path] of readme.matchAll(/(?:src|srcset)="((?:assets\/profile\/)[^"]+)"/g))
  check(existsSync(join(base,path)), `README asset exists: ${path}`);
check((html.match(/class="project-card reveal"/g) || []).length === 4, 'Four featured project cards');
check((html.match(/alt="[^"]+"/g) || []).length >= 4, 'Project illustrations have alt text');
check(html.includes('class="skip-link"'), 'Keyboard skip link');
check(html.includes('aria-controls="site-links"'), 'Mobile menu control is labeled');
check(html.includes('mailto:muhammadirfan.infosec@gmail.com'), 'Contact CTA uses real mailto link');
check(css.includes('prefers-reduced-motion'), 'Reduced-motion support');
check(js.includes('aria-pressed') && js.includes('data-filter'), 'Accessible project filtering');
check(readme.includes('<!-- BLOG:START -->') && readme.includes('<!-- BLOG:END -->'), 'Daily blog update markers preserved');
check(existsSync(join(base,'.github/workflows/refresh-profile.yml')), 'Refresh workflow exists');
for (const repo of ['food-fight-app','mandi-pro-erp','teamsync-saas','ai-interview-pro'])
  check(html.includes('github.com/Ir786106/'+repo), `Featured repo link: ${repo}`);
console.log(`\nValidation: ${passed} passed, ${failed} failed`);
if (failed) process.exitCode = 1;
