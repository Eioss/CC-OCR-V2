'use strict';

const names = {
  'kimi-k3.1-pro': 'Kimi K3.1 Pro',
  'Step3-VL-10B': 'Step3-VL-10B',
  'InternVL3_5-8B': 'InternVL3.5-8B',
  'MiniCPM-o-4_5': 'MiniCPM-o 4.5',
  'Qwen3_5-9B': 'Qwen3.5-9B',
  'gpt-5_4-0305-global': 'GPT-5.4',
  'qwen-vl-max-latest': 'Qwen-VL-Max',
  'claude-opus-4-6-20260205': 'Claude Opus 4.6',
  'claude-sonnet-4-6': 'Claude Sonnet 4.6',
  'claude-opus-4-8': 'Claude Opus 4.8',
  'gemini-3_1-flash-lite-preview': 'Gemini 3.1 Flash Lite',
  'gpt-5_5': 'GPT-5.5',
  'gemini-3_1-pro-preview': 'Gemini 3.1 Pro',
  'kimi-k2_6': 'Kimi K2.6',
  'doubao-seed-2-0-pro-260215': 'Seed 2.0 Pro',
  'kimi-k2_5': 'Kimi K2.5',
  'gpt-6-sol': 'GPT-6 Sol',
  'qwen3_5-plus': 'Qwen3.5-Plus',
  'qwen3_8-flash': 'Qwen3.8-Flash',
  'qwen3_7-plus': 'Qwen3.7-Plus',
  'qwen3_6-plus': 'Qwen3.6-Plus',
  'qwen3_8-max': 'Qwen3.8-Max',
  'grok-4_7': 'Grok-4.7',
  'deepseek-v4_1-flash-1017': 'DeepSeek-V4.1 Flash',
  'gpt-6_1-sol': 'GPT-6.1 Sol',
  'claude-opus-5_5': 'Claude Opus 5.5',
  'gemini-4-hydrogen': 'Gemini 4 Hydrogen',
  'qwen4-max': 'Qwen4-Max'
};

