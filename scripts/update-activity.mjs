import { writeFileSync } from 'node:fs';

const user = process.env.PROFILE_USER || 'Ir786106';
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('Set GITHUB_TOKEN for GitHub GraphQL access.');

async function github(path, body) {
  const response = await fetch('https://api.github.com' + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      authorization: 'Bearer ' + token,
      'user-agent': 'profile-activity-generator',
      'content-type': 'application/json',
      accept: 'application/vnd.github+json',
    },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('GitHub API returned HTTP ' + response.status);
  const result = await response.json();
  if (result.errors?.length) throw new Error(result.errors[0].message);
  return result;
}

const [profile, repos] = await Promise.all([
  github('/graphql', {
    query: `query ($user: String!) {
      user(login: $user) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }`,
    variables: { user },
  }),
  github('/users/' + encodeURIComponent(user) + '/repos?per_page=100&type=owner'),
]);
const calendar = profile.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar?.weeks.length || !Array.isArray(repos)) throw new Error('GitHub profile data is incomplete.');

const weeks = calendar.weeks.map(week => week.contributionDays);
const days = weeks.flat();
let longest = 0;
let run = 0;
for (const day of days) {
  run = day.contributionCount ? run + 1 : 0;
  longest = Math.max(longest, run);
}
const ending = days.at(-1).contributionCount ? days.length : days.length - 1;
let current = 0;
for (let i = ending - 1; i >= 0 && days[i].contributionCount; i--) current++;
const owned = repos.filter(repo => !repo.fork && !repo.archived);
const languages = new Map();
for (const repo of owned) {
  if (repo.language) languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
}
const top = [...languages].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const wrap = (title, width, height, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title">
<title id="title">${escape(title)}</title>
<g font-family="system-ui, Segoe UI, sans-serif">${inner}</g>
</svg>
`;
const themes = {
  dark: { panel: '#0D1B2C', border: '#25405A', ink: '#F1F7FC', muted: '#A7BBD1', accent: '#58D9EE', levels: ['#1B3147','#154A63','#18768E','#25A3B9','#58D9EE'] },
  light: { panel: '#F3F8FC', border: '#C1D6E3', ink: '#10243A', muted: '#3D5D74', accent: '#087F98', levels: ['#DDEAF1','#B4DCE5','#75C1D0','#219CB2','#087F98'] },
};

for (const [theme, c] of Object.entries(themes)) {
  const stats = [
    ['Contributions', calendar.totalContributions],
    ['Public repos', owned.length],
    ['Current streak', current + 'd'],
    ['Longest streak', longest + 'd'],
  ];
  const metrics = stats.map(([label, value], i) => {
    const x = 26 + i * 167;
    return `<text x="${x}" y="89" fill="${c.ink}" font-size="31" font-weight="750">${value}</text>
<text x="${x}" y="111" fill="${c.muted}" font-size="13">${label}</text>`;
  }).join('');
  const languageRows = top.map(([language, count], i) => {
    const y = 165 + i * 24;
    const bar = Math.round(280 * count / top[0][1]);
    return `<text x="26" y="${y+5}" fill="${c.ink}" font-size="14">${escape(language)}</text>
<rect x="175" y="${y-5}" width="${bar}" height="8" rx="4" fill="${c.accent}"><animate attributeName="width" from="0" to="${bar}" dur="0.85s" fill="freeze"/></rect>
<text x="475" y="${y+5}" fill="${c.muted}" font-size="13">${count} ${count === 1 ? 'repo' : 'repos'}</text>`;
  }).join('');
  const statsTitle = `GitHub activity over the last year: ${stats.map(([label,value]) => label + ' ' + value).join(', ')}. Primary languages: ${top.map(([language])=>language).join(', ')}.`;
  writeFileSync(`assets/profile/stats-${theme}.svg`, wrap(statsTitle, 720, 253, `
<rect x="1" y="1" width="718" height="251" rx="16" fill="${c.panel}" stroke="${c.border}"/>
<text x="26" y="34" fill="${c.accent}" font-size="18" font-weight="750">GitHub snapshot</text>
<text x="694" y="34" text-anchor="end" fill="${c.muted}" font-size="13">Last 12 months · streaks</text>
${metrics}
<text x="26" y="140" fill="${c.muted}" font-size="13" font-weight="700">PRIMARY LANGUAGES · PUBLIC REPOSITORIES</text>
${languageRows}`));

  const dayIndex = date => new Date(date + 'T00:00:00Z').getUTCDay();
  const max = Math.max(1, ...days.map(day => day.contributionCount));
  const cells = weeks.map((week, x) => week.map(day => {
    const level = day.contributionCount ? Math.min(4, Math.ceil(day.contributionCount / max * 4)) : 0;
    return `<rect x="${25+x*12}" y="${57+dayIndex(day.date)*12}" width="9" height="9" rx="2" fill="${c.levels[level]}"><title>${day.date}: ${day.contributionCount}</title></rect>`;
  }).join('')).join('');
  writeFileSync(`assets/profile/activity-${theme}.svg`, wrap('GitHub contributions by day over the last year', 720, 168, `
<rect x="1" y="1" width="718" height="166" rx="16" fill="${c.panel}" stroke="${c.border}"/>
<text x="25" y="32" fill="${c.ink}" font-size="18" font-weight="700">Contribution activity</text>
<text x="694" y="32" text-anchor="end" fill="${c.muted}" font-size="13">52 weeks</text>
${cells}
<rect x="25" y="49" width="2" height="88" rx="1" fill="${c.accent}" opacity="0"><animate attributeName="x" from="25" to="${25+(weeks.length-1)*12}" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.45;.45;0" keyTimes="0;.08;.92;1" dur="7s" repeatCount="indefinite"/></rect>
<text x="25" y="153" fill="${c.muted}" font-size="12">Source: GitHub contribution calendar</text>`));
}
console.log('Generated public contribution, streak and language cards.');