const columns = {
  tasks: [
    ['Recognition', 'Recognition'],
    ['Parsing', 'Parsing'],
    ['Grounding', 'Grounding'],
    ['Extraction', 'Extraction'],
    ['QA', 'QA'],
    ['Average', 'Average']
  ],
  categories: [
    ['1-Books & Academic', 'Books'],
    ['2-Reports & Memos', 'Reports'],
    ['3-Marketing & Editorial', 'Marketing'],
    ['4-Legal & Public Notices', 'Legal'],
    ['5-Forms & Personal Records', 'Forms'],
    ['6-Receipts & Transactions', 'Receipts'],
    ['7-Certificates & Medical', 'Medical'],
    ['8-Handwritten Pages', 'Handwriting'],
    ['9-Charts & Diagrams', 'Charts'],
    ['10-Labels & Screens', 'Screens'],
    ['Average', 'Average']
  ]
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

let scoreData = null;
const state = {
  view: 'tasks',
  filter: 'all',
  query: '',
  sort: 'Average',
  direction: 'desc',
  heatmap: false
};

const modelType = row => row.Category || row.Model_Category || '';
const modelIconFiles = [
  [/^gpt-/i, 'openai.svg'],
  [/^qwen/i, 'qwen.svg'],
  [/^claude-/i, 'claude.svg'],
  [/^gemini-/i, 'gemini.svg'],
  [/^kimi-/i, 'kimi-mark.svg'],
  [/^doubao-/i, 'seed.svg'],
  [/^step/i, 'stepfun.svg'],
  [/^internvl/i, 'internvl.svg'],
  [/^minicpm/i, 'minicpm.webp'],
  [/^grok-/i, 'grok.svg'],
  [/^deepseek-/i, 'deepseek.svg']
];
const modelIcon = model => modelIconFiles.find(([pattern]) => pattern.test(model))?.[1];

function formatSnapshot(iso) {
  if (!iso) return 'Updated Nov 20, 2026';
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return `Updated ${iso}`;
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return 'Updated ' + date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

const scrollEl = document.getElementById('score-scroll');
const scrollWrap = document.getElementById('score-scroll-wrap');

function updateScrollShadows() {
  if (!scrollEl || !scrollWrap) return;
  const maxLeft = scrollEl.scrollWidth - scrollEl.clientWidth;
  scrollWrap.classList.toggle('has-scroll-left', scrollEl.scrollLeft > 2);
  scrollWrap.classList.toggle('has-scroll-right', maxLeft - scrollEl.scrollLeft > 2);
}

if (scrollEl) {
  scrollEl.addEventListener('scroll', updateScrollShadows, { passive: true });
  window.addEventListener('resize', updateScrollShadows, { passive: true });
}

function renderScores({ resetScrollTop = true } = {}) {
  if (!scoreData) return;
  const all = scoreData[state.view];
  const deviceCount = all.filter(row => modelType(row).includes('On-Device')).length;
  const serverCount = all.length - deviceCount;

  document.getElementById('count-all').textContent = `(${all.length})`;
  document.getElementById('count-device').textContent = `(${deviceCount})`;
  document.getElementById('count-server').textContent = `(${serverCount})`;

  const group = all.filter(row =>
    state.filter === 'all' || modelType(row).includes(state.filter === 'device' ? 'On-Device' : 'On-Server')
  );
  const visible = group.filter(row =>
    ((names[row.Model] || row.Model) + ' ' + row.Model).toLowerCase().includes(state.query)
  );
  visible.sort((a, b) =>
    (state.direction === 'desc' ? 1 : -1) * ((b[state.sort] ?? -1) - (a[state.sort] ?? -1)) ||
    (names[a.Model] || a.Model).localeCompare(names[b.Model] || b.Model)
  );

  const cols = [['Average', 'Average'], ...columns[state.view].filter(([key]) => key !== 'Average')];
  document.getElementById('view-summary').textContent = state.view === 'tasks'
    ? `Five tasks · ${all.length} models. Average gives equal weight to recognition, parsing, grounding, extraction, and QA.`
    : `Ten document categories · ${all.length} models. Average gives equal weight to each document category.`;

  document.getElementById('score-columns').innerHTML =
    '<col class="rank-width"><col class="model-width"><col class="average-width">' +
    cols.slice(1).map(() => '<col>').join('');

  const scoreHeading = ([key, label], rowspan = 1) =>
    `<th scope="col" rowspan="${rowspan}" class="${key === 'Average' ? 'average-heading' : ''}" data-col-key="${escapeHtml(key)}" aria-sort="${state.sort === key ? (state.direction === 'desc' ? 'descending' : 'ascending') : 'none'}"><button type="button" data-sort="${escapeHtml(key)}" title="Sort by ${escapeHtml(key.replace(/^\d+-/, ''))}">${label}<span class="sort-icon ${state.sort === key ? 'is-active' : ''}" aria-hidden="true">${state.sort === key ? (state.direction === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>`;

  document.getElementById('score-head').innerHTML =
    `<tr class="score-group-row"><th scope="col" rowspan="2" class="rank-col" title="Rank by the selected score within the model group">#</th><th scope="col" rowspan="2" class="model-col">Model</th>${scoreHeading(cols[0], 2)}<th scope="colgroup" colspan="${cols.length - 1}" class="score-group-heading">${state.view === 'tasks' ? 'Document Processing Tasks' : 'Document Categories'}</th></tr><tr class="score-column-row">${cols.slice(1).map(col => scoreHeading(col)).join('')}</tr>`;

  const leaders = {};
  const ranges = {};
  for (const [key] of cols) {
    const vals = group.map(row => row[key]).filter(Number.isFinite);
    const uniqueSorted = [...new Set(vals)].sort((a, b) => b - a);
    leaders[key] = uniqueSorted.slice(0, 2);
    const min = vals.length ? Math.min(...vals) : 0;
    const max = vals.length ? Math.max(...vals) : 100;
    ranges[key] = { min, span: Math.max(max - min, 1) };
  }

  document.getElementById('score-body').innerHTML = visible.length
    ? visible.map(row => {
      const rank = 1 + group.filter(other => other[state.sort] > row[state.sort]).length;
      const device = modelType(row).includes('Device');
      const icon = modelIcon(row.Model);
      return `<tr class="${device ? 'model-device' : 'model-server'}"><td class="rank-col"><span class="rank-number ${rank <= 3 ? 'rank-leading' : ''}">${rank}</span></td><th scope="row" class="model-col"><span class="model-name" title="${escapeHtml(row.Model)}">${icon ? `<span class="model-icon-wrap" aria-hidden="true"><img class="model-icon" src="assets/model-icons/${icon}" width="18" height="18" alt=""></span>` : ''}<span class="model-label">${escapeHtml(names[row.Model] || row.Model)}</span>${device ? '<span class="device-badge" title="On-device open LMM">Device</span>' : ''}</span><span class="sr-only">, ${device ? 'On-device' : 'On-server'}</span></th>` +
        cols.map(([key]) => {
          const value = row[key];
          const top = Number.isFinite(value) && value === leaders[key][0];
          const second = Number.isFinite(value) && value === leaders[key][1];
          const formatted = Number.isFinite(value) ? value.toFixed(2) : '—';
          const heat = Number.isFinite(value)
            ? Math.max(0, Math.min(1, (value - ranges[key].min) / ranges[key].span)).toFixed(3)
            : '0';
          return `<td class="score-cell ${key === 'Average' ? 'average' : ''} ${top ? 'best' : second ? 'second-best' : ''}" style="--heat:${heat}"><span class="score-value">${formatted}</span>${top ? '<span class="sr-only">, best score</span>' : second ? '<span class="sr-only">, second-best score</span>' : ''}</td>`;
        }).join('') + '</tr>';
    }).join('')
    : `<tr><td class="empty" colspan="${cols.length + 2}">No models match “${escapeHtml(state.query)}”. Try another name or choose All models.</td></tr>`;

  const tableEl = document.getElementById('score-table');
  tableEl.classList.toggle('category-table', state.view === 'categories');
  tableEl.classList.toggle('has-heatmap', state.heatmap);

  document.getElementById('model-count').textContent =
    `${visible.length}${visible.length !== group.length ? ` of ${group.length}` : ''} models · Higher is better`;
  document.getElementById('score-updated').textContent = formatSnapshot(scoreData.snapshot);

  const coverageNote = document.getElementById('category-coverage-note');
  if (coverageNote) {
    const missing = scoreData.tasks.length - scoreData.categories.length;
    coverageNote.hidden = !(state.view === 'categories' && missing > 0);
    if (missing > 0) {
      coverageNote.textContent = `· ${scoreData.categories.length} of ${scoreData.tasks.length} models include category breakdowns`;
    }
  }

  document.getElementById('download-scores').href =
    state.view === 'tasks' ? 'assets/task-scores.csv' : 'assets/category-scores.csv';
  document.getElementById('score-panel').setAttribute(
    'aria-labelledby',
    state.view === 'tasks' ? 'task-tab' : 'category-tab'
  );

  if (resetScrollTop && scrollEl) scrollEl.scrollTop = 0;
  requestAnimationFrame(updateScrollShadows);
}

function setView(button, sortKey = 'Average') {
  state.view = button.dataset.view;
  state.sort = sortKey;
  state.direction = 'desc';
  if (scrollEl) scrollEl.scrollLeft = 0;
  document.querySelectorAll('[data-view]').forEach(tab => {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  renderScores();
}

document.querySelectorAll('[data-view]').forEach(button =>
  button.addEventListener('click', () => setView(button))
);

document.querySelectorAll('[data-filter]').forEach(button =>
  button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b =>
      b.setAttribute('aria-pressed', String(b === button))
    );
    renderScores();
  })
);

document.getElementById('toggle-heatmap').addEventListener('click', event => {
  state.heatmap = !state.heatmap;
  event.currentTarget.setAttribute('aria-pressed', String(state.heatmap));
  document.getElementById('score-table').classList.toggle('has-heatmap', state.heatmap);
});

document.getElementById('model-search').addEventListener('input', event => {
  state.query = event.target.value.toLowerCase().trim();
  renderScores();
});

document.getElementById('score-head').addEventListener('click', event => {
  const button = event.target.closest('[data-sort]');
  if (!button) return;
  state.direction = state.sort === button.dataset.sort && state.direction === 'desc' ? 'asc' : 'desc';
  state.sort = button.dataset.sort;
  renderScores({ resetScrollTop: true });
  [...document.querySelectorAll('[data-sort]')]
    .find(control => control.dataset.sort === state.sort)
    ?.focus({ preventScroll: true });
});

function jumpToCategory(categoryKey) {
  const categoryTab = document.getElementById('category-tab');
  if (!categoryTab || !scoreData) return;
  state.filter = 'all';
  document.querySelectorAll('[data-filter]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.filter === 'all'))
  );
  setView(categoryTab, categoryKey);
  document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  requestAnimationFrame(() => {
    const targetTh = document.querySelector(`[data-col-key="${CSS.escape(categoryKey)}"]`);
    if (targetTh && scrollEl) {
      const stickyOffset = 310;
      const desiredLeft = Math.max(0, targetTh.offsetLeft - stickyOffset - 24);
      scrollEl.scrollTo({ left: desiredLeft, behavior: 'smooth' });
    }
  });
}

window.CCOCR_NAV = { jumpToCategory };

document.querySelectorAll('[data-jump-category]').forEach(chip => {
  chip.addEventListener('click', () => jumpToCategory(chip.dataset.jumpCategory));
});

if (window.CCOCR_SCORES) {
  scoreData = window.CCOCR_SCORES;
  renderScores();
} else {
  document.getElementById('score-body').innerHTML =
    '<tr><td class="empty">Scores could not load. Use Download CSV to view the results.</td></tr>';
  document.getElementById('model-count').textContent = 'Score data unavailable';
}

// Accessible keyboard arrow navigation for all tablists
document.querySelectorAll('[role="tablist"]').forEach(list =>
  list.addEventListener('keydown', event => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next = current;
    const vertical = list.getAttribute('aria-orientation') === 'vertical';
    if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (current + 1) % tabs.length;
    else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  })
);

// Scroll-spy active state for sticky navigation
(() => {
  const navLinks = [...document.querySelectorAll('[data-nav-section]')];
  const sections = navLinks
    .map(link => document.getElementById(link.dataset.navSection))
    .filter(Boolean);
  if (!sections.length) return;

  function syncActiveNav() {
    const threshold = window.scrollY + 130;
    let currentId = sections[0].id;
    for (const section of sections) {
      if (section.offsetTop <= threshold) currentId = section.id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
      currentId = sections[sections.length - 1].id;
    }
    navLinks.forEach(link => {
      const active = link.dataset.navSection === currentId;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', syncActiveNav, { passive: true });
  window.addEventListener('resize', syncActiveNav, { passive: true });
  syncActiveNav();
})();

// Copy BibTeX button
document.getElementById('copy-citation').addEventListener('click', async () => {
  const button = document.getElementById('copy-citation');
  const text = document.getElementById('bibtex').textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
    document.getElementById('copy-status').textContent = 'BibTeX citation copied to clipboard';
    setTimeout(() => { button.textContent = 'Copy citation'; }, 2200);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('bibtex'));
    selection.removeAllRanges();
    selection.addRange(range);
    button.textContent = 'Select & copy';
    document.getElementById('copy-status').textContent = 'Citation selected. Press Command+C or Control+C to copy.';
  }
});
